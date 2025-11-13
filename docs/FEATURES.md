# Feature Specifications

Detailed specs for priority features. These are working notes, not final designs.

---

## Export & Sharing

### Export as Markdown

**User Story:** As a user, I want to export my irarium as Markdown so I can use it in other tools or share as a readable document.

**Behavior:**
1. "Export" button in irarium view (near Save/Publish)
2. Click opens export options modal
3. Select "Markdown" format
4. Downloads `{irarium-title}.md` file

**Markdown Format:**
```markdown
# {Irarium Title}

{Description if exists}

---

{Root idea content}

## {First child idea content}

{Child content}

### {Grandchild idea content}

{Grandchild content}

## {Second child idea content}

...
```

**Technical:**
- Traverse idea tree depth-first
- Map depth to heading level (# root, ## level 1, ### level 2, etc.)
- HTML content from TipTap → Markdown conversion
- Use Turndown library or similar for HTML→MD
- Client-side generation, no server needed

**Edge Cases:**
- Very deep nesting (>6 levels) → continue with ###### or indent with bullets
- Empty ideas → skip or show as `-` placeholder
- Special characters in headings → escape properly

**Future Enhancement:**
- Options: include/exclude description, timestamps, metadata
- YAML frontmatter with irarium metadata

---

### Export as JSON

**User Story:** As a user, I want to export my irarium as JSON for backup or migration.

**Behavior:**
1. Export modal → select "JSON"
2. Downloads `{irarium-title}.json` file
3. Contains complete irarium data structure

**JSON Format:**
```json
{
  "id": "abc123",
  "title": "My Irarium",
  "description": "...",
  "tags": ["journal", "writing"],
  "isPublic": false,
  "created": "2025-01-01T00:00:00Z",
  "updated": "2025-01-15T12:30:00Z",
  "content": "<p>Root content</p>",
  "children": [
    {
      "id": "def456",
      "content": "<p>Child content</p>",
      "parentId": "root",
      "created": "2025-01-01T00:01:00Z",
      "updated": "2025-01-01T00:01:00Z",
      "children": [...]
    }
  ]
}
```

**Technical:**
- Direct export of irarium object from store
- Pretty-print JSON (2-space indent)
- Include all metadata
- Client-side only

**Future Enhancement:**
- Import JSON to restore/duplicate irarium
- Export all irariums at once (bulk export)

---

### Copy Share Link

**User Story:** As a user, I want to easily share a public irarium with a link.

**Current State:**
- Public irariums have URLs: `/irarium/{id}`
- No UI to copy link easily

**Behavior:**
1. "Share" button next to Publish toggle
2. Only visible when irarium is public
3. Click copies full URL to clipboard
4. Toast: "Link copied!"

**Technical:**
- Use Clipboard API: `navigator.clipboard.writeText(url)`
- Fallback for older browsers
- URL format: `https://irarium.app/irarium/{id}`

**Future Enhancement:**
- QR code generation for mobile sharing
- Social media preview cards (Open Graph tags)
- "Embed" option (iframe code)

---

## Settings Page

**Current State:** Empty placeholder at `/settings`

### Account Settings

**Sections:**

#### Profile
- Name, username, bio (already works in /profile, move here?)
- Avatar upload (field exists in schema, add UI)
- Display preferences

#### Security
- Change email
- Change password
- Two-factor auth (future)

#### Data & Privacy
- Download all my data (JSON export of all irariums)
- Delete account (with confirmation flow)
- Data retention settings

#### Preferences (Future)
- Default irarium privacy (public/private)
- Auto-save interval
- Editor preferences
- Keyboard shortcuts customization

**Technical:**
- Reuse existing profile update logic
- Add email/password change via PocketBase SDK
- Account deletion: soft delete or hard delete? (decide)
- Data export: zip all irariums as JSON files

**UI:**
- Sidebar navigation: Profile, Security, Data, Preferences
- Forms with validation
- Confirmation modals for destructive actions

---

## Auto-Save & Drafts

### Auto-Save

**User Story:** As a user, I don't want to think about saving. It should just happen.

**Current State:**
- Manual save only (Save button or Cmd+S)

**Behavior:**
- Save automatically every 10 seconds if content changed
- Visual indicator: "Saving..." → "Saved ✓" in navbar
- No interruption to editing

**Technical:**
- Debounced auto-save in IrariumStore
- Track `hasUnsavedChanges` flag
- Save only if changed (don't spam DB)
- Use PocketBase update API
- Handle save failures gracefully (show error, retry)

**Edge Cases:**
- User deletes all content → still save (empty is valid)
- Rapid changes → debounce properly
- Network offline → queue saves, sync when online

---

### Draft Recovery

**User Story:** If my browser crashes, I want to recover my unsaved work.

**Behavior:**
1. Save draft to localStorage every few seconds
2. On app load, check for drafts
3. If draft exists and newer than saved version → prompt:
   - "Recover unsaved changes from {time}?"
   - [Recover] [Discard]
4. If recover → load draft into editor

**Technical:**
- localStorage key: `irarium_draft_{id}`
- Store: content, children, timestamp
- Compare timestamps to detect newer drafts
- Clear draft after successful save

**Edge Cases:**
- Multiple devices → drafts are per-device (localStorage)
- Very large drafts → localStorage limits (~5MB)
- Offline mode → drafts are primary until sync

---

## Search

### Global Search (Across All Irariums)

**User Story:** I want to find an idea I wrote months ago, across all my irariums.

**UI:**
- Search icon in sidebar (or Cmd+K to open)
- Search modal overlays app
- Type query → live results
- Click result → navigate to that irarium + highlight idea

**Search Fields:**
- Irarium titles, descriptions
- Idea content (full-text)
- Tags

**Results Display:**
- Group by irarium
- Show matching idea with context (parent/children)
- Highlight matched terms
- Show date created/modified

**Technical:**
- Client-side search initially (fetch all user's irariums)
- Use Fuse.js or similar for fuzzy search
- Index: irarium metadata + flattened idea content
- Future: server-side search for performance

---

### Within-Irarium Search

**User Story:** In a large idea tree, I want to jump to a specific idea.

**UI:**
- Search bar in irarium view (or Cmd+F)
- Type query → matching ideas highlighted
- Arrow keys to cycle through matches
- Enter to navigate to match

**Technical:**
- Search current irarium's idea tree
- Highlight matches in UI
- Navigate to matched idea (make it active)

---

## Rich Content Support

### Image Uploads

**User Story:** I want to add screenshots and diagrams to my ideas.

**Behavior:**
1. In TipTap editor, click image icon or paste image
2. Image uploads to PocketBase files
3. Embedded in idea content as `<img>` tag
4. Responsive sizing in editor

**Technical:**
- TipTap Image extension
- Upload to PocketBase file storage (attachments)
- Store URL in content HTML
- Image optimization (resize, compress) on upload?

**Limits:**
- Max file size: 5MB per image
- Supported formats: PNG, JPG, GIF, WebP

---

### Code Blocks

**User Story:** I want to save code snippets with syntax highlighting.

**Behavior:**
1. TipTap code block extension
2. Select language from dropdown
3. Syntax highlighting in editor and view mode

**Technical:**
- TipTap CodeBlockLowlight extension
- Lowlight + highlight.js for syntax highlighting
- Support common languages: JS, Python, Go, Rust, etc.

---

### Link Previews

**User Story:** When I paste a URL, I want a rich preview.

**Behavior:**
- Paste URL → auto-convert to link
- Option to "Embed" → fetch Open Graph data
- Show preview card with title, description, image

**Technical:**
- TipTap Link extension (existing)
- Separate "Embed" feature
- Server-side endpoint to fetch OG data (avoid CORS)
- Cache previews to avoid re-fetching

---

## Idea Reorganization

### Drag-and-Drop Reordering

**User Story:** I want to reorder siblings by dragging.

**Behavior:**
- Hover over idea → drag handle appears
- Drag to new position among siblings
- Drop → reorder in tree

**Technical:**
- Use `@dnd-kit/core` or similar
- Update children array order in parent
- Auto-save after reorder

**Complexity:**
- Only within siblings initially (easier)
- Moving to different parent → harder (changes tree structure)

---

### Move to Different Parent

**User Story:** I want to move an idea to a different branch.

**Behavior:**
1. Right-click idea or keyboard shortcut
2. "Move to..." → shows tree picker
3. Select new parent → idea moves

**Technical:**
- Remove from current parent's children
- Add to new parent's children
- Update parentId
- Preserve idea's children (move whole subtree)

---

### Undo/Redo

**User Story:** I want to undo accidental changes.

**Behavior:**
- Cmd+Z to undo
- Cmd+Shift+Z to redo
- Works for: content edits, add/delete ideas, reordering

**Technical:**
- History stack in IrariumStore
- Snapshot state before each operation
- Apply reverse operation on undo
- Limit history (last 50 operations?)

**Complexity:**
- High — need to track all mutations
- TipTap has built-in undo for content
- Need custom undo for tree operations

---

## Tags & Organization

### Tags on Irariums

**Current State:** `tags` field exists but not used in UI

**Behavior:**
1. In irarium editor, "Tags" input field
2. Type tag, press Enter → added to list
3. Tags shown as pills, click X to remove
4. Auto-complete from existing tags

**Technical:**
- Update irarium record with tags array
- UI: tag input component (shadcn/ui has one)

---

### Tag Filtering

**User Story:** I want to see all irariums tagged "journal" or "writing".

**Behavior:**
- In /collection view, filter by tag
- Tag pills shown for each irarium
- Click tag → filter to that tag

**Technical:**
- Filter irariums array where tags include selected tag
- OR logic for multiple tags (show if any match)

---

## Visual Improvements

### Idea Colors/Icons

**User Story:** I want to visually differentiate ideas (e.g., questions vs answers).

**Behavior:**
- Right-click idea → "Set color" or "Set icon"
- Choose from palette or icon set
- Idea renders with colored border or icon prefix

**Technical:**
- Add `color` and `icon` fields to idea type
- Store as metadata in idea object
- Render in Idea.svelte component

---

### Customizable Themes

**User Story:** I want to choose light mode or customize colors.

**Behavior:**
- Settings → Appearance
- Select theme: Dark (default), Light, or Custom
- Custom: pick colors for background, text, accents

**Technical:**
- CSS custom properties
- Store theme in user settings
- Apply on load

---

## Implementation Priority

Based on effort vs value:

**Do First:**
1. Export as Markdown/JSON (low effort, high value)
2. Copy share link (low effort, medium value)
3. Settings page basics (low effort, table stakes)
4. Auto-save (medium effort, high value)

**Do Soon:**
5. Search (global & within) (medium effort, high value)
6. Tags UI (low effort, medium value)
7. Image uploads (medium effort, medium value)
8. Code blocks (low effort, medium value)

**Do Later:**
9. Drag-drop reordering (high effort, high value)
10. Undo/redo (high effort, medium value)
11. Draft recovery (medium effort, medium value)
12. Link previews (medium effort, low value)

---

These specs are starting points, not final designs. Build, test, iterate.
