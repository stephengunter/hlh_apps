import { defineComponent as E, onBeforeMount as ye, openBlock as D, createElementBlock as S, normalizeClass as R, normalizeStyle as de, withModifiers as q, createElementVNode as c, renderSlot as B, createBlock as j, resolveDynamicComponent as ve, withCtx as P, Fragment as W, createCommentVNode as he, renderList as z, toDisplayString as O, pushScopeId as De, popScopeId as be, computed as u, resolveComponent as C, createTextVNode as G, ref as _, watch as ie, nextTick as we, watchEffect as ee, withDirectives as F, mergeProps as ke, vShow as T, vModelText as Le, createVNode as A } from "vue";
import { isValid as L, startOfDecade as $e, endOfDecade as _e, eachYearOfInterval as Se, getYear as $, getDecade as U, isBefore as N, isAfter as H, subYears as ue, addYears as ce, startOfYear as Ve, endOfYear as Me, format as J, eachMonthOfInterval as Oe, isSameMonth as ae, isSameYear as le, startOfMonth as me, endOfMonth as fe, startOfWeek as Ce, endOfWeek as qe, setDay as Pe, eachDayOfInterval as Fe, isSameDay as te, isWithinInterval as Te, startOfDay as Be, endOfDay as Ee, subMonths as Ie, addMonths as Re, set as oe, isSameHour as We, isSameMinute as Ne, parse as se, max as He, min as Ye } from "date-fns";
const pe = [
  { en: "Jan", cn: "1月" },
  { en: "Feb", cn: "2月" },
  { en: "Mar", cn: "3月" },
  { en: "Apr", cn: "4月" },
  { en: "May", cn: "5月" },
  { en: "Jun", cn: "6月" },
  { en: "Jul", cn: "7月" },
  { en: "Aug", cn: "8月" },
  { en: "Sep", cn: "9月" },
  { en: "Oct", cn: "10月" },
  { en: "Nov", cn: "11月" },
  { en: "Dec", cn: "12月" }
], je = [
  { en: "Sun", cn: "日" },
  { en: "Mon", cn: "一" },
  { en: "Tue", cn: "二" },
  { en: "Wed", cn: "三" },
  { en: "Thu", cn: "四" },
  { en: "Fri", cn: "五" },
  { en: "Sat", cn: "六" }
], Y = (e) => e - 1911, Ae = (e) => pe.find((n) => n.en === e).cn, Ue = (e) => je.find((n) => n.en === e).cn;
const I = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, Ze = ["year", "month", "day", "time", "custom"], ze = E({
  emits: {
    elementClick: (e) => L(e),
    left: () => !0,
    right: () => !0,
    heading: () => !0
  },
  props: {
    headingClickable: {
      type: Boolean,
      default: !1
    },
    leftDisabled: {
      type: Boolean,
      default: !1
    },
    rightDisabled: {
      type: Boolean,
      default: !1
    },
    columnCount: {
      type: Number,
      default: 7
    },
    items: {
      type: Array,
      default: () => []
    },
    viewMode: {
      type: String,
      required: !0,
      validate: (e) => typeof e == "string" && Ze.includes(e)
    }
  },
  setup(e) {
    return ye(() => {
    }), {
      getDisplayStyle: (n) => e.viewMode === "year" ? Y(parseInt(n.display.toString())) : e.viewMode === "month" ? Ae(n.display) : n.display
    };
  }
}), ne = (e) => (De("data-v-f6d5eccc"), e = e(), be(), e), Je = { class: "v3dp__heading" }, Ge = ["disabled"], Ke = /* @__PURE__ */ ne(() => /* @__PURE__ */ c("svg", {
  class: "v3dp__heading__icon",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 6 8"
}, [
  /* @__PURE__ */ c("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, [
    /* @__PURE__ */ c("path", {
      stroke: "none",
      d: "M-9 16V-8h24v24z"
    }),
    /* @__PURE__ */ c("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M5 0L1 4l4 4"
    })
  ])
], -1)), Qe = ["disabled"], Xe = /* @__PURE__ */ ne(() => /* @__PURE__ */ c("svg", {
  class: "v3dp__heading__icon",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 6 8"
}, [
  /* @__PURE__ */ c("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, [
    /* @__PURE__ */ c("path", {
      stroke: "none",
      d: "M15-8v24H-9V-8z"
    }),
    /* @__PURE__ */ c("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M1 8l4-4-4-4"
    })
  ])
], -1)), xe = { class: "v3dp__body" }, et = { class: "v3dp__subheading" }, tt = /* @__PURE__ */ ne(() => /* @__PURE__ */ c("hr", { class: "v3dp__divider" }, null, -1)), at = { class: "v3dp__elements" }, nt = ["disabled", "onClick"];
function it(e, t, n, o, s, f) {
  return D(), S("div", {
    class: R(["v3dp__popout", `v3dp__popout-${e.viewMode}`]),
    style: de({ "--popout-column-definition": `repeat(${e.columnCount}, 1fr)` }),
    onMousedown: t[3] || (t[3] = q(() => {
    }, ["prevent"]))
  }, [
    c("div", Je, [
      c("button", {
        class: "v3dp__heading__button v3dp__heading__button__left",
        disabled: e.leftDisabled,
        onClick: t[0] || (t[0] = q((i) => e.$emit("left"), ["stop", "prevent"]))
      }, [
        B(e.$slots, "arrow-left", {}, () => [
          Ke
        ], !0)
      ], 8, Ge),
      (D(), j(ve(e.headingClickable ? "button" : "span"), {
        class: "v3dp__heading__center",
        onClick: t[1] || (t[1] = q((i) => e.$emit("heading"), ["stop", "prevent"]))
      }, {
        default: P(() => [
          B(e.$slots, "heading", {}, void 0, !0)
        ]),
        _: 3
      })),
      c("button", {
        class: "v3dp__heading__button v3dp__heading__button__right",
        disabled: e.rightDisabled,
        onClick: t[2] || (t[2] = q((i) => e.$emit("right"), ["stop", "prevent"]))
      }, [
        B(e.$slots, "arrow-right", {}, () => [
          Xe
        ], !0)
      ], 8, Qe)
    ]),
    c("div", xe, [
      "subheading" in e.$slots ? (D(), S(W, { key: 0 }, [
        c("div", et, [
          B(e.$slots, "subheading", {}, void 0, !0)
        ]),
        tt
      ], 64)) : he("", !0),
      c("div", at, [
        B(e.$slots, "body", {}, () => [
          (D(!0), S(W, null, z(e.items, (i) => (D(), S("button", {
            key: i.key,
            disabled: i.disabled,
            class: R([
              {
                selected: i.selected,
                current: i.current
              },
              `v3dp__element__button__${e.viewMode}`
            ]),
            onClick: q((a) => e.$emit("elementClick", i.value), ["stop", "prevent"])
          }, [
            c("span", null, O(e.getDisplayStyle(i)), 1)
          ], 10, nt))), 128))
        ], !0)
      ])
    ])
  ], 38);
}
const K = /* @__PURE__ */ I(ze, [["render", it], ["__scopeId", "data-v-f6d5eccc"]]), lt = E({
  components: {
    PickerPopup: K
  },
  emits: {
    "update:pageDate": (e) => L(e),
    select: (e) => L(e)
  },
  props: {
    selected: {
      type: Date,
      required: !1
    },
    pageDate: {
      type: Date,
      required: !0
    },
    lowerLimit: {
      type: Date,
      required: !1
    },
    upperLimit: {
      type: Date,
      required: !1
    }
  },
  setup(e, { emit: t }) {
    const n = u(() => $e(e.pageDate)), o = u(() => _e(e.pageDate)), s = (h, g, l) => !g && !l ? !0 : !(g && $(h) < $(g) || l && $(h) > $(l)), f = u(
      () => Se({
        start: n.value,
        end: o.value
      }).map((h) => ({
        value: h,
        key: String($(h)),
        display: $(h),
        selected: !!e.selected && $(h) === $(e.selected),
        disabled: !s(h, e.lowerLimit, e.upperLimit)
      }))
    ), i = u(() => {
      const h = $(n.value), g = $(o.value);
      return `${Y(h)} - ${Y(g)}`;
    }), a = u(
      () => e.lowerLimit && (U(e.lowerLimit) === U(e.pageDate) || N(e.pageDate, e.lowerLimit))
    ), m = u(
      () => e.upperLimit && (U(e.upperLimit) === U(e.pageDate) || H(e.pageDate, e.upperLimit))
    );
    return {
      years: f,
      heading: i,
      leftDisabled: a,
      rightDisabled: m,
      previousPage: () => t("update:pageDate", ue(e.pageDate, 10)),
      nextPage: () => t("update:pageDate", ce(e.pageDate, 10))
    };
  }
});
function ot(e, t, n, o, s, f) {
  const i = C("picker-popup");
  return D(), j(i, {
    columnCount: 3,
    leftDisabled: e.leftDisabled,
    rightDisabled: e.rightDisabled,
    items: e.years,
    viewMode: "year",
    onLeft: e.previousPage,
    onRight: e.nextPage,
    onElementClick: t[0] || (t[0] = (a) => e.$emit("select", a))
  }, {
    heading: P(() => [
      G(O(e.heading), 1)
    ]),
    _: 1
  }, 8, ["leftDisabled", "rightDisabled", "items", "onLeft", "onRight"]);
}
const st = /* @__PURE__ */ I(lt, [["render", ot]]), rt = E({
  components: {
    PickerPopup: K
  },
  emits: {
    "update:pageDate": (e) => L(e),
    select: (e) => L(e),
    back: () => !0
  },
  props: {
    selected: {
      type: Date,
      required: !1
    },
    pageDate: {
      type: Date,
      required: !0
    },
    format: {
      type: String,
      required: !1,
      default: "LLL"
    },
    locale: {
      type: Object,
      required: !1
    },
    lowerLimit: {
      type: Date,
      required: !1
    },
    upperLimit: {
      type: Date,
      required: !1
    }
  },
  setup(e, { emit: t }) {
    const n = u(() => Ve(e.pageDate)), o = u(() => Me(e.pageDate)), s = u(
      () => (g) => J(g, e.format, {
        locale: e.locale
      })
    ), f = (g, l, b) => !l && !b ? !0 : !(l && N(g, me(l)) || b && H(g, fe(b))), i = u(
      () => Oe({
        start: n.value,
        end: o.value
      }).map((g) => ({
        value: g,
        display: s.value(g),
        key: s.value(g),
        selected: !!e.selected && ae(e.selected, g),
        disabled: !f(g, e.lowerLimit, e.upperLimit)
      }))
    ), a = u(() => `${Y($(n.value))} 年`), m = u(
      () => e.lowerLimit && (le(e.lowerLimit, e.pageDate) || N(e.pageDate, e.lowerLimit))
    ), V = u(
      () => e.upperLimit && (le(e.upperLimit, e.pageDate) || H(e.pageDate, e.upperLimit))
    );
    return {
      months: i,
      heading: a,
      leftDisabled: m,
      rightDisabled: V,
      previousPage: () => t("update:pageDate", ue(e.pageDate, 1)),
      nextPage: () => t("update:pageDate", ce(e.pageDate, 1))
    };
  }
});
function dt(e, t, n, o, s, f) {
  const i = C("picker-popup");
  return D(), j(i, {
    headingClickable: "",
    columnCount: 3,
    items: e.months,
    leftDisabled: e.leftDisabled,
    rightDisabled: e.rightDisabled,
    viewMode: "month",
    onLeft: e.previousPage,
    onRight: e.nextPage,
    onHeading: t[0] || (t[0] = (a) => e.$emit("back")),
    onElementClick: t[1] || (t[1] = (a) => e.$emit("select", a))
  }, {
    heading: P(() => [
      G(O(e.heading), 1)
    ]),
    _: 1
  }, 8, ["items", "leftDisabled", "rightDisabled", "onLeft", "onRight"]);
}
const ut = /* @__PURE__ */ I(rt, [["render", dt]]), ct = E({
  components: {
    PickerPopup: K
  },
  emits: {
    "update:pageDate": (e) => L(e),
    select: (e) => L(e),
    back: () => !0
  },
  props: {
    selected: {
      type: Date,
      required: !1
    },
    pageDate: {
      type: Date,
      required: !0
    },
    format: {
      type: String,
      required: !1,
      default: "dd"
    },
    headingFormat: {
      type: String,
      required: !1,
      default: "LLLL yyyy"
    },
    weekdayFormat: {
      type: String,
      required: !1,
      default: "EE"
    },
    locale: {
      type: Object,
      required: !1
    },
    weekStartsOn: {
      type: Number,
      required: !1,
      default: 1,
      validator: (e) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= 6
    },
    lowerLimit: {
      type: Date,
      required: !1
    },
    upperLimit: {
      type: Date,
      required: !1
    },
    disabledDates: {
      type: Object,
      required: !1
    },
    allowOutsideInterval: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  setup(e, { emit: t }) {
    const n = u(
      () => (d) => (p) => J(p, d, {
        locale: e.locale,
        weekStartsOn: e.weekStartsOn
      })
    ), o = u(() => me(e.pageDate)), s = u(() => fe(e.pageDate)), f = u(() => ({
      start: o.value,
      end: s.value
    })), i = u(() => ({
      start: Ce(o.value, {
        weekStartsOn: e.weekStartsOn
      }),
      end: qe(s.value, {
        weekStartsOn: e.weekStartsOn
      })
    })), a = u(() => {
      const d = e.weekStartsOn, p = n.value(e.weekdayFormat);
      return Array.from(Array(7)).map((y, w) => (d + w) % 7).map(
        (y) => Pe(/* @__PURE__ */ new Date(), y, {
          weekStartsOn: e.weekStartsOn
        })
      ).map(p);
    }), m = (d, p, y, w) => {
      var Q, X;
      return (Q = w == null ? void 0 : w.dates) != null && Q.some((r) => te(d, r)) || (X = w == null ? void 0 : w.predicate) != null && X.call(w, d) ? !1 : !p && !y ? !0 : !(p && N(d, Be(p)) || y && H(d, Ee(y)));
    }, V = u(() => {
      const d = /* @__PURE__ */ new Date(), p = n.value(e.format);
      return Fe(i.value).map(
        (y) => ({
          value: y,
          display: p(y),
          selected: !!e.selected && te(e.selected, y),
          current: te(d, y),
          disabled: !e.allowOutsideInterval && !Te(y, f.value) || !m(
            y,
            e.lowerLimit,
            e.upperLimit,
            e.disabledDates
          ),
          key: n.value("yyyy-MM-dd")(y)
        })
      );
    }), v = u(() => {
      n.value(e.headingFormat)(e.pageDate);
      const d = e.pageDate.getFullYear(), p = pe[e.pageDate.getMonth()];
      return `${Y(d)} 年 ${p.cn}`;
    }), h = u(
      () => e.lowerLimit && (ae(e.lowerLimit, e.pageDate) || N(e.pageDate, e.lowerLimit))
    ), g = u(
      () => e.upperLimit && (ae(e.upperLimit, e.pageDate) || H(e.pageDate, e.upperLimit))
    );
    return {
      weekDays: a,
      days: V,
      heading: v,
      leftDisabled: h,
      rightDisabled: g,
      previousPage: () => t("update:pageDate", Ie(e.pageDate, 1)),
      nextPage: () => t("update:pageDate", Re(e.pageDate, 1)),
      getWeekdayCN: (d) => Ue(d)
    };
  }
});
function mt(e, t, n, o, s, f) {
  const i = C("picker-popup");
  return D(), j(i, {
    headingClickable: "",
    leftDisabled: e.leftDisabled,
    rightDisabled: e.rightDisabled,
    items: e.days,
    viewMode: "day",
    onLeft: e.previousPage,
    onRight: e.nextPage,
    onHeading: t[0] || (t[0] = (a) => e.$emit("back")),
    onElementClick: t[1] || (t[1] = (a) => e.$emit("select", a))
  }, {
    heading: P(() => [
      G(O(e.heading), 1)
    ]),
    subheading: P(() => [
      (D(!0), S(W, null, z(e.weekDays, (a, m) => (D(), S("span", {
        key: a,
        class: R(`v3dp__subheading__weekday__${m}`)
      }, O(e.getWeekdayCN(a)), 3))), 128))
    ]),
    _: 1
  }, 8, ["leftDisabled", "rightDisabled", "items", "onLeft", "onRight"]);
}
const ft = /* @__PURE__ */ I(ct, [["render", mt]]);
function re(e, t) {
  const n = e.getBoundingClientRect(), o = {
    height: e.clientHeight,
    width: e.clientWidth
  }, s = t.getBoundingClientRect();
  if (!(s.top >= n.top && s.bottom <= n.top + o.height)) {
    const i = s.top - n.top, a = s.bottom - n.bottom;
    Math.abs(i) < Math.abs(a) ? e.scrollTop += i : e.scrollTop += a;
  }
}
const pt = E({
  components: {
    PickerPopup: K
  },
  emits: {
    select: (e) => L(e),
    back: () => !0
  },
  props: {
    selected: {
      type: Date,
      required: !1
    },
    pageDate: {
      type: Date,
      required: !0
    },
    visible: {
      type: Boolean,
      required: !0
    },
    disabledTime: {
      type: Object,
      required: !1
    }
  },
  setup(e, { emit: t }) {
    const n = _(null), o = _(null), s = u(() => e.pageDate ?? e.selected), f = _(s.value.getHours()), i = _(s.value.getMinutes());
    ie(
      () => e.selected,
      (l) => {
        let b = 0, k = 0;
        l && (b = l.getHours(), k = l.getMinutes()), f.value = b, i.value = k;
      }
    );
    const a = u(
      () => [...Array(24).keys()].map((l) => ({
        value: l,
        date: oe(new Date(s.value.getTime()), {
          hours: l,
          minutes: i.value,
          seconds: 0
        }),
        selected: f.value === l,
        ref: _(null)
      }))
    ), m = u(
      () => [...Array(60).keys()].map((l) => ({
        value: l,
        date: oe(new Date(s.value.getTime()), {
          hours: f.value,
          minutes: l,
          seconds: 0
        }),
        selected: i.value === l,
        ref: _(null)
      }))
    ), V = (l) => {
      i.value = l.value, t("select", l.date);
    }, v = () => {
      const l = a.value.find(
        (k) => {
          var d, p;
          return ((p = (d = k.ref.value) == null ? void 0 : d.classList) == null ? void 0 : p.contains("selected")) ?? !1;
        }
      ), b = m.value.find(
        (k) => {
          var d, p;
          return ((p = (d = k.ref.value) == null ? void 0 : d.classList) == null ? void 0 : p.contains("selected")) ?? !1;
        }
      );
      l && b && (re(n.value, l.ref.value), re(o.value, b.ref.value));
    };
    return ie(
      () => e.visible,
      (l) => {
        l && we(v);
      }
    ), {
      hoursListRef: n,
      minutesListRef: o,
      hours: f,
      minutes: i,
      hoursList: a,
      minutesList: m,
      padStartZero: (l) => `0${l}`.substr(-2),
      selectMinutes: V,
      isEnabled: (l) => {
        var b, k, d, p;
        return !((k = (b = e.disabledTime) == null ? void 0 : b.dates) != null && k.some(
          (y) => We(l, y) && Ne(l, y)
        ) || (p = (d = e.disabledTime) == null ? void 0 : d.predicate) != null && p.call(d, l));
      },
      scroll: v
    };
  }
}), gt = {
  ref: "hoursListRef",
  class: "v3dp__column"
}, yt = ["disabled", "onClick"], vt = {
  ref: "minutesListRef",
  class: "v3dp__column"
}, ht = ["disabled", "onClick"];
function Dt(e, t, n, o, s, f) {
  const i = C("picker-popup");
  return D(), j(i, {
    headingClickable: "",
    columnCount: 2,
    leftDisabled: !0,
    rightDisabled: !0,
    viewMode: "time",
    onHeading: t[0] || (t[0] = (a) => e.$emit("back"))
  }, {
    heading: P(() => [
      G(O(e.padStartZero(e.hours)) + ":" + O(e.padStartZero(e.minutes)), 1)
    ]),
    body: P(() => [
      c("div", gt, [
        (D(!0), S(W, null, z(e.hoursList, (a) => (D(), S("button", {
          key: a.value,
          ref_for: !0,
          ref: a.ref,
          class: R([{ selected: a.selected }, "v3dp__element_button__hour"]),
          disabled: !e.isEnabled(a.date),
          onClick: q((m) => e.hours = a.value, ["stop", "prevent"])
        }, [
          c("span", null, O(e.padStartZero(a.value)), 1)
        ], 10, yt))), 128))
      ], 512),
      c("div", vt, [
        (D(!0), S(W, null, z(e.minutesList, (a) => (D(), S("button", {
          key: a.value,
          ref_for: !0,
          ref: a.ref,
          class: R([{ selected: a.selected }, "v3dp__element_button__minute"]),
          disabled: !e.isEnabled(a.date),
          onClick: q((m) => e.selectMinutes(a), ["stop", "prevent"])
        }, [
          c("span", null, O(e.padStartZero(a.value)), 1)
        ], 10, ht))), 128))
      ], 512)
    ]),
    _: 1
  });
}
const bt = /* @__PURE__ */ I(pt, [["render", Dt], ["__scopeId", "data-v-57830a93"]]);
const Z = ["time", "day", "month", "year"], wt = (e, t, n = void 0) => {
  let o = n || /* @__PURE__ */ new Date();
  return e && (o = He([e, o])), t && (o = Ye([t, o])), o;
}, kt = E({
  components: {
    YearPicker: st,
    MonthPicker: ut,
    DayPicker: ft,
    TimePicker: bt
  },
  inheritAttrs: !1,
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Date,
      required: !1
    },
    disabledDates: {
      type: Object,
      required: !1
    },
    allowOutsideInterval: {
      type: Boolean,
      required: !1,
      default: !1
    },
    disabledTime: {
      type: Object,
      required: !1
    },
    upperLimit: {
      type: Date,
      required: !1
    },
    lowerLimit: {
      type: Date,
      required: !1
    },
    startingView: {
      type: String,
      required: !1,
      default: "day",
      validator: (e) => typeof e == "string" && Z.includes(e)
    },
    startingViewDate: {
      type: Date,
      required: !1,
      default: () => /* @__PURE__ */ new Date()
    },
    dayPickerHeadingFormat: {
      type: String,
      required: !1,
      default: "LLLL yyyy"
    },
    monthListFormat: {
      type: String,
      required: !1,
      default: "LLL"
    },
    weekdayFormat: {
      type: String,
      required: !1,
      default: "EE"
    },
    dayFormat: {
      type: String,
      required: !1,
      default: "dd"
    },
    inputFormat: {
      type: String,
      required: !1,
      default: "yyyy-MM-dd"
    },
    locale: {
      type: Object,
      required: !1
    },
    weekStartsOn: {
      type: Number,
      required: !1,
      default: 1,
      validator: (e) => [0, 1, 2, 3, 4, 5, 6].includes(e)
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    clearable: {
      type: Boolean,
      required: !1,
      default: !1
    },
    typeable: {
      type: Boolean,
      required: !1,
      default: !1
    },
    minimumView: {
      type: String,
      required: !1,
      default: "day",
      validator: (e) => typeof e == "string" && Z.includes(e)
    }
  },
  emits: {
    valueChanged: (e) => !0,
    "update:modelValue": (e) => e == null || L(e),
    decadePageChanged: (e) => !0,
    yearPageChanged: (e) => !0,
    monthPageChanged: (e) => !0,
    opened: () => !0,
    closed: () => !0
  },
  setup(e, { emit: t, attrs: n }) {
    const o = _("none"), s = _(e.startingViewDate), f = _(null), i = _(!1), a = _("");
    ee(() => {
      const r = se(a.value, e.inputFormat, /* @__PURE__ */ new Date(), {
        locale: e.locale
      });
      L(r) && (s.value = r);
    }), ee(() => {
      a.value = e.modelValue && L(e.modelValue) ? J(e.modelValue, e.inputFormat, { locale: e.locale }) : "", t("valueChanged", a.value);
    });
    const m = (r) => {
      e.disabled || (r !== "none" && o.value === "none" && (s.value = e.modelValue || wt(e.lowerLimit, e.upperLimit, s.value)), o.value = r, t(r !== "none" ? "opened" : "closed"));
    };
    ee(() => {
      e.disabled && (o.value = "none");
    });
    const V = (r, M) => {
      s.value = M, r === "year" ? t("decadePageChanged", M) : r === "month" ? t("yearPageChanged", M) : r === "day" && t("monthPageChanged", M);
    }, v = (r) => {
      s.value = r, e.minimumView === "year" ? (m("none"), t("update:modelValue", r)) : o.value = "month";
    }, h = (r) => {
      s.value = r, e.minimumView === "month" ? (m("none"), t("update:modelValue", r)) : o.value = "day";
    }, g = (r) => {
      s.value = r, e.minimumView === "day" ? (m("none"), t("update:modelValue", r)) : o.value = "time";
    }, l = (r) => {
      m("none"), t("update:modelValue", r);
    }, b = () => {
      e.clearable && (m("none"), t("update:modelValue", null), s.value = e.startingViewDate);
    }, k = () => i.value = !0, d = () => m(w.value), p = () => {
      i.value = !1, m();
    }, y = (r) => {
      const M = r.keyCode ? r.keyCode : r.which;
      if ([27, 13].includes(M) && f.value.blur(), e.typeable) {
        const x = se(f.value.value, e.inputFormat, /* @__PURE__ */ new Date(), { locale: e.locale });
        L(x) && a.value === J(x, e.inputFormat, { locale: e.locale }) && (a.value = f.value.value, t("update:modelValue", x));
      }
    }, w = u(() => {
      const r = Z.indexOf(e.startingView), M = Z.indexOf(e.minimumView);
      return r < M ? e.minimumView : e.startingView;
    });
    return {
      blur: p,
      focus: d,
      click: k,
      input: a,
      inputRef: f,
      pageDate: s,
      renderView: m,
      updatePageDate: V,
      selectYear: v,
      selectMonth: h,
      selectDay: g,
      selectTime: l,
      keyUp: y,
      viewShown: o,
      goBackFromTimepicker: () => e.startingView === "time" && e.minimumView === "time" ? null : o.value = "day",
      clearModelValue: b,
      initialView: w,
      log: (r) => console.log(r),
      variables: (r) => Object.fromEntries(
        Object.entries(r ?? {}).filter(([M, ge]) => M.startsWith("--"))
      )
      // click,
      // focus,
      // blur,
      //clear
    };
  }
}), Lt = { class: "v3dp__input_wrapper" }, $t = ["disabled"], _t = { class: "v3dp__clearable" };
function St(e, t, n, o, s, f) {
  const i = C("year-picker"), a = C("month-picker"), m = C("day-picker"), V = C("time-picker");
  return D(), S("div", {
    class: "v3dp__datepicker",
    style: de(e.variables(e.$attrs.style))
  }, [
    c("div", Lt, [
      F(c("input", ke({
        type: "text",
        ref: "inputRef",
        "onUpdate:modelValue": t[0] || (t[0] = (v) => e.input = v)
      }, e.$attrs, { disabled: e.disabled }), null, 16, $t), [
        [T, !1],
        [Le, e.input]
      ]),
      F(c("div", _t, [
        B(e.$slots, "clear", { onClear: e.clearModelValue }, () => [
          c("i", {
            onClick: t[1] || (t[1] = (v) => e.clearModelValue())
          }, "x")
        ])
      ], 512), [
        [T, e.clearable && e.modelValue]
      ])
    ]),
    F(A(i, {
      pageDate: e.pageDate,
      "onUpdate:pageDate": t[2] || (t[2] = (v) => e.updatePageDate("year", v)),
      selected: e.modelValue,
      lowerLimit: e.lowerLimit,
      upperLimit: e.upperLimit,
      onSelect: e.selectYear
    }, null, 8, ["pageDate", "selected", "lowerLimit", "upperLimit", "onSelect"]), [
      [T, e.viewShown === "year"]
    ]),
    F(A(a, {
      pageDate: e.pageDate,
      "onUpdate:pageDate": t[3] || (t[3] = (v) => e.updatePageDate("month", v)),
      selected: e.modelValue,
      onSelect: e.selectMonth,
      lowerLimit: e.lowerLimit,
      upperLimit: e.upperLimit,
      format: e.monthListFormat,
      locale: e.locale,
      onBack: t[4] || (t[4] = (v) => e.viewShown = "year")
    }, null, 8, ["pageDate", "selected", "onSelect", "lowerLimit", "upperLimit", "format", "locale"]), [
      [T, e.viewShown === "month"]
    ]),
    F(A(m, {
      pageDate: e.pageDate,
      "onUpdate:pageDate": t[5] || (t[5] = (v) => e.updatePageDate("day", v)),
      selected: e.modelValue,
      weekStartsOn: e.weekStartsOn,
      lowerLimit: e.lowerLimit,
      upperLimit: e.upperLimit,
      headingFormat: e.dayPickerHeadingFormat,
      disabledDates: e.disabledDates,
      locale: e.locale,
      weekdayFormat: e.weekdayFormat,
      "allow-outside-interval": e.allowOutsideInterval,
      format: e.dayFormat,
      onSelect: e.selectDay,
      onBack: t[6] || (t[6] = (v) => e.viewShown = "month")
    }, null, 8, ["pageDate", "selected", "weekStartsOn", "lowerLimit", "upperLimit", "headingFormat", "disabledDates", "locale", "weekdayFormat", "allow-outside-interval", "format", "onSelect"]), [
      [T, e.viewShown === "day"]
    ]),
    F(A(V, {
      pageDate: e.pageDate,
      visible: e.viewShown === "time",
      selected: e.modelValue,
      disabledTime: e.disabledTime,
      onSelect: e.selectTime,
      onBack: e.goBackFromTimepicker
    }, null, 8, ["pageDate", "visible", "selected", "disabledTime", "onSelect", "onBack"]), [
      [T, e.viewShown === "time"]
    ])
  ], 4);
}
const Ot = /* @__PURE__ */ I(kt, [["render", St]]);
export {
  Ot as default
};
