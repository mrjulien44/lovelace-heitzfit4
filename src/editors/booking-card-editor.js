import Baseheitzfit4CardEditor from "./base-editor";

const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

class heitzfit4reservationCardEditor extends Baseheitzfit4CardEditor {
    render() {
        if (!this.hass || !this._config) {
            return html``;
        }
        // return html`
        //     ${this.buildEntityPickerField('reservation entity', 'entity', this._config.entity, 'reservation')}
        //     ${this.buildSwitchField('Display header', 'display_header', this._config.display_header)}
        //     ${this.buildSwitchField('Current week only', 'current_week_only', this._config.current_week_only)}
        //     ${this.buildSwitchField('Reduce done reservation', 'reduce_done_reservation', this._config.reduce_done_reservation)}
        //     ${this.buildSwitchField('Display done reservation', 'display_done_reservation', this._config.display_done_reservation)}
        // `;
        return html`
            ${this.buildEntityPickerField('reservation entity', 'entity', this._config.entity, 'reservation')}
            ${this.buildSwitchField('Display header', 'display_header', this._config.display_header)}
            ${this.buildSwitchField('Current week only', 'current_week_only', this._config.current_week_only)}
            ${this.buildSwitchField('Reduce done reservation', 'reduce_done_reservation', this._config.reduce_done_reservation)}
            ${this.buildSwitchField('Display done reservation', 'display_done_reservation', this._config.display_done_reservation)}
        `;
    }
}

customElements.define("heitzfit4-reservation-card-editor", heitzfit4reservationCardEditor);
