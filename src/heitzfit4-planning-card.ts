import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const CARD_VERSION = "1.3.0";

type Language = "fr" | "en";
type LanguageConfig = Language | "auto";

interface HassEntity {
  entity_id?: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language?: string };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>
  ): Promise<unknown>;
}

interface Activity {
  id: string | number;
  id_booking?: string | number;
  activity: string;
  start: string;
  end: string;
  placesMax: number;
  placesTaken: number;
  idActivity?: string | number;
  room: string;
  duration?: number;
  deleted?: boolean;
  booked: boolean;
}

type Planning = Record<string, Activity[]>;

interface CardConfig {
  type: string;
  entity: string;
  days?: number;
  only_booked?: boolean;
  show_actions?: boolean;
  hide_ongoing?: boolean;
  logo?: string;
  language?: LanguageConfig;
  title?: string;
}

const DEFAULT_CONFIG = {
  days: 7,
  only_booked: false,
  show_actions: true,
  hide_ongoing: false,
  language: "auto" as LanguageConfig,
};

const TRANSLATIONS = {
  fr: {
    unavailable: "Entité indisponible",
    invalidPlanning: "Le capteur ne contient pas de planning valide",
    empty: "Aucune activité à afficher",
    book: "Réserver",
    cancel: "Annuler",
    full: "Complet",
    booked: "Réservé",
    refreshing: "Actualisation du planning…",
    bookedSuccess: "Réservation effectuée",
    cancelSuccess: "Réservation annulée",
    actionError: "L’action a échoué",
    refreshTimeout:
      "L’action a réussi, mais l’actualisation du capteur n’a pas été détectée",
    entity: "Entité du planning",
    days: "Nombre de jours",
    title: "Titre facultatif",
    logo: "URL du logo facultative",
    language: "Langue",
    automatic: "Automatique",
    onlyBooked: "Afficher uniquement les activités réservées",
    hideOngoing: "Masquer les séances en cours",
    showActions: "Afficher les actions Réserver / Annuler",
  },
  en: {
    unavailable: "Entity unavailable",
    invalidPlanning: "The sensor does not contain a valid planning attribute",
    empty: "No activities to display",
    book: "Book",
    cancel: "Cancel",
    full: "Full",
    booked: "Booked",
    refreshing: "Refreshing planning…",
    bookedSuccess: "Booking completed",
    cancelSuccess: "Booking cancelled",
    actionError: "The action failed",
    refreshTimeout:
      "The action succeeded, but the sensor refresh was not detected",
    entity: "Planning entity",
    days: "Number of days",
    title: "Optional title",
    logo: "Optional logo URL",
    language: "Language",
    automatic: "Automatic",
    onlyBooked: "Show booked activities only",
    hideOngoing: "Hide ongoing sessions",
    showActions: "Show Book / Cancel actions",
  },
} as const;

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

