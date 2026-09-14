const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

Date.prototype.getWeekNumber = function () {
    var d = new Date(+this);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
};

class heitzfit4PlanningCard extends LitElement {

    // lunchBreakRendered = false;

    static get properties() {
        return {
            config: {},
            hass: {}
        };
    }

    getCardHeader() {
        return html`<div class="heitzfit4-card-header">Panning Global</div>`;
    }

    getBreakRow(label) {
        return html`
        <tr class="lunch-break">
            <td></td>
            <td><span></span></td>
            <td colspan="2">
                <span class="activity-name">${label}</span>
            </td>
        </tr>`;
    }

    handleAction(activity) {
        if (!this.normalizeBoolean(this.config.show_actions, true)) {
            return;
        }

        const data = {
            activity_id: String(activity.id)
        };

        try {
            if (this.hass.callService) {
                this.hass.callService('heitzfit4', activity.booked ? 'delete_activity' : 'book_activity', data);
            }
        } catch (e) {
            try {
                if (this.hass.callService) {
                    this.hass.callService('script', activity.booked ? 'heitzfit_annuler_action' : 'heitzfit_reserver_action', data);
                }
            } catch (e2) {
                console.warn('Unable to call heitzfit action service', e2);
            }
        }
    }

    getActionLink(activity) {
        if (!this.normalizeBoolean(this.config.show_actions, true)) {
            return html``;
        }

        const canBook = activity.placesTaken !== undefined && activity.placesMax !== undefined &&
            Number(activity.placesTaken) < Number(activity.placesMax);

        if (activity.booked) {
            return html`
                <button class="heitzfit4-action-button heitzfit4-action-button-booked" @click=${() => this.handleAction(activity)} title="Annuler la réservation">
                    <ha-icon icon="mdi:minus-circle"></ha-icon>
                </button>
            `;
        }

        if (canBook) {
            return html`
                <button class="heitzfit4-action-button heitzfit4-action-button-bookable" @click=${() => this.handleAction(activity)} title="Réserver">
                    <ha-icon icon="mdi:plus-circle"></ha-icon>
                </button>
            `;
        }

        return html`
            <button class="heitzfit4-action-button heitzfit4-action-button-full" disabled title="Plus de places">
                <ha-icon icon="mdi:calendar-lock"></ha-icon>
            </button>
        `;
    }

    normalizeActivity(activity) {
        if (!activity || typeof activity !== 'object') {
            return activity;
        }

        const normalized = { ...activity };

        normalized.activity = normalized.activity || normalized.name || normalized.title || normalized.session || normalized.lesson || '';
        normalized.room = normalized.room || normalized.classroom || normalized.location || normalized.salle || '';
        normalized.start = normalized.start || normalized.start_time || normalized.begin || normalized.begin_time || '';
        normalized.end = normalized.end || normalized.end_time || normalized.finish || normalized.finish_time || '';

        if (typeof normalized.booked === 'undefined' && typeof normalized.reserved === 'boolean') {
            normalized.booked = normalized.reserved;
        }
        if (typeof normalized.booked === 'undefined' && typeof normalized.isBooked === 'boolean') {
            normalized.booked = normalized.isBooked;
        }

        return normalized;
    }

