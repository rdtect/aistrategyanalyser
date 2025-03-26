# Technology Context

## Tech Stack

- **Frontend Framework**: SvelteKit with Svelte 5
- **UI Library**: Skeleton UI (based on Tailwind CSS)
- **Client-side Storage**: IndexedDB (via idb library)
- **API**: OpenAI API for text generation
- **Authentication**: TBD (likely Auth.js)
- **Deployment**: TBD (likely Vercel or similar)

## Key Libraries

| Library                  | Purpose                  | Status                |
| ------------------------ | ------------------------ | --------------------- |
| `@sveltejs/kit`          | Web framework            | Implemented           |
| `svelte`                 | UI framework (v5)        | Implemented           |
| `@skeletonlabs/skeleton` | UI components            | Implemented           |
| `marked`                 | Markdown rendering       | Implemented           |
| `openai`                 | OpenAI API client        | Partially implemented |
| `idb`                    | IndexedDB wrapper        | Implemented           |
| `lucide-svelte`          | Icon system              | Implemented           |
| `uuid`                   | Unique ID generation     | Implemented           |

## Development Patterns

### Svelte 5 Runes

- **State Management**: Using Svelte 5's runes for reactive state
  - `$state` for declaring reactive variables
  - `$derived` for computed values
  - `$props` for component props
  - `$effect` for side effects

### SvelteKit Conventions

- **File-based Routing**: Using SvelteKit's file-based routing system
  - `+layout.svelte` for common UI elements
  - `+page.svelte` for page-specific UI
  - `+layout.server.ts` for route group data loading
  - `+page.server.ts` for page-specific data loading and actions

- **Server Routes**:
  - `+server.ts` files for API endpoints
  - Server-side load functions for data fetching
  - Form actions for data mutations

### State Management

- **Reactive State**: Svelte 5 runes for fine-grained reactivity
  - `$state` for local component state
  - `$derived` for computed values
  - `$effect` for side effects and DOM updates
- **Server State**: Data loaded through server functions
- **URL State**: Route parameters for primary identifiers
- **Persistent State**: IndexedDB for client-side storage
- **Form State**: Using SvelteKit's form actions

### Data Flow

- **Client-side Storage**: 
  - IndexedDB for persistent storage
  - Reactive state updates with Svelte 5 runes
  - Custom events for cross-component communication
- **Data Loading**: 
  - Initial data loaded from server or IndexedDB
  - Dynamic updates through reactive state
- **Data Mutations**:
  - Direct updates to IndexedDB
  - Reactive state updates
  - Event dispatching for cross-component communication

### API Integration

- **OpenAI**: Direct integration with OpenAI API
  - Streaming completion endpoint
  - Context building with history and metadata
- **Custom APIs**:
  - Messages persistence
  - Chat and analysis management

## Environment Setup

- **Development**: Local Node.js with npm/pnpm/bun
- **Environment Variables**: `.env` file for local development
- **Client-side Storage**: IndexedDB for persistent data
- **PWA Support**: Offline capabilities with service workers
- **Testing**: TBD
