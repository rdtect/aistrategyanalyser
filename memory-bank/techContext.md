# Technology Context

## Tech Stack

- **Frontend Framework**: SvelteKit 2.0
- **UI Library**: Skeleton UI (based on Tailwind CSS)
- **Database**: PostgreSQL with Prisma ORM
- **API**: OpenAI API for text generation
- **Authentication**: TBD (likely Auth.js)
- **Deployment**: TBD (likely Vercel or similar)

## Key Libraries

| Library                  | Purpose            | Status                |
| ------------------------ | ------------------ | --------------------- |
| `@sveltejs/kit`          | Web framework      | Implemented           |
| `@skeletonlabs/skeleton` | UI components      | Implemented           |
| `marked`                 | Markdown rendering | Implemented           |
| `openai`                 | OpenAI API client  | Partially implemented |
| `prisma`                 | Database ORM       | Pending               |
| `lucide-svelte`          | Icon system        | Implemented           |

## Development Patterns

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

- **Server State**: Data loaded through server functions
- **URL State**: Route parameters for primary identifiers
- **Local State**: Svelte's built-in reactivity primitives
- **Form State**: Using SvelteKit's form actions

### Data Flow

- **Data Loading**: Server → Client
  - Layout server loads sidebar data
  - Page server loads specific data
- **Data Mutations**: Client → Server → Client
  - Form submissions trigger server actions
  - Server processes data and returns result
  - Client updates UI based on result

### API Integration

- **OpenAI**: Direct integration with OpenAI API
  - Streaming completion endpoint
  - Context building with history and metadata
- **Custom APIs**:
  - Messages persistence
  - Chat and analysis management

## Environment Setup

- **Development**: Local Node.js with npm/pnpm
- **Environment Variables**: `.env` file for local development
- **Database**: Local PostgreSQL database
- **Testing**: TBD
