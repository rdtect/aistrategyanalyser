import { createAnatomy } from '@zag-js/anatomy';
import { createMachine, memo } from '@zag-js/core';
import { isNumber, getValuePercent, createSplitProps } from '@zag-js/utils';
import { createProps } from '@zag-js/types';

// src/progress.anatomy.ts
var anatomy = createAnatomy("progress").parts(
  "root",
  "label",
  "track",
  "range",
  "valueText",
  "view",
  "circle",
  "circleTrack",
  "circleRange"
);
var parts = anatomy.build();

// src/progress.dom.ts
var getRootId = (ctx) => ctx.ids?.root ?? `progress-${ctx.id}`;
var getTrackId = (ctx) => ctx.ids?.track ?? `progress-${ctx.id}-track`;
var getLabelId = (ctx) => ctx.ids?.label ?? `progress-${ctx.id}-label`;
var getCircleId = (ctx) => ctx.ids?.circle ?? `progress-${ctx.id}-circle`;

// src/progress.connect.ts
function connect(service, normalize) {
  const { context, computed, prop, send, scope } = service;
  const percent = computed("percent");
  const percentAsString = computed("isIndeterminate") ? "" : computed("formatter").format(computed("percent") / 100);
  const max = prop("max");
  const min = prop("min");
  const orientation = prop("orientation");
  const translations = prop("translations");
  const indeterminate = computed("isIndeterminate");
  const value = context.get("value");
  const valueAsString = translations?.value({ value, max, percent, min }) ?? "";
  const progressState = getProgressState(value, max);
  const progressbarProps = {
    role: "progressbar",
    "aria-label": valueAsString,
    "data-max": max,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value ?? void 0,
    "data-orientation": orientation,
    "data-state": progressState
  };
  const circleProps = getCircleProps(service);
  return {
    value,
    valueAsString,
    min,
    max,
    percent,
    percentAsString,
    indeterminate,
    setValue(value2) {
      send({ type: "VALUE.SET", value: value2 });
    },
    setToMax() {
      send({ type: "VALUE.SET", value: max });
    },
    setToMin() {
      send({ type: "VALUE.SET", value: min });
    },
    getRootProps() {
      return normalize.element({
        dir: prop("dir"),
        ...parts.root.attrs,
        id: getRootId(scope),
        "data-max": max,
        "data-value": value ?? void 0,
        "data-state": progressState,
        "data-orientation": orientation,
        style: {
          "--percent": indeterminate ? void 0 : percent
        }
      });
    },
    getLabelProps() {
      return normalize.element({
        dir: prop("dir"),
        id: getLabelId(scope),
        ...parts.label.attrs,
        "data-orientation": orientation
      });
    },
    getValueTextProps() {
      return normalize.element({
        dir: prop("dir"),
        "aria-live": "polite",
        ...parts.valueText.attrs
      });
    },
    getTrackProps() {
      return normalize.element({
        dir: prop("dir"),
        id: getTrackId(scope),
        ...parts.track.attrs,
        ...progressbarProps
      });
    },
    getRangeProps() {
      return normalize.element({
        dir: prop("dir"),
        ...parts.range.attrs,
        "data-orientation": orientation,
        "data-state": progressState,
        style: {
          [computed("isHorizontal") ? "width" : "height"]: indeterminate ? void 0 : `${percent}%`
        }
      });
    },
    getCircleProps() {
      return normalize.element({
        dir: prop("dir"),
        id: getCircleId(scope),
        ...parts.circle.attrs,
        ...progressbarProps,
        ...circleProps.root
      });
    },
    getCircleTrackProps() {
      return normalize.element({
        dir: prop("dir"),
        "data-orientation": orientation,
        ...parts.circleTrack.attrs,
        ...circleProps.track
      });
    },
    getCircleRangeProps() {
      return normalize.element({
        dir: prop("dir"),
        ...parts.circleRange.attrs,
        ...circleProps.range,
        "data-state": progressState
      });
    },
    getViewProps(props2) {
      return normalize.element({
        dir: prop("dir"),
        ...parts.view.attrs,
        "data-state": props2.state,
        hidden: props2.state !== progressState
      });
    }
  };
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function getCircleProps(service) {
  const { context, computed } = service;
  const circleProps = {
    style: {
      "--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
      cx: "calc(var(--size) / 2)",
      cy: "calc(var(--size) / 2)",
      r: "var(--radius)",
      fill: "transparent",
      strokeWidth: "var(--thickness)"
    }
  };
  return {
    root: {
      style: {
        width: "var(--size)",
        height: "var(--size)"
      }
    },
    track: circleProps,
    range: {
      opacity: context.get("value") === 0 ? 0 : void 0,
      style: {
        ...circleProps.style,
        "--percent": computed("percent"),
        "--circumference": `calc(2 * 3.14159 * var(--radius))`,
        "--offset": `calc(var(--circumference) * (100 - var(--percent)) / 100)`,
        strokeDashoffset: `calc(var(--circumference) * ((100 - var(--percent)) / 100))`,
        strokeDasharray: computed("isIndeterminate") ? void 0 : `var(--circumference)`,
        transformOrigin: "center",
        transform: "rotate(-90deg)"
      }
    }
  };
}
var machine = createMachine({
  props({ props: props2 }) {
    const min = props2.min ?? 0;
    const max = props2.max ?? 100;
    return {
      ...props2,
      max,
      min,
      defaultValue: props2.defaultValue ?? midValue(min, max),
      orientation: "horizontal",
      formatOptions: {
        style: "percent",
        ...props2.formatOptions
      },
      translations: {
        value: ({ percent }) => percent === -1 ? "loading..." : `${percent} percent`,
        ...props2.translations
      }
    };
  },
  initialState() {
    return "idle";
  },
  entry: ["validateContext"],
  context({ bindable, prop }) {
    return {
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        value: prop("value"),
        onChange(value) {
          prop("onValueChange")?.({ value });
        }
      }))
    };
  },
  computed: {
    isIndeterminate: ({ context }) => context.get("value") === null,
    percent({ context, prop }) {
      const value = context.get("value");
      if (!isNumber(value)) return -1;
      return getValuePercent(value, prop("min"), prop("max")) * 100;
    },
    formatter: memo(
      ({ prop }) => [prop("locale"), prop("formatOptions")],
      (locale, formatOptions) => new Intl.NumberFormat(locale, formatOptions)
    ),
    isHorizontal: ({ prop }) => prop("orientation") === "horizontal"
  },
  states: {
    idle: {
      on: {
        "VALUE.SET": {
          actions: ["setValue"]
        }
      }
    }
  },
  implementations: {
    actions: {
      setValue: ({ context, event, prop }) => {
        const value = event.value === null ? null : Math.max(0, Math.min(event.value, prop("max")));
        context.set("value", value);
      },
      validateContext: ({ context, prop }) => {
        const max = prop("max");
        const min = prop("min");
        const value = context.get("value");
        if (value == null) return;
        if (!isValidNumber(max)) {
          throw new Error(`[progress] The max value passed \`${max}\` is not a valid number`);
        }
        if (!isValidMax(value, max)) {
          throw new Error(`[progress] The value passed \`${value}\` exceeds the max value \`${max}\``);
        }
        if (!isValidMin(value, min)) {
          throw new Error(`[progress] The value passed \`${value}\` exceeds the min value \`${min}\``);
        }
      }
    }
  }
});
var isValidNumber = (max) => isNumber(max) && !isNaN(max);
var isValidMax = (value, max) => isValidNumber(value) && value <= max;
var isValidMin = (value, min) => isValidNumber(value) && value >= min;
var midValue = (min, max) => min + (max - min) / 2;
var props = createProps()([
  "dir",
  "getRootNode",
  "id",
  "ids",
  "max",
  "min",
  "orientation",
  "translations",
  "value",
  "onValueChange",
  "defaultValue",
  "formatOptions",
  "locale"
]);
var splitProps = createSplitProps(props);

export { anatomy, connect, machine, props, splitProps };
