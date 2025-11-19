# Coding Style Guide

**For Svelte Projects** - Personal coding preferences and conventions. These are guidelines and examples, not strict rules.

---

## File Naming

**Always use kebab-case** for all files and folders:

```
✓ difficulty-badge.svelte
✓ app.store.svelte.ts
✓ chat.remote.ts
✓ shared.type.ts
✓ shared.constants.ts
✓ shared.tools.ts
```

---

## File Type Suffixes

Use descriptive suffixes to indicate file purpose:

| Suffix             | Purpose                          |
| ------------------ | -------------------------------- |
| `.store.svelte.ts` | State management stores          |
| `.remote.ts`       | Server-side API/remote functions |
| `.type.ts`         | TypeScript type definitions      |
| `.constants.ts`    | Constants and enums              |
| `.tools.ts`        | Utility/helper functions         |

---

## Component Organization

**Shared UI components** (`src/lib/components/ui/`)

- Only for components reused across multiple features
- Don't modify third-party UI library components directly

**Feature-specific components**

- Co-locate with their features
- If a component is used in only one place, keep it near that feature

**Compound components**

- Prefix with parent name: `sidebar-menu.svelte`, `dialog-content.svelte`

---

## Naming Conventions

### Variables & Functions

- **camelCase** for variables and functions

```typescript
const sourceLanguage = 'English';
const isLoadingCompletion = false;

function handleClick() {}
async function loadUserData() {}
```

### Constants & Enums

- **SCREAMING_SNAKE_CASE**

```typescript
export const API_BASE_URL = 'https://api.example.com';
export const DEFAULT_TIMEOUT = 5000;

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user'
}
```

### Types & Interfaces

- **PascalCase**

```typescript
export type User = {
  id: string;
  name: string;
};

interface Props {
  title: string;
  isActive?: boolean;
}
```

---

## Code Organization

### Store Class Order

```typescript
class FeatureStore {
  // 1. Loading states
  // 2. State variables
  // 3. Derived state
  // 4. Constructor
  // 5. Public methods
  // 6. Private methods
}

export const featureStore = new FeatureStore();
```

**Always export singleton instances** for stores.

---

## Key Principles

1. **File naming**: kebab-case everywhere
2. **File suffixes**: `.store.svelte.ts`, `.remote.ts`, `.type.ts`, `.constants.ts`, `.tools.ts`
3. **Component location**: Shared components in lib, feature-specific co-located
4. **Stores**: Export singleton instances, use classes and svelte 5 runes to organize state and state-related logic/functions
5. **Naming**: camelCase (variables/functions), SCREAMING_SNAKE_CASE (constants), PascalCase (types)

---

_These patterns are guidelines based on personal preferences. Adapt as needed for your project._
