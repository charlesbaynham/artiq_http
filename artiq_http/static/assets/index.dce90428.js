(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
  new MutationObserver((o) => {
    for (const l of o)
      if (l.type === "childList")
        for (const i of l.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
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
function sf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var g = { exports: {} },
  K = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var xo = Symbol.for("react.element"),
  Dm = Symbol.for("react.portal"),
  Mm = Symbol.for("react.fragment"),
  Fm = Symbol.for("react.strict_mode"),
  Im = Symbol.for("react.profiler"),
  Am = Symbol.for("react.provider"),
  zm = Symbol.for("react.context"),
  Bm = Symbol.for("react.forward_ref"),
  Um = Symbol.for("react.suspense"),
  Vm = Symbol.for("react.memo"),
  Hm = Symbol.for("react.lazy"),
  Tu = Symbol.iterator;
function Wm(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Tu && e[Tu]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var af = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  uf = Object.assign,
  cf = {};
function vr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = cf),
    (this.updater = n || af);
}
vr.prototype.isReactComponent = {};
vr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
vr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function ff() {}
ff.prototype = vr.prototype;
function Js(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = cf),
    (this.updater = n || af);
}
var ea = (Js.prototype = new ff());
ea.constructor = Js;
uf(ea, vr.prototype);
ea.isPureReactComponent = !0;
var Pu = Array.isArray,
  df = Object.prototype.hasOwnProperty,
  ta = { current: null },
  pf = { key: !0, ref: !0, __self: !0, __source: !0 };
function mf(e, t, n) {
  var r,
    o = {},
    l = null,
    i = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (i = t.ref),
    t.key !== void 0 && (l = "" + t.key),
    t))
      df.call(t, r) && !pf.hasOwnProperty(r) && (o[r] = t[r]);
  var s = arguments.length - 2;
  if (s === 1) o.children = n;
  else if (1 < s) {
    for (var a = Array(s), c = 0; c < s; c++) a[c] = arguments[c + 2];
    o.children = a;
  }
  if (e && e.defaultProps)
    for (r in ((s = e.defaultProps), s)) o[r] === void 0 && (o[r] = s[r]);
  return {
    $$typeof: xo,
    type: e,
    key: l,
    ref: i,
    props: o,
    _owner: ta.current,
  };
}
function bm(e, t) {
  return {
    $$typeof: xo,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function na(e) {
  return typeof e == "object" && e !== null && e.$$typeof === xo;
}
function Km(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var ju = /\/+/g;
function gi(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Km("" + e.key)
    : t.toString(36);
}
function tl(e, t, n, r, o) {
  var l = typeof e;
  (l === "undefined" || l === "boolean") && (e = null);
  var i = !1;
  if (e === null) i = !0;
  else
    switch (l) {
      case "string":
      case "number":
        i = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case xo:
          case Dm:
            i = !0;
        }
    }
  if (i)
    return (
      (i = e),
      (o = o(i)),
      (e = r === "" ? "." + gi(i, 0) : r),
      Pu(o)
        ? ((n = ""),
          e != null && (n = e.replace(ju, "$&/") + "/"),
          tl(o, t, n, "", function (c) {
            return c;
          }))
        : o != null &&
          (na(o) &&
            (o = bm(
              o,
              n +
                (!o.key || (i && i.key === o.key)
                  ? ""
                  : ("" + o.key).replace(ju, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((i = 0), (r = r === "" ? "." : r + ":"), Pu(e)))
    for (var s = 0; s < e.length; s++) {
      l = e[s];
      var a = r + gi(l, s);
      i += tl(l, t, n, a, o);
    }
  else if (((a = Wm(e)), typeof a == "function"))
    for (e = a.call(e), s = 0; !(l = e.next()).done; )
      (l = l.value), (a = r + gi(l, s++)), (i += tl(l, t, n, a, o));
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
  return i;
}
function $o(e, t, n) {
  if (e == null) return e;
  var r = [],
    o = 0;
  return (
    tl(e, r, "", "", function (l) {
      return t.call(n, l, o++);
    }),
    r
  );
}
function Qm(e) {
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
var $e = { current: null },
  nl = { transition: null },
  Gm = {
    ReactCurrentDispatcher: $e,
    ReactCurrentBatchConfig: nl,
    ReactCurrentOwner: ta,
  };
K.Children = {
  map: $o,
  forEach: function (e, t, n) {
    $o(
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
      $o(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      $o(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!na(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
K.Component = vr;
K.Fragment = Mm;
K.Profiler = Im;
K.PureComponent = Js;
K.StrictMode = Fm;
K.Suspense = Um;
K.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Gm;
K.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = uf({}, e.props),
    o = e.key,
    l = e.ref,
    i = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((l = t.ref), (i = ta.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var s = e.type.defaultProps;
    for (a in t)
      df.call(t, a) &&
        !pf.hasOwnProperty(a) &&
        (r[a] = t[a] === void 0 && s !== void 0 ? s[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    s = Array(a);
    for (var c = 0; c < a; c++) s[c] = arguments[c + 2];
    r.children = s;
  }
  return { $$typeof: xo, type: e.type, key: o, ref: l, props: r, _owner: i };
};
K.createContext = function (e) {
  return (
    (e = {
      $$typeof: zm,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Am, _context: e }),
    (e.Consumer = e)
  );
};
K.createElement = mf;
K.createFactory = function (e) {
  var t = mf.bind(null, e);
  return (t.type = e), t;
};
K.createRef = function () {
  return { current: null };
};
K.forwardRef = function (e) {
  return { $$typeof: Bm, render: e };
};
K.isValidElement = na;
K.lazy = function (e) {
  return { $$typeof: Hm, _payload: { _status: -1, _result: e }, _init: Qm };
};
K.memo = function (e, t) {
  return { $$typeof: Vm, type: e, compare: t === void 0 ? null : t };
};
K.startTransition = function (e) {
  var t = nl.transition;
  nl.transition = {};
  try {
    e();
  } finally {
    nl.transition = t;
  }
};
K.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
K.useCallback = function (e, t) {
  return $e.current.useCallback(e, t);
};
K.useContext = function (e) {
  return $e.current.useContext(e);
};
K.useDebugValue = function () {};
K.useDeferredValue = function (e) {
  return $e.current.useDeferredValue(e);
};
K.useEffect = function (e, t) {
  return $e.current.useEffect(e, t);
};
K.useId = function () {
  return $e.current.useId();
};
K.useImperativeHandle = function (e, t, n) {
  return $e.current.useImperativeHandle(e, t, n);
};
K.useInsertionEffect = function (e, t) {
  return $e.current.useInsertionEffect(e, t);
};
K.useLayoutEffect = function (e, t) {
  return $e.current.useLayoutEffect(e, t);
};
K.useMemo = function (e, t) {
  return $e.current.useMemo(e, t);
};
K.useReducer = function (e, t, n) {
  return $e.current.useReducer(e, t, n);
};
K.useRef = function (e) {
  return $e.current.useRef(e);
};
K.useState = function (e) {
  return $e.current.useState(e);
};
K.useSyncExternalStore = function (e, t, n) {
  return $e.current.useSyncExternalStore(e, t, n);
};
K.useTransition = function () {
  return $e.current.useTransition();
};
K.version = "18.2.0";
(function (e) {
  e.exports = K;
})(g);
const u = sf(g.exports);
var ra = { exports: {} },
  Ge = {},
  vf = { exports: {} },
  hf = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(R, D) {
    var M = R.length;
    R.push(D);
    e: for (; 0 < M; ) {
      var b = (M - 1) >>> 1,
        W = R[b];
      if (0 < o(W, D)) (R[b] = D), (R[M] = W), (M = b);
      else break e;
    }
  }
  function n(R) {
    return R.length === 0 ? null : R[0];
  }
  function r(R) {
    if (R.length === 0) return null;
    var D = R[0],
      M = R.pop();
    if (M !== D) {
      R[0] = M;
      e: for (var b = 0, W = R.length, T = W >>> 1; b < T; ) {
        var F = 2 * (b + 1) - 1,
          z = R[F],
          V = F + 1,
          ae = R[V];
        if (0 > o(z, M))
          V < W && 0 > o(ae, z)
            ? ((R[b] = ae), (R[V] = M), (b = V))
            : ((R[b] = z), (R[F] = M), (b = F));
        else if (V < W && 0 > o(ae, M)) (R[b] = ae), (R[V] = M), (b = V);
        else break e;
      }
    }
    return D;
  }
  function o(R, D) {
    var M = R.sortIndex - D.sortIndex;
    return M !== 0 ? M : R.id - D.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var l = performance;
    e.unstable_now = function () {
      return l.now();
    };
  } else {
    var i = Date,
      s = i.now();
    e.unstable_now = function () {
      return i.now() - s;
    };
  }
  var a = [],
    c = [],
    f = 1,
    d = null,
    v = 3,
    y = !1,
    x = !1,
    w = !1,
    k = typeof setTimeout == "function" ? setTimeout : null,
    m = typeof clearTimeout == "function" ? clearTimeout : null,
    p = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function h(R) {
    for (var D = n(c); D !== null; ) {
      if (D.callback === null) r(c);
      else if (D.startTime <= R)
        r(c), (D.sortIndex = D.expirationTime), t(a, D);
      else break;
      D = n(c);
    }
  }
  function S(R) {
    if (((w = !1), h(R), !x))
      if (n(a) !== null) (x = !0), te(E);
      else {
        var D = n(c);
        D !== null && re(S, D.startTime - R);
      }
  }
  function E(R, D) {
    (x = !1), w && ((w = !1), m(O), (O = -1)), (y = !0);
    var M = v;
    try {
      for (
        h(D), d = n(a);
        d !== null && (!(d.expirationTime > D) || (R && !U()));

      ) {
        var b = d.callback;
        if (typeof b == "function") {
          (d.callback = null), (v = d.priorityLevel);
          var W = b(d.expirationTime <= D);
          (D = e.unstable_now()),
            typeof W == "function" ? (d.callback = W) : d === n(a) && r(a),
            h(D);
        } else r(a);
        d = n(a);
      }
      if (d !== null) var T = !0;
      else {
        var F = n(c);
        F !== null && re(S, F.startTime - D), (T = !1);
      }
      return T;
    } finally {
      (d = null), (v = M), (y = !1);
    }
  }
  var N = !1,
    C = null,
    O = -1,
    j = 5,
    L = -1;
  function U() {
    return !(e.unstable_now() - L < j);
  }
  function J() {
    if (C !== null) {
      var R = e.unstable_now();
      L = R;
      var D = !0;
      try {
        D = C(!0, R);
      } finally {
        D ? Q() : ((N = !1), (C = null));
      }
    } else N = !1;
  }
  var Q;
  if (typeof p == "function")
    Q = function () {
      p(J);
    };
  else if (typeof MessageChannel < "u") {
    var q = new MessageChannel(),
      A = q.port2;
    (q.port1.onmessage = J),
      (Q = function () {
        A.postMessage(null);
      });
  } else
    Q = function () {
      k(J, 0);
    };
  function te(R) {
    (C = R), N || ((N = !0), Q());
  }
  function re(R, D) {
    O = k(function () {
      R(e.unstable_now());
    }, D);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (R) {
      R.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      x || y || ((x = !0), te(E));
    }),
    (e.unstable_forceFrameRate = function (R) {
      0 > R || 125 < R
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (j = 0 < R ? Math.floor(1e3 / R) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return v;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (e.unstable_next = function (R) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var D = 3;
          break;
        default:
          D = v;
      }
      var M = v;
      v = D;
      try {
        return R();
      } finally {
        v = M;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (R, D) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var M = v;
      v = R;
      try {
        return D();
      } finally {
        v = M;
      }
    }),
    (e.unstable_scheduleCallback = function (R, D, M) {
      var b = e.unstable_now();
      switch (
        (typeof M == "object" && M !== null
          ? ((M = M.delay), (M = typeof M == "number" && 0 < M ? b + M : b))
          : (M = b),
        R)
      ) {
        case 1:
          var W = -1;
          break;
        case 2:
          W = 250;
          break;
        case 5:
          W = 1073741823;
          break;
        case 4:
          W = 1e4;
          break;
        default:
          W = 5e3;
      }
      return (
        (W = M + W),
        (R = {
          id: f++,
          callback: D,
          priorityLevel: R,
          startTime: M,
          expirationTime: W,
          sortIndex: -1,
        }),
        M > b
          ? ((R.sortIndex = M),
            t(c, R),
            n(a) === null &&
              R === n(c) &&
              (w ? (m(O), (O = -1)) : (w = !0), re(S, M - b)))
          : ((R.sortIndex = W), t(a, R), x || y || ((x = !0), te(E))),
        R
      );
    }),
    (e.unstable_shouldYield = U),
    (e.unstable_wrapCallback = function (R) {
      var D = v;
      return function () {
        var M = v;
        v = D;
        try {
          return R.apply(this, arguments);
        } finally {
          v = M;
        }
      };
    });
})(hf);
(function (e) {
  e.exports = hf;
})(vf);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var gf = g.exports,
  Qe = vf.exports;
function P(e) {
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
var yf = new Set(),
  qr = {};
function jn(e, t) {
  or(e, t), or(e + "Capture", t);
}
function or(e, t) {
  for (qr[e] = t, e = 0; e < t.length; e++) yf.add(t[e]);
}
var Lt = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Gi = Object.prototype.hasOwnProperty,
  Ym =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Lu = {},
  $u = {};
function Xm(e) {
  return Gi.call($u, e)
    ? !0
    : Gi.call(Lu, e)
      ? !1
      : Ym.test(e)
        ? ($u[e] = !0)
        : ((Lu[e] = !0), !1);
}
function qm(e, t, n, r) {
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
function Zm(e, t, n, r) {
  if (t === null || typeof t > "u" || qm(e, t, n, r)) return !0;
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
function De(e, t, n, r, o, l, i) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = l),
    (this.removeEmptyString = i);
}
var Se = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    Se[e] = new De(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  Se[t] = new De(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  Se[e] = new De(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  Se[e] = new De(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    Se[e] = new De(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  Se[e] = new De(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  Se[e] = new De(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  Se[e] = new De(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  Se[e] = new De(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var oa = /[\-:]([a-z])/g;
function la(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(oa, la);
    Se[t] = new De(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(oa, la);
    Se[t] = new De(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(oa, la);
  Se[t] = new De(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  Se[e] = new De(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Se.xlinkHref = new De(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  Se[e] = new De(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function ia(e, t, n, r) {
  var o = Se.hasOwnProperty(t) ? Se[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Zm(t, n, o, r) && (n = null),
    r || o === null
      ? Xm(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
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
var At = gf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Do = Symbol.for("react.element"),
  zn = Symbol.for("react.portal"),
  Bn = Symbol.for("react.fragment"),
  sa = Symbol.for("react.strict_mode"),
  Yi = Symbol.for("react.profiler"),
  xf = Symbol.for("react.provider"),
  Ef = Symbol.for("react.context"),
  aa = Symbol.for("react.forward_ref"),
  Xi = Symbol.for("react.suspense"),
  qi = Symbol.for("react.suspense_list"),
  ua = Symbol.for("react.memo"),
  Ht = Symbol.for("react.lazy"),
  wf = Symbol.for("react.offscreen"),
  Du = Symbol.iterator;
function Cr(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Du && e[Du]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var fe = Object.assign,
  yi;
function Dr(e) {
  if (yi === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      yi = (t && t[1]) || "";
    }
  return (
    `
` +
    yi +
    e
  );
}
var xi = !1;
function Ei(e, t) {
  if (!e || xi) return "";
  xi = !0;
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
          i = o.length - 1,
          s = l.length - 1;
        1 <= i && 0 <= s && o[i] !== l[s];

      )
        s--;
      for (; 1 <= i && 0 <= s; i--, s--)
        if (o[i] !== l[s]) {
          if (i !== 1 || s !== 1)
            do
              if ((i--, s--, 0 > s || o[i] !== l[s])) {
                var a =
                  `
` + o[i].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", e.displayName)),
                  a
                );
              }
            while (1 <= i && 0 <= s);
          break;
        }
    }
  } finally {
    (xi = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? Dr(e) : "";
}
function Jm(e) {
  switch (e.tag) {
    case 5:
      return Dr(e.type);
    case 16:
      return Dr("Lazy");
    case 13:
      return Dr("Suspense");
    case 19:
      return Dr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = Ei(e.type, !1)), e;
    case 11:
      return (e = Ei(e.type.render, !1)), e;
    case 1:
      return (e = Ei(e.type, !0)), e;
    default:
      return "";
  }
}
function Zi(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Bn:
      return "Fragment";
    case zn:
      return "Portal";
    case Yi:
      return "Profiler";
    case sa:
      return "StrictMode";
    case Xi:
      return "Suspense";
    case qi:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ef:
        return (e.displayName || "Context") + ".Consumer";
      case xf:
        return (e._context.displayName || "Context") + ".Provider";
      case aa:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case ua:
        return (
          (t = e.displayName || null), t !== null ? t : Zi(e.type) || "Memo"
        );
      case Ht:
        (t = e._payload), (e = e._init);
        try {
          return Zi(e(t));
        } catch {}
    }
  return null;
}
function ev(e) {
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
      return Zi(t);
    case 8:
      return t === sa ? "StrictMode" : "Mode";
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
function sn(e) {
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
function Sf(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function tv(e) {
  var t = Sf(e) ? "checked" : "value",
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
        set: function (i) {
          (r = "" + i), l.call(this, i);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (i) {
          r = "" + i;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function Mo(e) {
  e._valueTracker || (e._valueTracker = tv(e));
}
function kf(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Sf(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function vl(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Ji(e, t) {
  var n = t.checked;
  return fe({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n != null ? n : e._wrapperState.initialChecked,
  });
}
function Mu(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = sn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Cf(e, t) {
  (t = t.checked), t != null && ia(e, "checked", t, !1);
}
function es(e, t) {
  Cf(e, t);
  var n = sn(t.value),
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
    ? ts(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && ts(e, t.type, sn(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Fu(e, t, n) {
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
function ts(e, t, n) {
  (t !== "number" || vl(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Mr = Array.isArray;
function qn(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      (o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + sn(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        (e[o].selected = !0), r && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function ns(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(P(91));
  return fe({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Iu(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(P(92));
      if (Mr(n)) {
        if (1 < n.length) throw Error(P(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: sn(n) };
}
function Nf(e, t) {
  var n = sn(t.value),
    r = sn(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Au(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Of(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function rs(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Of(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Fo,
  _f = (function (e) {
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
        Fo = Fo || document.createElement("div"),
          Fo.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Fo.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Zr(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var zr = {
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
  nv = ["Webkit", "ms", "Moz", "O"];
Object.keys(zr).forEach(function (e) {
  nv.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (zr[t] = zr[e]);
  });
});
function Rf(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (zr.hasOwnProperty(e) && zr[e])
      ? ("" + t).trim()
      : t + "px";
}
function Tf(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = Rf(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o);
    }
}
var rv = fe(
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
function os(e, t) {
  if (t) {
    if (rv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(P(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(P(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(P(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(P(62));
  }
}
function ls(e, t) {
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
var is = null;
function ca(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var ss = null,
  Zn = null,
  Jn = null;
function zu(e) {
  if ((e = So(e))) {
    if (typeof ss != "function") throw Error(P(280));
    var t = e.stateNode;
    t && ((t = Xl(t)), ss(e.stateNode, e.type, t));
  }
}
function Pf(e) {
  Zn ? (Jn ? Jn.push(e) : (Jn = [e])) : (Zn = e);
}
function jf() {
  if (Zn) {
    var e = Zn,
      t = Jn;
    if (((Jn = Zn = null), zu(e), t)) for (e = 0; e < t.length; e++) zu(t[e]);
  }
}
function Lf(e, t) {
  return e(t);
}
function $f() {}
var wi = !1;
function Df(e, t, n) {
  if (wi) return e(t, n);
  wi = !0;
  try {
    return Lf(e, t, n);
  } finally {
    (wi = !1), (Zn !== null || Jn !== null) && ($f(), jf());
  }
}
function Jr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Xl(n);
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
  if (n && typeof n != "function") throw Error(P(231, t, typeof n));
  return n;
}
var as = !1;
if (Lt)
  try {
    var Nr = {};
    Object.defineProperty(Nr, "passive", {
      get: function () {
        as = !0;
      },
    }),
      window.addEventListener("test", Nr, Nr),
      window.removeEventListener("test", Nr, Nr);
  } catch {
    as = !1;
  }
function ov(e, t, n, r, o, l, i, s, a) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (f) {
    this.onError(f);
  }
}
var Br = !1,
  hl = null,
  gl = !1,
  us = null,
  lv = {
    onError: function (e) {
      (Br = !0), (hl = e);
    },
  };
function iv(e, t, n, r, o, l, i, s, a) {
  (Br = !1), (hl = null), ov.apply(lv, arguments);
}
function sv(e, t, n, r, o, l, i, s, a) {
  if ((iv.apply(this, arguments), Br)) {
    if (Br) {
      var c = hl;
      (Br = !1), (hl = null);
    } else throw Error(P(198));
    gl || ((gl = !0), (us = c));
  }
}
function Ln(e) {
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
function Mf(e) {
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
function Bu(e) {
  if (Ln(e) !== e) throw Error(P(188));
}
function av(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Ln(e)), t === null)) throw Error(P(188));
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
        if (l === n) return Bu(o), e;
        if (l === r) return Bu(o), t;
        l = l.sibling;
      }
      throw Error(P(188));
    }
    if (n.return !== r.return) (n = o), (r = l);
    else {
      for (var i = !1, s = o.child; s; ) {
        if (s === n) {
          (i = !0), (n = o), (r = l);
          break;
        }
        if (s === r) {
          (i = !0), (r = o), (n = l);
          break;
        }
        s = s.sibling;
      }
      if (!i) {
        for (s = l.child; s; ) {
          if (s === n) {
            (i = !0), (n = l), (r = o);
            break;
          }
          if (s === r) {
            (i = !0), (r = l), (n = o);
            break;
          }
          s = s.sibling;
        }
        if (!i) throw Error(P(189));
      }
    }
    if (n.alternate !== r) throw Error(P(190));
  }
  if (n.tag !== 3) throw Error(P(188));
  return n.stateNode.current === n ? e : t;
}
function Ff(e) {
  return (e = av(e)), e !== null ? If(e) : null;
}
function If(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = If(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Af = Qe.unstable_scheduleCallback,
  Uu = Qe.unstable_cancelCallback,
  uv = Qe.unstable_shouldYield,
  cv = Qe.unstable_requestPaint,
  pe = Qe.unstable_now,
  fv = Qe.unstable_getCurrentPriorityLevel,
  fa = Qe.unstable_ImmediatePriority,
  zf = Qe.unstable_UserBlockingPriority,
  yl = Qe.unstable_NormalPriority,
  dv = Qe.unstable_LowPriority,
  Bf = Qe.unstable_IdlePriority,
  Kl = null,
  xt = null;
function pv(e) {
  if (xt && typeof xt.onCommitFiberRoot == "function")
    try {
      xt.onCommitFiberRoot(Kl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var ft = Math.clz32 ? Math.clz32 : hv,
  mv = Math.log,
  vv = Math.LN2;
function hv(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((mv(e) / vv) | 0)) | 0;
}
var Io = 64,
  Ao = 4194304;
function Fr(e) {
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
function xl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    o = e.suspendedLanes,
    l = e.pingedLanes,
    i = n & 268435455;
  if (i !== 0) {
    var s = i & ~o;
    s !== 0 ? (r = Fr(s)) : ((l &= i), l !== 0 && (r = Fr(l)));
  } else (i = n & ~o), i !== 0 ? (r = Fr(i)) : l !== 0 && (r = Fr(l));
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
      (n = 31 - ft(t)), (o = 1 << n), (r |= e[n]), (t &= ~o);
  return r;
}
function gv(e, t) {
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
function yv(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      l = e.pendingLanes;
    0 < l;

  ) {
    var i = 31 - ft(l),
      s = 1 << i,
      a = o[i];
    a === -1
      ? ((s & n) === 0 || (s & r) !== 0) && (o[i] = gv(s, t))
      : a <= t && (e.expiredLanes |= s),
      (l &= ~s);
  }
}
function cs(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function Uf() {
  var e = Io;
  return (Io <<= 1), (Io & 4194240) === 0 && (Io = 64), e;
}
function Si(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Eo(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - ft(t)),
    (e[t] = n);
}
function xv(e, t) {
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
    var o = 31 - ft(n),
      l = 1 << o;
    (t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~l);
  }
}
function da(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - ft(n),
      o = 1 << r;
    (o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o);
  }
}
var ee = 0;
function Vf(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
  );
}
var Hf,
  pa,
  Wf,
  bf,
  Kf,
  fs = !1,
  zo = [],
  Zt = null,
  Jt = null,
  en = null,
  eo = new Map(),
  to = new Map(),
  Kt = [],
  Ev =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Vu(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Zt = null;
      break;
    case "dragenter":
    case "dragleave":
      Jt = null;
      break;
    case "mouseover":
    case "mouseout":
      en = null;
      break;
    case "pointerover":
    case "pointerout":
      eo.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      to.delete(t.pointerId);
  }
}
function Or(e, t, n, r, o, l) {
  return e === null || e.nativeEvent !== l
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: l,
        targetContainers: [o],
      }),
      t !== null && ((t = So(t)), t !== null && pa(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function wv(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return (Zt = Or(Zt, e, t, n, r, o)), !0;
    case "dragenter":
      return (Jt = Or(Jt, e, t, n, r, o)), !0;
    case "mouseover":
      return (en = Or(en, e, t, n, r, o)), !0;
    case "pointerover":
      var l = o.pointerId;
      return eo.set(l, Or(eo.get(l) || null, e, t, n, r, o)), !0;
    case "gotpointercapture":
      return (
        (l = o.pointerId), to.set(l, Or(to.get(l) || null, e, t, n, r, o)), !0
      );
  }
  return !1;
}
function Qf(e) {
  var t = yn(e.target);
  if (t !== null) {
    var n = Ln(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Mf(n)), t !== null)) {
          (e.blockedOn = t),
            Kf(e.priority, function () {
              Wf(n);
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
function rl(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = ds(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (is = r), n.target.dispatchEvent(r), (is = null);
    } else return (t = So(n)), t !== null && pa(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function Hu(e, t, n) {
  rl(e) && n.delete(t);
}
function Sv() {
  (fs = !1),
    Zt !== null && rl(Zt) && (Zt = null),
    Jt !== null && rl(Jt) && (Jt = null),
    en !== null && rl(en) && (en = null),
    eo.forEach(Hu),
    to.forEach(Hu);
}
function _r(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    fs ||
      ((fs = !0),
      Qe.unstable_scheduleCallback(Qe.unstable_NormalPriority, Sv)));
}
function no(e) {
  function t(o) {
    return _r(o, e);
  }
  if (0 < zo.length) {
    _r(zo[0], e);
    for (var n = 1; n < zo.length; n++) {
      var r = zo[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    Zt !== null && _r(Zt, e),
      Jt !== null && _r(Jt, e),
      en !== null && _r(en, e),
      eo.forEach(t),
      to.forEach(t),
      n = 0;
    n < Kt.length;
    n++
  )
    (r = Kt[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Kt.length && ((n = Kt[0]), n.blockedOn === null); )
    Qf(n), n.blockedOn === null && Kt.shift();
}
var er = At.ReactCurrentBatchConfig,
  El = !0;
function kv(e, t, n, r) {
  var o = ee,
    l = er.transition;
  er.transition = null;
  try {
    (ee = 1), ma(e, t, n, r);
  } finally {
    (ee = o), (er.transition = l);
  }
}
function Cv(e, t, n, r) {
  var o = ee,
    l = er.transition;
  er.transition = null;
  try {
    (ee = 4), ma(e, t, n, r);
  } finally {
    (ee = o), (er.transition = l);
  }
}
function ma(e, t, n, r) {
  if (El) {
    var o = ds(e, t, n, r);
    if (o === null) Li(e, t, r, wl, n), Vu(e, r);
    else if (wv(o, e, t, n, r)) r.stopPropagation();
    else if ((Vu(e, r), t & 4 && -1 < Ev.indexOf(e))) {
      for (; o !== null; ) {
        var l = So(o);
        if (
          (l !== null && Hf(l),
          (l = ds(e, t, n, r)),
          l === null && Li(e, t, r, wl, n),
          l === o)
        )
          break;
        o = l;
      }
      o !== null && r.stopPropagation();
    } else Li(e, t, r, null, n);
  }
}
var wl = null;
function ds(e, t, n, r) {
  if (((wl = null), (e = ca(r)), (e = yn(e)), e !== null))
    if (((t = Ln(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Mf(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (wl = e), null;
}
function Gf(e) {
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
      switch (fv()) {
        case fa:
          return 1;
        case zf:
          return 4;
        case yl:
        case dv:
          return 16;
        case Bf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Yt = null,
  va = null,
  ol = null;
function Yf() {
  if (ol) return ol;
  var e,
    t = va,
    n = t.length,
    r,
    o = "value" in Yt ? Yt.value : Yt.textContent,
    l = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var i = n - e;
  for (r = 1; r <= i && t[n - r] === o[l - r]; r++);
  return (ol = o.slice(e, 1 < r ? 1 - r : void 0));
}
function ll(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Bo() {
  return !0;
}
function Wu() {
  return !1;
}
function Ye(e) {
  function t(n, r, o, l, i) {
    (this._reactName = n),
      (this._targetInst = o),
      (this.type = r),
      (this.nativeEvent = l),
      (this.target = i),
      (this.currentTarget = null);
    for (var s in e)
      e.hasOwnProperty(s) && ((n = e[s]), (this[s] = n ? n(l) : l[s]));
    return (
      (this.isDefaultPrevented = (
        l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1
      )
        ? Bo
        : Wu),
      (this.isPropagationStopped = Wu),
      this
    );
  }
  return (
    fe(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Bo));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Bo));
      },
      persist: function () {},
      isPersistent: Bo,
    }),
    t
  );
}
var hr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  ha = Ye(hr),
  wo = fe({}, hr, { view: 0, detail: 0 }),
  Nv = Ye(wo),
  ki,
  Ci,
  Rr,
  Ql = fe({}, wo, {
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
    getModifierState: ga,
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
        : (e !== Rr &&
            (Rr && e.type === "mousemove"
              ? ((ki = e.screenX - Rr.screenX), (Ci = e.screenY - Rr.screenY))
              : (Ci = ki = 0),
            (Rr = e)),
          ki);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Ci;
    },
  }),
  bu = Ye(Ql),
  Ov = fe({}, Ql, { dataTransfer: 0 }),
  _v = Ye(Ov),
  Rv = fe({}, wo, { relatedTarget: 0 }),
  Ni = Ye(Rv),
  Tv = fe({}, hr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Pv = Ye(Tv),
  jv = fe({}, hr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Lv = Ye(jv),
  $v = fe({}, hr, { data: 0 }),
  Ku = Ye($v),
  Dv = {
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
  Mv = {
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
  Fv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Iv(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Fv[e]) ? !!t[e] : !1;
}
function ga() {
  return Iv;
}
var Av = fe({}, wo, {
    key: function (e) {
      if (e.key) {
        var t = Dv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = ll(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Mv[e.keyCode] || "Unidentified"
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
    getModifierState: ga,
    charCode: function (e) {
      return e.type === "keypress" ? ll(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? ll(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  zv = Ye(Av),
  Bv = fe({}, Ql, {
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
  Qu = Ye(Bv),
  Uv = fe({}, wo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ga,
  }),
  Vv = Ye(Uv),
  Hv = fe({}, hr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Wv = Ye(Hv),
  bv = fe({}, Ql, {
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
  Kv = Ye(bv),
  Qv = [9, 13, 27, 32],
  ya = Lt && "CompositionEvent" in window,
  Ur = null;
Lt && "documentMode" in document && (Ur = document.documentMode);
var Gv = Lt && "TextEvent" in window && !Ur,
  Xf = Lt && (!ya || (Ur && 8 < Ur && 11 >= Ur)),
  Gu = String.fromCharCode(32),
  Yu = !1;
function qf(e, t) {
  switch (e) {
    case "keyup":
      return Qv.indexOf(t.keyCode) !== -1;
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
function Zf(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var Un = !1;
function Yv(e, t) {
  switch (e) {
    case "compositionend":
      return Zf(t);
    case "keypress":
      return t.which !== 32 ? null : ((Yu = !0), Gu);
    case "textInput":
      return (e = t.data), e === Gu && Yu ? null : e;
    default:
      return null;
  }
}
function Xv(e, t) {
  if (Un)
    return e === "compositionend" || (!ya && qf(e, t))
      ? ((e = Yf()), (ol = va = Yt = null), (Un = !1), e)
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
      return Xf && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var qv = {
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
function Xu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!qv[e.type] : t === "textarea";
}
function Jf(e, t, n, r) {
  Pf(r),
    (t = Sl(t, "onChange")),
    0 < t.length &&
      ((n = new ha("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Vr = null,
  ro = null;
function Zv(e) {
  cd(e, 0);
}
function Gl(e) {
  var t = Wn(e);
  if (kf(t)) return e;
}
function Jv(e, t) {
  if (e === "change") return t;
}
var ed = !1;
if (Lt) {
  var Oi;
  if (Lt) {
    var _i = "oninput" in document;
    if (!_i) {
      var qu = document.createElement("div");
      qu.setAttribute("oninput", "return;"),
        (_i = typeof qu.oninput == "function");
    }
    Oi = _i;
  } else Oi = !1;
  ed = Oi && (!document.documentMode || 9 < document.documentMode);
}
function Zu() {
  Vr && (Vr.detachEvent("onpropertychange", td), (ro = Vr = null));
}
function td(e) {
  if (e.propertyName === "value" && Gl(ro)) {
    var t = [];
    Jf(t, ro, e, ca(e)), Df(Zv, t);
  }
}
function eh(e, t, n) {
  e === "focusin"
    ? (Zu(), (Vr = t), (ro = n), Vr.attachEvent("onpropertychange", td))
    : e === "focusout" && Zu();
}
function th(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Gl(ro);
}
function nh(e, t) {
  if (e === "click") return Gl(t);
}
function rh(e, t) {
  if (e === "input" || e === "change") return Gl(t);
}
function oh(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var pt = typeof Object.is == "function" ? Object.is : oh;
function oo(e, t) {
  if (pt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!Gi.call(t, o) || !pt(e[o], t[o])) return !1;
  }
  return !0;
}
function Ju(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function ec(e, t) {
  var n = Ju(e);
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
    n = Ju(n);
  }
}
function nd(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? nd(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function rd() {
  for (var e = window, t = vl(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = vl(e.document);
  }
  return t;
}
function xa(e) {
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
function lh(e) {
  var t = rd(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    nd(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && xa(n)) {
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
          (o = ec(n, l));
        var i = ec(n, r);
        o &&
          i &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== o.node ||
            e.anchorOffset !== o.offset ||
            e.focusNode !== i.node ||
            e.focusOffset !== i.offset) &&
          ((t = t.createRange()),
          t.setStart(o.node, o.offset),
          e.removeAllRanges(),
          l > r
            ? (e.addRange(t), e.extend(i.node, i.offset))
            : (t.setEnd(i.node, i.offset), e.addRange(t)));
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
var ih = Lt && "documentMode" in document && 11 >= document.documentMode,
  Vn = null,
  ps = null,
  Hr = null,
  ms = !1;
function tc(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  ms ||
    Vn == null ||
    Vn !== vl(r) ||
    ((r = Vn),
    "selectionStart" in r && xa(r)
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
    (Hr && oo(Hr, r)) ||
      ((Hr = r),
      (r = Sl(ps, "onSelect")),
      0 < r.length &&
        ((t = new ha("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Vn))));
}
function Uo(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Hn = {
    animationend: Uo("Animation", "AnimationEnd"),
    animationiteration: Uo("Animation", "AnimationIteration"),
    animationstart: Uo("Animation", "AnimationStart"),
    transitionend: Uo("Transition", "TransitionEnd"),
  },
  Ri = {},
  od = {};
Lt &&
  ((od = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Hn.animationend.animation,
    delete Hn.animationiteration.animation,
    delete Hn.animationstart.animation),
  "TransitionEvent" in window || delete Hn.transitionend.transition);
function Yl(e) {
  if (Ri[e]) return Ri[e];
  if (!Hn[e]) return e;
  var t = Hn[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in od) return (Ri[e] = t[n]);
  return e;
}
var ld = Yl("animationend"),
  id = Yl("animationiteration"),
  sd = Yl("animationstart"),
  ad = Yl("transitionend"),
  ud = new Map(),
  nc =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function cn(e, t) {
  ud.set(e, t), jn(t, [e]);
}
for (var Ti = 0; Ti < nc.length; Ti++) {
  var Pi = nc[Ti],
    sh = Pi.toLowerCase(),
    ah = Pi[0].toUpperCase() + Pi.slice(1);
  cn(sh, "on" + ah);
}
cn(ld, "onAnimationEnd");
cn(id, "onAnimationIteration");
cn(sd, "onAnimationStart");
cn("dblclick", "onDoubleClick");
cn("focusin", "onFocus");
cn("focusout", "onBlur");
cn(ad, "onTransitionEnd");
or("onMouseEnter", ["mouseout", "mouseover"]);
or("onMouseLeave", ["mouseout", "mouseover"]);
or("onPointerEnter", ["pointerout", "pointerover"]);
or("onPointerLeave", ["pointerout", "pointerover"]);
jn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
jn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
jn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
jn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
jn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
jn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var Ir =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  uh = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ir));
function rc(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), sv(r, t, void 0, e), (e.currentTarget = null);
}
function cd(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      o = r.event;
    r = r.listeners;
    e: {
      var l = void 0;
      if (t)
        for (var i = r.length - 1; 0 <= i; i--) {
          var s = r[i],
            a = s.instance,
            c = s.currentTarget;
          if (((s = s.listener), a !== l && o.isPropagationStopped())) break e;
          rc(o, s, c), (l = a);
        }
      else
        for (i = 0; i < r.length; i++) {
          if (
            ((s = r[i]),
            (a = s.instance),
            (c = s.currentTarget),
            (s = s.listener),
            a !== l && o.isPropagationStopped())
          )
            break e;
          rc(o, s, c), (l = a);
        }
    }
  }
  if (gl) throw ((e = us), (gl = !1), (us = null), e);
}
function le(e, t) {
  var n = t[xs];
  n === void 0 && (n = t[xs] = new Set());
  var r = e + "__bubble";
  n.has(r) || (fd(t, e, 2, !1), n.add(r));
}
function ji(e, t, n) {
  var r = 0;
  t && (r |= 4), fd(n, e, r, t);
}
var Vo = "_reactListening" + Math.random().toString(36).slice(2);
function lo(e) {
  if (!e[Vo]) {
    (e[Vo] = !0),
      yf.forEach(function (n) {
        n !== "selectionchange" && (uh.has(n) || ji(n, !1, e), ji(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Vo] || ((t[Vo] = !0), ji("selectionchange", !1, t));
  }
}
function fd(e, t, n, r) {
  switch (Gf(t)) {
    case 1:
      var o = kv;
      break;
    case 4:
      o = Cv;
      break;
    default:
      o = ma;
  }
  (n = o.bind(null, t, n, e)),
    (o = void 0),
    !as ||
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
function Li(e, t, n, r, o) {
  var l = r;
  if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
    e: for (;;) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var s = r.stateNode.containerInfo;
        if (s === o || (s.nodeType === 8 && s.parentNode === o)) break;
        if (i === 4)
          for (i = r.return; i !== null; ) {
            var a = i.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = i.stateNode.containerInfo),
              a === o || (a.nodeType === 8 && a.parentNode === o))
            )
              return;
            i = i.return;
          }
        for (; s !== null; ) {
          if (((i = yn(s)), i === null)) return;
          if (((a = i.tag), a === 5 || a === 6)) {
            r = l = i;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
  Df(function () {
    var c = l,
      f = ca(n),
      d = [];
    e: {
      var v = ud.get(e);
      if (v !== void 0) {
        var y = ha,
          x = e;
        switch (e) {
          case "keypress":
            if (ll(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = zv;
            break;
          case "focusin":
            (x = "focus"), (y = Ni);
            break;
          case "focusout":
            (x = "blur"), (y = Ni);
            break;
          case "beforeblur":
          case "afterblur":
            y = Ni;
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
            y = bu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = _v;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = Vv;
            break;
          case ld:
          case id:
          case sd:
            y = Pv;
            break;
          case ad:
            y = Wv;
            break;
          case "scroll":
            y = Nv;
            break;
          case "wheel":
            y = Kv;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = Lv;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = Qu;
        }
        var w = (t & 4) !== 0,
          k = !w && e === "scroll",
          m = w ? (v !== null ? v + "Capture" : null) : v;
        w = [];
        for (var p = c, h; p !== null; ) {
          h = p;
          var S = h.stateNode;
          if (
            (h.tag === 5 &&
              S !== null &&
              ((h = S),
              m !== null && ((S = Jr(p, m)), S != null && w.push(io(p, S, h)))),
            k)
          )
            break;
          p = p.return;
        }
        0 < w.length &&
          ((v = new y(v, x, null, n, f)), d.push({ event: v, listeners: w }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((v = e === "mouseover" || e === "pointerover"),
          (y = e === "mouseout" || e === "pointerout"),
          v &&
            n !== is &&
            (x = n.relatedTarget || n.fromElement) &&
            (yn(x) || x[$t]))
        )
          break e;
        if (
          (y || v) &&
          ((v =
            f.window === f
              ? f
              : (v = f.ownerDocument)
                ? v.defaultView || v.parentWindow
                : window),
          y
            ? ((x = n.relatedTarget || n.toElement),
              (y = c),
              (x = x ? yn(x) : null),
              x !== null &&
                ((k = Ln(x)), x !== k || (x.tag !== 5 && x.tag !== 6)) &&
                (x = null))
            : ((y = null), (x = c)),
          y !== x)
        ) {
          if (
            ((w = bu),
            (S = "onMouseLeave"),
            (m = "onMouseEnter"),
            (p = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((w = Qu),
              (S = "onPointerLeave"),
              (m = "onPointerEnter"),
              (p = "pointer")),
            (k = y == null ? v : Wn(y)),
            (h = x == null ? v : Wn(x)),
            (v = new w(S, p + "leave", y, n, f)),
            (v.target = k),
            (v.relatedTarget = h),
            (S = null),
            yn(f) === c &&
              ((w = new w(m, p + "enter", x, n, f)),
              (w.target = h),
              (w.relatedTarget = k),
              (S = w)),
            (k = S),
            y && x)
          )
            t: {
              for (w = y, m = x, p = 0, h = w; h; h = Mn(h)) p++;
              for (h = 0, S = m; S; S = Mn(S)) h++;
              for (; 0 < p - h; ) (w = Mn(w)), p--;
              for (; 0 < h - p; ) (m = Mn(m)), h--;
              for (; p--; ) {
                if (w === m || (m !== null && w === m.alternate)) break t;
                (w = Mn(w)), (m = Mn(m));
              }
              w = null;
            }
          else w = null;
          y !== null && oc(d, v, y, w, !1),
            x !== null && k !== null && oc(d, k, x, w, !0);
        }
      }
      e: {
        if (
          ((v = c ? Wn(c) : window),
          (y = v.nodeName && v.nodeName.toLowerCase()),
          y === "select" || (y === "input" && v.type === "file"))
        )
          var E = Jv;
        else if (Xu(v))
          if (ed) E = rh;
          else {
            E = th;
            var N = eh;
          }
        else
          (y = v.nodeName) &&
            y.toLowerCase() === "input" &&
            (v.type === "checkbox" || v.type === "radio") &&
            (E = nh);
        if (E && (E = E(e, c))) {
          Jf(d, E, n, f);
          break e;
        }
        N && N(e, v, c),
          e === "focusout" &&
            (N = v._wrapperState) &&
            N.controlled &&
            v.type === "number" &&
            ts(v, "number", v.value);
      }
      switch (((N = c ? Wn(c) : window), e)) {
        case "focusin":
          (Xu(N) || N.contentEditable === "true") &&
            ((Vn = N), (ps = c), (Hr = null));
          break;
        case "focusout":
          Hr = ps = Vn = null;
          break;
        case "mousedown":
          ms = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (ms = !1), tc(d, n, f);
          break;
        case "selectionchange":
          if (ih) break;
        case "keydown":
        case "keyup":
          tc(d, n, f);
      }
      var C;
      if (ya)
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
        Un
          ? qf(e, n) && (O = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (O = "onCompositionStart");
      O &&
        (Xf &&
          n.locale !== "ko" &&
          (Un || O !== "onCompositionStart"
            ? O === "onCompositionEnd" && Un && (C = Yf())
            : ((Yt = f),
              (va = "value" in Yt ? Yt.value : Yt.textContent),
              (Un = !0))),
        (N = Sl(c, O)),
        0 < N.length &&
          ((O = new Ku(O, e, null, n, f)),
          d.push({ event: O, listeners: N }),
          C ? (O.data = C) : ((C = Zf(n)), C !== null && (O.data = C)))),
        (C = Gv ? Yv(e, n) : Xv(e, n)) &&
          ((c = Sl(c, "onBeforeInput")),
          0 < c.length &&
            ((f = new Ku("onBeforeInput", "beforeinput", null, n, f)),
            d.push({ event: f, listeners: c }),
            (f.data = C)));
    }
    cd(d, t);
  });
}
function io(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Sl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var o = e,
      l = o.stateNode;
    o.tag === 5 &&
      l !== null &&
      ((o = l),
      (l = Jr(e, n)),
      l != null && r.unshift(io(e, l, o)),
      (l = Jr(e, t)),
      l != null && r.push(io(e, l, o))),
      (e = e.return);
  }
  return r;
}
function Mn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function oc(e, t, n, r, o) {
  for (var l = t._reactName, i = []; n !== null && n !== r; ) {
    var s = n,
      a = s.alternate,
      c = s.stateNode;
    if (a !== null && a === r) break;
    s.tag === 5 &&
      c !== null &&
      ((s = c),
      o
        ? ((a = Jr(n, l)), a != null && i.unshift(io(n, a, s)))
        : o || ((a = Jr(n, l)), a != null && i.push(io(n, a, s)))),
      (n = n.return);
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
var ch = /\r\n?/g,
  fh = /\u0000|\uFFFD/g;
function lc(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      ch,
      `
`,
    )
    .replace(fh, "");
}
function Ho(e, t, n) {
  if (((t = lc(t)), lc(e) !== t && n)) throw Error(P(425));
}
function kl() {}
var vs = null,
  hs = null;
function gs(e, t) {
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
var ys = typeof setTimeout == "function" ? setTimeout : void 0,
  dh = typeof clearTimeout == "function" ? clearTimeout : void 0,
  ic = typeof Promise == "function" ? Promise : void 0,
  ph =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof ic < "u"
        ? function (e) {
            return ic.resolve(null).then(e).catch(mh);
          }
        : ys;
function mh(e) {
  setTimeout(function () {
    throw e;
  });
}
function $i(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(o), no(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  no(t);
}
function tn(e) {
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
function sc(e) {
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
var gr = Math.random().toString(36).slice(2),
  gt = "__reactFiber$" + gr,
  so = "__reactProps$" + gr,
  $t = "__reactContainer$" + gr,
  xs = "__reactEvents$" + gr,
  vh = "__reactListeners$" + gr,
  hh = "__reactHandles$" + gr;
function yn(e) {
  var t = e[gt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[$t] || n[gt])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = sc(e); e !== null; ) {
          if ((n = e[gt])) return n;
          e = sc(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function So(e) {
  return (
    (e = e[gt] || e[$t]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Wn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(P(33));
}
function Xl(e) {
  return e[so] || null;
}
var Es = [],
  bn = -1;
function fn(e) {
  return { current: e };
}
function ie(e) {
  0 > bn || ((e.current = Es[bn]), (Es[bn] = null), bn--);
}
function oe(e, t) {
  bn++, (Es[bn] = e.current), (e.current = t);
}
var an = {},
  _e = fn(an),
  Ie = fn(!1),
  Nn = an;
function lr(e, t) {
  var n = e.type.contextTypes;
  if (!n) return an;
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
function Ae(e) {
  return (e = e.childContextTypes), e != null;
}
function Cl() {
  ie(Ie), ie(_e);
}
function ac(e, t, n) {
  if (_e.current !== an) throw Error(P(168));
  oe(_e, t), oe(Ie, n);
}
function dd(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(P(108, ev(e) || "Unknown", o));
  return fe({}, n, r);
}
function Nl(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || an),
    (Nn = _e.current),
    oe(_e, e),
    oe(Ie, Ie.current),
    !0
  );
}
function uc(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(P(169));
  n
    ? ((e = dd(e, t, Nn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      ie(Ie),
      ie(_e),
      oe(_e, e))
    : ie(Ie),
    oe(Ie, n);
}
var Ot = null,
  ql = !1,
  Di = !1;
function pd(e) {
  Ot === null ? (Ot = [e]) : Ot.push(e);
}
function gh(e) {
  (ql = !0), pd(e);
}
function dn() {
  if (!Di && Ot !== null) {
    Di = !0;
    var e = 0,
      t = ee;
    try {
      var n = Ot;
      for (ee = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (Ot = null), (ql = !1);
    } catch (o) {
      throw (Ot !== null && (Ot = Ot.slice(e + 1)), Af(fa, dn), o);
    } finally {
      (ee = t), (Di = !1);
    }
  }
  return null;
}
var Kn = [],
  Qn = 0,
  Ol = null,
  _l = 0,
  qe = [],
  Ze = 0,
  On = null,
  _t = 1,
  Rt = "";
function hn(e, t) {
  (Kn[Qn++] = _l), (Kn[Qn++] = Ol), (Ol = e), (_l = t);
}
function md(e, t, n) {
  (qe[Ze++] = _t), (qe[Ze++] = Rt), (qe[Ze++] = On), (On = e);
  var r = _t;
  e = Rt;
  var o = 32 - ft(r) - 1;
  (r &= ~(1 << o)), (n += 1);
  var l = 32 - ft(t) + o;
  if (30 < l) {
    var i = o - (o % 5);
    (l = (r & ((1 << i) - 1)).toString(32)),
      (r >>= i),
      (o -= i),
      (_t = (1 << (32 - ft(t) + o)) | (n << o) | r),
      (Rt = l + e);
  } else (_t = (1 << l) | (n << o) | r), (Rt = e);
}
function Ea(e) {
  e.return !== null && (hn(e, 1), md(e, 1, 0));
}
function wa(e) {
  for (; e === Ol; )
    (Ol = Kn[--Qn]), (Kn[Qn] = null), (_l = Kn[--Qn]), (Kn[Qn] = null);
  for (; e === On; )
    (On = qe[--Ze]),
      (qe[Ze] = null),
      (Rt = qe[--Ze]),
      (qe[Ze] = null),
      (_t = qe[--Ze]),
      (qe[Ze] = null);
}
var Ke = null,
  We = null,
  se = !1,
  ct = null;
function vd(e, t) {
  var n = Je(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function cc(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Ke = e), (We = tn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ke = e), (We = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = On !== null ? { id: _t, overflow: Rt } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Je(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ke = e),
            (We = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function ws(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ss(e) {
  if (se) {
    var t = We;
    if (t) {
      var n = t;
      if (!cc(e, t)) {
        if (ws(e)) throw Error(P(418));
        t = tn(n.nextSibling);
        var r = Ke;
        t && cc(e, t)
          ? vd(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (se = !1), (Ke = e));
      }
    } else {
      if (ws(e)) throw Error(P(418));
      (e.flags = (e.flags & -4097) | 2), (se = !1), (Ke = e);
    }
  }
}
function fc(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Ke = e;
}
function Wo(e) {
  if (e !== Ke) return !1;
  if (!se) return fc(e), (se = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !gs(e.type, e.memoizedProps))),
    t && (t = We))
  ) {
    if (ws(e)) throw (hd(), Error(P(418)));
    for (; t; ) vd(e, t), (t = tn(t.nextSibling));
  }
  if ((fc(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(P(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              We = tn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      We = null;
    }
  } else We = Ke ? tn(e.stateNode.nextSibling) : null;
  return !0;
}
function hd() {
  for (var e = We; e; ) e = tn(e.nextSibling);
}
function ir() {
  (We = Ke = null), (se = !1);
}
function Sa(e) {
  ct === null ? (ct = [e]) : ct.push(e);
}
var yh = At.ReactCurrentBatchConfig;
function at(e, t) {
  if (e && e.defaultProps) {
    (t = fe({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var Rl = fn(null),
  Tl = null,
  Gn = null,
  ka = null;
function Ca() {
  ka = Gn = Tl = null;
}
function Na(e) {
  var t = Rl.current;
  ie(Rl), (e._currentValue = t);
}
function ks(e, t, n) {
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
function tr(e, t) {
  (Tl = e),
    (ka = Gn = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (Fe = !0), (e.firstContext = null));
}
function tt(e) {
  var t = e._currentValue;
  if (ka !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Gn === null)) {
      if (Tl === null) throw Error(P(308));
      (Gn = e), (Tl.dependencies = { lanes: 0, firstContext: e });
    } else Gn = Gn.next = e;
  return t;
}
var xn = null;
function Oa(e) {
  xn === null ? (xn = [e]) : xn.push(e);
}
function gd(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), Oa(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    Dt(e, r)
  );
}
function Dt(e, t) {
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
var Wt = !1;
function _a(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function yd(e, t) {
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
function Pt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function nn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), (X & 2) !== 0)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      Dt(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), Oa(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    Dt(e, n)
  );
}
function il(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), da(e, n);
  }
}
function dc(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var o = null,
      l = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var i = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        l === null ? (o = l = i) : (l = l.next = i), (n = n.next);
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
function Pl(e, t, n, r) {
  var o = e.updateQueue;
  Wt = !1;
  var l = o.firstBaseUpdate,
    i = o.lastBaseUpdate,
    s = o.shared.pending;
  if (s !== null) {
    o.shared.pending = null;
    var a = s,
      c = a.next;
    (a.next = null), i === null ? (l = c) : (i.next = c), (i = a);
    var f = e.alternate;
    f !== null &&
      ((f = f.updateQueue),
      (s = f.lastBaseUpdate),
      s !== i &&
        (s === null ? (f.firstBaseUpdate = c) : (s.next = c),
        (f.lastBaseUpdate = a)));
  }
  if (l !== null) {
    var d = o.baseState;
    (i = 0), (f = c = a = null), (s = l);
    do {
      var v = s.lane,
        y = s.eventTime;
      if ((r & v) === v) {
        f !== null &&
          (f = f.next =
            {
              eventTime: y,
              lane: 0,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            });
        e: {
          var x = e,
            w = s;
          switch (((v = t), (y = n), w.tag)) {
            case 1:
              if (((x = w.payload), typeof x == "function")) {
                d = x.call(y, d, v);
                break e;
              }
              d = x;
              break e;
            case 3:
              x.flags = (x.flags & -65537) | 128;
            case 0:
              if (
                ((x = w.payload),
                (v = typeof x == "function" ? x.call(y, d, v) : x),
                v == null)
              )
                break e;
              d = fe({}, d, v);
              break e;
            case 2:
              Wt = !0;
          }
        }
        s.callback !== null &&
          s.lane !== 0 &&
          ((e.flags |= 64),
          (v = o.effects),
          v === null ? (o.effects = [s]) : v.push(s));
      } else
        (y = {
          eventTime: y,
          lane: v,
          tag: s.tag,
          payload: s.payload,
          callback: s.callback,
          next: null,
        }),
          f === null ? ((c = f = y), (a = d)) : (f = f.next = y),
          (i |= v);
      if (((s = s.next), s === null)) {
        if (((s = o.shared.pending), s === null)) break;
        (v = s),
          (s = v.next),
          (v.next = null),
          (o.lastBaseUpdate = v),
          (o.shared.pending = null);
      }
    } while (1);
    if (
      (f === null && (a = d),
      (o.baseState = a),
      (o.firstBaseUpdate = c),
      (o.lastBaseUpdate = f),
      (t = o.shared.interleaved),
      t !== null)
    ) {
      o = t;
      do (i |= o.lane), (o = o.next);
      while (o !== t);
    } else l === null && (o.shared.lanes = 0);
    (Rn |= i), (e.lanes = i), (e.memoizedState = d);
  }
}
function pc(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        o = r.callback;
      if (o !== null) {
        if (((r.callback = null), (r = n), typeof o != "function"))
          throw Error(P(191, o));
        o.call(r);
      }
    }
}
var xd = new gf.Component().refs;
function Cs(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : fe({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Zl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Ln(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Le(),
      o = on(e),
      l = Pt(r, o);
    (l.payload = t),
      n != null && (l.callback = n),
      (t = nn(e, l, o)),
      t !== null && (dt(t, e, o, r), il(t, e, o));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Le(),
      o = on(e),
      l = Pt(r, o);
    (l.tag = 1),
      (l.payload = t),
      n != null && (l.callback = n),
      (t = nn(e, l, o)),
      t !== null && (dt(t, e, o, r), il(t, e, o));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Le(),
      r = on(e),
      o = Pt(n, r);
    (o.tag = 2),
      t != null && (o.callback = t),
      (t = nn(e, o, r)),
      t !== null && (dt(t, e, r, n), il(t, e, r));
  },
};
function mc(e, t, n, r, o, l, i) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, l, i)
      : t.prototype && t.prototype.isPureReactComponent
        ? !oo(n, r) || !oo(o, l)
        : !0
  );
}
function Ed(e, t, n) {
  var r = !1,
    o = an,
    l = t.contextType;
  return (
    typeof l == "object" && l !== null
      ? (l = tt(l))
      : ((o = Ae(t) ? Nn : _e.current),
        (r = t.contextTypes),
        (l = (r = r != null) ? lr(e, o) : an)),
    (t = new t(n, l)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Zl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    t
  );
}
function vc(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Zl.enqueueReplaceState(t, t.state, null);
}
function Ns(e, t, n, r) {
  var o = e.stateNode;
  (o.props = n), (o.state = e.memoizedState), (o.refs = xd), _a(e);
  var l = t.contextType;
  typeof l == "object" && l !== null
    ? (o.context = tt(l))
    : ((l = Ae(t) ? Nn : _e.current), (o.context = lr(e, l))),
    (o.state = e.memoizedState),
    (l = t.getDerivedStateFromProps),
    typeof l == "function" && (Cs(e, t, l, n), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && Zl.enqueueReplaceState(o, o.state, null),
      Pl(e, n, o, r),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4194308);
}
function Tr(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(P(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(P(147, e));
      var o = r,
        l = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === l
        ? t.ref
        : ((t = function (i) {
            var s = o.refs;
            s === xd && (s = o.refs = {}),
              i === null ? delete s[l] : (s[l] = i);
          }),
          (t._stringRef = l),
          t);
    }
    if (typeof e != "string") throw Error(P(284));
    if (!n._owner) throw Error(P(290, e));
  }
  return e;
}
function bo(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      P(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    ))
  );
}
function hc(e) {
  var t = e._init;
  return t(e._payload);
}
function wd(e) {
  function t(m, p) {
    if (e) {
      var h = m.deletions;
      h === null ? ((m.deletions = [p]), (m.flags |= 16)) : h.push(p);
    }
  }
  function n(m, p) {
    if (!e) return null;
    for (; p !== null; ) t(m, p), (p = p.sibling);
    return null;
  }
  function r(m, p) {
    for (m = new Map(); p !== null; )
      p.key !== null ? m.set(p.key, p) : m.set(p.index, p), (p = p.sibling);
    return m;
  }
  function o(m, p) {
    return (m = ln(m, p)), (m.index = 0), (m.sibling = null), m;
  }
  function l(m, p, h) {
    return (
      (m.index = h),
      e
        ? ((h = m.alternate),
          h !== null
            ? ((h = h.index), h < p ? ((m.flags |= 2), p) : h)
            : ((m.flags |= 2), p))
        : ((m.flags |= 1048576), p)
    );
  }
  function i(m) {
    return e && m.alternate === null && (m.flags |= 2), m;
  }
  function s(m, p, h, S) {
    return p === null || p.tag !== 6
      ? ((p = Ui(h, m.mode, S)), (p.return = m), p)
      : ((p = o(p, h)), (p.return = m), p);
  }
  function a(m, p, h, S) {
    var E = h.type;
    return E === Bn
      ? f(m, p, h.props.children, S, h.key)
      : p !== null &&
          (p.elementType === E ||
            (typeof E == "object" &&
              E !== null &&
              E.$$typeof === Ht &&
              hc(E) === p.type))
        ? ((S = o(p, h.props)), (S.ref = Tr(m, p, h)), (S.return = m), S)
        : ((S = dl(h.type, h.key, h.props, null, m.mode, S)),
          (S.ref = Tr(m, p, h)),
          (S.return = m),
          S);
  }
  function c(m, p, h, S) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== h.containerInfo ||
      p.stateNode.implementation !== h.implementation
      ? ((p = Vi(h, m.mode, S)), (p.return = m), p)
      : ((p = o(p, h.children || [])), (p.return = m), p);
  }
  function f(m, p, h, S, E) {
    return p === null || p.tag !== 7
      ? ((p = kn(h, m.mode, S, E)), (p.return = m), p)
      : ((p = o(p, h)), (p.return = m), p);
  }
  function d(m, p, h) {
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return (p = Ui("" + p, m.mode, h)), (p.return = m), p;
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case Do:
          return (
            (h = dl(p.type, p.key, p.props, null, m.mode, h)),
            (h.ref = Tr(m, null, p)),
            (h.return = m),
            h
          );
        case zn:
          return (p = Vi(p, m.mode, h)), (p.return = m), p;
        case Ht:
          var S = p._init;
          return d(m, S(p._payload), h);
      }
      if (Mr(p) || Cr(p))
        return (p = kn(p, m.mode, h, null)), (p.return = m), p;
      bo(m, p);
    }
    return null;
  }
  function v(m, p, h, S) {
    var E = p !== null ? p.key : null;
    if ((typeof h == "string" && h !== "") || typeof h == "number")
      return E !== null ? null : s(m, p, "" + h, S);
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Do:
          return h.key === E ? a(m, p, h, S) : null;
        case zn:
          return h.key === E ? c(m, p, h, S) : null;
        case Ht:
          return (E = h._init), v(m, p, E(h._payload), S);
      }
      if (Mr(h) || Cr(h)) return E !== null ? null : f(m, p, h, S, null);
      bo(m, h);
    }
    return null;
  }
  function y(m, p, h, S, E) {
    if ((typeof S == "string" && S !== "") || typeof S == "number")
      return (m = m.get(h) || null), s(p, m, "" + S, E);
    if (typeof S == "object" && S !== null) {
      switch (S.$$typeof) {
        case Do:
          return (m = m.get(S.key === null ? h : S.key) || null), a(p, m, S, E);
        case zn:
          return (m = m.get(S.key === null ? h : S.key) || null), c(p, m, S, E);
        case Ht:
          var N = S._init;
          return y(m, p, h, N(S._payload), E);
      }
      if (Mr(S) || Cr(S)) return (m = m.get(h) || null), f(p, m, S, E, null);
      bo(p, S);
    }
    return null;
  }
  function x(m, p, h, S) {
    for (
      var E = null, N = null, C = p, O = (p = 0), j = null;
      C !== null && O < h.length;
      O++
    ) {
      C.index > O ? ((j = C), (C = null)) : (j = C.sibling);
      var L = v(m, C, h[O], S);
      if (L === null) {
        C === null && (C = j);
        break;
      }
      e && C && L.alternate === null && t(m, C),
        (p = l(L, p, O)),
        N === null ? (E = L) : (N.sibling = L),
        (N = L),
        (C = j);
    }
    if (O === h.length) return n(m, C), se && hn(m, O), E;
    if (C === null) {
      for (; O < h.length; O++)
        (C = d(m, h[O], S)),
          C !== null &&
            ((p = l(C, p, O)), N === null ? (E = C) : (N.sibling = C), (N = C));
      return se && hn(m, O), E;
    }
    for (C = r(m, C); O < h.length; O++)
      (j = y(C, m, O, h[O], S)),
        j !== null &&
          (e && j.alternate !== null && C.delete(j.key === null ? O : j.key),
          (p = l(j, p, O)),
          N === null ? (E = j) : (N.sibling = j),
          (N = j));
    return (
      e &&
        C.forEach(function (U) {
          return t(m, U);
        }),
      se && hn(m, O),
      E
    );
  }
  function w(m, p, h, S) {
    var E = Cr(h);
    if (typeof E != "function") throw Error(P(150));
    if (((h = E.call(h)), h == null)) throw Error(P(151));
    for (
      var N = (E = null), C = p, O = (p = 0), j = null, L = h.next();
      C !== null && !L.done;
      O++, L = h.next()
    ) {
      C.index > O ? ((j = C), (C = null)) : (j = C.sibling);
      var U = v(m, C, L.value, S);
      if (U === null) {
        C === null && (C = j);
        break;
      }
      e && C && U.alternate === null && t(m, C),
        (p = l(U, p, O)),
        N === null ? (E = U) : (N.sibling = U),
        (N = U),
        (C = j);
    }
    if (L.done) return n(m, C), se && hn(m, O), E;
    if (C === null) {
      for (; !L.done; O++, L = h.next())
        (L = d(m, L.value, S)),
          L !== null &&
            ((p = l(L, p, O)), N === null ? (E = L) : (N.sibling = L), (N = L));
      return se && hn(m, O), E;
    }
    for (C = r(m, C); !L.done; O++, L = h.next())
      (L = y(C, m, O, L.value, S)),
        L !== null &&
          (e && L.alternate !== null && C.delete(L.key === null ? O : L.key),
          (p = l(L, p, O)),
          N === null ? (E = L) : (N.sibling = L),
          (N = L));
    return (
      e &&
        C.forEach(function (J) {
          return t(m, J);
        }),
      se && hn(m, O),
      E
    );
  }
  function k(m, p, h, S) {
    if (
      (typeof h == "object" &&
        h !== null &&
        h.type === Bn &&
        h.key === null &&
        (h = h.props.children),
      typeof h == "object" && h !== null)
    ) {
      switch (h.$$typeof) {
        case Do:
          e: {
            for (var E = h.key, N = p; N !== null; ) {
              if (N.key === E) {
                if (((E = h.type), E === Bn)) {
                  if (N.tag === 7) {
                    n(m, N.sibling),
                      (p = o(N, h.props.children)),
                      (p.return = m),
                      (m = p);
                    break e;
                  }
                } else if (
                  N.elementType === E ||
                  (typeof E == "object" &&
                    E !== null &&
                    E.$$typeof === Ht &&
                    hc(E) === N.type)
                ) {
                  n(m, N.sibling),
                    (p = o(N, h.props)),
                    (p.ref = Tr(m, N, h)),
                    (p.return = m),
                    (m = p);
                  break e;
                }
                n(m, N);
                break;
              } else t(m, N);
              N = N.sibling;
            }
            h.type === Bn
              ? ((p = kn(h.props.children, m.mode, S, h.key)),
                (p.return = m),
                (m = p))
              : ((S = dl(h.type, h.key, h.props, null, m.mode, S)),
                (S.ref = Tr(m, p, h)),
                (S.return = m),
                (m = S));
          }
          return i(m);
        case zn:
          e: {
            for (N = h.key; p !== null; ) {
              if (p.key === N)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === h.containerInfo &&
                  p.stateNode.implementation === h.implementation
                ) {
                  n(m, p.sibling),
                    (p = o(p, h.children || [])),
                    (p.return = m),
                    (m = p);
                  break e;
                } else {
                  n(m, p);
                  break;
                }
              else t(m, p);
              p = p.sibling;
            }
            (p = Vi(h, m.mode, S)), (p.return = m), (m = p);
          }
          return i(m);
        case Ht:
          return (N = h._init), k(m, p, N(h._payload), S);
      }
      if (Mr(h)) return x(m, p, h, S);
      if (Cr(h)) return w(m, p, h, S);
      bo(m, h);
    }
    return (typeof h == "string" && h !== "") || typeof h == "number"
      ? ((h = "" + h),
        p !== null && p.tag === 6
          ? (n(m, p.sibling), (p = o(p, h)), (p.return = m), (m = p))
          : (n(m, p), (p = Ui(h, m.mode, S)), (p.return = m), (m = p)),
        i(m))
      : n(m, p);
  }
  return k;
}
var sr = wd(!0),
  Sd = wd(!1),
  ko = {},
  Et = fn(ko),
  ao = fn(ko),
  uo = fn(ko);
function En(e) {
  if (e === ko) throw Error(P(174));
  return e;
}
function Ra(e, t) {
  switch ((oe(uo, t), oe(ao, e), oe(Et, ko), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : rs(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = rs(t, e));
  }
  ie(Et), oe(Et, t);
}
function ar() {
  ie(Et), ie(ao), ie(uo);
}
function kd(e) {
  En(uo.current);
  var t = En(Et.current),
    n = rs(t, e.type);
  t !== n && (oe(ao, e), oe(Et, n));
}
function Ta(e) {
  ao.current === e && (ie(Et), ie(ao));
}
var ue = fn(0);
function jl(e) {
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
var Mi = [];
function Pa() {
  for (var e = 0; e < Mi.length; e++)
    Mi[e]._workInProgressVersionPrimary = null;
  Mi.length = 0;
}
var sl = At.ReactCurrentDispatcher,
  Fi = At.ReactCurrentBatchConfig,
  _n = 0,
  ce = null,
  ve = null,
  ge = null,
  Ll = !1,
  Wr = !1,
  co = 0,
  xh = 0;
function Ce() {
  throw Error(P(321));
}
function ja(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!pt(e[n], t[n])) return !1;
  return !0;
}
function La(e, t, n, r, o, l) {
  if (
    ((_n = l),
    (ce = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (sl.current = e === null || e.memoizedState === null ? kh : Ch),
    (e = n(r, o)),
    Wr)
  ) {
    l = 0;
    do {
      if (((Wr = !1), (co = 0), 25 <= l)) throw Error(P(301));
      (l += 1),
        (ge = ve = null),
        (t.updateQueue = null),
        (sl.current = Nh),
        (e = n(r, o));
    } while (Wr);
  }
  if (
    ((sl.current = $l),
    (t = ve !== null && ve.next !== null),
    (_n = 0),
    (ge = ve = ce = null),
    (Ll = !1),
    t)
  )
    throw Error(P(300));
  return e;
}
function $a() {
  var e = co !== 0;
  return (co = 0), e;
}
function vt() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return ge === null ? (ce.memoizedState = ge = e) : (ge = ge.next = e), ge;
}
function nt() {
  if (ve === null) {
    var e = ce.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = ve.next;
  var t = ge === null ? ce.memoizedState : ge.next;
  if (t !== null) (ge = t), (ve = e);
  else {
    if (e === null) throw Error(P(310));
    (ve = e),
      (e = {
        memoizedState: ve.memoizedState,
        baseState: ve.baseState,
        baseQueue: ve.baseQueue,
        queue: ve.queue,
        next: null,
      }),
      ge === null ? (ce.memoizedState = ge = e) : (ge = ge.next = e);
  }
  return ge;
}
function fo(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Ii(e) {
  var t = nt(),
    n = t.queue;
  if (n === null) throw Error(P(311));
  n.lastRenderedReducer = e;
  var r = ve,
    o = r.baseQueue,
    l = n.pending;
  if (l !== null) {
    if (o !== null) {
      var i = o.next;
      (o.next = l.next), (l.next = i);
    }
    (r.baseQueue = o = l), (n.pending = null);
  }
  if (o !== null) {
    (l = o.next), (r = r.baseState);
    var s = (i = null),
      a = null,
      c = l;
    do {
      var f = c.lane;
      if ((_n & f) === f)
        a !== null &&
          (a = a.next =
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
        a === null ? ((s = a = d), (i = r)) : (a = a.next = d),
          (ce.lanes |= f),
          (Rn |= f);
      }
      c = c.next;
    } while (c !== null && c !== l);
    a === null ? (i = r) : (a.next = s),
      pt(r, t.memoizedState) || (Fe = !0),
      (t.memoizedState = r),
      (t.baseState = i),
      (t.baseQueue = a),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do (l = o.lane), (ce.lanes |= l), (Rn |= l), (o = o.next);
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Ai(e) {
  var t = nt(),
    n = t.queue;
  if (n === null) throw Error(P(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    o = n.pending,
    l = t.memoizedState;
  if (o !== null) {
    n.pending = null;
    var i = (o = o.next);
    do (l = e(l, i.action)), (i = i.next);
    while (i !== o);
    pt(l, t.memoizedState) || (Fe = !0),
      (t.memoizedState = l),
      t.baseQueue === null && (t.baseState = l),
      (n.lastRenderedState = l);
  }
  return [l, r];
}
function Cd() {}
function Nd(e, t) {
  var n = ce,
    r = nt(),
    o = t(),
    l = !pt(r.memoizedState, o);
  if (
    (l && ((r.memoizedState = o), (Fe = !0)),
    (r = r.queue),
    Da(Rd.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || l || (ge !== null && ge.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      po(9, _d.bind(null, n, r, o, t), void 0, null),
      xe === null)
    )
      throw Error(P(349));
    (_n & 30) !== 0 || Od(n, t, o);
  }
  return o;
}
function Od(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = ce.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ce.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function _d(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Td(t) && Pd(e);
}
function Rd(e, t, n) {
  return n(function () {
    Td(t) && Pd(e);
  });
}
function Td(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !pt(e, n);
  } catch {
    return !0;
  }
}
function Pd(e) {
  var t = Dt(e, 1);
  t !== null && dt(t, e, 1, -1);
}
function gc(e) {
  var t = vt();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: fo,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Sh.bind(null, ce, e)),
    [t.memoizedState, e]
  );
}
function po(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = ce.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ce.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function jd() {
  return nt().memoizedState;
}
function al(e, t, n, r) {
  var o = vt();
  (ce.flags |= e),
    (o.memoizedState = po(1 | t, n, void 0, r === void 0 ? null : r));
}
function Jl(e, t, n, r) {
  var o = nt();
  r = r === void 0 ? null : r;
  var l = void 0;
  if (ve !== null) {
    var i = ve.memoizedState;
    if (((l = i.destroy), r !== null && ja(r, i.deps))) {
      o.memoizedState = po(t, n, l, r);
      return;
    }
  }
  (ce.flags |= e), (o.memoizedState = po(1 | t, n, l, r));
}
function yc(e, t) {
  return al(8390656, 8, e, t);
}
function Da(e, t) {
  return Jl(2048, 8, e, t);
}
function Ld(e, t) {
  return Jl(4, 2, e, t);
}
function $d(e, t) {
  return Jl(4, 4, e, t);
}
function Dd(e, t) {
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
function Md(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), Jl(4, 4, Dd.bind(null, t, e), n)
  );
}
function Ma() {}
function Fd(e, t) {
  var n = nt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ja(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Id(e, t) {
  var n = nt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && ja(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Ad(e, t, n) {
  return (_n & 21) === 0
    ? (e.baseState && ((e.baseState = !1), (Fe = !0)), (e.memoizedState = n))
    : (pt(n, t) || ((n = Uf()), (ce.lanes |= n), (Rn |= n), (e.baseState = !0)),
      t);
}
function Eh(e, t) {
  var n = ee;
  (ee = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = Fi.transition;
  Fi.transition = {};
  try {
    e(!1), t();
  } finally {
    (ee = n), (Fi.transition = r);
  }
}
function zd() {
  return nt().memoizedState;
}
function wh(e, t, n) {
  var r = on(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Bd(e))
  )
    Ud(t, n);
  else if (((n = gd(e, t, n, r)), n !== null)) {
    var o = Le();
    dt(n, e, r, o), Vd(n, t, r);
  }
}
function Sh(e, t, n) {
  var r = on(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Bd(e)) Ud(t, o);
  else {
    var l = e.alternate;
    if (
      e.lanes === 0 &&
      (l === null || l.lanes === 0) &&
      ((l = t.lastRenderedReducer), l !== null)
    )
      try {
        var i = t.lastRenderedState,
          s = l(i, n);
        if (((o.hasEagerState = !0), (o.eagerState = s), pt(s, i))) {
          var a = t.interleaved;
          a === null
            ? ((o.next = o), Oa(t))
            : ((o.next = a.next), (a.next = o)),
            (t.interleaved = o);
          return;
        }
      } catch {
      } finally {
      }
    (n = gd(e, t, o, r)),
      n !== null && ((o = Le()), dt(n, e, r, o), Vd(n, t, r));
  }
}
function Bd(e) {
  var t = e.alternate;
  return e === ce || (t !== null && t === ce);
}
function Ud(e, t) {
  Wr = Ll = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Vd(e, t, n) {
  if ((n & 4194240) !== 0) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), da(e, n);
  }
}
var $l = {
    readContext: tt,
    useCallback: Ce,
    useContext: Ce,
    useEffect: Ce,
    useImperativeHandle: Ce,
    useInsertionEffect: Ce,
    useLayoutEffect: Ce,
    useMemo: Ce,
    useReducer: Ce,
    useRef: Ce,
    useState: Ce,
    useDebugValue: Ce,
    useDeferredValue: Ce,
    useTransition: Ce,
    useMutableSource: Ce,
    useSyncExternalStore: Ce,
    useId: Ce,
    unstable_isNewReconciler: !1,
  },
  kh = {
    readContext: tt,
    useCallback: function (e, t) {
      return (vt().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: tt,
    useEffect: yc,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        al(4194308, 4, Dd.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return al(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return al(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = vt();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = vt();
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
        (e = e.dispatch = wh.bind(null, ce, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = vt();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: gc,
    useDebugValue: Ma,
    useDeferredValue: function (e) {
      return (vt().memoizedState = e);
    },
    useTransition: function () {
      var e = gc(!1),
        t = e[0];
      return (e = Eh.bind(null, e[1])), (vt().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = ce,
        o = vt();
      if (se) {
        if (n === void 0) throw Error(P(407));
        n = n();
      } else {
        if (((n = t()), xe === null)) throw Error(P(349));
        (_n & 30) !== 0 || Od(r, t, n);
      }
      o.memoizedState = n;
      var l = { value: n, getSnapshot: t };
      return (
        (o.queue = l),
        yc(Rd.bind(null, r, l, e), [e]),
        (r.flags |= 2048),
        po(9, _d.bind(null, r, l, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = vt(),
        t = xe.identifierPrefix;
      if (se) {
        var n = Rt,
          r = _t;
        (n = (r & ~(1 << (32 - ft(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = co++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = xh++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Ch = {
    readContext: tt,
    useCallback: Fd,
    useContext: tt,
    useEffect: Da,
    useImperativeHandle: Md,
    useInsertionEffect: Ld,
    useLayoutEffect: $d,
    useMemo: Id,
    useReducer: Ii,
    useRef: jd,
    useState: function () {
      return Ii(fo);
    },
    useDebugValue: Ma,
    useDeferredValue: function (e) {
      var t = nt();
      return Ad(t, ve.memoizedState, e);
    },
    useTransition: function () {
      var e = Ii(fo)[0],
        t = nt().memoizedState;
      return [e, t];
    },
    useMutableSource: Cd,
    useSyncExternalStore: Nd,
    useId: zd,
    unstable_isNewReconciler: !1,
  },
  Nh = {
    readContext: tt,
    useCallback: Fd,
    useContext: tt,
    useEffect: Da,
    useImperativeHandle: Md,
    useInsertionEffect: Ld,
    useLayoutEffect: $d,
    useMemo: Id,
    useReducer: Ai,
    useRef: jd,
    useState: function () {
      return Ai(fo);
    },
    useDebugValue: Ma,
    useDeferredValue: function (e) {
      var t = nt();
      return ve === null ? (t.memoizedState = e) : Ad(t, ve.memoizedState, e);
    },
    useTransition: function () {
      var e = Ai(fo)[0],
        t = nt().memoizedState;
      return [e, t];
    },
    useMutableSource: Cd,
    useSyncExternalStore: Nd,
    useId: zd,
    unstable_isNewReconciler: !1,
  };
function ur(e, t) {
  try {
    var n = "",
      r = t;
    do (n += Jm(r)), (r = r.return);
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
function zi(e, t, n) {
  return {
    value: e,
    source: null,
    stack: n != null ? n : null,
    digest: t != null ? t : null,
  };
}
function Os(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Oh = typeof WeakMap == "function" ? WeakMap : Map;
function Hd(e, t, n) {
  (n = Pt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      Ml || ((Ml = !0), (Fs = r)), Os(e, t);
    }),
    n
  );
}
function Wd(e, t, n) {
  (n = Pt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    (n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        Os(e, t);
      });
  }
  var l = e.stateNode;
  return (
    l !== null &&
      typeof l.componentDidCatch == "function" &&
      (n.callback = function () {
        Os(e, t),
          typeof r != "function" &&
            (rn === null ? (rn = new Set([this])) : rn.add(this));
        var i = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: i !== null ? i : "",
        });
      }),
    n
  );
}
function xc(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Oh();
    var o = new Set();
    r.set(t, o);
  } else (o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o));
  o.has(n) || (o.add(n), (e = Bh.bind(null, e, t, n)), t.then(e, e));
}
function Ec(e) {
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
function wc(e, t, n, r, o) {
  return (e.mode & 1) === 0
    ? (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Pt(-1, 1)), (t.tag = 2), nn(n, t, 1))),
          (n.lanes |= 1)),
      e)
    : ((e.flags |= 65536), (e.lanes = o), e);
}
var _h = At.ReactCurrentOwner,
  Fe = !1;
function Pe(e, t, n, r) {
  t.child = e === null ? Sd(t, null, n, r) : sr(t, e.child, n, r);
}
function Sc(e, t, n, r, o) {
  n = n.render;
  var l = t.ref;
  return (
    tr(t, o),
    (r = La(e, t, n, r, l, o)),
    (n = $a()),
    e !== null && !Fe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Mt(e, t, o))
      : (se && n && Ea(t), (t.flags |= 1), Pe(e, t, r, o), t.child)
  );
}
function kc(e, t, n, r, o) {
  if (e === null) {
    var l = n.type;
    return typeof l == "function" &&
      !Ha(l) &&
      l.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = l), bd(e, t, l, r, o))
      : ((e = dl(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((l = e.child), (e.lanes & o) === 0)) {
    var i = l.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : oo), n(i, r) && e.ref === t.ref)
    )
      return Mt(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = ln(l, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function bd(e, t, n, r, o) {
  if (e !== null) {
    var l = e.memoizedProps;
    if (oo(l, r) && e.ref === t.ref)
      if (((Fe = !1), (t.pendingProps = r = l), (e.lanes & o) !== 0))
        (e.flags & 131072) !== 0 && (Fe = !0);
      else return (t.lanes = e.lanes), Mt(e, t, o);
  }
  return _s(e, t, n, r, o);
}
function Kd(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    l = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if ((t.mode & 1) === 0)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        oe(Xn, Ve),
        (Ve |= n);
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
          oe(Xn, Ve),
          (Ve |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = l !== null ? l.baseLanes : n),
        oe(Xn, Ve),
        (Ve |= r);
    }
  else
    l !== null ? ((r = l.baseLanes | n), (t.memoizedState = null)) : (r = n),
      oe(Xn, Ve),
      (Ve |= r);
  return Pe(e, t, o, n), t.child;
}
function Qd(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function _s(e, t, n, r, o) {
  var l = Ae(n) ? Nn : _e.current;
  return (
    (l = lr(t, l)),
    tr(t, o),
    (n = La(e, t, n, r, l, o)),
    (r = $a()),
    e !== null && !Fe
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Mt(e, t, o))
      : (se && r && Ea(t), (t.flags |= 1), Pe(e, t, n, o), t.child)
  );
}
function Cc(e, t, n, r, o) {
  if (Ae(n)) {
    var l = !0;
    Nl(t);
  } else l = !1;
  if ((tr(t, o), t.stateNode === null))
    ul(e, t), Ed(t, n, r), Ns(t, n, r, o), (r = !0);
  else if (e === null) {
    var i = t.stateNode,
      s = t.memoizedProps;
    i.props = s;
    var a = i.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = tt(c))
      : ((c = Ae(n) ? Nn : _e.current), (c = lr(t, c)));
    var f = n.getDerivedStateFromProps,
      d =
        typeof f == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function";
    d ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((s !== r || a !== c) && vc(t, i, r, c)),
      (Wt = !1);
    var v = t.memoizedState;
    (i.state = v),
      Pl(t, r, i, o),
      (a = t.memoizedState),
      s !== r || v !== a || Ie.current || Wt
        ? (typeof f == "function" && (Cs(t, n, f, r), (a = t.memoizedState)),
          (s = Wt || mc(t, n, s, r, v, a, c))
            ? (d ||
                (typeof i.UNSAFE_componentWillMount != "function" &&
                  typeof i.componentWillMount != "function") ||
                (typeof i.componentWillMount == "function" &&
                  i.componentWillMount(),
                typeof i.UNSAFE_componentWillMount == "function" &&
                  i.UNSAFE_componentWillMount()),
              typeof i.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = a)),
          (i.props = r),
          (i.state = a),
          (i.context = c),
          (r = s))
        : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (i = t.stateNode),
      yd(e, t),
      (s = t.memoizedProps),
      (c = t.type === t.elementType ? s : at(t.type, s)),
      (i.props = c),
      (d = t.pendingProps),
      (v = i.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = tt(a))
        : ((a = Ae(n) ? Nn : _e.current), (a = lr(t, a)));
    var y = n.getDerivedStateFromProps;
    (f =
      typeof y == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function") ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((s !== d || v !== a) && vc(t, i, r, a)),
      (Wt = !1),
      (v = t.memoizedState),
      (i.state = v),
      Pl(t, r, i, o);
    var x = t.memoizedState;
    s !== d || v !== x || Ie.current || Wt
      ? (typeof y == "function" && (Cs(t, n, y, r), (x = t.memoizedState)),
        (c = Wt || mc(t, n, c, r, v, x, a) || !1)
          ? (f ||
              (typeof i.UNSAFE_componentWillUpdate != "function" &&
                typeof i.componentWillUpdate != "function") ||
              (typeof i.componentWillUpdate == "function" &&
                i.componentWillUpdate(r, x, a),
              typeof i.UNSAFE_componentWillUpdate == "function" &&
                i.UNSAFE_componentWillUpdate(r, x, a)),
            typeof i.componentDidUpdate == "function" && (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof i.componentDidUpdate != "function" ||
              (s === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate != "function" ||
              (s === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = x)),
        (i.props = r),
        (i.state = x),
        (i.context = a),
        (r = c))
      : (typeof i.componentDidUpdate != "function" ||
          (s === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 4),
        typeof i.getSnapshotBeforeUpdate != "function" ||
          (s === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Rs(e, t, n, r, l, o);
}
function Rs(e, t, n, r, o, l) {
  Qd(e, t);
  var i = (t.flags & 128) !== 0;
  if (!r && !i) return o && uc(t, n, !1), Mt(e, t, l);
  (r = t.stateNode), (_h.current = t);
  var s =
    i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && i
      ? ((t.child = sr(t, e.child, null, l)), (t.child = sr(t, null, s, l)))
      : Pe(e, t, s, l),
    (t.memoizedState = r.state),
    o && uc(t, n, !0),
    t.child
  );
}
function Gd(e) {
  var t = e.stateNode;
  t.pendingContext
    ? ac(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && ac(e, t.context, !1),
    Ra(e, t.containerInfo);
}
function Nc(e, t, n, r, o) {
  return ir(), Sa(o), (t.flags |= 256), Pe(e, t, n, r), t.child;
}
var Ts = { dehydrated: null, treeContext: null, retryLane: 0 };
function Ps(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Yd(e, t, n) {
  var r = t.pendingProps,
    o = ue.current,
    l = !1,
    i = (t.flags & 128) !== 0,
    s;
  if (
    ((s = i) ||
      (s = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    s
      ? ((l = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (o |= 1),
    oe(ue, o & 1),
    e === null)
  )
    return (
      Ss(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? ((t.mode & 1) === 0
            ? (t.lanes = 1)
            : e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824),
          null)
        : ((i = r.children),
          (e = r.fallback),
          l
            ? ((r = t.mode),
              (l = t.child),
              (i = { mode: "hidden", children: i }),
              (r & 1) === 0 && l !== null
                ? ((l.childLanes = 0), (l.pendingProps = i))
                : (l = ni(i, r, 0, null)),
              (e = kn(e, r, n, null)),
              (l.return = t),
              (e.return = t),
              (l.sibling = e),
              (t.child = l),
              (t.child.memoizedState = Ps(n)),
              (t.memoizedState = Ts),
              e)
            : Fa(t, i))
    );
  if (((o = e.memoizedState), o !== null && ((s = o.dehydrated), s !== null)))
    return Rh(e, t, i, r, s, o, n);
  if (l) {
    (l = r.fallback), (i = t.mode), (o = e.child), (s = o.sibling);
    var a = { mode: "hidden", children: r.children };
    return (
      (i & 1) === 0 && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (t.deletions = null))
        : ((r = ln(o, a)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      s !== null ? (l = ln(s, l)) : ((l = kn(l, i, n, null)), (l.flags |= 2)),
      (l.return = t),
      (r.return = t),
      (r.sibling = l),
      (t.child = r),
      (r = l),
      (l = t.child),
      (i = e.child.memoizedState),
      (i =
        i === null
          ? Ps(n)
          : {
              baseLanes: i.baseLanes | n,
              cachePool: null,
              transitions: i.transitions,
            }),
      (l.memoizedState = i),
      (l.childLanes = e.childLanes & ~n),
      (t.memoizedState = Ts),
      r
    );
  }
  return (
    (l = e.child),
    (e = l.sibling),
    (r = ln(l, { mode: "visible", children: r.children })),
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
function Fa(e, t) {
  return (
    (t = ni({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Ko(e, t, n, r) {
  return (
    r !== null && Sa(r),
    sr(t, e.child, null, n),
    (e = Fa(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Rh(e, t, n, r, o, l, i) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = zi(Error(P(422)))), Ko(e, t, i, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((l = r.fallback),
          (o = t.mode),
          (r = ni({ mode: "visible", children: r.children }, o, 0, null)),
          (l = kn(l, o, i, null)),
          (l.flags |= 2),
          (r.return = t),
          (l.return = t),
          (r.sibling = l),
          (t.child = r),
          (t.mode & 1) !== 0 && sr(t, e.child, null, i),
          (t.child.memoizedState = Ps(i)),
          (t.memoizedState = Ts),
          l);
  if ((t.mode & 1) === 0) return Ko(e, t, i, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var s = r.dgst;
    return (r = s), (l = Error(P(419))), (r = zi(l, r, void 0)), Ko(e, t, i, r);
  }
  if (((s = (i & e.childLanes) !== 0), Fe || s)) {
    if (((r = xe), r !== null)) {
      switch (i & -i) {
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
      (o = (o & (r.suspendedLanes | i)) !== 0 ? 0 : o),
        o !== 0 &&
          o !== l.retryLane &&
          ((l.retryLane = o), Dt(e, o), dt(r, e, o, -1));
    }
    return Va(), (r = zi(Error(P(421)))), Ko(e, t, i, r);
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Uh.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = l.treeContext),
      (We = tn(o.nextSibling)),
      (Ke = t),
      (se = !0),
      (ct = null),
      e !== null &&
        ((qe[Ze++] = _t),
        (qe[Ze++] = Rt),
        (qe[Ze++] = On),
        (_t = e.id),
        (Rt = e.overflow),
        (On = t)),
      (t = Fa(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Oc(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), ks(e.return, t, n);
}
function Bi(e, t, n, r, o) {
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
function Xd(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    l = r.tail;
  if ((Pe(e, t, r.children, n), (r = ue.current), (r & 2) !== 0))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Oc(e, n, t);
        else if (e.tag === 19) Oc(e, n, t);
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
  if ((oe(ue, r), (t.mode & 1) === 0)) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; )
          (e = n.alternate),
            e !== null && jl(e) === null && (o = n),
            (n = n.sibling);
        (n = o),
          n === null
            ? ((o = t.child), (t.child = null))
            : ((o = n.sibling), (n.sibling = null)),
          Bi(t, !1, o, n, l);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && jl(e) === null)) {
            t.child = o;
            break;
          }
          (e = o.sibling), (o.sibling = n), (n = o), (o = e);
        }
        Bi(t, !0, n, null, l);
        break;
      case "together":
        Bi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function ul(e, t) {
  (t.mode & 1) === 0 &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Mt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Rn |= t.lanes),
    (n & t.childLanes) === 0)
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(P(153));
  if (t.child !== null) {
    for (
      e = t.child, n = ln(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = ln(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function Th(e, t, n) {
  switch (t.tag) {
    case 3:
      Gd(t), ir();
      break;
    case 5:
      kd(t);
      break;
    case 1:
      Ae(t.type) && Nl(t);
      break;
    case 4:
      Ra(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        o = t.memoizedProps.value;
      oe(Rl, r._currentValue), (r._currentValue = o);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (oe(ue, ue.current & 1), (t.flags |= 128), null)
          : (n & t.child.childLanes) !== 0
            ? Yd(e, t, n)
            : (oe(ue, ue.current & 1),
              (e = Mt(e, t, n)),
              e !== null ? e.sibling : null);
      oe(ue, ue.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
        if (r) return Xd(e, t, n);
        t.flags |= 128;
      }
      if (
        ((o = t.memoizedState),
        o !== null &&
          ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
        oe(ue, ue.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Kd(e, t, n);
  }
  return Mt(e, t, n);
}
var qd, js, Zd, Jd;
qd = function (e, t) {
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
js = function () {};
Zd = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    (e = t.stateNode), En(Et.current);
    var l = null;
    switch (n) {
      case "input":
        (o = Ji(e, o)), (r = Ji(e, r)), (l = []);
        break;
      case "select":
        (o = fe({}, o, { value: void 0 })),
          (r = fe({}, r, { value: void 0 })),
          (l = []);
        break;
      case "textarea":
        (o = ns(e, o)), (r = ns(e, r)), (l = []);
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = kl);
    }
    os(n, r);
    var i;
    n = null;
    for (c in o)
      if (!r.hasOwnProperty(c) && o.hasOwnProperty(c) && o[c] != null)
        if (c === "style") {
          var s = o[c];
          for (i in s) s.hasOwnProperty(i) && (n || (n = {}), (n[i] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (qr.hasOwnProperty(c)
              ? l || (l = [])
              : (l = l || []).push(c, null));
    for (c in r) {
      var a = r[c];
      if (
        ((s = o != null ? o[c] : void 0),
        r.hasOwnProperty(c) && a !== s && (a != null || s != null))
      )
        if (c === "style")
          if (s) {
            for (i in s)
              !s.hasOwnProperty(i) ||
                (a && a.hasOwnProperty(i)) ||
                (n || (n = {}), (n[i] = ""));
            for (i in a)
              a.hasOwnProperty(i) &&
                s[i] !== a[i] &&
                (n || (n = {}), (n[i] = a[i]));
          } else n || (l || (l = []), l.push(c, n)), (n = a);
        else
          c === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (s = s ? s.__html : void 0),
              a != null && s !== a && (l = l || []).push(c, a))
            : c === "children"
              ? (typeof a != "string" && typeof a != "number") ||
                (l = l || []).push(c, "" + a)
              : c !== "suppressContentEditableWarning" &&
                c !== "suppressHydrationWarning" &&
                (qr.hasOwnProperty(c)
                  ? (a != null && c === "onScroll" && le("scroll", e),
                    l || s === a || (l = []))
                  : (l = l || []).push(c, a));
    }
    n && (l = l || []).push("style", n);
    var c = l;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
Jd = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Pr(e, t) {
  if (!se)
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
function Ne(e) {
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
function Ph(e, t, n) {
  var r = t.pendingProps;
  switch ((wa(t), t.tag)) {
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
      return Ne(t), null;
    case 1:
      return Ae(t.type) && Cl(), Ne(t), null;
    case 3:
      return (
        (r = t.stateNode),
        ar(),
        ie(Ie),
        ie(_e),
        Pa(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Wo(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
              ((t.flags |= 1024), ct !== null && (zs(ct), (ct = null)))),
        js(e, t),
        Ne(t),
        null
      );
    case 5:
      Ta(t);
      var o = En(uo.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        Zd(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(P(166));
          return Ne(t), null;
        }
        if (((e = En(Et.current)), Wo(t))) {
          (r = t.stateNode), (n = t.type);
          var l = t.memoizedProps;
          switch (((r[gt] = t), (r[so] = l), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              le("cancel", r), le("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              le("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < Ir.length; o++) le(Ir[o], r);
              break;
            case "source":
              le("error", r);
              break;
            case "img":
            case "image":
            case "link":
              le("error", r), le("load", r);
              break;
            case "details":
              le("toggle", r);
              break;
            case "input":
              Mu(r, l), le("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!l.multiple }),
                le("invalid", r);
              break;
            case "textarea":
              Iu(r, l), le("invalid", r);
          }
          os(n, l), (o = null);
          for (var i in l)
            if (l.hasOwnProperty(i)) {
              var s = l[i];
              i === "children"
                ? typeof s == "string"
                  ? r.textContent !== s &&
                    (l.suppressHydrationWarning !== !0 &&
                      Ho(r.textContent, s, e),
                    (o = ["children", s]))
                  : typeof s == "number" &&
                    r.textContent !== "" + s &&
                    (l.suppressHydrationWarning !== !0 &&
                      Ho(r.textContent, s, e),
                    (o = ["children", "" + s]))
                : qr.hasOwnProperty(i) &&
                  s != null &&
                  i === "onScroll" &&
                  le("scroll", r);
            }
          switch (n) {
            case "input":
              Mo(r), Fu(r, l, !0);
              break;
            case "textarea":
              Mo(r), Au(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof l.onClick == "function" && (r.onclick = kl);
          }
          (r = o), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (i = o.nodeType === 9 ? o : o.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Of(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = i.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = i.createElement(n, { is: r.is }))
                  : ((e = i.createElement(n)),
                    n === "select" &&
                      ((i = e),
                      r.multiple
                        ? (i.multiple = !0)
                        : r.size && (i.size = r.size)))
              : (e = i.createElementNS(e, n)),
            (e[gt] = t),
            (e[so] = r),
            qd(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((i = ls(n, r)), n)) {
              case "dialog":
                le("cancel", e), le("close", e), (o = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                le("load", e), (o = r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < Ir.length; o++) le(Ir[o], e);
                o = r;
                break;
              case "source":
                le("error", e), (o = r);
                break;
              case "img":
              case "image":
              case "link":
                le("error", e), le("load", e), (o = r);
                break;
              case "details":
                le("toggle", e), (o = r);
                break;
              case "input":
                Mu(e, r), (o = Ji(e, r)), le("invalid", e);
                break;
              case "option":
                o = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (o = fe({}, r, { value: void 0 })),
                  le("invalid", e);
                break;
              case "textarea":
                Iu(e, r), (o = ns(e, r)), le("invalid", e);
                break;
              default:
                o = r;
            }
            os(n, o), (s = o);
            for (l in s)
              if (s.hasOwnProperty(l)) {
                var a = s[l];
                l === "style"
                  ? Tf(e, a)
                  : l === "dangerouslySetInnerHTML"
                    ? ((a = a ? a.__html : void 0), a != null && _f(e, a))
                    : l === "children"
                      ? typeof a == "string"
                        ? (n !== "textarea" || a !== "") && Zr(e, a)
                        : typeof a == "number" && Zr(e, "" + a)
                      : l !== "suppressContentEditableWarning" &&
                        l !== "suppressHydrationWarning" &&
                        l !== "autoFocus" &&
                        (qr.hasOwnProperty(l)
                          ? a != null && l === "onScroll" && le("scroll", e)
                          : a != null && ia(e, l, a, i));
              }
            switch (n) {
              case "input":
                Mo(e), Fu(e, r, !1);
                break;
              case "textarea":
                Mo(e), Au(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + sn(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (l = r.value),
                  l != null
                    ? qn(e, !!r.multiple, l, !1)
                    : r.defaultValue != null &&
                      qn(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = kl);
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
      return Ne(t), null;
    case 6:
      if (e && t.stateNode != null) Jd(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(P(166));
        if (((n = En(uo.current)), En(Et.current), Wo(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[gt] = t),
            (l = r.nodeValue !== n) && ((e = Ke), e !== null))
          )
            switch (e.tag) {
              case 3:
                Ho(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Ho(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          l && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[gt] = t),
            (t.stateNode = r);
      }
      return Ne(t), null;
    case 13:
      if (
        (ie(ue),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (se && We !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
          hd(), ir(), (t.flags |= 98560), (l = !1);
        else if (((l = Wo(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!l) throw Error(P(318));
            if (
              ((l = t.memoizedState),
              (l = l !== null ? l.dehydrated : null),
              !l)
            )
              throw Error(P(317));
            l[gt] = t;
          } else
            ir(),
              (t.flags & 128) === 0 && (t.memoizedState = null),
              (t.flags |= 4);
          Ne(t), (l = !1);
        } else ct !== null && (zs(ct), (ct = null)), (l = !0);
        if (!l) return t.flags & 65536 ? t : null;
      }
      return (t.flags & 128) !== 0
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            (t.mode & 1) !== 0 &&
              (e === null || (ue.current & 1) !== 0
                ? he === 0 && (he = 3)
                : Va())),
          t.updateQueue !== null && (t.flags |= 4),
          Ne(t),
          null);
    case 4:
      return (
        ar(), js(e, t), e === null && lo(t.stateNode.containerInfo), Ne(t), null
      );
    case 10:
      return Na(t.type._context), Ne(t), null;
    case 17:
      return Ae(t.type) && Cl(), Ne(t), null;
    case 19:
      if ((ie(ue), (l = t.memoizedState), l === null)) return Ne(t), null;
      if (((r = (t.flags & 128) !== 0), (i = l.rendering), i === null))
        if (r) Pr(l, !1);
        else {
          if (he !== 0 || (e !== null && (e.flags & 128) !== 0))
            for (e = t.child; e !== null; ) {
              if (((i = jl(e)), i !== null)) {
                for (
                  t.flags |= 128,
                    Pr(l, !1),
                    r = i.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (l = n),
                    (e = r),
                    (l.flags &= 14680066),
                    (i = l.alternate),
                    i === null
                      ? ((l.childLanes = 0),
                        (l.lanes = e),
                        (l.child = null),
                        (l.subtreeFlags = 0),
                        (l.memoizedProps = null),
                        (l.memoizedState = null),
                        (l.updateQueue = null),
                        (l.dependencies = null),
                        (l.stateNode = null))
                      : ((l.childLanes = i.childLanes),
                        (l.lanes = i.lanes),
                        (l.child = i.child),
                        (l.subtreeFlags = 0),
                        (l.deletions = null),
                        (l.memoizedProps = i.memoizedProps),
                        (l.memoizedState = i.memoizedState),
                        (l.updateQueue = i.updateQueue),
                        (l.type = i.type),
                        (e = i.dependencies),
                        (l.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return oe(ue, (ue.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          l.tail !== null &&
            pe() > cr &&
            ((t.flags |= 128), (r = !0), Pr(l, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = jl(i)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Pr(l, !0),
              l.tail === null && l.tailMode === "hidden" && !i.alternate && !se)
            )
              return Ne(t), null;
          } else
            2 * pe() - l.renderingStartTime > cr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Pr(l, !1), (t.lanes = 4194304));
        l.isBackwards
          ? ((i.sibling = t.child), (t.child = i))
          : ((n = l.last),
            n !== null ? (n.sibling = i) : (t.child = i),
            (l.last = i));
      }
      return l.tail !== null
        ? ((t = l.tail),
          (l.rendering = t),
          (l.tail = t.sibling),
          (l.renderingStartTime = pe()),
          (t.sibling = null),
          (n = ue.current),
          oe(ue, r ? (n & 1) | 2 : n & 1),
          t)
        : (Ne(t), null);
    case 22:
    case 23:
      return (
        Ua(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && (t.mode & 1) !== 0
          ? (Ve & 1073741824) !== 0 &&
            (Ne(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Ne(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(P(156, t.tag));
}
function jh(e, t) {
  switch ((wa(t), t.tag)) {
    case 1:
      return (
        Ae(t.type) && Cl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        ar(),
        ie(Ie),
        ie(_e),
        Pa(),
        (e = t.flags),
        (e & 65536) !== 0 && (e & 128) === 0
          ? ((t.flags = (e & -65537) | 128), t)
          : null
      );
    case 5:
      return Ta(t), null;
    case 13:
      if (
        (ie(ue), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(P(340));
        ir();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return ie(ue), null;
    case 4:
      return ar(), null;
    case 10:
      return Na(t.type._context), null;
    case 22:
    case 23:
      return Ua(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Qo = !1,
  Oe = !1,
  Lh = typeof WeakSet == "function" ? WeakSet : Set,
  $ = null;
function Yn(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        de(e, t, r);
      }
    else n.current = null;
}
function Ls(e, t, n) {
  try {
    n();
  } catch (r) {
    de(e, t, r);
  }
}
var _c = !1;
function $h(e, t) {
  if (((vs = El), (e = rd()), xa(e))) {
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
          var i = 0,
            s = -1,
            a = -1,
            c = 0,
            f = 0,
            d = e,
            v = null;
          t: for (;;) {
            for (
              var y;
              d !== n || (o !== 0 && d.nodeType !== 3) || (s = i + o),
                d !== l || (r !== 0 && d.nodeType !== 3) || (a = i + r),
                d.nodeType === 3 && (i += d.nodeValue.length),
                (y = d.firstChild) !== null;

            )
              (v = d), (d = y);
            for (;;) {
              if (d === e) break t;
              if (
                (v === n && ++c === o && (s = i),
                v === l && ++f === r && (a = i),
                (y = d.nextSibling) !== null)
              )
                break;
              (d = v), (v = d.parentNode);
            }
            d = y;
          }
          n = s === -1 || a === -1 ? null : { start: s, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (hs = { focusedElem: e, selectionRange: n }, El = !1, $ = t; $ !== null; )
    if (((t = $), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), ($ = e);
    else
      for (; $ !== null; ) {
        t = $;
        try {
          var x = t.alternate;
          if ((t.flags & 1024) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (x !== null) {
                  var w = x.memoizedProps,
                    k = x.memoizedState,
                    m = t.stateNode,
                    p = m.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? w : at(t.type, w),
                      k,
                    );
                  m.__reactInternalSnapshotBeforeUpdate = p;
                }
                break;
              case 3:
                var h = t.stateNode.containerInfo;
                h.nodeType === 1
                  ? (h.textContent = "")
                  : h.nodeType === 9 &&
                    h.documentElement &&
                    h.removeChild(h.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(P(163));
            }
        } catch (S) {
          de(t, t.return, S);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), ($ = e);
          break;
        }
        $ = t.return;
      }
  return (x = _c), (_c = !1), x;
}
function br(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var l = o.destroy;
        (o.destroy = void 0), l !== void 0 && Ls(t, n, l);
      }
      o = o.next;
    } while (o !== r);
  }
}
function ei(e, t) {
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
function $s(e) {
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
function ep(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), ep(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[gt], delete t[so], delete t[xs], delete t[vh], delete t[hh])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function tp(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Rc(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || tp(e.return)) return null;
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
function Ds(e, t, n) {
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
          n != null || t.onclick !== null || (t.onclick = kl));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Ds(e, t, n), e = e.sibling; e !== null; ) Ds(e, t, n), (e = e.sibling);
}
function Ms(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Ms(e, t, n), e = e.sibling; e !== null; ) Ms(e, t, n), (e = e.sibling);
}
var Ee = null,
  ut = !1;
function Vt(e, t, n) {
  for (n = n.child; n !== null; ) np(e, t, n), (n = n.sibling);
}
function np(e, t, n) {
  if (xt && typeof xt.onCommitFiberUnmount == "function")
    try {
      xt.onCommitFiberUnmount(Kl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Oe || Yn(n, t);
    case 6:
      var r = Ee,
        o = ut;
      (Ee = null),
        Vt(e, t, n),
        (Ee = r),
        (ut = o),
        Ee !== null &&
          (ut
            ? ((e = Ee),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Ee.removeChild(n.stateNode));
      break;
    case 18:
      Ee !== null &&
        (ut
          ? ((e = Ee),
            (n = n.stateNode),
            e.nodeType === 8
              ? $i(e.parentNode, n)
              : e.nodeType === 1 && $i(e, n),
            no(e))
          : $i(Ee, n.stateNode));
      break;
    case 4:
      (r = Ee),
        (o = ut),
        (Ee = n.stateNode.containerInfo),
        (ut = !0),
        Vt(e, t, n),
        (Ee = r),
        (ut = o);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Oe &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        o = r = r.next;
        do {
          var l = o,
            i = l.destroy;
          (l = l.tag),
            i !== void 0 && ((l & 2) !== 0 || (l & 4) !== 0) && Ls(n, t, i),
            (o = o.next);
        } while (o !== r);
      }
      Vt(e, t, n);
      break;
    case 1:
      if (
        !Oe &&
        (Yn(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (s) {
          de(n, t, s);
        }
      Vt(e, t, n);
      break;
    case 21:
      Vt(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Oe = (r = Oe) || n.memoizedState !== null), Vt(e, t, n), (Oe = r))
        : Vt(e, t, n);
      break;
    default:
      Vt(e, t, n);
  }
}
function Tc(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Lh()),
      t.forEach(function (r) {
        var o = Vh.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
  }
}
function st(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var l = e,
          i = t,
          s = i;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              (Ee = s.stateNode), (ut = !1);
              break e;
            case 3:
              (Ee = s.stateNode.containerInfo), (ut = !0);
              break e;
            case 4:
              (Ee = s.stateNode.containerInfo), (ut = !0);
              break e;
          }
          s = s.return;
        }
        if (Ee === null) throw Error(P(160));
        np(l, i, o), (Ee = null), (ut = !1);
        var a = o.alternate;
        a !== null && (a.return = null), (o.return = null);
      } catch (c) {
        de(o, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) rp(t, e), (t = t.sibling);
}
function rp(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((st(t, e), mt(e), r & 4)) {
        try {
          br(3, e, e.return), ei(3, e);
        } catch (w) {
          de(e, e.return, w);
        }
        try {
          br(5, e, e.return);
        } catch (w) {
          de(e, e.return, w);
        }
      }
      break;
    case 1:
      st(t, e), mt(e), r & 512 && n !== null && Yn(n, n.return);
      break;
    case 5:
      if (
        (st(t, e),
        mt(e),
        r & 512 && n !== null && Yn(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          Zr(o, "");
        } catch (w) {
          de(e, e.return, w);
        }
      }
      if (r & 4 && ((o = e.stateNode), o != null)) {
        var l = e.memoizedProps,
          i = n !== null ? n.memoizedProps : l,
          s = e.type,
          a = e.updateQueue;
        if (((e.updateQueue = null), a !== null))
          try {
            s === "input" && l.type === "radio" && l.name != null && Cf(o, l),
              ls(s, i);
            var c = ls(s, l);
            for (i = 0; i < a.length; i += 2) {
              var f = a[i],
                d = a[i + 1];
              f === "style"
                ? Tf(o, d)
                : f === "dangerouslySetInnerHTML"
                  ? _f(o, d)
                  : f === "children"
                    ? Zr(o, d)
                    : ia(o, f, d, c);
            }
            switch (s) {
              case "input":
                es(o, l);
                break;
              case "textarea":
                Nf(o, l);
                break;
              case "select":
                var v = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!l.multiple;
                var y = l.value;
                y != null
                  ? qn(o, !!l.multiple, y, !1)
                  : v !== !!l.multiple &&
                    (l.defaultValue != null
                      ? qn(o, !!l.multiple, l.defaultValue, !0)
                      : qn(o, !!l.multiple, l.multiple ? [] : "", !1));
            }
            o[so] = l;
          } catch (w) {
            de(e, e.return, w);
          }
      }
      break;
    case 6:
      if ((st(t, e), mt(e), r & 4)) {
        if (e.stateNode === null) throw Error(P(162));
        (o = e.stateNode), (l = e.memoizedProps);
        try {
          o.nodeValue = l;
        } catch (w) {
          de(e, e.return, w);
        }
      }
      break;
    case 3:
      if (
        (st(t, e), mt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          no(t.containerInfo);
        } catch (w) {
          de(e, e.return, w);
        }
      break;
    case 4:
      st(t, e), mt(e);
      break;
    case 13:
      st(t, e),
        mt(e),
        (o = e.child),
        o.flags & 8192 &&
          ((l = o.memoizedState !== null),
          (o.stateNode.isHidden = l),
          !l ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (za = pe())),
        r & 4 && Tc(e);
      break;
    case 22:
      if (
        ((f = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Oe = (c = Oe) || f), st(t, e), (Oe = c)) : st(t, e),
        mt(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !f && (e.mode & 1) !== 0)
        )
          for ($ = e, f = e.child; f !== null; ) {
            for (d = $ = f; $ !== null; ) {
              switch (((v = $), (y = v.child), v.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  br(4, v, v.return);
                  break;
                case 1:
                  Yn(v, v.return);
                  var x = v.stateNode;
                  if (typeof x.componentWillUnmount == "function") {
                    (r = v), (n = v.return);
                    try {
                      (t = r),
                        (x.props = t.memoizedProps),
                        (x.state = t.memoizedState),
                        x.componentWillUnmount();
                    } catch (w) {
                      de(r, n, w);
                    }
                  }
                  break;
                case 5:
                  Yn(v, v.return);
                  break;
                case 22:
                  if (v.memoizedState !== null) {
                    jc(d);
                    continue;
                  }
              }
              y !== null ? ((y.return = v), ($ = y)) : jc(d);
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
                    : ((s = d.stateNode),
                      (a = d.memoizedProps.style),
                      (i =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (s.style.display = Rf("display", i)));
              } catch (w) {
                de(e, e.return, w);
              }
            }
          } else if (d.tag === 6) {
            if (f === null)
              try {
                d.stateNode.nodeValue = c ? "" : d.memoizedProps;
              } catch (w) {
                de(e, e.return, w);
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
      st(t, e), mt(e), r & 4 && Tc(e);
      break;
    case 21:
      break;
    default:
      st(t, e), mt(e);
  }
}
function mt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (tp(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(P(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (Zr(o, ""), (r.flags &= -33));
          var l = Rc(e);
          Ms(e, l, o);
          break;
        case 3:
        case 4:
          var i = r.stateNode.containerInfo,
            s = Rc(e);
          Ds(e, s, i);
          break;
        default:
          throw Error(P(161));
      }
    } catch (a) {
      de(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Dh(e, t, n) {
  ($ = e), op(e);
}
function op(e, t, n) {
  for (var r = (e.mode & 1) !== 0; $ !== null; ) {
    var o = $,
      l = o.child;
    if (o.tag === 22 && r) {
      var i = o.memoizedState !== null || Qo;
      if (!i) {
        var s = o.alternate,
          a = (s !== null && s.memoizedState !== null) || Oe;
        s = Qo;
        var c = Oe;
        if (((Qo = i), (Oe = a) && !c))
          for ($ = o; $ !== null; )
            (i = $),
              (a = i.child),
              i.tag === 22 && i.memoizedState !== null
                ? Lc(o)
                : a !== null
                  ? ((a.return = i), ($ = a))
                  : Lc(o);
        for (; l !== null; ) ($ = l), op(l), (l = l.sibling);
        ($ = o), (Qo = s), (Oe = c);
      }
      Pc(e);
    } else
      (o.subtreeFlags & 8772) !== 0 && l !== null
        ? ((l.return = o), ($ = l))
        : Pc(e);
  }
}
function Pc(e) {
  for (; $ !== null; ) {
    var t = $;
    if ((t.flags & 8772) !== 0) {
      var n = t.alternate;
      try {
        if ((t.flags & 8772) !== 0)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Oe || ei(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Oe)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : at(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var l = t.updateQueue;
              l !== null && pc(t, l, r);
              break;
            case 3:
              var i = t.updateQueue;
              if (i !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                pc(t, i, n);
              }
              break;
            case 5:
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
                var a = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
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
                    d !== null && no(d);
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
              throw Error(P(163));
          }
        Oe || (t.flags & 512 && $s(t));
      } catch (v) {
        de(t, t.return, v);
      }
    }
    if (t === e) {
      $ = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), ($ = n);
      break;
    }
    $ = t.return;
  }
}
function jc(e) {
  for (; $ !== null; ) {
    var t = $;
    if (t === e) {
      $ = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), ($ = n);
      break;
    }
    $ = t.return;
  }
}
function Lc(e) {
  for (; $ !== null; ) {
    var t = $;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ei(4, t);
          } catch (a) {
            de(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              de(t, o, a);
            }
          }
          var l = t.return;
          try {
            $s(t);
          } catch (a) {
            de(t, l, a);
          }
          break;
        case 5:
          var i = t.return;
          try {
            $s(t);
          } catch (a) {
            de(t, i, a);
          }
      }
    } catch (a) {
      de(t, t.return, a);
    }
    if (t === e) {
      $ = null;
      break;
    }
    var s = t.sibling;
    if (s !== null) {
      (s.return = t.return), ($ = s);
      break;
    }
    $ = t.return;
  }
}
var Mh = Math.ceil,
  Dl = At.ReactCurrentDispatcher,
  Ia = At.ReactCurrentOwner,
  et = At.ReactCurrentBatchConfig,
  X = 0,
  xe = null,
  me = null,
  we = 0,
  Ve = 0,
  Xn = fn(0),
  he = 0,
  mo = null,
  Rn = 0,
  ti = 0,
  Aa = 0,
  Kr = null,
  Me = null,
  za = 0,
  cr = 1 / 0,
  Nt = null,
  Ml = !1,
  Fs = null,
  rn = null,
  Go = !1,
  Xt = null,
  Fl = 0,
  Qr = 0,
  Is = null,
  cl = -1,
  fl = 0;
function Le() {
  return (X & 6) !== 0 ? pe() : cl !== -1 ? cl : (cl = pe());
}
function on(e) {
  return (e.mode & 1) === 0
    ? 1
    : (X & 2) !== 0 && we !== 0
      ? we & -we
      : yh.transition !== null
        ? (fl === 0 && (fl = Uf()), fl)
        : ((e = ee),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : Gf(e.type))),
          e);
}
function dt(e, t, n, r) {
  if (50 < Qr) throw ((Qr = 0), (Is = null), Error(P(185)));
  Eo(e, n, r),
    ((X & 2) === 0 || e !== xe) &&
      (e === xe && ((X & 2) === 0 && (ti |= n), he === 4 && Qt(e, we)),
      ze(e, r),
      n === 1 &&
        X === 0 &&
        (t.mode & 1) === 0 &&
        ((cr = pe() + 500), ql && dn()));
}
function ze(e, t) {
  var n = e.callbackNode;
  yv(e, t);
  var r = xl(e, e === xe ? we : 0);
  if (r === 0)
    n !== null && Uu(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Uu(n), t === 1))
      e.tag === 0 ? gh($c.bind(null, e)) : pd($c.bind(null, e)),
        ph(function () {
          (X & 6) === 0 && dn();
        }),
        (n = null);
    else {
      switch (Vf(r)) {
        case 1:
          n = fa;
          break;
        case 4:
          n = zf;
          break;
        case 16:
          n = yl;
          break;
        case 536870912:
          n = Bf;
          break;
        default:
          n = yl;
      }
      n = dp(n, lp.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function lp(e, t) {
  if (((cl = -1), (fl = 0), (X & 6) !== 0)) throw Error(P(327));
  var n = e.callbackNode;
  if (nr() && e.callbackNode !== n) return null;
  var r = xl(e, e === xe ? we : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Il(e, r);
  else {
    t = r;
    var o = X;
    X |= 2;
    var l = sp();
    (xe !== e || we !== t) && ((Nt = null), (cr = pe() + 500), Sn(e, t));
    do
      try {
        Ah();
        break;
      } catch (s) {
        ip(e, s);
      }
    while (1);
    Ca(),
      (Dl.current = l),
      (X = o),
      me !== null ? (t = 0) : ((xe = null), (we = 0), (t = he));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = cs(e)), o !== 0 && ((r = o), (t = As(e, o)))), t === 1)
    )
      throw ((n = mo), Sn(e, 0), Qt(e, r), ze(e, pe()), n);
    if (t === 6) Qt(e, r);
    else {
      if (
        ((o = e.current.alternate),
        (r & 30) === 0 &&
          !Fh(o) &&
          ((t = Il(e, r)),
          t === 2 && ((l = cs(e)), l !== 0 && ((r = l), (t = As(e, l)))),
          t === 1))
      )
        throw ((n = mo), Sn(e, 0), Qt(e, r), ze(e, pe()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(P(345));
        case 2:
          gn(e, Me, Nt);
          break;
        case 3:
          if (
            (Qt(e, r), (r & 130023424) === r && ((t = za + 500 - pe()), 10 < t))
          ) {
            if (xl(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              Le(), (e.pingedLanes |= e.suspendedLanes & o);
              break;
            }
            e.timeoutHandle = ys(gn.bind(null, e, Me, Nt), t);
            break;
          }
          gn(e, Me, Nt);
          break;
        case 4:
          if ((Qt(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r; ) {
            var i = 31 - ft(r);
            (l = 1 << i), (i = t[i]), i > o && (o = i), (r &= ~l);
          }
          if (
            ((r = o),
            (r = pe() - r),
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
                          : 1960 * Mh(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = ys(gn.bind(null, e, Me, Nt), r);
            break;
          }
          gn(e, Me, Nt);
          break;
        case 5:
          gn(e, Me, Nt);
          break;
        default:
          throw Error(P(329));
      }
    }
  }
  return ze(e, pe()), e.callbackNode === n ? lp.bind(null, e) : null;
}
function As(e, t) {
  var n = Kr;
  return (
    e.current.memoizedState.isDehydrated && (Sn(e, t).flags |= 256),
    (e = Il(e, t)),
    e !== 2 && ((t = Me), (Me = n), t !== null && zs(t)),
    e
  );
}
function zs(e) {
  Me === null ? (Me = e) : Me.push.apply(Me, e);
}
function Fh(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            l = o.getSnapshot;
          o = o.value;
          try {
            if (!pt(l(), o)) return !1;
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
function Qt(e, t) {
  for (
    t &= ~Aa,
      t &= ~ti,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - ft(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function $c(e) {
  if ((X & 6) !== 0) throw Error(P(327));
  nr();
  var t = xl(e, 0);
  if ((t & 1) === 0) return ze(e, pe()), null;
  var n = Il(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = cs(e);
    r !== 0 && ((t = r), (n = As(e, r)));
  }
  if (n === 1) throw ((n = mo), Sn(e, 0), Qt(e, t), ze(e, pe()), n);
  if (n === 6) throw Error(P(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    gn(e, Me, Nt),
    ze(e, pe()),
    null
  );
}
function Ba(e, t) {
  var n = X;
  X |= 1;
  try {
    return e(t);
  } finally {
    (X = n), X === 0 && ((cr = pe() + 500), ql && dn());
  }
}
function Tn(e) {
  Xt !== null && Xt.tag === 0 && (X & 6) === 0 && nr();
  var t = X;
  X |= 1;
  var n = et.transition,
    r = ee;
  try {
    if (((et.transition = null), (ee = 1), e)) return e();
  } finally {
    (ee = r), (et.transition = n), (X = t), (X & 6) === 0 && dn();
  }
}
function Ua() {
  (Ve = Xn.current), ie(Xn);
}
function Sn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), dh(n)), me !== null))
    for (n = me.return; n !== null; ) {
      var r = n;
      switch ((wa(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Cl();
          break;
        case 3:
          ar(), ie(Ie), ie(_e), Pa();
          break;
        case 5:
          Ta(r);
          break;
        case 4:
          ar();
          break;
        case 13:
          ie(ue);
          break;
        case 19:
          ie(ue);
          break;
        case 10:
          Na(r.type._context);
          break;
        case 22:
        case 23:
          Ua();
      }
      n = n.return;
    }
  if (
    ((xe = e),
    (me = e = ln(e.current, null)),
    (we = Ve = t),
    (he = 0),
    (mo = null),
    (Aa = ti = Rn = 0),
    (Me = Kr = null),
    xn !== null)
  ) {
    for (t = 0; t < xn.length; t++)
      if (((n = xn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          l = n.pending;
        if (l !== null) {
          var i = l.next;
          (l.next = o), (r.next = i);
        }
        n.pending = r;
      }
    xn = null;
  }
  return e;
}
function ip(e, t) {
  do {
    var n = me;
    try {
      if ((Ca(), (sl.current = $l), Ll)) {
        for (var r = ce.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), (r = r.next);
        }
        Ll = !1;
      }
      if (
        ((_n = 0),
        (ge = ve = ce = null),
        (Wr = !1),
        (co = 0),
        (Ia.current = null),
        n === null || n.return === null)
      ) {
        (he = 1), (mo = t), (me = null);
        break;
      }
      e: {
        var l = e,
          i = n.return,
          s = n,
          a = t;
        if (
          ((t = we),
          (s.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var c = a,
            f = s,
            d = f.tag;
          if ((f.mode & 1) === 0 && (d === 0 || d === 11 || d === 15)) {
            var v = f.alternate;
            v
              ? ((f.updateQueue = v.updateQueue),
                (f.memoizedState = v.memoizedState),
                (f.lanes = v.lanes))
              : ((f.updateQueue = null), (f.memoizedState = null));
          }
          var y = Ec(i);
          if (y !== null) {
            (y.flags &= -257),
              wc(y, i, s, l, t),
              y.mode & 1 && xc(l, c, t),
              (t = y),
              (a = c);
            var x = t.updateQueue;
            if (x === null) {
              var w = new Set();
              w.add(a), (t.updateQueue = w);
            } else x.add(a);
            break e;
          } else {
            if ((t & 1) === 0) {
              xc(l, c, t), Va();
              break e;
            }
            a = Error(P(426));
          }
        } else if (se && s.mode & 1) {
          var k = Ec(i);
          if (k !== null) {
            (k.flags & 65536) === 0 && (k.flags |= 256),
              wc(k, i, s, l, t),
              Sa(ur(a, s));
            break e;
          }
        }
        (l = a = ur(a, s)),
          he !== 4 && (he = 2),
          Kr === null ? (Kr = [l]) : Kr.push(l),
          (l = i);
        do {
          switch (l.tag) {
            case 3:
              (l.flags |= 65536), (t &= -t), (l.lanes |= t);
              var m = Hd(l, a, t);
              dc(l, m);
              break e;
            case 1:
              s = a;
              var p = l.type,
                h = l.stateNode;
              if (
                (l.flags & 128) === 0 &&
                (typeof p.getDerivedStateFromError == "function" ||
                  (h !== null &&
                    typeof h.componentDidCatch == "function" &&
                    (rn === null || !rn.has(h))))
              ) {
                (l.flags |= 65536), (t &= -t), (l.lanes |= t);
                var S = Wd(l, s, t);
                dc(l, S);
                break e;
              }
          }
          l = l.return;
        } while (l !== null);
      }
      up(n);
    } catch (E) {
      (t = E), me === n && n !== null && (me = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function sp() {
  var e = Dl.current;
  return (Dl.current = $l), e === null ? $l : e;
}
function Va() {
  (he === 0 || he === 3 || he === 2) && (he = 4),
    xe === null ||
      ((Rn & 268435455) === 0 && (ti & 268435455) === 0) ||
      Qt(xe, we);
}
function Il(e, t) {
  var n = X;
  X |= 2;
  var r = sp();
  (xe !== e || we !== t) && ((Nt = null), Sn(e, t));
  do
    try {
      Ih();
      break;
    } catch (o) {
      ip(e, o);
    }
  while (1);
  if ((Ca(), (X = n), (Dl.current = r), me !== null)) throw Error(P(261));
  return (xe = null), (we = 0), he;
}
function Ih() {
  for (; me !== null; ) ap(me);
}
function Ah() {
  for (; me !== null && !uv(); ) ap(me);
}
function ap(e) {
  var t = fp(e.alternate, e, Ve);
  (e.memoizedProps = e.pendingProps),
    t === null ? up(e) : (me = t),
    (Ia.current = null);
}
function up(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), (t.flags & 32768) === 0)) {
      if (((n = Ph(n, t, Ve)), n !== null)) {
        me = n;
        return;
      }
    } else {
      if (((n = jh(n, t)), n !== null)) {
        (n.flags &= 32767), (me = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (he = 6), (me = null);
        return;
      }
    }
    if (((t = t.sibling), t !== null)) {
      me = t;
      return;
    }
    me = t = e;
  } while (t !== null);
  he === 0 && (he = 5);
}
function gn(e, t, n) {
  var r = ee,
    o = et.transition;
  try {
    (et.transition = null), (ee = 1), zh(e, t, n, r);
  } finally {
    (et.transition = o), (ee = r);
  }
  return null;
}
function zh(e, t, n, r) {
  do nr();
  while (Xt !== null);
  if ((X & 6) !== 0) throw Error(P(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(P(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var l = n.lanes | n.childLanes;
  if (
    (xv(e, l),
    e === xe && ((me = xe = null), (we = 0)),
    ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
      Go ||
      ((Go = !0),
      dp(yl, function () {
        return nr(), null;
      })),
    (l = (n.flags & 15990) !== 0),
    (n.subtreeFlags & 15990) !== 0 || l)
  ) {
    (l = et.transition), (et.transition = null);
    var i = ee;
    ee = 1;
    var s = X;
    (X |= 4),
      (Ia.current = null),
      $h(e, n),
      rp(n, e),
      lh(hs),
      (El = !!vs),
      (hs = vs = null),
      (e.current = n),
      Dh(n),
      cv(),
      (X = s),
      (ee = i),
      (et.transition = l);
  } else e.current = n;
  if (
    (Go && ((Go = !1), (Xt = e), (Fl = o)),
    (l = e.pendingLanes),
    l === 0 && (rn = null),
    pv(n.stateNode),
    ze(e, pe()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest });
  if (Ml) throw ((Ml = !1), (e = Fs), (Fs = null), e);
  return (
    (Fl & 1) !== 0 && e.tag !== 0 && nr(),
    (l = e.pendingLanes),
    (l & 1) !== 0 ? (e === Is ? Qr++ : ((Qr = 0), (Is = e))) : (Qr = 0),
    dn(),
    null
  );
}
function nr() {
  if (Xt !== null) {
    var e = Vf(Fl),
      t = et.transition,
      n = ee;
    try {
      if (((et.transition = null), (ee = 16 > e ? 16 : e), Xt === null))
        var r = !1;
      else {
        if (((e = Xt), (Xt = null), (Fl = 0), (X & 6) !== 0))
          throw Error(P(331));
        var o = X;
        for (X |= 4, $ = e.current; $ !== null; ) {
          var l = $,
            i = l.child;
          if (($.flags & 16) !== 0) {
            var s = l.deletions;
            if (s !== null) {
              for (var a = 0; a < s.length; a++) {
                var c = s[a];
                for ($ = c; $ !== null; ) {
                  var f = $;
                  switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      br(8, f, l);
                  }
                  var d = f.child;
                  if (d !== null) (d.return = f), ($ = d);
                  else
                    for (; $ !== null; ) {
                      f = $;
                      var v = f.sibling,
                        y = f.return;
                      if ((ep(f), f === c)) {
                        $ = null;
                        break;
                      }
                      if (v !== null) {
                        (v.return = y), ($ = v);
                        break;
                      }
                      $ = y;
                    }
                }
              }
              var x = l.alternate;
              if (x !== null) {
                var w = x.child;
                if (w !== null) {
                  x.child = null;
                  do {
                    var k = w.sibling;
                    (w.sibling = null), (w = k);
                  } while (w !== null);
                }
              }
              $ = l;
            }
          }
          if ((l.subtreeFlags & 2064) !== 0 && i !== null)
            (i.return = l), ($ = i);
          else
            e: for (; $ !== null; ) {
              if (((l = $), (l.flags & 2048) !== 0))
                switch (l.tag) {
                  case 0:
                  case 11:
                  case 15:
                    br(9, l, l.return);
                }
              var m = l.sibling;
              if (m !== null) {
                (m.return = l.return), ($ = m);
                break e;
              }
              $ = l.return;
            }
        }
        var p = e.current;
        for ($ = p; $ !== null; ) {
          i = $;
          var h = i.child;
          if ((i.subtreeFlags & 2064) !== 0 && h !== null)
            (h.return = i), ($ = h);
          else
            e: for (i = p; $ !== null; ) {
              if (((s = $), (s.flags & 2048) !== 0))
                try {
                  switch (s.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ei(9, s);
                  }
                } catch (E) {
                  de(s, s.return, E);
                }
              if (s === i) {
                $ = null;
                break e;
              }
              var S = s.sibling;
              if (S !== null) {
                (S.return = s.return), ($ = S);
                break e;
              }
              $ = s.return;
            }
        }
        if (
          ((X = o), dn(), xt && typeof xt.onPostCommitFiberRoot == "function")
        )
          try {
            xt.onPostCommitFiberRoot(Kl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (ee = n), (et.transition = t);
    }
  }
  return !1;
}
function Dc(e, t, n) {
  (t = ur(n, t)),
    (t = Hd(e, t, 1)),
    (e = nn(e, t, 1)),
    (t = Le()),
    e !== null && (Eo(e, 1, t), ze(e, t));
}
function de(e, t, n) {
  if (e.tag === 3) Dc(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Dc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (rn === null || !rn.has(r)))
        ) {
          (e = ur(n, e)),
            (e = Wd(t, e, 1)),
            (t = nn(t, e, 1)),
            (e = Le()),
            t !== null && (Eo(t, 1, e), ze(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function Bh(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = Le()),
    (e.pingedLanes |= e.suspendedLanes & n),
    xe === e &&
      (we & n) === n &&
      (he === 4 || (he === 3 && (we & 130023424) === we && 500 > pe() - za)
        ? Sn(e, 0)
        : (Aa |= n)),
    ze(e, t);
}
function cp(e, t) {
  t === 0 &&
    ((e.mode & 1) === 0
      ? (t = 1)
      : ((t = Ao), (Ao <<= 1), (Ao & 130023424) === 0 && (Ao = 4194304)));
  var n = Le();
  (e = Dt(e, t)), e !== null && (Eo(e, t, n), ze(e, n));
}
function Uh(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), cp(e, n);
}
function Vh(e, t) {
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
      throw Error(P(314));
  }
  r !== null && r.delete(t), cp(e, n);
}
var fp;
fp = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Ie.current) Fe = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
        return (Fe = !1), Th(e, t, n);
      Fe = (e.flags & 131072) !== 0;
    }
  else (Fe = !1), se && (t.flags & 1048576) !== 0 && md(t, _l, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      ul(e, t), (e = t.pendingProps);
      var o = lr(t, _e.current);
      tr(t, n), (o = La(null, t, r, e, o, n));
      var l = $a();
      return (
        (t.flags |= 1),
        typeof o == "object" &&
        o !== null &&
        typeof o.render == "function" &&
        o.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Ae(r) ? ((l = !0), Nl(t)) : (l = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            _a(t),
            (o.updater = Zl),
            (t.stateNode = o),
            (o._reactInternals = t),
            Ns(t, r, e, n),
            (t = Rs(null, t, r, !0, l, n)))
          : ((t.tag = 0), se && l && Ea(t), Pe(null, t, o, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (ul(e, t),
          (e = t.pendingProps),
          (o = r._init),
          (r = o(r._payload)),
          (t.type = r),
          (o = t.tag = Wh(r)),
          (e = at(r, e)),
          o)
        ) {
          case 0:
            t = _s(null, t, r, e, n);
            break e;
          case 1:
            t = Cc(null, t, r, e, n);
            break e;
          case 11:
            t = Sc(null, t, r, e, n);
            break e;
          case 14:
            t = kc(null, t, r, at(r.type, e), n);
            break e;
        }
        throw Error(P(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : at(r, o)),
        _s(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : at(r, o)),
        Cc(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((Gd(t), e === null)) throw Error(P(387));
        (r = t.pendingProps),
          (l = t.memoizedState),
          (o = l.element),
          yd(e, t),
          Pl(t, r, null, n);
        var i = t.memoizedState;
        if (((r = i.element), l.isDehydrated))
          if (
            ((l = {
              element: r,
              isDehydrated: !1,
              cache: i.cache,
              pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
              transitions: i.transitions,
            }),
            (t.updateQueue.baseState = l),
            (t.memoizedState = l),
            t.flags & 256)
          ) {
            (o = ur(Error(P(423)), t)), (t = Nc(e, t, r, n, o));
            break e;
          } else if (r !== o) {
            (o = ur(Error(P(424)), t)), (t = Nc(e, t, r, n, o));
            break e;
          } else
            for (
              We = tn(t.stateNode.containerInfo.firstChild),
                Ke = t,
                se = !0,
                ct = null,
                n = Sd(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((ir(), r === o)) {
            t = Mt(e, t, n);
            break e;
          }
          Pe(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        kd(t),
        e === null && Ss(t),
        (r = t.type),
        (o = t.pendingProps),
        (l = e !== null ? e.memoizedProps : null),
        (i = o.children),
        gs(r, o) ? (i = null) : l !== null && gs(r, l) && (t.flags |= 32),
        Qd(e, t),
        Pe(e, t, i, n),
        t.child
      );
    case 6:
      return e === null && Ss(t), null;
    case 13:
      return Yd(e, t, n);
    case 4:
      return (
        Ra(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = sr(t, null, r, n)) : Pe(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : at(r, o)),
        Sc(e, t, r, o, n)
      );
    case 7:
      return Pe(e, t, t.pendingProps, n), t.child;
    case 8:
      return Pe(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Pe(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (o = t.pendingProps),
          (l = t.memoizedProps),
          (i = o.value),
          oe(Rl, r._currentValue),
          (r._currentValue = i),
          l !== null)
        )
          if (pt(l.value, i)) {
            if (l.children === o.children && !Ie.current) {
              t = Mt(e, t, n);
              break e;
            }
          } else
            for (l = t.child, l !== null && (l.return = t); l !== null; ) {
              var s = l.dependencies;
              if (s !== null) {
                i = l.child;
                for (var a = s.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (l.tag === 1) {
                      (a = Pt(-1, n & -n)), (a.tag = 2);
                      var c = l.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var f = c.pending;
                        f === null
                          ? (a.next = a)
                          : ((a.next = f.next), (f.next = a)),
                          (c.pending = a);
                      }
                    }
                    (l.lanes |= n),
                      (a = l.alternate),
                      a !== null && (a.lanes |= n),
                      ks(l.return, n, t),
                      (s.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (l.tag === 10) i = l.type === t.type ? null : l.child;
              else if (l.tag === 18) {
                if (((i = l.return), i === null)) throw Error(P(341));
                (i.lanes |= n),
                  (s = i.alternate),
                  s !== null && (s.lanes |= n),
                  ks(i, n, t),
                  (i = l.sibling);
              } else i = l.child;
              if (i !== null) i.return = l;
              else
                for (i = l; i !== null; ) {
                  if (i === t) {
                    i = null;
                    break;
                  }
                  if (((l = i.sibling), l !== null)) {
                    (l.return = i.return), (i = l);
                    break;
                  }
                  i = i.return;
                }
              l = i;
            }
        Pe(e, t, o.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        tr(t, n),
        (o = tt(o)),
        (r = r(o)),
        (t.flags |= 1),
        Pe(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = at(r, t.pendingProps)),
        (o = at(r.type, o)),
        kc(e, t, r, o, n)
      );
    case 15:
      return bd(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : at(r, o)),
        ul(e, t),
        (t.tag = 1),
        Ae(r) ? ((e = !0), Nl(t)) : (e = !1),
        tr(t, n),
        Ed(t, r, o),
        Ns(t, r, o, n),
        Rs(null, t, r, !0, e, n)
      );
    case 19:
      return Xd(e, t, n);
    case 22:
      return Kd(e, t, n);
  }
  throw Error(P(156, t.tag));
};
function dp(e, t) {
  return Af(e, t);
}
function Hh(e, t, n, r) {
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
function Je(e, t, n, r) {
  return new Hh(e, t, n, r);
}
function Ha(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function Wh(e) {
  if (typeof e == "function") return Ha(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === aa)) return 11;
    if (e === ua) return 14;
  }
  return 2;
}
function ln(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Je(e.tag, t, e.key, e.mode)),
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
function dl(e, t, n, r, o, l) {
  var i = 2;
  if (((r = e), typeof e == "function")) Ha(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else
    e: switch (e) {
      case Bn:
        return kn(n.children, o, l, t);
      case sa:
        (i = 8), (o |= 8);
        break;
      case Yi:
        return (
          (e = Je(12, n, t, o | 2)), (e.elementType = Yi), (e.lanes = l), e
        );
      case Xi:
        return (e = Je(13, n, t, o)), (e.elementType = Xi), (e.lanes = l), e;
      case qi:
        return (e = Je(19, n, t, o)), (e.elementType = qi), (e.lanes = l), e;
      case wf:
        return ni(n, o, l, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case xf:
              i = 10;
              break e;
            case Ef:
              i = 9;
              break e;
            case aa:
              i = 11;
              break e;
            case ua:
              i = 14;
              break e;
            case Ht:
              (i = 16), (r = null);
              break e;
          }
        throw Error(P(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Je(i, n, t, o)), (t.elementType = e), (t.type = r), (t.lanes = l), t
  );
}
function kn(e, t, n, r) {
  return (e = Je(7, e, r, t)), (e.lanes = n), e;
}
function ni(e, t, n, r) {
  return (
    (e = Je(22, e, r, t)),
    (e.elementType = wf),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Ui(e, t, n) {
  return (e = Je(6, e, null, t)), (e.lanes = n), e;
}
function Vi(e, t, n) {
  return (
    (t = Je(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function bh(e, t, n, r, o) {
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
    (this.eventTimes = Si(0)),
    (this.expirationTimes = Si(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Si(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null);
}
function Wa(e, t, n, r, o, l, i, s, a) {
  return (
    (e = new bh(e, t, n, s, a)),
    t === 1 ? ((t = 1), l === !0 && (t |= 8)) : (t = 0),
    (l = Je(3, null, null, t)),
    (e.current = l),
    (l.stateNode = e),
    (l.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    _a(l),
    e
  );
}
function Kh(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: zn,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function pp(e) {
  if (!e) return an;
  e = e._reactInternals;
  e: {
    if (Ln(e) !== e || e.tag !== 1) throw Error(P(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Ae(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(P(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Ae(n)) return dd(e, n, t);
  }
  return t;
}
function mp(e, t, n, r, o, l, i, s, a) {
  return (
    (e = Wa(n, r, !0, e, o, l, i, s, a)),
    (e.context = pp(null)),
    (n = e.current),
    (r = Le()),
    (o = on(n)),
    (l = Pt(r, o)),
    (l.callback = t != null ? t : null),
    nn(n, l, o),
    (e.current.lanes = o),
    Eo(e, o, r),
    ze(e, r),
    e
  );
}
function ri(e, t, n, r) {
  var o = t.current,
    l = Le(),
    i = on(o);
  return (
    (n = pp(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Pt(l, i)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = nn(o, t, i)),
    e !== null && (dt(e, o, i, l), il(e, o, i)),
    i
  );
}
function Al(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Mc(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function ba(e, t) {
  Mc(e, t), (e = e.alternate) && Mc(e, t);
}
function Qh() {
  return null;
}
var vp =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Ka(e) {
  this._internalRoot = e;
}
oi.prototype.render = Ka.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(P(409));
  ri(e, t, null, null);
};
oi.prototype.unmount = Ka.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Tn(function () {
      ri(null, e, null, null);
    }),
      (t[$t] = null);
  }
};
function oi(e) {
  this._internalRoot = e;
}
oi.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = bf();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Kt.length && t !== 0 && t < Kt[n].priority; n++);
    Kt.splice(n, 0, e), n === 0 && Qf(e);
  }
};
function Qa(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function li(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Fc() {}
function Gh(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var l = r;
      r = function () {
        var c = Al(i);
        l.call(c);
      };
    }
    var i = mp(t, r, e, 0, null, !1, !1, "", Fc);
    return (
      (e._reactRootContainer = i),
      (e[$t] = i.current),
      lo(e.nodeType === 8 ? e.parentNode : e),
      Tn(),
      i
    );
  }
  for (; (o = e.lastChild); ) e.removeChild(o);
  if (typeof r == "function") {
    var s = r;
    r = function () {
      var c = Al(a);
      s.call(c);
    };
  }
  var a = Wa(e, 0, !1, null, null, !1, !1, "", Fc);
  return (
    (e._reactRootContainer = a),
    (e[$t] = a.current),
    lo(e.nodeType === 8 ? e.parentNode : e),
    Tn(function () {
      ri(t, a, n, r);
    }),
    a
  );
}
function ii(e, t, n, r, o) {
  var l = n._reactRootContainer;
  if (l) {
    var i = l;
    if (typeof o == "function") {
      var s = o;
      o = function () {
        var a = Al(i);
        s.call(a);
      };
    }
    ri(t, i, e, o);
  } else i = Gh(n, t, e, o, r);
  return Al(i);
}
Hf = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Fr(t.pendingLanes);
        n !== 0 &&
          (da(t, n | 1),
          ze(t, pe()),
          (X & 6) === 0 && ((cr = pe() + 500), dn()));
      }
      break;
    case 13:
      Tn(function () {
        var r = Dt(e, 1);
        if (r !== null) {
          var o = Le();
          dt(r, e, 1, o);
        }
      }),
        ba(e, 1);
  }
};
pa = function (e) {
  if (e.tag === 13) {
    var t = Dt(e, 134217728);
    if (t !== null) {
      var n = Le();
      dt(t, e, 134217728, n);
    }
    ba(e, 134217728);
  }
};
Wf = function (e) {
  if (e.tag === 13) {
    var t = on(e),
      n = Dt(e, t);
    if (n !== null) {
      var r = Le();
      dt(n, e, t, r);
    }
    ba(e, t);
  }
};
bf = function () {
  return ee;
};
Kf = function (e, t) {
  var n = ee;
  try {
    return (ee = e), t();
  } finally {
    ee = n;
  }
};
ss = function (e, t, n) {
  switch (t) {
    case "input":
      if ((es(e, n), (t = n.name), n.type === "radio" && t != null)) {
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
            var o = Xl(r);
            if (!o) throw Error(P(90));
            kf(r), es(r, o);
          }
        }
      }
      break;
    case "textarea":
      Nf(e, n);
      break;
    case "select":
      (t = n.value), t != null && qn(e, !!n.multiple, t, !1);
  }
};
Lf = Ba;
$f = Tn;
var Yh = { usingClientEntryPoint: !1, Events: [So, Wn, Xl, Pf, jf, Ba] },
  jr = {
    findFiberByHostInstance: yn,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  Xh = {
    bundleType: jr.bundleType,
    version: jr.version,
    rendererPackageName: jr.rendererPackageName,
    rendererConfig: jr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: At.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Ff(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: jr.findFiberByHostInstance || Qh,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Yo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Yo.isDisabled && Yo.supportsFiber)
    try {
      (Kl = Yo.inject(Xh)), (xt = Yo);
    } catch {}
}
Ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Yh;
Ge.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Qa(t)) throw Error(P(200));
  return Kh(e, t, null, n);
};
Ge.createRoot = function (e, t) {
  if (!Qa(e)) throw Error(P(299));
  var n = !1,
    r = "",
    o = vp;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = Wa(e, 1, !1, null, null, n, !1, r, o)),
    (e[$t] = t.current),
    lo(e.nodeType === 8 ? e.parentNode : e),
    new Ka(t)
  );
};
Ge.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(P(188))
      : ((e = Object.keys(e).join(",")), Error(P(268, e)));
  return (e = Ff(t)), (e = e === null ? null : e.stateNode), e;
};
Ge.flushSync = function (e) {
  return Tn(e);
};
Ge.hydrate = function (e, t, n) {
  if (!li(t)) throw Error(P(200));
  return ii(null, e, t, !0, n);
};
Ge.hydrateRoot = function (e, t, n) {
  if (!Qa(e)) throw Error(P(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    l = "",
    i = vp;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (l = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (i = n.onRecoverableError)),
    (t = mp(t, null, e, 1, n != null ? n : null, o, !1, l, i)),
    (e[$t] = t.current),
    lo(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (o = n._getVersion),
        (o = o(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, o])
          : t.mutableSourceEagerHydrationData.push(n, o);
  return new oi(t);
};
Ge.render = function (e, t, n) {
  if (!li(t)) throw Error(P(200));
  return ii(null, e, t, !1, n);
};
Ge.unmountComponentAtNode = function (e) {
  if (!li(e)) throw Error(P(40));
  return e._reactRootContainer
    ? (Tn(function () {
        ii(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[$t] = null);
        });
      }),
      !0)
    : !1;
};
Ge.unstable_batchedUpdates = Ba;
Ge.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!li(n)) throw Error(P(200));
  if (e == null || e._reactInternals === void 0) throw Error(P(38));
  return ii(e, t, n, !1, r);
};
Ge.version = "18.2.0-next-9e3b772b8-20220608";
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
  t(), (e.exports = Ge);
})(ra);
const wn = sf(ra.exports);
var hp,
  Ic = ra.exports;
(hp = Ic.createRoot), Ic.hydrateRoot;
var gp = { exports: {} };
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
          var i = typeof l;
          if (i === "string" || i === "number") r.push(l);
          else if (Array.isArray(l)) {
            if (l.length) {
              var s = n.apply(null, l);
              s && r.push(s);
            }
          } else if (i === "object") {
            if (
              l.toString !== Object.prototype.toString &&
              !l.toString.toString().includes("[native code]")
            ) {
              r.push(l.toString());
              continue;
            }
            for (var a in l) t.call(l, a) && l[a] && r.push(a);
          }
        }
      }
      return r.join(" ");
    }
    e.exports ? ((n.default = n), (e.exports = n)) : (window.classNames = n);
  })();
})(gp);
const I = gp.exports;
var _ = { exports: {} },
  si = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var qh = g.exports,
  Zh = Symbol.for("react.element"),
  Jh = Symbol.for("react.fragment"),
  eg = Object.prototype.hasOwnProperty,
  tg = qh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  ng = { key: !0, ref: !0, __self: !0, __source: !0 };
function yp(e, t, n) {
  var r,
    o = {},
    l = null,
    i = null;
  n !== void 0 && (l = "" + n),
    t.key !== void 0 && (l = "" + t.key),
    t.ref !== void 0 && (i = t.ref);
  for (r in t) eg.call(t, r) && !ng.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: Zh,
    type: e,
    key: l,
    ref: i,
    props: o,
    _owner: tg.current,
  };
}
si.Fragment = Jh;
si.jsx = yp;
si.jsxs = yp;
(function (e) {
  e.exports = si;
})(_);
const rg = ["xxl", "xl", "lg", "md", "sm", "xs"],
  og = "xs",
  ai = g.exports.createContext({
    prefixes: {},
    breakpoints: rg,
    minBreakpoint: og,
  });
function H(e, t) {
  const { prefixes: n } = g.exports.useContext(ai);
  return e || n[t] || t;
}
function xp() {
  const { breakpoints: e } = g.exports.useContext(ai);
  return e;
}
function Ep() {
  const { minBreakpoint: e } = g.exports.useContext(ai);
  return e;
}
function Ga() {
  const { dir: e } = g.exports.useContext(ai);
  return e === "rtl";
}
const lg = { fluid: !1 },
  Ya = g.exports.forwardRef(
    ({ bsPrefix: e, fluid: t, as: n = "div", className: r, ...o }, l) => {
      const i = H(e, "container"),
        s = typeof t == "string" ? `-${t}` : "-fluid";
      return _.exports.jsx(n, {
        ref: l,
        ...o,
        className: I(r, t ? `${i}${s}` : i),
      });
    },
  );
Ya.displayName = "Container";
Ya.defaultProps = lg;
const qt = g.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = H(e, "row"),
      i = xp(),
      s = Ep(),
      a = `${l}-cols`,
      c = [];
    return (
      i.forEach((f) => {
        const d = r[f];
        delete r[f];
        let v;
        d != null && typeof d == "object" ? ({ cols: v } = d) : (v = d);
        const y = f !== s ? `-${f}` : "";
        v != null && c.push(`${a}${y}-${v}`);
      }),
      _.exports.jsx(n, { ref: o, ...r, className: I(t, l, ...c) })
    );
  },
);
qt.displayName = "Row";
function ig({ as: e, bsPrefix: t, className: n, ...r }) {
  t = H(t, "col");
  const o = xp(),
    l = Ep(),
    i = [],
    s = [];
  return (
    o.forEach((a) => {
      const c = r[a];
      delete r[a];
      let f, d, v;
      typeof c == "object" && c != null
        ? ({ span: f, offset: d, order: v } = c)
        : (f = c);
      const y = a !== l ? `-${a}` : "";
      f && i.push(f === !0 ? `${t}${y}` : `${t}${y}-${f}`),
        v != null && s.push(`order${y}-${v}`),
        d != null && s.push(`offset${y}-${d}`);
    }),
    [
      { ...r, className: I(n, ...i, ...s) },
      { as: e, bsPrefix: t, spans: i },
    ]
  );
}
const He = g.exports.forwardRef((e, t) => {
  const [{ className: n, ...r }, { as: o = "div", bsPrefix: l, spans: i }] =
    ig(e);
  return _.exports.jsx(o, { ...r, ref: t, className: I(n, !i.length && l) });
});
He.displayName = "Col";
function yr(e) {
  return (e && e.ownerDocument) || document;
}
function sg(e) {
  var t = yr(e);
  return (t && t.defaultView) || window;
}
function ag(e, t) {
  return sg(e).getComputedStyle(e, t);
}
var ug = /([A-Z])/g;
function cg(e) {
  return e.replace(ug, "-$1").toLowerCase();
}
var fg = /^ms-/;
function Xo(e) {
  return cg(e).replace(fg, "-ms-");
}
var dg =
  /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function pg(e) {
  return !!(e && dg.test(e));
}
function jt(e, t) {
  var n = "",
    r = "";
  if (typeof t == "string")
    return e.style.getPropertyValue(Xo(t)) || ag(e).getPropertyValue(Xo(t));
  Object.keys(t).forEach(function (o) {
    var l = t[o];
    !l && l !== 0
      ? e.style.removeProperty(Xo(o))
      : pg(o)
        ? (r += o + "(" + l + ") ")
        : (n += Xo(o) + ": " + l + ";");
  }),
    r && (n += "transform: " + r + ";"),
    (e.style.cssText += ";" + n);
}
function wp(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Bs(e, t) {
  return (
    (Bs = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, o) {
          return (r.__proto__ = o), r;
        }),
    Bs(e, t)
  );
}
function mg(e, t) {
  (e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    Bs(e, t);
}
var G = { exports: {} },
  vg = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  hg = vg,
  gg = hg;
function Sp() {}
function kp() {}
kp.resetWarningCache = Sp;
var yg = function () {
  function e(r, o, l, i, s, a) {
    if (a !== gg) {
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
    checkPropTypes: kp,
    resetWarningCache: Sp,
  };
  return (n.PropTypes = n), n;
};
G.exports = yg();
const Ac = { disabled: !1 },
  Cp = u.createContext(null);
var xg = function (t) {
    return t.scrollTop;
  },
  Ar = "unmounted",
  bt = "exited",
  ht = "entering",
  Gt = "entered",
  vo = "exiting",
  zt = (function (e) {
    mg(t, e);
    function t(r, o) {
      var l;
      l = e.call(this, r, o) || this;
      var i = o,
        s = i && !i.isMounting ? r.enter : r.appear,
        a;
      return (
        (l.appearStatus = null),
        r.in
          ? s
            ? ((a = bt), (l.appearStatus = ht))
            : (a = Gt)
          : r.unmountOnExit || r.mountOnEnter
            ? (a = Ar)
            : (a = bt),
        (l.state = { status: a }),
        (l.nextCallback = null),
        l
      );
    }
    t.getDerivedStateFromProps = function (o, l) {
      var i = o.in;
      return i && l.status === Ar ? { status: bt } : null;
    };
    var n = t.prototype;
    return (
      (n.componentDidMount = function () {
        this.updateStatus(!0, this.appearStatus);
      }),
      (n.componentDidUpdate = function (o) {
        var l = null;
        if (o !== this.props) {
          var i = this.state.status;
          this.props.in
            ? i !== ht && i !== Gt && (l = ht)
            : (i === ht || i === Gt) && (l = vo);
        }
        this.updateStatus(!1, l);
      }),
      (n.componentWillUnmount = function () {
        this.cancelNextCallback();
      }),
      (n.getTimeouts = function () {
        var o = this.props.timeout,
          l,
          i,
          s;
        return (
          (l = i = s = o),
          o != null &&
            typeof o != "number" &&
            ((l = o.exit),
            (i = o.enter),
            (s = o.appear !== void 0 ? o.appear : i)),
          { exit: l, enter: i, appear: s }
        );
      }),
      (n.updateStatus = function (o, l) {
        if ((o === void 0 && (o = !1), l !== null))
          if ((this.cancelNextCallback(), l === ht)) {
            if (this.props.unmountOnExit || this.props.mountOnEnter) {
              var i = this.props.nodeRef
                ? this.props.nodeRef.current
                : wn.findDOMNode(this);
              i && xg(i);
            }
            this.performEnter(o);
          } else this.performExit();
        else
          this.props.unmountOnExit &&
            this.state.status === bt &&
            this.setState({ status: Ar });
      }),
      (n.performEnter = function (o) {
        var l = this,
          i = this.props.enter,
          s = this.context ? this.context.isMounting : o,
          a = this.props.nodeRef ? [s] : [wn.findDOMNode(this), s],
          c = a[0],
          f = a[1],
          d = this.getTimeouts(),
          v = s ? d.appear : d.enter;
        if ((!o && !i) || Ac.disabled) {
          this.safeSetState({ status: Gt }, function () {
            l.props.onEntered(c);
          });
          return;
        }
        this.props.onEnter(c, f),
          this.safeSetState({ status: ht }, function () {
            l.props.onEntering(c, f),
              l.onTransitionEnd(v, function () {
                l.safeSetState({ status: Gt }, function () {
                  l.props.onEntered(c, f);
                });
              });
          });
      }),
      (n.performExit = function () {
        var o = this,
          l = this.props.exit,
          i = this.getTimeouts(),
          s = this.props.nodeRef ? void 0 : wn.findDOMNode(this);
        if (!l || Ac.disabled) {
          this.safeSetState({ status: bt }, function () {
            o.props.onExited(s);
          });
          return;
        }
        this.props.onExit(s),
          this.safeSetState({ status: vo }, function () {
            o.props.onExiting(s),
              o.onTransitionEnd(i.exit, function () {
                o.safeSetState({ status: bt }, function () {
                  o.props.onExited(s);
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
          i = !0;
        return (
          (this.nextCallback = function (s) {
            i && ((i = !1), (l.nextCallback = null), o(s));
          }),
          (this.nextCallback.cancel = function () {
            i = !1;
          }),
          this.nextCallback
        );
      }),
      (n.onTransitionEnd = function (o, l) {
        this.setNextCallback(l);
        var i = this.props.nodeRef
            ? this.props.nodeRef.current
            : wn.findDOMNode(this),
          s = o == null && !this.props.addEndListener;
        if (!i || s) {
          setTimeout(this.nextCallback, 0);
          return;
        }
        if (this.props.addEndListener) {
          var a = this.props.nodeRef
              ? [this.nextCallback]
              : [i, this.nextCallback],
            c = a[0],
            f = a[1];
          this.props.addEndListener(c, f);
        }
        o != null && setTimeout(this.nextCallback, o);
      }),
      (n.render = function () {
        var o = this.state.status;
        if (o === Ar) return null;
        var l = this.props,
          i = l.children;
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
        var s = wp(l, [
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
        return u.createElement(
          Cp.Provider,
          { value: null },
          typeof i == "function"
            ? i(o, s)
            : u.cloneElement(u.Children.only(i), s),
        );
      }),
      t
    );
  })(u.Component);
zt.contextType = Cp;
zt.propTypes = {};
function Fn() {}
zt.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: Fn,
  onEntering: Fn,
  onEntered: Fn,
  onExit: Fn,
  onExiting: Fn,
  onExited: Fn,
};
zt.UNMOUNTED = Ar;
zt.EXITED = bt;
zt.ENTERING = ht;
zt.ENTERED = Gt;
zt.EXITING = vo;
const xr = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
var Us = !1,
  Vs = !1;
try {
  var Hi = {
    get passive() {
      return (Us = !0);
    },
    get once() {
      return (Vs = Us = !0);
    },
  };
  xr &&
    (window.addEventListener("test", Hi, Hi),
    window.removeEventListener("test", Hi, !0));
} catch {}
function Np(e, t, n, r) {
  if (r && typeof r != "boolean" && !Vs) {
    var o = r.once,
      l = r.capture,
      i = n;
    !Vs &&
      o &&
      ((i =
        n.__once ||
        function s(a) {
          this.removeEventListener(t, s, l), n.call(this, a);
        }),
      (n.__once = i)),
      e.addEventListener(t, i, Us ? r : l);
  }
  e.addEventListener(t, n, r);
}
function Hs(e, t, n, r) {
  var o = r && typeof r != "boolean" ? r.capture : r;
  e.removeEventListener(t, n, o),
    n.__once && e.removeEventListener(t, n.__once, o);
}
function Tt(e, t, n, r) {
  return (
    Np(e, t, n, r),
    function () {
      Hs(e, t, n, r);
    }
  );
}
function Eg(e, t, n, r) {
  if ((n === void 0 && (n = !1), r === void 0 && (r = !0), e)) {
    var o = document.createEvent("HTMLEvents");
    o.initEvent(t, n, r), e.dispatchEvent(o);
  }
}
function wg(e) {
  var t = jt(e, "transitionDuration") || "",
    n = t.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(t) * n;
}
function Sg(e, t, n) {
  n === void 0 && (n = 5);
  var r = !1,
    o = setTimeout(function () {
      r || Eg(e, "transitionend", !0);
    }, t + n),
    l = Tt(
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
function Op(e, t, n, r) {
  n == null && (n = wg(e) || 0);
  var o = Sg(e, n, r),
    l = Tt(e, "transitionend", t);
  return function () {
    o(), l();
  };
}
function zc(e, t) {
  const n = jt(e, t) || "",
    r = n.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(n) * r;
}
function _p(e, t) {
  const n = zc(e, "transitionDuration"),
    r = zc(e, "transitionDelay"),
    o = Op(
      e,
      (l) => {
        l.target === e && (o(), t(l));
      },
      n + r,
    );
}
function Lr(...e) {
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
function Rp(e) {
  e.offsetHeight;
}
var Bc = function (t) {
  return !t || typeof t == "function"
    ? t
    : function (n) {
        t.current = n;
      };
};
function kg(e, t) {
  var n = Bc(e),
    r = Bc(t);
  return function (o) {
    n && n(o), r && r(o);
  };
}
function Co(e, t) {
  return g.exports.useMemo(
    function () {
      return kg(e, t);
    },
    [e, t],
  );
}
function zl(e) {
  return e && "setState" in e ? wn.findDOMNode(e) : e != null ? e : null;
}
const Tp = u.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        onExited: l,
        addEndListener: i,
        children: s,
        childRef: a,
        ...c
      },
      f,
    ) => {
      const d = g.exports.useRef(null),
        v = Co(d, a),
        y = (N) => {
          v(zl(N));
        },
        x = (N) => (C) => {
          N && d.current && N(d.current, C);
        },
        w = g.exports.useCallback(x(e), [e]),
        k = g.exports.useCallback(x(t), [t]),
        m = g.exports.useCallback(x(n), [n]),
        p = g.exports.useCallback(x(r), [r]),
        h = g.exports.useCallback(x(o), [o]),
        S = g.exports.useCallback(x(l), [l]),
        E = g.exports.useCallback(x(i), [i]);
      return _.exports.jsx(zt, {
        ref: f,
        ...c,
        onEnter: w,
        onEntered: m,
        onEntering: k,
        onExit: p,
        onExited: S,
        onExiting: h,
        addEndListener: E,
        nodeRef: d,
        children:
          typeof s == "function"
            ? (N, C) => s(N, { ...C, ref: y })
            : u.cloneElement(s, { ref: y }),
      });
    },
  ),
  Cg = {
    height: ["marginTop", "marginBottom"],
    width: ["marginLeft", "marginRight"],
  };
function Pp(e, t) {
  const n = `offset${e[0].toUpperCase()}${e.slice(1)}`,
    r = t[n],
    o = Cg[e];
  return r + parseInt(jt(t, o[0]), 10) + parseInt(jt(t, o[1]), 10);
}
const Ng = {
    [bt]: "collapse",
    [vo]: "collapsing",
    [ht]: "collapsing",
    [Gt]: "collapse show",
  },
  Og = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
    getDimensionValue: Pp,
  },
  Xa = u.forwardRef(
    (
      {
        onEnter: e,
        onEntering: t,
        onEntered: n,
        onExit: r,
        onExiting: o,
        className: l,
        children: i,
        dimension: s = "height",
        getDimensionValue: a = Pp,
        ...c
      },
      f,
    ) => {
      const d = typeof s == "function" ? s() : s,
        v = g.exports.useMemo(
          () =>
            Lr((m) => {
              m.style[d] = "0";
            }, e),
          [d, e],
        ),
        y = g.exports.useMemo(
          () =>
            Lr((m) => {
              const p = `scroll${d[0].toUpperCase()}${d.slice(1)}`;
              m.style[d] = `${m[p]}px`;
            }, t),
          [d, t],
        ),
        x = g.exports.useMemo(
          () =>
            Lr((m) => {
              m.style[d] = null;
            }, n),
          [d, n],
        ),
        w = g.exports.useMemo(
          () =>
            Lr((m) => {
              (m.style[d] = `${a(d, m)}px`), Rp(m);
            }, r),
          [r, a, d],
        ),
        k = g.exports.useMemo(
          () =>
            Lr((m) => {
              m.style[d] = null;
            }, o),
          [d, o],
        );
      return _.exports.jsx(Tp, {
        ref: f,
        addEndListener: _p,
        ...c,
        "aria-expanded": c.role ? c.in : null,
        onEnter: v,
        onEntering: y,
        onEntered: x,
        onExit: w,
        onExiting: k,
        childRef: i.ref,
        children: (m, p) =>
          u.cloneElement(i, {
            ...p,
            className: I(
              l,
              i.props.className,
              Ng[m],
              d === "width" && "collapse-horizontal",
            ),
          }),
      });
    },
  );
Xa.defaultProps = Og;
function qo({
  title: e,
  children: t,
  defaultExpanded: n = !0,
  className: r = "",
}) {
  const [o, l] = g.exports.useState(n),
    [i, s] = g.exports.useState(!1);
  g.exports.useEffect(() => {
    const f = () => {
      s(window.innerWidth < 768);
    };
    return (
      f(),
      window.addEventListener("resize", f),
      () => window.removeEventListener("resize", f)
    );
  }, []);
  const a = i ? !0 : o,
    c = !i;
  return u.createElement(
    "div",
    { className: `collapsible-section ${r}` },
    u.createElement(
      "div",
      {
        className: `d-flex align-items-center py-2 mb-2 border-bottom section-header ${
          c ? "" : "pe-none"
        }`,
        onClick: c ? () => l(!o) : void 0,
        style: { cursor: c ? "pointer" : "default", userSelect: "none" },
      },
      c &&
        u.createElement(
          "span",
          {
            className: "me-2 section-toggle",
            style: {
              transform: o ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
              fontSize: "0.8em",
            },
          },
          "\u25B6",
        ),
      u.createElement("h2", { className: "m-0 h4", style: { flexGrow: 1 } }, e),
    ),
    u.createElement(Xa, { in: a }, u.createElement("div", null, t)),
  );
}
function Ws() {
  return (
    (Ws = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ws.apply(this, arguments)
  );
}
function Uc(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function _g(e) {
  var t = Rg(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function Rg(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function jp(e, t, n) {
  var r = g.exports.useRef(e !== void 0),
    o = g.exports.useState(t),
    l = o[0],
    i = o[1],
    s = e !== void 0,
    a = r.current;
  return (
    (r.current = s),
    !s && a && l !== t && i(t),
    [
      s ? e : l,
      g.exports.useCallback(
        function (c) {
          for (
            var f = arguments.length, d = new Array(f > 1 ? f - 1 : 0), v = 1;
            v < f;
            v++
          )
            d[v - 1] = arguments[v];
          n && n.apply(void 0, [c].concat(d)), i(c);
        },
        [n],
      ),
    ]
  );
}
function Lp(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      l = n,
      i = l[Uc(r)],
      s = l[r],
      a = wp(l, [Uc(r), r].map(_g)),
      c = t[r],
      f = jp(s, i, e[c]),
      d = f[0],
      v = f[1];
    return Ws({}, a, ((o = {}), (o[r] = d), (o[c] = v), o));
  }, e);
}
function $p(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
const No = g.exports.createContext({});
No.displayName = "AccordionContext";
const qa = g.exports.forwardRef(
  (
    {
      as: e = "div",
      bsPrefix: t,
      className: n,
      children: r,
      eventKey: o,
      ...l
    },
    i,
  ) => {
    const { activeEventKey: s } = g.exports.useContext(No);
    return (
      (t = H(t, "accordion-collapse")),
      _.exports.jsx(Xa, {
        ref: i,
        in: $p(s, o),
        ...l,
        className: I(n, t),
        children: _.exports.jsx(e, { children: g.exports.Children.only(r) }),
      })
    );
  },
);
qa.displayName = "AccordionCollapse";
const ui = g.exports.createContext({ eventKey: "" });
ui.displayName = "AccordionItemContext";
const Dp = g.exports.forwardRef(
  (
    {
      as: e = "div",
      bsPrefix: t,
      className: n,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: i,
      onExiting: s,
      onExited: a,
      ...c
    },
    f,
  ) => {
    t = H(t, "accordion-body");
    const { eventKey: d } = g.exports.useContext(ui);
    return _.exports.jsx(qa, {
      eventKey: d,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: i,
      onExiting: s,
      onExited: a,
      children: _.exports.jsx(e, { ref: f, ...c, className: I(n, t) }),
    });
  },
);
Dp.displayName = "AccordionBody";
function Tg(e, t) {
  const {
    activeEventKey: n,
    onSelect: r,
    alwaysOpen: o,
  } = g.exports.useContext(No);
  return (l) => {
    let i = e === n ? null : e;
    o &&
      (Array.isArray(n)
        ? n.includes(e)
          ? (i = n.filter((s) => s !== e))
          : (i = [...n, e])
        : (i = [e])),
      r == null || r(i, l),
      t == null || t(l);
  };
}
const Za = g.exports.forwardRef(
  ({ as: e = "button", bsPrefix: t, className: n, onClick: r, ...o }, l) => {
    t = H(t, "accordion-button");
    const { eventKey: i } = g.exports.useContext(ui),
      s = Tg(i, r),
      { activeEventKey: a } = g.exports.useContext(No);
    return (
      e === "button" && (o.type = "button"),
      _.exports.jsx(e, {
        ref: l,
        onClick: s,
        ...o,
        "aria-expanded": i === a,
        className: I(n, t, !$p(a, i) && "collapsed"),
      })
    );
  },
);
Za.displayName = "AccordionButton";
const Mp = g.exports.forwardRef(
  (
    { as: e = "h2", bsPrefix: t, className: n, children: r, onClick: o, ...l },
    i,
  ) => (
    (t = H(t, "accordion-header")),
    _.exports.jsx(e, {
      ref: i,
      ...l,
      className: I(n, t),
      children: _.exports.jsx(Za, { onClick: o, children: r }),
    })
  ),
);
Mp.displayName = "AccordionHeader";
const Fp = g.exports.forwardRef(
  ({ as: e = "div", bsPrefix: t, className: n, eventKey: r, ...o }, l) => {
    t = H(t, "accordion-item");
    const i = g.exports.useMemo(() => ({ eventKey: r }), [r]);
    return _.exports.jsx(ui.Provider, {
      value: i,
      children: _.exports.jsx(e, { ref: l, ...o, className: I(n, t) }),
    });
  },
);
Fp.displayName = "AccordionItem";
const Ip = g.exports.forwardRef((e, t) => {
  const {
      as: n = "div",
      activeKey: r,
      bsPrefix: o,
      className: l,
      onSelect: i,
      flush: s,
      alwaysOpen: a,
      ...c
    } = Lp(e, { activeKey: "onSelect" }),
    f = H(o, "accordion"),
    d = g.exports.useMemo(
      () => ({ activeEventKey: r, onSelect: i, alwaysOpen: a }),
      [r, i, a],
    );
  return _.exports.jsx(No.Provider, {
    value: d,
    children: _.exports.jsx(n, {
      ref: t,
      ...c,
      className: I(l, f, s && `${f}-flush`),
    }),
  });
});
Ip.displayName = "Accordion";
const Xe = Object.assign(Ip, {
    Button: Za,
    Collapse: qa,
    Item: Fp,
    Header: Mp,
    Body: Dp,
  }),
  Pg = { vertical: !1, role: "group" },
  Ja = g.exports.forwardRef(
    (
      { bsPrefix: e, size: t, vertical: n, className: r, as: o = "div", ...l },
      i,
    ) => {
      const s = H(e, "btn-group");
      let a = s;
      return (
        n && (a = `${s}-vertical`),
        _.exports.jsx(o, { ...l, ref: i, className: I(r, a, t && `${s}-${t}`) })
      );
    },
  );
Ja.displayName = "ButtonGroup";
Ja.defaultProps = Pg;
const Bl = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        striped: n,
        bordered: r,
        borderless: o,
        hover: l,
        size: i,
        variant: s,
        responsive: a,
        ...c
      },
      f,
    ) => {
      const d = H(e, "table"),
        v = I(
          t,
          d,
          s && `${d}-${s}`,
          i && `${d}-${i}`,
          n && `${d}-${typeof n == "string" ? `striped-${n}` : "striped"}`,
          r && `${d}-bordered`,
          o && `${d}-borderless`,
          l && `${d}-hover`,
        ),
        y = _.exports.jsx("table", { ...c, className: v, ref: f });
      if (a) {
        let x = `${d}-responsive`;
        return (
          typeof a == "string" && (x = `${x}-${a}`),
          _.exports.jsx("div", { className: x, children: y })
        );
      }
      return y;
    },
  ),
  jg = ["as", "disabled"];
function Lg(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function $g(e) {
  return !e || e.trim() === "#";
}
function eu({
  tagName: e,
  disabled: t,
  href: n,
  target: r,
  rel: o,
  role: l,
  onClick: i,
  tabIndex: s = 0,
  type: a,
}) {
  e || (n != null || r != null || o != null ? (e = "a") : (e = "button"));
  const c = { tagName: e };
  if (e === "button") return [{ type: a || "button", disabled: t }, c];
  const f = (v) => {
      if (((t || (e === "a" && $g(n))) && v.preventDefault(), t)) {
        v.stopPropagation();
        return;
      }
      i == null || i(v);
    },
    d = (v) => {
      v.key === " " && (v.preventDefault(), f(v));
    };
  return (
    e === "a" && (n || (n = "#"), t && (n = void 0)),
    [
      {
        role: l != null ? l : "button",
        disabled: void 0,
        tabIndex: t ? void 0 : s,
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
const Dg = g.exports.forwardRef((e, t) => {
  let { as: n, disabled: r } = e,
    o = Lg(e, jg);
  const [l, { tagName: i }] = eu(Object.assign({ tagName: n, disabled: r }, o));
  return _.exports.jsx(i, Object.assign({}, o, l, { ref: t }));
});
Dg.displayName = "Button";
const Mg = { variant: "primary", active: !1, disabled: !1 },
  be = g.exports.forwardRef(
    (
      {
        as: e,
        bsPrefix: t,
        variant: n,
        size: r,
        active: o,
        className: l,
        ...i
      },
      s,
    ) => {
      const a = H(t, "btn"),
        [c, { tagName: f }] = eu({ tagName: e, ...i }),
        d = f;
      return _.exports.jsx(d, {
        ...c,
        ...i,
        ref: s,
        className: I(
          l,
          a,
          o && "active",
          n && `${a}-${n}`,
          r && `${a}-${r}`,
          i.href && i.disabled && "disabled",
        ),
      });
    },
  );
be.displayName = "Button";
be.defaultProps = Mg;
const Fg = window.location.origin;
function Ig(e, t = {}) {
  const n = new URL(e, Fg);
  return Object.keys(t).forEach((r) => n.searchParams.append(r, t[r])), n;
}
async function $n(e, t = {}) {
  const { params: n, ...r } = t,
    o = Ig(e, n),
    l = await fetch(o, r);
  if (!l.ok) throw new Error(`API error: ${l.status} ${l.statusText}`);
  return l.json();
}
function Ap(e, t = !1) {
  return $n("api/cancel", {
    method: "POST",
    params: { rid: e, force: t },
  }).catch((n) => {
    throw (console.error("Cancel RID error:", n.message), n);
  });
}
function Ag(e, t, n, r = {}, o = "main") {
  const l = {
    log_level: 30,
    file: e,
    class_name: t,
    arguments: r,
    repo_rev: n,
  };
  return $n("api/schedule", {
    method: "POST",
    params: { pipeline: o },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(l),
  });
}
function zg() {
  return $n("api/schedule");
}
function Bg() {
  return $n("api/explist");
}
function Ug() {
  return $n("api/datasets/names");
}
function Vc(e) {
  const t = Array.isArray(e) ? e.join(",") : e;
  return $n("api/datasets/values", { params: { names: t } });
}
function Vg() {
  return $n("api/health");
}
function Hg(e) {
  const [t, n] = u.useState(!1),
    r = () => {
      n(!0),
        Ap(e.rid)
          .then(() => {
            console.log(`RID ${e.rid} termination requested`), n(!1);
          })
          .catch((o) => {
            console.error(`Error cancelling RID ${e.rid}:`, o.message), n(!1);
          });
    };
  return u.createElement(
    be,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    "Request Termination",
  );
}
function Wg(e) {
  const [t, n] = u.useState(!1),
    r = () => {
      n(!0),
        Ap(e.rid, !0)
          .then(() => {
            console.log(`RID ${e.rid} force cancelled`), n(!1);
          })
          .catch((o) => {
            console.error(`Error force cancelling RID ${e.rid}:`, o.message),
              n(!1);
          });
    };
  return u.createElement(
    be,
    { variant: "danger", disabled: t, onClick: t ? null : r },
    "Force cancellation",
  );
}
function bg(e) {
  const t = e.rid,
    n = e.data.expid.class_name,
    r = e.data.expid.file,
    o = e.data.pipeline,
    l = e.data.status,
    i = e.data.expid.repo_rev,
    s = e.data.expid.arguments,
    a = (c, f) =>
      u.createElement(
        "tr",
        { key: c },
        u.createElement("td", null, u.createElement("b", null, c, ":")),
        u.createElement("td", null, f),
      );
  return u.createElement(
    Xe.Item,
    { eventKey: t },
    u.createElement(
      Xe.Header,
      null,
      u.createElement("b", null, "(", t, ")"),
      " \u2002 ",
      n,
      " \u2002 ",
      u.createElement("em", null, l),
    ),
    u.createElement(
      Xe.Body,
      null,
      u.createElement(
        Bl,
        { striped: !0, bordered: !0, hover: !0 },
        u.createElement(
          "tbody",
          null,
          a("RID", t),
          a("Class name", n),
          a("File", r),
          a("Repo rev", i),
          a("Pipeline", o),
          a("Status", u.createElement("em", null, l)),
        ),
      ),
      u.createElement(
        Xe,
        null,
        u.createElement(
          Xe.Item,
          { eventKey: "args" },
          u.createElement(
            Xe.Header,
            null,
            "Arguments \u2002 ",
            u.createElement("em", null, "(click to expand)"),
          ),
          u.createElement(
            Xe.Body,
            null,
            u.createElement(
              Bl,
              { striped: !0, bordered: !0, hover: !0 },
              u.createElement(
                "tbody",
                null,
                Object.keys(s).map((c) => a(c, String(s[c]))),
              ),
            ),
          ),
        ),
      ),
      u.createElement(
        Ja,
        { className: "mt-3" },
        u.createElement(Hg, { rid: t }),
        u.createElement(Wg, { rid: t }),
      ),
    ),
  );
}
const Kg = 1e3;
function Qg() {
  const [e, t] = u.useState({});
  return (
    u.useEffect(() => {
      const n = () => {
        zg()
          .then(t)
          .catch((o) => console.error("Schedule update error:", o.message));
      };
      n();
      const r = setInterval(n, Kg);
      return () => {
        clearInterval(r);
      };
    }, []),
    u.createElement(
      Xe,
      { defaultActiveKey: "0" },
      Object.keys(e).map((n) =>
        u.createElement(bg, { key: n, rid: n, data: e[n] }),
      ),
    )
  );
}
const Gg = {
    type: G.exports.string,
    tooltip: G.exports.bool,
    as: G.exports.elementType,
  },
  ci = g.exports.forwardRef(
    (
      { as: e = "div", className: t, type: n = "valid", tooltip: r = !1, ...o },
      l,
    ) =>
      _.exports.jsx(e, {
        ...o,
        ref: l,
        className: I(t, `${n}-${r ? "tooltip" : "feedback"}`),
      }),
  );
ci.displayName = "Feedback";
ci.propTypes = Gg;
const Ft = g.exports.createContext({}),
  Oo = g.exports.forwardRef(
    (
      {
        id: e,
        bsPrefix: t,
        className: n,
        type: r = "checkbox",
        isValid: o = !1,
        isInvalid: l = !1,
        as: i = "input",
        ...s
      },
      a,
    ) => {
      const { controlId: c } = g.exports.useContext(Ft);
      return (
        (t = H(t, "form-check-input")),
        _.exports.jsx(i, {
          ...s,
          ref: a,
          type: r,
          id: e || c,
          className: I(n, t, o && "is-valid", l && "is-invalid"),
        })
      );
    },
  );
Oo.displayName = "FormCheckInput";
const Ul = g.exports.forwardRef(
  ({ bsPrefix: e, className: t, htmlFor: n, ...r }, o) => {
    const { controlId: l } = g.exports.useContext(Ft);
    return (
      (e = H(e, "form-check-label")),
      _.exports.jsx("label", {
        ...r,
        ref: o,
        htmlFor: n || l,
        className: I(t, e),
      })
    );
  },
);
Ul.displayName = "FormCheckLabel";
function Yg(e, t) {
  return g.exports.Children.toArray(e).some(
    (n) => g.exports.isValidElement(n) && n.type === t,
  );
}
const zp = g.exports.forwardRef(
  (
    {
      id: e,
      bsPrefix: t,
      bsSwitchPrefix: n,
      inline: r = !1,
      reverse: o = !1,
      disabled: l = !1,
      isValid: i = !1,
      isInvalid: s = !1,
      feedbackTooltip: a = !1,
      feedback: c,
      feedbackType: f,
      className: d,
      style: v,
      title: y = "",
      type: x = "checkbox",
      label: w,
      children: k,
      as: m = "input",
      ...p
    },
    h,
  ) => {
    (t = H(t, "form-check")), (n = H(n, "form-switch"));
    const { controlId: S } = g.exports.useContext(Ft),
      E = g.exports.useMemo(() => ({ controlId: e || S }), [S, e]),
      N = (!k && w != null && w !== !1) || Yg(k, Ul),
      C = _.exports.jsx(Oo, {
        ...p,
        type: x === "switch" ? "checkbox" : x,
        ref: h,
        isValid: i,
        isInvalid: s,
        disabled: l,
        as: m,
      });
    return _.exports.jsx(Ft.Provider, {
      value: E,
      children: _.exports.jsx("div", {
        style: v,
        className: I(
          d,
          N && t,
          r && `${t}-inline`,
          o && `${t}-reverse`,
          x === "switch" && n,
        ),
        children:
          k ||
          _.exports.jsxs(_.exports.Fragment, {
            children: [
              C,
              N && _.exports.jsx(Ul, { title: y, children: w }),
              c && _.exports.jsx(ci, { type: f, tooltip: a, children: c }),
            ],
          }),
      }),
    });
  },
);
zp.displayName = "FormCheck";
const Vl = Object.assign(zp, { Input: Oo, Label: Ul }),
  Bp = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        type: t,
        size: n,
        htmlSize: r,
        id: o,
        className: l,
        isValid: i = !1,
        isInvalid: s = !1,
        plaintext: a,
        readOnly: c,
        as: f = "input",
        ...d
      },
      v,
    ) => {
      const { controlId: y } = g.exports.useContext(Ft);
      e = H(e, "form-control");
      let x;
      return (
        a
          ? (x = { [`${e}-plaintext`]: !0 })
          : (x = { [e]: !0, [`${e}-${n}`]: n }),
        _.exports.jsx(f, {
          ...d,
          type: t,
          size: r,
          ref: v,
          readOnly: c,
          id: o || y,
          className: I(
            l,
            x,
            i && "is-valid",
            s && "is-invalid",
            t === "color" && `${e}-color`,
          ),
        })
      );
    },
  );
Bp.displayName = "FormControl";
const Xg = Object.assign(Bp, { Feedback: ci });
var qg = /-(.)/g;
function Zg(e) {
  return e.replace(qg, function (t, n) {
    return n.toUpperCase();
  });
}
const Jg = (e) => e[0].toUpperCase() + Zg(e).slice(1);
function ke(e, { displayName: t = Jg(e), Component: n, defaultProps: r } = {}) {
  const o = g.exports.forwardRef(
    ({ className: l, bsPrefix: i, as: s = n || "div", ...a }, c) => {
      const f = H(i, e);
      return _.exports.jsx(s, { ref: c, className: I(l, f), ...a });
    },
  );
  return (o.defaultProps = r), (o.displayName = t), o;
}
const ey = ke("form-floating"),
  tu = g.exports.forwardRef(({ controlId: e, as: t = "div", ...n }, r) => {
    const o = g.exports.useMemo(() => ({ controlId: e }), [e]);
    return _.exports.jsx(Ft.Provider, {
      value: o,
      children: _.exports.jsx(t, { ...n, ref: r }),
    });
  });
tu.displayName = "FormGroup";
const ty = { column: !1, visuallyHidden: !1 },
  nu = g.exports.forwardRef(
    (
      {
        as: e = "label",
        bsPrefix: t,
        column: n,
        visuallyHidden: r,
        className: o,
        htmlFor: l,
        ...i
      },
      s,
    ) => {
      const { controlId: a } = g.exports.useContext(Ft);
      t = H(t, "form-label");
      let c = "col-form-label";
      typeof n == "string" && (c = `${c} ${c}-${n}`);
      const f = I(o, t, r && "visually-hidden", n && c);
      return (
        (l = l || a),
        n
          ? _.exports.jsx(He, {
              ref: s,
              as: "label",
              className: f,
              htmlFor: l,
              ...i,
            })
          : _.exports.jsx(e, { ref: s, className: f, htmlFor: l, ...i })
      );
    },
  );
nu.displayName = "FormLabel";
nu.defaultProps = ty;
const Up = g.exports.forwardRef(
  ({ bsPrefix: e, className: t, id: n, ...r }, o) => {
    const { controlId: l } = g.exports.useContext(Ft);
    return (
      (e = H(e, "form-range")),
      _.exports.jsx("input", {
        ...r,
        type: "range",
        ref: o,
        className: I(t, e),
        id: n || l,
      })
    );
  },
);
Up.displayName = "FormRange";
const Vp = g.exports.forwardRef(
  (
    {
      bsPrefix: e,
      size: t,
      htmlSize: n,
      className: r,
      isValid: o = !1,
      isInvalid: l = !1,
      id: i,
      ...s
    },
    a,
  ) => {
    const { controlId: c } = g.exports.useContext(Ft);
    return (
      (e = H(e, "form-select")),
      _.exports.jsx("select", {
        ...s,
        size: n,
        ref: a,
        className: I(
          r,
          e,
          t && `${e}-${t}`,
          o && "is-valid",
          l && "is-invalid",
        ),
        id: i || c,
      })
    );
  },
);
Vp.displayName = "FormSelect";
const Hp = g.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "small", muted: r, ...o }, l) => (
    (e = H(e, "form-text")),
    _.exports.jsx(n, { ...o, ref: l, className: I(t, e, r && "text-muted") })
  ),
);
Hp.displayName = "FormText";
const Wp = g.exports.forwardRef((e, t) =>
  _.exports.jsx(Vl, { ...e, ref: t, type: "switch" }),
);
Wp.displayName = "Switch";
const ny = Object.assign(Wp, { Input: Vl.Input, Label: Vl.Label }),
  bp = g.exports.forwardRef(
    (
      { bsPrefix: e, className: t, children: n, controlId: r, label: o, ...l },
      i,
    ) => (
      (e = H(e, "form-floating")),
      _.exports.jsxs(tu, {
        ref: i,
        className: I(t, e),
        controlId: r,
        ...l,
        children: [n, _.exports.jsx("label", { htmlFor: r, children: o })],
      })
    ),
  );
bp.displayName = "FloatingLabel";
const ry = {
    _ref: G.exports.any,
    validated: G.exports.bool,
    as: G.exports.elementType,
  },
  ru = g.exports.forwardRef(
    ({ className: e, validated: t, as: n = "form", ...r }, o) =>
      _.exports.jsx(n, { ...r, ref: o, className: I(e, t && "was-validated") }),
  );
ru.displayName = "Form";
ru.propTypes = ry;
const B = Object.assign(ru, {
    Group: tu,
    Control: Xg,
    Floating: ey,
    Check: Vl,
    Switch: ny,
    Label: nu,
    Text: Hp,
    Range: Up,
    Select: Vp,
    FloatingLabel: bp,
  }),
  Kp = g.exports.createContext(null);
Kp.displayName = "InputGroupContext";
const ou = ke("input-group-text", { Component: "span" }),
  oy = (e) =>
    _.exports.jsx(ou, {
      children: _.exports.jsx(Oo, { type: "checkbox", ...e }),
    }),
  ly = (e) =>
    _.exports.jsx(ou, { children: _.exports.jsx(Oo, { type: "radio", ...e }) }),
  Qp = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        size: t,
        hasValidation: n,
        className: r,
        as: o = "div",
        ...l
      },
      i,
    ) => {
      e = H(e, "input-group");
      const s = g.exports.useMemo(() => ({}), []);
      return _.exports.jsx(Kp.Provider, {
        value: s,
        children: _.exports.jsx(o, {
          ref: i,
          ...l,
          className: I(r, e, t && `${e}-${t}`, n && "has-validation"),
        }),
      });
    },
  );
Qp.displayName = "InputGroup";
const ne = Object.assign(Qp, { Text: ou, Radio: ly, Checkbox: oy }),
  fi = (e) =>
    g.exports.forwardRef((t, n) =>
      _.exports.jsx("div", { ...t, ref: n, className: I(t.className, e) }),
    ),
  Gp = g.exports.forwardRef(
    ({ bsPrefix: e, className: t, variant: n, as: r = "img", ...o }, l) => {
      const i = H(e, "card-img");
      return _.exports.jsx(r, {
        ref: l,
        className: I(n ? `${i}-${n}` : i, t),
        ...o,
      });
    },
  );
Gp.displayName = "CardImg";
const Yp = g.exports.createContext(null);
Yp.displayName = "CardHeaderContext";
const Xp = g.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = H(e, "card-header"),
      i = g.exports.useMemo(() => ({ cardHeaderBsPrefix: l }), [l]);
    return _.exports.jsx(Yp.Provider, {
      value: i,
      children: _.exports.jsx(n, { ref: o, ...r, className: I(t, l) }),
    });
  },
);
Xp.displayName = "CardHeader";
const iy = fi("h5"),
  sy = fi("h6"),
  qp = ke("card-body"),
  ay = ke("card-title", { Component: iy }),
  uy = ke("card-subtitle", { Component: sy }),
  cy = ke("card-link", { Component: "a" }),
  fy = ke("card-text", { Component: "p" }),
  dy = ke("card-footer"),
  py = ke("card-img-overlay"),
  my = { body: !1 },
  lu = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        bg: n,
        text: r,
        border: o,
        body: l,
        children: i,
        as: s = "div",
        ...a
      },
      c,
    ) => {
      const f = H(e, "card");
      return _.exports.jsx(s, {
        ref: c,
        ...a,
        className: I(
          t,
          f,
          n && `bg-${n}`,
          r && `text-${r}`,
          o && `border-${o}`,
        ),
        children: l ? _.exports.jsx(qp, { children: i }) : i,
      });
    },
  );
lu.displayName = "Card";
lu.defaultProps = my;
const ye = Object.assign(lu, {
  Img: Gp,
  Title: ay,
  Subtitle: uy,
  Body: qp,
  Link: cy,
  Text: fy,
  Header: Xp,
  Footer: dy,
  ImgOverlay: py,
});
function iu() {
  var e = g.exports.useRef(!0),
    t = g.exports.useRef(function () {
      return e.current;
    });
  return (
    g.exports.useEffect(function () {
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
function vy(e) {
  var t = g.exports.useRef(e);
  return (t.current = e), t;
}
function su(e) {
  var t = vy(e);
  g.exports.useEffect(function () {
    return function () {
      return t.current();
    };
  }, []);
}
var bs = Math.pow(2, 31) - 1;
function Zp(e, t, n) {
  var r = n - Date.now();
  e.current =
    r <= bs
      ? setTimeout(t, r)
      : setTimeout(function () {
          return Zp(e, t, n);
        }, bs);
}
function Jp() {
  var e = iu(),
    t = g.exports.useRef();
  return (
    su(function () {
      return clearTimeout(t.current);
    }),
    g.exports.useMemo(function () {
      var n = function () {
        return clearTimeout(t.current);
      };
      function r(o, l) {
        l === void 0 && (l = 0),
          e() &&
            (n(),
            l <= bs
              ? (t.current = setTimeout(o, l))
              : Zp(t, o, Date.now() + l));
      }
      return { set: r, clear: n };
    }, [])
  );
}
const hy = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
  },
  gy = { [ht]: "show", [Gt]: "show" },
  Bt = g.exports.forwardRef(
    ({ className: e, children: t, transitionClasses: n = {}, ...r }, o) => {
      const l = g.exports.useCallback(
        (i, s) => {
          Rp(i), r.onEnter == null || r.onEnter(i, s);
        },
        [r],
      );
      return _.exports.jsx(Tp, {
        ref: o,
        addEndListener: _p,
        ...r,
        onEnter: l,
        childRef: t.ref,
        children: (i, s) =>
          g.exports.cloneElement(t, {
            ...s,
            className: I("fade", e, t.props.className, gy[i], n[i]),
          }),
      });
    },
  );
Bt.defaultProps = hy;
Bt.displayName = "Fade";
const yy = { [ht]: "showing", [vo]: "showing show" },
  em = g.exports.forwardRef((e, t) =>
    _.exports.jsx(Bt, { ...e, ref: t, transitionClasses: yy }),
  );
em.displayName = "ToastFade";
function xy(e) {
  var t = g.exports.useRef(e);
  return (
    g.exports.useEffect(
      function () {
        t.current = e;
      },
      [e],
    ),
    t
  );
}
function je(e) {
  var t = xy(e);
  return g.exports.useCallback(
    function () {
      return t.current && t.current.apply(t, arguments);
    },
    [t],
  );
}
const Ey = {
    "aria-label": G.exports.string,
    onClick: G.exports.func,
    variant: G.exports.oneOf(["white"]),
  },
  wy = { "aria-label": "Close" },
  Er = g.exports.forwardRef(({ className: e, variant: t, ...n }, r) =>
    _.exports.jsx("button", {
      ref: r,
      type: "button",
      className: I("btn-close", t && `btn-close-${t}`, e),
      ...n,
    }),
  );
Er.displayName = "CloseButton";
Er.propTypes = Ey;
Er.defaultProps = wy;
const tm = g.exports.createContext({ onClose() {} }),
  Sy = { closeLabel: "Close", closeButton: !0 },
  au = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        closeLabel: t,
        closeVariant: n,
        closeButton: r,
        className: o,
        children: l,
        ...i
      },
      s,
    ) => {
      e = H(e, "toast-header");
      const a = g.exports.useContext(tm),
        c = je((f) => {
          a == null || a.onClose == null || a.onClose(f);
        });
      return _.exports.jsxs("div", {
        ref: s,
        ...i,
        className: I(e, o),
        children: [
          l,
          r &&
            _.exports.jsx(Er, {
              "aria-label": t,
              variant: n,
              onClick: c,
              "data-dismiss": "toast",
            }),
        ],
      });
    },
  );
au.displayName = "ToastHeader";
au.defaultProps = Sy;
const ky = ke("toast-body"),
  nm = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        transition: n = em,
        show: r = !0,
        animation: o = !0,
        delay: l = 5e3,
        autohide: i = !1,
        onClose: s,
        bg: a,
        ...c
      },
      f,
    ) => {
      e = H(e, "toast");
      const d = g.exports.useRef(l),
        v = g.exports.useRef(s);
      g.exports.useEffect(() => {
        (d.current = l), (v.current = s);
      }, [l, s]);
      const y = Jp(),
        x = !!(i && r),
        w = g.exports.useCallback(() => {
          x && (v.current == null || v.current());
        }, [x]);
      g.exports.useEffect(() => {
        y.set(w, d.current);
      }, [y, w]);
      const k = g.exports.useMemo(() => ({ onClose: s }), [s]),
        m = !!(n && o),
        p = _.exports.jsx("div", {
          ...c,
          ref: f,
          className: I(e, t, a && `bg-${a}`, !m && (r ? "show" : "hide")),
          role: "alert",
          "aria-live": "assertive",
          "aria-atomic": "true",
        });
      return _.exports.jsx(tm.Provider, {
        value: k,
        children:
          m && n
            ? _.exports.jsx(n, { in: r, unmountOnExit: !0, children: p })
            : p,
      });
    },
  );
nm.displayName = "Toast";
const rr = Object.assign(nm, { Body: ky, Header: au }),
  Cy = {
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
  uu = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        position: t,
        containerPosition: n = "absolute",
        className: r,
        as: o = "div",
        ...l
      },
      i,
    ) => (
      (e = H(e, "toast-container")),
      _.exports.jsx(o, {
        ref: i,
        ...l,
        className: I(e, t && [n ? `position-${n}` : null, Cy[t]], r),
      })
    ),
  );
uu.displayName = "ToastContainer";
function rm(e) {
  const [t, n] = u.useState(!1),
    r = () => {
      n(!0),
        Ag(
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
  return u.createElement(
    be,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    t ? "Submitting..." : "Submit",
  );
}
function om(e) {
  return e && Object.keys(e).includes("ndscan_params");
}
const Ny = om;
function Oy(e) {
  if (!om(e)) return null;
  try {
    const t = e.ndscan_params,
      [n] = t,
      r = n.default;
    return JSON.parse(r);
  } catch (t) {
    return console.error("Error parsing ndscan_params:", t), null;
  }
}
function _y(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) for (const o of r) t[o] || (t[o] = n);
  return t;
}
function Ry(e) {
  return !e || !e.axes
    ? new Set()
    : new Set(e.axes.map((t) => t.fqn).filter(Boolean));
}
function cu(e, t) {
  return `ndscan_${e}_${t}`;
}
function Ty(e, t) {
  try {
    const n = cu(e, t),
      r = localStorage.getItem(n);
    if (r) return JSON.parse(r);
  } catch (n) {
    console.error("Error loading ndscan state from localStorage:", n);
  }
  return null;
}
function Py(e, t, n) {
  try {
    const r = cu(e, t);
    localStorage.setItem(r, JSON.stringify(n));
  } catch (r) {
    console.error("Error saving ndscan state to localStorage:", r);
  }
}
function jy(e, t, n, r, o) {
  if (!e) return null;
  const l = {};
  for (const [s, a] of Object.entries(t)) {
    if (o && !o.has(s)) continue;
    const c = r[s] || "";
    l[s] = [{ path: c, value: a }];
  }
  const i = {
    instances: e.instances,
    schemata: e.schemata,
    always_shown: e.always_shown,
    overrides: l,
    scan: n,
  };
  return { ndscan_params: JSON.stringify(i) };
}
function yt(e, t) {
  return e == null ? "" : t ? e / t : e;
}
function Hl(e, t) {
  if (e === "" || e === "-") return e;
  const n = parseFloat(e);
  return isNaN(n) ? e : t ? n * t : n;
}
function ho(e, t) {
  if (e.contains) return e.contains(t);
  if (e.compareDocumentPosition)
    return e === t || !!(e.compareDocumentPosition(t) & 16);
}
function Wl() {
  return g.exports.useState(null);
}
var Hc = Object.prototype.hasOwnProperty;
function Wc(e, t, n) {
  for (n of e.keys()) if (Gr(n, t)) return n;
}
function Gr(e, t) {
  var n, r, o;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length) for (; r-- && Gr(e[r], t[r]); );
      return r === -1;
    }
    if (n === Set) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r),
          (o && typeof o == "object" && ((o = Wc(t, o)), !o)) || !t.has(o))
        )
          return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r[0]),
          (o && typeof o == "object" && ((o = Wc(t, o)), !o)) ||
            !Gr(r[1], t.get(o)))
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
          (Hc.call(e, n) && ++r && !Hc.call(t, n)) ||
          !(n in t) ||
          !Gr(e[n], t[n])
        )
          return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
function Ly(e) {
  var t = iu();
  return [
    e[0],
    g.exports.useCallback(
      function (n) {
        if (!!t()) return e[1](n);
      },
      [t, e[1]],
    ),
  ];
}
var Be = "top",
  rt = "bottom",
  ot = "right",
  Ue = "left",
  fu = "auto",
  _o = [Be, rt, ot, Ue],
  fr = "start",
  go = "end",
  $y = "clippingParents",
  lm = "viewport",
  $r = "popper",
  Dy = "reference",
  bc = _o.reduce(function (e, t) {
    return e.concat([t + "-" + fr, t + "-" + go]);
  }, []),
  im = [].concat(_o, [fu]).reduce(function (e, t) {
    return e.concat([t, t + "-" + fr, t + "-" + go]);
  }, []),
  My = "beforeRead",
  Fy = "read",
  Iy = "afterRead",
  Ay = "beforeMain",
  zy = "main",
  By = "afterMain",
  Uy = "beforeWrite",
  Vy = "write",
  Hy = "afterWrite",
  Wy = [My, Fy, Iy, Ay, zy, By, Uy, Vy, Hy];
function wt(e) {
  return e.split("-")[0];
}
function lt(e) {
  if (e == null) return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function Pn(e) {
  var t = lt(e).Element;
  return e instanceof t || e instanceof Element;
}
function St(e) {
  var t = lt(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function du(e) {
  if (typeof ShadowRoot > "u") return !1;
  var t = lt(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var Cn = Math.max,
  bl = Math.min,
  dr = Math.round;
function Ks() {
  var e = navigator.userAgentData;
  return e != null && e.brands
    ? e.brands
        .map(function (t) {
          return t.brand + "/" + t.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function sm() {
  return !/^((?!chrome|android).)*safari/i.test(Ks());
}
function pr(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  var r = e.getBoundingClientRect(),
    o = 1,
    l = 1;
  t &&
    St(e) &&
    ((o = (e.offsetWidth > 0 && dr(r.width) / e.offsetWidth) || 1),
    (l = (e.offsetHeight > 0 && dr(r.height) / e.offsetHeight) || 1));
  var i = Pn(e) ? lt(e) : window,
    s = i.visualViewport,
    a = !sm() && n,
    c = (r.left + (a && s ? s.offsetLeft : 0)) / o,
    f = (r.top + (a && s ? s.offsetTop : 0)) / l,
    d = r.width / o,
    v = r.height / l;
  return {
    width: d,
    height: v,
    top: f,
    right: c + d,
    bottom: f + v,
    left: c,
    x: c,
    y: f,
  };
}
function pu(e) {
  var t = pr(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function am(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && du(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function un(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function It(e) {
  return lt(e).getComputedStyle(e);
}
function by(e) {
  return ["table", "td", "th"].indexOf(un(e)) >= 0;
}
function pn(e) {
  return ((Pn(e) ? e.ownerDocument : e.document) || window.document)
    .documentElement;
}
function di(e) {
  return un(e) === "html"
    ? e
    : e.assignedSlot || e.parentNode || (du(e) ? e.host : null) || pn(e);
}
function Kc(e) {
  return !St(e) || It(e).position === "fixed" ? null : e.offsetParent;
}
function Ky(e) {
  var t = /firefox/i.test(Ks()),
    n = /Trident/i.test(Ks());
  if (n && St(e)) {
    var r = It(e);
    if (r.position === "fixed") return null;
  }
  var o = di(e);
  for (du(o) && (o = o.host); St(o) && ["html", "body"].indexOf(un(o)) < 0; ) {
    var l = It(o);
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
function Ro(e) {
  for (var t = lt(e), n = Kc(e); n && by(n) && It(n).position === "static"; )
    n = Kc(n);
  return n &&
    (un(n) === "html" || (un(n) === "body" && It(n).position === "static"))
    ? t
    : n || Ky(e) || t;
}
function mu(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function Yr(e, t, n) {
  return Cn(e, bl(t, n));
}
function Qy(e, t, n) {
  var r = Yr(e, t, n);
  return r > n ? n : r;
}
function um() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function cm(e) {
  return Object.assign({}, um(), e);
}
function fm(e, t) {
  return t.reduce(function (n, r) {
    return (n[r] = e), n;
  }, {});
}
var Gy = function (t, n) {
  return (
    (t =
      typeof t == "function"
        ? t(Object.assign({}, n.rects, { placement: n.placement }))
        : t),
    cm(typeof t != "number" ? t : fm(t, _o))
  );
};
function Yy(e) {
  var t,
    n = e.state,
    r = e.name,
    o = e.options,
    l = n.elements.arrow,
    i = n.modifiersData.popperOffsets,
    s = wt(n.placement),
    a = mu(s),
    c = [Ue, ot].indexOf(s) >= 0,
    f = c ? "height" : "width";
  if (!(!l || !i)) {
    var d = Gy(o.padding, n),
      v = pu(l),
      y = a === "y" ? Be : Ue,
      x = a === "y" ? rt : ot,
      w =
        n.rects.reference[f] + n.rects.reference[a] - i[a] - n.rects.popper[f],
      k = i[a] - n.rects.reference[a],
      m = Ro(l),
      p = m ? (a === "y" ? m.clientHeight || 0 : m.clientWidth || 0) : 0,
      h = w / 2 - k / 2,
      S = d[y],
      E = p - v[f] - d[x],
      N = p / 2 - v[f] / 2 + h,
      C = Yr(S, N, E),
      O = a;
    n.modifiersData[r] = ((t = {}), (t[O] = C), (t.centerOffset = C - N), t);
  }
}
function Xy(e) {
  var t = e.state,
    n = e.options,
    r = n.element,
    o = r === void 0 ? "[data-popper-arrow]" : r;
  o != null &&
    ((typeof o == "string" && ((o = t.elements.popper.querySelector(o)), !o)) ||
      !am(t.elements.popper, o) ||
      (t.elements.arrow = o));
}
const qy = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: Yy,
  effect: Xy,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function mr(e) {
  return e.split("-")[1];
}
var Zy = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function Jy(e) {
  var t = e.x,
    n = e.y,
    r = window,
    o = r.devicePixelRatio || 1;
  return { x: dr(t * o) / o || 0, y: dr(n * o) / o || 0 };
}
function Qc(e) {
  var t,
    n = e.popper,
    r = e.popperRect,
    o = e.placement,
    l = e.variation,
    i = e.offsets,
    s = e.position,
    a = e.gpuAcceleration,
    c = e.adaptive,
    f = e.roundOffsets,
    d = e.isFixed,
    v = i.x,
    y = v === void 0 ? 0 : v,
    x = i.y,
    w = x === void 0 ? 0 : x,
    k = typeof f == "function" ? f({ x: y, y: w }) : { x: y, y: w };
  (y = k.x), (w = k.y);
  var m = i.hasOwnProperty("x"),
    p = i.hasOwnProperty("y"),
    h = Ue,
    S = Be,
    E = window;
  if (c) {
    var N = Ro(n),
      C = "clientHeight",
      O = "clientWidth";
    if (
      (N === lt(n) &&
        ((N = pn(n)),
        It(N).position !== "static" &&
          s === "absolute" &&
          ((C = "scrollHeight"), (O = "scrollWidth"))),
      (N = N),
      o === Be || ((o === Ue || o === ot) && l === go))
    ) {
      S = rt;
      var j = d && N === E && E.visualViewport ? E.visualViewport.height : N[C];
      (w -= j - r.height), (w *= a ? 1 : -1);
    }
    if (o === Ue || ((o === Be || o === rt) && l === go)) {
      h = ot;
      var L = d && N === E && E.visualViewport ? E.visualViewport.width : N[O];
      (y -= L - r.width), (y *= a ? 1 : -1);
    }
  }
  var U = Object.assign({ position: s }, c && Zy),
    J = f === !0 ? Jy({ x: y, y: w }) : { x: y, y: w };
  if (((y = J.x), (w = J.y), a)) {
    var Q;
    return Object.assign(
      {},
      U,
      ((Q = {}),
      (Q[S] = p ? "0" : ""),
      (Q[h] = m ? "0" : ""),
      (Q.transform =
        (E.devicePixelRatio || 1) <= 1
          ? "translate(" + y + "px, " + w + "px)"
          : "translate3d(" + y + "px, " + w + "px, 0)"),
      Q),
    );
  }
  return Object.assign(
    {},
    U,
    ((t = {}),
    (t[S] = p ? w + "px" : ""),
    (t[h] = m ? y + "px" : ""),
    (t.transform = ""),
    t),
  );
}
function e0(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    o = r === void 0 ? !0 : r,
    l = n.adaptive,
    i = l === void 0 ? !0 : l,
    s = n.roundOffsets,
    a = s === void 0 ? !0 : s,
    c = {
      placement: wt(t.placement),
      variation: mr(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
      isFixed: t.options.strategy === "fixed",
    };
  t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      Qc(
        Object.assign({}, c, {
          offsets: t.modifiersData.popperOffsets,
          position: t.options.strategy,
          adaptive: i,
          roundOffsets: a,
        }),
      ),
    )),
    t.modifiersData.arrow != null &&
      (t.styles.arrow = Object.assign(
        {},
        t.styles.arrow,
        Qc(
          Object.assign({}, c, {
            offsets: t.modifiersData.arrow,
            position: "absolute",
            adaptive: !1,
            roundOffsets: a,
          }),
        ),
      )),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-placement": t.placement,
    }));
}
const t0 = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: e0,
  data: {},
};
var Zo = { passive: !0 };
function n0(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    o = r.scroll,
    l = o === void 0 ? !0 : o,
    i = r.resize,
    s = i === void 0 ? !0 : i,
    a = lt(t.elements.popper),
    c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    l &&
      c.forEach(function (f) {
        f.addEventListener("scroll", n.update, Zo);
      }),
    s && a.addEventListener("resize", n.update, Zo),
    function () {
      l &&
        c.forEach(function (f) {
          f.removeEventListener("scroll", n.update, Zo);
        }),
        s && a.removeEventListener("resize", n.update, Zo);
    }
  );
}
const r0 = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: n0,
  data: {},
};
var o0 = { left: "right", right: "left", bottom: "top", top: "bottom" };
function pl(e) {
  return e.replace(/left|right|bottom|top/g, function (t) {
    return o0[t];
  });
}
var l0 = { start: "end", end: "start" };
function Gc(e) {
  return e.replace(/start|end/g, function (t) {
    return l0[t];
  });
}
function vu(e) {
  var t = lt(e),
    n = t.pageXOffset,
    r = t.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function hu(e) {
  return pr(pn(e)).left + vu(e).scrollLeft;
}
function i0(e, t) {
  var n = lt(e),
    r = pn(e),
    o = n.visualViewport,
    l = r.clientWidth,
    i = r.clientHeight,
    s = 0,
    a = 0;
  if (o) {
    (l = o.width), (i = o.height);
    var c = sm();
    (c || (!c && t === "fixed")) && ((s = o.offsetLeft), (a = o.offsetTop));
  }
  return { width: l, height: i, x: s + hu(e), y: a };
}
function s0(e) {
  var t,
    n = pn(e),
    r = vu(e),
    o = (t = e.ownerDocument) == null ? void 0 : t.body,
    l = Cn(
      n.scrollWidth,
      n.clientWidth,
      o ? o.scrollWidth : 0,
      o ? o.clientWidth : 0,
    ),
    i = Cn(
      n.scrollHeight,
      n.clientHeight,
      o ? o.scrollHeight : 0,
      o ? o.clientHeight : 0,
    ),
    s = -r.scrollLeft + hu(e),
    a = -r.scrollTop;
  return (
    It(o || n).direction === "rtl" &&
      (s += Cn(n.clientWidth, o ? o.clientWidth : 0) - l),
    { width: l, height: i, x: s, y: a }
  );
}
function gu(e) {
  var t = It(e),
    n = t.overflow,
    r = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function dm(e) {
  return ["html", "body", "#document"].indexOf(un(e)) >= 0
    ? e.ownerDocument.body
    : St(e) && gu(e)
      ? e
      : dm(di(e));
}
function Xr(e, t) {
  var n;
  t === void 0 && (t = []);
  var r = dm(e),
    o = r === ((n = e.ownerDocument) == null ? void 0 : n.body),
    l = lt(r),
    i = o ? [l].concat(l.visualViewport || [], gu(r) ? r : []) : r,
    s = t.concat(i);
  return o ? s : s.concat(Xr(di(i)));
}
function Qs(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function a0(e, t) {
  var n = pr(e, !1, t === "fixed");
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
function Yc(e, t, n) {
  return t === lm ? Qs(i0(e, n)) : Pn(t) ? a0(t, n) : Qs(s0(pn(e)));
}
function u0(e) {
  var t = Xr(di(e)),
    n = ["absolute", "fixed"].indexOf(It(e).position) >= 0,
    r = n && St(e) ? Ro(e) : e;
  return Pn(r)
    ? t.filter(function (o) {
        return Pn(o) && am(o, r) && un(o) !== "body";
      })
    : [];
}
function c0(e, t, n, r) {
  var o = t === "clippingParents" ? u0(e) : [].concat(t),
    l = [].concat(o, [n]),
    i = l[0],
    s = l.reduce(
      function (a, c) {
        var f = Yc(e, c, r);
        return (
          (a.top = Cn(f.top, a.top)),
          (a.right = bl(f.right, a.right)),
          (a.bottom = bl(f.bottom, a.bottom)),
          (a.left = Cn(f.left, a.left)),
          a
        );
      },
      Yc(e, i, r),
    );
  return (
    (s.width = s.right - s.left),
    (s.height = s.bottom - s.top),
    (s.x = s.left),
    (s.y = s.top),
    s
  );
}
function pm(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    o = r ? wt(r) : null,
    l = r ? mr(r) : null,
    i = t.x + t.width / 2 - n.width / 2,
    s = t.y + t.height / 2 - n.height / 2,
    a;
  switch (o) {
    case Be:
      a = { x: i, y: t.y - n.height };
      break;
    case rt:
      a = { x: i, y: t.y + t.height };
      break;
    case ot:
      a = { x: t.x + t.width, y: s };
      break;
    case Ue:
      a = { x: t.x - n.width, y: s };
      break;
    default:
      a = { x: t.x, y: t.y };
  }
  var c = o ? mu(o) : null;
  if (c != null) {
    var f = c === "y" ? "height" : "width";
    switch (l) {
      case fr:
        a[c] = a[c] - (t[f] / 2 - n[f] / 2);
        break;
      case go:
        a[c] = a[c] + (t[f] / 2 - n[f] / 2);
        break;
    }
  }
  return a;
}
function yo(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = r === void 0 ? e.placement : r,
    l = n.strategy,
    i = l === void 0 ? e.strategy : l,
    s = n.boundary,
    a = s === void 0 ? $y : s,
    c = n.rootBoundary,
    f = c === void 0 ? lm : c,
    d = n.elementContext,
    v = d === void 0 ? $r : d,
    y = n.altBoundary,
    x = y === void 0 ? !1 : y,
    w = n.padding,
    k = w === void 0 ? 0 : w,
    m = cm(typeof k != "number" ? k : fm(k, _o)),
    p = v === $r ? Dy : $r,
    h = e.rects.popper,
    S = e.elements[x ? p : v],
    E = c0(Pn(S) ? S : S.contextElement || pn(e.elements.popper), a, f, i),
    N = pr(e.elements.reference),
    C = pm({ reference: N, element: h, strategy: "absolute", placement: o }),
    O = Qs(Object.assign({}, h, C)),
    j = v === $r ? O : N,
    L = {
      top: E.top - j.top + m.top,
      bottom: j.bottom - E.bottom + m.bottom,
      left: E.left - j.left + m.left,
      right: j.right - E.right + m.right,
    },
    U = e.modifiersData.offset;
  if (v === $r && U) {
    var J = U[o];
    Object.keys(L).forEach(function (Q) {
      var q = [ot, rt].indexOf(Q) >= 0 ? 1 : -1,
        A = [Be, rt].indexOf(Q) >= 0 ? "y" : "x";
      L[Q] += J[A] * q;
    });
  }
  return L;
}
function f0(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = n.boundary,
    l = n.rootBoundary,
    i = n.padding,
    s = n.flipVariations,
    a = n.allowedAutoPlacements,
    c = a === void 0 ? im : a,
    f = mr(r),
    d = f
      ? s
        ? bc
        : bc.filter(function (x) {
            return mr(x) === f;
          })
      : _o,
    v = d.filter(function (x) {
      return c.indexOf(x) >= 0;
    });
  v.length === 0 && (v = d);
  var y = v.reduce(function (x, w) {
    return (
      (x[w] = yo(e, { placement: w, boundary: o, rootBoundary: l, padding: i })[
        wt(w)
      ]),
      x
    );
  }, {});
  return Object.keys(y).sort(function (x, w) {
    return y[x] - y[w];
  });
}
function d0(e) {
  if (wt(e) === fu) return [];
  var t = pl(e);
  return [Gc(e), t, Gc(t)];
}
function p0(e) {
  var t = e.state,
    n = e.options,
    r = e.name;
  if (!t.modifiersData[r]._skip) {
    for (
      var o = n.mainAxis,
        l = o === void 0 ? !0 : o,
        i = n.altAxis,
        s = i === void 0 ? !0 : i,
        a = n.fallbackPlacements,
        c = n.padding,
        f = n.boundary,
        d = n.rootBoundary,
        v = n.altBoundary,
        y = n.flipVariations,
        x = y === void 0 ? !0 : y,
        w = n.allowedAutoPlacements,
        k = t.options.placement,
        m = wt(k),
        p = m === k,
        h = a || (p || !x ? [pl(k)] : d0(k)),
        S = [k].concat(h).reduce(function (F, z) {
          return F.concat(
            wt(z) === fu
              ? f0(t, {
                  placement: z,
                  boundary: f,
                  rootBoundary: d,
                  padding: c,
                  flipVariations: x,
                  allowedAutoPlacements: w,
                })
              : z,
          );
        }, []),
        E = t.rects.reference,
        N = t.rects.popper,
        C = new Map(),
        O = !0,
        j = S[0],
        L = 0;
      L < S.length;
      L++
    ) {
      var U = S[L],
        J = wt(U),
        Q = mr(U) === fr,
        q = [Be, rt].indexOf(J) >= 0,
        A = q ? "width" : "height",
        te = yo(t, {
          placement: U,
          boundary: f,
          rootBoundary: d,
          altBoundary: v,
          padding: c,
        }),
        re = q ? (Q ? ot : Ue) : Q ? rt : Be;
      E[A] > N[A] && (re = pl(re));
      var R = pl(re),
        D = [];
      if (
        (l && D.push(te[J] <= 0),
        s && D.push(te[re] <= 0, te[R] <= 0),
        D.every(function (F) {
          return F;
        }))
      ) {
        (j = U), (O = !1);
        break;
      }
      C.set(U, D);
    }
    if (O)
      for (
        var M = x ? 3 : 1,
          b = function (z) {
            var V = S.find(function (ae) {
              var Re = C.get(ae);
              if (Re)
                return Re.slice(0, z).every(function (Te) {
                  return Te;
                });
            });
            if (V) return (j = V), "break";
          },
          W = M;
        W > 0;
        W--
      ) {
        var T = b(W);
        if (T === "break") break;
      }
    t.placement !== j &&
      ((t.modifiersData[r]._skip = !0), (t.placement = j), (t.reset = !0));
  }
}
const m0 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: p0,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function Xc(e, t, n) {
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
function qc(e) {
  return [Be, ot, rt, Ue].some(function (t) {
    return e[t] >= 0;
  });
}
function v0(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    o = t.rects.popper,
    l = t.modifiersData.preventOverflow,
    i = yo(t, { elementContext: "reference" }),
    s = yo(t, { altBoundary: !0 }),
    a = Xc(i, r),
    c = Xc(s, o, l),
    f = qc(a),
    d = qc(c);
  (t.modifiersData[n] = {
    referenceClippingOffsets: a,
    popperEscapeOffsets: c,
    isReferenceHidden: f,
    hasPopperEscaped: d,
  }),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-reference-hidden": f,
      "data-popper-escaped": d,
    }));
}
const h0 = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: v0,
};
function g0(e, t, n) {
  var r = wt(e),
    o = [Ue, Be].indexOf(r) >= 0 ? -1 : 1,
    l = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n,
    i = l[0],
    s = l[1];
  return (
    (i = i || 0),
    (s = (s || 0) * o),
    [Ue, ot].indexOf(r) >= 0 ? { x: s, y: i } : { x: i, y: s }
  );
}
function y0(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.offset,
    l = o === void 0 ? [0, 0] : o,
    i = im.reduce(function (f, d) {
      return (f[d] = g0(d, t.rects, l)), f;
    }, {}),
    s = i[t.placement],
    a = s.x,
    c = s.y;
  t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += a),
    (t.modifiersData.popperOffsets.y += c)),
    (t.modifiersData[r] = i);
}
const x0 = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: y0,
};
function E0(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = pm({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement,
  });
}
const w0 = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: E0,
  data: {},
};
function S0(e) {
  return e === "x" ? "y" : "x";
}
function k0(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.mainAxis,
    l = o === void 0 ? !0 : o,
    i = n.altAxis,
    s = i === void 0 ? !1 : i,
    a = n.boundary,
    c = n.rootBoundary,
    f = n.altBoundary,
    d = n.padding,
    v = n.tether,
    y = v === void 0 ? !0 : v,
    x = n.tetherOffset,
    w = x === void 0 ? 0 : x,
    k = yo(t, { boundary: a, rootBoundary: c, padding: d, altBoundary: f }),
    m = wt(t.placement),
    p = mr(t.placement),
    h = !p,
    S = mu(m),
    E = S0(S),
    N = t.modifiersData.popperOffsets,
    C = t.rects.reference,
    O = t.rects.popper,
    j =
      typeof w == "function"
        ? w(Object.assign({}, t.rects, { placement: t.placement }))
        : w,
    L =
      typeof j == "number"
        ? { mainAxis: j, altAxis: j }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, j),
    U = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    J = { x: 0, y: 0 };
  if (!!N) {
    if (l) {
      var Q,
        q = S === "y" ? Be : Ue,
        A = S === "y" ? rt : ot,
        te = S === "y" ? "height" : "width",
        re = N[S],
        R = re + k[q],
        D = re - k[A],
        M = y ? -O[te] / 2 : 0,
        b = p === fr ? C[te] : O[te],
        W = p === fr ? -O[te] : -C[te],
        T = t.elements.arrow,
        F = y && T ? pu(T) : { width: 0, height: 0 },
        z = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : um(),
        V = z[q],
        ae = z[A],
        Re = Yr(0, C[te], F[te]),
        Te = h ? C[te] / 2 - M - Re - V - L.mainAxis : b - Re - V - L.mainAxis,
        vn = h
          ? -C[te] / 2 + M + Re + ae + L.mainAxis
          : W + Re + ae + L.mainAxis,
        it = t.elements.arrow && Ro(t.elements.arrow),
        Ut = it ? (S === "y" ? it.clientTop || 0 : it.clientLeft || 0) : 0,
        Z = (Q = U == null ? void 0 : U[S]) != null ? Q : 0,
        To = re + Te - Z - Ut,
        mi = re + vn - Z,
        Po = Yr(y ? bl(R, To) : R, re, y ? Cn(D, mi) : D);
      (N[S] = Po), (J[S] = Po - re);
    }
    if (s) {
      var jo,
        vi = S === "x" ? Be : Ue,
        hi = S === "x" ? rt : ot,
        kt = N[E],
        Dn = E === "y" ? "height" : "width",
        Lo = kt + k[vi],
        wr = kt - k[hi],
        Sr = [Be, Ue].indexOf(m) !== -1,
        Y = (jo = U == null ? void 0 : U[E]) != null ? jo : 0,
        Ct = Sr ? Lo : kt - C[Dn] - O[Dn] - Y + L.altAxis,
        kr = Sr ? kt + C[Dn] + O[Dn] - Y - L.altAxis : wr,
        Ru = y && Sr ? Qy(Ct, kt, kr) : Yr(y ? Ct : Lo, kt, y ? kr : wr);
      (N[E] = Ru), (J[E] = Ru - kt);
    }
    t.modifiersData[r] = J;
  }
}
const C0 = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: k0,
  requiresIfExists: ["offset"],
};
function N0(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function O0(e) {
  return e === lt(e) || !St(e) ? vu(e) : N0(e);
}
function _0(e) {
  var t = e.getBoundingClientRect(),
    n = dr(t.width) / e.offsetWidth || 1,
    r = dr(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function R0(e, t, n) {
  n === void 0 && (n = !1);
  var r = St(t),
    o = St(t) && _0(t),
    l = pn(t),
    i = pr(e, o, n),
    s = { scrollLeft: 0, scrollTop: 0 },
    a = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((un(t) !== "body" || gu(l)) && (s = O0(t)),
      St(t)
        ? ((a = pr(t, !0)), (a.x += t.clientLeft), (a.y += t.clientTop))
        : l && (a.x = hu(l))),
    {
      x: i.left + s.scrollLeft - a.x,
      y: i.top + s.scrollTop - a.y,
      width: i.width,
      height: i.height,
    }
  );
}
function T0(e) {
  var t = new Map(),
    n = new Set(),
    r = [];
  e.forEach(function (l) {
    t.set(l.name, l);
  });
  function o(l) {
    n.add(l.name);
    var i = [].concat(l.requires || [], l.requiresIfExists || []);
    i.forEach(function (s) {
      if (!n.has(s)) {
        var a = t.get(s);
        a && o(a);
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
function P0(e) {
  var t = T0(e);
  return Wy.reduce(function (n, r) {
    return n.concat(
      t.filter(function (o) {
        return o.phase === r;
      }),
    );
  }, []);
}
function j0(e) {
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
function L0(e) {
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
var Zc = { placement: "bottom", modifiers: [], strategy: "absolute" };
function Jc() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return !t.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function $0(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    o = t.defaultOptions,
    l = o === void 0 ? Zc : o;
  return function (s, a, c) {
    c === void 0 && (c = l);
    var f = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, Zc, l),
        modifiersData: {},
        elements: { reference: s, popper: a },
        attributes: {},
        styles: {},
      },
      d = [],
      v = !1,
      y = {
        state: f,
        setOptions: function (m) {
          var p = typeof m == "function" ? m(f.options) : m;
          w(),
            (f.options = Object.assign({}, l, f.options, p)),
            (f.scrollParents = {
              reference: Pn(s)
                ? Xr(s)
                : s.contextElement
                  ? Xr(s.contextElement)
                  : [],
              popper: Xr(a),
            });
          var h = P0(L0([].concat(r, f.options.modifiers)));
          return (
            (f.orderedModifiers = h.filter(function (S) {
              return S.enabled;
            })),
            x(),
            y.update()
          );
        },
        forceUpdate: function () {
          if (!v) {
            var m = f.elements,
              p = m.reference,
              h = m.popper;
            if (!!Jc(p, h)) {
              (f.rects = {
                reference: R0(p, Ro(h), f.options.strategy === "fixed"),
                popper: pu(h),
              }),
                (f.reset = !1),
                (f.placement = f.options.placement),
                f.orderedModifiers.forEach(function (L) {
                  return (f.modifiersData[L.name] = Object.assign({}, L.data));
                });
              for (var S = 0; S < f.orderedModifiers.length; S++) {
                if (f.reset === !0) {
                  (f.reset = !1), (S = -1);
                  continue;
                }
                var E = f.orderedModifiers[S],
                  N = E.fn,
                  C = E.options,
                  O = C === void 0 ? {} : C,
                  j = E.name;
                typeof N == "function" &&
                  (f = N({ state: f, options: O, name: j, instance: y }) || f);
              }
            }
          }
        },
        update: j0(function () {
          return new Promise(function (k) {
            y.forceUpdate(), k(f);
          });
        }),
        destroy: function () {
          w(), (v = !0);
        },
      };
    if (!Jc(s, a)) return y;
    y.setOptions(c).then(function (k) {
      !v && c.onFirstUpdate && c.onFirstUpdate(k);
    });
    function x() {
      f.orderedModifiers.forEach(function (k) {
        var m = k.name,
          p = k.options,
          h = p === void 0 ? {} : p,
          S = k.effect;
        if (typeof S == "function") {
          var E = S({ state: f, name: m, instance: y, options: h }),
            N = function () {};
          d.push(E || N);
        }
      });
    }
    function w() {
      d.forEach(function (k) {
        return k();
      }),
        (d = []);
    }
    return y;
  };
}
const D0 = $0({ defaultModifiers: [h0, w0, t0, r0, x0, m0, C0, qy] }),
  M0 = ["enabled", "placement", "strategy", "modifiers"];
function F0(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const I0 = {
    name: "applyStyles",
    enabled: !1,
    phase: "afterWrite",
    fn: () => {},
  },
  A0 = {
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
  z0 = [];
function B0(e, t, n = {}) {
  let {
      enabled: r = !0,
      placement: o = "bottom",
      strategy: l = "absolute",
      modifiers: i = z0,
    } = n,
    s = F0(n, M0);
  const a = g.exports.useRef(i),
    c = g.exports.useRef(),
    f = g.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.update();
    }, []),
    d = g.exports.useCallback(() => {
      var k;
      (k = c.current) == null || k.forceUpdate();
    }, []),
    [v, y] = Ly(
      g.exports.useState({
        placement: o,
        update: f,
        forceUpdate: d,
        attributes: {},
        styles: { popper: {}, arrow: {} },
      }),
    ),
    x = g.exports.useMemo(
      () => ({
        name: "updateStateModifier",
        enabled: !0,
        phase: "write",
        requires: ["computeStyles"],
        fn: ({ state: k }) => {
          const m = {},
            p = {};
          Object.keys(k.elements).forEach((h) => {
            (m[h] = k.styles[h]), (p[h] = k.attributes[h]);
          }),
            y({
              state: k,
              styles: m,
              attributes: p,
              update: f,
              forceUpdate: d,
              placement: k.placement,
            });
        },
      }),
      [f, d, y],
    ),
    w = g.exports.useMemo(
      () => (Gr(a.current, i) || (a.current = i), a.current),
      [i],
    );
  return (
    g.exports.useEffect(() => {
      !c.current ||
        !r ||
        c.current.setOptions({
          placement: o,
          strategy: l,
          modifiers: [...w, x, I0],
        });
    }, [l, o, x, r, w]),
    g.exports.useEffect(() => {
      if (!(!r || e == null || t == null))
        return (
          (c.current = D0(
            e,
            t,
            Object.assign({}, s, {
              placement: o,
              strategy: l,
              modifiers: [...w, A0, x],
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
    v
  );
}
const ef = () => {};
function U0(e) {
  return e.button === 0;
}
function V0(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const ml = (e) => e && ("current" in e ? e.current : e),
  tf = { click: "mousedown", mouseup: "mousedown", pointerup: "pointerdown" };
function H0(e, t = ef, { disabled: n, clickTrigger: r = "click" } = {}) {
  const o = g.exports.useRef(!1),
    l = g.exports.useRef(!1),
    i = g.exports.useCallback(
      (c) => {
        const f = ml(e);
        (o.current = !f || V0(c) || !U0(c) || !!ho(f, c.target) || l.current),
          (l.current = !1);
      },
      [e],
    ),
    s = je((c) => {
      const f = ml(e);
      f && ho(f, c.target) && (l.current = !0);
    }),
    a = je((c) => {
      o.current || t(c);
    });
  g.exports.useEffect(() => {
    if (n || e == null) return;
    const c = yr(ml(e));
    let f = (c.defaultView || window).event,
      d = null;
    tf[r] && (d = Tt(c, tf[r], s, !0));
    const v = Tt(c, r, i, !0),
      y = Tt(c, r, (w) => {
        if (w === f) {
          f = void 0;
          return;
        }
        a(w);
      });
    let x = [];
    return (
      "ontouchstart" in c.documentElement &&
        (x = [].slice.call(c.body.children).map((w) => Tt(w, "mousemove", ef))),
      () => {
        d == null || d(), v(), y(), x.forEach((w) => w());
      }
    );
  }, [e, n, r, i, s, a]);
}
const W0 = 27,
  b0 = () => {};
function K0(e, t, { disabled: n, clickTrigger: r } = {}) {
  const o = t || b0;
  H0(e, o, { disabled: n, clickTrigger: r });
  const l = je((i) => {
    i.keyCode === W0 && o(i);
  });
  g.exports.useEffect(() => {
    if (n || e == null) return;
    const i = yr(ml(e));
    let s = (i.defaultView || window).event;
    const a = Tt(i, "keyup", (c) => {
      if (c === s) {
        s = void 0;
        return;
      }
      l(c);
    });
    return () => {
      a();
    };
  }, [e, n, l]);
}
const mm = g.exports.createContext(xr ? window : void 0);
mm.Provider;
function vm() {
  return g.exports.useContext(mm);
}
const Wi = (e, t) =>
  xr
    ? e == null
      ? (t || yr()).body
      : (typeof e == "function" && (e = e()),
        e && "current" in e && (e = e.current),
        e && ("nodeType" in e || e.getBoundingClientRect) ? e : null)
    : null;
function Gs(e, t) {
  const n = vm(),
    [r, o] = g.exports.useState(() => Wi(e, n == null ? void 0 : n.document));
  if (!r) {
    const l = Wi(e);
    l && o(l);
  }
  return (
    g.exports.useEffect(() => {
      t && r && t(r);
    }, [t, r]),
    g.exports.useEffect(() => {
      const l = Wi(e);
      l !== r && o(l);
    }, [e, r]),
    r
  );
}
function Q0(e) {
  const t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach((n) => {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function G0(e = {}) {
  return Array.isArray(e)
    ? e
    : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
}
function Y0({
  enabled: e,
  enableEvents: t,
  placement: n,
  flip: r,
  offset: o,
  fixed: l,
  containerPadding: i,
  arrowElement: s,
  popperConfig: a = {},
}) {
  var c, f, d, v, y;
  const x = Q0(a.modifiers);
  return Object.assign({}, a, {
    placement: n,
    enabled: e,
    strategy: l ? "fixed" : a.strategy,
    modifiers: G0(
      Object.assign({}, x, {
        eventListeners: {
          enabled: t,
          options: (c = x.eventListeners) == null ? void 0 : c.options,
        },
        preventOverflow: Object.assign({}, x.preventOverflow, {
          options: i
            ? Object.assign(
                { padding: i },
                (f = x.preventOverflow) == null ? void 0 : f.options,
              )
            : (d = x.preventOverflow) == null
              ? void 0
              : d.options,
        }),
        offset: {
          options: Object.assign(
            { offset: o },
            (v = x.offset) == null ? void 0 : v.options,
          ),
        },
        arrow: Object.assign({}, x.arrow, {
          enabled: !!s,
          options: Object.assign(
            {},
            (y = x.arrow) == null ? void 0 : y.options,
            { element: s },
          ),
        }),
        flip: Object.assign({ enabled: !!r }, x.flip),
      }),
    ),
  });
}
const hm = g.exports.forwardRef((e, t) => {
  const {
      flip: n,
      offset: r,
      placement: o,
      containerPadding: l,
      popperConfig: i = {},
      transition: s,
    } = e,
    [a, c] = Wl(),
    [f, d] = Wl(),
    v = Co(c, t),
    y = Gs(e.container),
    x = Gs(e.target),
    [w, k] = g.exports.useState(!e.show),
    m = B0(
      x,
      a,
      Y0({
        placement: o,
        enableEvents: !!e.show,
        containerPadding: l || 5,
        flip: n,
        offset: r,
        arrowElement: f,
        popperConfig: i,
      }),
    );
  e.show ? w && k(!1) : !e.transition && !w && k(!0);
  const p = (...E) => {
      k(!0), e.onExited && e.onExited(...E);
    },
    h = e.show || (s && !w);
  if (
    (K0(a, e.onHide, {
      disabled: !e.rootClose || e.rootCloseDisabled,
      clickTrigger: e.rootCloseEvent,
    }),
    !h)
  )
    return null;
  let S = e.children(
    Object.assign({}, m.attributes.popper, { style: m.styles.popper, ref: v }),
    {
      popper: m,
      placement: o,
      show: !!e.show,
      arrowProps: Object.assign({}, m.attributes.arrow, {
        style: m.styles.arrow,
        ref: d,
      }),
    },
  );
  if (s) {
    const {
      onExit: E,
      onExiting: N,
      onEnter: C,
      onEntering: O,
      onEntered: j,
    } = e;
    S = _.exports.jsx(s, {
      in: e.show,
      appear: !0,
      onExit: E,
      onExiting: N,
      onExited: p,
      onEnter: C,
      onEntering: O,
      onEntered: j,
      children: S,
    });
  }
  return y ? wn.createPortal(S, y) : null;
});
hm.displayName = "Overlay";
var X0 =
    typeof global < "u" &&
    global.navigator &&
    global.navigator.product === "ReactNative",
  q0 = typeof document < "u";
const Z0 = q0 || X0 ? g.exports.useLayoutEffect : g.exports.useEffect;
function gm(e, t) {
  return e.classList
    ? !!t && e.classList.contains(t)
    : (" " + (e.className.baseVal || e.className) + " ").indexOf(
        " " + t + " ",
      ) !== -1;
}
const J0 = ke("popover-header"),
  ym = ke("popover-body");
function xm(e, t) {
  let n = e;
  return (
    e === "left"
      ? (n = t ? "end" : "start")
      : e === "right" && (n = t ? "start" : "end"),
    n
  );
}
const ex = { placement: "right" },
  Em = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t,
        className: n,
        style: r,
        children: o,
        body: l,
        arrowProps: i,
        popper: s,
        show: a,
        ...c
      },
      f,
    ) => {
      const d = H(e, "popover"),
        v = Ga(),
        [y] = (t == null ? void 0 : t.split("-")) || [],
        x = xm(y, v);
      return _.exports.jsxs("div", {
        ref: f,
        role: "tooltip",
        style: r,
        "x-placement": y,
        className: I(n, d, y && `bs-popover-${x}`),
        ...c,
        children: [
          _.exports.jsx("div", { className: "popover-arrow", ...i }),
          l ? _.exports.jsx(ym, { children: o }) : o,
        ],
      });
    },
  );
Em.defaultProps = ex;
const tx = Object.assign(Em, { Header: J0, Body: ym, POPPER_OFFSET: [0, 8] });
function nx(e) {
  const t = g.exports.useRef(null),
    n = H(void 0, "popover"),
    r = g.exports.useMemo(
      () => ({
        name: "offset",
        options: {
          offset: () =>
            t.current && gm(t.current, n) ? e || tx.POPPER_OFFSET : e || [0, 0],
        },
      }),
      [e, n],
    );
  return [t, [r]];
}
const rx = { transition: Bt, rootClose: !1, show: !1, placement: "top" };
function ox(e, t) {
  const { ref: n } = e,
    { ref: r } = t;
  (e.ref = n.__wrapped || (n.__wrapped = (o) => n(zl(o)))),
    (t.ref = r.__wrapped || (r.__wrapped = (o) => r(zl(o))));
}
const yu = g.exports.forwardRef(
  ({ children: e, transition: t, popperConfig: n = {}, ...r }, o) => {
    const l = g.exports.useRef({}),
      [i, s] = Wl(),
      [a, c] = nx(r.offset),
      f = Co(o, a),
      d = t === !0 ? Bt : t || void 0,
      v = je((y) => {
        s(y), n == null || n.onFirstUpdate == null || n.onFirstUpdate(y);
      });
    return (
      Z0(() => {
        i && (l.current.scheduleUpdate == null || l.current.scheduleUpdate());
      }, [i]),
      _.exports.jsx(hm, {
        ...r,
        ref: f,
        popperConfig: {
          ...n,
          modifiers: c.concat(n.modifiers || []),
          onFirstUpdate: v,
        },
        transition: d,
        children: (y, { arrowProps: x, popper: w, show: k }) => {
          var m, p;
          ox(y, x);
          const h = w == null ? void 0 : w.placement,
            S = Object.assign(l.current, {
              state: w == null ? void 0 : w.state,
              scheduleUpdate: w == null ? void 0 : w.update,
              placement: h,
              outOfBoundaries:
                (w == null ||
                (m = w.state) == null ||
                (p = m.modifiersData.hide) == null
                  ? void 0
                  : p.isReferenceHidden) || !1,
            });
          return typeof e == "function"
            ? e({
                ...y,
                placement: h,
                show: k,
                ...(!t && k && { className: "show" }),
                popper: S,
                arrowProps: x,
              })
            : g.exports.cloneElement(e, {
                ...y,
                placement: h,
                arrowProps: x,
                popper: S,
                className: I(e.props.className, !t && k && "show"),
                style: { ...e.props.style, ...y.style },
              });
        },
      })
    );
  },
);
yu.displayName = "Overlay";
yu.defaultProps = rx;
function lx(e) {
  return e && typeof e == "object" ? e : { show: e, hide: e };
}
function nf(e, t, n) {
  const [r] = t,
    o = r.currentTarget,
    l = r.relatedTarget || r.nativeEvent[n];
  (!l || l !== o) && !ho(o, l) && e(...t);
}
const ix = { defaultShow: !1, trigger: ["hover", "focus"] };
function xu({
  trigger: e,
  overlay: t,
  children: n,
  popperConfig: r = {},
  show: o,
  defaultShow: l = !1,
  onToggle: i,
  delay: s,
  placement: a,
  flip: c = a && a.indexOf("auto") !== -1,
  ...f
}) {
  const d = g.exports.useRef(null),
    v = Co(d, n.ref),
    y = Jp(),
    x = g.exports.useRef(""),
    [w, k] = jp(o, l, i),
    m = lx(s),
    {
      onFocus: p,
      onBlur: h,
      onClick: S,
    } = typeof n != "function" ? g.exports.Children.only(n).props : {},
    E = (A) => {
      v(zl(A));
    },
    N = g.exports.useCallback(() => {
      if ((y.clear(), (x.current = "show"), !m.show)) {
        k(!0);
        return;
      }
      y.set(() => {
        x.current === "show" && k(!0);
      }, m.show);
    }, [m.show, k, y]),
    C = g.exports.useCallback(() => {
      if ((y.clear(), (x.current = "hide"), !m.hide)) {
        k(!1);
        return;
      }
      y.set(() => {
        x.current === "hide" && k(!1);
      }, m.hide);
    }, [m.hide, k, y]),
    O = g.exports.useCallback(
      (...A) => {
        N(), p == null || p(...A);
      },
      [N, p],
    ),
    j = g.exports.useCallback(
      (...A) => {
        C(), h == null || h(...A);
      },
      [C, h],
    ),
    L = g.exports.useCallback(
      (...A) => {
        k(!w), S == null || S(...A);
      },
      [S, k, w],
    ),
    U = g.exports.useCallback(
      (...A) => {
        nf(N, A, "fromElement");
      },
      [N],
    ),
    J = g.exports.useCallback(
      (...A) => {
        nf(C, A, "toElement");
      },
      [C],
    ),
    Q = e == null ? [] : [].concat(e),
    q = { ref: E };
  return (
    Q.indexOf("click") !== -1 && (q.onClick = L),
    Q.indexOf("focus") !== -1 && ((q.onFocus = O), (q.onBlur = j)),
    Q.indexOf("hover") !== -1 && ((q.onMouseOver = U), (q.onMouseOut = J)),
    _.exports.jsxs(_.exports.Fragment, {
      children: [
        typeof n == "function" ? n(q) : g.exports.cloneElement(n, q),
        _.exports.jsx(yu, {
          ...f,
          show: w,
          onHide: C,
          flip: c,
          placement: a,
          popperConfig: r,
          target: d.current,
          children: t,
        }),
      ],
    })
  );
}
xu.defaultProps = ix;
const sx = { placement: "right" },
  pi = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        placement: t,
        className: n,
        style: r,
        children: o,
        arrowProps: l,
        popper: i,
        show: s,
        ...a
      },
      c,
    ) => {
      e = H(e, "tooltip");
      const f = Ga(),
        [d] = (t == null ? void 0 : t.split("-")) || [],
        v = xm(d, f);
      return _.exports.jsxs("div", {
        ref: c,
        style: r,
        role: "tooltip",
        "x-placement": d,
        className: I(n, e, `bs-tooltip-${v}`),
        ...a,
        children: [
          _.exports.jsx("div", { className: "tooltip-arrow", ...l }),
          _.exports.jsx("div", { className: `${e}-inner`, children: o }),
        ],
      });
    },
  );
pi.defaultProps = sx;
pi.displayName = "Tooltip";
function mn({ onClick: e, disabled: t }) {
  return u.createElement(
    xu,
    {
      placement: "top",
      overlay: u.createElement(pi, null, "Reset to default"),
    },
    u.createElement(
      be,
      { variant: "outline-secondary", size: "sm", onClick: e, disabled: t },
      "\u21BA",
    ),
  );
}
function ax({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const {
      unit: l,
      scale: i,
      step: s,
      min: a,
      max: c,
      precision: f,
      default: d,
    } = t,
    v = n != null ? n : "",
    y = n === d,
    x = (w) => {
      const k = w.target.value;
      if (k === "" || k === "-") r(e, k);
      else {
        const m = parseFloat(k);
        isNaN(m) || r(e, m);
      }
    };
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(B.Control, {
      type: "number",
      value: v,
      onChange: x,
      step: s || "any",
      min: a,
      max: c,
    }),
    l && u.createElement(ne.Text, null, l),
    u.createElement(mn, { onClick: () => o(e), disabled: y }),
  );
}
function ux({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { choices: l, default: i } = t,
    s = n === i;
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(
      B.Select,
      { value: n || "", onChange: (a) => r(e, a.target.value) },
      l && l.map((a) => u.createElement("option", { key: a, value: a }, a)),
    ),
    u.createElement(mn, { onClick: () => o(e), disabled: s }),
  );
}
function cx({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(ne.Checkbox, {
      checked: Boolean(n),
      onChange: (s) => r(e, s.target.checked),
    }),
    u.createElement(B.Control, {
      plaintext: !0,
      readOnly: !0,
      value: n ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    u.createElement(mn, { onClick: () => o(e), disabled: i }),
  );
}
function fx({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(B.Control, {
      type: "text",
      value: n || "",
      onChange: (s) => r(e, s.target.value),
    }),
    u.createElement(mn, { onClick: () => o(e), disabled: i }),
  );
}
function dx({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(B.Control, {
      as: "textarea",
      rows: 2,
      value: n || "",
      onChange: (s) => r(e, s.target.value),
      style: { fontFamily: "monospace", fontSize: "0.85em" },
    }),
    u.createElement(mn, { onClick: () => o(e), disabled: i }),
  );
}
function px({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: i, spec: s } = e,
    { unit: a, scale: c, step: f, min: d, max: v } = s || {},
    y = i ? parseFloat(i) : 0,
    x = t != null ? t : y,
    w = yt(x, c),
    k = t == null,
    m = (E) => {
      const N = E.target.value,
        C = Hl(N, c);
      n(l, C);
    },
    p = yt(d, c),
    h = yt(v, c),
    S = yt(f, c);
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(B.Control, {
      type: "number",
      value: w,
      onChange: m,
      step: S || "any",
      min: p,
      max: h,
      disabled: o,
    }),
    a && u.createElement(ne.Text, null, a),
    o &&
      u.createElement(
        ne.Text,
        { className: "text-muted" },
        u.createElement("small", null, "Scanned"),
      ),
    u.createElement(mn, { onClick: () => r(l), disabled: k || o }),
  );
}
function mx({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: i, spec: s } = e,
    { unit: a, scale: c, step: f, min: d, max: v } = s || {},
    y = i ? parseInt(i) : 0,
    x = t != null ? t : y,
    w = yt(x, c),
    k = t == null,
    m = (E) => {
      const N = E.target.value,
        C = Hl(N, c),
        O = typeof C == "number" ? Math.round(C) : C;
      n(l, O);
    },
    p = yt(d, c),
    h = yt(v, c),
    S = yt(f, c);
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(B.Control, {
      type: "number",
      value: w,
      onChange: m,
      step: S || 1,
      min: p,
      max: h,
      disabled: o,
    }),
    a && u.createElement(ne.Text, null, a),
    o &&
      u.createElement(
        ne.Text,
        { className: "text-muted" },
        u.createElement("small", null, "Scanned"),
      ),
    u.createElement(mn, { onClick: () => r(l), disabled: k || o }),
  );
}
function vx({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, description: i, type: s, default: a } = e,
    c = a === "True" || a === "true",
    f = t != null ? t : c,
    d = t == null;
  return u.createElement(
    ne,
    { size: "sm" },
    u.createElement(ne.Checkbox, {
      checked: Boolean(f),
      onChange: (v) => n(l, v.target.checked),
      disabled: o,
    }),
    u.createElement(B.Control, {
      plaintext: !0,
      readOnly: !0,
      value: f ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    o &&
      u.createElement(
        ne.Text,
        { className: "text-muted" },
        u.createElement("small", null, "Scanned"),
      ),
    u.createElement(mn, { onClick: () => r(l), disabled: d || o }),
  );
}
function hx(e) {
  switch (e) {
    case "NumberValue":
      return ax;
    case "EnumerationValue":
      return ux;
    case "BooleanValue":
      return cx;
    case "StringValue":
      return fx;
    case "PYONValue":
    default:
      return dx;
  }
}
function gx({ name: e, argInfo: t, value: n, onChange: r, onReset: o }) {
  const [l, i, s] = t,
    a = hx(l.ty),
    c = u.createElement(
      B.Label,
      { className: "mb-0", style: { fontWeight: 500 } },
      e,
    );
  return u.createElement(
    B.Group,
    { className: "mb-2 row align-items-center" },
    u.createElement(
      "div",
      { className: "col-4" },
      s
        ? u.createElement(
            xu,
            { placement: "right", overlay: u.createElement(pi, null, s) },
            u.createElement(
              "span",
              { style: { cursor: "help", borderBottom: "1px dotted #666" } },
              c,
            ),
          )
        : c,
    ),
    u.createElement(
      "div",
      { className: "col-8" },
      u.createElement(a, {
        name: e,
        spec: l,
        value: n,
        onChange: r,
        onReset: o,
      }),
    ),
  );
}
function yx(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o] = r;
    o && o.default !== void 0 && (t[n] = o.default);
  }
  return t;
}
function xx(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o, l] = r,
      i = l || "General";
    t[i] || (t[i] = []), t[i].push({ name: n, argData: r });
  }
  return t;
}
function wm(e, t) {
  return `artiq_exp_state_${e}_${t}`;
}
function Sm(e, t, n) {
  const r = wm(e, t);
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch (o) {
    console.error("Error saving experiment state to localStorage:", o);
  }
}
function Ys(e, t) {
  const n = wm(e, t);
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
function Ex(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    i = u.useMemo(() => yx(o), [o]),
    [s, a] = u.useState(() => {
      const C = Ys(n, r);
      return C ? C.argValues : i;
    }),
    [c, f] = u.useState(() => {
      const C = Ys(n, r);
      return C ? C.pipeline : "main";
    }),
    [d, v] = u.useState(!1),
    [y, x] = u.useState("");
  u.useEffect(() => {
    Sm(n, r, { argValues: s, pipeline: c });
  }, [n, r, s, c]);
  const w = u.useMemo(() => xx(o), [o]),
    k = o && Object.keys(o).length > 0,
    m = (C, O) => {
      a((j) => ({ ...j, [C]: O }));
    },
    p = (C) => {
      a((O) => ({ ...O, [C]: i[C] }));
    },
    h = () => {
      a(i);
    },
    S = (C) => {
      x(C), v(!0);
    },
    E = (C, O) =>
      u.createElement(
        "tr",
        { key: C },
        u.createElement("td", null, u.createElement("b", null, C, ":")),
        u.createElement("td", null, O),
      ),
    N = () => s;
  return u.createElement(
    ye,
    { className: "shadow-sm border-0" },
    u.createElement(
      ye.Header,
      { className: "bg-primary text-white py-3" },
      u.createElement(
        "div",
        { className: "d-flex justify-content-between align-items-center" },
        u.createElement("h5", { className: "mb-0" }, r),
        u.createElement("small", { className: "opacity-75" }, n),
      ),
    ),
    u.createElement(
      ye.Body,
      { className: "p-4" },
      u.createElement(
        Bl,
        { striped: !0, bordered: !0, hover: !0, size: "sm", className: "mb-4" },
        u.createElement(
          "tbody",
          null,
          E("Name", t),
          E("Class name", r),
          E("File", n),
        ),
      ),
      k &&
        u.createElement(
          "div",
          { className: "mt-4" },
          u.createElement(
            "div",
            {
              className:
                "d-flex justify-content-between align-items-center mb-3",
            },
            u.createElement("h6", { className: "mb-0 fw-bold" }, "Arguments"),
            u.createElement(
              be,
              { variant: "outline-primary", size: "sm", onClick: h },
              "Reset All to Defaults",
            ),
          ),
          Object.entries(w).map(([C, O]) =>
            u.createElement(
              ye,
              {
                key: C,
                className:
                  "mb-3 border-secondary shadow-none bg-secondary bg-opacity-10",
              },
              u.createElement(
                ye.Header,
                {
                  className: "py-2 px-3 bg-secondary bg-opacity-25",
                  style: { fontSize: "0.9em", fontWeight: 600 },
                },
                C,
              ),
              u.createElement(
                ye.Body,
                { className: "py-3 px-3" },
                O.map(({ name: j, argData: L }) =>
                  u.createElement(gx, {
                    key: j,
                    name: j,
                    argInfo: L,
                    value: s[j],
                    onChange: m,
                    onReset: p,
                  }),
                ),
              ),
            ),
          ),
        ),
      u.createElement(
        B.Group,
        { className: "mt-4 mb-3" },
        u.createElement(B.Label, { className: "fw-bold" }, "Pipeline"),
        u.createElement(B.Control, {
          type: "text",
          value: c,
          onChange: (C) => f(C.target.value),
          placeholder: "main",
        }),
        u.createElement(
          B.Text,
          { className: "text-muted" },
          "Specify which pipeline to submit to (default: main)",
        ),
      ),
      u.createElement(
        "div",
        { className: "d-grid mt-4" },
        u.createElement(rm, {
          file: n,
          class_name: r,
          repo_rev: l,
          arguments: N(),
          pipeline: c,
          onError: S,
          className: "btn-lg",
        }),
      ),
      u.createElement(
        uu,
        { position: "bottom-end", className: "p-3" },
        u.createElement(
          rr,
          {
            show: d,
            onClose: () => v(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          u.createElement(
            rr.Header,
            null,
            u.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          u.createElement(rr.Body, { className: "text-white" }, y),
        ),
      ),
    ),
  );
}
const wx = { bg: "primary", pill: !1 },
  Eu = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        bg: t,
        pill: n,
        text: r,
        className: o,
        as: l = "span",
        ...i
      },
      s,
    ) => {
      const a = H(e, "badge");
      return _.exports.jsx(l, {
        ref: s,
        ...i,
        className: I(
          o,
          a,
          n && "rounded-pill",
          r && `text-${r}`,
          t && `bg-${t}`,
        ),
      });
    },
  );
Eu.displayName = "Badge";
Eu.defaultProps = wx;
function Sx({ scan: e, schemata: t, onChange: n }) {
  const {
      axes: r = [],
      num_repeats: o = 1,
      no_axes_mode: l = "single",
      randomise_order_globally: i = !1,
      skip_on_persistent_transitory_error: s = !1,
    } = e,
    a = u.useMemo(
      () =>
        t ? Object.values(t).filter((E) => E.spec && E.spec.is_scannable) : [],
      [t],
    ),
    c = new Set(r.map((E) => E.fqn).filter(Boolean)),
    f = () => {
      const E = {
        fqn: "",
        path: "",
        type: "linear",
        range: { start: 0, stop: 100, num_points: 11, randomise_order: !1 },
      };
      n({ ...e, axes: [...r, E] });
    },
    d = (E) => {
      const N = r.filter((C, O) => O !== E);
      n({ ...e, axes: N });
    },
    v = (E, N, C) => {
      const O = [...r];
      if (N === "fqn") {
        const j = t[C];
        O[E] = { ...O[E], fqn: C, path: j ? y() : "" };
      } else if (N.startsWith("range.")) {
        const j = N.split(".")[1];
        O[E] = { ...O[E], range: { ...O[E].range, [j]: C } };
      } else O[E] = { ...O[E], [N]: C };
      n({ ...e, axes: O });
    },
    y = (E) => "",
    x = (E) => {
      n({ ...e, num_repeats: E });
    },
    w = (E) => {
      n({ ...e, num_repeats: E ? 2147483647 : 1 });
    },
    k = (E) => {
      n({ ...e, no_axes_mode: E });
    },
    m = (E) => {
      n({ ...e, randomise_order_globally: E });
    },
    p = (E) => {
      n({ ...e, skip_on_persistent_transitory_error: E });
    },
    h = u.useMemo(
      () =>
        r.length === 0
          ? o
          : r.reduce((E, N) => {
              var O;
              const C = ((O = N.range) == null ? void 0 : O.num_points) || 1;
              return E * C;
            }, 1) * o,
      [r, o],
    ),
    S = o === 2147483647;
  return u.createElement(
    ye,
    { className: "mb-3" },
    u.createElement(
      ye.Header,
      { className: "d-flex justify-content-between align-items-center" },
      u.createElement("span", null, "Scan Configuration"),
      u.createElement(
        Eu,
        { bg: r.length === 0 ? "secondary" : "primary" },
        r.length,
        "D scan, ",
        S ? "\u221E" : h,
        " points",
      ),
    ),
    u.createElement(
      ye.Body,
      null,
      u.createElement("h6", null, "Scan Axes"),
      r.length === 0
        ? u.createElement(
            "p",
            { className: "text-muted small" },
            'No scan axes defined. Click "Add Scan Axis" to create one.',
          )
        : r.map((E, N) => {
            var J, Q, q, A, te, re;
            const C = E.fqn ? t[E.fqn] : null,
              O =
                ((J = C == null ? void 0 : C.spec) == null ? void 0 : J.unit) ||
                "",
              j =
                ((Q = C == null ? void 0 : C.spec) == null
                  ? void 0
                  : Q.scale) || 1,
              L = yt((q = E.range) == null ? void 0 : q.start, j),
              U = yt((A = E.range) == null ? void 0 : A.stop, j);
            return u.createElement(
              ye,
              { key: N, className: "mb-2" },
              u.createElement(
                ye.Body,
                { className: "py-2 px-3" },
                u.createElement(
                  qt,
                  { className: "mb-2" },
                  u.createElement(
                    He,
                    null,
                    u.createElement(
                      B.Label,
                      { className: "mb-1 small" },
                      "Parameter",
                    ),
                    u.createElement(
                      B.Select,
                      {
                        size: "sm",
                        value: E.fqn || "",
                        onChange: (R) => v(N, "fqn", R.target.value),
                      },
                      u.createElement(
                        "option",
                        { value: "" },
                        "Select parameter...",
                      ),
                      a.map((R) =>
                        u.createElement(
                          "option",
                          {
                            key: R.fqn,
                            value: R.fqn,
                            disabled: c.has(R.fqn) && E.fqn !== R.fqn,
                          },
                          R.description || R.fqn,
                        ),
                      ),
                    ),
                  ),
                  u.createElement(
                    He,
                    { xs: "auto", className: "d-flex align-items-end" },
                    u.createElement(
                      be,
                      {
                        variant: "outline-danger",
                        size: "sm",
                        onClick: () => d(N),
                      },
                      "Remove",
                    ),
                  ),
                ),
                u.createElement(
                  qt,
                  { className: "g-2" },
                  u.createElement(
                    He,
                    null,
                    u.createElement(
                      B.Label,
                      { className: "mb-1 small" },
                      "Start",
                    ),
                    u.createElement(
                      ne,
                      { size: "sm" },
                      u.createElement(B.Control, {
                        type: "number",
                        value: L,
                        onChange: (R) => {
                          const D = Hl(R.target.value, j);
                          v(N, "range.start", D);
                        },
                        step: "any",
                      }),
                      O && u.createElement(ne.Text, null, O),
                    ),
                  ),
                  u.createElement(
                    He,
                    null,
                    u.createElement(
                      B.Label,
                      { className: "mb-1 small" },
                      "Stop",
                    ),
                    u.createElement(
                      ne,
                      { size: "sm" },
                      u.createElement(B.Control, {
                        type: "number",
                        value: U,
                        onChange: (R) => {
                          const D = Hl(R.target.value, j);
                          v(N, "range.stop", D);
                        },
                        step: "any",
                      }),
                      O && u.createElement(ne.Text, null, O),
                    ),
                  ),
                  u.createElement(
                    He,
                    null,
                    u.createElement(
                      B.Label,
                      { className: "mb-1 small" },
                      "Points",
                    ),
                    u.createElement(B.Control, {
                      type: "number",
                      size: "sm",
                      value:
                        ((te = E.range) == null ? void 0 : te.num_points) || 11,
                      onChange: (R) =>
                        v(N, "range.num_points", parseInt(R.target.value)),
                      min: "1",
                      step: "1",
                    }),
                  ),
                ),
                u.createElement(B.Check, {
                  type: "checkbox",
                  className: "mt-2",
                  label: "Randomize order (this axis)",
                  checked:
                    ((re = E.range) == null ? void 0 : re.randomise_order) ||
                    !1,
                  onChange: (R) =>
                    v(N, "range.randomise_order", R.target.checked),
                }),
              ),
            );
          }),
      u.createElement(
        be,
        {
          variant: "outline-primary",
          size: "sm",
          onClick: f,
          className: "mb-3",
        },
        "+ Add Scan Axis",
      ),
      u.createElement("h6", { className: "mt-3" }, "Global Settings"),
      u.createElement(
        qt,
        { className: "g-2 mb-2" },
        u.createElement(
          He,
          { md: 6 },
          u.createElement(
            B.Label,
            { className: "mb-1 small" },
            "Number of Repeats",
          ),
          u.createElement(
            ne,
            { size: "sm" },
            u.createElement(B.Control, {
              type: "number",
              value: S ? "" : o,
              onChange: (E) => x(parseInt(E.target.value) || 1),
              min: "1",
              step: "1",
              disabled: S,
              placeholder: S ? "Infinite" : "",
            }),
            u.createElement(ne.Checkbox, {
              checked: S,
              onChange: (E) => w(E.target.checked),
            }),
            u.createElement(ne.Text, null, "Infinite"),
          ),
        ),
        u.createElement(
          He,
          { md: 6 },
          u.createElement(B.Label, { className: "mb-1 small" }, "No-Axes Mode"),
          u.createElement(
            B.Select,
            { size: "sm", value: l, onChange: (E) => k(E.target.value) },
            u.createElement("option", { value: "single" }, "Single"),
            u.createElement("option", { value: "repeat" }, "Repeat"),
          ),
        ),
      ),
      u.createElement(B.Check, {
        type: "checkbox",
        label: "Randomize order globally",
        checked: i,
        onChange: (E) => m(E.target.checked),
        className: "mb-1",
      }),
      u.createElement(B.Check, {
        type: "checkbox",
        label: "Skip on persistent/transitory error",
        checked: s,
        onChange: (E) => p(E.target.checked),
      }),
    ),
  );
}
function kx(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    i = u.useMemo(() => Oy(o), [o]),
    s = i.schemata,
    [a, c] = u.useState({}),
    [f, d] = u.useState(null);
  u.useState(!1);
  const [v, y] = u.useState(new Set()),
    [x, w] = u.useState(!0),
    [k, m] = u.useState(""),
    [p, h] = u.useState(!1),
    [S, E] = u.useState(""),
    [N, C] = u.useState(() => {
      const T = Ys(n, r);
      return T ? T.pipeline : "main";
    }),
    O = (T) => {
      y((F) => new Set([...F, T]));
    },
    j = (T) => {
      y((F) => {
        const z = new Set(F);
        return z.delete(T), z;
      });
    };
  u.useEffect(() => {
    if (i) {
      const T = Ty(n, r);
      (() =>
        (i.always_shown || []).map((z) =>
          z && z.__jsonclass__ && z.__jsonclass__[0] === "tuple"
            ? z.__jsonclass__[1][0][0]
            : (console.error("Unexpected always_shown item format:", z), ""),
        ))(),
        T && T.visibleFqns ? y(new Set(T.visibleFqns)) : y(new Set()),
        T ? (c(T.overrides || {}), d(T.scan || i.scan)) : (c({}), d(i.scan));
    }
  }, [i, n, r]),
    u.useEffect(() => {
      f &&
        (Py(n, r, {
          overrides: a,
          scan: f,
          visibleFqns: [...v],
          useDefaultVisibility: x,
        }),
        Sm(n, r, { pipeline: N }));
    }, [a, f, n, r, v, x, N]);
  const L = u.useMemo(() => (i ? _y(i.instances) : {}), [i]),
    U = u.useMemo(() => (f ? Ry(f) : new Set()), [f]),
    J = (T, F) => {
      c((z) => ({ ...z, [T]: F }));
    },
    Q = (T) => {
      c((F) => {
        const z = { ...F };
        return delete z[T], z;
      });
    },
    q = (T) => {
      d(T);
    },
    A = () => {
      i && (c({}), d(i.scan), localStorage.removeItem(cu(n, r)));
    },
    te = (T) => {
      E(T), h(!0);
    },
    re = (T, F) =>
      u.createElement(
        "tr",
        { key: T },
        u.createElement("td", null, u.createElement("b", null, T, ":")),
        u.createElement("td", null, F),
      ),
    R = (T, F) => {
      const { description: z, type: V } = F,
        ae = U.has(T),
        Re = a[T];
      let Te;
      if (V === "float") Te = px;
      else if (V === "int") Te = mx;
      else if (V === "bool") Te = vx;
      else return null;
      return u.createElement(
        B.Group,
        { key: T, className: "mb-2 row align-items-center" },
        u.createElement(
          "div",
          { className: "col-4" },
          u.createElement(
            B.Label,
            { className: "mb-0", style: { fontWeight: 500 } },
            z || T,
          ),
        ),
        u.createElement(
          "div",
          { className: "col-8" },
          u.createElement(Te, {
            schema: F,
            value: Re,
            onChange: J,
            onReset: Q,
            disabled: ae,
          }),
        ),
      );
    },
    D = () => {
      if (i) {
        const T = new Set(Object.keys(a)),
          F = [...U].filter((z) => T.has(z));
        return F.length > 0
          ? (te(
              `Parameters cannot be both overridden and scanned: ${F.join(
                ", ",
              )}`,
            ),
            null)
          : jy(i, a, f, L, v);
      }
      return {};
    };
  if (!i) return null;
  const M = (i.always_shown || []).map((T) =>
    Array.isArray(T)
      ? T[0]
      : T && T.__jsonclass__ && T.__jsonclass__[0] === "tuple"
        ? T.__jsonclass__[1][0][0]
        : T,
  );
  k &&
    Object.entries(s)
      .filter(
        ([T, F]) =>
          T.toLowerCase().includes(k.toLowerCase()) ||
          (F.description &&
            F.description.toLowerCase().includes(k.toLowerCase())),
      )
      .map(([T, F]) => T);
  const b = new Set([...(x ? M : []), ...v]),
    W = Object.entries(s).filter(([T, F]) => b.has(T));
  return (
    console.log("Filtered parameters:", W),
    u.createElement(
      ye,
      { className: "shadow-sm border-0" },
      u.createElement(
        ye.Header,
        { className: "bg-primary text-white py-3" },
        u.createElement(
          "div",
          { className: "d-flex justify-content-between align-items-center" },
          u.createElement(
            "h5",
            { className: "mb-0" },
            r,
            " ",
            u.createElement(
              "span",
              {
                className: "badge bg-info ms-2 small",
                style: { fontSize: "0.6em" },
              },
              "NDScan",
            ),
          ),
          u.createElement("small", { className: "opacity-75" }, n),
        ),
      ),
      u.createElement(
        ye.Body,
        { className: "p-4" },
        u.createElement(
          Bl,
          {
            striped: !0,
            bordered: !0,
            hover: !0,
            size: "sm",
            className: "mb-4",
          },
          u.createElement(
            "tbody",
            null,
            re("Name", t),
            re("Class name", r),
            re("File", n),
          ),
        ),
        u.createElement(
          "div",
          { className: "mt-3" },
          u.createElement(
            "div",
            {
              className:
                "d-flex justify-content-between align-items-center mb-2",
            },
            u.createElement("h6", { className: "mb-0" }, "NDScan Parameters"),
            u.createElement(B.Check, {
              type: "switch",
              label: "Use Always Shown defaults",
              checked: x,
              onChange: (T) => {
                w(T.target.checked);
              },
              size: "sm",
              className: "small",
            }),
          ),
          u.createElement(
            ye,
            { className: "mb-3 parameter-adder" },
            u.createElement(
              ye.Body,
              { className: "p-2" },
              u.createElement(
                B.Label,
                { className: "small fw-bold" },
                "Add / Toggle Parameters",
              ),
              u.createElement(
                ne,
                { size: "sm", className: "mb-2" },
                u.createElement(ne.Text, null, "\u{1F50D}"),
                u.createElement(B.Control, {
                  placeholder:
                    "Search available parameters by FQN or Description...",
                  value: k,
                  onChange: (T) => m(T.target.value),
                  onKeyDown: (T) => {
                    T.key === "Escape" && m("");
                  },
                }),
              ),
              u.createElement(
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
                    return W.length === 0
                      ? u.createElement(
                          "div",
                          { className: "p-2 text-center text-muted small" },
                          "No parameters found",
                        )
                      : W.map(([T, F]) =>
                          u.createElement(
                            "div",
                            {
                              key: T,
                              className:
                                "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                              style: {
                                backgroundColor: v.has(T)
                                  ? "#e7f1ff"
                                  : "transparent",
                              },
                              onClick: () => {
                                window.innerWidth < 768 &&
                                  (v.has(T) ? j(T) : O(T));
                              },
                            },
                            u.createElement(
                              "div",
                              {
                                className: "text-truncate",
                                style: { maxWidth: "70%" },
                              },
                              u.createElement("strong", null, T),
                              u.createElement("br", null),
                              u.createElement(
                                "span",
                                { className: "text-muted" },
                                F.description,
                              ),
                            ),
                            u.createElement(
                              be,
                              {
                                size: "sm",
                                variant: v.has(T)
                                  ? "outline-danger"
                                  : "outline-primary",
                                onClick: (z) => {
                                  z.stopPropagation(), v.has(T) ? j(T) : O(T);
                                },
                                style: { padding: "0 0.5rem" },
                                className: "desktop-only",
                              },
                              v.has(T) ? "Hide" : "Show",
                            ),
                          ),
                        );
                  {
                    const T = {};
                    return (
                      console.log(s),
                      Object.entries(s).forEach(([F, z]) => {
                        const V = F.split("."),
                          ae = V.length > 1 ? V.slice(0, -1).join(".") : "Root";
                        T[ae] || (T[ae] = []), T[ae].push([F, z]);
                      }),
                      u.createElement(
                        Xe,
                        { flush: !0 },
                        Object.entries(T)
                          .sort(([F], [z]) => F.localeCompare(z))
                          .map(([F, z]) =>
                            u.createElement(
                              Xe.Item,
                              { key: F, eventKey: F },
                              u.createElement(
                                Xe.Header,
                                { className: "py-1" },
                                u.createElement(
                                  "small",
                                  { className: "fw-bold" },
                                  F,
                                ),
                                u.createElement(
                                  "small",
                                  { className: "text-muted ms-2" },
                                  "(",
                                  z.length,
                                  ")",
                                ),
                              ),
                              u.createElement(
                                Xe.Body,
                                { className: "p-0" },
                                z.map(([V, ae]) =>
                                  u.createElement(
                                    "div",
                                    {
                                      key: V,
                                      className:
                                        "p-1 px-2 d-flex justify-content-between align-items-center border-bottom small ndscan-param-row",
                                      style: {
                                        backgroundColor: v.has(V)
                                          ? "#e7f1ff"
                                          : "transparent",
                                      },
                                      onClick: () => {
                                        window.innerWidth < 768 &&
                                          (v.has(V) ? j(V) : O(V));
                                      },
                                    },
                                    u.createElement(
                                      "div",
                                      {
                                        className: "text-truncate",
                                        style: { maxWidth: "70%" },
                                      },
                                      u.createElement(
                                        "strong",
                                        null,
                                        V.split(".").pop(),
                                      ),
                                      u.createElement("br", null),
                                      u.createElement(
                                        "span",
                                        { className: "text-muted" },
                                        ae.description,
                                      ),
                                    ),
                                    u.createElement(
                                      be,
                                      {
                                        size: "sm",
                                        variant: v.has(V)
                                          ? "outline-danger"
                                          : "outline-primary",
                                        onClick: (Re) => {
                                          Re.stopPropagation(),
                                            v.has(V) ? j(V) : O(V);
                                        },
                                        style: { padding: "0 0.5rem" },
                                        className: "desktop-only",
                                      },
                                      v.has(V) ? "Hide" : "Show",
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
          b.size === 0 &&
            u.createElement(
              "div",
              {
                className:
                  "text-center p-3 border rounded bg-secondary bg-opacity-25 text-muted small mb-3",
              },
              "No parameters are currently visible. Use the search above to add parameters.",
            ),
          b.size > 0 &&
            Array.from(b).map((T) => {
              const F = s[T];
              return F
                ? u.createElement(
                    "div",
                    {
                      key: T,
                      className:
                        "ndscan-param-row border-bottom py-2 px-1 d-flex align-items-start",
                    },
                    u.createElement(
                      "div",
                      { className: "flex-grow-1" },
                      R(T, F),
                    ),
                    u.createElement(
                      be,
                      {
                        variant: "link",
                        size: "sm",
                        className: "text-muted p-0 ms-2",
                        onClick: () => j(T),
                        title: "Hide parameter",
                      },
                      "\u2715",
                    ),
                  )
                : null;
            }),
          f && u.createElement(Sx, { scan: f, schemata: s, onChange: q }),
          u.createElement(
            be,
            {
              variant: "outline-secondary",
              size: "sm",
              onClick: A,
              className: "mb-3",
            },
            "Reset All to Defaults",
          ),
        ),
        u.createElement(
          B.Group,
          { className: "mt-3 mb-2" },
          u.createElement(B.Label, null, "Pipeline"),
          u.createElement(B.Control, {
            type: "text",
            value: N,
            onChange: (T) => C(T.target.value),
            placeholder: "main",
          }),
          u.createElement(
            B.Text,
            { className: "text-muted" },
            "Specify which pipeline to submit to (default: main)",
          ),
        ),
        u.createElement(
          "div",
          { className: "d-grid mt-4" },
          u.createElement(rm, {
            file: n,
            class_name: r,
            repo_rev: l,
            arguments: D(),
            pipeline: N,
            onError: te,
            className: "btn-lg",
          }),
        ),
        u.createElement(
          uu,
          { position: "bottom-end", className: "p-3" },
          u.createElement(
            rr,
            {
              show: p,
              onClose: () => h(!1),
              delay: 5e3,
              autohide: !0,
              bg: "danger",
            },
            u.createElement(
              rr.Header,
              null,
              u.createElement(
                "strong",
                { className: "me-auto" },
                "Submission Error",
              ),
            ),
            u.createElement(rr.Body, { className: "text-white" }, S),
          ),
        ),
      ),
    )
  );
}
function Cx({
  tree: e,
  repo_rev: t,
  searchTerm: n,
  onSelect: r,
  selectedExperiment: o,
}) {
  return u.createElement(
    "div",
    { className: "experiment-tree" },
    u.createElement(Xs, {
      node: e,
      repo_rev: t,
      searchTerm: n,
      isRoot: !0,
      onSelect: r,
      selectedExperiment: o,
    }),
  );
}
function Xs({
  node: e,
  name: t,
  repo_rev: n,
  searchTerm: r,
  isRoot: o,
  path: l = "",
  onSelect: i,
  selectedExperiment: s,
}) {
  const c = `experimentTree_${l || "root"}`,
    f = () => {
      if (r) return !0;
      const x = localStorage.getItem(c);
      return x !== null ? x === "true" : !1;
    },
    [d, v] = u.useState(f);
  if (
    (u.useEffect(() => {
      if (r) v(!0);
      else {
        const x = localStorage.getItem(c);
        x !== null && v(x === "true");
      }
    }, [r, c]),
    u.useEffect(() => {
      r || localStorage.setItem(c, d.toString());
    }, [d, c, r]),
    e.experiment)
  ) {
    const x = s === e;
    return u.createElement(
      "div",
      {
        className: `experiment-item px-2 py-1 mb-1 rounded cursor-pointer ${
          x ? "list-group-item-action active" : "hover-bg-light"
        }`,
        onClick: () => i(e),
        style: { cursor: "pointer", transition: "background-color 0.2s" },
      },
      u.createElement("span", { className: "me-2" }, "\u{1F4C4}"),
      u.createElement(
        "span",
        { className: "class-name fw-bold" },
        e.experiment.class_name,
      ),
      u.createElement(
        "span",
        {
          className: "ms-2 text-muted small",
          style: { color: x ? "#eee" : "#6c757d" },
        },
        e.experiment.file,
      ),
    );
  }
  const y = Object.keys(e).sort((x, w) => {
    const k = !e[x].experiment,
      m = !e[w].experiment;
    return k && !m ? -1 : !k && m ? 1 : x.localeCompare(w);
  });
  return o
    ? u.createElement(
        "div",
        null,
        y.map((x) =>
          u.createElement(Xs, {
            key: x,
            name: x,
            node: e[x],
            repo_rev: n,
            searchTerm: r,
            isRoot: !1,
            path: x,
            onSelect: i,
            selectedExperiment: s,
          }),
        ),
      )
    : u.createElement(
        "div",
        { className: "ms-3 mb-1" },
        u.createElement(
          "div",
          {
            className:
              "experiment-folder d-flex align-items-center fw-bold py-1 px-2 rounded hover-bg-light",
            onClick: () => v(!d),
            style: { cursor: "pointer" },
          },
          u.createElement(
            "span",
            {
              className: "folder-icon me-2",
              style: { width: "1em", textAlign: "center" },
            },
            d ? "\u25BC" : "\u25B6",
          ),
          u.createElement("span", { className: "me-2" }, "\u{1F4C1}"),
          t,
        ),
        d &&
          u.createElement(
            "div",
            { className: "mt-1" },
            y.map((x) =>
              u.createElement(Xs, {
                key: x,
                name: x,
                node: e[x],
                repo_rev: n,
                searchTerm: r,
                path: `${l}/${x}`,
                isRoot: !1,
                onSelect: i,
                selectedExperiment: s,
              }),
            ),
          ),
      );
}
const Nx = 1e4;
function Ox(e, t) {
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
        const i = l.file.split(/[/\\]/);
        let s = n;
        i.forEach((a, c) => {
          if (c === i.length - 1) {
            const f = `${a} : ${l.class_name}`;
            s[f] = { experiment: l };
          } else s[a] || (s[a] = {}), (s = s[a]);
        });
      }),
    n
  );
}
function _x({ onSelect: e, selectedExperiment: t }) {
  const [n, r] = u.useState({}),
    [o, l] = u.useState(""),
    i = "experiments" in n ? n.experiments : [],
    s = "repo_rev" in n ? n.repo_rev : null;
  u.useEffect(() => {
    const f = () => {
      Bg()
        .then(r)
        .catch((v) =>
          console.error("Experiment list update error:", v.message),
        );
    };
    f();
    const d = setInterval(f, Nx);
    return () => clearInterval(d);
  }, []);
  const a = u.useMemo(() => Ox(i, o), [i, o]),
    c = (f) => {
      e && e(f, s);
    };
  return u.createElement(
    "div",
    null,
    u.createElement(
      "div",
      {
        className:
          "experiment-browser-container border rounded p-3 bg-secondary bg-opacity-10",
      },
      u.createElement(
        ne,
        { className: "mb-4" },
        u.createElement(ne.Text, null, "\u{1F50D}"),
        u.createElement(B.Control, {
          placeholder: "Search experiments by name, class, or file...",
          value: o,
          onChange: (f) => l(f.target.value),
          onKeyDown: (f) => {
            f.key === "Escape" && l("");
          },
        }),
        o &&
          u.createElement(
            "button",
            { className: "btn btn-outline-secondary", onClick: () => l("") },
            "\u2715",
          ),
      ),
      u.createElement(
        "div",
        {
          className: "experiment-tree-scroll",
          style: { maxHeight: "400px", overflowY: "auto" },
        },
        i.length === 0
          ? u.createElement(
              "div",
              { className: "text-center p-5 text-muted" },
              "Loading experiments...",
            )
          : Object.keys(a).length === 0
            ? u.createElement(
                "div",
                { className: "text-center p-5 text-muted" },
                "No experiments match your search.",
              )
            : u.createElement(Cx, {
                tree: a,
                repo_rev: s,
                searchTerm: o,
                onSelect: c,
                selectedExperiment: t,
              }),
      ),
    ),
  );
}
function Rx({ experiment: e, repo_rev: t }) {
  if (!e)
    return u.createElement(
      ye,
      { className: "mt-4 shadow-sm border-0 bg-secondary bg-opacity-10" },
      u.createElement(
        ye.Body,
        { className: "text-center p-5 text-muted" },
        u.createElement("h5", null, "No experiment selected"),
        u.createElement(
          "p",
          null,
          "Select an experiment from the browser above to configure and submit it.",
        ),
      ),
    );
  const { experiment: n } = e,
    r = Ny(n.arginfo) ? kx : Ex;
  return u.createElement(
    "div",
    { className: "mt-4" },
    u.createElement(
      "div",
      { className: "submission-form-container" },
      u.createElement(r, { data: n, repo_rev: t }),
    ),
  );
}
function Tx(e) {
  var t = g.exports.useRef(null);
  return (
    g.exports.useEffect(function () {
      t.current = e;
    }),
    t.current
  );
}
const Px = ["onKeyDown"];
function jx(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Lx(e) {
  return !e || e.trim() === "#";
}
const km = g.exports.forwardRef((e, t) => {
  let { onKeyDown: n } = e,
    r = jx(e, Px);
  const [o] = eu(Object.assign({ tagName: "a" }, r)),
    l = je((i) => {
      o.onKeyDown(i), n == null || n(i);
    });
  return Lx(r.href) || r.role === "button"
    ? _.exports.jsx("a", Object.assign({ ref: t }, r, o, { onKeyDown: l }))
    : _.exports.jsx("a", Object.assign({ ref: t }, r, { onKeyDown: n }));
});
km.displayName = "Anchor";
const Cm = fi("h4");
Cm.displayName = "DivStyledAsH4";
const $x = ke("alert-heading", { Component: Cm }),
  Dx = ke("alert-link", { Component: km }),
  Mx = {
    variant: "primary",
    show: !0,
    transition: Bt,
    closeLabel: "Close alert",
  },
  wu = g.exports.forwardRef((e, t) => {
    const {
        bsPrefix: n,
        show: r,
        closeLabel: o,
        closeVariant: l,
        className: i,
        children: s,
        variant: a,
        onClose: c,
        dismissible: f,
        transition: d,
        ...v
      } = Lp(e, { show: "onClose" }),
      y = H(n, "alert"),
      x = je((m) => {
        c && c(!1, m);
      }),
      w = d === !0 ? Bt : d,
      k = _.exports.jsxs("div", {
        role: "alert",
        ...(w ? void 0 : v),
        ref: t,
        className: I(i, y, a && `${y}-${a}`, f && `${y}-dismissible`),
        children: [
          f && _.exports.jsx(Er, { onClick: x, "aria-label": o, variant: l }),
          s,
        ],
      });
    return w
      ? _.exports.jsx(w, {
          unmountOnExit: !0,
          ...v,
          ref: void 0,
          in: r,
          children: k,
        })
      : r
        ? k
        : null;
  });
wu.displayName = "Alert";
wu.defaultProps = Mx;
const Nm = Object.assign(wu, { Link: Dx, Heading: $x }),
  Su = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        variant: t,
        animation: n = "border",
        size: r,
        as: o = "div",
        className: l,
        ...i
      },
      s,
    ) => {
      e = H(e, "spinner");
      const a = `${e}-${n}`;
      return _.exports.jsx(o, {
        ref: s,
        ...i,
        className: I(l, a, r && `${a}-${r}`, t && `text-${t}`),
      });
    },
  );
Su.displayName = "Spinner";
var Fx = ["color", "size", "title", "className"];
function qs() {
  return (
    (qs = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    qs.apply(null, arguments)
  );
}
function Ix(e, t) {
  if (e == null) return {};
  var n,
    r,
    o = Ax(e, t);
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
function Ax(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
var Om = g.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    i = e.title,
    s = i === void 0 ? null : i,
    a = e.className,
    c = a === void 0 ? "" : a,
    f = Ix(e, Fx);
  return u.createElement(
    "svg",
    qs(
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
    s ? u.createElement("title", null, s) : null,
    u.createElement("path", {
      fillRule: "evenodd",
      d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708",
    }),
  );
});
Om.propTypes = {
  color: G.exports.string,
  size: G.exports.oneOfType([G.exports.string, G.exports.number]),
  title: G.exports.string,
  className: G.exports.string,
};
const zx = Om;
var Bx = ["color", "size", "title", "className"];
function Zs() {
  return (
    (Zs = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Zs.apply(null, arguments)
  );
}
function Ux(e, t) {
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
var _m = g.exports.forwardRef(function (e, t) {
  var n = e.color,
    r = n === void 0 ? "currentColor" : n,
    o = e.size,
    l = o === void 0 ? "1em" : o,
    i = e.title,
    s = i === void 0 ? null : i,
    a = e.className,
    c = a === void 0 ? "" : a,
    f = Ux(e, Bx);
  return u.createElement(
    "svg",
    Zs(
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
    s ? u.createElement("title", null, s) : null,
    u.createElement("path", {
      fillRule: "evenodd",
      d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708",
    }),
  );
});
_m.propTypes = {
  color: G.exports.string,
  size: G.exports.oneOfType([G.exports.string, G.exports.number]),
  title: G.exports.string,
  className: G.exports.string,
};
const Hx = _m;
function Wx(e) {
  const t = {};
  return (
    e.forEach((n) => {
      const r = n.split(".");
      let o = t;
      r.forEach((l, i) => {
        o[l] ||
          (o[l] = {
            isLeaf: i === r.length - 1,
            fullPath: r.slice(0, i + 1).join("."),
            children: {},
          }),
          (o = o[l].children);
      });
    }),
    t
  );
}
function ku({
  name: e,
  node: t,
  selectedDatasets: n,
  onSelect: r,
  level: o = 0,
}) {
  const [l, i] = g.exports.useState(o === 0),
    s = () => {
      t.isLeaf ? r(t.fullPath) : i(!l);
    },
    a = n.includes(t.fullPath);
  return (
    Object.keys(t.children).length > 0,
    u.createElement(
      "div",
      null,
      u.createElement(
        "div",
        {
          className: `dataset-tree-node ${a ? "selected" : ""} ${
            t.isLeaf ? "leaf" : "branch"
          }`,
          style: {
            paddingLeft: `${o * 20 + 8}px`,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "4px",
            marginBottom: "2px",
          },
          onClick: s,
        },
        !t.isLeaf &&
          u.createElement(
            "span",
            { className: "me-1" },
            l
              ? u.createElement(zx, { size: 14 })
              : u.createElement(Hx, { size: 14 }),
          ),
        t.isLeaf && u.createElement("span", { className: "me-2" }, "\u{1F4CA}"),
        u.createElement("span", null, e),
        !t.isLeaf &&
          u.createElement(
            "span",
            { className: "text-muted ms-2 small" },
            "(",
            Object.keys(t.children).length,
            ")",
          ),
      ),
      !t.isLeaf &&
        l &&
        u.createElement(
          "div",
          null,
          Object.entries(t.children).map(([c, f]) =>
            u.createElement(ku, {
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
ku.propTypes = {
  name: G.exports.string.isRequired,
  node: G.exports.object.isRequired,
  selectedDatasets: G.exports.array.isRequired,
  onSelect: G.exports.func.isRequired,
  level: G.exports.number,
};
function Rm({ datasetNames: e, selectedDatasets: t, onSelect: n }) {
  const r = Wx(e);
  return e.length === 0
    ? u.createElement(
        "div",
        { className: "text-muted" },
        "No datasets available",
      )
    : u.createElement(
        "div",
        { className: "dataset-tree" },
        Object.entries(r).map(([o, l]) =>
          u.createElement(ku, {
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
Rm.propTypes = {
  datasetNames: G.exports.array.isRequired,
  selectedDatasets: G.exports.array.isRequired,
  onSelect: G.exports.func.isRequired,
};
function Tm({ name: e, datasetData: t }) {
  if (!t) return u.createElement("div", { className: "text-muted" }, "No data");
  const [n, r, o] = t,
    l = (i) =>
      i == null
        ? u.createElement("span", { className: "text-muted" }, "null")
        : typeof i == "boolean"
          ? u.createElement("span", { className: "text-info" }, i.toString())
          : typeof i == "number"
            ? u.createElement("span", { className: "text-success" }, i)
            : typeof i == "string"
              ? u.createElement(
                  "span",
                  { className: "text-warning" },
                  '"',
                  i,
                  '"',
                )
              : Array.isArray(i)
                ? i.length === 0
                  ? u.createElement("span", { className: "text-muted" }, "[]")
                  : i.length <= 5
                    ? u.createElement(
                        "span",
                        null,
                        "[",
                        i.map((s, a) =>
                          u.createElement(
                            "span",
                            { key: a },
                            a > 0 && ", ",
                            l(s),
                          ),
                        ),
                        "]",
                      )
                    : u.createElement(
                        "details",
                        null,
                        u.createElement(
                          "summary",
                          null,
                          "Array (",
                          i.length,
                          " elements)",
                        ),
                        u.createElement(
                          "pre",
                          { className: "mt-2 p-2 bg-dark border rounded" },
                          JSON.stringify(i, null, 2),
                        ),
                      )
                : typeof i == "object"
                  ? u.createElement(
                      "details",
                      null,
                      u.createElement("summary", null, "Object"),
                      u.createElement(
                        "pre",
                        { className: "mt-2 p-2 bg-dark border rounded" },
                        JSON.stringify(i, null, 2),
                      ),
                    )
                  : u.createElement("span", null, String(i));
  return u.createElement(
    "div",
    { className: "dataset-value" },
    u.createElement(
      "div",
      { className: "mb-2" },
      u.createElement("strong", null, e),
      n &&
        u.createElement(
          "span",
          { className: "badge bg-secondary ms-2" },
          "persistent",
        ),
    ),
    u.createElement("div", { className: "ms-3" }, l(r)),
    o &&
      Object.keys(o).length > 0 &&
      u.createElement(
        "details",
        { className: "mt-2 ms-3" },
        u.createElement(
          "summary",
          { className: "text-muted small" },
          "Metadata",
        ),
        u.createElement(
          "pre",
          { className: "mt-1 p-2 bg-dark border rounded small" },
          JSON.stringify(o, null, 2),
        ),
      ),
  );
}
Tm.propTypes = {
  name: G.exports.string.isRequired,
  datasetData: G.exports.array,
};
function bx() {
  const [e, t] = g.exports.useState([]),
    [n, r] = g.exports.useState([]),
    [o, l] = g.exports.useState(""),
    [i, s] = g.exports.useState([]),
    [a, c] = g.exports.useState({}),
    [f, d] = g.exports.useState(!0),
    [v, y] = g.exports.useState(null);
  g.exports.useEffect(() => {
    const k = async () => {
      try {
        const p = await Ug();
        t(p.names), r(p.names), y(null);
      } catch (p) {
        y(`Failed to load datasets: ${p.message}`);
      } finally {
        d(!1);
      }
    };
    k();
    const m = setInterval(k, 5e3);
    return () => clearInterval(m);
  }, []),
    g.exports.useEffect(() => {
      if (o.trim() === "") r(e);
      else {
        const k = o.toLowerCase();
        r(e.filter((m) => m.toLowerCase().includes(k)));
      }
    }, [o, e]);
  const x = async (k) => {
      let m;
      if (i.includes(k)) {
        m = i.filter((h) => h !== k);
        const p = { ...a };
        delete p[k], c(p);
      } else {
        m = [...i, k];
        try {
          const p = await Vc([k]);
          c({ ...a, ...p });
        } catch (p) {
          y(`Failed to load dataset value: ${p.message}`);
        }
      }
      s(m);
    },
    w = async () => {
      if (i.length !== 0)
        try {
          const k = await Vc(i);
          c(k), y(null);
        } catch (k) {
          y(`Failed to refresh dataset values: ${k.message}`);
        }
    };
  return f
    ? u.createElement(
        "div",
        { className: "text-center p-4" },
        u.createElement(
          Su,
          { animation: "border", role: "status" },
          u.createElement(
            "span",
            { className: "visually-hidden" },
            "Loading...",
          ),
        ),
      )
    : u.createElement(
        "div",
        { className: "dataset-explorer" },
        v &&
          u.createElement(
            Nm,
            { variant: "danger", dismissible: !0, onClose: () => y(null) },
            v,
          ),
        u.createElement(
          B.Group,
          { className: "mb-3" },
          u.createElement(B.Control, {
            type: "text",
            placeholder: "Search datasets...",
            value: o,
            onChange: (k) => l(k.target.value),
          }),
        ),
        u.createElement(
          "div",
          { className: "row" },
          u.createElement(
            "div",
            { className: "col-md-6" },
            u.createElement("h5", null, "Available Datasets (", e.length, ")"),
            u.createElement(
              "div",
              {
                className: "border rounded p-2",
                style: { maxHeight: "500px", overflowY: "auto" },
              },
              u.createElement(Rm, {
                datasetNames: n,
                selectedDatasets: i,
                onSelect: x,
              }),
            ),
          ),
          u.createElement(
            "div",
            { className: "col-md-6" },
            u.createElement(
              "div",
              {
                className:
                  "d-flex justify-content-between align-items-center mb-2",
              },
              u.createElement("h5", null, "Selected Datasets (", i.length, ")"),
              u.createElement(
                "button",
                {
                  className: "btn btn-sm btn-outline-primary",
                  onClick: w,
                  disabled: i.length === 0,
                },
                "\u{1F504} Refresh",
              ),
            ),
            u.createElement(
              "div",
              {
                className: "border rounded p-3",
                style: { maxHeight: "500px", overflowY: "auto" },
              },
              i.length === 0
                ? u.createElement(
                    "div",
                    { className: "text-muted" },
                    "Click on a dataset to view its value",
                  )
                : i.map((k) =>
                    u.createElement(
                      "div",
                      { key: k, className: "mb-3 pb-3 border-bottom" },
                      u.createElement(Tm, { name: k, datasetData: a[k] }),
                    ),
                  ),
            ),
          ),
        ),
      );
}
var Jo;
function rf(e) {
  if (((!Jo && Jo !== 0) || e) && xr) {
    var t = document.createElement("div");
    (t.style.position = "absolute"),
      (t.style.top = "-9999px"),
      (t.style.width = "50px"),
      (t.style.height = "50px"),
      (t.style.overflow = "scroll"),
      document.body.appendChild(t),
      (Jo = t.offsetWidth - t.clientWidth),
      document.body.removeChild(t);
  }
  return Jo;
}
function bi(e) {
  e === void 0 && (e = yr());
  try {
    var t = e.activeElement;
    return !t || !t.nodeName ? null : t;
  } catch {
    return e.body;
  }
}
const Kx = "data-rr-ui-";
function Qx(e) {
  return `${Kx}${e}`;
}
function Gx(e = document) {
  const t = e.defaultView;
  return Math.abs(t.innerWidth - e.documentElement.clientWidth);
}
const of = Qx("modal-open");
class Cu {
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
    return Gx(this.ownerDocument);
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
        (n[r] = `${parseInt(jt(o, r) || "0", 10) + t.scrollBarWidth}px`),
      o.setAttribute(of, ""),
      jt(o, n);
  }
  reset() {
    [...this.modals].forEach((t) => this.remove(t));
  }
  removeContainerStyle(t) {
    const n = this.getElement();
    n.removeAttribute(of), Object.assign(n.style, t.style);
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
const Yx = [
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
function Xx(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
let Ki;
function qx(e) {
  return (
    Ki || (Ki = new Cu({ ownerDocument: e == null ? void 0 : e.document })), Ki
  );
}
function Zx(e) {
  const t = vm(),
    n = e || qx(t),
    r = g.exports.useRef({ dialog: null, backdrop: null });
  return Object.assign(r.current, {
    add: () => n.add(r.current),
    remove: () => n.remove(r.current),
    isTopModal: () => n.isTopModal(r.current),
    setDialogRef: g.exports.useCallback((o) => {
      r.current.dialog = o;
    }, []),
    setBackdropRef: g.exports.useCallback((o) => {
      r.current.backdrop = o;
    }, []),
  });
}
const Pm = g.exports.forwardRef((e, t) => {
  let {
      show: n = !1,
      role: r = "dialog",
      className: o,
      style: l,
      children: i,
      backdrop: s = !0,
      keyboard: a = !0,
      onBackdropClick: c,
      onEscapeKeyDown: f,
      transition: d,
      backdropTransition: v,
      autoFocus: y = !0,
      enforceFocus: x = !0,
      restoreFocus: w = !0,
      restoreFocusOptions: k,
      renderDialog: m,
      renderBackdrop: p = (Z) => _.exports.jsx("div", Object.assign({}, Z)),
      manager: h,
      container: S,
      onShow: E,
      onHide: N = () => {},
      onExit: C,
      onExited: O,
      onExiting: j,
      onEnter: L,
      onEntering: U,
      onEntered: J,
    } = e,
    Q = Xx(e, Yx);
  const q = Gs(S),
    A = Zx(h),
    te = iu(),
    re = Tx(n),
    [R, D] = g.exports.useState(!n),
    M = g.exports.useRef(null);
  g.exports.useImperativeHandle(t, () => A, [A]),
    xr && !re && n && (M.current = bi()),
    !d && !n && !R ? D(!0) : n && R && D(!1);
  const b = je(() => {
      if (
        (A.add(),
        (ae.current = Tt(document, "keydown", z)),
        (V.current = Tt(document, "focus", () => setTimeout(T), !0)),
        E && E(),
        y)
      ) {
        const Z = bi(document);
        A.dialog &&
          Z &&
          !ho(A.dialog, Z) &&
          ((M.current = Z), A.dialog.focus());
      }
    }),
    W = je(() => {
      if (
        (A.remove(),
        ae.current == null || ae.current(),
        V.current == null || V.current(),
        w)
      ) {
        var Z;
        (Z = M.current) == null || Z.focus == null || Z.focus(k),
          (M.current = null);
      }
    });
  g.exports.useEffect(() => {
    !n || !q || b();
  }, [n, q, b]),
    g.exports.useEffect(() => {
      !R || W();
    }, [R, W]),
    su(() => {
      W();
    });
  const T = je(() => {
      if (!x || !te() || !A.isTopModal()) return;
      const Z = bi();
      A.dialog && Z && !ho(A.dialog, Z) && A.dialog.focus();
    }),
    F = je((Z) => {
      Z.target === Z.currentTarget && (c == null || c(Z), s === !0 && N());
    }),
    z = je((Z) => {
      a &&
        Z.keyCode === 27 &&
        A.isTopModal() &&
        (f == null || f(Z), Z.defaultPrevented || N());
    }),
    V = g.exports.useRef(),
    ae = g.exports.useRef(),
    Re = (...Z) => {
      D(!0), O == null || O(...Z);
    },
    Te = d;
  if (!q || !(n || (Te && !R))) return null;
  const vn = Object.assign(
    {
      role: r,
      ref: A.setDialogRef,
      "aria-modal": r === "dialog" ? !0 : void 0,
    },
    Q,
    { style: l, className: o, tabIndex: -1 },
  );
  let it = m
    ? m(vn)
    : _.exports.jsx(
        "div",
        Object.assign({}, vn, {
          children: g.exports.cloneElement(i, { role: "document" }),
        }),
      );
  Te &&
    (it = _.exports.jsx(Te, {
      appear: !0,
      unmountOnExit: !0,
      in: !!n,
      onExit: C,
      onExiting: j,
      onExited: Re,
      onEnter: L,
      onEntering: U,
      onEntered: J,
      children: it,
    }));
  let Ut = null;
  if (s) {
    const Z = v;
    (Ut = p({ ref: A.setBackdropRef, onClick: F })),
      Z && (Ut = _.exports.jsx(Z, { appear: !0, in: !!n, children: Ut }));
  }
  return _.exports.jsx(_.exports.Fragment, {
    children: wn.createPortal(
      _.exports.jsxs(_.exports.Fragment, { children: [Ut, it] }),
      q,
    ),
  });
});
Pm.displayName = "Modal";
const Jx = Object.assign(Pm, { Manager: Cu });
function e1(e, t) {
  e.classList
    ? e.classList.add(t)
    : gm(e, t) ||
      (typeof e.className == "string"
        ? (e.className = e.className + " " + t)
        : e.setAttribute(
            "class",
            ((e.className && e.className.baseVal) || "") + " " + t,
          ));
}
var t1 = Function.prototype.bind.call(Function.prototype.call, [].slice);
function In(e, t) {
  return t1(e.querySelectorAll(t));
}
function lf(e, t) {
  return e
    .replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1")
    .replace(/\s+/g, " ")
    .replace(/^\s*|\s*$/g, "");
}
function n1(e, t) {
  e.classList
    ? e.classList.remove(t)
    : typeof e.className == "string"
      ? (e.className = lf(e.className, t))
      : e.setAttribute(
          "class",
          lf((e.className && e.className.baseVal) || "", t),
        );
}
const An = {
  FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
  STICKY_CONTENT: ".sticky-top",
  NAVBAR_TOGGLER: ".navbar-toggler",
};
class r1 extends Cu {
  adjustAndStore(t, n, r) {
    const o = n.style[t];
    (n.dataset[t] = o), jt(n, { [t]: `${parseFloat(jt(n, t)) + r}px` });
  }
  restore(t, n) {
    const r = n.dataset[t];
    r !== void 0 && (delete n.dataset[t], jt(n, { [t]: r }));
  }
  setContainerStyle(t) {
    super.setContainerStyle(t);
    const n = this.getElement();
    if ((e1(n, "modal-open"), !t.scrollBarWidth)) return;
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    In(n, An.FIXED_CONTENT).forEach((l) =>
      this.adjustAndStore(r, l, t.scrollBarWidth),
    ),
      In(n, An.STICKY_CONTENT).forEach((l) =>
        this.adjustAndStore(o, l, -t.scrollBarWidth),
      ),
      In(n, An.NAVBAR_TOGGLER).forEach((l) =>
        this.adjustAndStore(o, l, t.scrollBarWidth),
      );
  }
  removeContainerStyle(t) {
    super.removeContainerStyle(t);
    const n = this.getElement();
    n1(n, "modal-open");
    const r = this.isRTL ? "paddingLeft" : "paddingRight",
      o = this.isRTL ? "marginLeft" : "marginRight";
    In(n, An.FIXED_CONTENT).forEach((l) => this.restore(r, l)),
      In(n, An.STICKY_CONTENT).forEach((l) => this.restore(o, l)),
      In(n, An.NAVBAR_TOGGLER).forEach((l) => this.restore(o, l));
  }
}
let Qi;
function o1(e) {
  return Qi || (Qi = new r1(e)), Qi;
}
const l1 = ke("modal-body"),
  jm = g.exports.createContext({ onHide() {} }),
  Nu = g.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        contentClassName: n,
        centered: r,
        size: o,
        fullscreen: l,
        children: i,
        scrollable: s,
        ...a
      },
      c,
    ) => {
      e = H(e, "modal");
      const f = `${e}-dialog`,
        d = typeof l == "string" ? `${e}-fullscreen-${l}` : `${e}-fullscreen`;
      return _.exports.jsx("div", {
        ...a,
        ref: c,
        className: I(
          f,
          t,
          o && `${e}-${o}`,
          r && `${f}-centered`,
          s && `${f}-scrollable`,
          l && d,
        ),
        children: _.exports.jsx("div", {
          className: I(`${e}-content`, n),
          children: i,
        }),
      });
    },
  );
Nu.displayName = "ModalDialog";
const i1 = ke("modal-footer"),
  s1 = { closeLabel: "Close", closeButton: !1 },
  Lm = g.exports.forwardRef(
    (
      {
        closeLabel: e,
        closeVariant: t,
        closeButton: n,
        onHide: r,
        children: o,
        ...l
      },
      i,
    ) => {
      const s = g.exports.useContext(jm),
        a = je(() => {
          s == null || s.onHide(), r == null || r();
        });
      return _.exports.jsxs("div", {
        ref: i,
        ...l,
        children: [
          o,
          n && _.exports.jsx(Er, { "aria-label": e, variant: t, onClick: a }),
        ],
      });
    },
  );
Lm.defaultProps = s1;
const a1 = { closeLabel: "Close", closeButton: !1 },
  Ou = g.exports.forwardRef(
    ({ bsPrefix: e, className: t, ...n }, r) => (
      (e = H(e, "modal-header")),
      _.exports.jsx(Lm, { ref: r, ...n, className: I(t, e) })
    ),
  );
Ou.displayName = "ModalHeader";
Ou.defaultProps = a1;
const u1 = fi("h4"),
  c1 = ke("modal-title", { Component: u1 }),
  f1 = {
    show: !1,
    backdrop: !0,
    keyboard: !0,
    autoFocus: !0,
    enforceFocus: !0,
    restoreFocus: !0,
    animation: !0,
    dialogAs: Nu,
  };
function d1(e) {
  return _.exports.jsx(Bt, { ...e, timeout: null });
}
function p1(e) {
  return _.exports.jsx(Bt, { ...e, timeout: null });
}
const _u = g.exports.forwardRef(
  (
    {
      bsPrefix: e,
      className: t,
      style: n,
      dialogClassName: r,
      contentClassName: o,
      children: l,
      dialogAs: i,
      "aria-labelledby": s,
      "aria-describedby": a,
      "aria-label": c,
      show: f,
      animation: d,
      backdrop: v,
      keyboard: y,
      onEscapeKeyDown: x,
      onShow: w,
      onHide: k,
      container: m,
      autoFocus: p,
      enforceFocus: h,
      restoreFocus: S,
      restoreFocusOptions: E,
      onEntered: N,
      onExit: C,
      onExiting: O,
      onEnter: j,
      onEntering: L,
      onExited: U,
      backdropClassName: J,
      manager: Q,
      ...q
    },
    A,
  ) => {
    const [te, re] = g.exports.useState({}),
      [R, D] = g.exports.useState(!1),
      M = g.exports.useRef(!1),
      b = g.exports.useRef(!1),
      W = g.exports.useRef(null),
      [T, F] = Wl(),
      z = Co(A, F),
      V = je(k),
      ae = Ga();
    e = H(e, "modal");
    const Re = g.exports.useMemo(() => ({ onHide: V }), [V]);
    function Te() {
      return Q || o1({ isRTL: ae });
    }
    function vn(Y) {
      if (!xr) return;
      const Ct = Te().getScrollbarWidth() > 0,
        kr = Y.scrollHeight > yr(Y).documentElement.clientHeight;
      re({
        paddingRight: Ct && !kr ? rf() : void 0,
        paddingLeft: !Ct && kr ? rf() : void 0,
      });
    }
    const it = je(() => {
      T && vn(T.dialog);
    });
    su(() => {
      Hs(window, "resize", it), W.current == null || W.current();
    });
    const Ut = () => {
        M.current = !0;
      },
      Z = (Y) => {
        M.current && T && Y.target === T.dialog && (b.current = !0),
          (M.current = !1);
      },
      To = () => {
        D(!0),
          (W.current = Op(T.dialog, () => {
            D(!1);
          }));
      },
      mi = (Y) => {
        Y.target === Y.currentTarget && To();
      },
      Po = (Y) => {
        if (v === "static") {
          mi(Y);
          return;
        }
        if (b.current || Y.target !== Y.currentTarget) {
          b.current = !1;
          return;
        }
        k == null || k();
      },
      jo = (Y) => {
        y ? x == null || x(Y) : (Y.preventDefault(), v === "static" && To());
      },
      vi = (Y, Ct) => {
        Y && vn(Y), j == null || j(Y, Ct);
      },
      hi = (Y) => {
        W.current == null || W.current(), C == null || C(Y);
      },
      kt = (Y, Ct) => {
        L == null || L(Y, Ct), Np(window, "resize", it);
      },
      Dn = (Y) => {
        Y && (Y.style.display = ""),
          U == null || U(Y),
          Hs(window, "resize", it);
      },
      Lo = g.exports.useCallback(
        (Y) =>
          _.exports.jsx("div", {
            ...Y,
            className: I(`${e}-backdrop`, J, !d && "show"),
          }),
        [d, J, e],
      ),
      wr = { ...n, ...te };
    wr.display = "block";
    const Sr = (Y) =>
      _.exports.jsx("div", {
        role: "dialog",
        ...Y,
        style: wr,
        className: I(t, e, R && `${e}-static`, !d && "show"),
        onClick: v ? Po : void 0,
        onMouseUp: Z,
        "aria-label": c,
        "aria-labelledby": s,
        "aria-describedby": a,
        children: _.exports.jsx(i, {
          ...q,
          onMouseDown: Ut,
          className: r,
          contentClassName: o,
          children: l,
        }),
      });
    return _.exports.jsx(jm.Provider, {
      value: Re,
      children: _.exports.jsx(Jx, {
        show: f,
        ref: z,
        backdrop: v,
        container: m,
        keyboard: !0,
        autoFocus: p,
        enforceFocus: h,
        restoreFocus: S,
        restoreFocusOptions: E,
        onEscapeKeyDown: jo,
        onShow: w,
        onHide: k,
        onEnter: vi,
        onEntering: kt,
        onEntered: N,
        onExit: hi,
        onExiting: O,
        onExited: Dn,
        manager: Te(),
        transition: d ? d1 : void 0,
        backdropTransition: d ? p1 : void 0,
        renderBackdrop: Lo,
        renderDialog: Sr,
      }),
    });
  },
);
_u.displayName = "Modal";
_u.defaultProps = f1;
const el = Object.assign(_u, {
  Body: l1,
  Header: Ou,
  Title: c1,
  Footer: i1,
  Dialog: Nu,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
});
function $m({ errorType: e, show: t }) {
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
    : u.createElement(
        el,
        {
          show: t,
          backdrop: "static",
          keyboard: !1,
          centered: !0,
          className: "connection-error-modal",
        },
        u.createElement(
          el.Header,
          { className: `bg-${r.variant} text-white` },
          u.createElement(
            el.Title,
            null,
            u.createElement("i", {
              className: "bi bi-exclamation-triangle-fill me-2",
            }),
            r.title,
          ),
        ),
        u.createElement(
          el.Body,
          null,
          u.createElement(
            Nm,
            { variant: r.variant, className: "mb-3" },
            u.createElement("strong", null, r.message),
          ),
          u.createElement(
            "div",
            { className: "text-center" },
            u.createElement(Su, {
              animation: "border",
              role: "status",
              className: "me-2",
            }),
            u.createElement("span", null, "Attempting to reconnect..."),
          ),
          u.createElement(
            "p",
            { className: "text-muted mt-3 mb-0 small" },
            "The interface will automatically resume once the connection is restored.",
          ),
        ),
      );
}
$m.propTypes = {
  errorType: G.exports.oneOf(["backend", "artiq", null]),
  show: G.exports.bool.isRequired,
};
function m1({ currentPage: e, onPageChange: t }) {
  const n = [
    { id: "running", label: "Running", icon: "\u25B6\uFE0F" },
    { id: "datasets", label: "Datasets", icon: "\u{1F4CA}" },
    { id: "schedule", label: "Schedule", icon: "\u{1F4CB}" },
    { id: "configure", label: "Configure", icon: "\u2699\uFE0F" },
  ];
  return u.createElement(
    "nav",
    { className: "mobile-nav" },
    n.map((r) =>
      u.createElement(
        "button",
        {
          key: r.id,
          className: `mobile-nav-item ${e === r.id ? "active" : ""}`,
          onClick: () => t(r.id),
          "aria-label": r.label,
          "aria-current": e === r.id ? "page" : void 0,
        },
        u.createElement("span", { className: "mobile-nav-icon" }, r.icon),
        u.createElement("span", { className: "mobile-nav-label" }, r.label),
      ),
    ),
  );
}
const v1 = 5e3;
function h1() {
  const [e, t] = g.exports.useState(null),
    [n, r] = g.exports.useState(null),
    [o, l] = g.exports.useState(null),
    [i, s] = g.exports.useState("schedule"),
    a = (f, d) => {
      t(f), r(d), s("configure");
    },
    c = (f) => {
      s(f);
    };
  return (
    g.exports.useEffect(() => {
      const f = async () => {
        try {
          (await Vg()).artiq_connected ? l(null) : l("artiq");
        } catch {
          l("backend");
        }
      };
      f();
      const d = setInterval(f, v1);
      return () => clearInterval(d);
    }, []),
    u.createElement(
      "div",
      { className: "app-container" },
      u.createElement($m, { errorType: o, show: o !== null }),
      u.createElement(
        Ya,
        { fluid: !0, className: "p-3 p-md-4" },
        u.createElement("h1", { className: "mb-4" }, "ARTIQ HTTP interface"),
        u.createElement(
          qt,
          { className: `pt-2 page-section ${i === "running" ? "active" : ""}` },
          u.createElement(
            He,
            null,
            u.createElement(
              qo,
              { title: "Running" },
              u.createElement(Qg, null),
            ),
          ),
        ),
        u.createElement(
          qt,
          {
            className: `pt-2 page-section ${i === "datasets" ? "active" : ""}`,
          },
          u.createElement(
            He,
            null,
            u.createElement(
              qo,
              { title: "Datasets" },
              u.createElement(bx, null),
            ),
          ),
        ),
        u.createElement(
          qt,
          {
            className: `pt-2 page-section ${i === "schedule" ? "active" : ""}`,
          },
          u.createElement(
            He,
            null,
            u.createElement(
              qo,
              { title: "Schedule new" },
              u.createElement(_x, { onSelect: a, selectedExperiment: e }),
            ),
          ),
        ),
        u.createElement(
          qt,
          {
            className: `pt-2 page-section ${i === "configure" ? "active" : ""}`,
          },
          u.createElement(
            He,
            null,
            u.createElement(
              qo,
              { title: "Configure Submission" },
              u.createElement(Rx, { experiment: e, repo_rev: n }),
            ),
          ),
        ),
      ),
      u.createElement(m1, { currentPage: i, onPageChange: c }),
    )
  );
}
hp(document.getElementById("root")).render(u.createElement(h1, null));
