# syntax=docker/dockerfile:1
#
# Self-contained build of Cais (fork of Portainer CE): compiles the frontend and the
# Go server inside containers, so no local Go/Node toolchain is required.
#
#   docker build -f build/cais/Dockerfile -t cais:local .
#

ARG NODE_VERSION=22
ARG GO_VERSION=1.26

FROM node:${NODE_VERSION}-bookworm AS client
WORKDIR /src
ENV CI=true
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=cais-pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
RUN NODE_ENV=production pnpm run build --config webpack/webpack.production.js


FROM golang:${GO_VERSION}-bookworm AS server
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,id=cais-gomod,target=/go/pkg/mod go mod download
COPY api ./api
COPY pkg ./pkg
ARG GIT_COMMIT=unspecified
ARG IMAGE_TAG=local
RUN --mount=type=cache,id=cais-gomod,target=/go/pkg/mod \
    --mount=type=cache,id=cais-gobuild,target=/root/.cache/go-build \
    BUILD=github.com/portainer/portainer/pkg/build && \
    CGO_ENABLED=0 go build -trimpath -o /out/portainer \
      -ldflags "-s \
        -X '${BUILD}.ImageTag=${IMAGE_TAG}' \
        -X '${BUILD}.GitCommit=${GIT_COMMIT}' \
        -X '${BUILD}.GoVersion=$(go version | awk '{print $3}')' \
        -X '${BUILD}.DepComposeVersion=$(go list -m -f '{{.Version}}' github.com/docker/compose/v2)' \
        -X '${BUILD}.DepDockerVersion=$(go list -m -f '{{.Version}}' github.com/docker/docker)'" \
      ./api/cmd/portainer


FROM alpine:3.22 AS production
RUN apk add --no-cache ca-certificates tzdata

COPY mustache-templates /mustache-templates/
COPY --from=server /out/portainer /portainer
COPY --from=client /src/dist/public /public/

VOLUME /data
WORKDIR /

EXPOSE 9000
EXPOSE 9443
EXPOSE 8000

ARG GIT_COMMIT=unspecified
LABEL org.opencontainers.image.title="Cais" \
  org.opencontainers.image.description="Container management for Docker, Swarm and Kubernetes. Fork of Portainer CE (zlib license)." \
  org.opencontainers.image.revision=$GIT_COMMIT \
  org.opencontainers.image.licenses="Zlib" \
  org.opencontainers.image.base.name="alpine:3.22"

ENTRYPOINT ["/portainer"]
