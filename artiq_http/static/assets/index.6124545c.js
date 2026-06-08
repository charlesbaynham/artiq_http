function Wv(e, t) {
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
function Sd(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var p = { exports: {} },
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
  Uv = Symbol.for("react.portal"),
  Hv = Symbol.for("react.fragment"),
  Vv = Symbol.for("react.strict_mode"),
  Kv = Symbol.for("react.profiler"),
  Gv = Symbol.for("react.provider"),
  Qv = Symbol.for("react.context"),
  qv = Symbol.for("react.forward_ref"),
  Yv = Symbol.for("react.suspense"),
  Xv = Symbol.for("react.memo"),
  Jv = Symbol.for("react.lazy"),
  Dc = Symbol.iterator;
function Zv(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Dc && e[Dc]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var kd = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Nd = Object.assign,
  Cd = {};
function Fr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = Cd),
    (this.updater = n || kd);
}
Fr.prototype.isReactComponent = {};
Fr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Fr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Rd() {}
Rd.prototype = Fr.prototype;
function Xi(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = Cd),
    (this.updater = n || kd);
}
var Ji = (Xi.prototype = new Rd());
Ji.constructor = Xi;
Nd(Ji, Fr.prototype);
Ji.isPureReactComponent = !0;
var Mc = Array.isArray,
  _d = Object.prototype.hasOwnProperty,
  Zi = { current: null },
  Od = { key: !0, ref: !0, __self: !0, __source: !0 };
function Pd(e, t, n) {
  var r,
    o = {},
    l = null,
    a = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (a = t.ref),
    t.key !== void 0 && (l = "" + t.key),
    t))
      _d.call(t, r) && !Od.hasOwnProperty(r) && (o[r] = t[r]);
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
    _owner: Zi.current,
  };
}
function eg(e, t) {
  return {
    $$typeof: Vo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function eu(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Vo;
}
function tg(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var Ic = /\/+/g;
function qa(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? tg("" + e.key)
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
          case Uv:
            a = !0;
        }
    }
  if (a)
    return (
      (a = e),
      (o = o(a)),
      (e = r === "" ? "." + qa(a, 0) : r),
      Mc(o)
        ? ((n = ""),
          e != null && (n = e.replace(Ic, "$&/") + "/"),
          Rl(o, t, n, "", function (c) {
            return c;
          }))
        : o != null &&
          (eu(o) &&
            (o = eg(
              o,
              n +
                (!o.key || (a && a.key === o.key)
                  ? ""
                  : ("" + o.key).replace(Ic, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((a = 0), (r = r === "" ? "." : r + ":"), Mc(e)))
    for (var i = 0; i < e.length; i++) {
      l = e[i];
      var u = r + qa(l, i);
      a += Rl(l, t, n, u, o);
    }
  else if (((u = Zv(e)), typeof u == "function"))
    for (e = u.call(e), i = 0; !(l = e.next()).done; )
      (l = l.value), (u = r + qa(l, i++)), (a += Rl(l, t, n, u, o));
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
function ng(e) {
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
var Ge = { current: null },
  _l = { transition: null },
  rg = {
    ReactCurrentDispatcher: Ge,
    ReactCurrentBatchConfig: _l,
    ReactCurrentOwner: Zi,
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
    if (!eu(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
oe.Component = Fr;
oe.Fragment = Hv;
oe.Profiler = Kv;
oe.PureComponent = Xi;
oe.StrictMode = Vv;
oe.Suspense = Yv;
oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = rg;
oe.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Nd({}, e.props),
    o = e.key,
    l = e.ref,
    a = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((l = t.ref), (a = Zi.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var i = e.type.defaultProps;
    for (u in t)
      _d.call(t, u) &&
        !Od.hasOwnProperty(u) &&
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
      $$typeof: Qv,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Gv, _context: e }),
    (e.Consumer = e)
  );
};
oe.createElement = Pd;
oe.createFactory = function (e) {
  var t = Pd.bind(null, e);
  return (t.type = e), t;
};
oe.createRef = function () {
  return { current: null };
};
oe.forwardRef = function (e) {
  return { $$typeof: qv, render: e };
};
oe.isValidElement = eu;
oe.lazy = function (e) {
  return { $$typeof: Jv, _payload: { _status: -1, _result: e }, _init: ng };
};
oe.memo = function (e, t) {
  return { $$typeof: Xv, type: e, compare: t === void 0 ? null : t };
};
oe.startTransition = function (e) {
  var t = _l.transition;
  _l.transition = {};
  try {
    e();
  } finally {
    _l.transition = t;
  }
};
oe.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
oe.useCallback = function (e, t) {
  return Ge.current.useCallback(e, t);
};
oe.useContext = function (e) {
  return Ge.current.useContext(e);
};
oe.useDebugValue = function () {};
oe.useDeferredValue = function (e) {
  return Ge.current.useDeferredValue(e);
};
oe.useEffect = function (e, t) {
  return Ge.current.useEffect(e, t);
};
oe.useId = function () {
  return Ge.current.useId();
};
oe.useImperativeHandle = function (e, t, n) {
  return Ge.current.useImperativeHandle(e, t, n);
};
oe.useInsertionEffect = function (e, t) {
  return Ge.current.useInsertionEffect(e, t);
};
oe.useLayoutEffect = function (e, t) {
  return Ge.current.useLayoutEffect(e, t);
};
oe.useMemo = function (e, t) {
  return Ge.current.useMemo(e, t);
};
oe.useReducer = function (e, t, n) {
  return Ge.current.useReducer(e, t, n);
};
oe.useRef = function (e) {
  return Ge.current.useRef(e);
};
oe.useState = function (e) {
  return Ge.current.useState(e);
};
oe.useSyncExternalStore = function (e, t, n) {
  return Ge.current.useSyncExternalStore(e, t, n);
};
oe.useTransition = function () {
  return Ge.current.useTransition();
};
oe.version = "18.2.0";
(function (e) {
  e.exports = oe;
})(p);
const s = Sd(p.exports),
  og = Wv({ __proto__: null, default: s }, [p.exports]);
var tu = { exports: {} },
  ct = {},
  bd = { exports: {} },
  Td = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(O, I) {
    var $ = O.length;
    O.push(I);
    e: for (; 0 < $; ) {
      var B = ($ - 1) >>> 1,
        H = O[B];
      if (0 < o(H, I)) (O[B] = I), (O[$] = H), ($ = B);
      else break e;
    }
  }
  function n(O) {
    return O.length === 0 ? null : O[0];
  }
  function r(O) {
    if (O.length === 0) return null;
    var I = O[0],
      $ = O.pop();
    if ($ !== I) {
      O[0] = $;
      e: for (var B = 0, H = O.length, b = H >>> 1; B < b; ) {
        var z = 2 * (B + 1) - 1,
          V = O[z],
          q = z + 1,
          X = O[q];
        if (0 > o(V, $))
          q < H && 0 > o(X, V)
            ? ((O[B] = X), (O[q] = $), (B = q))
            : ((O[B] = V), (O[z] = $), (B = z));
        else if (q < H && 0 > o(X, $)) (O[B] = X), (O[q] = $), (B = q);
        else break e;
      }
    }
    return I;
  }
  function o(O, I) {
    var $ = O.sortIndex - I.sortIndex;
    return $ !== 0 ? $ : O.id - I.id;
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
    g = !1,
    E = !1,
    x = !1,
    k = typeof setTimeout == "function" ? setTimeout : null,
    v = typeof clearTimeout == "function" ? clearTimeout : null,
    m = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function y(O) {
    for (var I = n(c); I !== null; ) {
      if (I.callback === null) r(c);
      else if (I.startTime <= O)
        r(c), (I.sortIndex = I.expirationTime), t(u, I);
      else break;
      I = n(c);
    }
  }
  function w(O) {
    if (((x = !1), y(O), !E))
      if (n(u) !== null) (E = !0), F(N);
      else {
        var I = n(c);
        I !== null && Q(w, I.startTime - O);
      }
  }
  function N(O, I) {
    (E = !1), x && ((x = !1), v(_), (_ = -1)), (g = !0);
    var $ = h;
    try {
      for (
        y(I), d = n(u);
        d !== null && (!(d.expirationTime > I) || (O && !A()));

      ) {
        var B = d.callback;
        if (typeof B == "function") {
          (d.callback = null), (h = d.priorityLevel);
          var H = B(d.expirationTime <= I);
          (I = e.unstable_now()),
            typeof H == "function" ? (d.callback = H) : d === n(u) && r(u),
            y(I);
        } else r(u);
        d = n(u);
      }
      if (d !== null) var b = !0;
      else {
        var z = n(c);
        z !== null && Q(w, z.startTime - I), (b = !1);
      }
      return b;
    } finally {
      (d = null), (h = $), (g = !1);
    }
  }
  var S = !1,
    C = null,
    _ = -1,
    j = 5,
    D = -1;
  function A() {
    return !(e.unstable_now() - D < j);
  }
  function K() {
    if (C !== null) {
      var O = e.unstable_now();
      D = O;
      var I = !0;
      try {
        I = C(!0, O);
      } finally {
        I ? G() : ((S = !1), (C = null));
      }
    } else S = !1;
  }
  var G;
  if (typeof m == "function")
    G = function () {
      m(K);
    };
  else if (typeof MessageChannel < "u") {
    var P = new MessageChannel(),
      M = P.port2;
    (P.port1.onmessage = K),
      (G = function () {
        M.postMessage(null);
      });
  } else
    G = function () {
      k(K, 0);
    };
  function F(O) {
    (C = O), S || ((S = !0), G());
  }
  function Q(O, I) {
    _ = k(function () {
      O(e.unstable_now());
    }, I);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (O) {
      O.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      E || g || ((E = !0), F(N));
    }),
    (e.unstable_forceFrameRate = function (O) {
      0 > O || 125 < O
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (j = 0 < O ? Math.floor(1e3 / O) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return h;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(u);
    }),
    (e.unstable_next = function (O) {
      switch (h) {
        case 1:
        case 2:
        case 3:
          var I = 3;
          break;
        default:
          I = h;
      }
      var $ = h;
      h = I;
      try {
        return O();
      } finally {
        h = $;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (O, I) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var $ = h;
      h = O;
      try {
        return I();
      } finally {
        h = $;
      }
    }),
    (e.unstable_scheduleCallback = function (O, I, $) {
      var B = e.unstable_now();
      switch (
        (typeof $ == "object" && $ !== null
          ? (($ = $.delay), ($ = typeof $ == "number" && 0 < $ ? B + $ : B))
          : ($ = B),
        O)
      ) {
        case 1:
          var H = -1;
          break;
        case 2:
          H = 250;
          break;
        case 5:
          H = 1073741823;
          break;
        case 4:
          H = 1e4;
          break;
        default:
          H = 5e3;
      }
      return (
        (H = $ + H),
        (O = {
          id: f++,
          callback: I,
          priorityLevel: O,
          startTime: $,
          expirationTime: H,
          sortIndex: -1,
        }),
        $ > B
          ? ((O.sortIndex = $),
            t(c, O),
            n(u) === null &&
              O === n(c) &&
              (x ? (v(_), (_ = -1)) : (x = !0), Q(w, $ - B)))
          : ((O.sortIndex = H), t(u, O), E || g || ((E = !0), F(N))),
        O
      );
    }),
    (e.unstable_shouldYield = A),
    (e.unstable_wrapCallback = function (O) {
      var I = h;
      return function () {
        var $ = h;
        h = I;
        try {
          return O.apply(this, arguments);
        } finally {
          h = $;
        }
      };
    });
})(Td);
(function (e) {
  e.exports = Td;
})(bd);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var $d = p.exports,
  ut = bd.exports;
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
var Ld = new Set(),
  ko = {};
function er(e, t) {
  Or(e, t), Or(e + "Capture", t);
}
function Or(e, t) {
  for (ko[e] = t, e = 0; e < t.length; e++) Ld.add(t[e]);
}
var Jt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  bs = Object.prototype.hasOwnProperty,
  lg =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  zc = {},
  Ac = {};
function ag(e) {
  return bs.call(Ac, e)
    ? !0
    : bs.call(zc, e)
      ? !1
      : lg.test(e)
        ? (Ac[e] = !0)
        : ((zc[e] = !0), !1);
}
function sg(e, t, n, r) {
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
function ig(e, t, n, r) {
  if (t === null || typeof t > "u" || sg(e, t, n, r)) return !0;
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
function Qe(e, t, n, r, o, l, a) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = l),
    (this.removeEmptyString = a);
}
var Le = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Le[e] = new Qe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Le[t] = new Qe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Le[e] = new Qe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Le[e] = new Qe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Le[e] = new Qe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Le[e] = new Qe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Le[e] = new Qe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Le[e] = new Qe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Le[e] = new Qe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var nu = /[\-:]([a-z])/g;
function ru(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(nu, ru);
    Le[t] = new Qe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(nu, ru);
    Le[t] = new Qe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(nu, ru);
  Le[t] = new Qe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Le[e] = new Qe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Le.xlinkHref = new Qe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Le[e] = new Qe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function ou(e, t, n, r) {
  var o = Le.hasOwnProperty(t) ? Le[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (ig(t, n, o, r) && (n = null),
    r || o === null
      ? ag(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
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
var ln = $d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ll = Symbol.for("react.element"),
  ir = Symbol.for("react.portal"),
  ur = Symbol.for("react.fragment"),
  lu = Symbol.for("react.strict_mode"),
  Ts = Symbol.for("react.profiler"),
  jd = Symbol.for("react.provider"),
  Dd = Symbol.for("react.context"),
  au = Symbol.for("react.forward_ref"),
  $s = Symbol.for("react.suspense"),
  Ls = Symbol.for("react.suspense_list"),
  su = Symbol.for("react.memo"),
  pn = Symbol.for("react.lazy"),
  Md = Symbol.for("react.offscreen"),
  Fc = Symbol.iterator;
function Qr(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Fc && e[Fc]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Ee = Object.assign,
  Ya;
function lo(e) {
  if (Ya === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Ya = (t && t[1]) || "";
    }
  return (
    `
` +
    Ya +
    e
  );
}
var Xa = !1;
function Ja(e, t) {
  if (!e || Xa) return "";
  Xa = !0;
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
    (Xa = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? lo(e) : "";
}
function ug(e) {
  switch (e.tag) {
    case 5:
      return lo(e.type);
    case 16:
      return lo("Lazy");
    case 13:
      return lo("Suspense");
    case 19:
      return lo("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Ja(e.type, !1)), e;
    case 11:
      return (e = Ja(e.type.render, !1)), e;
    case 1:
      return (e = Ja(e.type, !0)), e;
    default:
      return "";
  }
}
function js(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case ur:
      return "Fragment";
    case ir:
      return "Portal";
    case Ts:
      return "Profiler";
    case lu:
      return "StrictMode";
    case $s:
      return "Suspense";
    case Ls:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Dd:
        return (e.displayName || "Context") + ".Consumer";
      case jd:
        return (e._context.displayName || "Context") + ".Provider";
      case au:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case su:
        return (
          (t = e.displayName || null), t !== null ? t : js(e.type) || "Memo"
        );
      case pn:
        (t = e._payload), (e = e._init);
        try {
          return js(e(t));
        } catch {}
    }
  return null;
}
function cg(e) {
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
      return js(t);
    case 8:
      return t === lu ? "StrictMode" : "Mode";
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
function Pn(e) {
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
function Id(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function fg(e) {
  var t = Id(e) ? "checked" : "value",
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
  e._valueTracker || (e._valueTracker = fg(e));
}
function zd(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Id(e) ? (e.checked ? "true" : "false") : e.value),
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
function Ds(e, t) {
  var n = t.checked;
  return Ee({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n != null ? n : e._wrapperState.initialChecked,
  });
}
function Bc(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = Pn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Ad(e, t) {
  (t = t.checked), t != null && ou(e, "checked", t, !1);
}
function Ms(e, t) {
  Ad(e, t);
  var n = Pn(t.value),
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
    ? Is(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Is(e, t.type, Pn(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Wc(e, t, n) {
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
function Is(e, t, n) {
  (t !== "number" || Wl(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var ao = Array.isArray;
function Er(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      (o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Pn(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        (e[o].selected = !0), r && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function zs(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(L(91));
  return Ee({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Uc(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(L(92));
      if (ao(n)) {
        if (1 < n.length) throw Error(L(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: Pn(n) };
}
function Fd(e, t) {
  var n = Pn(t.value),
    r = Pn(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Hc(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Bd(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function As(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Bd(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var sl,
  Wd = (function (e) {
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
function No(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var co = {
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
  dg = ["Webkit", "ms", "Moz", "O"];
Object.keys(co).forEach(function (e) {
  dg.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (co[t] = co[e]);
  });
});
function Ud(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (co.hasOwnProperty(e) && co[e])
      ? ("" + t).trim()
      : t + "px";
}
function Hd(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = Ud(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o);
    }
}
var pg = Ee(
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
function Fs(e, t) {
  if (t) {
    if (pg[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
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
function Bs(e, t) {
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
var Ws = null;
function iu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Us = null,
  wr = null,
  Sr = null;
function Vc(e) {
  if ((e = Qo(e))) {
    if (typeof Us != "function") throw Error(L(280));
    var t = e.stateNode;
    t && ((t = _a(t)), Us(e.stateNode, e.type, t));
  }
}
function Vd(e) {
  wr ? (Sr ? Sr.push(e) : (Sr = [e])) : (wr = e);
}
function Kd() {
  if (wr) {
    var e = wr,
      t = Sr;
    if (((Sr = wr = null), Vc(e), t)) for (e = 0; e < t.length; e++) Vc(t[e]);
  }
}
function Gd(e, t) {
  return e(t);
}
function Qd() {}
var Za = !1;
function qd(e, t, n) {
  if (Za) return e(t, n);
  Za = !0;
  try {
    return Gd(e, t, n);
  } finally {
    (Za = !1), (wr !== null || Sr !== null) && (Qd(), Kd());
  }
}
function Co(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = _a(n);
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
var Hs = !1;
if (Jt)
  try {
    var qr = {};
    Object.defineProperty(qr, "passive", {
      get: function () {
        Hs = !0;
      },
    }),
      window.addEventListener("test", qr, qr),
      window.removeEventListener("test", qr, qr);
  } catch {
    Hs = !1;
  }
function mg(e, t, n, r, o, l, a, i, u) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (f) {
    this.onError(f);
  }
}
var fo = !1,
  Ul = null,
  Hl = !1,
  Vs = null,
  hg = {
    onError: function (e) {
      (fo = !0), (Ul = e);
    },
  };
function vg(e, t, n, r, o, l, a, i, u) {
  (fo = !1), (Ul = null), mg.apply(hg, arguments);
}
function gg(e, t, n, r, o, l, a, i, u) {
  if ((vg.apply(this, arguments), fo)) {
    if (fo) {
      var c = Ul;
      (fo = !1), (Ul = null);
    } else throw Error(L(198));
    Hl || ((Hl = !0), (Vs = c));
  }
}
function tr(e) {
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
function Yd(e) {
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
function Kc(e) {
  if (tr(e) !== e) throw Error(L(188));
}
function yg(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = tr(e)), t === null)) throw Error(L(188));
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
        if (l === n) return Kc(o), e;
        if (l === r) return Kc(o), t;
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
function Xd(e) {
  return (e = yg(e)), e !== null ? Jd(e) : null;
}
function Jd(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Jd(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Zd = ut.unstable_scheduleCallback,
  Gc = ut.unstable_cancelCallback,
  xg = ut.unstable_shouldYield,
  Eg = ut.unstable_requestPaint,
  ke = ut.unstable_now,
  wg = ut.unstable_getCurrentPriorityLevel,
  uu = ut.unstable_ImmediatePriority,
  ep = ut.unstable_UserBlockingPriority,
  Vl = ut.unstable_NormalPriority,
  Sg = ut.unstable_LowPriority,
  tp = ut.unstable_IdlePriority,
  ka = null,
  At = null;
function kg(e) {
  if (At && typeof At.onCommitFiberRoot == "function")
    try {
      At.onCommitFiberRoot(ka, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var bt = Math.clz32 ? Math.clz32 : Rg,
  Ng = Math.log,
  Cg = Math.LN2;
function Rg(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Ng(e) / Cg) | 0)) | 0;
}
var il = 64,
  ul = 4194304;
function so(e) {
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
    i !== 0 ? (r = so(i)) : ((l &= a), l !== 0 && (r = so(l)));
  } else (a = n & ~o), a !== 0 ? (r = so(a)) : l !== 0 && (r = so(l));
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
      (n = 31 - bt(t)), (o = 1 << n), (r |= e[n]), (t &= ~o);
  return r;
}
function _g(e, t) {
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
function Og(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      l = e.pendingLanes;
    0 < l;

  ) {
    var a = 31 - bt(l),
      i = 1 << a,
      u = o[a];
    u === -1
      ? ((i & n) === 0 || (i & r) !== 0) && (o[a] = _g(i, t))
      : u <= t && (e.expiredLanes |= i),
      (l &= ~i);
  }
}
function Ks(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function np() {
  var e = il;
  return (il <<= 1), (il & 4194240) === 0 && (il = 64), e;
}
function es(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ko(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - bt(t)),
    (e[t] = n);
}
function Pg(e, t) {
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
    var o = 31 - bt(n),
      l = 1 << o;
    (t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~l);
  }
}
function cu(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - bt(n),
      o = 1 << r;
    (o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o);
  }
}
var fe = 0;
function rp(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
  );
}
var op,
  fu,
  lp,
  ap,
  sp,
  Gs = !1,
  cl = [],
  wn = null,
  Sn = null,
  kn = null,
  Ro = new Map(),
  _o = new Map(),
  vn = [],
  bg =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Qc(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      wn = null;
      break;
    case "dragenter":
    case "dragleave":
      Sn = null;
      break;
    case "mouseover":
    case "mouseout":
      kn = null;
      break;
    case "pointerover":
    case "pointerout":
      Ro.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      _o.delete(t.pointerId);
  }
}
function Yr(e, t, n, r, o, l) {
  return e === null || e.nativeEvent !== l
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: l,
        targetContainers: [o],
      }),
      t !== null && ((t = Qo(t)), t !== null && fu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function Tg(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return (wn = Yr(wn, e, t, n, r, o)), !0;
    case "dragenter":
      return (Sn = Yr(Sn, e, t, n, r, o)), !0;
    case "mouseover":
      return (kn = Yr(kn, e, t, n, r, o)), !0;
    case "pointerover":
      var l = o.pointerId;
      return Ro.set(l, Yr(Ro.get(l) || null, e, t, n, r, o)), !0;
    case "gotpointercapture":
      return (
        (l = o.pointerId), _o.set(l, Yr(_o.get(l) || null, e, t, n, r, o)), !0
      );
  }
  return !1;
}
function ip(e) {
  var t = Bn(e.target);
  if (t !== null) {
    var n = tr(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Yd(n)), t !== null)) {
          (e.blockedOn = t),
            sp(e.priority, function () {
              lp(n);
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
function Ol(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Qs(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (Ws = r), n.target.dispatchEvent(r), (Ws = null);
    } else return (t = Qo(n)), t !== null && fu(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function qc(e, t, n) {
  Ol(e) && n.delete(t);
}
function $g() {
  (Gs = !1),
    wn !== null && Ol(wn) && (wn = null),
    Sn !== null && Ol(Sn) && (Sn = null),
    kn !== null && Ol(kn) && (kn = null),
    Ro.forEach(qc),
    _o.forEach(qc);
}
function Xr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Gs ||
      ((Gs = !0),
      ut.unstable_scheduleCallback(ut.unstable_NormalPriority, $g)));
}
function Oo(e) {
  function t(o) {
    return Xr(o, e);
  }
  if (0 < cl.length) {
    Xr(cl[0], e);
    for (var n = 1; n < cl.length; n++) {
      var r = cl[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    wn !== null && Xr(wn, e),
      Sn !== null && Xr(Sn, e),
      kn !== null && Xr(kn, e),
      Ro.forEach(t),
      _o.forEach(t),
      n = 0;
    n < vn.length;
    n++
  )
    (r = vn[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < vn.length && ((n = vn[0]), n.blockedOn === null); )
    ip(n), n.blockedOn === null && vn.shift();
}
var kr = ln.ReactCurrentBatchConfig,
  Gl = !0;
function Lg(e, t, n, r) {
  var o = fe,
    l = kr.transition;
  kr.transition = null;
  try {
    (fe = 1), du(e, t, n, r);
  } finally {
    (fe = o), (kr.transition = l);
  }
}
function jg(e, t, n, r) {
  var o = fe,
    l = kr.transition;
  kr.transition = null;
  try {
    (fe = 4), du(e, t, n, r);
  } finally {
    (fe = o), (kr.transition = l);
  }
}
function du(e, t, n, r) {
  if (Gl) {
    var o = Qs(e, t, n, r);
    if (o === null) cs(e, t, r, Ql, n), Qc(e, r);
    else if (Tg(o, e, t, n, r)) r.stopPropagation();
    else if ((Qc(e, r), t & 4 && -1 < bg.indexOf(e))) {
      for (; o !== null; ) {
        var l = Qo(o);
        if (
          (l !== null && op(l),
          (l = Qs(e, t, n, r)),
          l === null && cs(e, t, r, Ql, n),
          l === o)
        )
          break;
        o = l;
      }
      o !== null && r.stopPropagation();
    } else cs(e, t, r, null, n);
  }
}
var Ql = null;
function Qs(e, t, n, r) {
  if (((Ql = null), (e = iu(r)), (e = Bn(e)), e !== null))
    if (((t = tr(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Yd(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (Ql = e), null;
}
function up(e) {
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
      switch (wg()) {
        case uu:
          return 1;
        case ep:
          return 4;
        case Vl:
        case Sg:
          return 16;
        case tp:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var xn = null,
  pu = null,
  Pl = null;
function cp() {
  if (Pl) return Pl;
  var e,
    t = pu,
    n = t.length,
    r,
    o = "value" in xn ? xn.value : xn.textContent,
    l = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var a = n - e;
  for (r = 1; r <= a && t[n - r] === o[l - r]; r++);
  return (Pl = o.slice(e, 1 < r ? 1 - r : void 0));
}
function bl(e) {
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
function Yc() {
  return !1;
}
function ft(e) {
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
        : Yc),
      (this.isPropagationStopped = Yc),
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
var Br = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  mu = ft(Br),
  Go = Ee({}, Br, { view: 0, detail: 0 }),
  Dg = ft(Go),
  ts,
  ns,
  Jr,
  Na = Ee({}, Go, {
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
    getModifierState: hu,
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
        : (e !== Jr &&
            (Jr && e.type === "mousemove"
              ? ((ts = e.screenX - Jr.screenX), (ns = e.screenY - Jr.screenY))
              : (ns = ts = 0),
            (Jr = e)),
          ts);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ns;
    },
  }),
  Xc = ft(Na),
  Mg = Ee({}, Na, { dataTransfer: 0 }),
  Ig = ft(Mg),
  zg = Ee({}, Go, { relatedTarget: 0 }),
  rs = ft(zg),
  Ag = Ee({}, Br, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Fg = ft(Ag),
  Bg = Ee({}, Br, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Wg = ft(Bg),
  Ug = Ee({}, Br, { data: 0 }),
  Jc = ft(Ug),
  Hg = {
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
  Vg = {
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
  Kg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Gg(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Kg[e]) ? !!t[e] : !1;
}
function hu() {
  return Gg;
}
var Qg = Ee({}, Go, {
    key: function (e) {
      if (e.key) {
        var t = Hg[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = bl(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Vg[e.keyCode] || "Unidentified"
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
    getModifierState: hu,
    charCode: function (e) {
      return e.type === "keypress" ? bl(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? bl(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  qg = ft(Qg),
  Yg = Ee({}, Na, {
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
  Zc = ft(Yg),
  Xg = Ee({}, Go, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: hu,
  }),
  Jg = ft(Xg),
  Zg = Ee({}, Br, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  ey = ft(Zg),
  ty = Ee({}, Na, {
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
  ny = ft(ty),
  ry = [9, 13, 27, 32],
  vu = Jt && "CompositionEvent" in window,
  po = null;
Jt && "documentMode" in document && (po = document.documentMode);
var oy = Jt && "TextEvent" in window && !po,
  fp = Jt && (!vu || (po && 8 < po && 11 >= po)),
  ef = String.fromCharCode(32),
  tf = !1;
function dp(e, t) {
  switch (e) {
    case "keyup":
      return ry.indexOf(t.keyCode) !== -1;
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
function pp(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var cr = !1;
function ly(e, t) {
  switch (e) {
    case "compositionend":
      return pp(t);
    case "keypress":
      return t.which !== 32 ? null : ((tf = !0), ef);
    case "textInput":
      return (e = t.data), e === ef && tf ? null : e;
    default:
      return null;
  }
}
function ay(e, t) {
  if (cr)
    return e === "compositionend" || (!vu && dp(e, t))
      ? ((e = cp()), (Pl = pu = xn = null), (cr = !1), e)
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
      return fp && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var sy = {
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
function nf(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!sy[e.type] : t === "textarea";
}
function mp(e, t, n, r) {
  Vd(r),
    (t = ql(t, "onChange")),
    0 < t.length &&
      ((n = new mu("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var mo = null,
  Po = null;
function iy(e) {
  Cp(e, 0);
}
function Ca(e) {
  var t = pr(e);
  if (zd(t)) return e;
}
function uy(e, t) {
  if (e === "change") return t;
}
var hp = !1;
if (Jt) {
  var os;
  if (Jt) {
    var ls = "oninput" in document;
    if (!ls) {
      var rf = document.createElement("div");
      rf.setAttribute("oninput", "return;"),
        (ls = typeof rf.oninput == "function");
    }
    os = ls;
  } else os = !1;
  hp = os && (!document.documentMode || 9 < document.documentMode);
}
function of() {
  mo && (mo.detachEvent("onpropertychange", vp), (Po = mo = null));
}
function vp(e) {
  if (e.propertyName === "value" && Ca(Po)) {
    var t = [];
    mp(t, Po, e, iu(e)), qd(iy, t);
  }
}
function cy(e, t, n) {
  e === "focusin"
    ? (of(), (mo = t), (Po = n), mo.attachEvent("onpropertychange", vp))
    : e === "focusout" && of();
}
function fy(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Ca(Po);
}
function dy(e, t) {
  if (e === "click") return Ca(t);
}
function py(e, t) {
  if (e === "input" || e === "change") return Ca(t);
}
function my(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var $t = typeof Object.is == "function" ? Object.is : my;
function bo(e, t) {
  if ($t(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!bs.call(t, o) || !$t(e[o], t[o])) return !1;
  }
  return !0;
}
function lf(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function af(e, t) {
  var n = lf(e);
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
    n = lf(n);
  }
}
function gp(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? gp(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function yp() {
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
function gu(e) {
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
function hy(e) {
  var t = yp(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    gp(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && gu(n)) {
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
          (o = af(n, l));
        var a = af(n, r);
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
var vy = Jt && "documentMode" in document && 11 >= document.documentMode,
  fr = null,
  qs = null,
  ho = null,
  Ys = !1;
function sf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Ys ||
    fr == null ||
    fr !== Wl(r) ||
    ((r = fr),
    "selectionStart" in r && gu(r)
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
    (ho && bo(ho, r)) ||
      ((ho = r),
      (r = ql(qs, "onSelect")),
      0 < r.length &&
        ((t = new mu("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = fr))));
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
var dr = {
    animationend: dl("Animation", "AnimationEnd"),
    animationiteration: dl("Animation", "AnimationIteration"),
    animationstart: dl("Animation", "AnimationStart"),
    transitionend: dl("Transition", "TransitionEnd"),
  },
  as = {},
  xp = {};
Jt &&
  ((xp = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete dr.animationend.animation,
    delete dr.animationiteration.animation,
    delete dr.animationstart.animation),
  "TransitionEvent" in window || delete dr.transitionend.transition);
function Ra(e) {
  if (as[e]) return as[e];
  if (!dr[e]) return e;
  var t = dr[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in xp) return (as[e] = t[n]);
  return e;
}
var Ep = Ra("animationend"),
  wp = Ra("animationiteration"),
  Sp = Ra("animationstart"),
  kp = Ra("transitionend"),
  Np = new Map(),
  uf =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function $n(e, t) {
  Np.set(e, t), er(t, [e]);
}
for (var ss = 0; ss < uf.length; ss++) {
  var is = uf[ss],
    gy = is.toLowerCase(),
    yy = is[0].toUpperCase() + is.slice(1);
  $n(gy, "on" + yy);
}
$n(Ep, "onAnimationEnd");
$n(wp, "onAnimationIteration");
$n(Sp, "onAnimationStart");
$n("dblclick", "onDoubleClick");
$n("focusin", "onFocus");
$n("focusout", "onBlur");
$n(kp, "onTransitionEnd");
Or("onMouseEnter", ["mouseout", "mouseover"]);
Or("onMouseLeave", ["mouseout", "mouseover"]);
Or("onPointerEnter", ["pointerout", "pointerover"]);
Or("onPointerLeave", ["pointerout", "pointerover"]);
er(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
er(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
er("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
er(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
er(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
er(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var io =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  xy = new Set("cancel close invalid load scroll toggle".split(" ").concat(io));
function cf(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), gg(r, t, void 0, e), (e.currentTarget = null);
}
function Cp(e, t) {
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
          cf(o, i, c), (l = u);
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
          cf(o, i, c), (l = u);
        }
    }
  }
  if (Hl) throw ((e = Vs), (Hl = !1), (Vs = null), e);
}
function me(e, t) {
  var n = t[ti];
  n === void 0 && (n = t[ti] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Rp(t, e, 2, !1), n.add(r));
}
function us(e, t, n) {
  var r = 0;
  t && (r |= 4), Rp(n, e, r, t);
}
var pl = "_reactListening" + Math.random().toString(36).slice(2);
function To(e) {
  if (!e[pl]) {
    (e[pl] = !0),
      Ld.forEach(function (n) {
        n !== "selectionchange" && (xy.has(n) || us(n, !1, e), us(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[pl] || ((t[pl] = !0), us("selectionchange", !1, t));
  }
}
function Rp(e, t, n, r) {
  switch (up(t)) {
    case 1:
      var o = Lg;
      break;
    case 4:
      o = jg;
      break;
    default:
      o = du;
  }
  (n = o.bind(null, t, n, e)),
    (o = void 0),
    !Hs ||
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
function cs(e, t, n, r, o) {
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
          if (((a = Bn(i)), a === null)) return;
          if (((u = a.tag), u === 5 || u === 6)) {
            r = l = a;
            continue e;
          }
          i = i.parentNode;
        }
      }
      r = r.return;
    }
  qd(function () {
    var c = l,
      f = iu(n),
      d = [];
    e: {
      var h = Np.get(e);
      if (h !== void 0) {
        var g = mu,
          E = e;
        switch (e) {
          case "keypress":
            if (bl(n) === 0) break e;
          case "keydown":
          case "keyup":
            g = qg;
            break;
          case "focusin":
            (E = "focus"), (g = rs);
            break;
          case "focusout":
            (E = "blur"), (g = rs);
            break;
          case "beforeblur":
          case "afterblur":
            g = rs;
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
            g = Xc;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            g = Ig;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            g = Jg;
            break;
          case Ep:
          case wp:
          case Sp:
            g = Fg;
            break;
          case kp:
            g = ey;
            break;
          case "scroll":
            g = Dg;
            break;
          case "wheel":
            g = ny;
            break;
          case "copy":
          case "cut":
          case "paste":
            g = Wg;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            g = Zc;
        }
        var x = (t & 4) !== 0,
          k = !x && e === "scroll",
          v = x ? (h !== null ? h + "Capture" : null) : h;
        x = [];
        for (var m = c, y; m !== null; ) {
          y = m;
          var w = y.stateNode;
          if (
            (y.tag === 5 &&
              w !== null &&
              ((y = w),
              v !== null && ((w = Co(m, v)), w != null && x.push($o(m, w, y)))),
            k)
          )
            break;
          m = m.return;
        }
        0 < x.length &&
          ((h = new g(h, E, null, n, f)), d.push({ event: h, listeners: x }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((h = e === "mouseover" || e === "pointerover"),
          (g = e === "mouseout" || e === "pointerout"),
          h &&
            n !== Ws &&
            (E = n.relatedTarget || n.fromElement) &&
            (Bn(E) || E[Zt]))
        )
          break e;
        if (
          (g || h) &&
          ((h =
            f.window === f
              ? f
              : (h = f.ownerDocument)
                ? h.defaultView || h.parentWindow
                : window),
          g
            ? ((E = n.relatedTarget || n.toElement),
              (g = c),
              (E = E ? Bn(E) : null),
              E !== null &&
                ((k = tr(E)), E !== k || (E.tag !== 5 && E.tag !== 6)) &&
                (E = null))
            : ((g = null), (E = c)),
          g !== E)
        ) {
          if (
            ((x = Xc),
            (w = "onMouseLeave"),
            (v = "onMouseEnter"),
            (m = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((x = Zc),
              (w = "onPointerLeave"),
              (v = "onPointerEnter"),
              (m = "pointer")),
            (k = g == null ? h : pr(g)),
            (y = E == null ? h : pr(E)),
            (h = new x(w, m + "leave", g, n, f)),
            (h.target = k),
            (h.relatedTarget = y),
            (w = null),
            Bn(f) === c &&
              ((x = new x(v, m + "enter", E, n, f)),
              (x.target = y),
              (x.relatedTarget = k),
              (w = x)),
            (k = w),
            g && E)
          )
            t: {
              for (x = g, v = E, m = 0, y = x; y; y = nr(y)) m++;
              for (y = 0, w = v; w; w = nr(w)) y++;
              for (; 0 < m - y; ) (x = nr(x)), m--;
              for (; 0 < y - m; ) (v = nr(v)), y--;
              for (; m--; ) {
                if (x === v || (v !== null && x === v.alternate)) break t;
                (x = nr(x)), (v = nr(v));
              }
              x = null;
            }
          else x = null;
          g !== null && ff(d, h, g, x, !1),
            E !== null && k !== null && ff(d, k, E, x, !0);
        }
      }
      e: {
        if (
          ((h = c ? pr(c) : window),
          (g = h.nodeName && h.nodeName.toLowerCase()),
          g === "select" || (g === "input" && h.type === "file"))
        )
          var N = uy;
        else if (nf(h))
          if (hp) N = py;
          else {
            N = fy;
            var S = cy;
          }
        else
          (g = h.nodeName) &&
            g.toLowerCase() === "input" &&
            (h.type === "checkbox" || h.type === "radio") &&
            (N = dy);
        if (N && (N = N(e, c))) {
          mp(d, N, n, f);
          break e;
        }
        S && S(e, h, c),
          e === "focusout" &&
            (S = h._wrapperState) &&
            S.controlled &&
            h.type === "number" &&
            Is(h, "number", h.value);
      }
      switch (((S = c ? pr(c) : window), e)) {
        case "focusin":
          (nf(S) || S.contentEditable === "true") &&
            ((fr = S), (qs = c), (ho = null));
          break;
        case "focusout":
          ho = qs = fr = null;
          break;
        case "mousedown":
          Ys = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Ys = !1), sf(d, n, f);
          break;
        case "selectionchange":
          if (vy) break;
        case "keydown":
        case "keyup":
          sf(d, n, f);
      }
      var C;
      if (vu)
        e: {
          switch (e) {
            case "compositionstart":
              var _ = "onCompositionStart";
              break e;
            case "compositionend":
              _ = "onCompositionEnd";
              break e;
            case "compositionupdate":
              _ = "onCompositionUpdate";
              break e;
          }
          _ = void 0;
        }
      else
        cr
          ? dp(e, n) && (_ = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (_ = "onCompositionStart");
      _ &&
        (fp &&
          n.locale !== "ko" &&
          (cr || _ !== "onCompositionStart"
            ? _ === "onCompositionEnd" && cr && (C = cp())
            : ((xn = f),
              (pu = "value" in xn ? xn.value : xn.textContent),
              (cr = !0))),
        (S = ql(c, _)),
        0 < S.length &&
          ((_ = new Jc(_, e, null, n, f)),
          d.push({ event: _, listeners: S }),
          C ? (_.data = C) : ((C = pp(n)), C !== null && (_.data = C)))),
        (C = oy ? ly(e, n) : ay(e, n)) &&
          ((c = ql(c, "onBeforeInput")),
          0 < c.length &&
            ((f = new Jc("onBeforeInput", "beforeinput", null, n, f)),
            d.push({ event: f, listeners: c }),
            (f.data = C)));
    }
    Cp(d, t);
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
      (l = Co(e, n)),
      l != null && r.unshift($o(e, l, o)),
      (l = Co(e, t)),
      l != null && r.push($o(e, l, o))),
      (e = e.return);
  }
  return r;
}
function nr(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function ff(e, t, n, r, o) {
  for (var l = t._reactName, a = []; n !== null && n !== r; ) {
    var i = n,
      u = i.alternate,
      c = i.stateNode;
    if (u !== null && u === r) break;
    i.tag === 5 &&
      c !== null &&
      ((i = c),
      o
        ? ((u = Co(n, l)), u != null && a.unshift($o(n, u, i)))
        : o || ((u = Co(n, l)), u != null && a.push($o(n, u, i)))),
      (n = n.return);
  }
  a.length !== 0 && e.push({ event: t, listeners: a });
}
var Ey = /\r\n?/g,
  wy = /\u0000|\uFFFD/g;
function df(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Ey,
      `
`,
    )
    .replace(wy, "");
}
function ml(e, t, n) {
  if (((t = df(t)), df(e) !== t && n)) throw Error(L(425));
}
function Yl() {}
var Xs = null,
  Js = null;
function Zs(e, t) {
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
var ei = typeof setTimeout == "function" ? setTimeout : void 0,
  Sy = typeof clearTimeout == "function" ? clearTimeout : void 0,
  pf = typeof Promise == "function" ? Promise : void 0,
  ky =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof pf < "u"
        ? function (e) {
            return pf.resolve(null).then(e).catch(Ny);
          }
        : ei;
function Ny(e) {
  setTimeout(function () {
    throw e;
  });
}
function fs(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(o), Oo(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  Oo(t);
}
function Nn(e) {
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
function mf(e) {
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
var Wr = Math.random().toString(36).slice(2),
  It = "__reactFiber$" + Wr,
  Lo = "__reactProps$" + Wr,
  Zt = "__reactContainer$" + Wr,
  ti = "__reactEvents$" + Wr,
  Cy = "__reactListeners$" + Wr,
  Ry = "__reactHandles$" + Wr;
function Bn(e) {
  var t = e[It];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Zt] || n[It])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = mf(e); e !== null; ) {
          if ((n = e[It])) return n;
          e = mf(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Qo(e) {
  return (
    (e = e[It] || e[Zt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function pr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(L(33));
}
function _a(e) {
  return e[Lo] || null;
}
var ni = [],
  mr = -1;
function Ln(e) {
  return { current: e };
}
function ve(e) {
  0 > mr || ((e.current = ni[mr]), (ni[mr] = null), mr--);
}
function pe(e, t) {
  mr++, (ni[mr] = e.current), (e.current = t);
}
var bn = {},
  Fe = Ln(bn),
  Je = Ln(!1),
  Qn = bn;
function Pr(e, t) {
  var n = e.type.contextTypes;
  if (!n) return bn;
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
function Ze(e) {
  return (e = e.childContextTypes), e != null;
}
function Xl() {
  ve(Je), ve(Fe);
}
function hf(e, t, n) {
  if (Fe.current !== bn) throw Error(L(168));
  pe(Fe, t), pe(Je, n);
}
function _p(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(L(108, cg(e) || "Unknown", o));
  return Ee({}, n, r);
}
function Jl(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || bn),
    (Qn = Fe.current),
    pe(Fe, e),
    pe(Je, Je.current),
    !0
  );
}
function vf(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(L(169));
  n
    ? ((e = _p(e, t, Qn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      ve(Je),
      ve(Fe),
      pe(Fe, e))
    : ve(Je),
    pe(Je, n);
}
var Vt = null,
  Oa = !1,
  ds = !1;
function Op(e) {
  Vt === null ? (Vt = [e]) : Vt.push(e);
}
function _y(e) {
  (Oa = !0), Op(e);
}
function jn() {
  if (!ds && Vt !== null) {
    ds = !0;
    var e = 0,
      t = fe;
    try {
      var n = Vt;
      for (fe = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Vt = null), (Oa = !1);
    } catch (o) {
      throw (Vt !== null && (Vt = Vt.slice(e + 1)), Zd(uu, jn), o);
    } finally {
      (fe = t), (ds = !1);
    }
  }
  return null;
}
var hr = [],
  vr = 0,
  Zl = null,
  ea = 0,
  mt = [],
  ht = 0,
  qn = null,
  Kt = 1,
  Gt = "";
function An(e, t) {
  (hr[vr++] = ea), (hr[vr++] = Zl), (Zl = e), (ea = t);
}
function Pp(e, t, n) {
  (mt[ht++] = Kt), (mt[ht++] = Gt), (mt[ht++] = qn), (qn = e);
  var r = Kt;
  e = Gt;
  var o = 32 - bt(r) - 1;
  (r &= ~(1 << o)), (n += 1);
  var l = 32 - bt(t) + o;
  if (30 < l) {
    var a = o - (o % 5);
    (l = (r & ((1 << a) - 1)).toString(32)),
      (r >>= a),
      (o -= a),
      (Kt = (1 << (32 - bt(t) + o)) | (n << o) | r),
      (Gt = l + e);
  } else (Kt = (1 << l) | (n << o) | r), (Gt = e);
}
function yu(e) {
  e.return !== null && (An(e, 1), Pp(e, 1, 0));
}
function xu(e) {
  for (; e === Zl; )
    (Zl = hr[--vr]), (hr[vr] = null), (ea = hr[--vr]), (hr[vr] = null);
  for (; e === qn; )
    (qn = mt[--ht]),
      (mt[ht] = null),
      (Gt = mt[--ht]),
      (mt[ht] = null),
      (Kt = mt[--ht]),
      (mt[ht] = null);
}
var it = null,
  at = null,
  ge = !1,
  Pt = null;
function bp(e, t) {
  var n = vt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function gf(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (it = e), (at = Nn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (it = e), (at = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = qn !== null ? { id: Kt, overflow: Gt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = vt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (it = e),
            (at = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function ri(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function oi(e) {
  if (ge) {
    var t = at;
    if (t) {
      var n = t;
      if (!gf(e, t)) {
        if (ri(e)) throw Error(L(418));
        t = Nn(n.nextSibling);
        var r = it;
        t && gf(e, t)
          ? bp(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (ge = !1), (it = e));
      }
    } else {
      if (ri(e)) throw Error(L(418));
      (e.flags = (e.flags & -4097) | 2), (ge = !1), (it = e);
    }
  }
}
function yf(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  it = e;
}
function hl(e) {
  if (e !== it) return !1;
  if (!ge) return yf(e), (ge = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Zs(e.type, e.memoizedProps))),
    t && (t = at))
  ) {
    if (ri(e)) throw (Tp(), Error(L(418)));
    for (; t; ) bp(e, t), (t = Nn(t.nextSibling));
  }
  if ((yf(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(L(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              at = Nn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      at = null;
    }
  } else at = it ? Nn(e.stateNode.nextSibling) : null;
  return !0;
}
function Tp() {
  for (var e = at; e; ) e = Nn(e.nextSibling);
}
function br() {
  (at = it = null), (ge = !1);
}
function Eu(e) {
  Pt === null ? (Pt = [e]) : Pt.push(e);
}
var Oy = ln.ReactCurrentBatchConfig;
function _t(e, t) {
  if (e && e.defaultProps) {
    (t = Ee({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var ta = Ln(null),
  na = null,
  gr = null,
  wu = null;
function Su() {
  wu = gr = na = null;
}
function ku(e) {
  var t = ta.current;
  ve(ta), (e._currentValue = t);
}
function li(e, t, n) {
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
function Nr(e, t) {
  (na = e),
    (wu = gr = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (Xe = !0), (e.firstContext = null));
}
function xt(e) {
  var t = e._currentValue;
  if (wu !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), gr === null)) {
      if (na === null) throw Error(L(308));
      (gr = e), (na.dependencies = { lanes: 0, firstContext: e });
    } else gr = gr.next = e;
  return t;
}
var Wn = null;
function Nu(e) {
  Wn === null ? (Wn = [e]) : Wn.push(e);
}
function $p(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), Nu(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    en(e, r)
  );
}
function en(e, t) {
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
var mn = !1;
function Cu(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Lp(e, t) {
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
function qt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function Cn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), (ie & 2) !== 0)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      en(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), Nu(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    en(e, n)
  );
}
function Tl(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), cu(e, n);
  }
}
function xf(e, t) {
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
  mn = !1;
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
        g = i.eventTime;
      if ((r & h) === h) {
        f !== null &&
          (f = f.next =
            {
              eventTime: g,
              lane: 0,
              tag: i.tag,
              payload: i.payload,
              callback: i.callback,
              next: null,
            });
        e: {
          var E = e,
            x = i;
          switch (((h = t), (g = n), x.tag)) {
            case 1:
              if (((E = x.payload), typeof E == "function")) {
                d = E.call(g, d, h);
                break e;
              }
              d = E;
              break e;
            case 3:
              E.flags = (E.flags & -65537) | 128;
            case 0:
              if (
                ((E = x.payload),
                (h = typeof E == "function" ? E.call(g, d, h) : E),
                h == null)
              )
                break e;
              d = Ee({}, d, h);
              break e;
            case 2:
              mn = !0;
          }
        }
        i.callback !== null &&
          i.lane !== 0 &&
          ((e.flags |= 64),
          (h = o.effects),
          h === null ? (o.effects = [i]) : h.push(i));
      } else
        (g = {
          eventTime: g,
          lane: h,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null,
        }),
          f === null ? ((c = f = g), (u = d)) : (f = f.next = g),
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
    (Xn |= a), (e.lanes = a), (e.memoizedState = d);
  }
}
function Ef(e, t, n) {
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
var jp = new $d.Component().refs;
function ai(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Ee({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Pa = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? tr(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ke(),
      o = _n(e),
      l = qt(r, o);
    (l.payload = t),
      n != null && (l.callback = n),
      (t = Cn(e, l, o)),
      t !== null && (Tt(t, e, o, r), Tl(t, e, o));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ke(),
      o = _n(e),
      l = qt(r, o);
    (l.tag = 1),
      (l.payload = t),
      n != null && (l.callback = n),
      (t = Cn(e, l, o)),
      t !== null && (Tt(t, e, o, r), Tl(t, e, o));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Ke(),
      r = _n(e),
      o = qt(n, r);
    (o.tag = 2),
      t != null && (o.callback = t),
      (t = Cn(e, o, r)),
      t !== null && (Tt(t, e, r, n), Tl(t, e, r));
  },
};
function wf(e, t, n, r, o, l, a) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, l, a)
      : t.prototype && t.prototype.isPureReactComponent
        ? !bo(n, r) || !bo(o, l)
        : !0
  );
}
function Dp(e, t, n) {
  var r = !1,
    o = bn,
    l = t.contextType;
  return (
    typeof l == "object" && l !== null
      ? (l = xt(l))
      : ((o = Ze(t) ? Qn : Fe.current),
        (r = t.contextTypes),
        (l = (r = r != null) ? Pr(e, o) : bn)),
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
function Sf(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Pa.enqueueReplaceState(t, t.state, null);
}
function si(e, t, n, r) {
  var o = e.stateNode;
  (o.props = n), (o.state = e.memoizedState), (o.refs = jp), Cu(e);
  var l = t.contextType;
  typeof l == "object" && l !== null
    ? (o.context = xt(l))
    : ((l = Ze(t) ? Qn : Fe.current), (o.context = Pr(e, l))),
    (o.state = e.memoizedState),
    (l = t.getDerivedStateFromProps),
    typeof l == "function" && (ai(e, t, l, n), (o.state = e.memoizedState)),
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
function Zr(e, t, n) {
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
            i === jp && (i = o.refs = {}),
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
function kf(e) {
  var t = e._init;
  return t(e._payload);
}
function Mp(e) {
  function t(v, m) {
    if (e) {
      var y = v.deletions;
      y === null ? ((v.deletions = [m]), (v.flags |= 16)) : y.push(m);
    }
  }
  function n(v, m) {
    if (!e) return null;
    for (; m !== null; ) t(v, m), (m = m.sibling);
    return null;
  }
  function r(v, m) {
    for (v = new Map(); m !== null; )
      m.key !== null ? v.set(m.key, m) : v.set(m.index, m), (m = m.sibling);
    return v;
  }
  function o(v, m) {
    return (v = On(v, m)), (v.index = 0), (v.sibling = null), v;
  }
  function l(v, m, y) {
    return (
      (v.index = y),
      e
        ? ((y = v.alternate),
          y !== null
            ? ((y = y.index), y < m ? ((v.flags |= 2), m) : y)
            : ((v.flags |= 2), m))
        : ((v.flags |= 1048576), m)
    );
  }
  function a(v) {
    return e && v.alternate === null && (v.flags |= 2), v;
  }
  function i(v, m, y, w) {
    return m === null || m.tag !== 6
      ? ((m = xs(y, v.mode, w)), (m.return = v), m)
      : ((m = o(m, y)), (m.return = v), m);
  }
  function u(v, m, y, w) {
    var N = y.type;
    return N === ur
      ? f(v, m, y.props.children, w, y.key)
      : m !== null &&
          (m.elementType === N ||
            (typeof N == "object" &&
              N !== null &&
              N.$$typeof === pn &&
              kf(N) === m.type))
        ? ((w = o(m, y.props)), (w.ref = Zr(v, m, y)), (w.return = v), w)
        : ((w = Il(y.type, y.key, y.props, null, v.mode, w)),
          (w.ref = Zr(v, m, y)),
          (w.return = v),
          w);
  }
  function c(v, m, y, w) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== y.containerInfo ||
      m.stateNode.implementation !== y.implementation
      ? ((m = Es(y, v.mode, w)), (m.return = v), m)
      : ((m = o(m, y.children || [])), (m.return = v), m);
  }
  function f(v, m, y, w, N) {
    return m === null || m.tag !== 7
      ? ((m = Kn(y, v.mode, w, N)), (m.return = v), m)
      : ((m = o(m, y)), (m.return = v), m);
  }
  function d(v, m, y) {
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return (m = xs("" + m, v.mode, y)), (m.return = v), m;
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case ll:
          return (
            (y = Il(m.type, m.key, m.props, null, v.mode, y)),
            (y.ref = Zr(v, null, m)),
            (y.return = v),
            y
          );
        case ir:
          return (m = Es(m, v.mode, y)), (m.return = v), m;
        case pn:
          var w = m._init;
          return d(v, w(m._payload), y);
      }
      if (ao(m) || Qr(m))
        return (m = Kn(m, v.mode, y, null)), (m.return = v), m;
      vl(v, m);
    }
    return null;
  }
  function h(v, m, y, w) {
    var N = m !== null ? m.key : null;
    if ((typeof y == "string" && y !== "") || typeof y == "number")
      return N !== null ? null : i(v, m, "" + y, w);
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case ll:
          return y.key === N ? u(v, m, y, w) : null;
        case ir:
          return y.key === N ? c(v, m, y, w) : null;
        case pn:
          return (N = y._init), h(v, m, N(y._payload), w);
      }
      if (ao(y) || Qr(y)) return N !== null ? null : f(v, m, y, w, null);
      vl(v, y);
    }
    return null;
  }
  function g(v, m, y, w, N) {
    if ((typeof w == "string" && w !== "") || typeof w == "number")
      return (v = v.get(y) || null), i(m, v, "" + w, N);
    if (typeof w == "object" && w !== null) {
      switch (w.$$typeof) {
        case ll:
          return (v = v.get(w.key === null ? y : w.key) || null), u(m, v, w, N);
        case ir:
          return (v = v.get(w.key === null ? y : w.key) || null), c(m, v, w, N);
        case pn:
          var S = w._init;
          return g(v, m, y, S(w._payload), N);
      }
      if (ao(w) || Qr(w)) return (v = v.get(y) || null), f(m, v, w, N, null);
      vl(m, w);
    }
    return null;
  }
  function E(v, m, y, w) {
    for (
      var N = null, S = null, C = m, _ = (m = 0), j = null;
      C !== null && _ < y.length;
      _++
    ) {
      C.index > _ ? ((j = C), (C = null)) : (j = C.sibling);
      var D = h(v, C, y[_], w);
      if (D === null) {
        C === null && (C = j);
        break;
      }
      e && C && D.alternate === null && t(v, C),
        (m = l(D, m, _)),
        S === null ? (N = D) : (S.sibling = D),
        (S = D),
        (C = j);
    }
    if (_ === y.length) return n(v, C), ge && An(v, _), N;
    if (C === null) {
      for (; _ < y.length; _++)
        (C = d(v, y[_], w)),
          C !== null &&
            ((m = l(C, m, _)), S === null ? (N = C) : (S.sibling = C), (S = C));
      return ge && An(v, _), N;
    }
    for (C = r(v, C); _ < y.length; _++)
      (j = g(C, v, _, y[_], w)),
        j !== null &&
          (e && j.alternate !== null && C.delete(j.key === null ? _ : j.key),
          (m = l(j, m, _)),
          S === null ? (N = j) : (S.sibling = j),
          (S = j));
    return (
      e &&
        C.forEach(function (A) {
          return t(v, A);
        }),
      ge && An(v, _),
      N
    );
  }
  function x(v, m, y, w) {
    var N = Qr(y);
    if (typeof N != "function") throw Error(L(150));
    if (((y = N.call(y)), y == null)) throw Error(L(151));
    for (
      var S = (N = null), C = m, _ = (m = 0), j = null, D = y.next();
      C !== null && !D.done;
      _++, D = y.next()
    ) {
      C.index > _ ? ((j = C), (C = null)) : (j = C.sibling);
      var A = h(v, C, D.value, w);
      if (A === null) {
        C === null && (C = j);
        break;
      }
      e && C && A.alternate === null && t(v, C),
        (m = l(A, m, _)),
        S === null ? (N = A) : (S.sibling = A),
        (S = A),
        (C = j);
    }
    if (D.done) return n(v, C), ge && An(v, _), N;
    if (C === null) {
      for (; !D.done; _++, D = y.next())
        (D = d(v, D.value, w)),
          D !== null &&
            ((m = l(D, m, _)), S === null ? (N = D) : (S.sibling = D), (S = D));
      return ge && An(v, _), N;
    }
    for (C = r(v, C); !D.done; _++, D = y.next())
      (D = g(C, v, _, D.value, w)),
        D !== null &&
          (e && D.alternate !== null && C.delete(D.key === null ? _ : D.key),
          (m = l(D, m, _)),
          S === null ? (N = D) : (S.sibling = D),
          (S = D));
    return (
      e &&
        C.forEach(function (K) {
          return t(v, K);
        }),
      ge && An(v, _),
      N
    );
  }
  function k(v, m, y, w) {
    if (
      (typeof y == "object" &&
        y !== null &&
        y.type === ur &&
        y.key === null &&
        (y = y.props.children),
      typeof y == "object" && y !== null)
    ) {
      switch (y.$$typeof) {
        case ll:
          e: {
            for (var N = y.key, S = m; S !== null; ) {
              if (S.key === N) {
                if (((N = y.type), N === ur)) {
                  if (S.tag === 7) {
                    n(v, S.sibling),
                      (m = o(S, y.props.children)),
                      (m.return = v),
                      (v = m);
                    break e;
                  }
                } else if (
                  S.elementType === N ||
                  (typeof N == "object" &&
                    N !== null &&
                    N.$$typeof === pn &&
                    kf(N) === S.type)
                ) {
                  n(v, S.sibling),
                    (m = o(S, y.props)),
                    (m.ref = Zr(v, S, y)),
                    (m.return = v),
                    (v = m);
                  break e;
                }
                n(v, S);
                break;
              } else t(v, S);
              S = S.sibling;
            }
            y.type === ur
              ? ((m = Kn(y.props.children, v.mode, w, y.key)),
                (m.return = v),
                (v = m))
              : ((w = Il(y.type, y.key, y.props, null, v.mode, w)),
                (w.ref = Zr(v, m, y)),
                (w.return = v),
                (v = w));
          }
          return a(v);
        case ir:
          e: {
            for (S = y.key; m !== null; ) {
              if (m.key === S)
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === y.containerInfo &&
                  m.stateNode.implementation === y.implementation
                ) {
                  n(v, m.sibling),
                    (m = o(m, y.children || [])),
                    (m.return = v),
                    (v = m);
                  break e;
                } else {
                  n(v, m);
                  break;
                }
              else t(v, m);
              m = m.sibling;
            }
            (m = Es(y, v.mode, w)), (m.return = v), (v = m);
          }
          return a(v);
        case pn:
          return (S = y._init), k(v, m, S(y._payload), w);
      }
      if (ao(y)) return E(v, m, y, w);
      if (Qr(y)) return x(v, m, y, w);
      vl(v, y);
    }
    return (typeof y == "string" && y !== "") || typeof y == "number"
      ? ((y = "" + y),
        m !== null && m.tag === 6
          ? (n(v, m.sibling), (m = o(m, y)), (m.return = v), (v = m))
          : (n(v, m), (m = xs(y, v.mode, w)), (m.return = v), (v = m)),
        a(v))
      : n(v, m);
  }
  return k;
}
var Tr = Mp(!0),
  Ip = Mp(!1),
  qo = {},
  Ft = Ln(qo),
  jo = Ln(qo),
  Do = Ln(qo);
function Un(e) {
  if (e === qo) throw Error(L(174));
  return e;
}
function Ru(e, t) {
  switch ((pe(Do, t), pe(jo, e), pe(Ft, qo), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : As(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = As(t, e));
  }
  ve(Ft), pe(Ft, t);
}
function $r() {
  ve(Ft), ve(jo), ve(Do);
}
function zp(e) {
  Un(Do.current);
  var t = Un(Ft.current),
    n = As(t, e.type);
  t !== n && (pe(jo, e), pe(Ft, n));
}
function _u(e) {
  jo.current === e && (ve(Ft), ve(jo));
}
var ye = Ln(0);
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
var ps = [];
function Ou() {
  for (var e = 0; e < ps.length; e++)
    ps[e]._workInProgressVersionPrimary = null;
  ps.length = 0;
}
var $l = ln.ReactCurrentDispatcher,
  ms = ln.ReactCurrentBatchConfig,
  Yn = 0,
  xe = null,
  _e = null,
  Pe = null,
  la = !1,
  vo = !1,
  Mo = 0,
  Py = 0;
function Me() {
  throw Error(L(321));
}
function Pu(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!$t(e[n], t[n])) return !1;
  return !0;
}
function bu(e, t, n, r, o, l) {
  if (
    ((Yn = l),
    (xe = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    ($l.current = e === null || e.memoizedState === null ? Ly : jy),
    (e = n(r, o)),
    vo)
  ) {
    l = 0;
    do {
      if (((vo = !1), (Mo = 0), 25 <= l)) throw Error(L(301));
      (l += 1),
        (Pe = _e = null),
        (t.updateQueue = null),
        ($l.current = Dy),
        (e = n(r, o));
    } while (vo);
  }
  if (
    (($l.current = aa),
    (t = _e !== null && _e.next !== null),
    (Yn = 0),
    (Pe = _e = xe = null),
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
function jt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Pe === null ? (xe.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe;
}
function Et() {
  if (_e === null) {
    var e = xe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = _e.next;
  var t = Pe === null ? xe.memoizedState : Pe.next;
  if (t !== null) (Pe = t), (_e = e);
  else {
    if (e === null) throw Error(L(310));
    (_e = e),
      (e = {
        memoizedState: _e.memoizedState,
        baseState: _e.baseState,
        baseQueue: _e.baseQueue,
        queue: _e.queue,
        next: null,
      }),
      Pe === null ? (xe.memoizedState = Pe = e) : (Pe = Pe.next = e);
  }
  return Pe;
}
function Io(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function hs(e) {
  var t = Et(),
    n = t.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = e;
  var r = _e,
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
      if ((Yn & f) === f)
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
          (Xn |= f);
      }
      c = c.next;
    } while (c !== null && c !== l);
    u === null ? (a = r) : (u.next = i),
      $t(r, t.memoizedState) || (Xe = !0),
      (t.memoizedState = r),
      (t.baseState = a),
      (t.baseQueue = u),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do (l = o.lane), (xe.lanes |= l), (Xn |= l), (o = o.next);
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function vs(e) {
  var t = Et(),
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
    $t(l, t.memoizedState) || (Xe = !0),
      (t.memoizedState = l),
      t.baseQueue === null && (t.baseState = l),
      (n.lastRenderedState = l);
  }
  return [l, r];
}
function Ap() {}
function Fp(e, t) {
  var n = xe,
    r = Et(),
    o = t(),
    l = !$t(r.memoizedState, o);
  if (
    (l && ((r.memoizedState = o), (Xe = !0)),
    (r = r.queue),
    $u(Up.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || l || (Pe !== null && Pe.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      zo(9, Wp.bind(null, n, r, o, t), void 0, null),
      be === null)
    )
      throw Error(L(349));
    (Yn & 30) !== 0 || Bp(n, t, o);
  }
  return o;
}
function Bp(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = xe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (xe.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Wp(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Hp(t) && Vp(e);
}
function Up(e, t, n) {
  return n(function () {
    Hp(t) && Vp(e);
  });
}
function Hp(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !$t(e, n);
  } catch {
    return !0;
  }
}
function Vp(e) {
  var t = en(e, 1);
  t !== null && Tt(t, e, 1, -1);
}
function Nf(e) {
  var t = jt();
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
    (e = e.dispatch = $y.bind(null, xe, e)),
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
function Kp() {
  return Et().memoizedState;
}
function Ll(e, t, n, r) {
  var o = jt();
  (xe.flags |= e),
    (o.memoizedState = zo(1 | t, n, void 0, r === void 0 ? null : r));
}
function ba(e, t, n, r) {
  var o = Et();
  r = r === void 0 ? null : r;
  var l = void 0;
  if (_e !== null) {
    var a = _e.memoizedState;
    if (((l = a.destroy), r !== null && Pu(r, a.deps))) {
      o.memoizedState = zo(t, n, l, r);
      return;
    }
  }
  (xe.flags |= e), (o.memoizedState = zo(1 | t, n, l, r));
}
function Cf(e, t) {
  return Ll(8390656, 8, e, t);
}
function $u(e, t) {
  return ba(2048, 8, e, t);
}
function Gp(e, t) {
  return ba(4, 2, e, t);
}
function Qp(e, t) {
  return ba(4, 4, e, t);
}
function qp(e, t) {
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
function Yp(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), ba(4, 4, qp.bind(null, t, e), n)
  );
}
function Lu() {}
function Xp(e, t) {
  var n = Et();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Pu(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Jp(e, t) {
  var n = Et();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Pu(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Zp(e, t, n) {
  return (Yn & 21) === 0
    ? (e.baseState && ((e.baseState = !1), (Xe = !0)), (e.memoizedState = n))
    : ($t(n, t) || ((n = np()), (xe.lanes |= n), (Xn |= n), (e.baseState = !0)),
      t);
}
function by(e, t) {
  var n = fe;
  (fe = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = ms.transition;
  ms.transition = {};
  try {
    e(!1), t();
  } finally {
    (fe = n), (ms.transition = r);
  }
}
function em() {
  return Et().memoizedState;
}
function Ty(e, t, n) {
  var r = _n(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    tm(e))
  )
    nm(t, n);
  else if (((n = $p(e, t, n, r)), n !== null)) {
    var o = Ke();
    Tt(n, e, r, o), rm(n, t, r);
  }
}
function $y(e, t, n) {
  var r = _n(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (tm(e)) nm(t, o);
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
        if (((o.hasEagerState = !0), (o.eagerState = i), $t(i, a))) {
          var u = t.interleaved;
          u === null
            ? ((o.next = o), Nu(t))
            : ((o.next = u.next), (u.next = o)),
            (t.interleaved = o);
          return;
        }
      } catch {
      } finally {
      }
    (n = $p(e, t, o, r)),
      n !== null && ((o = Ke()), Tt(n, e, r, o), rm(n, t, r));
  }
}
function tm(e) {
  var t = e.alternate;
  return e === xe || (t !== null && t === xe);
}
function nm(e, t) {
  vo = la = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function rm(e, t, n) {
  if ((n & 4194240) !== 0) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), cu(e, n);
  }
}
var aa = {
    readContext: xt,
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
  Ly = {
    readContext: xt,
    useCallback: function (e, t) {
      return (jt().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: xt,
    useEffect: Cf,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Ll(4194308, 4, qp.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Ll(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Ll(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = jt();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = jt();
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
        (e = e.dispatch = Ty.bind(null, xe, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = jt();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Nf,
    useDebugValue: Lu,
    useDeferredValue: function (e) {
      return (jt().memoizedState = e);
    },
    useTransition: function () {
      var e = Nf(!1),
        t = e[0];
      return (e = by.bind(null, e[1])), (jt().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = xe,
        o = jt();
      if (ge) {
        if (n === void 0) throw Error(L(407));
        n = n();
      } else {
        if (((n = t()), be === null)) throw Error(L(349));
        (Yn & 30) !== 0 || Bp(r, t, n);
      }
      o.memoizedState = n;
      var l = { value: n, getSnapshot: t };
      return (
        (o.queue = l),
        Cf(Up.bind(null, r, l, e), [e]),
        (r.flags |= 2048),
        zo(9, Wp.bind(null, r, l, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = jt(),
        t = be.identifierPrefix;
      if (ge) {
        var n = Gt,
          r = Kt;
        (n = (r & ~(1 << (32 - bt(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Mo++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = Py++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  jy = {
    readContext: xt,
    useCallback: Xp,
    useContext: xt,
    useEffect: $u,
    useImperativeHandle: Yp,
    useInsertionEffect: Gp,
    useLayoutEffect: Qp,
    useMemo: Jp,
    useReducer: hs,
    useRef: Kp,
    useState: function () {
      return hs(Io);
    },
    useDebugValue: Lu,
    useDeferredValue: function (e) {
      var t = Et();
      return Zp(t, _e.memoizedState, e);
    },
    useTransition: function () {
      var e = hs(Io)[0],
        t = Et().memoizedState;
      return [e, t];
    },
    useMutableSource: Ap,
    useSyncExternalStore: Fp,
    useId: em,
    unstable_isNewReconciler: !1,
  },
  Dy = {
    readContext: xt,
    useCallback: Xp,
    useContext: xt,
    useEffect: $u,
    useImperativeHandle: Yp,
    useInsertionEffect: Gp,
    useLayoutEffect: Qp,
    useMemo: Jp,
    useReducer: vs,
    useRef: Kp,
    useState: function () {
      return vs(Io);
    },
    useDebugValue: Lu,
    useDeferredValue: function (e) {
      var t = Et();
      return _e === null ? (t.memoizedState = e) : Zp(t, _e.memoizedState, e);
    },
    useTransition: function () {
      var e = vs(Io)[0],
        t = Et().memoizedState;
      return [e, t];
    },
    useMutableSource: Ap,
    useSyncExternalStore: Fp,
    useId: em,
    unstable_isNewReconciler: !1,
  };
function Lr(e, t) {
  try {
    var n = "",
      r = t;
    do (n += ug(r)), (r = r.return);
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
function gs(e, t, n) {
  return {
    value: e,
    source: null,
    stack: n != null ? n : null,
    digest: t != null ? t : null,
  };
}
function ii(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var My = typeof WeakMap == "function" ? WeakMap : Map;
function om(e, t, n) {
  (n = qt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      ia || ((ia = !0), (yi = r)), ii(e, t);
    }),
    n
  );
}
function lm(e, t, n) {
  (n = qt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    (n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        ii(e, t);
      });
  }
  var l = e.stateNode;
  return (
    l !== null &&
      typeof l.componentDidCatch == "function" &&
      (n.callback = function () {
        ii(e, t),
          typeof r != "function" &&
            (Rn === null ? (Rn = new Set([this])) : Rn.add(this));
        var a = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: a !== null ? a : "",
        });
      }),
    n
  );
}
function Rf(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new My();
    var o = new Set();
    r.set(t, o);
  } else (o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o));
  o.has(n) || (o.add(n), (e = Yy.bind(null, e, t, n)), t.then(e, e));
}
function _f(e) {
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
function Of(e, t, n, r, o) {
  return (e.mode & 1) === 0
    ? (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = qt(-1, 1)), (t.tag = 2), Cn(n, t, 1))),
          (n.lanes |= 1)),
      e)
    : ((e.flags |= 65536), (e.lanes = o), e);
}
var Iy = ln.ReactCurrentOwner,
  Xe = !1;
function Ue(e, t, n, r) {
  t.child = e === null ? Ip(t, null, n, r) : Tr(t, e.child, n, r);
}
function Pf(e, t, n, r, o) {
  n = n.render;
  var l = t.ref;
  return (
    Nr(t, o),
    (r = bu(e, t, n, r, l, o)),
    (n = Tu()),
    e !== null && !Xe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        tn(e, t, o))
      : (ge && n && yu(t), (t.flags |= 1), Ue(e, t, r, o), t.child)
  );
}
function bf(e, t, n, r, o) {
  if (e === null) {
    var l = n.type;
    return typeof l == "function" &&
      !Bu(l) &&
      l.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = l), am(e, t, l, r, o))
      : ((e = Il(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((l = e.child), (e.lanes & o) === 0)) {
    var a = l.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : bo), n(a, r) && e.ref === t.ref)
    )
      return tn(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = On(l, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function am(e, t, n, r, o) {
  if (e !== null) {
    var l = e.memoizedProps;
    if (bo(l, r) && e.ref === t.ref)
      if (((Xe = !1), (t.pendingProps = r = l), (e.lanes & o) !== 0))
        (e.flags & 131072) !== 0 && (Xe = !0);
      else return (t.lanes = e.lanes), tn(e, t, o);
  }
  return ui(e, t, n, r, o);
}
function sm(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    l = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if ((t.mode & 1) === 0)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        pe(xr, ot),
        (ot |= n);
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
          pe(xr, ot),
          (ot |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = l !== null ? l.baseLanes : n),
        pe(xr, ot),
        (ot |= r);
    }
  else
    l !== null ? ((r = l.baseLanes | n), (t.memoizedState = null)) : (r = n),
      pe(xr, ot),
      (ot |= r);
  return Ue(e, t, o, n), t.child;
}
function im(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ui(e, t, n, r, o) {
  var l = Ze(n) ? Qn : Fe.current;
  return (
    (l = Pr(t, l)),
    Nr(t, o),
    (n = bu(e, t, n, r, l, o)),
    (r = Tu()),
    e !== null && !Xe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        tn(e, t, o))
      : (ge && r && yu(t), (t.flags |= 1), Ue(e, t, n, o), t.child)
  );
}
function Tf(e, t, n, r, o) {
  if (Ze(n)) {
    var l = !0;
    Jl(t);
  } else l = !1;
  if ((Nr(t, o), t.stateNode === null))
    jl(e, t), Dp(t, n, r), si(t, n, r, o), (r = !0);
  else if (e === null) {
    var a = t.stateNode,
      i = t.memoizedProps;
    a.props = i;
    var u = a.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = xt(c))
      : ((c = Ze(n) ? Qn : Fe.current), (c = Pr(t, c)));
    var f = n.getDerivedStateFromProps,
      d =
        typeof f == "function" ||
        typeof a.getSnapshotBeforeUpdate == "function";
    d ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((i !== r || u !== c) && Sf(t, a, r, c)),
      (mn = !1);
    var h = t.memoizedState;
    (a.state = h),
      ra(t, r, a, o),
      (u = t.memoizedState),
      i !== r || h !== u || Je.current || mn
        ? (typeof f == "function" && (ai(t, n, f, r), (u = t.memoizedState)),
          (i = mn || wf(t, n, i, r, h, u, c))
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
      Lp(e, t),
      (i = t.memoizedProps),
      (c = t.type === t.elementType ? i : _t(t.type, i)),
      (a.props = c),
      (d = t.pendingProps),
      (h = a.context),
      (u = n.contextType),
      typeof u == "object" && u !== null
        ? (u = xt(u))
        : ((u = Ze(n) ? Qn : Fe.current), (u = Pr(t, u)));
    var g = n.getDerivedStateFromProps;
    (f =
      typeof g == "function" ||
      typeof a.getSnapshotBeforeUpdate == "function") ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((i !== d || h !== u) && Sf(t, a, r, u)),
      (mn = !1),
      (h = t.memoizedState),
      (a.state = h),
      ra(t, r, a, o);
    var E = t.memoizedState;
    i !== d || h !== E || Je.current || mn
      ? (typeof g == "function" && (ai(t, n, g, r), (E = t.memoizedState)),
        (c = mn || wf(t, n, c, r, h, E, u) || !1)
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
  return ci(e, t, n, r, l, o);
}
function ci(e, t, n, r, o, l) {
  im(e, t);
  var a = (t.flags & 128) !== 0;
  if (!r && !a) return o && vf(t, n, !1), tn(e, t, l);
  (r = t.stateNode), (Iy.current = t);
  var i =
    a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && a
      ? ((t.child = Tr(t, e.child, null, l)), (t.child = Tr(t, null, i, l)))
      : Ue(e, t, i, l),
    (t.memoizedState = r.state),
    o && vf(t, n, !0),
    t.child
  );
}
function um(e) {
  var t = e.stateNode;
  t.pendingContext
    ? hf(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && hf(e, t.context, !1),
    Ru(e, t.containerInfo);
}
function $f(e, t, n, r, o) {
  return br(), Eu(o), (t.flags |= 256), Ue(e, t, n, r), t.child;
}
var fi = { dehydrated: null, treeContext: null, retryLane: 0 };
function di(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function cm(e, t, n) {
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
      oi(t),
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
              (e = Kn(e, r, n, null)),
              (l.return = t),
              (e.return = t),
              (l.sibling = e),
              (t.child = l),
              (t.child.memoizedState = di(n)),
              (t.memoizedState = fi),
              e)
            : ju(t, a))
    );
  if (((o = e.memoizedState), o !== null && ((i = o.dehydrated), i !== null)))
    return zy(e, t, a, r, i, o, n);
  if (l) {
    (l = r.fallback), (a = t.mode), (o = e.child), (i = o.sibling);
    var u = { mode: "hidden", children: r.children };
    return (
      (a & 1) === 0 && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = u),
          (t.deletions = null))
        : ((r = On(o, u)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      i !== null ? (l = On(i, l)) : ((l = Kn(l, a, n, null)), (l.flags |= 2)),
      (l.return = t),
      (r.return = t),
      (r.sibling = l),
      (t.child = r),
      (r = l),
      (l = t.child),
      (a = e.child.memoizedState),
      (a =
        a === null
          ? di(n)
          : {
              baseLanes: a.baseLanes | n,
              cachePool: null,
              transitions: a.transitions,
            }),
      (l.memoizedState = a),
      (l.childLanes = e.childLanes & ~n),
      (t.memoizedState = fi),
      r
    );
  }
  return (
    (l = e.child),
    (e = l.sibling),
    (r = On(l, { mode: "visible", children: r.children })),
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
function ju(e, t) {
  return (
    (t = La({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function gl(e, t, n, r) {
  return (
    r !== null && Eu(r),
    Tr(t, e.child, null, n),
    (e = ju(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function zy(e, t, n, r, o, l, a) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = gs(Error(L(422)))), gl(e, t, a, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((l = r.fallback),
          (o = t.mode),
          (r = La({ mode: "visible", children: r.children }, o, 0, null)),
          (l = Kn(l, o, a, null)),
          (l.flags |= 2),
          (r.return = t),
          (l.return = t),
          (r.sibling = l),
          (t.child = r),
          (t.mode & 1) !== 0 && Tr(t, e.child, null, a),
          (t.child.memoizedState = di(a)),
          (t.memoizedState = fi),
          l);
  if ((t.mode & 1) === 0) return gl(e, t, a, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var i = r.dgst;
    return (r = i), (l = Error(L(419))), (r = gs(l, r, void 0)), gl(e, t, a, r);
  }
  if (((i = (a & e.childLanes) !== 0), Xe || i)) {
    if (((r = be), r !== null)) {
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
          ((l.retryLane = o), en(e, o), Tt(r, e, o, -1));
    }
    return Fu(), (r = gs(Error(L(421)))), gl(e, t, a, r);
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Xy.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = l.treeContext),
      (at = Nn(o.nextSibling)),
      (it = t),
      (ge = !0),
      (Pt = null),
      e !== null &&
        ((mt[ht++] = Kt),
        (mt[ht++] = Gt),
        (mt[ht++] = qn),
        (Kt = e.id),
        (Gt = e.overflow),
        (qn = t)),
      (t = ju(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Lf(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), li(e.return, t, n);
}
function ys(e, t, n, r, o) {
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
function fm(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    l = r.tail;
  if ((Ue(e, t, r.children, n), (r = ye.current), (r & 2) !== 0))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Lf(e, n, t);
        else if (e.tag === 19) Lf(e, n, t);
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
          ys(t, !1, o, n, l);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && oa(e) === null)) {
            t.child = o;
            break;
          }
          (e = o.sibling), (o.sibling = n), (n = o), (o = e);
        }
        ys(t, !0, n, null, l);
        break;
      case "together":
        ys(t, !1, null, null, void 0);
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
function tn(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Xn |= t.lanes),
    (n & t.childLanes) === 0)
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(L(153));
  if (t.child !== null) {
    for (
      e = t.child, n = On(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = On(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function Ay(e, t, n) {
  switch (t.tag) {
    case 3:
      um(t), br();
      break;
    case 5:
      zp(t);
      break;
    case 1:
      Ze(t.type) && Jl(t);
      break;
    case 4:
      Ru(t, t.stateNode.containerInfo);
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
            ? cm(e, t, n)
            : (pe(ye, ye.current & 1),
              (e = tn(e, t, n)),
              e !== null ? e.sibling : null);
      pe(ye, ye.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
        if (r) return fm(e, t, n);
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
      return (t.lanes = 0), sm(e, t, n);
  }
  return tn(e, t, n);
}
var dm, pi, pm, mm;
dm = function (e, t) {
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
pi = function () {};
pm = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    (e = t.stateNode), Un(Ft.current);
    var l = null;
    switch (n) {
      case "input":
        (o = Ds(e, o)), (r = Ds(e, r)), (l = []);
        break;
      case "select":
        (o = Ee({}, o, { value: void 0 })),
          (r = Ee({}, r, { value: void 0 })),
          (l = []);
        break;
      case "textarea":
        (o = zs(e, o)), (r = zs(e, r)), (l = []);
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Yl);
    }
    Fs(n, r);
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
mm = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function eo(e, t) {
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
function Fy(e, t, n) {
  var r = t.pendingProps;
  switch ((xu(t), t.tag)) {
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
      return Ze(t.type) && Xl(), Ie(t), null;
    case 3:
      return (
        (r = t.stateNode),
        $r(),
        ve(Je),
        ve(Fe),
        Ou(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (hl(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
              ((t.flags |= 1024), Pt !== null && (wi(Pt), (Pt = null)))),
        pi(e, t),
        Ie(t),
        null
      );
    case 5:
      _u(t);
      var o = Un(Do.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        pm(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(L(166));
          return Ie(t), null;
        }
        if (((e = Un(Ft.current)), hl(t))) {
          (r = t.stateNode), (n = t.type);
          var l = t.memoizedProps;
          switch (((r[It] = t), (r[Lo] = l), (e = (t.mode & 1) !== 0), n)) {
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
              for (o = 0; o < io.length; o++) me(io[o], r);
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
              Bc(r, l), me("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!l.multiple }),
                me("invalid", r);
              break;
            case "textarea":
              Uc(r, l), me("invalid", r);
          }
          Fs(n, l), (o = null);
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
              al(r), Wc(r, l, !0);
              break;
            case "textarea":
              al(r), Hc(r);
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
            e === "http://www.w3.org/1999/xhtml" && (e = Bd(n)),
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
            (e[It] = t),
            (e[Lo] = r),
            dm(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((a = Bs(n, r)), n)) {
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
                for (o = 0; o < io.length; o++) me(io[o], e);
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
                Bc(e, r), (o = Ds(e, r)), me("invalid", e);
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
                Uc(e, r), (o = zs(e, r)), me("invalid", e);
                break;
              default:
                o = r;
            }
            Fs(n, o), (i = o);
            for (l in i)
              if (i.hasOwnProperty(l)) {
                var u = i[l];
                l === "style"
                  ? Hd(e, u)
                  : l === "dangerouslySetInnerHTML"
                    ? ((u = u ? u.__html : void 0), u != null && Wd(e, u))
                    : l === "children"
                      ? typeof u == "string"
                        ? (n !== "textarea" || u !== "") && No(e, u)
                        : typeof u == "number" && No(e, "" + u)
                      : l !== "suppressContentEditableWarning" &&
                        l !== "suppressHydrationWarning" &&
                        l !== "autoFocus" &&
                        (ko.hasOwnProperty(l)
                          ? u != null && l === "onScroll" && me("scroll", e)
                          : u != null && ou(e, l, u, a));
              }
            switch (n) {
              case "input":
                al(e), Wc(e, r, !1);
                break;
              case "textarea":
                al(e), Hc(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Pn(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (l = r.value),
                  l != null
                    ? Er(e, !!r.multiple, l, !1)
                    : r.defaultValue != null &&
                      Er(e, !!r.multiple, r.defaultValue, !0);
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
      if (e && t.stateNode != null) mm(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(L(166));
        if (((n = Un(Do.current)), Un(Ft.current), hl(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[It] = t),
            (l = r.nodeValue !== n) && ((e = it), e !== null))
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
            (r[It] = t),
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
        if (ge && at !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
          Tp(), br(), (t.flags |= 98560), (l = !1);
        else if (((l = hl(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!l) throw Error(L(318));
            if (
              ((l = t.memoizedState),
              (l = l !== null ? l.dehydrated : null),
              !l)
            )
              throw Error(L(317));
            l[It] = t;
          } else
            br(),
              (t.flags & 128) === 0 && (t.memoizedState = null),
              (t.flags |= 4);
          Ie(t), (l = !1);
        } else Pt !== null && (wi(Pt), (Pt = null)), (l = !0);
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
                : Fu())),
          t.updateQueue !== null && (t.flags |= 4),
          Ie(t),
          null);
    case 4:
      return (
        $r(), pi(e, t), e === null && To(t.stateNode.containerInfo), Ie(t), null
      );
    case 10:
      return ku(t.type._context), Ie(t), null;
    case 17:
      return Ze(t.type) && Xl(), Ie(t), null;
    case 19:
      if ((ve(ye), (l = t.memoizedState), l === null)) return Ie(t), null;
      if (((r = (t.flags & 128) !== 0), (a = l.rendering), a === null))
        if (r) eo(l, !1);
        else {
          if (Oe !== 0 || (e !== null && (e.flags & 128) !== 0))
            for (e = t.child; e !== null; ) {
              if (((a = oa(e)), a !== null)) {
                for (
                  t.flags |= 128,
                    eo(l, !1),
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
            ke() > jr &&
            ((t.flags |= 128), (r = !0), eo(l, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = oa(a)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              eo(l, !0),
              l.tail === null && l.tailMode === "hidden" && !a.alternate && !ge)
            )
              return Ie(t), null;
          } else
            2 * ke() - l.renderingStartTime > jr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), eo(l, !1), (t.lanes = 4194304));
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
          (l.renderingStartTime = ke()),
          (t.sibling = null),
          (n = ye.current),
          pe(ye, r ? (n & 1) | 2 : n & 1),
          t)
        : (Ie(t), null);
    case 22:
    case 23:
      return (
        Au(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && (t.mode & 1) !== 0
          ? (ot & 1073741824) !== 0 &&
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
function By(e, t) {
  switch ((xu(t), t.tag)) {
    case 1:
      return (
        Ze(t.type) && Xl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        $r(),
        ve(Je),
        ve(Fe),
        Ou(),
        (e = t.flags),
        (e & 65536) !== 0 && (e & 128) === 0
          ? ((t.flags = (e & -65537) | 128), t)
          : null
      );
    case 5:
      return _u(t), null;
    case 13:
      if (
        (ve(ye), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(L(340));
        br();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return ve(ye), null;
    case 4:
      return $r(), null;
    case 10:
      return ku(t.type._context), null;
    case 22:
    case 23:
      return Au(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var yl = !1,
  Ae = !1,
  Wy = typeof WeakSet == "function" ? WeakSet : Set,
  W = null;
function yr(e, t) {
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
function mi(e, t, n) {
  try {
    n();
  } catch (r) {
    we(e, t, r);
  }
}
var jf = !1;
function Uy(e, t) {
  if (((Xs = Gl), (e = yp()), gu(e))) {
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
              var g;
              d !== n || (o !== 0 && d.nodeType !== 3) || (i = a + o),
                d !== l || (r !== 0 && d.nodeType !== 3) || (u = a + r),
                d.nodeType === 3 && (a += d.nodeValue.length),
                (g = d.firstChild) !== null;

            )
              (h = d), (d = g);
            for (;;) {
              if (d === e) break t;
              if (
                (h === n && ++c === o && (i = a),
                h === l && ++f === r && (u = a),
                (g = d.nextSibling) !== null)
              )
                break;
              (d = h), (h = d.parentNode);
            }
            d = g;
          }
          n = i === -1 || u === -1 ? null : { start: i, end: u };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Js = { focusedElem: e, selectionRange: n }, Gl = !1, W = t; W !== null; )
    if (((t = W), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (W = e);
    else
      for (; W !== null; ) {
        t = W;
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
                    m = v.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? x : _t(t.type, x),
                      k,
                    );
                  v.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var y = t.stateNode.containerInfo;
                y.nodeType === 1
                  ? (y.textContent = "")
                  : y.nodeType === 9 &&
                    y.documentElement &&
                    y.removeChild(y.documentElement);
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
          (e.return = t.return), (W = e);
          break;
        }
        W = t.return;
      }
  return (E = jf), (jf = !1), E;
}
function go(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var l = o.destroy;
        (o.destroy = void 0), l !== void 0 && mi(t, n, l);
      }
      o = o.next;
    } while (o !== r);
  }
}
function Ta(e, t) {
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
function hi(e) {
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
function hm(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), hm(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[It], delete t[Lo], delete t[ti], delete t[Cy], delete t[Ry])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function vm(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Df(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || vm(e.return)) return null;
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
function vi(e, t, n) {
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
    for (vi(e, t, n), e = e.sibling; e !== null; ) vi(e, t, n), (e = e.sibling);
}
function gi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (gi(e, t, n), e = e.sibling; e !== null; ) gi(e, t, n), (e = e.sibling);
}
var Te = null,
  Ot = !1;
function dn(e, t, n) {
  for (n = n.child; n !== null; ) gm(e, t, n), (n = n.sibling);
}
function gm(e, t, n) {
  if (At && typeof At.onCommitFiberUnmount == "function")
    try {
      At.onCommitFiberUnmount(ka, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ae || yr(n, t);
    case 6:
      var r = Te,
        o = Ot;
      (Te = null),
        dn(e, t, n),
        (Te = r),
        (Ot = o),
        Te !== null &&
          (Ot
            ? ((e = Te),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Te.removeChild(n.stateNode));
      break;
    case 18:
      Te !== null &&
        (Ot
          ? ((e = Te),
            (n = n.stateNode),
            e.nodeType === 8
              ? fs(e.parentNode, n)
              : e.nodeType === 1 && fs(e, n),
            Oo(e))
          : fs(Te, n.stateNode));
      break;
    case 4:
      (r = Te),
        (o = Ot),
        (Te = n.stateNode.containerInfo),
        (Ot = !0),
        dn(e, t, n),
        (Te = r),
        (Ot = o);
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
            a !== void 0 && ((l & 2) !== 0 || (l & 4) !== 0) && mi(n, t, a),
            (o = o.next);
        } while (o !== r);
      }
      dn(e, t, n);
      break;
    case 1:
      if (
        !Ae &&
        (yr(n, t),
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
      dn(e, t, n);
      break;
    case 21:
      dn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ae = (r = Ae) || n.memoizedState !== null), dn(e, t, n), (Ae = r))
        : dn(e, t, n);
      break;
    default:
      dn(e, t, n);
  }
}
function Mf(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Wy()),
      t.forEach(function (r) {
        var o = Jy.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
  }
}
function Rt(e, t) {
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
              (Te = i.stateNode), (Ot = !1);
              break e;
            case 3:
              (Te = i.stateNode.containerInfo), (Ot = !0);
              break e;
            case 4:
              (Te = i.stateNode.containerInfo), (Ot = !0);
              break e;
          }
          i = i.return;
        }
        if (Te === null) throw Error(L(160));
        gm(l, a, o), (Te = null), (Ot = !1);
        var u = o.alternate;
        u !== null && (u.return = null), (o.return = null);
      } catch (c) {
        we(o, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) ym(t, e), (t = t.sibling);
}
function ym(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Rt(t, e), Lt(e), r & 4)) {
        try {
          go(3, e, e.return), Ta(3, e);
        } catch (x) {
          we(e, e.return, x);
        }
        try {
          go(5, e, e.return);
        } catch (x) {
          we(e, e.return, x);
        }
      }
      break;
    case 1:
      Rt(t, e), Lt(e), r & 512 && n !== null && yr(n, n.return);
      break;
    case 5:
      if (
        (Rt(t, e),
        Lt(e),
        r & 512 && n !== null && yr(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          No(o, "");
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
            i === "input" && l.type === "radio" && l.name != null && Ad(o, l),
              Bs(i, a);
            var c = Bs(i, l);
            for (a = 0; a < u.length; a += 2) {
              var f = u[a],
                d = u[a + 1];
              f === "style"
                ? Hd(o, d)
                : f === "dangerouslySetInnerHTML"
                  ? Wd(o, d)
                  : f === "children"
                    ? No(o, d)
                    : ou(o, f, d, c);
            }
            switch (i) {
              case "input":
                Ms(o, l);
                break;
              case "textarea":
                Fd(o, l);
                break;
              case "select":
                var h = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!l.multiple;
                var g = l.value;
                g != null
                  ? Er(o, !!l.multiple, g, !1)
                  : h !== !!l.multiple &&
                    (l.defaultValue != null
                      ? Er(o, !!l.multiple, l.defaultValue, !0)
                      : Er(o, !!l.multiple, l.multiple ? [] : "", !1));
            }
            o[Lo] = l;
          } catch (x) {
            we(e, e.return, x);
          }
      }
      break;
    case 6:
      if ((Rt(t, e), Lt(e), r & 4)) {
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
        (Rt(t, e), Lt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Oo(t.containerInfo);
        } catch (x) {
          we(e, e.return, x);
        }
      break;
    case 4:
      Rt(t, e), Lt(e);
      break;
    case 13:
      Rt(t, e),
        Lt(e),
        (o = e.child),
        o.flags & 8192 &&
          ((l = o.memoizedState !== null),
          (o.stateNode.isHidden = l),
          !l ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (Iu = ke())),
        r & 4 && Mf(e);
      break;
    case 22:
      if (
        ((f = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Ae = (c = Ae) || f), Rt(t, e), (Ae = c)) : Rt(t, e),
        Lt(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !f && (e.mode & 1) !== 0)
        )
          for (W = e, f = e.child; f !== null; ) {
            for (d = W = f; W !== null; ) {
              switch (((h = W), (g = h.child), h.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  go(4, h, h.return);
                  break;
                case 1:
                  yr(h, h.return);
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
                  yr(h, h.return);
                  break;
                case 22:
                  if (h.memoizedState !== null) {
                    zf(d);
                    continue;
                  }
              }
              g !== null ? ((g.return = h), (W = g)) : zf(d);
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
                      (i.style.display = Ud("display", a)));
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
      Rt(t, e), Lt(e), r & 4 && Mf(e);
      break;
    case 21:
      break;
    default:
      Rt(t, e), Lt(e);
  }
}
function Lt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (vm(n)) {
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
          r.flags & 32 && (No(o, ""), (r.flags &= -33));
          var l = Df(e);
          gi(e, l, o);
          break;
        case 3:
        case 4:
          var a = r.stateNode.containerInfo,
            i = Df(e);
          vi(e, i, a);
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
function Hy(e, t, n) {
  (W = e), xm(e);
}
function xm(e, t, n) {
  for (var r = (e.mode & 1) !== 0; W !== null; ) {
    var o = W,
      l = o.child;
    if (o.tag === 22 && r) {
      var a = o.memoizedState !== null || yl;
      if (!a) {
        var i = o.alternate,
          u = (i !== null && i.memoizedState !== null) || Ae;
        i = yl;
        var c = Ae;
        if (((yl = a), (Ae = u) && !c))
          for (W = o; W !== null; )
            (a = W),
              (u = a.child),
              a.tag === 22 && a.memoizedState !== null
                ? Af(o)
                : u !== null
                  ? ((u.return = a), (W = u))
                  : Af(o);
        for (; l !== null; ) (W = l), xm(l), (l = l.sibling);
        (W = o), (yl = i), (Ae = c);
      }
      If(e);
    } else
      (o.subtreeFlags & 8772) !== 0 && l !== null
        ? ((l.return = o), (W = l))
        : If(e);
  }
}
function If(e) {
  for (; W !== null; ) {
    var t = W;
    if ((t.flags & 8772) !== 0) {
      var n = t.alternate;
      try {
        if ((t.flags & 8772) !== 0)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ae || Ta(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ae)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : _t(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var l = t.updateQueue;
              l !== null && Ef(t, l, r);
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
                Ef(t, a, n);
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
                    d !== null && Oo(d);
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
        Ae || (t.flags & 512 && hi(t));
      } catch (h) {
        we(t, t.return, h);
      }
    }
    if (t === e) {
      W = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (W = n);
      break;
    }
    W = t.return;
  }
}
function zf(e) {
  for (; W !== null; ) {
    var t = W;
    if (t === e) {
      W = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (W = n);
      break;
    }
    W = t.return;
  }
}
function Af(e) {
  for (; W !== null; ) {
    var t = W;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Ta(4, t);
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
            hi(t);
          } catch (u) {
            we(t, l, u);
          }
          break;
        case 5:
          var a = t.return;
          try {
            hi(t);
          } catch (u) {
            we(t, a, u);
          }
      }
    } catch (u) {
      we(t, t.return, u);
    }
    if (t === e) {
      W = null;
      break;
    }
    var i = t.sibling;
    if (i !== null) {
      (i.return = t.return), (W = i);
      break;
    }
    W = t.return;
  }
}
var Vy = Math.ceil,
  sa = ln.ReactCurrentDispatcher,
  Du = ln.ReactCurrentOwner,
  yt = ln.ReactCurrentBatchConfig,
  ie = 0,
  be = null,
  Ne = null,
  $e = 0,
  ot = 0,
  xr = Ln(0),
  Oe = 0,
  Ao = null,
  Xn = 0,
  $a = 0,
  Mu = 0,
  yo = null,
  Ye = null,
  Iu = 0,
  jr = 1 / 0,
  Ht = null,
  ia = !1,
  yi = null,
  Rn = null,
  xl = !1,
  En = null,
  ua = 0,
  xo = 0,
  xi = null,
  Dl = -1,
  Ml = 0;
function Ke() {
  return (ie & 6) !== 0 ? ke() : Dl !== -1 ? Dl : (Dl = ke());
}
function _n(e) {
  return (e.mode & 1) === 0
    ? 1
    : (ie & 2) !== 0 && $e !== 0
      ? $e & -$e
      : Oy.transition !== null
        ? (Ml === 0 && (Ml = np()), Ml)
        : ((e = fe),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : up(e.type))),
          e);
}
function Tt(e, t, n, r) {
  if (50 < xo) throw ((xo = 0), (xi = null), Error(L(185)));
  Ko(e, n, r),
    ((ie & 2) === 0 || e !== be) &&
      (e === be && ((ie & 2) === 0 && ($a |= n), Oe === 4 && gn(e, $e)),
      et(e, r),
      n === 1 &&
        ie === 0 &&
        (t.mode & 1) === 0 &&
        ((jr = ke() + 500), Oa && jn()));
}
function et(e, t) {
  var n = e.callbackNode;
  Og(e, t);
  var r = Kl(e, e === be ? $e : 0);
  if (r === 0)
    n !== null && Gc(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Gc(n), t === 1))
      e.tag === 0 ? _y(Ff.bind(null, e)) : Op(Ff.bind(null, e)),
        ky(function () {
          (ie & 6) === 0 && jn();
        }),
        (n = null);
    else {
      switch (rp(r)) {
        case 1:
          n = uu;
          break;
        case 4:
          n = ep;
          break;
        case 16:
          n = Vl;
          break;
        case 536870912:
          n = tp;
          break;
        default:
          n = Vl;
      }
      n = _m(n, Em.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function Em(e, t) {
  if (((Dl = -1), (Ml = 0), (ie & 6) !== 0)) throw Error(L(327));
  var n = e.callbackNode;
  if (Cr() && e.callbackNode !== n) return null;
  var r = Kl(e, e === be ? $e : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = ca(e, r);
  else {
    t = r;
    var o = ie;
    ie |= 2;
    var l = Sm();
    (be !== e || $e !== t) && ((Ht = null), (jr = ke() + 500), Vn(e, t));
    do
      try {
        Qy();
        break;
      } catch (i) {
        wm(e, i);
      }
    while (1);
    Su(),
      (sa.current = l),
      (ie = o),
      Ne !== null ? (t = 0) : ((be = null), ($e = 0), (t = Oe));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = Ks(e)), o !== 0 && ((r = o), (t = Ei(e, o)))), t === 1)
    )
      throw ((n = Ao), Vn(e, 0), gn(e, r), et(e, ke()), n);
    if (t === 6) gn(e, r);
    else {
      if (
        ((o = e.current.alternate),
        (r & 30) === 0 &&
          !Ky(o) &&
          ((t = ca(e, r)),
          t === 2 && ((l = Ks(e)), l !== 0 && ((r = l), (t = Ei(e, l)))),
          t === 1))
      )
        throw ((n = Ao), Vn(e, 0), gn(e, r), et(e, ke()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(L(345));
        case 2:
          Fn(e, Ye, Ht);
          break;
        case 3:
          if (
            (gn(e, r), (r & 130023424) === r && ((t = Iu + 500 - ke()), 10 < t))
          ) {
            if (Kl(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              Ke(), (e.pingedLanes |= e.suspendedLanes & o);
              break;
            }
            e.timeoutHandle = ei(Fn.bind(null, e, Ye, Ht), t);
            break;
          }
          Fn(e, Ye, Ht);
          break;
        case 4:
          if ((gn(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r; ) {
            var a = 31 - bt(r);
            (l = 1 << a), (a = t[a]), a > o && (o = a), (r &= ~l);
          }
          if (
            ((r = o),
            (r = ke() - r),
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
                          : 1960 * Vy(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = ei(Fn.bind(null, e, Ye, Ht), r);
            break;
          }
          Fn(e, Ye, Ht);
          break;
        case 5:
          Fn(e, Ye, Ht);
          break;
        default:
          throw Error(L(329));
      }
    }
  }
  return et(e, ke()), e.callbackNode === n ? Em.bind(null, e) : null;
}
function Ei(e, t) {
  var n = yo;
  return (
    e.current.memoizedState.isDehydrated && (Vn(e, t).flags |= 256),
    (e = ca(e, t)),
    e !== 2 && ((t = Ye), (Ye = n), t !== null && wi(t)),
    e
  );
}
function wi(e) {
  Ye === null ? (Ye = e) : Ye.push.apply(Ye, e);
}
function Ky(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            l = o.getSnapshot;
          o = o.value;
          try {
            if (!$t(l(), o)) return !1;
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
function gn(e, t) {
  for (
    t &= ~Mu,
      t &= ~$a,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - bt(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function Ff(e) {
  if ((ie & 6) !== 0) throw Error(L(327));
  Cr();
  var t = Kl(e, 0);
  if ((t & 1) === 0) return et(e, ke()), null;
  var n = ca(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Ks(e);
    r !== 0 && ((t = r), (n = Ei(e, r)));
  }
  if (n === 1) throw ((n = Ao), Vn(e, 0), gn(e, t), et(e, ke()), n);
  if (n === 6) throw Error(L(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Fn(e, Ye, Ht),
    et(e, ke()),
    null
  );
}
function zu(e, t) {
  var n = ie;
  ie |= 1;
  try {
    return e(t);
  } finally {
    (ie = n), ie === 0 && ((jr = ke() + 500), Oa && jn());
  }
}
function Jn(e) {
  En !== null && En.tag === 0 && (ie & 6) === 0 && Cr();
  var t = ie;
  ie |= 1;
  var n = yt.transition,
    r = fe;
  try {
    if (((yt.transition = null), (fe = 1), e)) return e();
  } finally {
    (fe = r), (yt.transition = n), (ie = t), (ie & 6) === 0 && jn();
  }
}
function Au() {
  (ot = xr.current), ve(xr);
}
function Vn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), Sy(n)), Ne !== null))
    for (n = Ne.return; n !== null; ) {
      var r = n;
      switch ((xu(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Xl();
          break;
        case 3:
          $r(), ve(Je), ve(Fe), Ou();
          break;
        case 5:
          _u(r);
          break;
        case 4:
          $r();
          break;
        case 13:
          ve(ye);
          break;
        case 19:
          ve(ye);
          break;
        case 10:
          ku(r.type._context);
          break;
        case 22:
        case 23:
          Au();
      }
      n = n.return;
    }
  if (
    ((be = e),
    (Ne = e = On(e.current, null)),
    ($e = ot = t),
    (Oe = 0),
    (Ao = null),
    (Mu = $a = Xn = 0),
    (Ye = yo = null),
    Wn !== null)
  ) {
    for (t = 0; t < Wn.length; t++)
      if (((n = Wn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          l = n.pending;
        if (l !== null) {
          var a = l.next;
          (l.next = o), (r.next = a);
        }
        n.pending = r;
      }
    Wn = null;
  }
  return e;
}
function wm(e, t) {
  do {
    var n = Ne;
    try {
      if ((Su(), ($l.current = aa), la)) {
        for (var r = xe.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), (r = r.next);
        }
        la = !1;
      }
      if (
        ((Yn = 0),
        (Pe = _e = xe = null),
        (vo = !1),
        (Mo = 0),
        (Du.current = null),
        n === null || n.return === null)
      ) {
        (Oe = 1), (Ao = t), (Ne = null);
        break;
      }
      e: {
        var l = e,
          a = n.return,
          i = n,
          u = t;
        if (
          ((t = $e),
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
          var g = _f(a);
          if (g !== null) {
            (g.flags &= -257),
              Of(g, a, i, l, t),
              g.mode & 1 && Rf(l, c, t),
              (t = g),
              (u = c);
            var E = t.updateQueue;
            if (E === null) {
              var x = new Set();
              x.add(u), (t.updateQueue = x);
            } else E.add(u);
            break e;
          } else {
            if ((t & 1) === 0) {
              Rf(l, c, t), Fu();
              break e;
            }
            u = Error(L(426));
          }
        } else if (ge && i.mode & 1) {
          var k = _f(a);
          if (k !== null) {
            (k.flags & 65536) === 0 && (k.flags |= 256),
              Of(k, a, i, l, t),
              Eu(Lr(u, i));
            break e;
          }
        }
        (l = u = Lr(u, i)),
          Oe !== 4 && (Oe = 2),
          yo === null ? (yo = [l]) : yo.push(l),
          (l = a);
        do {
          switch (l.tag) {
            case 3:
              (l.flags |= 65536), (t &= -t), (l.lanes |= t);
              var v = om(l, u, t);
              xf(l, v);
              break e;
            case 1:
              i = u;
              var m = l.type,
                y = l.stateNode;
              if (
                (l.flags & 128) === 0 &&
                (typeof m.getDerivedStateFromError == "function" ||
                  (y !== null &&
                    typeof y.componentDidCatch == "function" &&
                    (Rn === null || !Rn.has(y))))
              ) {
                (l.flags |= 65536), (t &= -t), (l.lanes |= t);
                var w = lm(l, i, t);
                xf(l, w);
                break e;
              }
          }
          l = l.return;
        } while (l !== null);
      }
      Nm(n);
    } catch (N) {
      (t = N), Ne === n && n !== null && (Ne = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Sm() {
  var e = sa.current;
  return (sa.current = aa), e === null ? aa : e;
}
function Fu() {
  (Oe === 0 || Oe === 3 || Oe === 2) && (Oe = 4),
    be === null ||
      ((Xn & 268435455) === 0 && ($a & 268435455) === 0) ||
      gn(be, $e);
}
function ca(e, t) {
  var n = ie;
  ie |= 2;
  var r = Sm();
  (be !== e || $e !== t) && ((Ht = null), Vn(e, t));
  do
    try {
      Gy();
      break;
    } catch (o) {
      wm(e, o);
    }
  while (1);
  if ((Su(), (ie = n), (sa.current = r), Ne !== null)) throw Error(L(261));
  return (be = null), ($e = 0), Oe;
}
function Gy() {
  for (; Ne !== null; ) km(Ne);
}
function Qy() {
  for (; Ne !== null && !xg(); ) km(Ne);
}
function km(e) {
  var t = Rm(e.alternate, e, ot);
  (e.memoizedProps = e.pendingProps),
    t === null ? Nm(e) : (Ne = t),
    (Du.current = null);
}
function Nm(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), (t.flags & 32768) === 0)) {
      if (((n = Fy(n, t, ot)), n !== null)) {
        Ne = n;
        return;
      }
    } else {
      if (((n = By(n, t)), n !== null)) {
        (n.flags &= 32767), (Ne = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (Oe = 6), (Ne = null);
        return;
      }
    }
    if (((t = t.sibling), t !== null)) {
      Ne = t;
      return;
    }
    Ne = t = e;
  } while (t !== null);
  Oe === 0 && (Oe = 5);
}
function Fn(e, t, n) {
  var r = fe,
    o = yt.transition;
  try {
    (yt.transition = null), (fe = 1), qy(e, t, n, r);
  } finally {
    (yt.transition = o), (fe = r);
  }
  return null;
}
function qy(e, t, n, r) {
  do Cr();
  while (En !== null);
  if ((ie & 6) !== 0) throw Error(L(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(L(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var l = n.lanes | n.childLanes;
  if (
    (Pg(e, l),
    e === be && ((Ne = be = null), ($e = 0)),
    ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
      xl ||
      ((xl = !0),
      _m(Vl, function () {
        return Cr(), null;
      })),
    (l = (n.flags & 15990) !== 0),
    (n.subtreeFlags & 15990) !== 0 || l)
  ) {
    (l = yt.transition), (yt.transition = null);
    var a = fe;
    fe = 1;
    var i = ie;
    (ie |= 4),
      (Du.current = null),
      Uy(e, n),
      ym(n, e),
      hy(Js),
      (Gl = !!Xs),
      (Js = Xs = null),
      (e.current = n),
      Hy(n),
      Eg(),
      (ie = i),
      (fe = a),
      (yt.transition = l);
  } else e.current = n;
  if (
    (xl && ((xl = !1), (En = e), (ua = o)),
    (l = e.pendingLanes),
    l === 0 && (Rn = null),
    kg(n.stateNode),
    et(e, ke()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest });
  if (ia) throw ((ia = !1), (e = yi), (yi = null), e);
  return (
    (ua & 1) !== 0 && e.tag !== 0 && Cr(),
    (l = e.pendingLanes),
    (l & 1) !== 0 ? (e === xi ? xo++ : ((xo = 0), (xi = e))) : (xo = 0),
    jn(),
    null
  );
}
function Cr() {
  if (En !== null) {
    var e = rp(ua),
      t = yt.transition,
      n = fe;
    try {
      if (((yt.transition = null), (fe = 16 > e ? 16 : e), En === null))
        var r = !1;
      else {
        if (((e = En), (En = null), (ua = 0), (ie & 6) !== 0))
          throw Error(L(331));
        var o = ie;
        for (ie |= 4, W = e.current; W !== null; ) {
          var l = W,
            a = l.child;
          if ((W.flags & 16) !== 0) {
            var i = l.deletions;
            if (i !== null) {
              for (var u = 0; u < i.length; u++) {
                var c = i[u];
                for (W = c; W !== null; ) {
                  var f = W;
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      go(8, f, l);
                  }
                  var d = f.child;
                  if (d !== null) (d.return = f), (W = d);
                  else
                    for (; W !== null; ) {
                      f = W;
                      var h = f.sibling,
                        g = f.return;
                      if ((hm(f), f === c)) {
                        W = null;
                        break;
                      }
                      if (h !== null) {
                        (h.return = g), (W = h);
                        break;
                      }
                      W = g;
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
              W = l;
            }
          }
          if ((l.subtreeFlags & 2064) !== 0 && a !== null)
            (a.return = l), (W = a);
          else
            e: for (; W !== null; ) {
              if (((l = W), (l.flags & 2048) !== 0))
                switch (l.tag) {
                  case 0:
                  case 11:
                  case 15:
                    go(9, l, l.return);
                }
              var v = l.sibling;
              if (v !== null) {
                (v.return = l.return), (W = v);
                break e;
              }
              W = l.return;
            }
        }
        var m = e.current;
        for (W = m; W !== null; ) {
          a = W;
          var y = a.child;
          if ((a.subtreeFlags & 2064) !== 0 && y !== null)
            (y.return = a), (W = y);
          else
            e: for (a = m; W !== null; ) {
              if (((i = W), (i.flags & 2048) !== 0))
                try {
                  switch (i.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ta(9, i);
                  }
                } catch (N) {
                  we(i, i.return, N);
                }
              if (i === a) {
                W = null;
                break e;
              }
              var w = i.sibling;
              if (w !== null) {
                (w.return = i.return), (W = w);
                break e;
              }
              W = i.return;
            }
        }
        if (
          ((ie = o), jn(), At && typeof At.onPostCommitFiberRoot == "function")
        )
          try {
            At.onPostCommitFiberRoot(ka, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (fe = n), (yt.transition = t);
    }
  }
  return !1;
}
function Bf(e, t, n) {
  (t = Lr(n, t)),
    (t = om(e, t, 1)),
    (e = Cn(e, t, 1)),
    (t = Ke()),
    e !== null && (Ko(e, 1, t), et(e, t));
}
function we(e, t, n) {
  if (e.tag === 3) Bf(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Bf(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Rn === null || !Rn.has(r)))
        ) {
          (e = Lr(n, e)),
            (e = lm(t, e, 1)),
            (t = Cn(t, e, 1)),
            (e = Ke()),
            t !== null && (Ko(t, 1, e), et(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function Yy(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = Ke()),
    (e.pingedLanes |= e.suspendedLanes & n),
    be === e &&
      ($e & n) === n &&
      (Oe === 4 || (Oe === 3 && ($e & 130023424) === $e && 500 > ke() - Iu)
        ? Vn(e, 0)
        : (Mu |= n)),
    et(e, t);
}
function Cm(e, t) {
  t === 0 &&
    ((e.mode & 1) === 0
      ? (t = 1)
      : ((t = ul), (ul <<= 1), (ul & 130023424) === 0 && (ul = 4194304)));
  var n = Ke();
  (e = en(e, t)), e !== null && (Ko(e, t, n), et(e, n));
}
function Xy(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), Cm(e, n);
}
function Jy(e, t) {
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
  r !== null && r.delete(t), Cm(e, n);
}
var Rm;
Rm = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Je.current) Xe = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
        return (Xe = !1), Ay(e, t, n);
      Xe = (e.flags & 131072) !== 0;
    }
  else (Xe = !1), ge && (t.flags & 1048576) !== 0 && Pp(t, ea, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      jl(e, t), (e = t.pendingProps);
      var o = Pr(t, Fe.current);
      Nr(t, n), (o = bu(null, t, r, e, o, n));
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
            Ze(r) ? ((l = !0), Jl(t)) : (l = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            Cu(t),
            (o.updater = Pa),
            (t.stateNode = o),
            (o._reactInternals = t),
            si(t, r, e, n),
            (t = ci(null, t, r, !0, l, n)))
          : ((t.tag = 0), ge && l && yu(t), Ue(null, t, o, n), (t = t.child)),
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
          (o = t.tag = e0(r)),
          (e = _t(r, e)),
          o)
        ) {
          case 0:
            t = ui(null, t, r, e, n);
            break e;
          case 1:
            t = Tf(null, t, r, e, n);
            break e;
          case 11:
            t = Pf(null, t, r, e, n);
            break e;
          case 14:
            t = bf(null, t, r, _t(r.type, e), n);
            break e;
        }
        throw Error(L(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : _t(r, o)),
        ui(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : _t(r, o)),
        Tf(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((um(t), e === null)) throw Error(L(387));
        (r = t.pendingProps),
          (l = t.memoizedState),
          (o = l.element),
          Lp(e, t),
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
            (o = Lr(Error(L(423)), t)), (t = $f(e, t, r, n, o));
            break e;
          } else if (r !== o) {
            (o = Lr(Error(L(424)), t)), (t = $f(e, t, r, n, o));
            break e;
          } else
            for (
              at = Nn(t.stateNode.containerInfo.firstChild),
                it = t,
                ge = !0,
                Pt = null,
                n = Ip(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((br(), r === o)) {
            t = tn(e, t, n);
            break e;
          }
          Ue(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        zp(t),
        e === null && oi(t),
        (r = t.type),
        (o = t.pendingProps),
        (l = e !== null ? e.memoizedProps : null),
        (a = o.children),
        Zs(r, o) ? (a = null) : l !== null && Zs(r, l) && (t.flags |= 32),
        im(e, t),
        Ue(e, t, a, n),
        t.child
      );
    case 6:
      return e === null && oi(t), null;
    case 13:
      return cm(e, t, n);
    case 4:
      return (
        Ru(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Tr(t, null, r, n)) : Ue(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : _t(r, o)),
        Pf(e, t, r, o, n)
      );
    case 7:
      return Ue(e, t, t.pendingProps, n), t.child;
    case 8:
      return Ue(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Ue(e, t, t.pendingProps.children, n), t.child;
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
          if ($t(l.value, a)) {
            if (l.children === o.children && !Je.current) {
              t = tn(e, t, n);
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
                      (u = qt(-1, n & -n)), (u.tag = 2);
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
                      li(l.return, n, t),
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
                  li(a, n, t),
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
        Ue(e, t, o.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        Nr(t, n),
        (o = xt(o)),
        (r = r(o)),
        (t.flags |= 1),
        Ue(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = _t(r, t.pendingProps)),
        (o = _t(r.type, o)),
        bf(e, t, r, o, n)
      );
    case 15:
      return am(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : _t(r, o)),
        jl(e, t),
        (t.tag = 1),
        Ze(r) ? ((e = !0), Jl(t)) : (e = !1),
        Nr(t, n),
        Dp(t, r, o),
        si(t, r, o, n),
        ci(null, t, r, !0, e, n)
      );
    case 19:
      return fm(e, t, n);
    case 22:
      return sm(e, t, n);
  }
  throw Error(L(156, t.tag));
};
function _m(e, t) {
  return Zd(e, t);
}
function Zy(e, t, n, r) {
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
function vt(e, t, n, r) {
  return new Zy(e, t, n, r);
}
function Bu(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function e0(e) {
  if (typeof e == "function") return Bu(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === au)) return 11;
    if (e === su) return 14;
  }
  return 2;
}
function On(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = vt(e.tag, t, e.key, e.mode)),
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
  if (((r = e), typeof e == "function")) Bu(e) && (a = 1);
  else if (typeof e == "string") a = 5;
  else
    e: switch (e) {
      case ur:
        return Kn(n.children, o, l, t);
      case lu:
        (a = 8), (o |= 8);
        break;
      case Ts:
        return (
          (e = vt(12, n, t, o | 2)), (e.elementType = Ts), (e.lanes = l), e
        );
      case $s:
        return (e = vt(13, n, t, o)), (e.elementType = $s), (e.lanes = l), e;
      case Ls:
        return (e = vt(19, n, t, o)), (e.elementType = Ls), (e.lanes = l), e;
      case Md:
        return La(n, o, l, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case jd:
              a = 10;
              break e;
            case Dd:
              a = 9;
              break e;
            case au:
              a = 11;
              break e;
            case su:
              a = 14;
              break e;
            case pn:
              (a = 16), (r = null);
              break e;
          }
        throw Error(L(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = vt(a, n, t, o)), (t.elementType = e), (t.type = r), (t.lanes = l), t
  );
}
function Kn(e, t, n, r) {
  return (e = vt(7, e, r, t)), (e.lanes = n), e;
}
function La(e, t, n, r) {
  return (
    (e = vt(22, e, r, t)),
    (e.elementType = Md),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function xs(e, t, n) {
  return (e = vt(6, e, null, t)), (e.lanes = n), e;
}
function Es(e, t, n) {
  return (
    (t = vt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function t0(e, t, n, r, o) {
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
    (this.eventTimes = es(0)),
    (this.expirationTimes = es(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = es(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null);
}
function Wu(e, t, n, r, o, l, a, i, u) {
  return (
    (e = new t0(e, t, n, i, u)),
    t === 1 ? ((t = 1), l === !0 && (t |= 8)) : (t = 0),
    (l = vt(3, null, null, t)),
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
function n0(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: ir,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Om(e) {
  if (!e) return bn;
  e = e._reactInternals;
  e: {
    if (tr(e) !== e || e.tag !== 1) throw Error(L(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Ze(t.type)) {
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
    if (Ze(n)) return _p(e, n, t);
  }
  return t;
}
function Pm(e, t, n, r, o, l, a, i, u) {
  return (
    (e = Wu(n, r, !0, e, o, l, a, i, u)),
    (e.context = Om(null)),
    (n = e.current),
    (r = Ke()),
    (o = _n(n)),
    (l = qt(r, o)),
    (l.callback = t != null ? t : null),
    Cn(n, l, o),
    (e.current.lanes = o),
    Ko(e, o, r),
    et(e, r),
    e
  );
}
function ja(e, t, n, r) {
  var o = t.current,
    l = Ke(),
    a = _n(o);
  return (
    (n = Om(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = qt(l, a)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = Cn(o, t, a)),
    e !== null && (Tt(e, o, a, l), Tl(e, o, a)),
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
function Wf(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Uu(e, t) {
  Wf(e, t), (e = e.alternate) && Wf(e, t);
}
function r0() {
  return null;
}
var bm =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Hu(e) {
  this._internalRoot = e;
}
Da.prototype.render = Hu.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(L(409));
  ja(e, t, null, null);
};
Da.prototype.unmount = Hu.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Jn(function () {
      ja(null, e, null, null);
    }),
      (t[Zt] = null);
  }
};
function Da(e) {
  this._internalRoot = e;
}
Da.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = ap();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < vn.length && t !== 0 && t < vn[n].priority; n++);
    vn.splice(n, 0, e), n === 0 && ip(e);
  }
};
function Vu(e) {
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
function Uf() {}
function o0(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var l = r;
      r = function () {
        var c = fa(a);
        l.call(c);
      };
    }
    var a = Pm(t, r, e, 0, null, !1, !1, "", Uf);
    return (
      (e._reactRootContainer = a),
      (e[Zt] = a.current),
      To(e.nodeType === 8 ? e.parentNode : e),
      Jn(),
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
  var u = Wu(e, 0, !1, null, null, !1, !1, "", Uf);
  return (
    (e._reactRootContainer = u),
    (e[Zt] = u.current),
    To(e.nodeType === 8 ? e.parentNode : e),
    Jn(function () {
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
  } else a = o0(n, t, e, o, r);
  return fa(a);
}
op = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = so(t.pendingLanes);
        n !== 0 &&
          (cu(t, n | 1),
          et(t, ke()),
          (ie & 6) === 0 && ((jr = ke() + 500), jn()));
      }
      break;
    case 13:
      Jn(function () {
        var r = en(e, 1);
        if (r !== null) {
          var o = Ke();
          Tt(r, e, 1, o);
        }
      }),
        Uu(e, 1);
  }
};
fu = function (e) {
  if (e.tag === 13) {
    var t = en(e, 134217728);
    if (t !== null) {
      var n = Ke();
      Tt(t, e, 134217728, n);
    }
    Uu(e, 134217728);
  }
};
lp = function (e) {
  if (e.tag === 13) {
    var t = _n(e),
      n = en(e, t);
    if (n !== null) {
      var r = Ke();
      Tt(n, e, t, r);
    }
    Uu(e, t);
  }
};
ap = function () {
  return fe;
};
sp = function (e, t) {
  var n = fe;
  try {
    return (fe = e), t();
  } finally {
    fe = n;
  }
};
Us = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Ms(e, n), (t = n.name), n.type === "radio" && t != null)) {
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
            var o = _a(r);
            if (!o) throw Error(L(90));
            zd(r), Ms(r, o);
          }
        }
      }
      break;
    case "textarea":
      Fd(e, n);
      break;
    case "select":
      (t = n.value), t != null && Er(e, !!n.multiple, t, !1);
  }
};
Gd = zu;
Qd = Jn;
var l0 = { usingClientEntryPoint: !1, Events: [Qo, pr, _a, Vd, Kd, zu] },
  to = {
    findFiberByHostInstance: Bn,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  a0 = {
    bundleType: to.bundleType,
    version: to.version,
    rendererPackageName: to.rendererPackageName,
    rendererConfig: to.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: ln.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Xd(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: to.findFiberByHostInstance || r0,
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
      (ka = El.inject(a0)), (At = El);
    } catch {}
}
ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = l0;
ct.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Vu(t)) throw Error(L(200));
  return n0(e, t, null, n);
};
ct.createRoot = function (e, t) {
  if (!Vu(e)) throw Error(L(299));
  var n = !1,
    r = "",
    o = bm;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = Wu(e, 1, !1, null, null, n, !1, r, o)),
    (e[Zt] = t.current),
    To(e.nodeType === 8 ? e.parentNode : e),
    new Hu(t)
  );
};
ct.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(L(188))
      : ((e = Object.keys(e).join(",")), Error(L(268, e)));
  return (e = Xd(t)), (e = e === null ? null : e.stateNode), e;
};
ct.flushSync = function (e) {
  return Jn(e);
};
ct.hydrate = function (e, t, n) {
  if (!Ma(t)) throw Error(L(200));
  return Ia(null, e, t, !0, n);
};
ct.hydrateRoot = function (e, t, n) {
  if (!Vu(e)) throw Error(L(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    l = "",
    a = bm;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (l = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (a = n.onRecoverableError)),
    (t = Pm(t, null, e, 1, n != null ? n : null, o, !1, l, a)),
    (e[Zt] = t.current),
    To(e),
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
ct.render = function (e, t, n) {
  if (!Ma(t)) throw Error(L(200));
  return Ia(null, e, t, !1, n);
};
ct.unmountComponentAtNode = function (e) {
  if (!Ma(e)) throw Error(L(40));
  return e._reactRootContainer
    ? (Jn(function () {
        Ia(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Zt] = null);
        });
      }),
      !0)
    : !1;
};
ct.unstable_batchedUpdates = zu;
ct.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ma(n)) throw Error(L(200));
  if (e == null || e._reactInternals === void 0) throw Error(L(38));
  return Ia(e, t, n, !1, r);
};
ct.version = "18.2.0-next-9e3b772b8-20220608";
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
  t(), (e.exports = ct);
})(tu);
const Hn = Sd(tu.exports);
var Tm,
  Hf = tu.exports;
(Tm = Hf.createRoot), Hf.hydrateRoot;
const s0 = "modulepreload",
  i0 = function (e) {
    return "/" + e;
  },
  Vf = {},
  u0 = function (t, n, r) {
    if (!n || n.length === 0) return t();
    const o = document.getElementsByTagName("link");
    return Promise.all(
      n.map((l) => {
        if (((l = i0(l)), l in Vf)) return;
        Vf[l] = !0;
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
          ((c.rel = a ? "stylesheet" : s0),
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
var Kf = "popstate";
function c0(e = {}) {
  function t(r, o) {
    let { pathname: l, search: a, hash: i } = r.location;
    return Si(
      "",
      { pathname: l, search: a, hash: i },
      (o.state && o.state.usr) || null,
      (o.state && o.state.key) || "default",
    );
  }
  function n(r, o) {
    return typeof o == "string" ? o : Fo(o);
  }
  return d0(t, n, null, e);
}
function Ce(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function wt(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function f0() {
  return Math.random().toString(36).substring(2, 10);
}
function Gf(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function Si(e, t, n = null, r) {
  return {
    pathname: typeof e == "string" ? e : e.pathname,
    search: "",
    hash: "",
    ...(typeof t == "string" ? Ur(t) : t),
    state: n,
    key: (t && t.key) || r || f0(),
  };
}
function Fo({ pathname: e = "/", search: t = "", hash: n = "" }) {
  return (
    t && t !== "?" && (e += t.charAt(0) === "?" ? t : "?" + t),
    n && n !== "#" && (e += n.charAt(0) === "#" ? n : "#" + n),
    e
  );
}
function Ur(e) {
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
function d0(e, t, n, r = {}) {
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
    let m = Si(x.location, k, v);
    n && n(m, k), (c = f() + 1);
    let y = Gf(m, c),
      w = x.createHref(m);
    try {
      a.pushState(y, "", w);
    } catch (N) {
      if (N instanceof DOMException && N.name === "DataCloneError") throw N;
      o.location.assign(w);
    }
    l && u && u({ action: i, location: x.location, delta: 1 });
  }
  function g(k, v) {
    i = "REPLACE";
    let m = Si(x.location, k, v);
    n && n(m, k), (c = f());
    let y = Gf(m, c),
      w = x.createHref(m);
    a.replaceState(y, "", w),
      l && u && u({ action: i, location: x.location, delta: 0 });
  }
  function E(k) {
    return p0(k);
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
        o.addEventListener(Kf, d),
        (u = k),
        () => {
          o.removeEventListener(Kf, d), (u = null);
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
    replace: g,
    go(k) {
      return a.go(k);
    },
  };
  return x;
}
function p0(e, t = !1) {
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
function $m(e, t, n = "/") {
  return m0(e, t, n, !1);
}
function m0(e, t, n, r) {
  let o = typeof t == "string" ? Ur(t) : t,
    l = nn(o.pathname || "/", n);
  if (l == null) return null;
  let a = Lm(e);
  h0(a);
  let i = null;
  for (let u = 0; i == null && u < a.length; ++u) {
    let c = R0(l);
    i = N0(a[u], c, r);
  }
  return i;
}
function Lm(e, t = [], n = [], r = "", o = !1) {
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
    let d = Yt([r, f.relativePath]),
      h = n.concat(f);
    a.children &&
      a.children.length > 0 &&
      (Ce(
        a.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${d}".`,
      ),
      Lm(a.children, t, h, d, u)),
      !(a.path == null && !a.index) &&
        t.push({ path: d, score: S0(d, a.index), routesMeta: h });
  };
  return (
    e.forEach((a, i) => {
      var u;
      if (a.path === "" || !((u = a.path) != null && u.includes("?"))) l(a, i);
      else for (let c of jm(a.path)) l(a, i, !0, c);
    }),
    t
  );
}
function jm(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    o = n.endsWith("?"),
    l = n.replace(/\?$/, "");
  if (r.length === 0) return o ? [l, ""] : [l];
  let a = jm(r.join("/")),
    i = [];
  return (
    i.push(...a.map((u) => (u === "" ? l : [l, u].join("/")))),
    o && i.push(...a),
    i.map((u) => (e.startsWith("/") && u === "" ? "/" : u))
  );
}
function h0(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : k0(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
var v0 = /^:[\w-]+$/,
  g0 = 3,
  y0 = 2,
  x0 = 1,
  E0 = 10,
  w0 = -2,
  Qf = (e) => e === "*";
function S0(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(Qf) && (r += w0),
    t && (r += y0),
    n
      .filter((o) => !Qf(o))
      .reduce((o, l) => o + (v0.test(l) ? g0 : l === "" ? x0 : E0), r)
  );
}
function k0(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, o) => r === t[o])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function N0(e, t, n = !1) {
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
        pathname: Yt([l, d.pathname]),
        pathnameBase: b0(Yt([l, d.pathnameBase])),
        route: h,
      }),
      d.pathnameBase !== "/" && (l = Yt([l, d.pathnameBase]));
  }
  return a;
}
function da(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = C0(e.path, e.caseSensitive, e.end),
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
      const g = i[h];
      return (
        d && !g ? (c[f] = void 0) : (c[f] = (g || "").replace(/%2F/g, "/")), c
      );
    }, {}),
    pathname: l,
    pathnameBase: a,
    pattern: e,
  };
}
function C0(e, t = !1, n = !0) {
  wt(
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
function R0(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      wt(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`,
      ),
      e
    );
  }
}
function nn(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
var Dm = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  _0 = (e) => Dm.test(e);
function O0(e, t = "/") {
  let {
      pathname: n,
      search: r = "",
      hash: o = "",
    } = typeof e == "string" ? Ur(e) : e,
    l;
  if (n)
    if (_0(n)) l = n;
    else {
      if (n.includes("//")) {
        let a = n;
        (n = n.replace(/\/\/+/g, "/")),
          wt(
            !1,
            `Pathnames cannot have embedded double slashes - normalizing ${a} -> ${n}`,
          );
      }
      n.startsWith("/") ? (l = qf(n.substring(1), "/")) : (l = qf(n, t));
    }
  else l = t;
  return { pathname: l, search: T0(r), hash: $0(o) };
}
function qf(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((o) => {
      o === ".." ? n.length > 1 && n.pop() : o !== "." && n.push(o);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function ws(e, t, n, r) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(
    r,
  )}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function P0(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function Mm(e) {
  let t = P0(e);
  return t.map((n, r) => (r === t.length - 1 ? n.pathname : n.pathnameBase));
}
function Im(e, t, n, r = !1) {
  let o;
  typeof e == "string"
    ? (o = Ur(e))
    : ((o = { ...e }),
      Ce(
        !o.pathname || !o.pathname.includes("?"),
        ws("?", "pathname", "search", o),
      ),
      Ce(
        !o.pathname || !o.pathname.includes("#"),
        ws("#", "pathname", "hash", o),
      ),
      Ce(!o.search || !o.search.includes("#"), ws("#", "search", "hash", o)));
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
  let u = O0(o, i),
    c = a && a !== "/" && a.endsWith("/"),
    f = (l || a === ".") && n.endsWith("/");
  return !u.pathname.endsWith("/") && (c || f) && (u.pathname += "/"), u;
}
var Yt = (e) => e.join("/").replace(/\/\/+/g, "/"),
  b0 = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  T0 = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  $0 = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e),
  L0 = class {
    constructor(e, t, n, r = !1) {
      (this.status = e),
        (this.statusText = t || ""),
        (this.internal = r),
        n instanceof Error
          ? ((this.data = n.toString()), (this.error = n))
          : (this.data = n);
    }
  };
function j0(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
function D0(e) {
  return (
    e
      .map((t) => t.route.path)
      .filter(Boolean)
      .join("/")
      .replace(/\/\/*/g, "/") || "/"
  );
}
var zm =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
function Am(e, t) {
  let n = e;
  if (typeof n != "string" || !Dm.test(n))
    return { absoluteURL: void 0, isExternal: !1, to: n };
  let r = n,
    o = !1;
  if (zm)
    try {
      let l = new URL(window.location.href),
        a = n.startsWith("//") ? new URL(l.protocol + n) : new URL(n),
        i = nn(a.pathname, t);
      a.origin === l.origin && i != null
        ? (n = i + a.search + a.hash)
        : (o = !0);
    } catch {
      wt(
        !1,
        `<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: r, isExternal: o, to: n };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var M0 = ["POST", "PUT", "PATCH", "DELETE"];
[...M0];
var Hr = p.exports.createContext(null);
Hr.displayName = "DataRouter";
var za = p.exports.createContext(null);
za.displayName = "DataRouterState";
var I0 = p.exports.createContext(!1),
  Fm = p.exports.createContext({ isTransitioning: !1 });
Fm.displayName = "ViewTransition";
var z0 = p.exports.createContext(new Map());
z0.displayName = "Fetchers";
var A0 = p.exports.createContext(null);
A0.displayName = "Await";
var Nt = p.exports.createContext(null);
Nt.displayName = "Navigation";
var Yo = p.exports.createContext(null);
Yo.displayName = "Location";
var an = p.exports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1,
});
an.displayName = "Route";
var Ku = p.exports.createContext(null);
Ku.displayName = "RouteError";
var Bm = "REACT_ROUTER_ERROR",
  F0 = "REDIRECT",
  B0 = "ROUTE_ERROR_RESPONSE";
function W0(e) {
  if (e.startsWith(`${Bm}:${F0}:{`))
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
function U0(e) {
  if (e.startsWith(`${Bm}:${B0}:{`))
    try {
      let t = JSON.parse(e.slice(40));
      if (
        typeof t == "object" &&
        t &&
        typeof t.status == "number" &&
        typeof t.statusText == "string"
      )
        return new L0(t.status, t.statusText, t.data);
    } catch {}
}
function H0(e, { relative: t } = {}) {
  Ce(
    Xo(),
    "useHref() may be used only in the context of a <Router> component.",
  );
  let { basename: n, navigator: r } = p.exports.useContext(Nt),
    { hash: o, pathname: l, search: a } = Jo(e, { relative: t }),
    i = l;
  return (
    n !== "/" && (i = l === "/" ? n : Yt([n, l])),
    r.createHref({ pathname: i, search: a, hash: o })
  );
}
function Xo() {
  return p.exports.useContext(Yo) != null;
}
function sn() {
  return (
    Ce(
      Xo(),
      "useLocation() may be used only in the context of a <Router> component.",
    ),
    p.exports.useContext(Yo).location
  );
}
var Wm =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Um(e) {
  p.exports.useContext(Nt).static || p.exports.useLayoutEffect(e);
}
function Aa() {
  let { isDataRoute: e } = p.exports.useContext(an);
  return e ? r1() : V0();
}
function V0() {
  Ce(
    Xo(),
    "useNavigate() may be used only in the context of a <Router> component.",
  );
  let e = p.exports.useContext(Hr),
    { basename: t, navigator: n } = p.exports.useContext(Nt),
    { matches: r } = p.exports.useContext(an),
    { pathname: o } = sn(),
    l = JSON.stringify(Mm(r)),
    a = p.exports.useRef(!1);
  return (
    Um(() => {
      a.current = !0;
    }),
    p.exports.useCallback(
      (u, c = {}) => {
        if ((wt(a.current, Wm), !a.current)) return;
        if (typeof u == "number") {
          n.go(u);
          return;
        }
        let f = Im(u, JSON.parse(l), o, c.relative === "path");
        e == null &&
          t !== "/" &&
          (f.pathname = f.pathname === "/" ? t : Yt([t, f.pathname])),
          (c.replace ? n.replace : n.push)(f, c.state, c);
      },
      [t, n, l, o, e],
    )
  );
}
p.exports.createContext(null);
function Jo(e, { relative: t } = {}) {
  let { matches: n } = p.exports.useContext(an),
    { pathname: r } = sn(),
    o = JSON.stringify(Mm(n));
  return p.exports.useMemo(
    () => Im(e, JSON.parse(o), r, t === "path"),
    [e, o, r, t],
  );
}
function K0(e, t, n, r, o) {
  var m;
  Ce(
    Xo(),
    "useRoutes() may be used only in the context of a <Router> component.",
  );
  let { navigator: l } = p.exports.useContext(Nt),
    { matches: a } = p.exports.useContext(an),
    i = a[a.length - 1],
    u = i ? i.params : {},
    c = i ? i.pathname : "/",
    f = i ? i.pathnameBase : "/",
    d = i && i.route;
  {
    let y = (d && d.path) || "";
    Vm(
      c,
      !d || y.endsWith("*") || y.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${c}" (under <Route path="${y}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${y}"> to <Route path="${
        y === "/" ? "*" : `${y}/*`
      }">.`,
    );
  }
  let h = sn(),
    g;
  if (t) {
    let y = typeof t == "string" ? Ur(t) : t;
    Ce(
      f === "/" || ((m = y.pathname) == null ? void 0 : m.startsWith(f)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${y.pathname}" was given in the \`location\` prop.`,
    ),
      (g = y);
  } else g = h;
  let E = g.pathname || "/",
    x = E;
  if (f !== "/") {
    let y = f.replace(/^\//, "").split("/");
    x = "/" + E.replace(/^\//, "").split("/").slice(y.length).join("/");
  }
  let k = $m(e, { pathname: x });
  wt(
    d || k != null,
    `No routes matched location "${g.pathname}${g.search}${g.hash}" `,
  ),
    wt(
      k == null ||
        k[k.length - 1].route.element !== void 0 ||
        k[k.length - 1].route.Component !== void 0 ||
        k[k.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    );
  let v = X0(
    k &&
      k.map((y) =>
        Object.assign({}, y, {
          params: Object.assign({}, u, y.params),
          pathname: Yt([
            f,
            l.encodeLocation
              ? l.encodeLocation(
                  y.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23"),
                ).pathname
              : y.pathname,
          ]),
          pathnameBase:
            y.pathnameBase === "/"
              ? f
              : Yt([
                  f,
                  l.encodeLocation
                    ? l.encodeLocation(
                        y.pathnameBase
                          .replace(/\?/g, "%3F")
                          .replace(/#/g, "%23"),
                      ).pathname
                    : y.pathnameBase,
                ]),
        }),
      ),
    a,
    n,
    r,
    o,
  );
  return t && v
    ? p.exports.createElement(
        Yo.Provider,
        {
          value: {
            location: {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
              ...g,
            },
            navigationType: "POP",
          },
        },
        v,
      )
    : v;
}
function G0() {
  let e = n1(),
    t = j0(e)
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
    (a = p.exports.createElement(
      p.exports.Fragment,
      null,
      p.exports.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"),
      p.exports.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        p.exports.createElement("code", { style: l }, "ErrorBoundary"),
        " or",
        " ",
        p.exports.createElement("code", { style: l }, "errorElement"),
        " prop on your route.",
      ),
    )),
    p.exports.createElement(
      p.exports.Fragment,
      null,
      p.exports.createElement("h2", null, "Unexpected Application Error!"),
      p.exports.createElement("h3", { style: { fontStyle: "italic" } }, t),
      n ? p.exports.createElement("pre", { style: o }, n) : null,
      a,
    )
  );
}
var Q0 = p.exports.createElement(G0, null),
  Hm = class extends p.exports.Component {
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
        const n = U0(e.digest);
        n && (e = n);
      }
      let t =
        e !== void 0
          ? p.exports.createElement(
              an.Provider,
              { value: this.props.routeContext },
              p.exports.createElement(Ku.Provider, {
                value: e,
                children: this.props.component,
              }),
            )
          : this.props.children;
      return this.context ? p.exports.createElement(q0, { error: e }, t) : t;
    }
  };
Hm.contextType = I0;
var Ss = new WeakMap();
function q0({ children: e, error: t }) {
  let { basename: n } = p.exports.useContext(Nt);
  if (
    typeof t == "object" &&
    t &&
    "digest" in t &&
    typeof t.digest == "string"
  ) {
    let r = W0(t.digest);
    if (r) {
      let o = Ss.get(t);
      if (o) throw o;
      let l = Am(r.location, n);
      if (zm && !Ss.get(t))
        if (l.isExternal || r.reloadDocument)
          window.location.href = l.absoluteURL || l.to;
        else {
          const a = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(l.to, {
              replace: r.replace,
            }),
          );
          throw (Ss.set(t, a), a);
        }
      return p.exports.createElement("meta", {
        httpEquiv: "refresh",
        content: `0;url=${l.absoluteURL || l.to}`,
      });
    }
  }
  return e;
}
function Y0({ routeContext: e, match: t, children: n }) {
  let r = p.exports.useContext(Hr);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = t.route.id),
    p.exports.createElement(an.Provider, { value: e }, n)
  );
}
function X0(e, t = [], n = null, r = null, o = null) {
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
        let { loaderData: h, errors: g } = n,
          E =
            d.route.loader &&
            !h.hasOwnProperty(d.route.id) &&
            (!g || g[d.route.id] === void 0);
        if (d.route.lazy || E) {
          (i = !0), u >= 0 ? (l = l.slice(0, u + 1)) : (l = [l[0]]);
          break;
        }
      }
    }
  let c =
    n && r
      ? (f, d) => {
          var h, g, E;
          r(f, {
            location: n.location,
            params:
              (E =
                (g = (h = n.matches) == null ? void 0 : h[0]) == null
                  ? void 0
                  : g.params) != null
                ? E
                : {},
            unstable_pattern: D0(n.matches),
            errorInfo: d,
          });
        }
      : void 0;
  return l.reduceRight((f, d, h) => {
    let g,
      E = !1,
      x = null,
      k = null;
    n &&
      ((g = a && d.route.id ? a[d.route.id] : void 0),
      (x = d.route.errorElement || Q0),
      i &&
        (u < 0 && h === 0
          ? (Vm(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (E = !0),
            (k = null))
          : u === h &&
            ((E = !0), (k = d.route.hydrateFallbackElement || null))));
    let v = t.concat(l.slice(0, h + 1)),
      m = () => {
        let y;
        return (
          g
            ? (y = x)
            : E
              ? (y = k)
              : d.route.Component
                ? (y = p.exports.createElement(d.route.Component, null))
                : d.route.element
                  ? (y = d.route.element)
                  : (y = f),
          p.exports.createElement(Y0, {
            match: d,
            routeContext: { outlet: f, matches: v, isDataRoute: n != null },
            children: y,
          })
        );
      };
    return n && (d.route.ErrorBoundary || d.route.errorElement || h === 0)
      ? p.exports.createElement(Hm, {
          location: n.location,
          revalidation: n.revalidation,
          component: x,
          error: g,
          children: m(),
          routeContext: { outlet: null, matches: v, isDataRoute: !0 },
          onError: c,
        })
      : m();
  }, null);
}
function Gu(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function J0(e) {
  let t = p.exports.useContext(Hr);
  return Ce(t, Gu(e)), t;
}
function Z0(e) {
  let t = p.exports.useContext(za);
  return Ce(t, Gu(e)), t;
}
function e1(e) {
  let t = p.exports.useContext(an);
  return Ce(t, Gu(e)), t;
}
function Qu(e) {
  let t = e1(e),
    n = t.matches[t.matches.length - 1];
  return (
    Ce(
      n.route.id,
      `${e} can only be used on routes that contain a unique "id"`,
    ),
    n.route.id
  );
}
function t1() {
  return Qu("useRouteId");
}
function n1() {
  var r;
  let e = p.exports.useContext(Ku),
    t = Z0("useRouteError"),
    n = Qu("useRouteError");
  return e !== void 0 ? e : (r = t.errors) == null ? void 0 : r[n];
}
function r1() {
  let { router: e } = J0("useNavigate"),
    t = Qu("useNavigate"),
    n = p.exports.useRef(!1);
  return (
    Um(() => {
      n.current = !0;
    }),
    p.exports.useCallback(
      async (o, l = {}) => {
        wt(n.current, Wm),
          n.current &&
            (typeof o == "number"
              ? await e.navigate(o)
              : await e.navigate(o, { fromRouteId: t, ...l }));
      },
      [e, t],
    )
  );
}
var Yf = {};
function Vm(e, t, n) {
  !t && !Yf[e] && ((Yf[e] = !0), wt(!1, n));
}
var o1 = "useOptimistic";
og[o1];
p.exports.memo(l1);
function l1({ routes: e, future: t, state: n, onError: r }) {
  return K0(e, void 0, n, r, t);
}
function a1({
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
    u = p.exports.useMemo(
      () => ({
        basename: i,
        navigator: o,
        static: l,
        unstable_useTransitions: a,
        future: {},
      }),
      [i, o, l, a],
    );
  typeof n == "string" && (n = Ur(n));
  let {
      pathname: c = "/",
      search: f = "",
      hash: d = "",
      state: h = null,
      key: g = "default",
    } = n,
    E = p.exports.useMemo(() => {
      let x = nn(c, i);
      return x == null
        ? null
        : {
            location: { pathname: x, search: f, hash: d, state: h, key: g },
            navigationType: r,
          };
    }, [i, c, f, d, h, g, r]);
  return (
    wt(
      E != null,
      `<Router basename="${i}"> is not able to match the URL "${c}${f}${d}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    E == null
      ? null
      : p.exports.createElement(
          Nt.Provider,
          { value: u },
          p.exports.createElement(Yo.Provider, { children: t, value: E }),
        )
  );
}
var zl = "get",
  Al = "application/x-www-form-urlencoded";
function Fa(e) {
  return typeof HTMLElement < "u" && e instanceof HTMLElement;
}
function s1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "button";
}
function i1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "form";
}
function u1(e) {
  return Fa(e) && e.tagName.toLowerCase() === "input";
}
function c1(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function f1(e, t) {
  return e.button === 0 && (!t || t === "_self") && !c1(e);
}
function ki(e = "") {
  return new URLSearchParams(
    typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams
      ? e
      : Object.keys(e).reduce((t, n) => {
          let r = e[n];
          return t.concat(Array.isArray(r) ? r.map((o) => [n, o]) : [[n, r]]);
        }, []),
  );
}
function d1(e, t) {
  let n = ki(e);
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
function p1() {
  if (wl === null)
    try {
      new FormData(document.createElement("form"), 0), (wl = !1);
    } catch {
      wl = !0;
    }
  return wl;
}
var m1 = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function ks(e) {
  return e != null && !m1.has(e)
    ? (wt(
        !1,
        `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Al}"`,
      ),
      null)
    : e;
}
function h1(e, t) {
  let n, r, o, l, a;
  if (i1(e)) {
    let i = e.getAttribute("action");
    (r = i ? nn(i, t) : null),
      (n = e.getAttribute("method") || zl),
      (o = ks(e.getAttribute("enctype")) || Al),
      (l = new FormData(e));
  } else if (s1(e) || (u1(e) && (e.type === "submit" || e.type === "image"))) {
    let i = e.form;
    if (i == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>',
      );
    let u = e.getAttribute("formaction") || i.getAttribute("action");
    if (
      ((r = u ? nn(u, t) : null),
      (n = e.getAttribute("formmethod") || i.getAttribute("method") || zl),
      (o =
        ks(e.getAttribute("formenctype")) ||
        ks(i.getAttribute("enctype")) ||
        Al),
      (l = new FormData(i, e)),
      !p1())
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
function qu(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function v1(e, t, n, r) {
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
        : t && nn(o.pathname, t) === "/"
          ? (o.pathname = `${t.replace(/\/$/, "")}/_root.${r}`)
          : (o.pathname = `${o.pathname.replace(/\/$/, "")}.${r}`),
    o
  );
}
async function g1(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let n = await u0(() => import(e.module), []);
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
function y1(e) {
  return e != null && typeof e.page == "string";
}
function x1(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === "preload" &&
        typeof e.imageSrcSet == "string" &&
        typeof e.imageSizes == "string"
      : typeof e.rel == "string" && typeof e.href == "string";
}
async function E1(e, t, n) {
  let r = await Promise.all(
    e.map(async (o) => {
      let l = t.routes[o.route.id];
      if (l) {
        let a = await g1(l, n);
        return a.links ? a.links() : [];
      }
      return [];
    }),
  );
  return N1(
    r
      .flat(1)
      .filter(x1)
      .filter((o) => o.rel === "stylesheet" || o.rel === "preload")
      .map((o) =>
        o.rel === "stylesheet"
          ? { ...o, rel: "prefetch", as: "style" }
          : { ...o, rel: "prefetch" },
      ),
  );
}
function Xf(e, t, n, r, o, l) {
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
function w1(e, t, { includeHydrateFallback: n } = {}) {
  return S1(
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
function S1(e) {
  return [...new Set(e)];
}
function k1(e) {
  let t = {},
    n = Object.keys(e).sort();
  for (let r of n) t[r] = e[r];
  return t;
}
function N1(e, t) {
  let n = new Set(),
    r = new Set(t);
  return e.reduce((o, l) => {
    if (t && !y1(l) && l.as === "script" && l.href && r.has(l.href)) return o;
    let i = JSON.stringify(k1(l));
    return n.has(i) || (n.add(i), o.push({ key: i, link: l })), o;
  }, []);
}
function Km() {
  let e = p.exports.useContext(Hr);
  return (
    qu(
      e,
      "You must render this element inside a <DataRouterContext.Provider> element",
    ),
    e
  );
}
function C1() {
  let e = p.exports.useContext(za);
  return (
    qu(
      e,
      "You must render this element inside a <DataRouterStateContext.Provider> element",
    ),
    e
  );
}
var Yu = p.exports.createContext(void 0);
Yu.displayName = "FrameworkContext";
function Gm() {
  let e = p.exports.useContext(Yu);
  return (
    qu(e, "You must render this element inside a <HydratedRouter> element"), e
  );
}
function R1(e, t) {
  let n = p.exports.useContext(Yu),
    [r, o] = p.exports.useState(!1),
    [l, a] = p.exports.useState(!1),
    {
      onFocus: i,
      onBlur: u,
      onMouseEnter: c,
      onMouseLeave: f,
      onTouchStart: d,
    } = t,
    h = p.exports.useRef(null);
  p.exports.useEffect(() => {
    if ((e === "render" && a(!0), e === "viewport")) {
      let x = (v) => {
          v.forEach((m) => {
            a(m.isIntersecting);
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
    p.exports.useEffect(() => {
      if (r) {
        let x = setTimeout(() => {
          a(!0);
        }, 100);
        return () => {
          clearTimeout(x);
        };
      }
    }, [r]);
  let g = () => {
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
            onFocus: no(i, g),
            onBlur: no(u, E),
            onMouseEnter: no(c, g),
            onMouseLeave: no(f, E),
            onTouchStart: no(d, g),
          },
        ]
    : [!1, h, {}];
}
function no(e, t) {
  return (n) => {
    e && e(n), n.defaultPrevented || t(n);
  };
}
function _1({ page: e, ...t }) {
  let { router: n } = Km(),
    r = p.exports.useMemo(
      () => $m(n.routes, e, n.basename),
      [n.routes, e, n.basename],
    );
  return r ? p.exports.createElement(P1, { page: e, matches: r, ...t }) : null;
}
function O1(e) {
  let { manifest: t, routeModules: n } = Gm(),
    [r, o] = p.exports.useState([]);
  return (
    p.exports.useEffect(() => {
      let l = !1;
      return (
        E1(e, t, n).then((a) => {
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
function P1({ page: e, matches: t, ...n }) {
  let r = sn(),
    { future: o, manifest: l, routeModules: a } = Gm(),
    { basename: i } = Km(),
    { loaderData: u, matches: c } = C1(),
    f = p.exports.useMemo(() => Xf(e, t, c, l, r, "data"), [e, t, c, l, r]),
    d = p.exports.useMemo(() => Xf(e, t, c, l, r, "assets"), [e, t, c, l, r]),
    h = p.exports.useMemo(() => {
      if (e === r.pathname + r.search + r.hash) return [];
      let x = new Set(),
        k = !1;
      if (
        (t.forEach((m) => {
          var w;
          let y = l.routes[m.route.id];
          !y ||
            !y.hasLoader ||
            ((!f.some((N) => N.route.id === m.route.id) &&
              m.route.id in u &&
              ((w = a[m.route.id]) == null ? void 0 : w.shouldRevalidate)) ||
            y.hasClientLoader
              ? (k = !0)
              : x.add(m.route.id));
        }),
        x.size === 0)
      )
        return [];
      let v = v1(e, i, o.unstable_trailingSlashAwareDataRequests, "data");
      return (
        k &&
          x.size > 0 &&
          v.searchParams.set(
            "_routes",
            t
              .filter((m) => x.has(m.route.id))
              .map((m) => m.route.id)
              .join(","),
          ),
        [v.pathname + v.search]
      );
    }, [i, o.unstable_trailingSlashAwareDataRequests, u, r, l, f, t, e, a]),
    g = p.exports.useMemo(() => w1(d, l), [d, l]),
    E = O1(d);
  return p.exports.createElement(
    p.exports.Fragment,
    null,
    h.map((x) =>
      p.exports.createElement("link", {
        key: x,
        rel: "prefetch",
        as: "fetch",
        href: x,
        ...n,
      }),
    ),
    g.map((x) =>
      p.exports.createElement("link", {
        key: x,
        rel: "modulepreload",
        href: x,
        ...n,
      }),
    ),
    E.map(({ key: x, link: k }) =>
      p.exports.createElement("link", { key: x, nonce: n.nonce, ...k }),
    ),
  );
}
function b1(...e) {
  return (t) => {
    e.forEach((n) => {
      typeof n == "function" ? n(t) : n != null && (n.current = t);
    });
  };
}
var T1 =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
try {
  T1 && (window.__reactRouterVersion = "7.12.0");
} catch {}
function $1({
  basename: e,
  children: t,
  unstable_useTransitions: n,
  window: r,
}) {
  let o = p.exports.useRef();
  o.current == null && (o.current = c0({ window: r, v5Compat: !0 }));
  let l = o.current,
    [a, i] = p.exports.useState({ action: l.action, location: l.location }),
    u = p.exports.useCallback(
      (c) => {
        n === !1 ? i(c) : p.exports.startTransition(() => i(c));
      },
      [n],
    );
  return (
    p.exports.useLayoutEffect(() => l.listen(u), [l, u]),
    p.exports.createElement(a1, {
      basename: e,
      children: t,
      location: a.location,
      navigationType: a.action,
      navigator: l,
      unstable_useTransitions: n,
    })
  );
}
var Qm = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  qm = p.exports.forwardRef(function (
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
      ...g
    },
    E,
  ) {
    let { basename: x, unstable_useTransitions: k } = p.exports.useContext(Nt),
      v = typeof c == "string" && Qm.test(c),
      m = Am(c, x);
    c = m.to;
    let y = H0(c, { relative: o }),
      [w, N, S] = R1(r, g),
      C = M1(c, {
        replace: a,
        state: i,
        target: u,
        preventScrollReset: f,
        relative: o,
        viewTransition: d,
        unstable_defaultShouldRevalidate: h,
        unstable_useTransitions: k,
      });
    function _(D) {
      t && t(D), D.defaultPrevented || C(D);
    }
    let j = p.exports.createElement("a", {
      ...g,
      ...S,
      href: m.absoluteURL || y,
      onClick: m.isExternal || l ? t : _,
      ref: b1(E, N),
      target: u,
      "data-discover": !v && n === "render" ? "true" : void 0,
    });
    return w && !v
      ? p.exports.createElement(
          p.exports.Fragment,
          null,
          j,
          p.exports.createElement(_1, { page: y }),
        )
      : j;
  });
qm.displayName = "Link";
var L1 = p.exports.forwardRef(function (
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
    h = sn(),
    g = p.exports.useContext(za),
    { navigator: E, basename: x } = p.exports.useContext(Nt),
    k = g != null && B1(d) && i === !0,
    v = E.encodeLocation ? E.encodeLocation(d).pathname : d.pathname,
    m = h.pathname,
    y =
      g && g.navigation && g.navigation.location
        ? g.navigation.location.pathname
        : null;
  n ||
    ((m = m.toLowerCase()),
    (y = y ? y.toLowerCase() : null),
    (v = v.toLowerCase())),
    y && x && (y = nn(y, x) || y);
  const w = v !== "/" && v.endsWith("/") ? v.length - 1 : v.length;
  let N = m === v || (!o && m.startsWith(v) && m.charAt(w) === "/"),
    S =
      y != null &&
      (y === v || (!o && y.startsWith(v) && y.charAt(v.length) === "/")),
    C = { isActive: N, isPending: S, isTransitioning: k },
    _ = N ? t : void 0,
    j;
  typeof r == "function"
    ? (j = r(C))
    : (j = [
        r,
        N ? "active" : null,
        S ? "pending" : null,
        k ? "transitioning" : null,
      ]
        .filter(Boolean)
        .join(" "));
  let D = typeof l == "function" ? l(C) : l;
  return p.exports.createElement(
    qm,
    {
      ...c,
      "aria-current": _,
      className: j,
      ref: f,
      style: D,
      to: a,
      viewTransition: i,
    },
    typeof u == "function" ? u(C) : u,
  );
});
L1.displayName = "NavLink";
var j1 = p.exports.forwardRef(
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
      ...g
    },
    E,
  ) => {
    let { unstable_useTransitions: x } = p.exports.useContext(Nt),
      k = A1(),
      v = F1(i, { relative: c }),
      m = a.toLowerCase() === "get" ? "get" : "post",
      y = typeof i == "string" && Qm.test(i),
      w = (N) => {
        if ((u && u(N), N.defaultPrevented)) return;
        N.preventDefault();
        let S = N.nativeEvent.submitter,
          C = (S == null ? void 0 : S.getAttribute("formmethod")) || a,
          _ = () =>
            k(S || N.currentTarget, {
              fetcherKey: t,
              method: C,
              navigate: n,
              replace: o,
              state: l,
              relative: c,
              preventScrollReset: f,
              viewTransition: d,
              unstable_defaultShouldRevalidate: h,
            });
        x && n !== !1 ? p.exports.startTransition(() => _()) : _();
      };
    return p.exports.createElement("form", {
      ref: E,
      method: m,
      action: v,
      onSubmit: r ? u : w,
      ...g,
      "data-discover": !y && e === "render" ? "true" : void 0,
    });
  },
);
j1.displayName = "Form";
function D1(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Ym(e) {
  let t = p.exports.useContext(Hr);
  return Ce(t, D1(e)), t;
}
function M1(
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
    f = sn(),
    d = Jo(e, { relative: l });
  return p.exports.useCallback(
    (h) => {
      if (f1(h, t)) {
        h.preventDefault();
        let g = n !== void 0 ? n : Fo(f) === Fo(d),
          E = () =>
            c(e, {
              replace: g,
              state: r,
              preventScrollReset: o,
              relative: l,
              viewTransition: a,
              unstable_defaultShouldRevalidate: i,
            });
        u ? p.exports.startTransition(() => E()) : E();
      }
    },
    [f, c, d, n, r, t, e, o, l, a, i, u],
  );
}
function Xu(e) {
  wt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.",
  );
  let t = p.exports.useRef(ki(e)),
    n = p.exports.useRef(!1),
    r = sn(),
    o = p.exports.useMemo(
      () => d1(r.search, n.current ? null : t.current),
      [r.search],
    ),
    l = Aa(),
    a = p.exports.useCallback(
      (i, u) => {
        const c = ki(typeof i == "function" ? i(new URLSearchParams(o)) : i);
        (n.current = !0), l("?" + c, u);
      },
      [l, o],
    );
  return [o, a];
}
var I1 = 0,
  z1 = () => `__${String(++I1)}__`;
function A1() {
  let { router: e } = Ym("useSubmit"),
    { basename: t } = p.exports.useContext(Nt),
    n = t1(),
    r = e.fetch,
    o = e.navigate;
  return p.exports.useCallback(
    async (l, a = {}) => {
      let { action: i, method: u, encType: c, formData: f, body: d } = h1(l, t);
      if (a.navigate === !1) {
        let h = a.fetcherKey || z1();
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
function F1(e, { relative: t } = {}) {
  let { basename: n } = p.exports.useContext(Nt),
    r = p.exports.useContext(an);
  Ce(r, "useFormAction must be used inside a RouteContext");
  let [o] = r.matches.slice(-1),
    l = { ...Jo(e || ".", { relative: t }) },
    a = sn();
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
    n !== "/" && (l.pathname = l.pathname === "/" ? n : Yt([n, l.pathname])),
    Fo(l)
  );
}
function B1(e, { relative: t } = {}) {
  let n = p.exports.useContext(Fm);
  Ce(
    n != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: r } = Ym("useViewTransitionState"),
    o = Jo(e, { relative: t });
  if (!n.isTransitioning) return !1;
  let l = nn(n.currentLocation.pathname, r) || n.currentLocation.pathname,
    a = nn(n.nextLocation.pathname, r) || n.nextLocation.pathname;
  return da(o.pathname, a) != null || da(o.pathname, l) != null;
}
var Xm = { exports: {} };
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
})(Xm);
const Y = Xm.exports;
var T = { exports: {} },
  Ba = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var W1 = p.exports,
  U1 = Symbol.for("react.element"),
  H1 = Symbol.for("react.fragment"),
  V1 = Object.prototype.hasOwnProperty,
  K1 = W1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  G1 = { key: !0, ref: !0, __self: !0, __source: !0 };
function Jm(e, t, n) {
  var r,
    o = {},
    l = null,
    a = null;
  n !== void 0 && (l = "" + n),
    t.key !== void 0 && (l = "" + t.key),
    t.ref !== void 0 && (a = t.ref);
  for (r in t) V1.call(t, r) && !G1.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: U1,
    type: e,
    key: l,
    ref: a,
    props: o,
    _owner: K1.current,
  };
}
Ba.Fragment = H1;
Ba.jsx = Jm;
Ba.jsxs = Jm;
(function (e) {
  e.exports = Ba;
})(T);
const Q1 = ["xxl", "xl", "lg", "md", "sm", "xs"],
  q1 = "xs",
  Wa = p.exports.createContext({
    prefixes: {},
    breakpoints: Q1,
    minBreakpoint: q1,
  });
function te(e, t) {
  const { prefixes: n } = p.exports.useContext(Wa);
  return e || n[t] || t;
}
function Zm() {
  const { breakpoints: e } = p.exports.useContext(Wa);
  return e;
}
function eh() {
  const { minBreakpoint: e } = p.exports.useContext(Wa);
  return e;
}
function Ju() {
  const { dir: e } = p.exports.useContext(Wa);
  return e === "rtl";
}
const Y1 = { fluid: !1 },
  Zu = p.exports.forwardRef(
    ({ bsPrefix: e, fluid: t, as: n = "div", className: r, ...o }, l) => {
      const a = te(e, "container"),
        i = typeof t == "string" ? `-${t}` : "-fluid";
      return T.exports.jsx(n, {
        ref: l,
        ...o,
        className: Y(r, t ? `${a}${i}` : a),
      });
    },
  );
Zu.displayName = "Container";
Zu.defaultProps = Y1;
const Dt = p.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = te(e, "row"),
      a = Zm(),
      i = eh(),
      u = `${l}-cols`,
      c = [];
    return (
      a.forEach((f) => {
        const d = r[f];
        delete r[f];
        let h;
        d != null && typeof d == "object" ? ({ cols: h } = d) : (h = d);
        const g = f !== i ? `-${f}` : "";
        h != null && c.push(`${u}${g}-${h}`);
      }),
      T.exports.jsx(n, { ref: o, ...r, className: Y(t, l, ...c) })
    );
  },
);
Dt.displayName = "Row";
function X1({ as: e, bsPrefix: t, className: n, ...r }) {
  t = te(t, "col");
  const o = Zm(),
    l = eh(),
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
      const g = u !== l ? `-${u}` : "";
      f && a.push(f === !0 ? `${t}${g}` : `${t}${g}-${f}`),
        h != null && i.push(`order${g}-${h}`),
        d != null && i.push(`offset${g}-${d}`);
    }),
    [
      { ...r, className: Y(n, ...a, ...i) },
      { as: e, bsPrefix: t, spans: a },
    ]
  );
}
const He = p.exports.forwardRef((e, t) => {
  const [{ className: n, ...r }, { as: o = "div", bsPrefix: l, spans: a }] =
    X1(e);
  return T.exports.jsx(o, { ...r, ref: t, className: Y(n, !a.length && l) });
});
He.displayName = "Col";
function Vr(e) {
  return (e && e.ownerDocument) || document;
}
function J1(e) {
  var t = Vr(e);
  return (t && t.defaultView) || window;
}
function Z1(e, t) {
  return J1(e).getComputedStyle(e, t);
}
var ex = /([A-Z])/g;
function tx(e) {
  return e.replace(ex, "-$1").toLowerCase();
}
var nx = /^ms-/;
function Sl(e) {
  return tx(e).replace(nx, "-ms-");
}
var rx =
  /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function ox(e) {
  return !!(e && rx.test(e));
}
function Xt(e, t) {
  var n = "",
    r = "";
  if (typeof t == "string")
    return e.style.getPropertyValue(Sl(t)) || Z1(e).getPropertyValue(Sl(t));
  Object.keys(t).forEach(function (o) {
    var l = t[o];
    !l && l !== 0
      ? e.style.removeProperty(Sl(o))
      : ox(o)
        ? (r += o + "(" + l + ") ")
        : (n += Sl(o) + ": " + l + ";");
  }),
    r && (n += "transform: " + r + ";"),
    (e.style.cssText += ";" + n);
}
function th(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Ni(e, t) {
  return (
    (Ni = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, o) {
          return (r.__proto__ = o), r;
        }),
    Ni(e, t)
  );
}
function lx(e, t) {
  (e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    Ni(e, t);
}
var R = { exports: {} },
  ax = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  sx = ax,
  ix = sx;
function nh() {}
function rh() {}
rh.resetWarningCache = nh;
var ux = function () {
  function e(r, o, l, a, i, u) {
    if (u !== ix) {
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
    checkPropTypes: rh,
    resetWarningCache: nh,
  };
  return (n.PropTypes = n), n;
};
R.exports = ux();
const Jf = { disabled: !1 },
  oh = s.createContext(null);
var cx = function (t) {
    return t.scrollTop;
  },
  uo = "unmounted",
  hn = "exited",
  Mt = "entering",
  yn = "entered",
  Bo = "exiting",
  un = (function (e) {
    lx(t, e);
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
            ? ((u = hn), (l.appearStatus = Mt))
            : (u = yn)
          : r.unmountOnExit || r.mountOnEnter
            ? (u = uo)
            : (u = hn),
        (l.state = { status: u }),
        (l.nextCallback = null),
        l
      );
    }
    t.getDerivedStateFromProps = function (o, l) {
      var a = o.in;
      return a && l.status === uo ? { status: hn } : null;
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
            ? a !== Mt && a !== yn && (l = Mt)
            : (a === Mt || a === yn) && (l = Bo);
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
          if ((this.cancelNextCallback(), l === Mt)) {
            if (this.props.unmountOnExit || this.props.mountOnEnter) {
              var a = this.props.nodeRef
                ? this.props.nodeRef.current
                : Hn.findDOMNode(this);
              a && cx(a);
            }
            this.performEnter(o);
          } else this.performExit();
        else
          this.props.unmountOnExit &&
            this.state.status === hn &&
            this.setState({ status: uo });
      }),
      (n.performEnter = function (o) {
        var l = this,
          a = this.props.enter,
          i = this.context ? this.context.isMounting : o,
          u = this.props.nodeRef ? [i] : [Hn.findDOMNode(this), i],
          c = u[0],
          f = u[1],
          d = this.getTimeouts(),
          h = i ? d.appear : d.enter;
        if ((!o && !a) || Jf.disabled) {
          this.safeSetState({ status: yn }, function () {
            l.props.onEntered(c);
          });
          return;
        }
        this.props.onEnter(c, f),
          this.safeSetState({ status: Mt }, function () {
            l.props.onEntering(c, f),
              l.onTransitionEnd(h, function () {
                l.safeSetState({ status: yn }, function () {
                  l.props.onEntered(c, f);
                });
              });
          });
      }),
      (n.performExit = function () {
        var o = this,
          l = this.props.exit,
          a = this.getTimeouts(),
          i = this.props.nodeRef ? void 0 : Hn.findDOMNode(this);
        if (!l || Jf.disabled) {
          this.safeSetState({ status: hn }, function () {
            o.props.onExited(i);
          });
          return;
        }
        this.props.onExit(i),
          this.safeSetState({ status: Bo }, function () {
            o.props.onExiting(i),
              o.onTransitionEnd(a.exit, function () {
                o.safeSetState({ status: hn }, function () {
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
            : Hn.findDOMNode(this),
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
        if (o === uo) return null;
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
        var i = th(l, [
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
          oh.Provider,
          { value: null },
          typeof a == "function"
            ? a(o, i)
            : s.cloneElement(s.Children.only(a), i),
        );
      }),
      t
    );
  })(s.Component);
un.contextType = oh;
un.propTypes = {};
function rr() {}
un.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: rr,
  onEntering: rr,
  onEntered: rr,
  onExit: rr,
  onExiting: rr,
  onExited: rr,
};
un.UNMOUNTED = uo;
un.EXITED = hn;
un.ENTERING = Mt;
un.ENTERED = yn;
un.EXITING = Bo;
const Kr = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
var Ci = !1,
  Ri = !1;
try {
  var Ns = {
    get passive() {
      return (Ci = !0);
    },
    get once() {
      return (Ri = Ci = !0);
    },
  };
  Kr &&
    (window.addEventListener("test", Ns, Ns),
    window.removeEventListener("test", Ns, !0));
} catch {}
function lh(e, t, n, r) {
  if (r && typeof r != "boolean" && !Ri) {
    var o = r.once,
      l = r.capture,
      a = n;
    !Ri &&
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
function _i(e, t, n, r) {
  var o = r && typeof r != "boolean" ? r.capture : r;
  e.removeEventListener(t, n, o),
    n.__once && e.removeEventListener(t, n.__once, o);
}
function Qt(e, t, n, r) {
  return (
    lh(e, t, n, r),
    function () {
      _i(e, t, n, r);
    }
  );
}
function fx(e, t, n, r) {
  if ((n === void 0 && (n = !1), r === void 0 && (r = !0), e)) {
    var o = document.createEvent("HTMLEvents");
    o.initEvent(t, n, r), e.dispatchEvent(o);
  }
}
function dx(e) {
  var t = Xt(e, "transitionDuration") || "",
    n = t.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(t) * n;
}
function px(e, t, n) {
  n === void 0 && (n = 5);
  var r = !1,
    o = setTimeout(function () {
      r || fx(e, "transitionend", !0);
    }, t + n),
    l = Qt(
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
function ah(e, t, n, r) {
  n == null && (n = dx(e) || 0);
  var o = px(e, n, r),
    l = Qt(e, "transitionend", t);
  return function () {
    o(), l();
  };
}
function Zf(e, t) {
  const n = Xt(e, t) || "",
    r = n.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(n) * r;
}
function sh(e, t) {
  const n = Zf(e, "transitionDuration"),
    r = Zf(e, "transitionDelay"),
    o = ah(
      e,
      (l) => {
        l.target === e && (o(), t(l));
      },
      n + r,
    );
}
function ro(...e) {
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
function ih(e) {
  e.offsetHeight;
}
var ed = function (t) {
  return !t || typeof t == "function"
    ? t
    : function (n) {
        t.current = n;
      };
};
function mx(e, t) {
  var n = ed(e),
    r = ed(t);
  return function (o) {
    n && n(o), r && r(o);
  };
}
function Zo(e, t) {
  return p.exports.useMemo(
    function () {
      return mx(e, t);
    },
    [e, t],
  );
}
function pa(e) {
  return e && "setState" in e ? Hn.findDOMNode(e) : e != null ? e : null;
}
const uh = s.forwardRef(
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
      const d = p.exports.useRef(null),
        h = Zo(d, u),
        g = (S) => {
          h(pa(S));
        },
        E = (S) => (C) => {
          S && d.current && S(d.current, C);
        },
        x = p.exports.useCallback(E(e), [e]),
        k = p.exports.useCallback(E(t), [t]),
        v = p.exports.useCallback(E(n), [n]),
        m = p.exports.useCallback(E(r), [r]),
        y = p.exports.useCallback(E(o), [o]),
        w = p.exports.useCallback(E(l), [l]),
        N = p.exports.useCallback(E(a), [a]);
      return T.exports.jsx(un, {
        ref: f,
        ...c,
        onEnter: x,
        onEntered: v,
        onEntering: k,
        onExit: m,
        onExited: w,
        onExiting: y,
        addEndListener: N,
        nodeRef: d,
        children:
          typeof i == "function"
            ? (S, C) => i(S, { ...C, ref: g })
            : s.cloneElement(i, { ref: g }),
      });
    },
  ),
  hx = {
    height: ["marginTop", "marginBottom"],
    width: ["marginLeft", "marginRight"],
  };
function ch(e, t) {
  const n = `offset${e[0].toUpperCase()}${e.slice(1)}`,
    r = t[n],
    o = hx[e];
  return r + parseInt(Xt(t, o[0]), 10) + parseInt(Xt(t, o[1]), 10);
}
const vx = {
    [hn]: "collapse",
    [Bo]: "collapsing",
    [Mt]: "collapsing",
    [yn]: "collapse show",
  },
  gx = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
    getDimensionValue: ch,
  },
  ec = s.forwardRef(
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
        getDimensionValue: u = ch,
        ...c
      },
      f,
    ) => {
      const d = typeof i == "function" ? i() : i,
        h = p.exports.useMemo(
          () =>
            ro((v) => {
              v.style[d] = "0";
            }, e),
          [d, e],
        ),
        g = p.exports.useMemo(
          () =>
            ro((v) => {
              const m = `scroll${d[0].toUpperCase()}${d.slice(1)}`;
              v.style[d] = `${v[m]}px`;
            }, t),
          [d, t],
        ),
        E = p.exports.useMemo(
          () =>
            ro((v) => {
              v.style[d] = null;
            }, n),
          [d, n],
        ),
        x = p.exports.useMemo(
          () =>
            ro((v) => {
              (v.style[d] = `${u(d, v)}px`), ih(v);
            }, r),
          [r, u, d],
        ),
        k = p.exports.useMemo(
          () =>
            ro((v) => {
              v.style[d] = null;
            }, o),
          [d, o],
        );
      return T.exports.jsx(uh, {
        ref: f,
        addEndListener: sh,
        ...c,
        "aria-expanded": c.role ? c.in : null,
        onEnter: h,
        onEntering: g,
        onEntered: E,
        onExit: x,
        onExiting: k,
        childRef: a.ref,
        children: (v, m) =>
          s.cloneElement(a, {
            ...m,
            className: Y(
              l,
              a.props.className,
              vx[v],
              d === "width" && "collapse-horizontal",
            ),
          }),
      });
    },
  );
ec.defaultProps = gx;
var yx = ["color", "size", "title", "className"];
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
function xx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Ex(e, t);
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
function Ex(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var fh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = xx(e, yx);
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
fh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const dh = fh;
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
var ph = p.exports.forwardRef(function (e, t) {
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
ph.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Nx = ph;
var Cx = ["color", "size", "title", "className"];
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
function Rx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = _x(e, t);
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
function _x(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var mh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Rx(e, Cx);
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
mh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const tc = mh;
var Ox = ["color", "size", "title", "className"];
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
function Px(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = bx(e, t);
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
function bx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var hh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Px(e, Ox);
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
hh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Tx = hh;
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
var vh = p.exports.forwardRef(function (e, t) {
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
vh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Dx = vh;
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
var gh = p.exports.forwardRef(function (e, t) {
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
gh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Ax = gh;
var Fx = ["color", "size", "title", "className"];
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
function Bx(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Wx(e, t);
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
function Wx(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var yh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = Bx(e, Fx);
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
yh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const xh = yh;
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
var Eh = p.exports.forwardRef(function (e, t) {
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
Eh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Kx = Eh;
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
var wh = p.exports.forwardRef(function (e, t) {
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
wh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Yx = wh;
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
var Sh = p.exports.forwardRef(function (e, t) {
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
Sh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const eE = Sh;
var tE = ["color", "size", "title", "className"];
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
function nE(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = rE(e, t);
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
function rE(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var kh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = nE(e, tE);
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
kh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const Nh = kh;
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
var Ch = p.exports.forwardRef(function (e, t) {
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
Ch.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const sE = Ch;
var iE = ["color", "size", "title", "className"];
function Fi() {
  return (
    (Fi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Fi.apply(null, arguments)
  );
}
function uE(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = cE(e, t);
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
function cE(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var Rh = p.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    a = e.title,
    i = a === void 0 ? null : a,
    u = e.className,
    c = u === void 0 ? "" : u,
    f = uE(e, iE);
  return s.createElement(
    "svg",
    Fi(
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
Rh.propTypes = {
  color: R.exports.string,
  size: R.exports.oneOfType([R.exports.string, R.exports.number]),
  title: R.exports.string,
  className: R.exports.string,
};
const _h = Rh,
  fE = {
    Running: "Live queue",
    Datasets: "Storage",
    Plots: "Live data",
    "Schedule new": "Browse",
    "Configure Submission": "Submit",
  };
function or({
  title: e,
  children: t,
  defaultExpanded: n = !0,
  className: r = "",
  eyebrow: o,
}) {
  const [l, a] = p.exports.useState(n),
    [i, u] = p.exports.useState(!1);
  p.exports.useEffect(() => {
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
    d = o || fE[e] || "Section";
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
          s.createElement(tc, { size: 14 }),
        ),
      s.createElement(
        "div",
        { className: "section-header__text" },
        s.createElement("span", { className: "section-header__eyebrow" }, d),
        s.createElement("h2", null, e),
      ),
    ),
    s.createElement(ec, { in: c }, s.createElement("div", null, t)),
  );
}
function Bi() {
  return (
    (Bi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Bi.apply(this, arguments)
  );
}
function td(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function dE(e) {
  var t = pE(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function pE(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Oh(e, t, n) {
  var r = p.exports.useRef(e !== void 0),
    o = p.exports.useState(t),
    l = o[0],
    a = o[1],
    i = e !== void 0,
    u = r.current;
  return (
    (r.current = i),
    !i && u && l !== t && a(t),
    [
      i ? e : l,
      p.exports.useCallback(
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
function Ph(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      l = n,
      a = l[td(r)],
      i = l[r],
      u = th(l, [td(r), r].map(dE)),
      c = t[r],
      f = Oh(i, a, e[c]),
      d = f[0],
      h = f[1];
    return Bi({}, u, ((o = {}), (o[r] = d), (o[c] = h), o));
  }, e);
}
function bh(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
const el = p.exports.createContext({});
el.displayName = "AccordionContext";
const nc = p.exports.forwardRef(
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
    const { activeEventKey: i } = p.exports.useContext(el);
    return (
      (t = te(t, "accordion-collapse")),
      T.exports.jsx(ec, {
        ref: a,
        in: bh(i, o),
        ...l,
        className: Y(n, t),
        children: T.exports.jsx(e, { children: p.exports.Children.only(r) }),
      })
    );
  },
);
nc.displayName = "AccordionCollapse";
const Ua = p.exports.createContext({ eventKey: "" });
Ua.displayName = "AccordionItemContext";
const Th = p.exports.forwardRef(
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
    t = te(t, "accordion-body");
    const { eventKey: d } = p.exports.useContext(Ua);
    return T.exports.jsx(nc, {
      eventKey: d,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: a,
      onExiting: i,
      onExited: u,
      children: T.exports.jsx(e, { ref: f, ...c, className: Y(n, t) }),
    });
  },
);
Th.displayName = "AccordionBody";
function mE(e, t) {
  const {
    activeEventKey: n,
    onSelect: r,
    alwaysOpen: o,
  } = p.exports.useContext(el);
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
const rc = p.exports.forwardRef(
  ({ as: e = "button", bsPrefix: t, className: n, onClick: r, ...o }, l) => {
    t = te(t, "accordion-button");
    const { eventKey: a } = p.exports.useContext(Ua),
      i = mE(a, r),
      { activeEventKey: u } = p.exports.useContext(el);
    return (
      e === "button" && (o.type = "button"),
      T.exports.jsx(e, {
        ref: l,
        onClick: i,
        ...o,
        "aria-expanded": a === u,
        className: Y(n, t, !bh(u, a) && "collapsed"),
      })
    );
  },
);
rc.displayName = "AccordionButton";
const $h = p.exports.forwardRef(
  (
    { as: e = "h2", bsPrefix: t, className: n, children: r, onClick: o, ...l },
    a,
  ) => (
    (t = te(t, "accordion-header")),
    T.exports.jsx(e, {
      ref: a,
      ...l,
      className: Y(n, t),
      children: T.exports.jsx(rc, { onClick: o, children: r }),
    })
  ),
);
$h.displayName = "AccordionHeader";
const Lh = p.exports.forwardRef(
  ({ as: e = "div", bsPrefix: t, className: n, eventKey: r, ...o }, l) => {
    t = te(t, "accordion-item");
    const a = p.exports.useMemo(() => ({ eventKey: r }), [r]);
    return T.exports.jsx(Ua.Provider, {
      value: a,
      children: T.exports.jsx(e, { ref: l, ...o, className: Y(n, t) }),
    });
  },
);
Lh.displayName = "AccordionItem";
const jh = p.exports.forwardRef((e, t) => {
  const {
      as: n = "div",
      activeKey: r,
      bsPrefix: o,
      className: l,
      onSelect: a,
      flush: i,
      alwaysOpen: u,
      ...c
    } = Ph(e, { activeKey: "onSelect" }),
    f = te(o, "accordion"),
    d = p.exports.useMemo(
      () => ({ activeEventKey: r, onSelect: a, alwaysOpen: u }),
      [r, a, u],
    );
  return T.exports.jsx(el.Provider, {
    value: d,
    children: T.exports.jsx(n, {
      ref: t,
      ...c,
      className: Y(l, f, i && `${f}-flush`),
    }),
  });
});
jh.displayName = "Accordion";
const pt = Object.assign(jh, {
    Button: rc,
    Collapse: nc,
    Item: Lh,
    Header: $h,
    Body: Th,
  }),
  hE = { vertical: !1, role: "group" },
  oc = p.exports.forwardRef(
    (
      { bsPrefix: e, size: t, vertical: n, className: r, as: o = "div", ...l },
      a,
    ) => {
      const i = te(e, "btn-group");
      let u = i;
      return (
        n && (u = `${i}-vertical`),
        T.exports.jsx(o, { ...l, ref: a, className: Y(r, u, t && `${i}-${t}`) })
      );
    },
  );
oc.displayName = "ButtonGroup";
oc.defaultProps = hE;
const ma = p.exports.forwardRef(
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
      const d = te(e, "table"),
        h = Y(
          t,
          d,
          i && `${d}-${i}`,
          a && `${d}-${a}`,
          n && `${d}-${typeof n == "string" ? `striped-${n}` : "striped"}`,
          r && `${d}-bordered`,
          o && `${d}-borderless`,
          l && `${d}-hover`,
        ),
        g = T.exports.jsx("table", { ...c, className: h, ref: f });
      if (u) {
        let E = `${d}-responsive`;
        return (
          typeof u == "string" && (E = `${E}-${u}`),
          T.exports.jsx("div", { className: E, children: g })
        );
      }
      return g;
    },
  ),
  vE = ["as", "disabled"];
function gE(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function yE(e) {
  return !e || e.trim() === "#";
}
function lc({
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
      if (((t || (e === "a" && yE(n))) && h.preventDefault(), t)) {
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
const xE = p.exports.forwardRef((e, t) => {
  let { as: n, disabled: r } = e,
    o = gE(e, vE);
  const [l, { tagName: a }] = lc(Object.assign({ tagName: n, disabled: r }, o));
  return T.exports.jsx(a, Object.assign({}, o, l, { ref: t }));
});
xE.displayName = "Button";
const EE = { variant: "primary", active: !1, disabled: !1 },
  st = p.exports.forwardRef(
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
      const u = te(t, "btn"),
        [c, { tagName: f }] = lc({ tagName: e, ...a }),
        d = f;
      return T.exports.jsx(d, {
        ...c,
        ...a,
        ref: i,
        className: Y(
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
st.displayName = "Button";
st.defaultProps = EE;
const wE = window.location.origin;
function SE(e, t = {}) {
  const n = new URL(e, wE);
  return Object.keys(t).forEach((r) => n.searchParams.append(r, t[r])), n;
}
async function cn(e, t = {}) {
  const { params: n, ...r } = t,
    o = SE(e, n),
    l = await fetch(o, r);
  if (!l.ok) throw new Error(`API error: ${l.status} ${l.statusText}`);
  return l.json();
}
function Dh(e, t = !1) {
  return cn("api/cancel", {
    method: "POST",
    params: { rid: e, force: t },
  }).catch((n) => {
    throw (console.error("Cancel RID error:", n.message), n);
  });
}
function kE(e, t, n, r = {}, o = "main") {
  const l = {
    log_level: 30,
    file: e,
    class_name: t,
    arguments: r,
    repo_rev: n,
  };
  return cn("api/schedule", {
    method: "POST",
    params: { pipeline: o },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(l),
  });
}
function NE() {
  return cn("api/schedule");
}
function CE() {
  return cn("api/explist");
}
function RE(e, t) {
  const n = e
    .split("/")
    .map((r) => encodeURIComponent(r))
    .join("/");
  return cn(`api/explist/${n}/${encodeURIComponent(t)}/arginfo`);
}
function ac() {
  return cn("api/datasets/names");
}
function Rr(e) {
  const t = Array.isArray(e) ? e.join(",") : e;
  return cn("api/datasets/values", { params: { names: t } });
}
function _E() {
  return cn("api/health");
}
function OE() {
  return cn("api/logs");
}
function PE(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        Dh(e.rid)
          .then(() => {
            console.log(`RID ${e.rid} termination requested`), n(!1);
          })
          .catch((o) => {
            console.error(`Error cancelling RID ${e.rid}:`, o.message), n(!1);
          });
    };
  return s.createElement(
    st,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    "Request Termination",
  );
}
function bE(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        Dh(e.rid, !0)
          .then(() => {
            console.log(`RID ${e.rid} force cancelled`), n(!1);
          })
          .catch((o) => {
            console.error(`Error force cancelling RID ${e.rid}:`, o.message),
              n(!1);
          });
    };
  return s.createElement(
    st,
    { variant: "danger", disabled: t, onClick: t ? null : r },
    "Force cancellation",
  );
}
const TE = {
  running: "is-running",
  preparing: "is-preparing",
  pending: "is-pending",
  pause_requested: "is-preparing",
  flushing: "is-preparing",
  deleting: "is-error",
  run_done: "is-pending",
  analyzing: "is-running",
};
function $E(e) {
  return (e && TE[e]) || "is-pending";
}
function LE({ status: e }) {
  return s.createElement(
    "span",
    { className: `status-pill ${$E(e)}`, "aria-label": `Status: ${e}` },
    e,
  );
}
function jE({ rid: e, className: t, file: n, status: r }) {
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
      s.createElement(LE, { status: r }),
    ),
    s.createElement("div", { className: "schedule-item-head__class" }, t),
    s.createElement("div", { className: "schedule-item-head__file" }, n),
  );
}
function DE(e) {
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
    pt.Item,
    { eventKey: t },
    s.createElement(
      pt.Header,
      null,
      s.createElement(jE, { rid: t, className: n, file: r, status: l }),
    ),
    s.createElement(
      pt.Body,
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
        pt,
        null,
        s.createElement(
          pt.Item,
          { eventKey: "args" },
          s.createElement(
            pt.Header,
            null,
            s.createElement(
              "span",
              { className: "schedule-item-head__class" },
              "Arguments",
            ),
          ),
          s.createElement(
            pt.Body,
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
        oc,
        { className: "mt-3" },
        s.createElement(PE, { rid: t }),
        s.createElement(bE, { rid: t }),
      ),
    ),
  );
}
const ME = 1e3;
function IE() {
  const [e, t] = s.useState({});
  return (
    s.useEffect(() => {
      const n = () => {
        NE()
          .then(t)
          .catch((o) => console.error("Schedule update error:", o.message));
      };
      n();
      const r = setInterval(n, ME);
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
          pt,
          { defaultActiveKey: "0", className: "schedule-list" },
          Object.keys(e).map((n) =>
            s.createElement(DE, { key: n, rid: n, data: e[n] }),
          ),
        )
  );
}
function zE({
  tree: e,
  repo_rev: t,
  searchTerm: n,
  onSelect: r,
  selectedExperiment: o,
}) {
  return s.createElement(
    "div",
    { className: "experiment-tree" },
    s.createElement(Wi, {
      node: e,
      repo_rev: t,
      searchTerm: n,
      isRoot: !0,
      onSelect: r,
      selectedExperiment: o,
    }),
  );
}
function Wi({
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
        s.createElement(Dx, { size: 14 }),
      ),
      s.createElement(
        "span",
        { className: "experiment-item__class" },
        E.class_name,
      ),
      s.createElement("span", { className: "experiment-item__file" }, E.file),
    );
  }
  const g = Object.keys(e).sort((E, x) => {
    const k = !e[E].experiment,
      v = !e[x].experiment;
    return k && !v ? -1 : !k && v ? 1 : E.localeCompare(x);
  });
  return o
    ? s.createElement(
        "div",
        null,
        g.map((E) =>
          s.createElement(Wi, {
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
            s.createElement(tc, { size: 12 }),
          ),
          s.createElement(
            "span",
            { className: "experiment-folder__icon", "aria-hidden": "true" },
            s.createElement(Ax, { size: 14 }),
          ),
          s.createElement("span", null, t),
        ),
        d &&
          s.createElement(
            "div",
            { className: "experiment-tree-children" },
            g.map((E) =>
              s.createElement(Wi, {
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
function AE(e, t) {
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
function FE({ explist: e, onSelect: t, selectedExperiment: n }) {
  const [r, o] = s.useState(""),
    l = e && "experiments" in e ? e.experiments : [],
    a = e && "repo_rev" in e ? e.repo_rev : null,
    i = s.useMemo(() => AE(l, r), [l, r]),
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
        s.createElement(Nh, { size: 14 }),
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
          s.createElement(_h, { size: 18 }),
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
          : s.createElement(zE, {
              tree: i,
              repo_rev: a,
              searchTerm: r,
              onSelect: u,
              selectedExperiment: n,
            }),
    ),
  );
}
var BE = /-(.)/g;
function WE(e) {
  return e.replace(BE, function (t, n) {
    return n.toUpperCase();
  });
}
const UE = (e) => e[0].toUpperCase() + WE(e).slice(1);
function je(e, { displayName: t = UE(e), Component: n, defaultProps: r } = {}) {
  const o = p.exports.forwardRef(
    ({ className: l, bsPrefix: a, as: i = n || "div", ...u }, c) => {
      const f = te(a, e);
      return T.exports.jsx(i, { ref: c, className: Y(l, f), ...u });
    },
  );
  return (o.defaultProps = r), (o.displayName = t), o;
}
const Ha = (e) =>
    p.exports.forwardRef((t, n) =>
      T.exports.jsx("div", { ...t, ref: n, className: Y(t.className, e) }),
    ),
  Mh = p.exports.forwardRef(
    ({ bsPrefix: e, className: t, variant: n, as: r = "img", ...o }, l) => {
      const a = te(e, "card-img");
      return T.exports.jsx(r, {
        ref: l,
        className: Y(n ? `${a}-${n}` : a, t),
        ...o,
      });
    },
  );
Mh.displayName = "CardImg";
const Ih = p.exports.createContext(null);
Ih.displayName = "CardHeaderContext";
const zh = p.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = te(e, "card-header"),
      a = p.exports.useMemo(() => ({ cardHeaderBsPrefix: l }), [l]);
    return T.exports.jsx(Ih.Provider, {
      value: a,
      children: T.exports.jsx(n, { ref: o, ...r, className: Y(t, l) }),
    });
  },
);
zh.displayName = "CardHeader";
const HE = Ha("h5"),
  VE = Ha("h6"),
  Ah = je("card-body"),
  KE = je("card-title", { Component: HE }),
  GE = je("card-subtitle", { Component: VE }),
  QE = je("card-link", { Component: "a" }),
  qE = je("card-text", { Component: "p" }),
  YE = je("card-footer"),
  XE = je("card-img-overlay"),
  JE = { body: !1 },
  sc = p.exports.forwardRef(
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
      const f = te(e, "card");
      return T.exports.jsx(i, {
        ref: c,
        ...u,
        className: Y(
          t,
          f,
          n && `bg-${n}`,
          r && `text-${r}`,
          o && `border-${o}`,
        ),
        children: l ? T.exports.jsx(Ah, { children: a }) : a,
      });
    },
  );
sc.displayName = "Card";
sc.defaultProps = JE;
const lt = Object.assign(sc, {
  Img: Mh,
  Title: KE,
  Subtitle: GE,
  Body: Ah,
  Link: QE,
  Text: qE,
  Header: zh,
  Footer: YE,
  ImgOverlay: XE,
});
function ic() {
  var e = p.exports.useRef(!0),
    t = p.exports.useRef(function () {
      return e.current;
    });
  return (
    p.exports.useEffect(function () {
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
function ZE(e) {
  var t = p.exports.useRef(e);
  return (t.current = e), t;
}
function uc(e) {
  var t = ZE(e);
  p.exports.useEffect(function () {
    return function () {
      return t.current();
    };
  }, []);
}
var Ui = Math.pow(2, 31) - 1;
function Fh(e, t, n) {
  var r = n - Date.now();
  e.current =
    r <= Ui
      ? setTimeout(t, r)
      : setTimeout(function () {
          return Fh(e, t, n);
        }, Ui);
}
function Bh() {
  var e = ic(),
    t = p.exports.useRef();
  return (
    uc(function () {
      return clearTimeout(t.current);
    }),
    p.exports.useMemo(function () {
      var n = function () {
        return clearTimeout(t.current);
      };
      function r(o, l) {
        l === void 0 && (l = 0),
          e() &&
            (n(),
            l <= Ui
              ? (t.current = setTimeout(o, l))
              : Fh(t, o, Date.now() + l));
      }
      return { set: r, clear: n };
    }, [])
  );
}
const ew = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
  },
  tw = { [Mt]: "show", [yn]: "show" },
  fn = p.exports.forwardRef(
    ({ className: e, children: t, transitionClasses: n = {}, ...r }, o) => {
      const l = p.exports.useCallback(
        (a, i) => {
          ih(a), r.onEnter == null || r.onEnter(a, i);
        },
        [r],
      );
      return T.exports.jsx(uh, {
        ref: o,
        addEndListener: sh,
        ...r,
        onEnter: l,
        childRef: t.ref,
        children: (a, i) =>
          p.exports.cloneElement(t, {
            ...i,
            className: Y("fade", e, t.props.className, tw[a], n[a]),
          }),
      });
    },
  );
fn.defaultProps = ew;
fn.displayName = "Fade";
const nw = { [Mt]: "showing", [Bo]: "showing show" },
  Wh = p.exports.forwardRef((e, t) =>
    T.exports.jsx(fn, { ...e, ref: t, transitionClasses: nw }),
  );
Wh.displayName = "ToastFade";
function rw(e) {
  var t = p.exports.useRef(e);
  return (
    p.exports.useEffect(
      function () {
        t.current = e;
      },
      [e],
    ),
    t
  );
}
function Ve(e) {
  var t = rw(e);
  return p.exports.useCallback(
    function () {
      return t.current && t.current.apply(t, arguments);
    },
    [t],
  );
}
const ow = {
    "aria-label": R.exports.string,
    onClick: R.exports.func,
    variant: R.exports.oneOf(["white"]),
  },
  lw = { "aria-label": "Close" },
  Gr = p.exports.forwardRef(({ className: e, variant: t, ...n }, r) =>
    T.exports.jsx("button", {
      ref: r,
      type: "button",
      className: Y("btn-close", t && `btn-close-${t}`, e),
      ...n,
    }),
  );
Gr.displayName = "CloseButton";
Gr.propTypes = ow;
Gr.defaultProps = lw;
const Uh = p.exports.createContext({ onClose() {} }),
  aw = { closeLabel: "Close", closeButton: !0 },
  cc = p.exports.forwardRef(
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
      e = te(e, "toast-header");
      const u = p.exports.useContext(Uh),
        c = Ve((f) => {
          u == null || u.onClose == null || u.onClose(f);
        });
      return T.exports.jsxs("div", {
        ref: i,
        ...a,
        className: Y(e, o),
        children: [
          l,
          r &&
            T.exports.jsx(Gr, {
              "aria-label": t,
              variant: n,
              onClick: c,
              "data-dismiss": "toast",
            }),
        ],
      });
    },
  );
cc.displayName = "ToastHeader";
cc.defaultProps = aw;
const sw = je("toast-body"),
  Hh = p.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        transition: n = Wh,
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
      e = te(e, "toast");
      const d = p.exports.useRef(l),
        h = p.exports.useRef(i);
      p.exports.useEffect(() => {
        (d.current = l), (h.current = i);
      }, [l, i]);
      const g = Bh(),
        E = !!(a && r),
        x = p.exports.useCallback(() => {
          E && (h.current == null || h.current());
        }, [E]);
      p.exports.useEffect(() => {
        g.set(x, d.current);
      }, [g, x]);
      const k = p.exports.useMemo(() => ({ onClose: i }), [i]),
        v = !!(n && o),
        m = T.exports.jsx("div", {
          ...c,
          ref: f,
          className: Y(e, t, u && `bg-${u}`, !v && (r ? "show" : "hide")),
          role: "alert",
          "aria-live": "assertive",
          "aria-atomic": "true",
        });
      return T.exports.jsx(Uh.Provider, {
        value: k,
        children:
          v && n
            ? T.exports.jsx(n, { in: r, unmountOnExit: !0, children: m })
            : m,
      });
    },
  );
Hh.displayName = "Toast";
const _r = Object.assign(Hh, { Body: sw, Header: cc }),
  iw = {
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
  fc = p.exports.forwardRef(
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
      (e = te(e, "toast-container")),
      T.exports.jsx(o, {
        ref: a,
        ...l,
        className: Y(e, t && [n ? `position-${n}` : null, iw[t]], r),
      })
    ),
  );
fc.displayName = "ToastContainer";
const uw = {
    type: R.exports.string,
    tooltip: R.exports.bool,
    as: R.exports.elementType,
  },
  Va = p.exports.forwardRef(
    (
      { as: e = "div", className: t, type: n = "valid", tooltip: r = !1, ...o },
      l,
    ) =>
      T.exports.jsx(e, {
        ...o,
        ref: l,
        className: Y(t, `${n}-${r ? "tooltip" : "feedback"}`),
      }),
  );
Va.displayName = "Feedback";
Va.propTypes = uw;
const rn = p.exports.createContext({}),
  tl = p.exports.forwardRef(
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
      const { controlId: c } = p.exports.useContext(rn);
      return (
        (t = te(t, "form-check-input")),
        T.exports.jsx(a, {
          ...i,
          ref: u,
          type: r,
          id: e || c,
          className: Y(n, t, o && "is-valid", l && "is-invalid"),
        })
      );
    },
  );
tl.displayName = "FormCheckInput";
const ha = p.exports.forwardRef(
  ({ bsPrefix: e, className: t, htmlFor: n, ...r }, o) => {
    const { controlId: l } = p.exports.useContext(rn);
    return (
      (e = te(e, "form-check-label")),
      T.exports.jsx("label", {
        ...r,
        ref: o,
        htmlFor: n || l,
        className: Y(t, e),
      })
    );
  },
);
ha.displayName = "FormCheckLabel";
function cw(e, t) {
  return p.exports.Children.toArray(e).some(
    (n) => p.exports.isValidElement(n) && n.type === t,
  );
}
const Vh = p.exports.forwardRef(
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
      title: g = "",
      type: E = "checkbox",
      label: x,
      children: k,
      as: v = "input",
      ...m
    },
    y,
  ) => {
    (t = te(t, "form-check")), (n = te(n, "form-switch"));
    const { controlId: w } = p.exports.useContext(rn),
      N = p.exports.useMemo(() => ({ controlId: e || w }), [w, e]),
      S = (!k && x != null && x !== !1) || cw(k, ha),
      C = T.exports.jsx(tl, {
        ...m,
        type: E === "switch" ? "checkbox" : E,
        ref: y,
        isValid: a,
        isInvalid: i,
        disabled: l,
        as: v,
      });
    return T.exports.jsx(rn.Provider, {
      value: N,
      children: T.exports.jsx("div", {
        style: h,
        className: Y(
          d,
          S && t,
          r && `${t}-inline`,
          o && `${t}-reverse`,
          E === "switch" && n,
        ),
        children:
          k ||
          T.exports.jsxs(T.exports.Fragment, {
            children: [
              C,
              S && T.exports.jsx(ha, { title: g, children: x }),
              c && T.exports.jsx(Va, { type: f, tooltip: u, children: c }),
            ],
          }),
      }),
    });
  },
);
Vh.displayName = "FormCheck";
const va = Object.assign(Vh, { Input: tl, Label: ha }),
  Kh = p.exports.forwardRef(
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
      const { controlId: g } = p.exports.useContext(rn);
      e = te(e, "form-control");
      let E;
      return (
        u
          ? (E = { [`${e}-plaintext`]: !0 })
          : (E = { [e]: !0, [`${e}-${n}`]: n }),
        T.exports.jsx(f, {
          ...d,
          type: t,
          size: r,
          ref: h,
          readOnly: c,
          id: o || g,
          className: Y(
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
Kh.displayName = "FormControl";
const fw = Object.assign(Kh, { Feedback: Va }),
  dw = je("form-floating"),
  dc = p.exports.forwardRef(({ controlId: e, as: t = "div", ...n }, r) => {
    const o = p.exports.useMemo(() => ({ controlId: e }), [e]);
    return T.exports.jsx(rn.Provider, {
      value: o,
      children: T.exports.jsx(t, { ...n, ref: r }),
    });
  });
dc.displayName = "FormGroup";
const pw = { column: !1, visuallyHidden: !1 },
  pc = p.exports.forwardRef(
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
      const { controlId: u } = p.exports.useContext(rn);
      t = te(t, "form-label");
      let c = "col-form-label";
      typeof n == "string" && (c = `${c} ${c}-${n}`);
      const f = Y(o, t, r && "visually-hidden", n && c);
      return (
        (l = l || u),
        n
          ? T.exports.jsx(He, {
              ref: i,
              as: "label",
              className: f,
              htmlFor: l,
              ...a,
            })
          : T.exports.jsx(e, { ref: i, className: f, htmlFor: l, ...a })
      );
    },
  );
pc.displayName = "FormLabel";
pc.defaultProps = pw;
const Gh = p.exports.forwardRef(
  ({ bsPrefix: e, className: t, id: n, ...r }, o) => {
    const { controlId: l } = p.exports.useContext(rn);
    return (
      (e = te(e, "form-range")),
      T.exports.jsx("input", {
        ...r,
        type: "range",
        ref: o,
        className: Y(t, e),
        id: n || l,
      })
    );
  },
);
Gh.displayName = "FormRange";
const Qh = p.exports.forwardRef(
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
    const { controlId: c } = p.exports.useContext(rn);
    return (
      (e = te(e, "form-select")),
      T.exports.jsx("select", {
        ...i,
        size: n,
        ref: u,
        className: Y(
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
Qh.displayName = "FormSelect";
const qh = p.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "small", muted: r, ...o }, l) => (
    (e = te(e, "form-text")),
    T.exports.jsx(n, { ...o, ref: l, className: Y(t, e, r && "text-muted") })
  ),
);
qh.displayName = "FormText";
const Yh = p.exports.forwardRef((e, t) =>
  T.exports.jsx(va, { ...e, ref: t, type: "switch" }),
);
Yh.displayName = "Switch";
const mw = Object.assign(Yh, { Input: va.Input, Label: va.Label }),
  Xh = p.exports.forwardRef(
    (
      { bsPrefix: e, className: t, children: n, controlId: r, label: o, ...l },
      a,
    ) => (
      (e = te(e, "form-floating")),
      T.exports.jsxs(dc, {
        ref: a,
        className: Y(t, e),
        controlId: r,
        ...l,
        children: [n, T.exports.jsx("label", { htmlFor: r, children: o })],
      })
    ),
  );
Xh.displayName = "FloatingLabel";
const hw = {
    _ref: R.exports.any,
    validated: R.exports.bool,
    as: R.exports.elementType,
  },
  mc = p.exports.forwardRef(
    ({ className: e, validated: t, as: n = "form", ...r }, o) =>
      T.exports.jsx(n, { ...r, ref: o, className: Y(e, t && "was-validated") }),
  );
mc.displayName = "Form";
mc.propTypes = hw;
const Z = Object.assign(mc, {
  Group: dc,
  Control: fw,
  Floating: dw,
  Check: va,
  Switch: mw,
  Label: pc,
  Text: qh,
  Range: Gh,
  Select: Qh,
  FloatingLabel: Xh,
});
function Jh(e) {
  const [t, n] = s.useState(!1),
    r = () => {
      n(!0),
        kE(
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
    st,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    t ? "Submitting..." : "Submit",
  );
}
function Zh(e) {
  return e && Object.keys(e).includes("ndscan_params");
}
const vw = Zh;
function gw(e) {
  if (!Zh(e)) return null;
  try {
    const t = e.ndscan_params,
      [n] = t,
      r = n.default;
    return JSON.parse(r);
  } catch (t) {
    return console.error("Error parsing ndscan_params:", t), null;
  }
}
function yw(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) for (const o of r) t[o] || (t[o] = n);
  return t;
}
function xw(e) {
  return !e || !e.axes
    ? new Set()
    : new Set(e.axes.map((t) => t.fqn).filter(Boolean));
}
function hc(e, t) {
  return `ndscan_${e}_${t}`;
}
function Ew(e, t) {
  try {
    const n = hc(e, t),
      r = localStorage.getItem(n);
    if (r) return JSON.parse(r);
  } catch (n) {
    console.error("Error loading ndscan state from localStorage:", n);
  }
  return null;
}
function ww(e, t, n) {
  try {
    const r = hc(e, t);
    localStorage.setItem(r, JSON.stringify(n));
  } catch (r) {
    console.error("Error saving ndscan state to localStorage:", r);
  }
}
function Sw(e, t, n, r, o) {
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
function zt(e, t) {
  return e == null ? "" : t ? e / t : e;
}
function ga(e, t) {
  if (e === "" || e === "-") return e;
  const n = parseFloat(e);
  return isNaN(n) ? e : t ? n * t : n;
}
const ev = p.exports.createContext(null);
ev.displayName = "InputGroupContext";
const vc = je("input-group-text", { Component: "span" }),
  kw = (e) =>
    T.exports.jsx(vc, {
      children: T.exports.jsx(tl, { type: "checkbox", ...e }),
    }),
  Nw = (e) =>
    T.exports.jsx(vc, { children: T.exports.jsx(tl, { type: "radio", ...e }) }),
  tv = p.exports.forwardRef(
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
      e = te(e, "input-group");
      const i = p.exports.useMemo(() => ({}), []);
      return T.exports.jsx(ev.Provider, {
        value: i,
        children: T.exports.jsx(o, {
          ref: a,
          ...l,
          className: Y(r, e, t && `${e}-${t}`, n && "has-validation"),
        }),
      });
    },
  );
tv.displayName = "InputGroup";
const he = Object.assign(tv, { Text: vc, Radio: Nw, Checkbox: kw });
function Wo(e, t) {
  if (e.contains) return e.contains(t);
  if (e.compareDocumentPosition)
    return e === t || !!(e.compareDocumentPosition(t) & 16);
}
function ya() {
  return p.exports.useState(null);
}
var nd = Object.prototype.hasOwnProperty;
function rd(e, t, n) {
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
          (o && typeof o == "object" && ((o = rd(t, o)), !o)) || !t.has(o))
        )
          return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r[0]),
          (o && typeof o == "object" && ((o = rd(t, o)), !o)) ||
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
          (nd.call(e, n) && ++r && !nd.call(t, n)) ||
          !(n in t) ||
          !Eo(e[n], t[n])
        )
          return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
function Cw(e) {
  var t = ic();
  return [
    e[0],
    p.exports.useCallback(
      function (n) {
        if (!!t()) return e[1](n);
      },
      [t, e[1]],
    ),
  ];
}
var tt = "top",
  St = "bottom",
  kt = "right",
  nt = "left",
  gc = "auto",
  nl = [tt, St, kt, nt],
  Dr = "start",
  Uo = "end",
  Rw = "clippingParents",
  nv = "viewport",
  oo = "popper",
  _w = "reference",
  od = nl.reduce(function (e, t) {
    return e.concat([t + "-" + Dr, t + "-" + Uo]);
  }, []),
  rv = [].concat(nl, [gc]).reduce(function (e, t) {
    return e.concat([t, t + "-" + Dr, t + "-" + Uo]);
  }, []),
  Ow = "beforeRead",
  Pw = "read",
  bw = "afterRead",
  Tw = "beforeMain",
  $w = "main",
  Lw = "afterMain",
  jw = "beforeWrite",
  Dw = "write",
  Mw = "afterWrite",
  Iw = [Ow, Pw, bw, Tw, $w, Lw, jw, Dw, Mw];
function Bt(e) {
  return e.split("-")[0];
}
function Ct(e) {
  if (e == null) return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function Zn(e) {
  var t = Ct(e).Element;
  return e instanceof t || e instanceof Element;
}
function Wt(e) {
  var t = Ct(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function yc(e) {
  if (typeof ShadowRoot > "u") return !1;
  var t = Ct(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var Gn = Math.max,
  xa = Math.min,
  Mr = Math.round;
function Hi() {
  var e = navigator.userAgentData;
  return e != null && e.brands
    ? e.brands
        .map(function (t) {
          return t.brand + "/" + t.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function ov() {
  return !/^((?!chrome|android).)*safari/i.test(Hi());
}
function Ir(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  var r = e.getBoundingClientRect(),
    o = 1,
    l = 1;
  t &&
    Wt(e) &&
    ((o = (e.offsetWidth > 0 && Mr(r.width) / e.offsetWidth) || 1),
    (l = (e.offsetHeight > 0 && Mr(r.height) / e.offsetHeight) || 1));
  var a = Zn(e) ? Ct(e) : window,
    i = a.visualViewport,
    u = !ov() && n,
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
function xc(e) {
  var t = Ir(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function lv(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && yc(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Tn(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function on(e) {
  return Ct(e).getComputedStyle(e);
}
function zw(e) {
  return ["table", "td", "th"].indexOf(Tn(e)) >= 0;
}
function Dn(e) {
  return ((Zn(e) ? e.ownerDocument : e.document) || window.document)
    .documentElement;
}
function Ka(e) {
  return Tn(e) === "html"
    ? e
    : e.assignedSlot || e.parentNode || (yc(e) ? e.host : null) || Dn(e);
}
function ld(e) {
  return !Wt(e) || on(e).position === "fixed" ? null : e.offsetParent;
}
function Aw(e) {
  var t = /firefox/i.test(Hi()),
    n = /Trident/i.test(Hi());
  if (n && Wt(e)) {
    var r = on(e);
    if (r.position === "fixed") return null;
  }
  var o = Ka(e);
  for (yc(o) && (o = o.host); Wt(o) && ["html", "body"].indexOf(Tn(o)) < 0; ) {
    var l = on(o);
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
  for (var t = Ct(e), n = ld(e); n && zw(n) && on(n).position === "static"; )
    n = ld(n);
  return n &&
    (Tn(n) === "html" || (Tn(n) === "body" && on(n).position === "static"))
    ? t
    : n || Aw(e) || t;
}
function Ec(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function wo(e, t, n) {
  return Gn(e, xa(t, n));
}
function Fw(e, t, n) {
  var r = wo(e, t, n);
  return r > n ? n : r;
}
function av() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function sv(e) {
  return Object.assign({}, av(), e);
}
function iv(e, t) {
  return t.reduce(function (n, r) {
    return (n[r] = e), n;
  }, {});
}
var Bw = function (t, n) {
  return (
    (t =
      typeof t == "function"
        ? t(Object.assign({}, n.rects, { placement: n.placement }))
        : t),
    sv(typeof t != "number" ? t : iv(t, nl))
  );
};
function Ww(e) {
  var t,
    n = e.state,
    r = e.name,
    o = e.options,
    l = n.elements.arrow,
    a = n.modifiersData.popperOffsets,
    i = Bt(n.placement),
    u = Ec(i),
    c = [nt, kt].indexOf(i) >= 0,
    f = c ? "height" : "width";
  if (!(!l || !a)) {
    var d = Bw(o.padding, n),
      h = xc(l),
      g = u === "y" ? tt : nt,
      E = u === "y" ? St : kt,
      x =
        n.rects.reference[f] + n.rects.reference[u] - a[u] - n.rects.popper[f],
      k = a[u] - n.rects.reference[u],
      v = rl(l),
      m = v ? (u === "y" ? v.clientHeight || 0 : v.clientWidth || 0) : 0,
      y = x / 2 - k / 2,
      w = d[g],
      N = m - h[f] - d[E],
      S = m / 2 - h[f] / 2 + y,
      C = wo(w, S, N),
      _ = u;
    n.modifiersData[r] = ((t = {}), (t[_] = C), (t.centerOffset = C - S), t);
  }
}
function Uw(e) {
  var t = e.state,
    n = e.options,
    r = n.element,
    o = r === void 0 ? "[data-popper-arrow]" : r;
  o != null &&
    ((typeof o == "string" && ((o = t.elements.popper.querySelector(o)), !o)) ||
      !lv(t.elements.popper, o) ||
      (t.elements.arrow = o));
}
const Hw = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: Ww,
  effect: Uw,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function zr(e) {
  return e.split("-")[1];
}
var Vw = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function Kw(e) {
  var t = e.x,
    n = e.y,
    r = window,
    o = r.devicePixelRatio || 1;
  return { x: Mr(t * o) / o || 0, y: Mr(n * o) / o || 0 };
}
function ad(e) {
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
    g = h === void 0 ? 0 : h,
    E = a.y,
    x = E === void 0 ? 0 : E,
    k = typeof f == "function" ? f({ x: g, y: x }) : { x: g, y: x };
  (g = k.x), (x = k.y);
  var v = a.hasOwnProperty("x"),
    m = a.hasOwnProperty("y"),
    y = nt,
    w = tt,
    N = window;
  if (c) {
    var S = rl(n),
      C = "clientHeight",
      _ = "clientWidth";
    if (
      (S === Ct(n) &&
        ((S = Dn(n)),
        on(S).position !== "static" &&
          i === "absolute" &&
          ((C = "scrollHeight"), (_ = "scrollWidth"))),
      (S = S),
      o === tt || ((o === nt || o === kt) && l === Uo))
    ) {
      w = St;
      var j = d && S === N && N.visualViewport ? N.visualViewport.height : S[C];
      (x -= j - r.height), (x *= u ? 1 : -1);
    }
    if (o === nt || ((o === tt || o === St) && l === Uo)) {
      y = kt;
      var D = d && S === N && N.visualViewport ? N.visualViewport.width : S[_];
      (g -= D - r.width), (g *= u ? 1 : -1);
    }
  }
  var A = Object.assign({ position: i }, c && Vw),
    K = f === !0 ? Kw({ x: g, y: x }) : { x: g, y: x };
  if (((g = K.x), (x = K.y), u)) {
    var G;
    return Object.assign(
      {},
      A,
      ((G = {}),
      (G[w] = m ? "0" : ""),
      (G[y] = v ? "0" : ""),
      (G.transform =
        (N.devicePixelRatio || 1) <= 1
          ? "translate(" + g + "px, " + x + "px)"
          : "translate3d(" + g + "px, " + x + "px, 0)"),
      G),
    );
  }
  return Object.assign(
    {},
    A,
    ((t = {}),
    (t[w] = m ? x + "px" : ""),
    (t[y] = v ? g + "px" : ""),
    (t.transform = ""),
    t),
  );
}
function Gw(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    o = r === void 0 ? !0 : r,
    l = n.adaptive,
    a = l === void 0 ? !0 : l,
    i = n.roundOffsets,
    u = i === void 0 ? !0 : i,
    c = {
      placement: Bt(t.placement),
      variation: zr(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
      isFixed: t.options.strategy === "fixed",
    };
  t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      ad(
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
        ad(
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
const Qw = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Gw,
  data: {},
};
var kl = { passive: !0 };
function qw(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    o = r.scroll,
    l = o === void 0 ? !0 : o,
    a = r.resize,
    i = a === void 0 ? !0 : a,
    u = Ct(t.elements.popper),
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
const Yw = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: qw,
  data: {},
};
var Xw = { left: "right", right: "left", bottom: "top", top: "bottom" };
function Fl(e) {
  return e.replace(/left|right|bottom|top/g, function (t) {
    return Xw[t];
  });
}
var Jw = { start: "end", end: "start" };
function sd(e) {
  return e.replace(/start|end/g, function (t) {
    return Jw[t];
  });
}
function wc(e) {
  var t = Ct(e),
    n = t.pageXOffset,
    r = t.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function Sc(e) {
  return Ir(Dn(e)).left + wc(e).scrollLeft;
}
function Zw(e, t) {
  var n = Ct(e),
    r = Dn(e),
    o = n.visualViewport,
    l = r.clientWidth,
    a = r.clientHeight,
    i = 0,
    u = 0;
  if (o) {
    (l = o.width), (a = o.height);
    var c = ov();
    (c || (!c && t === "fixed")) && ((i = o.offsetLeft), (u = o.offsetTop));
  }
  return { width: l, height: a, x: i + Sc(e), y: u };
}
function eS(e) {
  var t,
    n = Dn(e),
    r = wc(e),
    o = (t = e.ownerDocument) == null ? void 0 : t.body,
    l = Gn(
      n.scrollWidth,
      n.clientWidth,
      o ? o.scrollWidth : 0,
      o ? o.clientWidth : 0,
    ),
    a = Gn(
      n.scrollHeight,
      n.clientHeight,
      o ? o.scrollHeight : 0,
      o ? o.clientHeight : 0,
    ),
    i = -r.scrollLeft + Sc(e),
    u = -r.scrollTop;
  return (
    on(o || n).direction === "rtl" &&
      (i += Gn(n.clientWidth, o ? o.clientWidth : 0) - l),
    { width: l, height: a, x: i, y: u }
  );
}
function kc(e) {
  var t = on(e),
    n = t.overflow,
    r = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function uv(e) {
  return ["html", "body", "#document"].indexOf(Tn(e)) >= 0
    ? e.ownerDocument.body
    : Wt(e) && kc(e)
      ? e
      : uv(Ka(e));
}
function So(e, t) {
  var n;
  t === void 0 && (t = []);
  var r = uv(e),
    o = r === ((n = e.ownerDocument) == null ? void 0 : n.body),
    l = Ct(r),
    a = o ? [l].concat(l.visualViewport || [], kc(r) ? r : []) : r,
    i = t.concat(a);
  return o ? i : i.concat(So(Ka(a)));
}
function Vi(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function tS(e, t) {
  var n = Ir(e, !1, t === "fixed");
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
function id(e, t, n) {
  return t === nv ? Vi(Zw(e, n)) : Zn(t) ? tS(t, n) : Vi(eS(Dn(e)));
}
function nS(e) {
  var t = So(Ka(e)),
    n = ["absolute", "fixed"].indexOf(on(e).position) >= 0,
    r = n && Wt(e) ? rl(e) : e;
  return Zn(r)
    ? t.filter(function (o) {
        return Zn(o) && lv(o, r) && Tn(o) !== "body";
      })
    : [];
}
function rS(e, t, n, r) {
  var o = t === "clippingParents" ? nS(e) : [].concat(t),
    l = [].concat(o, [n]),
    a = l[0],
    i = l.reduce(
      function (u, c) {
        var f = id(e, c, r);
        return (
          (u.top = Gn(f.top, u.top)),
          (u.right = xa(f.right, u.right)),
          (u.bottom = xa(f.bottom, u.bottom)),
          (u.left = Gn(f.left, u.left)),
          u
        );
      },
      id(e, a, r),
    );
  return (
    (i.width = i.right - i.left),
    (i.height = i.bottom - i.top),
    (i.x = i.left),
    (i.y = i.top),
    i
  );
}
function cv(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    o = r ? Bt(r) : null,
    l = r ? zr(r) : null,
    a = t.x + t.width / 2 - n.width / 2,
    i = t.y + t.height / 2 - n.height / 2,
    u;
  switch (o) {
    case tt:
      u = { x: a, y: t.y - n.height };
      break;
    case St:
      u = { x: a, y: t.y + t.height };
      break;
    case kt:
      u = { x: t.x + t.width, y: i };
      break;
    case nt:
      u = { x: t.x - n.width, y: i };
      break;
    default:
      u = { x: t.x, y: t.y };
  }
  var c = o ? Ec(o) : null;
  if (c != null) {
    var f = c === "y" ? "height" : "width";
    switch (l) {
      case Dr:
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
    u = i === void 0 ? Rw : i,
    c = n.rootBoundary,
    f = c === void 0 ? nv : c,
    d = n.elementContext,
    h = d === void 0 ? oo : d,
    g = n.altBoundary,
    E = g === void 0 ? !1 : g,
    x = n.padding,
    k = x === void 0 ? 0 : x,
    v = sv(typeof k != "number" ? k : iv(k, nl)),
    m = h === oo ? _w : oo,
    y = e.rects.popper,
    w = e.elements[E ? m : h],
    N = rS(Zn(w) ? w : w.contextElement || Dn(e.elements.popper), u, f, a),
    S = Ir(e.elements.reference),
    C = cv({ reference: S, element: y, strategy: "absolute", placement: o }),
    _ = Vi(Object.assign({}, y, C)),
    j = h === oo ? _ : S,
    D = {
      top: N.top - j.top + v.top,
      bottom: j.bottom - N.bottom + v.bottom,
      left: N.left - j.left + v.left,
      right: j.right - N.right + v.right,
    },
    A = e.modifiersData.offset;
  if (h === oo && A) {
    var K = A[o];
    Object.keys(D).forEach(function (G) {
      var P = [kt, St].indexOf(G) >= 0 ? 1 : -1,
        M = [tt, St].indexOf(G) >= 0 ? "y" : "x";
      D[G] += K[M] * P;
    });
  }
  return D;
}
function oS(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = n.boundary,
    l = n.rootBoundary,
    a = n.padding,
    i = n.flipVariations,
    u = n.allowedAutoPlacements,
    c = u === void 0 ? rv : u,
    f = zr(r),
    d = f
      ? i
        ? od
        : od.filter(function (E) {
            return zr(E) === f;
          })
      : nl,
    h = d.filter(function (E) {
      return c.indexOf(E) >= 0;
    });
  h.length === 0 && (h = d);
  var g = h.reduce(function (E, x) {
    return (
      (E[x] = Ho(e, { placement: x, boundary: o, rootBoundary: l, padding: a })[
        Bt(x)
      ]),
      E
    );
  }, {});
  return Object.keys(g).sort(function (E, x) {
    return g[E] - g[x];
  });
}
function lS(e) {
  if (Bt(e) === gc) return [];
  var t = Fl(e);
  return [sd(e), t, sd(t)];
}
function aS(e) {
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
        g = n.flipVariations,
        E = g === void 0 ? !0 : g,
        x = n.allowedAutoPlacements,
        k = t.options.placement,
        v = Bt(k),
        m = v === k,
        y = u || (m || !E ? [Fl(k)] : lS(k)),
        w = [k].concat(y).reduce(function (z, V) {
          return z.concat(
            Bt(V) === gc
              ? oS(t, {
                  placement: V,
                  boundary: f,
                  rootBoundary: d,
                  padding: c,
                  flipVariations: E,
                  allowedAutoPlacements: x,
                })
              : V,
          );
        }, []),
        N = t.rects.reference,
        S = t.rects.popper,
        C = new Map(),
        _ = !0,
        j = w[0],
        D = 0;
      D < w.length;
      D++
    ) {
      var A = w[D],
        K = Bt(A),
        G = zr(A) === Dr,
        P = [tt, St].indexOf(K) >= 0,
        M = P ? "width" : "height",
        F = Ho(t, {
          placement: A,
          boundary: f,
          rootBoundary: d,
          altBoundary: h,
          padding: c,
        }),
        Q = P ? (G ? kt : nt) : G ? St : tt;
      N[M] > S[M] && (Q = Fl(Q));
      var O = Fl(Q),
        I = [];
      if (
        (l && I.push(F[K] <= 0),
        i && I.push(F[Q] <= 0, F[O] <= 0),
        I.every(function (z) {
          return z;
        }))
      ) {
        (j = A), (_ = !1);
        break;
      }
      C.set(A, I);
    }
    if (_)
      for (
        var $ = E ? 3 : 1,
          B = function (V) {
            var q = w.find(function (X) {
              var ue = C.get(X);
              if (ue)
                return ue.slice(0, V).every(function (ne) {
                  return ne;
                });
            });
            if (q) return (j = q), "break";
          },
          H = $;
        H > 0;
        H--
      ) {
        var b = B(H);
        if (b === "break") break;
      }
    t.placement !== j &&
      ((t.modifiersData[r]._skip = !0), (t.placement = j), (t.reset = !0));
  }
}
const sS = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: aS,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function ud(e, t, n) {
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
function cd(e) {
  return [tt, kt, St, nt].some(function (t) {
    return e[t] >= 0;
  });
}
function iS(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    o = t.rects.popper,
    l = t.modifiersData.preventOverflow,
    a = Ho(t, { elementContext: "reference" }),
    i = Ho(t, { altBoundary: !0 }),
    u = ud(a, r),
    c = ud(i, o, l),
    f = cd(u),
    d = cd(c);
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
const uS = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: iS,
};
function cS(e, t, n) {
  var r = Bt(e),
    o = [nt, tt].indexOf(r) >= 0 ? -1 : 1,
    l = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n,
    a = l[0],
    i = l[1];
  return (
    (a = a || 0),
    (i = (i || 0) * o),
    [nt, kt].indexOf(r) >= 0 ? { x: i, y: a } : { x: a, y: i }
  );
}
function fS(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.offset,
    l = o === void 0 ? [0, 0] : o,
    a = rv.reduce(function (f, d) {
      return (f[d] = cS(d, t.rects, l)), f;
    }, {}),
    i = a[t.placement],
    u = i.x,
    c = i.y;
  t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += u),
    (t.modifiersData.popperOffsets.y += c)),
    (t.modifiersData[r] = a);
}
const dS = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: fS,
};
function pS(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = cv({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement,
  });
}
const mS = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: pS,
  data: {},
};
function hS(e) {
  return e === "x" ? "y" : "x";
}
function vS(e) {
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
    g = h === void 0 ? !0 : h,
    E = n.tetherOffset,
    x = E === void 0 ? 0 : E,
    k = Ho(t, { boundary: u, rootBoundary: c, padding: d, altBoundary: f }),
    v = Bt(t.placement),
    m = zr(t.placement),
    y = !m,
    w = Ec(v),
    N = hS(w),
    S = t.modifiersData.popperOffsets,
    C = t.rects.reference,
    _ = t.rects.popper,
    j =
      typeof x == "function"
        ? x(Object.assign({}, t.rects, { placement: t.placement }))
        : x,
    D =
      typeof j == "number"
        ? { mainAxis: j, altAxis: j }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, j),
    A = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    K = { x: 0, y: 0 };
  if (!!S) {
    if (l) {
      var G,
        P = w === "y" ? tt : nt,
        M = w === "y" ? St : kt,
        F = w === "y" ? "height" : "width",
        Q = S[w],
        O = Q + k[P],
        I = Q - k[M],
        $ = g ? -_[F] / 2 : 0,
        B = m === Dr ? C[F] : _[F],
        H = m === Dr ? -_[F] : -C[F],
        b = t.elements.arrow,
        z = g && b ? xc(b) : { width: 0, height: 0 },
        V = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : av(),
        q = V[P],
        X = V[M],
        ue = wo(0, C[F], z[F]),
        ne = y ? C[F] / 2 - $ - ue - q - D.mainAxis : B - ue - q - D.mainAxis,
        de = y ? -C[F] / 2 + $ + ue + X + D.mainAxis : H + ue + X + D.mainAxis,
        Re = t.elements.arrow && rl(t.elements.arrow),
        Be = Re ? (w === "y" ? Re.clientTop || 0 : Re.clientLeft || 0) : 0,
        le = (G = A == null ? void 0 : A[w]) != null ? G : 0,
        Ut = Q + ne - le - Be,
        U = Q + de - le,
        J = wo(g ? xa(O, Ut) : O, Q, g ? Gn(I, U) : I);
      (S[w] = J), (K[w] = J - Q);
    }
    if (i) {
      var ae,
        ce = w === "x" ? tt : nt,
        Se = w === "x" ? St : kt,
        se = S[N],
        ee = N === "y" ? "height" : "width",
        rt = se + k[ce],
        qe = se - k[Se],
        De = [tt, nt].indexOf(v) !== -1,
        re = (ae = A == null ? void 0 : A[N]) != null ? ae : 0,
        dt = De ? rt : se - C[ee] - _[ee] - re + D.altAxis,
        In = De ? se + C[ee] + _[ee] - re - D.altAxis : qe,
        jc = g && De ? Fw(dt, se, In) : wo(g ? dt : rt, se, g ? In : qe);
      (S[N] = jc), (K[N] = jc - se);
    }
    t.modifiersData[r] = K;
  }
}
const gS = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: vS,
  requiresIfExists: ["offset"],
};
function yS(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function xS(e) {
  return e === Ct(e) || !Wt(e) ? wc(e) : yS(e);
}
function ES(e) {
  var t = e.getBoundingClientRect(),
    n = Mr(t.width) / e.offsetWidth || 1,
    r = Mr(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function wS(e, t, n) {
  n === void 0 && (n = !1);
  var r = Wt(t),
    o = Wt(t) && ES(t),
    l = Dn(t),
    a = Ir(e, o, n),
    i = { scrollLeft: 0, scrollTop: 0 },
    u = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((Tn(t) !== "body" || kc(l)) && (i = xS(t)),
      Wt(t)
        ? ((u = Ir(t, !0)), (u.x += t.clientLeft), (u.y += t.clientTop))
        : l && (u.x = Sc(l))),
    {
      x: a.left + i.scrollLeft - u.x,
      y: a.top + i.scrollTop - u.y,
      width: a.width,
      height: a.height,
    }
  );
}
function SS(e) {
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
function kS(e) {
  var t = SS(e);
  return Iw.reduce(function (n, r) {
    return n.concat(
      t.filter(function (o) {
        return o.phase === r;
      }),
    );
  }, []);
}
function NS(e) {
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
function CS(e) {
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
var fd = { placement: "bottom", modifiers: [], strategy: "absolute" };
function dd() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return !t.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function RS(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    o = t.defaultOptions,
    l = o === void 0 ? fd : o;
  return function (i, u, c) {
    c === void 0 && (c = l);
    var f = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, fd, l),
        modifiersData: {},
        elements: { reference: i, popper: u },
        attributes: {},
        styles: {},
      },
      d = [],
      h = !1,
      g = {
        state: f,
        setOptions: function (v) {
          var m = typeof v == "function" ? v(f.options) : v;
          x(),
            (f.options = Object.assign({}, l, f.options, m)),
            (f.scrollParents = {
              reference: Zn(i)
                ? So(i)
                : i.contextElement
                  ? So(i.contextElement)
                  : [],
              popper: So(u),
            });
          var y = kS(CS([].concat(r, f.options.modifiers)));
          return (
            (f.orderedModifiers = y.filter(function (w) {
              return w.enabled;
            })),
            E(),
            g.update()
          );
        },
        forceUpdate: function () {
          if (!h) {
            var v = f.elements,
              m = v.reference,
              y = v.popper;
            if (!!dd(m, y)) {
              (f.rects = {
                reference: wS(m, rl(y), f.options.strategy === "fixed"),
                popper: xc(y),
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
                var N = f.orderedModifiers[w],
                  S = N.fn,
                  C = N.options,
                  _ = C === void 0 ? {} : C,
                  j = N.name;
                typeof S == "function" &&
                  (f = S({ state: f, options: _, name: j, instance: g }) || f);
              }
            }
          }
        },
        update: NS(function () {
          return new Promise(function (k) {
            g.forceUpdate(), k(f);
          });
        }),
        destroy: function () {
          x(), (h = !0);
        },
      };
    if (!dd(i, u)) return g;
    g.setOptions(c).then(function (k) {
      !h && c.onFirstUpdate && c.onFirstUpdate(k);
    });
    function E() {
      f.orderedModifiers.forEach(function (k) {
        var v = k.name,
          m = k.options,
          y = m === void 0 ? {} : m,
          w = k.effect;
        if (typeof w == "function") {
          var N = w({ state: f, name: v, instance: g, options: y }),
            S = function () {};
          d.push(N || S);
        }
      });
    }
    function x() {
      d.forEach(function (k) {
        return k();
      }),
        (d = []);
    }
    return g;
  };
}
const _S = RS({ defaultModifiers: [uS, mS, Qw, Yw, dS, sS, gS, Hw] }),
  OS = ["enabled", "placement", "strategy", "modifiers"];
function PS(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const bS = {
    name: "applyStyles",
    enabled: !1,
    phase: "afterWrite",
    fn: () => {},
  },
  TS = {
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
  $S = [];
function LS(e, t, n = {}) {
  let {
      enabled: r = !0,
      placement: o = "bottom",
      strategy: l = "absolute",
      modifiers: a = $S,
    } = n,
    i = PS(n, OS);
  const u = p.exports.useRef(a),
    c = p.exports.useRef(),
    f = p.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.update();
    }, []),
    d = p.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.forceUpdate();
    }, []),
    [h, g] = Cw(
      p.exports.useState({
        placement: o,
        update: f,
        forceUpdate: d,
        attributes: {},
        styles: { popper: {}, arrow: {} },
      }),
    ),
    E = p.exports.useMemo(
      () => ({
        name: "updateStateModifier",
        enabled: !0,
        phase: "write",
        requires: ["computeStyles"],
        fn: ({ state: k }) => {
          const v = {},
            m = {};
          Object.keys(k.elements).forEach((y) => {
            (v[y] = k.styles[y]), (m[y] = k.attributes[y]);
          }),
            g({
              state: k,
              styles: v,
              attributes: m,
              update: f,
              forceUpdate: d,
              placement: k.placement,
            });
        },
      }),
      [f, d, g],
    ),
    x = p.exports.useMemo(
      () => (Eo(u.current, a) || (u.current = a), u.current),
      [a],
    );
  return (
    p.exports.useEffect(() => {
      !c.current ||
        !r ||
        c.current.setOptions({
          placement: o,
          strategy: l,
          modifiers: [...x, E, bS],
        });
    }, [l, o, E, r, x]),
    p.exports.useEffect(() => {
      if (!(!r || e == null || t == null))
        return (
          (c.current = _S(
            e,
            t,
            Object.assign({}, i, {
              placement: o,
              strategy: l,
              modifiers: [...x, TS, E],
            }),
          )),
          () => {
            c.current != null &&
              (c.current.destroy(),
              (c.current = void 0),
              g((k) =>
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
const pd = () => {};
function jS(e) {
  return e.button === 0;
}
function DS(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const Bl = (e) => e && ("current" in e ? e.current : e),
  md = { click: "mousedown", mouseup: "mousedown", pointerup: "pointerdown" };
function MS(e, t = pd, { disabled: n, clickTrigger: r = "click" } = {}) {
  const o = p.exports.useRef(!1),
    l = p.exports.useRef(!1),
    a = p.exports.useCallback(
      (c) => {
        const f = Bl(e);
        (o.current = !f || DS(c) || !jS(c) || !!Wo(f, c.target) || l.current),
          (l.current = !1);
      },
      [e],
    ),
    i = Ve((c) => {
      const f = Bl(e);
      f && Wo(f, c.target) && (l.current = !0);
    }),
    u = Ve((c) => {
      o.current || t(c);
    });
  p.exports.useEffect(() => {
    if (n || e == null) return;
    const c = Vr(Bl(e));
    let f = (c.defaultView || window).event,
      d = null;
    md[r] && (d = Qt(c, md[r], i, !0));
    const h = Qt(c, r, a, !0),
      g = Qt(c, r, (x) => {
        if (x === f) {
          f = void 0;
          return;
        }
        u(x);
      });
    let E = [];
    return (
      "ontouchstart" in c.documentElement &&
        (E = [].slice.call(c.body.children).map((x) => Qt(x, "mousemove", pd))),
      () => {
        d == null || d(), h(), g(), E.forEach((x) => x());
      }
    );
  }, [e, n, r, a, i, u]);
}
const IS = 27,
  zS = () => {};
function AS(e, t, { disabled: n, clickTrigger: r } = {}) {
  const o = t || zS;
  MS(e, o, { disabled: n, clickTrigger: r });
  const l = Ve((a) => {
    a.keyCode === IS && o(a);
  });
  p.exports.useEffect(() => {
    if (n || e == null) return;
    const a = Vr(Bl(e));
    let i = (a.defaultView || window).event;
    const u = Qt(a, "keyup", (c) => {
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
const fv = p.exports.createContext(Kr ? window : void 0);
fv.Provider;
function dv() {
  return p.exports.useContext(fv);
}
const Cs = (e, t) =>
  Kr
    ? e == null
      ? (t || Vr()).body
      : (typeof e == "function" && (e = e()),
        e && "current" in e && (e = e.current),
        e && ("nodeType" in e || e.getBoundingClientRect) ? e : null)
    : null;
function Ki(e, t) {
  const n = dv(),
    [r, o] = p.exports.useState(() => Cs(e, n == null ? void 0 : n.document));
  if (!r) {
    const l = Cs(e);
    l && o(l);
  }
  return (
    p.exports.useEffect(() => {
      t && r && t(r);
    }, [t, r]),
    p.exports.useEffect(() => {
      const l = Cs(e);
      l !== r && o(l);
    }, [e, r]),
    r
  );
}
function FS(e) {
  const t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach((n) => {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function BS(e = {}) {
  return Array.isArray(e)
    ? e
    : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
}
function WS({
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
  var c, f, d, h, g;
  const E = FS(u.modifiers);
  return Object.assign({}, u, {
    placement: n,
    enabled: e,
    strategy: l ? "fixed" : u.strategy,
    modifiers: BS(
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
            (g = E.arrow) == null ? void 0 : g.options,
            { element: i },
          ),
        }),
        flip: Object.assign({ enabled: !!r }, E.flip),
      }),
    ),
  });
}
const pv = p.exports.forwardRef((e, t) => {
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
    g = Ki(e.container),
    E = Ki(e.target),
    [x, k] = p.exports.useState(!e.show),
    v = LS(
      E,
      u,
      WS({
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
  const m = (...N) => {
      k(!0), e.onExited && e.onExited(...N);
    },
    y = e.show || (i && !x);
  if (
    (AS(u, e.onHide, {
      disabled: !e.rootClose || e.rootCloseDisabled,
      clickTrigger: e.rootCloseEvent,
    }),
    !y)
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
      onExit: N,
      onExiting: S,
      onEnter: C,
      onEntering: _,
      onEntered: j,
    } = e;
    w = T.exports.jsx(i, {
      in: e.show,
      appear: !0,
      onExit: N,
      onExiting: S,
      onExited: m,
      onEnter: C,
      onEntering: _,
      onEntered: j,
      children: w,
    });
  }
  return g ? Hn.createPortal(w, g) : null;
});
pv.displayName = "Overlay";
var US =
    typeof global < "u" &&
    global.navigator &&
    global.navigator.product === "ReactNative",
  HS = typeof document < "u";
const VS = HS || US ? p.exports.useLayoutEffect : p.exports.useEffect;
function mv(e, t) {
  return e.classList
    ? !!t && e.classList.contains(t)
    : (" " + (e.className.baseVal || e.className) + " ").indexOf(
        " " + t + " ",
      ) !== -1;
}
const KS = je("popover-header"),
  hv = je("popover-body");
function vv(e, t) {
  let n = e;
  return (
    e === "left"
      ? (n = t ? "end" : "start")
      : e === "right" && (n = t ? "start" : "end"),
    n
  );
}
const GS = { placement: "right" },
  gv = p.exports.forwardRef(
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
      const d = te(e, "popover"),
        h = Ju(),
        [g] = (t == null ? void 0 : t.split("-")) || [],
        E = vv(g, h);
      return T.exports.jsxs("div", {
        ref: f,
        role: "tooltip",
        style: r,
        "x-placement": g,
        className: Y(n, d, g && `bs-popover-${E}`),
        ...c,
        children: [
          T.exports.jsx("div", { className: "popover-arrow", ...a }),
          l ? T.exports.jsx(hv, { children: o }) : o,
        ],
      });
    },
  );
gv.defaultProps = GS;
const QS = Object.assign(gv, { Header: KS, Body: hv, POPPER_OFFSET: [0, 8] });
function qS(e) {
  const t = p.exports.useRef(null),
    n = te(void 0, "popover"),
    r = p.exports.useMemo(
      () => ({
        name: "offset",
        options: {
          offset: () =>
            t.current && mv(t.current, n) ? e || QS.POPPER_OFFSET : e || [0, 0],
        },
      }),
      [e, n],
    );
  return [t, [r]];
}
const YS = { transition: fn, rootClose: !1, show: !1, placement: "top" };
function XS(e, t) {
  const { ref: n } = e,
    { ref: r } = t;
  (e.ref = n.__wrapped || (n.__wrapped = (o) => n(pa(o)))),
    (t.ref = r.__wrapped || (r.__wrapped = (o) => r(pa(o))));
}
const Nc = p.exports.forwardRef(
  ({ children: e, transition: t, popperConfig: n = {}, ...r }, o) => {
    const l = p.exports.useRef({}),
      [a, i] = ya(),
      [u, c] = qS(r.offset),
      f = Zo(o, u),
      d = t === !0 ? fn : t || void 0,
      h = Ve((g) => {
        i(g), n == null || n.onFirstUpdate == null || n.onFirstUpdate(g);
      });
    return (
      VS(() => {
        a && (l.current.scheduleUpdate == null || l.current.scheduleUpdate());
      }, [a]),
      T.exports.jsx(pv, {
        ...r,
        ref: f,
        popperConfig: {
          ...n,
          modifiers: c.concat(n.modifiers || []),
          onFirstUpdate: h,
        },
        transition: d,
        children: (g, { arrowProps: E, popper: x, show: k }) => {
          var v, m;
          XS(g, E);
          const y = x == null ? void 0 : x.placement,
            w = Object.assign(l.current, {
              state: x == null ? void 0 : x.state,
              scheduleUpdate: x == null ? void 0 : x.update,
              placement: y,
              outOfBoundaries:
                (x == null ||
                (v = x.state) == null ||
                (m = v.modifiersData.hide) == null
                  ? void 0
                  : m.isReferenceHidden) || !1,
            });
          return typeof e == "function"
            ? e({
                ...g,
                placement: y,
                show: k,
                ...(!t && k && { className: "show" }),
                popper: w,
                arrowProps: E,
              })
            : p.exports.cloneElement(e, {
                ...g,
                placement: y,
                arrowProps: E,
                popper: w,
                className: Y(e.props.className, !t && k && "show"),
                style: { ...e.props.style, ...g.style },
              });
        },
      })
    );
  },
);
Nc.displayName = "Overlay";
Nc.defaultProps = YS;
function JS(e) {
  return e && typeof e == "object" ? e : { show: e, hide: e };
}
function hd(e, t, n) {
  const [r] = t,
    o = r.currentTarget,
    l = r.relatedTarget || r.nativeEvent[n];
  (!l || l !== o) && !Wo(o, l) && e(...t);
}
const ZS = { defaultShow: !1, trigger: ["hover", "focus"] };
function Cc({
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
  const d = p.exports.useRef(null),
    h = Zo(d, n.ref),
    g = Bh(),
    E = p.exports.useRef(""),
    [x, k] = Oh(o, l, a),
    v = JS(i),
    {
      onFocus: m,
      onBlur: y,
      onClick: w,
    } = typeof n != "function" ? p.exports.Children.only(n).props : {},
    N = (M) => {
      h(pa(M));
    },
    S = p.exports.useCallback(() => {
      if ((g.clear(), (E.current = "show"), !v.show)) {
        k(!0);
        return;
      }
      g.set(() => {
        E.current === "show" && k(!0);
      }, v.show);
    }, [v.show, k, g]),
    C = p.exports.useCallback(() => {
      if ((g.clear(), (E.current = "hide"), !v.hide)) {
        k(!1);
        return;
      }
      g.set(() => {
        E.current === "hide" && k(!1);
      }, v.hide);
    }, [v.hide, k, g]),
    _ = p.exports.useCallback(
      (...M) => {
        S(), m == null || m(...M);
      },
      [S, m],
    ),
    j = p.exports.useCallback(
      (...M) => {
        C(), y == null || y(...M);
      },
      [C, y],
    ),
    D = p.exports.useCallback(
      (...M) => {
        k(!x), w == null || w(...M);
      },
      [w, k, x],
    ),
    A = p.exports.useCallback(
      (...M) => {
        hd(S, M, "fromElement");
      },
      [S],
    ),
    K = p.exports.useCallback(
      (...M) => {
        hd(C, M, "toElement");
      },
      [C],
    ),
    G = e == null ? [] : [].concat(e),
    P = { ref: N };
  return (
    G.indexOf("click") !== -1 && (P.onClick = D),
    G.indexOf("focus") !== -1 && ((P.onFocus = _), (P.onBlur = j)),
    G.indexOf("hover") !== -1 && ((P.onMouseOver = A), (P.onMouseOut = K)),
    T.exports.jsxs(T.exports.Fragment, {
      children: [
        typeof n == "function" ? n(P) : p.exports.cloneElement(n, P),
        T.exports.jsx(Nc, {
          ...f,
          show: x,
          onHide: C,
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
Cc.defaultProps = ZS;
const ek = { placement: "right" },
  Ga = p.exports.forwardRef(
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
      e = te(e, "tooltip");
      const f = Ju(),
        [d] = (t == null ? void 0 : t.split("-")) || [],
        h = vv(d, f);
      return T.exports.jsxs("div", {
        ref: c,
        style: r,
        role: "tooltip",
        "x-placement": d,
        className: Y(n, e, `bs-tooltip-${h}`),
        ...u,
        children: [
          T.exports.jsx("div", { className: "tooltip-arrow", ...l }),
          T.exports.jsx("div", { className: `${e}-inner`, children: o }),
        ],
      });
    },
  );
Ga.defaultProps = ek;
Ga.displayName = "Tooltip";
function Mn({ onClick: e, disabled: t }) {
  return s.createElement(
    Cc,
    {
      placement: "top",
      overlay: s.createElement(Ga, null, "Reset to default"),
    },
    s.createElement(
      st,
      { variant: "outline-secondary", size: "sm", onClick: e, disabled: t },
      "\u21BA",
    ),
  );
}
function tk({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
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
    g = n === d,
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
    s.createElement(Mn, { onClick: () => o(e), disabled: g }),
  );
}
function nk({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
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
    s.createElement(Mn, { onClick: () => o(e), disabled: i }),
  );
}
function rk({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
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
    s.createElement(Mn, { onClick: () => o(e), disabled: a }),
  );
}
function ok({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
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
    s.createElement(Mn, { onClick: () => o(e), disabled: a }),
  );
}
function lk({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
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
    s.createElement(Mn, { onClick: () => o(e), disabled: a }),
  );
}
function ak({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: a, spec: i } = e,
    { unit: u, scale: c, step: f, min: d, max: h } = i || {},
    g = a ? parseFloat(a) : 0,
    E = t != null ? t : g,
    x = zt(E, c),
    k = t == null,
    v = (N) => {
      const S = N.target.value,
        C = ga(S, c);
      n(l, C);
    },
    m = zt(d, c),
    y = zt(h, c),
    w = zt(f, c);
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "number",
      value: x,
      onChange: v,
      step: w || "any",
      min: m,
      max: y,
      disabled: o,
    }),
    u && s.createElement(he.Text, null, u),
    o &&
      s.createElement(
        he.Text,
        { className: "text-muted" },
        s.createElement("small", null, "Scanned"),
      ),
    s.createElement(Mn, { onClick: () => r(l), disabled: k || o }),
  );
}
function sk({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: a, spec: i } = e,
    { unit: u, scale: c, step: f, min: d, max: h } = i || {},
    g = a ? parseInt(a) : 0,
    E = t != null ? t : g,
    x = zt(E, c),
    k = t == null,
    v = (N) => {
      const S = N.target.value,
        C = ga(S, c),
        _ = typeof C == "number" ? Math.round(C) : C;
      n(l, _);
    },
    m = zt(d, c),
    y = zt(h, c),
    w = zt(f, c);
  return s.createElement(
    he,
    { size: "sm" },
    s.createElement(Z.Control, {
      type: "number",
      value: x,
      onChange: v,
      step: w || 1,
      min: m,
      max: y,
      disabled: o,
    }),
    u && s.createElement(he.Text, null, u),
    o &&
      s.createElement(
        he.Text,
        { className: "text-muted" },
        s.createElement("small", null, "Scanned"),
      ),
    s.createElement(Mn, { onClick: () => r(l), disabled: k || o }),
  );
}
function ik({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
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
    s.createElement(Mn, { onClick: () => r(l), disabled: d || o }),
  );
}
function uk(e) {
  switch (e) {
    case "NumberValue":
      return tk;
    case "EnumerationValue":
      return nk;
    case "BooleanValue":
      return rk;
    case "StringValue":
      return ok;
    case "PYONValue":
    default:
      return lk;
  }
}
function ck({ name: e, argInfo: t, value: n, onChange: r, onReset: o }) {
  const [l, a, i] = t,
    u = uk(l.ty),
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
            Cc,
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
function fk(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o] = r;
    o && o.default !== void 0 && (t[n] = o.default);
  }
  return t;
}
function dk(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o, l] = r,
      a = l || "General";
    t[a] || (t[a] = []), t[a].push({ name: n, argData: r });
  }
  return t;
}
function yv(e, t) {
  return `artiq_exp_state_${e}_${t}`;
}
function xv(e, t, n) {
  const r = yv(e, t);
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch (o) {
    console.error("Error saving experiment state to localStorage:", o);
  }
}
function Gi(e, t) {
  const n = yv(e, t);
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
function pk(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    a = s.useMemo(() => fk(o), [o]),
    [i, u] = s.useState(() => {
      var _;
      const C = Gi(n, r);
      return (_ = C == null ? void 0 : C.argValues) != null ? _ : a;
    }),
    [c, f] = s.useState(() => {
      var _;
      const C = Gi(n, r);
      return (_ = C == null ? void 0 : C.pipeline) != null ? _ : "main";
    }),
    [d, h] = s.useState(!1),
    [g, E] = s.useState("");
  s.useEffect(() => {
    xv(n, r, { argValues: i, pipeline: c });
  }, [n, r, i, c]);
  const x = s.useMemo(() => dk(o), [o]),
    k = o && Object.keys(o).length > 0,
    v = (C, _) => {
      u((j) => ({ ...j, [C]: _ }));
    },
    m = (C) => {
      u((_) => ({ ..._, [C]: a[C] }));
    },
    y = () => {
      u(a);
    },
    w = (C) => {
      E(C), h(!0);
    },
    N = (C, _) =>
      s.createElement(
        "tr",
        { key: C },
        s.createElement("td", null, s.createElement("b", null, C, ":")),
        s.createElement("td", null, _),
      ),
    S = () => i;
  return s.createElement(
    lt,
    { className: "submission-card" },
    s.createElement(
      lt.Header,
      { className: "submission-card__header" },
      s.createElement(
        "div",
        { className: "submission-card__head-meta" },
        s.createElement("span", { className: "submission-card__class" }, r),
        s.createElement("span", { className: "submission-card__file" }, n),
      ),
    ),
    s.createElement(
      lt.Body,
      { className: "submission-card__body" },
      s.createElement(
        ma,
        { className: "schedule-detail-table mb-4" },
        s.createElement(
          "tbody",
          null,
          N("Name", t),
          N("Class", r),
          N("File", n),
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
              st,
              { variant: "outline-primary", size: "sm", onClick: y },
              "Reset to defaults",
            ),
          ),
          Object.entries(x).map(([C, _]) =>
            s.createElement(
              "div",
              { key: C, className: "arg-group" },
              s.createElement("div", { className: "arg-group__title" }, C),
              s.createElement(
                "div",
                { className: "arg-group__body" },
                _.map(({ name: j, argData: D }) =>
                  s.createElement(ck, {
                    key: j,
                    name: j,
                    argInfo: D,
                    value: i[j],
                    onChange: v,
                    onReset: m,
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
          onChange: (C) => f(C.target.value),
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
        s.createElement(Jh, {
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
        fc,
        { position: "bottom-end", className: "p-3" },
        s.createElement(
          _r,
          {
            show: d,
            onClose: () => h(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          s.createElement(
            _r.Header,
            null,
            s.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          s.createElement(_r.Body, { className: "text-white" }, g),
        ),
      ),
    ),
  );
}
const mk = { bg: "primary", pill: !1 },
  Rc = p.exports.forwardRef(
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
      const u = te(e, "badge");
      return T.exports.jsx(l, {
        ref: i,
        ...a,
        className: Y(
          o,
          u,
          n && "rounded-pill",
          r && `text-${r}`,
          t && `bg-${t}`,
        ),
      });
    },
  );
Rc.displayName = "Badge";
Rc.defaultProps = mk;
function hk({ scan: e, schemata: t, onChange: n }) {
  const {
      axes: r = [],
      num_repeats: o = 1,
      no_axes_mode: l = "single",
      randomise_order_globally: a = !1,
      skip_on_persistent_transitory_error: i = !1,
    } = e,
    u = s.useMemo(
      () =>
        t ? Object.values(t).filter((N) => N.spec && N.spec.is_scannable) : [],
      [t],
    ),
    c = new Set(r.map((N) => N.fqn).filter(Boolean)),
    f = () => {
      const N = {
        fqn: "",
        path: "",
        type: "linear",
        range: { start: 0, stop: 100, num_points: 11, randomise_order: !1 },
      };
      n({ ...e, axes: [...r, N] });
    },
    d = (N) => {
      const S = r.filter((C, _) => _ !== N);
      n({ ...e, axes: S });
    },
    h = (N, S, C) => {
      const _ = [...r];
      if (S === "fqn") {
        const j = t[C];
        _[N] = { ..._[N], fqn: C, path: j ? g() : "" };
      } else if (S.startsWith("range.")) {
        const j = S.split(".")[1];
        _[N] = { ..._[N], range: { ..._[N].range, [j]: C } };
      } else _[N] = { ..._[N], [S]: C };
      n({ ...e, axes: _ });
    },
    g = (N) => "",
    E = (N) => {
      n({ ...e, num_repeats: N });
    },
    x = (N) => {
      n({ ...e, num_repeats: N ? 2147483647 : 1 });
    },
    k = (N) => {
      n({ ...e, no_axes_mode: N });
    },
    v = (N) => {
      n({ ...e, randomise_order_globally: N });
    },
    m = (N) => {
      n({ ...e, skip_on_persistent_transitory_error: N });
    },
    y = s.useMemo(
      () =>
        r.length === 0
          ? o
          : r.reduce((N, S) => {
              var _;
              const C = ((_ = S.range) == null ? void 0 : _.num_points) || 1;
              return N * C;
            }, 1) * o,
      [r, o],
    ),
    w = o === 2147483647;
  return s.createElement(
    lt,
    { className: "mb-3" },
    s.createElement(
      lt.Header,
      { className: "d-flex justify-content-between align-items-center" },
      s.createElement("span", null, "Scan Configuration"),
      s.createElement(
        Rc,
        { bg: r.length === 0 ? "secondary" : "primary" },
        r.length,
        "D scan, ",
        w ? "\u221E" : y,
        " points",
      ),
    ),
    s.createElement(
      lt.Body,
      null,
      s.createElement("h6", null, "Scan Axes"),
      r.length === 0
        ? s.createElement(
            "p",
            { className: "text-muted small" },
            'No scan axes defined. Click "Add Scan Axis" to create one.',
          )
        : r.map((N, S) => {
            var K, G, P, M, F, Q;
            const C = N.fqn ? t[N.fqn] : null,
              _ =
                ((K = C == null ? void 0 : C.spec) == null ? void 0 : K.unit) ||
                "",
              j =
                ((G = C == null ? void 0 : C.spec) == null
                  ? void 0
                  : G.scale) || 1,
              D = zt((P = N.range) == null ? void 0 : P.start, j),
              A = zt((M = N.range) == null ? void 0 : M.stop, j);
            return s.createElement(
              lt,
              { key: S, className: "mb-2" },
              s.createElement(
                lt.Body,
                { className: "py-2 px-3" },
                s.createElement(
                  Dt,
                  { className: "mb-2" },
                  s.createElement(
                    He,
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
                        value: N.fqn || "",
                        onChange: (O) => h(S, "fqn", O.target.value),
                      },
                      s.createElement(
                        "option",
                        { value: "" },
                        "Select parameter...",
                      ),
                      u.map((O) =>
                        s.createElement(
                          "option",
                          {
                            key: O.fqn,
                            value: O.fqn,
                            disabled: c.has(O.fqn) && N.fqn !== O.fqn,
                          },
                          O.description || O.fqn,
                        ),
                      ),
                    ),
                  ),
                  s.createElement(
                    He,
                    { xs: "auto", className: "d-flex align-items-end" },
                    s.createElement(
                      st,
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
                  Dt,
                  { className: "g-2" },
                  s.createElement(
                    He,
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
                        onChange: (O) => {
                          const I = ga(O.target.value, j);
                          h(S, "range.start", I);
                        },
                        step: "any",
                      }),
                      _ && s.createElement(he.Text, null, _),
                    ),
                  ),
                  s.createElement(
                    He,
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
                        value: A,
                        onChange: (O) => {
                          const I = ga(O.target.value, j);
                          h(S, "range.stop", I);
                        },
                        step: "any",
                      }),
                      _ && s.createElement(he.Text, null, _),
                    ),
                  ),
                  s.createElement(
                    He,
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
                        ((F = N.range) == null ? void 0 : F.num_points) || 11,
                      onChange: (O) =>
                        h(S, "range.num_points", parseInt(O.target.value)),
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
                    ((Q = N.range) == null ? void 0 : Q.randomise_order) || !1,
                  onChange: (O) =>
                    h(S, "range.randomise_order", O.target.checked),
                }),
              ),
            );
          }),
      s.createElement(
        st,
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
        Dt,
        { className: "g-2 mb-2" },
        s.createElement(
          He,
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
              onChange: (N) => E(parseInt(N.target.value) || 1),
              min: "1",
              step: "1",
              disabled: w,
              placeholder: w ? "Infinite" : "",
            }),
            s.createElement(he.Checkbox, {
              checked: w,
              onChange: (N) => x(N.target.checked),
            }),
            s.createElement(he.Text, null, "Infinite"),
          ),
        ),
        s.createElement(
          He,
          { md: 6 },
          s.createElement(Z.Label, { className: "mb-1 small" }, "No-Axes Mode"),
          s.createElement(
            Z.Select,
            { size: "sm", value: l, onChange: (N) => k(N.target.value) },
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
        onChange: (N) => v(N.target.checked),
        className: "mb-1",
      }),
      s.createElement(Z.Check, {
        type: "checkbox",
        label: "Skip on persistent/transitory error",
        checked: i,
        onChange: (N) => m(N.target.checked),
      }),
    ),
  );
}
function vk(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    a = s.useMemo(() => gw(o), [o]),
    i = a.schemata,
    [u, c] = s.useState({}),
    [f, d] = s.useState(null);
  s.useState(!1);
  const [h, g] = s.useState(new Set()),
    [E, x] = s.useState(!0),
    [k, v] = s.useState(""),
    [m, y] = s.useState(!1),
    [w, N] = s.useState(""),
    [S, C] = s.useState(() => {
      const b = Gi(n, r);
      return b ? b.pipeline : "main";
    }),
    _ = (b) => {
      g((z) => new Set([...z, b]));
    },
    j = (b) => {
      g((z) => {
        const V = new Set(z);
        return V.delete(b), V;
      });
    };
  s.useEffect(() => {
    if (a) {
      const b = Ew(n, r);
      (() =>
        (a.always_shown || []).map((V) =>
          V && V.__jsonclass__ && V.__jsonclass__[0] === "tuple"
            ? V.__jsonclass__[1][0][0]
            : (console.error("Unexpected always_shown item format:", V), ""),
        ))(),
        b && b.visibleFqns ? g(new Set(b.visibleFqns)) : g(new Set()),
        b ? (c(b.overrides || {}), d(b.scan || a.scan)) : (c({}), d(a.scan));
    }
  }, [a, n, r]),
    s.useEffect(() => {
      f &&
        (ww(n, r, {
          overrides: u,
          scan: f,
          visibleFqns: [...h],
          useDefaultVisibility: E,
        }),
        xv(n, r, { pipeline: S }));
    }, [u, f, n, r, h, E, S]);
  const D = s.useMemo(() => (a ? yw(a.instances) : {}), [a]),
    A = s.useMemo(() => (f ? xw(f) : new Set()), [f]),
    K = (b, z) => {
      c((V) => ({ ...V, [b]: z }));
    },
    G = (b) => {
      c((z) => {
        const V = { ...z };
        return delete V[b], V;
      });
    },
    P = (b) => {
      d(b);
    },
    M = () => {
      a && (c({}), d(a.scan), localStorage.removeItem(hc(n, r)));
    },
    F = (b) => {
      N(b), y(!0);
    },
    Q = (b, z) =>
      s.createElement(
        "tr",
        { key: b },
        s.createElement("td", null, s.createElement("b", null, b, ":")),
        s.createElement("td", null, z),
      ),
    O = (b, z) => {
      const { description: V, type: q } = z,
        X = A.has(b),
        ue = u[b];
      let ne;
      if (q === "float") ne = ak;
      else if (q === "int") ne = sk;
      else if (q === "bool") ne = ik;
      else return null;
      return s.createElement(
        Z.Group,
        { key: b, className: "mb-2 row align-items-center" },
        s.createElement(
          "div",
          { className: "col-4" },
          s.createElement(
            Z.Label,
            { className: "mb-0", style: { fontWeight: 500 } },
            V || b,
          ),
        ),
        s.createElement(
          "div",
          { className: "col-8" },
          s.createElement(ne, {
            schema: z,
            value: ue,
            onChange: K,
            onReset: G,
            disabled: X,
          }),
        ),
      );
    },
    I = () => {
      if (a) {
        const b = new Set(Object.keys(u)),
          z = [...A].filter((V) => b.has(V));
        return z.length > 0
          ? (F(
              `Parameters cannot be both overridden and scanned: ${z.join(
                ", ",
              )}`,
            ),
            null)
          : Sw(a, u, f, D, h);
      }
      return {};
    };
  if (!a) return null;
  const $ = (a.always_shown || []).map((b) =>
      Array.isArray(b)
        ? b[0]
        : b && b.__jsonclass__ && b.__jsonclass__[0] === "tuple"
          ? b.__jsonclass__[1][0][0]
          : b,
    ),
    B = new Set([...(E ? $ : []), ...h]),
    H = k
      ? Object.entries(i).filter(
          ([b, z]) =>
            b.toLowerCase().includes(k.toLowerCase()) ||
            (z.description &&
              z.description.toLowerCase().includes(k.toLowerCase())),
        )
      : [];
  return s.createElement(
    lt,
    { className: "shadow-sm border-0" },
    s.createElement(
      lt.Header,
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
      lt.Body,
      { className: "p-4" },
      s.createElement(
        ma,
        { striped: !0, bordered: !0, hover: !0, size: "sm", className: "mb-4" },
        s.createElement(
          "tbody",
          null,
          Q("Name", t),
          Q("Class name", r),
          Q("File", n),
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
            onChange: (b) => {
              x(b.target.checked);
            },
            size: "sm",
            className: "small",
          }),
        ),
        s.createElement(
          lt,
          { className: "mb-3 parameter-adder" },
          s.createElement(
            lt.Body,
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
                s.createElement(Nh, null),
              ),
              s.createElement(Z.Control, {
                placeholder:
                  "Search available parameters by FQN or Description...",
                value: k,
                onChange: (b) => v(b.target.value),
                onKeyDown: (b) => {
                  b.key === "Escape" && v("");
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
                  return H.length === 0
                    ? s.createElement(
                        "div",
                        { className: "p-2 text-center text-muted small" },
                        "No parameters found",
                      )
                    : H.map(([b, z]) =>
                        s.createElement(
                          "div",
                          {
                            key: b,
                            className:
                              "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                            style: {
                              backgroundColor: B.has(b)
                                ? "#e7f1ff"
                                : "transparent",
                            },
                            onClick: () => {
                              window.innerWidth < 768 &&
                                (B.has(b) ? j(b) : _(b));
                            },
                          },
                          s.createElement(
                            "div",
                            {
                              className: "text-truncate",
                              style: { maxWidth: "70%" },
                            },
                            s.createElement("strong", null, b),
                            s.createElement("br", null),
                            s.createElement(
                              "span",
                              { className: "text-muted" },
                              z.description,
                            ),
                          ),
                          s.createElement(
                            st,
                            {
                              size: "sm",
                              variant: B.has(b)
                                ? "outline-danger"
                                : "outline-primary",
                              onClick: (V) => {
                                V.stopPropagation(), B.has(b) ? j(b) : _(b);
                              },
                              style: { padding: "0 0.5rem" },
                              className: "desktop-only",
                            },
                            B.has(b) ? "Hide" : "Show",
                          ),
                        ),
                      );
                {
                  const b = {};
                  return (
                    console.log(i),
                    Object.entries(i).forEach(([z, V]) => {
                      const q = z.split("."),
                        X = q.length > 1 ? q.slice(0, -1).join(".") : "Root";
                      b[X] || (b[X] = []), b[X].push([z, V]);
                    }),
                    s.createElement(
                      pt,
                      { flush: !0 },
                      Object.entries(b)
                        .sort(([z], [V]) => z.localeCompare(V))
                        .map(([z, V]) =>
                          s.createElement(
                            pt.Item,
                            { key: z, eventKey: z },
                            s.createElement(
                              pt.Header,
                              { className: "py-1" },
                              s.createElement(
                                "small",
                                { className: "fw-bold" },
                                z,
                              ),
                              s.createElement(
                                "small",
                                { className: "text-muted ms-2" },
                                "(",
                                V.length,
                                ")",
                              ),
                            ),
                            s.createElement(
                              pt.Body,
                              { className: "p-0" },
                              V.map(([q, X]) =>
                                s.createElement(
                                  "div",
                                  {
                                    key: q,
                                    className:
                                      "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                                    style: {
                                      backgroundColor: B.has(q)
                                        ? "#e7f1ff"
                                        : "transparent",
                                    },
                                    onClick: () => {
                                      window.innerWidth < 768 &&
                                        (B.has(q) ? j(q) : _(q));
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
                                      q.split(".").pop(),
                                    ),
                                    s.createElement("br", null),
                                    s.createElement(
                                      "span",
                                      { className: "text-muted" },
                                      X.description,
                                    ),
                                  ),
                                  s.createElement(
                                    st,
                                    {
                                      size: "sm",
                                      variant: B.has(q)
                                        ? "outline-danger"
                                        : "outline-primary",
                                      onClick: (ue) => {
                                        ue.stopPropagation(),
                                          B.has(q) ? j(q) : _(q);
                                      },
                                      style: { padding: "0 0.5rem" },
                                      className: "desktop-only",
                                    },
                                    B.has(q) ? "Hide" : "Show",
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
        B.size === 0 &&
          s.createElement(
            "div",
            {
              className:
                "text-center p-3 border rounded bg-secondary bg-opacity-25 text-muted small mb-3",
            },
            "No parameters are currently visible. Use the search above to add parameters.",
          ),
        B.size > 0 &&
          Array.from(B).map((b) => {
            const z = i[b];
            return z
              ? s.createElement(
                  "div",
                  {
                    key: b,
                    className:
                      "ndscan-param-row border-bottom py-2 px-1 d-flex align-items-start",
                  },
                  s.createElement("div", { className: "flex-grow-1" }, O(b, z)),
                  s.createElement(
                    st,
                    {
                      variant: "link",
                      size: "sm",
                      className:
                        "text-muted p-0 ms-2 d-inline-flex align-items-center",
                      onClick: () => j(b),
                      title: "Hide parameter",
                      "aria-label": "Hide parameter",
                    },
                    s.createElement(_h, { size: 16, "aria-hidden": "true" }),
                  ),
                )
              : null;
          }),
        f && s.createElement(hk, { scan: f, schemata: i, onChange: P }),
        s.createElement(
          st,
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
          onChange: (b) => C(b.target.value),
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
        s.createElement(Jh, {
          file: n,
          class_name: r,
          repo_rev: l,
          arguments: I(),
          pipeline: S,
          onError: F,
          className: "btn-lg",
        }),
      ),
      s.createElement(
        fc,
        { position: "bottom-end", className: "p-3" },
        s.createElement(
          _r,
          {
            show: m,
            onClose: () => y(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          s.createElement(
            _r.Header,
            null,
            s.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          s.createElement(_r.Body, { className: "text-white" }, w),
        ),
      ),
    ),
  );
}
function gk({ explist: e, experiment: t, repo_rev: n }) {
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
        RE(u.file, u.class_name)
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
    f = vw(r) ? vk : pk;
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
function yk(e) {
  var t = p.exports.useRef(null);
  return (
    p.exports.useEffect(function () {
      t.current = e;
    }),
    t.current
  );
}
const xk = ["onKeyDown"];
function Ek(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function wk(e) {
  return !e || e.trim() === "#";
}
const Ev = p.exports.forwardRef((e, t) => {
  let { onKeyDown: n } = e,
    r = Ek(e, xk);
  const [o] = lc(Object.assign({ tagName: "a" }, r)),
    l = Ve((a) => {
      o.onKeyDown(a), n == null || n(a);
    });
  return wk(r.href) || r.role === "button"
    ? T.exports.jsx("a", Object.assign({ ref: t }, r, o, { onKeyDown: l }))
    : T.exports.jsx("a", Object.assign({ ref: t }, r, { onKeyDown: n }));
});
Ev.displayName = "Anchor";
const wv = Ha("h4");
wv.displayName = "DivStyledAsH4";
const Sk = je("alert-heading", { Component: wv }),
  kk = je("alert-link", { Component: Ev }),
  Nk = {
    variant: "primary",
    show: !0,
    transition: fn,
    closeLabel: "Close alert",
  },
  _c = p.exports.forwardRef((e, t) => {
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
      } = Ph(e, { show: "onClose" }),
      g = te(n, "alert"),
      E = Ve((v) => {
        c && c(!1, v);
      }),
      x = d === !0 ? fn : d,
      k = T.exports.jsxs("div", {
        role: "alert",
        ...(x ? void 0 : h),
        ref: t,
        className: Y(a, g, u && `${g}-${u}`, f && `${g}-dismissible`),
        children: [
          f && T.exports.jsx(Gr, { onClick: E, "aria-label": o, variant: l }),
          i,
        ],
      });
    return x
      ? T.exports.jsx(x, {
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
_c.displayName = "Alert";
_c.defaultProps = Nk;
const Ea = Object.assign(_c, { Link: kk, Heading: Sk }),
  Oc = p.exports.forwardRef(
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
      e = te(e, "spinner");
      const u = `${e}-${n}`;
      return T.exports.jsx(o, {
        ref: i,
        ...a,
        className: Y(l, u, r && `${u}-${r}`, t && `text-${t}`),
      });
    },
  );
Oc.displayName = "Spinner";
function Ck(e) {
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
function Pc({
  name: e,
  node: t,
  selectedDatasets: n,
  onSelect: r,
  level: o = 0,
}) {
  const [l, a] = p.exports.useState(o === 0),
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
              ? s.createElement(Nx, { size: 14 })
              : s.createElement(tc, { size: 14 }),
          ),
        t.isLeaf &&
          s.createElement(
            "span",
            {
              className: "me-2 dataset-tree-node__leaf-icon",
              "aria-hidden": "true",
            },
            s.createElement(xh, { size: 14 }),
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
            s.createElement(Pc, {
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
Pc.propTypes = {
  name: R.exports.string.isRequired,
  node: R.exports.object.isRequired,
  selectedDatasets: R.exports.array.isRequired,
  onSelect: R.exports.func.isRequired,
  level: R.exports.number,
};
function Sv({ datasetNames: e, selectedDatasets: t, onSelect: n }) {
  const r = Ck(e);
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
          s.createElement(Pc, {
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
Sv.propTypes = {
  datasetNames: R.exports.array.isRequired,
  selectedDatasets: R.exports.array.isRequired,
  onSelect: R.exports.func.isRequired,
};
function kv({ name: e, datasetData: t }) {
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
kv.propTypes = {
  name: R.exports.string.isRequired,
  datasetData: R.exports.array,
};
function Rk() {
  const [e, t] = p.exports.useState([]),
    [n, r] = p.exports.useState([]),
    [o, l] = p.exports.useState(""),
    [a, i] = p.exports.useState([]),
    [u, c] = p.exports.useState({}),
    [f, d] = p.exports.useState(!0),
    [h, g] = p.exports.useState(null);
  p.exports.useEffect(() => {
    const m = async () => {
      try {
        const w = await ac();
        t(w.names), r(w.names), g(null);
      } catch (w) {
        g(`Failed to load datasets: ${w.message}`);
      } finally {
        d(!1);
      }
    };
    m();
    const y = setInterval(m, 5e3);
    return () => clearInterval(y);
  }, []),
    p.exports.useEffect(() => {
      if (o.trim() === "") r(e);
      else {
        const m = o.toLowerCase();
        r(e.filter((y) => y.toLowerCase().includes(m)));
      }
    }, [o, e]);
  const [E, x] = Xu();
  p.exports.useEffect(() => {
    const m = E.getAll("select");
    m.length > 0 &&
      (i(m),
      Rr(m)
        .then((y) => {
          c((w) => ({ ...w, ...y }));
        })
        .catch((y) => console.error(y)));
  }, []);
  const k = async (m) => {
      let y;
      if (a.includes(m)) {
        y = a.filter((N) => N !== m);
        const w = { ...u };
        delete w[m], c(w);
      } else {
        y = [...a, m];
        try {
          const w = await Rr([m]);
          c({ ...u, ...w });
        } catch (w) {
          g(`Failed to load dataset value: ${w.message}`);
        }
      }
      i(y),
        x((w) => {
          const N = new URLSearchParams(w);
          return N.delete("select"), y.forEach((S) => N.append("select", S)), N;
        });
    },
    v = async () => {
      if (a.length !== 0)
        try {
          const m = await Rr(a);
          c(m), g(null);
        } catch (m) {
          g(`Failed to refresh dataset values: ${m.message}`);
        }
    };
  return f
    ? s.createElement(
        "div",
        { className: "text-center p-4" },
        s.createElement(
          Oc,
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
            { variant: "danger", dismissible: !0, onClose: () => g(null) },
            h,
          ),
        s.createElement(
          Z.Group,
          { className: "mb-3" },
          s.createElement(Z.Control, {
            type: "text",
            placeholder: "Search datasets...",
            value: o,
            onChange: (m) => l(m.target.value),
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
              s.createElement(Sv, {
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
                s.createElement(dh, { "aria-hidden": "true" }),
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
                : a.map((m) =>
                    s.createElement(
                      "div",
                      { key: m, className: "mb-3 pb-3 border-bottom" },
                      s.createElement(kv, { name: m, datasetData: u[m] }),
                    ),
                  ),
            ),
          ),
        ),
      );
}
const _k = window.location.origin,
  We = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    RECONNECTING: "reconnecting",
    ERROR: "error",
    CLOSED: "closed",
  };
function Nv(e, t = {}) {
  const { enabled: n = !0, reconnectDelay: r = 3e3 } = t,
    [o, l] = p.exports.useState(null),
    [a, i] = p.exports.useState(We.CLOSED),
    [u, c] = p.exports.useState(null),
    f = p.exports.useRef(null),
    d = p.exports.useRef(null),
    h = p.exports.useRef(!0),
    g = p.exports.useRef(0),
    E = p.exports.useCallback((v) => {
      l((m) => (m ? { ...m, ...v } : v));
    }, []),
    x = p.exports.useCallback((v) => {
      l((m) => {
        if (!m) return m;
        const y = { ...m };
        return delete y[v], y;
      });
    }, []),
    k = p.exports.useCallback(() => {
      if (!e || !n) return;
      const v = Date.now(),
        m = v - g.current,
        y = 1e3;
      if (m < y) {
        const S = y - m;
        d.current = setTimeout(() => {
          h.current && n && k();
        }, S);
        return;
      }
      (g.current = v),
        f.current && f.current.close(),
        i(We.CONNECTING),
        c(null);
      const w = `${_k}/api/datasets/stream/${encodeURIComponent(e)}`,
        N = new EventSource(w);
      (f.current = N),
        N.addEventListener("init", (S) => {
          if (!!h.current)
            try {
              const C = JSON.parse(S.data);
              l(C), i(We.CONNECTED), c(null);
            } catch (C) {
              console.error("Failed to parse init event:", C);
            }
        }),
        N.addEventListener("update", (S) => {
          if (!!h.current)
            try {
              const C = JSON.parse(S.data);
              E(C);
            } catch (C) {
              console.error("Failed to parse update event:", C);
            }
        }),
        N.addEventListener("delete", (S) => {
          if (!!h.current)
            try {
              const { key: C } = JSON.parse(S.data);
              x(C);
            } catch (C) {
              console.error("Failed to parse delete event:", C);
            }
        }),
        N.addEventListener("heartbeat", () => {
          !h.current || i((S) => (S === We.CONNECTED ? S : We.CONNECTED));
        }),
        N.addEventListener("error", (S) => {
          if (!!h.current)
            try {
              const C = JSON.parse(S.data);
              c(C.message), i(We.ERROR);
            } catch {
              i(We.ERROR);
            }
        }),
        (N.onerror = () => {
          !h.current ||
            (N.close(),
            i(We.RECONNECTING),
            (d.current = setTimeout(() => {
              h.current && n && k();
            }, r)));
        }),
        (N.onopen = () => {
          h.current;
        });
    }, [e, n, r, E, x]);
  return (
    p.exports.useEffect(
      () => (
        (h.current = !0),
        n && e && k(),
        () => {
          (h.current = !1),
            f.current && (f.current.close(), (f.current = null)),
            d.current && (clearTimeout(d.current), (d.current = null)),
            i(We.CLOSED);
        }
      ),
      [e, n, k],
    ),
    {
      data: o,
      connectionState: a,
      error: u,
      isConnected: a === We.CONNECTED,
      isConnecting: a === We.CONNECTING || a === We.RECONNECTING,
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
function Cv({ recentRuns: e, currentPrefix: t, onPick: n }) {
  const [r, o] = p.exports.useState(!1),
    [l, a] = p.exports.useState(""),
    i = p.exports.useRef(null);
  p.exports.useEffect(() => {
    const d = (h) => {
      i.current && !i.current.contains(h.target) && o(!1);
    };
    return (
      document.addEventListener("mousedown", d),
      () => document.removeEventListener("mousedown", d)
    );
  }, []);
  const u = e.find((d) => d.prefix === t) || e[0],
    c = p.exports.useMemo(() => {
      if (!l.trim()) return e;
      const d = l.toLowerCase();
      return e.filter((h) => {
        var g, E, x;
        return `${(g = h.rid) != null ? g : ""} ${
          (E = h.expName) != null ? E : ""
        } ${(x = h.prefix) != null ? x : ""}`
          .toLowerCase()
          .includes(d);
      });
    }, [e, l]),
    f = p.exports.useMemo(() => {
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
                  h.runs.map((g) =>
                    s.createElement(
                      "div",
                      {
                        key: g.prefix,
                        className: "p-row" + (g.prefix === t ? " on" : ""),
                        onClick: () => {
                          n(g), o(!1);
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
                        g.rid != null ? `#${g.rid}` : g.prefix,
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
                        g.prefix,
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
Cv.propTypes = {
  recentRuns: R.exports.array.isRequired,
  currentPrefix: R.exports.string,
  onPick: R.exports.func.isRequired,
};
function Ok() {
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
function Rv({ onCopy: e }) {
  const [t, n] = p.exports.useState("idle"),
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
function Qi({
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
    s.createElement(Ok, null),
    s.createElement(
      "span",
      { className: "p-dim2", style: { fontSize: 11 } },
      "/",
    ),
    s.createElement(Cv, { recentRuns: e, currentPrefix: t, onPick: n }),
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
    l && s.createElement(Rv, { onCopy: l }),
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
Qi.propTypes = {
  recentRuns: R.exports.array.isRequired,
  currentPrefix: R.exports.string,
  onPick: R.exports.func.isRequired,
  progress: R.exports.string,
  status: R.exports.string,
  onCopy: R.exports.func,
};
Rv.propTypes = { onCopy: R.exports.func.isRequired };
function Pk({ c: e, isRadio: t, onClick: n }) {
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
function _v({
  mode: e,
  channels: t,
  onToggle: n,
  onPickMetric: r,
  experiment: o,
}) {
  const l = e === "2D",
    a = t.filter((f) => f.on).length,
    [i, u] = p.exports.useState(""),
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
        s.createElement(Pk, {
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
_v.propTypes = {
  mode: R.exports.oneOf(["0D", "1D", "2D"]).isRequired,
  channels: R.exports.array.isRequired,
  onToggle: R.exports.func,
  onPickMetric: R.exports.func,
  experiment: R.exports.string,
};
function bk({ on: e }) {
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
function Tk({
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
            s.createElement(bk, { on: n }),
          )
        : null,
    ),
  );
}
function Ov({
  runs: e,
  activeRid: t,
  ghostPrefixes: n = [],
  onToggleGhost: r,
  onPick: o,
  dims: l,
}) {
  const [a, i] = p.exports.useState(""),
    u = l === "1D",
    c = p.exports.useMemo(() => {
      if (!a.trim()) return e;
      const d = a.toLowerCase();
      return e.filter((h) => {
        var g, E;
        return `${(g = h.rid) != null ? g : ""} ${
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
              g = n.includes(d.prefix);
            return s.createElement(Tk, {
              key: d.prefix,
              r: d,
              isActive: h,
              isGhost: g,
              canOverlay: u,
              onClick: () => !h && o(d),
              onToggleGhost: r,
            });
          }),
        ),
  );
}
Ov.propTypes = {
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
function gt(e) {
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
function $k(e) {
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
const vd = [
  "--p-c0",
  "--p-c1",
  "--p-c2",
  "--p-c3",
  "--p-c4",
  "--p-c5",
  "--p-c6",
  "--p-c7",
];
function zn(e) {
  const t = /rid[_-]?(\d+)/i.exec(e);
  return t ? parseInt(t[1], 10) : null;
}
const Pv = "artiq_http.plots.channels.";
function Lk(e) {
  if (!e) return null;
  try {
    const t = localStorage.getItem(Pv + e);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function jk(e, t) {
  if (!!e)
    try {
      localStorage.setItem(Pv + e, JSON.stringify(t));
    } catch {}
}
function qi({ xs: e, xLabel: t, yLabel: n, channels: r, ghosts: o = [] }) {
  const l = p.exports.useRef(null),
    [a, i] = p.exports.useState({ w: 800, h: 460 }),
    [u, c] = p.exports.useState(null);
  p.exports.useEffect(() => {
    if (!l.current) return;
    const P = new ResizeObserver(([M]) => {
      const F = M.contentRect;
      i({ w: Math.max(360, F.width), h: Math.max(220, F.height) });
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
    g = 18,
    E = 44,
    x = a.w - d - h,
    k = a.h - g - E,
    v = Math.min(...e),
    m = Math.max(...e);
  let y = 1 / 0,
    w = -1 / 0;
  for (const P of f)
    for (const M of P.values)
      !isFinite(M) || (M < y && (y = M), M > w && (w = M));
  if (!isFinite(y) || !isFinite(w) || y === w) (y = 0), (w = 1);
  else {
    const P = (w - y) * 0.08;
    (y -= P), (w += P);
  }
  const N = (P) => d + ((P - v) / (m - v || 1)) * x,
    S = (P) => g + (1 - (P - y) / (w - y || 1)) * k,
    C = Sa(v, m, 6),
    _ = Sa(y, w, 5),
    j = (P) => {
      const M = P.currentTarget.getBoundingClientRect(),
        F = P.clientX - M.left;
      if (F < d || F > d + x) {
        c(null);
        return;
      }
      const Q = v + ((F - d) / x) * (m - v);
      c({ x: Q, px: F });
    },
    D = () => c(null),
    A = u ? N(u.x) : null,
    K = u
      ? f.map((P) => {
          const M = P.values;
          let F = Math.round(((u.x - v) / (m - v || 1)) * (M.length - 1));
          return (
            (F = Math.max(0, Math.min(M.length - 1, F))),
            { key: P.key, color: P.color, value: M[F] }
          );
        })
      : [],
    G = u
      ? o.flatMap((P) => {
          const M = P.values;
          if (!M || !M.length) return [];
          let F = Math.round(((u.x - v) / (m - v || 1)) * (M.length - 1));
          return (
            (F = Math.max(0, Math.min(M.length - 1, F))),
            [{ rid: P.rid, value: M[F] }]
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
          _.map((P) =>
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
          C.map((P) =>
            s.createElement("line", {
              key: "gx" + P,
              x1: N(P),
              x2: N(P),
              y1: g,
              y2: g + k,
              stroke: "var(--p-grid)",
              strokeWidth: "1",
            }),
          ),
        ),
        s.createElement(
          "g",
          { stroke: "var(--p-ink70)", strokeWidth: "1" },
          s.createElement("line", { x1: d, y1: g + k, x2: d + x, y2: g + k }),
          s.createElement("line", { x1: d, y1: g, x2: d, y2: g + k }),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "middle" },
          C.map((P) =>
            s.createElement(
              "g",
              { key: "tx" + P },
              s.createElement("line", {
                x1: N(P),
                x2: N(P),
                y1: g + k,
                y2: g + k + 4,
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: N(P), y: g + k + 16 }, gt(P)),
            ),
          ),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "end" },
          _.map((P) =>
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
              s.createElement("text", { x: d - 8, y: S(P) + 3 }, gt(P)),
            ),
          ),
        ),
        o.map((P, M) => {
          const F = P.values || [];
          if (!F.length) return null;
          const Q = P.xs || e;
          return s.createElement(
            "g",
            { key: "gh" + M },
            F.map((O, I) =>
              isFinite(O) && isFinite(Q[I])
                ? s.createElement("circle", {
                    key: I,
                    cx: N(Q[I]),
                    cy: S(O),
                    r: "2",
                    fill: "var(--p-ink50)",
                    opacity: "0.55",
                  })
                : null,
            ),
          );
        }),
        f.map((P) => {
          const M = P.values;
          return s.createElement(
            "g",
            { key: P.key },
            M.map((F, Q) =>
              isFinite(F) && isFinite(e[Q])
                ? s.createElement("circle", {
                    key: Q,
                    cx: N(e[Q]),
                    cy: S(F),
                    r: "2",
                    fill: P.color,
                  })
                : null,
            ),
          );
        }),
        A != null &&
          s.createElement("line", {
            x1: A,
            x2: A,
            y1: g,
            y2: g + k,
            stroke: "var(--p-accent)",
            strokeWidth: "1",
            strokeDasharray: "3 3",
          }),
        s.createElement(
          "text",
          {
            x: d + x / 2,
            y: g + k + 30,
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
            y: g + k / 2,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
            transform: `rotate(-90, 14, ${g + k / 2})`,
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
            right: 56,
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
    s.createElement(Dk, {
      cursor: u,
      xLabel: t,
      cursorReadouts: K,
      ghostReadouts: G,
    }),
  );
}
function Dk({ cursor: e, xLabel: t, cursorReadouts: n, ghostReadouts: r }) {
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
            gt(e.x),
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
                s.createElement("b", null, gt(o.value)),
              ),
            ),
            r.map((o) =>
              s.createElement(
                "span",
                { key: o.rid, className: "p-mono p-dim" },
                "#",
                o.rid,
                " = ",
                gt(o.value),
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
qi.propTypes = {
  xs: R.exports.array.isRequired,
  xLabel: R.exports.string,
  yLabel: R.exports.string,
  channels: R.exports.array.isRequired,
  ghosts: R.exports.array,
};
function bv({ xs: e, ys: t, values: n, xLabel: r, yLabel: o, metric: l }) {
  const a = p.exports.useRef(null),
    i = p.exports.useRef(null),
    [u, c] = p.exports.useState({ w: 800, h: 460 }),
    [f, d] = p.exports.useState(null);
  p.exports.useEffect(() => {
    if (!a.current) return;
    const $ = new ResizeObserver(([B]) => {
      const H = B.contentRect;
      c({ w: Math.max(360, H.width), h: Math.max(220, H.height) });
    });
    return $.observe(a.current), () => $.disconnect();
  }, []);
  const {
      grid: h,
      cols: g,
      rows: E,
      xRange: x,
      yRange: k,
      vRange: v,
    } = p.exports.useMemo(() => {
      if (!e.length || !t.length || !n.length)
        return {
          grid: null,
          cols: 0,
          rows: 0,
          xRange: [0, 1],
          yRange: [0, 1],
          vRange: [0, 1],
        };
      const $ = [...new Set(e)].sort((ne, de) => ne - de),
        B = [...new Set(t)].sort((ne, de) => ne - de),
        H = $.length,
        b = B.length,
        z = new Map($.map((ne, de) => [ne, de])),
        V = new Map(B.map((ne, de) => [ne, de])),
        q = Array.from({ length: b }, () => new Array(H).fill(NaN));
      let X = 1 / 0,
        ue = -1 / 0;
      for (let ne = 0; ne < n.length; ne++) {
        const de = n[ne];
        if (!isFinite(de)) continue;
        const Re = z.get(e[ne]),
          Be = V.get(t[ne]);
        Re == null ||
          Be == null ||
          ((q[Be][Re] = de), de < X && (X = de), de > ue && (ue = de));
      }
      return (
        (!isFinite(X) || !isFinite(ue) || X === ue) && ((X = 0), (ue = 1)),
        {
          grid: q,
          cols: H,
          rows: b,
          xRange: [$[0], $[H - 1]],
          yRange: [B[0], B[b - 1]],
          vRange: [X, ue],
        }
      );
    }, [e, t, n]),
    m = 56,
    y = 70,
    w = 18,
    N = 44,
    S = u.w - m - y,
    C = u.h - w - N;
  if (
    (p.exports.useEffect(() => {
      const $ = i.current;
      if (!$ || !h || g === 0 || E === 0) return;
      const B = window.devicePixelRatio || 1;
      ($.width = Math.max(1, S) * B),
        ($.height = Math.max(1, C) * B),
        ($.style.width = S + "px"),
        ($.style.height = C + "px");
      const H = $.getContext("2d");
      H.imageSmoothingEnabled = !1;
      const b = H.createImageData(g, E),
        [z, V] = v,
        q = V - z || 1;
      for (let ue = 0; ue < E; ue++)
        for (let ne = 0; ne < g; ne++) {
          const de = h[ue][ne],
            Re = isFinite(de) ? (de - z) / q : 0,
            [Be, le, Ut] = $k(Re),
            J = ((E - 1 - ue) * g + ne) * 4;
          (b.data[J] = Be),
            (b.data[J + 1] = le),
            (b.data[J + 2] = Ut),
            (b.data[J + 3] = isFinite(de) ? 255 : 0);
        }
      const X = document.createElement("canvas");
      (X.width = g),
        (X.height = E),
        X.getContext("2d").putImageData(b, 0, 0),
        H.clearRect(0, 0, $.width, $.height),
        H.drawImage(X, 0, 0, S * B, C * B);
    }, [h, g, E, S, C, v]),
    !h || g === 0 || E === 0)
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
  const [_, j] = x,
    [D, A] = k,
    K = ($) => m + (($ - _) / (j - _ || 1)) * S,
    G = ($) => w + (1 - ($ - D) / (A - D || 1)) * C,
    P = Sa(_, j, 6),
    M = Sa(D, A, 5),
    F = ($) => {
      const B = $.currentTarget.getBoundingClientRect(),
        H = $.clientX - B.left,
        b = $.clientY - B.top;
      if (H < m || H > m + S || b < w || b > w + C) {
        d(null);
        return;
      }
      const z = _ + ((H - m) / S) * (j - _),
        V = D + (1 - (b - w) / C) * (A - D),
        q = Math.min(g - 1, Math.max(0, Math.floor(((H - m) / S) * g))),
        X = Math.min(E - 1, Math.max(0, Math.floor((1 - (b - w) / C) * E)));
      d({ x: z, y: V, value: h[X][q] });
    },
    Q = () => d(null),
    O = f ? K(f.x) : null,
    I = f ? G(f.y) : null;
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
            left: m,
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
          onMouseMove: F,
          onMouseLeave: Q,
          style: { position: "absolute", top: 0, left: 0, cursor: "crosshair" },
        },
        s.createElement(
          "g",
          { stroke: "var(--p-ink70)", strokeWidth: "1", fill: "none" },
          s.createElement("line", { x1: m, y1: w + C, x2: m + S, y2: w + C }),
          s.createElement("line", { x1: m, y1: w, x2: m, y2: w + C }),
          s.createElement("line", { x1: m + S, y1: w, x2: m + S, y2: w + C }),
          s.createElement("line", { x1: m, y1: w, x2: m + S, y2: w }),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "middle" },
          P.map(($) =>
            s.createElement(
              "g",
              { key: $ },
              s.createElement("line", {
                x1: K($),
                x2: K($),
                y1: w + C,
                y2: w + C + 4,
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: K($), y: w + C + 16 }, gt($)),
            ),
          ),
        ),
        s.createElement(
          "g",
          { fontSize: "10", fill: "var(--p-ink70)", textAnchor: "end" },
          M.map(($) =>
            s.createElement(
              "g",
              { key: $ },
              s.createElement("line", {
                x1: m - 4,
                x2: m,
                y1: G($),
                y2: G($),
                stroke: "var(--p-ink70)",
                strokeWidth: "1",
              }),
              s.createElement("text", { x: m - 8, y: G($) + 3 }, gt($)),
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
            s.createElement("line", { x1: O, x2: O, y1: w, y2: w + C }),
            s.createElement("line", { x1: m, x2: m + S, y1: I, y2: I }),
            s.createElement("circle", {
              cx: O,
              cy: I,
              r: "4",
              fill: "none",
              strokeDasharray: "0",
            }),
          ),
        s.createElement(
          "g",
          { transform: `translate(${m + S + 18}, ${w})` },
          s.createElement(Ik, { height: C }),
          s.createElement(
            "text",
            { x: "34", y: "6", fontSize: "10", fill: "var(--p-ink70)" },
            gt(v[1]),
          ),
          s.createElement(
            "text",
            { x: "34", y: C - 2, fontSize: "10", fill: "var(--p-ink70)" },
            gt(v[0]),
          ),
          s.createElement(
            "text",
            {
              x: "14",
              y: C / 2,
              fontSize: "10",
              fill: "var(--p-ink50)",
              textAnchor: "middle",
              transform: `rotate(-90, 14, ${C / 2})`,
            },
            l,
          ),
        ),
        s.createElement(
          "text",
          {
            x: m + S / 2,
            y: w + C + 30,
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
            y: w + C / 2,
            textAnchor: "middle",
            fontSize: "11",
            fill: "var(--p-ink70)",
            fontFamily: "var(--p-font-mono)",
            transform: `rotate(-90, 14, ${w + C / 2})`,
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
    s.createElement(Mk, { cursor: f, metric: l, xLabel: r, yLabel: o }),
  );
}
function Mk({ cursor: e, metric: t, xLabel: n, yLabel: r }) {
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
            gt(e.x),
            " \xB7",
            " ",
            (r || "y").split(" /")[0],
            " = ",
            gt(e.y),
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
                isFinite(e.value) ? gt(e.value) : "\u2014",
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
function Ik({ height: e }) {
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
bv.propTypes = {
  xs: R.exports.array.isRequired,
  ys: R.exports.array.isRequired,
  values: R.exports.array.isRequired,
  xLabel: R.exports.string,
  yLabel: R.exports.string,
  metric: R.exports.string,
};
function Tv({ channels: e }) {
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
            zk(n.value),
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
function zk(e) {
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
Tv.propTypes = { channels: R.exports.array.isRequired };
function Ak(e, t) {
  return e.replace(/var\((--[^,)]+)(?:,[^)]*)?\)/g, (n, r) =>
    (t.getPropertyValue(r).trim() || "currentColor").replace(/"/g, "'"),
  );
}
function Yi(e, t) {
  if (!e) return null;
  const n = e.match(/var\((--[^,)]+)\)/);
  return (n && t.getPropertyValue(n[1]).trim()) || e;
}
function Fk(e) {
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
function Ar(e, t, n, r, o, l) {
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
function Bk(e, t, n, r, o, l, a, i, u, c, f) {
  const d = Math.min(220, Math.max(160, Math.round(r * 0.3))),
    h = r - d - 12,
    g = o + 12,
    E = 8,
    x = 6,
    k = 18,
    v = 18,
    m = 6,
    y = t.length + n.length;
  if (y === 0) return;
  const w = x * 2 + y * k;
  e.save(),
    (e.globalAlpha = 0.92),
    (e.fillStyle = l),
    Ar(e, h, g, d, w, 6),
    e.fill(),
    e.restore(),
    (e.strokeStyle = a),
    (e.lineWidth = 1),
    Ar(e, h, g, d, w, 6),
    e.stroke();
  let N = g + x + k / 2;
  (e.textBaseline = "middle"),
    (e.font = "11px monospace"),
    (e.textAlign = "left");
  for (const S of t) {
    const C = Yi(S.color, f) || i;
    (e.fillStyle = C), e.fillRect(h + E, N - 1, v, 2), (e.fillStyle = u);
    const _ = d - E * 2 - v - m,
      j = S.key.length > 26 ? S.key.slice(0, 24) + "\u2026" : S.key;
    e.fillText(j, h + E + v + m, N, _), (N += k);
  }
  for (const S of n)
    (e.strokeStyle = c),
      (e.lineWidth = 1.5),
      e.setLineDash([4, 3]),
      e.beginPath(),
      e.moveTo(h + E, N),
      e.lineTo(h + E + v, N),
      e.stroke(),
      e.setLineDash([]),
      (e.fillStyle = c),
      e.fillText("ghost", h + E + v + m, N),
      (e.textAlign = "right"),
      e.fillText(`#${S.rid}`, h + d - E, N),
      (e.textAlign = "left"),
      (N += k);
}
function Wk(e, t, n, r, o, l, a, i) {
  e.font = "bold 11px monospace";
  const h = e.measureText(t).width,
    g = 8 * 2 + 38 + 6 + h + 4,
    E = n - g - 100,
    x = r + 12,
    k = 4 * 2 + 16;
  e.save(),
    (e.globalAlpha = 0.92),
    (e.fillStyle = o),
    Ar(e, E, x, g, k, 6),
    e.fill(),
    e.restore(),
    (e.strokeStyle = l),
    (e.lineWidth = 1),
    Ar(e, E, x, g, k, 6),
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
async function Uk({
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
    g = u.getPropertyValue("--p-ink").trim() || "#e8e6df",
    E = u.getPropertyValue("--p-ink50").trim() || "rgba(232,230,223,0.52)",
    x = 30,
    k = 30;
  let v,
    m,
    y,
    w = e.querySelector("svg");
  if (n === "1D" || n === "2D" || w) {
    if (!w) throw new Error("No SVG element found in plot container");
    (v = parseInt(w.getAttribute("width"), 10) || w.clientWidth || 800),
      (m = parseInt(w.getAttribute("height"), 10) || w.clientHeight || 460);
    const A = new XMLSerializer().serializeToString(w),
      K = Ak(A, u),
      G = await Fk(K);
    let P = null;
    if (n === "2D") {
      const M = e.querySelector("canvas");
      if (M) {
        const F = e.getBoundingClientRect(),
          Q = M.getBoundingClientRect();
        P = {
          el: M,
          x: Math.round(Q.left - F.left),
          y: Math.round(Q.top - F.top),
          w: Q.width,
          h: Q.height,
        };
      }
    }
    y = (M, F = 0) => {
      (M.fillStyle = c),
        M.fillRect(0, F, v, m),
        P && M.drawImage(P.el, P.x, P.y + F, P.w, P.h),
        M.drawImage(G, 0, F, v, m);
    };
  } else {
    const A = r.filter((O) => O.on),
      K = Math.max(1, Math.ceil(Math.sqrt(A.length || 1))),
      G = Math.ceil((A.length || 1) / K),
      P = 200,
      M = 110,
      F = 12,
      Q = 12;
    (v = Math.max(300, K * (P + F) - F + Q * 2)),
      (m = Math.max(140, G * (M + F) - F + Q * 2)),
      (y = (O, I = 0) => {
        (O.fillStyle = c),
          O.fillRect(0, I, v, m),
          A.forEach(($, B) => {
            const H = B % K,
              b = Math.floor(B / K),
              z = Q + H * (P + F),
              V = Q + b * (M + F) + I;
            (O.fillStyle = f),
              (O.strokeStyle = d),
              (O.lineWidth = 1),
              Ar(O, z, V, P, M, 6),
              O.fill(),
              O.stroke(),
              (O.fillStyle = Yi($.color, u) || h),
              O.fillRect(z + 12, V + 16, 14, 3),
              (O.fillStyle = g),
              (O.font = "bold 11px monospace"),
              (O.textAlign = "left"),
              (O.textBaseline = "top");
            const q = $.key.length > 22 ? $.key.slice(0, 20) + "\u2026" : $.key;
            O.fillText(q, z + 30, V + 12);
            const X = $.point,
              ue =
                X == null || !isFinite(X) ? "\u2014" : Number(X).toPrecision(5);
            (O.fillStyle = Yi($.color, u) || h),
              (O.font = "bold 30px monospace"),
              (O.textBaseline = "middle"),
              O.fillText(ue, z + 12, V + 68, P - 24),
              $.unit &&
                ((O.fillStyle = E),
                (O.font = "10px monospace"),
                (O.textBaseline = "bottom"),
                O.fillText($.unit, z + 12, V + M - 8));
          });
      });
  }
  const N = document.createElement("canvas");
  (N.width = v), (N.height = x + m + k);
  const S = N.getContext("2d");
  (S.fillStyle = f),
    S.fillRect(0, 0, v, x),
    (S.strokeStyle = d),
    (S.lineWidth = 1),
    S.beginPath(),
    S.moveTo(0, x - 0.5),
    S.lineTo(v, x - 0.5),
    S.stroke();
  const C = x / 2;
  S.textBaseline = "middle";
  let _ = 10;
  if (
    (n &&
      ((S.fillStyle = h),
      Ar(S, 10, C - 8, 30, 16, 4),
      S.fill(),
      (S.fillStyle = c),
      (S.font = "bold 9px monospace"),
      (S.textAlign = "center"),
      S.fillText(n, 25, C),
      (_ = 48)),
    t != null &&
      ((S.fillStyle = h),
      (S.font = "bold 12px monospace"),
      (S.textAlign = "left"),
      S.fillText(`#${t}`, _, C),
      (_ += S.measureText(`#${t}`).width + 10)),
    o)
  ) {
    (S.fillStyle = g), (S.font = "11px monospace"), (S.textAlign = "left");
    const A = v - _ - 10,
      K = o.length > 60 ? o.slice(0, 58) + "\u2026" : o;
    S.fillText(K, _, C, A);
  }
  if ((y(S, x), n === "1D" || (n === "0D" && w))) {
    const A = r.filter((K) => K.on);
    (A.length > 0 || a.length > 0) && Bk(S, A, a, v, x, f, d, h, g, E, u);
  } else n === "2D" && l && Wk(S, l, v, x, f, d, h, g);
  (S.fillStyle = f),
    S.fillRect(0, x + m, v, k),
    (S.strokeStyle = d),
    (S.lineWidth = 1),
    S.beginPath(),
    S.moveTo(0, x + m + 0.5),
    S.lineTo(v, x + m + 0.5),
    S.stroke();
  const j = x + m + k / 2;
  (S.textBaseline = "middle"),
    (S.fillStyle = g),
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
  const D = await new Promise((A) => N.toBlob(A, "image/png"));
  if (!D) throw new Error("Failed to generate PNG blob");
  if (typeof navigator < "u" && navigator.clipboard && window.ClipboardItem)
    await navigator.clipboard.write([new ClipboardItem({ "image/png": D })]);
  else {
    const A = URL.createObjectURL(D),
      K = document.createElement("a");
    (K.href = A),
      (K.download = `artiq-plot${t != null ? `-rid${t}` : ""}.png`),
      document.body.appendChild(K),
      K.click(),
      document.body.removeChild(K),
      URL.revokeObjectURL(A);
  }
}
function Qa({ pixels: e, name: t }) {
  const n = p.exports.useRef(null),
    {
      rows: r,
      cols: o,
      vMin: l,
      vMax: a,
    } = p.exports.useMemo(() => {
      var c;
      if (!e || !e.length || !((c = e[0]) != null && c.length))
        return { rows: 0, cols: 0, vMin: 0, vMax: 1 };
      let i = 1 / 0,
        u = -1 / 0;
      for (const f of e) for (const d of f) d < i && (i = d), d > u && (u = d);
      return (
        i === u && (u = i + 1),
        { rows: e.length, cols: e[0].length, vMin: i, vMax: u }
      );
    }, [e]);
  return (
    p.exports.useEffect(() => {
      const i = n.current;
      if (!i || !e || r === 0 || o === 0) return;
      (i.width = o), (i.height = r);
      const u = i.getContext("2d"),
        c = u.createImageData(o, r),
        f = c.data,
        d = a - l;
      let h = 0;
      for (let g = 0; g < r; g++) {
        const E = e[g];
        for (let x = 0; x < o; x++) {
          const k = Math.round(((E[x] - l) / d) * 255);
          (f[h] = k),
            (f[h + 1] = k),
            (f[h + 2] = k),
            (f[h + 3] = 255),
            (h += 4);
        }
      }
      u.putImageData(c, 0, 0);
    }, [e, r, o, l, a]),
    !e || r === 0
      ? s.createElement("div", { className: "p-img-empty" }, "no data")
      : s.createElement("canvas", {
          ref: n,
          className: "p-img-canvas",
          "aria-label": t ? `${t} image` : "image",
        })
  );
}
Qa.propTypes = { pixels: R.exports.array, name: R.exports.string };
const Hk = 5e3,
  Vk = 6e4,
  $v = "artiq_http.selected_images";
function Kk() {
  try {
    return new Set(JSON.parse(localStorage.getItem($v) || "[]"));
  } catch {
    return new Set();
  }
}
function Gk(e) {
  try {
    localStorage.setItem($v, JSON.stringify([...e]));
  } catch {}
}
function Lv(e) {
  var t;
  return !e || !e.length || !((t = e[0]) != null && t.length)
    ? null
    : e[0].length / e.length;
}
function Qk({
  name: e,
  selected: t,
  thumbPixels: n,
  expanded: r,
  onExpand: o,
  onClose: l,
}) {
  var f, d, h;
  const { data: a } = Nv(e, { enabled: t }),
    i =
      (d = (f = a == null ? void 0 : a[e]) == null ? void 0 : f[1]) != null
        ? d
        : null,
    u = i != null ? i : n;
  if (!t) return null;
  const c = (h = Lv(u)) != null ? h : 1;
  return s.createElement(
    "div",
    { className: "p-img-cell" },
    s.createElement(
      "div",
      { className: "p-img-cell__head" },
      s.createElement(
        "span",
        { className: "p-img-cell__name p-mono", title: e },
        e,
      ),
    ),
    s.createElement(
      "button",
      {
        type: "button",
        className: "p-img-cell__frame",
        style: { aspectRatio: String(c) },
        onClick: () => o(e),
        title: `Expand ${e}`,
        "aria-label": `Expand ${e}`,
      },
      s.createElement(Qa, { name: e, pixels: u }),
    ),
    r && s.createElement(qk, { name: e, pixels: u, onClose: l }),
  );
}
function qk({ name: e, pixels: t, onClose: n }) {
  var o;
  const r = (o = Lv(t)) != null ? o : 1;
  return (
    p.exports.useEffect(() => {
      const l = (a) => {
        a.key === "Escape" && n();
      };
      return (
        document.addEventListener("keydown", l),
        () => document.removeEventListener("keydown", l)
      );
    }, [n]),
    s.createElement(
      "div",
      {
        className: "p-img-lightbox",
        onClick: n,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": `${e} image`,
      },
      s.createElement(
        "div",
        {
          className: "p-img-lightbox__bar",
          onClick: (l) => l.stopPropagation(),
        },
        s.createElement(
          "span",
          { className: "p-img-lightbox__name p-mono", title: e },
          e,
        ),
        s.createElement(
          "button",
          {
            type: "button",
            className: "p-btn ghost icon",
            onClick: n,
            "aria-label": "Close",
            title: "Close",
          },
          s.createElement(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
            },
            s.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            s.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
          ),
        ),
      ),
      s.createElement(
        "div",
        { className: "p-img-lightbox__body" },
        s.createElement(
          "div",
          {
            className: "p-img-lightbox__frame",
            style: { aspectRatio: String(r) },
            onClick: (l) => l.stopPropagation(),
          },
          s.createElement(Qa, { name: e, pixels: t }),
        ),
      ),
    )
  );
}
function Yk() {
  const [e, t] = p.exports.useState([]),
    [n, r] = p.exports.useState(Kk),
    [o, l] = p.exports.useState({}),
    [a, i] = p.exports.useState(null),
    u = p.exports.useRef(null),
    c = p.exports.useCallback(async () => {
      try {
        const { names: g = [] } = await ac(),
          E = g.filter((x) => /image/i.test(x) && !x.startsWith("ndscan."));
        t((x) => (JSON.stringify(x) === JSON.stringify(E) ? x : E));
      } catch {}
    }, []);
  p.exports.useEffect(() => {
    c();
    const g = setInterval(c, Hk);
    return () => clearInterval(g);
  }, [c]);
  const f = p.exports.useCallback(async (g) => {
    if (!!g.length)
      try {
        const E = await Rr(g.join(","));
        l((x) => {
          const k = { ...x };
          for (const v of g) E[v] && (k[v] = E[v][1]);
          return k;
        });
      } catch {}
  }, []);
  p.exports.useEffect(() => {
    if (!!e.length)
      return (
        f(e),
        (u.current = setInterval(() => f(e), Vk)),
        () => clearInterval(u.current)
      );
  }, [e, f]);
  const d = p.exports.useCallback((g) => {
      r((E) => {
        const x = new Set(E);
        return x.has(g) ? x.delete(g) : x.add(g), Gk(x), x;
      });
    }, []),
    h = p.exports.useMemo(() => e.some((g) => n.has(g)), [e, n]);
  return (
    p.exports.useEffect(() => {
      a && !e.includes(a) && i(null);
    }, [a, e]),
    e.length
      ? s.createElement(
          "div",
          { className: "p-panel p-img-section" },
          s.createElement(
            "div",
            { className: "p-img-section__head" },
            s.createElement("span", { className: "p-lbl" }, "images"),
            s.createElement(
              "span",
              { className: "p-img-section__hint p-dim" },
              h ? "tap an image to expand" : "select images to view",
            ),
          ),
          s.createElement(
            "div",
            { className: "p-img-selector" },
            e.map((g) => {
              var x;
              const E = n.has(g);
              return s.createElement(
                "button",
                {
                  key: g,
                  type: "button",
                  className: `p-img-chip ${E ? "is-selected" : ""}`,
                  onClick: () => d(g),
                  "aria-pressed": E,
                  title: E ? `Hide ${g}` : `Show ${g}`,
                },
                s.createElement(
                  "span",
                  { className: "p-img-chip__thumb" },
                  s.createElement(Qa, {
                    name: g,
                    pixels: (x = o[g]) != null ? x : null,
                  }),
                ),
                s.createElement("span", { className: "p-img-chip__name" }, g),
              );
            }),
          ),
          h &&
            s.createElement(
              "div",
              { className: "p-img-grid" },
              e.map((g) => {
                var E;
                return s.createElement(Qk, {
                  key: g,
                  name: g,
                  selected: n.has(g),
                  thumbPixels: (E = o[g]) != null ? E : null,
                  expanded: a === g,
                  onExpand: i,
                  onClose: () => i(null),
                });
              }),
            ),
        )
      : null
  );
}
const Xk = 5e3;
function Jk(e, t) {
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
      g = c.map((x, k) => {
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
      axisValues: g,
      completed: d,
      fragmentFqn: h,
      dims: `${c.length}D`,
    };
  } catch (i) {
    return console.error("Failed to parse plot data for", t, i), null;
  }
}
function Rs(e) {
  if (!e) return "";
  const t = e.param || {},
    n = t.description || t.fqn || "axis",
    r = t.unit;
  return r ? `${n} / ${r}` : n;
}
function Zk(e) {
  if (!e || typeof e != "object") return "";
  const t = e.unit;
  return t
    ? `${e.type || ""}${e.type ? " \xB7 " : ""}${t}`.trim()
    : e.type || "";
}
function e2() {
  var le, Ut;
  const [e, t] = Xu(),
    [n, r] = p.exports.useState([]),
    [o, l] = p.exports.useState({}),
    [a, i] = p.exports.useState(null),
    [u, c] = p.exports.useState(!1),
    f = p.exports.useCallback(async () => {
      try {
        const ae = ((await ac()).names || [])
          .filter((ee) => ee.endsWith(".axes"))
          .map((ee) => ee.replace(/\.axes$/, ""))
          .sort((ee, rt) => {
            const qe = zn(ee),
              De = zn(rt);
            return qe != null && De != null ? De - qe : rt.localeCompare(ee);
          });
        if (ae.length === 0) {
          r((ee) => (ee.length === 0 ? ee : [])), l({}), i(null);
          return;
        }
        const ce = ae.flatMap((ee) => [`${ee}.fragment_fqn`, `${ee}.axes`]),
          Se = await Rr(ce),
          se = {};
        for (const ee of ae) {
          const rt = Se[`${ee}.fragment_fqn`],
            qe = Se[`${ee}.axes`];
          let De = null;
          if (qe)
            try {
              De = `${JSON.parse(qe[1]).length}D`;
            } catch {}
          se[ee] = { fragmentFqn: rt ? rt[1] : null, dims: De };
        }
        r((ee) => (JSON.stringify(ee) === JSON.stringify(ae) ? ee : ae)),
          l(se),
          i(null);
      } catch (U) {
        i(U.message || String(U));
      } finally {
        c(!0);
      }
    }, []);
  p.exports.useEffect(() => {
    f();
    const U = setInterval(f, Xk);
    return () => clearInterval(U);
  }, [f]);
  const d = p.exports.useMemo(
      () =>
        n.map((U) => {
          const J = o[U] || {},
            ae = J.fragmentFqn,
            ce = ae || U.replace(/^ndscan\./, "");
          return {
            prefix: U,
            rid: zn(U),
            dims: J.dims,
            expName: ce,
            fragmentFqn: ae,
          };
        }),
      [n, o],
    ),
    [h, g] = p.exports.useState(null);
  p.exports.useEffect(() => {
    const U = e.get("scan");
    if (U) {
      g((J) => (J === U ? J : U));
      return;
    }
    d.length && !h && g(d[0].prefix);
  }, [e, d, h]);
  const E = p.exports.useCallback(
      (U) => {
        g(U.prefix);
        const J = new URLSearchParams(e);
        J.set("scan", U.prefix), t(J, { replace: !0 });
      },
      [e, t],
    ),
    { data: x, connectionState: k, error: v } = Nv(h, { enabled: !!h }),
    m = p.exports.useMemo(() => Jk(x, h), [x, h]),
    y =
      (m == null ? void 0 : m.dims) ||
      ((le = o[h]) == null ? void 0 : le.dims) ||
      null,
    w =
      (m == null ? void 0 : m.fragmentFqn) ||
      ((Ut = o[h]) == null ? void 0 : Ut.fragmentFqn) ||
      null,
    N = w || (h || "").replace(/^ndscan\./, ""),
    S =
      m != null && m.channels ? Object.keys(m.channels).sort().join("\0") : "",
    C = p.exports.useMemo(() => (S ? S.split("\0") : []), [S]),
    [_, j] = p.exports.useState({});
  p.exports.useEffect(() => {
    if (!C.length) return;
    const U = Lk(w);
    j((J) => {
      let ae = !1;
      const ce = { ...J };
      for (let Se = 0; Se < C.length; Se++) {
        const se = C[Se];
        if (U && se in U) {
          const ee = !!U[se];
          ce[se] !== ee && ((ce[se] = ee), (ae = !0));
        } else se in ce || ((ce[se] = Se < 3), (ae = !0));
      }
      return ae ? ce : J;
    });
  }, [w, C]);
  const D = p.exports.useCallback(
      (U) => {
        j((J) => {
          const ae = { ...J, [U]: !J[U] };
          return jk(w, ae), ae;
        });
      },
      [w],
    ),
    [A, K] = p.exports.useState(null);
  p.exports.useEffect(() => {
    y === "2D" && C.length && !C.includes(A) && K(C[0]);
  }, [y, C, A]);
  const [G, P] = p.exports.useState([]),
    M = p.exports.useRef(null);
  p.exports.useEffect(() => {
    P([]), (M.current = null);
  }, [h]),
    p.exports.useEffect(() => {
      var Se;
      if (!m || m.axes.length !== 0) return;
      const U = Object.keys(m.channels),
        J = {};
      let ae = !1;
      for (const se of U) {
        const ee =
          (Se = x == null ? void 0 : x[`${h}.point.${se}`]) == null
            ? void 0
            : Se[1];
        ee !== void 0 && ((J[se] = ee), (ae = !0));
      }
      if (!ae) return;
      const ce = M.current;
      (!ce || U.some((se) => J[se] !== ce[se])) &&
        ((M.current = J), P((se) => [...se, { t: Date.now(), snap: J }]));
    }, [x, m, h]);
  const F = p.exports.useMemo(() => {
      if (!m || m.axes.length !== 0 || G.length === 0) return null;
      const U = G[0].t,
        J = G.map((ce) => (ce.t - U) / 1e3),
        ae = {};
      for (const ce of Object.keys(m.channels))
        ae[ce] = G.map((Se) => Se.snap[ce]);
      return { xs: J, channelValues: ae };
    }, [G, m]),
    Q = p.exports.useMemo(
      () =>
        m
          ? C.map((U, J) => {
              const ae = m.channels[U] || {},
                ce = m.channelData[U] || {},
                Se = vd[J % vd.length],
                ee = y === "2D" ? y === "2D" && U === A : !!_[U];
              return {
                key: U,
                on: ee,
                color: `var(${Se})`,
                unit: Zk(ae),
                values: ce.values || [],
                point: ce.point,
              };
            })
          : [],
      [m, C, _, y, A],
    ),
    O = p.exports.useRef(null),
    [I, $] = p.exports.useState(!1);
  p.exports.useEffect(() => {
    const U = () => {
      $(document.fullscreenElement === O.current);
    };
    return (
      document.addEventListener("fullscreenchange", U),
      () => document.removeEventListener("fullscreenchange", U)
    );
  }, []);
  const B = p.exports.useCallback(() => {
      I
        ? document.exitFullscreen().catch(console.error)
        : O.current && O.current.requestFullscreen().catch(console.error);
    }, [I]),
    H = p.exports.useCallback(async () => {
      if (!O.current || !y) throw new Error("No plot to copy");
      await Uk({
        containerEl: O.current,
        rid: zn(h || ""),
        dims: y,
        channelDescriptors: Q,
      });
    }, [h, y, Q]),
    b = d,
    [z, V] = p.exports.useState([]);
  p.exports.useEffect(() => {
    V([]);
  }, [h]);
  const q = p.exports.useCallback((U) => {
      V((J) => (J.includes(U) ? J.filter((ae) => ae !== U) : [...J, U]));
    }, []),
    [X, ue] = p.exports.useState({});
  p.exports.useEffect(() => {
    ue((U) => (Object.keys(U).length === 0 ? U : {}));
  }, [h]);
  const ne = z.join(" ");
  p.exports.useEffect(() => {
    if (y !== "1D" || z.length === 0) return;
    let U = !1;
    async function J() {
      const ae = z.filter((ce) => !X[ce]);
      if (!!ae.length)
        try {
          const ce = ae.flatMap((se) => [
              `${se}.points.axis_0`,
              ...C.map((ee) => `${se}.points.channel_${ee}`),
            ]),
            Se = await Rr(ce);
          if (U) return;
          ue((se) => {
            var rt, qe;
            const ee = { ...se };
            for (const De of ae) {
              const re =
                  ((rt = Se[`${De}.points.axis_0`]) == null ? void 0 : rt[1]) ||
                  [],
                dt = C[0],
                In = dt
                  ? ((qe = Se[`${De}.points.channel_${dt}`]) == null
                      ? void 0
                      : qe[1]) || []
                  : [];
              ee[De] = { xs: re, values: In, rid: zn(De) };
            }
            return ee;
          });
        } catch (ce) {
          console.error("Failed to load ghost data:", ce);
        }
    }
    return (
      J(),
      () => {
        U = !0;
      }
    );
  }, [ne, S, y]);
  const de = p.exports.useMemo(
      () =>
        y !== "1D"
          ? []
          : z.map((U) => X[U]).filter((U) => U && U.values && U.values.length),
      [z, X, y],
    ),
    Re = p.exports.useMemo(
      () =>
        h
          ? k === We.ERROR
            ? "error"
            : k === We.CONNECTING || k === We.RECONNECTING
              ? "connecting"
              : m != null && m.completed
                ? "done"
                : "live"
          : null,
      [h, k, m],
    ),
    Be = p.exports.useMemo(() => {
      var U;
      return m
        ? y === "1D" || y === "2D"
          ? `${((U = m.axisValues[0]) == null ? void 0 : U.length) || 0} pts`
          : y === "0D" && G.length > 0
            ? `${G.length} pts`
            : "streaming"
        : "";
    }, [m, y, G]);
  return u && d.length === 0
    ? s.createElement(
        "div",
        { className: "plots-app" },
        s.createElement(Qi, {
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
        s.createElement(Qi, {
          recentRuns: d,
          currentPrefix: h,
          onPick: E,
          progress: Be,
          status: Re,
          onCopy: m ? H : void 0,
        }),
        s.createElement(
          "div",
          { className: "p-work" },
          s.createElement(_v, {
            mode: y || "1D",
            channels: Q,
            onToggle: D,
            onPickMetric: K,
            experiment: w,
            saved: !!w,
          }),
          s.createElement(
            "div",
            { className: "p-center" },
            s.createElement(jv, {
              prefix: h,
              rid: zn(h || ""),
              fragmentFqn: w,
              dims: y,
            }),
            s.createElement(
              "div",
              {
                ref: O,
                className: "p-panel p-plot-panel",
                style: {
                  flex: 1,
                  padding: 0,
                  position: "relative",
                  minHeight: 0,
                  overflow: "hidden",
                },
              },
              s.createElement(Dv, {
                active: m,
                dims: y,
                channelDescriptors: Q,
                metric2D: A,
                ghosts: de,
                status: Re,
                sseError: v,
                timeseries0D: F,
              }),
              s.createElement(
                "button",
                {
                  className: "p-btn ghost icon",
                  title: I ? "Exit fullscreen" : "Fullscreen (plot only)",
                  "aria-label": I ? "exit fullscreen" : "open plot fullscreen",
                  onClick: B,
                  style: { position: "absolute", top: 6, right: 6, zIndex: 10 },
                },
                I
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
                      s.createElement("polyline", {
                        points: "4 14 10 14 10 20",
                      }),
                      s.createElement("polyline", {
                        points: "20 10 14 10 14 4",
                      }),
                      s.createElement("line", {
                        x1: "10",
                        y1: "14",
                        x2: "3",
                        y2: "21",
                      }),
                      s.createElement("line", {
                        x1: "21",
                        y1: "3",
                        x2: "14",
                        y2: "10",
                      }),
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
                      s.createElement("polyline", { points: "15 3 21 3 21 9" }),
                      s.createElement("polyline", { points: "9 21 3 21 3 15" }),
                      s.createElement("line", {
                        x1: "21",
                        y1: "3",
                        x2: "14",
                        y2: "10",
                      }),
                      s.createElement("line", {
                        x1: "3",
                        y1: "21",
                        x2: "10",
                        y2: "14",
                      }),
                    ),
              ),
            ),
            s.createElement(Yk, null),
          ),
          s.createElement(Ov, {
            experiment: N,
            runs: b,
            activeRid: zn(h || ""),
            ghostPrefixes: z,
            onToggleGhost: q,
            onPick: E,
            dims: y,
          }),
        ),
      );
}
function jv({ prefix: e, rid: t, fragmentFqn: n, dims: r }) {
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
function Dv({
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
    if (i && i.xs.length > 1) {
      const f = n.map((d) => ({ ...d, values: i.channelValues[d.key] || [] }));
      return s.createElement(qi, {
        xs: i.xs,
        xLabel: "elapsed / s",
        yLabel: "value",
        channels: f,
      });
    }
    const c = n.map((f) => ({ ...f, value: f.point }));
    return s.createElement(Tv, { channels: c });
  }
  if (t === "1D") {
    const c = e.axisValues[0] || [],
      f = e.axes[0];
    return s.createElement(qi, {
      xs: c,
      xLabel: Rs(f),
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
    return s.createElement(bv, {
      xs: c,
      ys: f,
      values: h,
      xLabel: Rs(e.axes[0]),
      yLabel: Rs(e.axes[1]),
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
Dv.propTypes = {
  active: R.exports.object,
  dims: R.exports.string,
  channelDescriptors: R.exports.array.isRequired,
  metric2D: R.exports.string,
  ghosts: R.exports.array,
  status: R.exports.string,
  sseError: R.exports.string,
  timeseries0D: R.exports.object,
};
jv.propTypes = {
  prefix: R.exports.string,
  rid: R.exports.number,
  fragmentFqn: R.exports.string,
  dims: R.exports.string,
};
function Mv() {
  return s.createElement(e2, null);
}
var Nl;
function gd(e) {
  if (((!Nl && Nl !== 0) || e) && Kr) {
    var t = document.createElement("div");
    (t.style.position = "absolute"),
      (t.style.top = "-9999px"),
      (t.style.width = "50px"),
      (t.style.height = "50px"),
      (t.style.overflow = "scroll"),
      document.body.appendChild(t),
      (Nl = t.offsetWidth - t.clientWidth),
      document.body.removeChild(t);
  }
  return Nl;
}
function _s(e) {
  e === void 0 && (e = Vr());
  try {
    var t = e.activeElement;
    return !t || !t.nodeName ? null : t;
  } catch {
    return e.body;
  }
}
const t2 = "data-rr-ui-";
function n2(e) {
  return `${t2}${e}`;
}
function r2(e = document) {
  const t = e.defaultView;
  return Math.abs(t.innerWidth - e.documentElement.clientWidth);
}
const yd = n2("modal-open");
class bc {
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
    return r2(this.ownerDocument);
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
        (n[r] = `${parseInt(Xt(o, r) || "0", 10) + t.scrollBarWidth}px`),
      o.setAttribute(yd, ""),
      Xt(o, n);
  }
  reset() {
    [...this.modals].forEach((t) => this.remove(t));
  }
  removeContainerStyle(t) {
    const n = this.getElement();
    n.removeAttribute(yd), Object.assign(n.style, t.style);
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
const o2 = [
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
function l2(e, t) {
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
function a2(e) {
  return (
    Os || (Os = new bc({ ownerDocument: e == null ? void 0 : e.document })), Os
  );
}
function s2(e) {
  const t = dv(),
    n = e || a2(t),
    r = p.exports.useRef({ dialog: null, backdrop: null });
  return Object.assign(r.current, {
    add: () => n.add(r.current),
    remove: () => n.remove(r.current),
    isTopModal: () => n.isTopModal(r.current),
    setDialogRef: p.exports.useCallback((o) => {
      r.current.dialog = o;
    }, []),
    setBackdropRef: p.exports.useCallback((o) => {
      r.current.backdrop = o;
    }, []),
  });
}
const Iv = p.exports.forwardRef((e, t) => {
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
      autoFocus: g = !0,
      enforceFocus: E = !0,
      restoreFocus: x = !0,
      restoreFocusOptions: k,
      renderDialog: v,
      renderBackdrop: m = (le) => T.exports.jsx("div", Object.assign({}, le)),
      manager: y,
      container: w,
      onShow: N,
      onHide: S = () => {},
      onExit: C,
      onExited: _,
      onExiting: j,
      onEnter: D,
      onEntering: A,
      onEntered: K,
    } = e,
    G = l2(e, o2);
  const P = Ki(w),
    M = s2(y),
    F = ic(),
    Q = yk(n),
    [O, I] = p.exports.useState(!n),
    $ = p.exports.useRef(null);
  p.exports.useImperativeHandle(t, () => M, [M]),
    Kr && !Q && n && ($.current = _s()),
    !d && !n && !O ? I(!0) : n && O && I(!1);
  const B = Ve(() => {
      if (
        (M.add(),
        (X.current = Qt(document, "keydown", V)),
        (q.current = Qt(document, "focus", () => setTimeout(b), !0)),
        N && N(),
        g)
      ) {
        const le = _s(document);
        M.dialog &&
          le &&
          !Wo(M.dialog, le) &&
          (($.current = le), M.dialog.focus());
      }
    }),
    H = Ve(() => {
      if (
        (M.remove(),
        X.current == null || X.current(),
        q.current == null || q.current(),
        x)
      ) {
        var le;
        (le = $.current) == null || le.focus == null || le.focus(k),
          ($.current = null);
      }
    });
  p.exports.useEffect(() => {
    !n || !P || B();
  }, [n, P, B]),
    p.exports.useEffect(() => {
      !O || H();
    }, [O, H]),
    uc(() => {
      H();
    });
  const b = Ve(() => {
      if (!E || !F() || !M.isTopModal()) return;
      const le = _s();
      M.dialog && le && !Wo(M.dialog, le) && M.dialog.focus();
    }),
    z = Ve((le) => {
      le.target === le.currentTarget && (c == null || c(le), i === !0 && S());
    }),
    V = Ve((le) => {
      u &&
        le.keyCode === 27 &&
        M.isTopModal() &&
        (f == null || f(le), le.defaultPrevented || S());
    }),
    q = p.exports.useRef(),
    X = p.exports.useRef(),
    ue = (...le) => {
      I(!0), _ == null || _(...le);
    },
    ne = d;
  if (!P || !(n || (ne && !O))) return null;
  const de = Object.assign(
    {
      role: r,
      ref: M.setDialogRef,
      "aria-modal": r === "dialog" ? !0 : void 0,
    },
    G,
    { style: l, className: o, tabIndex: -1 },
  );
  let Re = v
    ? v(de)
    : T.exports.jsx(
        "div",
        Object.assign({}, de, {
          children: p.exports.cloneElement(a, { role: "document" }),
        }),
      );
  ne &&
    (Re = T.exports.jsx(ne, {
      appear: !0,
      unmountOnExit: !0,
      in: !!n,
      onExit: C,
      onExiting: j,
      onExited: ue,
      onEnter: D,
      onEntering: A,
      onEntered: K,
      children: Re,
    }));
  let Be = null;
  if (i) {
    const le = h;
    (Be = m({ ref: M.setBackdropRef, onClick: z })),
      le && (Be = T.exports.jsx(le, { appear: !0, in: !!n, children: Be }));
  }
  return T.exports.jsx(T.exports.Fragment, {
    children: Hn.createPortal(
      T.exports.jsxs(T.exports.Fragment, { children: [Be, Re] }),
      P,
    ),
  });
});
Iv.displayName = "Modal";
const i2 = Object.assign(Iv, { Manager: bc });
function u2(e, t) {
  e.classList
    ? e.classList.add(t)
    : mv(e, t) ||
      (typeof e.className == "string"
        ? (e.className = e.className + " " + t)
        : e.setAttribute(
            "class",
            ((e.className && e.className.baseVal) || "") + " " + t,
          ));
}
var c2 = Function.prototype.bind.call(Function.prototype.call, [].slice);
function lr(e, t) {
  return c2(e.querySelectorAll(t));
}
function xd(e, t) {
  return e
    .replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1")
    .replace(/\s+/g, " ")
    .replace(/^\s*|\s*$/g, "");
}
function f2(e, t) {
  e.classList
    ? e.classList.remove(t)
    : typeof e.className == "string"
      ? (e.className = xd(e.className, t))
      : e.setAttribute(
          "class",
          xd((e.className && e.className.baseVal) || "", t),
        );
}
const ar = {
  FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
  STICKY_CONTENT: ".sticky-top",
  NAVBAR_TOGGLER: ".navbar-toggler",
};
class d2 extends bc {
  adjustAndStore(t, n, r) {
    const o = n.style[t];
    (n.dataset[t] = o), Xt(n, { [t]: `${parseFloat(Xt(n, t)) + r}px` });
  }
  restore(t, n) {
    const r = n.dataset[t];
    r !== void 0 && (delete n.dataset[t], Xt(n, { [t]: r }));
  }
  setContainerStyle(t) {
    super.setContainerStyle(t);
    const n = this.getElement();
    if ((u2(n, "modal-open"), !t.scrollBarWidth)) return;
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    lr(n, ar.FIXED_CONTENT).forEach((l) =>
      this.adjustAndStore(r, l, t.scrollBarWidth),
    ),
      lr(n, ar.STICKY_CONTENT).forEach((l) =>
        this.adjustAndStore(o, l, -t.scrollBarWidth),
      ),
      lr(n, ar.NAVBAR_TOGGLER).forEach((l) =>
        this.adjustAndStore(o, l, t.scrollBarWidth),
      );
  }
  removeContainerStyle(t) {
    super.removeContainerStyle(t);
    const n = this.getElement();
    f2(n, "modal-open");
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    lr(n, ar.FIXED_CONTENT).forEach((l) => this.restore(r, l)),
      lr(n, ar.STICKY_CONTENT).forEach((l) => this.restore(o, l)),
      lr(n, ar.NAVBAR_TOGGLER).forEach((l) => this.restore(o, l));
  }
}
let Ps;
function p2(e) {
  return Ps || (Ps = new d2(e)), Ps;
}
const m2 = je("modal-body"),
  zv = p.exports.createContext({ onHide() {} }),
  Tc = p.exports.forwardRef(
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
      e = te(e, "modal");
      const f = `${e}-dialog`,
        d = typeof l == "string" ? `${e}-fullscreen-${l}` : `${e}-fullscreen`;
      return T.exports.jsx("div", {
        ...u,
        ref: c,
        className: Y(
          f,
          t,
          o && `${e}-${o}`,
          r && `${f}-centered`,
          i && `${f}-scrollable`,
          l && d,
        ),
        children: T.exports.jsx("div", {
          className: Y(`${e}-content`, n),
          children: a,
        }),
      });
    },
  );
Tc.displayName = "ModalDialog";
const h2 = je("modal-footer"),
  v2 = { closeLabel: "Close", closeButton: !1 },
  Av = p.exports.forwardRef(
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
      const i = p.exports.useContext(zv),
        u = Ve(() => {
          i == null || i.onHide(), r == null || r();
        });
      return T.exports.jsxs("div", {
        ref: a,
        ...l,
        children: [
          o,
          n && T.exports.jsx(Gr, { "aria-label": e, variant: t, onClick: u }),
        ],
      });
    },
  );
Av.defaultProps = v2;
const g2 = { closeLabel: "Close", closeButton: !1 },
  $c = p.exports.forwardRef(
    ({ bsPrefix: e, className: t, ...n }, r) => (
      (e = te(e, "modal-header")),
      T.exports.jsx(Av, { ref: r, ...n, className: Y(t, e) })
    ),
  );
$c.displayName = "ModalHeader";
$c.defaultProps = g2;
const y2 = Ha("h4"),
  x2 = je("modal-title", { Component: y2 }),
  E2 = {
    show: !1,
    backdrop: !0,
    keyboard: !0,
    autoFocus: !0,
    enforceFocus: !0,
    restoreFocus: !0,
    animation: !0,
    dialogAs: Tc,
  };
function w2(e) {
  return T.exports.jsx(fn, { ...e, timeout: null });
}
function S2(e) {
  return T.exports.jsx(fn, { ...e, timeout: null });
}
const Lc = p.exports.forwardRef(
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
      keyboard: g,
      onEscapeKeyDown: E,
      onShow: x,
      onHide: k,
      container: v,
      autoFocus: m,
      enforceFocus: y,
      restoreFocus: w,
      restoreFocusOptions: N,
      onEntered: S,
      onExit: C,
      onExiting: _,
      onEnter: j,
      onEntering: D,
      onExited: A,
      backdropClassName: K,
      manager: G,
      ...P
    },
    M,
  ) => {
    const [F, Q] = p.exports.useState({}),
      [O, I] = p.exports.useState(!1),
      $ = p.exports.useRef(!1),
      B = p.exports.useRef(!1),
      H = p.exports.useRef(null),
      [b, z] = ya(),
      V = Zo(M, z),
      q = Ve(k),
      X = Ju();
    e = te(e, "modal");
    const ue = p.exports.useMemo(() => ({ onHide: q }), [q]);
    function ne() {
      return G || p2({ isRTL: X });
    }
    function de(re) {
      if (!Kr) return;
      const dt = ne().getScrollbarWidth() > 0,
        In = re.scrollHeight > Vr(re).documentElement.clientHeight;
      Q({
        paddingRight: dt && !In ? gd() : void 0,
        paddingLeft: !dt && In ? gd() : void 0,
      });
    }
    const Re = Ve(() => {
      b && de(b.dialog);
    });
    uc(() => {
      _i(window, "resize", Re), H.current == null || H.current();
    });
    const Be = () => {
        $.current = !0;
      },
      le = (re) => {
        $.current && b && re.target === b.dialog && (B.current = !0),
          ($.current = !1);
      },
      Ut = () => {
        I(!0),
          (H.current = ah(b.dialog, () => {
            I(!1);
          }));
      },
      U = (re) => {
        re.target === re.currentTarget && Ut();
      },
      J = (re) => {
        if (h === "static") {
          U(re);
          return;
        }
        if (B.current || re.target !== re.currentTarget) {
          B.current = !1;
          return;
        }
        k == null || k();
      },
      ae = (re) => {
        g ? E == null || E(re) : (re.preventDefault(), h === "static" && Ut());
      },
      ce = (re, dt) => {
        re && de(re), j == null || j(re, dt);
      },
      Se = (re) => {
        H.current == null || H.current(), C == null || C(re);
      },
      se = (re, dt) => {
        D == null || D(re, dt), lh(window, "resize", Re);
      },
      ee = (re) => {
        re && (re.style.display = ""),
          A == null || A(re),
          _i(window, "resize", Re);
      },
      rt = p.exports.useCallback(
        (re) =>
          T.exports.jsx("div", {
            ...re,
            className: Y(`${e}-backdrop`, K, !d && "show"),
          }),
        [d, K, e],
      ),
      qe = { ...n, ...F };
    qe.display = "block";
    const De = (re) =>
      T.exports.jsx("div", {
        role: "dialog",
        ...re,
        style: qe,
        className: Y(t, e, O && `${e}-static`, !d && "show"),
        onClick: h ? J : void 0,
        onMouseUp: le,
        "aria-label": c,
        "aria-labelledby": i,
        "aria-describedby": u,
        children: T.exports.jsx(a, {
          ...P,
          onMouseDown: Be,
          className: r,
          contentClassName: o,
          children: l,
        }),
      });
    return T.exports.jsx(zv.Provider, {
      value: ue,
      children: T.exports.jsx(i2, {
        show: f,
        ref: V,
        backdrop: h,
        container: v,
        keyboard: !0,
        autoFocus: m,
        enforceFocus: y,
        restoreFocus: w,
        restoreFocusOptions: N,
        onEscapeKeyDown: ae,
        onShow: x,
        onHide: k,
        onEnter: ce,
        onEntering: se,
        onEntered: S,
        onExit: Se,
        onExiting: _,
        onExited: ee,
        manager: ne(),
        transition: d ? w2 : void 0,
        backdropTransition: d ? S2 : void 0,
        renderBackdrop: rt,
        renderDialog: De,
      }),
    });
  },
);
Lc.displayName = "Modal";
Lc.defaultProps = E2;
const Cl = Object.assign(Lc, {
  Body: m2,
  Header: $c,
  Title: x2,
  Footer: h2,
  Dialog: Tc,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
});
function Fv({ errorType: e, show: t }) {
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
        Cl,
        {
          show: t,
          backdrop: "static",
          keyboard: !1,
          centered: !0,
          className: "connection-error-modal",
        },
        s.createElement(
          Cl.Header,
          { className: `bg-${r.variant} text-white` },
          s.createElement(
            Cl.Title,
            null,
            s.createElement("i", {
              className: "bi bi-exclamation-triangle-fill me-2",
            }),
            r.title,
          ),
        ),
        s.createElement(
          Cl.Body,
          null,
          s.createElement(
            Ea,
            { variant: r.variant, className: "mb-3" },
            s.createElement("strong", null, r.message),
          ),
          s.createElement(
            "div",
            { className: "text-center" },
            s.createElement(Oc, {
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
Fv.propTypes = {
  errorType: R.exports.oneOf(["backend", "artiq", null]),
  show: R.exports.bool.isRequired,
};
class sr extends s.Component {
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
const Bv = [
  { name: "CRITICAL", value: 50, className: "log-level-critical" },
  { name: "ERROR", value: 40, className: "log-level-error" },
  { name: "WARNING", value: 30, className: "log-level-warning" },
  { name: "INFO", value: 20, className: "log-level-info" },
  { name: "DEBUG", value: 10, className: "log-level-debug" },
];
function Ed(e) {
  if (typeof e != "number")
    return { name: String(e != null ? e : ""), className: "log-level-debug" };
  for (const t of Bv) if (e >= t.value) return t;
  return { name: String(e), className: "log-level-debug" };
}
function wd(e) {
  if (typeof e != "number" || Number.isNaN(e)) return "";
  const t = new Date(e * 1e3);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString();
}
const k2 = 5e3,
  N2 = (e) =>
    e &&
    (e.length > 200 ||
      e.includes(`
`));
function C2({ currentPage: e }) {
  const [t, n] = p.exports.useState([]),
    [r, o] = p.exports.useState(!0),
    [l, a] = p.exports.useState(!1),
    [i, u] = p.exports.useState(null),
    [c, f] = p.exports.useState(20),
    [d, h] = p.exports.useState(new Set()),
    g = p.exports.useRef(0),
    E = (v) =>
      h((m) => {
        const y = new Set(m);
        return y.has(v) ? y.delete(v) : y.add(v), y;
      }),
    x = p.exports.useCallback(async (v = !1) => {
      const m = Date.now();
      (g.current = m), v ? a(!0) : o(!0);
      try {
        const y = await OE();
        if (g.current !== m) return;
        n(Array.isArray(y == null ? void 0 : y.logs) ? y.logs : []), u(null);
      } catch (y) {
        if (g.current !== m) return;
        u(`Failed to load logs: ${y.message}`);
      } finally {
        g.current === m && (o(!1), a(!1));
      }
    }, []);
  p.exports.useEffect(() => {
    x(!1);
  }, [x]),
    p.exports.useEffect(() => {
      const v = setInterval(() => {
        document.visibilityState === "visible" && e === "logs" && x(!0);
      }, k2);
      return () => clearInterval(v);
    }, [x, e]),
    p.exports.useEffect(() => {
      const v = () => {
        document.visibilityState === "visible" && e === "logs" && x(!0);
      };
      return (
        document.addEventListener("visibilitychange", v),
        () => document.removeEventListener("visibilitychange", v)
      );
    }, [x, e]);
  const k = p.exports.useMemo(
    () =>
      t
        .filter((v) => (typeof v.level == "number" ? v.level : 0) >= c)
        .sort((v, m) => m.timestamp - v.timestamp),
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
              Bv.map((v) =>
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
              s.createElement(dh, {
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
                    k.map((v, m) => {
                      var N, S;
                      const { name: y, className: w } = Ed(v.level);
                      return s.createElement(
                        "tr",
                        { key: m },
                        s.createElement(
                          "td",
                          { className: "logs-timestamp" },
                          wd(v.timestamp),
                        ),
                        s.createElement(
                          "td",
                          null,
                          (N = v.source) != null ? N : "",
                        ),
                        s.createElement(
                          "td",
                          null,
                          s.createElement(
                            "span",
                            { className: `log-level-pill ${w}` },
                            y,
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
                k.map((v, m) => {
                  var S;
                  const { name: y, className: w } = Ed(v.level),
                    N = d.has(m);
                  return s.createElement(
                    "div",
                    { key: m, className: "logs-card" },
                    s.createElement(
                      "div",
                      { className: "logs-card-header" },
                      s.createElement(
                        "span",
                        { className: `log-level-pill ${w}` },
                        y,
                      ),
                      s.createElement(
                        "span",
                        { className: "logs-card-timestamp" },
                        wd(v.timestamp),
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
                          N ? " is-expanded" : ""
                        }`,
                      },
                      (S = v.message) != null ? S : "",
                    ),
                    N2(v.message) &&
                      s.createElement(
                        "button",
                        {
                          className: "logs-card-expand-btn",
                          onClick: () => E(m),
                        },
                        N ? "Show less" : "Show more",
                      ),
                  );
                }),
              ),
            ),
      );
}
function R2({ currentPage: e, onPageChange: t }) {
  const n = [
    { id: "running", label: "Running", Icon: eE },
    { id: "datasets", label: "Datasets", Icon: Tx },
    { id: "plots", label: "Plots", Icon: xh },
    { id: "schedule", label: "Schedule", Icon: Yx },
    { id: "configure", label: "Configure", Icon: sE },
    { id: "logs", label: "Logs", Icon: Kx },
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
function _2() {
  return s.createElement(
    "div",
    {
      className: "plots-fullscreen-wrap",
      style: { width: "100vw", height: "100vh", overflow: "hidden" },
    },
    s.createElement(Mv, null),
  );
}
const O2 = {
  running: "RUNNING",
  datasets: "DATASETS",
  plots: "PLOTS",
  schedule: "SCHEDULE",
  configure: "CONFIGURE",
};
function P2({ currentPage: e, isOnline: t }) {
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
        O2[e] || "",
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
const b2 = 5e3;
function T2() {
  const [e, t] = p.exports.useState(null),
    [n, r] = p.exports.useState(null),
    [o, l] = p.exports.useState(null),
    a = sn(),
    i = Aa(),
    [u] = Xu(),
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
  p.exports.useEffect(() => {
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
  p.exports.useEffect(() => {
    const x = document.getElementById(`section-${f}`);
    x && x.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f]);
  const [h, g] = p.exports.useState({});
  p.exports.useEffect(() => {
    const x = () => {
      CE()
        .then(g)
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
    const m = new URLSearchParams();
    m.set("experiment", v),
      h.repo_rev && m.set("rev", h.repo_rev),
      i({ pathname: "/configure", search: m.toString() }),
      setTimeout(() => {
        const y = document.getElementById("section-configure");
        y && y.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
  };
  return (
    p.exports.useEffect(() => {
      const x = u.get("experiment");
      x && t(x);
    }, [u]),
    p.exports.useEffect(() => {
      const x = async () => {
        try {
          (await _E()).artiq_connected ? l(null) : l("artiq");
        } catch {
          l("backend");
        }
      };
      x();
      const k = setInterval(x, b2);
      return () => clearInterval(k);
    }, []),
    a.pathname === "/plots/fullscreen"
      ? s.createElement(_2, null)
      : s.createElement(
          "div",
          { className: "app-container" },
          s.createElement(Fv, { errorType: o, show: o !== null }),
          s.createElement(P2, { currentPage: f, isOnline: o === null }),
          s.createElement(
            Zu,
            { fluid: !0, className: "p-3 p-md-4" },
            s.createElement(
              "h1",
              { className: "app-h1-desktop desktop-only" },
              "ARTIQ HTTP interface",
            ),
            s.createElement(
              Dt,
              {
                id: "section-running",
                className: `pt-2 page-section ${
                  f === "running" ? "active" : ""
                }`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Running" },
                  s.createElement(sr, null, s.createElement(IE, null)),
                ),
              ),
            ),
            s.createElement(
              Dt,
              {
                id: "section-datasets",
                className: `pt-2 page-section ${
                  f === "datasets" ? "active" : ""
                }`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Datasets", defaultExpanded: !1 },
                  s.createElement(sr, null, s.createElement(Rk, null)),
                ),
              ),
            ),
            s.createElement(
              Dt,
              {
                id: "section-plots",
                className: `pt-2 page-section ${f === "plots" ? "active" : ""}`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Plots", defaultExpanded: !1 },
                  s.createElement(sr, null, s.createElement(Mv, null)),
                ),
              ),
            ),
            s.createElement(
              Dt,
              {
                id: "section-schedule",
                className: `pt-2 page-section ${
                  f === "schedule" ? "active" : ""
                }`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Schedule new" },
                  s.createElement(
                    sr,
                    null,
                    s.createElement(FE, {
                      explist: h,
                      onSelect: E,
                      selectedExperiment: e,
                    }),
                  ),
                ),
              ),
            ),
            s.createElement(
              Dt,
              {
                id: "section-configure",
                className: `pt-2 page-section ${
                  f === "configure" ? "active" : ""
                }`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Configure Submission" },
                  s.createElement(
                    sr,
                    null,
                    s.createElement(gk, {
                      explist: h,
                      experiment: e,
                      repo_rev: n,
                    }),
                  ),
                ),
              ),
            ),
            s.createElement(
              Dt,
              {
                id: "section-logs",
                className: `pt-2 page-section ${f === "logs" ? "active" : ""}`,
              },
              s.createElement(
                He,
                null,
                s.createElement(
                  or,
                  { title: "Logs", defaultExpanded: !1 },
                  s.createElement(
                    sr,
                    null,
                    s.createElement(C2, { currentPage: f }),
                  ),
                ),
              ),
            ),
          ),
          s.createElement(R2, { currentPage: f, onPageChange: d }),
        )
  );
}
Tm(document.getElementById("root")).render(
  s.createElement($1, null, s.createElement(T2, null)),
);
