# Nest12 architecture and free publishing

- [x] Verify latest stable Nest12.1.3/Fastify5.12.5 and current free hosting terms.
- [x] Archive backend before upgrade, preserve MongoDB collections and API contracts.
- [x] Replace generic route dispatcher with Nest feature controllers/services/modules and tenant/admin guards.
- [x] Add DB readiness endpoint and Render hostname bootstrap support; test preserved behavior.
- [x] Prepare non-root production Docker image, secret exclusions, and Render Free Blueprint.
- [x] Prove clean Docker build and production container behavior with disposable MongoDB.
- [x] Review final changes, run appropriate tests, restart local service.
- [x] Publish on Render with Atlas after account connections are available.

Account state: signed in through GitHub (Render) and the existing Google account (Atlas). Both dashboards accessible. Free Render web service and Atlas Free cluster created; no paid plan selected.

Verification: 18 backend integration tests pass; server production audit reports zero findings. Docker clean install/build passed after client lock repair. Non-root image passed runtime smoke checks on provider-style dynamic port10000: tenant-independent health, Render hostname seed, Angular hashed assets, login, protected admins, config write, container restart, persisted data and existing-admin login. Disposable containers/database are removed after checks.

## Live deployment

- URL: https://whitelabel-restaurant.onrender.com
- Render service: srv-db9oisnavr4c73erfgdg; Blueprint: exs-db9oi2fbtjjs73cg2h0g.
- Atlas project: WhitelabelRestaurant (6ad3887f1c2693ee120134f4); cluster: restaurant-free, AWS Frankfurt, Free tier.
- Database user is restricted to readWrite on restaurant; only Render Frankfurt outbound ranges remain allowed. Temporary setup IP and credential file removed.
- Verified public health/config/settings HTTP200 and actual admin login. Public API excludes integration secrets. Website content/contact details/branding synchronized from local; hosted hostname and generated admin account preserved. Local bookings and accounts were not migrated.
- Initial username admin; generated password remains private in Render Environment under ADMIN_PASSWORD.
