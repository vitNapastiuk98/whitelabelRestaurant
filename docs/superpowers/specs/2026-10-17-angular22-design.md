# Angular 22 frontend modernization

Upgrade the existing restaurant application to latest stable Angular 22.2.3, keeping its NestJS API, URLs, credentials, stored content and visual design. This is a frontend migration, not a product rewrite.

Feature ownership: restaurant (public content and editor), identity (login/session/guards), reservations (booking/inbox), whitelabel (configuration/theme/admin management). Each feature owns its domain contracts, data access and pages. Domain types must not import Angular UI or dialogs. Shared contains reusable UI and site layout; core contains transport/interceptors only. DDD is used for explicit business boundaries and typed contracts, without repository/interface boilerplate.

Use Angular signals/computed for reactive UI state, httpResource for configuration and authenticated collection reads, and signal forms for all user-editable forms including nested content editors. Keep HttpClient commands for mutations; never trigger mutations from resources. Preserve validation, pending/error/retry behavior and canceled-dialog isolation. Angular22 runs zoneless. No new product features, backend changes or data migrations are needed.

Root owns feature moves/domain/resource integration; three subagents own dependency upgrade, primary forms, and content editors/uploader. Verify production build, meaningful frontend behavior tests, existing backend suite and local browser flows. Keep rollback archive at /tmp/restaurant-client-before-angular22.tgz; do not reset pre-existing uncommitted changes. Restart local server after frontend build and leave settings accessible.
