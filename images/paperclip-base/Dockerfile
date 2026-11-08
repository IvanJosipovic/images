# Pin the official upstream runtime to its published immutable commit tag.
ARG PAPERCLIP_BASE_VERSION=git-38d8f371722b315d2fb3bbaa512518742e33ce2f
FROM ghcr.io/paperclipai/agent-runtime-base:${PAPERCLIP_BASE_VERSION}

USER root

# renovate: datasource=npm depName=npm
ARG NPM_VERSION=12.2.2

# renovate: datasource=npm depName=@opencode/cli
ARG OPENCODE_VERSION=2.2.6

# renovate: datasource=npm depName=@openai/codex
ARG CODEX_CLI_VERSION=0.167.0

# renovate: datasource=npm depName=@github/copilot
ARG COPILOT_CLI_VERSION=1.0.107

# renovate: datasource=npm depName=@anthropic-ai/claude-code
ARG CLAUDE_CLI_VERSION=2.1.319

RUN npm install --global "npm@${NPM_VERSION}" && \
    npm install --global \
        --allow-scripts=@opencode/cli \
        --allow-scripts=@anthropic-ai/claude-code \
        "@opencode/cli@${OPENCODE_VERSION}" \
        "@openai/codex@${CODEX_CLI_VERSION}" \
        "@github/copilot@${COPILOT_CLI_VERSION}" \
        "@anthropic-ai/claude-code@${CLAUDE_CLI_VERSION}" && \
    { chown -R 1000:1000 /usr/lib/node_modules || true; } && \
    npm cache clean --force

# Preserve Paperclip's runtime contract: UID/GID 1000, /workspace, tini, and
# paperclip-agent-shim are inherited unchanged from the official base image.
USER 1000:1000

RUN set -eu; \
    for command in node npm codex claude copilot opencode; do \
        command -v "$command"; \
    done; \
    codex --version; \
    claude --version; \
    copilot --version; \
    opencode --version

LABEL org.opencontainers.image.title="Paperclip agent runtime base" \
      org.opencontainers.image.description="Official Paperclip agent runtime base with Renovate-managed Codex, Claude, Copilot, and OpenCode CLIs"
