# Whitelabel Settings Implementation Plan

> **For agentic workers:** Use parallel subagents with the ownership boundaries below; root integrates, reviews, verifies, and restarts the local service.

**Goal:** Make `/admin/settings` manage restaurant identity/contact details, site colors, additional admins, and domain routing.

**Architecture:** Extend the existing Nest/Fastify API and MongoDB configuration; reuse Angular's WhitelabelService and existing settings route. All management remains authenticated and tenant-scoped. No new runtime dependencies or external DNS writes.

**Tech stack:** NestJS 11, Fastify, Mongoose, bcrypt/JWT, Angular 19 reactive forms and CSS variables.

**Requirements:** User explicitly requested colors, adding admins, domain configuration, and subagents working through completion. Preserve the existing Figma-derived defaults and public functionality. Do not reset credentials or overwrite existing content. Additional admins have the same tenant-admin permissions as existing accounts; roles, deletion, and password resets are not requested.

## Shared API and type contract

- Public config adds `colors?: { primary: string; background: string; text: string; button: string }` and `domains?: string[]` (all accepted hostnames, including the primary `domain`). Defaults: `#344e41`, `#edede9`, `#171a17`, `#000000`.
- Existing `PUT /api/whitelabel` accepts `colors` alongside its existing name/contact fields; partial supplied palettes must be rejected or merged against defaults/current values explicitly. Validate six-digit hex colors server-side.
- `PUT /api/whitelabel/domain`: `{ domain: string, aliases: string[] }` returns public config. Hostnames are normalized, validated, unique across tenants; no schemes, paths, ports or wildcards. Preserve the request hostname as an alias on changes. Routing recognizes primary and aliases.
- Existing documents must remain reachable; migration fills hostnames without resetting content, users or credentials. Use unique indexed hostname membership covering primary and aliases so concurrent conflicting claims cannot succeed.
- `GET /api/admins` returns `[{ _id, username }]` for this tenant only. `POST /api/admins` accepts `{ username, password }` and returns `{ _id, username }`; passwords are hashed and never returned. Validate username and a minimum 12-character password within bcrypt's 72-byte limit. Duplicate usernames return a clear conflict without revealing another tenant.
- Admin deletion and role management are out of scope. DNS/HTTPS configuration is a prerequisite for externally resolving domains, not an action performed by this feature.
- Angular config updates apply CSS variables immediately; public sections use configured colors. Automatically choose a readable black/white foreground on primary and button colors.

## Review focus

- Anonymous and cross-tenant management requests must fail, including requests through aliases.
- Hostname conflicts, duplicate aliases, invalid domains and renaming the currently used hostname must not lock out admins or reroute another tenant.
- Existing accounts/content must survive the hostname migration and repeated seeds.
- Passwords and hashes must never appear in admin responses or public config.
- Theme changes must survive reload and keep readable foregrounds without replacing custom content.

## Task 1 — Backend settings and admin/domain management

**Owner:** backend subagent. **Files:** `server/src/**`, `server/test/**` only.

- [x] Add failing integration tests for palette persistence/validation, admin creation/login/list isolation, aliases, conflicts, current-host preservation, and migration preservation.
- [x] Implement the shared contract at the narrowest existing layer; keep Nest controllers, API errors, and authorization conventions.
- [x] Run `npm --prefix server test`; provide test counts and changed files to root.

## Task 2 — Settings UI

**Owner:** UI subagent. **Files:** settings component HTML/TS/SCSS/spec and `client/src/app/core/types/types.ts` only.

- [x] Add shared config fields and reactive forms for identity/contact, four colors, primary domain/aliases, and listing/adding admins.
- [x] Reuse WhitelabelService for saving configuration; use HttpClient for new domain/admin endpoints. A domain save must update the shared config signal.
- [x] Test success, validation, loading/error states, account password clearing, and domain form payloads using Angular HTTP testing.
- [x] Match the existing Alegreya/Lato, green/paper design; keep settings usable on narrow screens.

## Task 3 — Live theme application

**Owner:** theme subagent. **Files:** WhitelabelService and its tests, global/public component SCSS and header colors only; do not edit settings or shared types.

- [x] Add failing tests showing saved/loaded colors update document CSS variables; validate contrast foreground selection for light/dark colors.
- [x] Apply config palette on successful load/save; preserve defaults for existing records. Reuse tokens across public sections and buttons; prevent hardcoded defaults from hiding settings changes.
- [x] Keep admin forms readable and keep Figma defaults when no custom palette exists.

## Task 4 — Integration, review, and local launch

**Owner:** root. **Files:** README, integration fixes coordinated with owners, plan checklist.

- [x] Review contracts and all returned changes; run root production build, server integration suite, frontend ChromeHeadless suite.
- [x] Test actual color save/reload, alias routing, adding and logging in as an additional admin, and validation paths against a disposable database or clearly disposable records.
- [x] Update setup/API instructions; restart the existing local app, preserve credentials/data, and provide the settings link and verified limitations.

No commits, deployment, DNS changes, or account deletion are authorized or required by this plan.

## Completion evidence

- Production build passed; 65 frontend tests and 15 backend integration tests passed.
- Disposable browser checks: saved palette immediately applied and survived reload; domain/aliases saved and each hostname resolved; new admin signed in and accessed settings.
- Focused review found original-hostname removal could break seed; fixed with existing-admin tenant lookup and regression, re-reviewed successfully.
- Local database migration/seed completed without reset; app restarted at port 3000. External DNS and HTTPS were not changed.
