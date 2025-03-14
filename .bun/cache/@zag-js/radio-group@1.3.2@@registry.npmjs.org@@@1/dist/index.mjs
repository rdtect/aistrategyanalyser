import { createAnatomy } from '@zag-js/anatomy';
import { dispatchInputCheckedEvent, nextTick, trackFormControl, queryAll, dataAttr, visuallyHiddenStyle, isSafari } from '@zag-js/dom-query';
import { trackFocusVisible, isFocusVisible } from '@zag-js/focus-visible';
import { createGuards, createMachine } from '@zag-js/core';
import { trackElementRect } from '@zag-js/element-rect';
import { isString, createSplitProps } from '@zag-js/utils';
import { createProps } from '@zag-js/types';

// src/radio-group.anatomy.ts
var anatomy = createAnatomy("radio-group").parts(
  "root",
  "label",
  "item",
  "itemText",
  "itemControl",
  "indicator"
);
var parts = anatomy.build();
var getRootId = (ctx) => ctx.ids?.root ?? `radio-group:${ctx.id}`;
var getLabelId = (ctx) => ctx.ids?.label ?? `radio-group:${ctx.id}:label`;
var getItemId = (ctx, value) => ctx.ids?.item?.(value) ?? `radio-group:${ctx.id}:radio:${value}`;
var getItemHiddenInputId = (ctx, value) => ctx.ids?.itemHiddenInput?.(value) ?? `radio-group:${ctx.id}:radio:input:${value}`;
var getItemControlId = (ctx, value) => ctx.ids?.itemControl?.(value) ?? `radio-group:${ctx.id}:radio:control:${value}`;
var getItemLabelId = (ctx, value) => ctx.ids?.itemLabel?.(value) ?? `radio-group:${ctx.id}:radio:label:${value}`;
var getIndicatorId = (ctx) => ctx.ids?.indicator ?? `radio-group:${ctx.id}:indicator`;
var getRootEl = (ctx) => ctx.getById(getRootId(ctx));
var getItemHiddenInputEl = (ctx, value) => ctx.getById(getItemHiddenInputId(ctx, value));
var getIndicatorEl = (ctx) => ctx.getById(getIndicatorId(ctx));
var getFirstEnabledInputEl = (ctx) => getRootEl(ctx)?.querySelector("input:not(:disabled)");
var getFirstEnabledAndCheckedInputEl = (ctx) => getRootEl(ctx)?.querySelector("input:not(:disabled):checked");
var getInputEls = (ctx) => {
  const ownerId = CSS.escape(getRootId(ctx));
  const selector = `input[type=radio][data-ownedby='${ownerId}']:not([disabled])`;
  return queryAll(getRootEl(ctx), selector);
};
var getRadioEl = (ctx, value) => {
  if (!value) return;
  return ctx.getById(getItemId(ctx, value));
};
var getOffsetRect = (el) => ({
  left: el?.offsetLeft ?? 0,
  top: el?.offsetTop ?? 0,
  width: el?.offsetWidth ?? 0,
  height: el?.offsetHeight ?? 0
});
var resolveRect = (rect) => ({
  width: `${rect.width}px`,
  height: `${rect.height}px`,
  left: `${rect.left}px`,
  top: `${rect.top}px`
});

