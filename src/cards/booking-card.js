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

class heitzfit4reservationCard extends LitElement {

    lunchBreakRendered = false;

    static get properties() {
        return {
            config: {},
            hass: {}
        };
    }

    getCardHeader() {
        let child_sensor = this.config.entity.split('_reservation')[0];
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

    getDayHeader(reservation) {
        return html`<div class="heitzfit4-reservation-header">
            <span>${this.getFormattedDate(reservation.date)}</span>
        </div>`;
    }

    getreservationRow(reservation, index) {
        let description = reservation.description.trim().replace("\n", "<br />");
        let files = [];
        reservation.files.forEach((file) => {
            if (file.name.trim() === '') {
                return;
            }
            files.push(html`<span class="reservation-file">➤ <a href="${file.url}">${file.name}</a></span>`);
        });


        return html`
        <tr class="${reservation.done ? 'reservation-done':''}">
            <td class="reservation-color"><span style="background-color:${reservation.background_color}"></span></td>
            <td class="reservation-detail">
                <label for="reservation-${index}">
                    <span class="reservation-subject">${reservation.subject}</span>
                </label>
                <input type="checkbox" id="reservation-${index}" />
                <span class="reservation-description">${unsafeHTML(description)}</span>
                ${files.length > 0 ? html`<span class="reservation-files">${files}</span>` : ''}
            </td>
            <td class="reservation-status">
                <span>${reservation.done ? html`<ha-icon icon="mdi:check"></ha-icon>` : html`<ha-icon icon="mdi:account-clock"></ha-icon>`}</span>
            </td>
        </tr>
        `;
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }

        const stateObj = this.hass.states[this.config.entity];
        const reservation = this.hass.states[this.config.entity].attributes['reservation'];

        if (stateObj) {
            const currentWeekNumber = new Date().getWeekNumber();
            const itemTemplates = [];
            let dayTemplates = [];

            if (reservation && reservation.length > 0) {
                let latestreservationDay = this.getFormattedDate(reservation[0].date);
                for (let index = 0; index < reservation.length; index++) {
                    let hw = reservation[index];
                    let currentFormattedDate = this.getFormattedDate(hw.date);

                    if (hw.done === true && this.config.display_done_reservation === false) {
                        continue;
                    }

                    if (latestreservationDay !== currentFormattedDate) {
                        if (dayTemplates.length > 0) {
                            itemTemplates.push(this.getDayHeader(reservation[index-1]));
                            itemTemplates.push(html`<table class="${this.config.reduce_done_reservation ? 'reduce-done' : ''}">${dayTemplates}</table>`);
                            dayTemplates = [];
                        }

                        latestreservationDay = currentFormattedDate;
                    }

                    if (this.config.current_week_only && new Date(hw.date).getWeekNumber() !== currentWeekNumber) {
                        break;
                    }

                    dayTemplates.push(this.getreservationRow(hw, index));
                }

                if (dayTemplates.length > 0 && (
                    !this.config.current_week_only
                    || (this.config.current_week_only && currentWeekNumber === new Date(reservation[reservation.length-1].date).getWeekNumber())
                )) {
                    itemTemplates.push(this.getDayHeader(reservation[reservation.length-1]));
                    itemTemplates.push(html`<table class="${this.config.reduce_done_reservation ? 'reduce-done' : ''}">${dayTemplates}</table>`);
                }
            }

            if (itemTemplates.length === 0) {
                itemTemplates.push(html`<span class="no-reservation">Pas de devoirs à faire</span>`);
            }

            return html`
                <ha-card id="${this.config.entity}-card">
                    ${this.config.display_header ? this.getCardHeader() : ''}
                    ${itemTemplates}
                </ha-card>`
            ;
        }
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }

        const defaultConfig = {
            entity: null,
            display_header: true,
            current_week_only: true,
            reduce_done_reservation: true,
            display_done_reservation: true,
        }

        this.config = {
            ...defaultConfig,
            ...config
        };
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
        .no-reservation {
            display:block;
            padding:8px;
            text-align: center;
            font-style: italic;
        }
        .heitzfit4-reservation-header {
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
        td.reservation-color {
            width: 4px;
            padding-top: 11px;
        }
        td.reservation-color > span {
            display:inline-block;
            width: 4px;
            height: 1rem;
            border-radius:4px;
            background-color: grey;
        }
        td.reservation-detail {
            padding:0;
            padding-top: 8px;
            padding-bottom: 8px;
        }
        span.reservation-subject {
            display:block;
            font-weight:bold;
        }
        span.reservation-description {
            font-size: 0.9em;
        }
        span.reservation-files {
            display: block;
        }
        span.reservation-files .reservation-file {
            display: inline-block;
        }
        td.reservation-status {
            width: 5%;
        }
        .reduce-done .reservation-done label:hover {
            cusor: pointer;
        }
        .reduce-done .reservation-done .reservation-description {
            display: none;
        }
        .reduce-done .reservation-done input:checked + .reservation-description {
            display: block;
        }
        .reservation-detail input {
            display: none;
        }
        `;
    }

    static getStubConfig() {
        return {
            display_header: true,
            current_week_only: true,
            reduce_done_reservation: true,
            display_done_reservation: true,
        }
    }

    static getConfigElement() {
        return document.createElement("heitzfit4-reservation-card-editor");
    }
}

customElements.define("heitzfit4-reservation-card", heitzfit4reservationCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "heitzfit4-reservation-card",
    name: "heitzfit4 reservation Card",
    description: "Display the reservation from heitzfit4",
    documentationURL: "https://github.com/delphiki/lovelace-heitzfit4?tab=readme-ov-file#reservation",
});
