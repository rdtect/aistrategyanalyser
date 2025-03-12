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

- `src/lib/components/chat/` - Chat-related components
  - `Chat.svelte` - Main chat interface with message display
  - `ChatInput.svelte` - Text input component for sending messages
  - `ChatSidebar.svelte` - Sidebar with chat history
  - `Chat.svelte.ts` - Chat manager with business logic
- `src/lib/services/` - Service layer including AI response generation
- `src/routes/` - SvelteKit routes and layouts

## UI/UX Features

- **Isolated Scrolling** - Only the message area scrolls, keeping input and header fixed
- **Responsive Layout** - Adapts to different screen sizes with a collapsible sidebar
- **Markdown Support** - Rich text formatting in messages with proper styling
- **Real-time Updates** - Messages appear instantly with loading indicators

## License

MIT
