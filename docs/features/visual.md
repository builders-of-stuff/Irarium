# Visual Improvements

**Priority:** P2 (Quality of Life)

---

## Story: Idea Colors

**As a user, I want to** assign colors to ideas **so that** I can visually differentiate types (e.g., questions vs answers, important vs notes).

### Acceptance Criteria
- [ ] Right-click idea → "Set color" option
- [ ] Color picker with predefined palette (8-12 colors)
- [ ] Idea renders with colored left border or background tint
- [ ] Color persists in database
- [ ] Remove color option (reset to default)

### Technical Notes
- Add `color` field to idea type (nullable, hex color)
- Store in idea object
- Render in Idea.svelte with CSS border or background
- Future: Custom color picker (not just palette)

---

## Story: Idea Icons

**As a user, I want to** add icons to ideas **so that** I can visually categorize them.

### Acceptance Criteria
- [ ] Right-click idea → "Set icon" option
- [ ] Icon picker with common icons (lightbulb, question mark, star, etc.)
- [ ] Icon displayed as prefix to idea content
- [ ] Icon persists in database
- [ ] Remove icon option

### Technical Notes
- Add `icon` field to idea type (nullable, icon name)
- Use icon library (Lucide, Hero Icons, etc.)
- Render in Idea.svelte before content
- Future: Emoji picker as icon option

---

## Story: Customizable Themes

**As a user, I want to** choose a theme **so that** I can make Irarium comfortable for my eyes.

### Acceptance Criteria
- [ ] Settings → Appearance section
- [ ] Theme options: Dark (default), Light, Auto (system preference)
- [ ] Theme applies instantly (no reload)
- [ ] Persists across sessions (saved in user settings)
- [ ] Smooth transition between themes (CSS transitions)

### Technical Notes
- CSS custom properties for theming
- Store theme in userSettings
- Apply theme class to root element
- Future: Custom themes, accent color picker

---

## Story: Better Mobile Experience

**As a user, I want to** use Irarium on mobile **so that** I can capture ideas on the go.

### Acceptance Criteria
- [ ] Responsive layout (works on phones, tablets)
- [ ] Touch-friendly UI (larger tap targets)
- [ ] Mobile keyboard doesn't obscure editor
- [ ] Swipe gestures for navigation (optional)
- [ ] Hamburger menu for sidebar on mobile
- [ ] Optimized performance (fast rendering)

### Technical Notes
- Test on various devices/screen sizes
- CSS media queries for responsive design
- Touch event handling (not just click)
- Viewport meta tag configured
- Future: PWA (installable, offline support)

---

## Story: Smooth Animations

**As a user, I want to** see smooth transitions **so that** the interface feels polished.

### Acceptance Criteria
- [ ] Idea navigation (fade-in, slide)
- [ ] Idea add/delete (expand/collapse animation)
- [ ] Modal open/close (fade + scale)
- [ ] Dropdown menus (slide down)
- [ ] All animations respect `prefers-reduced-motion` (accessibility)
- [ ] Animations are fast (200-300ms), not slow

### Technical Notes
- Svelte transitions (fade, slide, scale)
- CSS transitions for simple cases
- `@media (prefers-reduced-motion: reduce)` disables animations
- Don't overdo it — subtle, fast, purposeful

---

## Story: Dark Mode Refinements

**As a user, I want to** see refined dark mode styling **so that** the interface is comfortable at night.

### Acceptance Criteria
- [ ] Dark mode uses proper contrast ratios (WCAG AA)
- [ ] No pure black (#000) — use dark gray (#0a0a0a or similar)
- [ ] Input fields, buttons have good contrast
- [ ] TipTap editor styled for dark mode
- [ ] Syntax highlighting adjusted for dark background
- [ ] No white flashes on load

### Technical Notes
- Test all UI components in dark mode
- Adjust TipTap theme colors
- Use CSS variables for consistent theming
- Future: AMOLED mode (true black for OLED screens)

---

## Story: Loading States

**As a user, I want to** see clear loading indicators **so that** I know the app is working.

### Acceptance Criteria
- [ ] Loading spinner on initial page load
- [ ] Skeleton loaders for irariums list (not just blank)
- [ ] Progress indicators for long operations (export, bulk actions)
- [ ] Disable buttons during async operations (prevent double-click)
- [ ] Error states with retry options

### Technical Notes
- Svelte transitions for loaders
- Skeleton UI components (shadcn/ui)
- Loading state tracking in stores
- Future: Optimistic UI updates (show changes before server confirms)

---

## Story: Improved Typography

**As a user, I want to** see beautiful typography **so that** reading is pleasant.

### Acceptance Criteria
- [ ] High-quality fonts (Inter, Geist, or similar)
- [ ] Proper line height and spacing
- [ ] Responsive font sizes (fluid typography)
- [ ] Monospace font for code (Fira Code, JetBrains Mono, etc.)
- [ ] Text remains readable at all zoom levels

### Technical Notes
- Font loading optimization (FOUT prevention)
- CSS line-height, letter-spacing adjustments
- `clamp()` for fluid typography
- Future: Font customization in settings
