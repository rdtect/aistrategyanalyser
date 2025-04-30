# Project Context: AI Strategy Analyzer

## 1. Project Overview

- **Goal:** SvelteKit application for AI-powered analysis of brand strategies.
- **Core Tech Stack:**
  - SvelteKit 2 & Svelte 5 (Runes)
  - TypeScript (Strong Typing)
  - Tailwind CSS & Skeleton UI
  - IndexedDB (via **Dexie.js**) for client-side persistence (`$lib/services/IDBService.ts`)
  - Browser Storage Manager API (`$lib/services/StorageManagerService.ts`)
  - Service Workers for PWA & Offline Capabilities
  - OpenAI API (via backend proxy `/api/v1/openai` accessed through `$lib/services/OpenAIService.ts`)
  - Node.js backend for API routes

## 2. Current Status & Focus (Early April 2024)

### Current Status:

- Extensive refactoring completed (Memory Bank, $lib structure, service classes, Dexie migration, code colocation).
- Core chat functionality implemented with Svelte 5 runes.
- IndexedDB integrated via **Dexie.js** for client-side chat persistence.
- OpenAI API integration via backend proxy supports standard and streaming responses.
- Versioned API structure (`/api/v1`) established.
- PWA features implemented (Service worker, offline fallback, manifest, persistence requests).
- **Chat-specific logic** (components, state, services, utils, data) **colocated** within `src/routes/chats/(lib)/`.
- **Shared logic** (services, utils, types) reside in `src/lib/`.
- Services refactored into classes with singleton exports (`IDBService`, `OpenAIService`, `StorageManagerService`).

### Current Focus:

- **Resolve Linter Errors:** Address persistent import/type errors after refactoring.
- **Verify Core Paths:** Ensure functionality after significant refactoring (IDB, OpenAI calls).
- **Refine Streaming UI:** Implement efficient UI updates using `processStream` from `OpenAIService`.
- **Simplify `IDBService`:** Review and potentially simplify fallback/retry logic.

### Next Steps (Longer Term):

- **Refactor Backend API:** Ensure consistent responses from `/api/v1/openai`.
- **Enhanced Offline Experience:** Action queue, sync, UI.
- **Chat Feature Enhancements:** UI refinements, export/import.
- **Testing:** Comprehensive tests.
- **Vector DB / Supabase Integration:** (If needed).
- **Authentication/Authorization.**

## 3. Key Architectural Decisions & Patterns

- **Code Organization:**
  - **Shared Core (`$lib/`)**: Contains genuinely reusable code (services, utils, types, server-only modules).
  - **Feature Colocation (`src/routes/.../(lib)/`)**: Feature-specific logic (components, state, services, utils, data) resides within the feature's route directory, typically in a private `(lib)/` sub-folder.
- **Component Architecture:** Separation of UI (`.svelte`) and logic (`.svelte.ts`) where appropriate.
- **State Management:**
  - Svelte 5 runes (`$state`, `$derived`, `$effect`) for component/local state.
  - **Colocated State:** Feature-specific state logic resides with the feature (e.g., `src/routes/chats/(lib)/ChatState.svelte.ts`).
  - Shared global state (e.g., config) can reside in `$lib/stores/` (though currently colocated in `src/routes/settings/config.svelte.ts`).
  - Accessor function pattern for exporting reactive state from modules.
- **API Architecture:**
  - Versioned endpoints (`/api/v1/...`).
  - Standardized error handling using `withErrorHandling` wrapper from `$lib/utils/errorHandler.ts`.
  - Client interacts via singleton service classes in `$lib/services/` (e.g., `openAIService`).
  - Server-side handlers (`/api/v1/openai/+server.ts`) proxy requests to external APIs.
  - SSE implemented for streaming.
- **Persistence:**
  - **IndexedDB:** Managed via **Dexie.js** through `$lib/services/IDBService.ts`.
  - **Persistent Storage:** Requested via `$lib/services/StorageManagerService.ts`.
  - **Chat Service:** Chat-specific CRUD logic in `src/routes/chats/(lib)/ChatService.ts`.
- **Offline/PWA:**
  - Service Worker (`src/service-worker.ts`).
  - Offline fallback page.
  - Storage persistence requests.
- **OpenAI Integration:**
  - Client calls `$lib/services/OpenAIService.ts`.
  - Backend route (`/api/v1/openai/+server.ts`) handles actual API call.
  - Streaming handled via `generateStreamingAIResponse().processStream`.
- **Error Handling:**
  - Centralized logic in `$lib/utils/errorHandler.ts` (`logError`, `withRetry`).
  - SvelteKit boundaries (`+error.svelte`) for displaying page errors.

## 4. Recent Progress / Updates Log (Condensed)

- **Apr 2:** Refactored `$lib` structure (shared vs. colocated), refactored services to classes, migrated IDB to Dexie.js, simplified Memory Bank.
- **Mar 30/31:** Refactored store location. Removed unused code. Simplified new chat flow. Corrected client handling of varied backend responses.
- **Mar 26:** PWA Implementation. OpenAI Streaming fix.
- **Mar 25:** Storage Architecture. API v1 Structure. Svelte 5 Store Enhancements. Client API Integration. Svelte 5 Runes Export Fix. Chat AI Integration. Reactivity Optimization. OpenAI Responses API Integration. Refactored New Chat Question Loading.
- **Earlier:** Migration to Svelte 5 Runes, initial IDB implementation, initial offline capabilities.

## 5. Historical Context & Diagrams

- Older context/diagrams removed during Memory Bank optimization.

---

# Consolidated Recommendations

## State Management Recommendations

