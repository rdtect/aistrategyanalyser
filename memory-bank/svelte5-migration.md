# Svelte 5 Migration Guide

## Overview

This project has been migrated to Svelte 5, which introduces a new reactivity model called "runes". This document outlines the key changes and best practices for working with Svelte 5 in this codebase.

## Key Runes

Svelte 5 introduces several new "runes" (special functions prefixed with `$`) that replace the previous reactivity model:

- `$state` - Declares a reactive variable
- `$derived` - Creates a computed value that depends on reactive state
- `$effect` - Runs side effects when reactive dependencies change
- `$props` - Declares component props
- `$inspect` - Debugging tool for reactive state

## Migration Patterns

### From Reactive Statements to Runes

**Before (Svelte 4):**
```svelte
<script>
  let count = 0;
  $: doubled = count * 2;
  
  $: {
    console.log(`Count changed to ${count}`);
  }
</script>
```

**After (Svelte 5):**
```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  $effect(() => {
    console.log(`Count changed to ${count}`);
  });
</script>
```

### From Props to $props

**Before (Svelte 4):**
```svelte
<script>
  export let name;
  export let count = 0;
</script>
```

**After (Svelte 5):**
```svelte
<script>
  let { name, count = 0 } = $props();
</script>
```

### From Stores to State

**Before (Svelte 4):**
```svelte
<script>
  import { writable } from 'svelte/store';
  
  const count = writable(0);
  
  function increment() {
    $count += 1;
  }
</script>

<button on:click={increment}>Count: {$count}</button>
```

**After (Svelte 5):**
```svelte
<script>
  let count = $state(0);
  
  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>Count: {count}</button>
```

## Store Implementation

For global state that needs to be shared across components, we've implemented custom stores using Svelte 5 runes:

```typescript
// Example store implementation
let count = $state(0);
const doubled = $derived(count * 2);

export function increment() {
  count += 1;
}

export function decrement() {
  count -= 1;
}

export function getCount() {
  return count;
}

export function getDoubled() {
  return doubled;
}
```

## Best Practices

1. **Use `$state` for component-local state**
   - Prefer `$state` over regular variables for any value that changes over time

2. **Use `$derived` for computed values**
   - Avoid calculating derived values in render functions
   - Use `$derived` to automatically update when dependencies change

3. **Use `$effect` for side effects**
   - DOM updates, logging, and other side effects should use `$effect`
   - Be careful about dependencies to avoid unnecessary re-runs

4. **Use `$props` for component props**
   - Always use `$props()` to declare component props
   - Provide default values where appropriate

5. **Avoid mixing old and new reactivity models**
   - Don't mix `$: x = y` with `let x = $derived(y)`
   - Stick to the new runes API for consistency

6. **Use TypeScript for better type safety**
   - Runes work well with TypeScript for improved developer experience

## Known Issues

1. **IDE Support**
   - Some IDEs may not fully support Svelte 5 syntax yet
   - Use the latest versions of extensions for best experience

2. **Library Compatibility**
   - Some third-party libraries may not be fully compatible with Svelte 5
   - Check for Svelte 5 compatible versions or alternatives

## Resources

- [Official Svelte 5 Documentation](https://svelte.dev/docs/runes)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/migrating-to-svelte-5)
- [Svelte 5 Tutorial](https://learn.svelte.dev/)