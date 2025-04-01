# Project Context: AI Strategy Analyzer

## 1. Project Overview

- **Goal:** SvelteKit application for AI-powered analysis of brand strategies.
- **Core Tech Stack:**
  - SvelteKit 2 & Svelte 5 (Runes: $state, $derived, $effect, SvelteMap)
  - TypeScript (Strong Typing)
  - Tailwind CSS & Skeleton UI
  - IndexedDB (via `idb` library) for client-side persistence
  - Service Workers for PWA & Offline Capabilities
  - OpenAI API (Chat Completions & Responses API features invoked via tools like `web_search_preview`)
  - Node.js backend for API routes
  - Potentially Supabase/Vector DB (mentioned in diagrams/future plans)

## 2. Current Status & Focus (Late March 2024)

### Current Status:

- Core chat functionality implemented with Svelte 5 runes and UI/logic separation.
- IndexedDB integrated for client-side chat persistence.
- OpenAI API integration supports standard Chat Completions and features like web search (via `web_search_preview` tool), including streaming for Chat Completions.
- Versioned API structure (`/api/v1`) established with standardized error handling.
- PWA features implemented: Service worker caching, offline fallback page, manifest file, persistent storage requests.
- Refactoring completed for Svelte 5 module script export patterns (using accessor functions).
- Reactivity optimization implemented to address potential infinite update loops.
- New chat creation flow loads predefined questions/prompts from JSON and is handled client-side.
- Unused code removed (old `/api/sample-chats`, unused server-side `sendMessage` action).
- Store logic (`ChatsStore.svelte.ts`) relocated to `src/lib/stores/`.

### Current Focus:

- **Verify Core Paths:**
  - IndexedDB saving/loading mechanism for chat messages.
  - OpenAI API call path, especially ensuring `web_search_preview` tool is effective.
- **Refine Initial AI Turn:** Ensure the _prompts_ (not just question text) from `category_question_prompts.json` are used for the initial AI interaction in new chats.
- **Function Tool Implementation:** Decide whether to implement the full execution loop for function tools requested by the AI.
- **PWA Review:** Ensure PWA implementation (caching, offline, persistence) is optimal.

### Next Steps (Longer Term):

- **Enhanced Offline Experience:** Offline action queue, sync, cache management UI.
- **Chat Feature Enhancements:** Advanced features, UI refinements, export/import.
- **Testing:** Comprehensive tests (logic, UI).
- **Vector DB Integration:** Implement embedding generation and storage.
- **Authentication/Authorization.**
- **Background Sync/Push Notifications.**

## 3. Key Architectural Decisions & Patterns

- **Component Architecture:** Separation of UI (`.svelte`) and logic (`.svelte.ts`) files.
- **State Management:**
  - Svelte 5 runes (`$state`, `$derived`, `$effect`) for component-level reactivity.
  - Centralized store logic in `src/lib/stores/ChatsStore.svelte.ts` using runes, potentially with `SvelteMap` for collections.
  - `src/routes/chats/(components)/ChatStore.svelte` acts as a facade and reactivity linker component.
  - Accessor function pattern for exporting reactive state from modules.
  - State synchronization (`$effect`) between local component state and stores where needed.
  - Careful handling of object references to prevent reactivity issues (cloning objects).
- **API Architecture:**
  - Versioned endpoints (`/api/v1/...`).
  - Standardized error handling using SvelteKit's `error` and `json` helpers.
  - Server-side handlers (`/api/v1/openai/+server.ts`) for OpenAI calls, passing client options (model, temp, tools, stream).
  - SSE (Server-Sent Events) implemented for streaming Chat Completions responses.
- **Persistence:** IndexedDB via `idb` library, managed through `ChatService` and `ChatsStore`.
- **Offline/PWA:**
  - Service Worker (`src/service-worker.ts`) with network-first (API) and cache-first (assets) strategies.
  - Offline fallback page.
  - Requesting persistent storage permission (`StorageManager.ts`).
  - Online/offline status detection and UI indicators.
- **OpenAI Integration:**
  - `openai.ts` service layer abstracts client-side calls to the backend API.
  - Backend proxies requests to OpenAI Chat Completions endpoint.
  - Tool usage (e.g., `web_search_preview`, function calls) is requested by passing `tools` array to the backend, which passes it to OpenAI.
  - Client (`ChatLogic.svelte.ts`) detects keywords to request `web_search_preview`.
  - Client handles standard and streaming responses, including detecting `tool_calls` in the response (currently shows placeholder text).
  - **Function Tool Execution Loop is NOT implemented.**
- **Error Handling:**
  - Dedicated `errorHandler.ts` module.
  - Retry logic (exponential backoff).
  - Structured logging.
  - Fallback mechanisms for data persistence.
  - UI displays errors with a retry option.
- **New Chat Creation:** Client-driven flow within `AnalysisCreation.svelte`, which gathers data and calls `chatStore.createChat` directly.

## 4. Recent Progress / Updates Log (Condensed)

- **Mar 30/31:** Refactored store location (`ChatsStore` to `src/lib/stores`). Removed unused code (`/api/sample-chats`, server-side `sendMessage`). Simplified new chat flow (removed server action). Corrected client handling of varied backend responses (incl. tool calls). Addressed related type errors.
- **Mar 26:** PWA Implementation (Service Worker, Persistence, Offline UI, Manifest). OpenAI Streaming fix (SSE Handling).
- **Mar 25:** Storage Architecture (ChatService, Error Handling). API v1 Structure. Svelte 5 Store Enhancements (`SvelteMap`, UI/Logic split). Client API Integration. Svelte 5 Runes Export Fix (Accessor Pattern). Chat AI Integration (Streaming/Standard). Reactivity Optimization (Loop Fixes). OpenAI Responses API Integration (via tools). Refactored New Chat Question Loading.
- **Earlier:** Migration to Svelte 5 Runes, IndexedDB implementation, initial offline capabilities, state management patterns established.

## 5. Historical Context & Diagrams

- Older system context, diagrams, and specific feature plans/notes can be found in the corresponding subdirectories (`diagrams/`, `features/`, `svelte_notes/`, `recommendations/`) or archived files within the `memory-bank`.
