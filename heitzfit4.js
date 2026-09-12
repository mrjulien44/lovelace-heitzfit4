import{unsafeHTML as t}from"https://unpkg.com/lit-html@2.8.0/directives/unsafe-html.js?module";const e=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),i=e.prototype.html,n=e.prototype.css;Date.prototype.getWeekNumber=function(){var t=new Date(+this);return t.setHours(0,0,0,0),t.setDate(t.getDate()+4-(t.getDay()||7)),Math.ceil(((t-new Date(t.getFullYear(),0,1))/864e5+1)/7)};customElements.define("heitzfit4-planning-card",class extends e{static get properties(){return{config:{},hass:{}}}getCardHeader(){return i`<div class="heitzfit4-card-header">Panning Global</div>`}getBreakRow(t){return i`
        <tr class="activity-ended">
            <td></td>
            <td><span></span></td>
            <td colspan="2">
                <span class="activity-name">${t}</span>
            </td>
        </tr>`}handleAction(t){if(!this.hass||!this.config.show_actions)return;const e={activity_id:String(t.id)};try{this.hass.callService&&this.hass.callService("heitzfit4",t.booked?"delete_activity":"book_activity",e)}catch(i){try{this.hass.callService&&this.hass.callService("script",t.booked?"heitzfit_annuler_action":"heitzfit_reserver_action",e)}catch(n){console.warn("Unable to call heitzfit action service",n)}}}getActionLink(t){if(!this.config.show_actions)return i``;const e=void 0!==t.placesTaken&&void 0!==t.placesMax&&Number(t.placesTaken)<Number(t.placesMax);return t.booked?i`
                <button class="heitzfit4-action-button" @click=${()=>this.handleAction(t)}>
                    <ha-icon icon="mdi:minus-circle"></ha-icon>
                </button>
            `:e?i`
                <button class="heitzfit4-action-button" @click=${()=>this.handleAction(t)}>
                    <ha-icon icon="mdi:plus-circle"></ha-icon>
                </button>
            `:i``}getPlanningRow(t){let e=new Date;Date.parse(t.start);let n=Date.parse(t.end),a=i``,o=i`
        <tr class="${t.canceled?"activity-canceled":""} ${this.config.dim_ended_activitys&&n<e?"activity-ended":""}">
            <td>
                ${t.start_time}<br />
                ${t.end_time}
            </td>
            <td><span style="background-color:${t.background_color||"pink"}"></span></td>
            <td>
                <span class="activity-name">${t.activity}</span>
                ${this.config.display_classroom?i`<span class="activity-classroom">
                    ${t.room?"Salle "+t.room:""}
                </span>`:""}
                ${this.config.display_teacher?i`<span class="activity-teacher">
                    ${t.teacher_name||""}
                </span>`:""}
            </td>
            <td>
                ${t.status?i`<span class="activity-status">${t.status}</span>`:""}
                ${t.booked?i`<span class="activity-status">Réservé</span>`:""}
            </td>
            ${this.config.show_actions?i`<td class="activity-actions">${this.getActionLink(t)}</td>`:""}
        </tr>
        `;return i`${a}${o}`}getFormattedDate(t){return new Date(t.start).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"2-digit"}).replace(/^(.)/,(t=>t.toUpperCase()))}getFormattedTime(t){return new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(new Date(t))}normalizePlanningPayload(t){if("string"==typeof t)try{t=JSON.parse(t)}catch(e){return[]}if(Array.isArray(t))return t;if(t&&"object"==typeof t){if(Array.isArray(t.Planning))return t.Planning;if(Array.isArray(t.planning))return t.planning;if(Array.isArray(t.activities))return t.activities;if(Array.isArray(t.data))return t.data;const e=[],i=t=>{if(Array.isArray(t))e.push(...t);else if(t&&"object"==typeof t)for(const n of Object.keys(t)){const a=t[n];Array.isArray(a)?e.push(...a):a&&"object"==typeof a&&i(a)}};return i(t),e}return[]}getDayHeader(t,e,n,a){return i`<div class="heitzfit4-Planning-header">
            ${this.config.enable_slider?i`<span
                class="heitzfit4-Planning-header-arrow-left ${0===a?"disabled":""}"
                @click=${t=>this.changeDay("previous",t)}
            >←</span>`:""}
            <span class="heitzfit4-Planning-header-date">${this.getFormattedDate(t)}</span>
            ${this.config.display_day_hours&&e&&n?i`<span class="heitzfit4-Planning-header-hours">
                ${this.getFormattedTime(e)} - ${this.getFormattedTime(n)}
            </span>`:""}
            ${this.config.enable_slider?i`<span
                class="heitzfit4-Planning-header-arrow-right"
                @click=${t=>this.changeDay("next",t)}
            >→</span>`:""}
        </div>`}render(){if(!this.config||!this.hass)return i``;const t=this.hass.states[this.config.entity];if(!t||!t.attributes)return i``;const e=this.normalizePlanningPayload(t.attributes.Planning||t.attributes.planning||t.attributes.activities||t.attributes.data||t.state||[]);if(!Array.isArray(e)||0===e.length)return i``;const n=e,a=this.config.days||this.config.max_days||7;if(t){const t=(new Date).getWeekNumber(),e=[];let o=[],s=0,r=null,l=null;for(let c=0;c<n.length;c++){let d=n[c];if(this.config.only_booked&&!d.booked)continue;let h=this.getFormattedDate(d);if(null===r&&(r=d.start),l=d.end,d.canceled&&c<n.length-1){let t=n[c+1];if(d.start===t.start&&!t.canceled)continue}if(this.config.current_week_only&&new Date(d.start).getWeekNumber()>t)break;if(o.push(this.getPlanningRow(d)),c+1>=n.length||c+1<n.length&&h!==this.getFormattedDate(n[c+1])){if(e.push(i`
                        <div class="${this.config.enable_slider?"slider-enabled":""} heitzfit4-Planning-day-wrapper ${0===s?"active":""}">
                            ${this.getDayHeader(d,r,l,s)}
                            <table>${o}</table>
                        </div>
                    `),o=[],this.lunchBreakRendered=!1,r=null,l=null,s++,a&&a<=s)break}else if(this.config.display_free_time_slots&&c+1<n.length){const t=new Date(d.end),e=n[c+1],i=new Date(e.start);if(d.is_morning===e.is_morning&&Math.floor((i-t)/1e3/60)>30){const t=new Date;o.push(this.getBreakRow("Pas de cours",this.config.dim_ended_activitys&&i<t))}}}return o.length>0&&e.push(i`<table>${o}</table>`),i`
                <ha-card id="${this.config.entity}-card" class="${this.config.enable_slider?"heitzfit4-Planning-card-slider":""}">
                    ${this.config.display_header?this.getCardHeader():""}
                    ${e}
                </ha-card>`}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config={entity:null,display_header:!0,days:7,max_days:null,only_booked:!1,show_actions:!0,...t}}static get styles(){return n`
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
        `}static getStubConfig(){return{display_header:!0,max_days:null,current_week_only:!1}}static getConfigElement(){return document.createElement("heitzfit4-planning-card-editor")}}),window.customCards=window.customCards||[],window.customCards.push({type:"heitzfit4-planning-card",name:"heitzfit4 Planning Card",description:"Display the Planning from heitzfit4",documentationURL:"https://github.com/mrjulien44/lovelace-heitzfit4?tab=readme-ov-file#Planning"});const a=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),o=a.prototype.html,s=a.prototype.css;Date.prototype.getWeekNumber=function(){var t=new Date(+this);return t.setHours(0,0,0,0),t.setDate(t.getDate()+4-(t.getDay()||7)),Math.ceil(((t-new Date(t.getFullYear(),0,1))/864e5+1)/7)};customElements.define("heitzfit4-booking-card",class extends a{lunchBreakRendered=!1;static get properties(){return{config:{},hass:{}}}getCardHeader(){let t=this.config.entity.split("_booking")[0],e=this.hass.states[t].attributes,i="string"==typeof e.nickname&&""!==e.nickname?e.nickname:e.full_name;return o`<div class="heitzfit4-card-header">Devoirs de ${i}</div>`}getFormattedDate(t){return new Date(t).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"2-digit"}).replace(/^(.)/,(t=>t.toUpperCase()))}getFormattedTime(t){return new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(new Date(t))}getDayHeader(t){return o`<div class="heitzfit4-booking-header">
            <span>${this.getFormattedDate(t.date)}</span>
        </div>`}getbookingRow(e,i){let n=e.description.trim().replace("\n","<br />"),a=[];return e.files.forEach((t=>{""!==t.name.trim()&&a.push(o`<span class="booking-file">➤ <a href="${t.url}">${t.name}</a></span>`)})),o`
        <tr class="${e.done?"booking-done":""}">
            <td class="booking-color"><span style="background-color:${e.background_color}"></span></td>
            <td class="booking-detail">
                <label for="booking-${i}">
                    <span class="booking-subject">${e.subject}</span>
                </label>
                <input type="checkbox" id="booking-${i}" />
                <span class="booking-description">${t(n)}</span>
                ${a.length>0?o`<span class="booking-files">${a}</span>`:""}
            </td>
            <td class="booking-status">
                <span>${e.done?o`<ha-icon icon="mdi:check"></ha-icon>`:o`<ha-icon icon="mdi:account-clock"></ha-icon>`}</span>
            </td>
        </tr>
        `}render(){if(!this.config||!this.hass)return o``;const t=this.hass.states[this.config.entity],e=this.hass.states[this.config.entity].attributes.booking;if(t){const t=(new Date).getWeekNumber(),i=[];let n=[];if(e&&e.length>0){let a=this.getFormattedDate(e[0].date);for(let s=0;s<e.length;s++){let r=e[s],l=this.getFormattedDate(r.date);if(!0!==r.done||!1!==this.config.display_done_booking){if(a!==l&&(n.length>0&&(i.push(this.getDayHeader(e[s-1])),i.push(o`<table class="${this.config.reduce_done_booking?"reduce-done":""}">${n}</table>`),n=[]),a=l),this.config.current_week_only&&new Date(r.date).getWeekNumber()!==t)break;n.push(this.getbookingRow(r,s))}}n.length>0&&(!this.config.current_week_only||this.config.current_week_only&&t===new Date(e[e.length-1].date).getWeekNumber())&&(i.push(this.getDayHeader(e[e.length-1])),i.push(o`<table class="${this.config.reduce_done_booking?"reduce-done":""}">${n}</table>`))}return 0===i.length&&i.push(o`<span class="no-booking">Pas de devoirs à faire</span>`),o`
                <ha-card id="${this.config.entity}-card">
                    ${this.config.display_header?this.getCardHeader():""}
                    ${i}
                </ha-card>`}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");this.config={entity:null,display_header:!0,current_week_only:!0,reduce_done_booking:!0,display_done_booking:!0,...t}}static get styles(){return s`
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
        `}static getStubConfig(){return{display_header:!0,current_week_only:!0,reduce_done_booking:!0,display_done_booking:!0}}static getConfigElement(){return document.createElement("heitzfit4-booking-card-editor")}}),window.customCards=window.customCards||[],window.customCards.push({type:"heitzfit4-booking-card",name:"heitzfit4 booking Card",description:"Display the booking from heitzfit4",documentationURL:"https://github.com/delphiki/lovelace-heitzfit4?tab=readme-ov-file#booking"});const r=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),l=r.prototype.html,c=r.prototype.css;class d extends r{static get properties(){return{hass:{},_config:{}}}setConfig(t){this._config=t,this.loadEntityPicker()}_valueChanged(t){const e=Object.assign({},this._config);void 0!==t.target.__checked?e[t.target.configValue]=t.target.__checked:e[t.target.configValue]=""==t.target.value?null:t.target.value,this._config=e;const i=new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0});this.dispatchEvent(i)}buildSelectField(t,e,i,n,a){let o=[];for(let s=0;s<i.length;s++){let t=i[s];o.push(l`<ha-list-item .value="${t.value}">${t.label}</ha-list-item>`)}return l`
            <ha-select
                label="${t}"
                .value=${n||a}
                .configValue=${e}                
                @change=${this._valueChanged}
                @closed=${t=>t.stopPropagation()}
            >
                ${o}
            </ha-select>
        `}buildSwitchField(t,e,i,n){return"boolean"!=typeof i&&(i=n),l`
            <ha-selector-boolean>
                <label for="display_header">${t}</label>
                <ha-switch
                    name="${e}"
                    .checked=${i}
                    .configValue="${e}"
                    @change=${this._valueChanged}
                ></ha-switch>
            </ha-selector-boolean>
        `}buildNumberField(t,e,i,n,a){return l`
            <ha-textfield type="number" step="${a||1}"
                 label="${t}"
                .value=${i||n}
                .configValue=${e}                
                @change=${this._valueChanged}
            >
        `}buildTextField(t,e,i,n){return l`
            <ha-textfield
                 label="${t}"
                .value=${i||n}
                .configValue=${e}                
                @change=${this._valueChanged}
                @keyup=${this._valueChanged}
            >
        `}buildEntityPickerField(t,e,i,n){const a=new RegExp("heitzfit4_[a-z_]+_"+n);return l`
            <ha-entity-picker
                label="${t}"
                .hass=${this.hass}
                .value=${i||""}
                .configValue=${e}
                .includeDomains="sensor"
                .entityFilter="${t=>a.test(t.entity_id)}"
                @value-changed=${this._valueChanged}
                allow-custom-entity
            ></ha-entity-picker>
        `}async loadEntityPicker(){if(window.customElements.get("ha-entity-picker"))return;const t=await window.loadCardHelpers(),e=await t.createCardElement({type:"entities",entities:[]});await e.constructor.getConfigElement()}static get styles(){return c`
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
        `}}const h=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).prototype.html;customElements.define("heitzfit4-planning-card-editor",class extends d{render(){return this.hass&&this._config?h`
            ${this.buildEntityPickerField("Planning entity","entity",this._config.entity,"Planning")}
            ${this.buildNumberField("Days","days",this._config.days,7,1)}
            ${this.buildSwitchField("Only booked","only_booked",this._config.only_booked,!1)}
            ${this.buildSwitchField("Show actions","show_actions",this._config.show_actions,!0)}
            ${this.buildNumberField("Max days","max_days",this._config.max_days,null,1)}
        `:h``}});const g=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).prototype.html;customElements.define("heitzfit4-booking-card-editor",class extends d{render(){return this.hass&&this._config?g`
            ${this.buildEntityPickerField("booking entity","entity",this._config.entity,"booking")}
            ${this.buildSwitchField("Display header","display_header",this._config.display_header)}
            ${this.buildSwitchField("Current week only","current_week_only",this._config.current_week_only)}
            ${this.buildSwitchField("Reduce done booking","reduce_done_booking",this._config.reduce_done_booking)}
            ${this.buildSwitchField("Display done booking","display_done_booking",this._config.display_done_booking)}
        `:g``}});
