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
function kc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var E = { exports: {} },
  I = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Jr = Symbol.for("react.element"),
  Qp = Symbol.for("react.portal"),
  Kp = Symbol.for("react.fragment"),
  Gp = Symbol.for("react.strict_mode"),
  Yp = Symbol.for("react.profiler"),
  Xp = Symbol.for("react.provider"),
  qp = Symbol.for("react.context"),
  Zp = Symbol.for("react.forward_ref"),
  Jp = Symbol.for("react.suspense"),
  bp = Symbol.for("react.memo"),
  em = Symbol.for("react.lazy"),
  Ya = Symbol.iterator;
function tm(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Ya && e[Ya]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Cc = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Nc = Object.assign,
  _c = {};
function tr(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = _c),
    (this.updater = n || Cc);
}
tr.prototype.isReactComponent = {};
tr.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
tr.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Oc() {}
Oc.prototype = tr.prototype;
function Cs(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = _c),
    (this.updater = n || Cc);
}
var Ns = (Cs.prototype = new Oc());
Ns.constructor = Cs;
Nc(Ns, tr.prototype);
Ns.isPureReactComponent = !0;
var Xa = Array.isArray,
  Rc = Object.prototype.hasOwnProperty,
  _s = { current: null },
  Tc = { key: !0, ref: !0, __self: !0, __source: !0 };
