import Baseheitzfit4CardEditor from "./base-editor";

const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

class heitzfit4bookingCardEditor extends Baseheitzfit4CardEditor {
    render() {
        if (!this.hass || !this._config) {
            return html``;
        }
        // return html`
        //     ${this.buildEntityPickerField('booking entity', 'entity', this._config.entity, 'booking')}
        //     ${this.buildSwitchField('Display header', 'display_header', this._config.display_header)}
        //     ${this.buildSwitchField('Current week only', 'current_week_only', this._config.current_week_only)}
        //     ${this.buildSwitchField('Reduce done booking', 'reduce_done_booking', this._config.reduce_done_booking)}
        //     ${this.buildSwitchField('Display done booking', 'display_done_booking', this._config.display_done_booking)}
        // `;
        return html`
            ${this.buildEntityPickerField('booking entity', 'entity', this._config.entity, 'booking')}
            ${this.buildSwitchField('Display header', 'display_header', this._config.display_header)}
            ${this.buildSwitchField('Current week only', 'current_week_only', this._config.current_week_only)}
            ${this.buildSwitchField('Reduce done booking', 'reduce_done_booking', this._config.reduce_done_booking)}
            ${this.buildSwitchField('Display done booking', 'display_done_booking', this._config.display_done_booking)}
        `;
    }
}

customElements.define("heitzfit4-booking-card-editor", heitzfit4bookingCardEditor);
