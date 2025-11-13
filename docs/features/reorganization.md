# Idea Reorganization

**Priority:** P2 (Quality of Life)

---

## Story: Drag-and-Drop Reordering (Within Siblings)

**As a user, I want to** reorder ideas within siblings **so that** I can organize my thoughts without recreating them.

### Acceptance Criteria
- [ ] Hover over idea → drag handle appears (6 dots icon)
- [ ] Drag handle enables drag mode
- [ ] Drag idea to new position among siblings
- [ ] Visual feedback during drag (ghost element, drop zone indicator)
- [ ] Drop → reorder happens, auto-save triggered
- [ ] Undo/redo support (future)

### Technical Notes
- Use `@dnd-kit/core` or similar drag-and-drop library
- Update children array order in parent
- Only within siblings initially (simpler)
- Future: Cross-parent dragging (changes tree structure)

---

## Story: Move to Different Parent

**As a user, I want to** move an idea to a different branch **so that** I can restructure my idea tree.

### Acceptance Criteria
- [ ] Right-click idea → "Move to..." option (or keyboard shortcut)
- [ ] Opens tree picker modal showing irarium structure
- [ ] Select new parent idea
- [ ] Confirmation (optional): "Move '{idea}' to '{parent}'?"
- [ ] Idea moves with all its children (whole subtree)
- [ ] Visual update in tree
- [ ] Auto-save triggered

### Technical Notes
- Remove from current parent's children array
- Add to new parent's children array
- Update parentId field
- Preserve idea's entire subtree
- Validate: can't move to own descendant (prevent loops)

---

## Story: Collapse/Expand Branches

**As a user, I want to** collapse branches **so that** I can hide complexity and focus on high-level structure.

### Acceptance Criteria
- [ ] Collapse/expand icon next to ideas with children
- [ ] Click icon → collapse children (hide from view)
- [ ] Click again → expand children (show)
- [ ] Visual indicator (chevron icon: ▼ expanded, ▶ collapsed)
- [ ] Collapsed state persists during session (localStorage)
- [ ] Keyboard shortcut to collapse/expand current idea

### Technical Notes
- Track collapsed state in UI store (not in database)
- localStorage: `irarium_collapsed_{id}` → array of collapsed idea IDs
- Render children conditionally based on collapsed state
- Future: Collapse all, expand all buttons

---

## Story: Undo/Redo

**As a user, I want to** undo accidental changes **so that** I can experiment without fear.

### Acceptance Criteria
- [ ] Cmd+Z (Ctrl+Z) to undo
- [ ] Cmd+Shift+Z (Ctrl+Y) to redo
- [ ] Works for: content edits, add/delete ideas, reordering, moving
- [ ] Undo stack indicator (optional): shows how many actions can be undone
- [ ] Undo/redo buttons in UI (optional)
- [ ] Limit history (last 50 operations)

### Technical Notes
- History stack in IrariumStore
- Snapshot state before each operation
- Apply reverse operation on undo
- TipTap has built-in undo for content edits
- Custom undo for tree operations (add/delete/move/reorder)
- Complexity: High — need to track all mutations carefully

---

## Story: Duplicate Idea

**As a user, I want to** duplicate an idea **so that** I can reuse structure or content.

### Acceptance Criteria
- [ ] Right-click idea → "Duplicate" option
- [ ] Creates copy of idea as sibling (placed after original)
- [ ] Duplicates content and all children (deep copy)
- [ ] New IDs generated for duplicates
- [ ] Auto-save triggered

### Technical Notes
- Deep clone idea and children
- Generate new IDs (UUID)
- Insert into parent's children array
- Future: "Duplicate as template" (remove content, keep structure)

---

## Story: Delete Idea

**As a user, I want to** delete ideas **so that** I can remove content I no longer need.

### Acceptance Criteria
- [ ] Delete button or keyboard shortcut (Backspace/Delete on empty idea)
- [ ] Confirmation modal if idea has children: "Delete '{idea}' and all children?"
- [ ] Delete removes from parent's children array
- [ ] Deletes entire subtree (all descendants)
- [ ] Auto-save triggered
- [ ] Undo support (future)

### Technical Notes
- Remove from parent's children array
- Recursive delete of children
- Focus next sibling or parent after delete
- Future: "Archive" instead of delete (soft delete)
