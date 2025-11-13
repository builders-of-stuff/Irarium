# Technical Requirements

Standards and requirements for Irarium. These guide technical decisions and maintain quality.

---

## Performance Requirements

### Response Times

| Operation | Target | Maximum |
|-----------|--------|---------|
| App initial load | < 1s | < 2s |
| Navigate between ideas | < 50ms | < 100ms |
| Save irarium | < 500ms | < 1s |
| Load irarium | < 300ms | < 800ms |
| Search results (client-side) | < 200ms | < 500ms |

**Why These Targets:**
- Navigation must feel instant for flow state
- Saving can have slight delay (background operation)
- Loading tolerance is higher than navigation
- Search should feel responsive, not sluggish

### Size Limits

| Resource | Limit | Reason |
|----------|-------|--------|
| Individual idea content | 50KB | Prevent performance issues |
| Total irarium size | 5MB | Reasonable for most use cases |
| Number of ideas per irarium | 10,000 | Practical upper bound |
| Image upload size | 5MB | Balance quality vs storage |
| Total user storage | 100MB (free), 1GB (premium) | TBD based on costs |

### Optimization Targets

- **Time to Interactive (TTI):** < 2 seconds
- **First Contentful Paint (FCP):** < 1 second
- **Lighthouse Score:** > 90 (Performance, Accessibility, Best Practices)
- **Bundle Size:** < 500KB (gzipped, initial)

---

## Browser & Device Support

### Browsers (Desktop)
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

### Browsers (Mobile)
- iOS Safari: Last 2 iOS versions
- Chrome Android: Last 2 versions

### Device Support
- Desktop: 1280x720 minimum
- Tablet: 768x1024 minimum
- Mobile: 375x667 minimum (iPhone SE)