// src/radio-group.connect.ts
function connect(service, normalize) {
  const { context, send, computed, prop, scope } = service;
  const groupDisabled = computed("isDisabled");
  const readOnly = prop("readOnly");
  function getItemState(props2) {
    return {
      invalid: !!props2.invalid,
      disabled: !!props2.disabled || groupDisabled,
      checked: context.get("value") === props2.value,
      focused: context.get("focusedValue") === props2.value,
      hovered: context.get("hoveredValue") === props2.value,
      active: context.get("activeValue") === props2.value
    };
  }
  function getItemDataAttrs(props2) {
    const radioState = getItemState(props2);
    return {
      "data-focus": dataAttr(radioState.focused),
      "data-focus-visible": dataAttr(radioState.focused && context.get("focusVisible")),
      "data-disabled": dataAttr(radioState.disabled),
      "data-readonly": dataAttr(readOnly),
      "data-state": radioState.checked ? "checked" : "unchecked",
      "data-hover": dataAttr(radioState.hovered),
      "data-invalid": dataAttr(radioState.invalid),
      "data-orientation": prop("orientation"),
      "data-ssr": dataAttr(context.get("ssr"))
    };
  }
  const focus = () => {
    const firstEnabledAndCheckedInput = getFirstEnabledAndCheckedInputEl(scope);
    if (firstEnabledAndCheckedInput) {
      firstEnabledAndCheckedInput.focus();
      return;
    }
    const firstEnabledInput = getFirstEnabledInputEl(scope);
    firstEnabledInput?.focus();
  };
  return {
    focus,
    value: context.get("value"),
    setValue(value) {
      send({ type: "SET_VALUE", value, isTrusted: false });
    },
    clearValue() {
      send({ type: "SET_VALUE", value: null, isTrusted: false });
    },
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        role: "radiogroup",
        id: getRootId(scope),
        "aria-labelledby": getLabelId(scope),
        "data-orientation": prop("orientation"),
        "data-disabled": dataAttr(groupDisabled),
        "aria-orientation": prop("orientation"),
        dir: prop("dir"),
        style: {
          position: "relative"
        }
      });
    },
    getLabelProps() {
      return normalize.element({
        ...parts.label.attrs,
        dir: prop("dir"),
        "data-orientation": prop("orientation"),
        "data-disabled": dataAttr(groupDisabled),
        id: getLabelId(scope),
        onClick: focus
      });
    },
    getItemState,
    getItemProps(props2) {
      const itemState = getItemState(props2);
      return normalize.label({
        ...parts.item.attrs,
        dir: prop("dir"),
        id: getItemId(scope, props2.value),
        htmlFor: getItemHiddenInputId(scope, props2.value),
        ...getItemDataAttrs(props2),
        onPointerMove() {
          if (itemState.disabled) return;
          if (itemState.hovered) return;
          send({ type: "SET_HOVERED", value: props2.value, hovered: true });
        },
        onPointerLeave() {
          if (itemState.disabled) return;
          send({ type: "SET_HOVERED", value: null });
        },
        onPointerDown(event) {
          if (itemState.disabled) return;
          if (itemState.focused && event.pointerType === "mouse") {
            event.preventDefault();
          }
          send({ type: "SET_ACTIVE", value: props2.value, active: true });
        },
        onPointerUp() {
          if (itemState.disabled) return;
          send({ type: "SET_ACTIVE", value: null });
        },
        onClick() {
          if (!itemState.disabled && isSafari()) {
            getItemHiddenInputEl(scope, props2.value)?.focus();
          }
        }
      });
    },
    getItemTextProps(props2) {
      return normalize.element({
        ...parts.itemText.attrs,
        dir: prop("dir"),
        id: getItemLabelId(scope, props2.value),
        ...getItemDataAttrs(props2)
      });
    },
    getItemControlProps(props2) {
      const controlState = getItemState(props2);
      return normalize.element({
        ...parts.itemControl.attrs,
        dir: prop("dir"),
        id: getItemControlId(scope, props2.value),
        "data-active": dataAttr(controlState.active),
        "aria-hidden": true,
        ...getItemDataAttrs(props2)
      });
    },
    getItemHiddenInputProps(props2) {
      const inputState = getItemState(props2);
      return normalize.input({
        "data-ownedby": getRootId(scope),
        id: getItemHiddenInputId(scope, props2.value),
        type: "radio",
        name: prop("name") || prop("id"),
        form: prop("form"),
        value: props2.value,
        onClick(event) {
          if (readOnly) {
            event.preventDefault();
            return;
          }
          if (event.currentTarget.checked) {
            send({ type: "SET_VALUE", value: props2.value, isTrusted: true });
          }
        },
        onBlur() {
          send({ type: "SET_FOCUSED", value: null, focused: false, focusVisible: false });
        },
        onFocus() {
          const focusVisible = isFocusVisible();
          send({ type: "SET_FOCUSED", value: props2.value, focused: true, focusVisible });
        },
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (event.key === " ") {
            send({ type: "SET_ACTIVE", value: props2.value, active: true });
          }
        },
        onKeyUp(event) {
          if (event.defaultPrevented) return;
          if (event.key === " ") {
            send({ type: "SET_ACTIVE", value: null });
          }
        },
        disabled: inputState.disabled,
        defaultChecked: inputState.checked,
        style: visuallyHiddenStyle
      });
    },
    getIndicatorProps() {
      const rect = context.get("indicatorRect");
      return normalize.element({
        id: getIndicatorId(scope),
        ...parts.indicator.attrs,
        dir: prop("dir"),
        hidden: context.get("value") == null,
        "data-disabled": dataAttr(groupDisabled),
        "data-orientation": prop("orientation"),
        style: {
          "--transition-property": "left, top, width, height",
          "--left": rect?.left,
          "--top": rect?.top,
          "--width": rect?.width,
          "--height": rect?.height,
          position: "absolute",
          willChange: "var(--transition-property)",
          transitionProperty: "var(--transition-property)",
          transitionDuration: context.get("canIndicatorTransition") ? "var(--transition-duration, 150ms)" : "0ms",
          transitionTimingFunction: "var(--transition-timing-function)",
          [prop("orientation") === "horizontal" ? "left" : "top"]: prop("orientation") === "horizontal" ? "var(--left)" : "var(--top)"
        }
      });
    }
  };
}
var { not } = createGuards();
var machine = createMachine({
  props({ props: props2 }) {
    return {
      orientation: "vertical",
      ...props2
    };
  },
  initialState() {
    return "idle";
  },
  context({ prop, bindable }) {
    return {
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        value: prop("value"),
        onChange(value) {
          prop("onValueChange")?.({ value });
        }
      })),
      activeValue: bindable(() => ({
        defaultValue: null
      })),
      focusedValue: bindable(() => ({
        defaultValue: null
      })),
      hoveredValue: bindable(() => ({
        defaultValue: null
      })),
      indicatorRect: bindable(() => ({
        defaultValue: {}
      })),
      canIndicatorTransition: bindable(() => ({
        defaultValue: false
      })),
      fieldsetDisabled: bindable(() => ({
        defaultValue: false
      })),
      focusVisible: bindable(() => ({
        defaultValue: false
      })),
      ssr: bindable(() => ({
        defaultValue: true
      }))
    };
  },
  refs() {
    return {
      indicatorCleanup: null
    };
  },
  computed: {
    isDisabled: ({ prop, context }) => !!prop("disabled") || context.get("fieldsetDisabled")
  },
  entry: ["syncIndicatorRect", "syncSsr"],
  exit: ["cleanupObserver"],
  effects: ["trackFormControlState", "trackFocusVisible"],
  watch({ track, action, context }) {
    track([() => context.get("value")], () => {
      action(["setIndicatorTransition", "syncIndicatorRect", "syncInputElements"]);
    });
  },
  on: {
    SET_VALUE: [
      {
        guard: not("isTrusted"),
        actions: ["setValue", "dispatchChangeEvent"]
      },
      {
        actions: ["setValue"]
      }
    ],
    SET_HOVERED: {
      actions: ["setHovered"]
    },
    SET_ACTIVE: {
      actions: ["setActive"]
    },
    SET_FOCUSED: {
      actions: ["setFocused"]
    }
  },
  states: {
    idle: {}
  },
  implementations: {
    guards: {
      isTrusted: ({ event }) => !!event.isTrusted
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
      trackFocusVisible({ scope }) {
        return trackFocusVisible({ root: scope.getRootNode?.() });
      }
    },
    actions: {
      setValue({ context, event }) {
        context.set("value", event.value);
      },
      setHovered({ context, event }) {
        context.set("hoveredValue", event.value);
      },
      setActive({ context, event }) {
        context.set("activeValue", event.value);
      },
      setFocused({ context, event }) {
        context.set("focusedValue", event.value);
        context.set("focusVisible", event.focusVisible);
      },
      syncInputElements({ context, scope }) {
        const inputs = getInputEls(scope);
        inputs.forEach((input) => {
          input.checked = input.value === context.get("value");
        });
      },
      setIndicatorTransition({ context }) {
        context.set("canIndicatorTransition", isString(context.get("value")));
      },
      cleanupObserver({ refs }) {
        refs.get("indicatorCleanup")?.();
      },
      syncSsr({ context }) {
        context.set("ssr", false);
      },
      syncIndicatorRect({ context, scope, refs }) {
        refs.get("indicatorCleanup")?.();
        if (!getIndicatorEl(scope)) return;
        const value = context.get("value");
        const radioEl = getRadioEl(scope, value);
        if (value == null || !radioEl) {
          context.set("indicatorRect", {});
          return;
        }
        const indicatorCleanup = trackElementRect(radioEl, {
          getRect(el) {
            return getOffsetRect(el);
          },
          onChange(rect) {
            context.set("indicatorRect", resolveRect(rect));
            nextTick(() => {
              context.set("canIndicatorTransition", false);
            });
          }
        });
        refs.set("indicatorCleanup", indicatorCleanup);
      },
      dispatchChangeEvent({ context, scope }) {
        const inputEls = getInputEls(scope);
        inputEls.forEach((inputEl) => {
          const checked = inputEl.value === context.get("value");
          if (checked === inputEl.checked) return;
          dispatchInputCheckedEvent(inputEl, { checked });
        });
      }
    }
  }
});
var props = createProps()([
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "id",
  "ids",
  "name",
  "onValueChange",
  "orientation",
  "readOnly",
  "value",
  "defaultValue"
]);
var splitProps = createSplitProps(props);
var itemProps = createProps()(["value", "disabled", "invalid"]);
var splitItemProps = createSplitProps(itemProps);

export { anatomy, connect, itemProps, machine, props, splitItemProps, splitProps };
