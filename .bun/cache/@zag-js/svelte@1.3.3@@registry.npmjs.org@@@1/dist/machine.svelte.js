import { createScope } from "@zag-js/core";
import { compact, ensure, isFunction, isString, toArray, warn } from "@zag-js/utils";
import { flushSync, onDestroy, onMount } from "svelte";
import { bindable } from "./bindable.svelte";
import { useRefs } from "./refs.svelte";
import { track } from "./track.svelte";
function access(userProps) {
    if (isFunction(userProps))
        return userProps();
    return userProps;
}
export function useMachine(machine, userProps) {
    const scope = $derived.by(() => {
        const { id, ids, getRootNode } = access(userProps);
        return createScope({ id, ids, getRootNode });
    });
    const props = $derived(machine.props?.({ props: compact(access(userProps)), scope }) ?? access(userProps));
    const prop = useProp(() => props);
    const context = machine.context?.({
        prop,
        bindable: bindable,
        get scope() {
            return scope;
        },
        flush: flush,
        getContext() {
            return ctx;
        },
        getComputed() {
            return computed;
        },
    });
    const ctx = {
        get(key) {
            return context?.[key].get();
        },
        set(key, value) {
            context?.[key].set(value);
        },
        initial(key) {
            return context?.[key].initial;
        },
        hash(key) {
            const current = context?.[key].get();
            return context?.[key].hash(current);
        },
    };
    let effects = new Map();
    let transitionRef = { current: null };
    let previousEventRef = { current: null };
    let eventRef = { current: { type: "" } };
    const getEvent = () => ({
        ...eventRef.current,
        current() {
            return eventRef.current;
        },
        previous() {
            return previousEventRef.current;
        },
    });
    const getState = () => ({
        ...state,
        hasTag(tag) {
            const currentState = state.get();
            return !!machine.states[currentState]?.tags?.includes(tag);
        },
        matches(...values) {
            const currentState = state.get();
            return values.includes(currentState);
        },
    });
    const refs = useRefs(machine.refs?.({ prop, context: ctx }) ?? {});
    const getParams = () => ({
        state: getState(),
        context: ctx,
        event: getEvent(),
        prop,
        send,
        action,
        guard,
        track,
        refs,
        computed,
        flush,
        scope,
        choose,
    });
    const action = (keys) => {
        const strs = isFunction(keys) ? keys(getParams()) : keys;
        if (!strs)
            return;
        const fns = strs.map((s) => {
            const fn = machine.implementations?.actions?.[s];
            if (!fn)
                warn(`[zag-js] No implementation found for action "${JSON.stringify(s)}"`);
            return fn;
        });
        for (const fn of fns) {
            fn?.(getParams());
        }
    };
    const guard = (str) => {
        if (isFunction(str))
            return str(getParams());
        return machine.implementations?.guards?.[str](getParams());
    };
    const effect = (keys) => {
        const strs = isFunction(keys) ? keys(getParams()) : keys;
        if (!strs)
            return;
        const fns = strs.map((s) => {
            const fn = machine.implementations?.effects?.[s];
            if (!fn)
                warn(`[zag-js] No implementation found for effect "${JSON.stringify(s)}"`);
            return fn;
        });
        const cleanups = [];
        for (const fn of fns) {
            const cleanup = fn?.(getParams());
            if (cleanup)
                cleanups.push(cleanup);
        }
        return () => cleanups.forEach((fn) => fn?.());
    };
    const choose = (transitions) => {
        return toArray(transitions).find((t) => {
            let result = !t.guard;
            if (isString(t.guard))
                result = !!guard(t.guard);
            else if (isFunction(t.guard))
                result = t.guard(getParams());
            return result;
        });
    };
    const computed = (key) => {
        ensure(machine.computed, `[zag-js] No computed object found on machine`);
        const fn = machine.computed[key];
        return fn({
            context: ctx,
            event: getEvent(),
            prop,
            refs,
            scope,
            computed: computed,
        });
    };
    const state = bindable(() => ({
        defaultValue: machine.initialState({ prop }),
        onChange(nextState, prevState) {
            // compute effects: exit -> transition -> enter
            // exit effects
            if (prevState) {
                const exitEffects = effects.get(prevState);
                exitEffects?.();
                effects.delete(prevState);
            }
            // exit actions
            if (prevState) {
                action(machine.states[prevState]?.exit);
            }
            // transition actions
            action(transitionRef.current?.actions);
            // enter effect
            const cleanup = effect(machine.states[nextState]?.effects);
            if (cleanup)
                effects.set(nextState, cleanup);
            // root entry actions
            if (prevState === "__init__") {
                action(machine.entry);
                const cleanup = effect(machine.effects);
                if (cleanup)
                    effects.set("__init__", cleanup);
            }
            // enter actions
            action(machine.states[nextState]?.entry);
        },
    }));
    onMount(() => {
        state.invoke(state.initial, "__init__");
    });
    onDestroy(() => {
        effects.forEach((fn) => fn?.());
        effects = new Map();
        // root exit actions
        action(machine.exit ?? []);
    });
    const send = (event) => {
        previousEventRef.current = eventRef.current;
        eventRef.current = event;
        let currentState = state.get();
        // @ts-ignore
        const transitions = machine.states[currentState].on?.[event.type] ?? machine.on?.[event.type];
        const transition = choose(transitions);
        if (!transition)
            return;
        // save current transition
        transitionRef.current = transition;
        const target = transition.target ?? currentState;
        const changed = target !== currentState;
        if (changed) {
            // state change is high priority
            state.set(target);
        }
        else if (transition.reenter && !changed) {
            // reenter will re-invoke the current state
            state.invoke(currentState, currentState);
        }
        else {
            // call transition actions
            action(transition.actions ?? []);
        }
    };
    machine.watch?.(getParams());
    return {
        state: getState(),
        send,
        context: ctx,
        prop,
        scope,
        refs,
        computed,
        event: getEvent(),
    };
}
function useProp(value) {
    return function get(key) {
        return value()[key];
    };
}
function flush(fn) {
    flushSync(() => fn());
}