@customElement("heitzfit4-planning-card")
export class Heitzfit4PlanningCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: CardConfig;
  @state() private pendingActivityId?: string;
  @state() private refreshing = false;
  @state() private errorMessage?: string;
  @state() private successMessage?: string;

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("heitzfit4-planning-card-editor");
  }

  public static getStubConfig(): CardConfig {
    return {
      type: "custom:heitzfit4-planning-card",
      entity: "sensor.heitzfit4_planning",
      days: 7,
      only_booked: false,
      show_actions: true,
      hide_ongoing: false,
      logo: "/local/images/logo_globalfit.png",
      language: "auto",
    };
  }

  public setConfig(config: CardConfig): void {
    if (!config?.entity) {
      throw new Error("The 'entity' property is required.");
    }

    if (
      config.days !== undefined &&
      (!Number.isInteger(config.days) || config.days < 1)
    ) {
      throw new Error("The 'days' property must be an integer greater than 0.");
    }

    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public getCardSize(): number {
    const activityCount = this.getVisibleDays().reduce(
      (count, [, activities]) => count + activities.length,
      0
    );
    return Math.max(2, Math.ceil(activityCount * 1.2));
  }

  private get uiLanguage(): Language {
    if (this.config?.language === "fr" || this.config?.language === "en") {
      return this.config.language;
    }

    const language =
      this.hass?.locale?.language ||
      this.hass?.language ||
      navigator.language ||
      "fr";

    return language.toLowerCase().startsWith("en") ? "en" : "fr";
  }

  private get labels() {
    return TRANSLATIONS[this.uiLanguage];
  }

  private getEntity(): HassEntity | undefined {
    if (!this.hass || !this.config) return undefined;
    return this.hass.states[this.config.entity];
  }

  private getPlanning(): Planning {
    const entity = this.getEntity();
    if (!entity) return {};

    const planningAttribute = entity.attributes.planning;
    if (
      planningAttribute &&
      typeof planningAttribute === "object" &&
      !Array.isArray(planningAttribute)
    ) {
      return planningAttribute as Planning;
    }

    try {
      const parsed = JSON.parse(entity.state) as
        | Planning
        | { planning?: Planning };
      if (
        !Array.isArray(parsed) &&
        "planning" in parsed &&
        parsed.planning
      ) {
        return parsed.planning as Planning;
      }
      return parsed as Planning;
    } catch {
      return {};
    }
  }

  private localDateKey(date = new Date()): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  private shouldHideActivity(dateKey: string, activity: Activity): boolean {
    if (dateKey !== this.localDateKey()) return false;

    const now = Date.now();
    const start = Date.parse(activity.start);
    const end = Date.parse(activity.end);

    if (!Number.isFinite(start) || !Number.isFinite(end)) return false;

    // A session that has ended is always hidden.
    if (end <= now) return true;

    // If enabled, an ongoing session is hidden once its start time is reached.
    return Boolean(this.config?.hide_ongoing && start <= now && now < end);
  }

  private getVisibleDays(): Array<[string, Activity[]]> {
    const days = this.config?.days ?? DEFAULT_CONFIG.days;
    const onlyBooked =
      this.config?.only_booked ?? DEFAULT_CONFIG.only_booked;

    return Object.entries(this.getPlanning())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(
        ([dateKey, activities]) =>
          [
            dateKey,
            (Array.isArray(activities) ? activities : [])
              .filter((activity) => !activity.deleted)
              .filter(
                (activity) => !this.shouldHideActivity(dateKey, activity)
              )
              .filter((activity) => !onlyBooked || activity.booked)
              .sort(
                (left, right) =>
                  Date.parse(left.start) - Date.parse(right.start)
              ),
          ] as [string, Activity[]]
      )
      .filter(([, activities]) => activities.length > 0)
      .slice(0, days);
  }

  private formatDay(dateKey: string): string {
    const date = new Date(`${dateKey}T12:00:00`);
    const locale = this.uiLanguage === "fr" ? "fr-FR" : "en-GB";

    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "short",
    })
      .format(date)
      .replace(".", "")
      .toLocaleUpperCase(locale);
  }

  private formatTime(value: string): string {
    const locale = this.uiLanguage === "fr" ? "fr-FR" : "en-GB";
    const parts = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(value));

    const hour = parts.find((part) => part.type === "hour")?.value ?? "--";
    const minute =
      parts.find((part) => part.type === "minute")?.value ?? "--";

    return this.uiLanguage === "fr"
      ? `${hour}h${minute}`
      : `${hour}:${minute}`;
  }

  private entityRevision(entity?: HassEntity): string {
    if (!entity) return "missing";

    // last_updated normally changes after update_entity. The state and planning
    // serialization are included as fallbacks for custom sensors.
    let planning = "";
    try {
      planning = JSON.stringify(entity.attributes.planning ?? null);
    } catch {
      planning = "unserializable";
    }

    return [entity.last_updated ?? "", entity.state, planning].join("|");
  }

  private async waitForEntityRefresh(
    entityId: string,
    previousRevision: string,
    timeoutMilliseconds = 30_000
  ): Promise<boolean> {
    const deadline = Date.now() + timeoutMilliseconds;

    while (Date.now() < deadline) {
      const currentEntity = this.hass?.states[entityId];
      if (this.entityRevision(currentEntity) !== previousRevision) {
        // Allow one render cycle after Home Assistant has supplied the new state.
        await this.updateComplete;
        return true;
      }
      await sleep(400);
    }

    return false;
  }

  private showToast(message: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        bubbles: true,
        composed: true,
        detail: { message },
      })
    );
  }

  private async runAction(
  activity: Activity
): Promise<void> {

  if (
    !this.hass ||
    !this.config ||
    this.pendingActivityId
  ) {
    return;
  }

  const activityId = String(activity.id);

  const wasBooked = activity.booked;

  const entityId = this.config.entity;

  const previousRevision =
    this.entityRevision(
      this.hass.states[entityId]
    );

  this.pendingActivityId = activityId;

  this.refreshing = true;

  this.errorMessage = undefined;
  this.successMessage = undefined;

  try {

    if (wasBooked) {

      if (
        activity.id_booking === undefined ||
        activity.id_booking === null ||
        activity.id_booking === ""
      ) {

        throw new Error(
          "Missing id_booking for cancellation"
        );

      }

      console.log(
        "Cancelling booking",
        activity.id_booking
      );

      await this.hass.callService(
        "heitzfit4",
        "delete_activity",
        {
          booking_id: String(
            activity.id_booking
          )
        }
      );

    } else {

      console.log(
        "Booking activity",
        activity.id
      );

      await this.hass.callService(
        "heitzfit4",
        "book_activity",
        {
          activity_id: activityId
        }
      );

    }

    await this.hass.callService(
      "homeassistant",
      "update_entity",
      {
        entity_id: entityId
      }
    );

    const refreshed =
      await this.waitForEntityRefresh(
        entityId,
        previousRevision
      );

    const successMessage =
      wasBooked
        ? this.labels.cancelSuccess
        : this.labels.bookedSuccess;

    if (refreshed) {

      this.successMessage =
        successMessage;

      this.showToast(
        successMessage
      );

      this.requestUpdate();

    } else {

      this.errorMessage =
        this.labels.refreshTimeout;

      this.showToast(
        this.labels.refreshTimeout
      );

    }

  } catch (error) {

    console.error(
      "HeitzFit4 Planning Card action failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message.includes(
        "Missing id_booking"
      )
    ) {

      this.errorMessage =
        "id_booking absent pour cette réservation";

    } else {

      this.errorMessage =
        this.labels.actionError;

    }

    this.showToast(
      this.errorMessage
    );

  } finally {

    this.pendingActivityId =
      undefined;

    this.refreshing = false;

  }
}

  private renderAction(activity: Activity): TemplateResult | typeof nothing {
    if (!this.config?.show_actions) return nothing;

    const full = activity.placesTaken >= activity.placesMax;
    const pending = this.pendingActivityId === String(activity.id);

    if (!activity.booked && full) {
      return html`<span class="status full-label">${this.labels.full}</span>`;
    }

    return html`
      <button
        class=${activity.booked ? "action cancel" : "action book"}
        ?disabled=${pending || this.refreshing}
        aria-label=${activity.booked ? this.labels.cancel : this.labels.book}
        title=${activity.booked ? this.labels.cancel : this.labels.book}
        @click=${() => this.runAction(activity)}
      >
        ${pending
          ? html`<span class="spinner" aria-hidden="true"></span>`
          : activity.booked
            ? "x"
            : "+"}
      </button>
    `;
  }

  private renderActivity(activity: Activity): TemplateResult {
    const full = activity.placesTaken >= activity.placesMax;

    return html`
      <article class="activity ${activity.booked ? "is-booked" : ""}">
        <div class="times">
          <time datetime=${activity.start}>${this.formatTime(activity.start)}</time>
          <time datetime=${activity.end}>${this.formatTime(activity.end)}</time>
        </div>

        <div class="separator" aria-hidden="true"></div>

        <div class="details">
          <div class="activity-line">
            <strong>${activity.activity?.trim() || "-"}</strong>
            ${this.renderAction(activity)}
          </div>
          <div class="meta">
            <span>${activity.room?.trim() || "-"}</span>
            <span class="capacity ${full ? "full" : ""}">
              (${activity.placesTaken}/${activity.placesMax})
            </span>
            ${activity.booked
              ? html`<span class="booked-label">${this.labels.booked}</span>`
              : nothing}
          </div>
        </div>
      </article>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) return html``;

    const entity = this.getEntity();
    const planning = this.getPlanning();
    const days = this.getVisibleDays();
    const planningIsEmpty = Object.keys(planning).length === 0;

    return html`
    <ha-card>
    ${this.config.logo || this.config.title
      ? html`
        <header class="card-header">
                ${this.config.logo ? html`<img
                      src=${this.config.logo}
                      alt=${this.config.title || "HeitzFit4"}
                    />` : nothing}
                ${this.config.title ? html`<h2>${this.config.title}</h2>` : l}
        </header>
            ` : nothing}
      ${this.refreshing
        ? html`
            <ha-linear-progress
              indeterminate
            ></ha-linear-progress>
          `
        : nothing}
      <div class="content">

        ${!entity
          ? html`
              <ha-alert alert-type="error">
                ${this.labels.unavailable}
                :
                ${this.config.entity}
              </ha-alert>
            `
          : nothing}

        ${days.map(
          ([dateKey, activities]) => html`
            <section>

              <h3>
                📅 ${this.formatDay(dateKey)}
              </h3>

              ${activities.map(
                (activity) =>
                  this.renderActivity(
                    activity
                  )
              )}
            </section>
          `
        )}
      </div>
    </ha-card>
  `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }

    ha-linear-progress {
      display: block;
      width: 100%;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 4px;
    }

    .card-header img {
      display: block;
      max-width: 150px;
      max-height: 46px;
      object-fit: contain;
    }

    .card-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .content {
      padding: 12px 16px 16px;
    }

    section + section {
      margin-top: 22px;
    }

    h3 {
      margin: 0 0 10px;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.045em;
    }

    .activity {

      display: grid;

      grid-template-columns:
        56px
        3px
        minmax(0, 1fr);

      gap: 10px;

      min-height: 44px;

      padding: 3px 0;

      align-items: start;
    }

    .times {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 2px;
      padding-top: 1px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-size: 13px;
      line-height: 1;
    }

    .separator {
      width: 3px;
      min-height: 36px;
      align-self: stretch;
      border-radius: 999px;
      background: var(
        --divider-color,
        #9e9e9e
      );
    }

    .activity.is-booked .separator {
      background: var(--success-color, #2eaf65);
    }

    .details {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .activity-line {
      min-height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .activity-line strong {
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.02em;
    }

    .meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;

      color: var(--secondary-text-color);

      font-size: 12px;
      line-height: 1.1;
    }

    .capacity.full,
    .full-label {
      color: var(--error-color, #db4437);
      font-weight: 800;
    }

    .booked-label {
      color: var(--success-color, #2eaf65);
      font-weight: 700;
    }

    .action {
      min-width: 22px;
      width: 22px;
      min-height: 22px;
      height: 22px;
      padding: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      line-height: 1;
    }

    .action.book {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 20px;
      line-height: 1;
    }

    .action.cancel {
      background:
        color-mix(
          in srgb,
          var(--error-color, #db4437) 14%,
          transparent
        );
      color:
        var(--error-color, #db4437);
      font-size: 18px;
      font-weight: 900;
    }

    .action:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    .status {
      align-self: center;
      font-size: 12px;
    }

    .logo {
      max-width: 120px;
      max-height: 50px;
      object-fit: contain;
    }

    .header-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 12px;
    }

    .planning-title {
      font-size: 28px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 1px;
    }

    .planning-subtitle {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .spinner {
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .refreshing-text,
    .empty {
      margin: 12px 0;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    ha-alert {
      display: block;
      margin-bottom: 12px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 370px) {
      .content {
        padding-inline: 12px;
      }

      .activity {
        grid-template-columns: 52px 3px minmax(0, 1fr);
        gap: 9px;
      }

      .times {
        font-size: 12px;
        line-height: 1.1;
      }
    }
  `;
}

