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
        // let child_sensor = this.config.entity.split('_Planning')[0];
        // let child_attributes = this.hass.states[child_sensor].attributes;
        // let child_name = (typeof child_attributes['nickname'] === 'string' && child_attributes['nickname'] !== '') ? child_attributes['nickname'] : child_attributes['full_name'];
        return html`<div class="heitzfit4-card-header">Panning Global</div>`;
        // return html`<div class="heitzfit4-card-header">Panning Global FitEmploi du temps de ${child_name}</div>`;
    }

    getBreakRow(label, ended) {
        return html`
        <tr class="lunch-break ${ended ? 'activity-ended' : ''}">
            <td></td>
            <td><span></span></td>
            <td colspan="2">
                <span class="activity-name">${label}</span>
            </td>
        </tr>`;
    }

    getPlanningRow(activity) {
        let currentDate = new Date();
        let startAt = Date.parse(activity.start);
        let endAt = Date.parse(activity.end);

        let prefix = html``;
        // if (this.config.display_lunch_break && activity.is_afternoon && !this.lunchBreakRendered) {
        //     prefix = this.getBreakRow('Repas', this.config.dim_ended_activitys && startAt < currentDate);
        //     this.lunchBreakRendered = true;
        // }

        // let content = html`
        // <tr class="${activity.canceled ? 'activity-canceled':''} ${this.config.dim_ended_activitys && endAt < currentDate ? 'activity-ended' : ''}">
        // <tr class="''} ${endAt < currentDate ? 'activity-ended' : ''}">
        //     <td>
        //         ${activity.start_time}<br />
        //         ${activity.end_time}
        //     </td>
        //     <td><span style="background-color:${activity.background_color}"></span></td>
        //     <td>
        //         <span class="activity-name">${activity.activity}</span>
        //         ${this.config.display_classroom ? html`<span class="activity-classroom">
        //             ${activity.classroom ? 'Salle '+activity.classroom : ''}
        //             ${activity.classroom && this.config.display_teacher ? ', ' : '' }
        //         </span>` : '' }
        //         ${this.config.display_teacher ? html`<span class="activity-teacher">
        //             ${activity.teacher_name}
        //         </span>`: '' }
        //     </td>
        //     <td>
        //         ${activity.status ? html`<span class="activity-status">${activity.status}</span>`:''}
        //     </td>
        // </tr>
        // `
        let content = html`
        <tr class="''} ${endAt < currentDate ? 'activity-ended' : ''}">
            <td>
                ${activity.start_time}<br />
                ${activity.end_time}
            </td>
            <td><span style="background-color:pink"></span></td>
            <td>
                ${activity.booked ? html`<span class="activity-status">Réservé</span>`:''}
            </td>
        </tr>
        `
        return html`${prefix}${content}`;
    }

    getFormattedDate(activity) {
        return (new Date(activity.start))
            .toLocaleDateString('fr-FR', {weekday: 'long', day: '2-digit', month: '2-digit'})
            .replace(/^(.)/, (match) => match.toUpperCase())
        ;
    }

    getFormattedTime(time) {
        return new Intl.DateTimeFormat("fr-FR", {hour:"numeric", minute:"numeric"}).format(new Date(time));
    }

    getDayHeader(firstactivity, dayStartAt, dayEndAt, daysCount) {
        // return html`<div class="heitzfit4-Planning-header">
        //     ${this.config.enable_slider ? html`<span
        //         class="heitzfit4-Planning-header-arrow-left ${daysCount === 0 ? 'disabled' : ''}"
        //         @click=${(e) => this.changeDay('previous', e)}
        //     >←</span>` : '' }
        //     <span class="heitzfit4-Planning-header-date">${this.getFormattedDate(firstactivity)}</span>
        //     ${this.config.display_day_hours && dayStartAt && dayEndAt ? html`<span class="heitzfit4-Planning-header-hours">
        //     ${this.config.display_day_hours && dayStartAt && dayEndAt ? html`<span class="heitzfit4-Planning-header-hours">
        //         ${this.getFormattedTime(dayStartAt)} - ${this.getFormattedTime(dayEndAt)}
        //     </span>` : '' }
        //     ${this.config.enable_slider ? html`<span
        //         class="heitzfit4-Planning-header-arrow-right"
        //         @click=${(e) => this.changeDay('next', e)}
        //     >→</span>` : '' }
        // </div>`;
        return html`<div class="heitzfit4-Planning-header">
            ${this.config.enable_slider ? html`<span
                class="heitzfit4-Planning-header-arrow-left ${daysCount === 0 ? 'disabled' : ''}"
                @click=${(e) => this.changeDay('previous', e)}
            >←</span>` : '' }
            <span class="heitzfit4-Planning-header-date">${this.getFormattedDate(firstactivity)}</span>
            ${this.config.display_day_hours && dayStartAt && dayEndAt ? html`<span class="heitzfit4-Planning-header-hours">
                ${this.getFormattedTime(dayStartAt)} - ${this.getFormattedTime(dayEndAt)}
            </span>` : '' }
            ${this.config.enable_slider ? html`<span
                class="heitzfit4-Planning-header-arrow-right"
                @click=${(e) => this.changeDay('next', e)}
            >→</span>` : '' }
        </div>`;
    }

    changeDay(direction, e) {
        e.preventDefault();
        if (e.target.classList.contains('disabled')) {
            return;
        }

        const activeDay = e.target.parentElement.parentElement;
        let hasPreviousDay = activeDay.previousElementSibling && activeDay.previousElementSibling.classList.contains('heitzfit4-Planning-day-wrapper');
        let hasNextDay = activeDay.nextElementSibling && activeDay.nextElementSibling.classList.contains('heitzfit4-Planning-day-wrapper');
        let newActiveDay = null;

        if (direction === 'previous' && hasPreviousDay) {
            newActiveDay = activeDay.previousElementSibling;
        } else if (direction === 'next' && hasNextDay) {
            newActiveDay = activeDay.nextElementSibling;
        }

        if (newActiveDay) {
            activeDay.classList.remove('active');
            newActiveDay.classList.add('active');

            hasPreviousDay = newActiveDay.previousElementSibling && newActiveDay.previousElementSibling.classList.contains('heitzfit4-Planning-day-wrapper');
            hasNextDay = newActiveDay.nextElementSibling && newActiveDay.nextElementSibling.classList.contains('heitzfit4-Planning-day-wrapper');

            if (!hasPreviousDay) {
                newActiveDay.querySelector('.heitzfit4-Planning-header-arrow-left').classList.add('disabled');
            }

            if (!hasNextDay) {
                newActiveDay.querySelector('.heitzfit4-Planning-header-arrow-right').classList.add('disabled');
            }
        }
    }

    render() {
        if (!this.config || !this.hass) {
            return html``;
        }

        const stateObj = this.hass.states[this.config.entity];

        const activitys = this.hass.states[this.config.entity].attributes['activitys']

        if (stateObj) {
            this.lunchBreakRendered = false;
            const currentWeekNumber = new Date().getWeekNumber();

            const itemTemplates = [];
            let dayTemplates = [];
            let daysCount = 0;

            let dayStartAt = null;
            let dayEndAt = null;

            for (let index = 0; index < activitys.length; index++) {
                let activity = activitys[index];
                let currentFormattedDate = this.getFormattedDate(activity);

                if (!activity.canceled) {
                    if (dayStartAt === null) {
                        dayStartAt = activity.start;
                    }
                    dayEndAt = activity.end;
                }

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
                    if (this.config.max_days && this.config.max_days <= daysCount) {
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
            max_days: null,
        }

        this.config = {
            ...defaultConfig,
            ...config
        };
    }

    static get styles() {
        return css`
        .heitzfit4-Planning-card-slider .heitzfit4-Planning-day-wrapper {
            display: none;
        }
        .heitzfit4-Planning-card-slider .heitzfit4-Planning-day-wrapper.active {
            display: block;
        }
        .heitzfit4-Planning-card-slider .heitzfit4-Planning-header-date {
            display: inline-block;
            text-align: center;
            width: 120px;
        }
        .heitzfit4-Planning-header-arrow-left,
        .heitzfit4-Planning-header-arrow-right {
            cursor: pointer;
        }
        .heitzfit4-Planning-header-arrow-left.disabled,
        .heitzfit4-Planning-header-arrow-right.disabled {
            opacity: 0.3;
            pointer-events: none;
        }
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
            // display_lunch_break: true,
            // display_classroom: true,
            // display_teacher: true,
            // display_day_hours: true,
            // dim_ended_activitys: true,
            max_days: null,
            current_week_only: false,
            // enable_slider: false,
            // display_free_time_slots: true,
        }
    }

    static getConfigElement() {
        return document.createElement("heitzfit4-Planning-card-editor");
    }
}

customElements.define("heitzfit4-Planning-card", heitzfit4PlanningCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "heitzfit4-Planning-card",
    name: "heitzfit4 Planning Card",
    description: "Display the Planning from heitzfit4",
    documentationURL: "https://github.com/mrjulien44/lovelace-heitzfit4?tab=readme-ov-file#Planning",
});