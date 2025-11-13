# Export & Sharing

**Priority:** P1 (Blocking Daily Use)

---

## Story: Export as Markdown

**As a user, I want to** export my irarium as Markdown **so that** I can use it in other tools or share as a readable document.

### Acceptance Criteria
- [ ] "Export" button visible in irarium view (near Save/Publish)
- [ ] Click opens export options modal
- [ ] Markdown option downloads `{irarium-title}.md` file
- [ ] Format uses heading levels for idea depth (# root, ## child, ### grandchild)
- [ ] HTML content from TipTap converted to Markdown properly
- [ ] Very deep nesting (>6 levels) handled gracefully (bullets or continued ######)

### Technical Notes
- Traverse idea tree depth-first
- Use Turndown library for HTML→MD conversion
- Client-side generation, no server needed
- Future: YAML frontmatter with metadata

---

## Story: Export as JSON

**As a user, I want to** export my irarium as JSON **so that** I can back up my data or migrate to another system.

### Acceptance Criteria
- [ ] Export modal includes "JSON" option
- [ ] Downloads `{irarium-title}.json` file
- [ ] Contains complete irarium data structure (id, title, description, tags, content, children)
- [ ] JSON is pretty-printed (2-space indent) for readability
- [ ] Includes all metadata (timestamps, public status, etc.)

### Technical Notes
- Direct export of irarium object from store
- Client-side only
- Future: Import JSON to restore/duplicate, bulk export all irariums

---

## Story: Copy Share Link

**As a user, I want to** easily copy a shareable link **so that** I can share my public irarium without manually copying the URL.

### Acceptance Criteria
- [ ] "Share" button appears next to Publish toggle
- [ ] Button only visible when irarium is public
- [ ] Click copies full URL to clipboard (`https://irarium.app/irarium/{id}`)
- [ ] Toast notification: "Link copied!"
- [ ] Fallback for older browsers without Clipboard API

### Technical Notes
- Use `navigator.clipboard.writeText(url)`
- Future: QR code generation, Open Graph tags, embed code

---

## Story: Print View

**As a user, I want to** print my irarium **so that** I can read it on paper or save as PDF.

### Acceptance Criteria
- [ ] Print option in export menu
- [ ] Opens printer-friendly view (clean, no UI chrome)
- [ ] Hierarchical structure preserved in print layout
- [ ] Works with browser's native print dialog

### Technical Notes
- Use CSS print media queries
- Hide navigation, buttons, non-content elements
- Future: Custom print styling options
