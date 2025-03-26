# AI Strategy Analyzer Code Organization

This directory follows a feature-based organization pattern for better maintainability and scalability.

## Directory Structure

```
src/lib/
├── features/       # Feature-specific code
│   └── chat/       # Chat feature
│       ├── components/   # Chat UI components
│       ├── stores/       # Chat state management
│       └── utils/        # Chat-specific utilities
├── core/           # Core, shared functionality
│   ├── api/        # API clients and services
│   ├── config/     # Configuration files
│   ├── data/       # Data files and mock data
│   ├── pwa/        # Progressive Web App components
│   ├── stores/     # Global stores
│   ├── types/      # TypeScript type definitions
│   ├── ui/         # Shared UI components 
│   └── utils/      # Shared utility functions
└── _archived/      # Deprecated code (to be removed)
```

## Key Patterns

1. **Feature-Based Organization**: 
   - Each feature has its own directory with components, stores, and utilities
   - Related code stays together, improving maintainability

2. **Core Shared Code**:
   - Reusable functionality lives in the core directory
   - No feature-specific code in core - only shared utilities

3. **Error Handling**:
   - Consolidated in `core/utils/errorHandling.ts`
   - Component-level error handling via `core/ui/ErrorBoundary.svelte`
   - Route error handling uses the same components

4. **Barrel Files**:
   - Each directory has an index.ts that exports its contents
   - Simplifies imports with a consistent pattern

## Usage

Import from features or core directories, not from individual files:

```ts
// Good
import { chatStore } from "$lib/features/chat/stores";
import { ErrorBoundary } from "$lib/core/ui";

// Bad - avoid importing from specific files
import { chatStore } from "$lib/features/chat/stores/chatStore.svelte";
```

When adding new features, follow the same pattern:

```
src/lib/features/newFeature/
├── components/
├── stores/
└── utils/
```