@customElement("heitzfit4-planning-card-editor")
export class Heitzfit4PlanningCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: CardConfig =
    Heitzfit4PlanningCard.getStubConfig();

  public setConfig(config: CardConfig): void {
    this.config = {
      ...Heitzfit4PlanningCard.getStubConfig(),
      ...config,
    };
  }

  private get editorLanguage(): Language {
    if (this.config.language === "fr" || this.config.language === "en") {
      return this.config.language;
    }

    const language =
      this.hass?.locale?.language ||
      this.hass?.language ||
      navigator.language ||
      "fr";

    return language.toLowerCase().startsWith("en") ? "en" : "fr";
  }

  private get labels() {
    return TRANSLATIONS[this.editorLanguage];
  }

  private updateConfig(key: keyof CardConfig, value: unknown): void {
    this.config = { ...this.config, [key]: value };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private renderSwitch(
    key: "only_booked" | "hide_ongoing" | "show_actions",
    label: string
  ): TemplateResult {
    return html`
      <div class="switch-row">
        <span>${label}</span>
        <ha-switch
          .checked=${Boolean(this.config[key])}
          @change=${(event: Event) =>
            this.updateConfig(
              key,
              (event.target as HTMLInputElement).checked
            )}
        ></ha-switch>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity}
          .includeDomains=${["sensor"]}
          label=${this.labels.entity}
          allow-custom-entity
          @value-changed=${(event: CustomEvent<{ value: string }>) =>
            this.updateConfig("entity", event.detail.value)}
        ></ha-entity-picker>

        <ha-textfield
          label=${this.labels.days}
          type="number"
          min="1"
          step="1"
          .value=${String(this.config.days ?? 7)}
          @change=${(event: Event) =>
            this.updateConfig(
              "days",
              Math.max(1, Number(this.inputValue(event)) || 7)
            )}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.title}
          .value=${this.config.title ?? ""}
          @change=${(event: Event) =>
            this.updateConfig("title", this.inputValue(event))}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.logo}
          .value=${this.config.logo ?? ""}
          @change=${(event: Event) =>
            this.updateConfig("logo", this.inputValue(event))}
        ></ha-textfield>

        <ha-select
          label=${this.labels.language}
          .value=${this.config.language ?? "auto"}
          @selected=${(event: CustomEvent<{ value: LanguageConfig }>) =>
            this.updateConfig("language", event.detail.value)}
          @closed=${(event: Event) => event.stopPropagation()}
        >
          <mwc-list-item value="auto">${this.labels.automatic}</mwc-list-item>
          <mwc-list-item value="fr">Français</mwc-list-item>
          <mwc-list-item value="en">English</mwc-list-item>
        </ha-select>

        ${this.renderSwitch("only_booked", this.labels.onlyBooked)}
        ${this.renderSwitch("hide_ongoing", this.labels.hideOngoing)}
        ${this.renderSwitch("show_actions", this.labels.showActions)}
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: grid;
      gap: 16px;
      padding: 8px 0;
    }

    ha-entity-picker,
    ha-textfield,
    ha-select {
      display: block;
      width: 100%;
    }

    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .switch-row span {
      color: var(--primary-text-color);
    }
  `;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "heitzfit4-planning-card",
  name: "HeitzFit4 Planning Card",
  description: "HeitzFit4 planning with booking and cancellation actions.",
  preview: true,
});

console.info(
  `%c HEITZFIT4-PLANNING-CARD %c v${CARD_VERSION} `,
  "color:white;background:#2eaf65;font-weight:bold",
  "color:#2eaf65;background:white"
);
