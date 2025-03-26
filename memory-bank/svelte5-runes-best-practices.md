# Svelte 5 Runes Best Practices

## Overview

This document captures our lessons learned and best practices for working with Svelte 5's runes API. Runes are a set of special functions (prefixed with `$`) that handle reactivity in Svelte 5.

## Key Runes

- **$state**: Declares reactive state
- **$derived**: Creates derived values based on other reactive state
- **$effect**: Runs side effects when reactive dependencies change
- **$props**: Declares component props
- **$inspect**: Debugging tool for reactive state

## Module Scripts vs. Component Scripts

### Module Scripts

Module scripts (`<script module>`) have important limitations:

- Run at compile time
- Cannot directly use runes like `$effect` or `$inspect`
- Cannot directly export reactive state

**✅ DO** in module scripts:

```typescript
// Create reactive state
let count = $state(0);
const doubled = $derived(count * 2);

// Export accessor functions
export function getCount() {
  return count;
}
export function getDoubled() {
  return doubled;
}

// Export actions
export function increment() {
  count++;
}
```

**❌ DON'T** in module scripts:

```typescript
// Don't use effect in module scripts
$effect(() => {
  console.log(count);
});

// Don't directly export reactive state
export const count; // Error!
export const doubled; // Error!
```

### Component Scripts

Component scripts (`<script>`) can use all runes without restrictions:

**✅ DO** in component scripts:

```typescript
// Create reactive state
let count = $state(0);

// Use effects
$effect(() => {
  console.log(count);
});

// Import from modules and mirror state locally
import { getCount, increment } from "./store";
let localCount = $state(getCount());
$effect(() => {
  localCount = getCount();
});
```

## Store Pattern

For shared state across components, follow this pattern:

### 1. Store Module (`.svelte.ts`):

```typescript
// myStore.svelte.ts
// Internal state
let count = $state(0);
const doubled = $derived(count * 2);

// Actions
export function increment() {
  count++;
}
export function decrement() {
  count--;
}

// Accessors (not direct exports)
export function getCount() {
  return count;
}
export function getDoubled() {
  return doubled;
}
```

### 2. Store Interface (Hybrid Module/Component):

```typescript
// MyStore.svelte
<script module>
  import * as storeModule from './myStore.svelte.ts';

  // Re-export accessor functions (NOT reactive state)
  export const getCount = storeModule.getCount;
  export const getDoubled = storeModule.getDoubled;

  // Re-export actions
  export function increment() { return storeModule.increment(); }
  export function decrement() { return storeModule.decrement(); }

  // Create a singleton instance with getters
  export const store = {
    increment,
    decrement,
    get count() { return getCount(); },
    get doubled() { return getDoubled(); }
  };
</script>

<script>
  // This component script handles reactive effects
  // Effects must be in component scripts, not module scripts
  $effect(() => {
    // Access state to create reactivity subscriptions
    const count = storeModule.getCount();
    const doubled = storeModule.getDoubled();
    console.debug('Store updated', { count, doubled });
  });
</script>

<!-- No markup needed -->
```

### 3. Consumer Component:

```typescript
<script>
  import { store } from './MyStore.svelte';
  import StoreSync from './MyStore.svelte';
</script>

<!-- Include the component to enable reactivity -->
<StoreSync />

<p>Count: {store.count}</p>
<button onclick={store.increment}>Increment</button>
```

## Common Pitfalls

### 1. Reactive Objects and Arrays

Always create new references when modifying objects or arrays:

```typescript
// ❌ DON'T (mutation)
users.push(newUser);
user.name = "New Name";

// ✅ DO (new references)
users = [...users, newUser];
user = { ...user, name: "New Name" };
```

### 2. Derived Values Should Be Pure

Derived values should compute without side effects:

```typescript
// ❌ DON'T
const total = $derived(() => {
  console.log("Calculating total"); // Side effect!
  return items.reduce((sum, item) => sum + item.price, 0);
});

// ✅ DO
const total = $derived(items.reduce((sum, item) => sum + item.price, 0));

// Side effects belong in $effect
$effect(() => {
  console.log("Total changed:", total);
});
```

### 3. Properly Handle Side Effects

Use `$effect` for side effects, and make dependencies explicit:

