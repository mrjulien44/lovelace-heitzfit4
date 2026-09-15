const t=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),e=t.prototype.html,i=t.prototype.css;Date.prototype.getWeekNumber=function(){var t=new Date(+this);return t.setHours(0,0,0,0),t.setDate(t.getDate()+4-(t.getDay()||7)),Math.ceil(((t-new Date(t.getFullYear(),0,1))/864e5+1)/7)};customElements.define("heitzfit4-planning-card",class extends t{static get properties(){return{config:{},hass:{}}}getCardHeader(){return e`
        <div class="heitzfit4-card-header">
          <img src = '/local/images/logo_globalfit.png' alt='GlobalFit Club' align='middle' height=50>Panning Global
        </div>`}async handleAction(t){if(!this.normalizeBoolean(this.config.show_actions,!0))return;if(!this.normalizeBoolean(this.config.only_booked,!0))return;const e={activity_id:String(t.id)};try{if(this.hass.callService){await this.hass.callService("heitzfit4",t.booked?"delete_activity":"book_activity",e),await this.hass.callService("homeassistant","update_entity",{entity_id:"sensor.heitzfit4_planning"}),"function"==typeof this.requestUpdate&&this.requestUpdate();new CustomEvent("hass-notification",{detail:{message:"Le planning a été mis à jour avec succès !",dismissable:!0},bubbles:!0,composed:!0})}}catch(i){console.warn("Unable to call heitzfit action service",i)}}getActionLink(t){if(!this.normalizeBoolean(this.config.show_actions,!0))return e``;const i=void 0!==t.placesTaken&&void 0!==t.placesMax&&Number(t.placesTaken)<Number(t.placesMax);return t.booked?e`
                <button class="heitzfit4-action-button heitzfit4-action-button-booked" @click=${()=>this.handleAction(t)} title="Annuler la réservation">
                    <ha-icon icon="mdi:minus-circle"></ha-icon>
                </button>
            `:i?e`
                <button class="heitzfit4-action-button heitzfit4-action-button-bookable" @click=${()=>this.handleAction(t)} title="Réserver">
                    <ha-icon icon="mdi:plus-circle"></ha-icon>
                </button>
            `:e`
            <button class="heitzfit4-action-button heitzfit4-action-button-full" disabled title="Complet">
                <ha-icon icon="mdi:calendar-lock"></ha-icon>
            </button>
        `}normalizeActivity(t){if(!t||"object"!=typeof t)return t;const e={...t};return e.activity=e.activity||e.name||e.title||e.session||e.lesson||"",e.room=e.room||e.classroom||e.location||e.salle||"",e.start=e.start||e.start_time||e.begin||e.begin_time||"",e.end=e.end||e.end_time||e.finish||e.finish_time||"",void 0===e.booked&&"boolean"==typeof e.reserved&&(e.booked=e.reserved),void 0===e.booked&&"boolean"==typeof e.isBooked&&(e.booked=e.isBooked),e}getPlanningRow(t){const i=this.normalizeActivity(t);let n=new Date,a=i.start?Date.parse(i.start):null,o=i.end?Date.parse(i.end):null;const s=this.getFormattedTime(a);console.log(s);const r=this.getFormattedTime(o);console.log(r);const l=i.room||"";console.log(l);const c=i.activity||"";let d=e``,h=e`
        <tr class="${i.canceled?"activity-canceled":""} ${this.config.dim_ended_activitys&&o&&o<n?"activity-ended":""} ${i.booked?"activity-booked":""}">
            <td>
                ${s}<br />
                ${r}
            </td>
            <td><span style="background-color:${i.booked?"#43B061":"#7d7d7d"}"></span></td>
            <td>
                <span class="activity-name">${c}</span>
                <span class="activity-classroom">${l}</span>
            </td>
            <td>
                ${i.booked?e`<span class="activity-status">Réservé</span>`:""}
            </td>
            ${this.normalizeBoolean(this.config.show_actions,!0)?e`<td class="activity-actions">${this.getActionLink(i)}</td>`:""}
        </tr>
        `;return e`${d}${h}`}getFormattedDate(t){if(!t)return"";const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"2-digit"}).replace(/^(.)/,(t=>t.toUpperCase()))}getFormattedTime(t){if(!t)return"";const e=String(t).trim();if(/^\d{1,2}:\d{2}(:\d{2})?$/.test(e))return e;const i=new Date(e);return Number.isNaN(i.getTime())?"":new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(i)}flattenPlanningObject(t){const e=[];return t&&"object"==typeof t?(Object.keys(t).forEach((i=>{const n=t[i];Array.isArray(n)?e.push(...n):n&&"object"==typeof n&&(Array.isArray(n.activities)?e.push(...n.activities):Array.isArray(n.Planning)?e.push(...n.Planning):Array.isArray(n.planning)?e.push(...n.planning):e.push(...this.flattenPlanningObject(n)))})),e):e}normalizePlanningPayload(t){if("string"==typeof t)try{t=JSON.parse(t)}catch(i){return[]}let e=[];if(Array.isArray(t))e=t;else if(t&&"object"==typeof t)if(Array.isArray(t.Planning))e=t.Planning;else if(Array.isArray(t.planning))e=t.planning;else if(Array.isArray(t.activities))e=t.activities;else if(Array.isArray(t.data))e=t.data;else if(t.planning&&"object"==typeof t.planning)e=this.flattenPlanningObject(t.planning);else if(t.Planning&&"object"==typeof t.Planning)e=this.flattenPlanningObject(t.Planning);else{if(Object.keys(t).some((e=>Array.isArray(t[e]))))e=this.flattenPlanningObject(t);else{const i=[],n=t=>{if(Array.isArray(t))i.push(...t);else if(t&&"object"==typeof t)for(const e of Object.keys(t)){const a=t[e];Array.isArray(a)?i.push(...a):a&&"object"==typeof a&&n(a)}};n(t),e=i}}return e.map((t=>this.normalizeActivity(t)))}getDayHeader(t,i,n,a){return e`<div class="heitzfit4-timetable-day-wrapper ${0===a?"active":""}">
            <div class="heitzfit4-timetable-header">
                <span class="heitzfit4-timetable-header-date">${this.getFormattedDate(t)}</span>
                ${this.config.display_day_hours&&i&&n?e`<span class="heitzfit4-timetable-header-hours">
                    ${this.getFormattedTime(i)} - ${this.getFormattedTime(n)}
                </span>`:""}
            </div>
        </div>`}render(){if(!this.config||!this.hass)return e``;const t=this.hass.states[this.config.entity];if(!t||!t.attributes)return e``;const i=this.normalizePlanningPayload(t.attributes.Planning||t.attributes.planning||t.attributes.activities||t.attributes.data||t.state||[]);if(!Array.isArray(i)||0===i.length)return e``;const n=i,a=this.config.days||7,o="string"==typeof this.config.only_booked&&"booked"===this.config.only_booked.trim().toLowerCase()||this.normalizeBoolean(this.config.only_booked,!1);this.normalizeBoolean(this.config.show_actions,!0);const s=o?n.filter((t=>t.booked)):n;if(t){const t=(new Date).getWeekNumber(),i=[];let n=[],o=0,r=null,l=null;for(let c=0;c<s.length;c++){let d=s[c],h=this.getFormattedDate(d);if(null===r&&(r=d.start),l=d.end,d.canceled&&c<s.length-1){let t=s[c+1];if(d.start===t.start&&!t.canceled)continue}if(this.config.current_week_only&&new Date(d.start).getWeekNumber()>t)break;if(n.push(this.getPlanningRow(d)),c+1>=s.length||c+1<s.length&&h!==this.getFormattedDate(s[c+1])){if(i.push(e`
                        <div class="${this.config.enable_slider?"slider-enabled":""} heitzfit4-Planning-day-wrapper ${0===o?"active":""}">
                            ${this.getDayHeader(d,r,l,o)}
                            <table>${n}</table>
                        </div>
                    `),n=[],r=null,l=null,o++,a&&a<=o)break}else if(this.config.display_free_time_slots&&c+1<s.length){new Date(d.end);const t=s[c+1];new Date(t.start)}}return n.length>0&&i.push(e`<table>${n}</table>`),e`
                <ha-card id="${this.config.entity}-card" class="${this.config.enable_slider?"heitzfit4-Planning-card-slider":""}">
                    ${this.normalizeBoolean(this.config.display_header,!0)?this.getCardHeader():""}
                    ${i}
                </ha-card>`}}normalizeBoolean(t,e){if("boolean"==typeof t)return t;if("string"==typeof t){const e=t.trim().toLowerCase();if(["true","1","on","yes"].includes(e))return!0;if(["false","0","off","no"].includes(e))return!1}return e}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config={days:7,only_booked:!1,show_actions:!0,...t},this.config.only_booked=this.normalizeBoolean(this.config.only_booked,!1),this.config.show_actions=this.normalizeBoolean(this.config.show_actions,!0)}static get styles(){return i`
        .heitzfit4-card-header {
            text-align:center;
        }
        .heitzfit4-timetable-card-slider .heitzfit4-timetable-day-wrapper {
            display: none;
        }
        .heitzfit4-timetable-card-slider .heitzfit4-timetable-day-wrapper.active {
            display: block;
        }
        .heitzfit4-timetable-card-slider .heitzfit4-timetable-header-date {
            display: inline-block;
            text-align: center;
            width: 120px;
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
        .activity-ended {
            opacity: 0.3;
        }
        div:not(.slider-enabled).heitzfit4-Planning-day-wrapper + div:not(.slider-enabled).heitzfit4-Planning-day-wrapper {
            border-top: 1px solid white;
        }
        `}static getStubConfig(){return{display_header:!0}}static getConfigElement(){return document.createElement("heitzfit4-planning-card-editor")}}),window.customCards=window.customCards||[],window.customCards.push({type:"heitzfit4-planning-card",name:"heitzfit4 Planning Card",description:"Display the Planning from heitzfit4",documentationURL:"https://github.com/mrjulien44/lovelace-heitzfit4?tab=readme-ov-file#Planning"});const n=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),a=n.prototype.html,o=n.prototype.css;class s extends n{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config=t,this.loadEntityPicker()}_parseBooleanToken(t){if("boolean"==typeof t)return t;if("string"==typeof t){const e=t.trim().toLowerCase();if(["true","1","on","yes"].includes(e))return!0;if(["false","0","off","no"].includes(e))return!1}}_valueChanged(t){const e=Object.assign({},this._config);void 0!==t.target.checked?e[t.target.configValue]=t.target.checked:e[t.target.configValue]=""==t.target.value?null:t.target.value,this._config=e;const i=new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0});this.dispatchEvent(i)}buildSelectField(t,e,i,n,o){let s=[];for(let r=0;r<i.length;r++){let t=i[r];s.push(a`<ha-list-item .value="${t.value}">${t.label}</ha-list-item>`)}return a`
            <ha-select
                label="${t}"
                .value=${n||o}
                .configValue=${e}                
                @change=${this._valueChanged}
                @closed=${t=>t.stopPropagation()}
            >
                ${s}
            </ha-select>
        `}buildSwitchField(t,e,i,n){return"boolean"!=typeof i&&(i=n),a`
            <ha-formfield class="switch-wrapper" .label="${t}">
                <ha-switch
                    name="${e}"
                    .checked=${i}
                    .configValue="${e}"
                    @change=${this._valueChanged}
                    console.log(this._valueChanged)
                ></ha-switch>
            </ha-formfield>
        `}buildNumberField(t,e,i,n,o){return a`
            <ha-textfield type="number" step="${o||1}"
                 label="${t}"
                .value=${i||n}
                .configValue=${e}                
                @change=${this._valueChanged}
            >
        `}buildTextField(t,e,i,n){return a`
            <ha-textfield
                 label="${t}"
                .value=${i||n}
                .configValue=${e}                
                @change=${this._valueChanged}
                @keyup=${this._valueChanged}
            >
        `}buildEntityPickerField(t,e,i,n){const o=new RegExp("heitzfit4_[a-z_]+_"+n);return a`
            <ha-entity-picker
                label="${t}"
                .hass=${this.hass}
                .value=${i||""}
                .configValue=${e}
                .includeDomains="sensor"
                .entityFilter="${t=>o.test(t.entity_id)}"
                @value-changed=${this._valueChanged}
                allow-custom-entity
            ></ha-entity-picker>
        `}async loadEntityPicker(){if(window.customElements.get("ha-entity-picker"))return;const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});await e.constructor.getConfigElement()}static get styles(){return o`
            ha-selector-boolean {
                display: block;
                padding-top: 20px;
                clear: right;
            }
            ha-selector-boolean > ha-switch {
                float: right;
            }
            ha-select, ha-textfield {
                clear: right;
                width: 100%;
                padding-top: 15px;
            }
        `}}const r=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).prototype.html;customElements.define("heitzfit4-planning-card-editor",class extends s{render(){return this.hass&&this._config?r`
            ${this.buildEntityPickerField("Planning entity","entity",this._config.entity,"Planning")}
            ${this.buildNumberField("Days","days",this._config.days,7,1)}
            ${this.buildSwitchField("Only booked","only_booked",this._config.only_booked,!1)}
            ${this.buildSwitchField("Show actions","show_actions",this._config.show_actions,!0)}
        `:r``}});
