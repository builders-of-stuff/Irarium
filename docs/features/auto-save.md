# Auto-Save & Drafts

**Priority:** P1 (Blocking Daily Use)

**Current State:** Manual save only (Save button or Cmd+S)

---

## Story: Auto-Save

**As a user, I don't want to** think about saving **so that** I can focus on my ideas without worrying about data loss.

### Acceptance Criteria
- [ ] Auto-save triggers every 10 seconds if content changed
- [ ] Visual indicator in navbar: "Saving..." → "Saved ✓"
- [ ] No interruption to editing flow
- [ ] Only saves if content actually changed (no empty saves)
- [ ] Handles save failures gracefully (shows error, retries)
- [ ] Manual save (Cmd+S) still works and triggers immediate save

### Technical Notes
- Debounced auto-save in IrariumStore
- Track `hasUnsavedChanges` flag
- Use PocketBase update API
- Queue saves if offline, sync when online
- Edge case: User deletes all content → still save (empty is valid)

---

## Story: Draft Recovery

**As a user, I want to** recover my unsaved work if my browser crashes **so that** I never lose progress.

### Acceptance Criteria
- [ ] Draft saved to localStorage every few seconds
- [ ] On app load, check for drafts newer than saved version
- [ ] If draft exists, show prompt: "Recover unsaved changes from {time}?"
- [ ] Options: [Recover] [Discard]
- [ ] If recover, load draft into editor
- [ ] Draft cleared after successful save to server
- [ ] Works for new (unsaved) irariums and existing ones

### Technical Notes
- localStorage key: `irarium_draft_{id}`
- Store: content, children, timestamp
- Compare draft timestamp to last saved timestamp
- Edge cases:
  - Multiple devices → drafts are per-device (localStorage)
  - Very large drafts → localStorage ~5MB limit
  - Offline mode → drafts are primary until sync

---

## Story: Offline Support

**As a user, I want to** work without internet **so that** I can capture ideas anywhere and sync later.

### Acceptance Criteria
- [ ] Detect offline/online status
- [ ] When offline, show indicator in UI
- [ ] All edits saved to localStorage
- [ ] When online, sync local changes to server
- [ ] Conflict resolution if server version changed
- [ ] Visual feedback during sync

### Technical Notes
- Use `navigator.onLine` to detect connectivity
- Service worker for offline caching (future)
- Queue pending saves, process when online
- Conflict resolution strategy: last-write-wins or manual merge
- This is a larger feature - may be P2, not P1

---

## Story: Save Status Indicator

**As a user, I want to** see save status clearly **so that** I know when my work is safe.

### Acceptance Criteria
- [ ] Indicator in navbar shows: "Saved ✓", "Saving...", or "Unsaved changes"
- [ ] Updates in real-time as user types
- [ ] Clear visual distinction (colors, icons)
- [ ] Error state if save fails: "Save failed - Retry"

### Technical Notes
- Reactive state from IrariumStore
- Debounce status updates to avoid flicker
- Future: Timestamp of last save
