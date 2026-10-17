<p align="center">
  <img src="app/assets/images/brand/cais-logo-black.svg" alt="Cais" width="232" />
</p>

# Cais

**Cais** is a lightweight container management UI for Docker and Swarm. It is a fork of
[Portainer CE](https://github.com/portainer/portainer) with its own identity and a
bilingual interface (English / Português do Brasil).

> Cais (pt): *wharf, quay*. The place where ships, and their containers, dock.

## What is different from Portainer CE

| Area | Change |
| ---- | ------ |
| Identity | Name, logo, favicons, page titles and footer come from [`app/branding.json`](app/branding.json); the UI shows the app name wherever upstream said "Portainer", and help links point to this repository |
| i18n | English and Brazilian Portuguese, with a language switcher in the user menu and on the login page |
| No upsell | Upstream greys out paid "Business Feature" options as teasers. Cais hides every option it does not implement, so nothing on screen is locked |
| Unlocked | GitOps *Force redeployment* and *Re-pull image* (the server already implemented them; re-pull is now honoured and on by default) |
| Docker focus | Kubernetes and Azure ACI are not offered in the environment wizard or settings. Set `"enableKubernetes": true` in `app/branding.json` to bring them back |
| Build | [`build/cais/Dockerfile`](build/cais/Dockerfile) builds client and server inside Docker; no local Go needed |

Everything else (Docker, Swarm, Podman, Edge agents, stacks, GitOps, templates, registries, teams, OAuth/LDAP login, backups) is upstream Portainer CE.

Paid upstream features (RBAC roles, activity/authentication audit logs, S3 backups, container and non-Git stack webhooks, custom login banner, Active Directory/OpenLDAP presets, Kubernetes extras) are **not** part of the open-source code and are not available in Cais.

### Resource usage

The server is a single Go binary. Measured with Docker Desktop on Linux: ~20 MB RAM idle and ~35 MB peak with 15 containers and 480 parallel API requests, with no tuning needed. The image is about 200 MB, so a 1 GB VPS is plenty.

## Run

The image is published on Docker Hub as [`matheuslimams/cais`](https://hub.docker.com/r/matheuslimams/cais) (linux/amd64):

```bash
docker volume create cais_data
docker run -d --name cais --restart unless-stopped   -p 9443:9443 -p 9000:9000   -v /var/run/docker.sock:/var/run/docker.sock   -v cais_data:/data   matheuslimams/cais:latest
```

Or with Compose: `docker compose -f docker-compose.cais.yml up -d` (add `--build` to build from this checkout).

Open https://SERVER:9443 (self-signed certificate) or http://SERVER:9000 and create the admin user within a few minutes of starting it. The setup token is printed in `docker logs cais`.

## Develop

Requirements: Node 22+, pnpm 10 (`npx pnpm@10.26.2`), Docker.

```bash
pnpm install
pnpm dev          # webpack dev server on :8999, proxies /api to :9000
pnpm typecheck
pnpm test
```

For the API on :9000 during development, run the image built above, or install Go 1.26 and use `make build-server`.

## Translating

Translation keys are the English source strings (gettext style), so anything not yet
translated falls back to English and the UI can be translated incrementally.

- React: `const { t } = useTranslation(); t('Containers')`
- AngularJS templates: `{{ 'Log in to your account' | translate }}`
- Interpolation: `t('About {{name}}', { name })`
- Interpolation in AngularJS templates uses `__name__`, since `{{name}}` would close the surrounding expression:
  `{{ 'At least __count__ characters' | translate: { count: n } }}`

Add the translated string to [`translations/pt-BR/translation.json`](translations/pt-BR/translation.json).
`translations/en/translation.json` stays empty unless an English string needs to differ from its key.

Most of the inherited UI writes English straight into JSX and AngularJS templates. Instead of
wrapping every string, [`app/i18n-dom.ts`](app/i18n-dom.ts) watches the page and replaces any
text node, `placeholder`, `title`, `aria-label` or `alt` whose whole content is a dictionary key.
Keys may contain `__0__`, `__1__`... to match a variable part (`"Image: __0__": "Imagem: __0__"`).
Code blocks, editors and terminals are left untouched. The same module replaces the word
"Portainer" with the app name everywhere, including messages coming from the server.

So for most strings, translating means adding the English text as it appears on screen to the
dictionary. To list what is still missing:

```bash
node scripts/i18n/extract-strings.mjs > missing.json
```

Use `t()` for text built from several pieces (a sentence with a number in the middle, for
example), since the DOM translator only matches whole text nodes.

Kubernetes and Azure screens are skipped by the extractor while `enableKubernetes` is false.
Adding a language means a new folder in `translations/` and an entry in `supportedLanguages`
in [`app/i18n.ts`](app/i18n.ts).

## Branding

Change [`app/branding.json`](app/branding.json) (name, description, links, theme color) and the
SVGs in [`app/assets/images/brand`](app/assets/images/brand). `logo_alt*.svg`, the favicons in
`app/assets/ico` and `safari-pinned-tab.svg` are derived from the brand mark.

## Syncing with Portainer

The original project is the `upstream` remote:

```bash
git fetch upstream
git merge upstream/develop
```

## License

Portainer CE is distributed under the [zlib license](LICENSE), which allows modified
redistribution provided that altered versions are plainly marked as such and are not
misrepresented as the original software. Cais is an altered version of Portainer CE; it
is not affiliated with or endorsed by Portainer.io. "Portainer" is a trademark of its
owners. The original README is kept at [`docs/UPSTREAM_README.md`](docs/UPSTREAM_README.md).
