# Settings Page

**Priority:** P1 (Blocking Daily Use)

**Current State:** Empty placeholder at `/settings`

---

## Story: Change Email

**As a user, I want to** change my email address **so that** I can keep my account information up to date.

### Acceptance Criteria
- [ ] Settings page has "Security" section
- [ ] Email change form with current email displayed
- [ ] Validation for email format
- [ ] Requires password confirmation for security
- [ ] Success message on update
- [ ] Email verification sent to new address (if applicable)

### Technical Notes
- Use PocketBase SDK email update method
- Handle errors (email already in use, invalid format)

---

## Story: Change Password

**As a user, I want to** change my password **so that** I can maintain account security.

### Acceptance Criteria
- [ ] Password change form in Security section
- [ ] Fields: Current password, New password, Confirm new password
- [ ] Password strength indicator
- [ ] Validation: minimum length, confirmation match
- [ ] Success message on update
- [ ] Re-authentication required after change

### Technical Notes
- Use PocketBase SDK password update method
- Client-side and server-side validation

---

## Story: Delete Account

**As a user, I want to** delete my account **so that** I have the right to leave and remove my data.

### Acceptance Criteria
- [ ] "Delete Account" option in Data & Privacy section
- [ ] Opens confirmation modal with warnings
- [ ] Requires typing "DELETE" or similar confirmation
- [ ] Requires password confirmation
- [ ] All user data deleted (irariums, settings, etc.)
- [ ] Redirects to homepage after deletion
- [ ] No way to recover after deletion (clear warning)

### Technical Notes
- Decide: soft delete vs hard delete
- Cascade delete all user's irariums
- Future: Grace period before permanent deletion

---

## Story: Download All Data

**As a user, I want to** download all my data at once **so that** I have a complete backup.

### Acceptance Criteria
- [ ] "Download All Data" button in Data & Privacy section
- [ ] Generates ZIP file containing all irariums as JSON
- [ ] Each irarium in separate file: `{irarium-title}.json`
- [ ] Includes account metadata
- [ ] Progress indicator for large exports
- [ ] Downloads as `irarium-export-{timestamp}.zip`

### Technical Notes
- Client-side ZIP generation
- Fetch all user's irariums
- Use JSZip or similar library
- Future: Include images/attachments

---

## Story: Profile Management

**As a user, I want to** update my profile information **so that** I can customize my account.

### Acceptance Criteria
- [ ] Profile section with name, username, bio fields
- [ ] Avatar upload (image file picker)
- [ ] Image preview before upload
- [ ] Validation: file size limit (5MB), format (PNG, JPG, GIF)
- [ ] Save button updates profile
- [ ] Success message on update

### Technical Notes
- Profile update logic may already exist in `/profile` - consolidate
- Upload avatar to PocketBase file storage
- Future: Crop/resize tool
