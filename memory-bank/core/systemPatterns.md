# System Architecture and Patterns

## Overall Architecture

The AI Strategy Analyzer is built with SvelteKit and Svelte 5, using a client-first architecture with offline capabilities and IndexedDB for persistence.

## Key Components

### Routes Structure

```
src/routes/
├── api/                       # API endpoints (for future server integration)
│   ├── ai/                    # AI-related endpoints
│   │   ├── stream/            # Streaming API for OpenAI
│   │   └── response/          # Regular response API
├── chats/                     # Chat routes
│   ├── [id]/                  # Individual chat view
│   │   └── export/            # Export functionality
│   └── new/                   # New chat creation
└── offline/                   # Offline functionality
    └── +page.svelte           # Offline page
```

### Data Flow

1. **Client-side Storage**:
   - IndexedDB for persistent storage of chats and messages
   - Reactive state updates with Svelte 5 runes

2. **Reactive State Management**:
   - `$state` for declaring reactive variables
   - `$derived` for computed values
   - `$effect` for side effects

3. **Offline Capabilities**:
   - Service worker for caching static assets
   - offline.html fallback page
   - Online/offline status detection and handling

## Component Design Patterns

### UI Components

- **Layout Pattern**: `/chats/+layout.svelte` defines a shared layout with sidebar
- **Collapsible Sidebar**: State management for collapsing/expanding sidebar
- **Message Container**: Scrollable container with auto-scroll on new messages
- **Offline Indicator**: Status indicators for connection state

### Data Components

- **IndexedDB Storage**: Using idb library for simplified IndexedDB access
- **Svelte 5 Stores**: Custom stores using runes for global state management
- **Event-based Communication**: Custom events for cross-component communication

## State Management

- **Svelte 5 Runes**: Using `$state`, `$derived`, and `$effect` for reactive state
- **URL-based State**: Chat ID and other identifiers are part of the URL
- **Persistent State**: IndexedDB for client-side storage
- **Event Dispatching**: Custom events for cross-component communication

## Offline Capabilities

- **Service Worker**: Caching static assets and handling offline requests
- **IndexedDB**: Persistent storage for user data
- **Connection Detection**: Monitoring online/offline status
- **Fallback UI**: Dedicated offline.html page with reconnection capabilities

## Upcoming Patterns

1. **AI Integration**:
   - Streaming responses from OpenAI API
   - Context-aware prompting

2. **Authentication**:
   - User authentication and authorization
   - Secure data access

3. **Synchronization**:
   - Data synchronization between client and server
   - Conflict resolution for offline changes