### Svelte 5 Runes Best Practices

1.  **Immutable State Updates**

    ```typescript
    // ❌ Don't mutate state directly
    chats.splice(index, 1);
    chats[index] = newValue;

    // ✅ Create new arrays/objects for state updates
    chats = chats.filter((_, i) => i !== index);
    chats = [...chats.slice(0, index), newValue, ...chats.slice(index + 1)];
    ```

2.  **Batch Related State Updates**

    ```typescript
    // ❌ Multiple separate updates
    chats = newChats;
    activeChatId = newId;
    isLoading = false;

    // ✅ Single function for related updates
    function updateChatState(newChats, newId) {
      chats = newChats;
      activeChatId = newId;
      isLoading = false;
    }
    ```

3.  **Derived State**

    ```typescript
    // ❌ Manual derivation in render
    {#each Object.values(chats).sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) as chat}

    // ✅ Use $derived for automatic updates
    const sortedChats = $derived(
      Object.values(chats).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    );
    ```

4.  **State Initialization**

    ```typescript
    // ❌ Mutable initialization
    let chats = $state({});
    Object.assign(chats, initialChats);

    // ✅ Immutable initialization
    let chats = $state(initialChats || {});
    ```

5.  **Array Operations**

    ```typescript
    // ❌ Array mutations
    messages.push(newMessage);
    messages.splice(index, 1);
    messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // ✅ Immutable array operations
    messages = [...messages, newMessage];
    messages = messages.filter((_, i) => i !== index);
    messages = [...messages].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );
    ```

6.  **Object Updates**

    ```typescript
    // ❌ Nested mutations
    chats[id].messages.push(newMessage);
    chats[id].updatedAt = new Date().toISOString();

    // ✅ Immutable object updates
    chats = {
      ...chats,
      [id]: {
        ...chats[id],
        messages: [...chats[id].messages, newMessage],
        updatedAt: new Date().toISOString(),
      },
    };
    ```

7.  **State Access in Effects**

    ```typescript
    // ❌ Complex logic in effects
    $effect(() => {
      if (activeChatId && chats[activeChatId]) {
        localStorage.setItem("activeChat", activeChatId);
        console.log(`Active chat: ${chats[activeChatId].name}`);
      }
    });

    // ✅ Use derived values and focused effects
    const activeChat = $derived(activeChatId ? chats[activeChatId] : null);

    $effect(() => {
      if (activeChatId) {
        localStorage.setItem("activeChat", activeChatId);
      }
    });

    $effect(() => {
      if (activeChat) {
        console.log(`Active chat: ${activeChat.name}`);
      }
    });
    ```

8.  **Props with Defaults**

    ```typescript
    // ❌ Old export let syntax
    export let name = "Default";
    export let count = 0;

    // ✅ New $props syntax with defaults
    let { name = "Default", count = 0 } = $props();
    ```

### Implementation Guidelines

1.  **State Organization**

    - Use module-level `$state` for global state
    - Use component-level `$state` for component-specific state
    - Use `$derived` for computed values
    - Document state shape with TypeScript interfaces

2.  **State Updates**

    - Always create new references for state updates
    - Use immutable update patterns
    - Create helper functions for complex state updates

3.  **Performance Considerations**

    - Use `$derived` to avoid recalculating values
    - Avoid unnecessary object/array creation
    - Split large components into smaller ones with focused state

4.  **Error Handling**

    - Include error state in your state objects
    - Use `try/catch` in async functions
    - Provide user feedback for state update failures

5.  **IndexedDB Integration**

    - Use the `idb` library for IndexedDB access
    - Create a service layer for database operations
    - Sync state with IndexedDB in `$effect` blocks

6.  **Testing**
    - Test state updates with different scenarios
    - Verify derived state calculations
    - Test error handling and edge cases

### Svelte 5 Store Pattern

```typescript
// Module-level state
let count = $state(0);
const doubled = $derived(count * 2);

// Actions
function increment() {
  count += 1;
}

function decrement() {
  count -= 1;
}

// Getters
function getCount() {
  return count;
}

function getDoubled() {
  return doubled;
}

// Export actions and getters
export { increment, decrement, getCount, getDoubled };
```

---

## File Organization Improvements

1.  **Shared vs. Colocated:**
    - Use `$lib/` for genuinely shared code (services, types, general utils, server code).
    - Use `src/routes/feature/(lib)/` for code specific to a feature route (components, feature-specific state/services/utils/data).
2.  **Standardize File Naming Conventions:**
    - Use PascalCase for components (.svelte) and service classes (.ts).
    - Use camelCase for utility files (.ts) and instances (e.g., `openAIService`).
    - Use consistent extensions (.svelte for UI, .svelte.ts for component logic if needed).
3.  **Use Private Route Folders `(lib)`:** Place non-route files (components, stores, etc.) needed only by a specific route section within a `(lib)` folder inside that route directory.

---

## Code Cleanup Recommendations

1.  **Unused Components/Code:** Regularly review and remove.
2.  **Deprecated Implementations:** Remove old approaches (e.g., previous IDB logic, unused Supabase files).
3.  **Temporary Development Files:** Remove debug logs (`console.log` unless necessary), commented code.

---

## Optimization Recommendations (Component Structure)

1.  **Component/Logic Split:** Use `.svelte` for UI and `.svelte.ts` for complex component logic where it improves clarity.
2.  **Route Structure:** Keep routes reasonably flat. Use route parameters for specific items (e.g., `chats/[id]`).
3.  **Streaming UI:** Implement efficient stream processing in UI components using `processStream` from `OpenAIService`.
