const N = globalThis, B = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let rt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Z.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (i) => new rt(typeof i == "string" ? i : i + "", void 0, F), at = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new rt(e, i, F);
}, ft = (i, t) => {
  if (B) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = N.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, K = B ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return gt(e);
})(i) : i;
const { is: $t, defineProperty: mt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: bt, getOwnPropertySymbols: _t, getPrototypeOf: vt } = Object, D = globalThis, Y = D.trustedTypes, At = Y ? Y.emptyScript : "", wt = D.reactiveElementPolyfillSupport, k = (i, t) => i, H = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? At : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, V = (i, t) => !$t(i, t), Q = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && mt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = yt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const l = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = vt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, s = [...bt(e), ..._t(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(K(n));
    } else t !== void 0 && e.push(K(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : H;
      this._$Em = n;
      const l = r.fromAttribute(e, o.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? V)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: r } = o, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[k("elementProperties")] = /* @__PURE__ */ new Map(), A[k("finalized")] = /* @__PURE__ */ new Map(), wt?.({ ReactiveElement: A }), (D.reactiveElementVersions ??= []).push("2.1.2");
const q = globalThis, X = (i) => i, z = q.trustedTypes, tt = z ? z.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, lt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + y, xt = `<${ht}>`, v = document, P = () => v.createComment(""), T = (i) => i === null || typeof i != "object" && typeof i != "function", W = Array.isArray, Et = (i) => W(i) || typeof i?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, it = />/g, b = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, nt = /"/g, ct = /^(?:script|style|textarea|title)$/i, St = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), p = St(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), _ = v.createTreeWalker(v, 129);
function dt(i, t) {
  if (!W(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Ct = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = C;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let d, u, c = -1, $ = 0;
    for (; $ < a.length && (r.lastIndex = $, u = r.exec(a), u !== null); ) $ = r.lastIndex, r === C ? u[1] === "!--" ? r = et : u[1] !== void 0 ? r = it : u[2] !== void 0 ? (ct.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = b) : u[3] !== void 0 && (r = b) : r === b ? u[0] === ">" ? (r = n ?? C, c = -1) : u[1] === void 0 ? c = -2 : (c = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? b : u[3] === '"' ? nt : st) : r === nt || r === st ? r = b : r === et || r === it ? r = C : (r = b, n = void 0);
    const m = r === b && i[l + 1].startsWith("/>") ? " " : "";
    o += r === C ? a + xt : c >= 0 ? (s.push(d), a.slice(0, c) + lt + a.slice(c) + y + m) : a + y + (c === -2 ? l : m);
  }
  return [dt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [d, u] = Ct(t, e);
    if (this.el = M.createElement(d, s), _.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = _.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(lt)) {
          const $ = u[r++], m = n.getAttribute(c).split(y), U = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: o, name: U[2], strings: m, ctor: U[1] === "." ? Pt : U[1] === "?" ? Tt : U[1] === "@" ? Mt : L }), n.removeAttribute(c);
        } else c.startsWith(y) && (a.push({ type: 6, index: o }), n.removeAttribute(c));
        if (ct.test(n.tagName)) {
          const c = n.textContent.split(y), $ = c.length - 1;
          if ($ > 0) {
            n.textContent = z ? z.emptyScript : "";
            for (let m = 0; m < $; m++) n.append(c[m], P()), _.nextNode(), a.push({ type: 2, index: ++o });
            n.append(c[$], P());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ht) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(y, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += y.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(i, t, e = i, s) {
  if (t === x) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = T(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = E(i, n._$AS(i, t.values), n, s)), t;
}
class kt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? v).importNode(e, !0);
    _.currentNode = n;
    let o = _.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new R(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Ot(o, this, t)), this._$AV.push(d), a = s[++l];
      }
      r !== a?.index && (o = _.nextNode(), r++);
    }
    return _.currentNode = v, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), T(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(dt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new kt(n, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new R(this.O(P()), this.O(P()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = X(t).nextSibling;
      X(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = E(this, t, e, 0), r = !T(t) || t !== this._$AH && t !== x, r && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, l[s + a], e, a), d === x && (d = this._$AH[a]), r ||= !T(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Tt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Mt extends L {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? h) === x) return;
    const s = this._$AH, n = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== h && (s === h || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Rt = q.litHtmlPolyfillSupport;
Rt?.(M, R), (q.litHtmlVersions ??= []).push("3.3.3");
const Ut = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new R(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
const G = globalThis;
class w extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
w._$litElement$ = !0, w.finalized = !0, G.litElementHydrateSupport?.({ LitElement: w });
const Nt = G.litElementPolyfillSupport;
Nt?.({ LitElement: w });
(G.litElementVersions ??= []).push("4.2.2");
const ut = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const Ht = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: V }, zt = (i = Ht, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function J(i) {
  return (t, e) => typeof e == "object" ? zt(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
function S(i) {
  return J({ ...i, state: !0, attribute: !1 });
}
var Dt = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, f = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Lt(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Dt(t, e, n), n;
};
const jt = "1.3.0", I = {
  days: 7,
  only_booked: !1,
  show_actions: !0,
  hide_ongoing: !1,
  language: "auto"
}, pt = {
  fr: {
    unavailable: "Entité indisponible",
    invalidPlanning: "Le capteur ne contient pas de planning valide",
    empty: "Aucune activité à afficher",
    book: "Réserver",
    cancel: "Annuler",
    full: "Complet",
    booked: "Réservé",
    refreshing: "Actualisation du planning…",
    bookedSuccess: "Réservation effectuée",
    cancelSuccess: "Réservation annulée",
    actionError: "L’action a échoué",
    refreshTimeout: "L’action a réussi, mais l’actualisation du capteur n’a pas été détectée",
    entity: "Entité du planning",
    days: "Nombre de jours",
    title: "Titre facultatif",
    logo: "URL du logo facultative",
    language: "Langue",
    automatic: "Automatique",
    onlyBooked: "Afficher uniquement les activités réservées",
    hideOngoing: "Masquer les séances en cours",
    showActions: "Afficher les actions Réserver / Annuler"
  },
  en: {
    unavailable: "Entity unavailable",
    invalidPlanning: "The sensor does not contain a valid planning attribute",
    empty: "No activities to display",
    book: "Book",
    cancel: "Cancel",
    full: "Full",
    booked: "Booked",
    refreshing: "Refreshing planning…",
    bookedSuccess: "Booking completed",
    cancelSuccess: "Booking cancelled",
    actionError: "The action failed",
    refreshTimeout: "The action succeeded, but the sensor refresh was not detected",
    entity: "Planning entity",
    days: "Number of days",
    title: "Optional title",
    logo: "Optional logo URL",
    language: "Language",
    automatic: "Automatic",
    onlyBooked: "Show booked activities only",
    hideOngoing: "Hide ongoing sessions",
    showActions: "Show Book / Cancel actions"
  }
}, It = (i) => new Promise((t) => window.setTimeout(t, i));
let g = class extends w {
  constructor() {
    super(...arguments), this.refreshing = !1;
  }
  static async getConfigElement() {
    return document.createElement("heitzfit4-planning-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:heitzfit4-planning-card",
      entity: "sensor.heitzfit4_planning",
      days: 7,
      only_booked: !1,
      show_actions: !0,
      hide_ongoing: !1,
      logo: "/local/images/logo_globalfit.png",
      language: "auto"
    };
  }
  setConfig(i) {
    if (!i?.entity)
      throw new Error("The 'entity' property is required.");
    if (i.days !== void 0 && (!Number.isInteger(i.days) || i.days < 1))
      throw new Error("The 'days' property must be an integer greater than 0.");
    this.config = { ...I, ...i };
  }
  getCardSize() {
    const i = this.getVisibleDays().reduce(
      (t, [, e]) => t + e.length,
      0
    );
    return Math.max(2, Math.ceil(i * 1.2));
  }
  get uiLanguage() {
    return this.config?.language === "fr" || this.config?.language === "en" ? this.config.language : (this.hass?.locale?.language || this.hass?.language || navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  }
  get labels() {
    return pt[this.uiLanguage];
  }
  getEntity() {
    if (!(!this.hass || !this.config))
      return this.hass.states[this.config.entity];
  }
  getPlanning() {
    const i = this.getEntity();
    if (!i) return {};
    const t = i.attributes.planning;
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
    try {
      const e = JSON.parse(i.state);
      return !Array.isArray(e) && "planning" in e && e.planning ? e.planning : e;
    } catch {
      return {};
    }
  }
  localDateKey(i = /* @__PURE__ */ new Date()) {
    return [
      i.getFullYear(),
      String(i.getMonth() + 1).padStart(2, "0"),
      String(i.getDate()).padStart(2, "0")
    ].join("-");
  }
  shouldHideActivity(i, t) {
    if (i !== this.localDateKey()) return !1;
    const e = Date.now(), s = Date.parse(t.start), n = Date.parse(t.end);
    return !Number.isFinite(s) || !Number.isFinite(n) ? !1 : n <= e ? !0 : !!(this.config?.hide_ongoing && s <= e && e < n);
  }
  getVisibleDays() {
    const i = this.config?.days ?? I.days, t = this.config?.only_booked ?? I.only_booked;
    return Object.entries(this.getPlanning()).sort(([e], [s]) => e.localeCompare(s)).map(
      ([e, s]) => [
        e,
        (Array.isArray(s) ? s : []).filter((n) => !n.deleted).filter(
          (n) => !this.shouldHideActivity(e, n)
        ).filter((n) => !t || n.booked).sort(
          (n, o) => Date.parse(n.start) - Date.parse(o.start)
        )
      ]
    ).filter(([, e]) => e.length > 0).slice(0, i);
  }
  formatDay(i) {
    const t = /* @__PURE__ */ new Date(`${i}T12:00:00`), e = this.uiLanguage === "fr" ? "fr-FR" : "en-GB";
    return new Intl.DateTimeFormat(e, {
      weekday: "long",
      day: "numeric",
      month: "short"
    }).format(t).replace(".", "").toLocaleUpperCase(e);
  }
  formatTime(i) {
    const t = this.uiLanguage === "fr" ? "fr-FR" : "en-GB", e = new Intl.DateTimeFormat(t, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).formatToParts(new Date(i)), s = e.find((o) => o.type === "hour")?.value ?? "--", n = e.find((o) => o.type === "minute")?.value ?? "--";
    return this.uiLanguage === "fr" ? `${s}h${n}` : `${s}:${n}`;
  }
  entityRevision(i) {
    if (!i) return "missing";
    let t = "";
    try {
      t = JSON.stringify(i.attributes.planning ?? null);
    } catch {
      t = "unserializable";
    }
    return [i.last_updated ?? "", i.state, t].join("|");
  }
  async waitForEntityRefresh(i, t, e = 3e4) {
    const s = Date.now() + e;
    for (; Date.now() < s; ) {
      const n = this.hass?.states[i];
      if (this.entityRevision(n) !== t)
        return await this.updateComplete, !0;
      await It(400);
    }
    return !1;
  }
  showToast(i) {
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        bubbles: !0,
        composed: !0,
        detail: { message: i }
      })
    );
  }
  async runAction(i) {
    if (!this.hass || !this.config || this.pendingActivityId)
      return;
    const t = String(i.id), e = i.booked, s = this.config.entity, n = this.entityRevision(
      this.hass.states[s]
    );
    this.pendingActivityId = t, this.refreshing = !0, this.errorMessage = void 0, this.successMessage = void 0;
    try {
      if (e) {
        if (i.id_booking === void 0 || i.id_booking === null || i.id_booking === "")
          throw new Error(
            "Missing id_booking for cancellation"
          );
        console.log(
          "Cancelling booking",
          i.id_booking
        ), await this.hass.callService(
          "heitzfit4",
          "delete_activity",
          {
            booking_id: String(
              i.id_booking
            )
          }
        );
      } else
        console.log(
          "Booking activity",
          i.id
        ), await this.hass.callService(
          "heitzfit4",
          "book_activity",
          {
            activity_id: t
          }
        );
      await this.hass.callService(
        "homeassistant",
        "update_entity",
        {
          entity_id: s
        }
      );
      const o = await this.waitForEntityRefresh(
        s,
        n
      ), r = e ? this.labels.cancelSuccess : this.labels.bookedSuccess;
      o ? (this.successMessage = r, this.showToast(
        r
      ), this.requestUpdate()) : (this.errorMessage = this.labels.refreshTimeout, this.showToast(
        this.labels.refreshTimeout
      ));
    } catch (o) {
      console.error(
        "HeitzFit4 Planning Card action failed:",
        o
      ), o instanceof Error && o.message.includes(
        "Missing id_booking"
      ) ? this.errorMessage = "id_booking absent pour cette réservation" : this.errorMessage = this.labels.actionError, this.showToast(
        this.errorMessage
      );
    } finally {
      this.pendingActivityId = void 0, this.refreshing = !1;
    }
  }
  renderAction(i) {
    if (!this.config?.show_actions) return h;
    const t = i.placesTaken >= i.placesMax, e = this.pendingActivityId === String(i.id);
    return !i.booked && t ? p`<span class="status full-label">${this.labels.full}</span>` : p`
      <button
        class=${i.booked ? "action cancel" : "action book"}
        ?disabled=${e || this.refreshing}
        aria-label=${i.booked ? this.labels.cancel : this.labels.book}
        title=${i.booked ? this.labels.cancel : this.labels.book}
        @click=${() => this.runAction(i)}
      >
        ${e ? p`<span class="spinner" aria-hidden="true"></span>` : i.booked ? "x" : "+"}
      </button>
    `;
  }
  renderActivity(i) {
    const t = i.placesTaken >= i.placesMax;
    return p`
      <article class="activity ${i.booked ? "is-booked" : ""}">
        <div class="times">
          <time datetime=${i.start}>${this.formatTime(i.start)}</time>
          <time datetime=${i.end}>${this.formatTime(i.end)}</time>
        </div>

        <div class="separator" aria-hidden="true"></div>

        <div class="details">
          <div class="activity-line">
            <strong>${i.activity?.trim() || "-"}</strong>
            ${this.renderAction(i)}
          </div>
          <div class="meta">
            <span>${i.room?.trim() || "-"}</span>
            <span class="capacity ${t ? "full" : ""}">
              (${i.placesTaken}/${i.placesMax})
            </span>
            ${i.booked ? p`<span class="booked-label">${this.labels.booked}</span>` : h}
          </div>
        </div>
      </article>
    `;
  }
  render() {
    if (!this.config || !this.hass) return p``;
    const i = this.getEntity(), t = this.getPlanning(), e = this.getVisibleDays();
    return Object.keys(t).length, p`
    <ha-card>
    ${this.config.logo || this.config.title ? p`
        <header class="card-header">
                ${this.config.logo ? p`<img
                      src=${this.config.logo}
                      alt=${this.config.title || "HeitzFit4"}
                    />` : h}
                ${this.config.title ? p`<h2>${this.config.title}</h2>` : h}
        </header>
            ` : h}
      ${this.refreshing ? p`
            <ha-linear-progress
              indeterminate
            ></ha-linear-progress>
          ` : h}
      <div class="content">

        ${i ? h : p`
              <ha-alert alert-type="error">
                ${this.labels.unavailable}
                :
                ${this.config.entity}
              </ha-alert>
            `}

        ${e.map(
      ([s, n]) => p`
            <section>

              <h3>
                📅 ${this.formatDay(s)}
              </h3>

              ${n.map(
        (o) => this.renderActivity(
          o
        )
      )}
            </section>
          `
    )}
      </div>
    </ha-card>
  `;
  }
};
g.styles = at`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }

    ha-linear-progress {
      display: block;
      width: 100%;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 4px;
    }

    .card-header img {
      display: block;
      max-width: 150px;
      max-height: 46px;
      object-fit: contain;
    }

    .card-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .content {
      padding: 12px 16px 16px;
    }

    section + section {
      margin-top: 22px;
    }

    h3 {
      margin: 0 0 10px;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.045em;
    }

    .activity {

      display: grid;

      grid-template-columns:
        56px
        3px
        minmax(0, 1fr);

      gap: 10px;

      min-height: 44px;

      padding: 3px 0;

      align-items: start;
    }

    .times {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 2px;
      padding-top: 1px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-size: 13px;
      line-height: 1;
    }

    .separator {
      width: 3px;
      min-height: 36px;
      align-self: stretch;
      border-radius: 999px;
      background: var(
        --divider-color,
        #9e9e9e
      );
    }

    .activity.is-booked .separator {
      background: var(--success-color, #2eaf65);
    }

    .details {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .activity-line {
      min-height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .activity-line strong {
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.02em;
    }

    .meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;

      color: var(--secondary-text-color);

      font-size: 12px;
      line-height: 1.1;
    }

    .capacity.full,
    .full-label {
      color: var(--error-color, #db4437);
      font-weight: 800;
    }

    .booked-label {
      color: var(--success-color, #2eaf65);
      font-weight: 700;
    }

    .action {
      min-width: 22px;
      width: 22px;
      min-height: 22px;
      height: 22px;
      padding: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      line-height: 1;
    }

    .action.book {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 20px;
      line-height: 1;
    }

    .action.cancel {
      background:
        color-mix(
          in srgb,
          var(--error-color, #db4437) 14%,
          transparent
        );
      color:
        var(--error-color, #db4437);
      font-size: 18px;
      font-weight: 900;
    }

    .action:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    .status {
      align-self: center;
      font-size: 12px;
    }

    .logo {
      max-width: 120px;
      max-height: 50px;
      object-fit: contain;
    }

    .header-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 12px;
    }

    .planning-title {
      font-size: 28px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 1px;
    }

    .planning-subtitle {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .spinner {
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .refreshing-text,
    .empty {
      margin: 12px 0;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    ha-alert {
      display: block;
      margin-bottom: 12px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 370px) {
      .content {
        padding-inline: 12px;
      }

      .activity {
        grid-template-columns: 52px 3px minmax(0, 1fr);
        gap: 9px;
      }

      .times {
        font-size: 12px;
        line-height: 1.1;
      }
    }
  `;
f([
  J({ attribute: !1 })
], g.prototype, "hass", 2);
f([
  S()
], g.prototype, "config", 2);
f([
  S()
], g.prototype, "pendingActivityId", 2);
f([
  S()
], g.prototype, "refreshing", 2);
f([
  S()
], g.prototype, "errorMessage", 2);
f([
  S()
], g.prototype, "successMessage", 2);
g = f([
  ut("heitzfit4-planning-card")
], g);
let O = class extends w {
  constructor() {
    super(...arguments), this.config = g.getStubConfig();
  }
  setConfig(i) {
    this.config = {
      ...g.getStubConfig(),
      ...i
    };
  }
  get editorLanguage() {
    return this.config.language === "fr" || this.config.language === "en" ? this.config.language : (this.hass?.locale?.language || this.hass?.language || navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  }
  get labels() {
    return pt[this.editorLanguage];
  }
  updateConfig(i, t) {
    this.config = { ...this.config, [i]: t }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  inputValue(i) {
    return i.target.value;
  }
  renderSwitch(i, t) {
    return p`
      <div class="switch-row">
        <span>${t}</span>
        <ha-switch
          .checked=${!!this.config[i]}
          @change=${(e) => this.updateConfig(
      i,
      e.target.checked
    )}
        ></ha-switch>
      </div>
    `;
  }
  render() {
    return p`
      <div class="editor">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity}
          .includeDomains=${["sensor"]}
          label=${this.labels.entity}
          allow-custom-entity
          @value-changed=${(i) => this.updateConfig("entity", i.detail.value)}
        ></ha-entity-picker>

        <ha-textfield
          label=${this.labels.days}
          type="number"
          min="1"
          step="1"
          .value=${String(this.config.days ?? 7)}
          @change=${(i) => this.updateConfig(
      "days",
      Math.max(1, Number(this.inputValue(i)) || 7)
    )}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.title}
          .value=${this.config.title ?? ""}
          @change=${(i) => this.updateConfig("title", this.inputValue(i))}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.logo}
          .value=${this.config.logo ?? ""}
          @change=${(i) => this.updateConfig("logo", this.inputValue(i))}
        ></ha-textfield>

        <ha-select
          label=${this.labels.language}
          .value=${this.config.language ?? "auto"}
          @selected=${(i) => this.updateConfig("language", i.detail.value)}
          @closed=${(i) => i.stopPropagation()}
        >
          <mwc-list-item value="auto">${this.labels.automatic}</mwc-list-item>
          <mwc-list-item value="fr">Français</mwc-list-item>
          <mwc-list-item value="en">English</mwc-list-item>
        </ha-select>

        ${this.renderSwitch("only_booked", this.labels.onlyBooked)}
        ${this.renderSwitch("hide_ongoing", this.labels.hideOngoing)}
        ${this.renderSwitch("show_actions", this.labels.showActions)}
      </div>
    `;
  }
};
O.styles = at`
    .editor {
      display: grid;
      gap: 16px;
      padding: 8px 0;
    }

    ha-entity-picker,
    ha-textfield,
    ha-select {
      display: block;
      width: 100%;
    }

    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .switch-row span {
      color: var(--primary-text-color);
    }
  `;
f([
  J({ attribute: !1 })
], O.prototype, "hass", 2);
f([
  S()
], O.prototype, "config", 2);
O = f([
  ut("heitzfit4-planning-card-editor")
], O);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "heitzfit4-planning-card",
  name: "HeitzFit4 Planning Card",
  description: "HeitzFit4 planning with booking and cancellation actions.",
  preview: !0
});
console.info(
  `%c HEITZFIT4-PLANNING-CARD %c v${jt} `,
  "color:white;background:#2eaf65;font-weight:bold",
  "color:#2eaf65;background:white"
);
export {
  g as Heitzfit4PlanningCard,
  O as Heitzfit4PlanningCardEditor
};
//# sourceMappingURL=heitzfit4-planning-card.js.map
