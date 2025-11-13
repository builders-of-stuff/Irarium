# Search

**Priority:** P1 (Blocking Daily Use)

---

## Story: Global Search (Across All Irariums)

**As a user, I want to** search across all my irariums **so that** I can find an idea I wrote months ago without remembering which irarium it's in.

### Acceptance Criteria
- [ ] Search icon in sidebar (or Cmd+K keyboard shortcut)
- [ ] Opens search modal overlay
- [ ] Type query → live results appear
- [ ] Searches: irarium titles, descriptions, idea content, tags
- [ ] Results grouped by irarium
- [ ] Show matching idea with context (parent/children snippets)
- [ ] Highlight matched terms in results
- [ ] Show date created/modified for each match
- [ ] Click result → navigate to that irarium + highlight idea
- [ ] Fuzzy search (handles typos, partial matches)

### Technical Notes
- Client-side search initially (fetch all user's irariums)
- Use Fuse.js or similar for fuzzy search
- Index: irarium metadata + flattened idea content
- Future: Server-side search for performance at scale
- Future: Search filters (date range, tags, public/private)

---

## Story: Within-Irarium Search

**As a user, I want to** search within the current irarium **so that** I can jump to a specific idea in a large tree.

### Acceptance Criteria
- [ ] Search bar in irarium view (or Cmd+F keyboard shortcut)
- [ ] Type query → matching ideas highlighted in tree
- [ ] Arrow keys (or Enter/Shift+Enter) to cycle through matches
- [ ] Current match highlighted differently (e.g., yellow vs light yellow)
- [ ] Navigate to matched idea (make it active, scroll into view)
- [ ] Counter showing current match position (e.g., "2 of 7 matches")
- [ ] Clear button to exit search and remove highlights

### Technical Notes
- Search current irarium's idea tree only
- Highlight matches in UI (CSS class)
- Update `activeIdea` to navigate
- Clear highlights when search closed
- Future: Regex support for power users

---

## Story: Search Keyboard Navigation

**As a user, I want to** navigate search results with keyboard **so that** I can stay in flow without using the mouse.

### Acceptance Criteria
- [ ] Cmd+K (or Ctrl+K) opens global search
- [ ] Cmd+F (or Ctrl+F) opens within-irarium search
- [ ] Arrow Up/Down to navigate results
- [ ] Enter to select and navigate to result
- [ ] Escape to close search
- [ ] Works without mouse interaction

### Technical Notes
- Handle keyboard events in search modal
- Focus management (trap focus in modal)
- Accessible keyboard navigation (ARIA roles)

---

## Story: Search History

**As a user, I want to** see my recent searches **so that** I can quickly repeat common queries.

### Acceptance Criteria
- [ ] Recent searches shown when search opened (before typing)
- [ ] Click recent search to use it again
- [ ] Clear individual search from history
- [ ] Clear all search history option
- [ ] Limit to last 10 searches

### Technical Notes
- Store in localStorage: `search_history`
- Deduplicate searches
- Privacy: user can clear history
- Future: Save searches as "Saved Searches"