```typescript
// ❌ DON'T
$effect(() => {
  // Implicit dependencies
  if (user.isLoggedIn) {
    fetchDashboardData();
  }
});

// ✅ DO
$effect(() => {
  // Clear dependencies
  const isLoggedIn = user.isLoggedIn;
  if (isLoggedIn) {
    fetchDashboardData();
  }
});
```

### 4. Preventing Infinite Update Loops

Svelte 5 has a limit on the number of nested updates to prevent infinite loops. If you exceed this limit, you'll see the "effect_update_depth_exceeded" error. To prevent this:

```typescript
// ❌ DON'T create circular dependencies
$effect(() => {
  // This reads state
  const items = storeItems;
  // And also updates state that might trigger effects
  filteredItems = items.filter((i) => i.active);
});

// ✅ DO use identity tracking to prevent circular dependencies
let lastItemsId = $state(null);
$effect(() => {
  // Only update if items have changed identity
  if (storeItemsId !== lastItemsId) {
    lastItemsId = storeItemsId;
    filteredItems = storeItems.filter((i) => i.active);
  }
});
```

Other best practices to prevent effect loops:

1. **Clone objects when updating state**:

   ```typescript
   // Instead of direct mutation
   messages.push(message);

   // Create a new reference to break reactivity chains
   messages.push({ ...message });
   ```

2. **Use flags to prevent redundant updates**:

   ```typescript
   let isUpdating = $state(false);

   async function updateState() {
     if (isUpdating) return;

     isUpdating = true;
     try {
       // State updates here
     } finally {
       isUpdating = false;
     }
   }
   ```

3. **Debounce effects with timeouts**:

   ```typescript
   let timeoutId = null;
   $effect(() => {
     if (timeoutId) clearTimeout(timeoutId);

     timeoutId = setTimeout(() => {
       // Update logic here
       timeoutId = null;
     }, 100);
   });
   ```

4. **Avoid multiple sources of truth**:

   ```typescript
   // ❌ DON'T duplicate state
   const serverItems = $state([]);
   const clientItems = $state([...serverItems]);

   // ✅ DO derive state when needed
   const serverItems = $state([]);
   const clientItems = $derived(
     serverItems.map((item) => ({ ...item, isSelected: false })),
   );
   ```

## Performance Considerations

1. **Granular State**: Split large state objects for more focused reactivity
2. **Selective Subscription**: Use accessors to avoid subscribing to entire stores
3. **Avoid Reactive Constants**: Don't use `$state` for values that never change

## Testing

When testing components with runes:

1. Use `@testing-library/svelte` for component testing
2. Test store actions and derived values separately from UI
3. Mock reactive dependencies to isolate components

## Migration from Svelte 4

When migrating from Svelte 4:

- Replace reactive `$:` statements with `$derived`
- Replace lifecycle functions with `$effect`
- Replace `export let` with `$props()`
- Consider SvelteKit's universal load functions for data loading

## SvelteKit Integration

- Use `$props()` with type safety for component props
- Leverage universal load functions where possible
- Export actions from server modules for form handling

## Advanced Patterns

### Implementing Streaming Responses

When working with streaming APIs like OpenAI, follow these best practices:

```typescript
// In your component logic
export function createStreamingComponent() {
  // State for accumulated content
  let content = $state("");
  let isStreaming = $state(false);

  async function startStream() {
    isStreaming = true;

    try {
      // Use a local variable to accumulate content
      let currentContent = "";

      // Get the stream
      const { processStream } = await getStreamingResponse();

      // Process each chunk
      await processStream((chunk) => {
        // Extract content from the chunk
        const newContent = extractContentFromChunk(chunk);

        // Update local var first
        currentContent += newContent;

        // Then update reactive state with single assignment
        content = currentContent;
      });
    } finally {
      isStreaming = false;
    }
  }

  return { content, isStreaming, startStream };
}
```

Best practices for streaming:

1. **Use local variables**: Accumulate content in non-reactive local variables
2. **Batch state updates**: Update reactive state with complete values, not incremental changes
3. **Extract content properly**: Use utilities to extract content from stream formats
4. **Handle cleanup**: Ensure proper stream cleanup in finally blocks
5. **Manage state transitions**: Set isStreaming flags at the right times
6. **Break object references**: Use object spread to create new references
