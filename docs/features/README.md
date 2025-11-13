# Features

Feature specifications in user story format. Each file contains actionable stories with acceptance criteria.

See [ROADMAP.md](../ROADMAP.md) for strategic vision and priorities.

---

## Priority 1: Blocking Daily Use

These are critical features that limit actual usage. Fix these first.

- **[Export & Sharing](./export.md)** — Export as Markdown/JSON, copy share link, print view
- **[Settings Page](./settings.md)** — Change email/password, account deletion, data export
- **[Auto-Save & Drafts](./auto-save.md)** — Auto-save, draft recovery, offline support
- **[Search](./search.md)** — Global search across irariums, within-irarium search

---

## Priority 2: Quality of Life

Features that make Irarium more delightful to use. Not critical, but impactful.

- **[Rich Content Support](./rich-content.md)** — Image uploads, code blocks, link previews, tables, embeds
- **[Idea Reorganization](./reorganization.md)** — Drag-and-drop, move to parent, collapse/expand, undo/redo
- **[Tags & Organization](./tags.md)** — Add tags, filter by tags, favorites/pinning, folders
- **[Visual Improvements](./visual.md)** — Idea colors/icons, themes, mobile experience, animations

---

## How to Use These Files

Each feature file contains:
- **User Stories** — "As a user, I want to... so that..."
- **Acceptance Criteria** — Checkboxes for implementation requirements
- **Technical Notes** — Implementation hints, libraries, edge cases

Stories are **not** ordered within files — implement in whatever order makes sense. Use the roadmap priority (P1, P2, P3) to guide overall sequencing.

When implementing:
1. Pick a story from a P1 feature file
2. Read acceptance criteria carefully
3. Implement and check off criteria as you go
4. Test thoroughly before marking complete

These are working documents — update as you learn, add notes, adjust criteria.
