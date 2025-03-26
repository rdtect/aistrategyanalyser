# Project Structure Documentation

## Overview

The AI Strategy Analyzer is built with SvelteKit and follows a feature-based organization pattern. After the refactoring, the codebase has been streamlined for better maintainability and scalability.

## Directory Structure

```
src/
├── lib/                  # Shared library code
│   ├── data/             # Data models and stores
│   ├── server/           # Server-side utilities
│   ├── services/         # Core services (OpenAI, IndexedDB)
│   └── utils/            # Utility functions
├── routes/               # SvelteKit routes
│   ├── api/              # API endpoints
│   ├── chats/            # Chat feature routes
│   ├── offline/          # Offline functionality
│   └── settings/         # User settings
└── app.html              # Main HTML template

memory-bank/              # Project documentation
├── core/                 # Core architecture documentation
├── diagrams/             # Visual representations of the system
├── references/           # External references and resources
└── status/               # Project status reports
```

## Key Components

### Services

- **OpenAI Service** (`src/lib/services/openai.ts`): Handles communication with the OpenAI API
- **IndexedDB Service** (`src/lib/services/idb.svelte`): Manages client-side data persistence

### Routes

- **Chats**: Main feature for AI interaction
- **Settings**: User preferences and application configuration
- **Offline**: Offline capability management

## State Management

The application uses Svelte 5 runes for reactive state management:

- `$state` for declaring reactive variables
- `$derived` for computed values
- `$effect` for side effects

## Data Flow

1. User input is captured in the UI components
2. Business logic in the `.svelte.ts` files processes the input
3. Services handle external communication (API) or data persistence
4. State updates trigger reactive UI updates

## Offline Capabilities

The application implements service workers for offline functionality:
- Cached resources for offline access
- IndexedDB for data persistence
- Fallback offline.html page
- Automatic reconnection detection