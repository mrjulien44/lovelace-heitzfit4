import {unsafeHTML} from 'https://unpkg.com/lit-html@2.8.0/directives/unsafe-html.js?module';

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

class heitzfit4bookingCard extends LitElement {

    lunchBreakRendered = false;

    static get properties() {
        return {
            config: {},
            hass: {}
        };
    }

    getCardHeader() {
        let child_sensor = this.config.entity.split('_booking')[0];
        let child_attributes = this.hass.states[child_sensor].attributes;
        let child_name = (typeof child_attributes['nickname'] === 'string' && child_attributes['nickname'] !== '') ? child_attributes['nickname'] : child_attributes['full_name'];
        return html`<div class="heitzfit4-card-header">Devoirs de ${child_name}</div>`;
    }

    getFormattedDate(date) {
        return (new Date(date))
            .toLocaleDateString('fr-FR', {weekday: 'long', day: '2-digit', month: '2-digit'})
            .replace(/^(.)/, (match) => match.toUpperCase())
        ;
    }

    getFormattedTime(time) {
        return new Intl.DateTimeFormat("fr-FR", {hour:"numeric", minute:"numeric"}).format(new Date(time));
    }

    getDayHeader(booking) {
        return html`<div class="heitzfit4-booking-header">
            <span>${this.getFormattedDate(booking.date)}</span>
        </div>`;
    }

    getbookingRow(booking, index) {
        let description = booking.description.trim().replace("\n", "<br />");
        let files = [];
        booking.files.forEach((file) => {
            if (file.name.trim() === '') {
                return;
            }
            files.push(html`<span class="booking-file">➤ <a href="${file.url}">${file.name}</a></span>`);
        });


        return html`
        <tr class="${booking.done ? 'booking-done':''}">
            <td class="booking-color"><span style="background-color:${booking.background_color}"></span></td>
            <td class="booking-detail">
                <label for="booking-${index}">
                    <span class="booking-subject">${booking.subject}</span>
                </label>
                <input type="checkbox" id="booking-${index}" />
                <span class="booking-description">${unsafeHTML(description)}</span>
                ${files.length > 0 ? html`<span class="booking-files">${files}</span>` : ''}
            </td>
            <td class="booking-status">
                <span>${booking.done ? html`<ha-icon icon="mdi:check"></ha-icon>` : html`<ha-icon icon="mdi:account-clock"></ha-icon>`}</span>
            </td>
        </tr>
        `;
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }

        const stateObj = this.hass.states[this.config.entity];
        const booking = this.hass.states[this.config.entity].attributes['booking'];

        if (stateObj) {
            const currentWeekNumber = new Date().getWeekNumber();
            const itemTemplates = [];
            let dayTemplates = [];

            if (booking && booking.length > 0) {
                let latestbookingDay = this.getFormattedDate(booking[0].date);
                for (let index = 0; index < booking.length; index++) {
                    let hw = booking[index];
                    let currentFormattedDate = this.getFormattedDate(hw.date);

                    if (hw.done === true && this.config.display_done_booking === false) {
                        continue;
                    }

                    if (latestbookingDay !== currentFormattedDate) {
                        if (dayTemplates.length > 0) {
                            itemTemplates.push(this.getDayHeader(booking[index-1]));
                            itemTemplates.push(html`<table class="${this.config.reduce_done_booking ? 'reduce-done' : ''}">${dayTemplates}</table>`);
                            dayTemplates = [];
                        }

                        latestbookingDay = currentFormattedDate;
                    }

                    if (this.config.current_week_only && new Date(hw.date).getWeekNumber() !== currentWeekNumber) {
                        break;
                    }

                    dayTemplates.push(this.getbookingRow(hw, index));
                }

                if (dayTemplates.length > 0 && (
                    !this.config.current_week_only
                    || (this.config.current_week_only && currentWeekNumber === new Date(booking[booking.length-1].date).getWeekNumber())
                )) {
                    itemTemplates.push(this.getDayHeader(booking[booking.length-1]));
                    itemTemplates.push(html`<table class="${this.config.reduce_done_booking ? 'reduce-done' : ''}">${dayTemplates}</table>`);
                }
            }

            if (itemTemplates.length === 0) {
                itemTemplates.push(html`<span class="no-booking">Pas de devoirs à faire</span>`);
            }

            return html`
                <ha-card id="${this.config.entity}-card">
                    ${this.config.display_header ? this.getCardHeader() : ''}
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
            current_week_only: true,
            reduce_done_booking: true,
            display_done_booking: true,
        }

        this.config = {
            ...defaultConfig,
            ...config
        };

        this.config.current_week_only = this.normalizeBoolean(this.config.current_week_only, true);
        this.config.reduce_done_booking = this.normalizeBoolean(this.config.reduce_done_booking, true);
        this.config.display_done_booking = this.normalizeBoolean(this.config.display_done_booking, true);
        this.config.display_header = this.normalizeBoolean(this.config.display_header, true);
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
        .no-booking {
            display:block;
            padding:8px;
            text-align: center;
            font-style: italic;
        }
        .heitzfit4-booking-header {
            border-bottom: 2px solid grey;
        }
        table{
            font-size: 0.9em;
            font-family: Roboto;
            width: 100%;
            outline: 0px solid #393c3d;
            border-collapse: collapse;
        }
        td {
            vertical-align: top;
            padding: 5px 10px 5px 10px;
            padding-top: 8px;
            text-align: left;
        }
        td.booking-color {
            width: 4px;
            padding-top: 11px;
        }
        td.booking-color > span {
            display:inline-block;
            width: 4px;
            height: 1rem;
            border-radius:4px;
            background-color: grey;
        }
        td.booking-detail {
            padding:0;
            padding-top: 8px;
            padding-bottom: 8px;
        }
        span.booking-subject {
            display:block;
            font-weight:bold;
        }
        span.booking-description {
            font-size: 0.9em;
        }
        span.booking-files {
            display: block;
        }
        span.booking-files .booking-file {
            display: inline-block;
        }
        td.booking-status {
            width: 5%;
        }
        .reduce-done .booking-done label:hover {
            cusor: pointer;
        }
        .reduce-done .booking-done .booking-description {
            display: none;
        }
        .reduce-done .booking-done input:checked + .booking-description {
            display: block;
        }
        .booking-detail input {
            display: none;
        }
        `;
    }

    static getStubConfig() {
        return {
            display_header: true,
            current_week_only: true,
            reduce_done_booking: true,
            display_done_booking: true,
        }
    }

    static getConfigElement() {
        return document.createElement("heitzfit4-booking-card-editor");
    }
}

customElements.define("heitzfit4-booking-card", heitzfit4bookingCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "heitzfit4-booking-card",
    name: "heitzfit4 booking Card",
    description: "Display the booking from heitzfit4",
    documentationURL: "https://github.com/delphiki/lovelace-heitzfit4?tab=readme-ov-file#booking",
});
