/**
 * TypeScript declarations for Svelte 5 runes and reactive primitives
 */

declare module 'svelte' {
  export interface SvelteReactiveValue<T> {
    (): T;
  }

  // Make $derived values accessible both as values and as functions
  export interface DerivedValue<T> extends SvelteReactiveValue<T> {
    value: T;
  }

  // Allow $state and $derived values to be treated as their underlying types
  type UnwrapReactive<T> = T extends SvelteReactiveValue<infer U> ? U : T;

  // Enhance the type system to understand Svelte 5's runes
  global {
    // Define the $state type
    var $state: <T>(initialValue: T) => T;
    
    // Define the $derived type
    var $derived: {
      <T>(expression: T | (() => T)): T;
      by<T>(fn: () => T): T;
    };
    
    // Define the $effect type
    var $effect: (callback: () => void) => void;
    
    // Define the $props type
    var $props: <T>() => T;
    
    // Define the $inspect type
    var $inspect: <T>(value: T) => void;
  }
}