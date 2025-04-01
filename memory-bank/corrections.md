# Corrections Log

This document tracks all corrections made to the codebase to avoid repeating the same mistakes.

## 2025-03-26: Feature-Based Code Organization

**Issue:** The codebase directory structure was inconsistent with components, stores, and utilities spread across different directories, hindering maintenance and scalability.

**Fix:**

1. Created a feature-based directory structure with `src/lib/features` for feature-specific code and `src/lib/core` for shared foundational code
2. Reorganized files by moving chat components to `src/lib/features/chat/components` and chat store to `src/lib/features/chat/stores`
3. Created barrel files by adding `index.ts` files for each directory to simplify imports

**Pattern Rule:** Organize code by feature, keeping related components together. Use barrel files for cleaner imports.

## 2025-03-27: Simplified Directory Structure and Consolidated Error Handling

**Issue:** The codebase had too many top-level directories in lib, inconsistent error handling approaches, and duplicated files.

**Fix:**

1. Consolidated all shared functionality into the `core` directory:
   - Moved types, config, data, and services directories into core
   - Organized core into api, config, data, pwa, stores, types, ui, and utils
2. Consolidated error handling:
   - Centralized error handling in `core/utils/errorHandling.ts`
   - Updated route error pages (+error.svelte) to use the core ErrorBoundary component
   - Created a consistent pattern for error handling throughout the app
3. Added detailed README.md documenting the directory structure and usage patterns

**Pattern Rule:** Keep related functionality in a structured hierarchy. Use a common error handling approach throughout the application.

## 2025-03-27: Routes Directory Organization and API Improvements

**Issue:** Routes directory needed better organization and API routes lacked consistent error handling.

**Fix:**

1. Created a comprehensive README.md for the routes directory
2. Moved Navigation component to `core/ui` for reuse
3. Updated API endpoints to use standardized error handling
4. Improved route error pages with the core ErrorBoundary component

**Pattern Rule:** Organize API routes by feature, use consistent error handling, and document route organization patterns.

## 2025-03-28: Strategic Analysis Sample Data and System Prompt

**Issue:** Sample data did not properly reflect strategic analysis patterns and the OpenAI integration lacked a comprehensive system prompt.

**Fix:**

1. Refactored sample chats with strategic analysis content for each of the 4Cs:
   - Category (market analysis, trends, growth segments)
   - Consumer (customer insights, behavioral shifts)
   - Competition (competitive landscape, positioning)
   - Company (capabilities, resources, strategy)
2. Updated system prompt to better guide AI responses

**Pattern Rule:** Maintain consistent analysis framework across all sample data and AI interactions.

## 2025-03-29: OpenAI Client Organization

**Issue:** OpenAI client implementation was split between production and mock versions with inconsistent file organization.

**Fix:**

1. Created dedicated `openai` directory in `core/api` for all OpenAI-related code
2. Separated production and mock clients:
   - `client.ts`: Production OpenAI client implementation
   - `mockClient.ts`: Mock client for testing/development
   - `index.ts`: Clean exports for both implementations
3. Updated imports across the codebase to use the new structure

**Pattern Rule:** Group related functionality in dedicated directories with clear separation between production and test code.

## 2025-03-29: Svelte 5 Runes State Management Fix

**Issue:** Chat component had reactivity issues due to incorrect state references in its own scope.

**Fix:**

1. Removed local state references that were breaking reactivity:

   ```typescript
   // Before - Breaking reactivity
   const localChats = chats;
   localChats.splice(0, localChats.length, ...processedChats);

   // After - Maintaining reactivity
   chats = processedChats;
   ```

2. Updated state mutations to work directly with reactive state
3. Removed unnecessary intermediate variables that were causing reactivity loss

**Pattern Rule:** When using Svelte 5 runes:

- Never create local references to reactive state
- Mutate reactive state directly
- Avoid intermediate variables for state mutations

## 2024-03-25: Svelte 5 Derived State Export

### Issue

Attempted to directly export derived state values from a module script, resulting in the error:

```
[plugin:vite-plugin-svelte-module] src/lib/services/ChatsStore.svelte.ts:324:9 Cannot export derived state from a module. To expose the current derived value, export a function returning its value
```

### Cause

Svelte 5 runes have a limitation: you cannot directly export derived state from a module script. This is because module scripts run at compile time, and the reactivity system needs to track dependencies at runtime.

### Solution

1. Instead of directly exporting derived state, we created accessor functions that return the current value:

   ```ts
   // Instead of this:
   // export const chatList = $derived(...);

   // We use this:
   export function getChatList() {
     return chatList;
   }
   ```

2. In the consuming component, we created local state that mirrors the module's state:

   ```ts
   let chatList = $state(storeModule.getChatList());

   $effect(() => {
     chatList = storeModule.getChatList();
   });
   ```

### Prevention

When working with Svelte 5 runes in module scripts:

- Never directly export reactive state values ($state, $derived)
- Always use accessor functions instead
- Update the documentation to clearly note this limitation
- Add this pattern to our code templates and standards

## 2024-03-25: Svelte 5 Effect in Module Scripts

### Issue

Attempted to use `$effect` in a module script, resulting in the error:

```
Svelte error: effect_orphan
`$effect` can only be used inside an effect (e.g. during component initialisation)
```

### Cause

