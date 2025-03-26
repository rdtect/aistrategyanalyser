# Svelte 5 Implementation Guide

## Overview

The application has been fully migrated to Svelte 5, utilizing the new runes-based reactivity system. This document outlines the implementation patterns used throughout the codebase.

## Runes Usage

### $state

Used for declaring reactive variables that can be mutated:

```svelte
let count = $state(0);
function increment() {
  count++;
}
```

### $derived

Used for computed values that depend on other reactive variables:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

### $effect

Used for side effects that should run when dependencies change:

```svelte
let count = $state(0);
$effect(() => {
  console.log(`Count changed to ${count}`);
});
```

## Component Structure

Components are now split into UI (.svelte) and logic (.svelte.ts) files:

- **UI Components** (.svelte): Focus on presentation and user interaction
- **Logic Files** (.svelte.ts): Contain business logic and state management

Example:
```
Chat.svelte       # UI component
Chat.svelte.ts    # Business logic
```

## Props and Events

Props are declared using the `defineProps` function:

```svelte
const { messages, isLoading } = defineProps<{
  messages: Message[];
  isLoading: boolean;
}>();
```

Events are emitted using the `createEventDispatcher` function:

```svelte
const dispatch = createEventDispatcher<{
  send: { message: string };
}>();

function handleSend(message: string) {
  dispatch('send', { message });
}
```

## State Management Patterns

### Component-Level State

For state that belongs to a single component:

```svelte
let isOpen = $state(false);
```

### Shared State

For state shared across components:

```svelte
// In a store file
export const chatStore = {
  messages: $state([]),
  addMessage(message) {
    this.messages = [...this.messages, message];
  }
};
```

## Best Practices

1. **Minimize State**: Keep state as local as possible
2. **Single Source of Truth**: Avoid duplicating state
3. **Immutable Updates**: Use immutable patterns for updating arrays and objects
4. **Reactive Declarations**: Use $derived for values that depend on other state
5. **Side Effects**: Use $effect for side effects like localStorage updates or API calls