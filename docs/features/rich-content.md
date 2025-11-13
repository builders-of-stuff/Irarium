# Rich Content Support

**Priority:** P2 (Quality of Life)

---

## Story: Image Uploads

**As a user, I want to** add images to my ideas **so that** I can include screenshots, diagrams, and visual inspiration.

### Acceptance Criteria
- [ ] Image button/icon in TipTap editor toolbar
- [ ] Click opens file picker (PNG, JPG, GIF, WebP)
- [ ] Paste image from clipboard also works
- [ ] Image uploads to PocketBase file storage
- [ ] Embedded in idea content as `<img>` tag
- [ ] Responsive sizing (max-width 100%)
- [ ] Loading indicator during upload
- [ ] Max file size: 5MB per image (validation + error message)
- [ ] Delete image option

### Technical Notes
- TipTap Image extension
- Upload to PocketBase attachments
- Store URL in content HTML
- Future: Image optimization (resize, compress) on upload
- Future: Alt text for accessibility
- Future: Image gallery view

---

## Story: Code Blocks

**As a user, I want to** save code snippets with syntax highlighting **so that** I can document technical notes.

### Acceptance Criteria
- [ ] Code block button in TipTap toolbar
- [ ] Insert code block with language selector dropdown
- [ ] Syntax highlighting for common languages (JavaScript, Python, Go, Rust, TypeScript, HTML, CSS, etc.)
- [ ] Monospace font, dark theme styling
- [ ] Line numbers (optional toggle)
- [ ] Copy code button
- [ ] Keyboard shortcut to insert (e.g., ```language)

### Technical Notes
- TipTap CodeBlockLowlight extension
- Lowlight + highlight.js for syntax highlighting
- Bundle common language definitions
- Future: Line highlighting, diff view

---

## Story: Link Previews

**As a user, I want to** see rich previews when I paste URLs **so that** links are more informative.

### Acceptance Criteria
- [ ] Paste URL → auto-convert to clickable link
- [ ] Option to "Embed" or "Preview" (context menu or button)
- [ ] Fetch Open Graph metadata (title, description, image)
- [ ] Show preview card with title, description, thumbnail
- [ ] Fallback to plain link if preview fails
- [ ] Works for common sites (YouTube, Twitter, GitHub, etc.)

### Technical Notes
- TipTap Link extension (existing)
- Separate "Embed" feature for rich previews
- Server-side endpoint to fetch OG data (avoid CORS)
- Cache previews to avoid re-fetching
- Future: Native embeds for YouTube, Twitter, etc.

---

## Story: Tables

**As a user, I want to** create tables **so that** I can organize structured data.

### Acceptance Criteria
- [ ] Table button in TipTap toolbar
- [ ] Insert table with size picker (rows × columns)
- [ ] Edit table cells inline
- [ ] Add/remove rows and columns
- [ ] Table header row styling
- [ ] Responsive table on mobile (scrollable)

### Technical Notes
- TipTap Table extension
- Basic styling with Tailwind
- Future: Cell merging, advanced formatting

---

## Story: Embeds (YouTube, etc.)

**As a user, I want to** embed videos and other media **so that** I can include rich content in my ideas.

### Acceptance Criteria
- [ ] Paste YouTube URL → option to embed video
- [ ] Embedded video plays inline (iframe)
- [ ] Responsive embed sizing
- [ ] Support for: YouTube, Vimeo, SoundCloud, CodePen, etc.
- [ ] Remove embed option

### Technical Notes
- TipTap custom extension for embeds
- Allowlist of supported embed providers
- Security: sanitize iframe sources
- Future: Custom embed support via URL patterns
