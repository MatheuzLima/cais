# Cais

Lightweight, bilingual (English / Brazilian Portuguese) container management UI for Docker and Swarm.
Fork of Portainer CE (Go backend in `api/` and `pkg/`, hybrid AngularJS + React frontend in `app/`).

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the project rules and [ROADMAP.md](ROADMAP.md) for open work.

## Project rules

- **Product name**: never write "Portainer" in UI text. Use `APP_NAME` from `app/branding.ts`
  (values in `app/branding.json`). Internal identifiers (Go module path, `portainer.*` UI-router states,
  API names) stay as upstream to keep merges easy.
- **i18n**: keys are the English source strings. Every new UI string needs an entry in
  `translations/pt-BR/translation.json`. Plain JSX/HTML text is translated at runtime by `app/i18n-dom.ts`;
  sentences with variable parts use `t()` with interpolation (`__var__` in AngularJS templates).
  `node scripts/i18n/extract-strings.mjs` lists untranslated strings.
- **Paid upstream features**: features flagged `Edition.BE` in
  `app/react/portainer/feature-flags/feature-flags.service.ts` are hidden, never teased. Only flip one to
  `Edition.CE` together with a working backend implementation.
- **Kubernetes / Azure** are hidden while `enableKubernetes` is false in `app/branding.json`.
- **Upstream merges** (`git fetch upstream && git merge upstream/develop`): prefer central changes
  (shared components, flags, dictionary) over edits spread across many files.

## Commands

```bash
pnpm install
pnpm dev            # webpack dev server on :8999, proxies /api to :9000
pnpm typecheck
pnpm exec eslint "./**/*.{js,jsx,ts,tsx}"   # `pnpm lint` also applies --fix
pnpm test           # vitest
pnpm format         # prettier

go vet ./api/... ./pkg/...
go test ./api/... ./pkg/...

docker build -f build/cais/Dockerfile -t cais:local .   # full image, no local Go needed
```

CI (`.github/workflows/ci.yml`) runs the frontend checks, the Go checks and an image build on every PR.
Pushing a `v*` tag publishes `matheuslimams/cais` for amd64 and arm64 (`.github/workflows/release.yml`).

## Development servers

- Frontend: http://localhost:8999
- Backend: http://localhost:9000 (HTTP) / https://localhost:9443 (HTTPS)