function Pc(e, t, n) {
  var r,
    o = {},
    l = null,
    i = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (i = t.ref),
    t.key !== void 0 && (l = "" + t.key),
    t))
      Rc.call(t, r) && !Tc.hasOwnProperty(r) && (o[r] = t[r]);
  var s = arguments.length - 2;
  if (s === 1) o.children = n;
  else if (1 < s) {
    for (var a = Array(s), u = 0; u < s; u++) a[u] = arguments[u + 2];
    o.children = a;
  }
  if (e && e.defaultProps)
    for (r in ((s = e.defaultProps), s)) o[r] === void 0 && (o[r] = s[r]);
  return {
    $$typeof: Jr,
    type: e,
    key: l,
    ref: i,
    props: o,
    _owner: _s.current,
  };
}
function nm(e, t) {
  return {
    $$typeof: Jr,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Os(e) {
  return typeof e == "object" && e !== null && e.$$typeof === Jr;
}
function rm(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var qa = /\/+/g;
function Gl(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? rm("" + e.key)
    : t.toString(36);
}
function To(e, t, n, r, o) {
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
          case Jr:
          case Qp:
            i = !0;
        }
    }
  if (i)
    return (
      (i = e),
      (o = o(i)),
      (e = r === "" ? "." + Gl(i, 0) : r),
      Xa(o)
        ? ((n = ""),
          e != null && (n = e.replace(qa, "$&/") + "/"),
          To(o, t, n, "", function (u) {
            return u;
          }))
        : o != null &&
          (Os(o) &&
            (o = nm(
              o,
              n +
                (!o.key || (i && i.key === o.key)
                  ? ""
                  : ("" + o.key).replace(qa, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((i = 0), (r = r === "" ? "." : r + ":"), Xa(e)))
    for (var s = 0; s < e.length; s++) {
      l = e[s];
      var a = r + Gl(l, s);
      i += To(l, t, n, a, o);
    }
  else if (((a = tm(e)), typeof a == "function"))
    for (e = a.call(e), s = 0; !(l = e.next()).done; )
      (l = l.value), (a = r + Gl(l, s++)), (i += To(l, t, n, a, o));
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
function uo(e, t, n) {
  if (e == null) return e;
  var r = [],
    o = 0;
  return (
    To(e, r, "", "", function (l) {
      return t.call(n, l, o++);
    }),
    r
  );
}
function om(e) {
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
var _e = { current: null },
  Po = { transition: null },
  lm = {
    ReactCurrentDispatcher: _e,
    ReactCurrentBatchConfig: Po,
    ReactCurrentOwner: _s,
  };
I.Children = {
  map: uo,
  forEach: function (e, t, n) {
    uo(
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
      uo(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      uo(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Os(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
I.Component = tr;
I.Fragment = Kp;
I.Profiler = Yp;
I.PureComponent = Cs;
I.StrictMode = Gp;
I.Suspense = Jp;
I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = lm;
I.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Nc({}, e.props),
    o = e.key,
    l = e.ref,
    i = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((l = t.ref), (i = _s.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var s = e.type.defaultProps;
    for (a in t)
      Rc.call(t, a) &&
        !Tc.hasOwnProperty(a) &&
        (r[a] = t[a] === void 0 && s !== void 0 ? s[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    s = Array(a);
    for (var u = 0; u < a; u++) s[u] = arguments[u + 2];
    r.children = s;
  }
  return { $$typeof: Jr, type: e.type, key: o, ref: l, props: r, _owner: i };
};
I.createContext = function (e) {
  return (
    (e = {
      $$typeof: qp,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Xp, _context: e }),
    (e.Consumer = e)
  );
};
I.createElement = Pc;
I.createFactory = function (e) {
  var t = Pc.bind(null, e);
  return (t.type = e), t;
};
I.createRef = function () {
  return { current: null };
};
I.forwardRef = function (e) {
  return { $$typeof: Zp, render: e };
};
I.isValidElement = Os;
I.lazy = function (e) {
  return { $$typeof: em, _payload: { _status: -1, _result: e }, _init: om };
};
I.memo = function (e, t) {
  return { $$typeof: bp, type: e, compare: t === void 0 ? null : t };
};
I.startTransition = function (e) {
  var t = Po.transition;
  Po.transition = {};
  try {
    e();
  } finally {
    Po.transition = t;
  }
};
I.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
I.useCallback = function (e, t) {
  return _e.current.useCallback(e, t);
};
I.useContext = function (e) {
  return _e.current.useContext(e);
};
I.useDebugValue = function () {};
I.useDeferredValue = function (e) {
  return _e.current.useDeferredValue(e);
};
I.useEffect = function (e, t) {
  return _e.current.useEffect(e, t);
};
I.useId = function () {
  return _e.current.useId();
};
I.useImperativeHandle = function (e, t, n) {
  return _e.current.useImperativeHandle(e, t, n);
};
I.useInsertionEffect = function (e, t) {
  return _e.current.useInsertionEffect(e, t);
};
I.useLayoutEffect = function (e, t) {
  return _e.current.useLayoutEffect(e, t);
};
I.useMemo = function (e, t) {
  return _e.current.useMemo(e, t);
};
I.useReducer = function (e, t, n) {
  return _e.current.useReducer(e, t, n);
};
I.useRef = function (e) {
  return _e.current.useRef(e);
};
I.useState = function (e) {
  return _e.current.useState(e);
};
I.useSyncExternalStore = function (e, t, n) {
  return _e.current.useSyncExternalStore(e, t, n);
};
I.useTransition = function () {
  return _e.current.useTransition();
};
I.version = "18.2.0";
(function (e) {
  e.exports = I;
})(E);
const v = kc(E.exports);
var Rs = { exports: {} },
  Ae = {},
  Lc = { exports: {} },
  jc = {};
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
    var z = R.length;
    R.push(D);
    e: for (; 0 < z; ) {
      var G = (z - 1) >>> 1,
        j = R[G];
      if (0 < o(j, D)) (R[G] = D), (R[z] = j), (z = G);
      else break e;
    }
  }
  function n(R) {
    return R.length === 0 ? null : R[0];
  }
  function r(R) {
    if (R.length === 0) return null;
    var D = R[0],
      z = R.pop();
    if (z !== D) {
      R[0] = z;
      e: for (var G = 0, j = R.length, W = j >>> 1; G < W; ) {
        var U = 2 * (G + 1) - 1,
          se = R[U],
          pe = U + 1,
          ke = R[pe];
        if (0 > o(se, z))
          pe < j && 0 > o(ke, se)
            ? ((R[G] = ke), (R[pe] = z), (G = pe))
            : ((R[G] = se), (R[U] = z), (G = U));
        else if (pe < j && 0 > o(ke, z)) (R[G] = ke), (R[pe] = z), (G = pe);
        else break e;
      }
    }
    return D;
  }
  function o(R, D) {
    var z = R.sortIndex - D.sortIndex;
    return z !== 0 ? z : R.id - D.id;
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
    u = [],
    c = 1,
    p = null,
    m = 3,
    y = !1,
    g = !1,
    S = !1,
    N = typeof setTimeout == "function" ? setTimeout : null,
    d = typeof clearTimeout == "function" ? clearTimeout : null,
    f = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function h(R) {
    for (var D = n(u); D !== null; ) {
      if (D.callback === null) r(u);
      else if (D.startTime <= R)
        r(u), (D.sortIndex = D.expirationTime), t(a, D);
      else break;
      D = n(u);
    }
  }
  function x(R) {
    if (((S = !1), h(R), !g))
      if (n(a) !== null) (g = !0), le(w);
      else {
        var D = n(u);
        D !== null && ue(x, D.startTime - R);
      }
  }
  function w(R, D) {
    (g = !1), S && ((S = !1), d(_), (_ = -1)), (y = !0);
    var z = m;
    try {
      for (
        h(D), p = n(a);
        p !== null && (!(p.expirationTime > D) || (R && !F()));

      ) {
        var G = p.callback;
        if (typeof G == "function") {
          (p.callback = null), (m = p.priorityLevel);
          var j = G(p.expirationTime <= D);
          (D = e.unstable_now()),
            typeof j == "function" ? (p.callback = j) : p === n(a) && r(a),
            h(D);
        } else r(a);
        p = n(a);
      }
      if (p !== null) var W = !0;
      else {
        var U = n(u);
        U !== null && ue(x, U.startTime - D), (W = !1);
      }
      return W;
    } finally {
      (p = null), (m = z), (y = !1);
    }
  }
  var k = !1,
    C = null,
    _ = -1,
    $ = 5,
    L = -1;
  function F() {
    return !(e.unstable_now() - L < $);
  }
  function J() {
    if (C !== null) {
      var R = e.unstable_now();
      L = R;
      var D = !0;
      try {
        D = C(!0, R);
      } finally {
        D ? H() : ((k = !1), (C = null));
      }
    } else k = !1;
  }
  var H;
  if (typeof f == "function")
    H = function () {
      f(J);
    };
  else if (typeof MessageChannel < "u") {
    var ee = new MessageChannel(),
      Y = ee.port2;
    (ee.port1.onmessage = J),
      (H = function () {
        Y.postMessage(null);
      });
  } else
    H = function () {
      N(J, 0);
    };
  function le(R) {
    (C = R), k || ((k = !0), H());
  }
  function ue(R, D) {
    _ = N(function () {
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
      g || y || ((g = !0), le(w));
    }),
    (e.unstable_forceFrameRate = function (R) {
      0 > R || 125 < R
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : ($ = 0 < R ? Math.floor(1e3 / R) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return m;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (e.unstable_next = function (R) {
      switch (m) {
        case 1:
        case 2:
        case 3:
          var D = 3;
          break;
        default:
          D = m;
      }
      var z = m;
      m = D;
      try {
        return R();
      } finally {
        m = z;
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
      var z = m;
      m = R;
      try {
        return D();
      } finally {
        m = z;
      }
    }),
    (e.unstable_scheduleCallback = function (R, D, z) {
      var G = e.unstable_now();
      switch (
        (typeof z == "object" && z !== null
          ? ((z = z.delay), (z = typeof z == "number" && 0 < z ? G + z : G))
          : (z = G),
        R)
      ) {
        case 1:
          var j = -1;
          break;
        case 2:
          j = 250;
          break;
        case 5:
          j = 1073741823;
          break;
        case 4:
          j = 1e4;
          break;
        default:
          j = 5e3;
      }
      return (
        (j = z + j),
        (R = {
          id: c++,
          callback: D,
          priorityLevel: R,
          startTime: z,
          expirationTime: j,
          sortIndex: -1,
        }),
        z > G
          ? ((R.sortIndex = z),
            t(u, R),
            n(a) === null &&
              R === n(u) &&
              (S ? (d(_), (_ = -1)) : (S = !0), ue(x, z - G)))
          : ((R.sortIndex = j), t(a, R), g || y || ((g = !0), le(w))),
        R
      );
    }),
    (e.unstable_shouldYield = F),
    (e.unstable_wrapCallback = function (R) {
      var D = m;
      return function () {
        var z = m;
        m = D;
        try {
          return R.apply(this, arguments);
        } finally {
          m = z;
        }
      };
    });
})(jc);
(function (e) {
  e.exports = jc;
})(Lc);
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Dc = E.exports,
  Fe = Lc.exports;
function O(e) {
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
var $c = new Set(),
  Lr = {};
function wn(e, t) {
  Wn(e, t), Wn(e + "Capture", t);
}
function Wn(e, t) {
  for (Lr[e] = t, e = 0; e < t.length; e++) $c.add(t[e]);
}
var Ct = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Si = Object.prototype.hasOwnProperty,
  im =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Za = {},
  Ja = {};
function sm(e) {
  return Si.call(Ja, e)
    ? !0
    : Si.call(Za, e)
      ? !1
      : im.test(e)
        ? (Ja[e] = !0)
        : ((Za[e] = !0), !1);
}
function am(e, t, n, r) {
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
function um(e, t, n, r) {
  if (t === null || typeof t > "u" || am(e, t, n, r)) return !0;
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
function Oe(e, t, n, r, o, l, i) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = l),
    (this.removeEmptyString = i);
}
var ge = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    ge[e] = new Oe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  ge[t] = new Oe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  ge[e] = new Oe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  ge[e] = new Oe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    ge[e] = new Oe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  ge[e] = new Oe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  ge[e] = new Oe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  ge[e] = new Oe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  ge[e] = new Oe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Ts = /[\-:]([a-z])/g;
function Ps(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ts, Ps);
    ge[t] = new Oe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Ts, Ps);
    ge[t] = new Oe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Ts, Ps);
  ge[t] = new Oe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  ge[e] = new Oe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
ge.xlinkHref = new Oe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  ge[e] = new Oe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Ls(e, t, n, r) {
  var o = ge.hasOwnProperty(t) ? ge[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (um(t, n, o, r) && (n = null),
    r || o === null
      ? sm(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
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
var Pt = Dc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  co = Symbol.for("react.element"),
  Cn = Symbol.for("react.portal"),
  Nn = Symbol.for("react.fragment"),
  js = Symbol.for("react.strict_mode"),
  ki = Symbol.for("react.profiler"),
  zc = Symbol.for("react.provider"),
  Mc = Symbol.for("react.context"),
  Ds = Symbol.for("react.forward_ref"),
  Ci = Symbol.for("react.suspense"),
  Ni = Symbol.for("react.suspense_list"),
  $s = Symbol.for("react.memo"),
  Dt = Symbol.for("react.lazy"),
  Ic = Symbol.for("react.offscreen"),
  ba = Symbol.iterator;
function or(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (ba && e[ba]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var oe = Object.assign,
  Yl;
function mr(e) {
  if (Yl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Yl = (t && t[1]) || "";
    }
  return (
    `
` +
    Yl +
    e
  );
}
var Xl = !1;
function ql(e, t) {
  if (!e || Xl) return "";
  Xl = !0;
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
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (
        var o = u.stack.split(`
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
    (Xl = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? mr(e) : "";
}
function cm(e) {
  switch (e.tag) {
    case 5:
      return mr(e.type);
    case 16:
      return mr("Lazy");
    case 13:
      return mr("Suspense");
    case 19:
      return mr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = ql(e.type, !1)), e;
    case 11:
      return (e = ql(e.type.render, !1)), e;
    case 1:
      return (e = ql(e.type, !0)), e;
    default:
      return "";
  }
}
function _i(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Nn:
      return "Fragment";
    case Cn:
      return "Portal";
    case ki:
      return "Profiler";
    case js:
      return "StrictMode";
    case Ci:
      return "Suspense";
    case Ni:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Mc:
        return (e.displayName || "Context") + ".Consumer";
      case zc:
        return (e._context.displayName || "Context") + ".Provider";
      case Ds:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case $s:
        return (
          (t = e.displayName || null), t !== null ? t : _i(e.type) || "Memo"
        );
      case Dt:
        (t = e._payload), (e = e._init);
        try {
          return _i(e(t));
        } catch {}
    }
  return null;
}
function fm(e) {
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
      return _i(t);
    case 8:
      return t === js ? "StrictMode" : "Mode";
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
function Xt(e) {
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
function Fc(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function dm(e) {
  var t = Fc(e) ? "checked" : "value",
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
function fo(e) {
  e._valueTracker || (e._valueTracker = dm(e));
}
function Ac(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Fc(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Ho(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Oi(e, t) {
  var n = t.checked;
  return oe({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n != null ? n : e._wrapperState.initialChecked,
  });
}
function eu(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = Xt(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function Bc(e, t) {
  (t = t.checked), t != null && Ls(e, "checked", t, !1);
}
function Ri(e, t) {
  Bc(e, t);
  var n = Xt(t.value),
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
    ? Ti(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Ti(e, t.type, Xt(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function tu(e, t, n) {
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
function Ti(e, t, n) {
  (t !== "number" || Ho(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var vr = Array.isArray;
function In(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      (o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Xt(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        (e[o].selected = !0), r && (e[o].defaultSelected = !0);
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function Pi(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(O(91));
  return oe({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function nu(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(O(92));
      if (vr(n)) {
        if (1 < n.length) throw Error(O(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: Xt(n) };
}
function Uc(e, t) {
  var n = Xt(t.value),
    r = Xt(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function ru(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Vc(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Li(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Vc(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var po,
  Hc = (function (e) {
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
        po = po || document.createElement("div"),
          po.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = po.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function jr(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var xr = {
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
  pm = ["Webkit", "ms", "Moz", "O"];
Object.keys(xr).forEach(function (e) {
  pm.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (xr[t] = xr[e]);
  });
});
function Wc(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (xr.hasOwnProperty(e) && xr[e])
      ? ("" + t).trim()
      : t + "px";
}
function Qc(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = Wc(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o);
    }
}
var mm = oe(
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
function ji(e, t) {
  if (t) {
    if (mm[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(O(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(O(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(O(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(O(62));
  }
}
function Di(e, t) {
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
var $i = null;
function zs(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var zi = null,
  Fn = null,
  An = null;
function ou(e) {
  if ((e = to(e))) {
    if (typeof zi != "function") throw Error(O(280));
    var t = e.stateNode;
    t && ((t = kl(t)), zi(e.stateNode, e.type, t));
  }
}
function Kc(e) {
  Fn ? (An ? An.push(e) : (An = [e])) : (Fn = e);
}
function Gc() {
  if (Fn) {
    var e = Fn,
      t = An;
    if (((An = Fn = null), ou(e), t)) for (e = 0; e < t.length; e++) ou(t[e]);
  }
}
function Yc(e, t) {
  return e(t);
}
function Xc() {}
var Zl = !1;
function qc(e, t, n) {
  if (Zl) return e(t, n);
  Zl = !0;
  try {
    return Yc(e, t, n);
  } finally {
    (Zl = !1), (Fn !== null || An !== null) && (Xc(), Gc());
  }
}
function Dr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = kl(n);
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
  if (n && typeof n != "function") throw Error(O(231, t, typeof n));
  return n;
}
var Mi = !1;
if (Ct)
  try {
    var lr = {};
    Object.defineProperty(lr, "passive", {
      get: function () {
        Mi = !0;
      },
    }),
      window.addEventListener("test", lr, lr),
      window.removeEventListener("test", lr, lr);
  } catch {
    Mi = !1;
  }
function vm(e, t, n, r, o, l, i, s, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var wr = !1,
  Wo = null,
  Qo = !1,
  Ii = null,
  hm = {
    onError: function (e) {
      (wr = !0), (Wo = e);
    },
  };
function ym(e, t, n, r, o, l, i, s, a) {
  (wr = !1), (Wo = null), vm.apply(hm, arguments);
}
function gm(e, t, n, r, o, l, i, s, a) {
  if ((ym.apply(this, arguments), wr)) {
    if (wr) {
      var u = Wo;
      (wr = !1), (Wo = null);
    } else throw Error(O(198));
    Qo || ((Qo = !0), (Ii = u));
  }
}
function En(e) {
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
function Zc(e) {
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
function lu(e) {
  if (En(e) !== e) throw Error(O(188));
}
function xm(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = En(e)), t === null)) throw Error(O(188));
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
        if (l === n) return lu(o), e;
        if (l === r) return lu(o), t;
        l = l.sibling;
      }
      throw Error(O(188));
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
        if (!i) throw Error(O(189));
      }
    }
    if (n.alternate !== r) throw Error(O(190));
  }
  if (n.tag !== 3) throw Error(O(188));
  return n.stateNode.current === n ? e : t;
}
function Jc(e) {
  return (e = xm(e)), e !== null ? bc(e) : null;
}
function bc(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = bc(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var ef = Fe.unstable_scheduleCallback,
  iu = Fe.unstable_cancelCallback,
  wm = Fe.unstable_shouldYield,
  Em = Fe.unstable_requestPaint,
  ae = Fe.unstable_now,
  Sm = Fe.unstable_getCurrentPriorityLevel,
  Ms = Fe.unstable_ImmediatePriority,
  tf = Fe.unstable_UserBlockingPriority,
  Ko = Fe.unstable_NormalPriority,
  km = Fe.unstable_LowPriority,
  nf = Fe.unstable_IdlePriority,
  xl = null,
  pt = null;
function Cm(e) {
  if (pt && typeof pt.onCommitFiberRoot == "function")
    try {
      pt.onCommitFiberRoot(xl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var ot = Math.clz32 ? Math.clz32 : Om,
  Nm = Math.log,
  _m = Math.LN2;
function Om(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Nm(e) / _m) | 0)) | 0;
}
var mo = 64,
  vo = 4194304;
function hr(e) {
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
function Go(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    o = e.suspendedLanes,
    l = e.pingedLanes,
    i = n & 268435455;
  if (i !== 0) {
    var s = i & ~o;
    s !== 0 ? (r = hr(s)) : ((l &= i), l !== 0 && (r = hr(l)));
  } else (i = n & ~o), i !== 0 ? (r = hr(i)) : l !== 0 && (r = hr(l));
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
      (n = 31 - ot(t)), (o = 1 << n), (r |= e[n]), (t &= ~o);
  return r;
}
function Rm(e, t) {
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
function Tm(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      l = e.pendingLanes;
    0 < l;

  ) {
    var i = 31 - ot(l),
      s = 1 << i,
      a = o[i];
    a === -1
      ? ((s & n) === 0 || (s & r) !== 0) && (o[i] = Rm(s, t))
      : a <= t && (e.expiredLanes |= s),
      (l &= ~s);
  }
}
function Fi(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function rf() {
  var e = mo;
  return (mo <<= 1), (mo & 4194240) === 0 && (mo = 64), e;
}
function Jl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function br(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - ot(t)),
    (e[t] = n);
}
function Pm(e, t) {
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
    var o = 31 - ot(n),
      l = 1 << o;
    (t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~l);
  }
}
function Is(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - ot(n),
      o = 1 << r;
    (o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o);
  }
}
var Q = 0;
function of(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
  );
}
var lf,
  Fs,
  sf,
  af,
  uf,
  Ai = !1,
  ho = [],
  Ut = null,
  Vt = null,
  Ht = null,
  $r = new Map(),
  zr = new Map(),
  Mt = [],
  Lm =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function su(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Ut = null;
      break;
    case "dragenter":
    case "dragleave":
      Vt = null;
      break;
    case "mouseover":
    case "mouseout":
      Ht = null;
      break;
    case "pointerover":
    case "pointerout":
      $r.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      zr.delete(t.pointerId);
  }
}
function ir(e, t, n, r, o, l) {
  return e === null || e.nativeEvent !== l
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: l,
        targetContainers: [o],
      }),
      t !== null && ((t = to(t)), t !== null && Fs(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function jm(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return (Ut = ir(Ut, e, t, n, r, o)), !0;
    case "dragenter":
      return (Vt = ir(Vt, e, t, n, r, o)), !0;
    case "mouseover":
      return (Ht = ir(Ht, e, t, n, r, o)), !0;
    case "pointerover":
      var l = o.pointerId;
      return $r.set(l, ir($r.get(l) || null, e, t, n, r, o)), !0;
    case "gotpointercapture":
      return (
        (l = o.pointerId), zr.set(l, ir(zr.get(l) || null, e, t, n, r, o)), !0
      );
  }
  return !1;
}
function cf(e) {
  var t = sn(e.target);
  if (t !== null) {
    var n = En(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Zc(n)), t !== null)) {
          (e.blockedOn = t),
            uf(e.priority, function () {
              sf(n);
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
function Lo(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Bi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ($i = r), n.target.dispatchEvent(r), ($i = null);
    } else return (t = to(n)), t !== null && Fs(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function au(e, t, n) {
  Lo(e) && n.delete(t);
}
function Dm() {
  (Ai = !1),
    Ut !== null && Lo(Ut) && (Ut = null),
    Vt !== null && Lo(Vt) && (Vt = null),
    Ht !== null && Lo(Ht) && (Ht = null),
    $r.forEach(au),
    zr.forEach(au);
}
function sr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Ai ||
      ((Ai = !0),
      Fe.unstable_scheduleCallback(Fe.unstable_NormalPriority, Dm)));
}
function Mr(e) {
  function t(o) {
    return sr(o, e);
  }
  if (0 < ho.length) {
    sr(ho[0], e);
    for (var n = 1; n < ho.length; n++) {
      var r = ho[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    Ut !== null && sr(Ut, e),
      Vt !== null && sr(Vt, e),
      Ht !== null && sr(Ht, e),
      $r.forEach(t),
      zr.forEach(t),
      n = 0;
    n < Mt.length;
    n++
  )
    (r = Mt[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Mt.length && ((n = Mt[0]), n.blockedOn === null); )
    cf(n), n.blockedOn === null && Mt.shift();
}
var Bn = Pt.ReactCurrentBatchConfig,
  Yo = !0;
function $m(e, t, n, r) {
  var o = Q,
    l = Bn.transition;
  Bn.transition = null;
  try {
    (Q = 1), As(e, t, n, r);
  } finally {
    (Q = o), (Bn.transition = l);
  }
}
function zm(e, t, n, r) {
  var o = Q,
    l = Bn.transition;
  Bn.transition = null;
  try {
    (Q = 4), As(e, t, n, r);
  } finally {
    (Q = o), (Bn.transition = l);
  }
}
function As(e, t, n, r) {
  if (Yo) {
    var o = Bi(e, t, n, r);
    if (o === null) ai(e, t, r, Xo, n), su(e, r);
    else if (jm(o, e, t, n, r)) r.stopPropagation();
    else if ((su(e, r), t & 4 && -1 < Lm.indexOf(e))) {
      for (; o !== null; ) {
        var l = to(o);
        if (
          (l !== null && lf(l),
          (l = Bi(e, t, n, r)),
          l === null && ai(e, t, r, Xo, n),
          l === o)
        )
          break;
        o = l;
      }
      o !== null && r.stopPropagation();
    } else ai(e, t, r, null, n);
  }
}
var Xo = null;
function Bi(e, t, n, r) {
  if (((Xo = null), (e = zs(r)), (e = sn(e)), e !== null))
    if (((t = En(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Zc(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (Xo = e), null;
}
function ff(e) {
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
      switch (Sm()) {
        case Ms:
          return 1;
        case tf:
          return 4;
        case Ko:
        case km:
          return 16;
        case nf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var At = null,
  Bs = null,
  jo = null;
function df() {
  if (jo) return jo;
  var e,
    t = Bs,
    n = t.length,
    r,
    o = "value" in At ? At.value : At.textContent,
    l = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var i = n - e;
  for (r = 1; r <= i && t[n - r] === o[l - r]; r++);
  return (jo = o.slice(e, 1 < r ? 1 - r : void 0));
}
function Do(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function yo() {
  return !0;
}
function uu() {
  return !1;
}
function Be(e) {
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
        ? yo
        : uu),
      (this.isPropagationStopped = uu),
      this
    );
  }
  return (
    oe(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = yo));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = yo));
      },
      persist: function () {},
      isPersistent: yo,
    }),
    t
  );
}
var nr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Us = Be(nr),
  eo = oe({}, nr, { view: 0, detail: 0 }),
  Mm = Be(eo),
  bl,
  ei,
  ar,
  wl = oe({}, eo, {
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
    getModifierState: Vs,
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
        : (e !== ar &&
            (ar && e.type === "mousemove"
              ? ((bl = e.screenX - ar.screenX), (ei = e.screenY - ar.screenY))
              : (ei = bl = 0),
            (ar = e)),
          bl);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ei;
    },
  }),
  cu = Be(wl),
  Im = oe({}, wl, { dataTransfer: 0 }),
  Fm = Be(Im),
  Am = oe({}, eo, { relatedTarget: 0 }),
  ti = Be(Am),
  Bm = oe({}, nr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Um = Be(Bm),
  Vm = oe({}, nr, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Hm = Be(Vm),
  Wm = oe({}, nr, { data: 0 }),
  fu = Be(Wm),
  Qm = {
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
  Km = {
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
  Gm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Ym(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Gm[e]) ? !!t[e] : !1;
}
function Vs() {
  return Ym;
}
var Xm = oe({}, eo, {
    key: function (e) {
      if (e.key) {
        var t = Qm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Do(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Km[e.keyCode] || "Unidentified"
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
    getModifierState: Vs,
    charCode: function (e) {
      return e.type === "keypress" ? Do(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Do(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  qm = Be(Xm),
  Zm = oe({}, wl, {
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
  du = Be(Zm),
  Jm = oe({}, eo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Vs,
  }),
  bm = Be(Jm),
  ev = oe({}, nr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  tv = Be(ev),
  nv = oe({}, wl, {
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
  rv = Be(nv),
  ov = [9, 13, 27, 32],
  Hs = Ct && "CompositionEvent" in window,
  Er = null;
Ct && "documentMode" in document && (Er = document.documentMode);
var lv = Ct && "TextEvent" in window && !Er,
  pf = Ct && (!Hs || (Er && 8 < Er && 11 >= Er)),
  pu = String.fromCharCode(32),
  mu = !1;
function mf(e, t) {
  switch (e) {
    case "keyup":
      return ov.indexOf(t.keyCode) !== -1;
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
function vf(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var _n = !1;
function iv(e, t) {
  switch (e) {
    case "compositionend":
      return vf(t);
    case "keypress":
      return t.which !== 32 ? null : ((mu = !0), pu);
    case "textInput":
      return (e = t.data), e === pu && mu ? null : e;
    default:
      return null;
  }
}
function sv(e, t) {
  if (_n)
    return e === "compositionend" || (!Hs && mf(e, t))
      ? ((e = df()), (jo = Bs = At = null), (_n = !1), e)
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
      return pf && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var av = {
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
function vu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!av[e.type] : t === "textarea";
}
function hf(e, t, n, r) {
  Kc(r),
    (t = qo(t, "onChange")),
    0 < t.length &&
      ((n = new Us("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Sr = null,
  Ir = null;
function uv(e) {
  Of(e, 0);
}
function El(e) {
  var t = Tn(e);
  if (Ac(t)) return e;
}
function cv(e, t) {
  if (e === "change") return t;
}
var yf = !1;
if (Ct) {
  var ni;
  if (Ct) {
    var ri = "oninput" in document;
    if (!ri) {
      var hu = document.createElement("div");
      hu.setAttribute("oninput", "return;"),
        (ri = typeof hu.oninput == "function");
    }
    ni = ri;
  } else ni = !1;
  yf = ni && (!document.documentMode || 9 < document.documentMode);
}
function yu() {
  Sr && (Sr.detachEvent("onpropertychange", gf), (Ir = Sr = null));
}
function gf(e) {
  if (e.propertyName === "value" && El(Ir)) {
    var t = [];
    hf(t, Ir, e, zs(e)), qc(uv, t);
  }
}
function fv(e, t, n) {
  e === "focusin"
    ? (yu(), (Sr = t), (Ir = n), Sr.attachEvent("onpropertychange", gf))
    : e === "focusout" && yu();
}
function dv(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return El(Ir);
}
function pv(e, t) {
  if (e === "click") return El(t);
}
function mv(e, t) {
  if (e === "input" || e === "change") return El(t);
}
function vv(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var st = typeof Object.is == "function" ? Object.is : vv;
function Fr(e, t) {
  if (st(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!Si.call(t, o) || !st(e[o], t[o])) return !1;
  }
  return !0;
}
function gu(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function xu(e, t) {
  var n = gu(e);
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
    n = gu(n);
  }
}
function xf(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? xf(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function wf() {
  for (var e = window, t = Ho(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Ho(e.document);
  }
  return t;
}
function Ws(e) {
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
function hv(e) {
  var t = wf(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    xf(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Ws(n)) {
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
          (o = xu(n, l));
        var i = xu(n, r);
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
var yv = Ct && "documentMode" in document && 11 >= document.documentMode,
  On = null,
  Ui = null,
  kr = null,
  Vi = !1;
function wu(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Vi ||
    On == null ||
    On !== Ho(r) ||
    ((r = On),
    "selectionStart" in r && Ws(r)
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
    (kr && Fr(kr, r)) ||
      ((kr = r),
      (r = qo(Ui, "onSelect")),
      0 < r.length &&
        ((t = new Us("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = On))));
}
function go(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var Rn = {
    animationend: go("Animation", "AnimationEnd"),
    animationiteration: go("Animation", "AnimationIteration"),
    animationstart: go("Animation", "AnimationStart"),
    transitionend: go("Transition", "TransitionEnd"),
  },
  oi = {},
  Ef = {};
Ct &&
  ((Ef = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Rn.animationend.animation,
    delete Rn.animationiteration.animation,
    delete Rn.animationstart.animation),
  "TransitionEvent" in window || delete Rn.transitionend.transition);
function Sl(e) {
  if (oi[e]) return oi[e];
  if (!Rn[e]) return e;
  var t = Rn[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Ef) return (oi[e] = t[n]);
  return e;
}
var Sf = Sl("animationend"),
  kf = Sl("animationiteration"),
  Cf = Sl("animationstart"),
  Nf = Sl("transitionend"),
  _f = new Map(),
  Eu =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function Jt(e, t) {
  _f.set(e, t), wn(t, [e]);
}
for (var li = 0; li < Eu.length; li++) {
  var ii = Eu[li],
    gv = ii.toLowerCase(),
    xv = ii[0].toUpperCase() + ii.slice(1);
  Jt(gv, "on" + xv);
}
Jt(Sf, "onAnimationEnd");
Jt(kf, "onAnimationIteration");
Jt(Cf, "onAnimationStart");
Jt("dblclick", "onDoubleClick");
Jt("focusin", "onFocus");
Jt("focusout", "onBlur");
Jt(Nf, "onTransitionEnd");
Wn("onMouseEnter", ["mouseout", "mouseover"]);
Wn("onMouseLeave", ["mouseout", "mouseover"]);
Wn("onPointerEnter", ["pointerout", "pointerover"]);
Wn("onPointerLeave", ["pointerout", "pointerover"]);
wn(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
wn(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
wn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
wn(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
wn(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
wn(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var yr =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  wv = new Set("cancel close invalid load scroll toggle".split(" ").concat(yr));
function Su(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), gm(r, t, void 0, e), (e.currentTarget = null);
}
function Of(e, t) {
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
            u = s.currentTarget;
          if (((s = s.listener), a !== l && o.isPropagationStopped())) break e;
          Su(o, s, u), (l = a);
        }
      else
        for (i = 0; i < r.length; i++) {
          if (
            ((s = r[i]),
            (a = s.instance),
            (u = s.currentTarget),
            (s = s.listener),
            a !== l && o.isPropagationStopped())
          )
            break e;
          Su(o, s, u), (l = a);
        }
    }
  }
  if (Qo) throw ((e = Ii), (Qo = !1), (Ii = null), e);
}
function q(e, t) {
  var n = t[Gi];
  n === void 0 && (n = t[Gi] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Rf(t, e, 2, !1), n.add(r));
}
function si(e, t, n) {
  var r = 0;
  t && (r |= 4), Rf(n, e, r, t);
}
var xo = "_reactListening" + Math.random().toString(36).slice(2);
function Ar(e) {
  if (!e[xo]) {
    (e[xo] = !0),
      $c.forEach(function (n) {
        n !== "selectionchange" && (wv.has(n) || si(n, !1, e), si(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[xo] || ((t[xo] = !0), si("selectionchange", !1, t));
  }
}
function Rf(e, t, n, r) {
  switch (ff(t)) {
    case 1:
      var o = $m;
      break;
    case 4:
      o = zm;
      break;
    default:
      o = As;
  }
  (n = o.bind(null, t, n, e)),
    (o = void 0),
    !Mi ||
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
function ai(e, t, n, r, o) {
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
          if (((i = sn(s)), i === null)) return;
          if (((a = i.tag), a === 5 || a === 6)) {
            r = l = i;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
  qc(function () {
    var u = l,
      c = zs(n),
      p = [];
    e: {
      var m = _f.get(e);
      if (m !== void 0) {
        var y = Us,
          g = e;
        switch (e) {
          case "keypress":
            if (Do(n) === 0) break e;
          case "keydown":
          case "keyup":
            y = qm;
            break;
          case "focusin":
            (g = "focus"), (y = ti);
            break;
          case "focusout":
            (g = "blur"), (y = ti);
            break;
          case "beforeblur":
          case "afterblur":
            y = ti;
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
            y = cu;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            y = Fm;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            y = bm;
            break;
          case Sf:
          case kf:
          case Cf:
            y = Um;
            break;
          case Nf:
            y = tv;
            break;
          case "scroll":
            y = Mm;
            break;
          case "wheel":
            y = rv;
            break;
          case "copy":
          case "cut":
          case "paste":
            y = Hm;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            y = du;
        }
        var S = (t & 4) !== 0,
          N = !S && e === "scroll",
          d = S ? (m !== null ? m + "Capture" : null) : m;
        S = [];
        for (var f = u, h; f !== null; ) {
          h = f;
          var x = h.stateNode;
          if (
            (h.tag === 5 &&
              x !== null &&
              ((h = x),
              d !== null && ((x = Dr(f, d)), x != null && S.push(Br(f, x, h)))),
            N)
          )
            break;
          f = f.return;
        }
        0 < S.length &&
          ((m = new y(m, g, null, n, c)), p.push({ event: m, listeners: S }));
      }
    }
    if ((t & 7) === 0) {
      e: {
        if (
          ((m = e === "mouseover" || e === "pointerover"),
          (y = e === "mouseout" || e === "pointerout"),
          m &&
            n !== $i &&
            (g = n.relatedTarget || n.fromElement) &&
            (sn(g) || g[Nt]))
        )
          break e;
        if (
          (y || m) &&
          ((m =
            c.window === c
              ? c
              : (m = c.ownerDocument)
                ? m.defaultView || m.parentWindow
                : window),
          y
            ? ((g = n.relatedTarget || n.toElement),
              (y = u),
              (g = g ? sn(g) : null),
              g !== null &&
                ((N = En(g)), g !== N || (g.tag !== 5 && g.tag !== 6)) &&
                (g = null))
            : ((y = null), (g = u)),
          y !== g)
        ) {
          if (
            ((S = cu),
            (x = "onMouseLeave"),
            (d = "onMouseEnter"),
            (f = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((S = du),
              (x = "onPointerLeave"),
              (d = "onPointerEnter"),
              (f = "pointer")),
            (N = y == null ? m : Tn(y)),
            (h = g == null ? m : Tn(g)),
            (m = new S(x, f + "leave", y, n, c)),
            (m.target = N),
            (m.relatedTarget = h),
            (x = null),
            sn(c) === u &&
              ((S = new S(d, f + "enter", g, n, c)),
              (S.target = h),
              (S.relatedTarget = N),
              (x = S)),
            (N = x),
            y && g)
          )
            t: {
              for (S = y, d = g, f = 0, h = S; h; h = Sn(h)) f++;
              for (h = 0, x = d; x; x = Sn(x)) h++;
              for (; 0 < f - h; ) (S = Sn(S)), f--;
              for (; 0 < h - f; ) (d = Sn(d)), h--;
              for (; f--; ) {
                if (S === d || (d !== null && S === d.alternate)) break t;
                (S = Sn(S)), (d = Sn(d));
              }
              S = null;
            }
          else S = null;
          y !== null && ku(p, m, y, S, !1),
            g !== null && N !== null && ku(p, N, g, S, !0);
        }
      }
      e: {
        if (
          ((m = u ? Tn(u) : window),
          (y = m.nodeName && m.nodeName.toLowerCase()),
          y === "select" || (y === "input" && m.type === "file"))
        )
          var w = cv;
        else if (vu(m))
          if (yf) w = mv;
          else {
            w = dv;
            var k = fv;
          }
        else
          (y = m.nodeName) &&
            y.toLowerCase() === "input" &&
            (m.type === "checkbox" || m.type === "radio") &&
            (w = pv);
        if (w && (w = w(e, u))) {
          hf(p, w, n, c);
          break e;
        }
        k && k(e, m, u),
          e === "focusout" &&
            (k = m._wrapperState) &&
            k.controlled &&
            m.type === "number" &&
            Ti(m, "number", m.value);
      }
      switch (((k = u ? Tn(u) : window), e)) {
        case "focusin":
          (vu(k) || k.contentEditable === "true") &&
            ((On = k), (Ui = u), (kr = null));
          break;
        case "focusout":
          kr = Ui = On = null;
          break;
        case "mousedown":
          Vi = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Vi = !1), wu(p, n, c);
          break;
        case "selectionchange":
          if (yv) break;
        case "keydown":
        case "keyup":
          wu(p, n, c);
      }
      var C;
      if (Hs)
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
        _n
          ? mf(e, n) && (_ = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (_ = "onCompositionStart");
      _ &&
        (pf &&
          n.locale !== "ko" &&
          (_n || _ !== "onCompositionStart"
            ? _ === "onCompositionEnd" && _n && (C = df())
            : ((At = c),
              (Bs = "value" in At ? At.value : At.textContent),
              (_n = !0))),
        (k = qo(u, _)),
        0 < k.length &&
          ((_ = new fu(_, e, null, n, c)),
          p.push({ event: _, listeners: k }),
          C ? (_.data = C) : ((C = vf(n)), C !== null && (_.data = C)))),
        (C = lv ? iv(e, n) : sv(e, n)) &&
          ((u = qo(u, "onBeforeInput")),
          0 < u.length &&
            ((c = new fu("onBeforeInput", "beforeinput", null, n, c)),
            p.push({ event: c, listeners: u }),
            (c.data = C)));
    }
    Of(p, t);
  });
}
function Br(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function qo(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var o = e,
      l = o.stateNode;
    o.tag === 5 &&
      l !== null &&
      ((o = l),
      (l = Dr(e, n)),
      l != null && r.unshift(Br(e, l, o)),
      (l = Dr(e, t)),
      l != null && r.push(Br(e, l, o))),
      (e = e.return);
  }
  return r;
}
function Sn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function ku(e, t, n, r, o) {
  for (var l = t._reactName, i = []; n !== null && n !== r; ) {
    var s = n,
      a = s.alternate,
      u = s.stateNode;
    if (a !== null && a === r) break;
    s.tag === 5 &&
      u !== null &&
      ((s = u),
      o
        ? ((a = Dr(n, l)), a != null && i.unshift(Br(n, a, s)))
        : o || ((a = Dr(n, l)), a != null && i.push(Br(n, a, s)))),
      (n = n.return);
  }
  i.length !== 0 && e.push({ event: t, listeners: i });
}
var Ev = /\r\n?/g,
  Sv = /\u0000|\uFFFD/g;
function Cu(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Ev,
      `
`,
    )
    .replace(Sv, "");
}
function wo(e, t, n) {
  if (((t = Cu(t)), Cu(e) !== t && n)) throw Error(O(425));
}
function Zo() {}
var Hi = null,
  Wi = null;
function Qi(e, t) {
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
var Ki = typeof setTimeout == "function" ? setTimeout : void 0,
  kv = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Nu = typeof Promise == "function" ? Promise : void 0,
  Cv =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Nu < "u"
        ? function (e) {
            return Nu.resolve(null).then(e).catch(Nv);
          }
        : Ki;
function Nv(e) {
  setTimeout(function () {
    throw e;
  });
}
function ui(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(o), Mr(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  Mr(t);
}
function Wt(e) {
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
function _u(e) {
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
var rr = Math.random().toString(36).slice(2),
  ft = "__reactFiber$" + rr,
  Ur = "__reactProps$" + rr,
  Nt = "__reactContainer$" + rr,
  Gi = "__reactEvents$" + rr,
  _v = "__reactListeners$" + rr,
  Ov = "__reactHandles$" + rr;
function sn(e) {
  var t = e[ft];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Nt] || n[ft])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = _u(e); e !== null; ) {
          if ((n = e[ft])) return n;
          e = _u(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function to(e) {
  return (
    (e = e[ft] || e[Nt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Tn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(O(33));
}
function kl(e) {
  return e[Ur] || null;
}
var Yi = [],
  Pn = -1;
function bt(e) {
  return { current: e };
}
function Z(e) {
  0 > Pn || ((e.current = Yi[Pn]), (Yi[Pn] = null), Pn--);
}
function X(e, t) {
  Pn++, (Yi[Pn] = e.current), (e.current = t);
}
var qt = {},
  Se = bt(qt),
  Pe = bt(!1),
  mn = qt;
function Qn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return qt;
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
function Le(e) {
  return (e = e.childContextTypes), e != null;
}
function Jo() {
  Z(Pe), Z(Se);
}
function Ou(e, t, n) {
  if (Se.current !== qt) throw Error(O(168));
  X(Se, t), X(Pe, n);
}
function Tf(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(O(108, fm(e) || "Unknown", o));
  return oe({}, n, r);
}
function bo(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || qt),
    (mn = Se.current),
    X(Se, e),
    X(Pe, Pe.current),
    !0
  );
}
function Ru(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(O(169));
  n
    ? ((e = Tf(e, t, mn)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      Z(Pe),
      Z(Se),
      X(Se, e))
    : Z(Pe),
    X(Pe, n);
}
var wt = null,
  Cl = !1,
  ci = !1;
function Pf(e) {
  wt === null ? (wt = [e]) : wt.push(e);
}
function Rv(e) {
  (Cl = !0), Pf(e);
}
function en() {
  if (!ci && wt !== null) {
    ci = !0;
    var e = 0,
      t = Q;
    try {
      var n = wt;
      for (Q = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (wt = null), (Cl = !1);
    } catch (o) {
      throw (wt !== null && (wt = wt.slice(e + 1)), ef(Ms, en), o);
    } finally {
      (Q = t), (ci = !1);
    }
  }
  return null;
}
var Ln = [],
  jn = 0,
  el = null,
  tl = 0,
  Ve = [],
  He = 0,
  vn = null,
  Et = 1,
  St = "";
function on(e, t) {
  (Ln[jn++] = tl), (Ln[jn++] = el), (el = e), (tl = t);
}
function Lf(e, t, n) {
  (Ve[He++] = Et), (Ve[He++] = St), (Ve[He++] = vn), (vn = e);
  var r = Et;
  e = St;
  var o = 32 - ot(r) - 1;
  (r &= ~(1 << o)), (n += 1);
  var l = 32 - ot(t) + o;
  if (30 < l) {
    var i = o - (o % 5);
    (l = (r & ((1 << i) - 1)).toString(32)),
      (r >>= i),
      (o -= i),
      (Et = (1 << (32 - ot(t) + o)) | (n << o) | r),
      (St = l + e);
  } else (Et = (1 << l) | (n << o) | r), (St = e);
}
function Qs(e) {
  e.return !== null && (on(e, 1), Lf(e, 1, 0));
}
function Ks(e) {
  for (; e === el; )
    (el = Ln[--jn]), (Ln[jn] = null), (tl = Ln[--jn]), (Ln[jn] = null);
  for (; e === vn; )
    (vn = Ve[--He]),
      (Ve[He] = null),
      (St = Ve[--He]),
      (Ve[He] = null),
      (Et = Ve[--He]),
      (Ve[He] = null);
}
var Ie = null,
  Me = null,
  b = !1,
  nt = null;
function jf(e, t) {
  var n = We(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function Tu(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Ie = e), (Me = Wt(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ie = e), (Me = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = vn !== null ? { id: Et, overflow: St } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = We(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ie = e),
            (Me = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Xi(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function qi(e) {
  if (b) {
    var t = Me;
    if (t) {
      var n = t;
      if (!Tu(e, t)) {
        if (Xi(e)) throw Error(O(418));
        t = Wt(n.nextSibling);
        var r = Ie;
        t && Tu(e, t)
          ? jf(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (b = !1), (Ie = e));
      }
    } else {
      if (Xi(e)) throw Error(O(418));
      (e.flags = (e.flags & -4097) | 2), (b = !1), (Ie = e);
    }
  }
}
function Pu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Ie = e;
}
function Eo(e) {
  if (e !== Ie) return !1;
  if (!b) return Pu(e), (b = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Qi(e.type, e.memoizedProps))),
    t && (t = Me))
  ) {
    if (Xi(e)) throw (Df(), Error(O(418)));
    for (; t; ) jf(e, t), (t = Wt(t.nextSibling));
  }
  if ((Pu(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(O(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Me = Wt(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Me = null;
    }
  } else Me = Ie ? Wt(e.stateNode.nextSibling) : null;
  return !0;
}
function Df() {
  for (var e = Me; e; ) e = Wt(e.nextSibling);
}
function Kn() {
  (Me = Ie = null), (b = !1);
}
function Gs(e) {
  nt === null ? (nt = [e]) : nt.push(e);
}
var Tv = Pt.ReactCurrentBatchConfig;
function be(e, t) {
  if (e && e.defaultProps) {
    (t = oe({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
var nl = bt(null),
  rl = null,
  Dn = null,
  Ys = null;
function Xs() {
  Ys = Dn = rl = null;
}
function qs(e) {
  var t = nl.current;
  Z(nl), (e._currentValue = t);
}
function Zi(e, t, n) {
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
function Un(e, t) {
  (rl = e),
    (Ys = Dn = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      ((e.lanes & t) !== 0 && (Te = !0), (e.firstContext = null));
}
function Ke(e) {
  var t = e._currentValue;
  if (Ys !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Dn === null)) {
      if (rl === null) throw Error(O(308));
      (Dn = e), (rl.dependencies = { lanes: 0, firstContext: e });
    } else Dn = Dn.next = e;
  return t;
}
var an = null;
function Zs(e) {
  an === null ? (an = [e]) : an.push(e);
}
function $f(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), Zs(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    _t(e, r)
  );
}
function _t(e, t) {
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
var $t = !1;
function Js(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function zf(e, t) {
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
function kt(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function Qt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), (B & 2) !== 0)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      _t(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), Zs(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    _t(e, n)
  );
}
function $o(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Is(e, n);
  }
}
function Lu(e, t) {
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
function ol(e, t, n, r) {
  var o = e.updateQueue;
  $t = !1;
  var l = o.firstBaseUpdate,
    i = o.lastBaseUpdate,
    s = o.shared.pending;
  if (s !== null) {
    o.shared.pending = null;
    var a = s,
      u = a.next;
    (a.next = null), i === null ? (l = u) : (i.next = u), (i = a);
    var c = e.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (s = c.lastBaseUpdate),
      s !== i &&
        (s === null ? (c.firstBaseUpdate = u) : (s.next = u),
        (c.lastBaseUpdate = a)));
  }
  if (l !== null) {
    var p = o.baseState;
    (i = 0), (c = u = a = null), (s = l);
    do {
      var m = s.lane,
        y = s.eventTime;
      if ((r & m) === m) {
        c !== null &&
          (c = c.next =
            {
              eventTime: y,
              lane: 0,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            });
        e: {
          var g = e,
            S = s;
          switch (((m = t), (y = n), S.tag)) {
            case 1:
              if (((g = S.payload), typeof g == "function")) {
                p = g.call(y, p, m);
                break e;
              }
              p = g;
              break e;
            case 3:
              g.flags = (g.flags & -65537) | 128;
            case 0:
              if (
                ((g = S.payload),
                (m = typeof g == "function" ? g.call(y, p, m) : g),
                m == null)
              )
                break e;
              p = oe({}, p, m);
              break e;
            case 2:
              $t = !0;
          }
        }
        s.callback !== null &&
          s.lane !== 0 &&
          ((e.flags |= 64),
          (m = o.effects),
          m === null ? (o.effects = [s]) : m.push(s));
      } else
        (y = {
          eventTime: y,
          lane: m,
          tag: s.tag,
          payload: s.payload,
          callback: s.callback,
          next: null,
        }),
          c === null ? ((u = c = y), (a = p)) : (c = c.next = y),
          (i |= m);
      if (((s = s.next), s === null)) {
        if (((s = o.shared.pending), s === null)) break;
        (m = s),
          (s = m.next),
          (m.next = null),
          (o.lastBaseUpdate = m),
          (o.shared.pending = null);
      }
    } while (1);
    if (
      (c === null && (a = p),
      (o.baseState = a),
      (o.firstBaseUpdate = u),
      (o.lastBaseUpdate = c),
      (t = o.shared.interleaved),
      t !== null)
    ) {
      o = t;
      do (i |= o.lane), (o = o.next);
      while (o !== t);
    } else l === null && (o.shared.lanes = 0);
    (yn |= i), (e.lanes = i), (e.memoizedState = p);
  }
}
function ju(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        o = r.callback;
      if (o !== null) {
        if (((r.callback = null), (r = n), typeof o != "function"))
          throw Error(O(191, o));
        o.call(r);
      }
    }
}
var Mf = new Dc.Component().refs;
function Ji(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : oe({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Nl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? En(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ne(),
      o = Gt(e),
      l = kt(r, o);
    (l.payload = t),
      n != null && (l.callback = n),
      (t = Qt(e, l, o)),
      t !== null && (lt(t, e, o, r), $o(t, e, o));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = Ne(),
      o = Gt(e),
      l = kt(r, o);
    (l.tag = 1),
      (l.payload = t),
      n != null && (l.callback = n),
      (t = Qt(e, l, o)),
      t !== null && (lt(t, e, o, r), $o(t, e, o));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = Ne(),
      r = Gt(e),
      o = kt(n, r);
    (o.tag = 2),
      t != null && (o.callback = t),
      (t = Qt(e, o, r)),
      t !== null && (lt(t, e, r, n), $o(t, e, r));
  },
};
function Du(e, t, n, r, o, l, i) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, l, i)
      : t.prototype && t.prototype.isPureReactComponent
        ? !Fr(n, r) || !Fr(o, l)
        : !0
  );
}
function If(e, t, n) {
  var r = !1,
    o = qt,
    l = t.contextType;
  return (
    typeof l == "object" && l !== null
      ? (l = Ke(l))
      : ((o = Le(t) ? mn : Se.current),
        (r = t.contextTypes),
        (l = (r = r != null) ? Qn(e, o) : qt)),
    (t = new t(n, l)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Nl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    t
  );
}
function $u(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Nl.enqueueReplaceState(t, t.state, null);
}
function bi(e, t, n, r) {
  var o = e.stateNode;
  (o.props = n), (o.state = e.memoizedState), (o.refs = Mf), Js(e);
  var l = t.contextType;
  typeof l == "object" && l !== null
    ? (o.context = Ke(l))
    : ((l = Le(t) ? mn : Se.current), (o.context = Qn(e, l))),
    (o.state = e.memoizedState),
    (l = t.getDerivedStateFromProps),
    typeof l == "function" && (Ji(e, t, l, n), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && Nl.enqueueReplaceState(o, o.state, null),
      ol(e, n, o, r),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4194308);
}
function ur(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(O(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(O(147, e));
      var o = r,
        l = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === l
        ? t.ref
        : ((t = function (i) {
            var s = o.refs;
            s === Mf && (s = o.refs = {}),
              i === null ? delete s[l] : (s[l] = i);
          }),
          (t._stringRef = l),
          t);
    }
    if (typeof e != "string") throw Error(O(284));
    if (!n._owner) throw Error(O(290, e));
  }
  return e;
}
function So(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      O(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    ))
  );
}
function zu(e) {
  var t = e._init;
  return t(e._payload);
}
function Ff(e) {
  function t(d, f) {
    if (e) {
      var h = d.deletions;
      h === null ? ((d.deletions = [f]), (d.flags |= 16)) : h.push(f);
    }
  }
  function n(d, f) {
    if (!e) return null;
    for (; f !== null; ) t(d, f), (f = f.sibling);
    return null;
  }
  function r(d, f) {
    for (d = new Map(); f !== null; )
      f.key !== null ? d.set(f.key, f) : d.set(f.index, f), (f = f.sibling);
    return d;
  }
  function o(d, f) {
    return (d = Yt(d, f)), (d.index = 0), (d.sibling = null), d;
  }
  function l(d, f, h) {
    return (
      (d.index = h),
      e
        ? ((h = d.alternate),
          h !== null
            ? ((h = h.index), h < f ? ((d.flags |= 2), f) : h)
            : ((d.flags |= 2), f))
        : ((d.flags |= 1048576), f)
    );
  }
  function i(d) {
    return e && d.alternate === null && (d.flags |= 2), d;
  }
  function s(d, f, h, x) {
    return f === null || f.tag !== 6
      ? ((f = yi(h, d.mode, x)), (f.return = d), f)
      : ((f = o(f, h)), (f.return = d), f);
  }
  function a(d, f, h, x) {
    var w = h.type;
    return w === Nn
      ? c(d, f, h.props.children, x, h.key)
      : f !== null &&
          (f.elementType === w ||
            (typeof w == "object" &&
              w !== null &&
              w.$$typeof === Dt &&
              zu(w) === f.type))
        ? ((x = o(f, h.props)), (x.ref = ur(d, f, h)), (x.return = d), x)
        : ((x = Bo(h.type, h.key, h.props, null, d.mode, x)),
          (x.ref = ur(d, f, h)),
          (x.return = d),
          x);
  }
  function u(d, f, h, x) {
    return f === null ||
      f.tag !== 4 ||
      f.stateNode.containerInfo !== h.containerInfo ||
      f.stateNode.implementation !== h.implementation
      ? ((f = gi(h, d.mode, x)), (f.return = d), f)
      : ((f = o(f, h.children || [])), (f.return = d), f);
  }
  function c(d, f, h, x, w) {
    return f === null || f.tag !== 7
      ? ((f = dn(h, d.mode, x, w)), (f.return = d), f)
      : ((f = o(f, h)), (f.return = d), f);
  }
  function p(d, f, h) {
    if ((typeof f == "string" && f !== "") || typeof f == "number")
      return (f = yi("" + f, d.mode, h)), (f.return = d), f;
    if (typeof f == "object" && f !== null) {
      switch (f.$$typeof) {
        case co:
          return (
            (h = Bo(f.type, f.key, f.props, null, d.mode, h)),
            (h.ref = ur(d, null, f)),
            (h.return = d),
            h
          );
        case Cn:
          return (f = gi(f, d.mode, h)), (f.return = d), f;
        case Dt:
          var x = f._init;
          return p(d, x(f._payload), h);
      }
      if (vr(f) || or(f))
        return (f = dn(f, d.mode, h, null)), (f.return = d), f;
      So(d, f);
    }
    return null;
  }
  function m(d, f, h, x) {
    var w = f !== null ? f.key : null;
    if ((typeof h == "string" && h !== "") || typeof h == "number")
      return w !== null ? null : s(d, f, "" + h, x);
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case co:
          return h.key === w ? a(d, f, h, x) : null;
        case Cn:
          return h.key === w ? u(d, f, h, x) : null;
        case Dt:
          return (w = h._init), m(d, f, w(h._payload), x);
      }
      if (vr(h) || or(h)) return w !== null ? null : c(d, f, h, x, null);
      So(d, h);
    }
    return null;
  }
  function y(d, f, h, x, w) {
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return (d = d.get(h) || null), s(f, d, "" + x, w);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case co:
          return (d = d.get(x.key === null ? h : x.key) || null), a(f, d, x, w);
        case Cn:
          return (d = d.get(x.key === null ? h : x.key) || null), u(f, d, x, w);
        case Dt:
          var k = x._init;
          return y(d, f, h, k(x._payload), w);
      }
      if (vr(x) || or(x)) return (d = d.get(h) || null), c(f, d, x, w, null);
      So(f, x);
    }
    return null;
  }
  function g(d, f, h, x) {
    for (
      var w = null, k = null, C = f, _ = (f = 0), $ = null;
      C !== null && _ < h.length;
      _++
    ) {
      C.index > _ ? (($ = C), (C = null)) : ($ = C.sibling);
      var L = m(d, C, h[_], x);
      if (L === null) {
        C === null && (C = $);
        break;
      }
      e && C && L.alternate === null && t(d, C),
        (f = l(L, f, _)),
        k === null ? (w = L) : (k.sibling = L),
        (k = L),
        (C = $);
    }
    if (_ === h.length) return n(d, C), b && on(d, _), w;
    if (C === null) {
      for (; _ < h.length; _++)
        (C = p(d, h[_], x)),
          C !== null &&
            ((f = l(C, f, _)), k === null ? (w = C) : (k.sibling = C), (k = C));
      return b && on(d, _), w;
    }
    for (C = r(d, C); _ < h.length; _++)
      ($ = y(C, d, _, h[_], x)),
        $ !== null &&
          (e && $.alternate !== null && C.delete($.key === null ? _ : $.key),
          (f = l($, f, _)),
          k === null ? (w = $) : (k.sibling = $),
          (k = $));
    return (
      e &&
        C.forEach(function (F) {
          return t(d, F);
        }),
      b && on(d, _),
      w
    );
  }
  function S(d, f, h, x) {
    var w = or(h);
    if (typeof w != "function") throw Error(O(150));
    if (((h = w.call(h)), h == null)) throw Error(O(151));
    for (
      var k = (w = null), C = f, _ = (f = 0), $ = null, L = h.next();
      C !== null && !L.done;
      _++, L = h.next()
    ) {
      C.index > _ ? (($ = C), (C = null)) : ($ = C.sibling);
      var F = m(d, C, L.value, x);
      if (F === null) {
        C === null && (C = $);
        break;
      }
      e && C && F.alternate === null && t(d, C),
        (f = l(F, f, _)),
        k === null ? (w = F) : (k.sibling = F),
        (k = F),
        (C = $);
    }
    if (L.done) return n(d, C), b && on(d, _), w;
    if (C === null) {
      for (; !L.done; _++, L = h.next())
        (L = p(d, L.value, x)),
          L !== null &&
            ((f = l(L, f, _)), k === null ? (w = L) : (k.sibling = L), (k = L));
      return b && on(d, _), w;
    }
    for (C = r(d, C); !L.done; _++, L = h.next())
      (L = y(C, d, _, L.value, x)),
        L !== null &&
          (e && L.alternate !== null && C.delete(L.key === null ? _ : L.key),
          (f = l(L, f, _)),
          k === null ? (w = L) : (k.sibling = L),
          (k = L));
    return (
      e &&
        C.forEach(function (J) {
          return t(d, J);
        }),
      b && on(d, _),
      w
    );
  }
  function N(d, f, h, x) {
    if (
      (typeof h == "object" &&
        h !== null &&
        h.type === Nn &&
        h.key === null &&
        (h = h.props.children),
      typeof h == "object" && h !== null)
    ) {
      switch (h.$$typeof) {
        case co:
          e: {
            for (var w = h.key, k = f; k !== null; ) {
              if (k.key === w) {
                if (((w = h.type), w === Nn)) {
                  if (k.tag === 7) {
                    n(d, k.sibling),
                      (f = o(k, h.props.children)),
                      (f.return = d),
                      (d = f);
                    break e;
                  }
                } else if (
                  k.elementType === w ||
                  (typeof w == "object" &&
                    w !== null &&
                    w.$$typeof === Dt &&
                    zu(w) === k.type)
                ) {
                  n(d, k.sibling),
                    (f = o(k, h.props)),
                    (f.ref = ur(d, k, h)),
                    (f.return = d),
                    (d = f);
                  break e;
                }
                n(d, k);
                break;
              } else t(d, k);
              k = k.sibling;
            }
            h.type === Nn
              ? ((f = dn(h.props.children, d.mode, x, h.key)),
                (f.return = d),
                (d = f))
              : ((x = Bo(h.type, h.key, h.props, null, d.mode, x)),
                (x.ref = ur(d, f, h)),
                (x.return = d),
                (d = x));
          }
          return i(d);
        case Cn:
          e: {
            for (k = h.key; f !== null; ) {
              if (f.key === k)
                if (
                  f.tag === 4 &&
                  f.stateNode.containerInfo === h.containerInfo &&
                  f.stateNode.implementation === h.implementation
                ) {
                  n(d, f.sibling),
                    (f = o(f, h.children || [])),
                    (f.return = d),
                    (d = f);
                  break e;
                } else {
                  n(d, f);
                  break;
                }
              else t(d, f);
              f = f.sibling;
            }
            (f = gi(h, d.mode, x)), (f.return = d), (d = f);
          }
          return i(d);
        case Dt:
          return (k = h._init), N(d, f, k(h._payload), x);
      }
      if (vr(h)) return g(d, f, h, x);
      if (or(h)) return S(d, f, h, x);
      So(d, h);
    }
    return (typeof h == "string" && h !== "") || typeof h == "number"
      ? ((h = "" + h),
        f !== null && f.tag === 6
          ? (n(d, f.sibling), (f = o(f, h)), (f.return = d), (d = f))
          : (n(d, f), (f = yi(h, d.mode, x)), (f.return = d), (d = f)),
        i(d))
      : n(d, f);
  }
  return N;
}
var Gn = Ff(!0),
  Af = Ff(!1),
  no = {},
  mt = bt(no),
  Vr = bt(no),
  Hr = bt(no);
function un(e) {
  if (e === no) throw Error(O(174));
  return e;
}
function bs(e, t) {
  switch ((X(Hr, t), X(Vr, e), X(mt, no), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Li(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Li(t, e));
  }
  Z(mt), X(mt, t);
}
function Yn() {
  Z(mt), Z(Vr), Z(Hr);
}
function Bf(e) {
  un(Hr.current);
  var t = un(mt.current),
    n = Li(t, e.type);
  t !== n && (X(Vr, e), X(mt, n));
}
function ea(e) {
  Vr.current === e && (Z(mt), Z(Vr));
}
var te = bt(0);
function ll(e) {
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
var fi = [];
function ta() {
  for (var e = 0; e < fi.length; e++)
    fi[e]._workInProgressVersionPrimary = null;
  fi.length = 0;
}
var zo = Pt.ReactCurrentDispatcher,
  di = Pt.ReactCurrentBatchConfig,
  hn = 0,
  re = null,
  fe = null,
  me = null,
  il = !1,
  Cr = !1,
  Wr = 0,
  Pv = 0;
function xe() {
  throw Error(O(321));
}
function na(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!st(e[n], t[n])) return !1;
  return !0;
}
function ra(e, t, n, r, o, l) {
  if (
    ((hn = l),
    (re = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (zo.current = e === null || e.memoizedState === null ? $v : zv),
    (e = n(r, o)),
    Cr)
  ) {
    l = 0;
    do {
      if (((Cr = !1), (Wr = 0), 25 <= l)) throw Error(O(301));
      (l += 1),
        (me = fe = null),
        (t.updateQueue = null),
        (zo.current = Mv),
        (e = n(r, o));
    } while (Cr);
  }
  if (
    ((zo.current = sl),
    (t = fe !== null && fe.next !== null),
    (hn = 0),
    (me = fe = re = null),
    (il = !1),
    t)
  )
    throw Error(O(300));
  return e;
}
function oa() {
  var e = Wr !== 0;
  return (Wr = 0), e;
}
function ut() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return me === null ? (re.memoizedState = me = e) : (me = me.next = e), me;
}
function Ge() {
  if (fe === null) {
    var e = re.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = fe.next;
  var t = me === null ? re.memoizedState : me.next;
  if (t !== null) (me = t), (fe = e);
  else {
    if (e === null) throw Error(O(310));
    (fe = e),
      (e = {
        memoizedState: fe.memoizedState,
        baseState: fe.baseState,
        baseQueue: fe.baseQueue,
        queue: fe.queue,
        next: null,
      }),
      me === null ? (re.memoizedState = me = e) : (me = me.next = e);
  }
  return me;
}
function Qr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function pi(e) {
  var t = Ge(),
    n = t.queue;
  if (n === null) throw Error(O(311));
  n.lastRenderedReducer = e;
  var r = fe,
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
      u = l;
    do {
      var c = u.lane;
      if ((hn & c) === c)
        a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action));
      else {
        var p = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        a === null ? ((s = a = p), (i = r)) : (a = a.next = p),
          (re.lanes |= c),
          (yn |= c);
      }
      u = u.next;
    } while (u !== null && u !== l);
    a === null ? (i = r) : (a.next = s),
      st(r, t.memoizedState) || (Te = !0),
      (t.memoizedState = r),
      (t.baseState = i),
      (t.baseQueue = a),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do (l = o.lane), (re.lanes |= l), (yn |= l), (o = o.next);
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function mi(e) {
  var t = Ge(),
    n = t.queue;
  if (n === null) throw Error(O(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    o = n.pending,
    l = t.memoizedState;
  if (o !== null) {
    n.pending = null;
    var i = (o = o.next);
    do (l = e(l, i.action)), (i = i.next);
    while (i !== o);
    st(l, t.memoizedState) || (Te = !0),
      (t.memoizedState = l),
      t.baseQueue === null && (t.baseState = l),
      (n.lastRenderedState = l);
  }
  return [l, r];
}
function Uf() {}
function Vf(e, t) {
  var n = re,
    r = Ge(),
    o = t(),
    l = !st(r.memoizedState, o);
  if (
    (l && ((r.memoizedState = o), (Te = !0)),
    (r = r.queue),
    la(Qf.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || l || (me !== null && me.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      Kr(9, Wf.bind(null, n, r, o, t), void 0, null),
      ve === null)
    )
      throw Error(O(349));
    (hn & 30) !== 0 || Hf(n, t, o);
  }
  return o;
}
function Hf(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = re.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (re.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Wf(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Kf(t) && Gf(e);
}
function Qf(e, t, n) {
  return n(function () {
    Kf(t) && Gf(e);
  });
}
function Kf(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !st(e, n);
  } catch {
    return !0;
  }
}
function Gf(e) {
  var t = _t(e, 1);
  t !== null && lt(t, e, 1, -1);
}
function Mu(e) {
  var t = ut();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Qr,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Dv.bind(null, re, e)),
    [t.memoizedState, e]
  );
}
function Kr(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = re.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (re.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function Yf() {
  return Ge().memoizedState;
}
function Mo(e, t, n, r) {
  var o = ut();
  (re.flags |= e),
    (o.memoizedState = Kr(1 | t, n, void 0, r === void 0 ? null : r));
}
function _l(e, t, n, r) {
  var o = Ge();
  r = r === void 0 ? null : r;
  var l = void 0;
  if (fe !== null) {
    var i = fe.memoizedState;
    if (((l = i.destroy), r !== null && na(r, i.deps))) {
      o.memoizedState = Kr(t, n, l, r);
      return;
    }
  }
  (re.flags |= e), (o.memoizedState = Kr(1 | t, n, l, r));
}
function Iu(e, t) {
  return Mo(8390656, 8, e, t);
}
function la(e, t) {
  return _l(2048, 8, e, t);
}
function Xf(e, t) {
  return _l(4, 2, e, t);
}
function qf(e, t) {
  return _l(4, 4, e, t);
}
function Zf(e, t) {
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
function Jf(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), _l(4, 4, Zf.bind(null, t, e), n)
  );
}
function ia() {}
function bf(e, t) {
  var n = Ge();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && na(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function ed(e, t) {
  var n = Ge();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && na(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function td(e, t, n) {
  return (hn & 21) === 0
    ? (e.baseState && ((e.baseState = !1), (Te = !0)), (e.memoizedState = n))
    : (st(n, t) || ((n = rf()), (re.lanes |= n), (yn |= n), (e.baseState = !0)),
      t);
}
function Lv(e, t) {
  var n = Q;
  (Q = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = di.transition;
  di.transition = {};
  try {
    e(!1), t();
  } finally {
    (Q = n), (di.transition = r);
  }
}
function nd() {
  return Ge().memoizedState;
}
function jv(e, t, n) {
  var r = Gt(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    rd(e))
  )
    od(t, n);
  else if (((n = $f(e, t, n, r)), n !== null)) {
    var o = Ne();
    lt(n, e, r, o), ld(n, t, r);
  }
}
function Dv(e, t, n) {
  var r = Gt(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (rd(e)) od(t, o);
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
        if (((o.hasEagerState = !0), (o.eagerState = s), st(s, i))) {
          var a = t.interleaved;
          a === null
            ? ((o.next = o), Zs(t))
            : ((o.next = a.next), (a.next = o)),
            (t.interleaved = o);
          return;
        }
      } catch {
      } finally {
      }
    (n = $f(e, t, o, r)),
      n !== null && ((o = Ne()), lt(n, e, r, o), ld(n, t, r));
  }
}
function rd(e) {
  var t = e.alternate;
  return e === re || (t !== null && t === re);
}
function od(e, t) {
  Cr = il = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function ld(e, t, n) {
  if ((n & 4194240) !== 0) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Is(e, n);
  }
}
var sl = {
    readContext: Ke,
    useCallback: xe,
    useContext: xe,
    useEffect: xe,
    useImperativeHandle: xe,
    useInsertionEffect: xe,
    useLayoutEffect: xe,
    useMemo: xe,
    useReducer: xe,
    useRef: xe,
    useState: xe,
    useDebugValue: xe,
    useDeferredValue: xe,
    useTransition: xe,
    useMutableSource: xe,
    useSyncExternalStore: xe,
    useId: xe,
    unstable_isNewReconciler: !1,
  },
  $v = {
    readContext: Ke,
    useCallback: function (e, t) {
      return (ut().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: Ke,
    useEffect: Iu,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Mo(4194308, 4, Zf.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Mo(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Mo(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = ut();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = ut();
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
        (e = e.dispatch = jv.bind(null, re, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = ut();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: Mu,
    useDebugValue: ia,
    useDeferredValue: function (e) {
      return (ut().memoizedState = e);
    },
    useTransition: function () {
      var e = Mu(!1),
        t = e[0];
      return (e = Lv.bind(null, e[1])), (ut().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = re,
        o = ut();
      if (b) {
        if (n === void 0) throw Error(O(407));
        n = n();
      } else {
        if (((n = t()), ve === null)) throw Error(O(349));
        (hn & 30) !== 0 || Hf(r, t, n);
      }
      o.memoizedState = n;
      var l = { value: n, getSnapshot: t };
      return (
        (o.queue = l),
        Iu(Qf.bind(null, r, l, e), [e]),
        (r.flags |= 2048),
        Kr(9, Wf.bind(null, r, l, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = ut(),
        t = ve.identifierPrefix;
      if (b) {
        var n = St,
          r = Et;
        (n = (r & ~(1 << (32 - ot(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Wr++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = Pv++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  zv = {
    readContext: Ke,
    useCallback: bf,
    useContext: Ke,
    useEffect: la,
    useImperativeHandle: Jf,
    useInsertionEffect: Xf,
    useLayoutEffect: qf,
    useMemo: ed,
    useReducer: pi,
    useRef: Yf,
    useState: function () {
      return pi(Qr);
    },
    useDebugValue: ia,
    useDeferredValue: function (e) {
      var t = Ge();
      return td(t, fe.memoizedState, e);
    },
    useTransition: function () {
      var e = pi(Qr)[0],
        t = Ge().memoizedState;
      return [e, t];
    },
    useMutableSource: Uf,
    useSyncExternalStore: Vf,
    useId: nd,
    unstable_isNewReconciler: !1,
  },
  Mv = {
    readContext: Ke,
    useCallback: bf,
    useContext: Ke,
    useEffect: la,
    useImperativeHandle: Jf,
    useInsertionEffect: Xf,
    useLayoutEffect: qf,
    useMemo: ed,
    useReducer: mi,
    useRef: Yf,
    useState: function () {
      return mi(Qr);
    },
    useDebugValue: ia,
    useDeferredValue: function (e) {
      var t = Ge();
      return fe === null ? (t.memoizedState = e) : td(t, fe.memoizedState, e);
    },
    useTransition: function () {
      var e = mi(Qr)[0],
        t = Ge().memoizedState;
      return [e, t];
    },
    useMutableSource: Uf,
    useSyncExternalStore: Vf,
    useId: nd,
    unstable_isNewReconciler: !1,
  };
function Xn(e, t) {
  try {
    var n = "",
      r = t;
    do (n += cm(r)), (r = r.return);
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
function vi(e, t, n) {
  return {
    value: e,
    source: null,
    stack: n != null ? n : null,
    digest: t != null ? t : null,
  };
}
function es(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Iv = typeof WeakMap == "function" ? WeakMap : Map;
function id(e, t, n) {
  (n = kt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      ul || ((ul = !0), (cs = r)), es(e, t);
    }),
    n
  );
}
function sd(e, t, n) {
  (n = kt(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    (n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        es(e, t);
      });
  }
  var l = e.stateNode;
  return (
    l !== null &&
      typeof l.componentDidCatch == "function" &&
      (n.callback = function () {
        es(e, t),
          typeof r != "function" &&
            (Kt === null ? (Kt = new Set([this])) : Kt.add(this));
        var i = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: i !== null ? i : "",
        });
      }),
    n
  );
}
function Fu(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Iv();
    var o = new Set();
    r.set(t, o);
  } else (o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o));
  o.has(n) || (o.add(n), (e = Zv.bind(null, e, t, n)), t.then(e, e));
}
function Au(e) {
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
function Bu(e, t, n, r, o) {
  return (e.mode & 1) === 0
    ? (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = kt(-1, 1)), (t.tag = 2), Qt(n, t, 1))),
          (n.lanes |= 1)),
      e)
    : ((e.flags |= 65536), (e.lanes = o), e);
}
var Fv = Pt.ReactCurrentOwner,
  Te = !1;
function Ce(e, t, n, r) {
  t.child = e === null ? Af(t, null, n, r) : Gn(t, e.child, n, r);
}
function Uu(e, t, n, r, o) {
  n = n.render;
  var l = t.ref;
  return (
    Un(t, o),
    (r = ra(e, t, n, r, l, o)),
    (n = oa()),
    e !== null && !Te
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Ot(e, t, o))
      : (b && n && Qs(t), (t.flags |= 1), Ce(e, t, r, o), t.child)
  );
}
function Vu(e, t, n, r, o) {
  if (e === null) {
    var l = n.type;
    return typeof l == "function" &&
      !ma(l) &&
      l.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = l), ad(e, t, l, r, o))
      : ((e = Bo(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((l = e.child), (e.lanes & o) === 0)) {
    var i = l.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : Fr), n(i, r) && e.ref === t.ref)
    )
      return Ot(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = Yt(l, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function ad(e, t, n, r, o) {
  if (e !== null) {
    var l = e.memoizedProps;
    if (Fr(l, r) && e.ref === t.ref)
      if (((Te = !1), (t.pendingProps = r = l), (e.lanes & o) !== 0))
        (e.flags & 131072) !== 0 && (Te = !0);
      else return (t.lanes = e.lanes), Ot(e, t, o);
  }
  return ts(e, t, n, r, o);
}
function ud(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    l = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if ((t.mode & 1) === 0)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        X(zn, ze),
        (ze |= n);
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
          X(zn, ze),
          (ze |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = l !== null ? l.baseLanes : n),
        X(zn, ze),
        (ze |= r);
    }
  else
    l !== null ? ((r = l.baseLanes | n), (t.memoizedState = null)) : (r = n),
      X(zn, ze),
      (ze |= r);
  return Ce(e, t, o, n), t.child;
}
function cd(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ts(e, t, n, r, o) {
  var l = Le(n) ? mn : Se.current;
  return (
    (l = Qn(t, l)),
    Un(t, o),
    (n = ra(e, t, n, r, l, o)),
    (r = oa()),
    e !== null && !Te
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Ot(e, t, o))
      : (b && r && Qs(t), (t.flags |= 1), Ce(e, t, n, o), t.child)
  );
}
function Hu(e, t, n, r, o) {
  if (Le(n)) {
    var l = !0;
    bo(t);
  } else l = !1;
  if ((Un(t, o), t.stateNode === null))
    Io(e, t), If(t, n, r), bi(t, n, r, o), (r = !0);
  else if (e === null) {
    var i = t.stateNode,
      s = t.memoizedProps;
    i.props = s;
    var a = i.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = Ke(u))
      : ((u = Le(n) ? mn : Se.current), (u = Qn(t, u)));
    var c = n.getDerivedStateFromProps,
      p =
        typeof c == "function" ||
        typeof i.getSnapshotBeforeUpdate == "function";
    p ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((s !== r || a !== u) && $u(t, i, r, u)),
      ($t = !1);
    var m = t.memoizedState;
    (i.state = m),
      ol(t, r, i, o),
      (a = t.memoizedState),
      s !== r || m !== a || Pe.current || $t
        ? (typeof c == "function" && (Ji(t, n, c, r), (a = t.memoizedState)),
          (s = $t || Du(t, n, s, r, m, a, u))
            ? (p ||
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
          (i.context = u),
          (r = s))
        : (typeof i.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (i = t.stateNode),
      zf(e, t),
      (s = t.memoizedProps),
      (u = t.type === t.elementType ? s : be(t.type, s)),
      (i.props = u),
      (p = t.pendingProps),
      (m = i.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = Ke(a))
        : ((a = Le(n) ? mn : Se.current), (a = Qn(t, a)));
    var y = n.getDerivedStateFromProps;
    (c =
      typeof y == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function") ||
      (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
        typeof i.componentWillReceiveProps != "function") ||
      ((s !== p || m !== a) && $u(t, i, r, a)),
      ($t = !1),
      (m = t.memoizedState),
      (i.state = m),
      ol(t, r, i, o);
    var g = t.memoizedState;
    s !== p || m !== g || Pe.current || $t
      ? (typeof y == "function" && (Ji(t, n, y, r), (g = t.memoizedState)),
        (u = $t || Du(t, n, u, r, m, g, a) || !1)
          ? (c ||
              (typeof i.UNSAFE_componentWillUpdate != "function" &&
                typeof i.componentWillUpdate != "function") ||
              (typeof i.componentWillUpdate == "function" &&
                i.componentWillUpdate(r, g, a),
              typeof i.UNSAFE_componentWillUpdate == "function" &&
                i.UNSAFE_componentWillUpdate(r, g, a)),
            typeof i.componentDidUpdate == "function" && (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof i.componentDidUpdate != "function" ||
              (s === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 4),
            typeof i.getSnapshotBeforeUpdate != "function" ||
              (s === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = g)),
        (i.props = r),
        (i.state = g),
        (i.context = a),
        (r = u))
      : (typeof i.componentDidUpdate != "function" ||
          (s === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 4),
        typeof i.getSnapshotBeforeUpdate != "function" ||
          (s === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return ns(e, t, n, r, l, o);
}
function ns(e, t, n, r, o, l) {
  cd(e, t);
  var i = (t.flags & 128) !== 0;
  if (!r && !i) return o && Ru(t, n, !1), Ot(e, t, l);
  (r = t.stateNode), (Fv.current = t);
  var s =
    i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && i
      ? ((t.child = Gn(t, e.child, null, l)), (t.child = Gn(t, null, s, l)))
      : Ce(e, t, s, l),
    (t.memoizedState = r.state),
    o && Ru(t, n, !0),
    t.child
  );
}
function fd(e) {
  var t = e.stateNode;
  t.pendingContext
    ? Ou(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Ou(e, t.context, !1),
    bs(e, t.containerInfo);
}
function Wu(e, t, n, r, o) {
  return Kn(), Gs(o), (t.flags |= 256), Ce(e, t, n, r), t.child;
}
var rs = { dehydrated: null, treeContext: null, retryLane: 0 };
function os(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function dd(e, t, n) {
  var r = t.pendingProps,
    o = te.current,
    l = !1,
    i = (t.flags & 128) !== 0,
    s;
  if (
    ((s = i) ||
      (s = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    s
      ? ((l = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (o |= 1),
    X(te, o & 1),
    e === null)
  )
    return (
      qi(t),
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
                : (l = Tl(i, r, 0, null)),
              (e = dn(e, r, n, null)),
              (l.return = t),
              (e.return = t),
              (l.sibling = e),
              (t.child = l),
              (t.child.memoizedState = os(n)),
              (t.memoizedState = rs),
              e)
            : sa(t, i))
    );
  if (((o = e.memoizedState), o !== null && ((s = o.dehydrated), s !== null)))
    return Av(e, t, i, r, s, o, n);
  if (l) {
    (l = r.fallback), (i = t.mode), (o = e.child), (s = o.sibling);
    var a = { mode: "hidden", children: r.children };
    return (
      (i & 1) === 0 && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (t.deletions = null))
        : ((r = Yt(o, a)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      s !== null ? (l = Yt(s, l)) : ((l = dn(l, i, n, null)), (l.flags |= 2)),
      (l.return = t),
      (r.return = t),
      (r.sibling = l),
      (t.child = r),
      (r = l),
      (l = t.child),
      (i = e.child.memoizedState),
      (i =
        i === null
          ? os(n)
          : {
              baseLanes: i.baseLanes | n,
              cachePool: null,
              transitions: i.transitions,
            }),
      (l.memoizedState = i),
      (l.childLanes = e.childLanes & ~n),
      (t.memoizedState = rs),
      r
    );
  }
  return (
    (l = e.child),
    (e = l.sibling),
    (r = Yt(l, { mode: "visible", children: r.children })),
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
function sa(e, t) {
  return (
    (t = Tl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function ko(e, t, n, r) {
  return (
    r !== null && Gs(r),
    Gn(t, e.child, null, n),
    (e = sa(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Av(e, t, n, r, o, l, i) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = vi(Error(O(422)))), ko(e, t, i, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((l = r.fallback),
          (o = t.mode),
          (r = Tl({ mode: "visible", children: r.children }, o, 0, null)),
          (l = dn(l, o, i, null)),
          (l.flags |= 2),
          (r.return = t),
          (l.return = t),
          (r.sibling = l),
          (t.child = r),
          (t.mode & 1) !== 0 && Gn(t, e.child, null, i),
          (t.child.memoizedState = os(i)),
          (t.memoizedState = rs),
          l);
  if ((t.mode & 1) === 0) return ko(e, t, i, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var s = r.dgst;
    return (r = s), (l = Error(O(419))), (r = vi(l, r, void 0)), ko(e, t, i, r);
  }
  if (((s = (i & e.childLanes) !== 0), Te || s)) {
    if (((r = ve), r !== null)) {
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
          ((l.retryLane = o), _t(e, o), lt(r, e, o, -1));
    }
    return pa(), (r = vi(Error(O(421)))), ko(e, t, i, r);
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Jv.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = l.treeContext),
      (Me = Wt(o.nextSibling)),
      (Ie = t),
      (b = !0),
      (nt = null),
      e !== null &&
        ((Ve[He++] = Et),
        (Ve[He++] = St),
        (Ve[He++] = vn),
        (Et = e.id),
        (St = e.overflow),
        (vn = t)),
      (t = sa(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Qu(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), Zi(e.return, t, n);
}
function hi(e, t, n, r, o) {
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
function pd(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    l = r.tail;
  if ((Ce(e, t, r.children, n), (r = te.current), (r & 2) !== 0))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Qu(e, n, t);
        else if (e.tag === 19) Qu(e, n, t);
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
  if ((X(te, r), (t.mode & 1) === 0)) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; )
          (e = n.alternate),
            e !== null && ll(e) === null && (o = n),
            (n = n.sibling);
        (n = o),
          n === null
            ? ((o = t.child), (t.child = null))
            : ((o = n.sibling), (n.sibling = null)),
          hi(t, !1, o, n, l);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (((e = o.alternate), e !== null && ll(e) === null)) {
            t.child = o;
            break;
          }
          (e = o.sibling), (o.sibling = n), (n = o), (o = e);
        }
        hi(t, !0, n, null, l);
        break;
      case "together":
        hi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Io(e, t) {
  (t.mode & 1) === 0 &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Ot(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (yn |= t.lanes),
    (n & t.childLanes) === 0)
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(O(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Yt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = Yt(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function Bv(e, t, n) {
  switch (t.tag) {
    case 3:
      fd(t), Kn();
      break;
    case 5:
      Bf(t);
      break;
    case 1:
      Le(t.type) && bo(t);
      break;
    case 4:
      bs(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        o = t.memoizedProps.value;
      X(nl, r._currentValue), (r._currentValue = o);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (X(te, te.current & 1), (t.flags |= 128), null)
          : (n & t.child.childLanes) !== 0
            ? dd(e, t, n)
            : (X(te, te.current & 1),
              (e = Ot(e, t, n)),
              e !== null ? e.sibling : null);
      X(te, te.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
        if (r) return pd(e, t, n);
        t.flags |= 128;
      }
      if (
        ((o = t.memoizedState),
        o !== null &&
          ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
        X(te, te.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), ud(e, t, n);
  }
  return Ot(e, t, n);
}
var md, ls, vd, hd;
md = function (e, t) {
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
ls = function () {};
vd = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    (e = t.stateNode), un(mt.current);
    var l = null;
    switch (n) {
      case "input":
        (o = Oi(e, o)), (r = Oi(e, r)), (l = []);
        break;
      case "select":
        (o = oe({}, o, { value: void 0 })),
          (r = oe({}, r, { value: void 0 })),
          (l = []);
        break;
      case "textarea":
        (o = Pi(e, o)), (r = Pi(e, r)), (l = []);
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = Zo);
    }
    ji(n, r);
    var i;
    n = null;
    for (u in o)
      if (!r.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null)
        if (u === "style") {
          var s = o[u];
          for (i in s) s.hasOwnProperty(i) && (n || (n = {}), (n[i] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (Lr.hasOwnProperty(u)
              ? l || (l = [])
              : (l = l || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (
        ((s = o != null ? o[u] : void 0),
        r.hasOwnProperty(u) && a !== s && (a != null || s != null))
      )
        if (u === "style")
          if (s) {
            for (i in s)
              !s.hasOwnProperty(i) ||
                (a && a.hasOwnProperty(i)) ||
                (n || (n = {}), (n[i] = ""));
            for (i in a)
              a.hasOwnProperty(i) &&
                s[i] !== a[i] &&
                (n || (n = {}), (n[i] = a[i]));
          } else n || (l || (l = []), l.push(u, n)), (n = a);
        else
          u === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (s = s ? s.__html : void 0),
              a != null && s !== a && (l = l || []).push(u, a))
            : u === "children"
              ? (typeof a != "string" && typeof a != "number") ||
                (l = l || []).push(u, "" + a)
              : u !== "suppressContentEditableWarning" &&
                u !== "suppressHydrationWarning" &&
                (Lr.hasOwnProperty(u)
                  ? (a != null && u === "onScroll" && q("scroll", e),
                    l || s === a || (l = []))
                  : (l = l || []).push(u, a));
    }
    n && (l = l || []).push("style", n);
    var u = l;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
hd = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function cr(e, t) {
  if (!b)
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
function we(e) {
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
function Uv(e, t, n) {
  var r = t.pendingProps;
  switch ((Ks(t), t.tag)) {
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
      return we(t), null;
    case 1:
      return Le(t.type) && Jo(), we(t), null;
    case 3:
      return (
        (r = t.stateNode),
        Yn(),
        Z(Pe),
        Z(Se),
        ta(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Eo(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
              ((t.flags |= 1024), nt !== null && (ps(nt), (nt = null)))),
        ls(e, t),
        we(t),
        null
      );
    case 5:
      ea(t);
      var o = un(Hr.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        vd(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(O(166));
          return we(t), null;
        }
        if (((e = un(mt.current)), Eo(t))) {
          (r = t.stateNode), (n = t.type);
          var l = t.memoizedProps;
          switch (((r[ft] = t), (r[Ur] = l), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              q("cancel", r), q("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              q("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < yr.length; o++) q(yr[o], r);
              break;
            case "source":
              q("error", r);
              break;
            case "img":
            case "image":
            case "link":
              q("error", r), q("load", r);
              break;
            case "details":
              q("toggle", r);
              break;
            case "input":
              eu(r, l), q("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!l.multiple }),
                q("invalid", r);
              break;
            case "textarea":
              nu(r, l), q("invalid", r);
          }
          ji(n, l), (o = null);
          for (var i in l)
            if (l.hasOwnProperty(i)) {
              var s = l[i];
              i === "children"
                ? typeof s == "string"
                  ? r.textContent !== s &&
                    (l.suppressHydrationWarning !== !0 &&
                      wo(r.textContent, s, e),
                    (o = ["children", s]))
                  : typeof s == "number" &&
                    r.textContent !== "" + s &&
                    (l.suppressHydrationWarning !== !0 &&
                      wo(r.textContent, s, e),
                    (o = ["children", "" + s]))
                : Lr.hasOwnProperty(i) &&
                  s != null &&
                  i === "onScroll" &&
                  q("scroll", r);
            }
          switch (n) {
            case "input":
              fo(r), tu(r, l, !0);
              break;
            case "textarea":
              fo(r), ru(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof l.onClick == "function" && (r.onclick = Zo);
          }
          (r = o), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (i = o.nodeType === 9 ? o : o.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Vc(n)),
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
            (e[ft] = t),
            (e[Ur] = r),
            md(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((i = Di(n, r)), n)) {
              case "dialog":
                q("cancel", e), q("close", e), (o = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                q("load", e), (o = r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < yr.length; o++) q(yr[o], e);
                o = r;
                break;
              case "source":
                q("error", e), (o = r);
                break;
              case "img":
              case "image":
              case "link":
                q("error", e), q("load", e), (o = r);
                break;
              case "details":
                q("toggle", e), (o = r);
                break;
              case "input":
                eu(e, r), (o = Oi(e, r)), q("invalid", e);
                break;
              case "option":
                o = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (o = oe({}, r, { value: void 0 })),
                  q("invalid", e);
                break;
              case "textarea":
                nu(e, r), (o = Pi(e, r)), q("invalid", e);
                break;
              default:
                o = r;
            }
            ji(n, o), (s = o);
            for (l in s)
              if (s.hasOwnProperty(l)) {
                var a = s[l];
                l === "style"
                  ? Qc(e, a)
                  : l === "dangerouslySetInnerHTML"
                    ? ((a = a ? a.__html : void 0), a != null && Hc(e, a))
                    : l === "children"
                      ? typeof a == "string"
                        ? (n !== "textarea" || a !== "") && jr(e, a)
                        : typeof a == "number" && jr(e, "" + a)
                      : l !== "suppressContentEditableWarning" &&
                        l !== "suppressHydrationWarning" &&
                        l !== "autoFocus" &&
                        (Lr.hasOwnProperty(l)
                          ? a != null && l === "onScroll" && q("scroll", e)
                          : a != null && Ls(e, l, a, i));
              }
            switch (n) {
              case "input":
                fo(e), tu(e, r, !1);
                break;
              case "textarea":
                fo(e), ru(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Xt(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (l = r.value),
                  l != null
                    ? In(e, !!r.multiple, l, !1)
                    : r.defaultValue != null &&
                      In(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = Zo);
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
      return we(t), null;
    case 6:
      if (e && t.stateNode != null) hd(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(O(166));
        if (((n = un(Hr.current)), un(mt.current), Eo(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[ft] = t),
            (l = r.nodeValue !== n) && ((e = Ie), e !== null))
          )
            switch (e.tag) {
              case 3:
                wo(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  wo(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          l && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[ft] = t),
            (t.stateNode = r);
      }
      return we(t), null;
    case 13:
      if (
        (Z(te),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (b && Me !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
          Df(), Kn(), (t.flags |= 98560), (l = !1);
        else if (((l = Eo(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!l) throw Error(O(318));
            if (
              ((l = t.memoizedState),
              (l = l !== null ? l.dehydrated : null),
              !l)
            )
              throw Error(O(317));
            l[ft] = t;
          } else
            Kn(),
              (t.flags & 128) === 0 && (t.memoizedState = null),
              (t.flags |= 4);
          we(t), (l = !1);
        } else nt !== null && (ps(nt), (nt = null)), (l = !0);
        if (!l) return t.flags & 65536 ? t : null;
      }
      return (t.flags & 128) !== 0
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            (t.mode & 1) !== 0 &&
              (e === null || (te.current & 1) !== 0
                ? de === 0 && (de = 3)
                : pa())),
          t.updateQueue !== null && (t.flags |= 4),
          we(t),
          null);
    case 4:
      return (
        Yn(), ls(e, t), e === null && Ar(t.stateNode.containerInfo), we(t), null
      );
    case 10:
      return qs(t.type._context), we(t), null;
    case 17:
      return Le(t.type) && Jo(), we(t), null;
    case 19:
      if ((Z(te), (l = t.memoizedState), l === null)) return we(t), null;
      if (((r = (t.flags & 128) !== 0), (i = l.rendering), i === null))
        if (r) cr(l, !1);
        else {
          if (de !== 0 || (e !== null && (e.flags & 128) !== 0))
            for (e = t.child; e !== null; ) {
              if (((i = ll(e)), i !== null)) {
                for (
                  t.flags |= 128,
                    cr(l, !1),
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
                return X(te, (te.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          l.tail !== null &&
            ae() > qn &&
            ((t.flags |= 128), (r = !0), cr(l, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = ll(i)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              cr(l, !0),
              l.tail === null && l.tailMode === "hidden" && !i.alternate && !b)
            )
              return we(t), null;
          } else
            2 * ae() - l.renderingStartTime > qn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), cr(l, !1), (t.lanes = 4194304));
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
          (l.renderingStartTime = ae()),
          (t.sibling = null),
          (n = te.current),
          X(te, r ? (n & 1) | 2 : n & 1),
          t)
        : (we(t), null);
    case 22:
    case 23:
      return (
        da(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && (t.mode & 1) !== 0
          ? (ze & 1073741824) !== 0 &&
            (we(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : we(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(O(156, t.tag));
}
function Vv(e, t) {
  switch ((Ks(t), t.tag)) {
    case 1:
      return (
        Le(t.type) && Jo(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Yn(),
        Z(Pe),
        Z(Se),
        ta(),
        (e = t.flags),
        (e & 65536) !== 0 && (e & 128) === 0
          ? ((t.flags = (e & -65537) | 128), t)
          : null
      );
    case 5:
      return ea(t), null;
    case 13:
      if ((Z(te), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(O(340));
        Kn();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return Z(te), null;
    case 4:
      return Yn(), null;
    case 10:
      return qs(t.type._context), null;
    case 22:
    case 23:
      return da(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Co = !1,
  Ee = !1,
  Hv = typeof WeakSet == "function" ? WeakSet : Set,
  P = null;
function $n(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        ie(e, t, r);
      }
    else n.current = null;
}
function is(e, t, n) {
  try {
    n();
  } catch (r) {
    ie(e, t, r);
  }
}
var Ku = !1;
function Wv(e, t) {
  if (((Hi = Yo), (e = wf()), Ws(e))) {
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
            u = 0,
            c = 0,
            p = e,
            m = null;
          t: for (;;) {
            for (
              var y;
              p !== n || (o !== 0 && p.nodeType !== 3) || (s = i + o),
                p !== l || (r !== 0 && p.nodeType !== 3) || (a = i + r),
                p.nodeType === 3 && (i += p.nodeValue.length),
                (y = p.firstChild) !== null;

            )
              (m = p), (p = y);
            for (;;) {
              if (p === e) break t;
              if (
                (m === n && ++u === o && (s = i),
                m === l && ++c === r && (a = i),
                (y = p.nextSibling) !== null)
              )
                break;
              (p = m), (m = p.parentNode);
            }
            p = y;
          }
          n = s === -1 || a === -1 ? null : { start: s, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Wi = { focusedElem: e, selectionRange: n }, Yo = !1, P = t; P !== null; )
    if (((t = P), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (P = e);
    else
      for (; P !== null; ) {
        t = P;
        try {
          var g = t.alternate;
          if ((t.flags & 1024) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (g !== null) {
                  var S = g.memoizedProps,
                    N = g.memoizedState,
                    d = t.stateNode,
                    f = d.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? S : be(t.type, S),
                      N,
                    );
                  d.__reactInternalSnapshotBeforeUpdate = f;
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
                throw Error(O(163));
            }
        } catch (x) {
          ie(t, t.return, x);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (P = e);
          break;
        }
        P = t.return;
      }
  return (g = Ku), (Ku = !1), g;
}
function Nr(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var l = o.destroy;
        (o.destroy = void 0), l !== void 0 && is(t, n, l);
      }
      o = o.next;
    } while (o !== r);
  }
}
function Ol(e, t) {
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
function ss(e) {
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
function yd(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), yd(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[ft], delete t[Ur], delete t[Gi], delete t[_v], delete t[Ov])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function gd(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Gu(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || gd(e.return)) return null;
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
function as(e, t, n) {
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
          n != null || t.onclick !== null || (t.onclick = Zo));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (as(e, t, n), e = e.sibling; e !== null; ) as(e, t, n), (e = e.sibling);
}
function us(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (us(e, t, n), e = e.sibling; e !== null; ) us(e, t, n), (e = e.sibling);
}
var he = null,
  et = !1;
function jt(e, t, n) {
  for (n = n.child; n !== null; ) xd(e, t, n), (n = n.sibling);
}
function xd(e, t, n) {
  if (pt && typeof pt.onCommitFiberUnmount == "function")
    try {
      pt.onCommitFiberUnmount(xl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ee || $n(n, t);
    case 6:
      var r = he,
        o = et;
      (he = null),
        jt(e, t, n),
        (he = r),
        (et = o),
        he !== null &&
          (et
            ? ((e = he),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : he.removeChild(n.stateNode));
      break;
    case 18:
      he !== null &&
        (et
          ? ((e = he),
            (n = n.stateNode),
            e.nodeType === 8
              ? ui(e.parentNode, n)
              : e.nodeType === 1 && ui(e, n),
            Mr(e))
          : ui(he, n.stateNode));
      break;
    case 4:
      (r = he),
        (o = et),
        (he = n.stateNode.containerInfo),
        (et = !0),
        jt(e, t, n),
        (he = r),
        (et = o);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Ee &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        o = r = r.next;
        do {
          var l = o,
            i = l.destroy;
          (l = l.tag),
            i !== void 0 && ((l & 2) !== 0 || (l & 4) !== 0) && is(n, t, i),
            (o = o.next);
        } while (o !== r);
      }
      jt(e, t, n);
      break;
    case 1:
      if (
        !Ee &&
        ($n(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (s) {
          ie(n, t, s);
        }
      jt(e, t, n);
      break;
    case 21:
      jt(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ee = (r = Ee) || n.memoizedState !== null), jt(e, t, n), (Ee = r))
        : jt(e, t, n);
      break;
    default:
      jt(e, t, n);
  }
}
function Yu(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new Hv()),
      t.forEach(function (r) {
        var o = bv.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
  }
}
function Je(e, t) {
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
              (he = s.stateNode), (et = !1);
              break e;
            case 3:
              (he = s.stateNode.containerInfo), (et = !0);
              break e;
            case 4:
              (he = s.stateNode.containerInfo), (et = !0);
              break e;
          }
          s = s.return;
        }
        if (he === null) throw Error(O(160));
        xd(l, i, o), (he = null), (et = !1);
        var a = o.alternate;
        a !== null && (a.return = null), (o.return = null);
      } catch (u) {
        ie(o, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) wd(t, e), (t = t.sibling);
}
function wd(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Je(t, e), at(e), r & 4)) {
        try {
          Nr(3, e, e.return), Ol(3, e);
        } catch (S) {
          ie(e, e.return, S);
        }
        try {
          Nr(5, e, e.return);
        } catch (S) {
          ie(e, e.return, S);
        }
      }
      break;
    case 1:
      Je(t, e), at(e), r & 512 && n !== null && $n(n, n.return);
      break;
    case 5:
      if (
        (Je(t, e),
        at(e),
        r & 512 && n !== null && $n(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          jr(o, "");
        } catch (S) {
          ie(e, e.return, S);
        }
      }
      if (r & 4 && ((o = e.stateNode), o != null)) {
        var l = e.memoizedProps,
          i = n !== null ? n.memoizedProps : l,
          s = e.type,
          a = e.updateQueue;
        if (((e.updateQueue = null), a !== null))
          try {
            s === "input" && l.type === "radio" && l.name != null && Bc(o, l),
              Di(s, i);
            var u = Di(s, l);
            for (i = 0; i < a.length; i += 2) {
              var c = a[i],
                p = a[i + 1];
              c === "style"
                ? Qc(o, p)
                : c === "dangerouslySetInnerHTML"
                  ? Hc(o, p)
                  : c === "children"
                    ? jr(o, p)
                    : Ls(o, c, p, u);
            }
            switch (s) {
              case "input":
                Ri(o, l);
                break;
              case "textarea":
                Uc(o, l);
                break;
              case "select":
                var m = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!l.multiple;
                var y = l.value;
                y != null
                  ? In(o, !!l.multiple, y, !1)
                  : m !== !!l.multiple &&
                    (l.defaultValue != null
                      ? In(o, !!l.multiple, l.defaultValue, !0)
                      : In(o, !!l.multiple, l.multiple ? [] : "", !1));
            }
            o[Ur] = l;
          } catch (S) {
            ie(e, e.return, S);
          }
      }
      break;
    case 6:
      if ((Je(t, e), at(e), r & 4)) {
        if (e.stateNode === null) throw Error(O(162));
        (o = e.stateNode), (l = e.memoizedProps);
        try {
          o.nodeValue = l;
        } catch (S) {
          ie(e, e.return, S);
        }
      }
      break;
    case 3:
      if (
        (Je(t, e), at(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Mr(t.containerInfo);
        } catch (S) {
          ie(e, e.return, S);
        }
      break;
    case 4:
      Je(t, e), at(e);
      break;
    case 13:
      Je(t, e),
        at(e),
        (o = e.child),
        o.flags & 8192 &&
          ((l = o.memoizedState !== null),
          (o.stateNode.isHidden = l),
          !l ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (ca = ae())),
        r & 4 && Yu(e);
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Ee = (u = Ee) || c), Je(t, e), (Ee = u)) : Je(t, e),
        at(e),
        r & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !c && (e.mode & 1) !== 0)
        )
          for (P = e, c = e.child; c !== null; ) {
            for (p = P = c; P !== null; ) {
              switch (((m = P), (y = m.child), m.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Nr(4, m, m.return);
                  break;
                case 1:
                  $n(m, m.return);
                  var g = m.stateNode;
                  if (typeof g.componentWillUnmount == "function") {
                    (r = m), (n = m.return);
                    try {
                      (t = r),
                        (g.props = t.memoizedProps),
                        (g.state = t.memoizedState),
                        g.componentWillUnmount();
                    } catch (S) {
                      ie(r, n, S);
                    }
                  }
                  break;
                case 5:
                  $n(m, m.return);
                  break;
                case 22:
                  if (m.memoizedState !== null) {
                    qu(p);
                    continue;
                  }
              }
              y !== null ? ((y.return = m), (P = y)) : qu(p);
            }
            c = c.sibling;
          }
        e: for (c = null, p = e; ; ) {
          if (p.tag === 5) {
            if (c === null) {
              c = p;
              try {
                (o = p.stateNode),
                  u
                    ? ((l = o.style),
                      typeof l.setProperty == "function"
                        ? l.setProperty("display", "none", "important")
                        : (l.display = "none"))
                    : ((s = p.stateNode),
                      (a = p.memoizedProps.style),
                      (i =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (s.style.display = Wc("display", i)));
              } catch (S) {
                ie(e, e.return, S);
              }
            }
          } else if (p.tag === 6) {
            if (c === null)
              try {
                p.stateNode.nodeValue = u ? "" : p.memoizedProps;
              } catch (S) {
                ie(e, e.return, S);
              }
          } else if (
            ((p.tag !== 22 && p.tag !== 23) ||
              p.memoizedState === null ||
              p === e) &&
            p.child !== null
          ) {
            (p.child.return = p), (p = p.child);
            continue;
          }
          if (p === e) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === e) break e;
            c === p && (c = null), (p = p.return);
          }
          c === p && (c = null), (p.sibling.return = p.return), (p = p.sibling);
        }
      }
      break;
    case 19:
      Je(t, e), at(e), r & 4 && Yu(e);
      break;
    case 21:
      break;
    default:
      Je(t, e), at(e);
  }
}
function at(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (gd(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(O(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (jr(o, ""), (r.flags &= -33));
          var l = Gu(e);
          us(e, l, o);
          break;
        case 3:
        case 4:
          var i = r.stateNode.containerInfo,
            s = Gu(e);
          as(e, s, i);
          break;
        default:
          throw Error(O(161));
      }
    } catch (a) {
      ie(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Qv(e, t, n) {
  (P = e), Ed(e);
}
function Ed(e, t, n) {
  for (var r = (e.mode & 1) !== 0; P !== null; ) {
    var o = P,
      l = o.child;
    if (o.tag === 22 && r) {
      var i = o.memoizedState !== null || Co;
      if (!i) {
        var s = o.alternate,
          a = (s !== null && s.memoizedState !== null) || Ee;
        s = Co;
        var u = Ee;
        if (((Co = i), (Ee = a) && !u))
          for (P = o; P !== null; )
            (i = P),
              (a = i.child),
              i.tag === 22 && i.memoizedState !== null
                ? Zu(o)
                : a !== null
                  ? ((a.return = i), (P = a))
                  : Zu(o);
        for (; l !== null; ) (P = l), Ed(l), (l = l.sibling);
        (P = o), (Co = s), (Ee = u);
      }
      Xu(e);
    } else
      (o.subtreeFlags & 8772) !== 0 && l !== null
        ? ((l.return = o), (P = l))
        : Xu(e);
  }
}
function Xu(e) {
  for (; P !== null; ) {
    var t = P;
    if ((t.flags & 8772) !== 0) {
      var n = t.alternate;
      try {
        if ((t.flags & 8772) !== 0)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ee || Ol(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ee)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : be(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var l = t.updateQueue;
              l !== null && ju(t, l, r);
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
                ju(t, i, n);
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
                var u = t.alternate;
                if (u !== null) {
                  var c = u.memoizedState;
                  if (c !== null) {
                    var p = c.dehydrated;
                    p !== null && Mr(p);
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
              throw Error(O(163));
          }
        Ee || (t.flags & 512 && ss(t));
      } catch (m) {
        ie(t, t.return, m);
      }
    }
    if (t === e) {
      P = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (P = n);
      break;
    }
    P = t.return;
  }
}
function qu(e) {
  for (; P !== null; ) {
    var t = P;
    if (t === e) {
      P = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (P = n);
      break;
    }
    P = t.return;
  }
}
function Zu(e) {
  for (; P !== null; ) {
    var t = P;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Ol(4, t);
          } catch (a) {
            ie(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              ie(t, o, a);
            }
          }
          var l = t.return;
          try {
            ss(t);
          } catch (a) {
            ie(t, l, a);
          }
          break;
        case 5:
          var i = t.return;
          try {
            ss(t);
          } catch (a) {
            ie(t, i, a);
          }
      }
    } catch (a) {
      ie(t, t.return, a);
    }
    if (t === e) {
      P = null;
      break;
    }
    var s = t.sibling;
    if (s !== null) {
      (s.return = t.return), (P = s);
      break;
    }
    P = t.return;
  }
}
var Kv = Math.ceil,
  al = Pt.ReactCurrentDispatcher,
  aa = Pt.ReactCurrentOwner,
  Qe = Pt.ReactCurrentBatchConfig,
  B = 0,
  ve = null,
  ce = null,
  ye = 0,
  ze = 0,
  zn = bt(0),
  de = 0,
  Gr = null,
  yn = 0,
  Rl = 0,
  ua = 0,
  _r = null,
  Re = null,
  ca = 0,
  qn = 1 / 0,
  xt = null,
  ul = !1,
  cs = null,
  Kt = null,
  No = !1,
  Bt = null,
  cl = 0,
  Or = 0,
  fs = null,
  Fo = -1,
  Ao = 0;
function Ne() {
  return (B & 6) !== 0 ? ae() : Fo !== -1 ? Fo : (Fo = ae());
}
function Gt(e) {
  return (e.mode & 1) === 0
    ? 1
    : (B & 2) !== 0 && ye !== 0
      ? ye & -ye
      : Tv.transition !== null
        ? (Ao === 0 && (Ao = rf()), Ao)
        : ((e = Q),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : ff(e.type))),
          e);
}
function lt(e, t, n, r) {
  if (50 < Or) throw ((Or = 0), (fs = null), Error(O(185)));
  br(e, n, r),
    ((B & 2) === 0 || e !== ve) &&
      (e === ve && ((B & 2) === 0 && (Rl |= n), de === 4 && It(e, ye)),
      je(e, r),
      n === 1 &&
        B === 0 &&
        (t.mode & 1) === 0 &&
        ((qn = ae() + 500), Cl && en()));
}
function je(e, t) {
  var n = e.callbackNode;
  Tm(e, t);
  var r = Go(e, e === ve ? ye : 0);
  if (r === 0)
    n !== null && iu(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && iu(n), t === 1))
      e.tag === 0 ? Rv(Ju.bind(null, e)) : Pf(Ju.bind(null, e)),
        Cv(function () {
          (B & 6) === 0 && en();
        }),
        (n = null);
    else {
      switch (of(r)) {
        case 1:
          n = Ms;
          break;
        case 4:
          n = tf;
          break;
        case 16:
          n = Ko;
          break;
        case 536870912:
          n = nf;
          break;
        default:
          n = Ko;
      }
      n = Td(n, Sd.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function Sd(e, t) {
  if (((Fo = -1), (Ao = 0), (B & 6) !== 0)) throw Error(O(327));
  var n = e.callbackNode;
  if (Vn() && e.callbackNode !== n) return null;
  var r = Go(e, e === ve ? ye : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = fl(e, r);
  else {
    t = r;
    var o = B;
    B |= 2;
    var l = Cd();
    (ve !== e || ye !== t) && ((xt = null), (qn = ae() + 500), fn(e, t));
    do
      try {
        Xv();
        break;
      } catch (s) {
        kd(e, s);
      }
    while (1);
    Xs(),
      (al.current = l),
      (B = o),
      ce !== null ? (t = 0) : ((ve = null), (ye = 0), (t = de));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = Fi(e)), o !== 0 && ((r = o), (t = ds(e, o)))), t === 1)
    )
      throw ((n = Gr), fn(e, 0), It(e, r), je(e, ae()), n);
    if (t === 6) It(e, r);
    else {
      if (
        ((o = e.current.alternate),
        (r & 30) === 0 &&
          !Gv(o) &&
          ((t = fl(e, r)),
          t === 2 && ((l = Fi(e)), l !== 0 && ((r = l), (t = ds(e, l)))),
          t === 1))
      )
        throw ((n = Gr), fn(e, 0), It(e, r), je(e, ae()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(O(345));
        case 2:
          ln(e, Re, xt);
          break;
        case 3:
          if (
            (It(e, r), (r & 130023424) === r && ((t = ca + 500 - ae()), 10 < t))
          ) {
            if (Go(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              Ne(), (e.pingedLanes |= e.suspendedLanes & o);
              break;
            }
            e.timeoutHandle = Ki(ln.bind(null, e, Re, xt), t);
            break;
          }
          ln(e, Re, xt);
          break;
        case 4:
          if ((It(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r; ) {
            var i = 31 - ot(r);
            (l = 1 << i), (i = t[i]), i > o && (o = i), (r &= ~l);
          }
          if (
            ((r = o),
            (r = ae() - r),
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
                          : 1960 * Kv(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Ki(ln.bind(null, e, Re, xt), r);
            break;
          }
          ln(e, Re, xt);
          break;
        case 5:
          ln(e, Re, xt);
          break;
        default:
          throw Error(O(329));
      }
    }
  }
  return je(e, ae()), e.callbackNode === n ? Sd.bind(null, e) : null;
}
function ds(e, t) {
  var n = _r;
  return (
    e.current.memoizedState.isDehydrated && (fn(e, t).flags |= 256),
    (e = fl(e, t)),
    e !== 2 && ((t = Re), (Re = n), t !== null && ps(t)),
    e
  );
}
function ps(e) {
  Re === null ? (Re = e) : Re.push.apply(Re, e);
}
function Gv(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            l = o.getSnapshot;
          o = o.value;
          try {
            if (!st(l(), o)) return !1;
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
function It(e, t) {
  for (
    t &= ~ua,
      t &= ~Rl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - ot(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function Ju(e) {
  if ((B & 6) !== 0) throw Error(O(327));
  Vn();
  var t = Go(e, 0);
  if ((t & 1) === 0) return je(e, ae()), null;
  var n = fl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Fi(e);
    r !== 0 && ((t = r), (n = ds(e, r)));
  }
  if (n === 1) throw ((n = Gr), fn(e, 0), It(e, t), je(e, ae()), n);
  if (n === 6) throw Error(O(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    ln(e, Re, xt),
    je(e, ae()),
    null
  );
}
function fa(e, t) {
  var n = B;
  B |= 1;
  try {
    return e(t);
  } finally {
    (B = n), B === 0 && ((qn = ae() + 500), Cl && en());
  }
}
function gn(e) {
  Bt !== null && Bt.tag === 0 && (B & 6) === 0 && Vn();
  var t = B;
  B |= 1;
  var n = Qe.transition,
    r = Q;
  try {
    if (((Qe.transition = null), (Q = 1), e)) return e();
  } finally {
    (Q = r), (Qe.transition = n), (B = t), (B & 6) === 0 && en();
  }
}
function da() {
  (ze = zn.current), Z(zn);
}
function fn(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), kv(n)), ce !== null))
    for (n = ce.return; n !== null; ) {
      var r = n;
      switch ((Ks(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && Jo();
          break;
        case 3:
          Yn(), Z(Pe), Z(Se), ta();
          break;
        case 5:
          ea(r);
          break;
        case 4:
          Yn();
          break;
        case 13:
          Z(te);
          break;
        case 19:
          Z(te);
          break;
        case 10:
          qs(r.type._context);
          break;
        case 22:
        case 23:
          da();
      }
      n = n.return;
    }
  if (
    ((ve = e),
    (ce = e = Yt(e.current, null)),
    (ye = ze = t),
    (de = 0),
    (Gr = null),
    (ua = Rl = yn = 0),
    (Re = _r = null),
    an !== null)
  ) {
    for (t = 0; t < an.length; t++)
      if (((n = an[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          l = n.pending;
        if (l !== null) {
          var i = l.next;
          (l.next = o), (r.next = i);
        }
        n.pending = r;
      }
    an = null;
  }
  return e;
}
function kd(e, t) {
  do {
    var n = ce;
    try {
      if ((Xs(), (zo.current = sl), il)) {
        for (var r = re.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), (r = r.next);
        }
        il = !1;
      }
      if (
        ((hn = 0),
        (me = fe = re = null),
        (Cr = !1),
        (Wr = 0),
        (aa.current = null),
        n === null || n.return === null)
      ) {
        (de = 1), (Gr = t), (ce = null);
        break;
      }
      e: {
        var l = e,
          i = n.return,
          s = n,
          a = t;
        if (
          ((t = ye),
          (s.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var u = a,
            c = s,
            p = c.tag;
          if ((c.mode & 1) === 0 && (p === 0 || p === 11 || p === 15)) {
            var m = c.alternate;
            m
              ? ((c.updateQueue = m.updateQueue),
                (c.memoizedState = m.memoizedState),
                (c.lanes = m.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var y = Au(i);
          if (y !== null) {
            (y.flags &= -257),
              Bu(y, i, s, l, t),
              y.mode & 1 && Fu(l, u, t),
              (t = y),
              (a = u);
            var g = t.updateQueue;
            if (g === null) {
              var S = new Set();
              S.add(a), (t.updateQueue = S);
            } else g.add(a);
            break e;
          } else {
            if ((t & 1) === 0) {
              Fu(l, u, t), pa();
              break e;
            }
            a = Error(O(426));
          }
        } else if (b && s.mode & 1) {
          var N = Au(i);
          if (N !== null) {
            (N.flags & 65536) === 0 && (N.flags |= 256),
              Bu(N, i, s, l, t),
              Gs(Xn(a, s));
            break e;
          }
        }
        (l = a = Xn(a, s)),
          de !== 4 && (de = 2),
          _r === null ? (_r = [l]) : _r.push(l),
          (l = i);
        do {
          switch (l.tag) {
            case 3:
              (l.flags |= 65536), (t &= -t), (l.lanes |= t);
              var d = id(l, a, t);
              Lu(l, d);
              break e;
            case 1:
              s = a;
              var f = l.type,
                h = l.stateNode;
              if (
                (l.flags & 128) === 0 &&
                (typeof f.getDerivedStateFromError == "function" ||
                  (h !== null &&
                    typeof h.componentDidCatch == "function" &&
                    (Kt === null || !Kt.has(h))))
              ) {
                (l.flags |= 65536), (t &= -t), (l.lanes |= t);
                var x = sd(l, s, t);
                Lu(l, x);
                break e;
              }
          }
          l = l.return;
        } while (l !== null);
      }
      _d(n);
    } catch (w) {
      (t = w), ce === n && n !== null && (ce = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Cd() {
  var e = al.current;
  return (al.current = sl), e === null ? sl : e;
}
function pa() {
  (de === 0 || de === 3 || de === 2) && (de = 4),
    ve === null ||
      ((yn & 268435455) === 0 && (Rl & 268435455) === 0) ||
      It(ve, ye);
}
function fl(e, t) {
  var n = B;
  B |= 2;
  var r = Cd();
  (ve !== e || ye !== t) && ((xt = null), fn(e, t));
  do
    try {
      Yv();
      break;
    } catch (o) {
      kd(e, o);
    }
  while (1);
  if ((Xs(), (B = n), (al.current = r), ce !== null)) throw Error(O(261));
  return (ve = null), (ye = 0), de;
}
function Yv() {
  for (; ce !== null; ) Nd(ce);
}
function Xv() {
  for (; ce !== null && !wm(); ) Nd(ce);
}
function Nd(e) {
  var t = Rd(e.alternate, e, ze);
  (e.memoizedProps = e.pendingProps),
    t === null ? _d(e) : (ce = t),
    (aa.current = null);
}
function _d(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), (t.flags & 32768) === 0)) {
      if (((n = Uv(n, t, ze)), n !== null)) {
        ce = n;
        return;
      }
    } else {
      if (((n = Vv(n, t)), n !== null)) {
        (n.flags &= 32767), (ce = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (de = 6), (ce = null);
        return;
      }
    }
    if (((t = t.sibling), t !== null)) {
      ce = t;
      return;
    }
    ce = t = e;
  } while (t !== null);
  de === 0 && (de = 5);
}
function ln(e, t, n) {
  var r = Q,
    o = Qe.transition;
  try {
    (Qe.transition = null), (Q = 1), qv(e, t, n, r);
  } finally {
    (Qe.transition = o), (Q = r);
  }
  return null;
}
function qv(e, t, n, r) {
  do Vn();
  while (Bt !== null);
  if ((B & 6) !== 0) throw Error(O(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(O(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var l = n.lanes | n.childLanes;
  if (
    (Pm(e, l),
    e === ve && ((ce = ve = null), (ye = 0)),
    ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
      No ||
      ((No = !0),
      Td(Ko, function () {
        return Vn(), null;
      })),
    (l = (n.flags & 15990) !== 0),
    (n.subtreeFlags & 15990) !== 0 || l)
  ) {
    (l = Qe.transition), (Qe.transition = null);
    var i = Q;
    Q = 1;
    var s = B;
    (B |= 4),
      (aa.current = null),
      Wv(e, n),
      wd(n, e),
      hv(Wi),
      (Yo = !!Hi),
      (Wi = Hi = null),
      (e.current = n),
      Qv(n),
      Em(),
      (B = s),
      (Q = i),
      (Qe.transition = l);
  } else e.current = n;
  if (
    (No && ((No = !1), (Bt = e), (cl = o)),
    (l = e.pendingLanes),
    l === 0 && (Kt = null),
    Cm(n.stateNode),
    je(e, ae()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest });
  if (ul) throw ((ul = !1), (e = cs), (cs = null), e);
  return (
    (cl & 1) !== 0 && e.tag !== 0 && Vn(),
    (l = e.pendingLanes),
    (l & 1) !== 0 ? (e === fs ? Or++ : ((Or = 0), (fs = e))) : (Or = 0),
    en(),
    null
  );
}
function Vn() {
  if (Bt !== null) {
    var e = of(cl),
      t = Qe.transition,
      n = Q;
    try {
      if (((Qe.transition = null), (Q = 16 > e ? 16 : e), Bt === null))
        var r = !1;
      else {
        if (((e = Bt), (Bt = null), (cl = 0), (B & 6) !== 0))
          throw Error(O(331));
        var o = B;
        for (B |= 4, P = e.current; P !== null; ) {
          var l = P,
            i = l.child;
          if ((P.flags & 16) !== 0) {
            var s = l.deletions;
            if (s !== null) {
              for (var a = 0; a < s.length; a++) {
                var u = s[a];
                for (P = u; P !== null; ) {
                  var c = P;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Nr(8, c, l);
                  }
                  var p = c.child;
                  if (p !== null) (p.return = c), (P = p);
                  else
                    for (; P !== null; ) {
                      c = P;
                      var m = c.sibling,
                        y = c.return;
                      if ((yd(c), c === u)) {
                        P = null;
                        break;
                      }
                      if (m !== null) {
                        (m.return = y), (P = m);
                        break;
                      }
                      P = y;
                    }
                }
              }
              var g = l.alternate;
              if (g !== null) {
                var S = g.child;
                if (S !== null) {
                  g.child = null;
                  do {
                    var N = S.sibling;
                    (S.sibling = null), (S = N);
                  } while (S !== null);
                }
              }
              P = l;
            }
          }
          if ((l.subtreeFlags & 2064) !== 0 && i !== null)
            (i.return = l), (P = i);
          else
            e: for (; P !== null; ) {
              if (((l = P), (l.flags & 2048) !== 0))
                switch (l.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Nr(9, l, l.return);
                }
              var d = l.sibling;
              if (d !== null) {
                (d.return = l.return), (P = d);
                break e;
              }
              P = l.return;
            }
        }
        var f = e.current;
        for (P = f; P !== null; ) {
          i = P;
          var h = i.child;
          if ((i.subtreeFlags & 2064) !== 0 && h !== null)
            (h.return = i), (P = h);
          else
            e: for (i = f; P !== null; ) {
              if (((s = P), (s.flags & 2048) !== 0))
                try {
                  switch (s.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ol(9, s);
                  }
                } catch (w) {
                  ie(s, s.return, w);
                }
              if (s === i) {
                P = null;
                break e;
              }
              var x = s.sibling;
              if (x !== null) {
                (x.return = s.return), (P = x);
                break e;
              }
              P = s.return;
            }
        }
        if (
          ((B = o), en(), pt && typeof pt.onPostCommitFiberRoot == "function")
        )
          try {
            pt.onPostCommitFiberRoot(xl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (Q = n), (Qe.transition = t);
    }
  }
  return !1;
}
function bu(e, t, n) {
  (t = Xn(n, t)),
    (t = id(e, t, 1)),
    (e = Qt(e, t, 1)),
    (t = Ne()),
    e !== null && (br(e, 1, t), je(e, t));
}
function ie(e, t, n) {
  if (e.tag === 3) bu(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        bu(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Kt === null || !Kt.has(r)))
        ) {
          (e = Xn(n, e)),
            (e = sd(t, e, 1)),
            (t = Qt(t, e, 1)),
            (e = Ne()),
            t !== null && (br(t, 1, e), je(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function Zv(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = Ne()),
    (e.pingedLanes |= e.suspendedLanes & n),
    ve === e &&
      (ye & n) === n &&
      (de === 4 || (de === 3 && (ye & 130023424) === ye && 500 > ae() - ca)
        ? fn(e, 0)
        : (ua |= n)),
    je(e, t);
}
function Od(e, t) {
  t === 0 &&
    ((e.mode & 1) === 0
      ? (t = 1)
      : ((t = vo), (vo <<= 1), (vo & 130023424) === 0 && (vo = 4194304)));
  var n = Ne();
  (e = _t(e, t)), e !== null && (br(e, t, n), je(e, n));
}
function Jv(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), Od(e, n);
}
function bv(e, t) {
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
      throw Error(O(314));
  }
  r !== null && r.delete(t), Od(e, n);
}
var Rd;
Rd = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Pe.current) Te = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
        return (Te = !1), Bv(e, t, n);
      Te = (e.flags & 131072) !== 0;
    }
  else (Te = !1), b && (t.flags & 1048576) !== 0 && Lf(t, tl, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      Io(e, t), (e = t.pendingProps);
      var o = Qn(t, Se.current);
      Un(t, n), (o = ra(null, t, r, e, o, n));
      var l = oa();
      return (
        (t.flags |= 1),
        typeof o == "object" &&
        o !== null &&
        typeof o.render == "function" &&
        o.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Le(r) ? ((l = !0), bo(t)) : (l = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            Js(t),
            (o.updater = Nl),
            (t.stateNode = o),
            (o._reactInternals = t),
            bi(t, r, e, n),
            (t = ns(null, t, r, !0, l, n)))
          : ((t.tag = 0), b && l && Qs(t), Ce(null, t, o, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Io(e, t),
          (e = t.pendingProps),
          (o = r._init),
          (r = o(r._payload)),
          (t.type = r),
          (o = t.tag = th(r)),
          (e = be(r, e)),
          o)
        ) {
          case 0:
            t = ts(null, t, r, e, n);
            break e;
          case 1:
            t = Hu(null, t, r, e, n);
            break e;
          case 11:
            t = Uu(null, t, r, e, n);
            break e;
          case 14:
            t = Vu(null, t, r, be(r.type, e), n);
            break e;
        }
        throw Error(O(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : be(r, o)),
        ts(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : be(r, o)),
        Hu(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((fd(t), e === null)) throw Error(O(387));
        (r = t.pendingProps),
          (l = t.memoizedState),
          (o = l.element),
          zf(e, t),
          ol(t, r, null, n);
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
            (o = Xn(Error(O(423)), t)), (t = Wu(e, t, r, n, o));
            break e;
          } else if (r !== o) {
            (o = Xn(Error(O(424)), t)), (t = Wu(e, t, r, n, o));
            break e;
          } else
            for (
              Me = Wt(t.stateNode.containerInfo.firstChild),
                Ie = t,
                b = !0,
                nt = null,
                n = Af(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Kn(), r === o)) {
            t = Ot(e, t, n);
            break e;
          }
          Ce(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Bf(t),
        e === null && qi(t),
        (r = t.type),
        (o = t.pendingProps),
        (l = e !== null ? e.memoizedProps : null),
        (i = o.children),
        Qi(r, o) ? (i = null) : l !== null && Qi(r, l) && (t.flags |= 32),
        cd(e, t),
        Ce(e, t, i, n),
        t.child
      );
    case 6:
      return e === null && qi(t), null;
    case 13:
      return dd(e, t, n);
    case 4:
      return (
        bs(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Gn(t, null, r, n)) : Ce(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : be(r, o)),
        Uu(e, t, r, o, n)
      );
    case 7:
      return Ce(e, t, t.pendingProps, n), t.child;
    case 8:
      return Ce(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return Ce(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (o = t.pendingProps),
          (l = t.memoizedProps),
          (i = o.value),
          X(nl, r._currentValue),
          (r._currentValue = i),
          l !== null)
        )
          if (st(l.value, i)) {
            if (l.children === o.children && !Pe.current) {
              t = Ot(e, t, n);
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
                      (a = kt(-1, n & -n)), (a.tag = 2);
                      var u = l.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var c = u.pending;
                        c === null
                          ? (a.next = a)
                          : ((a.next = c.next), (c.next = a)),
                          (u.pending = a);
                      }
                    }
                    (l.lanes |= n),
                      (a = l.alternate),
                      a !== null && (a.lanes |= n),
                      Zi(l.return, n, t),
                      (s.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (l.tag === 10) i = l.type === t.type ? null : l.child;
              else if (l.tag === 18) {
                if (((i = l.return), i === null)) throw Error(O(341));
                (i.lanes |= n),
                  (s = i.alternate),
                  s !== null && (s.lanes |= n),
                  Zi(i, n, t),
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
        Ce(e, t, o.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        Un(t, n),
        (o = Ke(o)),
        (r = r(o)),
        (t.flags |= 1),
        Ce(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = be(r, t.pendingProps)),
        (o = be(r.type, o)),
        Vu(e, t, r, o, n)
      );
    case 15:
      return ad(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : be(r, o)),
        Io(e, t),
        (t.tag = 1),
        Le(r) ? ((e = !0), bo(t)) : (e = !1),
        Un(t, n),
        If(t, r, o),
        bi(t, r, o, n),
        ns(null, t, r, !0, e, n)
      );
    case 19:
      return pd(e, t, n);
    case 22:
      return ud(e, t, n);
  }
  throw Error(O(156, t.tag));
};
function Td(e, t) {
  return ef(e, t);
}
function eh(e, t, n, r) {
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
function We(e, t, n, r) {
  return new eh(e, t, n, r);
}
function ma(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function th(e) {
  if (typeof e == "function") return ma(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Ds)) return 11;
    if (e === $s) return 14;
  }
  return 2;
}
function Yt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = We(e.tag, t, e.key, e.mode)),
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
function Bo(e, t, n, r, o, l) {
  var i = 2;
  if (((r = e), typeof e == "function")) ma(e) && (i = 1);
  else if (typeof e == "string") i = 5;
  else
    e: switch (e) {
      case Nn:
        return dn(n.children, o, l, t);
      case js:
        (i = 8), (o |= 8);
        break;
      case ki:
        return (
          (e = We(12, n, t, o | 2)), (e.elementType = ki), (e.lanes = l), e
        );
      case Ci:
        return (e = We(13, n, t, o)), (e.elementType = Ci), (e.lanes = l), e;
      case Ni:
        return (e = We(19, n, t, o)), (e.elementType = Ni), (e.lanes = l), e;
      case Ic:
        return Tl(n, o, l, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case zc:
              i = 10;
              break e;
            case Mc:
              i = 9;
              break e;
            case Ds:
              i = 11;
              break e;
            case $s:
              i = 14;
              break e;
            case Dt:
              (i = 16), (r = null);
              break e;
          }
        throw Error(O(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = We(i, n, t, o)), (t.elementType = e), (t.type = r), (t.lanes = l), t
  );
}
function dn(e, t, n, r) {
  return (e = We(7, e, r, t)), (e.lanes = n), e;
}
function Tl(e, t, n, r) {
  return (
    (e = We(22, e, r, t)),
    (e.elementType = Ic),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function yi(e, t, n) {
  return (e = We(6, e, null, t)), (e.lanes = n), e;
}
function gi(e, t, n) {
  return (
    (t = We(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function nh(e, t, n, r, o) {
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
    (this.eventTimes = Jl(0)),
    (this.expirationTimes = Jl(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Jl(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null);
}
function va(e, t, n, r, o, l, i, s, a) {
  return (
    (e = new nh(e, t, n, s, a)),
    t === 1 ? ((t = 1), l === !0 && (t |= 8)) : (t = 0),
    (l = We(3, null, null, t)),
    (e.current = l),
    (l.stateNode = e),
    (l.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Js(l),
    e
  );
}
function rh(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Cn,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Pd(e) {
  if (!e) return qt;
  e = e._reactInternals;
  e: {
    if (En(e) !== e || e.tag !== 1) throw Error(O(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Le(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(O(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Le(n)) return Tf(e, n, t);
  }
  return t;
}
function Ld(e, t, n, r, o, l, i, s, a) {
  return (
    (e = va(n, r, !0, e, o, l, i, s, a)),
    (e.context = Pd(null)),
    (n = e.current),
    (r = Ne()),
    (o = Gt(n)),
    (l = kt(r, o)),
    (l.callback = t != null ? t : null),
    Qt(n, l, o),
    (e.current.lanes = o),
    br(e, o, r),
    je(e, r),
    e
  );
}
function Pl(e, t, n, r) {
  var o = t.current,
    l = Ne(),
    i = Gt(o);
  return (
    (n = Pd(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = kt(l, i)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = Qt(o, t, i)),
    e !== null && (lt(e, o, i, l), $o(e, o, i)),
    i
  );
}
function dl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function ec(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function ha(e, t) {
  ec(e, t), (e = e.alternate) && ec(e, t);
}
function oh() {
  return null;
}
var jd =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function ya(e) {
  this._internalRoot = e;
}
Ll.prototype.render = ya.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(O(409));
  Pl(e, t, null, null);
};
Ll.prototype.unmount = ya.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    gn(function () {
      Pl(null, e, null, null);
    }),
      (t[Nt] = null);
  }
};
function Ll(e) {
  this._internalRoot = e;
}
Ll.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = af();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Mt.length && t !== 0 && t < Mt[n].priority; n++);
    Mt.splice(n, 0, e), n === 0 && cf(e);
  }
};
function ga(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function jl(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function tc() {}
function lh(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var l = r;
      r = function () {
        var u = dl(i);
        l.call(u);
      };
    }
    var i = Ld(t, r, e, 0, null, !1, !1, "", tc);
    return (
      (e._reactRootContainer = i),
      (e[Nt] = i.current),
      Ar(e.nodeType === 8 ? e.parentNode : e),
      gn(),
      i
    );
  }
  for (; (o = e.lastChild); ) e.removeChild(o);
  if (typeof r == "function") {
    var s = r;
    r = function () {
      var u = dl(a);
      s.call(u);
    };
  }
  var a = va(e, 0, !1, null, null, !1, !1, "", tc);
  return (
    (e._reactRootContainer = a),
    (e[Nt] = a.current),
    Ar(e.nodeType === 8 ? e.parentNode : e),
    gn(function () {
      Pl(t, a, n, r);
    }),
    a
  );
}
function Dl(e, t, n, r, o) {
  var l = n._reactRootContainer;
  if (l) {
    var i = l;
    if (typeof o == "function") {
      var s = o;
      o = function () {
        var a = dl(i);
        s.call(a);
      };
    }
    Pl(t, i, e, o);
  } else i = lh(n, t, e, o, r);
  return dl(i);
}
lf = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = hr(t.pendingLanes);
        n !== 0 &&
          (Is(t, n | 1),
          je(t, ae()),
          (B & 6) === 0 && ((qn = ae() + 500), en()));
      }
      break;
    case 13:
      gn(function () {
        var r = _t(e, 1);
        if (r !== null) {
          var o = Ne();
          lt(r, e, 1, o);
        }
      }),
        ha(e, 1);
  }
};
Fs = function (e) {
  if (e.tag === 13) {
    var t = _t(e, 134217728);
    if (t !== null) {
      var n = Ne();
      lt(t, e, 134217728, n);
    }
    ha(e, 134217728);
  }
};
sf = function (e) {
  if (e.tag === 13) {
    var t = Gt(e),
      n = _t(e, t);
    if (n !== null) {
      var r = Ne();
      lt(n, e, t, r);
    }
    ha(e, t);
  }
};
af = function () {
  return Q;
};
uf = function (e, t) {
  var n = Q;
  try {
    return (Q = e), t();
  } finally {
    Q = n;
  }
};
zi = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Ri(e, n), (t = n.name), n.type === "radio" && t != null)) {
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
            var o = kl(r);
            if (!o) throw Error(O(90));
            Ac(r), Ri(r, o);
          }
        }
      }
      break;
    case "textarea":
      Uc(e, n);
      break;
    case "select":
      (t = n.value), t != null && In(e, !!n.multiple, t, !1);
  }
};
Yc = fa;
Xc = gn;
var ih = { usingClientEntryPoint: !1, Events: [to, Tn, kl, Kc, Gc, fa] },
  fr = {
    findFiberByHostInstance: sn,
    bundleType: 0,
    version: "18.2.0",
    rendererPackageName: "react-dom",
  },
  sh = {
    bundleType: fr.bundleType,
    version: fr.version,
    rendererPackageName: fr.rendererPackageName,
    rendererConfig: fr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Pt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Jc(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: fr.findFiberByHostInstance || oh,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.2.0-next-9e3b772b8-20220608",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var _o = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!_o.isDisabled && _o.supportsFiber)
    try {
      (xl = _o.inject(sh)), (pt = _o);
    } catch {}
}
Ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ih;
Ae.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!ga(t)) throw Error(O(200));
  return rh(e, t, null, n);
};
Ae.createRoot = function (e, t) {
  if (!ga(e)) throw Error(O(299));
  var n = !1,
    r = "",
    o = jd;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = va(e, 1, !1, null, null, n, !1, r, o)),
    (e[Nt] = t.current),
    Ar(e.nodeType === 8 ? e.parentNode : e),
    new ya(t)
  );
};
Ae.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(O(188))
      : ((e = Object.keys(e).join(",")), Error(O(268, e)));
  return (e = Jc(t)), (e = e === null ? null : e.stateNode), e;
};
Ae.flushSync = function (e) {
  return gn(e);
};
Ae.hydrate = function (e, t, n) {
  if (!jl(t)) throw Error(O(200));
  return Dl(null, e, t, !0, n);
};
Ae.hydrateRoot = function (e, t, n) {
  if (!ga(e)) throw Error(O(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    l = "",
    i = jd;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (l = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (i = n.onRecoverableError)),
    (t = Ld(t, null, e, 1, n != null ? n : null, o, !1, l, i)),
    (e[Nt] = t.current),
    Ar(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (o = n._getVersion),
        (o = o(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, o])
          : t.mutableSourceEagerHydrationData.push(n, o);
  return new Ll(t);
};
Ae.render = function (e, t, n) {
  if (!jl(t)) throw Error(O(200));
  return Dl(null, e, t, !1, n);
};
Ae.unmountComponentAtNode = function (e) {
  if (!jl(e)) throw Error(O(40));
  return e._reactRootContainer
    ? (gn(function () {
        Dl(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[Nt] = null);
        });
      }),
      !0)
    : !1;
};
Ae.unstable_batchedUpdates = fa;
Ae.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!jl(n)) throw Error(O(200));
  if (e == null || e._reactInternals === void 0) throw Error(O(38));
  return Dl(e, t, n, !1, r);
};
Ae.version = "18.2.0-next-9e3b772b8-20220608";
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
  t(), (e.exports = Ae);
})(Rs);
const Mn = kc(Rs.exports);
var Dd,
  nc = Rs.exports;
(Dd = nc.createRoot), nc.hydrateRoot;
var $d = { exports: {} };
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
})($d);
const M = $d.exports;
var T = { exports: {} },
  $l = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ah = E.exports,
  uh = Symbol.for("react.element"),
  ch = Symbol.for("react.fragment"),
  fh = Object.prototype.hasOwnProperty,
  dh = ah.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  ph = { key: !0, ref: !0, __self: !0, __source: !0 };
function zd(e, t, n) {
  var r,
    o = {},
    l = null,
    i = null;
  n !== void 0 && (l = "" + n),
    t.key !== void 0 && (l = "" + t.key),
    t.ref !== void 0 && (i = t.ref);
  for (r in t) fh.call(t, r) && !ph.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: uh,
    type: e,
    key: l,
    ref: i,
    props: o,
    _owner: dh.current,
  };
}
$l.Fragment = ch;
$l.jsx = zd;
$l.jsxs = zd;
(function (e) {
  e.exports = $l;
})(T);
const mh = ["xxl", "xl", "lg", "md", "sm", "xs"],
  vh = "xs",
  zl = E.exports.createContext({
    prefixes: {},
    breakpoints: mh,
    minBreakpoint: vh,
  });
function A(e, t) {
  const { prefixes: n } = E.exports.useContext(zl);
  return e || n[t] || t;
}
function Md() {
  const { breakpoints: e } = E.exports.useContext(zl);
  return e;
}
function Id() {
  const { minBreakpoint: e } = E.exports.useContext(zl);
  return e;
}
function Fd() {
  const { dir: e } = E.exports.useContext(zl);
  return e === "rtl";
}
const hh = { fluid: !1 },
  xa = E.exports.forwardRef(
    ({ bsPrefix: e, fluid: t, as: n = "div", className: r, ...o }, l) => {
      const i = A(e, "container"),
        s = typeof t == "string" ? `-${t}` : "-fluid";
      return T.exports.jsx(n, {
        ref: l,
        ...o,
        className: M(r, t ? `${i}${s}` : i),
      });
    },
  );
xa.displayName = "Container";
xa.defaultProps = hh;
const Hn = E.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = A(e, "row"),
      i = Md(),
      s = Id(),
      a = `${l}-cols`,
      u = [];
    return (
      i.forEach((c) => {
        const p = r[c];
        delete r[c];
        let m;
        p != null && typeof p == "object" ? ({ cols: m } = p) : (m = p);
        const y = c !== s ? `-${c}` : "";
        m != null && u.push(`${a}${y}-${m}`);
      }),
      T.exports.jsx(n, { ref: o, ...r, className: M(t, l, ...u) })
    );
  },
);
Hn.displayName = "Row";
function yh({ as: e, bsPrefix: t, className: n, ...r }) {
  t = A(t, "col");
  const o = Md(),
    l = Id(),
    i = [],
    s = [];
  return (
    o.forEach((a) => {
      const u = r[a];
      delete r[a];
      let c, p, m;
      typeof u == "object" && u != null
        ? ({ span: c, offset: p, order: m } = u)
        : (c = u);
      const y = a !== l ? `-${a}` : "";
      c && i.push(c === !0 ? `${t}${y}` : `${t}${y}-${c}`),
        m != null && s.push(`order${y}-${m}`),
        p != null && s.push(`offset${y}-${p}`);
    }),
    [
      { ...r, className: M(n, ...i, ...s) },
      { as: e, bsPrefix: t, spans: i },
    ]
  );
}
const tt = E.exports.forwardRef((e, t) => {
  const [{ className: n, ...r }, { as: o = "div", bsPrefix: l, spans: i }] =
    yh(e);
  return T.exports.jsx(o, { ...r, ref: t, className: M(n, !i.length && l) });
});
tt.displayName = "Col";
function ms() {
  return (
    (ms = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    ms.apply(this, arguments)
  );
}
function Ad(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function rc(e) {
  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
}
function gh(e) {
  var t = xh(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
function xh(e, t) {
  if (typeof e != "object" || e === null) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Bd(e, t, n) {
  var r = E.exports.useRef(e !== void 0),
    o = E.exports.useState(t),
    l = o[0],
    i = o[1],
    s = e !== void 0,
    a = r.current;
  return (
    (r.current = s),
    !s && a && l !== t && i(t),
    [
      s ? e : l,
      E.exports.useCallback(
        function (u) {
          for (
            var c = arguments.length, p = new Array(c > 1 ? c - 1 : 0), m = 1;
            m < c;
            m++
          )
            p[m - 1] = arguments[m];
          n && n.apply(void 0, [u].concat(p)), i(u);
        },
        [n],
      ),
    ]
  );
}
function wh(e, t) {
  return Object.keys(t).reduce(function (n, r) {
    var o,
      l = n,
      i = l[rc(r)],
      s = l[r],
      a = Ad(l, [rc(r), r].map(gh)),
      u = t[r],
      c = Bd(s, i, e[u]),
      p = c[0],
      m = c[1];
    return ms({}, a, ((o = {}), (o[r] = p), (o[u] = m), o));
  }, e);
}
function vs(e, t) {
  return (
    (vs = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (r, o) {
          return (r.__proto__ = o), r;
        }),
    vs(e, t)
  );
}
function Eh(e, t) {
  (e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    vs(e, t);
}
function Ml(e) {
  return (e && e.ownerDocument) || document;
}
function Sh(e) {
  var t = Ml(e);
  return (t && t.defaultView) || window;
}
function kh(e, t) {
  return Sh(e).getComputedStyle(e, t);
}
var Ch = /([A-Z])/g;
function Nh(e) {
  return e.replace(Ch, "-$1").toLowerCase();
}
var _h = /^ms-/;
function Oo(e) {
  return Nh(e).replace(_h, "-ms-");
}
var Oh =
  /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function Rh(e) {
  return !!(e && Oh.test(e));
}
function pl(e, t) {
  var n = "",
    r = "";
  if (typeof t == "string")
    return e.style.getPropertyValue(Oo(t)) || kh(e).getPropertyValue(Oo(t));
  Object.keys(t).forEach(function (o) {
    var l = t[o];
    !l && l !== 0
      ? e.style.removeProperty(Oo(o))
      : Rh(o)
        ? (r += o + "(" + l + ") ")
        : (n += Oo(o) + ": " + l + ";");
  }),
    r && (n += "transform: " + r + ";"),
    (e.style.cssText += ";" + n);
}
var vt = { exports: {} },
  Th = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  Ph = Th,
  Lh = Ph;
function Ud() {}
function Vd() {}
Vd.resetWarningCache = Ud;
var jh = function () {
  function e(r, o, l, i, s, a) {
    if (a !== Lh) {
      var u = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
      );
      throw ((u.name = "Invariant Violation"), u);
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
    checkPropTypes: Vd,
    resetWarningCache: Ud,
  };
  return (n.PropTypes = n), n;
};
vt.exports = jh();
const oc = { disabled: !1 },
  Hd = v.createContext(null);
var Dh = function (t) {
    return t.scrollTop;
  },
  gr = "unmounted",
  zt = "exited",
  ct = "entering",
  Ft = "entered",
  Yr = "exiting",
  Lt = (function (e) {
    Eh(t, e);
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
            ? ((a = zt), (l.appearStatus = ct))
            : (a = Ft)
          : r.unmountOnExit || r.mountOnEnter
            ? (a = gr)
            : (a = zt),
        (l.state = { status: a }),
        (l.nextCallback = null),
        l
      );
    }
    t.getDerivedStateFromProps = function (o, l) {
      var i = o.in;
      return i && l.status === gr ? { status: zt } : null;
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
            ? i !== ct && i !== Ft && (l = ct)
            : (i === ct || i === Ft) && (l = Yr);
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
          if ((this.cancelNextCallback(), l === ct)) {
            if (this.props.unmountOnExit || this.props.mountOnEnter) {
              var i = this.props.nodeRef
                ? this.props.nodeRef.current
                : Mn.findDOMNode(this);
              i && Dh(i);
            }
            this.performEnter(o);
          } else this.performExit();
        else
          this.props.unmountOnExit &&
            this.state.status === zt &&
            this.setState({ status: gr });
      }),
      (n.performEnter = function (o) {
        var l = this,
          i = this.props.enter,
          s = this.context ? this.context.isMounting : o,
          a = this.props.nodeRef ? [s] : [Mn.findDOMNode(this), s],
          u = a[0],
          c = a[1],
          p = this.getTimeouts(),
          m = s ? p.appear : p.enter;
        if ((!o && !i) || oc.disabled) {
          this.safeSetState({ status: Ft }, function () {
            l.props.onEntered(u);
          });
          return;
        }
        this.props.onEnter(u, c),
          this.safeSetState({ status: ct }, function () {
            l.props.onEntering(u, c),
              l.onTransitionEnd(m, function () {
                l.safeSetState({ status: Ft }, function () {
                  l.props.onEntered(u, c);
                });
              });
          });
      }),
      (n.performExit = function () {
        var o = this,
          l = this.props.exit,
          i = this.getTimeouts(),
          s = this.props.nodeRef ? void 0 : Mn.findDOMNode(this);
        if (!l || oc.disabled) {
          this.safeSetState({ status: zt }, function () {
            o.props.onExited(s);
          });
          return;
        }
        this.props.onExit(s),
          this.safeSetState({ status: Yr }, function () {
            o.props.onExiting(s),
              o.onTransitionEnd(i.exit, function () {
                o.safeSetState({ status: zt }, function () {
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
            : Mn.findDOMNode(this),
          s = o == null && !this.props.addEndListener;
        if (!i || s) {
          setTimeout(this.nextCallback, 0);
          return;
        }
        if (this.props.addEndListener) {
          var a = this.props.nodeRef
              ? [this.nextCallback]
              : [i, this.nextCallback],
            u = a[0],
            c = a[1];
          this.props.addEndListener(u, c);
        }
        o != null && setTimeout(this.nextCallback, o);
      }),
      (n.render = function () {
        var o = this.state.status;
        if (o === gr) return null;
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
        var s = Ad(l, [
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
        return v.createElement(
          Hd.Provider,
          { value: null },
          typeof i == "function"
            ? i(o, s)
            : v.cloneElement(v.Children.only(i), s),
        );
      }),
      t
    );
  })(v.Component);
Lt.contextType = Hd;
Lt.propTypes = {};
function kn() {}
Lt.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: kn,
  onEntering: kn,
  onEntered: kn,
  onExit: kn,
  onExiting: kn,
  onExited: kn,
};
Lt.UNMOUNTED = gr;
Lt.EXITED = zt;
Lt.ENTERING = ct;
Lt.ENTERED = Ft;
Lt.EXITING = Yr;
const wa = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
var hs = !1,
  ys = !1;
try {
  var xi = {
    get passive() {
      return (hs = !0);
    },
    get once() {
      return (ys = hs = !0);
    },
  };
  wa &&
    (window.addEventListener("test", xi, xi),
    window.removeEventListener("test", xi, !0));
} catch {}
function $h(e, t, n, r) {
  if (r && typeof r != "boolean" && !ys) {
    var o = r.once,
      l = r.capture,
      i = n;
    !ys &&
      o &&
      ((i =
        n.__once ||
        function s(a) {
          this.removeEventListener(t, s, l), n.call(this, a);
        }),
      (n.__once = i)),
      e.addEventListener(t, i, hs ? r : l);
  }
  e.addEventListener(t, n, r);
}
function zh(e, t, n, r) {
  var o = r && typeof r != "boolean" ? r.capture : r;
  e.removeEventListener(t, n, o),
    n.__once && e.removeEventListener(t, n.__once, o);
}
function cn(e, t, n, r) {
  return (
    $h(e, t, n, r),
    function () {
      zh(e, t, n, r);
    }
  );
}
function Mh(e, t, n, r) {
  if ((n === void 0 && (n = !1), r === void 0 && (r = !0), e)) {
    var o = document.createEvent("HTMLEvents");
    o.initEvent(t, n, r), e.dispatchEvent(o);
  }
}
function Ih(e) {
  var t = pl(e, "transitionDuration") || "",
    n = t.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(t) * n;
}
function Fh(e, t, n) {
  n === void 0 && (n = 5);
  var r = !1,
    o = setTimeout(function () {
      r || Mh(e, "transitionend", !0);
    }, t + n),
    l = cn(
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
function Ah(e, t, n, r) {
  n == null && (n = Ih(e) || 0);
  var o = Fh(e, n, r),
    l = cn(e, "transitionend", t);
  return function () {
    o(), l();
  };
}
function lc(e, t) {
  const n = pl(e, t) || "",
    r = n.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(n) * r;
}
function Wd(e, t) {
  const n = lc(e, "transitionDuration"),
    r = lc(e, "transitionDelay"),
    o = Ah(
      e,
      (l) => {
        l.target === e && (o(), t(l));
      },
      n + r,
    );
}
function dr(...e) {
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
function Qd(e) {
  e.offsetHeight;
}
var ic = function (t) {
  return !t || typeof t == "function"
    ? t
    : function (n) {
        t.current = n;
      };
};
function Bh(e, t) {
  var n = ic(e),
    r = ic(t);
  return function (o) {
    n && n(o), r && r(o);
  };
}
function Il(e, t) {
  return E.exports.useMemo(
    function () {
      return Bh(e, t);
    },
    [e, t],
  );
}
function ml(e) {
  return e && "setState" in e ? Mn.findDOMNode(e) : e != null ? e : null;
}
const Kd = v.forwardRef(
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
        ...u
      },
      c,
    ) => {
      const p = E.exports.useRef(null),
        m = Il(p, a),
        y = (k) => {
          m(ml(k));
        },
        g = (k) => (C) => {
          k && p.current && k(p.current, C);
        },
        S = E.exports.useCallback(g(e), [e]),
        N = E.exports.useCallback(g(t), [t]),
        d = E.exports.useCallback(g(n), [n]),
        f = E.exports.useCallback(g(r), [r]),
        h = E.exports.useCallback(g(o), [o]),
        x = E.exports.useCallback(g(l), [l]),
        w = E.exports.useCallback(g(i), [i]);
      return T.exports.jsx(Lt, {
        ref: c,
        ...u,
        onEnter: S,
        onEntered: d,
        onEntering: N,
        onExit: f,
        onExited: x,
        onExiting: h,
        addEndListener: w,
        nodeRef: p,
        children:
          typeof s == "function"
            ? (k, C) => s(k, { ...C, ref: y })
            : v.cloneElement(s, { ref: y }),
      });
    },
  ),
  Uh = {
    height: ["marginTop", "marginBottom"],
    width: ["marginLeft", "marginRight"],
  };
function Gd(e, t) {
  const n = `offset${e[0].toUpperCase()}${e.slice(1)}`,
    r = t[n],
    o = Uh[e];
  return r + parseInt(pl(t, o[0]), 10) + parseInt(pl(t, o[1]), 10);
}
const Vh = {
    [zt]: "collapse",
    [Yr]: "collapsing",
    [ct]: "collapsing",
    [Ft]: "collapse show",
  },
  Hh = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
    getDimensionValue: Gd,
  },
  Yd = v.forwardRef(
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
        getDimensionValue: a = Gd,
        ...u
      },
      c,
    ) => {
      const p = typeof s == "function" ? s() : s,
        m = E.exports.useMemo(
          () =>
            dr((d) => {
              d.style[p] = "0";
            }, e),
          [p, e],
        ),
        y = E.exports.useMemo(
          () =>
            dr((d) => {
              const f = `scroll${p[0].toUpperCase()}${p.slice(1)}`;
              d.style[p] = `${d[f]}px`;
            }, t),
          [p, t],
        ),
        g = E.exports.useMemo(
          () =>
            dr((d) => {
              d.style[p] = null;
            }, n),
          [p, n],
        ),
        S = E.exports.useMemo(
          () =>
            dr((d) => {
              (d.style[p] = `${a(p, d)}px`), Qd(d);
            }, r),
          [r, a, p],
        ),
        N = E.exports.useMemo(
          () =>
            dr((d) => {
              d.style[p] = null;
            }, o),
          [p, o],
        );
      return T.exports.jsx(Kd, {
        ref: c,
        addEndListener: Wd,
        ...u,
        "aria-expanded": u.role ? u.in : null,
        onEnter: m,
        onEntering: y,
        onEntered: g,
        onExit: S,
        onExiting: N,
        childRef: i.ref,
        children: (d, f) =>
          v.cloneElement(i, {
            ...f,
            className: M(
              l,
              i.props.className,
              Vh[d],
              p === "width" && "collapse-horizontal",
            ),
          }),
      });
    },
  );
Yd.defaultProps = Hh;
function Xd(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
const ro = E.exports.createContext({});
ro.displayName = "AccordionContext";
const Ea = E.exports.forwardRef(
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
    const { activeEventKey: s } = E.exports.useContext(ro);
    return (
      (t = A(t, "accordion-collapse")),
      T.exports.jsx(Yd, {
        ref: i,
        in: Xd(s, o),
        ...l,
        className: M(n, t),
        children: T.exports.jsx(e, { children: E.exports.Children.only(r) }),
      })
    );
  },
);
Ea.displayName = "AccordionCollapse";
const Fl = E.exports.createContext({ eventKey: "" });
Fl.displayName = "AccordionItemContext";
const qd = E.exports.forwardRef(
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
      ...u
    },
    c,
  ) => {
    t = A(t, "accordion-body");
    const { eventKey: p } = E.exports.useContext(Fl);
    return T.exports.jsx(Ea, {
      eventKey: p,
      onEnter: r,
      onEntering: o,
      onEntered: l,
      onExit: i,
      onExiting: s,
      onExited: a,
      children: T.exports.jsx(e, { ref: c, ...u, className: M(n, t) }),
    });
  },
);
qd.displayName = "AccordionBody";
function Wh(e, t) {
  const {
    activeEventKey: n,
    onSelect: r,
    alwaysOpen: o,
  } = E.exports.useContext(ro);
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
const Sa = E.exports.forwardRef(
  ({ as: e = "button", bsPrefix: t, className: n, onClick: r, ...o }, l) => {
    t = A(t, "accordion-button");
    const { eventKey: i } = E.exports.useContext(Fl),
      s = Wh(i, r),
      { activeEventKey: a } = E.exports.useContext(ro);
    return (
      e === "button" && (o.type = "button"),
      T.exports.jsx(e, {
        ref: l,
        onClick: s,
        ...o,
        "aria-expanded": i === a,
        className: M(n, t, !Xd(a, i) && "collapsed"),
      })
    );
  },
);
Sa.displayName = "AccordionButton";
const Zd = E.exports.forwardRef(
  (
    { as: e = "h2", bsPrefix: t, className: n, children: r, onClick: o, ...l },
    i,
  ) => (
    (t = A(t, "accordion-header")),
    T.exports.jsx(e, {
      ref: i,
      ...l,
      className: M(n, t),
      children: T.exports.jsx(Sa, { onClick: o, children: r }),
    })
  ),
);
Zd.displayName = "AccordionHeader";
const Jd = E.exports.forwardRef(
  ({ as: e = "div", bsPrefix: t, className: n, eventKey: r, ...o }, l) => {
    t = A(t, "accordion-item");
    const i = E.exports.useMemo(() => ({ eventKey: r }), [r]);
    return T.exports.jsx(Fl.Provider, {
      value: i,
      children: T.exports.jsx(e, { ref: l, ...o, className: M(n, t) }),
    });
  },
);
Jd.displayName = "AccordionItem";
const bd = E.exports.forwardRef((e, t) => {
  const {
      as: n = "div",
      activeKey: r,
      bsPrefix: o,
      className: l,
      onSelect: i,
      flush: s,
      alwaysOpen: a,
      ...u
    } = wh(e, { activeKey: "onSelect" }),
    c = A(o, "accordion"),
    p = E.exports.useMemo(
      () => ({ activeEventKey: r, onSelect: i, alwaysOpen: a }),
      [r, i, a],
    );
  return T.exports.jsx(ro.Provider, {
    value: p,
    children: T.exports.jsx(n, {
      ref: t,
      ...u,
      className: M(l, c, s && `${c}-flush`),
    }),
  });
});
bd.displayName = "Accordion";
const Ue = Object.assign(bd, {
    Button: Sa,
    Collapse: Ea,
    Item: Jd,
    Header: Zd,
    Body: qd,
  }),
  Qh = { vertical: !1, role: "group" },
  Al = E.exports.forwardRef(
    (
      { bsPrefix: e, size: t, vertical: n, className: r, as: o = "div", ...l },
      i,
    ) => {
      const s = A(e, "btn-group");
      let a = s;
      return (
        n && (a = `${s}-vertical`),
        T.exports.jsx(o, { ...l, ref: i, className: M(r, a, t && `${s}-${t}`) })
      );
    },
  );
Al.displayName = "ButtonGroup";
Al.defaultProps = Qh;
const gs = E.exports.forwardRef(
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
        ...u
      },
      c,
    ) => {
      const p = A(e, "table"),
        m = M(
          t,
          p,
          s && `${p}-${s}`,
          i && `${p}-${i}`,
          n && `${p}-${typeof n == "string" ? `striped-${n}` : "striped"}`,
          r && `${p}-bordered`,
          o && `${p}-borderless`,
          l && `${p}-hover`,
        ),
        y = T.exports.jsx("table", { ...u, className: m, ref: c });
      if (a) {
        let g = `${p}-responsive`;
        return (
          typeof a == "string" && (g = `${g}-${a}`),
          T.exports.jsx("div", { className: g, children: y })
        );
      }
      return y;
    },
  ),
  Kh = ["as", "disabled"];
function Gh(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Yh(e) {
  return !e || e.trim() === "#";
}
function ep({
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
  const u = { tagName: e };
  if (e === "button") return [{ type: a || "button", disabled: t }, u];
  const c = (m) => {
      if (((t || (e === "a" && Yh(n))) && m.preventDefault(), t)) {
        m.stopPropagation();
        return;
      }
      i == null || i(m);
    },
    p = (m) => {
      m.key === " " && (m.preventDefault(), c(m));
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
        onClick: c,
        onKeyDown: p,
      },
      u,
    ]
  );
}
const Xh = E.exports.forwardRef((e, t) => {
  let { as: n, disabled: r } = e,
    o = Gh(e, Kh);
  const [l, { tagName: i }] = ep(Object.assign({ tagName: n, disabled: r }, o));
  return T.exports.jsx(i, Object.assign({}, o, l, { ref: t }));
});
Xh.displayName = "Button";
const qh = { variant: "primary", active: !1, disabled: !1 },
  it = E.exports.forwardRef(
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
      const a = A(t, "btn"),
        [u, { tagName: c }] = ep({ tagName: e, ...i }),
        p = c;
      return T.exports.jsx(p, {
        ...u,
        ...i,
        ref: s,
        className: M(
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
it.displayName = "Button";
it.defaultProps = qh;
const Zh = window.location.origin;
function Jh(e, t = {}) {
  const n = new URL(e, Zh);
  return Object.keys(t).forEach((r) => n.searchParams.append(r, t[r])), n;
}
async function Bl(e, t = {}) {
  const { params: n, ...r } = t,
    o = Jh(e, n),
    l = await fetch(o, r);
  if (!l.ok) throw new Error(`API error: ${l.status} ${l.statusText}`);
  return l.json();
}
function tp(e, t = !1) {
  return Bl("api/cancel", {
    method: "POST",
    params: { rid: e, force: t },
  }).catch((n) => {
    throw (console.error("Cancel RID error:", n.message), n);
  });
}
function bh(e, t, n, r = {}, o = "main") {
  const l = {
    log_level: 30,
    file: e,
    class_name: t,
    arguments: r,
    repo_rev: n,
  };
  return Bl("api/schedule", {
    method: "POST",
    params: { pipeline: o },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(l),
  });
}
function ey() {
  return Bl("api/schedule");
}
function ty() {
  return Bl("api/explist");
}
function ny(e) {
  const [t, n] = v.useState(!1),
    r = () => {
      n(!0),
        tp(e.rid)
          .then(() => {
            console.log(`RID ${e.rid} termination requested`), n(!1);
          })
          .catch((o) => {
            console.error(`Error cancelling RID ${e.rid}:`, o.message), n(!1);
          });
    };
  return v.createElement(
    it,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    "Request Termination",
  );
}
function ry(e) {
  const [t, n] = v.useState(!1),
    r = () => {
      n(!0),
        tp(e.rid, !0)
          .then(() => {
            console.log(`RID ${e.rid} force cancelled`), n(!1);
          })
          .catch((o) => {
            console.error(`Error force cancelling RID ${e.rid}:`, o.message),
              n(!1);
          });
    };
  return v.createElement(
    it,
    { variant: "danger", disabled: t, onClick: t ? null : r },
    "Force cancellation",
  );
}
function oy(e) {
  const t = e.rid,
    n = e.data.expid.class_name,
    r = e.data.expid.file,
    o = e.data.pipeline,
    l = e.data.status,
    i = e.data.expid.repo_rev,
    s = e.data.expid.arguments,
    a = (u, c) =>
      v.createElement(
        "tr",
        { key: u },
        v.createElement("td", null, v.createElement("b", null, u, ":")),
        v.createElement("td", null, c),
      );
  return v.createElement(
    Ue.Item,
    { eventKey: t },
    v.createElement(
      Ue.Header,
      null,
      v.createElement("b", null, "(", t, ")"),
      " \u2002 ",
      n,
      " \u2002 ",
      v.createElement("em", null, l),
    ),
    v.createElement(
      Ue.Body,
      null,
      v.createElement(
        gs,
        { striped: !0, bordered: !0, hover: !0 },
        v.createElement(
          "tbody",
          null,
          a("RID", t),
          a("Class name", n),
          a("File", r),
          a("Repo rev", i),
          a("Pipeline", o),
          a("Status", v.createElement("em", null, l)),
        ),
      ),
      v.createElement(
        Ue,
        null,
        v.createElement(
          Ue.Item,
          { eventKey: "args" },
          v.createElement(
            Ue.Header,
            null,
            "Arguments \u2002 ",
            v.createElement("em", null, "(click to expand)"),
          ),
          v.createElement(
            Ue.Body,
            null,
            v.createElement(
              gs,
              { striped: !0, bordered: !0, hover: !0 },
              v.createElement(
                "tbody",
                null,
                Object.keys(s).map((u) => a(u, String(s[u]))),
              ),
            ),
          ),
        ),
      ),
      v.createElement(
        Al,
        { className: "mt-3" },
        v.createElement(ny, { rid: t }),
        v.createElement(ry, { rid: t }),
      ),
    ),
  );
}
const ly = 1e3;
function iy() {
  const [e, t] = v.useState({});
  return (
    v.useEffect(() => {
      const n = () => {
        ey()
          .then(t)
          .catch((o) => console.error("Schedule update error:", o.message));
      };
      n();
      const r = setInterval(n, ly);
      return () => {
        clearInterval(r);
      };
    }, []),
    v.createElement(
      Ue,
      { defaultActiveKey: "0" },
      Object.keys(e).map((n) =>
        v.createElement(oy, { key: n, rid: n, data: e[n] }),
      ),
    )
  );
}
var sy = /-(.)/g;
function ay(e) {
  return e.replace(sy, function (t, n) {
    return n.toUpperCase();
  });
}
const uy = (e) => e[0].toUpperCase() + ay(e).slice(1);
function qe(e, { displayName: t = uy(e), Component: n, defaultProps: r } = {}) {
  const o = E.exports.forwardRef(
    ({ className: l, bsPrefix: i, as: s = n || "div", ...a }, u) => {
      const c = A(i, e);
      return T.exports.jsx(s, { ref: u, className: M(l, c), ...a });
    },
  );
  return (o.defaultProps = r), (o.displayName = t), o;
}
const np = (e) =>
    E.exports.forwardRef((t, n) =>
      T.exports.jsx("div", { ...t, ref: n, className: M(t.className, e) }),
    ),
  rp = E.exports.forwardRef(
    ({ bsPrefix: e, className: t, variant: n, as: r = "img", ...o }, l) => {
      const i = A(e, "card-img");
      return T.exports.jsx(r, {
        ref: l,
        className: M(n ? `${i}-${n}` : i, t),
        ...o,
      });
    },
  );
rp.displayName = "CardImg";
const op = E.exports.createContext(null);
op.displayName = "CardHeaderContext";
const lp = E.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "div", ...r }, o) => {
    const l = A(e, "card-header"),
      i = E.exports.useMemo(() => ({ cardHeaderBsPrefix: l }), [l]);
    return T.exports.jsx(op.Provider, {
      value: i,
      children: T.exports.jsx(n, { ref: o, ...r, className: M(t, l) }),
    });
  },
);
lp.displayName = "CardHeader";
const cy = np("h5"),
  fy = np("h6"),
  ip = qe("card-body"),
  dy = qe("card-title", { Component: cy }),
  py = qe("card-subtitle", { Component: fy }),
  my = qe("card-link", { Component: "a" }),
  vy = qe("card-text", { Component: "p" }),
  hy = qe("card-footer"),
  yy = qe("card-img-overlay"),
  gy = { body: !1 },
  ka = E.exports.forwardRef(
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
      u,
    ) => {
      const c = A(e, "card");
      return T.exports.jsx(s, {
        ref: u,
        ...a,
        className: M(
          t,
          c,
          n && `bg-${n}`,
          r && `text-${r}`,
          o && `border-${o}`,
        ),
        children: l ? T.exports.jsx(ip, { children: i }) : i,
      });
    },
  );
ka.displayName = "Card";
ka.defaultProps = gy;
const rt = Object.assign(ka, {
  Img: rp,
  Title: dy,
  Subtitle: py,
  Body: ip,
  Link: my,
  Text: vy,
  Header: lp,
  Footer: hy,
  ImgOverlay: yy,
});
function sp() {
  var e = E.exports.useRef(!0),
    t = E.exports.useRef(function () {
      return e.current;
    });
  return (
    E.exports.useEffect(function () {
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
function xy(e) {
  var t = E.exports.useRef(e);
  return (t.current = e), t;
}
function wy(e) {
  var t = xy(e);
  E.exports.useEffect(function () {
    return function () {
      return t.current();
    };
  }, []);
}
var xs = Math.pow(2, 31) - 1;
function ap(e, t, n) {
  var r = n - Date.now();
  e.current =
    r <= xs
      ? setTimeout(t, r)
      : setTimeout(function () {
          return ap(e, t, n);
        }, xs);
}
function up() {
  var e = sp(),
    t = E.exports.useRef();
  return (
    wy(function () {
      return clearTimeout(t.current);
    }),
    E.exports.useMemo(function () {
      var n = function () {
        return clearTimeout(t.current);
      };
      function r(o, l) {
        l === void 0 && (l = 0),
          e() &&
            (n(),
            l <= xs
              ? (t.current = setTimeout(o, l))
              : ap(t, o, Date.now() + l));
      }
      return { set: r, clear: n };
    }, [])
  );
}
const Ey = {
    in: !1,
    timeout: 300,
    mountOnEnter: !1,
    unmountOnExit: !1,
    appear: !1,
  },
  Sy = { [ct]: "show", [Ft]: "show" },
  oo = E.exports.forwardRef(
    ({ className: e, children: t, transitionClasses: n = {}, ...r }, o) => {
      const l = E.exports.useCallback(
        (i, s) => {
          Qd(i), r.onEnter == null || r.onEnter(i, s);
        },
        [r],
      );
      return T.exports.jsx(Kd, {
        ref: o,
        addEndListener: Wd,
        ...r,
        onEnter: l,
        childRef: t.ref,
        children: (i, s) =>
          E.exports.cloneElement(t, {
            ...s,
            className: M("fade", e, t.props.className, Sy[i], n[i]),
          }),
      });
    },
  );
oo.defaultProps = Ey;
oo.displayName = "Fade";
const ky = { [ct]: "showing", [Yr]: "showing show" },
  cp = E.exports.forwardRef((e, t) =>
    T.exports.jsx(oo, { ...e, ref: t, transitionClasses: ky }),
  );
cp.displayName = "ToastFade";
function Cy(e) {
  var t = E.exports.useRef(e);
  return (
    E.exports.useEffect(
      function () {
        t.current = e;
      },
      [e],
    ),
    t
  );
}
function Xr(e) {
  var t = Cy(e);
  return E.exports.useCallback(
    function () {
      return t.current && t.current.apply(t, arguments);
    },
    [t],
  );
}
const Ny = {
    "aria-label": vt.exports.string,
    onClick: vt.exports.func,
    variant: vt.exports.oneOf(["white"]),
  },
  _y = { "aria-label": "Close" },
  Ul = E.exports.forwardRef(({ className: e, variant: t, ...n }, r) =>
    T.exports.jsx("button", {
      ref: r,
      type: "button",
      className: M("btn-close", t && `btn-close-${t}`, e),
      ...n,
    }),
  );
Ul.displayName = "CloseButton";
Ul.propTypes = Ny;
Ul.defaultProps = _y;
const fp = E.exports.createContext({ onClose() {} }),
  Oy = { closeLabel: "Close", closeButton: !0 },
  Ca = E.exports.forwardRef(
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
      e = A(e, "toast-header");
      const a = E.exports.useContext(fp),
        u = Xr((c) => {
          a == null || a.onClose == null || a.onClose(c);
        });
      return T.exports.jsxs("div", {
        ref: s,
        ...i,
        className: M(e, o),
        children: [
          l,
          r &&
            T.exports.jsx(Ul, {
              "aria-label": t,
              variant: n,
              onClick: u,
              "data-dismiss": "toast",
            }),
        ],
      });
    },
  );
Ca.displayName = "ToastHeader";
Ca.defaultProps = Oy;
const Ry = qe("toast-body"),
  dp = E.exports.forwardRef(
    (
      {
        bsPrefix: e,
        className: t,
        transition: n = cp,
        show: r = !0,
        animation: o = !0,
        delay: l = 5e3,
        autohide: i = !1,
        onClose: s,
        bg: a,
        ...u
      },
      c,
    ) => {
      e = A(e, "toast");
      const p = E.exports.useRef(l),
        m = E.exports.useRef(s);
      E.exports.useEffect(() => {
        (p.current = l), (m.current = s);
      }, [l, s]);
      const y = up(),
        g = !!(i && r),
        S = E.exports.useCallback(() => {
          g && (m.current == null || m.current());
        }, [g]);
      E.exports.useEffect(() => {
        y.set(S, p.current);
      }, [y, S]);
      const N = E.exports.useMemo(() => ({ onClose: s }), [s]),
        d = !!(n && o),
        f = T.exports.jsx("div", {
          ...u,
          ref: c,
          className: M(e, t, a && `bg-${a}`, !d && (r ? "show" : "hide")),
          role: "alert",
          "aria-live": "assertive",
          "aria-atomic": "true",
        });
      return T.exports.jsx(fp.Provider, {
        value: N,
        children:
          d && n
            ? T.exports.jsx(n, { in: r, unmountOnExit: !0, children: f })
            : f,
      });
    },
  );
dp.displayName = "Toast";
const wi = Object.assign(dp, { Body: Ry, Header: Ca }),
  Ty = {
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
  pp = E.exports.forwardRef(
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
      (e = A(e, "toast-container")),
      T.exports.jsx(o, {
        ref: i,
        ...l,
        className: M(e, t && [n ? `position-${n}` : null, Ty[t]], r),
      })
    ),
  );
pp.displayName = "ToastContainer";
const Py = {
    type: vt.exports.string,
    tooltip: vt.exports.bool,
    as: vt.exports.elementType,
  },
  Vl = E.exports.forwardRef(
    (
      { as: e = "div", className: t, type: n = "valid", tooltip: r = !1, ...o },
      l,
    ) =>
      T.exports.jsx(e, {
        ...o,
        ref: l,
        className: M(t, `${n}-${r ? "tooltip" : "feedback"}`),
      }),
  );
Vl.displayName = "Feedback";
Vl.propTypes = Py;
const Rt = E.exports.createContext({}),
  lo = E.exports.forwardRef(
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
      const { controlId: u } = E.exports.useContext(Rt);
      return (
        (t = A(t, "form-check-input")),
        T.exports.jsx(i, {
          ...s,
          ref: a,
          type: r,
          id: e || u,
          className: M(n, t, o && "is-valid", l && "is-invalid"),
        })
      );
    },
  );
lo.displayName = "FormCheckInput";
const vl = E.exports.forwardRef(
  ({ bsPrefix: e, className: t, htmlFor: n, ...r }, o) => {
    const { controlId: l } = E.exports.useContext(Rt);
    return (
      (e = A(e, "form-check-label")),
      T.exports.jsx("label", {
        ...r,
        ref: o,
        htmlFor: n || l,
        className: M(t, e),
      })
    );
  },
);
vl.displayName = "FormCheckLabel";
function Ly(e, t) {
  return E.exports.Children.toArray(e).some(
    (n) => E.exports.isValidElement(n) && n.type === t,
  );
}
const mp = E.exports.forwardRef(
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
      feedback: u,
      feedbackType: c,
      className: p,
      style: m,
      title: y = "",
      type: g = "checkbox",
      label: S,
      children: N,
      as: d = "input",
      ...f
    },
    h,
  ) => {
    (t = A(t, "form-check")), (n = A(n, "form-switch"));
    const { controlId: x } = E.exports.useContext(Rt),
      w = E.exports.useMemo(() => ({ controlId: e || x }), [x, e]),
      k = (!N && S != null && S !== !1) || Ly(N, vl),
      C = T.exports.jsx(lo, {
        ...f,
        type: g === "switch" ? "checkbox" : g,
        ref: h,
        isValid: i,
        isInvalid: s,
        disabled: l,
        as: d,
      });
    return T.exports.jsx(Rt.Provider, {
      value: w,
      children: T.exports.jsx("div", {
        style: m,
        className: M(
          p,
          k && t,
          r && `${t}-inline`,
          o && `${t}-reverse`,
          g === "switch" && n,
        ),
        children:
          N ||
          T.exports.jsxs(T.exports.Fragment, {
            children: [
              C,
              k && T.exports.jsx(vl, { title: y, children: S }),
              u && T.exports.jsx(Vl, { type: c, tooltip: a, children: u }),
            ],
          }),
      }),
    });
  },
);
mp.displayName = "FormCheck";
const hl = Object.assign(mp, { Input: lo, Label: vl }),
  vp = E.exports.forwardRef(
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
        readOnly: u,
        as: c = "input",
        ...p
      },
      m,
    ) => {
      const { controlId: y } = E.exports.useContext(Rt);
      e = A(e, "form-control");
      let g;
      return (
        a
          ? (g = { [`${e}-plaintext`]: !0 })
          : (g = { [e]: !0, [`${e}-${n}`]: n }),
        T.exports.jsx(c, {
          ...p,
          type: t,
          size: r,
          ref: m,
          readOnly: u,
          id: o || y,
          className: M(
            l,
            g,
            i && "is-valid",
            s && "is-invalid",
            t === "color" && `${e}-color`,
          ),
        })
      );
    },
  );
vp.displayName = "FormControl";
const jy = Object.assign(vp, { Feedback: Vl }),
  Dy = qe("form-floating"),
  Na = E.exports.forwardRef(({ controlId: e, as: t = "div", ...n }, r) => {
    const o = E.exports.useMemo(() => ({ controlId: e }), [e]);
    return T.exports.jsx(Rt.Provider, {
      value: o,
      children: T.exports.jsx(t, { ...n, ref: r }),
    });
  });
Na.displayName = "FormGroup";
const $y = { column: !1, visuallyHidden: !1 },
  _a = E.exports.forwardRef(
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
      const { controlId: a } = E.exports.useContext(Rt);
      t = A(t, "form-label");
      let u = "col-form-label";
      typeof n == "string" && (u = `${u} ${u}-${n}`);
      const c = M(o, t, r && "visually-hidden", n && u);
      return (
        (l = l || a),
        n
          ? T.exports.jsx(tt, {
              ref: s,
              as: "label",
              className: c,
              htmlFor: l,
              ...i,
            })
          : T.exports.jsx(e, { ref: s, className: c, htmlFor: l, ...i })
      );
    },
  );
_a.displayName = "FormLabel";
_a.defaultProps = $y;
const hp = E.exports.forwardRef(
  ({ bsPrefix: e, className: t, id: n, ...r }, o) => {
    const { controlId: l } = E.exports.useContext(Rt);
    return (
      (e = A(e, "form-range")),
      T.exports.jsx("input", {
        ...r,
        type: "range",
        ref: o,
        className: M(t, e),
        id: n || l,
      })
    );
  },
);
hp.displayName = "FormRange";
const yp = E.exports.forwardRef(
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
    const { controlId: u } = E.exports.useContext(Rt);
    return (
      (e = A(e, "form-select")),
      T.exports.jsx("select", {
        ...s,
        size: n,
        ref: a,
        className: M(
          r,
          e,
          t && `${e}-${t}`,
          o && "is-valid",
          l && "is-invalid",
        ),
        id: i || u,
      })
    );
  },
);
yp.displayName = "FormSelect";
const gp = E.exports.forwardRef(
  ({ bsPrefix: e, className: t, as: n = "small", muted: r, ...o }, l) => (
    (e = A(e, "form-text")),
    T.exports.jsx(n, { ...o, ref: l, className: M(t, e, r && "text-muted") })
  ),
);
gp.displayName = "FormText";
const xp = E.exports.forwardRef((e, t) =>
  T.exports.jsx(hl, { ...e, ref: t, type: "switch" }),
);
xp.displayName = "Switch";
const zy = Object.assign(xp, { Input: hl.Input, Label: hl.Label }),
  wp = E.exports.forwardRef(
    (
      { bsPrefix: e, className: t, children: n, controlId: r, label: o, ...l },
      i,
    ) => (
      (e = A(e, "form-floating")),
      T.exports.jsxs(Na, {
        ref: i,
        className: M(t, e),
        controlId: r,
        ...l,
        children: [n, T.exports.jsx("label", { htmlFor: r, children: o })],
      })
    ),
  );
wp.displayName = "FloatingLabel";
const My = {
    _ref: vt.exports.any,
    validated: vt.exports.bool,
    as: vt.exports.elementType,
  },
  Oa = E.exports.forwardRef(
    ({ className: e, validated: t, as: n = "form", ...r }, o) =>
      T.exports.jsx(n, { ...r, ref: o, className: M(e, t && "was-validated") }),
  );
Oa.displayName = "Form";
Oa.propTypes = My;
const V = Object.assign(Oa, {
  Group: Na,
  Control: jy,
  Floating: Dy,
  Check: hl,
  Switch: zy,
  Label: _a,
  Text: gp,
  Range: hp,
  Select: yp,
  FloatingLabel: wp,
});
function Iy(e) {
  const [t, n] = v.useState(!1),
    r = () => {
      n(!0),
        bh(
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
  return v.createElement(
    it,
    { variant: "primary", disabled: t, onClick: t ? null : r },
    t ? "Submitting..." : "Submit",
  );
}
function Ep(e) {
  return e && Object.keys(e).includes("ndscan_params");
}
function Fy(e) {
  if (!Ep(e)) return null;
  try {
    const t = e.ndscan_params,
      [n] = t,
      r = n.default;
    return JSON.parse(r);
  } catch (t) {
    return console.error("Error parsing ndscan_params:", t), null;
  }
}
function Ay(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) for (const o of r) t[o] || (t[o] = n);
  return t;
}
function By(e) {
  return !e || !e.axes
    ? new Set()
    : new Set(e.axes.map((t) => t.fqn).filter(Boolean));
}
function Sp(e, t) {
  return `ndscan_${e}_${t}`;
}
function Uy(e, t) {
  try {
    const n = Sp(e, t),
      r = localStorage.getItem(n);
    if (r) return JSON.parse(r);
  } catch (n) {
    console.error("Error loading ndscan state from localStorage:", n);
  }
  return null;
}
function Vy(e, t, n) {
  try {
    const r = Sp(e, t);
    localStorage.setItem(r, JSON.stringify(n));
  } catch (r) {
    console.error("Error saving ndscan state to localStorage:", r);
  }
}
function Hy(e, t, n, r) {
  if (!e) return null;
  const o = {};
  for (const [i, s] of Object.entries(t)) {
    const a = r[i] || "";
    o[i] = [{ path: a, value: s }];
  }
  const l = {
    instances: e.instances,
    schemata: e.schemata,
    always_shown: e.always_shown,
    overrides: o,
    scan: n,
  };
  return { ndscan_params: JSON.stringify(l) };
}
function dt(e, t) {
  return e == null ? "" : t ? e / t : e;
}
function yl(e, t) {
  if (e === "" || e === "-") return e;
  const n = parseFloat(e);
  return isNaN(n) ? e : t ? n * t : n;
}
const kp = E.exports.createContext(null);
kp.displayName = "InputGroupContext";
const Ra = qe("input-group-text", { Component: "span" }),
  Wy = (e) =>
    T.exports.jsx(Ra, {
      children: T.exports.jsx(lo, { type: "checkbox", ...e }),
    }),
  Qy = (e) =>
    T.exports.jsx(Ra, { children: T.exports.jsx(lo, { type: "radio", ...e }) }),
  Cp = E.exports.forwardRef(
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
      e = A(e, "input-group");
      const s = E.exports.useMemo(() => ({}), []);
      return T.exports.jsx(kp.Provider, {
        value: s,
        children: T.exports.jsx(o, {
          ref: i,
          ...l,
          className: M(r, e, t && `${e}-${t}`, n && "has-validation"),
        }),
      });
    },
  );
Cp.displayName = "InputGroup";
const ne = Object.assign(Cp, { Text: Ra, Radio: Qy, Checkbox: Wy });
function ws(e, t) {
  if (e.contains) return e.contains(t);
  if (e.compareDocumentPosition)
    return e === t || !!(e.compareDocumentPosition(t) & 16);
}
function Es() {
  return E.exports.useState(null);
}
var sc = Object.prototype.hasOwnProperty;
function ac(e, t, n) {
  for (n of e.keys()) if (Rr(n, t)) return n;
}
function Rr(e, t) {
  var n, r, o;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length) for (; r-- && Rr(e[r], t[r]); );
      return r === -1;
    }
    if (n === Set) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r),
          (o && typeof o == "object" && ((o = ac(t, o)), !o)) || !t.has(o))
        )
          return !1;
      return !0;
    }
    if (n === Map) {
      if (e.size !== t.size) return !1;
      for (r of e)
        if (
          ((o = r[0]),
          (o && typeof o == "object" && ((o = ac(t, o)), !o)) ||
            !Rr(r[1], t.get(o)))
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
          (sc.call(e, n) && ++r && !sc.call(t, n)) ||
          !(n in t) ||
          !Rr(e[n], t[n])
        )
          return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
function Ky(e) {
  var t = sp();
  return [
    e[0],
    E.exports.useCallback(
      function (n) {
        if (!!t()) return e[1](n);
      },
      [t, e[1]],
    ),
  ];
}
var De = "top",
  Ye = "bottom",
  Xe = "right",
  $e = "left",
  Ta = "auto",
  io = [De, Ye, Xe, $e],
  Zn = "start",
  qr = "end",
  Gy = "clippingParents",
  Np = "viewport",
  pr = "popper",
  Yy = "reference",
  uc = io.reduce(function (e, t) {
    return e.concat([t + "-" + Zn, t + "-" + qr]);
  }, []),
  _p = [].concat(io, [Ta]).reduce(function (e, t) {
    return e.concat([t, t + "-" + Zn, t + "-" + qr]);
  }, []),
  Xy = "beforeRead",
  qy = "read",
  Zy = "afterRead",
  Jy = "beforeMain",
  by = "main",
  eg = "afterMain",
  tg = "beforeWrite",
  ng = "write",
  rg = "afterWrite",
  og = [Xy, qy, Zy, Jy, by, eg, tg, ng, rg];
function ht(e) {
  return e.split("-")[0];
}
function Ze(e) {
  if (e == null) return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return (t && t.defaultView) || window;
  }
  return e;
}
function xn(e) {
  var t = Ze(e).Element;
  return e instanceof t || e instanceof Element;
}
function yt(e) {
  var t = Ze(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function Pa(e) {
  if (typeof ShadowRoot > "u") return !1;
  var t = Ze(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var pn = Math.max,
  gl = Math.min,
  Jn = Math.round;
function Ss() {
  var e = navigator.userAgentData;
  return e != null && e.brands
    ? e.brands
        .map(function (t) {
          return t.brand + "/" + t.version;
        })
        .join(" ")
    : navigator.userAgent;
}
function Op() {
  return !/^((?!chrome|android).)*safari/i.test(Ss());
}
function bn(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  var r = e.getBoundingClientRect(),
    o = 1,
    l = 1;
  t &&
    yt(e) &&
    ((o = (e.offsetWidth > 0 && Jn(r.width) / e.offsetWidth) || 1),
    (l = (e.offsetHeight > 0 && Jn(r.height) / e.offsetHeight) || 1));
  var i = xn(e) ? Ze(e) : window,
    s = i.visualViewport,
    a = !Op() && n,
    u = (r.left + (a && s ? s.offsetLeft : 0)) / o,
    c = (r.top + (a && s ? s.offsetTop : 0)) / l,
    p = r.width / o,
    m = r.height / l;
  return {
    width: p,
    height: m,
    top: c,
    right: u + p,
    bottom: c + m,
    left: u,
    x: u,
    y: c,
  };
}
function La(e) {
  var t = bn(e),
    n = e.offsetWidth,
    r = e.offsetHeight;
  return (
    Math.abs(t.width - n) <= 1 && (n = t.width),
    Math.abs(t.height - r) <= 1 && (r = t.height),
    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
  );
}
function Rp(e, t) {
  var n = t.getRootNode && t.getRootNode();
  if (e.contains(t)) return !0;
  if (n && Pa(n)) {
    var r = t;
    do {
      if (r && e.isSameNode(r)) return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Zt(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function Tt(e) {
  return Ze(e).getComputedStyle(e);
}
function lg(e) {
  return ["table", "td", "th"].indexOf(Zt(e)) >= 0;
}
function tn(e) {
  return ((xn(e) ? e.ownerDocument : e.document) || window.document)
    .documentElement;
}
function Hl(e) {
  return Zt(e) === "html"
    ? e
    : e.assignedSlot || e.parentNode || (Pa(e) ? e.host : null) || tn(e);
}
function cc(e) {
  return !yt(e) || Tt(e).position === "fixed" ? null : e.offsetParent;
}
function ig(e) {
  var t = /firefox/i.test(Ss()),
    n = /Trident/i.test(Ss());
  if (n && yt(e)) {
    var r = Tt(e);
    if (r.position === "fixed") return null;
  }
  var o = Hl(e);
  for (Pa(o) && (o = o.host); yt(o) && ["html", "body"].indexOf(Zt(o)) < 0; ) {
    var l = Tt(o);
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
function so(e) {
  for (var t = Ze(e), n = cc(e); n && lg(n) && Tt(n).position === "static"; )
    n = cc(n);
  return n &&
    (Zt(n) === "html" || (Zt(n) === "body" && Tt(n).position === "static"))
    ? t
    : n || ig(e) || t;
}
function ja(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function Tr(e, t, n) {
  return pn(e, gl(t, n));
}
function sg(e, t, n) {
  var r = Tr(e, t, n);
  return r > n ? n : r;
}
function Tp() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
function Pp(e) {
  return Object.assign({}, Tp(), e);
}
function Lp(e, t) {
  return t.reduce(function (n, r) {
    return (n[r] = e), n;
  }, {});
}
var ag = function (t, n) {
  return (
    (t =
      typeof t == "function"
        ? t(Object.assign({}, n.rects, { placement: n.placement }))
        : t),
    Pp(typeof t != "number" ? t : Lp(t, io))
  );
};
function ug(e) {
  var t,
    n = e.state,
    r = e.name,
    o = e.options,
    l = n.elements.arrow,
    i = n.modifiersData.popperOffsets,
    s = ht(n.placement),
    a = ja(s),
    u = [$e, Xe].indexOf(s) >= 0,
    c = u ? "height" : "width";
  if (!(!l || !i)) {
    var p = ag(o.padding, n),
      m = La(l),
      y = a === "y" ? De : $e,
      g = a === "y" ? Ye : Xe,
      S =
        n.rects.reference[c] + n.rects.reference[a] - i[a] - n.rects.popper[c],
      N = i[a] - n.rects.reference[a],
      d = so(l),
      f = d ? (a === "y" ? d.clientHeight || 0 : d.clientWidth || 0) : 0,
      h = S / 2 - N / 2,
      x = p[y],
      w = f - m[c] - p[g],
      k = f / 2 - m[c] / 2 + h,
      C = Tr(x, k, w),
      _ = a;
    n.modifiersData[r] = ((t = {}), (t[_] = C), (t.centerOffset = C - k), t);
  }
}
function cg(e) {
  var t = e.state,
    n = e.options,
    r = n.element,
    o = r === void 0 ? "[data-popper-arrow]" : r;
  o != null &&
    ((typeof o == "string" && ((o = t.elements.popper.querySelector(o)), !o)) ||
      !Rp(t.elements.popper, o) ||
      (t.elements.arrow = o));
}
const fg = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: ug,
  effect: cg,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function er(e) {
  return e.split("-")[1];
}
var dg = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
function pg(e) {
  var t = e.x,
    n = e.y,
    r = window,
    o = r.devicePixelRatio || 1;
  return { x: Jn(t * o) / o || 0, y: Jn(n * o) / o || 0 };
}
function fc(e) {
  var t,
    n = e.popper,
    r = e.popperRect,
    o = e.placement,
    l = e.variation,
    i = e.offsets,
    s = e.position,
    a = e.gpuAcceleration,
    u = e.adaptive,
    c = e.roundOffsets,
    p = e.isFixed,
    m = i.x,
    y = m === void 0 ? 0 : m,
    g = i.y,
    S = g === void 0 ? 0 : g,
    N = typeof c == "function" ? c({ x: y, y: S }) : { x: y, y: S };
  (y = N.x), (S = N.y);
  var d = i.hasOwnProperty("x"),
    f = i.hasOwnProperty("y"),
    h = $e,
    x = De,
    w = window;
  if (u) {
    var k = so(n),
      C = "clientHeight",
      _ = "clientWidth";
    if (
      (k === Ze(n) &&
        ((k = tn(n)),
        Tt(k).position !== "static" &&
          s === "absolute" &&
          ((C = "scrollHeight"), (_ = "scrollWidth"))),
      (k = k),
      o === De || ((o === $e || o === Xe) && l === qr))
    ) {
      x = Ye;
      var $ = p && k === w && w.visualViewport ? w.visualViewport.height : k[C];
      (S -= $ - r.height), (S *= a ? 1 : -1);
    }
    if (o === $e || ((o === De || o === Ye) && l === qr)) {
      h = Xe;
      var L = p && k === w && w.visualViewport ? w.visualViewport.width : k[_];
      (y -= L - r.width), (y *= a ? 1 : -1);
    }
  }
  var F = Object.assign({ position: s }, u && dg),
    J = c === !0 ? pg({ x: y, y: S }) : { x: y, y: S };
  if (((y = J.x), (S = J.y), a)) {
    var H;
    return Object.assign(
      {},
      F,
      ((H = {}),
      (H[x] = f ? "0" : ""),
      (H[h] = d ? "0" : ""),
      (H.transform =
        (w.devicePixelRatio || 1) <= 1
          ? "translate(" + y + "px, " + S + "px)"
          : "translate3d(" + y + "px, " + S + "px, 0)"),
      H),
    );
  }
  return Object.assign(
    {},
    F,
    ((t = {}),
    (t[x] = f ? S + "px" : ""),
    (t[h] = d ? y + "px" : ""),
    (t.transform = ""),
    t),
  );
}
function mg(e) {
  var t = e.state,
    n = e.options,
    r = n.gpuAcceleration,
    o = r === void 0 ? !0 : r,
    l = n.adaptive,
    i = l === void 0 ? !0 : l,
    s = n.roundOffsets,
    a = s === void 0 ? !0 : s,
    u = {
      placement: ht(t.placement),
      variation: er(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
      isFixed: t.options.strategy === "fixed",
    };
  t.modifiersData.popperOffsets != null &&
    (t.styles.popper = Object.assign(
      {},
      t.styles.popper,
      fc(
        Object.assign({}, u, {
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
        fc(
          Object.assign({}, u, {
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
const vg = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: mg,
  data: {},
};
var Ro = { passive: !0 };
function hg(e) {
  var t = e.state,
    n = e.instance,
    r = e.options,
    o = r.scroll,
    l = o === void 0 ? !0 : o,
    i = r.resize,
    s = i === void 0 ? !0 : i,
    a = Ze(t.elements.popper),
    u = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    l &&
      u.forEach(function (c) {
        c.addEventListener("scroll", n.update, Ro);
      }),
    s && a.addEventListener("resize", n.update, Ro),
    function () {
      l &&
        u.forEach(function (c) {
          c.removeEventListener("scroll", n.update, Ro);
        }),
        s && a.removeEventListener("resize", n.update, Ro);
    }
  );
}
const yg = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect: hg,
  data: {},
};
var gg = { left: "right", right: "left", bottom: "top", top: "bottom" };
function Uo(e) {
  return e.replace(/left|right|bottom|top/g, function (t) {
    return gg[t];
  });
}
var xg = { start: "end", end: "start" };
function dc(e) {
  return e.replace(/start|end/g, function (t) {
    return xg[t];
  });
}
function Da(e) {
  var t = Ze(e),
    n = t.pageXOffset,
    r = t.pageYOffset;
  return { scrollLeft: n, scrollTop: r };
}
function $a(e) {
  return bn(tn(e)).left + Da(e).scrollLeft;
}
function wg(e, t) {
  var n = Ze(e),
    r = tn(e),
    o = n.visualViewport,
    l = r.clientWidth,
    i = r.clientHeight,
    s = 0,
    a = 0;
  if (o) {
    (l = o.width), (i = o.height);
    var u = Op();
    (u || (!u && t === "fixed")) && ((s = o.offsetLeft), (a = o.offsetTop));
  }
  return { width: l, height: i, x: s + $a(e), y: a };
}
function Eg(e) {
  var t,
    n = tn(e),
    r = Da(e),
    o = (t = e.ownerDocument) == null ? void 0 : t.body,
    l = pn(
      n.scrollWidth,
      n.clientWidth,
      o ? o.scrollWidth : 0,
      o ? o.clientWidth : 0,
    ),
    i = pn(
      n.scrollHeight,
      n.clientHeight,
      o ? o.scrollHeight : 0,
      o ? o.clientHeight : 0,
    ),
    s = -r.scrollLeft + $a(e),
    a = -r.scrollTop;
  return (
    Tt(o || n).direction === "rtl" &&
      (s += pn(n.clientWidth, o ? o.clientWidth : 0) - l),
    { width: l, height: i, x: s, y: a }
  );
}
function za(e) {
  var t = Tt(e),
    n = t.overflow,
    r = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function jp(e) {
  return ["html", "body", "#document"].indexOf(Zt(e)) >= 0
    ? e.ownerDocument.body
    : yt(e) && za(e)
      ? e
      : jp(Hl(e));
}
function Pr(e, t) {
  var n;
  t === void 0 && (t = []);
  var r = jp(e),
    o = r === ((n = e.ownerDocument) == null ? void 0 : n.body),
    l = Ze(r),
    i = o ? [l].concat(l.visualViewport || [], za(r) ? r : []) : r,
    s = t.concat(i);
  return o ? s : s.concat(Pr(Hl(i)));
}
function ks(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height,
  });
}
function Sg(e, t) {
  var n = bn(e, !1, t === "fixed");
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
function pc(e, t, n) {
  return t === Np ? ks(wg(e, n)) : xn(t) ? Sg(t, n) : ks(Eg(tn(e)));
}
function kg(e) {
  var t = Pr(Hl(e)),
    n = ["absolute", "fixed"].indexOf(Tt(e).position) >= 0,
    r = n && yt(e) ? so(e) : e;
  return xn(r)
    ? t.filter(function (o) {
        return xn(o) && Rp(o, r) && Zt(o) !== "body";
      })
    : [];
}
function Cg(e, t, n, r) {
  var o = t === "clippingParents" ? kg(e) : [].concat(t),
    l = [].concat(o, [n]),
    i = l[0],
    s = l.reduce(
      function (a, u) {
        var c = pc(e, u, r);
        return (
          (a.top = pn(c.top, a.top)),
          (a.right = gl(c.right, a.right)),
          (a.bottom = gl(c.bottom, a.bottom)),
          (a.left = pn(c.left, a.left)),
          a
        );
      },
      pc(e, i, r),
    );
  return (
    (s.width = s.right - s.left),
    (s.height = s.bottom - s.top),
    (s.x = s.left),
    (s.y = s.top),
    s
  );
}
function Dp(e) {
  var t = e.reference,
    n = e.element,
    r = e.placement,
    o = r ? ht(r) : null,
    l = r ? er(r) : null,
    i = t.x + t.width / 2 - n.width / 2,
    s = t.y + t.height / 2 - n.height / 2,
    a;
  switch (o) {
    case De:
      a = { x: i, y: t.y - n.height };
      break;
    case Ye:
      a = { x: i, y: t.y + t.height };
      break;
    case Xe:
      a = { x: t.x + t.width, y: s };
      break;
    case $e:
      a = { x: t.x - n.width, y: s };
      break;
    default:
      a = { x: t.x, y: t.y };
  }
  var u = o ? ja(o) : null;
  if (u != null) {
    var c = u === "y" ? "height" : "width";
    switch (l) {
      case Zn:
        a[u] = a[u] - (t[c] / 2 - n[c] / 2);
        break;
      case qr:
        a[u] = a[u] + (t[c] / 2 - n[c] / 2);
        break;
    }
  }
  return a;
}
function Zr(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = r === void 0 ? e.placement : r,
    l = n.strategy,
    i = l === void 0 ? e.strategy : l,
    s = n.boundary,
    a = s === void 0 ? Gy : s,
    u = n.rootBoundary,
    c = u === void 0 ? Np : u,
    p = n.elementContext,
    m = p === void 0 ? pr : p,
    y = n.altBoundary,
    g = y === void 0 ? !1 : y,
    S = n.padding,
    N = S === void 0 ? 0 : S,
    d = Pp(typeof N != "number" ? N : Lp(N, io)),
    f = m === pr ? Yy : pr,
    h = e.rects.popper,
    x = e.elements[g ? f : m],
    w = Cg(xn(x) ? x : x.contextElement || tn(e.elements.popper), a, c, i),
    k = bn(e.elements.reference),
    C = Dp({ reference: k, element: h, strategy: "absolute", placement: o }),
    _ = ks(Object.assign({}, h, C)),
    $ = m === pr ? _ : k,
    L = {
      top: w.top - $.top + d.top,
      bottom: $.bottom - w.bottom + d.bottom,
      left: w.left - $.left + d.left,
      right: $.right - w.right + d.right,
    },
    F = e.modifiersData.offset;
  if (m === pr && F) {
    var J = F[o];
    Object.keys(L).forEach(function (H) {
      var ee = [Xe, Ye].indexOf(H) >= 0 ? 1 : -1,
        Y = [De, Ye].indexOf(H) >= 0 ? "y" : "x";
      L[H] += J[Y] * ee;
    });
  }
  return L;
}
function Ng(e, t) {
  t === void 0 && (t = {});
  var n = t,
    r = n.placement,
    o = n.boundary,
    l = n.rootBoundary,
    i = n.padding,
    s = n.flipVariations,
    a = n.allowedAutoPlacements,
    u = a === void 0 ? _p : a,
    c = er(r),
    p = c
      ? s
        ? uc
        : uc.filter(function (g) {
            return er(g) === c;
          })
      : io,
    m = p.filter(function (g) {
      return u.indexOf(g) >= 0;
    });
  m.length === 0 && (m = p);
  var y = m.reduce(function (g, S) {
    return (
      (g[S] = Zr(e, { placement: S, boundary: o, rootBoundary: l, padding: i })[
        ht(S)
      ]),
      g
    );
  }, {});
  return Object.keys(y).sort(function (g, S) {
    return y[g] - y[S];
  });
}
function _g(e) {
  if (ht(e) === Ta) return [];
  var t = Uo(e);
  return [dc(e), t, dc(t)];
}
function Og(e) {
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
        u = n.padding,
        c = n.boundary,
        p = n.rootBoundary,
        m = n.altBoundary,
        y = n.flipVariations,
        g = y === void 0 ? !0 : y,
        S = n.allowedAutoPlacements,
        N = t.options.placement,
        d = ht(N),
        f = d === N,
        h = a || (f || !g ? [Uo(N)] : _g(N)),
        x = [N].concat(h).reduce(function (U, se) {
          return U.concat(
            ht(se) === Ta
              ? Ng(t, {
                  placement: se,
                  boundary: c,
                  rootBoundary: p,
                  padding: u,
                  flipVariations: g,
                  allowedAutoPlacements: S,
                })
              : se,
          );
        }, []),
        w = t.rects.reference,
        k = t.rects.popper,
        C = new Map(),
        _ = !0,
        $ = x[0],
        L = 0;
      L < x.length;
      L++
    ) {
      var F = x[L],
        J = ht(F),
        H = er(F) === Zn,
        ee = [De, Ye].indexOf(J) >= 0,
        Y = ee ? "width" : "height",
        le = Zr(t, {
          placement: F,
          boundary: c,
          rootBoundary: p,
          altBoundary: m,
          padding: u,
        }),
        ue = ee ? (H ? Xe : $e) : H ? Ye : De;
      w[Y] > k[Y] && (ue = Uo(ue));
      var R = Uo(ue),
        D = [];
      if (
        (l && D.push(le[J] <= 0),
        s && D.push(le[ue] <= 0, le[R] <= 0),
        D.every(function (U) {
          return U;
        }))
      ) {
        ($ = F), (_ = !1);
        break;
      }
      C.set(F, D);
    }
    if (_)
      for (
        var z = g ? 3 : 1,
          G = function (se) {
            var pe = x.find(function (ke) {
              var K = C.get(ke);
              if (K)
                return K.slice(0, se).every(function (gt) {
                  return gt;
                });
            });
            if (pe) return ($ = pe), "break";
          },
          j = z;
        j > 0;
        j--
      ) {
        var W = G(j);
        if (W === "break") break;
      }
    t.placement !== $ &&
      ((t.modifiersData[r]._skip = !0), (t.placement = $), (t.reset = !0));
  }
}
const Rg = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Og,
  requiresIfExists: ["offset"],
  data: { _skip: !1 },
};
function mc(e, t, n) {
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
function vc(e) {
  return [De, Xe, Ye, $e].some(function (t) {
    return e[t] >= 0;
  });
}
function Tg(e) {
  var t = e.state,
    n = e.name,
    r = t.rects.reference,
    o = t.rects.popper,
    l = t.modifiersData.preventOverflow,
    i = Zr(t, { elementContext: "reference" }),
    s = Zr(t, { altBoundary: !0 }),
    a = mc(i, r),
    u = mc(s, o, l),
    c = vc(a),
    p = vc(u);
  (t.modifiersData[n] = {
    referenceClippingOffsets: a,
    popperEscapeOffsets: u,
    isReferenceHidden: c,
    hasPopperEscaped: p,
  }),
    (t.attributes.popper = Object.assign({}, t.attributes.popper, {
      "data-popper-reference-hidden": c,
      "data-popper-escaped": p,
    }));
}
const Pg = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Tg,
};
function Lg(e, t, n) {
  var r = ht(e),
    o = [$e, De].indexOf(r) >= 0 ? -1 : 1,
    l = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n,
    i = l[0],
    s = l[1];
  return (
    (i = i || 0),
    (s = (s || 0) * o),
    [$e, Xe].indexOf(r) >= 0 ? { x: s, y: i } : { x: i, y: s }
  );
}
function jg(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.offset,
    l = o === void 0 ? [0, 0] : o,
    i = _p.reduce(function (c, p) {
      return (c[p] = Lg(p, t.rects, l)), c;
    }, {}),
    s = i[t.placement],
    a = s.x,
    u = s.y;
  t.modifiersData.popperOffsets != null &&
    ((t.modifiersData.popperOffsets.x += a),
    (t.modifiersData.popperOffsets.y += u)),
    (t.modifiersData[r] = i);
}
const Dg = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: jg,
};
function $g(e) {
  var t = e.state,
    n = e.name;
  t.modifiersData[n] = Dp({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement,
  });
}
const zg = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: $g,
  data: {},
};
function Mg(e) {
  return e === "x" ? "y" : "x";
}
function Ig(e) {
  var t = e.state,
    n = e.options,
    r = e.name,
    o = n.mainAxis,
    l = o === void 0 ? !0 : o,
    i = n.altAxis,
    s = i === void 0 ? !1 : i,
    a = n.boundary,
    u = n.rootBoundary,
    c = n.altBoundary,
    p = n.padding,
    m = n.tether,
    y = m === void 0 ? !0 : m,
    g = n.tetherOffset,
    S = g === void 0 ? 0 : g,
    N = Zr(t, { boundary: a, rootBoundary: u, padding: p, altBoundary: c }),
    d = ht(t.placement),
    f = er(t.placement),
    h = !f,
    x = ja(d),
    w = Mg(x),
    k = t.modifiersData.popperOffsets,
    C = t.rects.reference,
    _ = t.rects.popper,
    $ =
      typeof S == "function"
        ? S(Object.assign({}, t.rects, { placement: t.placement }))
        : S,
    L =
      typeof $ == "number"
        ? { mainAxis: $, altAxis: $ }
        : Object.assign({ mainAxis: 0, altAxis: 0 }, $),
    F = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
    J = { x: 0, y: 0 };
  if (!!k) {
    if (l) {
      var H,
        ee = x === "y" ? De : $e,
        Y = x === "y" ? Ye : Xe,
        le = x === "y" ? "height" : "width",
        ue = k[x],
        R = ue + N[ee],
        D = ue - N[Y],
        z = y ? -_[le] / 2 : 0,
        G = f === Zn ? C[le] : _[le],
        j = f === Zn ? -_[le] : -C[le],
        W = t.elements.arrow,
        U = y && W ? La(W) : { width: 0, height: 0 },
        se = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : Tp(),
        pe = se[ee],
        ke = se[Y],
        K = Tr(0, C[le], U[le]),
        gt = h ? C[le] / 2 - z - K - pe - L.mainAxis : G - K - pe - L.mainAxis,
        Ap = h ? -C[le] / 2 + z + K + ke + L.mainAxis : j + K + ke + L.mainAxis,
        Ql = t.elements.arrow && so(t.elements.arrow),
        Bp = Ql ? (x === "y" ? Ql.clientTop || 0 : Ql.clientLeft || 0) : 0,
        Aa = (H = F == null ? void 0 : F[x]) != null ? H : 0,
        Up = ue + gt - Aa - Bp,
        Vp = ue + Ap - Aa,
        Ba = Tr(y ? gl(R, Up) : R, ue, y ? pn(D, Vp) : D);
      (k[x] = Ba), (J[x] = Ba - ue);
    }
    if (s) {
      var Ua,
        Hp = x === "x" ? De : $e,
        Wp = x === "x" ? Ye : Xe,
        rn = k[w],
        ao = w === "y" ? "height" : "width",
        Va = rn + N[Hp],
        Ha = rn - N[Wp],
        Kl = [De, $e].indexOf(d) !== -1,
        Wa = (Ua = F == null ? void 0 : F[w]) != null ? Ua : 0,
        Qa = Kl ? Va : rn - C[ao] - _[ao] - Wa + L.altAxis,
        Ka = Kl ? rn + C[ao] + _[ao] - Wa - L.altAxis : Ha,
        Ga = y && Kl ? sg(Qa, rn, Ka) : Tr(y ? Qa : Va, rn, y ? Ka : Ha);
      (k[w] = Ga), (J[w] = Ga - rn);
    }
    t.modifiersData[r] = J;
  }
}
const Fg = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Ig,
  requiresIfExists: ["offset"],
};
function Ag(e) {
  return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
}
function Bg(e) {
  return e === Ze(e) || !yt(e) ? Da(e) : Ag(e);
}
function Ug(e) {
  var t = e.getBoundingClientRect(),
    n = Jn(t.width) / e.offsetWidth || 1,
    r = Jn(t.height) / e.offsetHeight || 1;
  return n !== 1 || r !== 1;
}
function Vg(e, t, n) {
  n === void 0 && (n = !1);
  var r = yt(t),
    o = yt(t) && Ug(t),
    l = tn(t),
    i = bn(e, o, n),
    s = { scrollLeft: 0, scrollTop: 0 },
    a = { x: 0, y: 0 };
  return (
    (r || (!r && !n)) &&
      ((Zt(t) !== "body" || za(l)) && (s = Bg(t)),
      yt(t)
        ? ((a = bn(t, !0)), (a.x += t.clientLeft), (a.y += t.clientTop))
        : l && (a.x = $a(l))),
    {
      x: i.left + s.scrollLeft - a.x,
      y: i.top + s.scrollTop - a.y,
      width: i.width,
      height: i.height,
    }
  );
}
function Hg(e) {
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
function Wg(e) {
  var t = Hg(e);
  return og.reduce(function (n, r) {
    return n.concat(
      t.filter(function (o) {
        return o.phase === r;
      }),
    );
  }, []);
}
function Qg(e) {
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
function Kg(e) {
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
var hc = { placement: "bottom", modifiers: [], strategy: "absolute" };
function yc() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return !t.some(function (r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function Gg(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.defaultModifiers,
    r = n === void 0 ? [] : n,
    o = t.defaultOptions,
    l = o === void 0 ? hc : o;
  return function (s, a, u) {
    u === void 0 && (u = l);
    var c = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, hc, l),
        modifiersData: {},
        elements: { reference: s, popper: a },
        attributes: {},
        styles: {},
      },
      p = [],
      m = !1,
      y = {
        state: c,
        setOptions: function (d) {
          var f = typeof d == "function" ? d(c.options) : d;
          S(),
            (c.options = Object.assign({}, l, c.options, f)),
            (c.scrollParents = {
              reference: xn(s)
                ? Pr(s)
                : s.contextElement
                  ? Pr(s.contextElement)
                  : [],
              popper: Pr(a),
            });
          var h = Wg(Kg([].concat(r, c.options.modifiers)));
          return (
            (c.orderedModifiers = h.filter(function (x) {
              return x.enabled;
            })),
            g(),
            y.update()
          );
        },
        forceUpdate: function () {
          if (!m) {
            var d = c.elements,
              f = d.reference,
              h = d.popper;
            if (!!yc(f, h)) {
              (c.rects = {
                reference: Vg(f, so(h), c.options.strategy === "fixed"),
                popper: La(h),
              }),
                (c.reset = !1),
                (c.placement = c.options.placement),
                c.orderedModifiers.forEach(function (L) {
                  return (c.modifiersData[L.name] = Object.assign({}, L.data));
                });
              for (var x = 0; x < c.orderedModifiers.length; x++) {
                if (c.reset === !0) {
                  (c.reset = !1), (x = -1);
                  continue;
                }
                var w = c.orderedModifiers[x],
                  k = w.fn,
                  C = w.options,
                  _ = C === void 0 ? {} : C,
                  $ = w.name;
                typeof k == "function" &&
                  (c = k({ state: c, options: _, name: $, instance: y }) || c);
              }
            }
          }
        },
        update: Qg(function () {
          return new Promise(function (N) {
            y.forceUpdate(), N(c);
          });
        }),
        destroy: function () {
          S(), (m = !0);
        },
      };
    if (!yc(s, a)) return y;
    y.setOptions(u).then(function (N) {
      !m && u.onFirstUpdate && u.onFirstUpdate(N);
    });
    function g() {
      c.orderedModifiers.forEach(function (N) {
        var d = N.name,
          f = N.options,
          h = f === void 0 ? {} : f,
          x = N.effect;
        if (typeof x == "function") {
          var w = x({ state: c, name: d, instance: y, options: h }),
            k = function () {};
          p.push(w || k);
        }
      });
    }
    function S() {
      p.forEach(function (N) {
        return N();
      }),
        (p = []);
    }
    return y;
  };
}
const Yg = Gg({ defaultModifiers: [Pg, zg, vg, yg, Dg, Rg, Fg, fg] }),
  Xg = ["enabled", "placement", "strategy", "modifiers"];
function qg(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    l;
  for (l = 0; l < r.length; l++)
    (o = r[l]), !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const Zg = {
    name: "applyStyles",
    enabled: !1,
    phase: "afterWrite",
    fn: () => {},
  },
  Jg = {
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
  bg = [];
function e0(e, t, n = {}) {
  let {
      enabled: r = !0,
      placement: o = "bottom",
      strategy: l = "absolute",
      modifiers: i = bg,
    } = n,
    s = qg(n, Xg);
  const a = E.exports.useRef(i),
    u = E.exports.useRef(),
    c = E.exports.useCallback(() => {
      var N;
      (N = u.current) == null || N.update();
    }, []),
    p = E.exports.useCallback(() => {
      var N;
      (N = u.current) == null || N.forceUpdate();
    }, []),
    [m, y] = Ky(
      E.exports.useState({
        placement: o,
        update: c,
        forceUpdate: p,
        attributes: {},
        styles: { popper: {}, arrow: {} },
      }),
    ),
    g = E.exports.useMemo(
      () => ({
        name: "updateStateModifier",
        enabled: !0,
        phase: "write",
        requires: ["computeStyles"],
        fn: ({ state: N }) => {
          const d = {},
            f = {};
          Object.keys(N.elements).forEach((h) => {
            (d[h] = N.styles[h]), (f[h] = N.attributes[h]);
          }),
            y({
              state: N,
              styles: d,
              attributes: f,
              update: c,
              forceUpdate: p,
              placement: N.placement,
            });
        },
      }),
      [c, p, y],
    ),
    S = E.exports.useMemo(
      () => (Rr(a.current, i) || (a.current = i), a.current),
      [i],
    );
  return (
    E.exports.useEffect(() => {
      !u.current ||
        !r ||
        u.current.setOptions({
          placement: o,
          strategy: l,
          modifiers: [...S, g, Zg],
        });
    }, [l, o, g, r, S]),
    E.exports.useEffect(() => {
      if (!(!r || e == null || t == null))
        return (
          (u.current = Yg(
            e,
            t,
            Object.assign({}, s, {
              placement: o,
              strategy: l,
              modifiers: [...S, Jg, g],
            }),
          )),
          () => {
            u.current != null &&
              (u.current.destroy(),
              (u.current = void 0),
              y((N) =>
                Object.assign({}, N, {
                  attributes: {},
                  styles: { popper: {} },
                }),
              ));
          }
        );
    }, [r, e, t]),
    m
  );
}
const gc = () => {};
function t0(e) {
  return e.button === 0;
}
function n0(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const Vo = (e) => e && ("current" in e ? e.current : e),
  xc = { click: "mousedown", mouseup: "mousedown", pointerup: "pointerdown" };
function r0(e, t = gc, { disabled: n, clickTrigger: r = "click" } = {}) {
  const o = E.exports.useRef(!1),
    l = E.exports.useRef(!1),
    i = E.exports.useCallback(
      (u) => {
        const c = Vo(e);
        (o.current = !c || n0(u) || !t0(u) || !!ws(c, u.target) || l.current),
          (l.current = !1);
      },
      [e],
    ),
    s = Xr((u) => {
      const c = Vo(e);
      c && ws(c, u.target) && (l.current = !0);
    }),
    a = Xr((u) => {
      o.current || t(u);
    });
  E.exports.useEffect(() => {
    if (n || e == null) return;
    const u = Ml(Vo(e));
    let c = (u.defaultView || window).event,
      p = null;
    xc[r] && (p = cn(u, xc[r], s, !0));
    const m = cn(u, r, i, !0),
      y = cn(u, r, (S) => {
        if (S === c) {
          c = void 0;
          return;
        }
        a(S);
      });
    let g = [];
    return (
      "ontouchstart" in u.documentElement &&
        (g = [].slice.call(u.body.children).map((S) => cn(S, "mousemove", gc))),
      () => {
        p == null || p(), m(), y(), g.forEach((S) => S());
      }
    );
  }, [e, n, r, i, s, a]);
}
const o0 = 27,
  l0 = () => {};
function i0(e, t, { disabled: n, clickTrigger: r } = {}) {
  const o = t || l0;
  r0(e, o, { disabled: n, clickTrigger: r });
  const l = Xr((i) => {
    i.keyCode === o0 && o(i);
  });
  E.exports.useEffect(() => {
    if (n || e == null) return;
    const i = Ml(Vo(e));
    let s = (i.defaultView || window).event;
    const a = cn(i, "keyup", (u) => {
      if (u === s) {
        s = void 0;
        return;
      }
      l(u);
    });
    return () => {
      a();
    };
  }, [e, n, l]);
}
const $p = E.exports.createContext(wa ? window : void 0);
$p.Provider;
function s0() {
  return E.exports.useContext($p);
}
const Ei = (e, t) =>
  wa
    ? e == null
      ? (t || Ml()).body
      : (typeof e == "function" && (e = e()),
        e && "current" in e && (e = e.current),
        e && ("nodeType" in e || e.getBoundingClientRect) ? e : null)
    : null;
function wc(e, t) {
  const n = s0(),
    [r, o] = E.exports.useState(() => Ei(e, n == null ? void 0 : n.document));
  if (!r) {
    const l = Ei(e);
    l && o(l);
  }
  return (
    E.exports.useEffect(() => {
      t && r && t(r);
    }, [t, r]),
    E.exports.useEffect(() => {
      const l = Ei(e);
      l !== r && o(l);
    }, [e, r]),
    r
  );
}
function a0(e) {
  const t = {};
  return Array.isArray(e)
    ? (e == null ||
        e.forEach((n) => {
          t[n.name] = n;
        }),
      t)
    : e || t;
}
function u0(e = {}) {
  return Array.isArray(e)
    ? e
    : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
}
function c0({
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
  var u, c, p, m, y;
  const g = a0(a.modifiers);
  return Object.assign({}, a, {
    placement: n,
    enabled: e,
    strategy: l ? "fixed" : a.strategy,
    modifiers: u0(
      Object.assign({}, g, {
        eventListeners: {
          enabled: t,
          options: (u = g.eventListeners) == null ? void 0 : u.options,
        },
        preventOverflow: Object.assign({}, g.preventOverflow, {
          options: i
            ? Object.assign(
                { padding: i },
                (c = g.preventOverflow) == null ? void 0 : c.options,
              )
            : (p = g.preventOverflow) == null
              ? void 0
              : p.options,
        }),
        offset: {
          options: Object.assign(
            { offset: o },
            (m = g.offset) == null ? void 0 : m.options,
          ),
        },
        arrow: Object.assign({}, g.arrow, {
          enabled: !!s,
          options: Object.assign(
            {},
            (y = g.arrow) == null ? void 0 : y.options,
            { element: s },
          ),
        }),
        flip: Object.assign({ enabled: !!r }, g.flip),
      }),
    ),
  });
}
const zp = E.exports.forwardRef((e, t) => {
  const {
      flip: n,
      offset: r,
      placement: o,
      containerPadding: l,
      popperConfig: i = {},
      transition: s,
    } = e,
    [a, u] = Es(),
    [c, p] = Es(),
    m = Il(u, t),
    y = wc(e.container),
    g = wc(e.target),
    [S, N] = E.exports.useState(!e.show),
    d = e0(
      g,
      a,
      c0({
        placement: o,
        enableEvents: !!e.show,
        containerPadding: l || 5,
        flip: n,
        offset: r,
        arrowElement: c,
        popperConfig: i,
      }),
    );
  e.show ? S && N(!1) : !e.transition && !S && N(!0);
  const f = (...w) => {
      N(!0), e.onExited && e.onExited(...w);
    },
    h = e.show || (s && !S);
  if (
    (i0(a, e.onHide, {
      disabled: !e.rootClose || e.rootCloseDisabled,
      clickTrigger: e.rootCloseEvent,
    }),
    !h)
  )
    return null;
  let x = e.children(
    Object.assign({}, d.attributes.popper, { style: d.styles.popper, ref: m }),
    {
      popper: d,
      placement: o,
      show: !!e.show,
      arrowProps: Object.assign({}, d.attributes.arrow, {
        style: d.styles.arrow,
        ref: p,
      }),
    },
  );
  if (s) {
    const {
      onExit: w,
      onExiting: k,
      onEnter: C,
      onEntering: _,
      onEntered: $,
    } = e;
    x = T.exports.jsx(s, {
      in: e.show,
      appear: !0,
      onExit: w,
      onExiting: k,
      onExited: f,
      onEnter: C,
      onEntering: _,
      onEntered: $,
      children: x,
    });
  }
  return y ? Mn.createPortal(x, y) : null;
});
zp.displayName = "Overlay";
var f0 =
    typeof global < "u" &&
    global.navigator &&
    global.navigator.product === "ReactNative",
  d0 = typeof document < "u";
const p0 = d0 || f0 ? E.exports.useLayoutEffect : E.exports.useEffect;
function m0(e, t) {
  return e.classList
    ? !!t && e.classList.contains(t)
    : (" " + (e.className.baseVal || e.className) + " ").indexOf(
        " " + t + " ",
      ) !== -1;
}
const v0 = qe("popover-header"),
  Mp = qe("popover-body");
function Ip(e, t) {
  let n = e;
  return (
    e === "left"
      ? (n = t ? "end" : "start")
      : e === "right" && (n = t ? "start" : "end"),
    n
  );
}
const h0 = { placement: "right" },
  Fp = E.exports.forwardRef(
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
        ...u
      },
      c,
    ) => {
      const p = A(e, "popover"),
        m = Fd(),
        [y] = (t == null ? void 0 : t.split("-")) || [],
        g = Ip(y, m);
      return T.exports.jsxs("div", {
        ref: c,
        role: "tooltip",
        style: r,
        "x-placement": y,
        className: M(n, p, y && `bs-popover-${g}`),
        ...u,
        children: [
          T.exports.jsx("div", { className: "popover-arrow", ...i }),
          l ? T.exports.jsx(Mp, { children: o }) : o,
        ],
      });
    },
  );
Fp.defaultProps = h0;
const y0 = Object.assign(Fp, { Header: v0, Body: Mp, POPPER_OFFSET: [0, 8] });
function g0(e) {
  const t = E.exports.useRef(null),
    n = A(void 0, "popover"),
    r = E.exports.useMemo(
      () => ({
        name: "offset",
        options: {
          offset: () =>
            t.current && m0(t.current, n) ? e || y0.POPPER_OFFSET : e || [0, 0],
        },
      }),
      [e, n],
    );
  return [t, [r]];
}
const x0 = { transition: oo, rootClose: !1, show: !1, placement: "top" };
function w0(e, t) {
  const { ref: n } = e,
    { ref: r } = t;
  (e.ref = n.__wrapped || (n.__wrapped = (o) => n(ml(o)))),
    (t.ref = r.__wrapped || (r.__wrapped = (o) => r(ml(o))));
}
const Ma = E.exports.forwardRef(
  ({ children: e, transition: t, popperConfig: n = {}, ...r }, o) => {
    const l = E.exports.useRef({}),
      [i, s] = Es(),
      [a, u] = g0(r.offset),
      c = Il(o, a),
      p = t === !0 ? oo : t || void 0,
      m = Xr((y) => {
        s(y), n == null || n.onFirstUpdate == null || n.onFirstUpdate(y);
      });
    return (
      p0(() => {
        i && (l.current.scheduleUpdate == null || l.current.scheduleUpdate());
      }, [i]),
      T.exports.jsx(zp, {
        ...r,
        ref: c,
        popperConfig: {
          ...n,
          modifiers: u.concat(n.modifiers || []),
          onFirstUpdate: m,
        },
        transition: p,
        children: (y, { arrowProps: g, popper: S, show: N }) => {
          var d, f;
          w0(y, g);
          const h = S == null ? void 0 : S.placement,
            x = Object.assign(l.current, {
              state: S == null ? void 0 : S.state,
              scheduleUpdate: S == null ? void 0 : S.update,
              placement: h,
              outOfBoundaries:
                (S == null ||
                (d = S.state) == null ||
                (f = d.modifiersData.hide) == null
                  ? void 0
                  : f.isReferenceHidden) || !1,
            });
          return typeof e == "function"
            ? e({
                ...y,
                placement: h,
                show: N,
                ...(!t && N && { className: "show" }),
                popper: x,
                arrowProps: g,
              })
            : E.exports.cloneElement(e, {
                ...y,
                placement: h,
                arrowProps: g,
                popper: x,
                className: M(e.props.className, !t && N && "show"),
                style: { ...e.props.style, ...y.style },
              });
        },
      })
    );
  },
);
Ma.displayName = "Overlay";
Ma.defaultProps = x0;
function E0(e) {
  return e && typeof e == "object" ? e : { show: e, hide: e };
}
function Ec(e, t, n) {
  const [r] = t,
    o = r.currentTarget,
    l = r.relatedTarget || r.nativeEvent[n];
  (!l || l !== o) && !ws(o, l) && e(...t);
}
const S0 = { defaultShow: !1, trigger: ["hover", "focus"] };
function Ia({
  trigger: e,
  overlay: t,
  children: n,
  popperConfig: r = {},
  show: o,
  defaultShow: l = !1,
  onToggle: i,
  delay: s,
  placement: a,
  flip: u = a && a.indexOf("auto") !== -1,
  ...c
}) {
  const p = E.exports.useRef(null),
    m = Il(p, n.ref),
    y = up(),
    g = E.exports.useRef(""),
    [S, N] = Bd(o, l, i),
    d = E0(s),
    {
      onFocus: f,
      onBlur: h,
      onClick: x,
    } = typeof n != "function" ? E.exports.Children.only(n).props : {},
    w = (Y) => {
      m(ml(Y));
    },
    k = E.exports.useCallback(() => {
      if ((y.clear(), (g.current = "show"), !d.show)) {
        N(!0);
        return;
      }
      y.set(() => {
        g.current === "show" && N(!0);
      }, d.show);
    }, [d.show, N, y]),
    C = E.exports.useCallback(() => {
      if ((y.clear(), (g.current = "hide"), !d.hide)) {
        N(!1);
        return;
      }
      y.set(() => {
        g.current === "hide" && N(!1);
      }, d.hide);
    }, [d.hide, N, y]),
    _ = E.exports.useCallback(
      (...Y) => {
        k(), f == null || f(...Y);
      },
      [k, f],
    ),
    $ = E.exports.useCallback(
      (...Y) => {
        C(), h == null || h(...Y);
      },
      [C, h],
    ),
    L = E.exports.useCallback(
      (...Y) => {
        N(!S), x == null || x(...Y);
      },
      [x, N, S],
    ),
    F = E.exports.useCallback(
      (...Y) => {
        Ec(k, Y, "fromElement");
      },
      [k],
    ),
    J = E.exports.useCallback(
      (...Y) => {
        Ec(C, Y, "toElement");
      },
      [C],
    ),
    H = e == null ? [] : [].concat(e),
    ee = { ref: w };
  return (
    H.indexOf("click") !== -1 && (ee.onClick = L),
    H.indexOf("focus") !== -1 && ((ee.onFocus = _), (ee.onBlur = $)),
    H.indexOf("hover") !== -1 && ((ee.onMouseOver = F), (ee.onMouseOut = J)),
    T.exports.jsxs(T.exports.Fragment, {
      children: [
        typeof n == "function" ? n(ee) : E.exports.cloneElement(n, ee),
        T.exports.jsx(Ma, {
          ...c,
          show: S,
          onHide: C,
          flip: u,
          placement: a,
          popperConfig: r,
          target: p.current,
          children: t,
        }),
      ],
    })
  );
}
Ia.defaultProps = S0;
const k0 = { placement: "right" },
  Wl = E.exports.forwardRef(
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
      u,
    ) => {
      e = A(e, "tooltip");
      const c = Fd(),
        [p] = (t == null ? void 0 : t.split("-")) || [],
        m = Ip(p, c);
      return T.exports.jsxs("div", {
        ref: u,
        style: r,
        role: "tooltip",
        "x-placement": p,
        className: M(n, e, `bs-tooltip-${m}`),
        ...a,
        children: [
          T.exports.jsx("div", { className: "tooltip-arrow", ...l }),
          T.exports.jsx("div", { className: `${e}-inner`, children: o }),
        ],
      });
    },
  );
Wl.defaultProps = k0;
Wl.displayName = "Tooltip";
function nn({ onClick: e, disabled: t }) {
  return v.createElement(
    Ia,
    {
      placement: "top",
      overlay: v.createElement(Wl, null, "Reset to default"),
    },
    v.createElement(
      it,
      { variant: "outline-secondary", size: "sm", onClick: e, disabled: t },
      "\u21BA",
    ),
  );
}
function C0({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const {
      unit: l,
      scale: i,
      step: s,
      min: a,
      max: u,
      precision: c,
      default: p,
    } = t,
    m = n != null ? n : "",
    y = n === p,
    g = (S) => {
      const N = S.target.value;
      if (N === "" || N === "-") r(e, N);
      else {
        const d = parseFloat(N);
        isNaN(d) || r(e, d);
      }
    };
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(V.Control, {
      type: "number",
      value: m,
      onChange: g,
      step: s || "any",
      min: a,
      max: u,
    }),
    l && v.createElement(ne.Text, null, l),
    v.createElement(nn, { onClick: () => o(e), disabled: y }),
  );
}
function N0({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { choices: l, default: i } = t,
    s = n === i;
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(
      V.Select,
      { value: n || "", onChange: (a) => r(e, a.target.value) },
      l && l.map((a) => v.createElement("option", { key: a, value: a }, a)),
    ),
    v.createElement(nn, { onClick: () => o(e), disabled: s }),
  );
}
function _0({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(ne.Checkbox, {
      checked: Boolean(n),
      onChange: (s) => r(e, s.target.checked),
    }),
    v.createElement(V.Control, {
      plaintext: !0,
      readOnly: !0,
      value: n ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    v.createElement(nn, { onClick: () => o(e), disabled: i }),
  );
}
function O0({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(V.Control, {
      type: "text",
      value: n || "",
      onChange: (s) => r(e, s.target.value),
    }),
    v.createElement(nn, { onClick: () => o(e), disabled: i }),
  );
}
function R0({ name: e, spec: t, value: n, onChange: r, onReset: o }) {
  const { default: l } = t,
    i = n === l;
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(V.Control, {
      as: "textarea",
      rows: 2,
      value: n || "",
      onChange: (s) => r(e, s.target.value),
      style: { fontFamily: "monospace", fontSize: "0.85em" },
    }),
    v.createElement(nn, { onClick: () => o(e), disabled: i }),
  );
}
function T0({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: i, spec: s } = e,
    { unit: a, scale: u, step: c, min: p, max: m } = s || {},
    y = i ? parseFloat(i) : 0,
    g = t != null ? t : y,
    S = dt(g, u),
    N = t == null,
    d = (w) => {
      const k = w.target.value,
        C = yl(k, u);
      n(l, C);
    },
    f = dt(p, u),
    h = dt(m, u),
    x = dt(c, u);
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(V.Control, {
      type: "number",
      value: S,
      onChange: d,
      step: x || "any",
      min: f,
      max: h,
      disabled: o,
    }),
    a && v.createElement(ne.Text, null, a),
    o &&
      v.createElement(
        ne.Text,
        { className: "text-muted" },
        v.createElement("small", null, "Scanned"),
      ),
    v.createElement(nn, { onClick: () => r(l), disabled: N || o }),
  );
}
function P0({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, default: i, spec: s } = e,
    { unit: a, scale: u, step: c, min: p, max: m } = s || {},
    y = i ? parseInt(i) : 0,
    g = t != null ? t : y,
    S = dt(g, u),
    N = t == null,
    d = (w) => {
      const k = w.target.value,
        C = yl(k, u),
        _ = typeof C == "number" ? Math.round(C) : C;
      n(l, _);
    },
    f = dt(p, u),
    h = dt(m, u),
    x = dt(c, u);
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(V.Control, {
      type: "number",
      value: S,
      onChange: d,
      step: x || 1,
      min: f,
      max: h,
      disabled: o,
    }),
    a && v.createElement(ne.Text, null, a),
    o &&
      v.createElement(
        ne.Text,
        { className: "text-muted" },
        v.createElement("small", null, "Scanned"),
      ),
    v.createElement(nn, { onClick: () => r(l), disabled: N || o }),
  );
}
function L0({ schema: e, value: t, onChange: n, onReset: r, disabled: o }) {
  const { fqn: l, description: i, type: s, default: a } = e,
    u = a === "True" || a === "true",
    c = t != null ? t : u,
    p = t == null;
  return v.createElement(
    ne,
    { size: "sm" },
    v.createElement(ne.Checkbox, {
      checked: Boolean(c),
      onChange: (m) => n(l, m.target.checked),
      disabled: o,
    }),
    v.createElement(V.Control, {
      plaintext: !0,
      readOnly: !0,
      value: c ? "True" : "False",
      style: { paddingLeft: "0.5rem" },
    }),
    o &&
      v.createElement(
        ne.Text,
        { className: "text-muted" },
        v.createElement("small", null, "Scanned"),
      ),
    v.createElement(nn, { onClick: () => r(l), disabled: p || o }),
  );
}
function j0(e) {
  switch (e) {
    case "NumberValue":
      return C0;
    case "EnumerationValue":
      return N0;
    case "BooleanValue":
      return _0;
    case "StringValue":
      return O0;
    case "PYONValue":
    default:
      return R0;
  }
}
function D0({ name: e, argInfo: t, value: n, onChange: r, onReset: o }) {
  const [l, i, s] = t,
    a = j0(l.ty),
    u = v.createElement(
      V.Label,
      { className: "mb-0", style: { fontWeight: 500 } },
      e,
    );
  return v.createElement(
    V.Group,
    { className: "mb-2 row align-items-center" },
    v.createElement(
      "div",
      { className: "col-4" },
      s
        ? v.createElement(
            Ia,
            { placement: "right", overlay: v.createElement(Wl, null, s) },
            v.createElement(
              "span",
              { style: { cursor: "help", borderBottom: "1px dotted #666" } },
              u,
            ),
          )
        : u,
    ),
    v.createElement(
      "div",
      { className: "col-8" },
      v.createElement(a, {
        name: e,
        spec: l,
        value: n,
        onChange: r,
        onReset: o,
      }),
    ),
  );
}
const $0 = { bg: "primary", pill: !1 },
  Fa = E.exports.forwardRef(
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
      const a = A(e, "badge");
      return T.exports.jsx(l, {
        ref: s,
        ...i,
        className: M(
          o,
          a,
          n && "rounded-pill",
          r && `text-${r}`,
          t && `bg-${t}`,
        ),
      });
    },
  );
Fa.displayName = "Badge";
Fa.defaultProps = $0;
function z0({ scan: e, schemata: t, onChange: n }) {
  const {
      axes: r = [],
      num_repeats: o = 1,
      no_axes_mode: l = "single",
      randomise_order_globally: i = !1,
      skip_on_persistent_transitory_error: s = !1,
    } = e,
    a = v.useMemo(
      () =>
        t ? Object.values(t).filter((w) => w.spec && w.spec.is_scannable) : [],
      [t],
    ),
    u = new Set(r.map((w) => w.fqn).filter(Boolean)),
    c = () => {
      const w = {
        fqn: "",
        path: "",
        type: "linear",
        range: { start: 0, stop: 100, num_points: 11, randomise_order: !1 },
      };
      n({ ...e, axes: [...r, w] });
    },
    p = (w) => {
      const k = r.filter((C, _) => _ !== w);
      n({ ...e, axes: k });
    },
    m = (w, k, C) => {
      const _ = [...r];
      if (k === "fqn") {
        const $ = t[C];
        _[w] = { ..._[w], fqn: C, path: $ ? y() : "" };
      } else if (k.startsWith("range.")) {
        const $ = k.split(".")[1];
        _[w] = { ..._[w], range: { ..._[w].range, [$]: C } };
      } else _[w] = { ..._[w], [k]: C };
      n({ ...e, axes: _ });
    },
    y = (w) => "",
    g = (w) => {
      n({ ...e, num_repeats: w });
    },
    S = (w) => {
      n({ ...e, num_repeats: w ? 2147483647 : 1 });
    },
    N = (w) => {
      n({ ...e, no_axes_mode: w });
    },
    d = (w) => {
      n({ ...e, randomise_order_globally: w });
    },
    f = (w) => {
      n({ ...e, skip_on_persistent_transitory_error: w });
    },
    h = v.useMemo(
      () =>
        r.length === 0
          ? o
          : r.reduce((w, k) => {
              var _;
              const C = ((_ = k.range) == null ? void 0 : _.num_points) || 1;
              return w * C;
            }, 1) * o,
      [r, o],
    ),
    x = o === 2147483647;
  return v.createElement(
    rt,
    { className: "mb-3" },
    v.createElement(
      rt.Header,
      { className: "d-flex justify-content-between align-items-center" },
      v.createElement("span", null, "Scan Configuration"),
      v.createElement(
        Fa,
        { bg: r.length === 0 ? "secondary" : "primary" },
        r.length,
        "D scan, ",
        x ? "\u221E" : h,
        " points",
      ),
    ),
    v.createElement(
      rt.Body,
      null,
      v.createElement("h6", null, "Scan Axes"),
      r.length === 0
        ? v.createElement(
            "p",
            { className: "text-muted small" },
            'No scan axes defined. Click "Add Scan Axis" to create one.',
          )
        : r.map((w, k) => {
            var J, H, ee, Y, le, ue;
            const C = w.fqn ? t[w.fqn] : null,
              _ =
                ((J = C == null ? void 0 : C.spec) == null ? void 0 : J.unit) ||
                "",
              $ =
                ((H = C == null ? void 0 : C.spec) == null
                  ? void 0
                  : H.scale) || 1,
              L = dt((ee = w.range) == null ? void 0 : ee.start, $),
              F = dt((Y = w.range) == null ? void 0 : Y.stop, $);
            return v.createElement(
              rt,
              { key: k, className: "mb-2" },
              v.createElement(
                rt.Body,
                { className: "py-2 px-3" },
                v.createElement(
                  Hn,
                  { className: "mb-2" },
                  v.createElement(
                    tt,
                    null,
                    v.createElement(
                      V.Label,
                      { className: "mb-1 small" },
                      "Parameter",
                    ),
                    v.createElement(
                      V.Select,
                      {
                        size: "sm",
                        value: w.fqn || "",
                        onChange: (R) => m(k, "fqn", R.target.value),
                      },
                      v.createElement(
                        "option",
                        { value: "" },
                        "Select parameter...",
                      ),
                      a.map((R) =>
                        v.createElement(
                          "option",
                          {
                            key: R.fqn,
                            value: R.fqn,
                            disabled: u.has(R.fqn) && w.fqn !== R.fqn,
                          },
                          R.description || R.fqn,
                        ),
                      ),
                    ),
                  ),
                  v.createElement(
                    tt,
                    { xs: "auto", className: "d-flex align-items-end" },
                    v.createElement(
                      it,
                      {
                        variant: "outline-danger",
                        size: "sm",
                        onClick: () => p(k),
                      },
                      "Remove",
                    ),
                  ),
                ),
                v.createElement(
                  Hn,
                  { className: "g-2" },
                  v.createElement(
                    tt,
                    null,
                    v.createElement(
                      V.Label,
                      { className: "mb-1 small" },
                      "Start",
                    ),
                    v.createElement(
                      ne,
                      { size: "sm" },
                      v.createElement(V.Control, {
                        type: "number",
                        value: L,
                        onChange: (R) => {
                          const D = yl(R.target.value, $);
                          m(k, "range.start", D);
                        },
                        step: "any",
                      }),
                      _ && v.createElement(ne.Text, null, _),
                    ),
                  ),
                  v.createElement(
                    tt,
                    null,
                    v.createElement(
                      V.Label,
                      { className: "mb-1 small" },
                      "Stop",
                    ),
                    v.createElement(
                      ne,
                      { size: "sm" },
                      v.createElement(V.Control, {
                        type: "number",
                        value: F,
                        onChange: (R) => {
                          const D = yl(R.target.value, $);
                          m(k, "range.stop", D);
                        },
                        step: "any",
                      }),
                      _ && v.createElement(ne.Text, null, _),
                    ),
                  ),
                  v.createElement(
                    tt,
                    null,
                    v.createElement(
                      V.Label,
                      { className: "mb-1 small" },
                      "Points",
                    ),
                    v.createElement(V.Control, {
                      type: "number",
                      size: "sm",
                      value:
                        ((le = w.range) == null ? void 0 : le.num_points) || 11,
                      onChange: (R) =>
                        m(k, "range.num_points", parseInt(R.target.value)),
                      min: "1",
                      step: "1",
                    }),
                  ),
                ),
                v.createElement(V.Check, {
                  type: "checkbox",
                  className: "mt-2",
                  label: "Randomize order (this axis)",
                  checked:
                    ((ue = w.range) == null ? void 0 : ue.randomise_order) ||
                    !1,
                  onChange: (R) =>
                    m(k, "range.randomise_order", R.target.checked),
                }),
              ),
            );
          }),
      v.createElement(
        it,
        {
          variant: "outline-primary",
          size: "sm",
          onClick: c,
          className: "mb-3",
        },
        "+ Add Scan Axis",
      ),
      v.createElement("h6", { className: "mt-3" }, "Global Settings"),
      v.createElement(
        Hn,
        { className: "g-2 mb-2" },
        v.createElement(
          tt,
          { md: 6 },
          v.createElement(
            V.Label,
            { className: "mb-1 small" },
            "Number of Repeats",
          ),
          v.createElement(
            ne,
            { size: "sm" },
            v.createElement(V.Control, {
              type: "number",
              value: x ? "" : o,
              onChange: (w) => g(parseInt(w.target.value) || 1),
              min: "1",
              step: "1",
              disabled: x,
              placeholder: x ? "Infinite" : "",
            }),
            v.createElement(ne.Checkbox, {
              checked: x,
              onChange: (w) => S(w.target.checked),
            }),
            v.createElement(ne.Text, null, "Infinite"),
          ),
        ),
        v.createElement(
          tt,
          { md: 6 },
          v.createElement(V.Label, { className: "mb-1 small" }, "No-Axes Mode"),
          v.createElement(
            V.Select,
            { size: "sm", value: l, onChange: (w) => N(w.target.value) },
            v.createElement("option", { value: "single" }, "Single"),
            v.createElement("option", { value: "repeat" }, "Repeat"),
          ),
        ),
      ),
      v.createElement(V.Check, {
        type: "checkbox",
        label: "Randomize order globally",
        checked: i,
        onChange: (w) => d(w.target.checked),
        className: "mb-1",
      }),
      v.createElement(V.Check, {
        type: "checkbox",
        label: "Skip on persistent/transitory error",
        checked: s,
        onChange: (w) => f(w.target.checked),
      }),
    ),
  );
}
function Sc(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o] = r;
    o && o.default !== void 0 && (t[n] = o.default);
  }
  return t;
}
function M0(e) {
  const t = {};
  if (!e) return t;
  for (const [n, r] of Object.entries(e)) {
    const [o, l] = r,
      i = l || "General";
    t[i] || (t[i] = []), t[i].push({ name: n, argData: r });
  }
  return t;
}
function I0(e) {
  const t = e.data.name,
    n = e.data.file,
    r = e.data.class_name,
    o = e.data.arginfo,
    l = e.repo_rev,
    i = Ep(o),
    s = v.useMemo(() => (i ? Fy(o) : null), [o, i]),
    a = v.useMemo(() => (i ? {} : Sc(o)), [o, i]),
    [u, c] = v.useState(() => (i ? {} : Sc(o))),
    [p, m] = v.useState({}),
    [y, g] = v.useState(null),
    [S, N] = v.useState(!1);
  v.useEffect(() => {
    if (i && s) {
      const j = Uy(n, r);
      j ? (m(j.overrides || {}), g(j.scan || s.scan)) : (m({}), g(s.scan));
    }
  }, [i, s, n, r]),
    v.useEffect(() => {
      i && y && Vy(n, r, { overrides: p, scan: y });
    }, [i, p, y, n, r]);
  const d = v.useMemo(() => (!i || !s ? {} : Ay(s.instances)), [i, s]),
    f = v.useMemo(() => (!i || !y ? new Set() : By(y)), [i, y]),
    [h, x] = v.useState(!1),
    [w, k] = v.useState(""),
    [C, _] = v.useState("main"),
    $ = v.useMemo(() => (i ? {} : M0(o)), [o, i]),
    L = !i && o && Object.keys(o).length > 0,
    F = (j, W) => {
      c((U) => ({ ...U, [j]: W }));
    },
    J = (j) => {
      c((W) => ({ ...W, [j]: a[j] }));
    },
    H = () => {
      c(a);
    },
    ee = (j, W) => {
      m((U) => ({ ...U, [j]: W }));
    },
    Y = (j) => {
      m((W) => {
        const U = { ...W };
        return delete U[j], U;
      });
    },
    le = (j) => {
      g(j);
    },
    ue = () => {
      s && (m({}), g(s.scan), localStorage.removeItem(getStorageKey(n, r)));
    },
    R = (j) => {
      k(j), x(!0);
    },
    D = (j, W) =>
      v.createElement(
        "tr",
        { key: j },
        v.createElement("td", null, v.createElement("b", null, j, ":")),
        v.createElement("td", null, W),
      ),
    z = (j, W) => {
      const { description: U, type: se } = W,
        pe = f.has(j),
        ke = p[j];
      let K;
      if (se === "float") K = T0;
      else if (se === "int") K = P0;
      else if (se === "bool") K = L0;
      else return null;
      return v.createElement(
        V.Group,
        { key: j, className: "mb-2 row align-items-center" },
        v.createElement(
          "div",
          { className: "col-4" },
          v.createElement(
            V.Label,
            { className: "mb-0", style: { fontWeight: 500 } },
            U || j,
          ),
        ),
        v.createElement(
          "div",
          { className: "col-8" },
          v.createElement(K, {
            schema: W,
            value: ke,
            onChange: ee,
            onReset: Y,
            disabled: pe,
          }),
        ),
      );
    },
    G = () => {
      if (i && s) {
        const j = new Set(Object.keys(p)),
          W = [...f].filter((U) => j.has(U));
        return W.length > 0
          ? (R(
              `Parameters cannot be both overridden and scanned: ${W.join(
                ", ",
              )}`,
            ),
            null)
          : Hy(s, p, y, d);
      } else return u;
    };
  return v.createElement(
    Ue.Item,
    { eventKey: r },
    v.createElement(
      Ue.Header,
      null,
      r,
      " \u2003 ",
      v.createElement("em", null, n),
    ),
    v.createElement(
      Ue.Body,
      null,
      v.createElement(
        gs,
        { striped: !0, bordered: !0, hover: !0, size: "sm" },
        v.createElement(
          "tbody",
          null,
          D("Name", t),
          D("Class name", r),
          D("File", n),
        ),
      ),
      !i &&
        L &&
        v.createElement(
          "div",
          { className: "mt-3" },
          v.createElement("h6", null, "Arguments"),
          Object.entries($).map(([j, W]) =>
            v.createElement(
              rt,
              { key: j, className: "mb-2" },
              v.createElement(
                rt.Header,
                { className: "py-1 px-2", style: { fontSize: "0.9em" } },
                j,
              ),
              v.createElement(
                rt.Body,
                { className: "py-2 px-3" },
                W.map(({ name: U, argData: se }) =>
                  v.createElement(D0, {
                    key: U,
                    name: U,
                    argInfo: se,
                    value: u[U],
                    onChange: F,
                    onReset: J,
                  }),
                ),
              ),
            ),
          ),
          v.createElement(
            it,
            {
              variant: "outline-secondary",
              size: "sm",
              onClick: H,
              className: "mb-3",
            },
            "Reset All to Defaults",
          ),
        ),
      i &&
        s &&
        v.createElement(
          "div",
          { className: "mt-3" },
          v.createElement("h6", null, "NDScan Parameters"),
          s.instances &&
            Object.entries(s.instances).map(([j, W]) => {
              const U = j === "" ? "Root Parameters" : j,
                se = new Set(
                  (s.always_shown || []).map((K) =>
                    K && K.__jsonclass__ && K.__jsonclass__[0] === "tuple"
                      ? K.__jsonclass__[1][0]
                      : K,
                  ),
                ),
                pe = W.filter((K) => se.has(K)),
                ke = W.filter((K) => !se.has(K));
              return v.createElement(
                rt,
                { key: j, className: "mb-2" },
                v.createElement(
                  rt.Header,
                  { className: "py-1 px-2", style: { fontSize: "0.9em" } },
                  U,
                ),
                v.createElement(
                  rt.Body,
                  { className: "py-2 px-3" },
                  pe.map((K) => {
                    const gt = s.schemata[K];
                    return gt ? z(K, gt) : null;
                  }),
                  ke.length > 0 &&
                    v.createElement(
                      v.Fragment,
                      null,
                      pe.length > 0 &&
                        v.createElement("hr", { className: "my-2" }),
                      v.createElement(
                        it,
                        {
                          variant: "link",
                          size: "sm",
                          onClick: () => N(!S),
                          className: "p-0 mb-2",
                        },
                        S ? "\u25BC" : "\u25B6",
                        " Show Advanced Parameters (",
                        ke.length,
                        ")",
                      ),
                      S &&
                        ke.map((K) => {
                          const gt = s.schemata[K];
                          return gt ? z(K, gt) : null;
                        }),
                    ),
                ),
              );
            }),
          y &&
            v.createElement(z0, {
              scan: y,
              schemata: s.schemata,
              onChange: le,
            }),
          v.createElement(
            it,
            {
              variant: "outline-secondary",
              size: "sm",
              onClick: ue,
              className: "mb-3",
            },
            "Reset All to Defaults",
          ),
        ),
      v.createElement(
        V.Group,
        { className: "mt-3 mb-2" },
        v.createElement(V.Label, null, "Pipeline"),
        v.createElement(V.Control, {
          type: "text",
          value: C,
          onChange: (j) => _(j.target.value),
          placeholder: "main",
        }),
        v.createElement(
          V.Text,
          { className: "text-muted" },
          "Specify which pipeline to submit to (default: main)",
        ),
      ),
      v.createElement(
        Al,
        { className: "mt-3" },
        v.createElement(Iy, {
          file: n,
          class_name: r,
          repo_rev: l,
          arguments: G(),
          pipeline: C,
          onError: R,
        }),
      ),
      v.createElement(
        pp,
        { position: "bottom-end", className: "p-3" },
        v.createElement(
          wi,
          {
            show: h,
            onClose: () => x(!1),
            delay: 5e3,
            autohide: !0,
            bg: "danger",
          },
          v.createElement(
            wi.Header,
            null,
            v.createElement(
              "strong",
              { className: "me-auto" },
              "Submission Error",
            ),
          ),
          v.createElement(wi.Body, { className: "text-white" }, w),
        ),
      ),
    ),
  );
}
const F0 = 1e4;
function A0() {
  const [e, t] = v.useState({}),
    n = "experiments" in e ? e.experiments : [],
    r = "repo_rev" in e ? e.repo_rev : null;
  return (
    "scanning" in e && Boolean(e.scanning),
    v.useEffect(() => {
      const o = () => {
        ty()
          .then(t)
          .catch((i) =>
            console.error("Experiment list update error:", i.message),
          );
      };
      o();
      const l = setInterval(o, F0);
      return () => {
        clearInterval(l);
      };
    }, []),
    v.createElement(
      Ue,
      { defaultActiveKey: "0" },
      n.map((o) =>
        v.createElement(I0, {
          key: `${o.file}:${o.class_name}`,
          data: o,
          repo_rev: r,
        }),
      ),
    )
  );
}
const B0 = () =>
  v.createElement(
    xa,
    { className: "p-4" },
    v.createElement("h1", null, "ARTIQ HTTP interface"),
    v.createElement(
      Hn,
      { className: "pt-4" },
      v.createElement("h2", { className: "pb-2" }, "Running"),
      v.createElement(tt, null, v.createElement(iy, null)),
    ),
    v.createElement(
      Hn,
      { className: "pt-4" },
      v.createElement("h2", { className: "pb-2" }, "Schedule new"),
      v.createElement(tt, null, v.createElement(A0, null)),
    ),
  );
Dd(document.getElementById("root")).render(v.createElement(B0, null));
