# renovate: datasource=docker depName=ghcr.io/ivanjosipovic/images/coder-dotnet
ARG CODER_DOTNET_VERSION=0.7.15
FROM ghcr.io/ivanjosipovic/images/coder-dotnet:${CODER_DOTNET_VERSION}

USER root

WORKDIR /workspace
RUN mkdir -p /workspace && chown coder:coder /workspace

# Paperclip's sandbox pod runs as UID/GID 1000 and overrides the image command.
USER coder

RUN set -eu; \
    for command in bash node npm codex claude copilot opencode; do \
        command -v "$command"; \
    done; \
    codex --version; \
    claude --version; \
    copilot --version; \
    opencode --version

LABEL org.opencontainers.image.title="Paperclip agent runtime base" \
      org.opencontainers.image.description="Paperclip sandbox base with Codex, Claude, Copilot, and OpenCode CLIs"