Svelte 5 runes have a limitation: you cannot use `$effect` in module scripts (`<script module>`). Effects can only be used in component scripts (`<script>`) where the component lifecycle is available.

### Solution

1. We converted the store into a hybrid module/component:

   ```svelte
   <!-- ChatStore.svelte -->
   <script module>
     // Export APIs and functions but no reactive state or effects
     export const getValues = store.getValues;
   </script>

   <script>
     // Put effects in the component script
     $effect(() => {
       // Subscribe to store updates
       const value = store.getValues();
       console.debug('Store updated', value);
     });
   </script>
   ```

2. In layouts/pages that need reactive store updates, we include the component:
   ```svelte
   <ChatStoreSync />
   ```

### Prevention

When working with Svelte 5 runes in module scripts:

- Never use `$effect` in module scripts
- For reactivity with stores, create a component wrapper
- Include the component in layouts/pages where reactivity is needed
- Document this pattern in component comments

## 2024-03-25: SvelteKit Error Handling

### Issue

Used direct `Response` objects and custom JSON responses with status codes instead of SvelteKit's built-in error handling utilities:

```typescript
// Incorrect approach
return new Response("Error message", { status: 400 });
// or
return json({ error: "Error message" }, { status: 400 });
```

### Cause

Not following SvelteKit's recommended error handling patterns, which provide better integration with its error boundaries and more consistent error behavior.

### Solution

1. Use SvelteKit's `error` function for error responses:

   ```typescript
   import { error } from "@sveltejs/kit";

   if (!id) {
     throw error(400, "Missing required ID parameter");
   }
   ```

2. Only use the `json` function for successful responses or cases where custom error data must be returned but the status code isn't an error:

   ```typescript
   return json({
     success: true,
     data: result,
   });
   ```

3. For custom error data, pass it as the second parameter to the error function:
   ```typescript
   throw error(400, {
     message: "Validation failed",
     fields: ["name", "email"],
   });
   ```

### Prevention

- Always use the `error` function for error responses
- Review API endpoints for manual Response creation or status code setting
- Create error boundaries at appropriate levels to handle errors gracefully
- Use withErrorHandling utility for consistent error handling across API routes

## 2024-03-25: Svelte 5 Effect Update Depth Exceeded

### Issue

Encountered "Maximum update depth exceeded" errors in our chat implementation due to infinite loops in reactive effects:

```
Uncaught Svelte error: effect_update_depth_exceeded
Maximum update depth exceeded. This can happen when a reactive block or effect repeatedly sets a new value.
Svelte limits the number of nested updates to prevent infinite loops
```

### Cause

Several factors contributed to the infinite update loops:

1. **Circular Reactivity**: Effects were updating state that triggered other effects, creating circular dependencies
2. **Direct Mutation**: Directly modifying reactive arrays instead of replacing them with new references
3. **Reference Issues**: Using object references that maintained reactivity connections
4. **Missing Guards**: Missing conditional checks that would prevent unnecessary updates

### Solution

1. **Track Identity**: Keep track of identity values to prevent redundant updates

   ```typescript
   let lastActiveChatId = $state<string | null>(null);

   $effect(() => {
     // Only update if the ID changed
     if (lastActiveChatId !== activeChat.id) {
       lastActiveChatId = activeChat.id;
       // Perform updates...
     }
   });
   ```

2. **Clone Objects**: Create new object references when updating state

   ```typescript
   // Instead of:
   messages.push(someObject);

   // Use:
   messages.push({ ...someObject });
   ```

3. **Limit Effect Frequency**: Use timeouts to batch updates

   ```typescript
   let timeoutId = null;
   $effect(() => {
     if (timeoutId) clearTimeout(timeoutId);
     timeoutId = setTimeout(() => {
       // Update logic here
     }, 100);
   });
   ```

4. **Use Status Flags**: Prevent effects from running during specific operations

   ```typescript
   let isInitializing = $state(false);

   $effect(() => {
     if (isInitializing) return;
     // Effect logic
   });
   ```

### Prevention

When working with Svelte 5 effects:

- Avoid direct mutation of reactive state that other effects might read
- Guard effects with conditional checks to prevent unnecessary executions
- Track identities of objects to avoid redundant update cycles
- Use timeouts to batch updates that may trigger multiple effects
- Create new object references when updating arrays or objects
- Always include cleanup logic for timeouts and subscriptions


## 2025-03-28: SvelteKit App.Error Type Usage

### Issue

The `ErrorBoundary.svelte` component attempted to import `App.Error` directly from `@sveltejs/kit` or `$app/kit`, causing a TypeScript error because `App.Error` is a globally defined type ambiently declared in `src/app.d.ts`. The interface definition in `src/app.d.ts` was also commented out.

### Cause

Incorrect understanding of how SvelteKit ambient types work. Global types defined in `app.d.ts` do not need to be imported. The interface definition itself was also missing.

### Solution

1. Uncommented the `interface Error {}` line within the `declare global { namespace App { ... } }` block in `src/app.d.ts`.
2. Removed the unnecessary `import type { App } from ...` statement from `src/lib/components/ui/errors/ErrorBoundary.svelte`.

### Prevention

- Remember that types defined within `declare global { namespace App { ... } }` in `src/app.d.ts` are globally available and do not require imports.
- Ensure necessary interfaces within `app.d.ts` are uncommented and correctly defined.
- Verify TypeScript errors related to imports and global types carefully.
