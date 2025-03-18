# System Architecture and Patterns

## Overall Architecture

The AI Strategy Analyzer is built with SvelteKit using a route-based architecture that leverages server-side rendering and API routes for data handling.

## Key Components

### Routes Structure

```
src/routes/
├── api/                       # API endpoints
│   ├── ai/                    # AI-related endpoints
│   │   ├── stream/            # Streaming API for OpenAI
│   │   └── response/          # Regular response API
│   ├── analyses/              # Analysis management
│   ├── chats/                 # Chat management
│   └── messages/              # Message management
├── chats/                     # Chat routes
│   ├── [id]/                  # Individual chat view
│   │   └── export/            # Export functionality
│   └── new/                   # New chat creation
└── analyses/                  # Analysis routes
    ├── [id]/                  # Individual analysis
    └── new/                   # Create new analysis
```

### Data Flow

1. **Route-based Loading**:

   - `+layout.server.ts` files load shared data (e.g., chat list for sidebar)
   - `+page.server.ts` files load page-specific data (e.g., individual chat messages)

2. **Forms and Actions**:

   - `+page.server.ts` defines form actions with the `actions` export
   - Client components use `enhance` from `$app/forms` for progressive enhancement

3. **API Endpoints**:
   - `/api/ai/stream` provides streaming API responses
   - `/api/messages` handles message persistence

## Component Design Patterns

### UI Components

- **Layout Pattern**: `/chats/+layout.svelte` defines a shared layout with sidebar
- **Collapsible Sidebar**: State management for collapsing/expanding sidebar
- **Message Container**: Scrollable container with auto-scroll on new messages
- **Streaming Messages**: Real-time display of incoming AI responses

### Data Components

- **Sample Data Pattern**: Using mock data for prototyping in `sampleData.ts`
- **Form Handling**: Using SvelteKit's form actions for server-side processing
- **Streaming API**: Using ReadableStream for delivering chunked responses

## State Management

- **URL-based State**: Chat ID and other identifiers are part of the URL
- **Server Loading**: Data loaded via server load functions
- **Optimistic UI Updates**: Client-side state updated immediately before server confirmation

## Upcoming Patterns

1. **Database Integration**:

   - Prisma for type-safe database access
   - Data loaded through server load functions

2. **OpenAI Integration**:

   - Streaming responses from OpenAI API
   - Context-aware prompting

3. **Web Search**:
   - Integration with search APIs for context enhancement
   - Results integrated into AI responses
