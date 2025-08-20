var at = Object.defineProperty;
var ct = (t, e, n) => e in t ? at(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var R = (t, e, n) => ct(t, typeof e != "symbol" ? e + "" : e, n);
function lt(t) {
  if (t === void 0)
    return;
  const e = t.slice(0, 5);
  return e != "https" && e.slice(0, 4) === "http" ? t.replace("http", "https") : t;
}
class qe {
  async getFromUrl(e) {
    const i = await (await fetch(e)).text();
    return this.getInformation(i);
  }
  getFromContent(e) {
    return this.getInformation(e);
  }
  getInformation(e) {
    try {
      const n = new window.DOMParser().parseFromString(e, "text/xml");
      return this.parseFile(n);
    } catch (n) {
      throw console.error("Could not fetch vast file", n), n;
    }
  }
  parseFile(e) {
    return {
      clickThroughUrl: this.queryXMLFile(e, "ClickThrough"),
      beacons: {
        adFirstQuartile: this.queryXMLFile(
          e,
          "Tracking[event='firstQuartile']"
        ),
        adMidpoint: this.queryXMLFile(e, "Tracking[event='midpoint']"),
        adThirdQuartile: this.queryXMLFile(
          e,
          "Tracking[event='thirdQuartile']"
        ),
        adCompleted: this.queryXMLFile(e, "Tracking[event='complete']"),
        mute: this.queryXMLFile(e, "Tracking[event='mute']"),
        unmute: this.queryXMLFile(e, "Tracking[event='unmute']"),
        pause: this.queryXMLFile(e, "Tracking[event='pause']"),
        resume: this.queryXMLFile(e, "Tracking[event='resume']"),
        impression: this.queryXMLFile(e, "Impression"),
        adStarted: this.queryXMLFile(e, "Tracking[event='start']"),
        clickThrough: this.queryXMLFile(e, "ClickTracking"),
        verificationNotExecuted: this.queryXMLFile(
          e,
          'TrackingEvents Tracking[event="verificationNotExecuted"]'
        )
      },
      adVerifications: this.loadAdVerifications(e),
      mediaFiles: this.queryMediaFiles(e)
    };
  }
  loadAdVerifications(e) {
    let n = e.querySelectorAll("AdVerifications Verification");
    return n.length ? Array.from(n).map((i) => ({
      javascriptResource: this.queryXMLFile(
        i,
        "JavaScriptResource"
      ),
      apiFramework: this.queryXMLAttribute(
        i.querySelector("JavaScriptResource"),
        "apiFramework"
      ),
      vendor: this.queryXMLAttribute(i, "vendor"),
      verificationParameters: this.queryXMLFile(
        i,
        "VerificationParameters"
      )
    })) : [];
  }
  queryXMLFile(e, n) {
    var i;
    return (i = e.querySelector(n)) == null ? void 0 : i.firstChild.wholeText.trim();
  }
  queryXMLAttribute(e, n) {
    return (e == null ? void 0 : e.getAttribute(n)) ?? void 0;
  }
  queryXMLText(e) {
    if (!(!e || !e.firstChild))
      return e.firstChild.wholeText.trim();
  }
  queryMediaFiles(e) {
    const n = e.querySelector("MediaFiles > ClosedCaptionFiles > ClosedCaptionFile"), i = e.querySelectorAll("MediaFile"), o = n ? this.queryXMLFile(e, "MediaFiles > ClosedCaptionFiles > ClosedCaptionFile") : void 0, r = n ? this.queryXMLAttribute(n, "language") : void 0;
    return Array.from(i).map(
      (_) => {
        const l = lt(this.queryXMLText(_)), c = this.queryXMLAttribute(_, "width"), u = this.queryXMLAttribute(_, "height"), s = c && u ? parseInt(c) / parseInt(u) : void 0, p = o ?? this.queryXMLFile(_, "ClosedCaptionFiles > ClosedCaptionFile"), d = r ?? this.queryXMLAttribute(
          _.querySelector("ClosedCaptionFiles > ClosedCaptionFile"),
          "language"
        );
        return {
          mediaUrl: l,
          width: c,
          height: u,
          aspectRatio: s,
          closedCaptionFile: p,
          closedCaptionLanguage: d
        };
      }
    );
  }
}
var G, f, Ie, U, pe, Oe, ie, ce, oe, re, X = {}, De = [], ut = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, ee = Array.isArray;
function $(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function Xe(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function se(t, e, n) {
  var i, o, r, a = {};
  for (r in e) r == "key" ? i = e[r] : r == "ref" ? o = e[r] : a[r] = e[r];
  if (arguments.length > 2 && (a.children = arguments.length > 3 ? G.call(arguments, 2) : n), typeof t == "function" && t.defaultProps != null) for (r in t.defaultProps) a[r] === void 0 && (a[r] = t.defaultProps[r]);
  return z(t, a, i, o, null);
}
function z(t, e, n, i, o) {
  var r = { type: t, props: e, key: n, ref: i, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: o ?? ++Ie, __i: -1, __u: 0 };
  return o == null && f.vnode != null && f.vnode(r), r;
}
function q(t) {
  return t.children;
}
function A(t, e) {
  this.props = t, this.context = e;
}
function I(t, e) {
  if (e == null) return t.__ ? I(t.__, t.__i + 1) : null;
  for (var n; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) return n.__e;
  return typeof t.type == "function" ? I(t) : null;
}
function Be(t) {
  var e, n;
  if ((t = t.__) != null && t.__c != null) {
    for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) {
      t.__e = t.__c.base = n.__e;
      break;
    }
    return Be(t);
  }
}
function he(t) {
  (!t.__d && (t.__d = !0) && U.push(t) && !J.__r++ || pe !== f.debounceRendering) && ((pe = f.debounceRendering) || Oe)(J);
}
function J() {
  var t, e, n, i, o, r, a, _;
  for (U.sort(ie); t = U.shift(); ) t.__d && (e = U.length, i = void 0, r = (o = (n = t).__v).__e, a = [], _ = [], n.__P && ((i = $({}, o)).__v = o.__v + 1, f.vnode && f.vnode(i), le(n.__P, i, o, n.__n, n.__P.namespaceURI, 32 & o.__u ? [r] : null, a, r ?? I(o), !!(32 & o.__u), _), i.__v = o.__v, i.__.__k[i.__i] = i, je(a, i, _), i.__e != r && Be(i)), U.length > e && U.sort(ie));
  J.__r = 0;
}
function We(t, e, n, i, o, r, a, _, l, c, u) {
  var s, p, d, v, g, C = i && i.__k || De, m = e.length;
  for (n.__d = l, dt(n, e, C), l = n.__d, s = 0; s < m; s++) (d = n.__k[s]) != null && (p = d.__i === -1 ? X : C[d.__i] || X, d.__i = s, le(t, d, p, o, r, a, _, l, c, u), v = d.__e, d.ref && p.ref != d.ref && (p.ref && ue(p.ref, null, d), u.push(d.ref, d.__c || v, d)), g == null && v != null && (g = v), 65536 & d.__u || p.__k === d.__k ? l = Qe(d, l, t) : typeof d.type == "function" && d.__d !== void 0 ? l = d.__d : v && (l = v.nextSibling), d.__d = void 0, d.__u &= -196609);
  n.__d = l, n.__e = g;
}
function dt(t, e, n) {
  var i, o, r, a, _, l = e.length, c = n.length, u = c, s = 0;
  for (t.__k = [], i = 0; i < l; i++) (o = e[i]) != null && typeof o != "boolean" && typeof o != "function" ? (a = i + s, (o = t.__k[i] = typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? z(null, o, null, null, null) : ee(o) ? z(q, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? z(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : o).__ = t, o.__b = t.__b + 1, r = null, (_ = o.__i = ft(o, n, a, u)) !== -1 && (u--, (r = n[_]) && (r.__u |= 131072)), r == null || r.__v === null ? (_ == -1 && s--, typeof o.type != "function" && (o.__u |= 65536)) : _ !== a && (_ == a - 1 ? s-- : _ == a + 1 ? s++ : (_ > a ? s-- : s++, o.__u |= 65536))) : o = t.__k[i] = null;
  if (u) for (i = 0; i < c; i++) (r = n[i]) != null && !(131072 & r.__u) && (r.__e == t.__d && (t.__d = I(r)), ze(r, r));
}
function Qe(t, e, n) {
  var i, o;
  if (typeof t.type == "function") {
    for (i = t.__k, o = 0; i && o < i.length; o++) i[o] && (i[o].__ = t, e = Qe(i[o], e, n));
    return e;
  }
  t.__e != e && (e && t.type && !n.contains(e) && (e = I(t)), n.insertBefore(t.__e, e || null), e = t.__e);
  do
    e = e && e.nextSibling;
  while (e != null && e.nodeType === 8);
  return e;
}
function K(t, e) {
  return e = e || [], t == null || typeof t == "boolean" || (ee(t) ? t.some(function(n) {
    K(n, e);
  }) : e.push(t)), e;
}
function ft(t, e, n, i) {
  var o = t.key, r = t.type, a = n - 1, _ = n + 1, l = e[n];
  if (l === null || l && o == l.key && r === l.type && !(131072 & l.__u)) return n;
  if (i > (l != null && !(131072 & l.__u) ? 1 : 0)) for (; a >= 0 || _ < e.length; ) {
    if (a >= 0) {
      if ((l = e[a]) && !(131072 & l.__u) && o == l.key && r === l.type) return a;
      a--;
    }
    if (_ < e.length) {
      if ((l = e[_]) && !(131072 & l.__u) && o == l.key && r === l.type) return _;
      _++;
    }
  }
  return -1;
}
function ve(t, e, n) {
  e[0] === "-" ? t.setProperty(e, n ?? "") : t[e] = n == null ? "" : typeof n != "number" || ut.test(e) ? n : n + "px";
}
function Q(t, e, n, i, o) {
  var r;
  e: if (e === "style") if (typeof n == "string") t.style.cssText = n;
  else {
    if (typeof i == "string" && (t.style.cssText = i = ""), i) for (e in i) n && e in n || ve(t.style, e, "");
    if (n) for (e in n) i && n[e] === i[e] || ve(t.style, e, n[e]);
  }
  else if (e[0] === "o" && e[1] === "n") r = e !== (e = e.replace(/(PointerCapture)$|Capture$/i, "$1")), e = e.toLowerCase() in t || e === "onFocusOut" || e === "onFocusIn" ? e.toLowerCase().slice(2) : e.slice(2), t.l || (t.l = {}), t.l[e + r] = n, n ? i ? n.u = i.u : (n.u = ce, t.addEventListener(e, r ? re : oe, r)) : t.removeEventListener(e, r ? re : oe, r);
  else {
    if (o == "http://www.w3.org/2000/svg") e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (e != "width" && e != "height" && e != "href" && e != "list" && e != "form" && e != "tabIndex" && e != "download" && e != "rowSpan" && e != "colSpan" && e != "role" && e != "popover" && e in t) try {
      t[e] = n ?? "";
      break e;
    } catch {
    }
    typeof n == "function" || (n == null || n === !1 && e[4] !== "-" ? t.removeAttribute(e) : t.setAttribute(e, e == "popover" && n == 1 ? "" : n));
  }
}
function me(t) {
  return function(e) {
    if (this.l) {
      var n = this.l[e.type + t];
      if (e.t == null) e.t = ce++;
      else if (e.t < n.u) return;
      return n(f.event ? f.event(e) : e);
    }
  };
}
function le(t, e, n, i, o, r, a, _, l, c) {
  var u, s, p, d, v, g, C, m, y, x, E, L, P, W, N, O, S = e.type;
  if (e.constructor !== void 0) return null;
  128 & n.__u && (l = !!(32 & n.__u), r = [_ = e.__e = n.__e]), (u = f.__b) && u(e);
  e: if (typeof S == "function") try {
    if (m = e.props, y = "prototype" in S && S.prototype.render, x = (u = S.contextType) && i[u.__c], E = u ? x ? x.props.value : u.__ : i, n.__c ? C = (s = e.__c = n.__c).__ = s.__E : (y ? e.__c = s = new S(m, E) : (e.__c = s = new A(m, E), s.constructor = S, s.render = ht), x && x.sub(s), s.props = m, s.state || (s.state = {}), s.context = E, s.__n = i, p = s.__d = !0, s.__h = [], s._sb = []), y && s.__s == null && (s.__s = s.state), y && S.getDerivedStateFromProps != null && (s.__s == s.state && (s.__s = $({}, s.__s)), $(s.__s, S.getDerivedStateFromProps(m, s.__s))), d = s.props, v = s.state, s.__v = e, p) y && S.getDerivedStateFromProps == null && s.componentWillMount != null && s.componentWillMount(), y && s.componentDidMount != null && s.__h.push(s.componentDidMount);
    else {
      if (y && S.getDerivedStateFromProps == null && m !== d && s.componentWillReceiveProps != null && s.componentWillReceiveProps(m, E), !s.__e && (s.shouldComponentUpdate != null && s.shouldComponentUpdate(m, s.__s, E) === !1 || e.__v === n.__v)) {
        for (e.__v !== n.__v && (s.props = m, s.state = s.__s, s.__d = !1), e.__e = n.__e, e.__k = n.__k, e.__k.some(function(H) {
          H && (H.__ = e);
        }), L = 0; L < s._sb.length; L++) s.__h.push(s._sb[L]);
        s._sb = [], s.__h.length && a.push(s);
        break e;
      }
      s.componentWillUpdate != null && s.componentWillUpdate(m, s.__s, E), y && s.componentDidUpdate != null && s.__h.push(function() {
        s.componentDidUpdate(d, v, g);
      });
    }
    if (s.context = E, s.props = m, s.__P = t, s.__e = !1, P = f.__r, W = 0, y) {
      for (s.state = s.__s, s.__d = !1, P && P(e), u = s.render(s.props, s.state, s.context), N = 0; N < s._sb.length; N++) s.__h.push(s._sb[N]);
      s._sb = [];
    } else do
      s.__d = !1, P && P(e), u = s.render(s.props, s.state, s.context), s.state = s.__s;
    while (s.__d && ++W < 25);
    s.state = s.__s, s.getChildContext != null && (i = $($({}, i), s.getChildContext())), y && !p && s.getSnapshotBeforeUpdate != null && (g = s.getSnapshotBeforeUpdate(d, v)), We(t, ee(O = u != null && u.type === q && u.key == null ? u.props.children : u) ? O : [O], e, n, i, o, r, a, _, l, c), s.base = e.__e, e.__u &= -161, s.__h.length && a.push(s), C && (s.__E = s.__ = null);
  } catch (H) {
    if (e.__v = null, l || r != null) {
      for (e.__u |= l ? 160 : 32; _ && _.nodeType === 8 && _.nextSibling; ) _ = _.nextSibling;
      r[r.indexOf(_)] = null, e.__e = _;
    } else e.__e = n.__e, e.__k = n.__k;
    f.__e(H, e, n);
  }
  else r == null && e.__v === n.__v ? (e.__k = n.__k, e.__e = n.__e) : e.__e = pt(n.__e, e, n, i, o, r, a, l, c);
  (u = f.diffed) && u(e);
}
function je(t, e, n) {
  e.__d = void 0;
  for (var i = 0; i < n.length; i++) ue(n[i], n[++i], n[++i]);
  f.__c && f.__c(e, t), t.some(function(o) {
    try {
      t = o.__h, o.__h = [], t.some(function(r) {
        r.call(o);
      });
    } catch (r) {
      f.__e(r, o.__v);
    }
  });
}
function pt(t, e, n, i, o, r, a, _, l) {
  var c, u, s, p, d, v, g, C = n.props, m = e.props, y = e.type;
  if (y === "svg" ? o = "http://www.w3.org/2000/svg" : y === "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), r != null) {
    for (c = 0; c < r.length; c++) if ((d = r[c]) && "setAttribute" in d == !!y && (y ? d.localName === y : d.nodeType === 3)) {
      t = d, r[c] = null;
      break;
    }
  }
  if (t == null) {
    if (y === null) return document.createTextNode(m);
    t = document.createElementNS(o, y, m.is && m), _ && (f.__m && f.__m(e, r), _ = !1), r = null;
  }
  if (y === null) C === m || _ && t.data === m || (t.data = m);
  else {
    if (r = r && G.call(t.childNodes), C = n.props || X, !_ && r != null) for (C = {}, c = 0; c < t.attributes.length; c++) C[(d = t.attributes[c]).name] = d.value;
    for (c in C) if (d = C[c], c != "children") {
      if (c == "dangerouslySetInnerHTML") s = d;
      else if (!(c in m)) {
        if (c == "value" && "defaultValue" in m || c == "checked" && "defaultChecked" in m) continue;
        Q(t, c, null, d, o);
      }
    }
    for (c in m) d = m[c], c == "children" ? p = d : c == "dangerouslySetInnerHTML" ? u = d : c == "value" ? v = d : c == "checked" ? g = d : _ && typeof d != "function" || C[c] === d || Q(t, c, d, C[c], o);
    if (u) _ || s && (u.__html === s.__html || u.__html === t.innerHTML) || (t.innerHTML = u.__html), e.__k = [];
    else if (s && (t.innerHTML = ""), We(t, ee(p) ? p : [p], e, n, i, y === "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, r, a, r ? r[0] : n.__k && I(n, 0), _, l), r != null) for (c = r.length; c--; ) Xe(r[c]);
    _ || (c = "value", y === "progress" && v == null ? t.removeAttribute("value") : v !== void 0 && (v !== t[c] || y === "progress" && !v || y === "option" && v !== C[c]) && Q(t, c, v, C[c], o), c = "checked", g !== void 0 && g !== t[c] && Q(t, c, g, C[c], o));
  }
  return t;
}
function ue(t, e, n) {
  try {
    if (typeof t == "function") {
      var i = typeof t.__u == "function";
      i && t.__u(), i && e == null || (t.__u = t(e));
    } else t.current = e;
  } catch (o) {
    f.__e(o, n);
  }
}
function ze(t, e, n) {
  var i, o;
  if (f.unmount && f.unmount(t), (i = t.ref) && (i.current && i.current !== t.__e || ue(i, null, e)), (i = t.__c) != null) {
    if (i.componentWillUnmount) try {
      i.componentWillUnmount();
    } catch (r) {
      f.__e(r, e);
    }
    i.base = i.__P = null;
  }
  if (i = t.__k) for (o = 0; o < i.length; o++) i[o] && ze(i[o], e, n || typeof t.type != "function");
  n || Xe(t.__e), t.__c = t.__ = t.__e = t.__d = void 0;
}
function ht(t, e, n) {
  return this.constructor(t, n);
}
function vt(t, e, n) {
  var i, o, r, a;
  f.__ && f.__(t, e), o = (i = typeof n == "function") ? null : e.__k, r = [], a = [], le(e, t = (!i && n || e).__k = se(q, null, [t]), o || X, X, e.namespaceURI, !i && n ? [n] : o ? null : e.firstChild ? G.call(e.childNodes) : null, r, !i && n ? n : o ? o.__e : e.firstChild, i, a), je(r, t, a);
}
G = De.slice, f = { __e: function(t, e, n, i) {
  for (var o, r, a; e = e.__; ) if ((o = e.__c) && !o.__) try {
    if ((r = o.constructor) && r.getDerivedStateFromError != null && (o.setState(r.getDerivedStateFromError(t)), a = o.__d), o.componentDidCatch != null && (o.componentDidCatch(t, i || {}), a = o.__d), a) return o.__E = o;
  } catch (_) {
    t = _;
  }
  throw t;
} }, Ie = 0, A.prototype.setState = function(t, e) {
  var n;
  n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = $({}, this.state), typeof t == "function" && (t = t($({}, n), this.props)), t && $(n, t), t != null && this.__v && (e && this._sb.push(e), he(this));
}, A.prototype.forceUpdate = function(t) {
  this.__v && (this.__e = !0, t && this.__h.push(t), he(this));
}, A.prototype.render = q, U = [], Oe = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, ie = function(t, e) {
  return t.__v.__b - e.__v.__b;
}, J.__r = 0, ce = 0, oe = me(!1), re = me(!0);
var mt = 0;
function h(t, e, n, i, o, r) {
  e || (e = {});
  var a, _, l = e;
  if ("ref" in l) for (_ in l = {}, e) _ == "ref" ? a = e[_] : l[_] = e[_];
  var c = { type: t, props: l, key: n, ref: a, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --mt, __i: -1, __u: 0, __source: o, __self: r };
  if (typeof t == "function" && (a = t.defaultProps)) for (_ in a) l[_] === void 0 && (l[_] = a[_]);
  return f.vnode && f.vnode(c), c;
}
var B, w, te, ye, Y = 0, Ze = [], k = f, ge = k.__b, Ce = k.__r, be = k.diffed, we = k.__c, ke = k.unmount, Fe = k.__;
function de(t, e) {
  k.__h && k.__h(w, t, Y || e), Y = 0;
  var n = w.__H || (w.__H = { __: [], __h: [] });
  return t >= n.__.length && n.__.push({}), n.__[t];
}
function D(t) {
  return Y = 1, yt(Ye, t);
}
function yt(t, e, n) {
  var i = de(B++, 2);
  if (i.t = t, !i.__c && (i.__ = [n ? n(e) : Ye(void 0, e), function(_) {
    var l = i.__N ? i.__N[0] : i.__[0], c = i.t(l, _);
    l !== c && (i.__N = [c, i.__[1]], i.__c.setState({}));
  }], i.__c = w, !w.u)) {
    var o = function(_, l, c) {
      if (!i.__c.__H) return !0;
      var u = i.__c.__H.__.filter(function(p) {
        return !!p.__c;
      });
      if (u.every(function(p) {
        return !p.__N;
      })) return !r || r.call(this, _, l, c);
      var s = !1;
      return u.forEach(function(p) {
        if (p.__N) {
          var d = p.__[0];
          p.__ = p.__N, p.__N = void 0, d !== p.__[0] && (s = !0);
        }
      }), !(!s && i.__c.props === _) && (!r || r.call(this, _, l, c));
    };
    w.u = !0;
    var r = w.shouldComponentUpdate, a = w.componentWillUpdate;
    w.componentWillUpdate = function(_, l, c) {
      if (this.__e) {
        var u = r;
        r = void 0, o(_, l, c), r = u;
      }
      a && a.call(this, _, l, c);
    }, w.shouldComponentUpdate = o;
  }
  return i.__N || i.__;
}
function Je(t, e) {
  var n = de(B++, 3);
  !k.__s && Ke(n.__H, e) && (n.__ = t, n.i = e, w.__H.__h.push(n));
}
function _e(t) {
  return Y = 5, gt(function() {
    return { current: t };
  }, []);
}
function gt(t, e) {
  var n = de(B++, 7);
  return Ke(n.__H, e) && (n.__ = t(), n.__H = e, n.__h = t), n.__;
}
function Ct() {
  for (var t; t = Ze.shift(); ) if (t.__P && t.__H) try {
    t.__H.__h.forEach(Z), t.__H.__h.forEach(ae), t.__H.__h = [];
  } catch (e) {
    t.__H.__h = [], k.__e(e, t.__v);
  }
}
k.__b = function(t) {
  w = null, ge && ge(t);
}, k.__ = function(t, e) {
  t && e.__k && e.__k.__m && (t.__m = e.__k.__m), Fe && Fe(t, e);
}, k.__r = function(t) {
  Ce && Ce(t), B = 0;
  var e = (w = t.__c).__H;
  e && (te === w ? (e.__h = [], w.__h = [], e.__.forEach(function(n) {
    n.__N && (n.__ = n.__N), n.i = n.__N = void 0;
  })) : (e.__h.forEach(Z), e.__h.forEach(ae), e.__h = [], B = 0)), te = w;
}, k.diffed = function(t) {
  be && be(t);
  var e = t.__c;
  e && e.__H && (e.__H.__h.length && (Ze.push(e) !== 1 && ye === k.requestAnimationFrame || ((ye = k.requestAnimationFrame) || bt)(Ct)), e.__H.__.forEach(function(n) {
    n.i && (n.__H = n.i), n.i = void 0;
  })), te = w = null;
}, k.__c = function(t, e) {
  e.some(function(n) {
    try {
      n.__h.forEach(Z), n.__h = n.__h.filter(function(i) {
        return !i.__ || ae(i);
      });
    } catch (i) {
      e.some(function(o) {
        o.__h && (o.__h = []);
      }), e = [], k.__e(i, n.__v);
    }
  }), we && we(t, e);
}, k.unmount = function(t) {
  ke && ke(t);
  var e, n = t.__c;
  n && n.__H && (n.__H.__.forEach(function(i) {
    try {
      Z(i);
    } catch (o) {
      e = o;
    }
  }), n.__H = void 0, e && k.__e(e, n.__v));
};
var Le = typeof requestAnimationFrame == "function";
function bt(t) {
  var e, n = function() {
    clearTimeout(i), Le && cancelAnimationFrame(e), setTimeout(t);
  }, i = setTimeout(n, 100);
  Le && (e = requestAnimationFrame(n));
}
function Z(t) {
  var e = w, n = t.__c;
  typeof n == "function" && (t.__c = void 0, n()), w = e;
}
function ae(t) {
  var e = w;
  t.__c = t.__(), w = e;
}
function Ke(t, e) {
  return !t || t.length !== e.length || e.some(function(n, i) {
    return n !== t[i];
  });
}
function Ye(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function wt(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function Se(t, e) {
  for (var n in t) if (n !== "__source" && !(n in e)) return !0;
  for (var i in e) if (i !== "__source" && t[i] !== e[i]) return !0;
  return !1;
}
function Ee(t, e) {
  this.props = t, this.context = e;
}
(Ee.prototype = new A()).isPureReactComponent = !0, Ee.prototype.shouldComponentUpdate = function(t, e) {
  return Se(this.props, t) || Se(this.state, e);
};
var Me = f.__b;
f.__b = function(t) {
  t.type && t.type.__f && t.ref && (t.props.ref = t.ref, t.ref = null), Me && Me(t);
};
var kt = f.__e;
f.__e = function(t, e, n, i) {
  if (t.then) {
    for (var o, r = e; r = r.__; ) if ((o = r.__c) && o.__c) return e.__e == null && (e.__e = n.__e, e.__k = n.__k), o.__c(t, e);
  }
  kt(t, e, n, i);
};
var Te = f.unmount;
function Ge(t, e, n) {
  return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function(i) {
    typeof i.__c == "function" && i.__c();
  }), t.__c.__H = null), (t = wt({}, t)).__c != null && (t.__c.__P === n && (t.__c.__P = e), t.__c = null), t.__k = t.__k && t.__k.map(function(i) {
    return Ge(i, e, n);
  })), t;
}
function et(t, e, n) {
  return t && n && (t.__v = null, t.__k = t.__k && t.__k.map(function(i) {
    return et(i, e, n);
  }), t.__c && t.__c.__P === e && (t.__e && n.appendChild(t.__e), t.__c.__e = !0, t.__c.__P = n)), t;
}
function ne() {
  this.__u = 0, this.t = null, this.__b = null;
}
function tt(t) {
  var e = t.__.__c;
  return e && e.__a && e.__a(t);
}
function j() {
  this.u = null, this.o = null;
}
f.unmount = function(t) {
  var e = t.__c;
  e && e.__R && e.__R(), e && 32 & t.__u && (t.type = null), Te && Te(t);
}, (ne.prototype = new A()).__c = function(t, e) {
  var n = e.__c, i = this;
  i.t == null && (i.t = []), i.t.push(n);
  var o = tt(i.__v), r = !1, a = function() {
    r || (r = !0, n.__R = null, o ? o(_) : _());
  };
  n.__R = a;
  var _ = function() {
    if (!--i.__u) {
      if (i.state.__a) {
        var l = i.state.__a;
        i.__v.__k[0] = et(l, l.__c.__P, l.__c.__O);
      }
      var c;
      for (i.setState({ __a: i.__b = null }); c = i.t.pop(); ) c.forceUpdate();
    }
  };
  i.__u++ || 32 & e.__u || i.setState({ __a: i.__b = i.__v.__k[0] }), t.then(a, a);
}, ne.prototype.componentWillUnmount = function() {
  this.t = [];
}, ne.prototype.render = function(t, e) {
  if (this.__b) {
    if (this.__v.__k) {
      var n = document.createElement("div"), i = this.__v.__k[0].__c;
      this.__v.__k[0] = Ge(this.__b, n, i.__O = i.__P);
    }
    this.__b = null;
  }
  var o = e.__a && se(q, null, t.fallback);
  return o && (o.__u &= -33), [se(q, null, e.__a ? null : t.children), o];
};
var xe = function(t, e, n) {
  if (++n[1] === n[0] && t.o.delete(e), t.props.revealOrder && (t.props.revealOrder[0] !== "t" || !t.o.size)) for (n = t.u; n; ) {
    for (; n.length > 3; ) n.pop()();
    if (n[1] < n[0]) break;
    t.u = n = n[2];
  }
};
(j.prototype = new A()).__a = function(t) {
  var e = this, n = tt(e.__v), i = e.o.get(t);
  return i[0]++, function(o) {
    var r = function() {
      e.props.revealOrder ? (i.push(o), xe(e, t, i)) : o();
    };
    n ? n(r) : r();
  };
}, j.prototype.render = function(t) {
  this.u = null, this.o = /* @__PURE__ */ new Map();
  var e = K(t.children);
  t.revealOrder && t.revealOrder[0] === "b" && e.reverse();
  for (var n = e.length; n--; ) this.o.set(e[n], this.u = [1, 0, this.u]);
  return t.children;
}, j.prototype.componentDidUpdate = j.prototype.componentDidMount = function() {
  var t = this;
  this.o.forEach(function(e, n) {
    xe(t, n, e);
  });
};
var Ft = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Lt = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, St = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Et = /[A-Z0-9]/g, Mt = typeof document < "u", Tt = function(t) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(t);
};
A.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t) {
  Object.defineProperty(A.prototype, t, { configurable: !0, get: function() {
    return this["UNSAFE_" + t];
  }, set: function(e) {
    Object.defineProperty(this, t, { configurable: !0, writable: !0, value: e });
  } });
});
var Pe = f.event;
function xt() {
}
function Pt() {
  return this.cancelBubble;
}
function At() {
  return this.defaultPrevented;
}
f.event = function(t) {
  return Pe && (t = Pe(t)), t.persist = xt, t.isPropagationStopped = Pt, t.isDefaultPrevented = At, t.nativeEvent = t;
};
var Vt = { enumerable: !1, configurable: !0, get: function() {
  return this.class;
} }, Ae = f.vnode;
f.vnode = function(t) {
  typeof t.type == "string" && function(e) {
    var n = e.props, i = e.type, o = {}, r = i.indexOf("-") === -1;
    for (var a in n) {
      var _ = n[a];
      if (!(a === "value" && "defaultValue" in n && _ == null || Mt && a === "children" && i === "noscript" || a === "class" || a === "className")) {
        var l = a.toLowerCase();
        a === "defaultValue" && "value" in n && n.value == null ? a = "value" : a === "download" && _ === !0 ? _ = "" : l === "translate" && _ === "no" ? _ = !1 : l[0] === "o" && l[1] === "n" ? l === "ondoubleclick" ? a = "ondblclick" : l !== "onchange" || i !== "input" && i !== "textarea" || Tt(n.type) ? l === "onfocus" ? a = "onfocusin" : l === "onblur" ? a = "onfocusout" : St.test(a) && (a = l) : l = a = "oninput" : r && Lt.test(a) ? a = a.replace(Et, "-$&").toLowerCase() : _ === null && (_ = void 0), l === "oninput" && o[a = l] && (a = "oninputCapture"), o[a] = _;
      }
    }
    i == "select" && o.multiple && Array.isArray(o.value) && (o.value = K(n.children).forEach(function(c) {
      c.props.selected = o.value.indexOf(c.props.value) != -1;
    })), i == "select" && o.defaultValue != null && (o.value = K(n.children).forEach(function(c) {
      c.props.selected = o.multiple ? o.defaultValue.indexOf(c.props.value) != -1 : o.defaultValue == c.props.value;
    })), n.class && !n.className ? (o.class = n.class, Object.defineProperty(o, "className", Vt)) : (n.className && !n.class || n.class && n.className) && (o.class = o.className = n.className), e.props = o;
  }(t), t.$$typeof = Ft, Ae && Ae(t);
};
var Ve = f.__r;
f.__r = function(t) {
  Ve && Ve(t), t.__c;
};
var $e = f.diffed;
f.diffed = function(t) {
  $e && $e(t);
  var e = t.props, n = t.__e;
  n != null && t.type === "textarea" && "value" in e && e.value !== n.value && (n.value = e.value == null ? "" : e.value);
};
function $t() {
  return /* @__PURE__ */ h("svg", { class: "cc-icon", viewBox: "0 0 24 24", width: "16", height: "16", children: /* @__PURE__ */ h(
    "text",
    {
      x: "50%",
      y: "58%",
      "font-size": "16",
      fill: "currentColor",
      "dominant-baseline": "middle",
      "text-anchor": "middle",
      children: "CC"
    }
  ) });
}
function Rt() {
  return /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ h(
    "path",
    {
      fill: "currentColor",
      d: "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
    }
  ) });
}
function Ut() {
  return /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ h(
    "path",
    {
      fill: "currentColor",
      d: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
    }
  ) });
}
function Nt() {
  return /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ h("path", { fill: "currentColor", d: "M14,19H18V5H14M6,19H10V5H6V19Z" }) });
}
function Ht() {
  return /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ h("path", { fill: "currentColor", d: "M8,5.14V19.14L19,12.14L8,5.14Z" }) });
}
function qt({
  onClickMute: t,
  onClickPlayPause: e,
  isMuted: n,
  isPlaying: i,
  ccButtonLabel: o,
  onClickCcButton: r,
  isCcActive: a
}) {
  return /* @__PURE__ */ h("div", { class: "rm-video-controls-container", children: /* @__PURE__ */ h("div", { class: "controls", children: [
    /* @__PURE__ */ h("div", { class: "play-pause-container", children: /* @__PURE__ */ h(
      "button",
      {
        class: "play-pause-btn",
        onClick: e,
        "data-testid": "play-button",
        "aria-label": i ? "Pause" : "Play",
        children: i ? /* @__PURE__ */ h(Nt, {}) : /* @__PURE__ */ h(Ht, {})
      }
    ) }),
    /* @__PURE__ */ h("div", { class: "volume-container", children: /* @__PURE__ */ h(
      "button",
      {
        class: "mute-btn",
        onClick: t,
        "data-testid": "mute-button",
        "aria-label": n ? "Unmute" : "Mute",
        children: n ? /* @__PURE__ */ h(Rt, {}) : /* @__PURE__ */ h(Ut, {})
      }
    ) }),
    /* @__PURE__ */ h("div", { class: "cc-container", children: /* @__PURE__ */ h(
      "button",
      {
        class: `cc-btn ${a ? "active" : "disabled"}`,
        onClick: r,
        "aria-label": o || "Closed Captions Button",
        children: /* @__PURE__ */ h($t, {})
      }
    ) })
  ] }) });
}
function It({
  fallbackImage: t,
  optionalVideoRedirectUrl: e,
  optionalRedirectTarget: n
}) {
  return /* @__PURE__ */ h("a", { href: e, target: n, children: /* @__PURE__ */ h("img", { class: "rm-video-fallback-image", src: t }) });
}
class Re {
  constructor(e, n) {
    R(this, "currentLoop", 1);
    R(this, "adStartedSent", !1);
    R(this, "adFirstQuartileSent", !1);
    R(this, "adMidpointSent", !1);
    R(this, "adThirdQuartileSent", !1);
    R(this, "adCompletedSent", !1);
    this.vastInformation = e, this.mediaEvents = n;
  }
  setTime(e, n, i) {
    const o = e / n * 100;
    this.currentLoop == 1 && (o >= 0.01 && !this.adStartedSent && this.sendAdStarted(n, i), o >= 25 && !this.adFirstQuartileSent && this.sendFirstQuartile(), o >= 50 && !this.adMidpointSent && this.sendMidpoint(), o >= 75 && !this.adThirdQuartileSent && this.sendThirdQuartile());
  }
  loop() {
    this.currentLoop === 1 && (T(this.vastInformation.beacons.adCompleted), this.mediaEvents && this.mediaEvents.complete(), this.adCompletedSent = !0), this.currentLoop++;
  }
  pause() {
    T(this.vastInformation.beacons.pause), this.mediaEvents && this.mediaEvents.pause();
  }
  play() {
    T(this.vastInformation.beacons.resume), this.mediaEvents && this.mediaEvents.resume();
  }
  mute() {
    T(this.vastInformation.beacons.mute), this.mediaEvents && this.mediaEvents.volumeChange(0);
  }
  unmute(e) {
    T(this.vastInformation.beacons.unmute), this.mediaEvents && this.mediaEvents.volumeChange(e);
  }
  bufferStart() {
    this.mediaEvents && this.mediaEvents.bufferStart();
  }
  bufferFinish() {
    this.mediaEvents && this.mediaEvents.bufferFinish();
  }
  sendAdStarted(e, n) {
    T(this.vastInformation.beacons.adStarted), this.mediaEvents && this.mediaEvents.start(e, n), this.adStartedSent = !0;
  }
  sendFirstQuartile() {
    T(this.vastInformation.beacons.adFirstQuartile), this.mediaEvents && this.mediaEvents.firstQuartile(), this.adFirstQuartileSent = !0;
  }
  sendMidpoint() {
    T(this.vastInformation.beacons.adMidpoint), this.mediaEvents && this.mediaEvents.midpoint(), this.adMidpointSent = !0;
  }
  sendThirdQuartile() {
    T(this.vastInformation.beacons.adThirdQuartile), this.mediaEvents && this.mediaEvents.thirdQuartile(), this.adThirdQuartileSent = !0;
  }
}
const T = (t) => {
  if (t !== void 0)
    try {
      const e = new URL(t);
      navigator.sendBeacon(e);
    } catch (e) {
      console.error("Could not send beacon", e);
    }
};
async function Ot(t) {
  if (t.adVerifications.length < 1)
    return console.log("No ad verifications found"), null;
  window.OmidSessionClient && window.OmidSessionClient.default && await Dt();
  const e = window.OmidSessionClient.default, n = e.AdSession, i = e.Partner, o = e.Context, r = e.VerificationScriptResource, a = e.MediaEvents, _ = e.AdEvents, l = window.location.href, c = "criteo", u = Object.keys(window.OmidSessionClient)[0], s = new i(c, u), p = window.top, d = [];
  for (const L of t.adVerifications) {
    if (L.apiFramework != "omid") {
      if (console.log(
        "detected non-omid compatible script, skipping load, attempting to fire verificationNotExecuted"
      ), !t.beacons.verificationNotExecuted) {
        console.log("Failed to load verificationNotExecuted beacon");
        continue;
      }
      T(t.beacons.verificationNotExecuted), console.log(
        t.beacons.verificationNotExecuted,
        "verificationNotExecuted beacon dropped"
      );
      continue;
    }
    d.push(
      new r(
        L.javascriptResource,
        L.vendor,
        L.verificationParameters,
        "full"
      )
    );
  }
  if (d.length < 1)
    return console.log("no valid verification tags detected"), null;
  const v = new o(s, d, l);
  v.setServiceWindow(p);
  const g = new n(v);
  if (g.setCreativeType("video"), g.setImpressionType("beginToRender"), !g.isSupported())
    return console.log("This AdSession is not supported"), null;
  const C = new _(g), m = e.VastProperties, y = new a(g);
  return g.start(), { onAdLoaded: () => {
    g.registerSessionObserver((L) => {
      if (L.type === "sessionStart") {
        const P = new m(!1, 0, !0, "standalone");
        C.loaded(P), C.impressionOccurred(), console.log("OMID AdEvent loaded and impression occurred");
      }
    });
  }, mediaEvents: y, setVideoContext: (L) => {
    v.setVideoElement(L);
  } };
}
async function Dt() {
  try {
    await Ue(
      "https://static.criteo.net/banners/js/omidjs/stable/omid-session-client-v1.js"
    ), await Ue(
      "https://static.criteo.net/banners/js/omidjs/stable/omweb-v1.js"
    );
  } catch (t) {
    console.error(t);
  }
}
function Ue(t) {
  return new Promise((e, n) => {
    const i = document.createElement("script");
    i.src = t, i.onload = () => e(), i.onerror = () => n(new Error(`Failed to load script ${t}`)), document.head.appendChild(i);
  });
}
function Xt(t) {
  const { mediaFiles: e, targetDimensions: n } = t;
  let i;
  const o = {
    mediaUrl: void 0,
    closedCaptionFile: void 0,
    closedCaptionLanguage: void 0
  };
  if (e.length === 0) return o;
  if (n && (i = n.width / n.height), e.length === 1 || e.length > 1 && (!n || !i || e.every((_) => _.aspectRatio === void 0))) {
    const _ = e[0];
    return o.mediaUrl = _.mediaUrl, o.closedCaptionFile = _.closedCaptionFile || void 0, o.closedCaptionLanguage = _.closedCaptionLanguage || "", o;
  }
  e.sort((_, l) => {
    const c = _.aspectRatio ?? 0, u = l.aspectRatio ?? 0;
    return c - u;
  });
  let r = null, a = 1 / 0;
  for (const _ of e) {
    let l = 1 / 0;
    if (typeof _.aspectRatio == "number" && typeof i == "number" && (l = Math.abs(_.aspectRatio - i)), l < a && (a = l, r = _), r && r.mediaUrl !== _.mediaUrl && r.aspectRatio === _.aspectRatio) {
      const c = n == null ? void 0 : n.width, u = n == null ? void 0 : n.height, s = Ne(c, _.width), p = He(u, _.height), d = Ne(c, r.width), v = He(u, r.height), g = s + p, C = d + v;
      g < C && (r = _);
    }
  }
  return o.mediaUrl = r == null ? void 0 : r.mediaUrl, o.closedCaptionFile = (r == null ? void 0 : r.closedCaptionFile) || void 0, o.closedCaptionLanguage = (r == null ? void 0 : r.closedCaptionLanguage) || "", o;
}
function Ne(t, e) {
  const n = typeof e == "string" ? parseFloat(e) : e;
  return typeof t == "number" && typeof n == "number" ? Math.abs(t - n) : 1 / 0;
}
function He(t, e) {
  const n = typeof e == "string" ? parseFloat(e) : e;
  return typeof t == "number" && typeof n == "number" ? Math.abs(t - n) : 1 / 0;
}
function nt(t) {
  const e = t instanceof HTMLTrackElement ? t.track : t, n = e == null ? void 0 : e.activeCues;
  if (n && n.length > 0) {
    const i = n[0];
    if ("text" in i && typeof i.text == "string")
      return i.text;
  }
  return "";
}
function Bt({
  closedCaptionFile: t,
  closedCaptionLanguage: e,
  setCcContent: n
}) {
  const i = _e(null), o = () => {
    var _;
    const a = (_ = i.current) == null ? void 0 : _.track;
    a && (a.mode = "hidden");
  }, r = () => {
    n(i.current ? nt(i.current) : null);
  };
  return Je(() => {
    var _;
    o();
    const a = () => {
      var c;
      o();
      const l = (c = i.current) == null ? void 0 : c.track;
      l == null || l.addEventListener("cuechange", r);
    };
    return (_ = i.current) == null || _.addEventListener("load", a), () => {
      var l;
      (l = i.current) == null || l.removeEventListener("load", a);
    };
  }, []), /* @__PURE__ */ h(
    "track",
    {
      ref: i,
      kind: "subtitles",
      src: t,
      srclang: e || "en",
      label: (e || "").toUpperCase(),
      default: !0
    }
  );
}
function Wt({
  isCcActive: t,
  content: e
}) {
  return /* @__PURE__ */ h(
    "div",
    {
      class: `custom-subtitle-container ${t ? "active" : "disabled"}`,
      children: e
    }
  );
}
function Qt(t) {
  const { vastInformation: e, options: n } = t, { mediaFiles: i } = e, { fallbackImage: o, altText: r, maxVolume: a, targetDimensions: _, ccButtonLabel: l } = n, c = Xt({ mediaFiles: i, targetDimensions: _ }), u = _e(null), s = _e(null), [p, d] = D(!0), [v, g] = D(!1), [C, m] = D(!1), [y, x] = D(!0), [E, L] = D(null), P = () => {
    var b, F;
    p ? (b = s.current) == null || b.mute() : (F = s.current) == null || F.unmute(a || 1), d(!p);
  }, W = (b) => {
    var M, V;
    C && (m(!1), (M = s.current) == null || M.bufferFinish());
    const F = b.target;
    (V = s.current) == null || V.setTime(
      F.currentTime,
      F.duration,
      F.volume
    );
  }, N = () => {
    var b, F;
    (b = s.current) == null || b.loop(), (F = u.current) == null || F.play();
  }, O = () => {
    e.clickThroughUrl ? (T(e.beacons.clickThrough), window.open(e.clickThroughUrl, "_self")) : (v ? u.current.pause() : u.current.play(), g(!v));
  }, S = () => {
    new IntersectionObserver(
      (F) => {
        for (let M = 0; M < F.length; M++) {
          let fe = F[M].isIntersecting;
          fe && !v ? (u.current.play(), g(!0)) : !fe && v && (u.current.pause(), g(!1));
        }
      },
      { threshold: 0.5 }
    ).observe(u.current);
  }, H = async () => {
    const b = await Ot(e);
    if (b === null) {
      s.current = new Re(e, null);
      return;
    }
    const { onAdLoaded: F, setVideoContext: M, mediaEvents: V } = b;
    s.current = new Re(e, V), M(u.current), u.current.addEventListener("canplay", F, { once: !0 });
  };
  Je(() => {
    async function b() {
      await H(), S(), _t();
    }
    b();
  }, []);
  const ot = () => {
    var b, F;
    v ? (u.current.pause(), (b = s.current) == null || b.pause()) : (u.current.play(), (F = s.current) == null || F.play()), g(!v);
  }, rt = () => {
    var b;
    m(!0), (b = s.current) == null || b.bufferStart();
  }, st = (b) => {
    var M, V;
    b.preventDefault(), x(!y);
    const F = (V = (M = u.current) == null ? void 0 : M.textTracks) == null ? void 0 : V[0];
    L(nt(F));
  }, _t = () => {
    x(!!c.closedCaptionFile);
  };
  return /* @__PURE__ */ h("div", { class: "rm-video-player-container", children: [
    /* @__PURE__ */ h(
      "video",
      {
        ref: u,
        class: "rm-ad-player",
        muted: p,
        playsInline: !0,
        "webkit-playsInline": !0,
        disablePictureInPicture: !0,
        "aria-label": r,
        src: c.mediaUrl,
        onTimeUpdate: W,
        onEnded: N,
        onClick: O,
        onWaiting: rt,
        "data-testid": "video-element",
        volume: a,
        children: [
          (o == null ? void 0 : o.src) && (o == null ? void 0 : o.optionalVideoRedirectUrl) && (o == null ? void 0 : o.optionalRedirectTarget) && /* @__PURE__ */ h(
            It,
            {
              fallbackImage: o == null ? void 0 : o.src,
              optionalVideoRedirectUrl: o == null ? void 0 : o.optionalVideoRedirectUrl,
              optionalRedirectTarget: o == null ? void 0 : o.optionalRedirectTarget
            }
          ),
          /* @__PURE__ */ h(
            Bt,
            {
              closedCaptionFile: c.closedCaptionFile,
              closedCaptionLanguage: c.closedCaptionLanguage,
              setCcContent: L
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ h(
      qt,
      {
        onClickPlayPause: ot,
        onClickMute: P,
        isMuted: p,
        isPlaying: v,
        ccButtonLabel: l,
        onClickCcButton: st,
        isCcActive: y
      }
    ),
    /* @__PURE__ */ h(
      Wt,
      {
        isCcActive: y,
        content: E
      }
    )
  ] });
}
const it = async (t, e, n) => {
  vt(
    /* @__PURE__ */ h(Qt, { options: n, vastInformation: t }),
    document.getElementById(e)
  );
}, zt = async (t, e, n) => {
  const o = await new qe().getFromUrl(t);
  return it(o, e, n);
}, Zt = async (t, e, n) => {
  const o = await new qe().getFromContent(t);
  return it(o, e, n);
};
export {
  Zt as criteoVideoPlayerFromContent,
  zt as criteoVideoPlayerFromUrl
};