    getPlanningRow(activity) {
        const normalizedActivity = this.normalizeActivity(activity);
        let currentDate = new Date();
        let startAt = normalizedActivity.start ? Date.parse(normalizedActivity.start) : null;
        let endAt = normalizedActivity.end ? Date.parse(normalizedActivity.end) : null;

        const displayStart = startAt; //this.getFormattedTime(normalizedActivity.start);
        const displayEnd = this.getFormattedTime(normalizedActivity.end);
        const displayRoom = normalizedActivity.room || '';
        const displayName = normalizedActivity.activity || '';

        let prefix = html``;

        let content = html`
        <tr class="${normalizedActivity.canceled ? 'activity-canceled':''} ${this.config.dim_ended_activitys && endAt && endAt < currentDate ? 'activity-ended' : ''} ${normalizedActivity.booked ? 'activity-booked' : ''}">
            <td>
                ${displayStart}<br />
                ${displayEnd}
            </td>
            <td><span style="background-color:${normalizedActivity.booked ? '#43B061' : '#7d7d7d'}"></span></td>
            <td>
                <span class="activity-name">${displayName}</span>
                ${this.normalizeBoolean(this.config.display_classroom, true) ? html`<span class="activity-classroom">
                    ${displayRoom ? 'Salle '+displayRoom : ''}
                    ${displayRoom ? ', ' : ''}
                </span>` : '' }
            </td>
            <td>
                ${normalizedActivity.status ? html`<span class="activity-status">${normalizedActivity.status}</span>`:''}
                ${normalizedActivity.booked ? html`<span class="activity-status">Réservé</span>`:''}
            </td>
            ${this.normalizeBoolean(this.config.show_actions, true) ? html`<td class="activity-actions">${this.getActionLink(normalizedActivity)}</td>` : ''}
        </tr>
        `
        return html`${prefix}${content}`;
    }

    getFormattedDate(activity) {
        const source = activity && (activity.start || activity.begin || activity.start_time || activity.begin_time || '');
        if (!source) {
            return '';
        }

        const parsed = new Date(source);
        if (Number.isNaN(parsed.getTime())) {
            return '';
        }

        return parsed
            .toLocaleDateString('fr-FR', {weekday: 'long', day: '2-digit', month: '2-digit'})
            .replace(/^(.)/, (match) => match.toUpperCase())
        ;
    }

    getFormattedTime(time) {
        if (!time) {
            return '';
        }

        const raw = String(time).trim();
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(raw)) {
            return raw;
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) {
            return '';
        }

