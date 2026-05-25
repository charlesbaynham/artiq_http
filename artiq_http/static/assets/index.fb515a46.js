function zv(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const o in r)
        if (o !== "default" && !(o in e)) {
          const l = Object.getOwnPropertyDescriptor(r, o);
          l &&
            Object.defineProperty(
              e,
              o,
              l.get ? l : { enumerable: !0, get: () => r[o] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
  new MutationObserver((o) => {
    for (const l of o)
      if (l.type === "childList")
        for (const a of l.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const l = {};
    return (
      o.integrity && (l.integrity = o.integrity),
      o.referrerpolicy && (l.referrerPolicy = o.referrerpolicy),
      o.crossorigin === "use-credentials"
        ? (l.credentials = "include")
        : o.crossorigin === "anonymous"
          ? (l.credentials = "omit")
          : (l.credentials = "same-origin"),
      l
    );
  }
  function r(o) {
    if (o.ep) return;
    o.ep = !0;
    const l = n(o);
    fetch(o.href, l);
  }
})();
function Ed(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var m = { exports: {} },
  oe = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Vo = Symbol.for("react.element"),
  Av = Symbol.for("react.portal"),
  Fv = Symbol.for("react.fragment"),
  Bv = Symbol.for("react.strict_mode"),
  Wv = Symbol.for("react.profiler"),
  Uv = Symbol.for("react.provider"),
  Hv = Symbol.for("react.context"),
  Vv = Symbol.for("react.forward_ref"),
  Kv = Symbol.for("react.suspense"),
  Gv = Symbol.for("react.memo"),
  Qv = Symbol.for("react.lazy"),
  Lc = Symbol.iterator;
function qv(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Lc && e[Lc]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var wd = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Sd = Object.assign,
  kd = {};
function zr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = kd),
    (this.updater = n || wd);
}
zr.prototype.isReactComponent = {};
zr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
zr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Cd() {}
Cd.prototype = zr.prototype;
function Yi(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = kd),
    (this.updater = n || wd);
}
var Xi = (Yi.prototype = new Cd());
Xi.constructor = Yi;
Sd(Xi, zr.prototype);
Xi.isPureReactComponent = !0;
var jc = Array.isArray,
  Nd = Object.prototype.hasOwnProperty,
  Ji = { current: null },
  Rd = { key: !0, ref: !0, __self: !0, __source: !0 };
function Od(e, t, n) {
  var r,
    o = {},
    l = null,
    a = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (a = t.ref),
    t.key !== void 0 && (l = "" + t.key),
    t))
      Nd.call(t, r) && !Rd.hasOwnProperty(r) && (o[r] = t[r]);
  var i = arguments.length - 2;
  if (i === 1) o.children = n;
  else if (1 < i) {
    for (var u = Array(i), c = 0; c < i; c++) u[c] = arguments[c + 2];
    o.children = u;
  }
  if (e && e.defaultProps)
    for (r in ((i = e.defaultProps), i)) o[r] === void 0 && (o[r] = i[r]);
  return {
    $$typeof: Vo,
    type: e,
    key: l,
    ref: a,
    props: o,
    _owner: Ji.current,
  };
}
function Yv(e, t) {
  return {
    $$typeof: Vo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Zi(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Vo;
}
function Xv(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var Dc = /\/+/g;
function Qa(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Xv("" + e.key)
    : t.toString(36);
}
function Rl(e, t, n, r, o) {
  var l = typeof e;
  (l === "undefined" || l === "boolean") && (e = null);
  var a = !1;
  if (e === null) a = !0;
  else
    switch (l) {
      case "string":
      case "number":
        a = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Vo:
          case Av:
            a = !0;
        }
    }
  if (a)
    return (
      (a = e),
      (o = o(a)),
      (e = r === "" ? "." + Qa(a, 0) : r),
      jc(o)
        ? ((n = ""),
          e != null && (n = e.replace(Dc, "$&/") + "/"),
          Rl(o, t, n, "", function (c) {
            return c;
          }))
        : o != null &&
          (Zi(o) &&
            (o = Yv(
              o,
              n +
                (!o.key || (a && a.key === o.key)
                  ? ""
                  : ("" + o.key).replace(Dc, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((a = 0), (r = r === "" ? "." : r + ":"), jc(e)))
    for (var i = 0; i < e.length; i++) {
      l = e[i];
      var u = r + Qa(l, i);
      a += Rl(l, t, n, u, o);
    }
  else if (((u = qv(e)), typeof u == "function"))
    for (e = u.call(e), i = 0; !(l = e.next()).done; )
      (l = l.value), (u = r + Qa(l, i++)), (a += Rl(l, t, n, u, o));
  else if (l === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      ))
    );
  return a;
}
function ol(e, t, n) {
  if (e == null) return e;
  var r = [],
    o = 0;
  return (
    Rl(e, r, "", "", function (l) {
      return t.call(n, l, o++);
    }),
    r
  );
}
function Jv(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ke = { current: null },
  Ol = { transition: null },
  Zv = {
    ReactCurrentDispatcher: Ke,
    ReactCurrentBatchConfig: Ol,
    ReactCurrentOwner: Ji,
  };
oe.Children = {
  map: ol,
  forEach: function (e, t, n) {
    ol(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      ol(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      ol(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Zi(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
oe.Component = zr;
oe.Fragment = Fv;
oe.Profiler = Wv;
oe.PureComponent = Yi;
oe.StrictMode = Bv;
oe.Suspense = Kv;
oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Zv;
oe.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Sd({}, e.props),
    o = e.key,
    l = e.ref,
    a = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((l = t.ref), (a = Ji.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var i = e.type.defaultProps;
    for (u in t)
      Nd.call(t, u) &&
        !Rd.hasOwnProperty(u) &&
        (r[u] = t[u] === void 0 && i !== void 0 ? i[u] : t[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    i = Array(u);
    for (var c = 0; c < u; c++) i[c] = arguments[c + 2];
    r.children = i;
  }
  return { $$typeof: Vo, type: e.type, key: o, ref: l, props: r, _owner: a };
};
oe.createContext = function (e) {
  return (
    (e = {
      $$typeof: Hv,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Uv, _context: e }),
    (e.Consumer = e)
  );
};
oe.createElement = Od;
oe.createFactory = function (e) {
  var t = Od.bind(null, e);
  return (t.type = e), t;
};
oe.createRef = function () {
  return { current: null };
};
oe.forwardRef = function (e) {
  return { $$typeof: Vv, render: e };
};
oe.isValidElement = Zi;
oe.lazy = function (e) {
  return { $$typeof: Qv, _payload: { _status: -1, _result: e }, _init: Jv };
};
oe.memo = function (e, t) {
  return { $$typeof: Gv, type: e, compare: t === void 0 ? null : t };
};
oe.startTransition = function (e) {
  var t = Ol.transition;
  Ol.transition = {};
  try {
    e();
  } finally {
    Ol.transition = t;
  }
};
oe.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
oe.useCallback = function (e, t) {
  return Ke.current.useCallback(e, t);
};
oe.useContext = function (e) {
  return Ke.current.useContext(e);
};
oe.useDebugValue = function () {};
oe.useDeferredValue = function (e) {
  return Ke.current.useDeferredValue(e);
};
oe.useEffect = function (e, t) {
  return Ke.current.useEffect(e, t);
};
oe.useId = function () {
  return Ke.current.useId();
};
oe.useImperativeHandle = function (e, t, n) {
  return Ke.current.useImperativeHandle(e, t, n);
};
oe.useInsertionEffect = function (e, t) {
  return Ke.current.useInsertionEffect(e, t);
};
oe.useLayoutEffect = function (e, t) {
  return Ke.current.useLayoutEffect(e, t);
};
oe.useMemo = function (e, t) {
  return Ke.current.useMemo(e, t);
};
oe.useReducer = function (e, t, n) {
  return Ke.current.useReducer(e, t, n);
};
oe.useRef = function (e) {
  return Ke.current.useRef(e);
};
oe.useState = function (e) {
  return Ke.current.useState(e);
};
oe.useSyncExternalStore = function (e, t, n) {
  return Ke.current.useSyncExternalStore(e, t, n);
};
oe.useTransition = function () {
  return Ke.current.useTransition();
};
oe.version = "18.2.0";
(function (e) {
  e.exports = oe;
})(m);
const s = Ed(m.exports),
  eg = zv({ __proto__: null, default: s }, [m.exports]);
var eu = { exports: {} },
  st = {},
  _d = { exports: {} },
  Pd = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(_, I) {
    var b = _.length;
    _.push(I);
    e: for (; 0 < b; ) {
      var A = (b - 1) >>> 1,
        V = _[A];
      if (0 < o(V, I)) (_[A] = I), (_[b] = V), (b = A);
      else break e;
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0];
  }
  function r(_) {
    if (_.length === 0) return null;
    var I = _[0],
      b = _.pop();
    if (b !== I) {
      _[0] = b;
      e: for (var A = 0, V = _.length, T = V >>> 1; A < T; ) {
        var F = 2 * (A + 1) - 1,
          K = _[F],
          Y = F + 1,
          J = _[Y];
        if (0 > o(K, b))
          Y < V && 0 > o(J, K)
            ? ((_[A] = J), (_[Y] = b), (A = Y))
            : ((_[A] = K), (_[F] = b), (A = F));
        else if (Y < V && 0 > o(J, b)) (_[A] = J), (_[Y] = b), (A = Y);
        else break e;
      }
    }
    return I;
  }
  function o(_, I) {
    var b = _.sortIndex - I.sortIndex;
    return b !== 0 ? b : _.id - I.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var l = performance;
    e.unstable_now = function () {
      return l.now();
    };
  } else {
    var a = Date,
      i = a.now();
    e.unstable_now = function () {
      return a.now() - i;
    };
  }
  var u = [],
    c = [],
    f = 1,
    d = null,
    h = 3,
    y = !1,
    E = !1,
    x = !1,
    k = typeof setTimeout == "function" ? setTimeout : null,
    v = typeof clearTimeout == "function" ? clearTimeout : null,
    p = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function g(_) {
    for (var I = n(c); I !== null; ) {
      if (I.callback === null) r(c);
      else if (I.startTime <= _)
        r(c), (I.sortIndex = I.expirationTime), t(u, I);
      else break;
      I = n(c);
    }
  }
  function w(_) {
    if (((x = !1), g(_), !E))
      if (n(u) !== null) (E = !0), W(C);
      else {
        var I = n(c);
        I !== null && q(w, I.startTime - _);
      }
  }
  function C(_, I) {
    (E = !1), x && ((x = !1), v(O), (O = -1)), (y = !0);
    var b = h;
    try {
      for (
        g(I), d = n(u);
        d !== null && (!(d.expirationTime > I) || (_ && !z()));

      ) {
        var A = d.callback;
        if (typeof A == "function") {
          (d.callback = null), (h = d.priorityLevel);
          var V = A(d.expirationTime <= I);
          (I = e.unstable_now()),
            typeof V == "function" ? (d.callback = V) : d === n(u) && r(u),
            g(I);
        } else r(u);
        d = n(u);
      }
      if (d !== null) var T = !0;
      else {
        var F = n(c);
        F !== null && q(w, F.startTime - I), (T = !1);
      }
      return T;
    } finally {
      (d = null), (h = b), (y = !1);
    }
  }
  var S = !1,
    N = null,
    O = -1,
    j = 5,
    D = -1;
  function z() {
    return !(e.unstable_now() - D < j);
  }
  function G() {
    if (N !== null) {
      var _ = e.unstable_now();
      D = _;
      var I = !0;
      try {
        I = N(!0, _);
      } finally {
        I ? Q() : ((S = !1), (N = null));
      }
    } else S = !1;
  }
  var Q;
  if (typeof p == "function")
    Q = function () {
      p(G);
    };
  else if (typeof MessageChannel < "u") {
    var P = new MessageChannel(),
      M = P.port2;
    (P.port1.onmessage = G),
      (Q = function () {
        M.postMessage(null);
      });
  } else
    Q = function () {
      k(G, 0);
    };
  function W(_) {
    (N = _), S || ((S = !0), Q());
  }
  function q(_, I) {
    O = k(function () {
      _(e.unstable_now());
    }, I);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (_) {
      _.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      E || y || ((E = !0), W(C));
    }),
    (e.unstable_forceFrameRate = function (_) {
      0 > _ || 125 < _
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (j = 0 < _ ? Math.floor(1e3 / _) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return h;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(u);
    }),
    (e.unstable_next = function (_) {
      switch (h) {
        case 1:
        case 2:
        case 3:
          var I = 3;
          break;
        default:
          I = h;
      }
      var b = h;
      h = I;
      try {
        return _();
      } finally {
        h = b;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (_, I) {
      switch (_) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          _ = 3;
      }
      var b = h;
      h = _;
      try {
        return I();
      } finally {
        h = b;
      }
    }),
    (e.unstable_scheduleCallback = function (_, I, b) {
      var A = e.unstable_now();
      switch (
        (typeof b == "object" && b !== null
          ? ((b = b.delay), (b = typeof b == "number" && 0 < b ? A + b : A))
          : (b = A),
        _)
      ) {
        case 1:
          var V = -1;
          break;
        case 2:
          V = 250;
          break;
        case 5:
          V = 1073741823;
          break;
        case 4:
          V = 1e4;
          break;
        default:
          V = 5e3;
      }
      return (
        (V = b + V),
        (_ = {
          id: f++,
          callback: I,
          priorityLevel: _,
          startTime: b,
          expirationTime: V,
          sortIndex: -1,
        }),
        b > A
          ? ((_.sortIndex = b),
            t(c, _),
            n(u) === null &&
              _ === n(c) &&
              (x ? (v(O), (O = -1)) : (x = !0), q(w, b - A)))
          : ((_.sortIndex = V), t(u, _), E || y || ((E = !0), W(C))),
        _
      );
    }),
    (e.unstable_shouldYield = z),
    (e.unstable_wrapCallback = function (_) {
      var I = h;
      return function () {
        var b = h;
        h = I;
        try {
          return _.apply(this, arguments);
        } finally {
          h = b;
        }
      };
    });
})(Pd);
(function (e) {
  e.exports = Pd;
})(_d);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Td = m.exports,
  at = _d.exports;
function L(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var bd = new Set(),
  ko = {};
function Zn(e, t) {
  Rr(e, t), Rr(e + "Capture", t);
}
function Rr(e, t) {
  for (ko[e] = t, e = 0; e < t.length; e++) bd.add(t[e]);
}
var qt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Ps = Object.prototype.hasOwnProperty,
  tg =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Mc = {},
  Ic = {};
function ng(e) {
  return Ps.call(Ic, e)
    ? !0
    : Ps.call(Mc, e)
      ? !1
      : tg.test(e)
        ? (Ic[e] = !0)
        : ((Mc[e] = !0), !1);
}
function rg(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function og(e, t, n, r) {
  if (t === null || typeof t > "u" || rg(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Ge(e, t, n, r, o, l, a) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = l),
    (this.removeEmptyString = a);
}
var je = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    je[e] = new Ge(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  je[t] = new Ge(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  je[e] = new Ge(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  je[e] = new Ge(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    je[e] = new Ge(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  je[e] = new Ge(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  je[e] = new Ge(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  je[e] = new Ge(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  je[e] = new Ge(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var tu = /[\-:]([a-z])/g;
function nu(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(tu, nu);
    je[t] = new Ge(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(tu, nu);
    je[t] = new Ge(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(tu, nu);
  je[t] = new Ge(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  je[e] = new Ge(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
je.xlinkHref = new Ge(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  je[e] = new Ge(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function ru(e, t, n, r) {
  var o = je.hasOwnProperty(t) ? je[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (og(t, n, o, r) && (n = null),
    r || o === null
      ? ng(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : o.mustUseProperty
        ? (e[o.propertyName] = n === null ? (o.type === 3 ? !1 : "") : n)
        : ((t = o.attributeName),
          (r = o.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((o = o.type),
              (n = o === 3 || (o === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var nn = Td.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ll = Symbol.for("react.element"),
  sr = Symbol.for("react.portal"),
  ir = Symbol.for("react.fragment"),
  ou = Symbol.for("react.strict_mode"),
  Ts = Symbol.for("react.profiler"),
  $d = Symbol.for("react.provider"),
  Ld = Symbol.for("react.context"),
  lu = Symbol.for("react.forward_ref"),
  bs = Symbol.for("react.suspense"),
  $s = Symbol.for("react.suspense_list"),
  au = Symbol.for("react.memo"),
  fn = Symbol.for("react.lazy"),
  jd = Symbol.for("react.offscreen"),
  zc = Symbol.iterator;
function Gr(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (zc && e[zc]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Ee = Object.assign,
  qa;
function oo(e) {
  if (qa === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      qa = (t && t[1]) || "";
    }
  return (
    `
` +
    qa +
    e
  );
}
var Ya = !1;
function Xa(e, t) {
  if (!e || Ya) return "";
  Ya = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var o = c.stack.split(`
`),
          l = r.stack.split(`
`),
          a = o.length - 1,
          i = l.length - 1;
        1 <= a && 0 <= i && o[a] !== l[i];

      )
        i--;
      for (; 1 <= a && 0 <= i; a--, i--)
        if (o[a] !== l[i]) {
          if (a !== 1 || i !== 1)
            do
              if ((a--, i--, 0 > i || o[a] !== l[i])) {
                var u =
                  `
` + o[a].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    u.includes("<anonymous>") &&
                    (u = u.replace("<anonymous>", e.displayName)),
                  u
                );
              }
            while (1 <= a && 0 <= i);
          break;
        }
    }
  } finally {
    (Ya = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? oo(e) : "";
}
function lg(e) {
  switch (e.tag) {
    case 5:
      return oo(e.type);
    case 16:
      return oo("Lazy");
    case 13:
      return oo("Suspense");
    case 19:
      return oo("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Xa(e.type, !1)), e;
    case 11:
      return (e = Xa(e.type.render, !1)), e;
    case 1:
      return (e = Xa(e.type, !0)), e;
    default:
      return "";
  }
}
function Ls(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case ir:
      return "Fragment";
    case sr:
      return "Portal";
    case Ts:
      return "Profiler";
    case ou:
      return "StrictMode";
    case bs:
      return "Suspense";
    case $s:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ld:
        return (e.displayName || "Context") + ".Consumer";
      case $d:
        return (e._context.displayName || "Context") + ".Provider";
      case lu:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case au:
        return (
          (t = e.displayName || null), t !== null ? t : Ls(e.type) || "Memo"
        );
      case fn:
        (t = e._payload), (e = e._init);
        try {
          return Ls(e(t));
        } catch {}
    }
  return null;
}
function ag(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Ls(t);
    case 8:
      return t === ou ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function On(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Dd(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function sg(e) {
  var t = Dd(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var o = n.get,
      l = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return o.call(this);
        },
        set: function (a) {
          (r = "" + a), l.call(this, a);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (a) {
          r = "" + a;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function al(e) {
  e._valueTracker || (e._valueTracker = sg(e));
}
function Md(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Dd(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Wl(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function js(e, t) {
  var n = t.checked;
  return Ee({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n != null ? n : e._wrapperState.initialChecked,
  });
}
function Ac(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = On(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Id(e, t) {
  (t = t.checked), t != null && ru(e, "checked", t, !1);
}
function Ds(e, t) {
  Id(e, t);
  var n = On(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? Ms(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Ms(e, t.type, On(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Fc(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function Ms(e, t, n) {
  (t !== "number" || Wl(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var lo = Array.isArray;
function xr(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      (o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + On(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        (e[o].selected = !0), r && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function Is(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(L(91));
  return Ee({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Bc(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(L(92));
      if (lo(n)) {
        if (1 < n.length) throw Error(L(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: On(n) };
}
function zd(e, t) {
  var n = On(t.value),
    r = On(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Wc(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Ad(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function zs(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Ad(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var sl,
  Fd = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, o) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, o);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        sl = sl || document.createElement("div"),
          sl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = sl.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Co(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var uo = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  ig = ["Webkit", "ms", "Moz", "O"];
Object.keys(uo).forEach(function (e) {
  ig.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (uo[t] = uo[e]);
  });
});
function Bd(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (uo.hasOwnProperty(e) && uo[e])
      ? ("" + t).trim()
      : t + "px";
}
function Wd(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = Bd(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o);
    }
}
var ug = Ee(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function As(e, t) {
  if (t) {
    if (ug[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(L(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(L(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(L(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(L(62));
  }
}
function Fs(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Bs = null;
function su(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Ws = null,
  Er = null,
  wr = null;
function Uc(e) {
  if ((e = Qo(e))) {
    if (typeof Ws != "function") throw Error(L(280));
    var t = e.stateNode;
    t && ((t = Oa(t)), Ws(e.stateNode, e.type, t));
  }
}
function Ud(e) {
  Er ? (wr ? wr.push(e) : (wr = [e])) : (Er = e);
}
function Hd() {
  if (Er) {
    var e = Er,
      t = wr;
    if (((wr = Er = null), Uc(e), t)) for (e = 0; e < t.length; e++) Uc(t[e]);
  }
}
function Vd(e, t) {
  return e(t);
}
function Kd() {}
var Ja = !1;
function Gd(e, t, n) {
  if (Ja) return e(t, n);
  Ja = !0;
  try {
    return Vd(e, t, n);
  } finally {
    (Ja = !1), (Er !== null || wr !== null) && (Kd(), Hd());
  }
}
function No(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Oa(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(L(231, t, typeof n));
  return n;
}
var Us = !1;
if (qt)
  try {
    var Qr = {};
    Object.defineProperty(Qr, "passive", {
      get: function () {
        Us = !0;
      },
    }),
      window.addEventListener("test", Qr, Qr),
      window.removeEventListener("test", Qr, Qr);
  } catch {
    Us = !1;
  }
function cg(e, t, n, r, o, l, a, i, u) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (f) {
    this.onError(f);
  }
}
var co = !1,
  Ul = null,
  Hl = !1,
  Hs = null,
  fg = {
    onError: function (e) {
      (co = !0), (Ul = e);
    },
  };
function dg(e, t, n, r, o, l, a, i, u) {
  (co = !1), (Ul = null), cg.apply(fg, arguments);
}
function pg(e, t, n, r, o, l, a, i, u) {
  if ((dg.apply(this, arguments), co)) {
    if (co) {
      var c = Ul;
      (co = !1), (Ul = null);
    } else throw Error(L(198));
    Hl || ((Hl = !0), (Hs = c));
  }
}
function er(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Qd(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Hc(e) {
  if (er(e) !== e) throw Error(L(188));
}
function mg(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = er(e)), t === null)) throw Error(L(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var o = n.return;
    if (o === null) break;
    var l = o.alternate;
    if (l === null) {
      if (((r = o.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (o.child === l.child) {
      for (l = o.child; l; ) {
        if (l === n) return Hc(o), e;
        if (l === r) return Hc(o), t;
        l = l.sibling;
      }
      throw Error(L(188));
    }
    if (n.return !== r.return) (n = o), (r = l);
    else {
      for (var a = !1, i = o.child; i; ) {
        if (i === n) {
          (a = !0), (n = o), (r = l);
          break;
        }
        if (i === r) {
          (a = !0), (r = o), (n = l);
          break;
        }
        i = i.sibling;
      }
      if (!a) {
        for (i = l.child; i; ) {
          if (i === n) {
            (a = !0), (n = l), (r = o);
            break;
          }
          if (i === r) {
            (a = !0), (r = l), (n = o);
            break;
          }
          i = i.sibling;
        }
        if (!a) throw Error(L(189));
      }
    }
    if (n.alternate !== r) throw Error(L(190));
  }
  if (n.tag !== 3) throw Error(L(188));
  return n.stateNode.current === n ? e : t;
}
function qd(e) {
  return (e = mg(e)), e !== null ? Yd(e) : null;
}
function Yd(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Yd(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Xd = at.unstable_scheduleCallback,
  Vc = at.unstable_cancelCallback,
  hg = at.unstable_shouldYield,
  vg = at.unstable_requestPaint,
  Se = at.unstable_now,
  gg = at.unstable_getCurrentPriorityLevel,
  iu = at.unstable_ImmediatePriority,
  Jd = at.unstable_UserBlockingPriority,
  Vl = at.unstable_NormalPriority,
  yg = at.unstable_LowPriority,
  Zd = at.unstable_IdlePriority,
  ka = null,
  Mt = null;
function xg(e) {
  if (Mt && typeof Mt.onCommitFiberRoot == "function")
    try {
      Mt.onCommitFiberRoot(ka, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Ot = Math.clz32 ? Math.clz32 : Sg,
  Eg = Math.log,
  wg = Math.LN2;
function Sg(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Eg(e) / wg) | 0)) | 0;
}
var il = 64,
  ul = 4194304;
function ao(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Kl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    o = e.suspendedLanes,
    l = e.pingedLanes,
    a = n & 268435455;
  if (a !== 0) {
    var i = a & ~o;
    i !== 0 ? (r = ao(i)) : ((l &= a), l !== 0 && (r = ao(l)));
  } else (a = n & ~o), a !== 0 ? (r = ao(a)) : l !== 0 && (r = ao(l));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    (t & o) === 0 &&
    ((o = r & -r), (l = t & -t), o >= l || (o === 16 && (l & 4194240) !== 0))
  )
    return t;
  if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - Ot(t)), (o = 1 << n), (r |= e[n]), (t &= ~o);
  return r;
}
function kg(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Cg(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      l = e.pendingLanes;
    0 < l;

  ) {
    var a = 31 - Ot(l),
      i = 1 << a,
      u = o[a];
    u === -1
      ? ((i & n) === 0 || (i & r) !== 0) && (o[a] = kg(i, t))
      : u <= t && (e.expiredLanes |= i),
      (l &= ~i);
  }
}
function Vs(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function ep() {
  var e = il;
  return (il <<= 1), (il & 4194240) === 0 && (il = 64), e;
}
function Za(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ko(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Ot(t)),
    (e[t] = n);
}
function Ng(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var o = 31 - Ot(n),
      l = 1 << o;
    (t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~l);
  }
}
function uu(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Ot(n),
      o = 1 << r;
    (o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o);
  }
}
var ce = 0;
function tp(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
  );
}
var np,
  cu,
  rp,
  op,
  lp,
  Ks = !1,
  cl = [],
  xn = null,
  En = null,
  wn = null,
  Ro = new Map(),
  Oo = new Map(),
  mn = [],
  Rg =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Kc(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      xn = null;
      break;
    case "dragenter":
    case "dragleave":
      En = null;
      break;
    case "mouseover":
    case "mouseout":
      wn = null;
      break;
    case "pointerover":
    case "pointerout":
      Ro.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Oo.delete(t.pointerId);
  }
}
function qr(e, t, n, r, o, l) {
  return e === null || e.nativeEvent !== l
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: l,
        targetContainers: [o],
      }),
      t !== null && ((t = Qo(t)), t !== null && cu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function Og(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return (xn = qr(xn, e, t, n, r, o)), !0;
    case "dragenter":
      return (En = qr(En, e, t, n, r, o)), !0;
    case "mouseover":
      return (wn = qr(wn, e, t, n, r, o)), !0;
    case "pointerover":
      var l = o.pointerId;
      return Ro.set(l, qr(Ro.get(l) || null, e, t, n, r, o)), !0;
    case "gotpointercapture":
      return (
        (l = o.pointerId), Oo.set(l, qr(Oo.get(l) || null, e, t, n, r, o)), !0
      );
  }
  return !1;
}
function ap(e) {
  var t = Fn(e.target);
  if (t !== null) {
    var n = er(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Qd(n)), t !== null)) {
          (e.blockedOn = t),
            lp(e.priority, function () {
              rp(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function _l(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Gs(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (Bs = r), n.target.dispatchEvent(r), (Bs = null);
    } else return (t = Qo(n)), t !== null && cu(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function Gc(e, t, n) {
  _l(e) && n.delete(t);
}
function _g() {
  (Ks = !1),
    xn !== null && _l(xn) && (xn = null),
    En !== null && _l(En) && (En = null),
    wn !== null && _l(wn) && (wn = null),
    Ro.forEach(Gc),
    Oo.forEach(Gc);
}
function Yr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Ks ||
      ((Ks = !0),
      at.unstable_scheduleCallback(at.unstable_NormalPriority, _g)));
}
function _o(e) {
  function t(o) {
    return Yr(o, e);
  }
  if (0 < cl.length) {
    Yr(cl[0], e);
    for (var n = 1; n < cl.length; n++) {
      var r = cl[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    xn !== null && Yr(xn, e),
      En !== null && Yr(En, e),
      wn !== null && Yr(wn, e),
      Ro.forEach(t),
      Oo.forEach(t),
      n = 0;
    n < mn.length;
    n++
  )
    (r = mn[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < mn.length && ((n = mn[0]), n.blockedOn === null); )
    ap(n), n.blockedOn === null && mn.shift();
}
var Sr = nn.ReactCurrentBatchConfig,
  Gl = !0;
function Pg(e, t, n, r) {
  var o = ce,
    l = Sr.transition;
  Sr.transition = null;
  try {
    (ce = 1), fu(e, t, n, r);
  } finally {
    (ce = o), (Sr.transition = l);
  }
}
function Tg(e, t, n, r) {
  var o = ce,
    l = Sr.transition;
  Sr.transition = null;
  try {
    (ce = 4), fu(e, t, n, r);
  } finally {
    (ce = o), (Sr.transition = l);
  }
}
function fu(e, t, n, r) {
  if (Gl) {
    var o = Gs(e, t, n, r);
    if (o === null) us(e, t, r, Ql, n), Kc(e, r);
    else if (Og(o, e, t, n, r)) r.stopPropagation();
    else if ((Kc(e, r), t & 4 && -1 < Rg.indexOf(e))) {
      for (; o !== null; ) {
        var l = Qo(o);
        if (
          (l !== null && np(l),
          (l = Gs(e, t, n, r)),
          l === null && us(e, t, r, Ql, n),
          l === o)
        )
          break;
        o = l;
      }
      o !== null && r.stopPropagation();
    } else us(e, t, r, null, n);
  }
}
var Ql = null;
function Gs(e, t, n, r) {
  if (((Ql = null), (e = su(r)), (e = Fn(e)), e !== null))
    if (((t = er(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Qd(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (Ql = e), null;
}
function sp(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (gg()) {
        case iu:
          return 1;
        case Jd:
          return 4;
        case Vl:
        case yg:
          return 16;
        case Zd:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var gn = null,
  du = null,
  Pl = null;
function ip() {
  if (Pl) return Pl;
  var e,
    t = du,
    n = t.length,
    r,
    o = "value" in gn ? gn.value : gn.textContent,
    l = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var a = n - e;
  for (r = 1; r <= a && t[n - r] === o[l - r]; r++);
  return (Pl = o.slice(e, 1 < r ? 1 - r : void 0));
}
function Tl(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function fl() {
  return !0;
}
function Qc() {
  return !1;
}
function it(e) {
  function t(n, r, o, l, a) {
    (this._reactName = n),
      (this._targetInst = o),
      (this.type = r),
      (this.nativeEvent = l),
      (this.target = a),
      (this.currentTarget = null);
    for (var i in e)
      e.hasOwnProperty(i) && ((n = e[i]), (this[i] = n ? n(l) : l[i]));
    return (
      (this.isDefaultPrevented = (
        l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1
      )
        ? fl
        : Qc),
      (this.isPropagationStopped = Qc),
      this
    );
  }
  return (
    Ee(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = fl));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = fl));
      },
      persist: function () {},
      isPersistent: fl,
    }),
    t
  );
}
var Ar = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  pu = it(Ar),
  Go = Ee({}, Ar, { view: 0, detail: 0 }),
  bg = it(Go),
  es,
  ts,
  Xr,
  Ca = Ee({}, Go, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: mu,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Xr &&
            (Xr && e.type === "mousemove"
              ? ((es = e.screenX - Xr.screenX), (ts = e.screenY - Xr.screenY))
              : (ts = es = 0),
            (Xr = e)),
          es);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ts;
    },
  }),
  qc = it(Ca),
  $g = Ee({}, Ca, { dataTransfer: 0 }),
  Lg = it($g),
  jg = Ee({}, Go, { relatedTarget: 0 }),
  ns = it(jg),
  Dg = Ee({}, Ar, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Mg = it(Dg),
  Ig = Ee({}, Ar, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  zg = it(Ig),
  Ag = Ee({}, Ar, { data: 0 }),
  Yc = it(Ag),
  Fg = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  Bg = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  Wg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Ug(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Wg[e]) ? !!t[e] : !1;
}
function mu() {
  return Ug;
}
var Hg = Ee({}, Go, {
    key: function (e) {
      if (e.key) {
        var t = Fg[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Tl(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Bg[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: mu,
    charCode: function (e) {
      return e.type === "keypress" ? Tl(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Tl(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  Vg = it(Hg),
  Kg = Ee({}, Ca, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Xc = it(Kg),
  Gg = Ee({}, Go, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: mu,
  }),
  Qg = it(Gg),
  qg = Ee({}, Ar, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Yg = it(qg),
  Xg = Ee({}, Ca, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Jg = it(Xg),
  Zg = [9, 13, 27, 32],
  hu = qt && "CompositionEvent" in window,
  fo = null;
qt && "documentMode" in document && (fo = document.documentMode);
var e0 = qt && "TextEvent" in window && !fo,
  up = qt && (!hu || (fo && 8 < fo && 11 >= fo)),
  Jc = String.fromCharCode(32),
  Zc = !1;
function cp(e, t) {
  switch (e) {
    case "keyup":
      return Zg.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function fp(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var ur = !1;
function t0(e, t) {
  switch (e) {
    case "compositionend":
      return fp(t);
    case "keypress":
      return t.which !== 32 ? null : ((Zc = !0), Jc);
    case "textInput":
      return (e = t.data), e === Jc && Zc ? null : e;
    default:
      return null;
  }
}
function n0(e, t) {
  if (ur)
    return e === "compositionend" || (!hu && cp(e, t))
      ? ((e = ip()), (Pl = du = gn = null), (ur = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return up && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var r0 = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function ef(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!r0[e.type] : t === "textarea";
}
function dp(e, t, n, r) {
  Ud(r),
    (t = ql(t, "onChange")),
    0 < t.length &&
      ((n = new pu("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var po = null,
  Po = null;
function o0(e) {
  kp(e, 0);
}
function Na(e) {
  var t = dr(e);
  if (Md(t)) return e;
}
function l0(e, t) {
  if (e === "change") return t;
}
var pp = !1;
if (qt) {
  var rs;
  if (qt) {
    var os = "oninput" in document;
    if (!os) {
      var tf = document.createElement("div");
      tf.setAttribute("oninput", "return;"),
        (os = typeof tf.oninput == "function");
    }
    rs = os;
  } else rs = !1;
  pp = rs && (!document.documentMode || 9 < document.documentMode);
}
function nf() {
  po && (po.detachEvent("onpropertychange", mp), (Po = po = null));
}
function mp(e) {
  if (e.propertyName === "value" && Na(Po)) {
    var t = [];
    dp(t, Po, e, su(e)), Gd(o0, t);
  }
}
function a0(e, t, n) {
  e === "focusin"
    ? (nf(), (po = t), (Po = n), po.attachEvent("onpropertychange", mp))
    : e === "focusout" && nf();
}
function s0(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Na(Po);
}
function i0(e, t) {
  if (e === "click") return Na(t);
}
function u0(e, t) {
  if (e === "input" || e === "change") return Na(t);
}
function c0(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Pt = typeof Object.is == "function" ? Object.is : c0;
function To(e, t) {
  if (Pt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!Ps.call(t, o) || !Pt(e[o], t[o])) return !1;
  }
  return !0;
}
function rf(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function of(e, t) {
  var n = rf(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = rf(n);
  }
}
function hp(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? hp(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function vp() {
  for (var e = window, t = Wl(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Wl(e.document);
  }
  return t;
}
function vu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function f0(e) {
  var t = vp(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    hp(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && vu(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var o = n.textContent.length,
          l = Math.min(r.start, o);
        (r = r.end === void 0 ? l : Math.min(r.end, o)),
          !e.extend && l > r && ((o = r), (r = l), (l = o)),
          (o = of(n, l));
        var a = of(n, r);
        o &&
          a &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== o.node ||
            e.anchorOffset !== o.offset ||
            e.focusNode !== a.node ||
            e.focusOffset !== a.offset) &&
          ((t = t.createRange()),
          t.setStart(o.node, o.offset),
          e.removeAllRanges(),
          l > r
            ? (e.addRange(t), e.extend(a.node, a.offset))
            : (t.setEnd(a.node, a.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var d0 = qt && "documentMode" in document && 11 >= document.documentMode,
  cr = null,
  Qs = null,
  mo = null,
  qs = !1;
function lf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  qs ||
    cr == null ||
    cr !== Wl(r) ||
    ((r = cr),
    "selectionStart" in r && vu(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (mo && To(mo, r)) ||
      ((mo = r),
      (r = ql(Qs, "onSelect")),
      0 < r.length &&
        ((t = new pu("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = cr))));
}
function dl(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var fr = {
    animationend: dl("Animation", "AnimationEnd"),
    animationiteration: dl("Animation", "AnimationIteration"),
    animationstart: dl("Animation", "AnimationStart"),
    transitionend: dl("Transition", "TransitionEnd"),
  },
  ls = {},
  gp = {};
qt &&
  ((gp = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete fr.animationend.animation,
    delete fr.animationiteration.animation,
    delete fr.animationstart.animation),
  "TransitionEvent" in window || delete fr.transitionend.transition);
function Ra(e) {
  if (ls[e]) return ls[e];
  if (!fr[e]) return e;
  var t = fr[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in gp) return (ls[e] = t[n]);
  return e;
}
var yp = Ra("animationend"),
  xp = Ra("animationiteration"),
  Ep = Ra("animationstart"),
  wp = Ra("transitionend"),
  Sp = new Map(),
  af =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function Tn(e, t) {
  Sp.set(e, t), Zn(t, [e]);
}
for (var as = 0; as < af.length; as++) {
  var ss = af[as],
    p0 = ss.toLowerCase(),
    m0 = ss[0].toUpperCase() + ss.slice(1);
  Tn(p0, "on" + m0);
}
Tn(yp, "onAnimationEnd");
Tn(xp, "onAnimationIteration");
Tn(Ep, "onAnimationStart");
Tn("dblclick", "onDoubleClick");
Tn("focusin", "onFocus");
Tn("focusout", "onBlur");
Tn(wp, "onTransitionEnd");
Rr("onMouseEnter", ["mouseout", "mouseover"]);
Rr("onMouseLeave", ["mouseout", "mouseover"]);
Rr("onPointerEnter", ["pointerout", "pointerover"]);
Rr("onPointerLeave", ["pointerout", "pointerover"]);
Zn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Zn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Zn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Zn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Zn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Zn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var so =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  h0 = new Set("cancel close invalid load scroll toggle".split(" ").concat(so));
function sf(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), pg(r, t, void 0, e), (e.currentTarget = null);
}
function kp(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      o = r.event;
    r = r.listeners;
    e: {
      var l = void 0;
      if (t)
        for (var a = r.length - 1; 0 <= a; a--) {
          var i = r[a],
            u = i.instance,
            c = i.currentTarget;
          if (((i = i.listener), u !== l && o.isPropagationStopped())) break e;
          sf(o, i, c), (l = u);
        }
      else
        for (a = 0; a < r.length; a++) {
          if (
            ((i = r[a]),
            (u = i.instance),
            (c = i.currentTarget),
            (i = i.listener),
            u !== l && o.isPropagationStopped())
          )
            break e;
          sf(o, i, c), (l = u);
        }
    }
  }
  if (Hl) throw ((e = Hs), (Hl = !1), (Hs = null), e);
}
function me(e, t) {
  var n = t[ei];
  n === void 0 && (n = t[ei] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Cp(t, e, 2, !1), n.add(r));
}
function is(e, t, n) {
  var r = 0;
  t && (r |= 4), Cp(n, e, r, t);
}
var pl = "_reactListening" + Math.random().toString(36).slice(2);
function bo(e) {
  if (!e[pl]) {
    (e[pl] = !0),
      bd.forEach(function (n) {
        n !== "selectionchange" && (h0.has(n) || is(n, !1, e), is(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[pl] || ((t[pl] = !0), is("selectionchange", !1, t));
  }
}
function Cp(e, t, n, r) {
  switch (sp(t)) {
    case 1:
      var o = Pg;
      break;
    case 4:
      o = Tg;
      break;
    default:
      o = fu;
  }
  (n = o.bind(null, t, n, e)),
    (o = void 0),
    !Us ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (o = !0),
    r
      ? o !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: o })
        : e.addEventListener(t, n, !0)
      : o !== void 0
        ? e.addEventListener(t, n, { passive: o })
        : e.addEventListener(t, n, !1);
}
function us(e, t, n, r, o) {
  var l = r;
  if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
    e: for (;;) {
      if (r === null) return;
      var a = r.tag;
      if (a === 3 || a === 4) {
        var i = r.stateNode.containerInfo;
        if (i === o || (i.nodeType === 8 && i.parentNode === o)) break;
        if (a === 4)
          for (a = r.return; a !== null; ) {
            var u = a.tag;
            if (
              (u === 3 || u === 4) &&
              ((u = a.stateNode.containerInfo),
              u === o || (u.nodeType === 8 && u.parentNode === o))
            )
              return;
            a = a.return;
          }
        for (; i !== null; ) {
          if (((a = Fn(i)), a === null)) return;
          if (((u = a.tag), u === 5 || u === 6)) {
            r = l = a;
            continue e;
          }
          i = i.parentNode;
        }
      }
      r = r.return;
    }
  Gd(function () {
    var c = l,
      f = su(n),
      d = [];
    e: {
      var h = Sp.get(e);
      if (h !== void 0) {
        var y = pu,
          E = e;
        switch (e) {
          case "keypress":
            if (Tl(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = Vg;
            break;
          case "focusin":
            (E = "focus"), (y = ns);
            break;
          case "focusout":
            (E = "blur"), (y = ns);
            break;
          case "beforeblur":
          case "afterblur":
            y = ns;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            y = qc;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = Lg;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = Qg;
            break;
          case yp:
          case xp:
          case Ep:
            y = Mg;
            break;
          case wp:
            y = Yg;
            break;
          case "scroll":
            y = bg;
            break;
          case "wheel":
            y = Jg;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = zg;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = Xc;
        }
        var x = (t & 4) !== 0,
          k = !x && e === "scroll",
          v = x ? (h !== null ? h + "Capture" : null) : h;
        x = [];
        for (var p = c, g; p !== null; ) {
          g = p;
          var w = g.stateNode;
          if (
            (g.tag === 5 &&
              w !== null &&
              ((g = w),
              v !== null && ((w = No(p, v)), w != null && x.push($o(p, w, g)))),
            k)
          )
            break;
          p = p.return;
        }
        0 < x.length &&
          ((h = new y(h, E, null, n, f)), d.push({ event: h, listeners: x }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((h = e === "mouseover" || e === "pointerover"),
          (y = e === "mouseout" || e === "pointerout"),
          h &&
            n !== Bs &&
            (E = n.relatedTarget || n.fromElement) &&
            (Fn(E) || E[Yt]))
        )
          break e;
        if (
          (y || h) &&
          ((h =
            f.window === f
              ? f
              : (h = f.ownerDocument)
                ? h.defaultView || h.parentWindow
                : window),
          y
            ? ((E = n.relatedTarget || n.toElement),
              (y = c),
              (E = E ? Fn(E) : null),
              E !== null &&
                ((k = er(E)), E !== k || (E.tag !== 5 && E.tag !== 6)) &&
                (E = null))
            : ((y = null), (E = c)),
          y !== E)
        ) {
          if (
            ((x = qc),
            (w = "onMouseLeave"),
            (v = "onMouseEnter"),
            (p = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((x = Xc),
              (w = "onPointerLeave"),
              (v = "onPointerEnter"),
              (p = "pointer")),
            (k = y == null ? h : dr(y)),
            (g = E == null ? h : dr(E)),
            (h = new x(w, p + "leave", y, n, f)),
            (h.target = k),
            (h.relatedTarget = g),
            (w = null),
            Fn(f) === c &&
              ((x = new x(v, p + "enter", E, n, f)),
              (x.target = g),
              (x.relatedTarget = k),
              (w = x)),
            (k = w),
            y && E)
          )
            t: {
              for (x = y, v = E, p = 0, g = x; g; g = tr(g)) p++;
              for (g = 0, w = v; w; w = tr(w)) g++;
              for (; 0 < p - g; ) (x = tr(x)), p--;
              for (; 0 < g - p; ) (v = tr(v)), g--;
              for (; p--; ) {
                if (x === v || (v !== null && x === v.alternate)) break t;
                (x = tr(x)), (v = tr(v));
              }
              x = null;
            }
          else x = null;
          y !== null && uf(d, h, y, x, !1),
            E !== null && k !== null && uf(d, k, E, x, !0);
        }
      }
      e: {
        if (
          ((h = c ? dr(c) : window),
          (y = h.nodeName && h.nodeName.toLowerCase()),
          y === "select" || (y === "input" && h.type === "file"))
        )
          var C = l0;
        else if (ef(h))
          if (pp) C = u0;
          else {
            C = s0;
            var S = a0;
          }
        else
          (y = h.nodeName) &&
            y.toLowerCase() === "input" &&
            (h.type === "checkbox" || h.type === "radio") &&
            (C = i0);
        if (C && (C = C(e, c))) {
          dp(d, C, n, f);
          break e;
        }
        S && S(e, h, c),
          e === "focusout" &&
            (S = h._wrapperState) &&
            S.controlled &&
            h.type === "number" &&
            Ms(h, "number", h.value);
      }
      switch (((S = c ? dr(c) : window), e)) {
        case "focusin":
          (ef(S) || S.contentEditable === "true") &&
            ((cr = S), (Qs = c), (mo = null));
          break;
        case "focusout":
          mo = Qs = cr = null;
          break;
        case "mousedown":
          qs = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (qs = !1), lf(d, n, f);
          break;
        case "selectionchange":
          if (d0) break;
        case "keydown":
        case "keyup":
          lf(d, n, f);
      }
      var N;
      if (hu)
        e: {
          switch (e) {
            case "compositionstart":
              var O = "onCompositionStart";
              break e;
            case "compositionend":
              O = "onCompositionEnd";
              break e;
            case "compositionupdate":
              O = "onCompositionUpdate";
              break e;
          }
          O = void 0;
        }
      else
        ur
          ? cp(e, n) && (O = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (O = "onCompositionStart");
      O &&
        (up &&
          n.locale !== "ko" &&
          (ur || O !== "onCompositionStart"
            ? O === "onCompositionEnd" && ur && (N = ip())
            : ((gn = f),
              (du = "value" in gn ? gn.value : gn.textContent),
              (ur = !0))),
        (S = ql(c, O)),
        0 < S.length &&
          ((O = new Yc(O, e, null, n, f)),
          d.push({ event: O, listeners: S }),
          N ? (O.data = N) : ((N = fp(n)), N !== null && (O.data = N)))),
        (N = e0 ? t0(e, n) : n0(e, n)) &&
          ((c = ql(c, "onBeforeInput")),
          0 < c.length &&
            ((f = new Yc("onBeforeInput", "beforeinput", null, n, f)),
            d.push({ event: f, listeners: c }),
            (f.data = N)));
    }
    kp(d, t);
  });
}
function $o(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function ql(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var o = e,
      l = o.stateNode;
    o.tag === 5 &&
      l !== null &&
      ((o = l),
      (l = No(e, n)),
      l != null && r.unshift($o(e, l, o)),
      (l = No(e, t)),
      l != null && r.push($o(e, l, o))),
      (e = e.return);
  }
  return r;
}
function tr(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function uf(e, t, n, r, o) {
  for (var l = t._reactName, a = []; n !== null && n !== r; ) {
    var i = n,
      u = i.alternate,
      c = i.stateNode;
    if (u !== null && u === r) break;
    i.tag === 5 &&
      c !== null &&
      ((i = c),
      o
        ? ((u = No(n, l)), u != null && a.unshift($o(n, u, i)))
        : o || ((u = No(n, l)), u != null && a.push($o(n, u, i)))),
      (n = n.return);
  }
  a.length !== 0 && e.push({ event: t, listeners: a });
}
var v0 = /\r\n?/g,
  g0 = /\u0000|\uFFFD/g;
function cf(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      v0,
      `
`,
    )
    .replace(g0, "");
}
function ml(e, t, n) {
  if (((t = cf(t)), cf(e) !== t && n)) throw Error(L(425));
}
function Yl() {}
var Ys = null,
  Xs = null;
function Js(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Zs = typeof setTimeout == "function" ? setTimeout : void 0,
  y0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  ff = typeof Promise == "function" ? Promise : void 0,
  x0 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof ff < "u"
        ? function (e) {
            return ff.resolve(null).then(e).catch(E0);
          }
        : Zs;
function E0(e) {
  setTimeout(function () {
    throw e;
  });
}
function cs(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(o), _o(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  _o(t);
}
function Sn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function df(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Fr = Math.random().toString(36).slice(2),
  jt = "__reactFiber$" + Fr,
  Lo = "__reactProps$" + Fr,
  Yt = "__reactContainer$" + Fr,
  ei = "__reactEvents$" + Fr,
  w0 = "__reactListeners$" + Fr,
  S0 = "__reactHandles$" + Fr;
function Fn(e) {
  var t = e[jt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Yt] || n[jt])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = df(e); e !== null; ) {
          if ((n = e[jt])) return n;
          e = df(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Qo(e) {
  return (
    (e = e[jt] || e[Yt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function dr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(L(33));
}
function Oa(e) {
  return e[Lo] || null;
}
var ti = [],
  pr = -1;
function bn(e) {
  return { current: e };
}
function ve(e) {
  0 > pr || ((e.current = ti[pr]), (ti[pr] = null), pr--);
}
function pe(e, t) {
  pr++, (ti[pr] = e.current), (e.current = t);
}
var _n = {},
  Fe = bn(_n),
  Ye = bn(!1),
  Gn = _n;
function Or(e, t) {
  var n = e.type.contextTypes;
  if (!n) return _n;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var o = {},
    l;
  for (l in n) o[l] = t[l];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    o
  );
}
function Xe(e) {
  return (e = e.childContextTypes), e != null;
}
function Xl() {
  ve(Ye), ve(Fe);
}
function pf(e, t, n) {
  if (Fe.current !== _n) throw Error(L(168));
  pe(Fe, t), pe(Ye, n);
}
function Np(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(L(108, ag(e) || "Unknown", o));
  return Ee({}, n, r);
}
function Jl(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || _n),
    (Gn = Fe.current),
    pe(Fe, e),
    pe(Ye, Ye.current),
    !0
  );
}
function mf(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(L(169));
  n
    ? ((e = Np(e, t, Gn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      ve(Ye),
      ve(Fe),
      pe(Fe, e))
    : ve(Ye),
    pe(Ye, n);
}
var Wt = null,
  _a = !1,
  fs = !1;
function Rp(e) {
  Wt === null ? (Wt = [e]) : Wt.push(e);
}
function k0(e) {
  (_a = !0), Rp(e);
}
function $n() {
  if (!fs && Wt !== null) {
    fs = !0;
    var e = 0,
      t = ce;
    try {
      var n = Wt;
      for (ce = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Wt = null), (_a = !1);
    } catch (o) {
      throw (Wt !== null && (Wt = Wt.slice(e + 1)), Xd(iu, $n), o);
    } finally {
      (ce = t), (fs = !1);
    }
  }
  return null;
}
var mr = [],
  hr = 0,
  Zl = null,
  ea = 0,
  ft = [],
  dt = 0,
  Qn = null,
  Ut = 1,
  Ht = "";
function zn(e, t) {
  (mr[hr++] = ea), (mr[hr++] = Zl), (Zl = e), (ea = t);
}
function Op(e, t, n) {
  (ft[dt++] = Ut), (ft[dt++] = Ht), (ft[dt++] = Qn), (Qn = e);
  var r = Ut;
  e = Ht;
  var o = 32 - Ot(r) - 1;
  (r &= ~(1 << o)), (n += 1);
  var l = 32 - Ot(t) + o;
  if (30 < l) {
    var a = o - (o % 5);
    (l = (r & ((1 << a) - 1)).toString(32)),
      (r >>= a),
      (o -= a),
      (Ut = (1 << (32 - Ot(t) + o)) | (n << o) | r),
      (Ht = l + e);
  } else (Ut = (1 << l) | (n << o) | r), (Ht = e);
}
function gu(e) {
  e.return !== null && (zn(e, 1), Op(e, 1, 0));
}
function yu(e) {
  for (; e === Zl; )
    (Zl = mr[--hr]), (mr[hr] = null), (ea = mr[--hr]), (mr[hr] = null);
  for (; e === Qn; )
    (Qn = ft[--dt]),
      (ft[dt] = null),
      (Ht = ft[--dt]),
      (ft[dt] = null),
      (Ut = ft[--dt]),
      (ft[dt] = null);
}
var lt = null,
  rt = null,
  ge = !1,
  Rt = null;
function _p(e, t) {
  var n = pt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function hf(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (lt = e), (rt = Sn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (lt = e), (rt = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Qn !== null ? { id: Ut, overflow: Ht } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = pt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (lt = e),
            (rt = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function ni(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function ri(e) {
  if (ge) {
    var t = rt;
    if (t) {
      var n = t;
      if (!hf(e, t)) {
        if (ni(e)) throw Error(L(418));
        t = Sn(n.nextSibling);
        var r = lt;
        t && hf(e, t)
          ? _p(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (ge = !1), (lt = e));
      }
    } else {
      if (ni(e)) throw Error(L(418));
      (e.flags = (e.flags & -4097) | 2), (ge = !1), (lt = e);
    }
  }
}
function vf(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  lt = e;
}
function hl(e) {
  if (e !== lt) return !1;
  if (!ge) return vf(e), (ge = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Js(e.type, e.memoizedProps))),
    t && (t = rt))
  ) {
    if (ni(e)) throw (Pp(), Error(L(418)));
    for (; t; ) _p(e, t), (t = Sn(t.nextSibling));
  }
  if ((vf(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(L(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              rt = Sn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      rt = null;
    }
  } else rt = lt ? Sn(e.stateNode.nextSibling) : null;
  return !0;
}
function Pp() {
  for (var e = rt; e; ) e = Sn(e.nextSibling);
}
function _r() {
  (rt = lt = null), (ge = !1);
}
function xu(e) {
  Rt === null ? (Rt = [e]) : Rt.push(e);
}
var C0 = nn.ReactCurrentBatchConfig;
function Ct(e, t) {
  if (e && e.defaultProps) {
    (t = Ee({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var ta = bn(null),
  na = null,
  vr = null,
  Eu = null;
function wu() {
  Eu = vr = na = null;
}
function Su(e) {
  var t = ta.current;
  ve(ta), (e._currentValue = t);
}
function oi(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function kr(e, t) {
  (na = e),
    (Eu = vr = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (qe = !0), (e.firstContext = null));
}
function vt(e) {
  var t = e._currentValue;
  if (Eu !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), vr === null)) {
      if (na === null) throw Error(L(308));
      (vr = e), (na.dependencies = { lanes: 0, firstContext: e });
    } else vr = vr.next = e;
  return t;
}
var Bn = null;
function ku(e) {
  Bn === null ? (Bn = [e]) : Bn.push(e);
}
function Tp(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), ku(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    Xt(e, r)
  );
}
function Xt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var dn = !1;
function Cu(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function bp(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function Kt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function kn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), (ae & 2) !== 0)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      Xt(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), ku(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    Xt(e, n)
  );
}
function bl(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), uu(e, n);
  }
}
function gf(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var o = null,
      l = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var a = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        l === null ? (o = l = a) : (l = l.next = a), (n = n.next);
      } while (n !== null);
      l === null ? (o = l = t) : (l = l.next = t);
    } else o = l = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: o,
      lastBaseUpdate: l,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function ra(e, t, n, r) {
  var o = e.updateQueue;
  dn = !1;
  var l = o.firstBaseUpdate,
    a = o.lastBaseUpdate,
    i = o.shared.pending;
  if (i !== null) {
    o.shared.pending = null;
    var u = i,
      c = u.next;
    (u.next = null), a === null ? (l = c) : (a.next = c), (a = u);
    var f = e.alternate;
    f !== null &&
      ((f = f.updateQueue),
      (i = f.lastBaseUpdate),
      i !== a &&
        (i === null ? (f.firstBaseUpdate = c) : (i.next = c),
        (f.lastBaseUpdate = u)));
  }
  if (l !== null) {
    var d = o.baseState;
    (a = 0), (f = c = u = null), (i = l);
    do {
      var h = i.lane,
        y = i.eventTime;
      if ((r & h) === h) {
        f !== null &&
          (f = f.next =
            {
              eventTime: y,
              lane: 0,
              tag: i.tag,
              payload: i.payload,
              callback: i.callback,
              next: null,
            });
        e: {
          var E = e,
            x = i;
          switch (((h = t), (y = n), x.tag)) {
            case 1:
              if (((E = x.payload), typeof E == "function")) {
                d = E.call(y, d, h);
                break e;
              }
              d = E;
              break e;
            case 3:
              E.flags = (E.flags & -65537) | 128;
            case 0:
              if (
                ((E = x.payload),
                (h = typeof E == "function" ? E.call(y, d, h) : E),
                h == null)
              )
                break e;
              d = Ee({}, d, h);
              break e;
            case 2:
              dn = !0;
          }
        }
        i.callback !== null &&
          i.lane !== 0 &&
          ((e.flags |= 64),
          (h = o.effects),
          h === null ? (o.effects = [i]) : h.push(i));
      } else
        (y = {
          eventTime: y,
          lane: h,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null,
        }),
          f === null ? ((c = f = y), (u = d)) : (f = f.next = y),
          (a |= h);
      if (((i = i.next), i === null)) {
        if (((i = o.shared.pending), i === null)) break;
        (h = i),
          (i = h.next),
          (h.next = null),
          (o.lastBaseUpdate = h),
          (o.shared.pending = null);
      }
    } while (1);
    if (
      (f === null && (u = d),
      (o.baseState = u),
      (o.firstBaseUpdate = c),
      (o.lastBaseUpdate = f),
      (t = o.shared.interleaved),
      t !== null)
    ) {
      o = t;
      do (a |= o.lane), (o = o.next);
      while (o !== t);
    } else l === null && (o.shared.lanes = 0);
    (Yn |= a), (e.lanes = a), (e.memoizedState = d);
  }
}
function yf(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        o = r.callback;
      if (o !== null) {
        if (((r.callback = null), (r = n), typeof o != "function"))
          throw Error(L(191, o));
        o.call(r);
      }
    }
}
var $p = new Td.Component().refs;
function li(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Ee({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Pa = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? er(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ve(),
      o = Nn(e),
      l = Kt(r, o);
    (l.payload = t),
      n != null && (l.callback = n),
      (t = kn(e, l, o)),
      t !== null && (_t(t, e, o, r), bl(t, e, o));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ve(),
      o = Nn(e),
      l = Kt(r, o);
    (l.tag = 1),
      (l.payload = t),
      n != null && (l.callback = n),
      (t = kn(e, l, o)),
      t !== null && (_t(t, e, o, r), bl(t, e, o));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Ve(),
      r = Nn(e),
      o = Kt(n, r);
    (o.tag = 2),
      t != null && (o.callback = t),
      (t = kn(e, o, r)),
      t !== null && (_t(t, e, r, n), bl(t, e, r));
  },
};
function xf(e, t, n, r, o, l, a) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, l, a)
      : t.prototype && t.prototype.isPureReactComponent
        ? !To(n, r) || !To(o, l)
        : !0
  );
}
function Lp(e, t, n) {
  var r = !1,
    o = _n,
    l = t.contextType;
  return (
    typeof l == "object" && l !== null
      ? (l = vt(l))
      : ((o = Xe(t) ? Gn : Fe.current),
        (r = t.contextTypes),
        (l = (r = r != null) ? Or(e, o) : _n)),
    (t = new t(n, l)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Pa),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    t
  );
}
function Ef(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Pa.enqueueReplaceState(t, t.state, null);
}
function ai(e, t, n, r) {
  var o = e.stateNode;
  (o.props = n), (o.state = e.memoizedState), (o.refs = $p), Cu(e);
  var l = t.contextType;
  typeof l == "object" && l !== null
    ? (o.context = vt(l))
    : ((l = Xe(t) ? Gn : Fe.current), (o.context = Or(e, l))),
    (o.state = e.memoizedState),
    (l = t.getDerivedStateFromProps),
    typeof l == "function" && (li(e, t, l, n), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && Pa.enqueueReplaceState(o, o.state, null),
      ra(e, n, o, r),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4194308);
}
function Jr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(L(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(L(147, e));
      var o = r,
        l = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === l
        ? t.ref
        : ((t = function (a) {
            var i = o.refs;
            i === $p && (i = o.refs = {}),
              a === null ? delete i[l] : (i[l] = a);
          }),
          (t._stringRef = l),
          t);
    }
    if (typeof e != "string") throw Error(L(284));
    if (!n._owner) throw Error(L(290, e));
  }
  return e;
}
function vl(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      L(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    ))
  );
}
function wf(e) {
  var t = e._init;
  return t(e._payload);
}
function jp(e) {
  function t(v, p) {
    if (e) {
      var g = v.deletions;
      g === null ? ((v.deletions = [p]), (v.flags |= 16)) : g.push(p);
    }
  }
  function n(v, p) {
    if (!e) return null;
    for (; p !== null; ) t(v, p), (p = p.sibling);
    return null;
  }
  function r(v, p) {
    for (v = new Map(); p !== null; )
      p.key !== null ? v.set(p.key, p) : v.set(p.index, p), (p = p.sibling);
    return v;
  }
  function o(v, p) {
    return (v = Rn(v, p)), (v.index = 0), (v.sibling = null), v;
  }
  function l(v, p, g) {
    return (
      (v.index = g),
      e
        ? ((g = v.alternate),
          g !== null
            ? ((g = g.index), g < p ? ((v.flags |= 2), p) : g)
            : ((v.flags |= 2), p))
        : ((v.flags |= 1048576), p)
    );
  }
  function a(v) {
    return e && v.alternate === null && (v.flags |= 2), v;
  }
  function i(v, p, g, w) {
    return p === null || p.tag !== 6
      ? ((p = ys(g, v.mode, w)), (p.return = v), p)
      : ((p = o(p, g)), (p.return = v), p);
  }
  function u(v, p, g, w) {
    var C = g.type;
    return C === ir
      ? f(v, p, g.props.children, w, g.key)
      : p !== null &&
          (p.elementType === C ||
            (typeof C == "object" &&
              C !== null &&
              C.$$typeof === fn &&
              wf(C) === p.type))
        ? ((w = o(p, g.props)), (w.ref = Jr(v, p, g)), (w.return = v), w)
        : ((w = Il(g.type, g.key, g.props, null, v.mode, w)),
          (w.ref = Jr(v, p, g)),
          (w.return = v),
          w);
  }
  function c(v, p, g, w) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== g.containerInfo ||
      p.stateNode.implementation !== g.implementation
      ? ((p = xs(g, v.mode, w)), (p.return = v), p)
      : ((p = o(p, g.children || [])), (p.return = v), p);
  }
  function f(v, p, g, w, C) {
    return p === null || p.tag !== 7
      ? ((p = Vn(g, v.mode, w, C)), (p.return = v), p)
      : ((p = o(p, g)), (p.return = v), p);
  }
  function d(v, p, g) {
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return (p = ys("" + p, v.mode, g)), (p.return = v), p;
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case ll:
          return (
            (g = Il(p.type, p.key, p.props, null, v.mode, g)),
            (g.ref = Jr(v, null, p)),
            (g.return = v),
            g
          );
        case sr:
          return (p = xs(p, v.mode, g)), (p.return = v), p;
        case fn:
          var w = p._init;
          return d(v, w(p._payload), g);
      }
      if (lo(p) || Gr(p))
        return (p = Vn(p, v.mode, g, null)), (p.return = v), p;
      vl(v, p);
    }
    return null;
  }
  function h(v, p, g, w) {
    var C = p !== null ? p.key : null;
    if ((typeof g == "string" && g !== "") || typeof g == "number")
      return C !== null ? null : i(v, p, "" + g, w);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case ll:
          return g.key === C ? u(v, p, g, w) : null;
        case sr:
          return g.key === C ? c(v, p, g, w) : null;
        case fn:
          return (C = g._init), h(v, p, C(g._payload), w);
      }
      if (lo(g) || Gr(g)) return C !== null ? null : f(v, p, g, w, null);
      vl(v, g);
    }
    return null;
  }
  function y(v, p, g, w, C) {
    if ((typeof w == "string" && w !== "") || typeof w == "number")
      return (v = v.get(g) || null), i(p, v, "" + w, C);
    if (typeof w == "object" && w !== null) {
      switch (w.$$typeof) {
        case ll:
          return (v = v.get(w.key === null ? g : w.key) || null), u(p, v, w, C);
        case sr:
          return (v = v.get(w.key === null ? g : w.key) || null), c(p, v, w, C);
        case fn:
          var S = w._init;
          return y(v, p, g, S(w._payload), C);
      }
      if (lo(w) || Gr(w)) return (v = v.get(g) || null), f(p, v, w, C, null);
      vl(p, w);
    }
    return null;
  }
  function E(v, p, g, w) {
    for (
      var C = null, S = null, N = p, O = (p = 0), j = null;
      N !== null && O < g.length;
      O++
    ) {
      N.index > O ? ((j = N), (N = null)) : (j = N.sibling);
      var D = h(v, N, g[O], w);
      if (D === null) {
        N === null && (N = j);
        break;
      }
      e && N && D.alternate === null && t(v, N),
        (p = l(D, p, O)),
        S === null ? (C = D) : (S.sibling = D),
        (S = D),
        (N = j);
    }
    if (O === g.length) return n(v, N), ge && zn(v, O), C;
    if (N === null) {
      for (; O < g.length; O++)
        (N = d(v, g[O], w)),
          N !== null &&
            ((p = l(N, p, O)), S === null ? (C = N) : (S.sibling = N), (S = N));
      return ge && zn(v, O), C;
    }
    for (N = r(v, N); O < g.length; O++)
      (j = y(N, v, O, g[O], w)),
        j !== null &&
          (e && j.alternate !== null && N.delete(j.key === null ? O : j.key),
          (p = l(j, p, O)),
          S === null ? (C = j) : (S.sibling = j),
          (S = j));
    return (
      e &&
        N.forEach(function (z) {
          return t(v, z);
        }),
      ge && zn(v, O),
      C
    );
  }
  function x(v, p, g, w) {
    var C = Gr(g);
    if (typeof C != "function") throw Error(L(150));
    if (((g = C.call(g)), g == null)) throw Error(L(151));
    for (
      var S = (C = null), N = p, O = (p = 0), j = null, D = g.next();
      N !== null && !D.done;
      O++, D = g.next()
    ) {
      N.index > O ? ((j = N), (N = null)) : (j = N.sibling);
      var z = h(v, N, D.value, w);
      if (z === null) {
        N === null && (N = j);
        break;
      }
      e && N && z.alternate === null && t(v, N),
        (p = l(z, p, O)),
        S === null ? (C = z) : (S.sibling = z),
        (S = z),
        (N = j);
    }
    if (D.done) return n(v, N), ge && zn(v, O), C;
    if (N === null) {
      for (; !D.done; O++, D = g.next())
        (D = d(v, D.value, w)),
          D !== null &&
            ((p = l(D, p, O)), S === null ? (C = D) : (S.sibling = D), (S = D));
      return ge && zn(v, O), C;
    }
    for (N = r(v, N); !D.done; O++, D = g.next())
      (D = y(N, v, O, D.value, w)),
        D !== null &&
          (e && D.alternate !== null && N.delete(D.key === null ? O : D.key),
          (p = l(D, p, O)),
          S === null ? (C = D) : (S.sibling = D),
          (S = D));
    return (
      e &&
        N.forEach(function (G) {
          return t(v, G);
        }),
      ge && zn(v, O),
      C
    );
  }
  function k(v, p, g, w) {
    if (
      (typeof g == "object" &&
        g !== null &&
        g.type === ir &&
        g.key === null &&
        (g = g.props.children),
      typeof g == "object" && g !== null)
    ) {
      switch (g.$$typeof) {
        case ll:
          e: {
            for (var C = g.key, S = p; S !== null; ) {
              if (S.key === C) {
                if (((C = g.type), C === ir)) {
                  if (S.tag === 7) {
                    n(v, S.sibling),
                      (p = o(S, g.props.children)),
                      (p.return = v),
                      (v = p);
                    break e;
                  }
                } else if (
                  S.elementType === C ||
                  (typeof C == "object" &&
                    C !== null &&
                    C.$$typeof === fn &&
                    wf(C) === S.type)
                ) {
                  n(v, S.sibling),
                    (p = o(S, g.props)),
                    (p.ref = Jr(v, S, g)),
                    (p.return = v),
                    (v = p);
                  break e;
                }
                n(v, S);
                break;
              } else t(v, S);
              S = S.sibling;
            }
            g.type === ir
              ? ((p = Vn(g.props.children, v.mode, w, g.key)),
                (p.return = v),
                (v = p))
              : ((w = Il(g.type, g.key, g.props, null, v.mode, w)),
                (w.ref = Jr(v, p, g)),
                (w.return = v),
                (v = w));
          }
          return a(v);
        case sr:
          e: {
            for (S = g.key; p !== null; ) {
              if (p.key === S)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === g.containerInfo &&
                  p.stateNode.implementation === g.implementation
                ) {
                  n(v, p.sibling),
                    (p = o(p, g.children || [])),
                    (p.return = v),
                    (v = p);
                  break e;
                } else {
                  n(v, p);
                  break;
                }
              else t(v, p);
              p = p.sibling;
            }
            (p = xs(g, v.mode, w)), (p.return = v), (v = p);
          }
          return a(v);
        case fn:
          return (S = g._init), k(v, p, S(g._payload), w);
      }
      if (lo(g)) return E(v, p, g, w);
      if (Gr(g)) return x(v, p, g, w);
      vl(v, g);
    }
    return (typeof g == "string" && g !== "") || typeof g == "number"
      ? ((g = "" + g),
        p !== null && p.tag === 6
          ? (n(v, p.sibling), (p = o(p, g)), (p.return = v), (v = p))
          : (n(v, p), (p = ys(g, v.mode, w)), (p.return = v), (v = p)),
        a(v))
      : n(v, p);
  }
  return k;
}
var Pr = jp(!0),
  Dp = jp(!1),
  qo = {},
  It = bn(qo),
  jo = bn(qo),
  Do = bn(qo);
function Wn(e) {
  if (e === qo) throw Error(L(174));
  return e;
}
function Nu(e, t) {
  switch ((pe(Do, t), pe(jo, e), pe(It, qo), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : zs(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = zs(t, e));
  }
  ve(It), pe(It, t);
}
function Tr() {
  ve(It), ve(jo), ve(Do);
}
function Mp(e) {
  Wn(Do.current);
  var t = Wn(It.current),
    n = zs(t, e.type);
  t !== n && (pe(jo, e), pe(It, n));
}
function Ru(e) {
  jo.current === e && (ve(It), ve(jo));
}
var ye = bn(0);
function oa(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if ((t.flags & 128) !== 0) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var ds = [];
function Ou() {
  for (var e = 0; e < ds.length; e++)
    ds[e]._workInProgressVersionPrimary = null;
  ds.length = 0;
}
var $l = nn.ReactCurrentDispatcher,
  ps = nn.ReactCurrentBatchConfig,
  qn = 0,
  xe = null,
  Re = null,
  Pe = null,
  la = !1,
  ho = !1,
  Mo = 0,
  N0 = 0;
function Me() {
  throw Error(L(321));
}
function _u(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Pt(e[n], t[n])) return !1;
  return !0;
}
function Pu(e, t, n, r, o, l) {
  if (
    ((qn = l),
    (xe = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    ($l.current = e === null || e.memoizedState === null ? P0 : T0),
    (e = n(r, o)),
    ho)
  ) {
    l = 0;
    do {
      if (((ho = !1), (Mo = 0), 25 <= l)) throw Error(L(301));
      (l += 1),
        (Pe = Re = null),
        (t.updateQueue = null),
        ($l.current = b0),
        (e = n(r, o));
    } while (ho);
  }
  if (
    (($l.current = aa),
    (t = Re !== null && Re.next !== null),
    (qn = 0),
    (Pe = Re = xe = null),
    (la = !1),
    t)
  )
    throw Error(L(300));
  return e;
}
function Tu() {
  var e = Mo !== 0;
  return (Mo = 0), e;
}
function bt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Pe === null ? (xe.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe;
}
function gt() {
  if (Re === null) {
    var e = xe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Re.next;
  var t = Pe === null ? xe.memoizedState : Pe.next;
  if (t !== null) (Pe = t), (Re = e);
  else {
    if (e === null) throw Error(L(310));
    (Re = e),
      (e = {
        memoizedState: Re.memoizedState,
        baseState: Re.baseState,
        baseQueue: Re.baseQueue,
        queue: Re.queue,
        next: null,
      }),
      Pe === null ? (xe.memoizedState = Pe = e) : (Pe = Pe.next = e);
  }
  return Pe;
}
function Io(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function ms(e) {
  var t = gt(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var r = Re,
    o = r.baseQueue,
    l = n.pending;
  if (l !== null) {
    if (o !== null) {
      var a = o.next;
      (o.next = l.next), (l.next = a);
    }
    (r.baseQueue = o = l), (n.pending = null);
  }
  if (o !== null) {
    (l = o.next), (r = r.baseState);
    var i = (a = null),
      u = null,
      c = l;
    do {
      var f = c.lane;
      if ((qn & f) === f)
        u !== null &&
          (u = u.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action));
      else {
        var d = {
          lane: f,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        u === null ? ((i = u = d), (a = r)) : (u = u.next = d),
          (xe.lanes |= f),
          (Yn |= f);
      }
      c = c.next;
    } while (c !== null && c !== l);
    u === null ? (a = r) : (u.next = i),
      Pt(r, t.memoizedState) || (qe = !0),
      (t.memoizedState = r),
      (t.baseState = a),
      (t.baseQueue = u),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do (l = o.lane), (xe.lanes |= l), (Yn |= l), (o = o.next);
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function hs(e) {
  var t = gt(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    o = n.pending,
    l = t.memoizedState;
  if (o !== null) {
    n.pending = null;
    var a = (o = o.next);
    do (l = e(l, a.action)), (a = a.next);
    while (a !== o);
    Pt(l, t.memoizedState) || (qe = !0),
      (t.memoizedState = l),
      t.baseQueue === null && (t.baseState = l),
      (n.lastRenderedState = l);
  }
  return [l, r];
}
function Ip() {}
function zp(e, t) {
  var n = xe,
    r = gt(),
    o = t(),
    l = !Pt(r.memoizedState, o);
  if (
    (l && ((r.memoizedState = o), (qe = !0)),
    (r = r.queue),
    bu(Bp.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || l || (Pe !== null && Pe.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      zo(9, Fp.bind(null, n, r, o, t), void 0, null),
      Te === null)
    )
      throw Error(L(349));
    (qn & 30) !== 0 || Ap(n, t, o);
  }
  return o;
}
function Ap(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = xe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (xe.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Fp(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Wp(t) && Up(e);
}
function Bp(e, t, n) {
  return n(function () {
    Wp(t) && Up(e);
  });
}
function Wp(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Pt(e, n);
  } catch {
    return !0;
  }
}
function Up(e) {
  var t = Xt(e, 1);
  t !== null && _t(t, e, 1, -1);
}
function Sf(e) {
  var t = bt();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Io,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = _0.bind(null, xe, e)),
    [t.memoizedState, e]
  );
}
function zo(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = xe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (xe.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function Hp() {
  return gt().memoizedState;
}
function Ll(e, t, n, r) {
  var o = bt();
  (xe.flags |= e),
    (o.memoizedState = zo(1 | t, n, void 0, r === void 0 ? null : r));
}
function Ta(e, t, n, r) {
  var o = gt();
  r = r === void 0 ? null : r;
  var l = void 0;
  if (Re !== null) {
    var a = Re.memoizedState;
    if (((l = a.destroy), r !== null && _u(r, a.deps))) {
      o.memoizedState = zo(t, n, l, r);
      return;
    }
  }
  (xe.flags |= e), (o.memoizedState = zo(1 | t, n, l, r));
}
function kf(e, t) {
  return Ll(8390656, 8, e, t);
}
function bu(e, t) {
  return Ta(2048, 8, e, t);
}
function Vp(e, t) {
  return Ta(4, 2, e, t);
}
function Kp(e, t) {
  return Ta(4, 4, e, t);
}
function Gp(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Qp(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), Ta(4, 4, Gp.bind(null, t, e), n)
  );
}
function $u() {}
function qp(e, t) {
  var n = gt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && _u(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Yp(e, t) {
  var n = gt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && _u(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Xp(e, t, n) {
  return (qn & 21) === 0
    ? (e.baseState && ((e.baseState = !1), (qe = !0)), (e.memoizedState = n))
    : (Pt(n, t) || ((n = ep()), (xe.lanes |= n), (Yn |= n), (e.baseState = !0)),
      t);
}
function R0(e, t) {
  var n = ce;
  (ce = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = ps.transition;
  ps.transition = {};
  try {
    e(!1), t();
  } finally {
    (ce = n), (ps.transition = r);
  }
}
function Jp() {
  return gt().memoizedState;
}
function O0(e, t, n) {
  var r = Nn(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Zp(e))
  )
    em(t, n);
  else if (((n = Tp(e, t, n, r)), n !== null)) {
    var o = Ve();
    _t(n, e, r, o), tm(n, t, r);
  }
}
function _0(e, t, n) {
  var r = Nn(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Zp(e)) em(t, o);
  else {
    var l = e.alternate;
    if (
      e.lanes === 0 &&
      (l === null || l.lanes === 0) &&
      ((l = t.lastRenderedReducer), l !== null)
    )
      try {
        var a = t.lastRenderedState,
          i = l(a, n);
        if (((o.hasEagerState = !0), (o.eagerState = i), Pt(i, a))) {
          var u = t.interleaved;
          u === null
            ? ((o.next = o), ku(t))
            : ((o.next = u.next), (u.next = o)),
            (t.interleaved = o);
          return;
        }
      } catch {
      } finally {
      }
    (n = Tp(e, t, o, r)),
      n !== null && ((o = Ve()), _t(n, e, r, o), tm(n, t, r));
  }
}
function Zp(e) {
  var t = e.alternate;
  return e === xe || (t !== null && t === xe);
}
function em(e, t) {
  ho = la = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function tm(e, t, n) {
  if ((n & 4194240) !== 0) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), uu(e, n);
  }
}
var aa = {
    readContext: vt,
    useCallback: Me,
    useContext: Me,
    useEffect: Me,
    useImperativeHandle: Me,
    useInsertionEffect: Me,
    useLayoutEffect: Me,
    useMemo: Me,
    useReducer: Me,
    useRef: Me,
    useState: Me,
    useDebugValue: Me,
    useDeferredValue: Me,
    useTransition: Me,
    useMutableSource: Me,
    useSyncExternalStore: Me,
    useId: Me,
    unstable_isNewReconciler: !1,
  },
  P0 = {
    readContext: vt,
    useCallback: function (e, t) {
      return (bt().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: vt,
    useEffect: kf,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Ll(4194308, 4, Gp.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Ll(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Ll(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = bt();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = bt();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = O0.bind(null, xe, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = bt();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Sf,
    useDebugValue: $u,
    useDeferredValue: function (e) {
      return (bt().memoizedState = e);
    },
    useTransition: function () {
      var e = Sf(!1),
        t = e[0];
      return (e = R0.bind(null, e[1])), (bt().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = xe,
        o = bt();
      if (ge) {
        if (n === void 0) throw Error(L(407));
        n = n();
      } else {
        if (((n = t()), Te === null)) throw Error(L(349));
        (qn & 30) !== 0 || Ap(r, t, n);
      }
      o.memoizedState = n;
      var l = { value: n, getSnapshot: t };
      return (
        (o.queue = l),
        kf(Bp.bind(null, r, l, e), [e]),
        (r.flags |= 2048),
        zo(9, Fp.bind(null, r, l, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = bt(),
        t = Te.identifierPrefix;
      if (ge) {
        var n = Ht,
          r = Ut;
        (n = (r & ~(1 << (32 - Ot(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Mo++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = N0++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  T0 = {
    readContext: vt,
    useCallback: qp,
    useContext: vt,
    useEffect: bu,
    useImperativeHandle: Qp,
    useInsertionEffect: Vp,
    useLayoutEffect: Kp,
    useMemo: Yp,
    useReducer: ms,
    useRef: Hp,
    useState: function () {
      return ms(Io);
    },
    useDebugValue: $u,
    useDeferredValue: function (e) {
      var t = gt();
      return Xp(t, Re.memoizedState, e);
    },
    useTransition: function () {
      var e = ms(Io)[0],
        t = gt().memoizedState;
      return [e, t];
    },
    useMutableSource: Ip,
    useSyncExternalStore: zp,
    useId: Jp,
    unstable_isNewReconciler: !1,
  },
  b0 = {
    readContext: vt,
    useCallback: qp,
    useContext: vt,
    useEffect: bu,
    useImperativeHandle: Qp,
    useInsertionEffect: Vp,
    useLayoutEffect: Kp,
    useMemo: Yp,
    useReducer: hs,
    useRef: Hp,
    useState: function () {
      return hs(Io);
    },
    useDebugValue: $u,
    useDeferredValue: function (e) {
      var t = gt();
      return Re === null ? (t.memoizedState = e) : Xp(t, Re.memoizedState, e);
    },
    useTransition: function () {
      var e = hs(Io)[0],
        t = gt().memoizedState;
      return [e, t];
    },
    useMutableSource: Ip,
    useSyncExternalStore: zp,
    useId: Jp,
    unstable_isNewReconciler: !1,
  };
function br(e, t) {
  try {
    var n = "",
      r = t;
    do (n += lg(r)), (r = r.return);
    while (r);
    var o = n;
  } catch (l) {
    o =
      `
Error generating stack: ` +
      l.message +
      `
` +
      l.stack;
  }
  return { value: e, source: t, stack: o, digest: null };
}
function vs(e, t, n) {
  return {
    value: e,
    source: null,
    stack: n != null ? n : null,
    digest: t != null ? t : null,
  };
}
function si(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var $0 = typeof WeakMap == "function" ? WeakMap : Map;
function nm(e, t, n) {
  (n = Kt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      ia || ((ia = !0), (gi = r)), si(e, t);
    }),
    n
  );
}
function rm(e, t, n) {
  (n = Kt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    (n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        si(e, t);
      });
  }
  var l = e.stateNode;
  return (
    l !== null &&
      typeof l.componentDidCatch == "function" &&
      (n.callback = function () {
        si(e, t),
          typeof r != "function" &&
            (Cn === null ? (Cn = new Set([this])) : Cn.add(this));
        var a = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: a !== null ? a : "",
        });
      }),
    n
  );
}
function Cf(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new $0();
    var o = new Set();
    r.set(t, o);
  } else (o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o));
  o.has(n) || (o.add(n), (e = K0.bind(null, e, t, n)), t.then(e, e));
}
function Nf(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Rf(e, t, n, r, o) {
  return (e.mode & 1) === 0
    ? (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Kt(-1, 1)), (t.tag = 2), kn(n, t, 1))),
          (n.lanes |= 1)),
      e)
    : ((e.flags |= 65536), (e.lanes = o), e);
}
var L0 = nn.ReactCurrentOwner,
  qe = !1;
function We(e, t, n, r) {
  t.child = e === null ? Dp(t, null, n, r) : Pr(t, e.child, n, r);
}
function Of(e, t, n, r, o) {
  n = n.render;
  var l = t.ref;
  return (
    kr(t, o),
    (r = Pu(e, t, n, r, l, o)),
    (n = Tu()),
    e !== null && !qe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Jt(e, t, o))
      : (ge && n && gu(t), (t.flags |= 1), We(e, t, r, o), t.child)
  );
}
function _f(e, t, n, r, o) {
  if (e === null) {
    var l = n.type;
    return typeof l == "function" &&
      !Fu(l) &&
      l.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = l), om(e, t, l, r, o))
      : ((e = Il(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((l = e.child), (e.lanes & o) === 0)) {
    var a = l.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : To), n(a, r) && e.ref === t.ref)
    )
      return Jt(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = Rn(l, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function om(e, t, n, r, o) {
  if (e !== null) {
    var l = e.memoizedProps;
    if (To(l, r) && e.ref === t.ref)
      if (((qe = !1), (t.pendingProps = r = l), (e.lanes & o) !== 0))
        (e.flags & 131072) !== 0 && (qe = !0);
      else return (t.lanes = e.lanes), Jt(e, t, o);
  }
  return ii(e, t, n, r, o);
}
function lm(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    l = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if ((t.mode & 1) === 0)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        pe(yr, tt),
        (tt |= n);
    else {
      if ((n & 1073741824) === 0)
        return (
          (e = l !== null ? l.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          pe(yr, tt),
          (tt |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = l !== null ? l.baseLanes : n),
        pe(yr, tt),
        (tt |= r);
    }
  else
    l !== null ? ((r = l.baseLanes | n), (t.memoizedState = null)) : (r = n),
      pe(yr, tt),
      (tt |= r);
  return We(e, t, o, n), t.child;
}
function am(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ii(e, t, n, r, o) {
  var l = Xe(n) ? Gn : Fe.current;
  return (
    (l = Or(t, l)),
    kr(t, o),
    (n = Pu(e, t, n, r, l, o)),
    (r = Tu()),
    e !== null && !qe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Jt(e, t, o))
      : (ge && r && gu(t), (t.flags |= 1), We(e, t, n, o), t.child)
  );
}
function Pf(e, t, n, r, o) {
  if (Xe(n)) {
    var l = !0;
    Jl(t);
  } else l = !1;
  if ((kr(t, o), t.stateNode === null))
    jl(e, t), Lp(t, n, r), ai(t, n, r, o), (r = !0);
  else if (e === null) {
    var a = t.stateNode,
      i = t.memoizedProps;
    a.props = i;
    var u = a.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = vt(c))
      : ((c = Xe(n) ? Gn : Fe.current), (c = Or(t, c)));
    var f = n.getDerivedStateFromProps,
      d =
        typeof f == "function" ||
        typeof a.getSnapshotBeforeUpdate == "function";
    d ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((i !== r || u !== c) && Ef(t, a, r, c)),
      (dn = !1);
    var h = t.memoizedState;
    (a.state = h),
      ra(t, r, a, o),
      (u = t.memoizedState),
      i !== r || h !== u || Ye.current || dn
        ? (typeof f == "function" && (li(t, n, f, r), (u = t.memoizedState)),
          (i = dn || xf(t, n, i, r, h, u, c))
            ? (d ||
                (typeof a.UNSAFE_componentWillMount != "function" &&
                  typeof a.componentWillMount != "function") ||
                (typeof a.componentWillMount == "function" &&
                  a.componentWillMount(),
                typeof a.UNSAFE_componentWillMount == "function" &&
                  a.UNSAFE_componentWillMount()),
              typeof a.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = u)),
          (a.props = r),
          (a.state = u),
          (a.context = c),
          (r = i))
        : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (a = t.stateNode),
      bp(e, t),
      (i = t.memoizedProps),
      (c = t.type === t.elementType ? i : Ct(t.type, i)),
      (a.props = c),
      (d = t.pendingProps),
      (h = a.context),
      (u = n.contextType),
      typeof u == "object" && u !== null
        ? (u = vt(u))
        : ((u = Xe(n) ? Gn : Fe.current), (u = Or(t, u)));
    var y = n.getDerivedStateFromProps;
    (f =
      typeof y == "function" ||
      typeof a.getSnapshotBeforeUpdate == "function") ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((i !== d || h !== u) && Ef(t, a, r, u)),
      (dn = !1),
      (h = t.memoizedState),
      (a.state = h),
      ra(t, r, a, o);
    var E = t.memoizedState;
    i !== d || h !== E || Ye.current || dn
      ? (typeof y == "function" && (li(t, n, y, r), (E = t.memoizedState)),
        (c = dn || xf(t, n, c, r, h, E, u) || !1)
          ? (f ||
              (typeof a.UNSAFE_componentWillUpdate != "function" &&
                typeof a.componentWillUpdate != "function") ||
              (typeof a.componentWillUpdate == "function" &&
                a.componentWillUpdate(r, E, u),
              typeof a.UNSAFE_componentWillUpdate == "function" &&
                a.UNSAFE_componentWillUpdate(r, E, u)),
            typeof a.componentDidUpdate == "function" && (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof a.componentDidUpdate != "function" ||
              (i === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != "function" ||
              (i === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = E)),
        (a.props = r),
        (a.state = E),
        (a.context = u),
        (r = c))
      : (typeof a.componentDidUpdate != "function" ||
          (i === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 4),
        typeof a.getSnapshotBeforeUpdate != "function" ||
          (i === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return ui(e, t, n, r, l, o);
}
function ui(e, t, n, r, o, l) {
  am(e, t);
  var a = (t.flags & 128) !== 0;
  if (!r && !a) return o && mf(t, n, !1), Jt(e, t, l);
  (r = t.stateNode), (L0.current = t);
  var i =
    a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && a
      ? ((t.child = Pr(t, e.child, null, l)), (t.child = Pr(t, null, i, l)))
      : We(e, t, i, l),
    (t.memoizedState = r.state),
    o && mf(t, n, !0),
    t.child
  );
}
function sm(e) {
  var t = e.stateNode;
  t.pendingContext
    ? pf(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && pf(e, t.context, !1),
    Nu(e, t.containerInfo);
}
function Tf(e, t, n, r, o) {
  return _r(), xu(o), (t.flags |= 256), We(e, t, n, r), t.child;
}
var ci = { dehydrated: null, treeContext: null, retryLane: 0 };
function fi(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function im(e, t, n) {
  var r = t.pendingProps,
    o = ye.current,
    l = !1,
    a = (t.flags & 128) !== 0,
    i;
  if (
    ((i = a) ||
      (i = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    i
      ? ((l = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (o |= 1),
    pe(ye, o & 1),
    e === null)
  )
    return (
      ri(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? ((t.mode & 1) === 0
            ? (t.lanes = 1)
            : e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824),
          null)
        : ((a = r.children),
          (e = r.fallback),
          l
            ? ((r = t.mode),
              (l = t.child),
              (a = { mode: "hidden", children: a }),
              (r & 1) === 0 && l !== null
                ? ((l.childLanes = 0), (l.pendingProps = a))
                : (l = La(a, r, 0, null)),
              (e = Vn(e, r, n, null)),
              (l.return = t),
              (e.return = t),
              (l.sibling = e),
              (t.child = l),
              (t.child.memoizedState = fi(n)),
              (t.memoizedState = ci),
              e)
            : Lu(t, a))
    );
  if (((o = e.memoizedState), o !== null && ((i = o.dehydrated), i !== null)))
    return j0(e, t, a, r, i, o, n);
  if (l) {
    (l = r.fallback), (a = t.mode), (o = e.child), (i = o.sibling);
    var u = { mode: "hidden", children: r.children };
    return (
      (a & 1) === 0 && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = u),
          (t.deletions = null))
        : ((r = Rn(o, u)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      i !== null ? (l = Rn(i, l)) : ((l = Vn(l, a, n, null)), (l.flags |= 2)),
      (l.return = t),
      (r.return = t),
      (r.sibling = l),
      (t.child = r),
      (r = l),
      (l = t.child),
      (a = e.child.memoizedState),
      (a =
        a === null
          ? fi(n)
          : {
              baseLanes: a.baseLanes | n,
              cachePool: null,
              transitions: a.transitions,
            }),
      (l.memoizedState = a),
      (l.childLanes = e.childLanes & ~n),
      (t.memoizedState = ci),
      r
    );
  }
  return (
    (l = e.child),
    (e = l.sibling),
    (r = Rn(l, { mode: "visible", children: r.children })),
    (t.mode & 1) === 0 && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Lu(e, t) {
  return (
    (t = La({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function gl(e, t, n, r) {
  return (
    r !== null && xu(r),
    Pr(t, e.child, null, n),
    (e = Lu(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function j0(e, t, n, r, o, l, a) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = vs(Error(L(422)))), gl(e, t, a, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((l = r.fallback),
          (o = t.mode),
          (r = La({ mode: "visible", children: r.children }, o, 0, null)),
          (l = Vn(l, o, a, null)),
          (l.flags |= 2),
          (r.return = t),
          (l.return = t),
          (r.sibling = l),
          (t.child = r),
          (t.mode & 1) !== 0 && Pr(t, e.child, null, a),
          (t.child.memoizedState = fi(a)),
          (t.memoizedState = ci),
          l);
  if ((t.mode & 1) === 0) return gl(e, t, a, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var i = r.dgst;
    return (r = i), (l = Error(L(419))), (r = vs(l, r, void 0)), gl(e, t, a, r);
  }
  if (((i = (a & e.childLanes) !== 0), qe || i)) {
    if (((r = Te), r !== null)) {
      switch (a & -a) {
        case 4:
          o = 2;
          break;
        case 16:
          o = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          o = 32;
          break;
        case 536870912:
          o = 268435456;
          break;
        default:
          o = 0;
      }
      (o = (o & (r.suspendedLanes | a)) !== 0 ? 0 : o),
        o !== 0 &&
          o !== l.retryLane &&
          ((l.retryLane = o), Xt(e, o), _t(r, e, o, -1));
    }
    return Au(), (r = vs(Error(L(421)))), gl(e, t, a, r);
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = G0.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = l.treeContext),
      (rt = Sn(o.nextSibling)),
      (lt = t),
      (ge = !0),
      (Rt = null),
      e !== null &&
        ((ft[dt++] = Ut),
        (ft[dt++] = Ht),
        (ft[dt++] = Qn),
        (Ut = e.id),
        (Ht = e.overflow),
        (Qn = t)),
      (t = Lu(t, r.children)),
      (t.flags |= 4096),
      t);
}
function bf(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), oi(e.return, t, n);
}
function gs(e, t, n, r, o) {
  var l = e.memoizedState;
  l === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: o,
      })
    : ((l.isBackwards = t),
      (l.rendering = null),
      (l.renderingStartTime = 0),
      (l.last = r),
      (l.tail = n),
      (l.tailMode = o));
}
function um(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    l = r.tail;
  if ((We(e, t, r.children, n), (r = ye.current), (r & 2) !== 0))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && bf(e, n, t);
        else if (e.tag === 19) bf(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((pe(ye, r), (t.mode & 1) === 0)) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; )
          (e = n.alternate),
            e !== null && oa(e) === null && (o = n),
            (n = n.sibling);
        (n = o),
          n === null
            ? ((o = t.child), (t.child = null))
            : ((o = n.sibling), (n.sibling = null)),
          gs(t, !1, o, n, l);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && oa(e) === null)) {
            t.child = o;
            break;
          }
          (e = o.sibling), (o.sibling = n), (n = o), (o = e);
        }
        gs(t, !0, n, null, l);
        break;
      case "together":
        gs(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function jl(e, t) {
  (t.mode & 1) === 0 &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Jt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Yn |= t.lanes),
    (n & t.childLanes) === 0)
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(L(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Rn(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = Rn(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function D0(e, t, n) {
  switch (t.tag) {
    case 3:
      sm(t), _r();
      break;
    case 5:
      Mp(t);
      break;
    case 1:
      Xe(t.type) && Jl(t);
      break;
    case 4:
      Nu(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        o = t.memoizedProps.value;
      pe(ta, r._currentValue), (r._currentValue = o);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (pe(ye, ye.current & 1), (t.flags |= 128), null)
          : (n & t.child.childLanes) !== 0
            ? im(e, t, n)
            : (pe(ye, ye.current & 1),
              (e = Jt(e, t, n)),
              e !== null ? e.sibling : null);
      pe(ye, ye.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
        if (r) return um(e, t, n);
        t.flags |= 128;
      }
      if (
        ((o = t.memoizedState),
        o !== null &&
          ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
        pe(ye, ye.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), lm(e, t, n);
  }
  return Jt(e, t, n);
}
var cm, di, fm, dm;
cm = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
di = function () {};
fm = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    (e = t.stateNode), Wn(It.current);
    var l = null;
    switch (n) {
      case "input":
        (o = js(e, o)), (r = js(e, r)), (l = []);
        break;
      case "select":
        (o = Ee({}, o, { value: void 0 })),
          (r = Ee({}, r, { value: void 0 })),
          (l = []);
        break;
      case "textarea":
        (o = Is(e, o)), (r = Is(e, r)), (l = []);
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Yl);
    }
    As(n, r);
    var a;
    n = null;
    for (c in o)
      if (!r.hasOwnProperty(c) && o.hasOwnProperty(c) && o[c] != null)
        if (c === "style") {
          var i = o[c];
          for (a in i) i.hasOwnProperty(a) && (n || (n = {}), (n[a] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (ko.hasOwnProperty(c)
              ? l || (l = [])
              : (l = l || []).push(c, null));
    for (c in r) {
      var u = r[c];
      if (
        ((i = o != null ? o[c] : void 0),
        r.hasOwnProperty(c) && u !== i && (u != null || i != null))
      )
        if (c === "style")
          if (i) {
            for (a in i)
              !i.hasOwnProperty(a) ||
                (u && u.hasOwnProperty(a)) ||
                (n || (n = {}), (n[a] = ""));
            for (a in u)
              u.hasOwnProperty(a) &&
                i[a] !== u[a] &&
                (n || (n = {}), (n[a] = u[a]));
          } else n || (l || (l = []), l.push(c, n)), (n = u);
        else
          c === "dangerouslySetInnerHTML"
            ? ((u = u ? u.__html : void 0),
              (i = i ? i.__html : void 0),
              u != null && i !== u && (l = l || []).push(c, u))
            : c === "children"
              ? (typeof u != "string" && typeof u != "number") ||
                (l = l || []).push(c, "" + u)
              : c !== "suppressContentEditableWarning" &&
                c !== "suppressHydrationWarning" &&
                (ko.hasOwnProperty(c)
                  ? (u != null && c === "onScroll" && me("scroll", e),
                    l || i === u || (l = []))
                  : (l = l || []).push(c, u));
    }
    n && (l = l || []).push("style", n);
    var c = l;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
dm = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Zr(e, t) {
  if (!ge)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Ie(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var o = e.child; o !== null; )
      (n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags & 14680064),
        (r |= o.flags & 14680064),
        (o.return = e),
        (o = o.sibling);
  else
    for (o = e.child; o !== null; )
      (n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags),
        (r |= o.flags),
        (o.return = e),
        (o = o.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function M0(e, t, n) {
  var r = t.pendingProps;
  switch ((yu(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Ie(t), null;
    case 1:
      return Xe(t.type) && Xl(), Ie(t), null;
    case 3:
      return (
        (r = t.stateNode),
        Tr(),
        ve(Ye),
        ve(Fe),
        Ou(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (hl(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
              ((t.flags |= 1024), Rt !== null && (Ei(Rt), (Rt = null)))),
        di(e, t),
        Ie(t),
        null
      );
    case 5:
      Ru(t);
      var o = Wn(Do.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        fm(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(L(166));
          return Ie(t), null;
        }
        if (((e = Wn(It.current)), hl(t))) {
          (r = t.stateNode), (n = t.type);
          var l = t.memoizedProps;
          switch (((r[jt] = t), (r[Lo] = l), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              me("cancel", r), me("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              me("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < so.length; o++) me(so[o], r);
              break;
            case "source":
              me("error", r);
              break;
            case "img":
            case "image":
            case "link":
              me("error", r), me("load", r);
              break;
            case "details":
              me("toggle", r);
              break;
            case "input":
              Ac(r, l), me("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!l.multiple }),
                me("invalid", r);
              break;
            case "textarea":
              Bc(r, l), me("invalid", r);
          }
          As(n, l), (o = null);
          for (var a in l)
            if (l.hasOwnProperty(a)) {
              var i = l[a];
              a === "children"
                ? typeof i == "string"
                  ? r.textContent !== i &&
                    (l.suppressHydrationWarning !== !0 &&
                      ml(r.textContent, i, e),
                    (o = ["children", i]))
                  : typeof i == "number" &&
                    r.textContent !== "" + i &&
                    (l.suppressHydrationWarning !== !0 &&
                      ml(r.textContent, i, e),
                    (o = ["children", "" + i]))
                : ko.hasOwnProperty(a) &&
                  i != null &&
                  a === "onScroll" &&
                  me("scroll", r);
            }
          switch (n) {
            case "input":
              al(r), Fc(r, l, !0);
              break;
            case "textarea":
              al(r), Wc(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof l.onClick == "function" && (r.onclick = Yl);
          }
          (r = o), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (a = o.nodeType === 9 ? o : o.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Ad(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = a.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = a.createElement(n, { is: r.is }))
                  : ((e = a.createElement(n)),
                    n === "select" &&
                      ((a = e),
                      r.multiple
                        ? (a.multiple = !0)
                        : r.size && (a.size = r.size)))
              : (e = a.createElementNS(e, n)),
            (e[jt] = t),
            (e[Lo] = r),
            cm(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((a = Fs(n, r)), n)) {
              case "dialog":
                me("cancel", e), me("close", e), (o = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                me("load", e), (o = r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < so.length; o++) me(so[o], e);
                o = r;
                break;
              case "source":
                me("error", e), (o = r);
                break;
              case "img":
              case "image":
              case "link":
                me("error", e), me("load", e), (o = r);
                break;
              case "details":
                me("toggle", e), (o = r);
                break;
              case "input":
                Ac(e, r), (o = js(e, r)), me("invalid", e);
                break;
              case "option":
                o = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (o = Ee({}, r, { value: void 0 })),
                  me("invalid", e);
                break;
              case "textarea":
                Bc(e, r), (o = Is(e, r)), me("invalid", e);
                break;
              default:
                o = r;
            }
            As(n, o), (i = o);
            for (l in i)
              if (i.hasOwnProperty(l)) {
                var u = i[l];
                l === "style"
                  ? Wd(e, u)
                  : l === "dangerouslySetInnerHTML"
                    ? ((u = u ? u.__html : void 0), u != null && Fd(e, u))
                    : l === "children"
                      ? typeof u == "string"
                        ? (n !== "textarea" || u !== "") && Co(e, u)
                        : typeof u == "number" && Co(e, "" + u)
                      : l !== "suppressContentEditableWarning" &&
                        l !== "suppressHydrationWarning" &&
                        l !== "autoFocus" &&
                        (ko.hasOwnProperty(l)
                          ? u != null && l === "onScroll" && me("scroll", e)
                          : u != null && ru(e, l, u, a));
              }
            switch (n) {
              case "input":
                al(e), Fc(e, r, !1);
                break;
              case "textarea":
                al(e), Wc(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + On(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (l = r.value),
                  l != null
                    ? xr(e, !!r.multiple, l, !1)
                    : r.defaultValue != null &&
                      xr(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = Yl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return Ie(t), null;
    case 6:
      if (e && t.stateNode != null) dm(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(L(166));
        if (((n = Wn(Do.current)), Wn(It.current), hl(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[jt] = t),
            (l = r.nodeValue !== n) && ((e = lt), e !== null))
          )
            switch (e.tag) {
              case 3:
                ml(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  ml(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          l && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[jt] = t),
            (t.stateNode = r);
      }
      return Ie(t), null;
    case 13:
      if (
        (ve(ye),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (ge && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
          Pp(), _r(), (t.flags |= 98560), (l = !1);
        else if (((l = hl(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!l) throw Error(L(318));
            if (
              ((l = t.memoizedState),
              (l = l !== null ? l.dehydrated : null),
              !l)
            )
              throw Error(L(317));
            l[jt] = t;
          } else
            _r(),
              (t.flags & 128) === 0 && (t.memoizedState = null),
              (t.flags |= 4);
          Ie(t), (l = !1);
        } else Rt !== null && (Ei(Rt), (Rt = null)), (l = !0);
        if (!l) return t.flags & 65536 ? t : null;
      }
      return (t.flags & 128) !== 0
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            (t.mode & 1) !== 0 &&
              (e === null || (ye.current & 1) !== 0
                ? Oe === 0 && (Oe = 3)
                : Au())),
          t.updateQueue !== null && (t.flags |= 4),
          Ie(t),
          null);
    case 4:
      return (
        Tr(), di(e, t), e === null && bo(t.stateNode.containerInfo), Ie(t), null
      );
    case 10:
      return Su(t.type._context), Ie(t), null;
    case 17:
      return Xe(t.type) && Xl(), Ie(t), null;
    case 19:
      if ((ve(ye), (l = t.memoizedState), l === null)) return Ie(t), null;
      if (((r = (t.flags & 128) !== 0), (a = l.rendering), a === null))
        if (r) Zr(l, !1);
        else {
          if (Oe !== 0 || (e !== null && (e.flags & 128) !== 0))
            for (e = t.child; e !== null; ) {
              if (((a = oa(e)), a !== null)) {
                for (
                  t.flags |= 128,
                    Zr(l, !1),
                    r = a.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (l = n),
                    (e = r),
                    (l.flags &= 14680066),
                    (a = l.alternate),
                    a === null
                      ? ((l.childLanes = 0),
                        (l.lanes = e),
                        (l.child = null),
                        (l.subtreeFlags = 0),
                        (l.memoizedProps = null),
                        (l.memoizedState = null),
                        (l.updateQueue = null),
                        (l.dependencies = null),
                        (l.stateNode = null))
                      : ((l.childLanes = a.childLanes),
                        (l.lanes = a.lanes),
                        (l.child = a.child),
                        (l.subtreeFlags = 0),
                        (l.deletions = null),
                        (l.memoizedProps = a.memoizedProps),
                        (l.memoizedState = a.memoizedState),
                        (l.updateQueue = a.updateQueue),
                        (l.type = a.type),
                        (e = a.dependencies),
                        (l.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return pe(ye, (ye.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          l.tail !== null &&
            Se() > $r &&
            ((t.flags |= 128), (r = !0), Zr(l, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = oa(a)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Zr(l, !0),
              l.tail === null && l.tailMode === "hidden" && !a.alternate && !ge)
            )
              return Ie(t), null;
          } else
            2 * Se() - l.renderingStartTime > $r &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Zr(l, !1), (t.lanes = 4194304));
        l.isBackwards
          ? ((a.sibling = t.child), (t.child = a))
          : ((n = l.last),
            n !== null ? (n.sibling = a) : (t.child = a),
            (l.last = a));
      }
      return l.tail !== null
        ? ((t = l.tail),
          (l.rendering = t),
          (l.tail = t.sibling),
          (l.renderingStartTime = Se()),
          (t.sibling = null),
          (n = ye.current),
          pe(ye, r ? (n & 1) | 2 : n & 1),
          t)
        : (Ie(t), null);
    case 22:
    case 23:
      return (
        zu(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && (t.mode & 1) !== 0
          ? (tt & 1073741824) !== 0 &&
            (Ie(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Ie(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(L(156, t.tag));
}
function I0(e, t) {
  switch ((yu(t), t.tag)) {
    case 1:
      return (
        Xe(t.type) && Xl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Tr(),
        ve(Ye),
        ve(Fe),
        Ou(),
        (e = t.flags),
        (e & 65536) !== 0 && (e & 128) === 0
          ? ((t.flags = (e & -65537) | 128), t)
          : null
      );
    case 5:
      return Ru(t), null;
    case 13:
      if (
        (ve(ye), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(L(340));
        _r();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return ve(ye), null;
    case 4:
      return Tr(), null;
    case 10:
      return Su(t.type._context), null;
    case 22:
    case 23:
      return zu(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var yl = !1,
  Ae = !1,
  z0 = typeof WeakSet == "function" ? WeakSet : Set,
  U = null;
function gr(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        we(e, t, r);
      }
    else n.current = null;
}
function pi(e, t, n) {
  try {
    n();
  } catch (r) {
    we(e, t, r);
  }
}
var $f = !1;
function A0(e, t) {
  if (((Ys = Gl), (e = vp()), vu(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var o = r.anchorOffset,
            l = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, l.nodeType;
          } catch {
            n = null;
            break e;
          }
          var a = 0,
            i = -1,
            u = -1,
            c = 0,
            f = 0,
            d = e,
            h = null;
          t: for (;;) {
            for (
              var y;
              d !== n || (o !== 0 && d.nodeType !== 3) || (i = a + o),
                d !== l || (r !== 0 && d.nodeType !== 3) || (u = a + r),
                d.nodeType === 3 && (a += d.nodeValue.length),
                (y = d.firstChild) !== null;

            )
              (h = d), (d = y);
            for (;;) {
              if (d === e) break t;
              if (
                (h === n && ++c === o && (i = a),
                h === l && ++f === r && (u = a),
                (y = d.nextSibling) !== null)
              )
                break;
              (d = h), (h = d.parentNode);
            }
            d = y;
          }
          n = i === -1 || u === -1 ? null : { start: i, end: u };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Xs = { focusedElem: e, selectionRange: n }, Gl = !1, U = t; U !== null; )
    if (((t = U), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (U = e);
    else
      for (; U !== null; ) {
        t = U;
        try {
          var E = t.alternate;
          if ((t.flags & 1024) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (E !== null) {
                  var x = E.memoizedProps,
                    k = E.memoizedState,
                    v = t.stateNode,
                    p = v.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? x : Ct(t.type, x),
                      k,
                    );
                  v.__reactInternalSnapshotBeforeUpdate = p;
                }
                break;
              case 3:
                var g = t.stateNode.containerInfo;
                g.nodeType === 1
                  ? (g.textContent = "")
                  : g.nodeType === 9 &&
                    g.documentElement &&
                    g.removeChild(g.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(L(163));
            }
        } catch (w) {
          we(t, t.return, w);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (U = e);
          break;
        }
        U = t.return;
      }
  return (E = $f), ($f = !1), E;
}
function vo(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var l = o.destroy;
        (o.destroy = void 0), l !== void 0 && pi(t, n, l);
      }
      o = o.next;
    } while (o !== r);
  }
}
function ba(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function mi(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function pm(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), pm(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[jt], delete t[Lo], delete t[ei], delete t[w0], delete t[S0])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function mm(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Lf(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || mm(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function hi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = Yl));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (hi(e, t, n), e = e.sibling; e !== null; ) hi(e, t, n), (e = e.sibling);
}
function vi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (vi(e, t, n), e = e.sibling; e !== null; ) vi(e, t, n), (e = e.sibling);
}
var $e = null,
  Nt = !1;
function cn(e, t, n) {
  for (n = n.child; n !== null; ) hm(e, t, n), (n = n.sibling);
}
function hm(e, t, n) {
  if (Mt && typeof Mt.onCommitFiberUnmount == "function")
    try {
      Mt.onCommitFiberUnmount(ka, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ae || gr(n, t);
    case 6:
      var r = $e,
        o = Nt;
      ($e = null),
        cn(e, t, n),
        ($e = r),
        (Nt = o),
        $e !== null &&
          (Nt
            ? ((e = $e),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : $e.removeChild(n.stateNode));
      break;
    case 18:
      $e !== null &&
        (Nt
          ? ((e = $e),
            (n = n.stateNode),
            e.nodeType === 8
              ? cs(e.parentNode, n)
              : e.nodeType === 1 && cs(e, n),
            _o(e))
          : cs($e, n.stateNode));
      break;
    case 4:
      (r = $e),
        (o = Nt),
        ($e = n.stateNode.containerInfo),
        (Nt = !0),
        cn(e, t, n),
        ($e = r),
        (Nt = o);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Ae &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        o = r = r.next;
        do {
          var l = o,
            a = l.destroy;
          (l = l.tag),
            a !== void 0 && ((l & 2) !== 0 || (l & 4) !== 0) && pi(n, t, a),
            (o = o.next);
        } while (o !== r);
      }
      cn(e, t, n);
      break;
    case 1:
      if (
        !Ae &&
        (gr(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (i) {
          we(n, t, i);
        }
      cn(e, t, n);
      break;
    case 21:
      cn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ae = (r = Ae) || n.memoizedState !== null), cn(e, t, n), (Ae = r))
        : cn(e, t, n);
      break;
    default:
      cn(e, t, n);
  }
}
function jf(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new z0()),
      t.forEach(function (r) {
        var o = Q0.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
  }
}
function kt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var l = e,
          a = t,
          i = a;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case 5:
              ($e = i.stateNode), (Nt = !1);
              break e;
            case 3:
              ($e = i.stateNode.containerInfo), (Nt = !0);
              break e;
            case 4:
              ($e = i.stateNode.containerInfo), (Nt = !0);
              break e;
          }
          i = i.return;
        }
        if ($e === null) throw Error(L(160));
        hm(l, a, o), ($e = null), (Nt = !1);
        var u = o.alternate;
        u !== null && (u.return = null), (o.return = null);
      } catch (c) {
        we(o, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) vm(t, e), (t = t.sibling);
}
function vm(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((kt(t, e), Tt(e), r & 4)) {
        try {
          vo(3, e, e.return), ba(3, e);
        } catch (x) {
          we(e, e.return, x);
        }
        try {
          vo(5, e, e.return);
        } catch (x) {
          we(e, e.return, x);
        }
      }
      break;
    case 1:
      kt(t, e), Tt(e), r & 512 && n !== null && gr(n, n.return);
      break;
    case 5:
      if (
        (kt(t, e),
        Tt(e),
        r & 512 && n !== null && gr(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          Co(o, "");
        } catch (x) {
          we(e, e.return, x);
        }
      }
      if (r & 4 && ((o = e.stateNode), o != null)) {
        var l = e.memoizedProps,
          a = n !== null ? n.memoizedProps : l,
          i = e.type,
          u = e.updateQueue;
        if (((e.updateQueue = null), u !== null))
          try {
            i === "input" && l.type === "radio" && l.name != null && Id(o, l),
              Fs(i, a);
            var c = Fs(i, l);
            for (a = 0; a < u.length; a += 2) {
              var f = u[a],
                d = u[a + 1];
              f === "style"
                ? Wd(o, d)
                : f === "dangerouslySetInnerHTML"
                  ? Fd(o, d)
                  : f === "children"
                    ? Co(o, d)
                    : ru(o, f, d, c);
            }
            switch (i) {
              case "input":
                Ds(o, l);
                break;
              case "textarea":
                zd(o, l);
                break;
              case "select":
                var h = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!l.multiple;
                var y = l.value;
                y != null
                  ? xr(o, !!l.multiple, y, !1)
                  : h !== !!l.multiple &&
                    (l.defaultValue != null
                      ? xr(o, !!l.multiple, l.defaultValue, !0)
                      : xr(o, !!l.multiple, l.multiple ? [] : "", !1));
            }
            o[Lo] = l;
          } catch (x) {
            we(e, e.return, x);
          }
      }
      break;
    case 6:
      if ((kt(t, e), Tt(e), r & 4)) {
        if (e.stateNode === null) throw Error(L(162));
        (o = e.stateNode), (l = e.memoizedProps);
        try {
          o.nodeValue = l;
        } catch (x) {
          we(e, e.return, x);
        }
      }
      break;
    case 3:
      if (
        (kt(t, e), Tt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          _o(t.containerInfo);
        } catch (x) {
          we(e, e.return, x);
        }
      break;
    case 4:
      kt(t, e), Tt(e);
      break;
    case 13:
      kt(t, e),
        Tt(e),
        (o = e.child),
        o.flags & 8192 &&
          ((l = o.memoizedState !== null),
          (o.stateNode.isHidden = l),
          !l ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (Mu = Se())),
        r & 4 && jf(e);
      break;
    case 22:
      if (
        ((f = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Ae = (c = Ae) || f), kt(t, e), (Ae = c)) : kt(t, e),
        Tt(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !f && (e.mode & 1) !== 0)
        )
          for (U = e, f = e.child; f !== null; ) {
            for (d = U = f; U !== null; ) {
              switch (((h = U), (y = h.child), h.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  vo(4, h, h.return);
                  break;
                case 1:
                  gr(h, h.return);
                  var E = h.stateNode;
                  if (typeof E.componentWillUnmount == "function") {
                    (r = h), (n = h.return);
                    try {
                      (t = r),
                        (E.props = t.memoizedProps),
                        (E.state = t.memoizedState),
                        E.componentWillUnmount();
                    } catch (x) {
                      we(r, n, x);
                    }
                  }
                  break;
                case 5:
                  gr(h, h.return);
                  break;
                case 22:
                  if (h.memoizedState !== null) {
                    Mf(d);
                    continue;
                  }
              }
              y !== null ? ((y.return = h), (U = y)) : Mf(d);
            }
            f = f.sibling;
          }
        e: for (f = null, d = e; ; ) {
          if (d.tag === 5) {
            if (f === null) {
              f = d;
              try {
                (o = d.stateNode),
                  c
                    ? ((l = o.style),
                      typeof l.setProperty == "function"
                        ? l.setProperty("display", "none", "important")
                        : (l.display = "none"))
                    : ((i = d.stateNode),
                      (u = d.memoizedProps.style),
                      (a =
                        u != null && u.hasOwnProperty("display")
                          ? u.display
                          : null),
                      (i.style.display = Bd("display", a)));
              } catch (x) {
                we(e, e.return, x);
              }
            }
          } else if (d.tag === 6) {
            if (f === null)
              try {
                d.stateNode.nodeValue = c ? "" : d.memoizedProps;
              } catch (x) {
                we(e, e.return, x);
              }
          } else if (
            ((d.tag !== 22 && d.tag !== 23) ||
              d.memoizedState === null ||
              d === e) &&
            d.child !== null
          ) {
            (d.child.return = d), (d = d.child);
            continue;
          }
          if (d === e) break e;
          for (; d.sibling === null; ) {
            if (d.return === null || d.return === e) break e;
            f === d && (f = null), (d = d.return);
          }
          f === d && (f = null), (d.sibling.return = d.return), (d = d.sibling);
        }
      }
      break;
    case 19:
      kt(t, e), Tt(e), r & 4 && jf(e);
      break;
    case 21:
      break;
    default:
      kt(t, e), Tt(e);
  }
}
function Tt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (mm(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(L(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (Co(o, ""), (r.flags &= -33));
          var l = Lf(e);
          vi(e, l, o);
          break;
        case 3:
        case 4:
          var a = r.stateNode.containerInfo,
            i = Lf(e);
          hi(e, i, a);
          break;
        default:
          throw Error(L(161));
      }
    } catch (u) {
      we(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function F0(e, t, n) {
  (U = e), gm(e);
}
function gm(e, t, n) {
  for (var r = (e.mode & 1) !== 0; U !== null; ) {
    var o = U,
      l = o.child;
    if (o.tag === 22 && r) {
      var a = o.memoizedState !== null || yl;
      if (!a) {
        var i = o.alternate,
          u = (i !== null && i.memoizedState !== null) || Ae;
        i = yl;
        var c = Ae;
        if (((yl = a), (Ae = u) && !c))
          for (U = o; U !== null; )
            (a = U),
              (u = a.child),
              a.tag === 22 && a.memoizedState !== null
                ? If(o)
                : u !== null
                  ? ((u.return = a), (U = u))
                  : If(o);
        for (; l !== null; ) (U = l), gm(l), (l = l.sibling);
        (U = o), (yl = i), (Ae = c);
      }
      Df(e);
    } else
      (o.subtreeFlags & 8772) !== 0 && l !== null
        ? ((l.return = o), (U = l))
        : Df(e);
  }
}
function Df(e) {
  for (; U !== null; ) {
    var t = U;
    if ((t.flags & 8772) !== 0) {
      var n = t.alternate;
      try {
        if ((t.flags & 8772) !== 0)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ae || ba(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ae)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Ct(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var l = t.updateQueue;
              l !== null && yf(t, l, r);
              break;
            case 3:
              var a = t.updateQueue;
              if (a !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                yf(t, a, n);
              }
              break;
            case 5:
              var i = t.stateNode;
              if (n === null && t.flags & 4) {
                n = i;
                var u = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    u.autoFocus && n.focus();
                    break;
                  case "img":
                    u.src && (n.src = u.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var f = c.memoizedState;
                  if (f !== null) {
                    var d = f.dehydrated;
                    d !== null && _o(d);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(L(163));
          }
        Ae || (t.flags & 512 && mi(t));
      } catch (h) {
        we(t, t.return, h);
      }
    }
    if (t === e) {
      U = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (U = n);
      break;
    }
    U = t.return;
  }
}
function Mf(e) {
  for (; U !== null; ) {
    var t = U;
    if (t === e) {
      U = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (U = n);
      break;
    }
    U = t.return;
  }
}
function If(e) {
  for (; U !== null; ) {
    var t = U;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ba(4, t);
          } catch (u) {
            we(t, n, u);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = t.return;
            try {
              r.componentDidMount();
            } catch (u) {
              we(t, o, u);
            }
          }
          var l = t.return;
          try {
            mi(t);
          } catch (u) {
            we(t, l, u);
          }
          break;
        case 5:
          var a = t.return;
          try {
            mi(t);
          } catch (u) {
            we(t, a, u);
          }
      }
    } catch (u) {
      we(t, t.return, u);
    }
    if (t === e) {
      U = null;
      break;
    }
    var i = t.sibling;
    if (i !== null) {
      (i.return = t.return), (U = i);
      break;
    }
    U = t.return;
  }
}
var B0 = Math.ceil,
  sa = nn.ReactCurrentDispatcher,
  ju = nn.ReactCurrentOwner,
  ht = nn.ReactCurrentBatchConfig,
  ae = 0,
  Te = null,
  ke = null,
  Le = 0,
  tt = 0,
  yr = bn(0),
  Oe = 0,
  Ao = null,
  Yn = 0,
  $a = 0,
  Du = 0,
  go = null,
  Qe = null,
  Mu = 0,
  $r = 1 / 0,
  Bt = null,
  ia = !1,
  gi = null,
  Cn = null,
  xl = !1,
  yn = null,
  ua = 0,
  yo = 0,
  yi = null,
  Dl = -1,
  Ml = 0;
function Ve() {
  return (ae & 6) !== 0 ? Se() : Dl !== -1 ? Dl : (Dl = Se());
}
function Nn(e) {
  return (e.mode & 1) === 0
    ? 1
    : (ae & 2) !== 0 && Le !== 0
      ? Le & -Le
      : C0.transition !== null
        ? (Ml === 0 && (Ml = ep()), Ml)
        : ((e = ce),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : sp(e.type))),
          e);
}
function _t(e, t, n, r) {
  if (50 < yo) throw ((yo = 0), (yi = null), Error(L(185)));
  Ko(e, n, r),
    ((ae & 2) === 0 || e !== Te) &&
      (e === Te && ((ae & 2) === 0 && ($a |= n), Oe === 4 && hn(e, Le)),
      Je(e, r),
      n === 1 &&
        ae === 0 &&
        (t.mode & 1) === 0 &&
        (($r = Se() + 500), _a && $n()));
}
function Je(e, t) {
  var n = e.callbackNode;
  Cg(e, t);
  var r = Kl(e, e === Te ? Le : 0);
  if (r === 0)
    n !== null && Vc(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Vc(n), t === 1))
      e.tag === 0 ? k0(zf.bind(null, e)) : Rp(zf.bind(null, e)),
        x0(function () {
          (ae & 6) === 0 && $n();
        }),
        (n = null);
    else {
      switch (tp(r)) {
        case 1:
          n = iu;
          break;
        case 4:
          n = Jd;
          break;
        case 16:
          n = Vl;
          break;
        case 536870912:
          n = Zd;
          break;
        default:
          n = Vl;
      }
      n = Nm(n, ym.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function ym(e, t) {
  if (((Dl = -1), (Ml = 0), (ae & 6) !== 0)) throw Error(L(327));
  var n = e.callbackNode;
  if (Cr() && e.callbackNode !== n) return null;
  var r = Kl(e, e === Te ? Le : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = ca(e, r);
  else {
    t = r;
    var o = ae;
    ae |= 2;
    var l = Em();
    (Te !== e || Le !== t) && ((Bt = null), ($r = Se() + 500), Hn(e, t));
    do
      try {
        H0();
        break;
      } catch (i) {
        xm(e, i);
      }
    while (1);
    wu(),
      (sa.current = l),
      (ae = o),
      ke !== null ? (t = 0) : ((Te = null), (Le = 0), (t = Oe));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = Vs(e)), o !== 0 && ((r = o), (t = xi(e, o)))), t === 1)
    )
      throw ((n = Ao), Hn(e, 0), hn(e, r), Je(e, Se()), n);
    if (t === 6) hn(e, r);
    else {
      if (
        ((o = e.current.alternate),
        (r & 30) === 0 &&
          !W0(o) &&
          ((t = ca(e, r)),
          t === 2 && ((l = Vs(e)), l !== 0 && ((r = l), (t = xi(e, l)))),
          t === 1))
      )
        throw ((n = Ao), Hn(e, 0), hn(e, r), Je(e, Se()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(L(345));
        case 2:
          An(e, Qe, Bt);
          break;
        case 3:
          if (
            (hn(e, r), (r & 130023424) === r && ((t = Mu + 500 - Se()), 10 < t))
          ) {
            if (Kl(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              Ve(), (e.pingedLanes |= e.suspendedLanes & o);
              break;
            }
            e.timeoutHandle = Zs(An.bind(null, e, Qe, Bt), t);
            break;
          }
          An(e, Qe, Bt);
          break;
        case 4:
          if ((hn(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r; ) {
            var a = 31 - Ot(r);
            (l = 1 << a), (a = t[a]), a > o && (o = a), (r &= ~l);
          }
          if (
            ((r = o),
            (r = Se() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * B0(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Zs(An.bind(null, e, Qe, Bt), r);
            break;
          }
          An(e, Qe, Bt);
          break;
        case 5:
          An(e, Qe, Bt);
          break;
        default:
          throw Error(L(329));
      }
    }
  }
  return Je(e, Se()), e.callbackNode === n ? ym.bind(null, e) : null;
}
function xi(e, t) {
  var n = go;
  return (
    e.current.memoizedState.isDehydrated && (Hn(e, t).flags |= 256),
    (e = ca(e, t)),
    e !== 2 && ((t = Qe), (Qe = n), t !== null && Ei(t)),
    e
  );
}
function Ei(e) {
  Qe === null ? (Qe = e) : Qe.push.apply(Qe, e);
}
function W0(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            l = o.getSnapshot;
          o = o.value;
          try {
            if (!Pt(l(), o)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function hn(e, t) {
  for (
    t &= ~Du,
      t &= ~$a,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - Ot(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function zf(e) {
  if ((ae & 6) !== 0) throw Error(L(327));
  Cr();
  var t = Kl(e, 0);
  if ((t & 1) === 0) return Je(e, Se()), null;
  var n = ca(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Vs(e);
    r !== 0 && ((t = r), (n = xi(e, r)));
  }
  if (n === 1) throw ((n = Ao), Hn(e, 0), hn(e, t), Je(e, Se()), n);
  if (n === 6) throw Error(L(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    An(e, Qe, Bt),
    Je(e, Se()),
    null
  );
}
function Iu(e, t) {
  var n = ae;
  ae |= 1;
  try {
    return e(t);
  } finally {
    (ae = n), ae === 0 && (($r = Se() + 500), _a && $n());
  }
}
function Xn(e) {
  yn !== null && yn.tag === 0 && (ae & 6) === 0 && Cr();
  var t = ae;
  ae |= 1;
  var n = ht.transition,
    r = ce;
  try {
    if (((ht.transition = null), (ce = 1), e)) return e();
  } finally {
    (ce = r), (ht.transition = n), (ae = t), (ae & 6) === 0 && $n();
  }
}
function zu() {
  (tt = yr.current), ve(yr);
}
function Hn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), y0(n)), ke !== null))
    for (n = ke.return; n !== null; ) {
      var r = n;
      switch ((yu(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Xl();
          break;
        case 3:
          Tr(), ve(Ye), ve(Fe), Ou();
          break;
        case 5:
          Ru(r);
          break;
        case 4:
          Tr();
          break;
        case 13:
          ve(ye);
          break;
        case 19:
          ve(ye);
          break;
        case 10:
          Su(r.type._context);
          break;
        case 22:
        case 23:
          zu();
      }
      n = n.return;
    }
  if (
    ((Te = e),
    (ke = e = Rn(e.current, null)),
    (Le = tt = t),
    (Oe = 0),
    (Ao = null),
    (Du = $a = Yn = 0),
    (Qe = go = null),
    Bn !== null)
  ) {
    for (t = 0; t < Bn.length; t++)
      if (((n = Bn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          l = n.pending;
        if (l !== null) {
          var a = l.next;
          (l.next = o), (r.next = a);
        }
        n.pending = r;
      }
    Bn = null;
  }
  return e;
}
function xm(e, t) {
  do {
    var n = ke;
    try {
      if ((wu(), ($l.current = aa), la)) {
        for (var r = xe.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), (r = r.next);
        }
        la = !1;
      }
      if (
        ((qn = 0),
        (Pe = Re = xe = null),
        (ho = !1),
        (Mo = 0),
        (ju.current = null),
        n === null || n.return === null)
      ) {
        (Oe = 1), (Ao = t), (ke = null);
        break;
      }
      e: {
        var l = e,
          a = n.return,
          i = n,
          u = t;
        if (
          ((t = Le),
          (i.flags |= 32768),
          u !== null && typeof u == "object" && typeof u.then == "function")
        ) {
          var c = u,
            f = i,
            d = f.tag;
          if ((f.mode & 1) === 0 && (d === 0 || d === 11 || d === 15)) {
            var h = f.alternate;
            h
              ? ((f.updateQueue = h.updateQueue),
                (f.memoizedState = h.memoizedState),
                (f.lanes = h.lanes))
              : ((f.updateQueue = null), (f.memoizedState = null));
          }
          var y = Nf(a);
          if (y !== null) {
            (y.flags &= -257),
              Rf(y, a, i, l, t),
              y.mode & 1 && Cf(l, c, t),
              (t = y),
              (u = c);
            var E = t.updateQueue;
            if (E === null) {
              var x = new Set();
              x.add(u), (t.updateQueue = x);
            } else E.add(u);
            break e;
          } else {
            if ((t & 1) === 0) {
              Cf(l, c, t), Au();
              break e;
            }
            u = Error(L(426));
          }
        } else if (ge && i.mode & 1) {
          var k = Nf(a);
          if (k !== null) {
            (k.flags & 65536) === 0 && (k.flags |= 256),
              Rf(k, a, i, l, t),
              xu(br(u, i));
            break e;
          }
        }
        (l = u = br(u, i)),
          Oe !== 4 && (Oe = 2),
          go === null ? (go = [l]) : go.push(l),
          (l = a);
        do {
          switch (l.tag) {
            case 3:
              (l.flags |= 65536), (t &= -t), (l.lanes |= t);
              var v = nm(l, u, t);
              gf(l, v);
              break e;
            case 1:
              i = u;
              var p = l.type,
                g = l.stateNode;
              if (
                (l.flags & 128) === 0 &&
                (typeof p.getDerivedStateFromError == "function" ||
                  (g !== null &&
                    typeof g.componentDidCatch == "function" &&
                    (Cn === null || !Cn.has(g))))
              ) {
                (l.flags |= 65536), (t &= -t), (l.lanes |= t);
                var w = rm(l, i, t);
                gf(l, w);
                break e;
              }
          }
          l = l.return;
        } while (l !== null);
      }
      Sm(n);
    } catch (C) {
      (t = C), ke === n && n !== null && (ke = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Em() {
  var e = sa.current;
  return (sa.current = aa), e === null ? aa : e;
}
function Au() {
  (Oe === 0 || Oe === 3 || Oe === 2) && (Oe = 4),
    Te === null ||
      ((Yn & 268435455) === 0 && ($a & 268435455) === 0) ||
      hn(Te, Le);
}
function ca(e, t) {
  var n = ae;
  ae |= 2;
  var r = Em();
  (Te !== e || Le !== t) && ((Bt = null), Hn(e, t));
  do
    try {
      U0();
      break;
    } catch (o) {
      xm(e, o);
    }
  while (1);
  if ((wu(), (ae = n), (sa.current = r), ke !== null)) throw Error(L(261));
  return (Te = null), (Le = 0), Oe;
}
function U0() {
  for (; ke !== null; ) wm(ke);
}
function H0() {
  for (; ke !== null && !hg(); ) wm(ke);
}
function wm(e) {
  var t = Cm(e.alternate, e, tt);
  (e.memoizedProps = e.pendingProps),
    t === null ? Sm(e) : (ke = t),
    (ju.current = null);
}
function Sm(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), (t.flags & 32768) === 0)) {
      if (((n = M0(n, t, tt)), n !== null)) {
        ke = n;
        return;
      }
    } else {
      if (((n = I0(n, t)), n !== null)) {
        (n.flags &= 32767), (ke = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (Oe = 6), (ke = null);
        return;
      }
    }
    if (((t = t.sibling), t !== null)) {
      ke = t;
      return;
    }
    ke = t = e;
  } while (t !== null);
  Oe === 0 && (Oe = 5);
}
function An(e, t, n) {
  var r = ce,
    o = ht.transition;
  try {
    (ht.transition = null), (ce = 1), V0(e, t, n, r);
  } finally {
    (ht.transition = o), (ce = r);
  }
  return null;
}
function V0(e, t, n, r) {
  do Cr();
  while (yn !== null);
  if ((ae & 6) !== 0) throw Error(L(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(L(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var l = n.lanes | n.childLanes;
  if (
    (Ng(e, l),
    e === Te && ((ke = Te = null), (Le = 0)),
    ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
      xl ||
      ((xl = !0),
      Nm(Vl, function () {
        return Cr(), null;
      })),
    (l = (n.flags & 15990) !== 0),
    (n.subtreeFlags & 15990) !== 0 || l)
  ) {
    (l = ht.transition), (ht.transition = null);
    var a = ce;
    ce = 1;
    var i = ae;
    (ae |= 4),
      (ju.current = null),
      A0(e, n),
      vm(n, e),
      f0(Xs),
      (Gl = !!Ys),
      (Xs = Ys = null),
      (e.current = n),
      F0(n),
      vg(),
      (ae = i),
      (ce = a),
      (ht.transition = l);
  } else e.current = n;
  if (
    (xl && ((xl = !1), (yn = e), (ua = o)),
    (l = e.pendingLanes),
    l === 0 && (Cn = null),
    xg(n.stateNode),
    Je(e, Se()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest });
  if (ia) throw ((ia = !1), (e = gi), (gi = null), e);
  return (
    (ua & 1) !== 0 && e.tag !== 0 && Cr(),
    (l = e.pendingLanes),
    (l & 1) !== 0 ? (e === yi ? yo++ : ((yo = 0), (yi = e))) : (yo = 0),
    $n(),
    null
  );
}
function Cr() {
  if (yn !== null) {
    var e = tp(ua),
      t = ht.transition,
      n = ce;
    try {
      if (((ht.transition = null), (ce = 16 > e ? 16 : e), yn === null))
        var r = !1;
      else {
        if (((e = yn), (yn = null), (ua = 0), (ae & 6) !== 0))
          throw Error(L(331));
        var o = ae;
        for (ae |= 4, U = e.current; U !== null; ) {
          var l = U,
            a = l.child;
          if ((U.flags & 16) !== 0) {
            var i = l.deletions;
            if (i !== null) {
              for (var u = 0; u < i.length; u++) {
                var c = i[u];
                for (U = c; U !== null; ) {
                  var f = U;
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      vo(8, f, l);
                  }
                  var d = f.child;
                  if (d !== null) (d.return = f), (U = d);
                  else
                    for (; U !== null; ) {
                      f = U;
                      var h = f.sibling,
                        y = f.return;
                      if ((pm(f), f === c)) {
                        U = null;
                        break;
                      }
                      if (h !== null) {
                        (h.return = y), (U = h);
                        break;
                      }
                      U = y;
                    }
                }
              }
              var E = l.alternate;
              if (E !== null) {
                var x = E.child;
                if (x !== null) {
                  E.child = null;
                  do {
                    var k = x.sibling;
                    (x.sibling = null), (x = k);
                  } while (x !== null);
                }
              }
              U = l;
            }
          }
          if ((l.subtreeFlags & 2064) !== 0 && a !== null)
            (a.return = l), (U = a);
          else
            e: for (; U !== null; ) {
              if (((l = U), (l.flags & 2048) !== 0))
                switch (l.tag) {
                  case 0:
                  case 11:
                  case 15:
                    vo(9, l, l.return);
                }
              var v = l.sibling;
              if (v !== null) {
                (v.return = l.return), (U = v);
                break e;
              }
              U = l.return;
            }
        }
        var p = e.current;
        for (U = p; U !== null; ) {
          a = U;
          var g = a.child;
          if ((a.subtreeFlags & 2064) !== 0 && g !== null)
            (g.return = a), (U = g);
          else
            e: for (a = p; U !== null; ) {
              if (((i = U), (i.flags & 2048) !== 0))
                try {
                  switch (i.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ba(9, i);
                  }
                } catch (C) {
                  we(i, i.return, C);
                }
              if (i === a) {
                U = null;
                break e;
              }
              var w = i.sibling;
              if (w !== null) {
                (w.return = i.return), (U = w);
                break e;
              }
              U = i.return;
            }
        }
        if (
          ((ae = o), $n(), Mt && typeof Mt.onPostCommitFiberRoot == "function")
        )
          try {
            Mt.onPostCommitFiberRoot(ka, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (ce = n), (ht.transition = t);
    }
  }
  return !1;
}
function Af(e, t, n) {
  (t = br(n, t)),
    (t = nm(e, t, 1)),
    (e = kn(e, t, 1)),
    (t = Ve()),
    e !== null && (Ko(e, 1, t), Je(e, t));
}
function we(e, t, n) {
  if (e.tag === 3) Af(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Af(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Cn === null || !Cn.has(r)))
        ) {
          (e = br(n, e)),
            (e = rm(t, e, 1)),
            (t = kn(t, e, 1)),
            (e = Ve()),
            t !== null && (Ko(t, 1, e), Je(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function K0(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = Ve()),
    (e.pingedLanes |= e.suspendedLanes & n),
    Te === e &&
      (Le & n) === n &&
      (Oe === 4 || (Oe === 3 && (Le & 130023424) === Le && 500 > Se() - Mu)
        ? Hn(e, 0)
        : (Du |= n)),
    Je(e, t);
}
function km(e, t) {
  t === 0 &&
    ((e.mode & 1) === 0
      ? (t = 1)
      : ((t = ul), (ul <<= 1), (ul & 130023424) === 0 && (ul = 4194304)));
  var n = Ve();
  (e = Xt(e, t)), e !== null && (Ko(e, t, n), Je(e, n));
}
function G0(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), km(e, n);
}
function Q0(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        o = e.memoizedState;
      o !== null && (n = o.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(L(314));
  }
  r !== null && r.delete(t), km(e, n);
}
var Cm;
Cm = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Ye.current) qe = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
        return (qe = !1), D0(e, t, n);
      qe = (e.flags & 131072) !== 0;
    }
  else (qe = !1), ge && (t.flags & 1048576) !== 0 && Op(t, ea, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      jl(e, t), (e = t.pendingProps);
      var o = Or(t, Fe.current);
      kr(t, n), (o = Pu(null, t, r, e, o, n));
      var l = Tu();
      return (
        (t.flags |= 1),
        typeof o == "object" &&
        o !== null &&
        typeof o.render == "function" &&
        o.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Xe(r) ? ((l = !0), Jl(t)) : (l = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            Cu(t),
            (o.updater = Pa),
            (t.stateNode = o),
            (o._reactInternals = t),
            ai(t, r, e, n),
            (t = ui(null, t, r, !0, l, n)))
          : ((t.tag = 0), ge && l && gu(t), We(null, t, o, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (jl(e, t),
          (e = t.pendingProps),
          (o = r._init),
          (r = o(r._payload)),
          (t.type = r),
          (o = t.tag = Y0(r)),
          (e = Ct(r, e)),
          o)
        ) {
          case 0:
            t = ii(null, t, r, e, n);
            break e;
          case 1:
            t = Pf(null, t, r, e, n);
            break e;
          case 11:
            t = Of(null, t, r, e, n);
            break e;
          case 14:
            t = _f(null, t, r, Ct(r.type, e), n);
            break e;
        }
        throw Error(L(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : Ct(r, o)),
        ii(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : Ct(r, o)),
        Pf(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((sm(t), e === null)) throw Error(L(387));
        (r = t.pendingProps),
          (l = t.memoizedState),
          (o = l.element),
          bp(e, t),
          ra(t, r, null, n);
        var a = t.memoizedState;
        if (((r = a.element), l.isDehydrated))
          if (
            ((l = {
              element: r,
              isDehydrated: !1,
              cache: a.cache,
              pendingSuspenseBoundaries: a.pendingSuspenseBoundaries,
              transitions: a.transitions,
            }),
            (t.updateQueue.baseState = l),
            (t.memoizedState = l),
            t.flags & 256)
          ) {
            (o = br(Error(L(423)), t)), (t = Tf(e, t, r, n, o));
            break e;
          } else if (r !== o) {
            (o = br(Error(L(424)), t)), (t = Tf(e, t, r, n, o));
            break e;
          } else
            for (
              rt = Sn(t.stateNode.containerInfo.firstChild),
                lt = t,
                ge = !0,
                Rt = null,
                n = Dp(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((_r(), r === o)) {
            t = Jt(e, t, n);
            break e;
          }
          We(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Mp(t),
        e === null && ri(t),
        (r = t.type),
        (o = t.pendingProps),
        (l = e !== null ? e.memoizedProps : null),
        (a = o.children),
        Js(r, o) ? (a = null) : l !== null && Js(r, l) && (t.flags |= 32),
        am(e, t),
        We(e, t, a, n),
        t.child
      );
    case 6:
      return e === null && ri(t), null;
    case 13:
      return im(e, t, n);
    case 4:
      return (
        Nu(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Pr(t, null, r, n)) : We(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : Ct(r, o)),
        Of(e, t, r, o, n)
      );
    case 7:
      return We(e, t, t.pendingProps, n), t.child;
    case 8:
      return We(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return We(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (o = t.pendingProps),
          (l = t.memoizedProps),
          (a = o.value),
          pe(ta, r._currentValue),
          (r._currentValue = a),
          l !== null)
        )
          if (Pt(l.value, a)) {
            if (l.children === o.children && !Ye.current) {
              t = Jt(e, t, n);
              break e;
            }
          } else
            for (l = t.child, l !== null && (l.return = t); l !== null; ) {
              var i = l.dependencies;
              if (i !== null) {
                a = l.child;
                for (var u = i.firstContext; u !== null; ) {
                  if (u.context === r) {
                    if (l.tag === 1) {
                      (u = Kt(-1, n & -n)), (u.tag = 2);
                      var c = l.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var f = c.pending;
                        f === null
                          ? (u.next = u)
                          : ((u.next = f.next), (f.next = u)),
                          (c.pending = u);
                      }
                    }
                    (l.lanes |= n),
                      (u = l.alternate),
                      u !== null && (u.lanes |= n),
                      oi(l.return, n, t),
                      (i.lanes |= n);
                    break;
                  }
                  u = u.next;
                }
              } else if (l.tag === 10) a = l.type === t.type ? null : l.child;
              else if (l.tag === 18) {
                if (((a = l.return), a === null)) throw Error(L(341));
                (a.lanes |= n),
                  (i = a.alternate),
                  i !== null && (i.lanes |= n),
                  oi(a, n, t),
                  (a = l.sibling);
              } else a = l.child;
              if (a !== null) a.return = l;
              else
                for (a = l; a !== null; ) {
                  if (a === t) {
                    a = null;
                    break;
                  }
                  if (((l = a.sibling), l !== null)) {
                    (l.return = a.return), (a = l);
                    break;
                  }
                  a = a.return;
                }
              l = a;
            }
        We(e, t, o.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        kr(t, n),
        (o = vt(o)),
        (r = r(o)),
        (t.flags |= 1),
        We(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = Ct(r, t.pendingProps)),
        (o = Ct(r.type, o)),
        _f(e, t, r, o, n)
      );
    case 15:
      return om(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : Ct(r, o)),
        jl(e, t),
        (t.tag = 1),
        Xe(r) ? ((e = !0), Jl(t)) : (e = !1),
        kr(t, n),
        Lp(t, r, o),
        ai(t, r, o, n),
        ui(null, t, r, !0, e, n)
      );
    case 19:
      return um(e, t, n);
    case 22:
      return lm(e, t, n);
  }
  throw Error(L(156, t.tag));
};
function Nm(e, t) {
  return Xd(e, t);
}
function q0(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function pt(e, t, n, r) {
  return new q0(e, t, n, r);
}
function Fu(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function Y0(e) {
  if (typeof e == "function") return Fu(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === lu)) return 11;
    if (e === au) return 14;
  }
  return 2;
}
function Rn(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = pt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Il(e, t, n, r, o, l) {
  var a = 2;
  if (((r = e), typeof e == "function")) Fu(e) && (a = 1);
  else if (typeof e == "string") a = 5;
  else
    e: switch (e) {
      case ir:
        return Vn(n.children, o, l, t);
      case ou:
        (a = 8), (o |= 8);
        break;
      case Ts:
        return (
          (e = pt(12, n, t, o | 2)), (e.elementType = Ts), (e.lanes = l), e
        );
      case bs:
        return (e = pt(13, n, t, o)), (e.elementType = bs), (e.lanes = l), e;
      case $s:
        return (e = pt(19, n, t, o)), (e.elementType = $s), (e.lanes = l), e;
      case jd:
        return La(n, o, l, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case $d:
              a = 10;
              break e;
            case Ld:
              a = 9;
              break e;
            case lu:
              a = 11;
              break e;
            case au:
              a = 14;
              break e;
            case fn:
              (a = 16), (r = null);
              break e;
          }
        throw Error(L(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = pt(a, n, t, o)), (t.elementType = e), (t.type = r), (t.lanes = l), t
  );
}
function Vn(e, t, n, r) {
  return (e = pt(7, e, r, t)), (e.lanes = n), e;
}
function La(e, t, n, r) {
  return (
    (e = pt(22, e, r, t)),
    (e.elementType = jd),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function ys(e, t, n) {
  return (e = pt(6, e, null, t)), (e.lanes = n), e;
}
function xs(e, t, n) {
  return (
    (t = pt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function X0(e, t, n, r, o) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Za(0)),
    (this.expirationTimes = Za(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Za(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null);
}
function Bu(e, t, n, r, o, l, a, i, u) {
  return (
    (e = new X0(e, t, n, i, u)),
    t === 1 ? ((t = 1), l === !0 && (t |= 8)) : (t = 0),
    (l = pt(3, null, null, t)),
    (e.current = l),
    (l.stateNode = e),
    (l.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Cu(l),
    e
  );
}
function J0(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: sr,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Rm(e) {
  if (!e) return _n;
  e = e._reactInternals;
  e: {
    if (er(e) !== e || e.tag !== 1) throw Error(L(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Xe(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(L(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Xe(n)) return Np(e, n, t);
  }
  return t;
}
function Om(e, t, n, r, o, l, a, i, u) {
  return (
    (e = Bu(n, r, !0, e, o, l, a, i, u)),
    (e.context = Rm(null)),
    (n = e.current),
    (r = Ve()),
    (o = Nn(n)),
    (l = Kt(r, o)),
    (l.callback = t != null ? t : null),
    kn(n, l, o),
    (e.current.lanes = o),
    Ko(e, o, r),
    Je(e, r),
    e
  );
}
function ja(e, t, n, r) {
  var o = t.current,
    l = Ve(),
    a = Nn(o);
  return (
    (n = Rm(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Kt(l, a)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = kn(o, t, a)),
    e !== null && (_t(e, o, a, l), bl(e, o, a)),
    a
  );
}
function fa(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Ff(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Wu(e, t) {
  Ff(e, t), (e = e.alternate) && Ff(e, t);
}
function Z0() {
  return null;
}
var _m =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Uu(e) {
  this._internalRoot = e;
}
Da.prototype.render = Uu.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(L(409));
  ja(e, t, null, null);
};
Da.prototype.unmount = Uu.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Xn(function () {
      ja(null, e, null, null);
    }),
      (t[Yt] = null);
  }
};
function Da(e) {
  this._internalRoot = e;
}
Da.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = op();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < mn.length && t !== 0 && t < mn[n].priority; n++);
    mn.splice(n, 0, e), n === 0 && ap(e);
  }
};
function Hu(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ma(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Bf() {}
function ey(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var l = r;
      r = function () {
        var c = fa(a);
        l.call(c);
      };
    }
    var a = Om(t, r, e, 0, null, !1, !1, "", Bf);
    return (
      (e._reactRootContainer = a),
      (e[Yt] = a.current),
      bo(e.nodeType === 8 ? e.parentNode : e),
      Xn(),
      a
    );
  }
  for (; (o = e.lastChild); ) e.removeChild(o);
  if (typeof r == "function") {
    var i = r;
    r = function () {
      var c = fa(u);
      i.call(c);
    };
  }
  var u = Bu(e, 0, !1, null, null, !1, !1, "", Bf);
  return (
    (e._reactRootContainer = u),
    (e[Yt] = u.current),
    bo(e.nodeType === 8 ? e.parentNode : e),
    Xn(function () {
      ja(t, u, n, r);
    }),
    u
  );
}
function Ia(e, t, n, r, o) {
  var l = n._reactRootContainer;
  if (l) {
    var a = l;
    if (typeof o == "function") {
      var i = o;
      o = function () {
        var u = fa(a);
        i.call(u);
      };
    }
    ja(t, a, e, o);
  } else a = ey(n, t, e, o, r);
  return fa(a);
}
np = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = ao(t.pendingLanes);
        n !== 0 &&
          (uu(t, n | 1),
          Je(t, Se()),
          (ae & 6) === 0 && (($r = Se() + 500), $n()));
      }
      break;
    case 13:
      Xn(function () {
        var r = Xt(e, 1);
        if (r !== null) {
          var o = Ve();
          _t(r, e, 1, o);
        }
      }),
        Wu(e, 1);
  }
};
cu = function (e) {
  if (e.tag === 13) {
    var t = Xt(e, 134217728);
    if (t !== null) {
      var n = Ve();
      _t(t, e, 134217728, n);
    }
    Wu(e, 134217728);
  }
};
rp = function (e) {
  if (e.tag === 13) {
    var t = Nn(e),
      n = Xt(e, t);
    if (n !== null) {
      var r = Ve();
      _t(n, e, t, r);
    }
    Wu(e, t);
  }
};
op = function () {
  return ce;
};
lp = function (e, t) {
  var n = ce;
  try {
    return (ce = e), t();
  } finally {
    ce = n;
  }
};
Ws = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Ds(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var o = Oa(r);
            if (!o) throw Error(L(90));
            Md(r), Ds(r, o);
          }
        }
      }
      break;
    case "textarea":
      zd(e, n);
      break;
    case "select":
      (t = n.value), t != null && xr(e, !!n.multiple, t, !1);
  }
};
Vd = Iu;
Kd = Xn;
var ty = { usingClientEntryPoint: !1, Events: [Qo, dr, Oa, Ud, Hd, Iu] },
  eo = {
    findFiberByHostInstance: Fn,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  ny = {
    bundleType: eo.bundleType,
    version: eo.version,
    rendererPackageName: eo.rendererPackageName,
    rendererConfig: eo.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: nn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = qd(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: eo.findFiberByHostInstance || Z0,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var El = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!El.isDisabled && El.supportsFiber)
    try {
      (ka = El.inject(ny)), (Mt = El);
    } catch {}
}
st.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ty;
st.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Hu(t)) throw Error(L(200));
  return J0(e, t, null, n);
};
st.createRoot = function (e, t) {
  if (!Hu(e)) throw Error(L(299));
  var n = !1,
    r = "",
    o = _m;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = Bu(e, 1, !1, null, null, n, !1, r, o)),
    (e[Yt] = t.current),
    bo(e.nodeType === 8 ? e.parentNode : e),
    new Uu(t)
  );
};
st.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(L(188))
      : ((e = Object.keys(e).join(",")), Error(L(268, e)));
  return (e = qd(t)), (e = e === null ? null : e.stateNode), e;
};
st.flushSync = function (e) {
  return Xn(e);
};
st.hydrate = function (e, t, n) {
  if (!Ma(t)) throw Error(L(200));
  return Ia(null, e, t, !0, n);
};
st.hydrateRoot = function (e, t, n) {
  if (!Hu(e)) throw Error(L(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    l = "",
    a = _m;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (l = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (a = n.onRecoverableError)),
    (t = Om(t, null, e, 1, n != null ? n : null, o, !1, l, a)),
    (e[Yt] = t.current),
    bo(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (o = n._getVersion),
        (o = o(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, o])
          : t.mutableSourceEagerHydrationData.push(n, o);
  return new Da(t);
};
st.render = function (e, t, n) {
  if (!Ma(t)) throw Error(L(200));
  return Ia(null, e, t, !1, n);
};
st.unmountComponentAtNode = function (e) {
  if (!Ma(e)) throw Error(L(40));
  return e._reactRootContainer
    ? (Xn(function () {
        Ia(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Yt] = null);
        });
      }),
      !0)
    : !1;
};
st.unstable_batchedUpdates = Iu;
st.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ma(n)) throw Error(L(200));
  if (e == null || e._reactInternals === void 0) throw Error(L(38));
  return Ia(e, t, n, !1, r);
};
st.version = "18.2.0-next-9e3b772b8-20220608";
(function (e) {
  function t() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
      } catch (n) {
        console.error(n);
      }
  }
  t(), (e.exports = st);
})(eu);
const Un = Ed(eu.exports);
var Pm,
  Wf = eu.exports;
(Pm = Wf.createRoot), Wf.hydrateRoot;
const ry = "modulepreload",
  oy = function (e) {
    return "/" + e;
  },
  Uf = {},
  ly = function (t, n, r) {
    if (!n || n.length === 0) return t();
    const o = document.getElementsByTagName("link");
    return Promise.all(
      n.map((l) => {
        if (((l = oy(l)), l in Uf)) return;
        Uf[l] = !0;
        const a = l.endsWith(".css"),
          i = a ? '[rel="stylesheet"]' : "";
        if (!!r)
          for (let f = o.length - 1; f >= 0; f--) {
            const d = o[f];
            if (d.href === l && (!a || d.rel === "stylesheet")) return;
          }
        else if (document.querySelector(`link[href="${l}"]${i}`)) return;
        const c = document.createElement("link");
        if (
          ((c.rel = a ? "stylesheet" : ry),
          a || ((c.as = "script"), (c.crossOrigin = "")),
          (c.href = l),
          document.head.appendChild(c),
          a)
        )
          return new Promise((f, d) => {
            c.addEventListener("load", f),
              c.addEventListener("error", () =>
                d(new Error(`Unable to preload CSS for ${l}`)),
              );
          });
      }),
    ).then(() => t());
  };
var Hf = "popstate";
function ay(e = {}) {
  function t(r, o) {
    let { pathname: l, search: a, hash: i } = r.location;
    return wi(
      "",
      { pathname: l, search: a, hash: i },
      (o.state && o.state.usr) || null,
      (o.state && o.state.key) || "default",
    );
  }
  function n(r, o) {
    return typeof o == "string" ? o : Fo(o);
  }
  return iy(t, n, null, e);
}
function Ce(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function yt(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function sy() {
  return Math.random().toString(36).substring(2, 10);
}
function Vf(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function wi(e, t, n = null, r) {
  return {
    pathname: typeof e == "string" ? e : e.pathname,
    search: "",
    hash: "",
    ...(typeof t == "string" ? Br(t) : t),
    state: n,
    key: (t && t.key) || r || sy(),
  };
}
function Fo({ pathname: e = "/", search: t = "", hash: n = "" }) {
  return (
    t && t !== "?" && (e += t.charAt(0) === "?" ? t : "?" + t),
    n && n !== "#" && (e += n.charAt(0) === "#" ? n : "#" + n),
    e
  );
}
function Br(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substring(n)), (e = e.substring(0, n)));
    let r = e.indexOf("?");
    r >= 0 && ((t.search = e.substring(r)), (e = e.substring(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
function iy(e, t, n, r = {}) {
  let { window: o = document.defaultView, v5Compat: l = !1 } = r,
    a = o.history,
    i = "POP",
    u = null,
    c = f();
  c == null && ((c = 0), a.replaceState({ ...a.state, idx: c }, ""));
  function f() {
    return (a.state || { idx: null }).idx;
  }
  function d() {
    i = "POP";
    let k = f(),
      v = k == null ? null : k - c;
    (c = k), u && u({ action: i, location: x.location, delta: v });
  }
  function h(k, v) {
    i = "PUSH";
    let p = wi(x.location, k, v);
    n && n(p, k), (c = f() + 1);
    let g = Vf(p, c),
      w = x.createHref(p);
    try {
      a.pushState(g, "", w);
    } catch (C) {
      if (C instanceof DOMException && C.name === "DataCloneError") throw C;
      o.location.assign(w);
    }
    l && u && u({ action: i, location: x.location, delta: 1 });
  }
  function y(k, v) {
    i = "REPLACE";
    let p = wi(x.location, k, v);
    n && n(p, k), (c = f());
    let g = Vf(p, c),
      w = x.createHref(p);
    a.replaceState(g, "", w),
      l && u && u({ action: i, location: x.location, delta: 0 });
  }
  function E(k) {
    return uy(k);
  }
  let x = {
    get action() {
      return i;
    },
    get location() {
      return e(o, a);
    },
    listen(k) {
      if (u) throw new Error("A history only accepts one active listener");
      return (
        o.addEventListener(Hf, d),
        (u = k),
        () => {
          o.removeEventListener(Hf, d), (u = null);
        }
      );
    },
    createHref(k) {
      return t(o, k);
    },
    createURL: E,
    encodeLocation(k) {
      let v = E(k);
      return { pathname: v.pathname, search: v.search, hash: v.hash };
    },
    push: h,
    replace: y,
    go(k) {
      return a.go(k);
    },
  };
  return x;
}
function uy(e, t = !1) {
  let n = "http://localhost";
  typeof window < "u" &&
    (n =
      window.location.origin !== "null"
        ? window.location.origin
        : window.location.href),
    Ce(n, "No window.location.(origin|href) available to create URL");
  let r = typeof e == "string" ? e : Fo(e);
  return (
    (r = r.replace(/ $/, "%20")),
    !t && r.startsWith("//") && (r = n + r),
    new URL(r, n)
  );
}
function Tm(e, t, n = "/") {
  return cy(e, t, n, !1);
}
function cy(e, t, n, r) {
  let o = typeof t == "string" ? Br(t) : t,
    l = Zt(o.pathname || "/", n);
  if (l == null) return null;
  let a = bm(e);
  fy(a);
  let i = null;
  for (let u = 0; i == null && u < a.length; ++u) {
    let c = Sy(l);
    i = Ey(a[u], c, r);
  }
  return i;
}
function bm(e, t = [], n = [], r = "", o = !1) {
  let l = (a, i, u = o, c) => {
    let f = {
      relativePath: c === void 0 ? a.path || "" : c,
      caseSensitive: a.caseSensitive === !0,
      childrenIndex: i,
      route: a,
    };
    if (f.relativePath.startsWith("/")) {
      if (!f.relativePath.startsWith(r) && u) return;
      Ce(
        f.relativePath.startsWith(r),
        `Absolute route path "${f.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (f.relativePath = f.relativePath.slice(r.length));
    }
    let d = Gt([r, f.relativePath]),
      h = n.concat(f);
    a.children &&
      a.children.length > 0 &&
      (Ce(
        a.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${d}".`,
      ),
      bm(a.children, t, h, d, u)),
      !(a.path == null && !a.index) &&
        t.push({ path: d, score: yy(d, a.index), routesMeta: h });
  };
  return (
    e.forEach((a, i) => {
      var u;
      if (a.path === "" || !((u = a.path) != null && u.includes("?"))) l(a, i);
      else for (let c of $m(a.path)) l(a, i, !0, c);
    }),
    t
  );
}
function $m(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    o = n.endsWith("?"),
    l = n.replace(/\?$/, "");
  if (r.length === 0) return o ? [l, ""] : [l];
  let a = $m(r.join("/")),
    i = [];
  return (
    i.push(...a.map((u) => (u === "" ? l : [l, u].join("/")))),
    o && i.push(...a),
    i.map((u) => (e.startsWith("/") && u === "" ? "/" : u))
  );
}
function fy(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : xy(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
var dy = /^:[\w-]+$/,
  py = 3,
  my = 2,
  hy = 1,
  vy = 10,
  gy = -2,
  Kf = (e) => e === "*";
function yy(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(Kf) && (r += gy),
    t && (r += my),
    n
      .filter((o) => !Kf(o))
      .reduce((o, l) => o + (dy.test(l) ? py : l === "" ? hy : vy), r)
  );
}
function xy(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, o) => r === t[o])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Ey(e, t, n = !1) {
  let { routesMeta: r } = e,
    o = {},
    l = "/",
    a = [];
  for (let i = 0; i < r.length; ++i) {
    let u = r[i],
      c = i === r.length - 1,
      f = l === "/" ? t : t.slice(l.length) || "/",
      d = da(
        { path: u.relativePath, caseSensitive: u.caseSensitive, end: c },
        f,
      ),
      h = u.route;
    if (
      (!d &&
        c &&
        n &&
        !r[r.length - 1].route.index &&
        (d = da(
          { path: u.relativePath, caseSensitive: u.caseSensitive, end: !1 },
          f,
        )),
      !d)
    )
      return null;
    Object.assign(o, d.params),
      a.push({
        params: o,
        pathname: Gt([l, d.pathname]),
        pathnameBase: Ry(Gt([l, d.pathnameBase])),
        route: h,
      }),
      d.pathnameBase !== "/" && (l = Gt([l, d.pathnameBase]));
  }
  return a;
}
function da(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = wy(e.path, e.caseSensitive, e.end),
    o = t.match(n);
  if (!o) return null;
  let l = o[0],
    a = l.replace(/(.)\/+$/, "$1"),
    i = o.slice(1);
  return {
    params: r.reduce((c, { paramName: f, isOptional: d }, h) => {
      if (f === "*") {
        let E = i[h] || "";
        a = l.slice(0, l.length - E.length).replace(/(.)\/+$/, "$1");
      }
      const y = i[h];
      return (
        d && !y ? (c[f] = void 0) : (c[f] = (y || "").replace(/%2F/g, "/")), c
      );
    }, {}),
    pathname: l,
    pathnameBase: a,
    pattern: e,
  };
}
function wy(e, t = !1, n = !0) {
  yt(
    e === "*" || !e.endsWith("*") || e.endsWith("/*"),
    `Route path "${e}" will be treated as if it were "${e.replace(
      /\*$/,
      "/*",
    )}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(
      /\*$/,
      "/*",
    )}".`,
  );
  let r = [],
    o =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (a, i, u) => (
            r.push({ paramName: i, isOptional: u != null }),
            u ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        )
        .replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (o += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
        ? (o += "\\/*$")
        : e !== "" && e !== "/" && (o += "(?:(?=\\/|$))"),
    [new RegExp(o, t ? void 0 : "i"), r]
  );
}
function Sy(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      yt(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`,
      ),
      e
    );
  }
}
function Zt(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
var Lm = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  ky = (e) => Lm.test(e);
function Cy(e, t = "/") {
  let {
      pathname: n,
      search: r = "",
      hash: o = "",
    } = typeof e == "string" ? Br(e) : e,
    l;
  if (n)
    if (ky(n)) l = n;
    else {
      if (n.includes("//")) {
        let a = n;
        (n = n.replace(/\/\/+/g, "/")),
          yt(
            !1,
            `Pathnames cannot have embedded double slashes - normalizing ${a} -> ${n}`,
          );
      }
      n.startsWith("/") ? (l = Gf(n.substring(1), "/")) : (l = Gf(n, t));
    }
  else l = t;
  return { pathname: l, search: Oy(r), hash: _y(o) };
}
function Gf(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((o) => {
      o === ".." ? n.length > 1 && n.pop() : o !== "." && n.push(o);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Es(e, t, n, r) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(
    r,
  )}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Ny(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function jm(e) {
  let t = Ny(e);
  return t.map((n, r) => (r === t.length - 1 ? n.pathname : n.pathnameBase));
}
function Dm(e, t, n, r = !1) {
  let o;
  typeof e == "string"
    ? (o = Br(e))
    : ((o = { ...e }),
      Ce(
        !o.pathname || !o.pathname.includes("?"),
        Es("?", "pathname", "search", o),
      ),
      Ce(
        !o.pathname || !o.pathname.includes("#"),
        Es("#", "pathname", "hash", o),
      ),
      Ce(!o.search || !o.search.includes("#"), Es("#", "search", "hash", o)));
  let l = e === "" || o.pathname === "",
    a = l ? "/" : o.pathname,
    i;
  if (a == null) i = n;
  else {
    let d = t.length - 1;
    if (!r && a.startsWith("..")) {
      let h = a.split("/");
      for (; h[0] === ".."; ) h.shift(), (d -= 1);
      o.pathname = h.join("/");
    }
    i = d >= 0 ? t[d] : "/";
  }
  let u = Cy(o, i),
    c = a && a !== "/" && a.endsWith("/"),
    f = (l || a === ".") && n.endsWith("/");
  return !u.pathname.endsWith("/") && (c || f) && (u.pathname += "/"), u;
}
var Gt = (e) => e.join("/").replace(/\/\/+/g, "/"),
  Ry = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  Oy = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  _y = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e),
  Py = class {
    constructor(e, t, n, r = !1) {
      (this.status = e),
        (this.statusText = t || ""),
        (this.internal = r),
        n instanceof Error
          ? ((this.data = n.toString()), (this.error = n))
          : (this.data = n);
    }
  };
function Ty(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
function by(e) {
  return (
    e
      .map((t) => t.route.path)
      .filter(Boolean)
      .join("/")
      .replace(/\/\/*/g, "/") || "/"
  );
}
var Mm =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
function Im(e, t) {
  let n = e;
  if (typeof n != "string" || !Lm.test(n))
    return { absoluteURL: void 0, isExternal: !1, to: n };
  let r = n,
    o = !1;
  if (Mm)
    try {
      let l = new URL(window.location.href),
        a = n.startsWith("//") ? new URL(l.protocol + n) : new URL(n),
        i = Zt(a.pathname, t);
      a.origin === l.origin && i != null
        ? (n = i + a.search + a.hash)
        : (o = !0);
    } catch {
      yt(
        !1,
        `<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: r, isExternal: o, to: n };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var $y = ["POST", "PUT", "PATCH", "DELETE"];
[...$y];
var Wr = m.exports.createContext(null);
Wr.displayName = "DataRouter";
var za = m.exports.createContext(null);
za.displayName = "DataRouterState";
var Ly = m.exports.createContext(!1),
  zm = m.exports.createContext({ isTransitioning: !1 });
zm.displayName = "ViewTransition";
var jy = m.exports.createContext(new Map());
jy.displayName = "Fetchers";
var Dy = m.exports.createContext(null);
Dy.displayName = "Await";
var wt = m.exports.createContext(null);
wt.displayName = "Navigation";
var Yo = m.exports.createContext(null);
Yo.displayName = "Location";
var rn = m.exports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1,
});
rn.displayName = "Route";
var Vu = m.exports.createContext(null);
Vu.displayName = "RouteError";
var Am = "REACT_ROUTER_ERROR",
  My = "REDIRECT",
  Iy = "ROUTE_ERROR_RESPONSE";
function zy(e) {
  if (e.startsWith(`${Am}:${My}:{`))
    try {
      let t = JSON.parse(e.slice(28));
      if (
        typeof t == "object" &&
        t &&
        typeof t.status == "number" &&
        typeof t.statusText == "string" &&
        typeof t.location == "string" &&
        typeof t.reloadDocument == "boolean" &&
        typeof t.replace == "boolean"
      )
        return t;
    } catch {}
}
function Ay(e) {
  if (e.startsWith(`${Am}:${Iy}:{`))
    try {
      let t = JSON.parse(e.slice(40));
      if (
        typeof t == "object" &&
        t &&
        typeof t.status == "number" &&
        typeof t.statusText == "string"
      )
        return new Py(t.status, t.statusText, t.data);
    } catch {}
}
function Fy(e, { relative: t } = {}) {
  Ce(
    Xo(),
    "useHref() may be used only in the context of a <Router> component.",
  );
  let { basename: n, navigator: r } = m.exports.useContext(wt),
    { hash: o, pathname: l, search: a } = Jo(e, { relative: t }),
    i = l;
  return (
    n !== "/" && (i = l === "/" ? n : Gt([n, l])),
    r.createHref({ pathname: i, search: a, hash: o })
  );
}
function Xo() {
  return m.exports.useContext(Yo) != null;
}
function on() {
  return (
    Ce(
      Xo(),
      "useLocation() may be used only in the context of a <Router> component.",
    ),
    m.exports.useContext(Yo).location
  );
}
var Fm =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Bm(e) {
  m.exports.useContext(wt).static || m.exports.useLayoutEffect(e);
}
function Aa() {
  let { isDataRoute: e } = m.exports.useContext(rn);
  return e ? Zy() : By();
}
function By() {
  Ce(
    Xo(),
    "useNavigate() may be used only in the context of a <Router> component.",
  );
  let e = m.exports.useContext(Wr),
    { basename: t, navigator: n } = m.exports.useContext(wt),
    { matches: r } = m.exports.useContext(rn),
    { pathname: o } = on(),
    l = JSON.stringify(jm(r)),
    a = m.exports.useRef(!1);
  return (
    Bm(() => {
      a.current = !0;
    }),
    m.exports.useCallback(
      (u, c = {}) => {
        if ((yt(a.current, Fm), !a.current)) return;
        if (typeof u == "number") {
          n.go(u);
          return;
        }
        let f = Dm(u, JSON.parse(l), o, c.relative === "path");
        e == null &&
          t !== "/" &&
          (f.pathname = f.pathname === "/" ? t : Gt([t, f.pathname])),
          (c.replace ? n.replace : n.push)(f, c.state, c);
      },
      [t, n, l, o, e],
    )
  );
}
m.exports.createContext(null);
function Jo(e, { relative: t } = {}) {
  let { matches: n } = m.exports.useContext(rn),
    { pathname: r } = on(),
    o = JSON.stringify(jm(n));
  return m.exports.useMemo(
    () => Dm(e, JSON.parse(o), r, t === "path"),
    [e, o, r, t],
  );
}
function Wy(e, t, n, r, o) {
  var p;
  Ce(
    Xo(),
    "useRoutes() may be used only in the context of a <Router> component.",
  );
  let { navigator: l } = m.exports.useContext(wt),
    { matches: a } = m.exports.useContext(rn),
    i = a[a.length - 1],
    u = i ? i.params : {},
    c = i ? i.pathname : "/",
    f = i ? i.pathnameBase : "/",
    d = i && i.route;
  {
    let g = (d && d.path) || "";
    Um(
      c,
      !d || g.endsWith("*") || g.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${c}" (under <Route path="${g}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${g}"> to <Route path="${
        g === "/" ? "*" : `${g}/*`
      }">.`,
    );
  }
  let h = on(),
    y;
  if (t) {
    let g = typeof t == "string" ? Br(t) : t;
    Ce(
      f === "/" || ((p = g.pathname) == null ? void 0 : p.startsWith(f)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${g.pathname}" was given in the \`location\` prop.`,
    ),
      (y = g);
  } else y = h;
  let E = y.pathname || "/",
    x = E;
  if (f !== "/") {
    let g = f.replace(/^\//, "").split("/");
    x = "/" + E.replace(/^\//, "").split("/").slice(g.length).join("/");
  }
  let k = Tm(e, { pathname: x });
  yt(
    d || k != null,
    `No routes matched location "${y.pathname}${y.search}${y.hash}" `,
  ),
    yt(
      k == null ||
        k[k.length - 1].route.element !== void 0 ||
        k[k.length - 1].route.Component !== void 0 ||
        k[k.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${y.pathname}${y.search}${y.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    );
  let v = Gy(
    k &&
      k.map((g) =>
        Object.assign({}, g, {
          params: Object.assign({}, u, g.params),
          pathname: Gt([
            f,
            l.encodeLocation
              ? l.encodeLocation(
                  g.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23"),
                ).pathname
              : g.pathname,
          ]),
          pathnameBase:
            g.pathnameBase === "/"
              ? f
              : Gt([
                  f,
                  l.encodeLocation
                    ? l.encodeLocation(
                        g.pathnameBase
                          .replace(/\?/g, "%3F")
                          .replace(/#/g, "%23"),
                      ).pathname
                    : g.pathnameBase,
                ]),
        }),
      ),
    a,
    n,
    r,
    o,
  );
  return t && v
    ? m.exports.createElement(
        Yo.Provider,
        {
          value: {
            location: {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
              ...y,
            },
            navigationType: "POP",
          },
        },
        v,
      )
    : v;
}
function Uy() {
  let e = Jy(),
    t = Ty(e)
      ? `${e.status} ${e.statusText}`
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    r = "rgba(200,200,200, 0.5)",
    o = { padding: "0.5rem", backgroundColor: r },
    l = { padding: "2px 4px", backgroundColor: r },
    a = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", e),
    (a = m.exports.createElement(
      m.exports.Fragment,
      null,
      m.exports.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"),
      m.exports.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        m.exports.createElement("code", { style: l }, "ErrorBoundary"),
        " or",
        " ",
        m.exports.createElement("code", { style: l }, "errorElement"),
        " prop on your route.",
      ),
    )),
    m.exports.createElement(
      m.exports.Fragment,
      null,
      m.exports.createElement("h2", null, "Unexpected Application Error!"),
      m.exports.createElement("h3", { style: { fontStyle: "italic" } }, t),
      n ? m.exports.createElement("pre", { style: o }, n) : null,
      a,
    )
  );
}
var Hy = m.exports.createElement(Uy, null),
  Wm = class extends m.exports.Component {
    constructor(e) {
      super(e),
        (this.state = {
          location: e.location,
          revalidation: e.revalidation,
          error: e.error,
        });
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location ||
        (t.revalidation !== "idle" && e.revalidation === "idle")
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error !== void 0 ? e.error : t.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      this.props.onError
        ? this.props.onError(e, t)
        : console.error(
            "React Router caught the following error during render",
            e,
          );
    }
    render() {
      let e = this.state.error;
      if (
        this.context &&
        typeof e == "object" &&
        e &&
        "digest" in e &&
        typeof e.digest == "string"
      ) {
        const n = Ay(e.digest);
        n && (e = n);
      }
      let t =
        e !== void 0
          ? m.exports.createElement(
              rn.Provider,
              { value: this.props.routeContext },
              m.exports.createElement(Vu.Provider, {
                value: e,
                children: this.props.component,
              }),
            )
          : this.props.children;
      return this.context ? m.exports.createElement(Vy, { error: e }, t) : t;
    }
  };
Wm.contextType = Ly;
var ws = new WeakMap();
function Vy({ children: e, error: t }) {
  let { basename: n } = m.exports.useContext(wt);
  if (
    typeof t == "object" &&
    t &&
    "digest" in t &&
    typeof t.digest == "string"
  ) {
    let r = zy(t.digest);
    if (r) {
      let o = ws.get(t);
      if (o) throw o;
      let l = Im(r.location, n);
      if (Mm && !ws.get(t))
        if (l.isExternal || r.reloadDocument)
          window.location.href = l.absoluteURL || l.to;
        else {
          const a = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(l.to, {
              replace: r.replace,
            }),
          );
          throw (ws.set(t, a), a);
        }
      return m.exports.createElement("meta", {
        httpEquiv: "refresh",
        content: `0;url=${l.absoluteURL || l.to}`,
      });
    }
  }
  return e;
}
function Ky({ routeContext: e, match: t, children: n }) {
  let r = m.exports.useContext(Wr);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = t.route.id),
    m.exports.createElement(rn.Provider, { value: e }, n)
  );
}
function Gy(e, t = [], n = null, r = null, o = null) {
  if (e == null) {
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (t.length === 0 && !n.initialized && n.matches.length > 0)
      e = n.matches;
    else return null;
  }
  let l = e,
    a = n == null ? void 0 : n.errors;
  if (a != null) {
    let f = l.findIndex(
      (d) => d.route.id && (a == null ? void 0 : a[d.route.id]) !== void 0,
    );
    Ce(
      f >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        a,
      ).join(",")}`,
    ),
      (l = l.slice(0, Math.min(l.length, f + 1)));
  }
  let i = !1,
    u = -1;
  if (n)
    for (let f = 0; f < l.length; f++) {
      let d = l[f];
      if (
        ((d.route.HydrateFallback || d.route.hydrateFallbackElement) && (u = f),
        d.route.id)
      ) {
        let { loaderData: h, errors: y } = n,
          E =
            d.route.loader &&
            !h.hasOwnProperty(d.route.id) &&
            (!y || y[d.route.id] === void 0);
        if (d.route.lazy || E) {
          (i = !0), u >= 0 ? (l = l.slice(0, u + 1)) : (l = [l[0]]);
          break;
        }
      }
    }
  let c =
    n && r
      ? (f, d) => {
          var h, y, E;
          r(f, {
            location: n.location,
            params:
              (E =
                (y = (h = n.matches) == null ? void 0 : h[0]) == null
                  ? void 0
                  : y.params) != null
                ? E
                : {},
            unstable_pattern: by(n.matches),
            errorInfo: d,
          });
        }
      : void 0;
  return l.reduceRight((f, d, h) => {
    let y,
      E = !1,
      x = null,
      k = null;
    n &&
      ((y = a && d.route.id ? a[d.route.id] : void 0),
      (x = d.route.errorElement || Hy),
      i &&
        (u < 0 && h === 0
          ? (Um(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (E = !0),
            (k = null))
          : u === h &&
            ((E = !0), (k = d.route.hydrateFallbackElement || null))));
    let v = t.concat(l.slice(0, h + 1)),
      p = () => {
        let g;
        return (
          y
            ? (g = x)
            : E
              ? (g = k)
              : d.route.Component
                ? (g = m.exports.createElement(d.route.Component, null))
                : d.route.element
                  ? (g = d.route.element)
                  : (g = f),
          m.exports.createElement(Ky, {
            match: d,
            routeContext: { outlet: f, matches: v, isDataRoute: n != null },
            children: g,
          })
        );
      };
    return n && (d.route.ErrorBoundary || d.route.errorElement || h === 0)
      ? m.exports.createElement(Wm, {
          location: n.location,
          revalidation: n.revalidation,
          component: x,
          error: y,
          children: p(),
          routeContext: { outlet: null, matches: v, isDataRoute: !0 },
          onError: c,
        })
      : p();
  }, null);
}
function Ku(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Qy(e) {
  let t = m.exports.useContext(Wr);
  return Ce(t, Ku(e)), t;
}
function qy(e) {
  let t = m.exports.useContext(za);
  return Ce(t, Ku(e)), t;
}
function Yy(e) {
  let t = m.exports.useContext(rn);
  return Ce(t, Ku(e)), t;
}
function Gu(e) {
  let t = Yy(e),
    n = t.matches[t.matches.length - 1];
  return (
    Ce(
      n.route.id,
      `${e} can only be used on routes that contain a unique "id"`,
    ),
    n.route.id
  );
}
function Xy() {
  return Gu("useRouteId");
}
function Jy() {
  var r;
  let e = m.exports.useContext(Vu),
    t = qy("useRouteError"),
    n = Gu("useRouteError");
  return e !== void 0 ? e : (r = t.errors) == null ? void 0 : r[n];
}
function Zy() {
  let { router: e } = Qy("useNavigate"),
    t = Gu("useNavigate"),
    n = m.exports.useRef(!1);
  return (
    Bm(() => {
      n.current = !0;
    }),
    m.exports.useCallback(
      async (o, l = {}) => {
        yt(n.current, Fm),
          n.current &&
            (typeof o == "number"
              ? await e.navigate(o)
              : await e.navigate(o, { fromRouteId: t, ...l }));
      },
      [e, t],
    )
  );
}
var Qf = {};
function Um(e, t, n) {
  !t && !Qf[e] && ((Qf[e] = !0), yt(!1, n));
}
var e1 = "useOptimistic";
eg[e1];
m.exports.memo(t1);
function t1({ routes: e, future: t, state: n, onError: r }) {
  return Wy(e, void 0, n, r, t);
}
function n1({
  basename: e = "/",
  children: t = null,
  location: n,
  navigationType: r = "POP",
  navigator: o,
  static: l = !1,
  unstable_useTransitions: a,
}) {
  Ce(
    !Xo(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.",
  );
  let i = e.replace(/^\/*/, "/"),
    u = m.exports.useMemo(
      () => ({
        basename: i,
        navigator: o,
        static: l,
        unstable_useTransitions: a,
        future: {},
      }),
      [i, o, l, a],
    );
  typeof n == "string" && (n = Br(n));
  let {
      pathname: c = "/",
      search: f = "",
      hash: d = "",
      state: h = null,
      key: y = "default",
    } = n,
    E = m.exports.useMemo(() => {
      let x = Zt(c, i);
      return x == null
        ? null
        : {
            location: { pathname: x, search: f, hash: d, state: h, key: y },
            navigationType: r,
          };
    }, [i, c, f, d, h, y, r]);
  return (
    yt(
      E != null,
      `<Router basename="${i}"> is not able to match the URL "${c}${f}${d}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    E == null
      ? null
      : m.exports.createElement(
          wt.Provider,
          { value: u },
          m.exports.createElement(Yo.Provider, { children: t, value: E }),
        )
  );
}
var zl = "get",
  Al = "application/x-www-form-urlencoded";
function Fa(e) {
  return typeof HTMLElement < "u" && e instanceof HTMLElement;
}
function r1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "button";
}
function o1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "form";
}
function l1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "input";
}
function a1(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function s1(e, t) {
  return e.button === 0 && (!t || t === "_self") && !a1(e);
}
function Si(e = "") {
  return new URLSearchParams(
    typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams
      ? e
      : Object.keys(e).reduce((t, n) => {
          let r = e[n];
          return t.concat(Array.isArray(r) ? r.map((o) => [n, o]) : [[n, r]]);
        }, []),
  );
}
function i1(e, t) {
  let n = Si(e);
  return (
    t &&
      t.forEach((r, o) => {
        n.has(o) ||
          t.getAll(o).forEach((l) => {
            n.append(o, l);
          });
      }),
    n
  );
}
var wl = null;
function u1() {
  if (wl === null)
    try {
      new FormData(document.createElement("form"), 0), (wl = !1);
    } catch {
      wl = !0;
    }
  return wl;
}
var c1 = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function Ss(e) {
  return e != null && !c1.has(e)
    ? (yt(
        !1,
        `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Al}"`,
      ),
      null)
    : e;
}
function f1(e, t) {
  let n, r, o, l, a;
  if (o1(e)) {
    let i = e.getAttribute("action");
    (r = i ? Zt(i, t) : null),
      (n = e.getAttribute("method") || zl),
      (o = Ss(e.getAttribute("enctype")) || Al),
      (l = new FormData(e));
  } else if (r1(e) || (l1(e) && (e.type === "submit" || e.type === "image"))) {
    let i = e.form;
    if (i == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>',
      );
    let u = e.getAttribute("formaction") || i.getAttribute("action");
    if (
      ((r = u ? Zt(u, t) : null),
      (n = e.getAttribute("formmethod") || i.getAttribute("method") || zl),
      (o =
        Ss(e.getAttribute("formenctype")) ||
        Ss(i.getAttribute("enctype")) ||
        Al),
      (l = new FormData(i, e)),
      !u1())
    ) {
      let { name: c, type: f, value: d } = e;
      if (f === "image") {
        let h = c ? `${c}.` : "";
        l.append(`${h}x`, "0"), l.append(`${h}y`, "0");
      } else c && l.append(c, d);
    }
  } else {
    if (Fa(e))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    (n = zl), (r = null), (o = Al), (a = e);
  }
  return (
    l && o === "text/plain" && ((a = l), (l = void 0)),
    { action: r, method: n.toLowerCase(), encType: o, formData: l, body: a }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Qu(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function d1(e, t, n, r) {
  let o =
    typeof e == "string"
      ? new URL(
          e,
          typeof window > "u"
            ? "server://singlefetch/"
            : window.location.origin,
        )
      : e;
  return (
    n
      ? o.pathname.endsWith("/")
        ? (o.pathname = `${o.pathname}_.${r}`)
        : (o.pathname = `${o.pathname}.${r}`)
      : o.pathname === "/"
        ? (o.pathname = `_root.${r}`)
        : t && Zt(o.pathname, t) === "/"
          ? (o.pathname = `${t.replace(/\/$/, "")}/_root.${r}`)
          : (o.pathname = `${o.pathname.replace(/\/$/, "")}.${r}`),
    o
  );
}
async function p1(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let n = await ly(() => import(e.module), []);
    return (t[e.id] = n), n;
  } catch (n) {
    return (
      console.error(
        `Error loading route module \`${e.module}\`, reloading page...`,
      ),
      console.error(n),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function m1(e) {
  return e != null && typeof e.page == "string";
}
function h1(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === "preload" &&
        typeof e.imageSrcSet == "string" &&
        typeof e.imageSizes == "string"
      : typeof e.rel == "string" && typeof e.href == "string";
}
async function v1(e, t, n) {
  let r = await Promise.all(
    e.map(async (o) => {
      let l = t.routes[o.route.id];
      if (l) {
        let a = await p1(l, n);
        return a.links ? a.links() : [];
      }
      return [];
    }),
  );
  return E1(
    r
      .flat(1)
      .filter(h1)
      .filter((o) => o.rel === "stylesheet" || o.rel === "preload")
      .map((o) =>
        o.rel === "stylesheet"
          ? { ...o, rel: "prefetch", as: "style" }
          : { ...o, rel: "prefetch" },
      ),
  );
}
function qf(e, t, n, r, o, l) {
  let a = (u, c) => (n[c] ? u.route.id !== n[c].route.id : !0),
    i = (u, c) => {
      var f;
      return (
        n[c].pathname !== u.pathname ||
        (((f = n[c].route.path) == null ? void 0 : f.endsWith("*")) &&
          n[c].params["*"] !== u.params["*"])
      );
    };
  return l === "assets"
    ? t.filter((u, c) => a(u, c) || i(u, c))
    : l === "data"
      ? t.filter((u, c) => {
          var d;
          let f = r.routes[u.route.id];
          if (!f || !f.hasLoader) return !1;
          if (a(u, c) || i(u, c)) return !0;
          if (u.route.shouldRevalidate) {
            let h = u.route.shouldRevalidate({
              currentUrl: new URL(
                o.pathname + o.search + o.hash,
                window.origin,
              ),
              currentParams: ((d = n[0]) == null ? void 0 : d.params) || {},
              nextUrl: new URL(e, window.origin),
              nextParams: u.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof h == "boolean") return h;
          }
          return !0;
        })
      : [];
}
function g1(e, t, { includeHydrateFallback: n } = {}) {
  return y1(
    e
      .map((r) => {
        let o = t.routes[r.route.id];
        if (!o) return [];
        let l = [o.module];
        return (
          o.clientActionModule && (l = l.concat(o.clientActionModule)),
          o.clientLoaderModule && (l = l.concat(o.clientLoaderModule)),
          n &&
            o.hydrateFallbackModule &&
            (l = l.concat(o.hydrateFallbackModule)),
          o.imports && (l = l.concat(o.imports)),
          l
        );
      })
      .flat(1),
  );
}
function y1(e) {
  return [...new Set(e)];
}
function x1(e) {
  let t = {},
    n = Object.keys(e).sort();
  for (let r of n) t[r] = e[r];
  return t;
}
function E1(e, t) {
  let n = new Set(),
    r = new Set(t);
  return e.reduce((o, l) => {
    if (t && !m1(l) && l.as === "script" && l.href && r.has(l.href)) return o;
    let i = JSON.stringify(x1(l));
    return n.has(i) || (n.add(i), o.push({ key: i, link: l })), o;
  }, []);
}
function Hm() {
  let e = m.exports.useContext(Wr);
  return (
    Qu(
      e,
      "You must render this element inside a <DataRouterContext.Provider> element",
    ),
    e
  );
}
function w1() {
  let e = m.exports.useContext(za);
  return (
    Qu(
      e,
      "You must render this element inside a <DataRouterStateContext.Provider> element",
    ),
    e
  );
}
var qu = m.exports.createContext(void 0);
qu.displayName = "FrameworkContext";
function Vm() {
  let e = m.exports.useContext(qu);
  return (
    Qu(e, "You must render this element inside a <HydratedRouter> element"), e
  );
}
function S1(e, t) {
  let n = m.exports.useContext(qu),
    [r, o] = m.exports.useState(!1),
    [l, a] = m.exports.useState(!1),
    {
      onFocus: i,
      onBlur: u,
      onMouseEnter: c,
      onMouseLeave: f,
      onTouchStart: d,
    } = t,
    h = m.exports.useRef(null);
  m.exports.useEffect(() => {
    if ((e === "render" && a(!0), e === "viewport")) {
      let x = (v) => {
          v.forEach((p) => {
            a(p.isIntersecting);
          });
        },
        k = new IntersectionObserver(x, { threshold: 0.5 });
      return (
        h.current && k.observe(h.current),
        () => {
          k.disconnect();
        }
      );
    }
  }, [e]),
    m.exports.useEffect(() => {
      if (r) {
        let x = setTimeout(() => {
          a(!0);
        }, 100);
        return () => {
          clearTimeout(x);
        };
      }
    }, [r]);
  let y = () => {
      o(!0);
    },
    E = () => {
      o(!1), a(!1);
    };
  return n
    ? e !== "intent"
      ? [l, h, {}]
      : [
          l,
          h,
          {
            onFocus: to(i, y),
            onBlur: to(u, E),
            onMouseEnter: to(c, y),
            onMouseLeave: to(f, E),
            onTouchStart: to(d, y),
          },
        ]
    : [!1, h, {}];
}
function to(e, t) {
  return (n) => {
    e && e(n), n.defaultPrevented || t(n);
  };
}
function k1({ page: e, ...t }) {
  let { router: n } = Hm(),
    r = m.exports.useMemo(
      () => Tm(n.routes, e, n.basename),
      [n.routes, e, n.basename],
    );
  return r ? m.exports.createElement(N1, { page: e, matches: r, ...t }) : null;
}
function C1(e) {
  let { manifest: t, routeModules: n } = Vm(),
    [r, o] = m.exports.useState([]);
  return (
    m.exports.useEffect(() => {
      let l = !1;
      return (
        v1(e, t, n).then((a) => {
          l || o(a);
        }),
        () => {
          l = !0;
        }
      );
    }, [e, t, n]),
    r
  );
}
function N1({ page: e, matches: t, ...n }) {
  let r = on(),
    { future: o, manifest: l, routeModules: a } = Vm(),
    { basename: i } = Hm(),
    { loaderData: u, matches: c } = w1(),
    f = m.exports.useMemo(() => qf(e, t, c, l, r, "data"), [e, t, c, l, r]),
    d = m.exports.useMemo(() => qf(e, t, c, l, r, "assets"), [e, t, c, l, r]),
    h = m.exports.useMemo(() => {
      if (e === r.pathname + r.search + r.hash) return [];
      let x = new Set(),
        k = !1;
      if (
        (t.forEach((p) => {
          var w;
          let g = l.routes[p.route.id];
          !g ||
            !g.hasLoader ||
            ((!f.some((C) => C.route.id === p.route.id) &&
              p.route.id in u &&
              ((w = a[p.route.id]) == null ? void 0 : w.shouldRevalidate)) ||
            g.hasClientLoader
              ? (k = !0)
              : x.add(p.route.id));
        }),
        x.size === 0)
      )
        return [];
      let v = d1(e, i, o.unstable_trailingSlashAwareDataRequests, "data");
      return (
        k &&
          x.size > 0 &&
          v.searchParams.set(
            "_routes",
            t
              .filter((p) => x.has(p.route.id))
              .map((p) => p.route.id)
              .join(","),
          ),
        [v.pathname + v.search]
      );
    }, [i, o.unstable_trailingSlashAwareDataRequests, u, r, l, f, t, e, a]),
    y = m.exports.useMemo(() => g1(d, l), [d, l]),
    E = C1(d);
  return m.exports.createElement(
    m.exports.Fragment,
    null,
    h.map((x) =>
      m.exports.createElement("link", {
        key: x,
        rel: "prefetch",
        as: "fetch",
        href: x,
        ...n,
      }),
    ),
    y.map((x) =>
      m.exports.createElement("link", {
        key: x,
        rel: "modulepreload",
        href: x,
        ...n,
      }),
    ),
    E.map(({ key: x, link: k }) =>
      m.exports.createElement("link", { key: x, nonce: n.nonce, ...k }),
    ),
  );
}
function R1(...e) {
  return (t) => {
    e.forEach((n) => {
      typeof n == "function" ? n(t) : n != null && (n.current = t);
    });
  };
}
var O1 =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
try {
  O1 && (window.__reactRouterVersion = "7.12.0");
} catch {}
function _1({
  basename: e,
  children: t,
  unstable_useTransitions: n,
  window: r,
}) {
  let o = m.exports.useRef();
  o.current == null && (o.current = ay({ window: r, v5Compat: !0 }));
  let l = o.current,
    [a, i] = m.exports.useState({ action: l.action, location: l.location }),
    u = m.exports.useCallback(
      (c) => {
        n === !1 ? i(c) : m.exports.startTransition(() => i(c));
      },
      [n],
    );
  return (
    m.exports.useLayoutEffect(() => l.listen(u), [l, u]),
    m.exports.createElement(n1, {
      basename: e,
      children: t,
      location: a.location,
      navigationType: a.action,
      navigator: l,
      unstable_useTransitions: n,
    })
  );
}
var Km = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Gm = m.exports.forwardRef(function (
    {
      onClick: t,
      discover: n = "render",
      prefetch: r = "none",
      relative: o,
      reloadDocument: l,
      replace: a,
      state: i,
      target: u,
      to: c,
      preventScrollReset: f,
      viewTransition: d,
      unstable_defaultShouldRevalidate: h,
      ...y
    },
    E,
  ) {
    let { basename: x, unstable_useTransitions: k } = m.exports.useContext(wt),
      v = typeof c == "string" && Km.test(c),
      p = Im(c, x);
    c = p.to;
    let g = Fy(c, { relative: o }),
      [w, C, S] = S1(r, y),
      N = $1(c, {
        replace: a,
        state: i,
        target: u,
        preventScrollReset: f,
        relative: o,
        viewTransition: d,
        unstable_defaultShouldRevalidate: h,
        unstable_useTransitions: k,
      });
    function O(D) {
      t && t(D), D.defaultPrevented || N(D);
    }
    let j = m.exports.createElement("a", {
      ...y,
      ...S,
      href: p.absoluteURL || g,
      onClick: p.isExternal || l ? t : O,
      ref: R1(E, C),
      target: u,
      "data-discover": !v && n === "render" ? "true" : void 0,
    });
    return w && !v
      ? m.exports.createElement(
          m.exports.Fragment,
          null,
          j,
          m.exports.createElement(k1, { page: g }),
        )
      : j;
  });
Gm.displayName = "Link";
var P1 = m.exports.forwardRef(function (
  {
    "aria-current": t = "page",
    caseSensitive: n = !1,
    className: r = "",
    end: o = !1,
    style: l,
    to: a,
    viewTransition: i,
    children: u,
    ...c
  },
  f,
) {
  let d = Jo(a, { relative: c.relative }),
    h = on(),
    y = m.exports.useContext(za),
    { navigator: E, basename: x } = m.exports.useContext(wt),
    k = y != null && I1(d) && i === !0,
    v = E.encodeLocation ? E.encodeLocation(d).pathname : d.pathname,
    p = h.pathname,
    g =
      y && y.navigation && y.navigation.location
        ? y.navigation.location.pathname
        : null;
  n ||
    ((p = p.toLowerCase()),
    (g = g ? g.toLowerCase() : null),
    (v = v.toLowerCase())),
    g && x && (g = Zt(g, x) || g);
  const w = v !== "/" && v.endsWith("/") ? v.length - 1 : v.length;
  let C = p === v || (!o && p.startsWith(v) && p.charAt(w) === "/"),
    S =
      g != null &&
      (g === v || (!o && g.startsWith(v) && g.charAt(v.length) === "/")),
    N = { isActive: C, isPending: S, isTransitioning: k },
    O = C ? t : void 0,
    j;
  typeof r == "function"
    ? (j = r(N))
    : (j = [
        r,
        C ? "active" : null,
        S ? "pending" : null,
        k ? "transitioning" : null,
      ]
        .filter(Boolean)
        .join(" "));
  let D = typeof l == "function" ? l(N) : l;
  return m.exports.createElement(
    Gm,
    {
      ...c,
      "aria-current": O,
      className: j,
      ref: f,
      style: D,
      to: a,
      viewTransition: i,
    },
    typeof u == "function" ? u(N) : u,
  );
});
P1.displayName = "NavLink";
var T1 = m.exports.forwardRef(
  (
    {
      discover: e = "render",
      fetcherKey: t,
      navigate: n,
      reloadDocument: r,
      replace: o,
      state: l,
      method: a = zl,
      action: i,
      onSubmit: u,
      relative: c,
      preventScrollReset: f,
      viewTransition: d,
      unstable_defaultShouldRevalidate: h,
      ...y
    },
    E,
  ) => {
    let { unstable_useTransitions: x } = m.exports.useContext(wt),
      k = D1(),
      v = M1(i, { relative: c }),
      p = a.toLowerCase() === "get" ? "get" : "post",
      g = typeof i == "string" && Km.test(i),
      w = (C) => {
        if ((u && u(C), C.defaultPrevented)) return;
        C.preventDefault();
        let S = C.nativeEvent.submitter,
          N = (S == null ? void 0 : S.getAttribute("formmethod")) || a,
          O = () =>
            k(S || C.currentTarget, {
              fetcherKey: t,
              method: N,
              navigate: n,
              replace: o,
              state: l,
              relative: c,
              preventScrollReset: f,
              viewTransition: d,
              unstable_defaultShouldRevalidate: h,
            });
        x && n !== !1 ? m.exports.startTransition(() => O()) : O();
      };
    return m.exports.createElement("form", {
      ref: E,
      method: p,
      action: v,
      onSubmit: r ? u : w,
      ...y,
      "data-discover": !g && e === "render" ? "true" : void 0,
    });
  },
);
T1.displayName = "Form";
function b1(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Qm(e) {
  let t = m.exports.useContext(Wr);
  return Ce(t, b1(e)), t;
}
function $1(
  e,
  {
    target: t,
    replace: n,
    state: r,
    preventScrollReset: o,
    relative: l,
    viewTransition: a,
    unstable_defaultShouldRevalidate: i,
    unstable_useTransitions: u,
  } = {},
) {
  let c = Aa(),
    f = on(),
    d = Jo(e, { relative: l });
  return m.exports.useCallback(
    (h) => {
      if (s1(h, t)) {
        h.preventDefault();
        let y = n !== void 0 ? n : Fo(f) === Fo(d),
          E = () =>
            c(e, {
              replace: y,
              state: r,
              preventScrollReset: o,
              relative: l,
              viewTransition: a,
              unstable_defaultShouldRevalidate: i,
            });
        u ? m.exports.startTransition(() => E()) : E();
      }
    },
    [f, c, d, n, r, t, e, o, l, a, i, u],
  );
}
function Yu(e) {
  yt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.",
  );
  let t = m.exports.useRef(Si(e)),
    n = m.exports.useRef(!1),
    r = on(),
    o = m.exports.useMemo(
      () => i1(r.search, n.current ? null : t.current),
      [r.search],
    ),
    l = Aa(),
    a = m.exports.useCallback(
      (i, u) => {
        const c = Si(typeof i == "function" ? i(new URLSearchParams(o)) : i);
        (n.current = !0), l("?" + c, u);
      },
      [l, o],
    );
  return [o, a];
}
var L1 = 0,
  j1 = () => `__${String(++L1)}__`;
function D1() {
  let { router: e } = Qm("useSubmit"),
    { basename: t } = m.exports.useContext(wt),
    n = Xy(),
    r = e.fetch,
    o = e.navigate;
  return m.exports.useCallback(
    async (l, a = {}) => {
      let { action: i, method: u, encType: c, formData: f, body: d } = f1(l, t);
      if (a.navigate === !1) {
        let h = a.fetcherKey || j1();
        await r(h, n, a.action || i, {
          unstable_defaultShouldRevalidate: a.unstable_defaultShouldRevalidate,
          preventScrollReset: a.preventScrollReset,
          formData: f,
          body: d,
          formMethod: a.method || u,
          formEncType: a.encType || c,
          flushSync: a.flushSync,
        });
      } else
        await o(a.action || i, {
          unstable_defaultShouldRevalidate: a.unstable_defaultShouldRevalidate,
          preventScrollReset: a.preventScrollReset,
          formData: f,
          body: d,
          formMethod: a.method || u,
          formEncType: a.encType || c,
          replace: a.replace,
          state: a.state,
          fromRouteId: n,
          flushSync: a.flushSync,
          viewTransition: a.viewTransition,
        });
    },
    [r, o, t, n],
  );
}
function M1(e, { relative: t } = {}) {
  let { basename: n } = m.exports.useContext(wt),
    r = m.exports.useContext(rn);
  Ce(r, "useFormAction must be used inside a RouteContext");
  let [o] = r.matches.slice(-1),
    l = { ...Jo(e || ".", { relative: t }) },
    a = on();
  if (e == null) {
    l.search = a.search;
    let i = new URLSearchParams(l.search),
      u = i.getAll("index");
    if (u.some((f) => f === "")) {
      i.delete("index"),
        u.filter((d) => d).forEach((d) => i.append("index", d));
      let f = i.toString();
      l.search = f ? `?${f}` : "";
    }
  }
  return (
    (!e || e === ".") &&
      o.route.index &&
      (l.search = l.search ? l.search.replace(/^\?/, "?index&") : "?index"),
    n !== "/" && (l.pathname = l.pathname === "/" ? n : Gt([n, l.pathname])),
    Fo(l)
  );
}
function I1(e, { relative: t } = {}) {
  let n = m.exports.useContext(zm);
  Ce(
    n != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: r } = Qm("useViewTransitionState"),
    o = Jo(e, { relative: t });
  if (!n.isTransitioning) return !1;
  let l = Zt(n.currentLocation.pathname, r) || n.currentLocation.pathname,
    a = Zt(n.nextLocation.pathname, r) || n.nextLocation.pathname;
  return da(o.pathname, a) != null || da(o.pathname, l) != null;
}
var qm = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/ (function (e) {
  (function () {
    var t = {}.hasOwnProperty;
    function n() {
      for (var r = [], o = 0; o < arguments.length; o++) {
        var l = arguments[o];
        if (!!l) {
          var a = typeof l;
          if (a === "string" || a === "number") r.push(l);
          else if (Array.isArray(l)) {
            if (l.length) {
              var i = n.apply(null, l);
              i && r.push(i);
            }
          } else if (a === "object") {
            if (
              l.toString !== Object.prototype.toString &&
              !l.toString.toString().includes("[native code]")
            ) {
              r.push(l.toString());
              continue;
            }
            for (var u in l) t.call(l, u) && l[u] && r.push(u);
          }
        }
      }
      return r.join(" ");
    }
    e.exports ? ((n.default = n), (e.exports = n)) : (window.classNames = n);
  })();
})(qm);
const X = qm.exports;
var $ = { exports: {} },
  Ba = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var z1 = m.exports,
  A1 = Symbol.for("react.element"),
  F1 = Symbol.for("react.fragment"),
  B1 = Object.prototype.hasOwnProperty,
  W1 = z1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  U1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ym(e, t, n) {
  var r,
    o = {},
    l = null,
    a = null;
  n !== void 0 && (l = "" + n),
    t.key !== void 0 && (l = "" + t.key),
    t.ref !== void 0 && (a = t.ref);
  for (r in t) B1.call(t, r) && !U1.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: A1,
    type: e,
    key: l,
    ref: a,
    props: o,
    _owner: W1.current,
  };
}
Ba.Fragment = F1;
Ba.jsx = Ym;
Ba.jsxs = Ym;
(function (e) {
  e.exports = Ba;
})($);
const H1 = ["xxl", "xl", "lg", "md", "sm", "xs"],
  V1 = "xs",
  Wa = m.exports.createContext({
    prefixes: {},
    breakpoints: H1,
    minBreakpoint: V1,
  });
function ee(e, t) {
  const { prefixes: n } = m.exports.useContext(Wa);
  return e || n[t] || t;
}
function Xm() {
  const { breakpoints: e } = m.exports.useContext(Wa);
  return e;
}
function Jm() {
  const { minBreakpoint: e } = m.exports.useContext(Wa);
  return e;
}
function Xu() {
  const { dir: e } = m.exports.useContext(Wa);
  return e === "rtl";
}
const K1 = { fluid: !1 },
  Ju = m.exports.forwardRef(
    ({ bsPrefix: e, fluid: t, as: n = "div", className: r, ...o }, l) => {
      const a = ee(e, "container"),
        i = typeof t == "string" ? `-${t}` : "-fluid";
      return $.exports.jsx(n, {
        ref: l,
        ...o,
        className: X(r, t ? `${a}${i}` : a),
      });
    },
  );
Ju.displayName = "Container";
Ju.defaultProps = K1;
const $t = m.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = ee(e, "row"),
      a = Xm(),
      i = Jm(),
      u = `${l}-cols`,
      c = [];
    return (
      a.forEach((f) => {
        const d = r[f];
        delete r[f];
        let h;
        d != null && typeof d == "object" ? ({ cols: h } = d) : (h = d);
        const y = f !== i ? `-${f}` : "";
        h != null && c.push(`${u}${y}-${h}`);
      }),
      $.exports.jsx(n, { ref: o, ...r, className: X(t, l, ...c) })
    );
  },
);
$t.displayName = "Row";
function G1({ as: e, bsPrefix: t, className: n, ...r }) {
  t = ee(t, "col");
  const o = Xm(),
    l = Jm(),
    a = [],
    i = [];
  return (
    o.forEach((u) => {
      const c = r[u];
      delete r[u];
      let f, d, h;
      typeof c == "object" && c != null
        ? ({ span: f, offset: d, order: h } = c)
        : (f = c);
      const y = u !== l ? `-${u}` : "";
      f && a.push(f === !0 ? `${t}${y}` : `${t}${y}-${f}`),
        h != null && i.push(`order${y}-${h}`),
        d != null && i.push(`offset${y}-${d}`);
    }),
    [
      { ...r, className: X(n, ...a, ...i) },
      { as: e, bsPrefix: t, spans: a },
    ]
  );
}
const Ue = m.exports.forwardRef((e, t) => {
  const [{ className: n, ...r }, { as: o = "div", bsPrefix: l, spans: a }] =
    G1(e);
  return $.exports.jsx(o, { ...r, ref: t, className: X(n, !a.length && l) });
});
Ue.displayName = "Col";
function Ur(e) {
  return (e && e.ownerDocument) || document;
}
function Q1(e) {
  var t = Ur(e);
  return (t && t.defaultView) || window;
}
function q1(e, t) {
  return Q1(e).getComputedStyle(e, t);
}
var Y1 = /([A-Z])/g;
function X1(e) {
  return e.replace(Y1, "-$1").toLowerCase();
}
var J1 = /^ms-/;
function Sl(e) {
  return X1(e).replace(J1, "-ms-");
}
var Z1 =
  /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function ex(e) {
  return !!(e && Z1.test(e));
}
function Qt(e, t) {
  var n = "",
    r = "";
  if (typeof t == "string")
    return e.style.getPropertyValue(Sl(t)) || q1(e).getPropertyValue(Sl(t));
  Object.keys(t).forEach(function (o) {
    var l = t[o];
    !l && l !== 0
      ? e.style.removeProperty(Sl(o))
      : ex(o)
        ? (r += o + "(" + l + ") ")
        : (n += Sl(o) + ": " + l + ";");
  }),
    r && (n += "transform: " + r + ";"),
    (e.style.cssText += ";" + n);
}
function Zm(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function ki(e, t) {
  return (
    (ki = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, o) {
          return (r.__proto__ = o), r;
        }),
    ki(e, t)
  );
}
function tx(e, t) {
  (e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    ki(e, t);
}
var R = { exports: {} },
  nx = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  rx = nx,
  ox = rx;
function eh() {}
function th() {}
th.resetWarningCache = eh;
var lx = function () {
  function e(r, o, l, a, i, u) {
    if (u !== ox) {
      var c = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
      );
      throw ((c.name = "Invariant Violation"), c);
    }
  }
  e.isRequired = e;
  function t() {
    return e;
  }
  var n = {
    array: e,
    bigint: e,
    bool: e,
    func: e,
    number: e,
    object: e,
    string: e,
    symbol: e,
    any: e,
    arrayOf: t,
    element: e,
    elementType: e,
    instanceOf: t,
    node: e,
    objectOf: t,
    oneOf: t,
    oneOfType: t,
    shape: t,
    exact: t,
    checkPropTypes: th,
    resetWarningCache: eh,
  };
  return (n.PropTypes = n), n;
};
R.exports = lx();
const Yf = { disabled: !1 },
  nh = s.createContext(null);
var ax = function (t) {
    return t.scrollTop;
  },
  io = "unmounted",
  pn = "exited",
  Lt = "entering",
  vn = "entered",
  Bo = "exiting",
  ln = (function (e) {
    tx(t, e);
    function t(r, o) {
      var l;
      l = e.call(this, r, o) || this;
      var a = o,
        i = a && !a.isMounting ? r.enter : r.appear,
        u;
      return (
        (l.appearStatus = null),
        r.in
          ? i
            ? ((u = pn), (l.appearStatus = Lt))
            : (u = vn)
          : r.unmountOnExit || r.mountOnEnter
            ? (u = io)
            : (u = pn),
        (l.state = { status: u }),
        (l.nextCallback = null),
        l
      );
    }
    t.getDerivedStateFromProps = function (o, l) {
      var a = o.in;
      return a && l.status === io ? { status: pn } : null;
    };
    var n = t.prototype;
    return (
      (n.componentDidMount = function () {
        this.updateStatus(!0, this.appearStatus);
      }),
      (n.componentDidUpdate = function (o) {
        var l = null;
        if (o !== this.props) {
          var a = this.state.status;
          this.props.in
            ? a !== Lt && a !== vn && (l = Lt)
            : (a === Lt || a === vn) && (l = Bo);
        }
        this.updateStatus(!1, l);
      }),
      (n.componentWillUnmount = function () {
        this.cancelNextCallback();
      }),
      (n.getTimeouts = function () {
        var o = this.props.timeout,
          l,
          a,
          i;
        return (
          (l = a = i = o),
          o != null &&
            typeof o != "number" &&
            ((l = o.exit),
            (a = o.enter),
            (i = o.appear !== void 0 ? o.appear : a)),
          { exit: l, enter: a, appear: i }
        );
      }),
      (n.updateStatus = function (o, l) {
        if ((o === void 0 && (o = !1), l !== null))
          if ((this.cancelNextCallback(), l === Lt)) {
            if (this.props.unmountOnExit || this.props.mountOnEnter) {
              var a = this.props.nodeRef
                ? this.props.nodeRef.current
                : Un.findDOMNode(this);
              a && ax(a);
            }
            this.performEnter(o);
          } else this.performExit();
        else
          this.props.unmountOnExit &&
            this.state.status === pn &&
            this.setState({ status: io });
      }),
      (n.performEnter = function (o) {
        var l = this,
          a = this.props.enter,
          i = this.context ? this.context.isMounting : o,
          u = this.props.nodeRef ? [i] : [Un.findDOMNode(this), i],
          c = u[0],
          f = u[1],
          d = this.getTimeouts(),
          h = i ? d.appear : d.enter;
        if ((!o && !a) || Yf.disabled) {
          this.safeSetState({ status: vn }, function () {
            l.props.onEntered(c);
          });
          return;
        }
        this.props.onEnter(c, f),
          this.safeSetState({ status: Lt }, function () {
            l.props.onEntering(c, f),
              l.onTransitionEnd(h, function () {
                l.safeSetState({ status: vn }, function () {
                  l.props.onEntered(c, f);
                });
              });
          });
      }),
      (n.performExit = function () {
        var o = this,
          l = this.props.exit,
          a = this.getTimeouts(),
          i = this.props.nodeRef ? void 0 : Un.findDOMNode(this);
        if (!l || Yf.disabled) {
          this.safeSetState({ status: pn }, function () {
            o.props.onExited(i);
          });
          return;
        }
        this.props.onExit(i),
          this.safeSetState({ status: Bo }, function () {
            o.props.onExiting(i),
              o.onTransitionEnd(a.exit, function () {
                o.safeSetState({ status: pn }, function () {
                  o.props.onExited(i);
                });
              });
          });
      }),
      (n.cancelNextCallback = function () {
        this.nextCallback !== null &&
          (this.nextCallback.cancel(), (this.nextCallback = null));
      }),
      (n.safeSetState = function (o, l) {
        (l = this.setNextCallback(l)), this.setState(o, l);
      }),
      (n.setNextCallback = function (o) {
        var l = this,
          a = !0;
        return (
          (this.nextCallback = function (i) {
            a && ((a = !1), (l.nextCallback = null), o(i));
          }),
          (this.nextCallback.cancel = function () {
            a = !1;
          }),
          this.nextCallback
        );
      }),
      (n.onTransitionEnd = function (o, l) {
        this.setNextCallback(l);
        var a = this.props.nodeRef
            ? this.props.nodeRef.current
            : Un.findDOMNode(this),
          i = o == null && !this.props.addEndListener;
        if (!a || i) {
          setTimeout(this.nextCallback, 0);
          return;
        }
        if (this.props.addEndListener) {
          var u = this.props.nodeRef
              ? [this.nextCallback]
              : [a, this.nextCallback],
            c = u[0],
            f = u[1];
          this.props.addEndListener(c, f);
        }
        o != null && setTimeout(this.nextCallback, o);
      }),
      (n.render = function () {
        var o = this.state.status;
        if (o === io) return null;
        var l = this.props,
          a = l.children;
        l.in,
          l.mountOnEnter,
          l.unmountOnExit,
          l.appear,
          l.enter,
          l.exit,
          l.timeout,
          l.addEndListener,
          l.onEnter,
          l.onEntering,
          l.onEntered,
          l.onExit,
          l.onExiting,
          l.onExited,
          l.nodeRef;
        var i = Zm(l, [
          "children",
          "in",
          "mountOnEnter",
          "unmountOnExit",
          "appear",
          "enter",
          "exit",
          "timeout",
          "addEndListener",
          "onEnter",
          "onEntering",
          "onEntered",
          "onExit",
          "onExiting",
          "onExited",
          "nodeRef",
        ]);
        return s.createElement(
          nh.Provider,
          { value: null },
          typeof a == "function"
            ? a(o, i)
            : s.cloneElement(s.Children.only(a), i),
        );
      }),
      t
    );
  })(s.Component);
ln.contextType = nh;
ln.propTypes = {};
function nr() {}
ln.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: nr,
  onEntering: nr,
  onEntered: nr,
  onExit: nr,
  onExiting: nr,
  onExited: nr,
};
ln.UNMOUNTED = io;
ln.EXITED = pn;
ln.ENTERING = Lt;
ln.ENTERED = vn;
ln.EXITING = Bo;
const Hr = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
var Ci = !1,
  Ni = !1;
try {
  var ks = {
    get passive() {
      return (Ci = !0);
    },
    get once() {
      return (Ni = Ci = !0);
    },
  };
  Hr &&
    (window.addEventListener("test", ks, ks),
    window.removeEventListener("test", ks, !0));
} catch {}
function rh(e, t, n, r) {
  if (r && typeof r != "boolean" && !Ni) {
    var o = r.once,
      l = r.capture,
      a = n;
    !Ni &&
      o &&
      ((a =
        n.__once ||
        function i(u) {
          this.removeEventListener(t, i, l), n.call(this, u);
        }),
      (n.__once = a)),
      e.addEventListener(t, a, Ci ? r : l);
  }
  e.addEventListener(t, n, r);
}
function Ri(e, t, n, r) {
  var o = r && typeof r != "boolean" ? r.capture : r;
  e.removeEventListener(t, n, o),
    n.__once && e.removeEventListener(t, n.__once, o);
}
function Vt(e, t, n, r) {
  return (
    rh(e, t, n, r),
    function () {
      Ri(e, t, n, r);
    }
  );
}
function sx(e, t, n, r) {
  if ((n === void 0 && (n = !1), r === void 0 && (r = !0), e)) {
    var o = document.createEvent("HTMLEvents");
    o.initEvent(t, n, r), e.dispatchEvent(o);
  }
}
function ix(e) {
  var t = Qt(e, "transitionDuration") || "",
    n = t.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(t) * n;
}
function ux(e, t, n) {
  n === void 0 && (n = 5);
  var r = !1,
    o = setTimeout(function () {
      r || sx(e, "transitionend", !0);
    }, t + n),
    l = Vt(
      e,
      "transitionend",
      function () {
        r = !0;
      },
      { once: !0 },
    );
  return function () {
    clearTimeout(o), l();
  };
}
function oh(e, t, n, r) {
  n == null && (n = ix(e) || 0);
  var o = ux(e, n, r),
    l = Vt(e, "transitionend", t);
  return function () {
    o(), l();
  };
}
function Xf(e, t) {
  const n = Qt(e, t) || "",
    r = n.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(n) * r;
}
function lh(e, t) {
  const n = Xf(e, "transitionDuration"),
    r = Xf(e, "transitionDelay"),
    o = oh(
      e,
      (l) => {
        l.target === e && (o(), t(l));
      },
      n + r,
    );
}
function no(...e) {
  return e
    .filter((t) => t != null)
    .reduce((t, n) => {
      if (typeof n != "function")
        throw new Error(
          "Invalid Argument Type, must only provide functions, undefined, or null.",
        );
      return t === null
        ? n
        : function (...o) {
            t.apply(this, o), n.apply(this, o);
          };
    }, null);
}
function ah(e) {
  e.offsetHeight;
}
var Jf = function (t) {
  return !t || typeof t == "function"
    ? t
    : function (n) {
        t.current = n;
      };
};
function cx(e, t) {
  var n = Jf(e),
    r = Jf(t);
  return function (o) {
    n && n(o), r && r(o);
  };
}
function Zo(e, t) {
  return m.exports.useMemo(
    function () {
      return cx(e, t);
    },
    [e, t],
  );
}
function pa(e) {
  return e && "setState" in e ? Un.findDOMNode(e) : e != null ? e : null;
}
const sh = s.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        onExited: l,
        addEndListener: a,
        children: i,
        childRef: u,
        ...c
      },
      f,
    ) => {
      const d = m.exports.useRef(null),
        h = Zo(d, u),
        y = (S) => {
          h(pa(S));
        },
        E = (S) => (N) => {
          S && d.current && S(d.current, N);
        },
        x = m.exports.useCallback(E(e), [e]),
        k = m.exports.useCallback(E(t), [t]),
        v = m.exports.useCallback(E(n), [n]),
        p = m.exports.useCallback(E(r), [r]),
        g = m.exports.useCallback(E(o), [o]),
        w = m.exports.useCallback(E(l), [l]),
        C = m.exports.useCallback(E(a), [a]);
      return $.exports.jsx(ln, {
        ref: f,
        ...c,
        onEnter: x,
        onEntered: v,
        onEntering: k,
        onExit: p,
        onExited: w,
        onExiting: g,
        addEndListener: C,
        nodeRef: d,
        children:
          typeof i == "function"
            ? (S, N) => i(S, { ...N, ref: y })
            : s.cloneElement(i, { ref: y }),
      });
    },
  ),
  fx = {
    height: ["marginTop", "marginBottom"],
    width: ["marginLeft", "marginRight"],
  };
function ih(e, t) {
  const n = `offset${e[0].toUpperCase()}${e.slice(1)}`,
    r = t[n],
    o = fx[e];
  return r + parseInt(Qt(t, o[0]), 10) + parseInt(Qt(t, o[1]), 10);
}
const dx = {
    [pn]: "collapse",
    [Bo]: "collapsing",
    [Lt]: "collapsing",
    [vn]: "collapse show",
  },
  px = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
    getDimensionValue: ih,
  },
  Zu = s.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        className: l,
        children: a,
        dimension: i = "height",
        getDimensionValue: u = ih,
        ...c
      },
      f,
    ) => {
      const d = typeof i == "function" ? i() : i,
        h = m.exports.useMemo(
          () =>
            no((v) => {
              v.style[d] = "0";
            }, e),
          [d, e],
        ),
        y = m.exports.useMemo(
          () =>
            no((v) => {
              const p = `scroll${d[0].toUpperCase()}${d.slice(1)}`;
              v.style[d] = `${v[p]}px`;
            }, t),
          [d, t],
        ),
        E = m.exports.useMemo(
          () =>
            no((v) => {
              v.style[d] = null;
            }, n),
          [d, n],
        ),
        x = m.exports.useMemo(
          () =>
            no((v) => {
              (v.style[d] = `${u(d, v)}px`), ah(v);
            }, r),
          [r, u, d],
        ),
        k = m.exports.useMemo(
          () =>
            no((v) => {
              v.style[d] = null;
            }, o),
          [d, o],
        );
      return $.exports.jsx(sh, {
        ref: f,
        addEndListener: lh,
        ...c,
        "aria-expanded": c.role ? c.in : null,
        onEnter: h,
        onEntering: y,
        onEntered: E,
        onExit: x,
        onExiting: k,
        childRef: a.ref,
        children: (v, p) =>
          s.cloneElement(a, {
            ...p,
            className: X(
              l,
              a.props.className,
              dx[v],
              d === "width" && "collapse-horizontal",
            ),
          }),
      });
    },
  );
Zu.defaultProps = px;
var mx = ["color", "size", "title", "className"];
function Oi() {
  return (
    (Oi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Oi.apply(null, arguments)
  );
}
function hx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = vx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function vx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var uh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = hx(e, mx);
  return s.createElement(
    "svg",
    Oi(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-arrow-clockwise", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z",
    }),
    s.createElement("path", {
      d: "M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466",
    }),
  );
});
uh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const ch = uh;
var gx = ["color", "size", "title", "className"];
function _i() {
  return (
    (_i = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    _i.apply(null, arguments)
  );
}
function yx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = xx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function xx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var fh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = yx(e, gx);
  return s.createElement(
    "svg",
    _i(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-chevron-down", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708",
    }),
  );
});
fh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Ex = fh;
var wx = ["color", "size", "title", "className"];
function Pi() {
  return (
    (Pi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Pi.apply(null, arguments)
  );
}
function Sx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = kx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function kx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var dh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Sx(e, wx);
  return s.createElement(
    "svg",
    Pi(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-chevron-right", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708",
    }),
  );
});
dh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const ec = dh;
var Cx = ["color", "size", "title", "className"];
function Ti() {
  return (
    (Ti = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ti.apply(null, arguments)
  );
}
function Nx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Rx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function Rx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var ph = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Nx(e, Cx);
  return s.createElement(
    "svg",
    Ti(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-database", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525",
    }),
  );
});
ph.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Ox = ph;
var _x = ["color", "size", "title", "className"];
function bi() {
  return (
    (bi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    bi.apply(null, arguments)
  );
}
function Px(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Tx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function Tx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var mh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Px(e, _x);
  return s.createElement(
    "svg",
    bi(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-file-earmark-code", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z",
    }),
    s.createElement("path", {
      d: "M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708m-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708",
    }),
  );
});
mh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const bx = mh;
var $x = ["color", "size", "title", "className"];
function $i() {
  return (
    ($i = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    $i.apply(null, arguments)
  );
}
function Lx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = jx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function jx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var hh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Lx(e, $x);
  return s.createElement(
    "svg",
    $i(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-folder", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z",
    }),
  );
});
hh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Dx = hh;
var Mx = ["color", "size", "title", "className"];
function Li() {
  return (
    (Li = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Li.apply(null, arguments)
  );
}
function Ix(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = zx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function zx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var vh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Ix(e, Mx);
  return s.createElement(
    "svg",
    Li(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-graph-up", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07",
    }),
  );
});
vh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const gh = vh;
var Ax = ["color", "size", "title", "className"];
function ji() {
  return (
    (ji = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    ji.apply(null, arguments)
  );
}
function Fx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Bx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function Bx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var yh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Fx(e, Ax);
  return s.createElement(
    "svg",
    ji(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-journal-text", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5",
    }),
    s.createElement("path", {
      d: "M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2",
    }),
    s.createElement("path", {
      d: "M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z",
    }),
  );
});
yh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Wx = yh;
var Ux = ["color", "size", "title", "className"];
function Di() {
  return (
    (Di = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Di.apply(null, arguments)
  );
}
function Hx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Vx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function Vx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var xh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Hx(e, Ux);
  return s.createElement(
    "svg",
    Di(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-list-ul", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
    }),
  );
});
xh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Kx = xh;
var Gx = ["color", "size", "title", "className"];
function Mi() {
  return (
    (Mi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Mi.apply(null, arguments)
  );
}
function Qx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = qx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function qx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var Eh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Qx(e, Gx);
  return s.createElement(
    "svg",
    Mi(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-play-fill", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393",
    }),
  );
});
Eh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Yx = Eh;
var Xx = ["color", "size", "title", "className"];
function Ii() {
  return (
    (Ii = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ii.apply(null, arguments)
  );
}
function Jx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Zx(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function Zx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var wh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Jx(e, Xx);
  return s.createElement(
    "svg",
    Ii(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-search", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0",
    }),
  );
});
wh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Sh = wh;
var eE = ["color", "size", "title", "className"];
function zi() {
  return (
    (zi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    zi.apply(null, arguments)
  );
}
function tE(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = nE(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function nE(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var kh = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = tE(e, eE);
  return s.createElement(
    "svg",
    zi(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-sliders", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      fillRule: "evenodd",
      d: "M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z",
    }),
  );
});
kh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const rE = kh;
var oE = ["color", "size", "title", "className"];
function Ai() {
  return (
    (Ai = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ai.apply(null, arguments)
  );
}
function lE(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = aE(e, t);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    for (r = 0; r < l.length; r++)
      (n = l[r]),
        t.indexOf(n) === -1 &&
          {}.propertyIsEnumerable.call(e, n) &&
          (o[n] = e[n]);
  }
  return o;
}
function aE(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var Ch = m.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = lE(e, oE);
  return s.createElement(
    "svg",
    Ai(
      {
        ref: t,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        width: l,
        height: l,
        fill: r,
        className: ["bi", "bi-x", c].filter(Boolean).join(" "),
      },
      f,
    ),
    i ? s.createElement("title", null, i) : null,
    s.createElement("path", {
      d: "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708",
    }),
  );
});
Ch.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Nh = Ch,
  sE = {
    Running: "Live queue",
    Datasets: "Storage",
    Plots: "Live data",
    "Schedule new": "Browse",
    "Configure Submission": "Submit",
  };
function rr({
  title: e,
  children: t,
  defaultExpanded: n = !0,
  className: r = "",
  eyebrow: o,
}) {
  const [l, a] = m.exports.useState(n),
    [i, u] = m.exports.useState(!1);
  m.exports.useEffect(() => {
    const h = () => {
      u(window.innerWidth < 768);
    };
    return (
      h(),
      window.addEventListener("resize", h),
      () => window.removeEventListener("resize", h)
    );
  }, []);
  const c = i ? !0 : l,
    f = !i,
    d = o || sE[e] || "Section";
  return s.createElement(
    "div",
    { className: `collapsible-section ${r}` },
    s.createElement(
      "div",
      {
        className: `section-header ${f ? "is-clickable" : ""}`,
        onClick: f ? () => a(!l) : void 0,
      },
      f &&
        s.createElement(
          "span",
          {
            className: `section-toggle ${l ? "is-open" : ""}`,
            "aria-hidden": "true",
          },
          s.createElement(ec, { size: 14 }),
        ),
      s.createElement(
        "div",
        { className: "section-header__text" },
        s.createElement("span", { className: "section-header__eyebrow" }, d),
        s.createElement("h2", null, e),
      ),
    ),
    s.createElement(Zu, { in: c }, s.createElement("div", null, t)),
  );
}
function Fi() {
  return (
    (Fi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Fi.apply(this, arguments)
  );
}
function Zf(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function iE(e) {
  var t = uE(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function uE(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Rh(e, t, n) {
  var r = m.exports.useRef(e !== void 0),
    o = m.exports.useState(t),
    l = o[0],
    a = o[1],
    i = e !== void 0,
    u = r.current;
  return (
    (r.current = i),
    !i && u && l !== t && a(t),
    [
      i ? e : l,
      m.exports.useCallback(
        function (c) {
          for (
            var f = arguments.length, d = new Array(f > 1 ? f - 1 : 0), h = 1;
            h < f;
            h++
          )
            d[h - 1] = arguments[h];
          n && n.apply(void 0, [c].concat(d)), a(c);
        },
        [n],
      ),
    ]
  );
}
function Oh(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      l = n,
      a = l[Zf(r)],
      i = l[r],
      u = Zm(l, [Zf(r), r].map(iE)),
      c = t[r],
      f = Rh(i, a, e[c]),
      d = f[0],
      h = f[1];
    return Fi({}, u, ((o = {}), (o[r] = d), (o[c] = h), o));
  }, e);
}
function _h(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
const el = m.exports.createContext({});
el.displayName = "AccordionContext";
const tc = m.exports.forwardRef(
  (
    {
      as: e = "div",
      bsPrefix: t,
      className: n,
      children: r,
      eventKey: o,
      ...l
    },
    a,
  ) => {
    const { activeEventKey: i } = m.exports.useContext(el);
    return (
      (t = ee(t, "accordion-collapse")),
      $.exports.jsx(Zu, {
        ref: a,
        in: _h(i, o),
        ...l,
        className: X(n, t),
        children: $.exports.jsx(e, { children: m.exports.Children.only(r) }),
      })
    );
  },
);
tc.displayName = "AccordionCollapse";
const Ua = m.exports.createContext({ eventKey: "" });
Ua.displayName = "AccordionItemContext";
const Ph = m.exports.forwardRef(
  (
    {
      as: e = "div",
      bsPrefix: t,
      className: n,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: a,
      onExiting: i,
      onExited: u,
      ...c
    },
    f,
  ) => {
    t = ee(t, "accordion-body");
    const { eventKey: d } = m.exports.useContext(Ua);
    return $.exports.jsx(tc, {
      eventKey: d,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: a,
      onExiting: i,
      onExited: u,
      children: $.exports.jsx(e, { ref: f, ...c, className: X(n, t) }),
    });
  },
);
Ph.displayName = "AccordionBody";
function cE(e, t) {
  const {
    activeEventKey: n,
    onSelect: r,
    alwaysOpen: o,
  } = m.exports.useContext(el);
  return (l) => {
    let a = e === n ? null : e;
    o &&
      (Array.isArray(n)
        ? n.includes(e)
          ? (a = n.filter((i) => i !== e))
          : (a = [...n, e])
        : (a = [e])),
      r == null || r(a, l),
      t == null || t(l);
  };
}
const nc = m.exports.forwardRef(
  ({ as: e = "button", bsPrefix: t, className: n, onClick: r, ...o }, l) => {
    t = ee(t, "accordion-button");
    const { eventKey: a } = m.exports.useContext(Ua),
      i = cE(a, r),
      { activeEventKey: u } = m.exports.useContext(el);
    return (
      e === "button" && (o.type = "button"),
      $.exports.jsx(e, {
        ref: l,
        onClick: i,
        ...o,
        "aria-expanded": a === u,
        className: X(n, t, !_h(u, a) && "collapsed"),
      })
    );
  },
);
nc.displayName = "AccordionButton";
const Th = m.exports.forwardRef(
  (
    { as: e = "h2", bsPrefix: t, className: n, children: r, onClick: o, ...l },
    a,
  ) => (
    (t = ee(t, "accordion-header")),
    $.exports.jsx(e, {
      ref: a,
      ...l,
      className: X(n, t),
      children: $.exports.jsx(nc, { onClick: o, children: r }),
    })
  ),
);
Th.displayName = "AccordionHeader";
const bh = m.exports.forwardRef(
  ({ as: e = "div", bsPrefix: t, className: n, eventKey: r, ...o }, l) => {
    t = ee(t, "accordion-item");
    const a = m.exports.useMemo(() => ({ eventKey: r }), [r]);
    return $.exports.jsx(Ua.Provider, {
      value: a,
      children: $.exports.jsx(e, { ref: l, ...o, className: X(n, t) }),
    });
  },
);
bh.displayName = "AccordionItem";
const $h = m.exports.forwardRef((e, t) => {
  const {
      as: n = "div",
      activeKey: r,
      bsPrefix: o,
      className: l,
      onSelect: a,
      flush: i,
      alwaysOpen: u,
      ...c
    } = Oh(e, { activeKey: "onSelect" }),
    f = ee(o, "accordion"),
    d = m.exports.useMemo(
      () => ({ activeEventKey: r, onSelect: a, alwaysOpen: u }),
      [r, a, u],
    );
  return $.exports.jsx(el.Provider, {
    value: d,
    children: $.exports.jsx(n, {
      ref: t,
      ...c,
      className: X(l, f, i && `${f}-flush`),
    }),
  });
});
$h.displayName = "Accordion";
const ct = Object.assign($h, {
    Button: nc,
    Collapse: tc,
    Item: bh,
    Header: Th,
    Body: Ph,
  }),
  fE = { vertical: !1, role: "group" },
  rc = m.exports.forwardRef(
    (
      { bsPrefix: e, size: t, vertical: n, className: r, as: o = "div", ...l },
      a,
    ) => {
      const i = ee(e, "btn-group");
      let u = i;
      return (
        n && (u = `${i}-vertical`),
        $.exports.jsx(o, { ...l, ref: a, className: X(r, u, t && `${i}-${t}`) })
      );
    },
  );
rc.displayName = "ButtonGroup";
rc.defaultProps = fE;
const ma = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        striped: n,
        bordered: r,
        borderless: o,
        hover: l,
        size: a,
        variant: i,
        responsive: u,
        ...c
      },
      f,
    ) => {
      const d = ee(e, "table"),
        h = X(
          t,
          d,
          i && `${d}-${i}`,
          a && `${d}-${a}`,
          n && `${d}-${typeof n == "string" ? `striped-${n}` : "striped"}`,
          r && `${d}-bordered`,
          o && `${d}-borderless`,
          l && `${d}-hover`,
        ),
        y = $.exports.jsx("table", { ...c, className: h, ref: f });
      if (u) {
        let E = `${d}-responsive`;
        return (
          typeof u == "string" && (E = `${E}-${u}`),
          $.exports.jsx("div", { className: E, children: y })
        );
      }
      return y;
    },
  ),
  dE = ["as", "disabled"];
function pE(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function mE(e) {
  return !e || e.trim() === "#";
}
function oc({
  tagName: e,
  disabled: t,
  href: n,
  target: r,
  rel: o,
  role: l,
  onClick: a,
  tabIndex: i = 0,
  type: u,
}) {
  e || (n != null || r != null || o != null ? (e = "a") : (e = "button"));
  const c = { tagName: e };
  if (e === "button") return [{ type: u || "button", disabled: t }, c];
  const f = (h) => {
      if (((t || (e === "a" && mE(n))) && h.preventDefault(), t)) {
        h.stopPropagation();
        return;
      }
      a == null || a(h);
    },
    d = (h) => {
      h.key === " " && (h.preventDefault(), f(h));
    };
  return (
    e === "a" && (n || (n = "#"), t && (n = void 0)),
    [
      {
        role: l != null ? l : "button",
        disabled: void 0,
        tabIndex: t ? void 0 : i,
        href: n,
        target: e === "a" ? r : void 0,
        "aria-disabled": t || void 0,
        rel: e === "a" ? o : void 0,
        onClick: f,
        onKeyDown: d,
      },
      c,
    ]
  );
}
const hE = m.exports.forwardRef((e, t) => {
  let { as: n, disabled: r } = e,
    o = pE(e, dE);
  const [l, { tagName: a }] = oc(Object.assign({ tagName: n, disabled: r }, o));
  return $.exports.jsx(a, Object.assign({}, o, l, { ref: t }));
});
hE.displayName = "Button";
const vE = { variant: "primary", active: !1, disabled: !1 },
  ot = m.exports.forwardRef(
    (
      {
        as: e,
        bsPrefix: t,
        variant: n,
        size: r,
        active: o,
        className: l,
        ...a
      },
      i,
    ) => {
      const u = ee(t, "btn"),
        [c, { tagName: f }] = oc({ tagName: e, ...a }),
        d = f;
      return $.exports.jsx(d, {
        ...c,
        ...a,
        ref: i,
        className: X(
          l,
          u,
          o && "active",
          n && `${u}-${n}`,
          r && `${u}-${r}`,
          a.href && a.disabled && "disabled",
        ),
      });
    },
  );
ot.displayName = "Button";
ot.defaultProps = vE;
const gE = window.location.origin;
function yE(e, t = {}) {
  const n = new URL(e, gE);
  return Object.keys(t).forEach((r) => n.searchParams.append(r, t[r])), n;
}
async function an(e, t = {}) {
  const { params: n, ...r } = t,
    o = yE(e, n),
    l = await fetch(o, r);
  if (!l.ok) throw new Error(`API error: ${l.status} ${l.statusText}`);
  return l.json();
}
function Lh(e, t = !1) {
  return an("api/cancel", {
    method: "POST",
    params: { rid: e, force: t },
  }).catch((n) => {
    throw (console.error("Cancel RID error:", n.message), n);
  });
}
function xE(e, t, n, r = {}, o = "main") {
  const l = {
    log_level: 30,
    file: e,
    class_name: t,
    arguments: r,
    repo_rev: n,
  };
  return an("api/schedule", {
    method: "POST",
    params: { pipeline: o },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(l),
  });
}
function EE() {
  return an("api/schedule");
}
function wE() {
  return an("api/explist");
}
function SE(e, t) {
  const n = e
    .split("/")
    .map((r) => encodeURIComponent(r))
    .join("/");
  return an(`api/explist/${n}/${encodeURIComponent(t)}/arginfo`);
}
function jh() {
  return an("api/datasets/names");
}
function xo(e) {
  const t = Array.isArray(e) ? e.join(",") : e;
  return an("api/datasets/values", { params: { names: t } });
}
function kE() {
  return an("api/health");
}
function CE() {
  return an("api/logs");
}
function NE(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        Lh(e.rid)
          .then(() => {
            console.log(`RID ${e.rid} termination requested`), n(!1);
          })
          .catch((o) => {
            console.error(`Error cancelling RID ${e.rid}:`, o.message), n(!1);
          });
    };
  return s.createElement(
    ot,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    "Request Termination",
  );
}
function RE(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        Lh(e.rid, !0)
          .then(() => {
            console.log(`RID ${e.rid} force cancelled`), n(!1);
          })
          .catch((o) => {
            console.error(`Error force cancelling RID ${e.rid}:`, o.message),
              n(!1);
          });
    };
  return s.createElement(
    ot,
    { variant: "danger", disabled: t, onClick: t ? null : r },
    "Force cancellation",
  );
}
const OE = {
  running: "is-running",
  preparing: "is-preparing",
  pending: "is-pending",
  pause_requested: "is-preparing",
  flushing: "is-preparing",
  deleting: "is-error",
  run_done: "is-pending",
  analyzing: "is-running",
};
function _E(e) {
  return (e && OE[e]) || "is-pending";
}
function PE({ status: e }) {
  return s.createElement(
    "span",
    { className: `status-pill ${_E(e)}`, "aria-label": `Status: ${e}` },
    e,
  );
}
function TE({ rid: e, className: t, file: n, status: r }) {
  return s.createElement(
    "div",
    { className: "schedule-item-head" },
    s.createElement(
      "div",
      { className: "schedule-item-head__top" },
      s.createElement(
        "span",
        { className: "schedule-item-head__rid" },
        s.createElement(
          "span",
          { className: "schedule-item-head__rid-label" },
          "RID",
        ),
        s.createElement(
          "span",
          { className: "schedule-item-head__rid-value" },
          e,
        ),
      ),
      s.createElement(PE, { status: r }),
    ),
    s.createElement("div", { className: "schedule-item-head__class" }, t),
    s.createElement("div", { className: "schedule-item-head__file" }, n),
  );
}
function bE(e) {
  const t = e.rid,
    n = e.data.expid.class_name,
    r = e.data.expid.file,
    o = e.data.pipeline,
    l = e.data.status,
    a = e.data.expid.repo_rev,
    i = e.data.expid.arguments,
    u = (c, f) =>
      s.createElement(
        "tr",
        { key: c },
        s.createElement("td", null, c),
        s.createElement("td", null, f),
      );
  return s.createElement(
    ct.Item,
    { eventKey: t },
    s.createElement(
      ct.Header,
      null,
      s.createElement(TE, { rid: t, className: n, file: r, status: l }),
    ),
    s.createElement(
      ct.Body,
      null,
      s.createElement(
        ma,
        { className: "schedule-detail-table" },
        s.createElement(
          "tbody",
          null,
          u("RID", t),
          u("Class", n),
          u("File", r),
          u("Repo rev", a),
          u("Pipeline", o),
          u("Status", l),
        ),
      ),
      s.createElement(
        ct,
        null,
        s.createElement(
          ct.Item,
          { eventKey: "args" },
          s.createElement(
            ct.Header,
            null,
            s.createElement(
              "span",
              { className: "schedule-item-head__class" },
              "Arguments",
            ),
          ),
          s.createElement(
            ct.Body,
            null,
            s.createElement(
              ma,
              { className: "schedule-detail-table" },
              s.createElement(
                "tbody",
                null,
                Object.keys(i).map((c) => u(c, String(i[c]))),
              ),
            ),
          ),
        ),
      ),
      s.createElement(
        rc,
        { className: "mt-3" },
        s.createElement(NE, { rid: t }),
        s.createElement(RE, { rid: t }),
      ),
    ),
  );
}
const $E = 1e3;
function LE() {
  const [e, t] = s.useState({});
  return (
    s.useEffect(() => {
      const n = () => {
        EE()
          .then(t)
          .catch((o) => console.error("Schedule update error:", o.message));
      };
      n();
      const r = setInterval(n, $E);
      return () => {
        clearInterval(r);
      };
    }, []),
    Object.keys(e).length === 0
      ? s.createElement(
          "div",
          { className: "empty-state" },
          s.createElement(
            "div",
            { className: "empty-state__eyebrow" },
            "Queue",
          ),
          s.createElement(
            "p",
            { className: "empty-state__message" },
            "Nothing scheduled yet.",
          ),
          s.createElement(
            "p",
            { className: "empty-state__hint" },
            "Pick an experiment in Schedule to begin.",
          ),
        )
      : s.createElement(
          ct,
          { defaultActiveKey: "0", className: "schedule-list" },
          Object.keys(e).map((n) =>
            s.createElement(bE, { key: n, rid: n, data: e[n] }),
          ),
        )
  );
}
function jE({
  tree: e,
  repo_rev: t,
  searchTerm: n,
  onSelect: r,
  selectedExperiment: o,
}) {
  return s.createElement(
    "div",
    { className: "experiment-tree" },
    s.createElement(Bi, {
      node: e,
      repo_rev: t,
      searchTerm: n,
      isRoot: !0,
      onSelect: r,
      selectedExperiment: o,
    }),
  );
}
function Bi({
  node: e,
  name: t,
  repo_rev: n,
  searchTerm: r,
  isRoot: o,
  path: l = "",
  onSelect: a,
  selectedExperiment: i,
}) {
  const c = `experimentTree_${l || "root"}`,
    f = () => {
      if (r) return !0;
      const E = localStorage.getItem(c);
      return E !== null ? E === "true" : !1;
    },
    [d, h] = s.useState(f);
  if (
    (s.useEffect(() => {
      if (r) h(!0);
      else {
        const E = localStorage.getItem(c);
        E !== null && h(E === "true");
      }
    }, [r, c]),
    s.useEffect(() => {
      r || localStorage.setItem(c, d.toString());
    }, [d, c, r]),
    e.experiment)
  ) {
    const E = e.experiment,
      x = `${E.file}:${E.class_name}`,
      k = i === e || i === x;
    return s.createElement(
      "div",
      {
        className: `experiment-item ${k ? "is-active" : ""}`,
        onClick: () => a(e),
        role: "button",
        tabIndex: 0,
        onKeyDown: (v) => {
          (v.key === "Enter" || v.key === " ") && (v.preventDefault(), a(e));
        },
      },
      s.createElement(
        "span",
        { className: "experiment-item__icon", "aria-hidden": "true" },
        s.createElement(bx, { size: 14 }),
      ),
      s.createElement(
        "span",
        { className: "experiment-item__class" },
        E.class_name,
      ),
      s.createElement("span", { className: "experiment-item__file" }, E.file),
    );
  }
  const y = Object.keys(e).sort((E, x) => {
    const k = !e[E].experiment,
      v = !e[x].experiment;
    return k && !v ? -1 : !k && v ? 1 : E.localeCompare(x);
  });
  return o
    ? s.createElement(
        "div",
        null,
        y.map((E) =>
          s.createElement(Bi, {
            key: E,
            name: E,
            node: e[E],
            repo_rev: n,
            searchTerm: r,
            isRoot: !1,
            path: E,
            onSelect: a,
            selectedExperiment: i,
          }),
        ),
      )
    : s.createElement(
        "div",
        null,
        s.createElement(
          "div",
          {
            className: "experiment-folder",
            onClick: () => h(!d),
            role: "button",
            tabIndex: 0,
            "aria-expanded": d,
            onKeyDown: (E) => {
              (E.key === "Enter" || E.key === " ") &&
                (E.preventDefault(), h(!d));
            },
          },
          s.createElement(
            "span",
            {
              className: `experiment-folder__chevron ${d ? "is-open" : ""}`,
              "aria-hidden": "true",
            },
            s.createElement(ec, { size: 12 }),
          ),
          s.createElement(
            "span",
            { className: "experiment-folder__icon", "aria-hidden": "true" },
            s.createElement(Dx, { size: 14 }),
          ),
          s.createElement("span", null, t),
        ),
        d &&
          s.createElement(
            "div",
            { className: "experiment-tree-children" },
            y.map((E) =>
              s.createElement(Bi, {
                key: E,
                name: E,
                node: e[E],
                repo_rev: n,
                searchTerm: r,
                path: `${l}/${E}`,
                isRoot: !1,
                onSelect: a,
                selectedExperiment: i,
              }),
            ),
          ),
      );
}
function DE(e, t) {
  const n = {},
    r = t.toLowerCase();
  return (
    e
      .filter(
        (l) =>
          l.class_name.toLowerCase().includes(r) ||
          l.file.toLowerCase().includes(r) ||
          (l.name && l.name.toLowerCase().includes(r)),
      )
      .forEach((l) => {
        const a = l.file.split(/[/\\]/);
        let i = n;
        a.forEach((u, c) => {
          if (c === a.length - 1) {
            const f = `${u} : ${l.class_name}`;
            i[f] = { experiment: l };
          } else i[u] || (i[u] = {}), (i = i[u]);
        });
      }),
    n
  );
}
function ME({ explist: e, onSelect: t, selectedExperiment: n }) {
  const [r, o] = s.useState(""),
    l = e && "experiments" in e ? e.experiments : [],
    a = e && "repo_rev" in e ? e.repo_rev : null,
    i = s.useMemo(() => DE(l, r), [l, r]),
    u = (c) => {
      t && t(c, a);
    };
  return s.createElement(
    "div",
    { className: "experiment-browser" },
    s.createElement(
      "label",
      { className: "experiment-search", "aria-label": "Search experiments" },
      s.createElement(
        "span",
        { className: "experiment-search__icon", "aria-hidden": "true" },
        s.createElement(Sh, { size: 14 }),
      ),
      s.createElement("input", {
        type: "text",
        className: "experiment-search__input",
        placeholder: "Search experiments by name, class, or file",
        value: r,
        onChange: (c) => o(c.target.value),
        onKeyDown: (c) => {
          c.key === "Escape" && o("");
        },
      }),
      r &&
        s.createElement(
          "button",
          {
            type: "button",
            className: "experiment-search__clear",
            onClick: () => o(""),
            "aria-label": "Clear search",
          },
          s.createElement(Nh, { size: 18 }),
        ),
    ),
    s.createElement(
      "div",
      { className: "experiment-tree-scroll" },
      l.length === 0
        ? s.createElement(
            "div",
            { className: "experiment-tree__empty" },
            "Loading experiments\u2026",
          )
        : Object.keys(i).length === 0
          ? s.createElement(
              "div",
              { className: "experiment-tree__empty" },
              "No experiments match your search.",
            )
          : s.createElement(jE, {
              tree: i,
              repo_rev: a,
              searchTerm: r,
              onSelect: u,
              selectedExperiment: n,
            }),
    ),
  );
}
var IE = /-(.)/g;
function zE(e) {
  return e.replace(IE, function (t, n) {
    return n.toUpperCase();
  });
}
const AE = (e) => e[0].toUpperCase() + zE(e).slice(1);
function De(e, { displayName: t = AE(e), Component: n, defaultProps: r } = {}) {
  const o = m.exports.forwardRef(
    ({ className: l, bsPrefix: a, as: i = n || "div", ...u }, c) => {
      const f = ee(a, e);
      return $.exports.jsx(i, { ref: c, className: X(l, f), ...u });
    },
  );
  return (o.defaultProps = r), (o.displayName = t), o;
}
const Ha = (e) =>
    m.exports.forwardRef((t, n) =>
      $.exports.jsx("div", { ...t, ref: n, className: X(t.className, e) }),
    ),
  Dh = m.exports.forwardRef(
    ({ bsPrefix: e, className: t, variant: n, as: r = "img", ...o }, l) => {
      const a = ee(e, "card-img");
      return $.exports.jsx(r, {
        ref: l,
        className: X(n ? `${a}-${n}` : a, t),
        ...o,
      });
    },
  );
Dh.displayName = "CardImg";
const Mh = m.exports.createContext(null);
Mh.displayName = "CardHeaderContext";
const Ih = m.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = ee(e, "card-header"),
      a = m.exports.useMemo(() => ({ cardHeaderBsPrefix: l }), [l]);
    return $.exports.jsx(Mh.Provider, {
      value: a,
      children: $.exports.jsx(n, { ref: o, ...r, className: X(t, l) }),
    });
  },
);
Ih.displayName = "CardHeader";
const FE = Ha("h5"),
  BE = Ha("h6"),
  zh = De("card-body"),
  WE = De("card-title", { Component: FE }),
  UE = De("card-subtitle", { Component: BE }),
  HE = De("card-link", { Component: "a" }),
  VE = De("card-text", { Component: "p" }),
  KE = De("card-footer"),
  GE = De("card-img-overlay"),
  QE = { body: !1 },
  lc = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        bg: n,
        text: r,
        border: o,
        body: l,
        children: a,
        as: i = "div",
        ...u
      },
      c,
    ) => {
      const f = ee(e, "card");
      return $.exports.jsx(i, {
        ref: c,
        ...u,
        className: X(
          t,
          f,
          n && `bg-${n}`,
          r && `text-${r}`,
          o && `border-${o}`,
        ),
        children: l ? $.exports.jsx(zh, { children: a }) : a,
      });
    },
  );
lc.displayName = "Card";
lc.defaultProps = QE;
const nt = Object.assign(lc, {
  Img: Dh,
  Title: WE,
  Subtitle: UE,
  Body: zh,
  Link: HE,
  Text: VE,
  Header: Ih,
  Footer: KE,
  ImgOverlay: GE,
});
function ac() {
  var e = m.exports.useRef(!0),
    t = m.exports.useRef(function () {
      return e.current;
    });
  return (
    m.exports.useEffect(function () {
      return (
        (e.current = !0),
        function () {
          e.current = !1;
        }
      );
    }, []),
    t.current
  );
}
function qE(e) {
  var t = m.exports.useRef(e);
  return (t.current = e), t;
}
function sc(e) {
  var t = qE(e);
  m.exports.useEffect(function () {
    return function () {
      return t.current();
    };
  }, []);
}
var Wi = Math.pow(2, 31) - 1;
function Ah(e, t, n) {
  var r = n - Date.now();
  e.current =
    r <= Wi
      ? setTimeout(t, r)
      : setTimeout(function () {
          return Ah(e, t, n);
        }, Wi);
}
function Fh() {
  var e = ac(),
    t = m.exports.useRef();
  return (
    sc(function () {
      return clearTimeout(t.current);
    }),
    m.exports.useMemo(function () {
      var n = function () {
        return clearTimeout(t.current);
      };
      function r(o, l) {
        l === void 0 && (l = 0),
          e() &&
            (n(),
            l <= Wi
              ? (t.current = setTimeout(o, l))
              : Ah(t, o, Date.now() + l));
      }
      return { set: r, clear: n };
    }, [])
  );
}
const YE = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
  },
  XE = { [Lt]: "show", [vn]: "show" },
  sn = m.exports.forwardRef(
    ({ className: e, children: t, transitionClasses: n = {}, ...r }, o) => {
      const l = m.exports.useCallback(
        (a, i) => {
          ah(a), r.onEnter == null || r.onEnter(a, i);
        },
        [r],
      );
      return $.exports.jsx(sh, {
        ref: o,
        addEndListener: lh,
        ...r,
        onEnter: l,
        childRef: t.ref,
        children: (a, i) =>
          m.exports.cloneElement(t, {
            ...i,
            className: X("fade", e, t.props.className, XE[a], n[a]),
          }),
      });
    },
  );
sn.defaultProps = YE;
sn.displayName = "Fade";
const JE = { [Lt]: "showing", [Bo]: "showing show" },
  Bh = m.exports.forwardRef((e, t) =>
    $.exports.jsx(sn, { ...e, ref: t, transitionClasses: JE }),
  );
Bh.displayName = "ToastFade";
function ZE(e) {
  var t = m.exports.useRef(e);
  return (
    m.exports.useEffect(
      function () {
        t.current = e;
      },
      [e],
    ),
    t
  );
}
function He(e) {
  var t = ZE(e);
  return m.exports.useCallback(
    function () {
      return t.current && t.current.apply(t, arguments);
    },
    [t],
  );
}
const ew = {
    "aria-label": R.exports.string,
    onClick: R.exports.func,
    variant: R.exports.oneOf(["white"]),
  },
  tw = { "aria-label": "Close" },
  Vr = m.exports.forwardRef(({ className: e, variant: t, ...n }, r) =>
    $.exports.jsx("button", {
      ref: r,
      type: "button",
      className: X("btn-close", t && `btn-close-${t}`, e),
      ...n,
    }),
  );
Vr.displayName = "CloseButton";
Vr.propTypes = ew;
Vr.defaultProps = tw;
const Wh = m.exports.createContext({ onClose() {} }),
  nw = { closeLabel: "Close", closeButton: !0 },
  ic = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        closeLabel: t,
        closeVariant: n,
        closeButton: r,
        className: o,
        children: l,
        ...a
      },
      i,
    ) => {
      e = ee(e, "toast-header");
      const u = m.exports.useContext(Wh),
        c = He((f) => {
          u == null || u.onClose == null || u.onClose(f);
        });
      return $.exports.jsxs("div", {
        ref: i,
        ...a,
        className: X(e, o),
        children: [
          l,
          r &&
            $.exports.jsx(Vr, {
              "aria-label": t,
              variant: n,
              onClick: c,
              "data-dismiss": "toast",
            }),
        ],
      });
    },
  );
ic.displayName = "ToastHeader";
ic.defaultProps = nw;
const rw = De("toast-body"),
  Uh = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        transition: n = Bh,
        show: r = !0,
        animation: o = !0,
        delay: l = 5e3,
        autohide: a = !1,
        onClose: i,
        bg: u,
        ...c
      },
      f,
    ) => {
      e = ee(e, "toast");
      const d = m.exports.useRef(l),
        h = m.exports.useRef(i);
      m.exports.useEffect(() => {
        (d.current = l), (h.current = i);
      }, [l, i]);
      const y = Fh(),
        E = !!(a && r),
        x = m.exports.useCallback(() => {
          E && (h.current == null || h.current());
        }, [E]);
      m.exports.useEffect(() => {
        y.set(x, d.current);
      }, [y, x]);
      const k = m.exports.useMemo(() => ({ onClose: i }), [i]),
        v = !!(n && o),
        p = $.exports.jsx("div", {
          ...c,
          ref: f,
          className: X(e, t, u && `bg-${u}`, !v && (r ? "show" : "hide")),
          role: "alert",
          "aria-live": "assertive",
          "aria-atomic": "true",
        });
      return $.exports.jsx(Wh.Provider, {
        value: k,
        children:
          v && n
            ? $.exports.jsx(n, { in: r, unmountOnExit: !0, children: p })
            : p,
      });
    },
  );
Uh.displayName = "Toast";
const Nr = Object.assign(Uh, { Body: rw, Header: ic }),
  ow = {
    "top-start": "top-0 start-0",
    "top-center": "top-0 start-50 translate-middle-x",
    "top-end": "top-0 end-0",
    "middle-start": "top-50 start-0 translate-middle-y",
    "middle-center": "top-50 start-50 translate-middle",
    "middle-end": "top-50 end-0 translate-middle-y",
    "bottom-start": "bottom-0 start-0",
    "bottom-center": "bottom-0 start-50 translate-middle-x",
    "bottom-end": "bottom-0 end-0",
  },
  uc = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        position: t,
        containerPosition: n = "absolute",
        className: r,
        as: o = "div",
        ...l
      },
      a,
    ) => (
      (e = ee(e, "toast-container")),
      $.exports.jsx(o, {
        ref: a,
        ...l,
        className: X(e, t && [n ? `position-${n}` : null, ow[t]], r),
      })
    ),
  );
uc.displayName = "ToastContainer";
const lw = {
    type: R.exports.string,
    tooltip: R.exports.bool,
    as: R.exports.elementType,
  },
  Va = m.exports.forwardRef(
    (
      { as: e = "div", className: t, type: n = "valid", tooltip: r = !1, ...o },
      l,
    ) =>
      $.exports.jsx(e, {
        ...o,
        ref: l,
        className: X(t, `${n}-${r ? "tooltip" : "feedback"}`),
      }),
  );
Va.displayName = "Feedback";
Va.propTypes = lw;
const en = m.exports.createContext({}),
  tl = m.exports.forwardRef(
    (
      {
        id: e,
        bsPrefix: t,
        className: n,
        type: r = "checkbox",
        isValid: o = !1,
        isInvalid: l = !1,
        as: a = "input",
        ...i
      },
      u,
    ) => {
      const { controlId: c } = m.exports.useContext(en);
      return (
        (t = ee(t, "form-check-input")),
        $.exports.jsx(a, {
          ...i,
          ref: u,
          type: r,
          id: e || c,
          className: X(n, t, o && "is-valid", l && "is-invalid"),
        })
      );
    },
  );
tl.displayName = "FormCheckInput";
const ha = m.exports.forwardRef(
  ({ bsPrefix: e, className: t, htmlFor: n, ...r }, o) => {
    const { controlId: l } = m.exports.useContext(en);
    return (
      (e = ee(e, "form-check-label")),
      $.exports.jsx("label", {
        ...r,
        ref: o,
        htmlFor: n || l,
        className: X(t, e),
      })
    );
  },
);
ha.displayName = "FormCheckLabel";
function aw(e, t) {
  return m.exports.Children.toArray(e).some(
    (n) => m.exports.isValidElement(n) && n.type === t,
  );
}
const Hh = m.exports.forwardRef(
  (
    {
      id: e,
      bsPrefix: t,
      bsSwitchPrefix: n,
      inline: r = !1,
      reverse: o = !1,
      disabled: l = !1,
      isValid: a = !1,
      isInvalid: i = !1,
      feedbackTooltip: u = !1,
      feedback: c,
      feedbackType: f,
      className: d,
      style: h,
      title: y = "",
      type: E = "checkbox",
      label: x,
      children: k,
      as: v = "input",
      ...p
    },
    g,
  ) => {
    (t = ee(t, "form-check")), (n = ee(n, "form-switch"));
    const { controlId: w } = m.exports.useContext(en),
      C = m.exports.useMemo(() => ({ controlId: e || w }), [w, e]),
      S = (!k && x != null && x !== !1) || aw(k, ha),
      N = $.exports.jsx(tl, {
        ...p,
        type: E === "switch" ? "checkbox" : E,
        ref: g,
        isValid: a,
        isInvalid: i,
        disabled: l,
        as: v,
      });
    return $.exports.jsx(en.Provider, {
      value: C,
      children: $.exports.jsx("div", {
        style: h,
        className: X(
          d,
          S && t,
          r && `${t}-inline`,
          o && `${t}-reverse`,
          E === "switch" && n,
        ),
        children:
          k ||
          $.exports.jsxs($.exports.Fragment, {
            children: [
              N,
              S && $.exports.jsx(ha, { title: y, children: x }),
              c && $.exports.jsx(Va, { type: f, tooltip: u, children: c }),
            ],
          }),
      }),
    });
  },
);
Hh.displayName = "FormCheck";
const va = Object.assign(Hh, { Input: tl, Label: ha }),
  Vh = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        type: t,
        size: n,
        htmlSize: r,
        id: o,
        className: l,
        isValid: a = !1,
        isInvalid: i = !1,
        plaintext: u,
        readOnly: c,
        as: f = "input",
        ...d
      },
      h,
    ) => {
      const { controlId: y } = m.exports.useContext(en);
      e = ee(e, "form-control");
      let E;
      return (
        u
          ? (E = { [`${e}-plaintext`]: !0 })
          : (E = { [e]: !0, [`${e}-${n}`]: n }),
        $.exports.jsx(f, {
          ...d,
          type: t,
          size: r,
          ref: h,
          readOnly: c,
          id: o || y,
          className: X(
            l,
            E,
            a && "is-valid",
            i && "is-invalid",
            t === "color" && `${e}-color`,
          ),
        })
      );
    },
  );
Vh.displayName = "FormControl";
const sw = Object.assign(Vh, { Feedback: Va }),
  iw = De("form-floating"),
  cc = m.exports.forwardRef(({ controlId: e, as: t = "div", ...n }, r) => {
    const o = m.exports.useMemo(() => ({ controlId: e }), [e]);
    return $.exports.jsx(en.Provider, {
      value: o,
      children: $.exports.jsx(t, { ...n, ref: r }),
    });
  });
cc.displayName = "FormGroup";
const uw = { column: !1, visuallyHidden: !1 },
  fc = m.exports.forwardRef(
    (
      {
        as: e = "label",
        bsPrefix: t,
        column: n,
        visuallyHidden: r,
        className: o,
        htmlFor: l,
        ...a
      },
      i,
    ) => {
      const { controlId: u } = m.exports.useContext(en);
      t = ee(t, "form-label");
      let c = "col-form-label";
      typeof n == "string" && (c = `${c} ${c}-${n}`);
      const f = X(o, t, r && "visually-hidden", n && c);
      return (
        (l = l || u),
        n
          ? $.exports.jsx(Ue, {
              ref: i,
              as: "label",
              className: f,
              htmlFor: l,
              ...a,
            })
          : $.exports.jsx(e, { ref: i, className: f, htmlFor: l, ...a })
      );
    },
  );
fc.displayName = "FormLabel";
fc.defaultProps = uw;
const Kh = m.exports.forwardRef(
  ({ bsPrefix: e, className: t, id: n, ...r }, o) => {
    const { controlId: l } = m.exports.useContext(en);
    return (
      (e = ee(e, "form-range")),
      $.exports.jsx("input", {
        ...r,
        type: "range",
        ref: o,
        className: X(t, e),
        id: n || l,
      })
    );
  },
);
Kh.displayName = "FormRange";
const Gh = m.exports.forwardRef(
  (
    {
      bsPrefix: e,
      size: t,
      htmlSize: n,
      className: r,
      isValid: o = !1,
      isInvalid: l = !1,
      id: a,
      ...i
    },
    u,
  ) => {
    const { controlId: c } = m.exports.useContext(en);
    return (
      (e = ee(e, "form-select")),
      $.exports.jsx("select", {
        ...i,
        size: n,
        ref: u,
        className: X(
          r,
          e,
          t && `${e}-${t}`,
          o && "is-valid",
          l && "is-invalid",
        ),
        id: a || c,
      })
    );
  },
);
Gh.displayName = "FormSelect";
const Qh = m.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "small", muted: r, ...o }, l) => (
    (e = ee(e, "form-text")),
    $.exports.jsx(n, { ...o, ref: l, className: X(t, e, r && "text-muted") })
  ),
);
Qh.displayName = "FormText";
const qh = m.exports.forwardRef((e, t) =>
  $.exports.jsx(va, { ...e, ref: t, type: "switch" }),
);
qh.displayName = "Switch";
const cw = Object.assign(qh, { Input: va.Input, Label: va.Label }),
  Yh = m.exports.forwardRef(
    (
      { bsPrefix: e, className: t, children: n, controlId: r, label: o, ...l },
      a,
    ) => (
      (e = ee(e, "form-floating")),
      $.exports.jsxs(cc, {
        ref: a,
        className: X(t, e),
        controlId: r,
        ...l,
        children: [n, $.exports.jsx("label", { htmlFor: r, children: o })],
      })
    ),
  );
Yh.displayName = "FloatingLabel";
const fw = {
    _ref: R.exports.any,
    validated: R.exports.bool,
    as: R.exports.elementType,
  },
  dc = m.exports.forwardRef(
    ({ className: e, validated: t, as: n = "form", ...r }, o) =>
      $.exports.jsx(n, { ...r, ref: o, className: X(e, t && "was-validated") }),
  );
dc.displayName = "Form";
dc.propTypes = fw;
const Z = Object.assign(dc, {
  Group: cc,
  Control: sw,
  Floating: iw,
  Check: va,
  Switch: cw,
  Label: fc,
  Text: Qh,
  Range: Kh,
  Select: Gh,
  FloatingLabel: Yh,
});
function Xh(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        xE(
          e.file,
          e.class_name,
          e.repo_rev,
          e.arguments || {},
          e.pipeline || "main",
        )
          .then((o) => {
            n(!1), o && o.detail && e.onError && e.onError(o.detail);
          })
          .catch((o) => {
            n(!1), e.onError && e.onError(o.message || "Submission failed");
          });
    };
  return s.createElement(
    ot,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    t ? "Submitting..." : "Submit",
  );
}
function Jh(e) {
  return e && Object.keys(e).includes("ndscan_params");
}
const dw = Jh;
function pw(e) {
  if (!Jh(e)) return null;
  try {
    const t = e.ndscan_params,
      [n] = t,
      r = n.default;
    return JSON.parse(r);
  } catch (t) {
    return console.error("Error parsing ndscan_params:", t), null;
  }
}
function mw(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) for (const o of r) t[o] || (t[o] = n);
  return t;
}
function hw(e) {
  return !e || !e.axes
    ? new Set()
    : new Set(e.axes.map((t) => t.fqn).filter(Boolean));
}
function pc(e, t) {
  return `ndscan_${e}_${t}`;
}
function vw(e, t) {
  try {
    const n = pc(e, t),
      r = localStorage.getItem(n);
    if (r) return JSON.parse(r);
  } catch (n) {
    console.error("Error loading ndscan state from localStorage:", n);
  }
  return null;
}
function gw(e, t, n) {
  try {
    const r = pc(e, t);
    localStorage.setItem(r, JSON.stringify(n));
  } catch (r) {
    console.error("Error saving ndscan state to localStorage:", r);
  }
}
function yw(e, t, n, r, o) {
  if (!e) return null;
  const l = {};
  for (const [i, u] of Object.entries(t)) {
    if (o && !o.has(i)) continue;
    const c = r[i] || "";
    l[i] = [{ path: c, value: u }];
  }
  const a = {
    instances: e.instances,
    schemata: e.schemata,
    always_shown: e.always_shown,
    overrides: l,
    scan: n,
  };
  return { ndscan_params: JSON.stringify(a) };
}
function Dt(e, t) {
  return e == null ? "" : t ? e / t : e;
}
function ga(e, t) {
  if (e === "" || e === "-") return e;
  const n = parseFloat(e);
  return isNaN(n) ? e : t ? n * t : n;
}
const Zh = m.exports.createContext(null);
Zh.displayName = "InputGroupContext";
const mc = De("input-group-text", { Component: "span" }),
  xw = (e) =>
    $.exports.jsx(mc, {
      children: $.exports.jsx(tl, { type: "checkbox", ...e }),
    }),
  Ew = (e) =>
    $.exports.jsx(mc, { children: $.exports.jsx(tl, { type: "radio", ...e }) }),
  ev = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        size: t,
        hasValidation: n,
        className: r,
        as: o = "div",
        ...l
      },
      a,
    ) => {
      e = ee(e, "input-group");
      const i = m.exports.useMemo(() => ({}), []);
      return $.exports.jsx(Zh.Provider, {
        value: i,
        children: $.exports.jsx(o, {
          ref: a,
          ...l,
          className: X(r, e, t && `${e}-${t}`, n && "has-validation"),
        }),
      });
    },
  );
ev.displayName = "InputGroup";
const he = Object.assign(ev, { Text: mc, Radio: Ew, Checkbox: xw });
function Wo(e, t) {
  if (e.contains) return e.contains(t);
  if (e.compareDocumentPosition)
    return e === t || !!(e.compareDocumentPosition(t) & 16);
}
function ya() {
  return m.exports.useState(null);
}
var ed = Object.prototype.hasOwnProperty;
function td(e, t, n) {
  for (n of e.keys()) if (Eo(n, t)) return n;
}
function Eo(e, t) {
  var n, r, o;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length) for (; r-- && Eo(e[r], t[r]); );
      return r === -1;
    }
    if (n === Set) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r),
          (o && typeof o == "object" && ((o = td(t, o)), !o)) || !t.has(o))
        )
          return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r[0]),
          (o && typeof o == "object" && ((o = td(t, o)), !o)) ||
            !Eo(r[1], t.get(o)))
        )
          return !1;
      return !0;
    }
    if (n === ArrayBuffer) (e = new Uint8Array(e)), (t = new Uint8Array(t));
    else if (n === DataView) {
      if ((r = e.byteLength) === t.byteLength)
        for (; r-- && e.getInt8(r) === t.getInt8(r); );
      return r === -1;
    }
    if (ArrayBuffer.isView(e)) {
      if ((r = e.byteLength) === t.byteLength) for (; r-- && e[r] === t[r]; );
      return r === -1;
    }
    if (!n || typeof e == "object") {
      r = 0;
      for (n in e)
        if (
          (ed.call(e, n) && ++r && !ed.call(t, n)) ||
          !(n in t) ||
          !Eo(e[n], t[n])
        )
          return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
function ww(e) {
  var t = ac();
  return [
    e[0],
    m.exports.useCallback(
      function (n) {
        if (!!t()) return e[1](n);
      },
      [t, e[1]],
    ),
  ];
}
var Ze = "top",
  xt = "bottom",
  Et = "right",
  et = "left",
  hc = "auto",
  nl = [Ze, xt, Et, et],
  Lr = "start",
  Uo = "end",
  Sw = "clippingParents",
  tv = "viewport",
  ro = "popper",
  kw = "reference",
  nd = nl.reduce(function (e, t) {
    return e.concat([t + "-" + Lr, t + "-" + Uo]);
  }, []),
  nv = [].concat(nl, [hc]).reduce(function (e, t) {
    return e.concat([t, t + "-" + Lr, t + "-" + Uo]);
  }, []),
  Cw = "beforeRead",
  Nw = "read",
  Rw = "afterRead",
  Ow = "beforeMain",
  _w = "main",
  Pw = "afterMain",
  Tw = "beforeWrite",
  bw = "write",
  $w = "afterWrite",
  Lw = [Cw, Nw, Rw, Ow, _w, Pw, Tw, bw, $w];
function zt(e) {
  return e.split("-")[0];
}
function St(e) {
  if (e == null) return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function Jn(e) {
  var t = St(e).Element;
  return e instanceof t || e instanceof Element;
}
function At(e) {
  var t = St(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function vc(e) {
  if (typeof ShadowRoot > "u") return !1;
  var t = St(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var Kn = Math.max,
  xa = Math.min,
  jr = Math.round;
function Ui() {
  var e = navigator.userAgentData;
  return e != null && e.brands
    ? e.brands
        .map(function (t) {
          return t.brand + "/" + t.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function rv() {
  return !/^((?!chrome|android).)*safari/i.test(Ui());
}
function Dr(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  var r = e.getBoundingClientRect(),
    o = 1,
    l = 1;
  t &&
    At(e) &&
    ((o = (e.offsetWidth > 0 && jr(r.width) / e.offsetWidth) || 1),
    (l = (e.offsetHeight > 0 && jr(r.height) / e.offsetHeight) || 1));
  var a = Jn(e) ? St(e) : window,
    i = a.visualViewport,
    u = !rv() && n,
    c = (r.left + (u && i ? i.offsetLeft : 0)) / o,
    f = (r.top + (u && i ? i.offsetTop : 0)) / l,
    d = r.width / o,
    h = r.height / l;
  return {
    width: d,
    height: h,
    top: f,
    right: c + d,
    bottom: f + h,
    left: c,
    x: c,
    y: f,
  };
}
function gc(e) {
  var t = Dr(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function ov(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && vc(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Pn(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function tn(e) {
  return St(e).getComputedStyle(e);
}
function jw(e) {
  return ["table", "td", "th"].indexOf(Pn(e)) >= 0;
}
function Ln(e) {
  return ((Jn(e) ? e.ownerDocument : e.document) || window.document)
    .documentElement;
}
function Ka(e) {
  return Pn(e) === "html"
    ? e
    : e.assignedSlot || e.parentNode || (vc(e) ? e.host : null) || Ln(e);
}
function rd(e) {
  return !At(e) || tn(e).position === "fixed" ? null : e.offsetParent;
}
function Dw(e) {
  var t = /firefox/i.test(Ui()),
    n = /Trident/i.test(Ui());
  if (n && At(e)) {
    var r = tn(e);
    if (r.position === "fixed") return null;
  }
  var o = Ka(e);
  for (vc(o) && (o = o.host); At(o) && ["html", "body"].indexOf(Pn(o)) < 0; ) {
    var l = tn(o);
    if (
      l.transform !== "none" ||
      l.perspective !== "none" ||
      l.contain === "paint" ||
      ["transform", "perspective"].indexOf(l.willChange) !== -1 ||
      (t && l.willChange === "filter") ||
      (t && l.filter && l.filter !== "none")
    )
      return o;
    o = o.parentNode;
  }
  return null;
}
function rl(e) {
  for (var t = St(e), n = rd(e); n && jw(n) && tn(n).position === "static"; )
    n = rd(n);
  return n &&
    (Pn(n) === "html" || (Pn(n) === "body" && tn(n).position === "static"))
    ? t
    : n || Dw(e) || t;
}
function yc(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function wo(e, t, n) {
  return Kn(e, xa(t, n));
}
function Mw(e, t, n) {
  var r = wo(e, t, n);
  return r > n ? n : r;
}
function lv() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function av(e) {
  return Object.assign({}, lv(), e);
}
function sv(e, t) {
  return t.reduce(function (n, r) {
    return (n[r] = e), n;
  }, {});
}
var Iw = function (t, n) {
  return (
    (t =
      typeof t == "function"
        ? t(Object.assign({}, n.rects, { placement: n.placement }))
        : t),
    av(typeof t != "number" ? t : sv(t, nl))
  );
};
function zw(e) {
  var t,
    n = e.state,
    r = e.name,
    o = e.options,
    l = n.elements.arrow,
    a = n.modifiersData.popperOffsets,
    i = zt(n.placement),
    u = yc(i),
    c = [et, Et].indexOf(i) >= 0,
    f = c ? "height" : "width";
  if (!(!l || !a)) {
    var d = Iw(o.padding, n),
      h = gc(l),
      y = u === "y" ? Ze : et,
      E = u === "y" ? xt : Et,
      x =
        n.rects.reference[f] + n.rects.reference[u] - a[u] - n.rects.popper[f],
      k = a[u] - n.rects.reference[u],
      v = rl(l),
      p = v ? (u === "y" ? v.clientHeight || 0 : v.clientWidth || 0) : 0,
      g = x / 2 - k / 2,
      w = d[y],
      C = p - h[f] - d[E],
      S = p / 2 - h[f] / 2 + g,
      N = wo(w, S, C),
      O = u;
    n.modifiersData[r] = ((t = {}), (t[O] = N), (t.centerOffset = N - S), t);
  }
}
function Aw(e) {
  var t = e.state,
    n = e.options,
    r = n.element,
    o = r === void 0 ? "[data-popper-arrow]" : r;
  o != null &&
    ((typeof o == "string" && ((o = t.elements.popper.querySelector(o)), !o)) ||
      !ov(t.elements.popper, o) ||
      (t.elements.arrow = o));
}
const Fw = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: zw,
  effect: Aw,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function Mr(e) {
  return e.split("-")[1];
}
var Bw = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function Ww(e) {
  var t = e.x,
    n = e.y,
    r = window,
    o = r.devicePixelRatio || 1;
  return { x: jr(t * o) / o || 0, y: jr(n * o) / o || 0 };
}
function od(e) {
  var t,
    n = e.popper,
    r = e.popperRect,
    o = e.placement,
    l = e.variation,
    a = e.offsets,
    i = e.position,
    u = e.gpuAcceleration,
    c = e.adaptive,
    f = e.roundOffsets,
    d = e.isFixed,
    h = a.x,
    y = h === void 0 ? 0 : h,
    E = a.y,
    x = E === void 0 ? 0 : E,
    k = typeof f == "function" ? f({ x: y, y: x }) : { x: y, y: x };
  (y = k.x), (x = k.y);
  var v = a.hasOwnProperty("x"),
    p = a.hasOwnProperty("y"),
    g = et,
    w = Ze,
    C = window;
  if (c) {
    var S = rl(n),
      N = "clientHeight",
      O = "clientWidth";
    if (
      (S === St(n) &&
        ((S = Ln(n)),
        tn(S).position !== "static" &&
          i === "absolute" &&
          ((N = "scrollHeight"), (O = "scrollWidth"))),
      (S = S),
      o === Ze || ((o === et || o === Et) && l === Uo))
    ) {
      w = xt;
      var j = d && S === C && C.visualViewport ? C.visualViewport.height : S[N];
      (x -= j - r.height), (x *= u ? 1 : -1);
    }
    if (o === et || ((o === Ze || o === xt) && l === Uo)) {
      g = Et;
      var D = d && S === C && C.visualViewport ? C.visualViewport.width : S[O];
      (y -= D - r.width), (y *= u ? 1 : -1);
    }
  }
  var z = Object.assign({ position: i }, c && Bw),
    G = f === !0 ? Ww({ x: y, y: x }) : { x: y, y: x };
  if (((y = G.x), (x = G.y), u)) {
    var Q;
    return Object.assign(
      {},
      z,
      ((Q = {}),
      (Q[w] = p ? "0" : ""),
      (Q[g] = v ? "0" : ""),
      (Q.transform =
        (C.devicePixelRatio || 1) <= 1
          ? "translate(" + y + "px, " + x + "px)"
          : "translate3d(" + y + "px, " + x + "px, 0)"),
      Q),
    );
  }
  return Object.assign(
    {},
    z,
    ((t = {}),
    (t[w] = p ? x + "px" : ""),
    (t[g] = v ? y + "px" : ""),
    (t.transform = ""),
    t),
  );
}
function Uw(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    o = r === void 0 ? !0 : r,
    l = n.adaptive,
    a = l === void 0 ? !0 : l,
    i = n.roundOffsets,
    u = i === void 0 ? !0 : i,
    c = {
      placement: zt(t.placement),
      variation: Mr(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
      isFixed: t.options.strategy === "fixed",
    };
  t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      od(
        Object.assign({}, c, {
          offsets: t.modifiersData.popperOffsets,
          position: t.options.strategy,
          adaptive: a,
          roundOffsets: u,
        }),
      ),
    )),
    t.modifiersData.arrow != null &&
      (t.styles.arrow = Object.assign(
        {},
        t.styles.arrow,
        od(
          Object.assign({}, c, {
            offsets: t.modifiersData.arrow,
            position: "absolute",
            adaptive: !1,
            roundOffsets: u,
          }),
        ),
      )),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-placement": t.placement,
    }));
}
const Hw = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Uw,
  data: {},
};
var kl = { passive: !0 };
function Vw(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    o = r.scroll,
    l = o === void 0 ? !0 : o,
    a = r.resize,
    i = a === void 0 ? !0 : a,
    u = St(t.elements.popper),
    c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    l &&
      c.forEach(function (f) {
        f.addEventListener("scroll", n.update, kl);
      }),
    i && u.addEventListener("resize", n.update, kl),
    function () {
      l &&
        c.forEach(function (f) {
          f.removeEventListener("scroll", n.update, kl);
        }),
        i && u.removeEventListener("resize", n.update, kl);
    }
  );
}
const Kw = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: Vw,
  data: {},
};
var Gw = { left: "right", right: "left", bottom: "top", top: "bottom" };
function Fl(e) {
  return e.replace(/left|right|bottom|top/g, function (t) {
    return Gw[t];
  });
}
var Qw = { start: "end", end: "start" };
function ld(e) {
  return e.replace(/start|end/g, function (t) {
    return Qw[t];
  });
}
function xc(e) {
  var t = St(e),
    n = t.pageXOffset,
    r = t.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function Ec(e) {
  return Dr(Ln(e)).left + xc(e).scrollLeft;
}
function qw(e, t) {
  var n = St(e),
    r = Ln(e),
    o = n.visualViewport,
    l = r.clientWidth,
    a = r.clientHeight,
    i = 0,
    u = 0;
  if (o) {
    (l = o.width), (a = o.height);
    var c = rv();
    (c || (!c && t === "fixed")) && ((i = o.offsetLeft), (u = o.offsetTop));
  }
  return { width: l, height: a, x: i + Ec(e), y: u };
}
function Yw(e) {
  var t,
    n = Ln(e),
    r = xc(e),
    o = (t = e.ownerDocument) == null ? void 0 : t.body,
    l = Kn(
      n.scrollWidth,
      n.clientWidth,
      o ? o.scrollWidth : 0,
      o ? o.clientWidth : 0,
    ),
    a = Kn(
      n.scrollHeight,
      n.clientHeight,
      o ? o.scrollHeight : 0,
      o ? o.clientHeight : 0,
    ),
    i = -r.scrollLeft + Ec(e),
    u = -r.scrollTop;
  return (
    tn(o || n).direction === "rtl" &&
      (i += Kn(n.clientWidth, o ? o.clientWidth : 0) - l),
    { width: l, height: a, x: i, y: u }
  );
}
function wc(e) {
  var t = tn(e),
    n = t.overflow,
    r = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function iv(e) {
  return ["html", "body", "#document"].indexOf(Pn(e)) >= 0
    ? e.ownerDocument.body
    : At(e) && wc(e)
      ? e
      : iv(Ka(e));
}
function So(e, t) {
  var n;
  t === void 0 && (t = []);
  var r = iv(e),
    o = r === ((n = e.ownerDocument) == null ? void 0 : n.body),
    l = St(r),
    a = o ? [l].concat(l.visualViewport || [], wc(r) ? r : []) : r,
    i = t.concat(a);
  return o ? i : i.concat(So(Ka(a)));
}
function Hi(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function Xw(e, t) {
  var n = Dr(e, !1, t === "fixed");
  return (
    (n.top = n.top + e.clientTop),
    (n.left = n.left + e.clientLeft),
    (n.bottom = n.top + e.clientHeight),
    (n.right = n.left + e.clientWidth),
    (n.width = e.clientWidth),
    (n.height = e.clientHeight),
    (n.x = n.left),
    (n.y = n.top),
    n
  );
}
function ad(e, t, n) {
  return t === tv ? Hi(qw(e, n)) : Jn(t) ? Xw(t, n) : Hi(Yw(Ln(e)));
}
function Jw(e) {
  var t = So(Ka(e)),
    n = ["absolute", "fixed"].indexOf(tn(e).position) >= 0,
    r = n && At(e) ? rl(e) : e;
  return Jn(r)
    ? t.filter(function (o) {
        return Jn(o) && ov(o, r) && Pn(o) !== "body";
      })
    : [];
}
function Zw(e, t, n, r) {
  var o = t === "clippingParents" ? Jw(e) : [].concat(t),
    l = [].concat(o, [n]),
    a = l[0],
    i = l.reduce(
      function (u, c) {
        var f = ad(e, c, r);
        return (
          (u.top = Kn(f.top, u.top)),
          (u.right = xa(f.right, u.right)),
          (u.bottom = xa(f.bottom, u.bottom)),
          (u.left = Kn(f.left, u.left)),
          u
        );
      },
      ad(e, a, r),
    );
  return (
    (i.width = i.right - i.left),
    (i.height = i.bottom - i.top),
    (i.x = i.left),
    (i.y = i.top),
    i
  );
}
function uv(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    o = r ? zt(r) : null,
    l = r ? Mr(r) : null,
    a = t.x + t.width / 2 - n.width / 2,
    i = t.y + t.height / 2 - n.height / 2,
    u;
  switch (o) {
    case Ze:
      u = { x: a, y: t.y - n.height };
      break;
    case xt:
      u = { x: a, y: t.y + t.height };
      break;
    case Et:
      u = { x: t.x + t.width, y: i };
      break;
    case et:
      u = { x: t.x - n.width, y: i };
      break;
    default:
      u = { x: t.x, y: t.y };
  }
  var c = o ? yc(o) : null;
  if (c != null) {
    var f = c === "y" ? "height" : "width";
    switch (l) {
      case Lr:
        u[c] = u[c] - (t[f] / 2 - n[f] / 2);
        break;
      case Uo:
        u[c] = u[c] + (t[f] / 2 - n[f] / 2);
        break;
    }
  }
  return u;
}
function Ho(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = r === void 0 ? e.placement : r,
    l = n.strategy,
    a = l === void 0 ? e.strategy : l,
    i = n.boundary,
    u = i === void 0 ? Sw : i,
    c = n.rootBoundary,
    f = c === void 0 ? tv : c,
    d = n.elementContext,
    h = d === void 0 ? ro : d,
    y = n.altBoundary,
    E = y === void 0 ? !1 : y,
    x = n.padding,
    k = x === void 0 ? 0 : x,
    v = av(typeof k != "number" ? k : sv(k, nl)),
    p = h === ro ? kw : ro,
    g = e.rects.popper,
    w = e.elements[E ? p : h],
    C = Zw(Jn(w) ? w : w.contextElement || Ln(e.elements.popper), u, f, a),
    S = Dr(e.elements.reference),
    N = uv({ reference: S, element: g, strategy: "absolute", placement: o }),
    O = Hi(Object.assign({}, g, N)),
    j = h === ro ? O : S,
    D = {
      top: C.top - j.top + v.top,
      bottom: j.bottom - C.bottom + v.bottom,
      left: C.left - j.left + v.left,
      right: j.right - C.right + v.right,
    },
    z = e.modifiersData.offset;
  if (h === ro && z) {
    var G = z[o];
    Object.keys(D).forEach(function (Q) {
      var P = [Et, xt].indexOf(Q) >= 0 ? 1 : -1,
        M = [Ze, xt].indexOf(Q) >= 0 ? "y" : "x";
      D[Q] += G[M] * P;
    });
  }
  return D;
}
function eS(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = n.boundary,
    l = n.rootBoundary,
    a = n.padding,
    i = n.flipVariations,
    u = n.allowedAutoPlacements,
    c = u === void 0 ? nv : u,
    f = Mr(r),
    d = f
      ? i
        ? nd
        : nd.filter(function (E) {
            return Mr(E) === f;
          })
      : nl,
    h = d.filter(function (E) {
      return c.indexOf(E) >= 0;
    });
  h.length === 0 && (h = d);
  var y = h.reduce(function (E, x) {
    return (
      (E[x] = Ho(e, { placement: x, boundary: o, rootBoundary: l, padding: a })[
        zt(x)
      ]),
      E
    );
  }, {});
  return Object.keys(y).sort(function (E, x) {
    return y[E] - y[x];
  });
}
function tS(e) {
  if (zt(e) === hc) return [];
  var t = Fl(e);
  return [ld(e), t, ld(t)];
}
function nS(e) {
  var t = e.state,
    n = e.options,
    r = e.name;
  if (!t.modifiersData[r]._skip) {
    for (
      var o = n.mainAxis,
        l = o === void 0 ? !0 : o,
        a = n.altAxis,
        i = a === void 0 ? !0 : a,
        u = n.fallbackPlacements,
        c = n.padding,
        f = n.boundary,
        d = n.rootBoundary,
        h = n.altBoundary,
        y = n.flipVariations,
        E = y === void 0 ? !0 : y,
        x = n.allowedAutoPlacements,
        k = t.options.placement,
        v = zt(k),
        p = v === k,
        g = u || (p || !E ? [Fl(k)] : tS(k)),
        w = [k].concat(g).reduce(function (F, K) {
          return F.concat(
            zt(K) === hc
              ? eS(t, {
                  placement: K,
                  boundary: f,
                  rootBoundary: d,
                  padding: c,
                  flipVariations: E,
                  allowedAutoPlacements: x,
                })
              : K,
          );
        }, []),
        C = t.rects.reference,
        S = t.rects.popper,
        N = new Map(),
        O = !0,
        j = w[0],
        D = 0;
      D < w.length;
      D++
    ) {
      var z = w[D],
        G = zt(z),
        Q = Mr(z) === Lr,
        P = [Ze, xt].indexOf(G) >= 0,
        M = P ? "width" : "height",
        W = Ho(t, {
          placement: z,
          boundary: f,
          rootBoundary: d,
          altBoundary: h,
          padding: c,
        }),
        q = P ? (Q ? Et : et) : Q ? xt : Ze;
      C[M] > S[M] && (q = Fl(q));
      var _ = Fl(q),
        I = [];
      if (
        (l && I.push(W[G] <= 0),
        i && I.push(W[q] <= 0, W[_] <= 0),
        I.every(function (F) {
          return F;
        }))
      ) {
        (j = z), (O = !1);
        break;
      }
      N.set(z, I);
    }
    if (O)
      for (
        var b = E ? 3 : 1,
          A = function (K) {
            var Y = w.find(function (J) {
              var se = N.get(J);
              if (se)
                return se.slice(0, K).every(function (te) {
                  return te;
                });
            });
            if (Y) return (j = Y), "break";
          },
          V = b;
        V > 0;
        V--
      ) {
        var T = A(V);
        if (T === "break") break;
      }
    t.placement !== j &&
      ((t.modifiersData[r]._skip = !0), (t.placement = j), (t.reset = !0));
  }
}
const rS = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: nS,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function sd(e, t, n) {
  return (
    n === void 0 && (n = { x: 0, y: 0 }),
    {
      top: e.top - t.height - n.y,
      right: e.right - t.width + n.x,
      bottom: e.bottom - t.height + n.y,
      left: e.left - t.width - n.x,
    }
  );
}
function id(e) {
  return [Ze, Et, xt, et].some(function (t) {
    return e[t] >= 0;
  });
}
function oS(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    o = t.rects.popper,
    l = t.modifiersData.preventOverflow,
    a = Ho(t, { elementContext: "reference" }),
    i = Ho(t, { altBoundary: !0 }),
    u = sd(a, r),
    c = sd(i, o, l),
    f = id(u),
    d = id(c);
  (t.modifiersData[n] = {
    referenceClippingOffsets: u,
    popperEscapeOffsets: c,
    isReferenceHidden: f,
    hasPopperEscaped: d,
  }),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-reference-hidden": f,
      "data-popper-escaped": d,
    }));
}
const lS = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: oS,
};
function aS(e, t, n) {
  var r = zt(e),
    o = [et, Ze].indexOf(r) >= 0 ? -1 : 1,
    l = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n,
    a = l[0],
    i = l[1];
  return (
    (a = a || 0),
    (i = (i || 0) * o),
    [et, Et].indexOf(r) >= 0 ? { x: i, y: a } : { x: a, y: i }
  );
}
function sS(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.offset,
    l = o === void 0 ? [0, 0] : o,
    a = nv.reduce(function (f, d) {
      return (f[d] = aS(d, t.rects, l)), f;
    }, {}),
    i = a[t.placement],
    u = i.x,
    c = i.y;
  t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += u),
    (t.modifiersData.popperOffsets.y += c)),
    (t.modifiersData[r] = a);
}
const iS = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: sS,
};
function uS(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = uv({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement,
  });
}
const cS = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: uS,
  data: {},
};
function fS(e) {
  return e === "x" ? "y" : "x";
}
function dS(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.mainAxis,
    l = o === void 0 ? !0 : o,
    a = n.altAxis,
    i = a === void 0 ? !1 : a,
    u = n.boundary,
    c = n.rootBoundary,
    f = n.altBoundary,
    d = n.padding,
    h = n.tether,
    y = h === void 0 ? !0 : h,
    E = n.tetherOffset,
    x = E === void 0 ? 0 : E,
    k = Ho(t, { boundary: u, rootBoundary: c, padding: d, altBoundary: f }),
    v = zt(t.placement),
    p = Mr(t.placement),
    g = !p,
    w = yc(v),
    C = fS(w),
    S = t.modifiersData.popperOffsets,
    N = t.rects.reference,
    O = t.rects.popper,
    j =
      typeof x == "function"
        ? x(Object.assign({}, t.rects, { placement: t.placement }))
        : x,
    D =
      typeof j == "number"
        ? { mainAxis: j, altAxis: j }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, j),
    z = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    G = { x: 0, y: 0 };
  if (!!S) {
    if (l) {
      var Q,
        P = w === "y" ? Ze : et,
        M = w === "y" ? xt : Et,
        W = w === "y" ? "height" : "width",
        q = S[w],
        _ = q + k[P],
        I = q - k[M],
        b = y ? -O[W] / 2 : 0,
        A = p === Lr ? N[W] : O[W],
        V = p === Lr ? -O[W] : -N[W],
        T = t.elements.arrow,
        F = y && T ? gc(T) : { width: 0, height: 0 },
        K = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : lv(),
        Y = K[P],
        J = K[M],
        se = wo(0, N[W], F[W]),
        te = g ? N[W] / 2 - b - se - Y - D.mainAxis : A - se - Y - D.mainAxis,
        ue = g ? -N[W] / 2 + b + se + J + D.mainAxis : V + se + J + D.mainAxis,
        Ne = t.elements.arrow && rl(t.elements.arrow),
        B = Ne ? (w === "y" ? Ne.clientTop || 0 : Ne.clientLeft || 0) : 0,
        H = (Q = z == null ? void 0 : z[w]) != null ? Q : 0,
        ne = q + te - H - B,
        ie = q + ue - H,
        de = wo(y ? xa(_, ne) : _, q, y ? Kn(I, ie) : I);
      (S[w] = de), (G[w] = de - q);
    }
    if (i) {
      var fe,
        re = w === "x" ? Ze : et,
        ut = w === "x" ? xt : Et,
        _e = S[C],
        be = C === "y" ? "height" : "width",
        Dn = _e + k[re],
        un = _e - k[ut],
        Mn = [Ze, et].indexOf(v) !== -1,
        le = (fe = z == null ? void 0 : z[C]) != null ? fe : 0,
        Ft = Mn ? Dn : _e - N[be] - O[be] - le + D.altAxis,
        Kr = Mn ? _e + N[be] + O[be] - le - D.altAxis : un,
        $c = y && Mn ? Mw(Ft, _e, Kr) : wo(y ? Ft : Dn, _e, y ? Kr : un);
      (S[C] = $c), (G[C] = $c - _e);
    }
    t.modifiersData[r] = G;
  }
}
const pS = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: dS,
  requiresIfExists: ["offset"],
};
function mS(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function hS(e) {
  return e === St(e) || !At(e) ? xc(e) : mS(e);
}
function vS(e) {
  var t = e.getBoundingClientRect(),
    n = jr(t.width) / e.offsetWidth || 1,
    r = jr(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function gS(e, t, n) {
  n === void 0 && (n = !1);
  var r = At(t),
    o = At(t) && vS(t),
    l = Ln(t),
    a = Dr(e, o, n),
    i = { scrollLeft: 0, scrollTop: 0 },
    u = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((Pn(t) !== "body" || wc(l)) && (i = hS(t)),
      At(t)
        ? ((u = Dr(t, !0)), (u.x += t.clientLeft), (u.y += t.clientTop))
        : l && (u.x = Ec(l))),
    {
      x: a.left + i.scrollLeft - u.x,
      y: a.top + i.scrollTop - u.y,
      width: a.width,
      height: a.height,
    }
  );
}
function yS(e) {
  var t = new Map(),
    n = new Set(),
    r = [];
  e.forEach(function (l) {
    t.set(l.name, l);
  });
  function o(l) {
    n.add(l.name);
    var a = [].concat(l.requires || [], l.requiresIfExists || []);
    a.forEach(function (i) {
      if (!n.has(i)) {
        var u = t.get(i);
        u && o(u);
      }
    }),
      r.push(l);
  }
  return (
    e.forEach(function (l) {
      n.has(l.name) || o(l);
    }),
    r
  );
}
function xS(e) {
  var t = yS(e);
  return Lw.reduce(function (n, r) {
    return n.concat(
      t.filter(function (o) {
        return o.phase === r;
      }),
    );
  }, []);
}
function ES(e) {
  var t;
  return function () {
    return (
      t ||
        (t = new Promise(function (n) {
          Promise.resolve().then(function () {
            (t = void 0), n(e());
          });
        })),
      t
    );
  };
}
function wS(e) {
  var t = e.reduce(function (n, r) {
    var o = n[r.name];
    return (
      (n[r.name] = o
        ? Object.assign({}, o, r, {
            options: Object.assign({}, o.options, r.options),
            data: Object.assign({}, o.data, r.data),
          })
        : r),
      n
    );
  }, {});
  return Object.keys(t).map(function (n) {
    return t[n];
  });
}
var ud = { placement: "bottom", modifiers: [], strategy: "absolute" };
function cd() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return !t.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function SS(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    o = t.defaultOptions,
    l = o === void 0 ? ud : o;
  return function (i, u, c) {
    c === void 0 && (c = l);
    var f = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, ud, l),
        modifiersData: {},
        elements: { reference: i, popper: u },
        attributes: {},
        styles: {},
      },
      d = [],
      h = !1,
      y = {
        state: f,
        setOptions: function (v) {
          var p = typeof v == "function" ? v(f.options) : v;
          x(),
            (f.options = Object.assign({}, l, f.options, p)),
            (f.scrollParents = {
              reference: Jn(i)
                ? So(i)
                : i.contextElement
                  ? So(i.contextElement)
                  : [],
              popper: So(u),
            });
          var g = xS(wS([].concat(r, f.options.modifiers)));
          return (
            (f.orderedModifiers = g.filter(function (w) {
              return w.enabled;
            })),
            E(),
            y.update()
          );
        },
        forceUpdate: function () {
          if (!h) {
            var v = f.elements,
              p = v.reference,
              g = v.popper;
            if (!!cd(p, g)) {
              (f.rects = {
                reference: gS(p, rl(g), f.options.strategy === "fixed"),
                popper: gc(g),
              }),
                (f.reset = !1),
                (f.placement = f.options.placement),
                f.orderedModifiers.forEach(function (D) {
                  return (f.modifiersData[D.name] = Object.assign({}, D.data));
                });
              for (var w = 0; w < f.orderedModifiers.length; w++) {
                if (f.reset === !0) {
                  (f.reset = !1), (w = -1);
                  continue;
                }
                var C = f.orderedModifiers[w],
                  S = C.fn,
                  N = C.options,
                  O = N === void 0 ? {} : N,
                  j = C.name;
                typeof S == "function" &&
                  (f = S({ state: f, options: O, name: j, instance: y }) || f);
              }
            }
          }
        },
        update: ES(function () {
          return new Promise(function (k) {
            y.forceUpdate(), k(f);
          });
        }),
        destroy: function () {
          x(), (h = !0);
        },
      };
    if (!cd(i, u)) return y;
    y.setOptions(c).then(function (k) {
      !h && c.onFirstUpdate && c.onFirstUpdate(k);
    });
    function E() {
      f.orderedModifiers.forEach(function (k) {
        var v = k.name,
          p = k.options,
          g = p === void 0 ? {} : p,
          w = k.effect;
        if (typeof w == "function") {
          var C = w({ state: f, name: v, instance: y, options: g }),
            S = function () {};
          d.push(C || S);
        }
      });
    }
    function x() {
      d.forEach(function (k) {
        return k();
      }),
        (d = []);
    }
    return y;
  };
}
const kS = SS({ defaultModifiers: [lS, cS, Hw, Kw, iS, rS, pS, Fw] }),
  CS = ["enabled", "placement", "strategy", "modifiers"];
function NS(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const RS = {
    name: "applyStyles",
    enabled: !1,
    phase: "afterWrite",
    fn: () => {},
  },
  OS = {
    name: "ariaDescribedBy",
    enabled: !0,
    phase: "afterWrite",
    effect:
      ({ state: e }) =>
      () => {
        const { reference: t, popper: n } = e.elements;
        if ("removeAttribute" in t) {
          const r = (t.getAttribute("aria-describedby") || "")
            .split(",")
            .filter((o) => o.trim() !== n.id);
          r.length
            ? t.setAttribute("aria-describedby", r.join(","))
            : t.removeAttribute("aria-describedby");
        }
      },
    fn: ({ state: e }) => {
      var t;
      const { popper: n, reference: r } = e.elements,
        o = (t = n.getAttribute("role")) == null ? void 0 : t.toLowerCase();
      if (n.id && o === "tooltip" && "setAttribute" in r) {
        const l = r.getAttribute("aria-describedby");
        if (l && l.split(",").indexOf(n.id) !== -1) return;
        r.setAttribute("aria-describedby", l ? `${l},${n.id}` : n.id);
      }
    },
  },
  _S = [];
function PS(e, t, n = {}) {
  let {
      enabled: r = !0,
      placement: o = "bottom",
      strategy: l = "absolute",
      modifiers: a = _S,
    } = n,
    i = NS(n, CS);
  const u = m.exports.useRef(a),
    c = m.exports.useRef(),
    f = m.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.update();
    }, []),
    d = m.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.forceUpdate();
    }, []),
    [h, y] = ww(
      m.exports.useState({
        placement: o,
        update: f,
        forceUpdate: d,
        attributes: {},
        styles: { popper: {}, arrow: {} },
      }),
    ),
    E = m.exports.useMemo(
      () => ({
        name: "updateStateModifier",
        enabled: !0,
        phase: "write",
        requires: ["computeStyles"],
        fn: ({ state: k }) => {
          const v = {},
            p = {};
          Object.keys(k.elements).forEach((g) => {
            (v[g] = k.styles[g]), (p[g] = k.attributes[g]);
          }),
            y({
              state: k,
              styles: v,
              attributes: p,
              update: f,
              forceUpdate: d,
              placement: k.placement,
            });
        },
      }),
      [f, d, y],
    ),
    x = m.exports.useMemo(
      () => (Eo(u.current, a) || (u.current = a), u.current),
      [a],
    );
  return (
    m.exports.useEffect(() => {
      !c.current ||
        !r ||
        c.current.setOptions({
          placement: o,
          strategy: l,
          modifiers: [...x, E, RS],
        });
    }, [l, o, E, r, x]),
    m.exports.useEffect(() => {
      if (!(!r || e == null || t == null))
        return (
          (c.current = kS(
            e,
            t,
            Object.assign({}, i, {
              placement: o,
              strategy: l,
              modifiers: [...x, OS, E],
            }),
          )),
          () => {
            c.current != null &&
              (c.current.destroy(),
              (c.current = void 0),
              y((k) =>
                Object.assign({}, k, {
                  attributes: {},
                  styles: { popper: {} },
                }),
              ));
          }
        );
    }, [r, e, t]),
    h
  );
}
const fd = () => {};
function TS(e) {
  return e.button === 0;
}
function bS(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const Bl = (e) => e && ("current" in e ? e.current : e),
  dd = { click: "mousedown", mouseup: "mousedown", pointerup: "pointerdown" };
function $S(e, t = fd, { disabled: n, clickTrigger: r = "click" } = {}) {
  const o = m.exports.useRef(!1),
    l = m.exports.useRef(!1),
    a = m.exports.useCallback(
      (c) => {
        const f = Bl(e);
        (o.current = !f || bS(c) || !TS(c) || !!Wo(f, c.target) || l.current),
          (l.current = !1);
      },
      [e],
    ),
    i = He((c) => {
      const f = Bl(e);
      f && Wo(f, c.target) && (l.current = !0);
    }),
    u = He((c) => {
      o.current || t(c);
    });
  m.exports.useEffect(() => {
    if (n || e == null) return;
    const c = Ur(Bl(e));
    let f = (c.defaultView || window).event,
      d = null;
    dd[r] && (d = Vt(c, dd[r], i, !0));
    const h = Vt(c, r, a, !0),
      y = Vt(c, r, (x) => {
        if (x === f) {
          f = void 0;
          return;
        }
        u(x);
      });
    let E = [];
    return (
      "ontouchstart" in c.documentElement &&
        (E = [].slice.call(c.body.children).map((x) => Vt(x, "mousemove", fd))),
      () => {
        d == null || d(), h(), y(), E.forEach((x) => x());
      }
    );
  }, [e, n, r, a, i, u]);
}
const LS = 27,
  jS = () => {};
function DS(e, t, { disabled: n, clickTrigger: r } = {}) {
  const o = t || jS;
  $S(e, o, { disabled: n, clickTrigger: r });
  const l = He((a) => {
    a.keyCode === LS && o(a);
  });
  m.exports.useEffect(() => {
    if (n || e == null) return;
    const a = Ur(Bl(e));
    let i = (a.defaultView || window).event;
    const u = Vt(a, "keyup", (c) => {
      if (c === i) {
        i = void 0;
        return;
      }
      l(c);
    });
    return () => {
      u();
    };
  }, [e, n, l]);
}
const cv = m.exports.createContext(Hr ? window : void 0);
cv.Provider;
function fv() {
  return m.exports.useContext(cv);
}
const Cs = (e, t) =>
  Hr
    ? e == null
      ? (t || Ur()).body
      : (typeof e == "function" && (e = e()),
        e && "current" in e && (e = e.current),
        e && ("nodeType" in e || e.getBoundingClientRect) ? e : null)
    : null;
function Vi(e, t) {
  const n = fv(),
    [r, o] = m.exports.useState(() => Cs(e, n == null ? void 0 : n.document));
  if (!r) {
    const l = Cs(e);
    l && o(l);
  }
  return (
    m.exports.useEffect(() => {
      t && r && t(r);
    }, [t, r]),
    m.exports.useEffect(() => {
      const l = Cs(e);
      l !== r && o(l);
    }, [e, r]),
    r
  );
}
function MS(e) {
  const t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach((n) => {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function IS(e = {}) {
  return Array.isArray(e)
    ? e
    : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
}
function zS({
  enabled: e,
  enableEvents: t,
  placement: n,
  flip: r,
  offset: o,
  fixed: l,
  containerPadding: a,
  arrowElement: i,
  popperConfig: u = {},
}) {
  var c, f, d, h, y;
  const E = MS(u.modifiers);
  return Object.assign({}, u, {
    placement: n,
    enabled: e,
    strategy: l ? "fixed" : u.strategy,
    modifiers: IS(
      Object.assign({}, E, {
        eventListeners: {
          enabled: t,
          options: (c = E.eventListeners) == null ? void 0 : c.options,
        },
        preventOverflow: Object.assign({}, E.preventOverflow, {
          options: a
            ? Object.assign(
                { padding: a },
                (f = E.preventOverflow) == null ? void 0 : f.options,
              )
            : (d = E.preventOverflow) == null
              ? void 0
              : d.options,
        }),
        offset: {
          options: Object.assign(
            { offset: o },
            (h = E.offset) == null ? void 0 : h.options,
          ),
        },
        arrow: Object.assign({}, E.arrow, {
          enabled: !!i,
          options: Object.assign(
            {},
            (y = E.arrow) == null ? void 0 : y.options,
            { element: i },
          ),
        }),
        flip: Object.assign({ enabled: !!r }, E.flip),
      }),
    ),
  });
}
const dv = m.exports.forwardRef((e, t) => {
  const {
      flip: n,
      offset: r,
      placement: o,
      containerPadding: l,
      popperConfig: a = {},
      transition: i,
    } = e,
    [u, c] = ya(),
    [f, d] = ya(),
    h = Zo(c, t),
    y = Vi(e.container),
    E = Vi(e.target),
    [x, k] = m.exports.useState(!e.show),
    v = PS(
      E,
      u,
      zS({
        placement: o,
        enableEvents: !!e.show,
        containerPadding: l || 5,
        flip: n,
        offset: r,
        arrowElement: f,
        popperConfig: a,
      }),
    );
  e.show ? x && k(!1) : !e.transition && !x && k(!0);
  const p = (...C) => {
      k(!0), e.onExited && e.onExited(...C);
    },
    g = e.show || (i && !x);
  if (
    (DS(u, e.onHide, {
      disabled: !e.rootClose || e.rootCloseDisabled,
      clickTrigger: e.rootCloseEvent,
    }),
    !g)
  )
    return null;
  let w = e.children(
    Object.assign({}, v.attributes.popper, { style: v.styles.popper, ref: h }),
    {
      popper: v,
      placement: o,
      show: !!e.show,
      arrowProps: Object.assign({}, v.attributes.arrow, {
        style: v.styles.arrow,
        ref: d,
      }),
    },
  );
  if (i) {
    const {
      onExit: C,
      onExiting: S,
      onEnter: N,
      onEntering: O,
      onEntered: j,
    } = e;
    w = $.exports.jsx(i, {
      in: e.show,
      appear: !0,
      onExit: C,
      onExiting: S,
      onExited: p,
      onEnter: N,
      onEntering: O,
      onEntered: j,
      children: w,
    });
  }
  return y ? Un.createPortal(w, y) : null;
});
dv.displayName = "Overlay";
var AS =
    typeof global < "u" &&
    global.navigator &&
    global.navigator.product === "ReactNative",
  FS = typeof document < "u";
const BS = FS || AS ? m.exports.useLayoutEffect : m.exports.useEffect;
function pv(e, t) {
  return e.classList
    ? !!t && e.classList.contains(t)
    : (" " + (e.className.baseVal || e.className) + " ").indexOf(
        " " + t + " ",
      ) !== -1;
}
const WS = De("popover-header"),
  mv = De("popover-body");
function hv(e, t) {
  let n = e;
  return (
    e === "left"
      ? (n = t ? "end" : "start")
      : e === "right" && (n = t ? "start" : "end"),
    n
  );
}
const US = { placement: "right" },
  vv = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t,
        className: n,
        style: r,
        children: o,
        body: l,
        arrowProps: a,
        popper: i,
        show: u,
        ...c
      },
      f,
    ) => {
      const d = ee(e, "popover"),
        h = Xu(),
        [y] = (t == null ? void 0 : t.split("-")) || [],
        E = hv(y, h);
      return $.exports.jsxs("div", {
        ref: f,
        role: "tooltip",
        style: r,
        "x-placement": y,
        className: X(n, d, y && `bs-popover-${E}`),
        ...c,
        children: [
          $.exports.jsx("div", { className: "popover-arrow", ...a }),
          l ? $.exports.jsx(mv, { children: o }) : o,
        ],
      });
    },
  );
vv.defaultProps = US;
const HS = Object.assign(vv, { Header: WS, Body: mv, POPPER_OFFSET: [0, 8] });
function VS(e) {
  const t = m.exports.useRef(null),
    n = ee(void 0, "popover"),
    r = m.exports.useMemo(
      () => ({
        name: "offset",
        options: {
          offset: () =>
            t.current && pv(t.current, n) ? e || HS.POPPER_OFFSET : e || [0, 0],
        },
      }),
      [e, n],
    );
  return [t, [r]];
}
const KS = { transition: sn, rootClose: !1, show: !1, placement: "top" };
function GS(e, t) {
  const { ref: n } = e,
    { ref: r } = t;
  (e.ref = n.__wrapped || (n.__wrapped = (o) => n(pa(o)))),
    (t.ref = r.__wrapped || (r.__wrapped = (o) => r(pa(o))));
}
const Sc = m.exports.forwardRef(
  ({ children: e, transition: t, popperConfig: n = {}, ...r }, o) => {
    const l = m.exports.useRef({}),
      [a, i] = ya(),
      [u, c] = VS(r.offset),
      f = Zo(o, u),
      d = t === !0 ? sn : t || void 0,
      h = He((y) => {
        i(y), n == null || n.onFirstUpdate == null || n.onFirstUpdate(y);
      });
    return (
      BS(() => {
        a && (l.current.scheduleUpdate == null || l.current.scheduleUpdate());
      }, [a]),
      $.exports.jsx(dv, {
        ...r,
        ref: f,
        popperConfig: {
          ...n,
          modifiers: c.concat(n.modifiers || []),
          onFirstUpdate: h,
        },
        transition: d,
        children: (y, { arrowProps: E, popper: x, show: k }) => {
          var v, p;
          GS(y, E);
          const g = x == null ? void 0 : x.placement,
            w = Object.assign(l.current, {
              state: x == null ? void 0 : x.state,
              scheduleUpdate: x == null ? void 0 : x.update,
              placement: g,
              outOfBoundaries:
                (x == null ||
                (v = x.state) == null ||
                (p = v.modifiersData.hide) == null
                  ? void 0
                  : p.isReferenceHidden) || !1,
            });
          return typeof e == "function"
            ? e({
                ...y,
                placement: g,
                show: k,
                ...(!t && k && { className: "show" }),
                popper: w,
                arrowProps: E,
              })
            : m.exports.cloneElement(e, {
                ...y,
                placement: g,
                arrowProps: E,
                popper: w,
                className: X(e.props.className, !t && k && "show"),
                style: { ...e.props.style, ...y.style },
              });
        },
      })
    );
  },
);
Sc.displayName = "Overlay";
Sc.defaultProps = KS;
function QS(e) {
  return e && typeof e == "object" ? e : { show: e, hide: e };
}
function pd(e, t, n) {
  const [r] = t,
    o = r.currentTarget,
    l = r.relatedTarget || r.nativeEvent[n];
  (!l || l !== o) && !Wo(o, l) && e(...t);
}
const qS = { defaultShow: !1, trigger: ["hover", "focus"] };
function kc({
  trigger: e,
  overlay: t,
  children: n,
  popperConfig: r = {},
  show: o,
  defaultShow: l = !1,
  onToggle: a,
  delay: i,
  placement: u,
  flip: c = u && u.indexOf("auto") !== -1,
  ...f
}) {
  const d = m.exports.useRef(null),
    h = Zo(d, n.ref),
    y = Fh(),
    E = m.exports.useRef(""),
    [x, k] = Rh(o, l, a),
    v = QS(i),
    {
      onFocus: p,
      onBlur: g,
      onClick: w,
    } = typeof n != "function" ? m.exports.Children.only(n).props : {},
    C = (M) => {
      h(pa(M));
    },
    S = m.exports.useCallback(() => {
      if ((y.clear(), (E.current = "show"), !v.show)) {
        k(!0);
        return;
      }
      y.set(() => {
        E.current === "show" && k(!0);
      }, v.show);
    }, [v.show, k, y]),
    N = m.exports.useCallback(() => {
      if ((y.clear(), (E.current = "hide"), !v.hide)) {
        k(!1);
        return;
      }
      y.set(() => {
        E.current === "hide" && k(!1);
      }, v.hide);
    }, [v.hide, k, y]),
    O = m.exports.useCallback(
      (...M) => {
        S(), p == null || p(...M);
      },
      [S, p],
    ),
    j = m.exports.useCallback(
      (...M) => {
        N(), g == null || g(...M);
      },
      [N, g],
    ),
    D = m.exports.useCallback(
      (...M) => {
        k(!x), w == null || w(...M);
      },
      [w, k, x],
    ),
    z = m.exports.useCallback(
      (...M) => {
        pd(S, M, "fromElement");
      },
      [S],
    ),
    G = m.exports.useCallback(
      (...M) => {
        pd(N, M, "toElement");
      },
      [N],
    ),
    Q = e == null ? [] : [].concat(e),
    P = { ref: C };
  return (
    Q.indexOf("click") !== -1 && (P.onClick = D),
    Q.indexOf("focus") !== -1 && ((P.onFocus = O), (P.onBlur = j)),
    Q.indexOf("hover") !== -1 && ((P.onMouseOver = z), (P.onMouseOut = G)),
    $.exports.jsxs($.exports.Fragment, {
      children: [
        typeof n == "function" ? n(P) : m.exports.cloneElement(n, P),
        $.exports.jsx(Sc, {
          ...f,
          show: x,
          onHide: N,
          flip: c,
          placement: u,
          popperConfig: r,
          target: d.current,
          children: t,
        }),
      ],
    })
  );
}
kc.defaultProps = qS;
const YS = { placement: "right" },
  Ga = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t,
        className: n,
        style: r,
        children: o,
        arrowProps: l,
        popper: a,
        show: i,
        ...u
      },
      c,
    ) => {
      e = ee(e, "tooltip");
      const f = Xu(),
        [d] = (t == null ? void 0 : t.split("-")) || [],
        h = hv(d, f);
      return $.exports.jsxs("div", {
        ref: c,
        style: r,
        role: "tooltip",
        "x-placement": d,
        className: X(n, e, `bs-tooltip-${h}`),
        ...u,
        children: [
          $.exports.jsx("div", { className: "tooltip-arrow", ...l }),
          $.exports.jsx("div", { className: `${e}-inner`, children: o }),
        ],
      });
    },
  );
Ga.defaultProps = YS;
Ga.displayName = "Tooltip";
function jn({ onClick: e, disabled: t }) {
  return s.createElement(
    kc,
    {
      placement: "top",
      overlay: s.createElement(Ga, null, "Reset to default"),
    },
    s.createElement(
      ot,
      { variant: "outline-secondary", size: "sm", onClick: e, disabled: t },
      "\u21BA",
    ),
  );
}
function XS({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const {
      unit: l,
      scale: a,
      step: i,
      min: u,
      max: c,
      precision: f,
      default: d,
    } = t,
    h = n != null ? n : "",
    y = n === d,
    E = (x) => {
      const k = x.target.value;
      if (k === "" || k === "-") r(e, k);
      else {
        const v = parseFloat(k);
        isNaN(v) || r(e, v);
      }
    };
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "number",
      value: h,
      onChange: E,
      step: i || "any",
      min: u,
      max: c,
    }),
    l && s.createElement(he.Text, null, l),
    s.createElement(jn, { onClick: () => o(e), disabled: y }),
  );
}
function JS({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { choices: l, default: a } = t,
    i = n === a;
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(
      Z.Select,
      { value: n || "", onChange: (u) => r(e, u.target.value) },
      l && l.map((u) => s.createElement("option", { key: u, value: u }, u)),
    ),
    s.createElement(jn, { onClick: () => o(e), disabled: i }),
  );
}
function ZS({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    a = n === l;
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(he.Checkbox, {
      checked: Boolean(n),
      onChange: (i) => r(e, i.target.checked),
    }),
    s.createElement(Z.Control, {
      plaintext: !0,
      readOnly: !0,
      value: n ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    s.createElement(jn, { onClick: () => o(e), disabled: a }),
  );
}
function ek({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    a = n === l;
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "text",
      value: n || "",
      onChange: (i) => r(e, i.target.value),
    }),
    s.createElement(jn, { onClick: () => o(e), disabled: a }),
  );
}
function tk({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    a = n === l;
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      as: "textarea",
      rows: 2,
      value: n || "",
      onChange: (i) => r(e, i.target.value),
      style: { fontFamily: "monospace", fontSize: "0.85em" },
    }),
    s.createElement(jn, { onClick: () => o(e), disabled: a }),
  );
}
function nk({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: a, spec: i } = e,
    { unit: u, scale: c, step: f, min: d, max: h } = i || {},
    y = a ? parseFloat(a) : 0,
    E = t != null ? t : y,
    x = Dt(E, c),
    k = t == null,
    v = (C) => {
      const S = C.target.value,
        N = ga(S, c);
      n(l, N);
    },
    p = Dt(d, c),
    g = Dt(h, c),
    w = Dt(f, c);
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "number",
      value: x,
      onChange: v,
      step: w || "any",
      min: p,
      max: g,
      disabled: o,
    }),
    u && s.createElement(he.Text, null, u),
    o &&
      s.createElement(
        he.Text,
        { className: "text-muted" },
        s.createElement("small", null, "Scanned"),
      ),
    s.createElement(jn, { onClick: () => r(l), disabled: k || o }),
  );
}
function rk({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: a, spec: i } = e,
    { unit: u, scale: c, step: f, min: d, max: h } = i || {},
    y = a ? parseInt(a) : 0,
    E = t != null ? t : y,
    x = Dt(E, c),
    k = t == null,
    v = (C) => {
      const S = C.target.value,
        N = ga(S, c),
        O = typeof N == "number" ? Math.round(N) : N;
      n(l, O);
    },
    p = Dt(d, c),
    g = Dt(h, c),
    w = Dt(f, c);
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "number",
      value: x,
      onChange: v,
      step: w || 1,
      min: p,
      max: g,
      disabled: o,
    }),
    u && s.createElement(he.Text, null, u),
    o &&
      s.createElement(
        he.Text,
        { className: "text-muted" },
        s.createElement("small", null, "Scanned"),
      ),
    s.createElement(jn, { onClick: () => r(l), disabled: k || o }),
  );
}
function ok({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, description: a, type: i, default: u } = e,
    c = u === "True" || u === "true",
    f = t != null ? t : c,
    d = t == null;
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(he.Checkbox, {
      checked: Boolean(f),
      onChange: (h) => n(l, h.target.checked),
      disabled: o,
    }),
    s.createElement(Z.Control, {
      plaintext: !0,
      readOnly: !0,
      value: f ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    o &&
      s.createElement(
        he.Text,
        { className: "text-muted" },
        s.createElement("small", null, "Scanned"),
      ),
    s.createElement(jn, { onClick: () => r(l), disabled: d || o }),
  );
}
function lk(e) {
  switch (e) {
    case "NumberValue":
      return XS;
    case "EnumerationValue":
      return JS;
    case "BooleanValue":
      return ZS;
    case "StringValue":
      return ek;
    case "PYONValue":
    default:
      return tk;
  }
}
function ak({ name: e, argInfo: t, value: n, onChange: r, onReset: o }) {
  const [l, a, i] = t,
    u = lk(l.ty),
    c = s.createElement(
      Z.Label,
      { className: "mb-0", style: { fontWeight: 500 } },
      e,
    );
  return s.createElement(
    Z.Group,
    { className: "mb-2 row align-items-center" },
    s.createElement(
      "div",
      { className: "col-4" },
      i
        ? s.createElement(
            kc,
            { placement: "right", overlay: s.createElement(Ga, null, i) },
            s.createElement(
              "span",
              { style: { cursor: "help", borderBottom: "1px dotted #666" } },
              c,
            ),
          )
        : c,
    ),
    s.createElement(
      "div",
      { className: "col-8" },
      s.createElement(u, {
        name: e,
        spec: l,
        value: n,
        onChange: r,
        onReset: o,
      }),
    ),
  );
}
function sk(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o] = r;
    o && o.default !== void 0 && (t[n] = o.default);
  }
  return t;
}
function ik(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o, l] = r,
      a = l || "General";
    t[a] || (t[a] = []), t[a].push({ name: n, argData: r });
  }
  return t;
}
function gv(e, t) {
  return `artiq_exp_state_${e}_${t}`;
}
function yv(e, t, n) {
  const r = gv(e, t);
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch (o) {
    console.error("Error saving experiment state to localStorage:", o);
  }
}
function Ki(e, t) {
  const n = gv(e, t);
  try {
    const r = localStorage.getItem(n);
    return r ? JSON.parse(r) : null;
  } catch (r) {
    return (
      console.error("Error loading experiment state from localStorage:", r),
      null
    );
  }
}
function uk(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    a = s.useMemo(() => sk(o), [o]),
    [i, u] = s.useState(() => {
      var O;
      const N = Ki(n, r);
      return (O = N == null ? void 0 : N.argValues) != null ? O : a;
    }),
    [c, f] = s.useState(() => {
      var O;
      const N = Ki(n, r);
      return (O = N == null ? void 0 : N.pipeline) != null ? O : "main";
    }),
    [d, h] = s.useState(!1),
    [y, E] = s.useState("");
  s.useEffect(() => {
    yv(n, r, { argValues: i, pipeline: c });
  }, [n, r, i, c]);
  const x = s.useMemo(() => ik(o), [o]),
    k = o && Object.keys(o).length > 0,
    v = (N, O) => {
      u((j) => ({ ...j, [N]: O }));
    },
    p = (N) => {
      u((O) => ({ ...O, [N]: a[N] }));
    },
    g = () => {
      u(a);
    },
    w = (N) => {
      E(N), h(!0);
    },
    C = (N, O) =>
      s.createElement(
        "tr",
        { key: N },
        s.createElement("td", null, s.createElement("b", null, N, ":")),
        s.createElement("td", null, O),
      ),
    S = () => i;
  return s.createElement(
    nt,
    { className: "submission-card" },
    s.createElement(
      nt.Header,
      { className: "submission-card__header" },
      s.createElement(
        "div",
        { className: "submission-card__head-meta" },
        s.createElement("span", { className: "submission-card__class" }, r),
        s.createElement("span", { className: "submission-card__file" }, n),
      ),
    ),
    s.createElement(
      nt.Body,
      { className: "submission-card__body" },
      s.createElement(
        ma,
        { className: "schedule-detail-table mb-4" },
        s.createElement(
          "tbody",
          null,
          C("Name", t),
          C("Class", r),
          C("File", n),
        ),
      ),
      k &&
        s.createElement(
          "div",
          { className: "submission-args" },
          s.createElement(
            "div",
            { className: "submission-args__head" },
            s.createElement(
              "h6",
              { className: "submission-args__title" },
              "Arguments",
            ),
            s.createElement(
              ot,
              { variant: "outline-primary", size: "sm", onClick: g },
              "Reset to defaults",
            ),
          ),
          Object.entries(x).map(([N, O]) =>
            s.createElement(
              "div",
              { key: N, className: "arg-group" },
              s.createElement("div", { className: "arg-group__title" }, N),
              s.createElement(
                "div",
                { className: "arg-group__body" },
                O.map(({ name: j, argData: D }) =>
                  s.createElement(ak, {
                    key: j,
                    name: j,
                    argInfo: D,
                    value: i[j],
                    onChange: v,
                    onReset: p,
                  }),
                ),
              ),
            ),
          ),
        ),
      s.createElement(
        Z.Group,
        { className: "mt-4 mb-3" },
        s.createElement(Z.Label, null, "Pipeline"),
        s.createElement(Z.Control, {
          type: "text",
          value: c,
          onChange: (N) => f(N.target.value),
          placeholder: "main",
        }),
        s.createElement(
          Z.Text,
          null,
          "Specify which pipeline to submit to (default: main)",
        ),
      ),
      s.createElement(
        "div",
        { className: "d-grid mt-4" },
        s.createElement(Xh, {
          file: n,
          class_name: r,
          repo_rev: l,
          arguments: S(),
          pipeline: c,
          onError: w,
          className: "btn-lg",
        }),
      ),
      s.createElement(
        uc,
        { position: "bottom-end", className: "p-3" },
        s.createElement(
          Nr,
          {
            show: d,
            onClose: () => h(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          s.createElement(
            Nr.Header,
            null,
            s.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          s.createElement(Nr.Body, { className: "text-white" }, y),
        ),
      ),
    ),
  );
}
const ck = { bg: "primary", pill: !1 },
  Cc = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        bg: t,
        pill: n,
        text: r,
        className: o,
        as: l = "span",
        ...a
      },
      i,
    ) => {
      const u = ee(e, "badge");
      return $.exports.jsx(l, {
        ref: i,
        ...a,
        className: X(
          o,
          u,
          n && "rounded-pill",
          r && `text-${r}`,
          t && `bg-${t}`,
        ),
      });
    },
  );
Cc.displayName = "Badge";
Cc.defaultProps = ck;
function fk({ scan: e, schemata: t, onChange: n }) {
  const {
      axes: r = [],
      num_repeats: o = 1,
      no_axes_mode: l = "single",
      randomise_order_globally: a = !1,
      skip_on_persistent_transitory_error: i = !1,
    } = e,
    u = s.useMemo(
      () =>
        t ? Object.values(t).filter((C) => C.spec && C.spec.is_scannable) : [],
      [t],
    ),
    c = new Set(r.map((C) => C.fqn).filter(Boolean)),
    f = () => {
      const C = {
        fqn: "",
        path: "",
        type: "linear",
        range: { start: 0, stop: 100, num_points: 11, randomise_order: !1 },
      };
      n({ ...e, axes: [...r, C] });
    },
    d = (C) => {
      const S = r.filter((N, O) => O !== C);
      n({ ...e, axes: S });
    },
    h = (C, S, N) => {
      const O = [...r];
      if (S === "fqn") {
        const j = t[N];
        O[C] = { ...O[C], fqn: N, path: j ? y() : "" };
      } else if (S.startsWith("range.")) {
        const j = S.split(".")[1];
        O[C] = { ...O[C], range: { ...O[C].range, [j]: N } };
      } else O[C] = { ...O[C], [S]: N };
      n({ ...e, axes: O });
    },
    y = (C) => "",
    E = (C) => {
      n({ ...e, num_repeats: C });
    },
    x = (C) => {
      n({ ...e, num_repeats: C ? 2147483647 : 1 });
    },
    k = (C) => {
      n({ ...e, no_axes_mode: C });
    },
    v = (C) => {
      n({ ...e, randomise_order_globally: C });
    },
    p = (C) => {
      n({ ...e, skip_on_persistent_transitory_error: C });
    },
    g = s.useMemo(
      () =>
        r.length === 0
          ? o
          : r.reduce((C, S) => {
              var O;
              const N = ((O = S.range) == null ? void 0 : O.num_points) || 1;
              return C * N;
            }, 1) * o,
      [r, o],
    ),
    w = o === 2147483647;
  return s.createElement(
    nt,
    { className: "mb-3" },
    s.createElement(
      nt.Header,
      { className: "d-flex justify-content-between align-items-center" },
      s.createElement("span", null, "Scan Configuration"),
      s.createElement(
        Cc,
        { bg: r.length === 0 ? "secondary" : "primary" },
        r.length,
        "D scan, ",
        w ? "\u221E" : g,
        " points",
      ),
    ),
    s.createElement(
      nt.Body,
      null,
      s.createElement("h6", null, "Scan Axes"),
      r.length === 0
        ? s.createElement(
            "p",
            { className: "text-muted small" },
            'No scan axes defined. Click "Add Scan Axis" to create one.',
          )
        : r.map((C, S) => {
            var G, Q, P, M, W, q;
            const N = C.fqn ? t[C.fqn] : null,
              O =
                ((G = N == null ? void 0 : N.spec) == null ? void 0 : G.unit) ||
                "",
              j =
                ((Q = N == null ? void 0 : N.spec) == null
                  ? void 0
                  : Q.scale) || 1,
              D = Dt((P = C.range) == null ? void 0 : P.start, j),
              z = Dt((M = C.range) == null ? void 0 : M.stop, j);
            return s.createElement(
              nt,
              { key: S, className: "mb-2" },
              s.createElement(
                nt.Body,
                { className: "py-2 px-3" },
                s.createElement(
                  $t,
                  { className: "mb-2" },
                  s.createElement(
                    Ue,
                    null,
                    s.createElement(
                      Z.Label,
                      { className: "mb-1 small" },
                      "Parameter",
                    ),
                    s.createElement(
                      Z.Select,
                      {
                        size: "sm",
                        value: C.fqn || "",
                        onChange: (_) => h(S, "fqn", _.target.value),
                      },
                      s.createElement(
                        "option",
                        { value: "" },
                        "Select parameter...",
                      ),
                      u.map((_) =>
                        s.createElement(
                          "option",
                          {
                            key: _.fqn,
                            value: _.fqn,
                            disabled: c.has(_.fqn) && C.fqn !== _.fqn,
                          },
                          _.description || _.fqn,
                        ),
                      ),
                    ),
                  ),
                  s.createElement(
                    Ue,
                    { xs: "auto", className: "d-flex align-items-end" },
                    s.createElement(
                      ot,
                      {
                        variant: "outline-danger",
                        size: "sm",
                        onClick: () => d(S),
                      },
                      "Remove",
                    ),
                  ),
                ),
                s.createElement(
                  $t,
                  { className: "g-2" },
                  s.createElement(
                    Ue,
                    null,
                    s.createElement(
                      Z.Label,
                      { className: "mb-1 small" },
                      "Start",
                    ),
                    s.createElement(
                      he,
                      { size: "sm" },
                      s.createElement(Z.Control, {
                        type: "number",
                        value: D,
                        onChange: (_) => {
                          const I = ga(_.target.value, j);
                          h(S, "range.start", I);
                        },
                        step: "any",
                      }),
                      O && s.createElement(he.Text, null, O),
                    ),
                  ),
                  s.createElement(
                    Ue,
                    null,
                    s.createElement(
                      Z.Label,
                      { className: "mb-1 small" },
                      "Stop",
                    ),
                    s.createElement(
                      he,
                      { size: "sm" },
                      s.createElement(Z.Control, {
                        type: "number",
                        value: z,
                        onChange: (_) => {
                          const I = ga(_.target.value, j);
                          h(S, "range.stop", I);
                        },
                        step: "any",
                      }),
                      O && s.createElement(he.Text, null, O),
                    ),
                  ),
                  s.createElement(
                    Ue,
                    null,
                    s.createElement(
                      Z.Label,
                      { className: "mb-1 small" },
                      "Points",
                    ),
                    s.createElement(Z.Control, {
                      type: "number",
                      size: "sm",
                      value:
                        ((W = C.range) == null ? void 0 : W.num_points) || 11,
                      onChange: (_) =>
                        h(S, "range.num_points", parseInt(_.target.value)),
                      min: "1",
                      step: "1",
                    }),
                  ),
                ),
                s.createElement(Z.Check, {
                  type: "checkbox",
                  className: "mt-2",
                  label: "Randomize order (this axis)",
                  checked:
                    ((q = C.range) == null ? void 0 : q.randomise_order) || !1,
                  onChange: (_) =>
                    h(S, "range.randomise_order", _.target.checked),
                }),
              ),
            );
          }),
      s.createElement(
        ot,
        {
          variant: "outline-primary",
          size: "sm",
          onClick: f,
          className: "mb-3",
        },
        "+ Add Scan Axis",
      ),
      s.createElement("h6", { className: "mt-3" }, "Global Settings"),
      s.createElement(
        $t,
        { className: "g-2 mb-2" },
        s.createElement(
          Ue,
          { md: 6 },
          s.createElement(
            Z.Label,
            { className: "mb-1 small" },
            "Number of Repeats",
          ),
          s.createElement(
            he,
            { size: "sm" },
            s.createElement(Z.Control, {
              type: "number",
              value: w ? "" : o,
              onChange: (C) => E(parseInt(C.target.value) || 1),
              min: "1",
              step: "1",
              disabled: w,
              placeholder: w ? "Infinite" : "",
            }),
            s.createElement(he.Checkbox, {
              checked: w,
              onChange: (C) => x(C.target.checked),
            }),
            s.createElement(he.Text, null, "Infinite"),
          ),
        ),
        s.createElement(
          Ue,
          { md: 6 },
          s.createElement(Z.Label, { className: "mb-1 small" }, "No-Axes Mode"),
          s.createElement(
            Z.Select,
            { size: "sm", value: l, onChange: (C) => k(C.target.value) },
            s.createElement("option", { value: "single" }, "Single (run once)"),
            s.createElement(
              "option",
              { value: "repeat" },
              "Repeat (save only last)",
            ),
            s.createElement(
              "option",
              { value: "time_series" },
              "Time series (save all, with timestamps)",
            ),
          ),
        ),
      ),
      s.createElement(Z.Check, {
        type: "checkbox",
        label: "Randomize order globally",
        checked: a,
        onChange: (C) => v(C.target.checked),
        className: "mb-1",
      }),
      s.createElement(Z.Check, {
        type: "checkbox",
        label: "Skip on persistent/transitory error",
        checked: i,
        onChange: (C) => p(C.target.checked),
      }),
    ),
  );
}
function dk(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    a = s.useMemo(() => pw(o), [o]),
    i = a.schemata,
    [u, c] = s.useState({}),
    [f, d] = s.useState(null);
  s.useState(!1);
  const [h, y] = s.useState(new Set()),
    [E, x] = s.useState(!0),
    [k, v] = s.useState(""),
    [p, g] = s.useState(!1),
    [w, C] = s.useState(""),
    [S, N] = s.useState(() => {
      const T = Ki(n, r);
      return T ? T.pipeline : "main";
    }),
    O = (T) => {
      y((F) => new Set([...F, T]));
    },
    j = (T) => {
      y((F) => {
        const K = new Set(F);
        return K.delete(T), K;
      });
    };
  s.useEffect(() => {
    if (a) {
      const T = vw(n, r);
      (() =>
        (a.always_shown || []).map((K) =>
          K && K.__jsonclass__ && K.__jsonclass__[0] === "tuple"
            ? K.__jsonclass__[1][0][0]
            : (console.error("Unexpected always_shown item format:", K), ""),
        ))(),
        T && T.visibleFqns ? y(new Set(T.visibleFqns)) : y(new Set()),
        T ? (c(T.overrides || {}), d(T.scan || a.scan)) : (c({}), d(a.scan));
    }
  }, [a, n, r]),
    s.useEffect(() => {
      f &&
        (gw(n, r, {
          overrides: u,
          scan: f,
          visibleFqns: [...h],
          useDefaultVisibility: E,
        }),
        yv(n, r, { pipeline: S }));
    }, [u, f, n, r, h, E, S]);
  const D = s.useMemo(() => (a ? mw(a.instances) : {}), [a]),
    z = s.useMemo(() => (f ? hw(f) : new Set()), [f]),
    G = (T, F) => {
      c((K) => ({ ...K, [T]: F }));
    },
    Q = (T) => {
      c((F) => {
        const K = { ...F };
        return delete K[T], K;
      });
    },
    P = (T) => {
      d(T);
    },
    M = () => {
      a && (c({}), d(a.scan), localStorage.removeItem(pc(n, r)));
    },
    W = (T) => {
      C(T), g(!0);
    },
    q = (T, F) =>
      s.createElement(
        "tr",
        { key: T },
        s.createElement("td", null, s.createElement("b", null, T, ":")),
        s.createElement("td", null, F),
      ),
    _ = (T, F) => {
      const { description: K, type: Y } = F,
        J = z.has(T),
        se = u[T];
      let te;
      if (Y === "float") te = nk;
      else if (Y === "int") te = rk;
      else if (Y === "bool") te = ok;
      else return null;
      return s.createElement(
        Z.Group,
        { key: T, className: "mb-2 row align-items-center" },
        s.createElement(
          "div",
          { className: "col-4" },
          s.createElement(
            Z.Label,
            { className: "mb-0", style: { fontWeight: 500 } },
            K || T,
          ),
        ),
        s.createElement(
          "div",
          { className: "col-8" },
          s.createElement(te, {
            schema: F,
            value: se,
            onChange: G,
            onReset: Q,
            disabled: J,
          }),
        ),
      );
    },
    I = () => {
      if (a) {
        const T = new Set(Object.keys(u)),
          F = [...z].filter((K) => T.has(K));
        return F.length > 0
          ? (W(
              `Parameters cannot be both overridden and scanned: ${F.join(
                ", ",
              )}`,
            ),
            null)
          : yw(a, u, f, D, h);
      }
      return {};
    };
  if (!a) return null;
  const b = (a.always_shown || []).map((T) =>
      Array.isArray(T)
        ? T[0]
        : T && T.__jsonclass__ && T.__jsonclass__[0] === "tuple"
          ? T.__jsonclass__[1][0][0]
          : T,
    ),
    A = new Set([...(E ? b : []), ...h]),
    V = k
      ? Object.entries(i).filter(
          ([T, F]) =>
            T.toLowerCase().includes(k.toLowerCase()) ||
            (F.description &&
              F.description.toLowerCase().includes(k.toLowerCase())),
        )
      : [];
  return s.createElement(
    nt,
    { className: "shadow-sm border-0" },
    s.createElement(
      nt.Header,
      { className: "bg-primary text-white py-3" },
      s.createElement(
        "div",
        { className: "d-flex justify-content-between align-items-center" },
        s.createElement(
          "h5",
          { className: "mb-0" },
          r,
          " ",
          s.createElement(
            "span",
            {
              className: "badge bg-info ms-2 small",
              style: { fontSize: "0.6em" },
            },
            "NDScan",
          ),
        ),
        s.createElement("small", { className: "opacity-75" }, n),
      ),
    ),
    s.createElement(
      nt.Body,
      { className: "p-4" },
      s.createElement(
        ma,
        { striped: !0, bordered: !0, hover: !0, size: "sm", className: "mb-4" },
        s.createElement(
          "tbody",
          null,
          q("Name", t),
          q("Class name", r),
          q("File", n),
        ),
      ),
      s.createElement(
        "div",
        { className: "mt-3" },
        s.createElement(
          "div",
          {
            className: "d-flex justify-content-between align-items-center mb-2",
          },
          s.createElement("h6", { className: "mb-0" }, "NDScan Parameters"),
          s.createElement(Z.Check, {
            type: "switch",
            label: "Use Always Shown defaults",
            checked: E,
            onChange: (T) => {
              x(T.target.checked);
            },
            size: "sm",
            className: "small",
          }),
        ),
        s.createElement(
          nt,
          { className: "mb-3 parameter-adder" },
          s.createElement(
            nt.Body,
            { className: "p-2" },
            s.createElement(
              Z.Label,
              { className: "small fw-bold" },
              "Add / Toggle Parameters",
            ),
            s.createElement(
              he,
              { size: "sm", className: "mb-2" },
              s.createElement(
                he.Text,
                { "aria-hidden": "true" },
                s.createElement(Sh, null),
              ),
              s.createElement(Z.Control, {
                placeholder:
                  "Search available parameters by FQN or Description...",
                value: k,
                onChange: (T) => v(T.target.value),
                onKeyDown: (T) => {
                  T.key === "Escape" && v("");
                },
              }),
            ),
            s.createElement(
              "div",
              {
                className: "overflow-auto",
                style: {
                  maxHeight: "300px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                },
              },
              (() => {
                if (k)
                  return V.length === 0
                    ? s.createElement(
                        "div",
                        { className: "p-2 text-center text-muted small" },
                        "No parameters found",
                      )
                    : V.map(([T, F]) =>
                        s.createElement(
                          "div",
                          {
                            key: T,
                            className:
                              "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                            style: {
                              backgroundColor: A.has(T)
                                ? "#e7f1ff"
                                : "transparent",
                            },
                            onClick: () => {
                              window.innerWidth < 768 &&
                                (A.has(T) ? j(T) : O(T));
                            },
                          },
                          s.createElement(
                            "div",
                            {
                              className: "text-truncate",
                              style: { maxWidth: "70%" },
                            },
                            s.createElement("strong", null, T),
                            s.createElement("br", null),
                            s.createElement(
                              "span",
                              { className: "text-muted" },
                              F.description,
                            ),
                          ),
                          s.createElement(
                            ot,
                            {
                              size: "sm",
                              variant: A.has(T)
                                ? "outline-danger"
                                : "outline-primary",
                              onClick: (K) => {
                                K.stopPropagation(), A.has(T) ? j(T) : O(T);
                              },
                              style: { padding: "0 0.5rem" },
                              className: "desktop-only",
                            },
                            A.has(T) ? "Hide" : "Show",
                          ),
                        ),
                      );
                {
                  const T = {};
                  return (
                    console.log(i),
                    Object.entries(i).forEach(([F, K]) => {
                      const Y = F.split("."),
                        J = Y.length > 1 ? Y.slice(0, -1).join(".") : "Root";
                      T[J] || (T[J] = []), T[J].push([F, K]);
                    }),
                    s.createElement(
                      ct,
                      { flush: !0 },
                      Object.entries(T)
                        .sort(([F], [K]) => F.localeCompare(K))
                        .map(([F, K]) =>
                          s.createElement(
                            ct.Item,
                            { key: F, eventKey: F },
                            s.createElement(
                              ct.Header,
                              { className: "py-1" },
                              s.createElement(
                                "small",
                                { className: "fw-bold" },
                                F,
                              ),
                              s.createElement(
                                "small",
                                { className: "text-muted ms-2" },
                                "(",
                                K.length,
                                ")",
                              ),
                            ),
                            s.createElement(
                              ct.Body,
                              { className: "p-0" },
                              K.map(([Y, J]) =>
                                s.createElement(
                                  "div",
                                  {
                                    key: Y,
                                    className:
                                      "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                                    style: {
                                      backgroundColor: A.has(Y)
                                        ? "#e7f1ff"
                                        : "transparent",
                                    },
                                    onClick: () => {
                                      window.innerWidth < 768 &&
                                        (A.has(Y) ? j(Y) : O(Y));
                                    },
                                  },
                                  s.createElement(
                                    "div",
                                    {
                                      className: "text-truncate",
                                      style: { maxWidth: "70%" },
                                    },
                                    s.createElement(
                                      "strong",
                                      null,
                                      Y.split(".").pop(),
                                    ),
                                    s.createElement("br", null),
                                    s.createElement(
                                      "span",
                                      { className: "text-muted" },
                                      J.description,
                                    ),
                                  ),
                                  s.createElement(
                                    ot,
                                    {
                                      size: "sm",
                                      variant: A.has(Y)
                                        ? "outline-danger"
                                        : "outline-primary",
                                      onClick: (se) => {
                                        se.stopPropagation(),
                                          A.has(Y) ? j(Y) : O(Y);
                                      },
                                      style: { padding: "0 0.5rem" },
                                      className: "desktop-only",
                                    },
                                    A.has(Y) ? "Hide" : "Show",
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                    )
                  );
                }
              })(),
            ),
          ),
        ),
        A.size === 0 &&
          s.createElement(
            "div",
            {
              className:
                "text-center p-3 border rounded bg-secondary bg-opacity-25 text-muted small mb-3",
            },
            "No parameters are currently visible. Use the search above to add parameters.",
          ),
        A.size > 0 &&
          Array.from(A).map((T) => {
            const F = i[T];
            return F
              ? s.createElement(
                  "div",
                  {
                    key: T,
                    className:
                      "ndscan-param-row border-bottom py-2 px-1 d-flex align-items-start",
                  },
                  s.createElement("div", { className: "flex-grow-1" }, _(T, F)),
                  s.createElement(
                    ot,
                    {
                      variant: "link",
                      size: "sm",
                      className:
                        "text-muted p-0 ms-2 d-inline-flex align-items-center",
                      onClick: () => j(T),
                      title: "Hide parameter",
                      "aria-label": "Hide parameter",
                    },
                    s.createElement(Nh, { size: 16, "aria-hidden": "true" }),
                  ),
                )
              : null;
          }),
        f && s.createElement(fk, { scan: f, schemata: i, onChange: P }),
        s.createElement(
          ot,
          {
            variant: "outline-secondary",
            size: "sm",
            onClick: M,
            className: "mb-3",
          },
          "Reset All to Defaults",
        ),
      ),
      s.createElement(
        Z.Group,
        { className: "mt-3 mb-2" },
        s.createElement(Z.Label, null, "Pipeline"),
        s.createElement(Z.Control, {
          type: "text",
          value: S,
          onChange: (T) => N(T.target.value),
          placeholder: "main",
        }),
        s.createElement(
          Z.Text,
          { className: "text-muted" },
          "Specify which pipeline to submit to (default: main)",
        ),
      ),
      s.createElement(
        "div",
        { className: "d-grid mt-4" },
        s.createElement(Xh, {
          file: n,
          class_name: r,
          repo_rev: l,
          arguments: I(),
          pipeline: S,
          onError: W,
          className: "btn-lg",
        }),
      ),
      s.createElement(
        uc,
        { position: "bottom-end", className: "p-3" },
        s.createElement(
          Nr,
          {
            show: p,
            onClose: () => g(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          s.createElement(
            Nr.Header,
            null,
            s.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          s.createElement(Nr.Body, { className: "text-white" }, w),
        ),
      ),
    ),
  );
}
function pk({ explist: e, experiment: t, repo_rev: n }) {
  const [r, o] = s.useState(null),
    [l, a] = s.useState(!1),
    u = ((d) =>
      !d || !e || !e.experiments
        ? null
        : e.experiments.find((h) => `${h.file}:${h.class_name}` === d))(t);
  if (
    (s.useEffect(() => {
      if (!u) {
        o(null);
        return;
      }
      a(!0),
        o(null),
        SE(u.file, u.class_name)
          .then((d) => o(d.arginfo))
          .catch((d) => console.error("Failed to fetch arginfo:", d.message))
          .finally(() => a(!1));
    }, [t]),
    !u)
  )
    return s.createElement(
      "div",
      { className: "submission-empty" },
      s.createElement("div", { className: "eyebrow" }, "Submit"),
      s.createElement("h5", null, "No experiment selected"),
      s.createElement(
        "p",
        null,
        "Select an experiment from the browser above to configure and submit it.",
      ),
    );
  if (l)
    return s.createElement(
      "div",
      { className: "submission-empty" },
      s.createElement("div", { className: "eyebrow" }, "Submit"),
      s.createElement("p", null, "Loading experiment parameters\u2026"),
    );
  const c = { ...u, arginfo: r },
    f = dw(r) ? dk : uk;
  return s.createElement(
    "div",
    { className: "mt-4" },
    s.createElement(
      "div",
      { className: "submission-form-container" },
      s.createElement(f, { data: c, repo_rev: n }),
    ),
  );
}
function mk(e) {
  var t = m.exports.useRef(null);
  return (
    m.exports.useEffect(function () {
      t.current = e;
    }),
    t.current
  );
}
const hk = ["onKeyDown"];
function vk(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function gk(e) {
  return !e || e.trim() === "#";
}
const xv = m.exports.forwardRef((e, t) => {
  let { onKeyDown: n } = e,
    r = vk(e, hk);
  const [o] = oc(Object.assign({ tagName: "a" }, r)),
    l = He((a) => {
      o.onKeyDown(a), n == null || n(a);
    });
  return gk(r.href) || r.role === "button"
    ? $.exports.jsx("a", Object.assign({ ref: t }, r, o, { onKeyDown: l }))
    : $.exports.jsx("a", Object.assign({ ref: t }, r, { onKeyDown: n }));
});
xv.displayName = "Anchor";
const Ev = Ha("h4");
Ev.displayName = "DivStyledAsH4";
const yk = De("alert-heading", { Component: Ev }),
  xk = De("alert-link", { Component: xv }),
  Ek = {
    variant: "primary",
    show: !0,
    transition: sn,
    closeLabel: "Close alert",
  },
  Nc = m.exports.forwardRef((e, t) => {
    const {
        bsPrefix: n,
        show: r,
        closeLabel: o,
        closeVariant: l,
        className: a,
        children: i,
        variant: u,
        onClose: c,
        dismissible: f,
        transition: d,
        ...h
      } = Oh(e, { show: "onClose" }),
      y = ee(n, "alert"),
      E = He((v) => {
        c && c(!1, v);
      }),
      x = d === !0 ? sn : d,
      k = $.exports.jsxs("div", {
        role: "alert",
        ...(x ? void 0 : h),
        ref: t,
        className: X(a, y, u && `${y}-${u}`, f && `${y}-dismissible`),
        children: [
          f && $.exports.jsx(Vr, { onClick: E, "aria-label": o, variant: l }),
          i,
        ],
      });
    return x
      ? $.exports.jsx(x, {
          unmountOnExit: !0,
          ...h,
          ref: void 0,
          in: r,
          children: k,
        })
      : r
        ? k
        : null;
  });
Nc.displayName = "Alert";
Nc.defaultProps = Ek;
const Ea = Object.assign(Nc, { Link: xk, Heading: yk }),
  Rc = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        variant: t,
        animation: n = "border",
        size: r,
        as: o = "div",
        className: l,
        ...a
      },
      i,
    ) => {
      e = ee(e, "spinner");
      const u = `${e}-${n}`;
      return $.exports.jsx(o, {
        ref: i,
        ...a,
        className: X(l, u, r && `${u}-${r}`, t && `text-${t}`),
      });
    },
  );
Rc.displayName = "Spinner";
function wk(e) {
  const t = {};
  return (
    e.forEach((n) => {
      const r = n.split(".");
      let o = t;
      r.forEach((l, a) => {
        o[l] ||
          (o[l] = {
            isLeaf: a === r.length - 1,
            fullPath: r.slice(0, a + 1).join("."),
            children: {},
          }),
          (o = o[l].children);
      });
    }),
    t
  );
}
function Oc({
  name: e,
  node: t,
  selectedDatasets: n,
  onSelect: r,
  level: o = 0,
}) {
  const [l, a] = m.exports.useState(o === 0),
    i = () => {
      t.isLeaf ? r(t.fullPath) : a(!l);
    },
    u = n.includes(t.fullPath);
  return (
    Object.keys(t.children).length > 0,
    s.createElement(
      "div",
      null,
      s.createElement(
        "div",
        {
          className: `dataset-tree-node ${u ? "selected" : ""} ${
            t.isLeaf ? "leaf" : "branch"
          }`,
          style: {
            paddingLeft: `${o * 20 + 8}px`,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "4px",
            marginBottom: "2px",
          },
          onClick: i,
        },
        !t.isLeaf &&
          s.createElement(
            "span",
            { className: "me-1" },
            l
              ? s.createElement(Ex, { size: 14 })
              : s.createElement(ec, { size: 14 }),
          ),
        t.isLeaf &&
          s.createElement(
            "span",
            {
              className: "me-2 dataset-tree-node__leaf-icon",
              "aria-hidden": "true",
            },
            s.createElement(gh, { size: 14 }),
          ),
        s.createElement("span", null, e),
        !t.isLeaf &&
          s.createElement(
            "span",
            { className: "text-muted ms-2 small" },
            "(",
            Object.keys(t.children).length,
            ")",
          ),
      ),
      !t.isLeaf &&
        l &&
        s.createElement(
          "div",
          null,
          Object.entries(t.children).map(([c, f]) =>
            s.createElement(Oc, {
              key: f.fullPath,
              name: c,
              node: f,
              selectedDatasets: n,
              onSelect: r,
              level: o + 1,
            }),
          ),
        ),
    )
  );
}
Oc.propTypes = {
  name: R.exports.string.isRequired,
  node: R.exports.object.isRequired,
  selectedDatasets: R.exports.array.isRequired,
  onSelect: R.exports.func.isRequired,
  level: R.exports.number,
};
function wv({ datasetNames: e, selectedDatasets: t, onSelect: n }) {
  const r = wk(e);
  return e.length === 0
    ? s.createElement(
        "div",
        { className: "text-muted" },
        "No datasets available",
      )
    : s.createElement(
        "div",
        { className: "dataset-tree" },
        Object.entries(r).map(([o, l]) =>
          s.createElement(Oc, {
            key: l.fullPath,
            name: o,
            node: l,
            selectedDatasets: t,
            onSelect: n,
            level: 0,
          }),
        ),
      );
}
wv.propTypes = {
  datasetNames: R.exports.array.isRequired,
  selectedDatasets: R.exports.array.isRequired,
  onSelect: R.exports.func.isRequired,
};
function Sv({ name: e, datasetData: t }) {
  if (!t) return s.createElement("div", { className: "text-muted" }, "No data");
  const [n, r, o] = t,
    l = (a) =>
      a == null
        ? s.createElement("span", { className: "text-muted" }, "null")
        : typeof a == "boolean"
          ? s.createElement("span", { className: "text-info" }, a.toString())
          : typeof a == "number"
            ? s.createElement("span", { className: "text-success" }, a)
            : typeof a == "string"
              ? s.createElement(
                  "span",
                  { className: "text-warning" },
                  '"',
                  a,
                  '"',
                )
              : Array.isArray(a)
                ? a.length === 0
                  ? s.createElement("span", { className: "text-muted" }, "[]")
                  : a.length <= 5
                    ? s.createElement(
                        "span",
                        null,
                        "[",
                        a.map((i, u) =>
                          s.createElement(
                            "span",
                            { key: u },
                            u > 0 && ", ",
                            l(i),
                          ),
                        ),
                        "]",
                      )
                    : s.createElement(
                        "details",
                        null,
                        s.createElement(
                          "summary",
                          null,
                          "Array (",
                          a.length,
                          " elements)",
                        ),
                        s.createElement(
                          "pre",
                          { className: "mt-2 p-2 bg-dark border rounded" },
                          JSON.stringify(a, null, 2),
                        ),
                      )
                : typeof a == "object"
                  ? s.createElement(
                      "details",
                      null,
                      s.createElement("summary", null, "Object"),
                      s.createElement(
                        "pre",
                        { className: "mt-2 p-2 bg-dark border rounded" },
                        JSON.stringify(a, null, 2),
                      ),
                    )
                  : s.createElement("span", null, String(a));
  return s.createElement(
    "div",
    { className: "dataset-value" },
    s.createElement(
      "div",
      { className: "mb-2" },
      s.createElement("strong", null, e),
      n &&
        s.createElement(
          "span",
          { className: "badge bg-secondary ms-2" },
          "persistent",
        ),
    ),
    s.createElement("div", { className: "ms-3" }, l(r)),
    o &&
      Object.keys(o).length > 0 &&
      s.createElement(
        "details",
        { className: "mt-2 ms-3" },
        s.createElement(
          "summary",
          { className: "text-muted small" },
          "Metadata",
        ),
        s.createElement(
          "pre",
          { className: "mt-1 p-2 bg-dark border rounded small" },
          JSON.stringify(o, null, 2),
        ),
      ),
  );
}
Sv.propTypes = {
  name: R.exports.string.isRequired,
  datasetData: R.exports.array,
};
function Sk() {
  const [e, t] = m.exports.useState([]),
    [n, r] = m.exports.useState([]),
    [o, l] = m.exports.useState(""),
    [a, i] = m.exports.useState([]),
    [u, c] = m.exports.useState({}),
    [f, d] = m.exports.useState(!0),
    [h, y] = m.exports.useState(null);
  m.exports.useEffect(() => {
    const p = async () => {
      try {
        const w = await jh();
        t(w.names), r(w.names), y(null);
      } catch (w) {
        y(`Failed to load datasets: ${w.message}`);
      } finally {
        d(!1);
      }
    };
    p();
    const g = setInterval(p, 5e3);
    return () => clearInterval(g);
  }, []),
    m.exports.useEffect(() => {
      if (o.trim() === "") r(e);
      else {
        const p = o.toLowerCase();
        r(e.filter((g) => g.toLowerCase().includes(p)));
      }
    }, [o, e]);
  const [E, x] = Yu();
  m.exports.useEffect(() => {
    const p = E.getAll("select");
    p.length > 0 &&
      (i(p),
      xo(p)
        .then((g) => {
          c((w) => ({ ...w, ...g }));
        })
        .catch((g) => console.error(g)));
  }, []);
  const k = async (p) => {
      let g;
      if (a.includes(p)) {
        g = a.filter((C) => C !== p);
        const w = { ...u };
        delete w[p], c(w);
      } else {
        g = [...a, p];
        try {
          const w = await xo([p]);
          c({ ...u, ...w });
        } catch (w) {
          y(`Failed to load dataset value: ${w.message}`);
        }
      }
      i(g),
        x((w) => {
          const C = new URLSearchParams(w);
          return C.delete("select"), g.forEach((S) => C.append("select", S)), C;
        });
    },
    v = async () => {
      if (a.length !== 0)
        try {
          const p = await xo(a);
          c(p), y(null);
        } catch (p) {
          y(`Failed to refresh dataset values: ${p.message}`);
        }
    };
  return f
    ? s.createElement(
        "div",
        { className: "text-center p-4" },
        s.createElement(
          Rc,
          { animation: "border", role: "status" },
          s.createElement(
            "span",
            { className: "visually-hidden" },
            "Loading...",
          ),
        ),
      )
    : s.createElement(
        "div",
        { className: "dataset-explorer" },
        h &&
          s.createElement(
            Ea,
            { variant: "danger", dismissible: !0, onClose: () => y(null) },
            h,
          ),
        s.createElement(
          Z.Group,
          { className: "mb-3" },
          s.createElement(Z.Control, {
            type: "text",
            placeholder: "Search datasets...",
            value: o,
            onChange: (p) => l(p.target.value),
          }),
        ),
        s.createElement(
          "div",
          { className: "row" },
          s.createElement(
            "div",
            { className: "col-md-6" },
            s.createElement("h5", null, "Available Datasets (", e.length, ")"),
            s.createElement(
              "div",
              {
                className: "border rounded p-2",
                style: { maxHeight: "500px", overflowY: "auto" },
              },
              s.createElement(wv, {
                datasetNames: n,
                selectedDatasets: a,
                onSelect: k,
              }),
            ),
          ),
          s.createElement(
            "div",
            { className: "col-md-6" },
            s.createElement(
              "div",
              {
                className:
                  "d-flex justify-content-between align-items-center mb-2",
              },
              s.createElement("h5", null, "Selected Datasets (", a.length, ")"),
              s.createElement(
                "button",
                {
                  className:
                    "btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1",
                  onClick: v,
                  disabled: a.length === 0,
                  "aria-label": "Refresh selected datasets",
                },
                s.createElement(ch, { "aria-hidden": "true" }),
                " Refresh",
              ),
            ),
            s.createElement(
              "div",
              {
                className: "border rounded p-3",
                style: { maxHeight: "500px", overflowY: "auto" },
              },
              a.length === 0
                ? s.createElement(
                    "div",
                    { className: "text-muted" },
                    "Click on a dataset to view its value",
                  )
                : a.map((p) =>
                    s.createElement(
                      "div",
                      { key: p, className: "mb-3 pb-3 border-bottom" },
                      s.createElement(Sv, { name: p, datasetData: u[p] }),
                    ),
                  ),
            ),
          ),
        ),
      );
}
const kk = window.location.origin,
  Be = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    RECONNECTING: "reconnecting",
    ERROR: "error",
    CLOSED: "closed",
  };
function Ck(e, t = {}) {
  const { enabled: n = !0, reconnectDelay: r = 3e3 } = t,
    [o, l] = m.exports.useState(null),
    [a, i] = m.exports.useState(Be.CLOSED),
    [u, c] = m.exports.useState(null),
    f = m.exports.useRef(null),
    d = m.exports.useRef(null),
    h = m.exports.useRef(!0),
    y = m.exports.useRef(0),
    E = m.exports.useCallback((v) => {
      l((p) => (p ? { ...p, ...v } : v));
    }, []),
    x = m.exports.useCallback((v) => {
      l((p) => {
        if (!p) return p;
        const g = { ...p };
        return delete g[v], g;
      });
    }, []),
    k = m.exports.useCallback(() => {
      if (!e || !n) return;
      const v = Date.now(),
        p = v - y.current,
        g = 1e3;
      if (p < g) {
        const S = g - p;
        d.current = setTimeout(() => {
          h.current && n && k();
        }, S);
        return;
      }
      (y.current = v),
        f.current && f.current.close(),
        i(Be.CONNECTING),
        c(null);
      const w = `${kk}/api/datasets/stream/${encodeURIComponent(e)}`,
        C = new EventSource(w);
      (f.current = C),
        C.addEventListener("init", (S) => {
          if (!!h.current)
            try {
              const N = JSON.parse(S.data);
              l(N), i(Be.CONNECTED), c(null);
            } catch (N) {
              console.error("Failed to parse init event:", N);
            }
        }),
        C.addEventListener("update", (S) => {
          if (!!h.current)
            try {
              const N = JSON.parse(S.data);
              E(N);
            } catch (N) {
              console.error("Failed to parse update event:", N);
            }
        }),
        C.addEventListener("delete", (S) => {
          if (!!h.current)
            try {
              const { key: N } = JSON.parse(S.data);
              x(N);
            } catch (N) {
              console.error("Failed to parse delete event:", N);
            }
        }),
        C.addEventListener("heartbeat", () => {
          !h.current || i((S) => (S === Be.CONNECTED ? S : Be.CONNECTED));
        }),
        C.addEventListener("error", (S) => {
          if (!!h.current)
            try {
              const N = JSON.parse(S.data);
              c(N.message), i(Be.ERROR);
            } catch {
              i(Be.ERROR);
            }
        }),
        (C.onerror = () => {
          !h.current ||
            (C.close(),
            i(Be.RECONNECTING),
            (d.current = setTimeout(() => {
              h.current && n && k();
            }, r)));
        }),
        (C.onopen = () => {
          h.current;
        });
    }, [e, n, r, E, x]);
  return (
    m.exports.useEffect(
      () => (
        (h.current = !0),
        n && e && k(),
        () => {
          (h.current = !1),
            f.current && (f.current.close(), (f.current = null)),
            d.current && (clearTimeout(d.current), (d.current = null)),
            i(Be.CLOSED);
        }
      ),
      [e, n, k],
    ),
    {
      data: o,
      connectionState: a,
      error: u,
      isConnected: a === Be.CONNECTED,
      isConnecting: a === Be.CONNECTING || a === Be.RECONNECTING,
    }
  );
}
function wa({ dims: e, size: t = 14, accent: n = !1 }) {
  const r = n ? "var(--p-accent)" : "var(--p-ink70)";
  return s.createElement(
    "svg",
    {
      width: t,
      height: t,
      viewBox: "0 0 14 14",
      style: { flex: "0 0 auto" },
      "aria-label": `${e} scan`,
    },
    e === "1D" &&
      s.createElement("polyline", {
        points: "1,11 4,7 7,9 10,4 13,6",
        fill: "none",
        stroke: r,
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    e === "2D" &&
      s.createElement(
        "g",
        null,
        s.createElement("rect", {
          x: "2",
          y: "2",
          width: "10",
          height: "10",
          fill: "none",
          stroke: r,
          strokeWidth: "1.2",
        }),
        [2, 4, 6, 8, 10].map((o) =>
          s.createElement("line", {
            key: o,
            x1: o,
            y1: "2",
            x2: o,
            y2: "12",
            stroke: r,
            strokeWidth: "0.6",
            opacity: "0.5",
          }),
        ),
      ),
    e === "0D" &&
      s.createElement("circle", { cx: "7", cy: "7", r: "2.6", fill: r }),
  );
}
wa.propTypes = {
  dims: R.exports.oneOf(["0D", "1D", "2D"]),
  size: R.exports.number,
  accent: R.exports.bool,
};
function kv({ recentRuns: e, currentPrefix: t, onPick: n }) {
  const [r, o] = m.exports.useState(!1),
    [l, a] = m.exports.useState(""),
    i = m.exports.useRef(null);
  m.exports.useEffect(() => {
    const d = (h) => {
      i.current && !i.current.contains(h.target) && o(!1);
    };
    return (
      document.addEventListener("mousedown", d),
      () => document.removeEventListener("mousedown", d)
    );
  }, []);
  const u = e.find((d) => d.prefix === t) || e[0],
    c = m.exports.useMemo(() => {
      if (!l.trim()) return e;
      const d = l.toLowerCase();
      return e.filter((h) => {
        var y, E, x;
        return `${(y = h.rid) != null ? y : ""} ${
          (E = h.expName) != null ? E : ""
        } ${(x = h.prefix) != null ? x : ""}`
          .toLowerCase()
          .includes(d);
      });
    }, [e, l]),
    f = m.exports.useMemo(() => {
      const d = new Map();
      for (const h of c)
        d.has(h.expName) || d.set(h.expName, { dims: h.dims, runs: [] }),
          d.get(h.expName).runs.push(h);
      return [...d.entries()];
    }, [c]);
  return u
    ? s.createElement(
        "div",
        { ref: i, style: { position: "relative" } },
        s.createElement(
          "button",
          {
            className: "p-btn",
            onClick: () => o((d) => !d),
            style: { height: 30, paddingRight: 6 },
          },
          s.createElement(wa, { dims: u.dims, accent: !0 }),
          s.createElement(
            "span",
            {
              className: "p-mono",
              style: { color: "var(--p-accent)", fontWeight: 600 },
            },
            u.rid != null ? `#${u.rid}` : u.prefix,
          ),
          s.createElement("span", { style: { fontWeight: 600 } }, u.expName),
          s.createElement(
            "span",
            { className: "p-dim", style: { fontSize: 11, marginLeft: 4 } },
            "\u25BE",
          ),
        ),
        r &&
          s.createElement(
            "div",
            {
              className: "p-panel",
              style: {
                position: "absolute",
                top: 36,
                left: 0,
                width: 440,
                maxHeight: 460,
                zIndex: 50,
                boxShadow: "0 12px 32px rgba(0,0,0,.14)",
                padding: 0,
                display: "flex",
                flexDirection: "column",
              },
            },
            s.createElement(
              "div",
              {
                style: {
                  padding: 8,
                  borderBottom: "1px solid var(--p-border)",
                },
              },
              s.createElement("input", {
                className: "p-search p-mono",
                autoFocus: !0,
                placeholder: "search runs \xB7 RID \xB7 experiment",
                value: l,
                onChange: (d) => a(d.target.value),
              }),
            ),
            s.createElement(
              "div",
              {
                className: "p-scroll",
                style: { flex: 1, padding: "4px 4px 8px" },
              },
              f.length === 0 &&
                s.createElement(
                  "div",
                  {
                    style: {
                      padding: 18,
                      textAlign: "center",
                      color: "var(--p-ink50)",
                      fontSize: 12,
                    },
                  },
                  "no matches",
                ),
              f.map(([d, h]) =>
                s.createElement(
                  "div",
                  { key: d, style: { padding: "4px 4px 6px" } },
                  s.createElement(
                    "div",
                    {
                      className: "p-lbl",
                      style: {
                        padding: "6px 8px 4px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      },
                    },
                    s.createElement(wa, { dims: h.dims, size: 11 }),
                    s.createElement(
                      "span",
                      {
                        style: { overflow: "hidden", textOverflow: "ellipsis" },
                      },
                      d,
                    ),
                    s.createElement(
                      "span",
                      { className: "p-dim", style: { marginLeft: "auto" } },
                      "\xB7 ",
                      h.runs.length,
                    ),
                  ),
                  h.runs.map((y) =>
                    s.createElement(
                      "div",
                      {
                        key: y.prefix,
                        className: "p-row" + (y.prefix === t ? " on" : ""),
                        onClick: () => {
                          n(y), o(!1);
                        },
                        style: {
                          alignItems: "center",
                          gap: 10,
                          whiteSpace: "nowrap",
                        },
                      },
                      s.createElement(
                        "span",
                        {
                          className: "p-mono",
                          style: {
                            color: "var(--p-accent)",
                            minWidth: 64,
                            fontWeight: 500,
                          },
                        },
                        y.rid != null ? `#${y.rid}` : y.prefix,
                      ),
                      s.createElement(
                        "span",
                        {
                          className: "p-dim p-mono",
                          style: {
                            fontSize: 10.5,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        },
                        y.prefix,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            s.createElement(
              "div",
              {
                style: {
                  padding: "8px 12px",
                  borderTop: "1px solid var(--p-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                },
              },
              s.createElement(
                "span",
                { className: "p-dim" },
                e.length,
                " runs across",
                " ",
                new Set(e.map((d) => d.expName)).size,
                " experiments",
              ),
            ),
          ),
      )
    : s.createElement(
        "button",
        { className: "p-btn", disabled: !0 },
        s.createElement("span", { className: "p-dim" }, "no scans"),
      );
}
kv.propTypes = {
  recentRuns: R.exports.array.isRequired,
  currentPrefix: R.exports.string,
  onPick: R.exports.func.isRequired,
};
function Nk() {
  return s.createElement(
    "span",
    { className: "p-wordmark", style: { fontSize: 13 } },
    "ARTIQ",
    s.createElement("span", { className: "p-dot" }),
    s.createElement(
      "span",
      { style: { fontWeight: 500, color: "var(--p-ink70)" } },
      "plots",
    ),
  );
}
function Cv({ onCopy: e }) {
  const [t, n] = m.exports.useState("idle"),
    r = async () => {
      if (t === "idle") {
        n("copying");
        try {
          await e(), n("copied"), setTimeout(() => n("idle"), 1500);
        } catch (o) {
          console.error("Plot copy failed:", o), n("idle");
        }
      }
    };
  return s.createElement(
    "button",
    {
      className: "p-btn ghost icon",
      title: t === "copied" ? "Copied!" : "Copy plot as PNG",
      "aria-label": "copy plot as PNG",
      onClick: r,
      disabled: t === "copying",
      style: t === "copied" ? { color: "var(--p-ok)" } : void 0,
    },
    t === "copied"
      ? s.createElement(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
          },
          s.createElement("polyline", { points: "20 6 9 17 4 12" }),
        )
      : s.createElement(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
          },
          s.createElement("rect", {
            x: "9",
            y: "2",
            width: "6",
            height: "4",
            rx: "1",
          }),
          s.createElement("path", {
            d: "M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3",
          }),
        ),
  );
}
function Gi({
  recentRuns: e,
  currentPrefix: t,
  onPick: n,
  progress: r,
  status: o,
  onCopy: l,
}) {
  const a = Aa();
  return s.createElement(
    "div",
    { className: "p-topbar" },
    s.createElement(Nk, null),
    s.createElement(
      "span",
      { className: "p-dim2", style: { fontSize: 11 } },
      "/",
    ),
    s.createElement(kv, { recentRuns: e, currentPrefix: t, onPick: n }),
    o === "live" &&
      s.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 6 } },
        s.createElement("span", { className: "p-live-dot" }),
        s.createElement(
          "span",
          {
            className: "p-mono",
            style: { color: "var(--p-live)", fontSize: 11.5 },
          },
          "LIVE",
        ),
        r &&
          s.createElement(
            "span",
            { className: "p-mono p-dim", style: { fontSize: 11.5 } },
            "\xB7 ",
            r,
          ),
      ),
    o === "done" &&
      s.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 6 } },
        s.createElement("span", { className: "p-pill ok" }, "\u2713 done"),
      ),
    o === "error" &&
      s.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 6 } },
        s.createElement(
          "span",
          {
            className: "p-pill",
            style: {
              background: "color-mix(in oklab, var(--p-err) 14%, transparent)",
              color: "var(--p-err)",
            },
          },
          "! error",
        ),
      ),
    o === "connecting" &&
      s.createElement(
        "span",
        { className: "p-mono p-dim", style: { fontSize: 11.5 } },
        "connecting\u2026",
      ),
    l && s.createElement(Cv, { onCopy: l }),
    s.createElement(
      "button",
      {
        className: "p-btn ghost icon",
        title: "fullscreen",
        "aria-label": "open fullscreen",
        onClick: () => a("/plots/fullscreen"),
      },
      s.createElement(
        "svg",
        {
          width: "14",
          height: "14",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
        },
        s.createElement("polyline", { points: "15 3 21 3 21 9" }),
        s.createElement("polyline", { points: "9 21 3 21 3 15" }),
        s.createElement("line", { x1: "21", y1: "3", x2: "14", y2: "10" }),
        s.createElement("line", { x1: "3", y1: "21", x2: "10", y2: "14" }),
      ),
    ),
    s.createElement("div", { style: { flex: 1 } }),
  );
}
Gi.propTypes = {
  recentRuns: R.exports.array.isRequired,
  currentPrefix: R.exports.string,
  onPick: R.exports.func.isRequired,
  progress: R.exports.string,
  status: R.exports.string,
  onCopy: R.exports.func,
};
Cv.propTypes = { onCopy: R.exports.func.isRequired };
function Rk({ c: e, isRadio: t, onClick: n }) {
  return s.createElement(
    "div",
    {
      className: "p-row" + (e.on ? " on" : ""),
      onClick: n,
      style: { alignItems: "stretch", padding: "6px 6px", cursor: "pointer" },
    },
    s.createElement(
      "div",
      {
        style: {
          width: 14,
          height: 14,
          marginTop: 1,
          borderRadius: t ? "50%" : 2,
          border: "1.5px solid " + (e.on ? e.color : "var(--p-ink30)"),
          background: e.on ? e.color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        },
      },
      e.on &&
        !t &&
        s.createElement(
          "svg",
          {
            width: "9",
            height: "9",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#fff",
            strokeWidth: "4",
          },
          s.createElement("polyline", { points: "20 6 9 17 4 12" }),
        ),
      e.on &&
        t &&
        s.createElement("span", {
          style: {
            width: 5,
            height: 5,
            background: "#fff",
            borderRadius: "50%",
          },
        }),
    ),
    s.createElement(
      "div",
      { style: { width: 22, display: "flex", alignItems: "center" } },
      e.on &&
        s.createElement("span", {
          style: { width: 22, height: 2, background: e.color, borderRadius: 1 },
        }),
    ),
    s.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        },
      },
      s.createElement(
        "span",
        {
          className: "p-mono p-row-name",
          style: {
            fontSize: 12,
            color: e.on ? "var(--p-ink)" : "var(--p-ink70)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          title: e.key,
        },
        e.key,
      ),
      e.unit &&
        s.createElement(
          "span",
          { className: "p-dim p-mono", style: { fontSize: 10 } },
          e.unit,
        ),
    ),
    s.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          color: e.on ? "var(--p-ink70)" : "var(--p-ink30)",
        },
      },
      e.on
        ? s.createElement(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
            },
            s.createElement("path", {
              d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
            }),
            s.createElement("circle", { cx: "12", cy: "12", r: "3" }),
          )
        : s.createElement(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
            },
            s.createElement("path", {
              d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
            }),
            s.createElement("line", { x1: "1", y1: "1", x2: "23", y2: "23" }),
          ),
    ),
  );
}
function Nv({
  mode: e,
  channels: t,
  onToggle: n,
  onPickMetric: r,
  experiment: o,
}) {
  const l = e === "2D",
    a = t.filter((f) => f.on).length,
    [i, u] = m.exports.useState(""),
    c = i.trim()
      ? t.filter((f) => f.key.toLowerCase().includes(i.trim().toLowerCase()))
      : t;
  return s.createElement(
    "div",
    {
      className: "p-panel p-rail-channels",
      style: { display: "flex", flexDirection: "column", minHeight: 0 },
    },
    s.createElement(
      "div",
      { className: "p-panel-h" },
      s.createElement(
        "span",
        { className: "p-lbl" },
        l ? "metric" : "channels",
      ),
      s.createElement(
        "span",
        { className: "p-mono p-dim", style: { fontSize: 11 } },
        "\xB7 ",
        l ? "1" : a,
        " / ",
        t.length,
      ),
    ),
    s.createElement(
      "div",
      {
        style: {
          padding: "6px 10px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        },
      },
      s.createElement("input", {
        className: "p-search p-mono",
        placeholder: "filter channels\u2026",
        value: i,
        onChange: (f) => u(f.target.value),
      }),
    ),
    s.createElement(
      "div",
      { className: "p-scroll", style: { flex: 1, padding: "2px 6px 6px" } },
      c.length === 0 &&
        s.createElement(
          "div",
          {
            style: {
              padding: 16,
              fontSize: 12,
              color: "var(--p-ink50)",
              textAlign: "center",
            },
          },
          "no channels",
        ),
      c.map((f) =>
        s.createElement(Rk, {
          key: f.key,
          c: f,
          isRadio: l,
          onClick: () => (l ? r && r(f.key) : n(f.key)),
        }),
      ),
    ),
    l &&
      s.createElement(
        "div",
        {
          style: {
            padding: "8px 10px",
            borderTop: "1px solid var(--p-border)",
            fontSize: 11,
            color: "var(--p-ink50)",
          },
        },
        "2D heatmap shows one metric. Pick another to swap.",
      ),
  );
}
Nv.propTypes = {
  mode: R.exports.oneOf(["0D", "1D", "2D"]).isRequired,
  channels: R.exports.array.isRequired,
  onToggle: R.exports.func,
  onPickMetric: R.exports.func,
  experiment: R.exports.string,
};
function Ok({ on: e }) {
  return e
    ? s.createElement(
        "svg",
        {
          width: "13",
          height: "13",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "none",
        },
        s.createElement("path", {
          d: "M12 3C7.03 3 3 7.03 3 12v8l3-3 3 3 3-3 3 3 3-3 3 3v-8C21 7.03 16.97 3 12 3z",
        }),
        s.createElement("circle", {
          cx: "9",
          cy: "11",
          r: "1.5",
          fill: "var(--p-panel)",
        }),
        s.createElement("circle", {
          cx: "15",
          cy: "11",
          r: "1.5",
          fill: "var(--p-panel)",
        }),
      )
    : s.createElement(
        "svg",
        {
          width: "13",
          height: "13",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.5",
          strokeLinejoin: "round",
        },
        s.createElement("path", {
          d: "M12 3C7.03 3 3 7.03 3 12v8l3-3 3 3 3-3 3 3 3-3 3 3v-8C21 7.03 16.97 3 12 3z",
        }),
        s.createElement("circle", {
          cx: "9",
          cy: "11",
          r: "1.2",
          fill: "currentColor",
          stroke: "none",
        }),
        s.createElement("circle", {
          cx: "15",
          cy: "11",
          r: "1.2",
          fill: "currentColor",
          stroke: "none",
        }),
      );
}
function _k({
  r: e,
  isActive: t,
  isGhost: n,
  canOverlay: r,
  onClick: o,
  onToggleGhost: l,
}) {
  const a = t
      ? "color-mix(in oklab, var(--p-accent) 10%, transparent)"
      : n
        ? "color-mix(in oklab, var(--p-ink) 4%, transparent)"
        : "transparent",
    i = t
      ? "3px solid var(--p-accent)"
      : n
        ? "3px dashed var(--p-ink50)"
        : "3px solid transparent";
  return s.createElement(
    "div",
    {
      onClick: o,
      style: {
        display: "grid",
        gridTemplateColumns: "14px 1fr auto",
        gap: 8,
        alignItems: "center",
        padding: "6px 8px",
        background: a,
        borderLeft: i,
        borderRadius: 4,
        cursor: t ? "default" : "pointer",
        marginBottom: 1,
      },
    },
    s.createElement(
      "div",
      {
        style: {
          color: t
            ? "var(--p-accent)"
            : n
              ? "var(--p-ink70)"
              : "var(--p-ink30)",
          fontSize: 13,
        },
      },
      t ? "\u25B6" : n ? "\u25C9" : "\u25EF",
    ),
    s.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          gap: 2,
        },
      },
      s.createElement(
        "div",
        { style: { display: "flex", alignItems: "baseline", gap: 6 } },
        s.createElement(
          "span",
          {
            className: "p-mono",
            style: {
              fontSize: 11.5,
              fontWeight: 600,
              color: t ? "var(--p-accent)" : "var(--p-ink)",
            },
          },
          e.rid != null ? `#${e.rid}` : e.prefix,
        ),
      ),
      s.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 6 } },
        s.createElement(
          "span",
          {
            className: "p-dim p-mono",
            style: {
              fontSize: 9.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            title: e.prefix,
          },
          e.prefix,
        ),
      ),
    ),
    s.createElement(
      "div",
      {
        style: {
          color: n ? "var(--p-ink70)" : "var(--p-ink30)",
          fontSize: 12,
          paddingRight: 2,
        },
      },
      r && !t && e.dims === "1D"
        ? s.createElement(
            "div",
            {
              onClick: (u) => {
                u.stopPropagation(), l(e.prefix);
              },
              style: {
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              },
              title: n ? "remove ghost overlay" : "add ghost overlay",
            },
            s.createElement(Ok, { on: n }),
          )
        : null,
    ),
  );
}
function Rv({
  runs: e,
  activeRid: t,
  ghostPrefixes: n = [],
  onToggleGhost: r,
  onPick: o,
  dims: l,
}) {
  const [a, i] = m.exports.useState(""),
    u = l === "1D",
    c = m.exports.useMemo(() => {
      if (!a.trim()) return e;
      const d = a.toLowerCase();
      return e.filter((h) => {
        var y, E;
        return `${(y = h.rid) != null ? y : ""} ${
          (E = h.prefix) != null ? E : ""
        }`
          .toLowerCase()
          .includes(d);
      });
    }, [e, a]),
    f = e.some((d) => d.rid !== t);
  return s.createElement(
    "div",
    {
      className: "p-panel p-rail-timeline",
      style: { display: "flex", flexDirection: "column", minHeight: 0 },
    },
    s.createElement(
      "div",
      { className: "p-panel-h" },
      s.createElement("span", { className: "p-lbl" }, "history"),
      s.createElement(
        "span",
        { className: "p-mono p-dim", style: { fontSize: 11 } },
        "\xB7 ",
        e.length,
        " run",
        e.length === 1 ? "" : "s",
      ),
    ),
    s.createElement(
      "div",
      {
        style: {
          padding: "6px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        },
      },
      s.createElement(
        "div",
        {
          className: "p-mono p-dim",
          style: {
            fontSize: 10.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
        "all runs",
      ),
      s.createElement("input", {
        className: "p-search p-mono",
        placeholder: "filter by RID / prefix",
        value: a,
        onChange: (d) => i(d.target.value),
      }),
      u &&
        f &&
        s.createElement(
          "div",
          {
            className: "p-dim p-mono",
            style: { fontSize: 10.5, padding: "0 2px" },
          },
          "tap a run to overlay it as a ghost",
        ),
    ),
    c.length === 0
      ? s.createElement(
          "div",
          {
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              color: "var(--p-ink50)",
              textAlign: "center",
              fontSize: 12,
            },
          },
          "No previous runs.",
        )
      : s.createElement(
          "div",
          { className: "p-scroll", style: { flex: 1, padding: "4px 6px 8px" } },
          c.map((d) => {
            const h = d.rid === t,
              y = n.includes(d.prefix);
            return s.createElement(_k, {
              key: d.prefix,
              r: d,
              isActive: h,
              isGhost: y,
              canOverlay: u,
              onClick: () => !h && o(d),
              onToggleGhost: r,
            });
          }),
        ),
  );
}
Rv.propTypes = {
  runs: R.exports.array.isRequired,
  activeRid: R.exports.number,
  ghostPrefixes: R.exports.array,
  onToggleGhost: R.exports.func.isRequired,
  onPick: R.exports.func.isRequired,
  dims: R.exports.string,
};
function Sa(e, t, n) {
  if (!isFinite(e) || !isFinite(t) || e === t) return [e];
  const o = (t - e) / n,
    l = Math.pow(10, Math.floor(Math.log10(o))),
    a = o / l,
    i = (a < 1.5 ? 1 : a < 3 ? 2 : a < 7 ? 5 : 10) * l,
    u = [],
    c = Math.ceil(e / i) * i;
  for (let f = c; f <= t + 1e-9; f += i) u.push(+f.toFixed(10));
  return u;
}
function mt(e) {
  if (!isFinite(e)) return "\u2013";
  const t = Math.abs(e);
  return t === 0
    ? "0"
    : t >= 100
      ? e.toFixed(0)
      : t >= 10
        ? e.toFixed(1)
        : t >= 1
          ? e.toFixed(2)
          : e.toFixed(3);
}
const ze = [
  [0, 20, 22, 36],
  [0.25, 60, 60, 110],
  [0.5, 140, 90, 80],
  [0.75, 220, 130, 60],
  [1, 248, 220, 110],
];
function Pk(e) {
  const t = Math.max(0, Math.min(1, e));
  for (let r = 1; r < ze.length; r++)
    if (t <= ze[r][0]) {
      const o = (t - ze[r - 1][0]) / (ze[r][0] - ze[r - 1][0]);
      return [
        Math.round(ze[r - 1][1] + (ze[r][1] - ze[r - 1][1]) * o),
        Math.round(ze[r - 1][2] + (ze[r][2] - ze[r - 1][2]) * o),
        Math.round(ze[r - 1][3] + (ze[r][3] - ze[r - 1][3]) * o),
      ];
    }
  const n = ze[ze.length - 1];
  return [n[1], n[2], n[3]];
}
const md = [
  "--p-c0",
  "--p-c1",
  "--p-c2",
  "--p-c3",
  "--p-c4",
  "--p-c5",
  "--p-c6",
  "--p-c7",
];
function In(e) {
  const t = /rid[_-]?(\d+)/i.exec(e);
  return t ? parseInt(t[1], 10) : null;
}
const Ov = "artiq_http.plots.channels.";
function Tk(e) {
  if (!e) return null;
  try {
    const t = localStorage.getItem(Ov + e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function bk(e, t) {
  if (!!e)
    try {
      localStorage.setItem(Ov + e, JSON.stringify(t));
    } catch {}
}
function Qi({ xs: e, xLabel: t, yLabel: n, channels: r, ghosts: o = [] }) {
  const l = m.exports.useRef(null),
    [a, i] = m.exports.useState({ w: 800, h: 460 }),
    [u, c] = m.exports.useState(null);
  m.exports.useEffect(() => {
    if (!l.current) return;
    const P = new ResizeObserver(([M]) => {
      const W = M.contentRect;
      i({ w: Math.max(360, W.width), h: Math.max(220, W.height) });
    });
    return P.observe(l.current), () => P.disconnect();
  }, []);
  const f = r.filter((P) => P.on && P.values && P.values.length);
  if (!e.length || !f.length)
    return s.createElement(
      "div",
      {
        ref: l,
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        },
      },
      e.length === 0 ? "Waiting for points\u2026" : "No channels visible.",
    );
  const d = 56,
    h = 18,
    y = 18,
    E = 44,
    x = a.w - d - h,
    k = a.h - y - E,
    v = Math.min(...e),
    p = Math.max(...e);
  let g = 1 / 0,
    w = -1 / 0;
  for (const P of f)
    for (const M of P.values)
      !isFinite(M) || (M < g && (g = M), M > w && (w = M));
  if (!isFinite(g) || !isFinite(w) || g === w) (g = 0), (w = 1);
  else {
    const P = (w - g) * 0.08;
    (g -= P), (w += P);
  }
  const C = (P) => d + ((P - v) / (p - v || 1)) * x,
    S = (P) => y + (1 - (P - g) / (w - g || 1)) * k,
    N = Sa(v, p, 6),
    O = Sa(g, w, 5),
    j = (P) => {
      const M = P.currentTarget.getBoundingClientRect(),
        W = P.clientX - M.left;
      if (W < d || W > d + x) {
        c(null);
        return;
      }
      const q = v + ((W - d) / x) * (p - v);
      c({ x: q, px: W });
    },
    D = () => c(null),
    z = u ? C(u.x) : null,
    G = u
      ? f.map((P) => {
          const M = P.values;
          let W = Math.round(((u.x - v) / (p - v || 1)) * (M.length - 1));
          return (
            (W = Math.max(0, Math.min(M.length - 1, W))),
            { key: P.key, color: P.color, value: M[W] }
          );
        })
      : [],
    Q = u
      ? o.flatMap((P) => {
          const M = P.values;
          if (!M || !M.length) return [];
          let W = Math.round(((u.x - v) / (p - v || 1)) * (M.length - 1));
          return (
            (W = Math.max(0, Math.min(M.length - 1, W))),
            [{ rid: P.rid, value: M[W] }]
          );
        })
      : [];
  return s.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    s.createElement(
      "div",
      {
        ref: l,
        style: {
          flex: 1,
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
        },
      },
      s.createElement(
        "svg",
        {
          width: a.w,
          height: a.h,
          onMouseMove: j,
          onMouseLeave: D,
          style: { position: "absolute", top: 0, left: 0, cursor: "crosshair" },
        },
        s.createElement(
          "g",
          null,
          O.map((P) =>
            s.createElement("line", {
              key: "gy" + P,
              x1: d,
              x2: d + x,
              y1: S(P),
              y2: S(P),
              stroke: "var(--p-grid)",
              strokeWidth: "1",
            }),
          ),
          N.map((P) =>
            s.createElement("line", {
              key: "gx" + P,
              x1: C(P),
              x2: C(P),
              y1: y,
              y2: y + k,
              stroke: "var(--p-grid)",
              strokeWidth: "1",
            }),
          ),
        ),
        s.createElement(
          "g",
          { stroke: "var(--p-ink70)", strokeWidth: "1" },
          s.createElement("line", { x1: d, y1: y + k, x2: d + x, y2: y + k }),
          s.createElement("line", { x1: d, y1: y, x2: d, y2: y + k }),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "middle" },
          N.map((P) =>
            s.createElement(
              "g",
              { key: "tx" + P },
              s.createElement("line", {
                x1: C(P),
                x2: C(P),
                y1: y + k,
                y2: y + k + 4,
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: C(P), y: y + k + 16 }, mt(P)),
            ),
          ),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "end" },
          O.map((P) =>
            s.createElement(
              "g",
              { key: "ty" + P },
              s.createElement("line", {
                x1: d - 4,
                x2: d,
                y1: S(P),
                y2: S(P),
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: d - 8, y: S(P) + 3 }, mt(P)),
            ),
          ),
        ),
        o.map((P, M) => {
          const W = P.values || [];
          if (!W.length) return null;
          const q = P.xs || e,
            _ = W.map((I, b) => {
              const A = q[b];
              return !isFinite(I) || !isFinite(A) ? null : `${C(A)},${S(I)}`;
            })
              .filter(Boolean)
              .join(" ");
          return s.createElement("polyline", {
            key: "gh" + M,
            points: _,
            fill: "none",
            stroke: "var(--p-ink50)",
            strokeWidth: "1.5",
            strokeDasharray: "4 3",
            opacity: "0.55",
          });
        }),
        f.map((P) => {
          const M = P.values,
            W = M.map((q, _) => {
              const I = e[_];
              return !isFinite(q) || !isFinite(I) ? null : `${C(I)},${S(q)}`;
            })
              .filter(Boolean)
              .join(" ");
          return s.createElement(
            "g",
            { key: P.key },
            s.createElement("polyline", {
              points: W,
              fill: "none",
              stroke: P.color,
              strokeWidth: "1.6",
              opacity: "0.85",
            }),
            M.map((q, _) =>
              isFinite(q) && isFinite(e[_])
                ? s.createElement("circle", {
                    key: _,
                    cx: C(e[_]),
                    cy: S(q),
                    r: "2",
                    fill: P.color,
                  })
                : null,
            ),
          );
        }),
        z != null &&
          s.createElement("line", {
            x1: z,
            x2: z,
            y1: y,
            y2: y + k,
            stroke: "var(--p-accent)",
            strokeWidth: "1",
            strokeDasharray: "3 3",
          }),
        s.createElement(
          "text",
          {
            x: d + x / 2,
            y: y + k + 30,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
          },
          t || "x",
        ),
        s.createElement(
          "text",
          {
            x: 14,
            y: y + k / 2,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
            transform: `rotate(-90, 14, ${y + k / 2})`,
          },
          n || "value",
        ),
      ),
      s.createElement(
        "div",
        {
          style: {
            position: "absolute",
            top: 12,
            right: 32,
            background: "color-mix(in oklab, var(--p-panel) 92%, transparent)",
            border: "1px solid var(--p-border)",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 11,
            lineHeight: 1.5,
            minWidth: 160,
            backdropFilter: "blur(4px)",
            maxWidth: 220,
          },
        },
        f.map((P) =>
          s.createElement(
            "div",
            {
              key: P.key,
              style: { display: "flex", alignItems: "center", gap: 6 },
            },
            s.createElement("span", {
              style: {
                width: 18,
                height: 2,
                background: P.color,
                borderRadius: 1,
                flex: "0 0 auto",
              },
            }),
            s.createElement(
              "span",
              {
                className: "p-mono",
                style: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                title: P.key,
              },
              P.key,
            ),
          ),
        ),
        o.map((P) =>
          s.createElement(
            "div",
            {
              key: P.rid + "-ghost",
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: 0.7,
              },
            },
            s.createElement("span", {
              style: {
                width: 18,
                height: 0,
                borderTop: "1.5px dashed var(--p-ink50)",
              },
            }),
            s.createElement("span", { className: "p-mono p-dim" }, "ghost"),
            s.createElement(
              "span",
              { className: "p-dim", style: { marginLeft: "auto" } },
              "#",
              P.rid,
            ),
          ),
        ),
      ),
    ),
    s.createElement($k, {
      cursor: u,
      xLabel: t,
      cursorReadouts: G,
      ghostReadouts: Q,
    }),
  );
}
function $k({ cursor: e, xLabel: t, cursorReadouts: n, ghostReadouts: r }) {
  return s.createElement(
    "div",
    {
      className: "p-panel-soft p-cursor-readout",
      style: {
        flex: "0 0 auto",
        margin: "0 8px 8px",
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 11.5,
        minHeight: 28,
      },
    },
    s.createElement(
      "span",
      { className: "p-lbl", style: { minWidth: 50 } },
      "CURSOR",
    ),
    e
      ? s.createElement(
          s.Fragment,
          null,
          s.createElement(
            "span",
            { className: "p-mono", style: { minWidth: 110 } },
            (t || "x").split(" /")[0],
            " = ",
            mt(e.x),
          ),
          s.createElement(
            "div",
            { className: "p-cursor-values" },
            n.map((o) =>
              s.createElement(
                "span",
                { key: o.key, className: "p-mono", style: { color: o.color } },
                o.key,
                " = ",
                s.createElement("b", null, mt(o.value)),
              ),
            ),
            r.map((o) =>
              s.createElement(
                "span",
                { key: o.rid, className: "p-mono p-dim" },
                "#",
                o.rid,
                " = ",
                mt(o.value),
              ),
            ),
          ),
        )
      : s.createElement(
          "span",
          { className: "p-dim", style: { fontSize: 11.5 } },
          "hover the plot to read values",
        ),
  );
}
Qi.propTypes = {
  xs: R.exports.array.isRequired,
  xLabel: R.exports.string,
  yLabel: R.exports.string,
  channels: R.exports.array.isRequired,
  ghosts: R.exports.array,
};
function _v({ xs: e, ys: t, values: n, xLabel: r, yLabel: o, metric: l }) {
  const a = m.exports.useRef(null),
    i = m.exports.useRef(null),
    [u, c] = m.exports.useState({ w: 800, h: 460 }),
    [f, d] = m.exports.useState(null);
  m.exports.useEffect(() => {
    if (!a.current) return;
    const b = new ResizeObserver(([A]) => {
      const V = A.contentRect;
      c({ w: Math.max(360, V.width), h: Math.max(220, V.height) });
    });
    return b.observe(a.current), () => b.disconnect();
  }, []);
  const {
      grid: h,
      cols: y,
      rows: E,
      xRange: x,
      yRange: k,
      vRange: v,
    } = m.exports.useMemo(() => {
      if (!e.length || !t.length || !n.length)
        return {
          grid: null,
          cols: 0,
          rows: 0,
          xRange: [0, 1],
          yRange: [0, 1],
          vRange: [0, 1],
        };
      const b = [...new Set(e)].sort((te, ue) => te - ue),
        A = [...new Set(t)].sort((te, ue) => te - ue),
        V = b.length,
        T = A.length,
        F = new Map(b.map((te, ue) => [te, ue])),
        K = new Map(A.map((te, ue) => [te, ue])),
        Y = Array.from({ length: T }, () => new Array(V).fill(NaN));
      let J = 1 / 0,
        se = -1 / 0;
      for (let te = 0; te < n.length; te++) {
        const ue = n[te];
        if (!isFinite(ue)) continue;
        const Ne = F.get(e[te]),
          B = K.get(t[te]);
        Ne == null ||
          B == null ||
          ((Y[B][Ne] = ue), ue < J && (J = ue), ue > se && (se = ue));
      }
      return (
        (!isFinite(J) || !isFinite(se) || J === se) && ((J = 0), (se = 1)),
        {
          grid: Y,
          cols: V,
          rows: T,
          xRange: [b[0], b[V - 1]],
          yRange: [A[0], A[T - 1]],
          vRange: [J, se],
        }
      );
    }, [e, t, n]),
    p = 56,
    g = 70,
    w = 18,
    C = 44,
    S = u.w - p - g,
    N = u.h - w - C;
  if (
    (m.exports.useEffect(() => {
      const b = i.current;
      if (!b || !h || y === 0 || E === 0) return;
      const A = window.devicePixelRatio || 1;
      (b.width = Math.max(1, S) * A),
        (b.height = Math.max(1, N) * A),
        (b.style.width = S + "px"),
        (b.style.height = N + "px");
      const V = b.getContext("2d");
      V.imageSmoothingEnabled = !1;
      const T = V.createImageData(y, E),
        [F, K] = v,
        Y = K - F || 1;
      for (let se = 0; se < E; se++)
        for (let te = 0; te < y; te++) {
          const ue = h[se][te],
            Ne = isFinite(ue) ? (ue - F) / Y : 0,
            [B, H, ne] = Pk(Ne),
            de = ((E - 1 - se) * y + te) * 4;
          (T.data[de] = B),
            (T.data[de + 1] = H),
            (T.data[de + 2] = ne),
            (T.data[de + 3] = isFinite(ue) ? 255 : 0);
        }
      const J = document.createElement("canvas");
      (J.width = y),
        (J.height = E),
        J.getContext("2d").putImageData(T, 0, 0),
        V.clearRect(0, 0, b.width, b.height),
        V.drawImage(J, 0, 0, S * A, N * A);
    }, [h, y, E, S, N, v]),
    !h || y === 0 || E === 0)
  )
    return s.createElement(
      "div",
      {
        ref: a,
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        },
      },
      "Waiting for grid points\u2026",
    );
  const [O, j] = x,
    [D, z] = k,
    G = (b) => p + ((b - O) / (j - O || 1)) * S,
    Q = (b) => w + (1 - (b - D) / (z - D || 1)) * N,
    P = Sa(O, j, 6),
    M = Sa(D, z, 5),
    W = (b) => {
      const A = b.currentTarget.getBoundingClientRect(),
        V = b.clientX - A.left,
        T = b.clientY - A.top;
      if (V < p || V > p + S || T < w || T > w + N) {
        d(null);
        return;
      }
      const F = O + ((V - p) / S) * (j - O),
        K = D + (1 - (T - w) / N) * (z - D),
        Y = Math.min(y - 1, Math.max(0, Math.floor(((V - p) / S) * y))),
        J = Math.min(E - 1, Math.max(0, Math.floor((1 - (T - w) / N) * E)));
      d({ x: F, y: K, value: h[J][Y] });
    },
    q = () => d(null),
    _ = f ? G(f.x) : null,
    I = f ? Q(f.y) : null;
  return s.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    s.createElement(
      "div",
      {
        ref: a,
        style: {
          flex: 1,
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
        },
      },
      s.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: p,
            top: w,
            pointerEvents: "none",
          },
        },
        s.createElement("canvas", { ref: i }),
      ),
      s.createElement(
        "svg",
        {
          width: u.w,
          height: u.h,
          onMouseMove: W,
          onMouseLeave: q,
          style: { position: "absolute", top: 0, left: 0, cursor: "crosshair" },
        },
        s.createElement(
          "g",
          { stroke: "var(--p-ink70)", strokeWidth: "1", fill: "none" },
          s.createElement("line", { x1: p, y1: w + N, x2: p + S, y2: w + N }),
          s.createElement("line", { x1: p, y1: w, x2: p, y2: w + N }),
          s.createElement("line", { x1: p + S, y1: w, x2: p + S, y2: w + N }),
          s.createElement("line", { x1: p, y1: w, x2: p + S, y2: w }),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "middle" },
          P.map((b) =>
            s.createElement(
              "g",
              { key: b },
              s.createElement("line", {
                x1: G(b),
                x2: G(b),
                y1: w + N,
                y2: w + N + 4,
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: G(b), y: w + N + 16 }, mt(b)),
            ),
          ),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "end" },
          M.map((b) =>
            s.createElement(
              "g",
              { key: b },
              s.createElement("line", {
                x1: p - 4,
                x2: p,
                y1: Q(b),
                y2: Q(b),
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: p - 8, y: Q(b) + 3 }, mt(b)),
            ),
          ),
        ),
        f &&
          s.createElement(
            "g",
            {
              stroke: "var(--p-accent)",
              strokeWidth: "1",
              strokeDasharray: "3 3",
            },
            s.createElement("line", { x1: _, x2: _, y1: w, y2: w + N }),
            s.createElement("line", { x1: p, x2: p + S, y1: I, y2: I }),
            s.createElement("circle", {
              cx: _,
              cy: I,
              r: "4",
              fill: "none",
              strokeDasharray: "0",
            }),
          ),
        s.createElement(
          "g",
          { transform: `translate(${p + S + 18}, ${w})` },
          s.createElement(jk, { height: N }),
          s.createElement(
            "text",
            { x: "34", y: "6", fontSize: "10", fill: "var(--p-ink70)" },
            mt(v[1]),
          ),
          s.createElement(
            "text",
            { x: "34", y: N - 2, fontSize: "10", fill: "var(--p-ink70)" },
            mt(v[0]),
          ),
          s.createElement(
            "text",
            {
              x: "14",
              y: N / 2,
              fontSize: "10",
              fill: "var(--p-ink50)",
              textAnchor: "middle",
              transform: `rotate(-90, 14, ${N / 2})`,
            },
            l,
          ),
        ),
        s.createElement(
          "text",
          {
            x: p + S / 2,
            y: w + N + 30,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
          },
          r || "x",
        ),
        s.createElement(
          "text",
          {
            x: 14,
            y: w + N / 2,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
            transform: `rotate(-90, 14, ${w + N / 2})`,
          },
          o || "y",
        ),
      ),
      s.createElement(
        "div",
        {
          style: {
            position: "absolute",
            top: 12,
            right: 100,
            background: "color-mix(in oklab, var(--p-panel) 92%, transparent)",
            border: "1px solid var(--p-border)",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 11,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(4px)",
          },
        },
        s.createElement(
          "span",
          { className: "p-lbl", style: { fontSize: 9 } },
          "metric",
        ),
        s.createElement(
          "span",
          {
            className: "p-mono",
            style: { color: "var(--p-accent)", fontWeight: 600 },
          },
          l,
        ),
      ),
    ),
    s.createElement(Lk, { cursor: f, metric: l, xLabel: r, yLabel: o }),
  );
}
function Lk({ cursor: e, metric: t, xLabel: n, yLabel: r }) {
  return s.createElement(
    "div",
    {
      className: "p-panel-soft p-cursor-readout",
      style: {
        flex: "0 0 auto",
        margin: "0 8px 8px",
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 11.5,
        minHeight: 28,
      },
    },
    s.createElement(
      "span",
      { className: "p-lbl", style: { minWidth: 50 } },
      "CURSOR",
    ),
    e
      ? s.createElement(
          s.Fragment,
          null,
          s.createElement(
            "span",
            { className: "p-mono", style: { minWidth: 200 } },
            (n || "x").split(" /")[0],
            " = ",
            mt(e.x),
            " \xB7",
            " ",
            (r || "y").split(" /")[0],
            " = ",
            mt(e.y),
          ),
          s.createElement(
            "div",
            { className: "p-cursor-values" },
            s.createElement(
              "span",
              { className: "p-mono", style: { color: "var(--p-accent)" } },
              t,
              " =",
              " ",
              s.createElement(
                "b",
                null,
                isFinite(e.value) ? mt(e.value) : "\u2014",
              ),
            ),
          ),
        )
      : s.createElement(
          "span",
          { className: "p-dim", style: { fontSize: 11.5 } },
          "hover the heatmap to sample",
        ),
  );
}
function jk({ height: e }) {
  const t = s.useId();
  return s.createElement(
    s.Fragment,
    null,
    s.createElement(
      "defs",
      null,
      s.createElement(
        "linearGradient",
        { id: t, x1: "0", y1: "1", x2: "0", y2: "0" },
        s.createElement("stop", { offset: "0%", stopColor: "rgb(20,22,36)" }),
        s.createElement("stop", { offset: "25%", stopColor: "rgb(60,60,110)" }),
        s.createElement("stop", { offset: "50%", stopColor: "rgb(140,90,80)" }),
        s.createElement("stop", {
          offset: "75%",
          stopColor: "rgb(220,130,60)",
        }),
        s.createElement("stop", {
          offset: "100%",
          stopColor: "rgb(248,220,110)",
        }),
      ),
    ),
    s.createElement("rect", {
      x: "0",
      y: "0",
      width: "22",
      height: e,
      fill: `url(#${t})`,
      stroke: "var(--p-ink70)",
      strokeWidth: "1",
    }),
  );
}
_v.propTypes = {
  xs: R.exports.array.isRequired,
  ys: R.exports.array.isRequired,
  values: R.exports.array.isRequired,
  xLabel: R.exports.string,
  yLabel: R.exports.string,
  metric: R.exports.string,
};
function Pv({ channels: e }) {
  const t = e.filter((n) => n.on);
  return s.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 12,
      },
    },
    s.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        },
      },
      t.length === 0 &&
        s.createElement(
          "div",
          {
            style: {
              padding: 16,
              fontSize: 12,
              color: "var(--p-ink50)",
              textAlign: "center",
            },
          },
          "No channels visible.",
        ),
      t.map((n) =>
        s.createElement(
          "div",
          {
            key: n.key,
            className: "p-panel",
            style: {
              padding: "12px 14px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          s.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
              },
            },
            s.createElement("span", {
              style: {
                width: 14,
                height: 3,
                background: n.color,
                borderRadius: 1,
                flex: "0 0 auto",
              },
            }),
            s.createElement(
              "span",
              {
                className: "p-mono",
                style: {
                  fontSize: 11.5,
                  fontWeight: 600,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                title: n.key,
              },
              n.key,
            ),
          ),
          s.createElement(
            "div",
            {
              className: "p-mono p-tnum",
              style: {
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: n.color,
              },
            },
            Dk(n.value),
          ),
          n.unit &&
            s.createElement(
              "div",
              {
                className: "p-mono p-dim",
                style: {
                  fontSize: 10,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              },
              n.unit,
            ),
        ),
      ),
    ),
  );
}
function Dk(e) {
  return e == null
    ? "\u2014"
    : typeof e == "boolean"
      ? e
        ? "true"
        : "false"
      : typeof e != "number"
        ? String(e)
        : isFinite(e)
          ? e.toPrecision(5)
          : "\u2014";
}
Pv.propTypes = { channels: R.exports.array.isRequired };
function Mk(e, t) {
  return e.replace(/var\((--[^,)]+)(?:,[^)]*)?\)/g, (n, r) =>
    (t.getPropertyValue(r).trim() || "currentColor").replace(/"/g, "'"),
  );
}
function qi(e, t) {
  if (!e) return null;
  const n = e.match(/var\((--[^,)]+)\)/);
  return (n && t.getPropertyValue(n[1]).trim()) || e;
}
function Ik(e) {
  return new Promise((t, n) => {
    const r = new Blob([e], { type: "image/svg+xml;charset=utf-8" }),
      o = URL.createObjectURL(r),
      l = new Image();
    (l.onload = () => {
      URL.revokeObjectURL(o), t(l);
    }),
      (l.onerror = () => {
        URL.revokeObjectURL(o), n(new Error("SVG image load failed"));
      }),
      (l.src = o);
  });
}
function Ir(e, t, n, r, o, l) {
  e.beginPath(),
    e.moveTo(t + l, n),
    e.lineTo(t + r - l, n),
    e.arcTo(t + r, n, t + r, n + l, l),
    e.lineTo(t + r, n + o - l),
    e.arcTo(t + r, n + o, t + r - l, n + o, l),
    e.lineTo(t + l, n + o),
    e.arcTo(t, n + o, t, n + o - l, l),
    e.lineTo(t, n + l),
    e.arcTo(t, n, t + l, n, l),
    e.closePath();
}
function zk(e, t, n, r, o, l, a, i, u, c, f) {
  const d = Math.min(220, Math.max(160, Math.round(r * 0.3))),
    h = r - d - 12,
    y = o + 12,
    E = 8,
    x = 6,
    k = 18,
    v = 18,
    p = 6,
    g = t.length + n.length;
  if (g === 0) return;
  const w = x * 2 + g * k;
  e.save(),
    (e.globalAlpha = 0.92),
    (e.fillStyle = l),
    Ir(e, h, y, d, w, 6),
    e.fill(),
    e.restore(),
    (e.strokeStyle = a),
    (e.lineWidth = 1),
    Ir(e, h, y, d, w, 6),
    e.stroke();
  let C = y + x + k / 2;
  (e.textBaseline = "middle"),
    (e.font = "11px monospace"),
    (e.textAlign = "left");
  for (const S of t) {
    const N = qi(S.color, f) || i;
    (e.fillStyle = N), e.fillRect(h + E, C - 1, v, 2), (e.fillStyle = u);
    const O = d - E * 2 - v - p,
      j = S.key.length > 26 ? S.key.slice(0, 24) + "\u2026" : S.key;
    e.fillText(j, h + E + v + p, C, O), (C += k);
  }
  for (const S of n)
    (e.strokeStyle = c),
      (e.lineWidth = 1.5),
      e.setLineDash([4, 3]),
      e.beginPath(),
      e.moveTo(h + E, C),
      e.lineTo(h + E + v, C),
      e.stroke(),
      e.setLineDash([]),
      (e.fillStyle = c),
      e.fillText("ghost", h + E + v + p, C),
      (e.textAlign = "right"),
      e.fillText(`#${S.rid}`, h + d - E, C),
      (e.textAlign = "left"),
      (C += k);
}
function Ak(e, t, n, r, o, l, a, i) {
  e.font = "bold 11px monospace";
  const h = e.measureText(t).width,
    y = 8 * 2 + 38 + 6 + h + 4,
    E = n - y - 100,
    x = r + 12,
    k = 4 * 2 + 16;
  e.save(),
    (e.globalAlpha = 0.92),
    (e.fillStyle = o),
    Ir(e, E, x, y, k, 6),
    e.fill(),
    e.restore(),
    (e.strokeStyle = l),
    (e.lineWidth = 1),
    Ir(e, E, x, y, k, 6),
    e.stroke();
  const v = x + k / 2;
  (e.textBaseline = "middle"),
    (e.fillStyle = i),
    (e.font = "9px monospace"),
    (e.textAlign = "left"),
    (e.globalAlpha = 0.6),
    e.fillText("metric", E + 8, v),
    (e.globalAlpha = 1),
    (e.fillStyle = a),
    (e.font = "bold 11px monospace"),
    e.fillText(t, E + 8 + 38 + 6, v);
}
async function Fk({
  containerEl: e,
  rid: t,
  dims: n,
  channelDescriptors: r = [],
  fragmentFqn: o = "",
  metric2D: l = null,
  ghosts: a = [],
}) {
  const i = e.closest(".plots-app") || e,
    u = getComputedStyle(i),
    c = u.getPropertyValue("--p-bg").trim() || "#0e0f10",
    f = u.getPropertyValue("--p-panel").trim() || "#16191c",
    d = u.getPropertyValue("--p-border").trim() || "#2a2f35",
    h = u.getPropertyValue("--p-accent").trim() || "#f08a4d",
    y = u.getPropertyValue("--p-ink").trim() || "#e8e6df",
    E = u.getPropertyValue("--p-ink50").trim() || "rgba(232,230,223,0.52)",
    x = 30,
    k = 30;
  let v,
    p,
    g,
    w = e.querySelector("svg");
  if (n === "1D" || n === "2D" || w) {
    if (!w) throw new Error("No SVG element found in plot container");
    (v = parseInt(w.getAttribute("width"), 10) || w.clientWidth || 800),
      (p = parseInt(w.getAttribute("height"), 10) || w.clientHeight || 460);
    const z = new XMLSerializer().serializeToString(w),
      G = Mk(z, u),
      Q = await Ik(G);
    let P = null;
    if (n === "2D") {
      const M = e.querySelector("canvas");
      if (M) {
        const W = e.getBoundingClientRect(),
          q = M.getBoundingClientRect();
        P = {
          el: M,
          x: Math.round(q.left - W.left),
          y: Math.round(q.top - W.top),
          w: q.width,
          h: q.height,
        };
      }
    }
    g = (M, W = 0) => {
      (M.fillStyle = c),
        M.fillRect(0, W, v, p),
        P && M.drawImage(P.el, P.x, P.y + W, P.w, P.h),
        M.drawImage(Q, 0, W, v, p);
    };
  } else {
    const z = r.filter((_) => _.on),
      G = Math.max(1, Math.ceil(Math.sqrt(z.length || 1))),
      Q = Math.ceil((z.length || 1) / G),
      P = 200,
      M = 110,
      W = 12,
      q = 12;
    (v = Math.max(300, G * (P + W) - W + q * 2)),
      (p = Math.max(140, Q * (M + W) - W + q * 2)),
      (g = (_, I = 0) => {
        (_.fillStyle = c),
          _.fillRect(0, I, v, p),
          z.forEach((b, A) => {
            const V = A % G,
              T = Math.floor(A / G),
              F = q + V * (P + W),
              K = q + T * (M + W) + I;
            (_.fillStyle = f),
              (_.strokeStyle = d),
              (_.lineWidth = 1),
              Ir(_, F, K, P, M, 6),
              _.fill(),
              _.stroke(),
              (_.fillStyle = qi(b.color, u) || h),
              _.fillRect(F + 12, K + 16, 14, 3),
              (_.fillStyle = y),
              (_.font = "bold 11px monospace"),
              (_.textAlign = "left"),
              (_.textBaseline = "top");
            const Y = b.key.length > 22 ? b.key.slice(0, 20) + "\u2026" : b.key;
            _.fillText(Y, F + 30, K + 12);
            const J = b.point,
              se =
                J == null || !isFinite(J) ? "\u2014" : Number(J).toPrecision(5);
            (_.fillStyle = qi(b.color, u) || h),
              (_.font = "bold 30px monospace"),
              (_.textBaseline = "middle"),
              _.fillText(se, F + 12, K + 68, P - 24),
              b.unit &&
                ((_.fillStyle = E),
                (_.font = "10px monospace"),
                (_.textBaseline = "bottom"),
                _.fillText(b.unit, F + 12, K + M - 8));
          });
      });
  }
  const C = document.createElement("canvas");
  (C.width = v), (C.height = x + p + k);
  const S = C.getContext("2d");
  (S.fillStyle = f),
    S.fillRect(0, 0, v, x),
    (S.strokeStyle = d),
    (S.lineWidth = 1),
    S.beginPath(),
    S.moveTo(0, x - 0.5),
    S.lineTo(v, x - 0.5),
    S.stroke();
  const N = x / 2;
  S.textBaseline = "middle";
  let O = 10;
  if (
    (n &&
      ((S.fillStyle = h),
      Ir(S, 10, N - 8, 30, 16, 4),
      S.fill(),
      (S.fillStyle = c),
      (S.font = "bold 9px monospace"),
      (S.textAlign = "center"),
      S.fillText(n, 25, N),
      (O = 48)),
    t != null &&
      ((S.fillStyle = h),
      (S.font = "bold 12px monospace"),
      (S.textAlign = "left"),
      S.fillText(`#${t}`, O, N),
      (O += S.measureText(`#${t}`).width + 10)),
    o)
  ) {
    (S.fillStyle = y), (S.font = "11px monospace"), (S.textAlign = "left");
    const z = v - O - 10,
      G = o.length > 60 ? o.slice(0, 58) + "\u2026" : o;
    S.fillText(G, O, N, z);
  }
  if ((g(S, x), n === "1D" || (n === "0D" && w))) {
    const z = r.filter((G) => G.on);
    (z.length > 0 || a.length > 0) && zk(S, z, a, v, x, f, d, h, y, E, u);
  } else n === "2D" && l && Ak(S, l, v, x, f, d, h, y);
  (S.fillStyle = f),
    S.fillRect(0, x + p, v, k),
    (S.strokeStyle = d),
    (S.lineWidth = 1),
    S.beginPath(),
    S.moveTo(0, x + p + 0.5),
    S.lineTo(v, x + p + 0.5),
    S.stroke();
  const j = x + p + k / 2;
  (S.textBaseline = "middle"),
    (S.fillStyle = y),
    (S.font = 'bold 11px system-ui, -apple-system, "Segoe UI", sans-serif'),
    (S.textAlign = "left"),
    S.fillText("ARTIQ", 10, j),
    t != null &&
      ((S.fillStyle = h),
      (S.font = "bold 11px monospace"),
      S.fillText(`#${t}`, 54, j)),
    (S.fillStyle = E),
    (S.font = "10px monospace"),
    (S.textAlign = "right"),
    S.fillText(new Date().toLocaleString(), v - 10, j);
  const D = await new Promise((z) => C.toBlob(z, "image/png"));
  if (!D) throw new Error("Failed to generate PNG blob");
  if (typeof navigator < "u" && navigator.clipboard && window.ClipboardItem)
    await navigator.clipboard.write([new ClipboardItem({ "image/png": D })]);
  else {
    const z = URL.createObjectURL(D),
      G = document.createElement("a");
    (G.href = z),
      (G.download = `artiq-plot${t != null ? `-rid${t}` : ""}.png`),
      document.body.appendChild(G),
      G.click(),
      document.body.removeChild(G),
      URL.revokeObjectURL(z);
  }
}
const Bk = 5e3;
function Wk(e, t) {
  var n, r, o, l, a;
  if (!e) return null;
  try {
    const i = e[`${t}.axes`],
      u = e[`${t}.channels`];
    if (!i || !u) return null;
    const c = JSON.parse(i[1]),
      f = JSON.parse(u[1]),
      d =
        (r = (n = e[`${t}.completed`]) == null ? void 0 : n[1]) != null
          ? r
          : !1,
      h = ((o = e[`${t}.fragment_fqn`]) == null ? void 0 : o[1]) || null,
      y = c.map((x, k) => {
        var v;
        return ((v = e[`${t}.points.axis_${k}`]) == null ? void 0 : v[1]) || [];
      }),
      E = {};
    for (const x of Object.keys(f)) {
      const k = (l = e[`${t}.points.channel_${x}`]) == null ? void 0 : l[1],
        v = (a = e[`${t}.point.${x}`]) == null ? void 0 : a[1];
      E[x] = { values: k || [], point: v };
    }
    return {
      prefix: t,
      axes: c,
      channels: f,
      channelData: E,
      axisValues: y,
      completed: d,
      fragmentFqn: h,
      dims: `${c.length}D`,
    };
  } catch (i) {
    return console.error("Failed to parse plot data for", t, i), null;
  }
}
function Ns(e) {
  if (!e) return "";
  const t = e.param || {},
    n = t.description || t.fqn || "axis",
    r = t.unit;
  return r ? `${n} / ${r}` : n;
}
function Uk(e) {
  if (!e || typeof e != "object") return "";
  const t = e.unit;
  return t
    ? `${e.type || ""}${e.type ? " \xB7 " : ""}${t}`.trim()
    : e.type || "";
}
function Hk() {
  var ue, Ne;
  const [e, t] = Yu(),
    [n, r] = m.exports.useState([]),
    [o, l] = m.exports.useState({}),
    [a, i] = m.exports.useState(null),
    [u, c] = m.exports.useState(!1),
    f = m.exports.useCallback(async () => {
      try {
        const ne = ((await jh()).names || [])
          .filter((re) => re.endsWith(".axes"))
          .map((re) => re.replace(/\.axes$/, ""))
          .sort((re, ut) => {
            const _e = In(re),
              be = In(ut);
            return _e != null && be != null ? be - _e : ut.localeCompare(re);
          });
        if (ne.length === 0) {
          r((re) => (re.length === 0 ? re : [])), l({}), i(null);
          return;
        }
        const ie = ne.flatMap((re) => [`${re}.fragment_fqn`, `${re}.axes`]),
          de = await xo(ie),
          fe = {};
        for (const re of ne) {
          const ut = de[`${re}.fragment_fqn`],
            _e = de[`${re}.axes`];
          let be = null;
          if (_e)
            try {
              be = `${JSON.parse(_e[1]).length}D`;
            } catch {}
          fe[re] = { fragmentFqn: ut ? ut[1] : null, dims: be };
        }
        r((re) => (JSON.stringify(re) === JSON.stringify(ne) ? re : ne)),
          l(fe),
          i(null);
      } catch (B) {
        i(B.message || String(B));
      } finally {
        c(!0);
      }
    }, []);
  m.exports.useEffect(() => {
    f();
    const B = setInterval(f, Bk);
    return () => clearInterval(B);
  }, [f]);
  const d = m.exports.useMemo(
      () =>
        n.map((B) => {
          const H = o[B] || {},
            ne = H.fragmentFqn,
            ie = ne || B.replace(/^ndscan\./, "");
          return {
            prefix: B,
            rid: In(B),
            dims: H.dims,
            expName: ie,
            fragmentFqn: ne,
          };
        }),
      [n, o],
    ),
    [h, y] = m.exports.useState(null);
  m.exports.useEffect(() => {
    const B = e.get("scan");
    if (B) {
      y((H) => (H === B ? H : B));
      return;
    }
    d.length && !h && y(d[0].prefix);
  }, [e, d, h]);
  const E = m.exports.useCallback(
      (B) => {
        y(B.prefix);
        const H = new URLSearchParams(e);
        H.set("scan", B.prefix), t(H, { replace: !0 });
      },
      [e, t],
    ),
    { data: x, connectionState: k, error: v } = Ck(h, { enabled: !!h }),
    p = m.exports.useMemo(() => Wk(x, h), [x, h]),
    g =
      (p == null ? void 0 : p.dims) ||
      ((ue = o[h]) == null ? void 0 : ue.dims) ||
      null,
    w =
      (p == null ? void 0 : p.fragmentFqn) ||
      ((Ne = o[h]) == null ? void 0 : Ne.fragmentFqn) ||
      null,
    C = w || (h || "").replace(/^ndscan\./, ""),
    S =
      p != null && p.channels ? Object.keys(p.channels).sort().join("\0") : "",
    N = m.exports.useMemo(() => (S ? S.split("\0") : []), [S]),
    [O, j] = m.exports.useState({});
  m.exports.useEffect(() => {
    if (!N.length) return;
    const B = Tk(w);
    j((H) => {
      let ne = !1;
      const ie = { ...H };
      for (let de = 0; de < N.length; de++) {
        const fe = N[de];
        if (B && fe in B) {
          const re = !!B[fe];
          ie[fe] !== re && ((ie[fe] = re), (ne = !0));
        } else fe in ie || ((ie[fe] = de < 3), (ne = !0));
      }
      return ne ? ie : H;
    });
  }, [w, N]);
  const D = m.exports.useCallback(
      (B) => {
        j((H) => {
          const ne = { ...H, [B]: !H[B] };
          return bk(w, ne), ne;
        });
      },
      [w],
    ),
    [z, G] = m.exports.useState(null);
  m.exports.useEffect(() => {
    g === "2D" && N.length && !N.includes(z) && G(N[0]);
  }, [g, N, z]);
  const [Q, P] = m.exports.useState([]),
    M = m.exports.useRef(null);
  m.exports.useEffect(() => {
    P([]), (M.current = null);
  }, [h]),
    m.exports.useEffect(() => {
      var de;
      if (!p || p.axes.length !== 0) return;
      const B = Object.keys(p.channels),
        H = {};
      let ne = !1;
      for (const fe of B) {
        const re =
          (de = x == null ? void 0 : x[`${h}.point.${fe}`]) == null
            ? void 0
            : de[1];
        re !== void 0 && ((H[fe] = re), (ne = !0));
      }
      if (!ne) return;
      const ie = M.current;
      (!ie || B.some((fe) => H[fe] !== ie[fe])) &&
        ((M.current = H), P((fe) => [...fe, { t: Date.now(), snap: H }]));
    }, [x, p, h]);
  const W = m.exports.useMemo(() => {
      if (!p || p.axes.length !== 0 || Q.length === 0) return null;
      const B = Q[0].t,
        H = Q.map((ie) => (ie.t - B) / 1e3),
        ne = {};
      for (const ie of Object.keys(p.channels))
        ne[ie] = Q.map((de) => de.snap[ie]);
      return { xs: H, channelValues: ne };
    }, [Q, p]),
    q = m.exports.useMemo(
      () =>
        p
          ? N.map((B, H) => {
              const ne = p.channels[B] || {},
                ie = p.channelData[B] || {},
                de = md[H % md.length],
                re = g === "2D" ? g === "2D" && B === z : !!O[B];
              return {
                key: B,
                on: re,
                color: `var(${de})`,
                unit: Uk(ne),
                values: ie.values || [],
                point: ie.point,
              };
            })
          : [],
      [p, N, O, g, z],
    ),
    [_, I] = m.exports.useState([]);
  m.exports.useEffect(() => {
    I([]);
  }, [h]);
  const b = m.exports.useCallback((B) => {
      I((H) => (H.includes(B) ? H.filter((ne) => ne !== B) : [...H, B]));
    }, []),
    [A, V] = m.exports.useState({});
  m.exports.useEffect(() => {
    V((B) => (Object.keys(B).length === 0 ? B : {}));
  }, [h]);
  const T = _.join(" ");
  m.exports.useEffect(() => {
    if (g !== "1D" || _.length === 0) return;
    let B = !1;
    async function H() {
      const ne = _.filter((ie) => !A[ie]);
      if (!!ne.length)
        try {
          const ie = ne.flatMap((fe) => [
              `${fe}.points.axis_0`,
              ...N.map((re) => `${fe}.points.channel_${re}`),
            ]),
            de = await xo(ie);
          if (B) return;
          V((fe) => {
            var ut, _e;
            const re = { ...fe };
            for (const be of ne) {
              const Dn =
                  ((ut = de[`${be}.points.axis_0`]) == null ? void 0 : ut[1]) ||
                  [],
                un = N[0],
                Mn = un
                  ? ((_e = de[`${be}.points.channel_${un}`]) == null
                      ? void 0
                      : _e[1]) || []
                  : [];
              re[be] = { xs: Dn, values: Mn, rid: In(be) };
            }
            return re;
          });
        } catch (ie) {
          console.error("Failed to load ghost data:", ie);
        }
    }
    return (
      H(),
      () => {
        B = !0;
      }
    );
  }, [T, S, g]);
  const F = m.exports.useMemo(
      () =>
        g !== "1D"
          ? []
          : _.map((B) => A[B]).filter((B) => B && B.values && B.values.length),
      [_, A, g],
    ),
    K = m.exports.useRef(null),
    Y = m.exports.useCallback(async () => {
      if (!K.current || !g) throw new Error("No plot to copy");
      await Fk({
        containerEl: K.current,
        rid: In(h || ""),
        dims: g,
        channelDescriptors: q,
        fragmentFqn: w,
        metric2D: z,
        ghosts: F,
      });
    }, [h, g, q, w, z, F]),
    J = d,
    se = m.exports.useMemo(
      () =>
        h
          ? k === Be.ERROR
            ? "error"
            : k === Be.CONNECTING || k === Be.RECONNECTING
              ? "connecting"
              : p != null && p.completed
                ? "done"
                : "live"
          : null,
      [h, k, p],
    ),
    te = m.exports.useMemo(() => {
      var B;
      return p
        ? g === "1D" || g === "2D"
          ? `${((B = p.axisValues[0]) == null ? void 0 : B.length) || 0} pts`
          : g === "0D" && Q.length > 0
            ? `${Q.length} pts`
            : "streaming"
        : "";
    }, [p, g, Q]);
  return u && d.length === 0
    ? s.createElement(
        "div",
        { className: "plots-app" },
        s.createElement(Gi, {
          recentRuns: [],
          currentPrefix: null,
          onPick: () => {},
          status: null,
          progress: null,
        }),
        s.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              flexDirection: "column",
              gap: 8,
              color: "var(--p-ink50)",
              fontSize: 13,
            },
          },
          s.createElement("div", { className: "p-lbl" }, "idle"),
          s.createElement("div", null, "No NDScans currently in the store."),
          a &&
            s.createElement(
              "div",
              { style: { color: "var(--p-err)", fontSize: 11 } },
              a,
            ),
        ),
      )
    : s.createElement(
        "div",
        { className: "plots-app" },
        s.createElement(Gi, {
          recentRuns: d,
          currentPrefix: h,
          onPick: E,
          progress: te,
          status: se,
          onCopy: p ? Y : void 0,
        }),
        s.createElement(
          "div",
          { className: "p-work" },
          s.createElement(Nv, {
            mode: g || "1D",
            channels: q,
            onToggle: D,
            onPickMetric: G,
            experiment: w,
            saved: !!w,
          }),
          s.createElement(
            "div",
            { className: "p-center" },
            s.createElement(Tv, {
              prefix: h,
              rid: In(h || ""),
              fragmentFqn: w,
              dims: g,
            }),
            s.createElement(
              "div",
              {
                ref: K,
                className: "p-panel",
                style: {
                  flex: 1,
                  padding: 0,
                  position: "relative",
                  minHeight: 0,
                  overflow: "hidden",
                },
              },
              s.createElement(bv, {
                active: p,
                dims: g,
                channelDescriptors: q,
                metric2D: z,
                ghosts: F,
                status: se,
                sseError: v,
                timeseries0D: W,
              }),
            ),
          ),
          s.createElement(Rv, {
            experiment: C,
            runs: J,
            activeRid: In(h || ""),
            ghostPrefixes: _,
            onToggleGhost: b,
            onPick: E,
            dims: g,
          }),
        ),
      );
}
function Tv({ prefix: e, rid: t, fragmentFqn: n, dims: r }) {
  return e
    ? s.createElement(
        "div",
        {
          className: "p-panel",
          style: {
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 40,
            flexWrap: "nowrap",
            overflow: "hidden",
          },
        },
        s.createElement("span", { className: "p-lbl" }, "active"),
        r && s.createElement(wa, { dims: r, accent: !0 }),
        t != null &&
          s.createElement(
            "span",
            {
              className: "p-mono",
              style: {
                color: "var(--p-accent)",
                fontWeight: 600,
                flex: "0 0 auto",
              },
            },
            "#",
            t,
          ),
        s.createElement(
          "span",
          {
            className: "p-mono p-dim",
            style: {
              fontSize: 11,
              flex: "1 1 auto",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            title: n || e,
          },
          n || e,
        ),
      )
    : s.createElement(
        "div",
        {
          className: "p-panel",
          style: {
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 40,
          },
        },
        s.createElement("span", { className: "p-lbl" }, "no run selected"),
      );
}
function bv({
  active: e,
  dims: t,
  channelDescriptors: n,
  metric2D: r,
  ghosts: o,
  status: l,
  sseError: a,
  timeseries0D: i,
}) {
  var u;
  if (l === "connecting" && !e)
    return s.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        },
      },
      "Connecting\u2026",
    );
  if (l === "error" && !e)
    return s.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-err)",
          fontSize: 12,
          padding: 24,
          textAlign: "center",
        },
      },
      a || "Connection error",
    );
  if (!e)
    return s.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        },
      },
      "Waiting for data\u2026",
    );
  if (t === "0D") {
    if (i && i.xs.length > 0) {
      const f = n.map((d) => ({ ...d, values: i.channelValues[d.key] || [] }));
      return s.createElement(Qi, {
        xs: i.xs,
        xLabel: "elapsed / s",
        yLabel: "value",
        channels: f,
      });
    }
    const c = n.map((f) => ({ ...f, value: f.point }));
    return s.createElement(Pv, { channels: c });
  }
  if (t === "1D") {
    const c = e.axisValues[0] || [],
      f = e.axes[0];
    return s.createElement(Qi, {
      xs: c,
      xLabel: Ns(f),
      yLabel: "value",
      channels: n,
      ghosts: o,
    });
  }
  if (t === "2D") {
    const c = e.axisValues[0] || [],
      f = e.axisValues[1] || [],
      d = r || Object.keys(e.channels)[0],
      h = ((u = e.channelData[d]) == null ? void 0 : u.values) || [];
    return s.createElement(_v, {
      xs: c,
      ys: f,
      values: h,
      xLabel: Ns(e.axes[0]),
      yLabel: Ns(e.axes[1]),
      metric: d,
    });
  }
  return s.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--p-ink50)",
        fontSize: 12,
      },
    },
    "Unsupported scan dimensionality: ",
    t,
  );
}
bv.propTypes = {
  active: R.exports.object,
  dims: R.exports.string,
  channelDescriptors: R.exports.array.isRequired,
  metric2D: R.exports.string,
  ghosts: R.exports.array,
  status: R.exports.string,
  sseError: R.exports.string,
  timeseries0D: R.exports.object,
};
Tv.propTypes = {
  prefix: R.exports.string,
  rid: R.exports.number,
  fragmentFqn: R.exports.string,
  dims: R.exports.string,
};
function $v() {
  return s.createElement(Hk, null);
}
var Cl;
function hd(e) {
  if (((!Cl && Cl !== 0) || e) && Hr) {
    var t = document.createElement("div");
    (t.style.position = "absolute"),
      (t.style.top = "-9999px"),
      (t.style.width = "50px"),
      (t.style.height = "50px"),
      (t.style.overflow = "scroll"),
      document.body.appendChild(t),
      (Cl = t.offsetWidth - t.clientWidth),
      document.body.removeChild(t);
  }
  return Cl;
}
function Rs(e) {
  e === void 0 && (e = Ur());
  try {
    var t = e.activeElement;
    return !t || !t.nodeName ? null : t;
  } catch {
    return e.body;
  }
}
const Vk = "data-rr-ui-";
function Kk(e) {
  return `${Vk}${e}`;
}
function Gk(e = document) {
  const t = e.defaultView;
  return Math.abs(t.innerWidth - e.documentElement.clientWidth);
}
const vd = Kk("modal-open");
class _c {
  constructor({
    ownerDocument: t,
    handleContainerOverflow: n = !0,
    isRTL: r = !1,
  } = {}) {
    (this.handleContainerOverflow = n),
      (this.isRTL = r),
      (this.modals = []),
      (this.ownerDocument = t);
  }
  getScrollbarWidth() {
    return Gk(this.ownerDocument);
  }
  getElement() {
    return (this.ownerDocument || document).body;
  }
  setModalAttributes(t) {}
  removeModalAttributes(t) {}
  setContainerStyle(t) {
    const n = { overflow: "hidden" },
      r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.getElement();
    (t.style = { overflow: o.style.overflow, [r]: o.style[r] }),
      t.scrollBarWidth &&
        (n[r] = `${parseInt(Qt(o, r) || "0", 10) + t.scrollBarWidth}px`),
      o.setAttribute(vd, ""),
      Qt(o, n);
  }
  reset() {
    [...this.modals].forEach((t) => this.remove(t));
  }
  removeContainerStyle(t) {
    const n = this.getElement();
    n.removeAttribute(vd), Object.assign(n.style, t.style);
  }
  add(t) {
    let n = this.modals.indexOf(t);
    return (
      n !== -1 ||
        ((n = this.modals.length),
        this.modals.push(t),
        this.setModalAttributes(t),
        n !== 0) ||
        ((this.state = { scrollBarWidth: this.getScrollbarWidth(), style: {} }),
        this.handleContainerOverflow && this.setContainerStyle(this.state)),
      n
    );
  }
  remove(t) {
    const n = this.modals.indexOf(t);
    n !== -1 &&
      (this.modals.splice(n, 1),
      !this.modals.length &&
        this.handleContainerOverflow &&
        this.removeContainerStyle(this.state),
      this.removeModalAttributes(t));
  }
  isTopModal(t) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === t;
  }
}
const Qk = [
  "show",
  "role",
  "className",
  "style",
  "children",
  "backdrop",
  "keyboard",
  "onBackdropClick",
  "onEscapeKeyDown",
  "transition",
  "backdropTransition",
  "autoFocus",
  "enforceFocus",
  "restoreFocus",
  "restoreFocusOptions",
  "renderDialog",
  "renderBackdrop",
  "manager",
  "container",
  "onShow",
  "onHide",
  "onExit",
  "onExited",
  "onExiting",
  "onEnter",
  "onEntering",
  "onEntered",
];
function qk(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
let Os;
function Yk(e) {
  return (
    Os || (Os = new _c({ ownerDocument: e == null ? void 0 : e.document })), Os
  );
}
function Xk(e) {
  const t = fv(),
    n = e || Yk(t),
    r = m.exports.useRef({ dialog: null, backdrop: null });
  return Object.assign(r.current, {
    add: () => n.add(r.current),
    remove: () => n.remove(r.current),
    isTopModal: () => n.isTopModal(r.current),
    setDialogRef: m.exports.useCallback((o) => {
      r.current.dialog = o;
    }, []),
    setBackdropRef: m.exports.useCallback((o) => {
      r.current.backdrop = o;
    }, []),
  });
}
const Lv = m.exports.forwardRef((e, t) => {
  let {
      show: n = !1,
      role: r = "dialog",
      className: o,
      style: l,
      children: a,
      backdrop: i = !0,
      keyboard: u = !0,
      onBackdropClick: c,
      onEscapeKeyDown: f,
      transition: d,
      backdropTransition: h,
      autoFocus: y = !0,
      enforceFocus: E = !0,
      restoreFocus: x = !0,
      restoreFocusOptions: k,
      renderDialog: v,
      renderBackdrop: p = (H) => $.exports.jsx("div", Object.assign({}, H)),
      manager: g,
      container: w,
      onShow: C,
      onHide: S = () => {},
      onExit: N,
      onExited: O,
      onExiting: j,
      onEnter: D,
      onEntering: z,
      onEntered: G,
    } = e,
    Q = qk(e, Qk);
  const P = Vi(w),
    M = Xk(g),
    W = ac(),
    q = mk(n),
    [_, I] = m.exports.useState(!n),
    b = m.exports.useRef(null);
  m.exports.useImperativeHandle(t, () => M, [M]),
    Hr && !q && n && (b.current = Rs()),
    !d && !n && !_ ? I(!0) : n && _ && I(!1);
  const A = He(() => {
      if (
        (M.add(),
        (J.current = Vt(document, "keydown", K)),
        (Y.current = Vt(document, "focus", () => setTimeout(T), !0)),
        C && C(),
        y)
      ) {
        const H = Rs(document);
        M.dialog &&
          H &&
          !Wo(M.dialog, H) &&
          ((b.current = H), M.dialog.focus());
      }
    }),
    V = He(() => {
      if (
        (M.remove(),
        J.current == null || J.current(),
        Y.current == null || Y.current(),
        x)
      ) {
        var H;
        (H = b.current) == null || H.focus == null || H.focus(k),
          (b.current = null);
      }
    });
  m.exports.useEffect(() => {
    !n || !P || A();
  }, [n, P, A]),
    m.exports.useEffect(() => {
      !_ || V();
    }, [_, V]),
    sc(() => {
      V();
    });
  const T = He(() => {
      if (!E || !W() || !M.isTopModal()) return;
      const H = Rs();
      M.dialog && H && !Wo(M.dialog, H) && M.dialog.focus();
    }),
    F = He((H) => {
      H.target === H.currentTarget && (c == null || c(H), i === !0 && S());
    }),
    K = He((H) => {
      u &&
        H.keyCode === 27 &&
        M.isTopModal() &&
        (f == null || f(H), H.defaultPrevented || S());
    }),
    Y = m.exports.useRef(),
    J = m.exports.useRef(),
    se = (...H) => {
      I(!0), O == null || O(...H);
    },
    te = d;
  if (!P || !(n || (te && !_))) return null;
  const ue = Object.assign(
    {
      role: r,
      ref: M.setDialogRef,
      "aria-modal": r === "dialog" ? !0 : void 0,
    },
    Q,
    { style: l, className: o, tabIndex: -1 },
  );
  let Ne = v
    ? v(ue)
    : $.exports.jsx(
        "div",
        Object.assign({}, ue, {
          children: m.exports.cloneElement(a, { role: "document" }),
        }),
      );
  te &&
    (Ne = $.exports.jsx(te, {
      appear: !0,
      unmountOnExit: !0,
      in: !!n,
      onExit: N,
      onExiting: j,
      onExited: se,
      onEnter: D,
      onEntering: z,
      onEntered: G,
      children: Ne,
    }));
  let B = null;
  if (i) {
    const H = h;
    (B = p({ ref: M.setBackdropRef, onClick: F })),
      H && (B = $.exports.jsx(H, { appear: !0, in: !!n, children: B }));
  }
  return $.exports.jsx($.exports.Fragment, {
    children: Un.createPortal(
      $.exports.jsxs($.exports.Fragment, { children: [B, Ne] }),
      P,
    ),
  });
});
Lv.displayName = "Modal";
const Jk = Object.assign(Lv, { Manager: _c });
function Zk(e, t) {
  e.classList
    ? e.classList.add(t)
    : pv(e, t) ||
      (typeof e.className == "string"
        ? (e.className = e.className + " " + t)
        : e.setAttribute(
            "class",
            ((e.className && e.className.baseVal) || "") + " " + t,
          ));
}
var e2 = Function.prototype.bind.call(Function.prototype.call, [].slice);
function or(e, t) {
  return e2(e.querySelectorAll(t));
}
function gd(e, t) {
  return e
    .replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1")
    .replace(/\s+/g, " ")
    .replace(/^\s*|\s*$/g, "");
}
function t2(e, t) {
  e.classList
    ? e.classList.remove(t)
    : typeof e.className == "string"
      ? (e.className = gd(e.className, t))
      : e.setAttribute(
          "class",
          gd((e.className && e.className.baseVal) || "", t),
        );
}
const lr = {
  FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
  STICKY_CONTENT: ".sticky-top",
  NAVBAR_TOGGLER: ".navbar-toggler",
};
class n2 extends _c {
  adjustAndStore(t, n, r) {
    const o = n.style[t];
    (n.dataset[t] = o), Qt(n, { [t]: `${parseFloat(Qt(n, t)) + r}px` });
  }
  restore(t, n) {
    const r = n.dataset[t];
    r !== void 0 && (delete n.dataset[t], Qt(n, { [t]: r }));
  }
  setContainerStyle(t) {
    super.setContainerStyle(t);
    const n = this.getElement();
    if ((Zk(n, "modal-open"), !t.scrollBarWidth)) return;
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    or(n, lr.FIXED_CONTENT).forEach((l) =>
      this.adjustAndStore(r, l, t.scrollBarWidth),
    ),
      or(n, lr.STICKY_CONTENT).forEach((l) =>
        this.adjustAndStore(o, l, -t.scrollBarWidth),
      ),
      or(n, lr.NAVBAR_TOGGLER).forEach((l) =>
        this.adjustAndStore(o, l, t.scrollBarWidth),
      );
  }
  removeContainerStyle(t) {
    super.removeContainerStyle(t);
    const n = this.getElement();
    t2(n, "modal-open");
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    or(n, lr.FIXED_CONTENT).forEach((l) => this.restore(r, l)),
      or(n, lr.STICKY_CONTENT).forEach((l) => this.restore(o, l)),
      or(n, lr.NAVBAR_TOGGLER).forEach((l) => this.restore(o, l));
  }
}
let _s;
function r2(e) {
  return _s || (_s = new n2(e)), _s;
}
const o2 = De("modal-body"),
  jv = m.exports.createContext({ onHide() {} }),
  Pc = m.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        contentClassName: n,
        centered: r,
        size: o,
        fullscreen: l,
        children: a,
        scrollable: i,
        ...u
      },
      c,
    ) => {
      e = ee(e, "modal");
      const f = `${e}-dialog`,
        d = typeof l == "string" ? `${e}-fullscreen-${l}` : `${e}-fullscreen`;
      return $.exports.jsx("div", {
        ...u,
        ref: c,
        className: X(
          f,
          t,
          o && `${e}-${o}`,
          r && `${f}-centered`,
          i && `${f}-scrollable`,
          l && d,
        ),
        children: $.exports.jsx("div", {
          className: X(`${e}-content`, n),
          children: a,
        }),
      });
    },
  );
Pc.displayName = "ModalDialog";
const l2 = De("modal-footer"),
  a2 = { closeLabel: "Close", closeButton: !1 },
  Dv = m.exports.forwardRef(
    (
      {
        closeLabel: e,
        closeVariant: t,
        closeButton: n,
        onHide: r,
        children: o,
        ...l
      },
      a,
    ) => {
      const i = m.exports.useContext(jv),
        u = He(() => {
          i == null || i.onHide(), r == null || r();
        });
      return $.exports.jsxs("div", {
        ref: a,
        ...l,
        children: [
          o,
          n && $.exports.jsx(Vr, { "aria-label": e, variant: t, onClick: u }),
        ],
      });
    },
  );
Dv.defaultProps = a2;
const s2 = { closeLabel: "Close", closeButton: !1 },
  Tc = m.exports.forwardRef(
    ({ bsPrefix: e, className: t, ...n }, r) => (
      (e = ee(e, "modal-header")),
      $.exports.jsx(Dv, { ref: r, ...n, className: X(t, e) })
    ),
  );
Tc.displayName = "ModalHeader";
Tc.defaultProps = s2;
const i2 = Ha("h4"),
  u2 = De("modal-title", { Component: i2 }),
  c2 = {
    show: !1,
    backdrop: !0,
    keyboard: !0,
    autoFocus: !0,
    enforceFocus: !0,
    restoreFocus: !0,
    animation: !0,
    dialogAs: Pc,
  };
function f2(e) {
  return $.exports.jsx(sn, { ...e, timeout: null });
}
function d2(e) {
  return $.exports.jsx(sn, { ...e, timeout: null });
}
const bc = m.exports.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      style: n,
      dialogClassName: r,
      contentClassName: o,
      children: l,
      dialogAs: a,
      "aria-labelledby": i,
      "aria-describedby": u,
      "aria-label": c,
      show: f,
      animation: d,
      backdrop: h,
      keyboard: y,
      onEscapeKeyDown: E,
      onShow: x,
      onHide: k,
      container: v,
      autoFocus: p,
      enforceFocus: g,
      restoreFocus: w,
      restoreFocusOptions: C,
      onEntered: S,
      onExit: N,
      onExiting: O,
      onEnter: j,
      onEntering: D,
      onExited: z,
      backdropClassName: G,
      manager: Q,
      ...P
    },
    M,
  ) => {
    const [W, q] = m.exports.useState({}),
      [_, I] = m.exports.useState(!1),
      b = m.exports.useRef(!1),
      A = m.exports.useRef(!1),
      V = m.exports.useRef(null),
      [T, F] = ya(),
      K = Zo(M, F),
      Y = He(k),
      J = Xu();
    e = ee(e, "modal");
    const se = m.exports.useMemo(() => ({ onHide: Y }), [Y]);
    function te() {
      return Q || r2({ isRTL: J });
    }
    function ue(le) {
      if (!Hr) return;
      const Ft = te().getScrollbarWidth() > 0,
        Kr = le.scrollHeight > Ur(le).documentElement.clientHeight;
      q({
        paddingRight: Ft && !Kr ? hd() : void 0,
        paddingLeft: !Ft && Kr ? hd() : void 0,
      });
    }
    const Ne = He(() => {
      T && ue(T.dialog);
    });
    sc(() => {
      Ri(window, "resize", Ne), V.current == null || V.current();
    });
    const B = () => {
        b.current = !0;
      },
      H = (le) => {
        b.current && T && le.target === T.dialog && (A.current = !0),
          (b.current = !1);
      },
      ne = () => {
        I(!0),
          (V.current = oh(T.dialog, () => {
            I(!1);
          }));
      },
      ie = (le) => {
        le.target === le.currentTarget && ne();
      },
      de = (le) => {
        if (h === "static") {
          ie(le);
          return;
        }
        if (A.current || le.target !== le.currentTarget) {
          A.current = !1;
          return;
        }
        k == null || k();
      },
      fe = (le) => {
        y ? E == null || E(le) : (le.preventDefault(), h === "static" && ne());
      },
      re = (le, Ft) => {
        le && ue(le), j == null || j(le, Ft);
      },
      ut = (le) => {
        V.current == null || V.current(), N == null || N(le);
      },
      _e = (le, Ft) => {
        D == null || D(le, Ft), rh(window, "resize", Ne);
      },
      be = (le) => {
        le && (le.style.display = ""),
          z == null || z(le),
          Ri(window, "resize", Ne);
      },
      Dn = m.exports.useCallback(
        (le) =>
          $.exports.jsx("div", {
            ...le,
            className: X(`${e}-backdrop`, G, !d && "show"),
          }),
        [d, G, e],
      ),
      un = { ...n, ...W };
    un.display = "block";
    const Mn = (le) =>
      $.exports.jsx("div", {
        role: "dialog",
        ...le,
        style: un,
        className: X(t, e, _ && `${e}-static`, !d && "show"),
        onClick: h ? de : void 0,
        onMouseUp: H,
        "aria-label": c,
        "aria-labelledby": i,
        "aria-describedby": u,
        children: $.exports.jsx(a, {
          ...P,
          onMouseDown: B,
          className: r,
          contentClassName: o,
          children: l,
        }),
      });
    return $.exports.jsx(jv.Provider, {
      value: se,
      children: $.exports.jsx(Jk, {
        show: f,
        ref: K,
        backdrop: h,
        container: v,
        keyboard: !0,
        autoFocus: p,
        enforceFocus: g,
        restoreFocus: w,
        restoreFocusOptions: C,
        onEscapeKeyDown: fe,
        onShow: x,
        onHide: k,
        onEnter: re,
        onEntering: _e,
        onEntered: S,
        onExit: ut,
        onExiting: O,
        onExited: be,
        manager: te(),
        transition: d ? f2 : void 0,
        backdropTransition: d ? d2 : void 0,
        renderBackdrop: Dn,
        renderDialog: Mn,
      }),
    });
  },
);
bc.displayName = "Modal";
bc.defaultProps = c2;
const Nl = Object.assign(bc, {
  Body: o2,
  Header: Tc,
  Title: u2,
  Footer: l2,
  Dialog: Pc,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
});
function Mv({ errorType: e, show: t }) {
  const r = (() => {
    switch (e) {
      case "backend":
        return {
          title: "Backend Connection Lost",
          message: "Cannot connect to the backend server.",
          variant: "danger",
        };
      case "artiq":
        return {
          title: "ARTIQ Connection Lost",
          message: "The backend cannot connect to the ARTIQ master.",
          variant: "warning",
        };
      default:
        return null;
    }
  })();
  return !r || !t
    ? null
    : s.createElement(
        Nl,
        {
          show: t,
          backdrop: "static",
          keyboard: !1,
          centered: !0,
          className: "connection-error-modal",
        },
        s.createElement(
          Nl.Header,
          { className: `bg-${r.variant} text-white` },
          s.createElement(
            Nl.Title,
            null,
            s.createElement("i", {
              className: "bi bi-exclamation-triangle-fill me-2",
            }),
            r.title,
          ),
        ),
        s.createElement(
          Nl.Body,
          null,
          s.createElement(
            Ea,
            { variant: r.variant, className: "mb-3" },
            s.createElement("strong", null, r.message),
          ),
          s.createElement(
            "div",
            { className: "text-center" },
            s.createElement(Rc, {
              animation: "border",
              role: "status",
              className: "me-2",
            }),
            s.createElement("span", null, "Attempting to reconnect..."),
          ),
          s.createElement(
            "p",
            { className: "text-muted mt-3 mb-0 small" },
            "The interface will automatically resume once the connection is restored.",
          ),
        ),
      );
}
Mv.propTypes = {
  errorType: R.exports.oneOf(["backend", "artiq", null]),
  show: R.exports.bool.isRequired,
};
class ar extends s.Component {
  constructor(t) {
    super(t), (this.state = { hasError: !1, error: null });
  }
  static getDerivedStateFromError(t) {
    return { hasError: !0, error: t };
  }
  componentDidCatch(t, n) {
    console.error("ErrorBoundary caught an error:", t, n);
  }
  render() {
    var t;
    return this.state.hasError
      ? s.createElement(
          Ea,
          { variant: "danger", className: "m-3" },
          s.createElement(Ea.Heading, null, "Something went wrong."),
          s.createElement(
            "p",
            { className: "small" },
            ((t = this.state.error) == null ? void 0 : t.message) ||
              "Unknown error",
          ),
        )
      : this.props.children;
  }
}
const Iv = [
  { name: "CRITICAL", value: 50, className: "log-level-critical" },
  { name: "ERROR", value: 40, className: "log-level-error" },
  { name: "WARNING", value: 30, className: "log-level-warning" },
  { name: "INFO", value: 20, className: "log-level-info" },
  { name: "DEBUG", value: 10, className: "log-level-debug" },
];
function yd(e) {
  if (typeof e != "number")
    return { name: String(e != null ? e : ""), className: "log-level-debug" };
  for (const t of Iv) if (e >= t.value) return t;
  return { name: String(e), className: "log-level-debug" };
}
function xd(e) {
  if (typeof e != "number" || Number.isNaN(e)) return "";
  const t = new Date(e * 1e3);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
const p2 = 5e3,
  m2 = (e) =>
    e &&
    (e.length > 200 ||
      e.includes(`
`));
function h2({ currentPage: e }) {
  const [t, n] = m.exports.useState([]),
    [r, o] = m.exports.useState(!0),
    [l, a] = m.exports.useState(!1),
    [i, u] = m.exports.useState(null),
    [c, f] = m.exports.useState(20),
    [d, h] = m.exports.useState(new Set()),
    y = m.exports.useRef(0),
    E = (v) =>
      h((p) => {
        const g = new Set(p);
        return g.has(v) ? g.delete(v) : g.add(v), g;
      }),
    x = m.exports.useCallback(async (v = !1) => {
      const p = Date.now();
      (y.current = p), v ? a(!0) : o(!0);
      try {
        const g = await CE();
        if (y.current !== p) return;
        n(Array.isArray(g == null ? void 0 : g.logs) ? g.logs : []), u(null);
      } catch (g) {
        if (y.current !== p) return;
        u(`Failed to load logs: ${g.message}`);
      } finally {
        y.current === p && (o(!1), a(!1));
      }
    }, []);
  m.exports.useEffect(() => {
    x(!1);
  }, [x]),
    m.exports.useEffect(() => {
      const v = setInterval(() => {
        document.visibilityState === "visible" && e === "logs" && x(!0);
      }, p2);
      return () => clearInterval(v);
    }, [x, e]),
    m.exports.useEffect(() => {
      const v = () => {
        document.visibilityState === "visible" && e === "logs" && x(!0);
      };
      return (
        document.addEventListener("visibilitychange", v),
        () => document.removeEventListener("visibilitychange", v)
      );
    }, [x, e]);
  const k = m.exports.useMemo(
    () =>
      t
        .filter((v) => (typeof v.level == "number" ? v.level : 0) >= c)
        .sort((v, p) => p.timestamp - v.timestamp),
    [t, c],
  );
  return r
    ? s.createElement(
        "div",
        { className: "logs-loading" },
        s.createElement("div", {
          className: "logs-spinner",
          "aria-label": "Loading logs",
        }),
        s.createElement("span", null, "Loading logs\u2026"),
      )
    : s.createElement(
        "div",
        { className: "logs-container" },
        i &&
          s.createElement(
            "div",
            { className: "logs-error-banner", role: "alert" },
            i,
          ),
        !i &&
          t.length > 0 &&
          s.createElement(
            "div",
            { className: "logs-filter-bar" },
            s.createElement(
              "label",
              { htmlFor: "log-level-filter" },
              "Minimum level:",
            ),
            s.createElement(
              "select",
              {
                id: "log-level-filter",
                value: c,
                onChange: (v) => f(Number(v.target.value)),
              },
              Iv.map((v) =>
                s.createElement(
                  "option",
                  { key: v.value, value: v.value },
                  v.name,
                ),
              ),
            ),
            s.createElement(
              "span",
              { className: "logs-count" },
              k.length,
              " entries",
            ),
            s.createElement(
              "button",
              {
                className:
                  "btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1",
                onClick: () => x(!0),
                disabled: l,
                "aria-label": "Refresh logs",
              },
              s.createElement(ch, {
                className: l ? "logs-icon-spin" : "",
                "aria-hidden": "true",
              }),
              "Refresh",
            ),
          ),
        k.length === 0
          ? s.createElement(
              "div",
              { className: "logs-empty-state" },
              t.length === 0
                ? "No log entries available."
                : "No log entries match the selected filter.",
            )
          : s.createElement(
              s.Fragment,
              null,
              s.createElement(
                "div",
                { className: "logs-table-wrapper" },
                s.createElement(
                  "table",
                  { className: "logs-table" },
                  s.createElement(
                    "thead",
                    null,
                    s.createElement(
                      "tr",
                      null,
                      s.createElement("th", null, "Time"),
                      s.createElement("th", null, "Source"),
                      s.createElement("th", null, "Level"),
                      s.createElement("th", null, "Message"),
                    ),
                  ),
                  s.createElement(
                    "tbody",
                    null,
                    k.map((v, p) => {
                      var C, S;
                      const { name: g, className: w } = yd(v.level);
                      return s.createElement(
                        "tr",
                        { key: p },
                        s.createElement(
                          "td",
                          { className: "logs-timestamp" },
                          xd(v.timestamp),
                        ),
                        s.createElement(
                          "td",
                          null,
                          (C = v.source) != null ? C : "",
                        ),
                        s.createElement(
                          "td",
                          null,
                          s.createElement(
                            "span",
                            { className: `log-level-pill ${w}` },
                            g,
                          ),
                        ),
                        s.createElement(
                          "td",
                          { className: "logs-message" },
                          (S = v.message) != null ? S : "",
                        ),
                      );
                    }),
                  ),
                ),
              ),
              s.createElement(
                "div",
                { className: "logs-cards-list" },
                k.map((v, p) => {
                  var S;
                  const { name: g, className: w } = yd(v.level),
                    C = d.has(p);
                  return s.createElement(
                    "div",
                    { key: p, className: "logs-card" },
                    s.createElement(
                      "div",
                      { className: "logs-card-header" },
                      s.createElement(
                        "span",
                        { className: `log-level-pill ${w}` },
                        g,
                      ),
                      s.createElement(
                        "span",
                        { className: "logs-card-timestamp" },
                        xd(v.timestamp),
                      ),
                    ),
                    v.source &&
                      s.createElement(
                        "div",
                        { className: "logs-card-source" },
                        v.source,
                      ),
                    s.createElement(
                      "div",
                      {
                        className: `logs-card-message${
                          C ? " is-expanded" : ""
                        }`,
                      },
                      (S = v.message) != null ? S : "",
                    ),
                    m2(v.message) &&
                      s.createElement(
                        "button",
                        {
                          className: "logs-card-expand-btn",
                          onClick: () => E(p),
                        },
                        C ? "Show less" : "Show more",
                      ),
                  );
                }),
              ),
            ),
      );
}
function v2({ currentPage: e, onPageChange: t }) {
  const n = [
    { id: "running", label: "Running", Icon: Yx },
    { id: "datasets", label: "Datasets", Icon: Ox },
    { id: "plots", label: "Plots", Icon: gh },
    { id: "schedule", label: "Schedule", Icon: Kx },
    { id: "configure", label: "Configure", Icon: rE },
    { id: "logs", label: "Logs", Icon: Wx },
  ];
  return s.createElement(
    "nav",
    { className: "mobile-nav", "aria-label": "Primary" },
    n.map(({ id: r, label: o, Icon: l }) => {
      const a = e === r;
      return s.createElement(
        "button",
        {
          key: r,
          type: "button",
          className: `mobile-nav__item ${a ? "is-active" : ""}`,
          onClick: () => t(r),
          "aria-label": o,
          "aria-current": a ? "page" : void 0,
        },
        s.createElement("span", {
          className: "mobile-nav__indicator",
          "aria-hidden": "true",
        }),
        s.createElement(
          "span",
          { className: "mobile-nav__icon", "aria-hidden": "true" },
          s.createElement(l, { size: 20 }),
        ),
        s.createElement("span", { className: "mobile-nav__label" }, o),
      );
    }),
  );
}
function g2() {
  return s.createElement(
    "div",
    {
      className: "plots-fullscreen-wrap",
      style: { width: "100vw", height: "100vh", overflow: "hidden" },
    },
    s.createElement($v, null),
  );
}
const y2 = {
  running: "RUNNING",
  datasets: "DATASETS",
  plots: "PLOTS",
  schedule: "SCHEDULE",
  configure: "CONFIGURE",
};
function x2({ currentPage: e, isOnline: t }) {
  return s.createElement(
    "header",
    { className: "app-topbar mobile-only", "aria-label": "ARTIQ control bar" },
    s.createElement(
      "div",
      { className: "app-topbar__brand" },
      s.createElement("span", { className: "app-topbar__mark" }, "ARTIQ"),
      s.createElement(
        "span",
        { className: "app-topbar__section" },
        y2[e] || "",
      ),
    ),
    s.createElement(
      "div",
      {
        className: `app-topbar__status ${t ? "is-online" : "is-offline"}`,
        "aria-live": "polite",
      },
      s.createElement("span", { className: "app-topbar__dot" }),
      s.createElement(
        "span",
        { className: "app-topbar__status-text" },
        t ? "ONLINE" : "OFFLINE",
      ),
    ),
  );
}
const E2 = 5e3;
function w2() {
  const [e, t] = m.exports.useState(null),
    [n, r] = m.exports.useState(null),
    [o, l] = m.exports.useState(null),
    a = on(),
    i = Aa(),
    [u] = Yu(),
    f = ((x) =>
      x.startsWith("/datasets")
        ? "datasets"
        : x.startsWith("/plots")
          ? "plots"
          : x.startsWith("/schedule")
            ? "schedule"
            : x.startsWith("/configure")
              ? "configure"
              : x.startsWith("/running")
                ? "running"
                : x.startsWith("/logs")
                  ? "logs"
                  : "schedule")(a.pathname);
  m.exports.useEffect(() => {
    const x = u.get("experiment"),
      k = u.get("rev");
    x && (t(x), r(k));
  }, [u]);
  const d = (x) => {
    const v =
      {
        running: "/running",
        datasets: "/datasets",
        plots: "/plots",
        schedule: "/schedule",
        configure: "/configure",
        logs: "/logs",
      }[x] || "/schedule";
    i(v);
  };
  m.exports.useEffect(() => {
    const x = document.getElementById(`section-${f}`);
    x && x.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f]);
  const [h, y] = m.exports.useState({});
  m.exports.useEffect(() => {
    const x = () => {
      wE()
        .then(y)
        .catch((v) =>
          console.error("Experiment list update error:", v.message),
        );
    };
    x();
    const k = setInterval(x, 1e4);
    return () => clearInterval(k);
  }, []);
  const E = (x) => {
    const k = x.experiment,
      v = `${k.file}:${k.class_name}`;
    t(v), r(h.repo_rev);
    const p = new URLSearchParams();
    p.set("experiment", v),
      h.repo_rev && p.set("rev", h.repo_rev),
      i({ pathname: "/configure", search: p.toString() }),
      setTimeout(() => {
        const g = document.getElementById("section-configure");
        g && g.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
  };
  return (
    m.exports.useEffect(() => {
      const x = u.get("experiment");
      x && t(x);
    }, [u]),
    m.exports.useEffect(() => {
      const x = async () => {
        try {
          (await kE()).artiq_connected ? l(null) : l("artiq");
        } catch {
          l("backend");
        }
      };
      x();
      const k = setInterval(x, E2);
      return () => clearInterval(k);
    }, []),
    a.pathname === "/plots/fullscreen"
      ? s.createElement(g2, null)
      : s.createElement(
          "div",
          { className: "app-container" },
          s.createElement(Mv, { errorType: o, show: o !== null }),
          s.createElement(x2, { currentPage: f, isOnline: o === null }),
          s.createElement(
            Ju,
            { fluid: !0, className: "p-3 p-md-4" },
            s.createElement(
              "h1",
              { className: "app-h1-desktop desktop-only" },
              "ARTIQ HTTP interface",
            ),
            s.createElement(
              $t,
              {
                id: "section-running",
                className: `pt-2 page-section ${
                  f === "running" ? "active" : ""
                }`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Running" },
                  s.createElement(ar, null, s.createElement(LE, null)),
                ),
              ),
            ),
            s.createElement(
              $t,
              {
                id: "section-datasets",
                className: `pt-2 page-section ${
                  f === "datasets" ? "active" : ""
                }`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Datasets", defaultExpanded: !1 },
                  s.createElement(ar, null, s.createElement(Sk, null)),
                ),
              ),
            ),
            s.createElement(
              $t,
              {
                id: "section-plots",
                className: `pt-2 page-section ${f === "plots" ? "active" : ""}`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Plots", defaultExpanded: !1 },
                  s.createElement(ar, null, s.createElement($v, null)),
                ),
              ),
            ),
            s.createElement(
              $t,
              {
                id: "section-schedule",
                className: `pt-2 page-section ${
                  f === "schedule" ? "active" : ""
                }`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Schedule new" },
                  s.createElement(
                    ar,
                    null,
                    s.createElement(ME, {
                      explist: h,
                      onSelect: E,
                      selectedExperiment: e,
                    }),
                  ),
                ),
              ),
            ),
            s.createElement(
              $t,
              {
                id: "section-configure",
                className: `pt-2 page-section ${
                  f === "configure" ? "active" : ""
                }`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Configure Submission" },
                  s.createElement(
                    ar,
                    null,
                    s.createElement(pk, {
                      explist: h,
                      experiment: e,
                      repo_rev: n,
                    }),
                  ),
                ),
              ),
            ),
            s.createElement(
              $t,
              {
                id: "section-logs",
                className: `pt-2 page-section ${f === "logs" ? "active" : ""}`,
              },
              s.createElement(
                Ue,
                null,
                s.createElement(
                  rr,
                  { title: "Logs", defaultExpanded: !1 },
                  s.createElement(
                    ar,
                    null,
                    s.createElement(h2, { currentPage: f }),
                  ),
                ),
              ),
            ),
          ),
          s.createElement(v2, { currentPage: f, onPageChange: d }),
        )
  );
}
Pm(document.getElementById("root")).render(
  s.createElement(_1, null, s.createElement(w2, null)),
);
