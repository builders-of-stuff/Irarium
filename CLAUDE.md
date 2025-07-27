# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server for the main application
- `npm run dev:db` - Start PocketBase backend server (run in separate terminal)
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run linter (Prettier + ESLint)
- `npm run format` - Format code with Prettier
- `npm run check` - Run TypeScript and Svelte checks
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test` - Run both unit and e2e tests

## Architecture Overview

Irarium is a SvelteKit application for organizing and managing hierarchical ideas. It uses PocketBase as the backend database and supports premium features through Stripe payments.

### Key Technologies
- **Frontend**: SvelteKit 5 with TypeScript
- **Styling**: TailwindCSS with custom UI components
- **Backend**: PocketBase (self-hosted)
- **Database**: SQLite (via PocketBase)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Rich Text**: TipTap editor
- **Payments**: Stripe integration

### Core Data Models

**Irarium**: A collection of hierarchical ideas with title, description, content, and children
- Lives in `src/lib/shared/shared.type.ts`
- Managed by `IrariumStore` class in `src/lib/irarium/irarium.store.svelte.ts`

**Idea**: Individual nodes in the idea hierarchy with content, children, depth tracking
- Supports unlimited nesting levels
- Each idea has unique ID, content, creation/update timestamps

**User & Authentication**: 
- Managed by `AuthStore` class in `src/lib/auth/auth.store.svelte.ts`
- Uses PocketBase SDK for authentication
- Supports premium features and user settings

### Directory Structure

- `src/lib/irarium/` - Core idea management logic and stores
- `src/lib/auth/` - Authentication and user management
- `src/lib/components/ui/` - Reusable UI components (shadcn/ui style)
- `src/lib/db/` - PocketBase client configuration
- `src/routes/(app)/` - Main application routes (authenticated)
- `src/routes/(auth)/` - Authentication pages
- `src/routes/(webhooks)/` - Stripe webhook handlers
- `pocketbase/` - Backend database and migrations

### State Management

Uses Svelte 5 runes (`$state`, `$derived`) extensively:
- `AuthStore` - Global authentication state
- `IrariumStore` - Working irarium state with complex idea navigation
- Individual component state where needed

### Database Collections (PocketBase)

- `users` - User accounts and profiles
- `userSettings` - User preferences and premium status
- `irariums` - Main irarium documents
- `payments` - Stripe payment records

### Stripe Integration

- Webhook endpoint: `/payments` 
- Test cards provided in README.md
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to http://localhost:5173/payments`

## Development Notes

- Always run both `npm run dev` and `npm run dev:db` for full functionality
- PocketBase admin interface available when running dev:db
- The app uses a complex idea navigation system with parent/child relationships and sibling navigation
- Premium features are gated through user settings and payment verification