FROM codercom/enterprise-base:ubuntu@sha256:96a11110dd1ad7ec8dfc385b66e90eeac7096ce6c28aab2865d2a0b11f71e8d4

USER root

ARG DEBIAN_FRONTEND=noninteractive

ENV DOTNET_ROOT=/usr/share/dotnet \
    NPM_CONFIG_PREFIX=/usr/local \
    PATH="/usr/local/bin:/usr/share/dotnet:/usr/bin:${PATH}"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bubblewrap \
        ca-certificates \
        curl \
        gdb \
        gnupg \
        lldb \
        libfontconfig1 \
        libgssapi-krb5-2 \
        libicu-dev \
        libssl-dev \
        libunwind8 \
        tar \
        zlib1g && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/share/keyrings && \
    curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor --yes -o /usr/share/keyrings/yarnkey.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -

# renovate: datasource=node-version depName=node
ARG NODE_VERSION=24.22.2

# renovate: datasource=npm depName=yarn
ARG YARN_VERSION=1.22.22

RUN node_version="${NODE_VERSION#v}" && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        "nodejs=${node_version}-1nodesource1" \
        "yarn=${YARN_VERSION}-1" && \
    rm -rf /var/lib/apt/lists/*

# renovate: datasource=github-releases depName=PowerShell/PowerShell
ARG POWERSHELL_VERSION=7.6.9

RUN set -eux; \
    architecture="$(dpkg --print-architecture)"; \
    if [ "$architecture" != amd64 ] && [ "$architecture" != arm64 ]; then \
        echo "Unsupported architecture for PowerShell: $architecture" >&2; \
        exit 1; \
    fi; \
    powershell_package="powershell_${POWERSHELL_VERSION}-1.deb_${architecture}.deb"; \
    release_url="https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}"; \
    curl -fsSL --retry 3 "$release_url/$powershell_package" -o "/tmp/$powershell_package"; \
    apt-get update; \
    apt-get install -y --no-install-recommends "/tmp/$powershell_package"; \
    rm -f "/tmp/$powershell_package"; \
    ln -sf /usr/bin/pwsh /usr/local/bin/powershell; \
    rm -rf /var/lib/apt/lists/*

# renovate: datasource=dotnet-version depName=dotnet-sdk versioning=dotnet
ARG DOTNET_SDK_VERSION=11.0.100-rc.3.26522.148

RUN curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh && \
    bash /tmp/dotnet-install.sh \
        --version "$DOTNET_SDK_VERSION" \
        --install-dir "$DOTNET_ROOT" \
        --no-path && \
    rm -f /tmp/dotnet-install.sh

# renovate: datasource=nuget depName=dotnet-stack
ARG DOTNET_STACK_VERSION=10.0.750501

# renovate: datasource=nuget depName=dotnet-dump
ARG DOTNET_DUMP_VERSION=10.0.750501

RUN dotnet tool install --tool-path /usr/local/bin \
        --version "$DOTNET_STACK_VERSION" dotnet-stack && \
    dotnet tool install --tool-path /usr/local/bin \
        --version "$DOTNET_DUMP_VERSION" dotnet-dump

# renovate: datasource=github-releases depName=Samsung/netcoredbg
ARG NETCOREDBG_VERSION=3.2.0-1092

RUN set -eux; \
    architecture="$(dpkg --print-architecture)"; \
    case "$architecture" in \
        amd64|arm64) ;; \
        *) echo "Unsupported architecture for netcoredbg: $architecture" >&2; exit 1 ;; \
    esac; \
    archive="netcoredbg-linux-${architecture}.tar.gz"; \
    release_url="https://github.com/Samsung/netcoredbg/releases/download/${NETCOREDBG_VERSION}"; \
    curl -fsSL --retry 3 "$release_url/$archive" -o "/tmp/$archive"; \
    mkdir -p /usr/local/lib/netcoredbg; \
    tar -xzf "/tmp/$archive" -C /usr/local/lib/netcoredbg --strip-components=1; \
    rm -f "/tmp/$archive"; \
    chmod -R a+rX /usr/local/lib/netcoredbg; \
    ln -s /usr/local/lib/netcoredbg/netcoredbg /usr/local/bin/netcoredbg

# renovate: datasource=npm depName=npm
ARG NPM_VERSION=12.2.1

# renovate: datasource=npm depName=@opencode/cli
ARG OPENCODE_VERSION=2.2.0

# renovate: datasource=npm depName=@openai/codex
ARG CODEX_CLI_VERSION=0.165.0

# renovate: datasource=npm depName=@github/copilot
ARG COPILOT_CLI_VERSION=1.0.105

# renovate: datasource=npm depName=@anthropic-ai/claude-code
ARG CLAUDE_CLI_VERSION=2.1.312

RUN npm install --global "npm@${NPM_VERSION}" && \
    npm install --global \
        --allow-scripts=@opencode/cli \
        --allow-scripts=@anthropic-ai/claude-code \
        "@opencode/cli@${OPENCODE_VERSION}" \
        "@openai/codex@${CODEX_CLI_VERSION}" \
        "@github/copilot@${COPILOT_CLI_VERSION}" \
        "@anthropic-ai/claude-code@${CLAUDE_CLI_VERSION}" && \
    npm cache clean --force

# renovate: datasource=github-releases depName=microsoft/apm
ARG APM_VERSION=0.35.0

RUN curl -fsSL https://aka.ms/apm-unix | VERSION="v${APM_VERSION}" sh -s -- --prefix /usr/local && \
    chmod -R a+rX /usr/local/lib/apm

USER coder

RUN set -eu; \
    for command in bwrap dotnet dotnet-stack dotnet-dump gdb lldb netcoredbg pwsh powershell node npm yarn apm opencode codex copilot claude; do \
        command -v "$command"; \
    done

LABEL org.opencontainers.image.title="Coder .NET base image" \
      org.opencontainers.image.description="Coder Ubuntu base with .NET SDK and diagnostics, GDB, LLDB, NetCoreDbg, PowerShell, Node.js LTS, npm, Yarn, Agent Package Manager, OpenCode, Codex CLI, Copilot CLI, and Claude Code CLI"
