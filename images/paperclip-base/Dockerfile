# Pin the official upstream runtime to its published immutable commit tag.
ARG PAPERCLIP_BASE_VERSION=git-38d8f371722b315d2fb3bbaa512518742e33ce2f
FROM ghcr.io/paperclipai/agent-runtime-base:${PAPERCLIP_BASE_VERSION}

USER root

# Install the SDK pinned by KubeUI's global.json in the sandbox image. Sandbox
# workspace provisioning only transfers files; it does not run provisionCommand.
ARG DOTNET_SDK_VERSION=11.0.100-rc.3.26522.148
ENV DOTNET_ROOT=/home/paperclip/.dotnet
ENV PATH="${DOTNET_ROOT}:${PATH}"

# .NET SDK globalization requires ICU at runtime.
RUN apt-get update && \
    apt-get install -y --no-install-recommends libicu70 && \
    rm -rf /var/lib/apt/lists/* && \
    ldconfig -p | grep -F 'libicuuc.so.70'

RUN curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh && \
    bash /tmp/dotnet-install.sh --version "${DOTNET_SDK_VERSION}" --install-dir "${DOTNET_ROOT}" --no-path && \
    rm /tmp/dotnet-install.sh && \
    chown -R 1000:1000 "${DOTNET_ROOT}" && \
    test "$(dotnet --version)" = "${DOTNET_SDK_VERSION}"

# Trust the mounted workspace even when its owner differs from the runtime user.
RUN git config --system --add safe.directory /workspace && \
    git config --system --get-all safe.directory | grep -Fxq /workspace

# renovate: datasource=npm depName=npm
ARG NPM_VERSION=12.2.2

# renovate: datasource=npm depName=@opencode/cli
ARG OPENCODE_VERSION=2.2.6

# renovate: datasource=npm depName=@openai/codex
ARG CODEX_CLI_VERSION=0.167.0

# renovate: datasource=npm depName=@github/copilot
ARG COPILOT_CLI_VERSION=1.0.108

# renovate: datasource=npm depName=@anthropic-ai/claude-code
ARG CLAUDE_CLI_VERSION=2.1.321

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
    for command in node npm dotnet codex claude copilot opencode; do \
        command -v "$command"; \
    done; \
    test "$(dotnet --version)" = "${DOTNET_SDK_VERSION}"; \
    codex --version; \
    claude --version; \
    copilot --version; \
    opencode --version

LABEL org.opencontainers.image.title="Paperclip agent runtime base" \
      org.opencontainers.image.description="Paperclip runtime base with pinned .NET SDK and Codex, Claude, Copilot, and OpenCode CLIs"
