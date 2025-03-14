import {} from "@zag-js/core";
import { identity, isFunction } from "@zag-js/utils";
import { flushSync } from "svelte";
export function bindable(props) {
    const initial = props().defaultValue ?? props().value;
    const eq = props().isEqual ?? Object.is;
    let value = $state(initial);
    const controlled = $derived(props().value !== undefined);
    let valueRef = { current: value };
    let prevValue = { current: undefined };
    $effect.pre(() => {
        const v = controlled ? props().value : value;
        valueRef = { current: v };
        prevValue = { current: v };
    });
    const setValueFn = (v) => {
        const next = isFunction(v) ? v(valueRef.current) : v;
        const prev = prevValue.current;
        if (props().debug) {
            console.log(`[bindable > ${props().debug}] setValue`, { next, prev });
        }
        if (!controlled)
            value = next;
        if (!eq(next, prev)) {
            props().onChange?.(next, prev);
        }
    };
    function get() {
        return (controlled ? props().value : value);
    }
    return {
        initial,
        ref: valueRef,
        get,
        set(val) {
            const exec = props().sync ? flushSync : identity;
            exec(() => setValueFn(val));
        },
        invoke(nextValue, prevValue) {
            props().onChange?.(nextValue, prevValue);
        },
        hash(value) {
            return props().hash?.(value) ?? String(value);
        },
    };
}