        return new Intl.DateTimeFormat("fr-FR", {hour:"numeric", minute:"numeric"}).format(parsed);
    }

    flattenPlanningObject(source) {
        const flat = [];

        if (!source || typeof source !== 'object') {
            return flat;
        }

        Object.keys(source).forEach((key) => {
            const value = source[key];
            if (Array.isArray(value)) {
                flat.push(...value);
            } else if (value && typeof value === 'object') {
                if (Array.isArray(value.activities)) {
                    flat.push(...value.activities);
                } else if (Array.isArray(value.Planning)) {
                    flat.push(...value.Planning);
                } else if (Array.isArray(value.planning)) {
                    flat.push(...value.planning);
                } else {
                    flat.push(...this.flattenPlanningObject(value));
                }
            }
        });

        return flat;
    }

    normalizePlanningPayload(payload) {
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                return [];
            }
        }

        let activitys = [];

        if (Array.isArray(payload)) {
            activitys = payload;
        } else if (payload && typeof payload === 'object') {
            if (Array.isArray(payload.Planning)) {
                activitys = payload.Planning;
            } else if (Array.isArray(payload.planning)) {
                activitys = payload.planning;
            } else if (Array.isArray(payload.activities)) {
                activitys = payload.activities;
            } else if (Array.isArray(payload.data)) {
                activitys = payload.data;
            } else if (payload.planning && typeof payload.planning === 'object') {
                activitys = this.flattenPlanningObject(payload.planning);
            } else if (payload.Planning && typeof payload.Planning === 'object') {
                activitys = this.flattenPlanningObject(payload.Planning);
            } else {
                const objectKeys = Object.keys(payload);
                const hasDateArrayShape = objectKeys.some((key) => Array.isArray(payload[key]));
                if (hasDateArrayShape) {
                    activitys = this.flattenPlanningObject(payload);
                } else {
                    const flat = [];
                    const recurse = (node) => {
                        if (Array.isArray(node)) {
                            flat.push(...node);
                            return;
                        }
                        if (!node || typeof node !== 'object') {
                            return;
                        }
                        for (const key of Object.keys(node)) {
                            const value = node[key];
                            if (Array.isArray(value)) {
                                flat.push(...value);
                            } else if (value && typeof value === 'object') {
                                recurse(value);
                            }
                        }
                    };
                    recurse(payload);
                    activitys = flat;
                }
            }
        }

        return activitys.map((activity) => this.normalizeActivity(activity));
    }

    getDayHeader(firstactivity, dayStartAt, dayEndAt, daysCount) {
        return html`<div class="pronote-timetable-day-wrapper ${daysCount === 0 ? 'active' : ''}">
            <div class="pronote-timetable-header">
                <span class="pronote-timetable-header-date">${this.getFormattedDate(firstactivity)}</span>
                ${this.config.display_day_hours && dayStartAt && dayEndAt ? html`<span class="pronote-timetable-header-hours">
                    ${this.getFormattedTime(dayStartAt)} - ${this.getFormattedTime(dayEndAt)}
                </span>` : '' }
            </div>
        </div>`;
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }

        const stateObj = this.hass.states[this.config.entity];
        if (!stateObj || !stateObj.attributes) {
            return html``;
        }

        const planningAttr = this.normalizePlanningPayload(
            stateObj.attributes['Planning'] ||
            stateObj.attributes['planning'] ||
            stateObj.attributes['activities'] ||
            stateObj.attributes['data'] ||
            stateObj.state || []
        );

        if (!Array.isArray(planningAttr) || planningAttr.length === 0) {
            return html``;
        }

        const activitys = planningAttr;
        const visibleDays = this.config.days || this.config.max_days || 7;
        const onlyBookedToken = typeof this.config.only_booked === 'string'
            && this.config.only_booked.trim().toLowerCase() === 'booked';
        const onlyBooked = onlyBookedToken || this.normalizeBoolean(this.config.only_booked, false);
        const showActions = this.normalizeBoolean(this.config.show_actions, true);

        if (stateObj) {
            const currentWeekNumber = new Date().getWeekNumber();

            const itemTemplates = [];
            let dayTemplates = [];
            let daysCount = 0;

            let dayStartAt = null;
            let dayEndAt = null;

            for (let index = 0; index < activitys.length; index++) {
                let activity = activitys[index];

                if (onlyBooked && !activity.booked) {
                    continue;
                }

                let currentFormattedDate = this.getFormattedDate(activity);

                if (dayStartAt === null) {
                    dayStartAt = activity.start;
                }
                dayEndAt = activity.end;

                if (activity.canceled && index < activitys.length - 1) {
                    let nextactivity = activitys[index + 1];
                    if (activity.start === nextactivity.start && !nextactivity.canceled) {
                        continue;
                    }
                }

                if (this.config.current_week_only) {
                    if (new Date(activity.start).getWeekNumber() > currentWeekNumber) {
                        break;
                    }
                }

                dayTemplates.push(this.getPlanningRow(activity));

                // checking if next activity is on another day
                if (index + 1 >= activitys.length || ((index + 1) < activitys.length && currentFormattedDate !== this.getFormattedDate(activitys[index+1]))) {
                    itemTemplates.push(html`
                        <div class="${this.config.enable_slider ? 'slider-enabled' : ''} heitzfit4-Planning-day-wrapper ${daysCount === 0 ? 'active' : ''}">
                            ${this.getDayHeader(activity, dayStartAt, dayEndAt, daysCount)}
                            <table>${dayTemplates}</table>
                        </div>
                    `);
                    dayTemplates = [];

                    this.lunchBreakRendered = false;
                    dayStartAt = null;
                    dayEndAt = null;

                    daysCount++;
                    if (visibleDays && visibleDays <= daysCount) {
                        break;
                    }
                } else if (this.config.display_free_time_slots && index + 1 < activitys.length) {
                    const currentEndAt = new Date(activity.end);
                    const nextactivity = activitys[index+1];
                    const nextactivityStartAt = new Date(nextactivity.start);
                    if (activity.is_morning === nextactivity.is_morning && Math.floor((nextactivityStartAt-currentEndAt) / 1000 / 60) > 30) {
                        const now = new Date();
                        dayTemplates.push(this.getBreakRow('Pas de cours', this.config.dim_ended_activitys && nextactivityStartAt < now));
                    }
                }
            }

            if (dayTemplates.length > 0) {
                itemTemplates.push(html`<table>${dayTemplates}</table>`);
            }

            return html`
                <ha-card id="${this.config.entity}-card" class="${this.config.enable_slider ? 'heitzfit4-Planning-card-slider' : ''}">
                    ${this.normalizeBoolean(this.config.display_header, true) ? this.getCardHeader() : ''}
                    ${itemTemplates}
                </ha-card>`
            ;
        }
    }

    normalizeBoolean(value, fallback) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (['true', '1', 'on', 'yes'].includes(normalized)) {
                return true;
            }
            if (['false', '0', 'off', 'no'].includes(normalized)) {
                return false;
            }
        }
        return fallback;
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }

        const defaultConfig = {
            entity: null,
            display_header: true,
            display_classroom: true,
            display_teacher: false,
            days: 7,
            max_days: null,
            only_booked: false,
            show_actions: true,
        }

        this.config = {
            ...defaultConfig,
            ...config
        };

        this.config.display_classroom = this.normalizeBoolean(this.config.display_classroom, true);
        this.config.display_teacher = this.normalizeBoolean(this.config.display_teacher, false);
        this.config.only_booked = this.normalizeBoolean(this.config.only_booked, false);
        this.config.show_actions = this.normalizeBoolean(this.config.show_actions, true);
    }

    static get styles() {
        return css`
        .heitzfit4-card-header {
            text-align:center;
        }
        div {
            padding: 12px;
            font-weight:bold;
            font-size:1em;
        }
        span.heitzfit4-Planning-header-hours {
            float:right;
        }
        table{
            clear:both;
            font-size: 0.9em;
            font-family: Roboto;
            width: 100%;
            outline: 0px solid #393c3d;
            border-collapse: collapse;
        }
        tr:nth-child(odd) {
            background-color: rgba(0,0,0,0.1);
        }
        td {
            vertical-align: middle;
            padding: 5px 10px 5px 10px;
            text-align: left;
        }
        tr td:first-child {
            width: 13%;
            text-align:right;
        }
        span.activity-name {
            font-weight:bold;
            display:block;
        }
        tr td:nth-child(2) {
            width: 4px;
            padding: 5px 0;
        }
        tr td:nth-child(2) > span {
            display:inline-block;
            width: 4px;
            height: 3rem;
            border-radius:4px;
            background-color: grey;
            margin-top:4px;
        }
        span.activity-status {
            color: white;
            background-color: rgb(75, 197, 253);
            padding: 4px;
            border-radius: 4px;
        }
        tr.activity-booked td {
            border-left: 3px solid var(--paper-item-icon-color, #7ed321);
        }
        .heitzfit4-action-button {
            background: transparent;
            border: 0;
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 4px;
            color: var(--primary-text-color, #fff);
        }
        .heitzfit4-action-button-booked {
            color: var(--success-color, #7ed321);
        }
        .heitzfit4-action-button-bookable {
            color: var(--state-icon-active-color, #4caf50);
        }
        .heitzfit4-action-button-full {
            color: var(--disabled-text-color, #777);
            cursor: not-allowed;
        }
        // .activity-canceled span.activity-name {
        //     text-decoration: line-through;
        // }
        // .activity-canceled span.activity-status {
        //     background-color: rgb(250, 50, 75);
        // }
        .activity-ended {
            opacity: 0.3;
        }
        div:not(.slider-enabled).heitzfit4-Planning-day-wrapper + div:not(.slider-enabled).heitzfit4-Planning-day-wrapper {
            border-top: 1px solid white;
        }
        `;
    }

    static getStubConfig() {
        return {
            display_header: true,
            max_days: null,
            current_week_only: false,
        }
    }

    static getConfigElement() {
        return document.createElement("heitzfit4-planning-card-editor");
    }
}

customElements.define("heitzfit4-planning-card", heitzfit4PlanningCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "heitzfit4-planning-card",
    name: "heitzfit4 Planning Card",
    description: "Display the Planning from heitzfit4",
    documentationURL: "https://github.com/mrjulien44/lovelace-heitzfit4?tab=readme-ov-file#Planning",
});