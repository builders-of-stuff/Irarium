# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm`, not `npm`

- `pnpm run dev` - Start development server for the main application
- `pnpm run dev:db` - Start PocketBase backend server (run in separate terminal)
- `pnpm run build` - Build the application for production
- `pnpm run preview` - Preview the production build locally
- `pnpm run lint` - Run linter (Prettier + ESLint)
- `pnpm run format` - Format code with Prettier
- `pnpm run check` - Run TypeScript and Svelte checks
- `pnpm run test:unit` - Run unit tests with Vitest
- `pnpm run test:e2e` - Run end-to-end tests with Playwright
- `pnpm run test` - Run both unit and e2e tests

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

Uses Svelte 5 runes (`$state`, `$derived`) extensively with **class-based store architecture**:

- `AuthStore` - Global authentication state (ES6 class with runes)
- `IrariumStore` - Working irarium state with complex idea navigation (ES6 class)
- `IrariumsStore` - Collection of user's irariums and public feed (ES6 class)
- Individual component state where needed

**Important**: Stores are implemented as ES6 classes with Svelte 5 runes, NOT as traditional Svelte store functions (`writable`, `readable`). This makes them more testable and organizes related methods together.

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

## Architectural Patterns & Design Decisions

### Class-Based Stores with Svelte 5 Runes

Stores use ES6 classes with `$state` and `$derived` runes instead of traditional Svelte stores. This pattern:
- Organizes related state and methods in a single class
- Makes stores more testable (can instantiate and test methods directly)
- Uses `$derived.by()` for complex computed values
- Example: `IrariumStore` class in `src/lib/irarium/irarium.store.svelte.ts`

### Bidirectional Prop Binding

Components use Svelte 5's `bindable()` for two-way data flow:
- Makes parent-child state synchronization explicit
- Used in key components like `IrariumComposer` to sync with parent state
- Allows child components to update parent state directly

### JSON Tree Data Structure

Ideas are stored as nested JSON trees within irarium documents, NOT as relational tables:
- **Rationale**: Single fetch gets entire hierarchy, simpler exports, no complex joins
- **Trade-offs**: Can't query individual ideas efficiently, entire tree must load client-side
- **Navigation**: Uses parent IDs, sibling arrays, and depth tracking for traversal
- **Key methods**: `getParentChain()`, `getChildChain()`, `getSiblings()` in IrariumStore

### Keyboard-Driven Navigation System

`IrariumComposer.svelte` orchestrates complex keyboard navigation:
- Arrow keys navigate between parent/child/sibling ideas
- Enter creates new ideas, Escape cancels editing
- Handles all keyboard shortcuts centrally
- Updates `activeIdea` state which triggers highlighting and auto-scroll

### Server-Side Security Architecture

`src/hooks.server.ts` handles critical middleware:
- **Authentication**: Refreshes PocketBase auth tokens, protects routes
- **Route Guards**: Blocks unauthenticated access to `(app)/*` routes
- **CSP Headers**: Comprehensive Content Security Policy for all responses
- **CORS**: Handles webhook endpoints with special permissions
- **Webhook Auth**: Separate admin auth for Stripe webhooks (not user auth)

### Client-Side Rendering Only

- SSR is disabled (`ssr = false` in `+layout.ts` files)
- Application is fully client-side rendered
- PocketBase handles all backend logic

### Svelte 5 Modern Patterns

Uses latest Svelte 5 syntax throughout:
- `$props()` for component props
- `$derived` and `$derived.by()` for computed values
- `$state` for reactive state
- Snippet syntax for component composition
- No legacy syntax (`$:`, `export let`, etc.)

## Testing

Test infrastructure is configured but coverage is minimal:
- **Unit Tests**: Vitest with `@testing-library/svelte` and JSDOM
- **E2E Tests**: Playwright for end-to-end testing
- **Current State**: Only placeholder tests exist (demo.spec.ts, demo.test.ts)
- **Testing Pattern**: Tests should be added as features are developed

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

- Always run both `pnpm run dev` and `pnpm run dev:db` for full functionality
- PocketBase admin interface available at `http://127.0.0.1:8090/_/` when running dev:db
- The app uses a complex keyboard-driven idea navigation system with parent/child relationships and sibling navigation
- Premium features are gated through user settings and payment verification
- Application is client-side rendered only (no SSR)
- Use pnpm as the package manager, not npm
