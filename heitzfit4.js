import{unsafeHTML as e}from"https://unpkg.com/lit-html@2.8.0/directives/unsafe-html.js?module";const t=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),i=t.prototype.html,n=t.prototype.css;Date.prototype.getWeekNumber=function(){var e=new Date(+this);return e.setHours(0,0,0,0),e.setDate(e.getDate()+4-(e.getDay()||7)),Math.ceil(((e-new Date(e.getFullYear(),0,1))/864e5+1)/7)};customElements.define("heitzfit4-planning-card",class extends t{static get properties(){return{config:{},hass:{}}}getCardHeader(){return i`<div class="heitzfit4-card-header">Panning Global</div>`}getBreakRow(e){return i`
        <tr class="activity-ended">
            <td></td>
            <td><span></span></td>
            <td colspan="2">
                <span class="activity-name">${e}</span>
            </td>
        </tr>`}handleAction(e){if(!this.hass||!this.config.show_actions)return;const t=e.booked?"heitzfit_annuler_action":"heitzfit_reserver_action",i={activity_id:String(e.id)};try{this.hass.callService&&this.hass.callService("script",t,i)}catch(n){console.warn("Unable to call heitzfit service",n)}}getActionLink(e){if(!this.config.show_actions)return i``;const t=void 0!==e.placesTaken&&void 0!==e.placesMax&&Number(e.placesTaken)<Number(e.placesMax);return e.booked?i`
                <button class="heitzfit4-action-button" @click=${()=>this.handleAction(e)}>
                    <ha-icon icon="mdi:minus-circle"></ha-icon>
                </button>
            `:t?i`
                <button class="heitzfit4-action-button" @click=${()=>this.handleAction(e)}>
                    <ha-icon icon="mdi:plus-circle"></ha-icon>
                </button>
            `:i``}getPlanningRow(e){let t=new Date;Date.parse(e.start);let n=Date.parse(e.end),a=i``,o=i`
        <tr class="${e.canceled?"activity-canceled":""} ${this.config.dim_ended_activitys&&n<t?"activity-ended":""}">
            <td>
                ${e.start_time}<br />
                ${e.end_time}
            </td>
            <td><span style="background-color:${e.background_color||"pink"}"></span></td>
            <td>
                <span class="activity-name">${e.activity}</span>
                ${this.config.display_classroom?i`<span class="activity-classroom">
                    ${e.room?"Salle "+e.room:""}
                </span>`:""}
                ${this.config.display_teacher?i`<span class="activity-teacher">
                    ${e.teacher_name||""}
                </span>`:""}
            </td>
            <td>
                ${e.status?i`<span class="activity-status">${e.status}</span>`:""}
                ${e.booked?i`<span class="activity-status">Réservé</span>`:""}
            </td>
            ${this.config.show_actions?i`<td class="activity-actions">${this.getActionLink(e)}</td>`:""}
        </tr>
        `;return i`${a}${o}`}getFormattedDate(e){return new Date(e.start).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"2-digit"}).replace(/^(.)/,(e=>e.toUpperCase()))}getFormattedTime(e){return new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(new Date(e))}getDayHeader(e,t,n,a){return i`<div class="heitzfit4-Planning-header">
            ${this.config.enable_slider?i`<span
                class="heitzfit4-Planning-header-arrow-left ${0===a?"disabled":""}"
                @click=${e=>this.changeDay("previous",e)}
            >←</span>`:""}
            <span class="heitzfit4-Planning-header-date">${this.getFormattedDate(e)}</span>
            ${this.config.display_day_hours&&t&&n?i`<span class="heitzfit4-Planning-header-hours">
                ${this.getFormattedTime(t)} - ${this.getFormattedTime(n)}
            </span>`:""}
            ${this.config.enable_slider?i`<span
                class="heitzfit4-Planning-header-arrow-right"
                @click=${e=>this.changeDay("next",e)}
            >→</span>`:""}
        </div>`}render(){if(!this.config||!this.hass)return i``;const e=this.hass.states[this.config.entity];if(!e||!e.attributes)return i``;const t=e.attributes.Planning||e.attributes.planning||[];if(!t||0===t.length)return i``;const n=t,a=this.config.days||this.config.max_days||7;if(e){const e=(new Date).getWeekNumber(),t=[];let o=[],s=0,l=null,r=null;for(let d=0;d<n.length;d++){let c=n[d];if(this.config.only_booked&&!c.booked)continue;let h=this.getFormattedDate(c);if(null===l&&(l=c.start),r=c.end,c.canceled&&d<n.length-1){let e=n[d+1];if(c.start===e.start&&!e.canceled)continue}if(this.config.current_week_only&&new Date(c.start).getWeekNumber()>e)break;if(o.push(this.getPlanningRow(c)),d+1>=n.length||d+1<n.length&&h!==this.getFormattedDate(n[d+1])){if(t.push(i`
                        <div class="${this.config.enable_slider?"slider-enabled":""} heitzfit4-Planning-day-wrapper ${0===s?"active":""}">
                            ${this.getDayHeader(c,l,r,s)}
                            <table>${o}</table>
                        </div>
                    `),o=[],this.lunchBreakRendered=!1,l=null,r=null,s++,a&&a<=s)break}else if(this.config.display_free_time_slots&&d+1<n.length){const e=new Date(c.end),t=n[d+1],i=new Date(t.start);if(c.is_morning===t.is_morning&&Math.floor((i-e)/1e3/60)>30){const e=new Date;o.push(this.getBreakRow("Pas de cours",this.config.dim_ended_activitys&&i<e))}}}return o.length>0&&t.push(i`<table>${o}</table>`),i`
                <ha-card id="${this.config.entity}-card" class="${this.config.enable_slider?"heitzfit4-Planning-card-slider":""}">
                    ${this.config.display_header?this.getCardHeader():""}
                    ${t}
                </ha-card>`}}setConfig(e){if(!e.entity)throw new Error("You need to define an entity");this.config={entity:null,display_header:!0,days:7,max_days:null,only_booked:!1,show_actions:!0,...e}}static get styles(){return n`
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
        `}static getStubConfig(){return{display_header:!0,max_days:null,current_week_only:!1}}static getConfigElement(){return document.createElement("heitzfit4-planning-card-editor")}}),window.customCards=window.customCards||[],window.customCards.push({type:"heitzfit4-planning-card",name:"heitzfit4 Planning Card",description:"Display the Planning from heitzfit4",documentationURL:"https://github.com/mrjulien44/lovelace-heitzfit4?tab=readme-ov-file#Planning"});const a=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),o=a.prototype.html,s=a.prototype.css;Date.prototype.getWeekNumber=function(){var e=new Date(+this);return e.setHours(0,0,0,0),e.setDate(e.getDate()+4-(e.getDay()||7)),Math.ceil(((e-new Date(e.getFullYear(),0,1))/864e5+1)/7)};customElements.define("heitzfit4-booking-card",class extends a{lunchBreakRendered=!1;static get properties(){return{config:{},hass:{}}}getCardHeader(){let e=this.config.entity.split("_booking")[0],t=this.hass.states[e].attributes,i="string"==typeof t.nickname&&""!==t.nickname?t.nickname:t.full_name;return o`<div class="heitzfit4-card-header">Devoirs de ${i}</div>`}getFormattedDate(e){return new Date(e).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"2-digit"}).replace(/^(.)/,(e=>e.toUpperCase()))}getFormattedTime(e){return new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(new Date(e))}getDayHeader(e){return o`<div class="heitzfit4-booking-header">
            <span>${this.getFormattedDate(e.date)}</span>
        </div>`}getbookingRow(t,i){let n=t.description.trim().replace("\n","<br />"),a=[];return t.files.forEach((e=>{""!==e.name.trim()&&a.push(o`<span class="booking-file">➤ <a href="${e.url}">${e.name}</a></span>`)})),o`
        <tr class="${t.done?"booking-done":""}">
            <td class="booking-color"><span style="background-color:${t.background_color}"></span></td>
            <td class="booking-detail">
                <label for="booking-${i}">
                    <span class="booking-subject">${t.subject}</span>
                </label>
                <input type="checkbox" id="booking-${i}" />
                <span class="booking-description">${e(n)}</span>
                ${a.length>0?o`<span class="booking-files">${a}</span>`:""}
            </td>
            <td class="booking-status">
                <span>${t.done?o`<ha-icon icon="mdi:check"></ha-icon>`:o`<ha-icon icon="mdi:account-clock"></ha-icon>`}</span>
            </td>
        </tr>
        `}render(){if(!this.config||!this.hass)return o``;const e=this.hass.states[this.config.entity],t=this.hass.states[this.config.entity].attributes.booking;if(e){const e=(new Date).getWeekNumber(),i=[];let n=[];if(t&&t.length>0){let a=this.getFormattedDate(t[0].date);for(let s=0;s<t.length;s++){let l=t[s],r=this.getFormattedDate(l.date);if(!0!==l.done||!1!==this.config.display_done_booking){if(a!==r&&(n.length>0&&(i.push(this.getDayHeader(t[s-1])),i.push(o`<table class="${this.config.reduce_done_booking?"reduce-done":""}">${n}</table>`),n=[]),a=r),this.config.current_week_only&&new Date(l.date).getWeekNumber()!==e)break;n.push(this.getbookingRow(l,s))}}n.length>0&&(!this.config.current_week_only||this.config.current_week_only&&e===new Date(t[t.length-1].date).getWeekNumber())&&(i.push(this.getDayHeader(t[t.length-1])),i.push(o`<table class="${this.config.reduce_done_booking?"reduce-done":""}">${n}</table>`))}return 0===i.length&&i.push(o`<span class="no-booking">Pas de devoirs à faire</span>`),o`
                <ha-card id="${this.config.entity}-card">
                    ${this.config.display_header?this.getCardHeader():""}
                    ${i}
                </ha-card>`}}setConfig(e){if(!e.entity)throw new Error("You need to define an entity");this.config={entity:null,display_header:!0,current_week_only:!0,reduce_done_booking:!0,display_done_booking:!0,...e}}static get styles(){return s`
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
        `}static getStubConfig(){return{display_header:!0,current_week_only:!0,reduce_done_booking:!0,display_done_booking:!0}}static getConfigElement(){return document.createElement("heitzfit4-booking-card-editor")}}),window.customCards=window.customCards||[],window.customCards.push({type:"heitzfit4-booking-card",name:"heitzfit4 booking Card",description:"Display the booking from heitzfit4",documentationURL:"https://github.com/delphiki/lovelace-heitzfit4?tab=readme-ov-file#booking"});const l=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),r=l.prototype.html,d=l.prototype.css;class c extends l{static get properties(){return{hass:{},_config:{}}}setConfig(e){this._config=e,this.loadEntityPicker()}_valueChanged(e){const t=Object.assign({},this._config);void 0!==e.target.__checked?t[e.target.configValue]=e.target.__checked:t[e.target.configValue]=""==e.target.value?null:e.target.value,this._config=t;const i=new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0});this.dispatchEvent(i)}buildSelectField(e,t,i,n,a){let o=[];for(let s=0;s<i.length;s++){let e=i[s];o.push(r`<ha-list-item .value="${e.value}">${e.label}</ha-list-item>`)}return r`
            <ha-select
                label="${e}"
                .value=${n||a}
                .configValue=${t}                
                @change=${this._valueChanged}
                @closed=${e=>e.stopPropagation()}
            >
                ${o}
            </ha-select>
        `}buildSwitchField(e,t,i,n){return"boolean"!=typeof i&&(i=n),r`
            <ha-selector-boolean>
                <label for="display_header">${e}</label>
                <ha-switch
                    name="${t}"
                    .checked=${i}
                    .configValue="${t}"
                    @change=${this._valueChanged}
                ></ha-switch>
            </ha-selector-boolean>
        `}buildNumberField(e,t,i,n,a){return r`
            <ha-textfield type="number" step="${a||1}"
                 label="${e}"
                .value=${i||n}
                .configValue=${t}                
                @change=${this._valueChanged}
            >
        `}buildTextField(e,t,i,n){return r`
            <ha-textfield
                 label="${e}"
                .value=${i||n}
                .configValue=${t}                
                @change=${this._valueChanged}
                @keyup=${this._valueChanged}
            >
        `}buildEntityPickerField(e,t,i,n){const a=new RegExp("heitzfit4_[a-z_]+_"+n);return r`
            <ha-entity-picker
                label="${e}"
                .hass=${this.hass}
                .value=${i||""}
                .configValue=${t}
                .includeDomains="sensor"
                .entityFilter="${e=>a.test(e.entity_id)}"
                @value-changed=${this._valueChanged}
                allow-custom-entity
            ></ha-entity-picker>
        `}async loadEntityPicker(){if(window.customElements.get("ha-entity-picker"))return;const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement()}static get styles(){return d`
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
        `}}const h=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).prototype.html;customElements.define("heitzfit4-planning-card-editor",class extends c{render(){return this.hass&&this._config?h`
            ${this.buildEntityPickerField("Planning entity","entity",this._config.entity,"Planning")}
            ${this.buildNumberField("Days","days",this._config.days,7,1)}
            ${this.buildSwitchField("Only booked","only_booked",this._config.only_booked,!1)}
            ${this.buildSwitchField("Show actions","show_actions",this._config.show_actions,!0)}
            ${this.buildNumberField("Max days","max_days",this._config.max_days,null,1)}
        `:h``}});const g=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")).prototype.html;customElements.define("heitzfit4-booking-card-editor",class extends c{render(){return this.hass&&this._config?g`
            ${this.buildEntityPickerField("booking entity","entity",this._config.entity,"booking")}
            ${this.buildSwitchField("Display header","display_header",this._config.display_header)}
            ${this.buildSwitchField("Current week only","current_week_only",this._config.current_week_only)}
            ${this.buildSwitchField("Reduce done booking","reduce_done_booking",this._config.reduce_done_booking)}
            ${this.buildSwitchField("Display done booking","display_done_booking",this._config.display_done_booking)}
        `:g``}});
