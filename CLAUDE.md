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
- **Important**: Ideas are stored as JSON tree inside irarium document (not relational)
- This means one fetch gets entire irarium, easier to export, simpler queries
- Trade-off: can't query individual ideas efficiently, entire tree loaded client-side

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
- `IrariumsStore` - Collection of user's irariums and public feed
- Individual component state where needed

### Component Architecture

**Smart Components** (connected to stores, handle business logic):
- `IrariumComposer.svelte` - Orchestrates editing, navigation, keyboard shortcuts
- `UserNavbar.svelte` - Auth state, navigation
- `UserSidebar.svelte` - App navigation

**Dumb Components** (props in, events out):
- `Idea.svelte` - Renders individual idea, receives props
- `TextEditor.svelte` - TipTap wrapper, emits events
- `ui/*` - Pure presentation components

### Database Collections (PocketBase)

- `users` - User accounts and profiles
- `userSettings` - User preferences and premium status
- `irariums` - Main irarium documents
- `payments` - Stripe payment records

### Stripe Integration

- Webhook endpoint: `/payments`
- Test cards provided in README.md
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to http://localhost:5173/payments`

### Data Flow

**Creating a New Irarium:**
1. User types in IrariumComposer → IrariumStore updates ($state)
2. User clicks "Save" → IrariumStore.save()
3. PocketBase.create('irariums', data) → server validates, inserts to SQLite
4. Response updates IrariumStore and IrariumsStore cache
5. Navigate to /irarium/[id]

**Navigating Ideas (Keyboard):**
1. User presses arrow key → IrariumComposer handles keydown
2. IrariumStore.navigateToFirstChild() (or other navigation method)
3. Updates activeIdea $state
4. Svelte reactivity triggers re-render
5. Idea.svelte receives isActive prop, highlights and scrolls into view

**Publishing an Irarium:**
1. User toggles "Public" switch → IrariumStore.togglePublic()
2. PocketBase.update('irariums', id, { isPublic: true })
3. Server updates SQLite, checks access rules
4. IrariumStore updates local state
5. Now visible in public feed (/home)

## Development Notes

- Always run both `npm run dev` and `npm run dev:db` for full functionality
- PocketBase admin interface available when running dev:db
- The app uses a complex idea navigation system with parent/child relationships and sibling navigation
- Premium features are gated through user settings and payment verification
