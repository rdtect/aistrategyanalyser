import { createAnatomy } from '@zag-js/anatomy';
import { raf, setElementValue, queryAll, trackPointerMove, trackFormControl, getRelativePoint, dispatchInputValueEvent, dataAttr, isLeftClick, isModifierKey, getEventPoint, ariaAttr, getEventStep, getEventKey } from '@zag-js/dom-query';
import { setValueAtIndex, getValuePercent, isEqual, createSplitProps, snapValueToStep, clampValue, getValueRanges, getNextStepValue, getPreviousStepValue, getPercentValue, getClosestValueIndex, first, last, getValueTransformer } from '@zag-js/utils';
import { createMachine } from '@zag-js/core';
import { trackElementsSize } from '@zag-js/element-size';
import { createProps } from '@zag-js/types';

// src/slider.anatomy.ts
var anatomy = createAnatomy("slider").parts(
  "root",
  "label",
  "thumb",
  "valueText",
  "track",
  "range",
  "control",
  "markerGroup",
  "marker",
  "draggingIndicator"
);
var parts = anatomy.build();
var getRootId = (ctx) => ctx.ids?.root ?? `slider:${ctx.id}`;
var getThumbId = (ctx, index) => ctx.ids?.thumb?.(index) ?? `slider:${ctx.id}:thumb:${index}`;
var getHiddenInputId = (ctx, index) => ctx.ids?.hiddenInput?.(index) ?? `slider:${ctx.id}:input:${index}`;
var getControlId = (ctx) => ctx.ids?.control ?? `slider:${ctx.id}:control`;
var getTrackId = (ctx) => ctx.ids?.track ?? `slider:${ctx.id}:track`;
var getRangeId = (ctx) => ctx.ids?.range ?? `slider:${ctx.id}:range`;
var getLabelId = (ctx) => ctx.ids?.label ?? `slider:${ctx.id}:label`;
var getValueTextId = (ctx) => ctx.ids?.valueText ?? `slider:${ctx.id}:value-text`;
var getMarkerId = (ctx, value) => ctx.ids?.marker?.(value) ?? `slider:${ctx.id}:marker:${value}`;
var getRootEl = (ctx) => ctx.getById(getRootId(ctx));
var getThumbEl = (ctx, index) => ctx.getById(getThumbId(ctx, index));
var getHiddenInputEl = (ctx, index) => ctx.getById(getHiddenInputId(ctx, index));
var getControlEl = (ctx) => ctx.getById(getControlId(ctx));
var getElements = (ctx) => queryAll(getControlEl(ctx), "[role=slider]");
var getFirstEl = (ctx) => getElements(ctx)[0];
var getValueFromPoint = (params, point) => {
  const { prop, scope } = params;
  const controlEl = getControlEl(scope);
  if (!controlEl) return;
  const relativePoint = getRelativePoint(point, controlEl);
  const percent = relativePoint.getPercentValue({
    orientation: prop("orientation"),
    dir: prop("dir"),
    inverted: { y: true }
  });
  return getPercentValue(percent, prop("min"), prop("max"), prop("step"));
};
var dispatchChangeEvent = (ctx, value) => {
  value.forEach((value2, index) => {
    const inputEl = getHiddenInputEl(ctx, index);
    if (!inputEl) return;
    dispatchInputValueEvent(inputEl, { value: value2 });
  });
};
function getBounds(value) {
  const firstValue = value[0];
  const lastThumb = value[value.length - 1];
  return [firstValue, lastThumb];
}
function getRangeOffsets(params) {
  const { prop, computed } = params;
  const valuePercent = computed("valuePercent");
  const [firstPercent, lastPercent] = getBounds(valuePercent);
  if (valuePercent.length === 1) {
    if (prop("origin") === "center") {
      const isNegative = valuePercent[0] < 50;
      const start = isNegative ? `${valuePercent[0]}%` : "50%";
      const end = isNegative ? "50%" : `${100 - valuePercent[0]}%`;
      return { start, end };
    }
    return { start: "0%", end: `${100 - lastPercent}%` };
  }
  return { start: `${firstPercent}%`, end: `${100 - lastPercent}%` };
}
function getRangeStyle(params) {
  const { computed } = params;
  const isVertical = computed("isVertical");
  const isRtl = computed("isRtl");
  if (isVertical) {
    return {
      position: "absolute",
      bottom: "var(--slider-range-start)",
      top: "var(--slider-range-end)"
    };
  }
  return {
    position: "absolute",
    [isRtl ? "right" : "left"]: "var(--slider-range-start)",
    [isRtl ? "left" : "right"]: "var(--slider-range-end)"
  };
}
function getVerticalThumbOffset(params, value) {
  const { context, prop } = params;
  const { height = 0 } = context.get("thumbSize") ?? {};
  const getValue = getValueTransformer([prop("min"), prop("max")], [-height / 2, height / 2]);
  return parseFloat(getValue(value).toFixed(2));
}
function getHorizontalThumbOffset(params, value) {
  const { computed, context, prop } = params;
  const { width = 0 } = context.get("thumbSize") ?? {};
  const isRtl = computed("isRtl");
  if (isRtl) {
    const getValue2 = getValueTransformer([prop("max"), prop("min")], [-width / 2, width / 2]);
    return -1 * parseFloat(getValue2(value).toFixed(2));
  }
  const getValue = getValueTransformer([prop("min"), prop("max")], [-width / 2, width / 2]);
  return parseFloat(getValue(value).toFixed(2));
}
function getOffset(params, percent, value) {
  const { computed, prop } = params;
  if (prop("thumbAlignment") === "center") return `${percent}%`;
  const offset = computed("isVertical") ? getVerticalThumbOffset(params, value) : getHorizontalThumbOffset(params, value);
  return `calc(${percent}% - ${offset}px)`;
}
function getThumbOffset(params, value) {
  const { prop } = params;
  const percent = getValuePercent(value, prop("min"), prop("max")) * 100;
  return getOffset(params, percent, value);
}
function getVisibility(params) {
  const { computed, prop } = params;
  let visibility = "visible";
  if (prop("thumbAlignment") === "contain" && !computed("hasMeasuredThumbSize")) {
    visibility = "hidden";
  }
  return visibility;
}
function getThumbStyle(params, index) {
  const { computed } = params;
  const placementProp = computed("isVertical") ? "bottom" : "insetInlineStart";
  return {
    visibility: getVisibility(params),
    position: "absolute",
    transform: "var(--slider-thumb-transform)",
    [placementProp]: `var(--slider-thumb-offset-${index})`
  };
}
function getControlStyle() {
  return {
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    position: "relative"
  };
}
function getRootStyle(params) {
  const { context, computed } = params;
  const isVertical = computed("isVertical");
  const isRtl = computed("isRtl");
  const range = getRangeOffsets(params);
  const offsetStyles = context.get("value").reduce((styles, value, index) => {
    const offset = getThumbOffset(params, value);
    return { ...styles, [`--slider-thumb-offset-${index}`]: offset };
  }, {});
  return {
    ...offsetStyles,
    "--slider-thumb-transform": isVertical ? "translateY(50%)" : isRtl ? "translateX(50%)" : "translateX(-50%)",
    "--slider-range-start": range.start,
    "--slider-range-end": range.end
  };
}
function getMarkerStyle(params, value) {
  const { computed } = params;
  const isHorizontal = computed("isHorizontal");
  const isRtl = computed("isRtl");
  return {
    visibility: getVisibility(params),
    position: "absolute",
    pointerEvents: "none",
    [isHorizontal ? "insetInlineStart" : "bottom"]: getThumbOffset(params, value),
    translate: "var(--tx) var(--ty)",
    "--tx": isHorizontal ? isRtl ? "50%" : "-50%" : "0%",
    "--ty": !isHorizontal ? "50%" : "0%"
  };
}
function getMarkerGroupStyle() {
  return {
    userSelect: "none",
    WebkitUserSelect: "none",
    pointerEvents: "none",
    position: "relative"
  };
}
function normalizeValues(params, nextValues) {
  return nextValues.map((value, index) => {
    return constrainValue(params, value, index);
  });
}
function getRangeAtIndex(params, index) {
  const { context, prop } = params;
  return getValueRanges(context.get("value"), prop("min"), prop("max"), prop("minStepsBetweenThumbs"))[index];
}
function constrainValue(params, value, index) {
  const { prop } = params;
  const range = getRangeAtIndex(params, index);
  const snapValue = snapValueToStep(value, prop("min"), prop("max"), prop("step"));
  return clampValue(snapValue, range.min, range.max);
}
function decrement(params, index, step) {
  const { context, prop } = params;
  const idx = index ?? context.get("focusedIndex");
  const range = getRangeAtIndex(params, idx);
  const nextValues = getPreviousStepValue(idx, {
    ...range,
    step: step ?? prop("step"),
    values: context.get("value")
  });
  nextValues[idx] = clampValue(nextValues[idx], range.min, range.max);
  return nextValues;
}
function increment(params, index, step) {
  const { context, prop } = params;
  const idx = index ?? context.get("focusedIndex");
  const range = getRangeAtIndex(params, idx);
  const nextValues = getNextStepValue(idx, {
    ...range,
    step: step ?? prop("step"),
    values: context.get("value")
  });
  nextValues[idx] = clampValue(nextValues[idx], range.min, range.max);
  return nextValues;
}
function getClosestIndex(params, pointValue) {
  const { context } = params;
  return getClosestValueIndex(context.get("value"), pointValue);
}

