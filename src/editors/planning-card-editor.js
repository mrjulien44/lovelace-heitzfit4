import Baseheitzfit4CardEditor from "./base-editor";

const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

class heitzfit4PlanningCardEditor extends Baseheitzfit4CardEditor {
    render() {
        if (!this.hass || !this._config) {
            return html``;
        }
        return html`
            ${this.buildEntityPickerField('Planning entity', 'entity', this._config.entity, 'Planning')}
            ${this.buildNumberField('Days', 'days', this._config.days, 7, 1)}
            ${this.buildSwitchField('Only booked', 'only_booked', this._config.only_booked, false)}
            ${this.buildSwitchField('Show actions', 'show_actions', this._config.show_actions, true)}
        `;
//        return html`
        //     ${this.buildEntityPickerField('Planning entity', 'entity', this._config.entity, 'Planning')}
        //     ${this.buildNumberField('Days', 'days', this._config.days, 7, 1)}
        //     ${this.buildSwitchField('Only booked', 'only_booked', this._config.only_booked, false)}
        //     ${this.buildSwitchField('Show actions', 'show_actions', this._config.show_actions, true)}
        //     ${this.buildNumberField('Max days', 'max_days', this._config.max_days, null, 1)}
        // `;
    }
}

customElements.define("heitzfit4-planning-card-editor", heitzfit4PlanningCardEditor);
