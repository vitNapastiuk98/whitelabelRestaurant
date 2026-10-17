# Nest12 architecture and free publishing

- [x] Verify latest stable Nest12.1.3/Fastify5.12.5 and current free hosting terms.
- [x] Archive backend before upgrade, preserve MongoDB collections and API contracts.
- [x] Replace generic route dispatcher with Nest feature controllers/services/modules and tenant/admin guards.
- [x] Add DB readiness endpoint and Render hostname bootstrap support; test preserved behavior.
- [x] Prepare non-root production Docker image, secret exclusions, and Render Free Blueprint.
- [x] Prove clean Docker build and production container behavior with disposable MongoDB.
- [x] Review final changes, run appropriate tests, restart local service.
- [ ] Publish on Render with Atlas after account connections are available.

Account state: GitHub CLI authenticated; Render browser signed out; Render/Atlas connectors suggested and connection requested. No cloud resource created, no paid plan selected, no local restaurant data uploaded.

Verification: 18 backend integration tests pass; server production audit reports zero findings. Docker clean install/build passed after client lock repair. Non-root image passed runtime smoke checks on provider-style dynamic port10000: tenant-independent health, Render hostname seed, Angular hashed assets, login, protected admins, config write, container restart, persisted data and existing-admin login. Disposable containers/database are removed after checks.
