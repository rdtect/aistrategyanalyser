# AI Strategy Analyzer

A SvelteKit application that provides AI-powered analysis of brand strategies across different markets and regions.

## Features

- Interactive chat interface for querying brand information
- AI-generated responses based on brand, category, and region
- Responsive design that works on desktop and mobile
- Real-time markdown rendering for rich text responses
- Optimized chat layout with isolated scrolling for messages

## Tech Stack

- **Frontend**: SvelteKit 2 with Svelte 5 runes
- **Styling**: Tailwind CSS with Skeleton UI components
- **Icons**: Lucide Svelte
- **Markdown**: Marked for rendering markdown content
- **Build Tool**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aistrategyanalyser.git
cd aistrategyanalyser

# Install dependencies
bun install

# Start the development server
bun --bun vite dev
```

## Project Structure

The project follows a structure that combines SvelteKit's routing conventions with a shared library (`$lib`) and feature colocation.

- `src/routes/` - SvelteKit routes and layouts.

  - Feature-specific components, stores, services, and utilities are colocated within route directories, often inside a private `(lib)/` sub-directory (e.g., `src/routes/chats/(lib)/components/`, `src/routes/chats/(lib)/ChatUtils.ts`).

- `src/lib/` - Shared core library code, accessible via the `$lib/` alias.

  ```
  src/lib/
  ├── services/     # Shared services (e.g., OpenAI client, IDB, StorageManager)
  ├── types.ts      # Global TypeScript type definitions
  ├── utils/        # Shared utility functions (e.g., formatting, error handling)
  └── server/       # Server-only modules
  ```

  (The `stores/` directory was removed as stores are now colocated).

- **Key Patterns:**

  1.  **Shared Core (`$lib/`)**: Only genuinely reusable code applicable to multiple features belongs here.
  2.  **Colocation (`src/routes/.../(lib)/`)**: Feature-specific logic (components, stores, utils, services) resides within the feature's route directory, usually within a private `(lib)/` folder.
  3.  **Barrel Files**: Use `index.ts` sparingly, primarily in `$lib/utils` and for specific exports if needed.

- **Usage Examples:**

  ```ts
  // Importing shared code ($lib alias)
  import type { Chat } from "$lib/types";
  import { formatTime } from "$lib/utils/formatters";
  import { openaiService } from "$lib/services/openai";

  // Importing feature-specific code (relative paths within route)
  // Example from src/routes/chats/(lib)/components/ChatItem.svelte
  import { getChatSnippet } from "../ChatUtils";
  ```

- `src/app.html` - Main HTML template.
- `src/service-worker.ts` - PWA service worker.
- `memory-bank/` - AI-readable project context and logs.

## UI/UX Features

- **Isolated Scrolling** - Only the message area scrolls, keeping input and header fixed
- **Responsive Layout** - Adapts to different screen sizes with a collapsible sidebar
- **Markdown Support** - Rich text formatting in messages with proper styling
- **Real-time Updates** - Messages appear instantly with loading indicators

## Developer Notes / Memory Bank

The `memory-bank/` directory contains concise documentation optimized for AI assistant consumption. It includes:

- **project_context.md**: Central document detailing goals, status, architecture, progress, and coding recommendations. This is the primary source of truth for development context.
- **changeLog.md**: Log of significant changes and corrections.
- **todo.md**: Centralized task list.

This memory bank should be kept up-to-date with significant changes to aid AI-assisted development.

## License

MIT
