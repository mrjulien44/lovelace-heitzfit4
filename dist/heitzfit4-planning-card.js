const N = globalThis, B = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), J = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ut = (i) => new ot(typeof i == "string" ? i : i + "", void 0, F), at = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new ot(e, i, F);
}, ft = (i, t) => {
  if (B) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = N.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, K = B ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ut(e);
})(i) : i;
const { is: gt, defineProperty: $t, getOwnPropertyDescriptor: mt, getOwnPropertyNames: yt, getOwnPropertySymbols: _t, getPrototypeOf: bt } = Object, z = globalThis, Y = z.trustedTypes, vt = Y ? Y.emptyScript : "", At = z.reactiveElementPolyfillSupport, C = (i, t) => i, H = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? vt : null;
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
} }, V = (i, t) => !gt(i, t), Q = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: V };
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
      const s = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && $t(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const l = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, s = [...yt(e), ..._t(e)];
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
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : H;
      this._$Em = n;
      const l = o.fromAttribute(e, r.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? V)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: o } = r, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[C("elementProperties")] = /* @__PURE__ */ new Map(), A[C("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: A }), (z.reactiveElementVersions ??= []).push("2.1.2");
const q = globalThis, X = (i) => i, R = q.trustedTypes, tt = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, lt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + m, wt = `<${ht}>`, v = document, k = () => v.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", W = Array.isArray, xt = (i) => W(i) || typeof i?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, it = />/g, _ = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, nt = /"/g, ct = /^(?:script|style|textarea|title)$/i, Et = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = Et(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), b = v.createTreeWalker(v, 129);
function dt(i, t) {
  if (!W(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const St = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let d, p, c = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, p = o.exec(a), p !== null); ) f = o.lastIndex, o === S ? p[1] === "!--" ? o = et : p[1] !== void 0 ? o = it : p[2] !== void 0 ? (ct.test(p[2]) && (n = RegExp("</" + p[2], "g")), o = _) : p[3] !== void 0 && (o = _) : o === _ ? p[0] === ">" ? (o = n ?? S, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? _ : p[3] === '"' ? nt : st) : o === nt || o === st ? o = _ : o === et || o === it ? o = S : (o = _, n = void 0);
    const $ = o === _ && i[l + 1].startsWith("/>") ? " " : "";
    r += o === S ? a + wt : c >= 0 ? (s.push(d), a.slice(0, c) + lt + a.slice(c) + m + $) : a + m + (c === -2 ? l : $);
  }
  return [dt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, p] = St(t, e);
    if (this.el = T.createElement(d, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = b.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(lt)) {
          const f = p[o++], $ = n.getAttribute(c).split(m), M = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: r, name: M[2], strings: $, ctor: M[1] === "." ? kt : M[1] === "?" ? Pt : M[1] === "@" ? Tt : D }), n.removeAttribute(c);
        } else c.startsWith(m) && (a.push({ type: 6, index: r }), n.removeAttribute(c));
        if (ct.test(n.tagName)) {
          const c = n.textContent.split(m), f = c.length - 1;
          if (f > 0) {
            n.textContent = R ? R.emptyScript : "";
            for (let $ = 0; $ < f; $++) n.append(c[$], k()), b.nextNode(), a.push({ type: 2, index: ++r });
            n.append(c[f], k());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ht) a.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(m, c + 1)) !== -1; ) a.push({ type: 7, index: r }), c += m.length - 1;
      }
      r++;
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
  const r = P(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = E(i, n._$AS(i, t.values), n, s)), t;
}
class Ct {
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
    b.currentNode = n;
    let r = b.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new U(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Ot(r, this, t)), this._$AV.push(d), a = s[++l];
      }
      o !== a?.index && (r = b.nextNode(), o++);
    }
    return b.currentNode = v, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
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
    t = E(this, t, e), P(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement(dt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new Ct(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = rt.get(t.strings);
    return e === void 0 && rt.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new U(this.O(k()), this.O(k()), this, this.options)) : s = e[n], s._$AI(r), n++;
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
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = E(this, t, e, 0), o = !P(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = E(this, l[s + a], e, a), d === x && (d = this._$AH[a]), o ||= !P(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class kt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Pt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Tt extends D {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? h) === x) return;
    const s = this._$AH, n = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== h && (s === h || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
const Ut = q.litHtmlPolyfillSupport;
Ut?.(T, U), (q.litHtmlVersions ??= []).push("3.3.3");
const Mt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = n = new U(t.insertBefore(k(), r), r, void 0, e ?? {});
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Mt(e, this.renderRoot, this.renderOptions);
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
const pt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const Ht = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: V }, Rt = (i = Ht, t, e) => {
  const { kind: s, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Z(i) {
  return (t, e) => typeof e == "object" ? Rt(i, t, e) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(i, t, e);
}
function j(i) {
  return Z({ ...i, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, y = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Dt(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && zt(t, e, n), n;
};
const jt = "1.1.0", L = {
  days: 7,
  only_booked: !1,
  show_actions: !0,
  language: "auto"
}, It = {
  fr: {
    unavailable: "Entité indisponible",
    noPlanning: "Aucune activité à afficher",
    book: "Réserver",
    cancel: "Annuler",
    full: "Complet",
    booked: "Réservé",
    bookingError: "Échec de la réservation",
    cancelError: "Échec de l’annulation"
  },
  en: {
    unavailable: "Entity unavailable",
    noPlanning: "No activities to display",
    book: "Book",
    cancel: "Cancel",
    full: "Full",
    booked: "Booked",
    bookingError: "Booking failed",
    cancelError: "Cancellation failed"
  }
};
let g = class extends w {
  static async getConfigElement() {
    return document.createElement("heitzfit4-planning-card-editor");
  }
  setConfig(i) {
    if (!i?.entity) throw new Error("La propriété 'entity' est obligatoire.");
    if (i.days !== void 0 && (!Number.isInteger(i.days) || i.days < 1))
      throw new Error("La propriété 'days' doit être un entier supérieur ou égal à 1.");
    this.config = { ...L, ...i };
  }
  static getStubConfig() {
    return {
      type: "custom:heitzfit4-planning-card",
      entity: "sensor.heitzfit4_planning",
      days: 7,
      only_booked: !1,
      show_actions: !0,
      logo: "/local/images/logo_globalfit.png",
      language: "auto"
    };
  }
  getCardSize() {
    const i = this.getVisibleDays().reduce((t, [, e]) => t + e.length, 0);
    return Math.max(2, Math.ceil(i * 1.2));
  }
  get language() {
    const i = this.config?.language;
    return i === "fr" || i === "en" ? i : (this.hass?.locale?.language || this.hass?.language || navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  }
  get labels() {
    return It[this.language];
  }
  getPlanning() {
    if (!this.hass || !this.config) return {};
    const i = this.hass.states[this.config.entity];
    if (!i) return {};
    const t = i.attributes.planning;
    if (t && typeof t == "object" && !Array.isArray(t)) return t;
    try {
      const e = JSON.parse(i.state);
      return e?.planning ?? e ?? {};
    } catch {
      return {};
    }
  }
  getVisibleDays() {
    const i = this.config?.days ?? L.days, t = this.config?.only_booked ?? L.only_booked;
    return Object.entries(this.getPlanning()).sort(([e], [s]) => e.localeCompare(s)).map(([e, s]) => [
      e,
      (Array.isArray(s) ? s : []).filter((n) => !n.deleted).filter((n) => !this.isFinishedToday(e, n)).filter((n) => !t || n.booked).sort((n, r) => Date.parse(n.start) - Date.parse(r.start))
    ]).filter(([, e]) => e.length > 0).slice(0, i);
  }
  isFinishedToday(i, t) {
    const e = /* @__PURE__ */ new Date(), s = [
      e.getFullYear(),
      String(e.getMonth() + 1).padStart(2, "0"),
      String(e.getDate()).padStart(2, "0")
    ].join("-");
    return i === s && Date.parse(t.end) <= e.getTime();
  }
  formatDay(i) {
    const t = /* @__PURE__ */ new Date(`${i}T12:00:00`);
    return new Intl.DateTimeFormat(this.language === "fr" ? "fr-FR" : "en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short"
    }).format(t).replace(".", "").toLocaleUpperCase(this.language === "fr" ? "fr-FR" : "en-GB");
  }
  formatTime(i) {
    const t = new Intl.DateTimeFormat(this.language === "fr" ? "fr-FR" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).formatToParts(new Date(i)), e = t.find((n) => n.type === "hour")?.value ?? "--", s = t.find((n) => n.type === "minute")?.value ?? "--";
    return this.language === "fr" ? `${e}h${s}` : `${e}:${s}`;
  }
  async runAction(i) {
    if (!this.hass || !this.config || this.pendingActivityId) return;
    const t = String(i.id);
    this.pendingActivityId = t, this.actionError = void 0;
    try {
      await this.hass.callService(
        "heitzfit4",
        i.booked ? "delete_activity" : "book_activity",
        { activity_id: t }
      ), await this.hass.callService("homeassistant", "update_entity", { entity_id: this.config.entity });
    } catch (e) {
      console.error("HeitzFit4 Planning Card:", e), this.actionError = i.booked ? this.labels.cancelError : this.labels.bookingError;
    } finally {
      this.pendingActivityId = void 0;
    }
  }
  renderAction(i) {
    if (!this.config?.show_actions) return h;
    const t = i.placesTaken >= i.placesMax, e = this.pendingActivityId === String(i.id);
    return !i.booked && t ? u`<span class="status full-label">${this.labels.full}</span>` : u`
      <button
        class=${i.booked ? "action cancel" : "action book"}
        ?disabled=${e}
        aria-label=${i.booked ? this.labels.cancel : this.labels.book}
        title=${i.booked ? this.labels.cancel : this.labels.book}
        @click=${() => this.runAction(i)}
      >
        ${e ? u`<span class="spinner" aria-hidden="true"></span>` : i.booked ? this.labels.cancel : "+"}
      </button>
    `;
  }
  renderActivity(i) {
    const t = i.placesTaken >= i.placesMax;
    return u`
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
            <span class="capacity ${t ? "full" : ""}">(${i.placesTaken}/${i.placesMax})</span>
            ${i.booked ? u`<span class="booked-label">${this.labels.booked}</span>` : h}
          </div>
        </div>
      </article>
    `;
  }
  render() {
    if (!this.config || !this.hass) return u``;
    const i = this.hass.states[this.config.entity], t = this.getVisibleDays();
    return u`
      <ha-card>
        ${this.config.logo || this.config.title ? u`
          <header class="card-header">
            ${this.config.logo ? u`<img src=${this.config.logo} alt=${this.config.title || "HeitzFit4"} />` : h}
            ${this.config.title ? u`<h2>${this.config.title}</h2>` : h}
          </header>
        ` : h}
        <div class="content">
          ${i ? h : u`<ha-alert alert-type="error">${this.labels.unavailable}: ${this.config.entity}</ha-alert>`}
          ${this.actionError ? u`<ha-alert alert-type="error">${this.actionError}</ha-alert>` : h}
          ${i && t.length === 0 ? u`<p class="empty">${this.labels.noPlanning}</p>` : h}
          ${t.map(([e, s]) => u`
            <section>
              <h3>${this.formatDay(e)}</h3>
              ${s.map((n) => this.renderActivity(n))}
            </section>
          `)}
        </div>
      </ha-card>
    `;
  }
};
g.styles = at`
    :host { display: block; }
    ha-card { overflow: hidden; color: var(--primary-text-color); }
    .card-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px 4px; }
    .card-header img { display: block; max-width: 150px; max-height: 46px; object-fit: contain; }
    .card-header h2 { margin: 0; font-size: 20px; }
    .content { padding: 12px 16px 16px; }
    section + section { margin-top: 22px; }
    h3 { margin: 0 0 10px; font-size: 15px; font-weight: 800; letter-spacing: .045em; }
    .activity { display: grid; grid-template-columns: 58px 3px minmax(0, 1fr); gap: 12px; min-height: 56px; padding: 5px 0; }
    .times { display: flex; flex-direction: column; justify-content: space-between; text-align: right; font-variant-numeric: tabular-nums; font-size: 14px; line-height: 1.2; }
    .separator { border-radius: 999px; background: var(--divider-color, #9e9e9e); }
    .activity.is-booked .separator { background: var(--success-color, #2eaf65); }
    .details { min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
    .activity-line { min-height: 28px; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .activity-line strong { overflow-wrap: anywhere; font-size: 15px; letter-spacing: .02em; }
    .meta { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; color: var(--secondary-text-color); font-size: 13px; }
    .capacity.full, .full-label { color: var(--error-color, #db4437); font-weight: 800; }
    .booked-label { color: var(--success-color, #2eaf65); font-weight: 700; }
    .action { flex: 0 0 auto; min-width: 30px; min-height: 30px; padding: 4px 9px; border: 0; border-radius: 15px; cursor: pointer; font: inherit; font-weight: 800; }
    .action.book { background: var(--primary-color); color: var(--text-primary-color, #fff); font-size: 20px; line-height: 1; }
    .action.cancel { background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); color: var(--error-color, #db4437); font-size: 12px; }
    .action:disabled { opacity: .55; cursor: wait; }
    .status { align-self: center; font-size: 12px; }
    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
    .empty { margin: 18px 0; text-align: center; color: var(--secondary-text-color); }
    ha-alert { display: block; margin-bottom: 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 370px) {
      .content { padding-inline: 12px; }
      .activity { grid-template-columns: 52px 3px minmax(0, 1fr); gap: 9px; }
      .times, .meta { font-size: 12px; }
    }
  `;
y([
  Z({ attribute: !1 })
], g.prototype, "hass", 2);
y([
  j()
], g.prototype, "config", 2);
y([
  j()
], g.prototype, "pendingActivityId", 2);
y([
  j()
], g.prototype, "actionError", 2);
g = y([
  pt("heitzfit4-planning-card")
], g);
let O = class extends w {
  constructor() {
    super(...arguments), this.config = g.getStubConfig();
  }
  setConfig(i) {
    this.config = { ...g.getStubConfig(), ...i };
  }
  updateConfig(i, t) {
    this.config = { ...this.config, [i]: t }, this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config },
      bubbles: !0,
      composed: !0
    }));
  }
  textValue(i) {
    return i.target.value;
  }
  render() {
    return u`
      <div class="editor">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity}
          .includeDomains=${["sensor"]}
          label="Entité du planning"
          allow-custom-entity
          @value-changed=${(i) => this.updateConfig("entity", i.detail.value)}
        ></ha-entity-picker>

        <ha-textfield
          label="Nombre de jours"
          type="number"
          min="1"
          step="1"
          .value=${String(this.config.days ?? 7)}
          @change=${(i) => this.updateConfig("days", Math.max(1, Number(this.textValue(i)) || 7))}
        ></ha-textfield>

        <ha-textfield
          label="Titre (facultatif)"
          .value=${this.config.title ?? ""}
          @change=${(i) => this.updateConfig("title", this.textValue(i))}
        ></ha-textfield>

        <ha-textfield
          label="URL du logo (facultatif)"
          .value=${this.config.logo ?? ""}
          @change=${(i) => this.updateConfig("logo", this.textValue(i))}
        ></ha-textfield>

        <ha-select
          label="Langue"
          .value=${this.config.language ?? "auto"}
          @selected=${(i) => this.updateConfig("language", i.detail.value)}
          @closed=${(i) => i.stopPropagation()}
        >
          <mwc-list-item value="auto">Automatique</mwc-list-item>
          <mwc-list-item value="fr">Français</mwc-list-item>
          <mwc-list-item value="en">English</mwc-list-item>
        </ha-select>

        <div class="switch-row">
          <span>Afficher uniquement les activités réservées</span>
          <ha-switch
            .checked=${!!this.config.only_booked}
            @change=${(i) => this.updateConfig("only_booked", i.target.checked)}
          ></ha-switch>
        </div>

        <div class="switch-row">
          <span>Afficher les actions Réserver / Annuler</span>
          <ha-switch
            .checked=${this.config.show_actions !== !1}
            @change=${(i) => this.updateConfig("show_actions", i.target.checked)}
          ></ha-switch>
        </div>
      </div>
    `;
  }
};
O.styles = at`
    .editor { display: grid; gap: 16px; padding: 8px 0; }
    ha-entity-picker, ha-textfield, ha-select { display: block; width: 100%; }
    .switch-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .switch-row span { color: var(--primary-text-color); }
  `;
y([
  Z({ attribute: !1 })
], O.prototype, "hass", 2);
y([
  j()
], O.prototype, "config", 2);
O = y([
  pt("heitzfit4-planning-card-editor")
], O);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "heitzfit4-planning-card",
  name: "HeitzFit4 Planning Card",
  description: "Planning des activités HeitzFit4 avec réservation et annulation.",
  preview: !0
});
console.info(`%c HEITZFIT4-PLANNING-CARD %c v${jt} `, "color:white;background:#2eaf65;font-weight:bold", "color:#2eaf65;background:white");
export {
  g as Heitzfit4PlanningCard,
  O as Heitzfit4PlanningCardEditor
};
//# sourceMappingURL=heitzfit4-planning-card.js.map
