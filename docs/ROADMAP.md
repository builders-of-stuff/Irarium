# Roadmap

This is a living document of features to build, organized by priority and excitement. Not a timeline, not commitments — just what would make Irarium better.

## Current State

**What works well:**
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

- **Export as Markdown** — clean, readable, works everywhere
- **Export as JSON** — full data export for backups/migration
- **Copy link button** — share with a click, not URL copy-paste
- **Print view** — sometimes paper is the right medium

**Effort:** Low-medium
**Value:** High — makes Irarium feel complete

### Settings Page
**Why:** Currently a placeholder. Basic account management should exist.

- **Change email**
- **Change password**
- **Account deletion** — respect the right to leave
- **Data export** — download all my irariums at once

**Effort:** Low
**Value:** Medium — just table stakes

### Search
**Why:** When you have many irariums or deep trees, finding things gets hard.

- **Search across all irariums** — find that thought from 3 months ago
- **Search within current irarium** — jump to a specific idea
- **Highlight matches** — see context around results

**Effort:** Medium
**Value:** High — becomes critical as usage grows

### Auto-save & Drafts
**Why:** Losing work feels terrible. Should never happen.

- **Auto-save every few seconds** — silent, automatic
- **Draft recovery** — if browser crashes, recover unsaved work
- **Offline support** — work without internet, sync later

**Effort:** Medium-high
**Value:** High — prevents data loss

---

## Priority 2: Quality of Life

These would make Irarium more delightful to use. Not critical, but impactful.

### Rich Content Support
**Why:** Ideas aren't just text. Sometimes you need more.

- **Image uploads** — screenshots, diagrams, inspiration
- **Code blocks** — syntax highlighting for technical notes
- **Embeds** — YouTube, tweets, links with previews
- **Tables** — structured data when needed

**Effort:** Medium per feature
**Value:** Medium-high — expands use cases

### Idea Reorganization
**Why:** Ideas change. You should be able to move them around.

- **Drag-and-drop reordering** — within siblings
- **Move to different parent** — restructure the tree
- **Undo/redo** — safety net for changes
- **Collapse/expand branches** — hide complexity when needed

**Effort:** High
**Value:** High — makes Irarium a mature tool

### Tags & Organization
**Why:** As irariums grow, organization becomes important.

- **Tags on irariums** — categorize by topic, project, etc.
- **Tag-based filtering** — see all "writing" or "journal" irariums
- **Folders/collections** — group related irariums
- **Favorites/pinning** — quick access to important ones

**Effort:** Low-medium
**Value:** Medium — useful for power users

### Visual Improvements
**Why:** Small polish makes the experience feel premium.

- **Idea colors/icons** — visual differentiation
- **Customizable themes** — let people make it their own
- **Better mobile experience** — currently works but could be better
- **Animations & transitions** — smooth, not jarring

**Effort:** Low-medium per item
**Value:** Low-medium — nice to have

---

## Priority 3: Moonshots

These are dream features. Big, exciting, but not urgent.

### Collaboration
**Why:** Sometimes thinking is better together.

- **Share with specific users** — give someone access
- **Comments on ideas** — discussion without editing
- **Real-time collaborative editing** — like Google Docs
- **Version history** — see how ideas evolved

**Effort:** Very high
**Value:** High — but only if people actually collaborate

**Note:** This could fundamentally change what Irarium is. Tread carefully.

### Public Discovery
**Why:** Great idea trees could inspire others.

- **Public feed improvements** — curation, featured content
- **User profiles** — see someone's published work
- **Following/subscribing** — get updates from interesting thinkers
- **Forking** — build on someone else's idea tree

**Effort:** High
**Value:** Medium — could build community, or distract from core use

**Note:** Could turn Irarium into a social network. That's not the goal.

### AI Integration
**Why:** AI could help think, not replace thinking.

- **Idea suggestions** — "based on this, you might explore..."
- **Summarization** — condense large trees
- **Auto-linking** — connect related ideas across irariums
- **Voice to text** — capture thoughts hands-free

**Effort:** High
**Value:** Unknown — needs experimentation

**Note:** Easy to do badly. Only add if it genuinely helps thinking.

### Advanced Navigation
**Why:** Power users want power features.

- **Graph view** — see connections between ideas
- **Timeline view** — see ideas chronologically
- **Mind map export** — visual representation
- **Breadth-first search** — different navigation modes

**Effort:** High
**Value:** Medium — nice for exploration

### Platform Expansion
**Why:** Meet users where they are.

- **Native mobile apps** — iOS, Android
- **Desktop apps** — Electron or Tauri
- **Browser extension** — capture thoughts from anywhere
- **API** — let others build on Irarium

**Effort:** Very high
**Value:** Medium-high — but maintenance burden

### Self-Hosting & Data Control
**Why:** Some people want full ownership.

- **Easy self-hosting guide** — one-command deploy
- **Data migration tools** — move between instances
- **Encryption at rest** — for paranoid users
- **Federated instances** — ActivityPub integration?

**Effort:** High
**Value:** Low-medium — niche audience, but aligned with principles

---

## What's NOT on the Roadmap

Things I've considered and decided against (for now):

### Productivity Features
- No todo lists
- No reminders
- No time tracking
- No "productivity scores"

**Why:** Too many apps already do this. Irarium is for thinking, not task management.

### Gamification
- No streaks
- No achievements
- No points/levels
- No engagement metrics

**Why:** Creates wrong incentives. Think when you want to think, not because an app guilts you.

### Social Features
- No likes/hearts/reactions
- No social feeds
- No trending algorithms
- No follower counts

**Why:** These optimize for engagement, not for thinking quality.

### Monetization Complexity
- No freemium manipulation ("upgrade to unlock")
- No subscription tiers
- No premium features that feel punitive
- No ads, ever

**Why:** Monetization can happen later, and honestly. For now, build something useful.

---

## How This Roadmap Changes

This isn't a commitment, it's a snapshot. As I use Irarium more, priorities will shift. Some features will feel more urgent, others less so.

The north star: **does this make thinking easier?**

Everything else is negotiable.

---

## Next Up (Current Focus)

Right now, focusing on:

1. **Export functionality** — Markdown & JSON export
2. **Settings page** — basic account management
3. **Auto-save** — never lose work

These unlock daily use and make Irarium feel complete.
