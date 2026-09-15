const N = globalThis, B = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Z.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Z.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (s) => new ot(typeof s == "string" ? s : s + "", void 0, F), at = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[r + 1], s[0]);
  return new ot(e, s, F);
}, ft = (s, t) => {
  if (B) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = N.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
  }
}, K = B ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return gt(e);
})(s) : s;
const { is: $t, defineProperty: mt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: bt, getOwnPropertySymbols: _t, getPrototypeOf: vt } = Object, z = globalThis, Y = z.trustedTypes, At = Y ? Y.emptyScript : "", wt = z.reactiveElementPolyfillSupport, k = (s, t) => s, H = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? At : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, V = (s, t) => !$t(s, t), Q = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && mt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = yt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const h = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, h, i);
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
      const e = this.properties, i = [...bt(e), ..._t(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(K(n));
    } else t !== void 0 && e.push(K(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
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
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : H).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = i.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : H;
      this._$Em = n;
      const h = o.fromAttribute(e, r.type);
      this[n] = h ?? this._$Ej?.get(n) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? V)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: o } = r, h = this[n];
        o !== !0 || this._$AL.has(n) || h === void 0 || this.C(n, void 0, r, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[k("elementProperties")] = /* @__PURE__ */ new Map(), A[k("finalized")] = /* @__PURE__ */ new Map(), wt?.({ ReactiveElement: A }), (z.reactiveElementVersions ??= []).push("2.1.2");
const q = globalThis, X = (s) => s, D = q.trustedTypes, tt = D ? D.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, lt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + y, xt = `<${ht}>`, v = document, P = () => v.createComment(""), T = (s) => s === null || typeof s != "object" && typeof s != "function", W = Array.isArray, Et = (s) => W(s) || typeof s?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, st = />/g, b = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, nt = /"/g, ct = /^(?:script|style|textarea|title)$/i, St = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = St(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), _ = v.createTreeWalker(v, 129);
function dt(s, t) {
  if (!W(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Ct = (s, t) => {
  const e = s.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
  for (let h = 0; h < e; h++) {
    const a = s[h];
    let u, p, c = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, p = o.exec(a), p !== null); ) $ = o.lastIndex, o === C ? p[1] === "!--" ? o = et : p[1] !== void 0 ? o = st : p[2] !== void 0 ? (ct.test(p[2]) && (n = RegExp("</" + p[2], "g")), o = b) : p[3] !== void 0 && (o = b) : o === b ? p[0] === ">" ? (o = n ?? C, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? b : p[3] === '"' ? nt : it) : o === nt || o === it ? o = b : o === et || o === st ? o = C : (o = b, n = void 0);
    const m = o === b && s[h + 1].startsWith("/>") ? " " : "";
    r += o === C ? a + xt : c >= 0 ? (i.push(u), a.slice(0, c) + lt + a.slice(c) + y + m) : a + y + (c === -2 ? h : m);
  }
  return [dt(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class M {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const h = t.length - 1, a = this.parts, [u, p] = Ct(t, e);
    if (this.el = M.createElement(u, i), _.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = _.nextNode()) !== null && a.length < h; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(lt)) {
          const $ = p[o++], m = n.getAttribute(c).split(y), U = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: r, name: U[2], strings: m, ctor: U[1] === "." ? Pt : U[1] === "?" ? Tt : U[1] === "@" ? Mt : L }), n.removeAttribute(c);
        } else c.startsWith(y) && (a.push({ type: 6, index: r }), n.removeAttribute(c));
        if (ct.test(n.tagName)) {
          const c = n.textContent.split(y), $ = c.length - 1;
          if ($ > 0) {
            n.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < $; m++) n.append(c[m], P()), _.nextNode(), a.push({ type: 2, index: ++r });
            n.append(c[$], P());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ht) a.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(y, c + 1)) !== -1; ) a.push({ type: 7, index: r }), c += y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = v.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(s, t, e = s, i) {
  if (t === x) return t;
  let n = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = T(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = n : e._$Cl = n), n !== void 0 && (t = E(s, n._$AS(s, t.values), n, i)), t;
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
    const { el: { content: e }, parts: i } = this._$AD, n = (t?.creationScope ?? v).importNode(e, !0);
    _.currentNode = n;
    let r = _.nextNode(), o = 0, h = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new R(r, r.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (u = new Ot(r, this, t)), this._$AV.push(u), a = i[++h];
      }
      o !== a?.index && (r = _.nextNode(), o++);
    }
    return _.currentNode = v, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = E(this, t, e), T(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = M.createElement(dt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new kt(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = rt.get(t.strings);
    return e === void 0 && rt.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new R(this.O(P()), this.O(P()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = X(t).nextSibling;
      X(t).remove(), t = i;
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
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = E(this, t, e, 0), o = !T(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const h = t;
      let a, u;
      for (t = r[0], a = 0; a < r.length - 1; a++) u = E(this, h[i + a], e, a), u === x && (u = this._$AH[a]), o ||= !T(u) || u !== this._$AH[a], u === l ? t = l : t !== l && (t += (u ?? "") + r[a + 1]), this._$AH[a] = u;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Tt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Mt extends L {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? l) === x) return;
    const i = this._$AH, n = t === l && i !== l || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== l && (i === l || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
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
const Ut = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = n = new R(t.insertBefore(P(), r), r, void 0, e ?? {});
  }
  return n._$AI(s), n;
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
const ut = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
const Ht = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: V }, Dt = (s = Ht, t, e) => {
  const { kind: i, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), r.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, s, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, s, h), h;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, s, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function J(s) {
  return (t, e) => typeof e == "object" ? Dt(s, t, e) : ((i, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(s, t, e);
}
function S(s) {
  return J({ ...s, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, f = (s, t, e, i) => {
  for (var n = i > 1 ? void 0 : i ? Lt(t, e) : t, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = (i ? o(t, e, n) : o(n)) || n);
  return i && n && zt(t, e, n), n;
};
const It = "1.3.0", j = {
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
}, jt = (s) => new Promise((t) => window.setTimeout(t, s));
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
  setConfig(s) {
    if (!s?.entity)
      throw new Error("The 'entity' property is required.");
    if (s.days !== void 0 && (!Number.isInteger(s.days) || s.days < 1))
      throw new Error("The 'days' property must be an integer greater than 0.");
    this.config = { ...j, ...s };
  }
  getCardSize() {
    const s = this.getVisibleDays().reduce(
      (t, [, e]) => t + e.length,
      0
    );
    return Math.max(2, Math.ceil(s * 1.2));
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
    const s = this.getEntity();
    if (!s) return {};
    const t = s.attributes.planning;
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
    try {
      const e = JSON.parse(s.state);
      return !Array.isArray(e) && "planning" in e && e.planning ? e.planning : e;
    } catch {
      return {};
    }
  }
  localDateKey(s = /* @__PURE__ */ new Date()) {
    return [
      s.getFullYear(),
      String(s.getMonth() + 1).padStart(2, "0"),
      String(s.getDate()).padStart(2, "0")
    ].join("-");
  }
  shouldHideActivity(s, t) {
    if (s !== this.localDateKey()) return !1;
    const e = Date.now(), i = Date.parse(t.start), n = Date.parse(t.end);
    return !Number.isFinite(i) || !Number.isFinite(n) ? !1 : n <= e ? !0 : !!(this.config?.hide_ongoing && i <= e && e < n);
  }
  getVisibleDays() {
    const s = this.config?.days ?? j.days, t = this.config?.only_booked ?? j.only_booked;
    return Object.entries(this.getPlanning()).sort(([e], [i]) => e.localeCompare(i)).map(
      ([e, i]) => [
        e,
        (Array.isArray(i) ? i : []).filter((n) => !n.deleted).filter(
          (n) => !this.shouldHideActivity(e, n)
        ).filter((n) => !t || n.booked).sort(
          (n, r) => Date.parse(n.start) - Date.parse(r.start)
        )
      ]
    ).filter(([, e]) => e.length > 0).slice(0, s);
  }
  formatDay(s) {
    const t = /* @__PURE__ */ new Date(`${s}T12:00:00`), e = this.uiLanguage === "fr" ? "fr-FR" : "en-GB";
    return new Intl.DateTimeFormat(e, {
      weekday: "long",
      day: "numeric",
      month: "short"
    }).format(t).replace(".", "").toLocaleUpperCase(e);
  }
  formatTime(s) {
    const t = this.uiLanguage === "fr" ? "fr-FR" : "en-GB", e = new Intl.DateTimeFormat(t, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).formatToParts(new Date(s)), i = e.find((r) => r.type === "hour")?.value ?? "--", n = e.find((r) => r.type === "minute")?.value ?? "--";
    return this.uiLanguage === "fr" ? `${i}h${n}` : `${i}:${n}`;
  }
  entityRevision(s) {
    if (!s) return "missing";
    let t = "";
    try {
      t = JSON.stringify(s.attributes.planning ?? null);
    } catch {
      t = "unserializable";
    }
    return [s.last_updated ?? "", s.state, t].join("|");
  }
  async waitForEntityRefresh(s, t, e = 3e4) {
    const i = Date.now() + e;
    for (; Date.now() < i; ) {
      const n = this.hass?.states[s];
      if (this.entityRevision(n) !== t)
        return await this.updateComplete, !0;
      await jt(400);
    }
    return !1;
  }
  showToast(s) {
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        bubbles: !0,
        composed: !0,
        detail: { message: s }
      })
    );
  }
  async runAction(s) {
    if (!this.hass || !this.config || this.pendingActivityId) return;
    const t = String(s.id), e = s.booked, i = this.config.entity, n = this.entityRevision(this.hass.states[i]);
    this.pendingActivityId = t, this.refreshing = !0, this.errorMessage = void 0, this.successMessage = void 0;
    try {
      await this.hass.callService(
        "heitzfit4",
        e ? "delete_activity" : "book_activity",
        { activity_id: t }
      ), await this.hass.callService("homeassistant", "update_entity", {
        entity_id: i
      });
      const r = await this.waitForEntityRefresh(
        i,
        n
      ), o = e ? this.labels.cancelSuccess : this.labels.bookedSuccess;
      r ? (this.successMessage = o, this.showToast(o), this.requestUpdate()) : (this.errorMessage = this.labels.refreshTimeout, this.showToast(this.labels.refreshTimeout));
    } catch (r) {
      console.error("HeitzFit4 Planning Card action failed:", r), this.errorMessage = this.labels.actionError, this.showToast(this.labels.actionError);
    } finally {
      this.pendingActivityId = void 0, this.refreshing = !1;
    }
  }
  renderAction(s) {
    if (!this.config?.show_actions) return l;
    const t = s.placesTaken >= s.placesMax, e = this.pendingActivityId === String(s.id);
    return !s.booked && t ? d`<span class="status full-label">${this.labels.full}</span>` : d`
      <button
        class=${s.booked ? "action cancel" : "action book"}
        ?disabled=${e || this.refreshing}
        aria-label=${s.booked ? this.labels.cancel : this.labels.book}
        title=${s.booked ? this.labels.cancel : this.labels.book}
        @click=${() => this.runAction(s)}
      >
        ${e ? d`<span class="spinner" aria-hidden="true"></span>` : s.booked ? this.labels.cancel : "+"}
      </button>
    `;
  }
  renderActivity(s) {
    const t = s.placesTaken >= s.placesMax;
    return d`
      <article class="activity ${s.booked ? "is-booked" : ""}">
        <div class="times">
          <time datetime=${s.start}>${this.formatTime(s.start)}</time>
          <time datetime=${s.end}>${this.formatTime(s.end)}</time>
        </div>

        <div class="separator" aria-hidden="true"></div>

        <div class="details">
          <div class="activity-line">
            <strong>${s.activity?.trim() || "-"}</strong>
            ${this.renderAction(s)}
          </div>
          <div class="meta">
            <span>${s.room?.trim() || "-"}</span>
            <span class="capacity ${t ? "full" : ""}">
              (${s.placesTaken}/${s.placesMax})
            </span>
            ${s.booked ? d`<span class="booked-label">${this.labels.booked}</span>` : l}
          </div>
        </div>
      </article>
    `;
  }
  render() {
    if (!this.config || !this.hass) return d``;
    const s = this.getEntity(), t = this.getPlanning(), e = this.getVisibleDays(), i = Object.keys(t).length === 0;
    return d`
      <ha-card>
        ${this.config.logo || this.config.title ? d`
              <header class="card-header">
                ${this.config.logo ? d`<img
                      src=${this.config.logo}
                      alt=${this.config.title || "HeitzFit4"}
                    />` : l}
                ${this.config.title ? d`<h2>${this.config.title}</h2>` : l}
              </header>
            ` : l}

        ${this.refreshing ? d`<ha-linear-progress indeterminate></ha-linear-progress>` : l}

        <div class="content">
          ${s ? l : d`<ha-alert alert-type="error">
                ${this.labels.unavailable}: ${this.config.entity}
              </ha-alert>`}

          ${s && i ? d`<ha-alert alert-type="warning">
                ${this.labels.invalidPlanning}
              </ha-alert>` : l}

          ${this.errorMessage ? d`<ha-alert alert-type="error">${this.errorMessage}</ha-alert>` : l}

          ${this.successMessage ? d`<ha-alert alert-type="success">${this.successMessage}</ha-alert>` : l}

          ${this.refreshing ? d`<div class="refreshing-text">${this.labels.refreshing}</div>` : l}

          ${s && !i && e.length === 0 ? d`<p class="empty">${this.labels.empty}</p>` : l}

          ${e.map(
      ([n, r]) => d`
              <section>
                <h3>${this.formatDay(n)}</h3>
                ${r.map((o) => this.renderActivity(o))}
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
      grid-template-columns: 58px 3px minmax(0, 1fr);
      gap: 12px;
      min-height: 56px;
      padding: 5px 0;
    }

    .times {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-size: 14px;
      line-height: 1.2;
    }

    .separator {
      border-radius: 999px;
      background: var(--divider-color, #9e9e9e);
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
      min-height: 28px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .activity-line strong {
      overflow-wrap: anywhere;
      font-size: 15px;
      letter-spacing: 0.02em;
    }

    .meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
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
      flex: 0 0 auto;
      min-width: 30px;
      min-height: 30px;
      padding: 4px 9px;
      border: 0;
      border-radius: 15px;
      cursor: pointer;
      font: inherit;
      font-weight: 800;
    }

    .action.book {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 20px;
      line-height: 1;
    }

    .action.cancel {
      background: color-mix(
        in srgb,
        var(--error-color, #db4437) 14%,
        transparent
      );
      color: var(--error-color, #db4437);
      font-size: 12px;
    }

    .action:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    .status {
      align-self: center;
      font-size: 12px;
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

      .times,
      .meta {
        font-size: 12px;
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
  setConfig(s) {
    this.config = {
      ...g.getStubConfig(),
      ...s
    };
  }
  get editorLanguage() {
    return this.config.language === "fr" || this.config.language === "en" ? this.config.language : (this.hass?.locale?.language || this.hass?.language || navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  }
  get labels() {
    return pt[this.editorLanguage];
  }
  updateConfig(s, t) {
    this.config = { ...this.config, [s]: t }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  inputValue(s) {
    return s.target.value;
  }
  renderSwitch(s, t) {
    return d`
      <div class="switch-row">
        <span>${t}</span>
        <ha-switch
          .checked=${!!this.config[s]}
          @change=${(e) => this.updateConfig(
      s,
      e.target.checked
    )}
        ></ha-switch>
      </div>
    `;
  }
  render() {
    return d`
      <div class="editor">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity}
          .includeDomains=${["sensor"]}
          label=${this.labels.entity}
          allow-custom-entity
          @value-changed=${(s) => this.updateConfig("entity", s.detail.value)}
        ></ha-entity-picker>

        <ha-textfield
          label=${this.labels.days}
          type="number"
          min="1"
          step="1"
          .value=${String(this.config.days ?? 7)}
          @change=${(s) => this.updateConfig(
      "days",
      Math.max(1, Number(this.inputValue(s)) || 7)
    )}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.title}
          .value=${this.config.title ?? ""}
          @change=${(s) => this.updateConfig("title", this.inputValue(s))}
        ></ha-textfield>

        <ha-textfield
          label=${this.labels.logo}
          .value=${this.config.logo ?? ""}
          @change=${(s) => this.updateConfig("logo", this.inputValue(s))}
        ></ha-textfield>

        <ha-select
          label=${this.labels.language}
          .value=${this.config.language ?? "auto"}
          @selected=${(s) => this.updateConfig("language", s.detail.value)}
          @closed=${(s) => s.stopPropagation()}
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
  `%c HEITZFIT4-PLANNING-CARD %c v${It} `,
  "color:white;background:#2eaf65;font-weight:bold",
  "color:#2eaf65;background:white"
);
export {
  g as Heitzfit4PlanningCard,
  O as Heitzfit4PlanningCardEditor
};
//# sourceMappingURL=heitzfit4-planning-card.js.map
