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
        // return html`
        //     ${this.buildEntityPickerField('Planning entity', 'entity', this._config.entity, 'Planning_(period|today|tomorrow|next_day)')}
        //     ${this.buildSwitchField('Display header', 'display_header', this._config.display_header, true)}
        //     ${this.buildSwitchField('Current week only', 'current_week_only', this._config.current_week_only, false)}
        //     ${this.buildNumberField('Max days', 'max_days', this._config.max_days, null, 1)}
        //     ${this.buildSwitchField('Display classroom', 'display_classroom', this._config.display_classroom, true)}
        //     ${this.buildSwitchField('Display day housrs', 'display_day_hours', this._config.display_day_hours, true)}
        //     ${this.buildSwitchField('Display lunch break', 'display_lunch_break', this._config.display_lunch_break, true)}
        //     ${this.buildSwitchField('Dim ended lessons', 'dim_ended_lessons', this._config.dim_ended_lessons, true)}
        //     ${this.buildSwitchField('Enable slider', 'enable_slider', this._config.enable_slider, false)}
        //     ${this.buildSwitchField('Display free time slots', 'display_free_time_slots', this._config.display_free_time_slots, true)}
        // `;
        return html`
            ${this.buildEntityPickerField('Planning entity', 'entity', this._config.entity, 'Planning')}
            ${this.buildNumberField('Max days', 'max_days', this._config.max_days, null, 1)}
        `;
    }
}

customElements.define("heitzfit4-Planning-card-editor", heitzfit4PlanningCardEditor);