// src/slider.connect.ts
function connect(service, normalize) {
  const { state, send, context, prop, computed, scope } = service;
  const ariaLabel = prop("aria-label");
  const ariaLabelledBy = prop("aria-labelledby");
  const sliderValue = context.get("value");
  const focusedIndex = context.get("focusedIndex");
  const focused = state.matches("focus");
  const dragging = state.matches("dragging");
  const disabled = computed("isDisabled");
  const invalid = prop("invalid");
  const interactive = computed("isInteractive");
  const isHorizontal = prop("orientation") === "horizontal";
  const isVertical = prop("orientation") === "vertical";
  function getValuePercentFn(value) {
    return getValuePercent(value, prop("min"), prop("max"));
  }
  function getPercentValueFn(percent) {
    return getPercentValue(percent, prop("min"), prop("max"), prop("step"));
  }
  return {
    value: sliderValue,
    dragging,
    focused,
    setValue(value) {
      send({ type: "SET_VALUE", value });
    },
    getThumbValue(index) {
      return sliderValue[index];
    },
    setThumbValue(index, value) {
      send({ type: "SET_VALUE", index, value });
    },
    getValuePercent: getValuePercentFn,
    getPercentValue: getPercentValueFn,
    getThumbPercent(index) {
      return getValuePercentFn(sliderValue[index]);
    },
    setThumbPercent(index, percent) {
      const value = getPercentValueFn(percent);
      send({ type: "SET_VALUE", index, value });
    },
    getThumbMin(index) {
      return getRangeAtIndex(service, index).min;
    },
    getThumbMax(index) {
      return getRangeAtIndex(service, index).max;
    },
    increment(index) {
      send({ type: "INCREMENT", index });
    },
    decrement(index) {
      send({ type: "DECREMENT", index });
    },
    focus() {
      if (!interactive) return;
      send({ type: "FOCUS", index: 0 });
    },
    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        dir: prop("dir"),
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-invalid": dataAttr(invalid),
        "data-dragging": dataAttr(dragging),
        "data-focus": dataAttr(focused),
        id: getLabelId(scope),
        htmlFor: getHiddenInputId(scope, 0),
        onClick(event) {
          if (!interactive) return;
          event.preventDefault();
          getFirstEl(scope)?.focus();
        },
        style: {
          userSelect: "none",
          WebkitUserSelect: "none"
        }
      });
    },
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-dragging": dataAttr(dragging),
        "data-invalid": dataAttr(invalid),
        "data-focus": dataAttr(focused),
        id: getRootId(scope),
        dir: prop("dir"),
        style: getRootStyle(service)
      });
    },
    getValueTextProps() {
      return normalize.element({
        ...parts.valueText.attrs,
        dir: prop("dir"),
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-invalid": dataAttr(invalid),
        "data-focus": dataAttr(focused),
        id: getValueTextId(scope)
      });
    },
    getTrackProps() {
      return normalize.element({
        ...parts.track.attrs,
        dir: prop("dir"),
        id: getTrackId(scope),
        "data-disabled": dataAttr(disabled),
        "data-invalid": dataAttr(invalid),
        "data-dragging": dataAttr(dragging),
        "data-orientation": prop("orientation"),
        "data-focus": dataAttr(focused),
        style: { position: "relative" }
      });
    },
    getThumbProps(props2) {
      const { index = 0, name } = props2;
      const value = sliderValue[index];
      const range = getRangeAtIndex(service, index);
      const valueText = prop("getAriaValueText")?.({ value, index });
      const _ariaLabel = Array.isArray(ariaLabel) ? ariaLabel[index] : ariaLabel;
      const _ariaLabelledBy = Array.isArray(ariaLabelledBy) ? ariaLabelledBy[index] : ariaLabelledBy;
      return normalize.element({
        ...parts.thumb.attrs,
        dir: prop("dir"),
        "data-index": index,
        "data-name": name,
        id: getThumbId(scope, index),
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-focus": dataAttr(focused && focusedIndex === index),
        "data-dragging": dataAttr(dragging && focusedIndex === index),
        draggable: false,
        "aria-disabled": ariaAttr(disabled),
        "aria-label": _ariaLabel,
        "aria-labelledby": _ariaLabelledBy ?? getLabelId(scope),
        "aria-orientation": prop("orientation"),
        "aria-valuemax": range.max,
        "aria-valuemin": range.min,
        "aria-valuenow": sliderValue[index],
        "aria-valuetext": valueText,
        role: "slider",
        tabIndex: disabled ? void 0 : 0,
        style: getThumbStyle(service, index),
        onPointerDown(event) {
          if (!interactive) return;
          send({ type: "THUMB_POINTER_DOWN", index });
          event.stopPropagation();
        },
        onBlur() {
          if (!interactive) return;
          send({ type: "BLUR" });
        },
        onFocus() {
          if (!interactive) return;
          send({ type: "FOCUS", index });
        },
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (!interactive) return;
          const step = getEventStep(event) * prop("step");
          const keyMap = {
            ArrowUp() {
              if (isHorizontal) return;
              send({ type: "ARROW_INC", step, src: "ArrowUp" });
            },
            ArrowDown() {
              if (isHorizontal) return;
              send({ type: "ARROW_DEC", step, src: "ArrowDown" });
            },
            ArrowLeft() {
              if (isVertical) return;
              send({ type: "ARROW_DEC", step, src: "ArrowLeft" });
            },
            ArrowRight() {
              if (isVertical) return;
              send({ type: "ARROW_INC", step, src: "ArrowRight" });
            },
            PageUp() {
              send({ type: "ARROW_INC", step, src: "PageUp" });
            },
            PageDown() {
              send({ type: "ARROW_DEC", step, src: "PageDown" });
            },
            Home() {
              send({ type: "HOME" });
            },
            End() {
              send({ type: "END" });
            }
          };
          const key = getEventKey(event, {
            dir: prop("dir"),
            orientation: prop("orientation")
          });
          const exec = keyMap[key];
          if (exec) {
            exec(event);
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });
    },
    getHiddenInputProps(props2) {
      const { index = 0, name } = props2;
      return normalize.input({
        name: name ?? (prop("name") ? prop("name") + (sliderValue.length > 1 ? "[]" : "") : void 0),
        form: prop("form"),
        type: "text",
        hidden: true,
        defaultValue: sliderValue[index],
        id: getHiddenInputId(scope, index)
      });
    },
    getRangeProps() {
      return normalize.element({
        id: getRangeId(scope),
        ...parts.range.attrs,
        dir: prop("dir"),
        "data-dragging": dataAttr(dragging),
        "data-focus": dataAttr(focused),
        "data-invalid": dataAttr(invalid),
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        style: getRangeStyle(service)
      });
    },
    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        dir: prop("dir"),
        id: getControlId(scope),
        "data-dragging": dataAttr(dragging),
        "data-disabled": dataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-invalid": dataAttr(invalid),
        "data-focus": dataAttr(focused),
        style: getControlStyle(),
        onPointerDown(event) {
          if (!interactive) return;
          if (!isLeftClick(event)) return;
          if (isModifierKey(event)) return;
          const point = getEventPoint(event);
          send({ type: "POINTER_DOWN", point });
          event.preventDefault();
          event.stopPropagation();
        }
      });
    },
    getMarkerGroupProps() {
      return normalize.element({
        ...parts.markerGroup.attrs,
        role: "presentation",
        dir: prop("dir"),
        "aria-hidden": true,
        "data-orientation": prop("orientation"),
        style: getMarkerGroupStyle()
      });
    },
    getMarkerProps(props2) {
      const style = getMarkerStyle(service, props2.value);
      let markerState;
      if (props2.value < first(sliderValue)) {
        markerState = "under-value";
      } else if (props2.value > last(sliderValue)) {
        markerState = "over-value";
      } else {
        markerState = "at-value";
      }
      return normalize.element({
        ...parts.marker.attrs,
        id: getMarkerId(scope, props2.value),
        role: "presentation",
        dir: prop("dir"),
        "data-orientation": prop("orientation"),
        "data-value": props2.value,
        "data-disabled": dataAttr(disabled),
        "data-state": markerState,
        style
      });
    },
    getDraggingIndicatorProps(props2) {
      const { index = 0 } = props2;
      const isDragging = index === focusedIndex && dragging;
      return normalize.element({
        ...parts.draggingIndicator.attrs,
        role: "presentation",
        dir: prop("dir"),
        hidden: !isDragging,
        "data-orientation": prop("orientation"),
        "data-state": isDragging ? "open" : "closed",
        style: getThumbStyle(service, index)
      });
    }
  };
}
var isEqualSize = (a, b) => {
  return a?.width === b?.width && a?.height === b?.height;
};
var machine = createMachine({
  props({ props: props2 }) {
    return {
      dir: "ltr",
      thumbAlignment: "contain",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: [0],
      origin: "start",
      orientation: "horizontal",
      minStepsBetweenThumbs: 0,
      ...props2
    };
  },
  initialState() {
    return "idle";
  },
  context({ prop, bindable, getContext }) {
    return {
      thumbSize: bindable(() => ({
        defaultValue: prop("thumbSize") || null
      })),
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        value: prop("value"),
        isEqual,
        hash(a) {
          return a.join(",");
        },
        onChange(value) {
          prop("onValueChange")?.({ value });
        }
      })),
      focusedIndex: bindable(() => ({
        defaultValue: -1,
        onChange(value) {
          const ctx = getContext();
          prop("onFocusChange")?.({ focusedIndex: value, value: ctx.get("value") });
        }
      })),
      fieldsetDisabled: bindable(() => ({
        defaultValue: false
      }))
    };
  },
  computed: {
    isHorizontal: ({ prop }) => prop("orientation") === "horizontal",
    isVertical: ({ prop }) => prop("orientation") === "vertical",
    isRtl: ({ prop }) => prop("orientation") === "horizontal" && prop("dir") === "rtl",
    isDisabled: ({ context, prop }) => !!prop("disabled") || context.get("fieldsetDisabled"),
    isInteractive: ({ prop, computed }) => !(prop("readOnly") || computed("isDisabled")),
    hasMeasuredThumbSize: ({ context }) => context.get("thumbSize") != null,
    valuePercent({ context, prop }) {
      return context.get("value").map((value) => 100 * getValuePercent(value, prop("min"), prop("max")));
    }
  },
  watch({ track, action, context }) {
    track([() => context.hash("value")], () => {
      action(["syncInputElements", "dispatchChangeEvent"]);
    });
  },
  effects: ["trackFormControlState", "trackThumbsSize"],
  on: {
    SET_VALUE: [
      {
        guard: "hasIndex",
        actions: ["setValueAtIndex"]
      },
      {
        actions: ["setValue"]
      }
    ],
    INCREMENT: {
      actions: ["incrementThumbAtIndex"]
    },
    DECREMENT: {
      actions: ["decrementThumbAtIndex"]
    }
  },
  states: {
    idle: {
      on: {
        POINTER_DOWN: {
          target: "dragging",
          actions: ["setClosestThumbIndex", "setPointerValue", "focusActiveThumb"]
        },
        FOCUS: {
          target: "focus",
          actions: ["setFocusedIndex"]
        },
        THUMB_POINTER_DOWN: {
          target: "dragging",
          actions: ["setFocusedIndex", "focusActiveThumb"]
        }
      }
    },
    focus: {
      entry: ["focusActiveThumb"],
      on: {
        POINTER_DOWN: {
          target: "dragging",
          actions: ["setClosestThumbIndex", "setPointerValue", "focusActiveThumb"]
        },
        THUMB_POINTER_DOWN: {
          target: "dragging",
          actions: ["setFocusedIndex", "focusActiveThumb"]
        },
        ARROW_DEC: {
          actions: ["decrementThumbAtIndex", "invokeOnChangeEnd"]
        },
        ARROW_INC: {
          actions: ["incrementThumbAtIndex", "invokeOnChangeEnd"]
        },
        HOME: {
          actions: ["setFocusedThumbToMin", "invokeOnChangeEnd"]
        },
        END: {
          actions: ["setFocusedThumbToMax", "invokeOnChangeEnd"]
        },
        BLUR: {
          target: "idle",
          actions: ["clearFocusedIndex"]
        }
      }
    },
    dragging: {
      entry: ["focusActiveThumb"],
      effects: ["trackPointerMove"],
      on: {
        POINTER_UP: {
          target: "focus",
          actions: ["invokeOnChangeEnd"]
        },
        POINTER_MOVE: {
          actions: ["setPointerValue"]
        }
      }
    }
  },
  implementations: {
    guards: {
      hasIndex: ({ event }) => event.index != null
    },
    effects: {
      trackFormControlState({ context, scope }) {
        return trackFormControl(getRootEl(scope), {
          onFieldsetDisabledChange(disabled) {
            context.set("fieldsetDisabled", disabled);
          },
          onFormReset() {
            context.set("value", context.initial("value"));
          }
        });
      },
      trackPointerMove({ scope, send }) {
        return trackPointerMove(scope.getDoc(), {
          onPointerMove(info) {
            send({ type: "POINTER_MOVE", point: info.point });
          },
          onPointerUp() {
            send({ type: "POINTER_UP" });
          }
        });
      },
      trackThumbsSize({ context, scope, prop }) {
        if (prop("thumbAlignment") !== "contain" || context.get("thumbSize")) return;
        return trackElementsSize({
          getNodes: () => getElements(scope),
          observeMutation: true,
          callback(size) {
            if (!size || isEqualSize(context.get("thumbSize"), size)) return;
            context.set("thumbSize", size);
          }
        });
      }
    },
    actions: {
      dispatchChangeEvent({ context, scope }) {
        dispatchChangeEvent(scope, context.get("value"));
      },
      syncInputElements({ context, scope }) {
        context.get("value").forEach((value, index) => {
          const inputEl = getHiddenInputEl(scope, index);
          setElementValue(inputEl, value.toString());
        });
      },
      invokeOnChangeEnd({ prop, context }) {
        prop("onValueChangeEnd")?.({ value: context.get("value") });
      },
      setClosestThumbIndex(params) {
        const { context, event } = params;
        const pointValue = getValueFromPoint(params, event.point);
        if (pointValue == null) return;
        const focusedIndex = getClosestIndex(params, pointValue);
        context.set("focusedIndex", focusedIndex);
      },
      setFocusedIndex({ context, event }) {
        context.set("focusedIndex", event.index);
      },
      clearFocusedIndex({ context }) {
        context.set("focusedIndex", -1);
      },
      setPointerValue(params) {
        queueMicrotask(() => {
          const { context, event } = params;
          const pointValue = getValueFromPoint(params, event.point);
          if (pointValue == null) return;
          const focusedIndex = context.get("focusedIndex");
          const value = constrainValue(params, pointValue, focusedIndex);
          context.set("value", (prev) => setValueAtIndex(prev, focusedIndex, value));
        });
      },
      focusActiveThumb({ scope, context }) {
        raf(() => {
          const thumbEl = getThumbEl(scope, context.get("focusedIndex"));
          thumbEl?.focus({ preventScroll: true });
        });
      },
      decrementThumbAtIndex(params) {
        const { context, event } = params;
        const value = decrement(params, event.index, event.step);
        context.set("value", value);
      },
      incrementThumbAtIndex(params) {
        const { context, event } = params;
        const value = increment(params, event.index, event.step);
        context.set("value", value);
      },
      setFocusedThumbToMin(params) {
        const { context } = params;
        const index = context.get("focusedIndex");
        const { min } = getRangeAtIndex(params, index);
        context.set("value", (prev) => setValueAtIndex(prev, index, min));
      },
      setFocusedThumbToMax(params) {
        const { context } = params;
        const index = context.get("focusedIndex");
        const { max } = getRangeAtIndex(params, index);
        context.set("value", (prev) => setValueAtIndex(prev, index, max));
      },
      setValueAtIndex(params) {
        const { context, event } = params;
        const value = constrainValue(params, event.value, event.index);
        context.set("value", (prev) => setValueAtIndex(prev, event.index, value));
      },
      setValue(params) {
        const { context, event } = params;
        const value = normalizeValues(params, event.value);
        context.set("value", value);
      }
    }
  }
});
var props = createProps()([
  "aria-label",
  "aria-labelledby",
  "dir",
  "disabled",
  "form",
  "getAriaValueText",
  "getRootNode",
  "id",
  "ids",
  "invalid",
  "max",
  "min",
  "minStepsBetweenThumbs",
  "name",
  "onFocusChange",
  "onValueChange",
  "onValueChangeEnd",
  "orientation",
  "origin",
  "readOnly",
  "step",
  "thumbAlignment",
  "thumbAlignment",
  "thumbSize",
  "value",
  "defaultValue"
]);
var splitProps = createSplitProps(props);
var thumbProps = createProps()(["index", "name"]);
var splitThumbProps = createSplitProps(thumbProps);

export { anatomy, connect, machine, props, splitProps, splitThumbProps, thumbProps };