**Progressive Enhancement:**
- Core functionality works on all supported browsers
- Advanced features (e.g., clipboard API) degrade gracefully
- No IE support (it's 2025)

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
- All features accessible via keyboard
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts documented

**Screen Readers:**
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Proper heading hierarchy

**Visual:**
- Color contrast ratio ≥ 4.5:1 (normal text)
- Color contrast ratio ≥ 3:1 (large text)
- Text resizable up to 200% without breaking layout
- No content flash/animation > 3 times per second

**Testing:**
- Regular testing with VoiceOver (macOS/iOS)
- axe DevTools checks on new features
- Keyboard-only navigation testing

---

## Security Requirements

### Authentication
- Passwords hashed with bcrypt (PocketBase default)
- Session tokens httpOnly, secure, sameSite
- CSRF protection enabled
- Rate limiting on auth endpoints

### Data Privacy
- User data isolated by authentication
- No access to other users' private irariums
- Audit logs for sensitive operations
- GDPR-compliant data export/deletion

### Content Security
- XSS protection via content sanitization
- TipTap sanitizes HTML input
- No eval() or dangerous innerHTML usage
- CSP headers configured

### API Security
- Authentication required for all user operations
- Input validation on all endpoints
- Rate limiting on public endpoints
- No sensitive data in error messages

---

## Data Integrity Requirements

### Backup & Recovery
- Automated database backups (daily)
- Point-in-time recovery capability
- User-initiated data export (JSON)
- Restore testing quarterly

### Data Validation
- Schema validation on all writes
- Referential integrity (user → irariums)
- No orphaned data
- Data migration testing for schema changes

### Consistency
- Atomic operations (save all or nothing)
- No partial saves that corrupt data
- Conflict resolution for concurrent edits
- Eventual consistency acceptable for non-critical data

---

## Scalability Requirements

### Current Scale (MVP)
- 100 active users
- 1,000 irariums total
- 100,000 total ideas
- 1GB total storage

### Growth Targets (Year 1)
- 1,000 active users
- 10,000 irariums
- 1,000,000 ideas
- 10GB storage

### Architecture Considerations
- Stateless application servers (horizontal scaling)
- Database: PocketBase/SQLite sufficient for current scale
- Migration path to PostgreSQL if needed
- CDN for static assets
- File storage: local → S3/R2 if needed

---

## Testing Requirements

### Unit Tests
- Critical utility functions
- Store logic (IrariumStore, AuthStore)
- Data transformations
- Not required: 100% coverage, only critical paths

### Integration Tests
- User flows: signup → create → save → publish
- Authentication flows
- Error handling
- API interactions

### E2E Tests
- Smoke tests for critical paths
- Keyboard navigation testing
- Cross-browser testing (manual, quarterly)
- Performance regression tests

### Manual Testing Checklist
Before each release:
- [ ] Create new account
- [ ] Create, edit, save irarium
- [ ] Navigate with keyboard
- [ ] Export (Markdown, JSON)
- [ ] Mobile responsiveness
- [ ] Accessibility (VoiceOver)

---

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Explicit return types for public functions
- Interfaces for all data models

### Code Style
- Prettier for formatting (automated)
- ESLint for linting
- Consistent naming: camelCase (functions), PascalCase (components)
- Max function length: ~50 lines (guideline, not rule)

### Documentation
- JSDoc for complex functions
- README for major features
- Architecture decisions documented
- Code comments for "why", not "what"

### Git Practices
- Meaningful commit messages
- Atomic commits (one logical change)
- No direct commits to main (branch → merge)
- Squash before merge (clean history)

---

## Deployment Requirements

### Environments
- **Development:** Local (npm run dev)
- **Staging:** Optional preview deployments
- **Production:** Vercel/Netlify for frontend, VPS for PocketBase

### CI/CD
- Automated builds on push
- Run tests before deploy
- Automated linting/type checking
- Manual approval for production deploys (for now)

### Monitoring
- Error tracking: Sentry or similar
- Performance monitoring: Web Vitals
- Uptime monitoring: Simple ping service
- User analytics: Privacy-respecting (Plausible, no Google Analytics)

### Rollback Strategy
- Keep last 3 deployments
- Instant rollback capability
- Database migrations reversible
- Feature flags for risky changes

---

## Privacy & Ethics Requirements

### Data Collection
- **Collect:** Only what's necessary (account info, content, usage)
- **Don't collect:** Browsing history, device fingerprints, unnecessary metadata
- **Analytics:** Aggregate only, no individual tracking
- **Third-party:** Minimize external dependencies that track users

### Data Ownership
- Users own their content
- Easy export (no lock-in)
- Easy deletion (right to be forgotten)
- Transparent about data storage location

### Ethical AI (Future)
- No AI features without explicit user consent
- No training on user data without permission
- Transparency about AI usage
- Opt-in, not opt-out

---

## Dependencies & Maintenance

### Dependency Management
- Audit dependencies quarterly (npm audit)
- Update major versions intentionally, not automatically
- Pin versions for stability
- Document why each dependency exists

### Breaking Changes
- Avoid breaking changes to data model
- If necessary, provide migration scripts
- Deprecate features before removal
- Notify users of changes (changelog)

### Technical Debt
- Address high-priority debt quarterly
- Document known debt in code/issues
- Balance new features vs maintenance
- Refactor before it becomes painful

---

## Self-Hosting Requirements (Future)

### Make Self-Hosting Easy
- Docker compose file provided
- Single-command setup
- Environment variable configuration
- Documentation for common platforms (Digital Ocean, AWS, etc.)

### Support
- No official support for self-hosted instances
- Community forum for self-hosters
- Security updates published quickly
- Migration path from hosted → self-hosted

---

## Performance Monitoring

### Metrics to Track
- Page load times (P50, P95)
- API response times
- Error rates (by endpoint)
- Bundle size over time
- Database query performance

### Alerting
- Error rate > 1% → investigate
- Response time > 2s → investigate
- Uptime < 99% → alert

### Regular Reviews
- Monthly: Review performance metrics
- Quarterly: Lighthouse audits
- Yearly: Full performance optimization sprint

---

## Future-Proofing

### Technology Choices
- Prefer standards over frameworks
- Choose boring, proven tech over bleeding-edge
- Evaluate new dependencies carefully
- Plan for migration paths (e.g., PocketBase → PostgreSQL)

### Data Model
- Schema versioning
- Backward compatibility
- Migration scripts for all changes
- Export format stability (don't break old exports)

### API Stability
- No breaking changes to public APIs
- Versioned endpoints if needed
- Deprecation warnings before removal

---

These requirements evolve as the project grows. Review quarterly and adjust based on actual usage.
