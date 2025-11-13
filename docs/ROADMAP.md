# Roadmap

A living document of features to build.

## Current State

**What works:**

- Core tree navigation and editing
- Keyboard-driven flow
- Beautiful, minimal interface
- Authentication and user accounts
- Creating, saving, publishing irariums
- Rich text editing (basic)

**What feels missing:**

- Can't export or share easily
- Settings page is empty
- Rich content (images, code) not supported
- No search within or across irariums
- Can't reorganize ideas (drag-drop, move)

---

## Priority 1: Blocking Daily Use

These feel like gaps that limit actual usage. Fix these first.

### Export & Sharing

**Why:** Ideas locked in a tool are less valuable. You should be able to get them out.

Features: Markdown export, JSON export, copy link button, print view

**Effort:** Low-medium | **Value:** High

### Settings Page

**Why:** Currently a placeholder. Basic account management should exist.

Features: Change email/password, account deletion, data export

**Effort:** Low | **Value:** Medium

### Search

**Why:** When you have many irariums or deep trees, finding things gets hard.

Features: Search across all irariums, search within current irarium, highlight matches

**Effort:** Medium | **Value:** High

### Auto-save & Drafts

**Why:** Losing work feels terrible. Should never happen.

Features: Auto-save every few seconds, draft recovery, offline support

**Effort:** Medium-high | **Value:** High

---

## Priority 2: Quality of Life

These would make Irarium more delightful to use. Not critical, but impactful.

### Rich Content Support

**Why:** Ideas aren't just text. Sometimes you need more.

Features: Image uploads, code blocks, embeds, tables

**Effort:** Medium per feature | **Value:** Medium-high

### Idea Reorganization

**Why:** Ideas change. You should be able to move them around.

Features: Drag-and-drop reordering, move to different parent, undo/redo, collapse/expand

**Effort:** High | **Value:** High

### Tags & Organization

**Why:** As irariums grow, organization becomes important.

Features: Tags on irariums, tag-based filtering, folders/collections, favorites/pinning

**Effort:** Low-medium | **Value:** Medium

### Visual Improvements

**Why:** Small polish makes the experience feel premium.

Features: Idea colors/icons, customizable themes, better mobile experience, smooth animations

**Effort:** Low-medium per item | **Value:** Low-medium

---

## Priority 3: Moonshots

These are dream features. Big, exciting, but not urgent.

### Collaboration

Real-time collaborative editing, comments, version history. **Note:** This could fundamentally change what Irarium is. Tread carefully.

**Effort:** Very high | **Value:** High (if people collaborate)

### Public Discovery

Improved public feed, user profiles, following, forking. **Note:** Could turn Irarium into a social network. That's not the goal.

**Effort:** High | **Value:** Medium

### AI Integration

Idea suggestions, summarization, auto-linking, voice to text. **Note:** Easy to do badly. Only add if it genuinely helps thinking.

**Effort:** High | **Value:** Unknown

### Advanced Navigation

Graph view, timeline view, mind map export, breadth-first search.

**Effort:** High | **Value:** Medium

### Platform Expansion

Native mobile apps, desktop apps, browser extension, API.

**Effort:** Very high | **Value:** Medium-high (but maintenance burden)

### Self-Hosting & Data Control

Easy self-hosting guide, data migration tools, encryption at rest, federated instances.

**Effort:** High | **Value:** Low-medium (niche audience)

---

## What's NOT on the Roadmap

Things I've considered and decided against (for now):

**Productivity Features** — No todo lists, reminders, time tracking, or "productivity scores"
_Why:_ Too many apps already do this. Irarium is for thinking, not task management.

**Gamification** — No streaks, achievements, points/levels, or engagement metrics
_Why:_ Creates wrong incentives. Think when you want to think, not because an app guilts you.

**Social Features** — No likes/hearts/reactions, social feeds, trending algorithms, or follower counts
_Why:_ These optimize for engagement, not for thinking quality.

**Monetization Complexity** — No freemium manipulation, subscription tiers, punitive premium features, or ads
_Why:_ Monetization can happen later, and honestly. For now, build something useful.

---

## How This Roadmap Changes

This isn't a commitment, it's a snapshot. As I use Irarium more, priorities will shift.

**The north star:** Does this make thinking easier?

Everything else is negotiable.

---

## Current Focus

Right now, focusing on:

1. **Export functionality** — Markdown & JSON export
2. **Settings page** — basic account management
3. **Auto-save** — never lose work

These unlock daily use and make Irarium feel complete.

For detailed specifications, see [docs/features/](./features/).
