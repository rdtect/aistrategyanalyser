# Archived Components and Code

This directory contains components, services, and modules that were refactored or deprecated during the application's evolution to Svelte 5 and architectural improvements.

## Contents

### Components

- **Icons**: Custom icon components that have been replaced with lucide-svelte imports
- **Research**: Initial implementations of research features not yet integrated into the main application

### State Management

- **Old Stores**: Svelte 3/4 style stores that have been replaced with Svelte 5 runes-based state
- **App State**: Preliminary state management that has been replaced with more modular approaches

### Data

- **Sample Data**: Mock data structures used for early development that will be replaced with database-backed models

## Why Code Is Archived

These files are kept for reference purposes during the transition period but should eventually be removed once the refactoring is complete and stable. The main reasons for archiving code include:

1. Migrating from traditional Svelte stores to Svelte 5 runes
2. Centralizing services like OpenAI integration
3. Using standard component libraries instead of custom implementations
4. Moving from mock data to database persistence
5. Improving type safety and code organization

## When to Delete

This archived code can be safely deleted after:

1. All application features have been fully tested with the new implementations
2. Database integration is complete and stable
3. The team has had sufficient time to reference old patterns if needed during refactoring