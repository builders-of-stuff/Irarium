# Tags & Organization

**Priority:** P2 (Quality of Life)

**Current State:** `tags` field exists in schema but not used in UI

---

## Story: Add Tags to Irariums

**As a user, I want to** tag my irariums **so that** I can categorize them by topic, project, or context.

### Acceptance Criteria
- [ ] "Tags" input field in irarium editor/settings
- [ ] Type tag name, press Enter → added to list
- [ ] Tags shown as pills/chips below input
- [ ] Click X on pill → remove tag
- [ ] Auto-complete from existing tags as user types
- [ ] Tags saved with irarium (auto-save)
- [ ] Max tag length (e.g., 30 characters)

### Technical Notes
- Update irarium record with tags array
- UI: Tag input component (shadcn/ui or similar)
- Fetch all user's existing tags for auto-complete
- Case-insensitive tag matching
- Future: Tag colors, tag icons

---

## Story: Filter by Tags

**As a user, I want to** filter irariums by tag **so that** I can view only relevant irariums.

### Acceptance Criteria
- [ ] Tag pills displayed on irarium cards in `/collection` view
- [ ] Click tag pill → filter to show only irariums with that tag
- [ ] Multiple tag filters (OR logic: show if any tag matches)
- [ ] Active filters shown with "X" to remove
- [ ] "Clear filters" button
- [ ] URL updates with tag filter (e.g., `/collection?tag=journal`)

### Technical Notes
- Filter irariums array client-side
- OR logic: `irarium.tags.some(tag => selectedTags.includes(tag))`
- Update URL query params for shareable filter links
- Future: AND logic option (show if all tags match)

---

## Story: Tag Management

**As a user, I want to** manage my tags **so that** I can rename or merge tags across irariums.

### Acceptance Criteria
- [ ] Settings page has "Tags" section
- [ ] List all tags used across irariums with count
- [ ] Rename tag → updates all irariums using that tag
- [ ] Merge tags → combine two tags into one
- [ ] Delete unused tags from list (cleanup)

### Technical Notes
- Fetch all user's irariums, extract unique tags
- Rename: update all irariums with old tag to new tag
- Merge: update all irariums with tag A to tag B
- Requires batch update operation
- This is a P3 feature - nice to have, not critical

---

## Story: Favorites/Pinning

**As a user, I want to** pin important irariums **so that** I can access them quickly.

### Acceptance Criteria
- [ ] Star/pin icon on irarium cards
- [ ] Click to toggle pinned status
- [ ] Pinned irariums appear at top of collection
- [ ] Visual indicator (star icon filled vs outline)
- [ ] Pinned status saved to database

### Technical Notes
- Add `isPinned` boolean field to irarium schema
- Sort: pinned first, then by updated date
- Future: Pin to sidebar for global access

---

## Story: Folders/Collections

**As a user, I want to** group irariums into folders **so that** I can organize large collections.

### Acceptance Criteria
- [ ] Create folder/collection (name, color)
- [ ] Add irariums to folder
- [ ] View irariums within folder
- [ ] Nested folders (optional)
- [ ] Move irariums between folders

### Technical Notes
- New `folders` collection in database
- Irarium has `folderId` field (nullable)
- Filter view by folder
- Complexity: Medium-high
- This is a P3 feature - only if users request it

---

## Story: Search by Tags

**As a user, I want to** search using tags **so that** I can find irariums efficiently.

### Acceptance Criteria
- [ ] Global search includes tag matches
- [ ] Type `tag:journal` in search → filter by tag
- [ ] Combine tag search with text search
- [ ] Tag suggestions in search autocomplete

### Technical Notes
- Extend global search feature (see search.md)
- Parse query for tag syntax
- Combined search: text OR tags
- This depends on search feature being implemented first
