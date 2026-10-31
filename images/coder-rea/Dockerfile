FROM codercom/enterprise-base:ubuntu@sha256:96a11110dd1ad7ec8dfc385b66e90eeac7096ce6c28aab2865d2a0b11f71e8d4

USER root

ARG DEBIAN_FRONTEND=noninteractive
ARG TARGETARCH

ENV NPM_CONFIG_PREFIX=/usr/local \
    JAVA_HOME=/usr/lib/jvm/java-21-openjdk-${TARGETARCH} \
    GHIDRA_INSTALL_DIR=/opt/ghidra \
    REA_JADX_MCP_JAR=/opt/rea/android/jadx-headless-mcp.jar \
    PATH="/usr/local/bin:/opt/ghidra:/opt/ghidra/support:/usr/lib/jvm/java-21-openjdk-${TARGETARCH}/bin:/usr/bin:${PATH}"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        cabextract \
        binutils \
        curl \
        device-tree-compiler \
        e2fsprogs \
        file \
        gdb \
        git \
        gnupg \
        g++ \
        libbz2-dev \
        libfontconfig1 \
        libfontconfig1-dev \
        libglib2.0-0 \
        liblzma-dev \
        libmagic-dev \
        libssl-dev \
        libunwind8 \
        libzstd-dev \
        openjdk-21-jdk-headless \
        p7zip-full \
        pkg-config \
        procps \
        python3 \
        python3-pip \
        python3-pwntools \
        python3-venv \
        adb \
        lzop \
        mtd-utils \
        sigrok-cli \
        squashfs-tools \
        tar \
        tshark \
        unzip \
        wabt \
        util-linux \
        xz-utils \
        zstd \
        zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

RUN if [ "$TARGETARCH" = amd64 ]; then \
        mkdir -p /usr/share/keyrings && \
        curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor --yes -o /usr/share/keyrings/google-chrome.gpg && \
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
        apt-get update && \
        apt-get install -y --no-install-recommends google-chrome-stable; \
    fi && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/share/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /usr/share/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" > /etc/apt/sources.list.d/nodesource.list

# renovate: datasource=node-version depName=node
ARG NODE_VERSION=24.22.2

# renovate: datasource=npm depName=npm
ARG NPM_VERSION=12.2.1

# renovate: datasource=npm depName=rea-agents
ARG REA_AGENTS_VERSION=6.8.0

# renovate: datasource=npm depName=@opencode/cli
ARG OPENCODE_VERSION=2.2.5

# renovate: datasource=npm depName=@openai/codex
ARG CODEX_CLI_VERSION=0.166.0

# renovate: datasource=npm depName=@github/copilot
ARG COPILOT_CLI_VERSION=1.0.105

RUN node_version="${NODE_VERSION#v}" && \
    apt-get update && \
    apt-get install -y --no-install-recommends "nodejs=${node_version}-1nodesource1" && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --global "npm@${NPM_VERSION}" && \
    npm install --global \
        --allow-scripts=@opencode/cli,frida \
        "rea-agents@${REA_AGENTS_VERSION}" \
        "@opencode/cli@${OPENCODE_VERSION}" \
        "@openai/codex@${CODEX_CLI_VERSION}" \
        "@github/copilot@${COPILOT_CLI_VERSION}" && \
    npm cache clean --force

# renovate: datasource=github-releases depName=NationalSecurityAgency/ghidra
ARG GHIDRA_VERSION=12.1.4

RUN --mount=type=secret,id=github_token,required=false \
    set -eux; \
    github_get() { \
        if [ -s /run/secrets/github_token ]; then \
            { set +x; } 2>/dev/null; \
            curl -fsSL --retry 5 --retry-delay 2 --retry-max-time 120 --retry-all-errors -H "Authorization: Bearer $(cat /run/secrets/github_token)" -H "Accept: application/vnd.github+json" "$1"; \
        else \
            curl -fsSL --retry 5 --retry-delay 2 --retry-max-time 120 --retry-all-errors -H "Accept: application/vnd.github+json" "$1"; \
        fi; \
    }; \
    release_tag="Ghidra_${GHIDRA_VERSION}_build"; \
    release_json="$(github_get "https://api.github.com/repos/NationalSecurityAgency/ghidra/releases/tags/${release_tag}")"; \
    download_url="$(printf '%s' "$release_json" | python3 -c 'import json,sys; assets=json.load(sys.stdin)["assets"]; print(next(a["browser_download_url"] for a in assets if a["name"].endswith(".zip") and "PUBLIC" in a["name"]))')"; \
    download_digest="$(printf '%s' "$release_json" | python3 -c 'import json,sys; assets=json.load(sys.stdin)["assets"]; print(next(a["digest"] for a in assets if a["name"].endswith(".zip") and "PUBLIC" in a["name"]))')"; \
    curl -fsSL --retry 3 "$download_url" -o /tmp/ghidra.zip; \
    test "${download_digest#sha256:}" != "$download_digest"; \
    printf '%s  %s\n' "${download_digest#sha256:}" /tmp/ghidra.zip | sha256sum -c -; \
    mkdir -p /opt/ghidra; \
    unzip -q /tmp/ghidra.zip -d /opt/ghidra-unpacked; \
    ghidra_directory="$(find /opt/ghidra-unpacked -mindepth 1 -maxdepth 1 -type d -name 'ghidra_*' -print -quit)"; \
    test -n "$ghidra_directory"; \
    cp -a "$ghidra_directory"/. /opt/ghidra/; \
    rm -rf /tmp/ghidra.zip /opt/ghidra-unpacked

# renovate: datasource=github-releases depName=rust-lang/rust
ARG RUST_VERSION=1.99.1

RUN curl -fsSL https://sh.rustup.rs -o /tmp/rustup-init.sh && \
    sh /tmp/rustup-init.sh -y --profile minimal --default-toolchain "$RUST_VERSION" && \
    rm -f /tmp/rustup-init.sh

ENV PATH="/root/.cargo/bin:/usr/local/bin:/opt/ghidra:/opt/ghidra/support:/usr/lib/jvm/java-21-openjdk-${TARGETARCH}/bin:/usr/bin:${PATH}"

# renovate: datasource=crate depName=binwalk
ARG BINWALK_VERSION=3.1.0

RUN cargo install binwalk --version "$BINWALK_VERSION" --locked --root /usr/local && \
    rm -rf /root/.cargo /root/.rustup

ENV PATH="/usr/local/bin:/opt/ghidra:/opt/ghidra/support:/usr/lib/jvm/java-21-openjdk-${TARGETARCH}/bin:/usr/bin:/bin"

# renovate: datasource=pypi depName=unblob
ARG UNBLOB_VERSION=26.6.4

# renovate: datasource=pypi depName=frida-tools
ARG FRIDA_TOOLS_VERSION=14.11.0

RUN python3 -m venv /opt/rea-tools && \
    /opt/rea-tools/bin/pip install --no-cache-dir \
        "unblob==${UNBLOB_VERSION}" \
        "frida-tools==${FRIDA_TOOLS_VERSION}" && \
    ln -s /opt/rea-tools/bin/unblob /usr/local/bin/unblob && \
    ln -s /opt/rea-tools/bin/frida /usr/local/bin/frida && \
    ln -s /opt/rea-tools/bin/frida-ps /usr/local/bin/frida-ps && \
    ln -s /opt/rea-tools/bin/frida-trace /usr/local/bin/frida-trace

# renovate: datasource=github-releases depName=iBotPeaches/Apktool
ARG APKTOOL_VERSION=3.0.3

# renovate: datasource=github-releases depName=google/bundletool
ARG BUNDLETOOL_VERSION=1.18.3

# renovate: datasource=github-releases depName=blacktop/ipsw
ARG IPSW_VERSION=3.1.741

# renovate: datasource=github-releases depName=skylot/jadx
ARG JADX_CLI_VERSION=1.5.6

# renovate: datasource=github-releases depName=1013503897/jadx-headless-mcp
ARG JADX_VERSION=0.8.0

RUN --mount=type=secret,id=github_token,required=false \
    set -eux; \
    github_get() { \
        if [ -s /run/secrets/github_token ]; then \
            { set +x; } 2>/dev/null; \
            curl -fsSL --retry 5 --retry-delay 2 --retry-max-time 120 --retry-all-errors -H "Authorization: Bearer $(cat /run/secrets/github_token)" -H "Accept: application/vnd.github+json" "$1"; \
        else \
            curl -fsSL --retry 5 --retry-delay 2 --retry-max-time 120 --retry-all-errors -H "Accept: application/vnd.github+json" "$1"; \
        fi; \
    }; \
    mkdir -p /opt/rea/android /tmp/rea-downloads; \
    apktool_release="$(github_get "https://api.github.com/repos/iBotPeaches/Apktool/releases/tags/v${APKTOOL_VERSION}")"; \
    apktool_asset="$(printf '%s' "$apktool_release" | python3 -c 'import json,sys; a=next(a for a in json.load(sys.stdin)["assets"] if a["name"].endswith(".jar")); print(a["browser_download_url"] + " " + (a["digest"] or "").removeprefix("sha256:"))')"; \
    apktool_url="${apktool_asset% *}"; apktool_digest="${apktool_asset##* }"; \
    curl -fsSL --retry 3 "$apktool_url" -o /opt/rea/android/apktool.jar; \
    printf '%s  %s\n' "$apktool_digest" /opt/rea/android/apktool.jar | sha256sum -c -; \
    printf '#!/bin/sh\nexec java -jar /opt/rea/android/apktool.jar "$@"\n' > /usr/local/bin/apktool; \
    chmod 0755 /usr/local/bin/apktool; \
    bundletool_release="$(github_get "https://api.github.com/repos/google/bundletool/releases/tags/${BUNDLETOOL_VERSION}")"; \
    bundletool_asset="$(printf '%s' "$bundletool_release" | python3 -c 'import json,sys; a=next(a for a in json.load(sys.stdin)["assets"] if a["name"].endswith("-all-" + sys.argv[1] + ".jar")); print(a["browser_download_url"] + " " + (a["digest"] or "").removeprefix("sha256:"))' "$BUNDLETOOL_VERSION")"; \
    bundletool_url="${bundletool_asset% *}"; bundletool_digest="${bundletool_asset##* }"; \
    curl -fsSL --retry 3 "$bundletool_url" -o /opt/rea/android/bundletool.jar; \
    printf '%s  %s\n' "$bundletool_digest" /opt/rea/android/bundletool.jar | sha256sum -c -; \
    printf '#!/bin/sh\nexec java -jar /opt/rea/android/bundletool.jar "$@"\n' > /usr/local/bin/bundletool; \
    chmod 0755 /usr/local/bin/bundletool; \
    ipsw_release="$(github_get "https://api.github.com/repos/blacktop/ipsw/releases/tags/v${IPSW_VERSION}")"; \
    ipsw_arch="$TARGETARCH"; if [ "$ipsw_arch" = amd64 ]; then ipsw_arch=x86_64; fi; \
    ipsw_asset="$(printf '%s' "$ipsw_release" | python3 -c 'import json,sys; arch=sys.argv[1]; a=next(a for a in json.load(sys.stdin)["assets"] if a["name"] == f"ipsw_{sys.argv[2]}_linux_{arch}.tar.gz"); print(a["browser_download_url"] + " " + (a["digest"] or "").removeprefix("sha256:"))' "$ipsw_arch" "$IPSW_VERSION")"; \
    ipsw_url="${ipsw_asset% *}"; ipsw_digest="${ipsw_asset##* }"; \
    curl -fsSL --retry 3 "$ipsw_url" -o /tmp/rea-downloads/ipsw.tar.gz; \
    printf '%s  %s\n' "$ipsw_digest" /tmp/rea-downloads/ipsw.tar.gz | sha256sum -c -; \
    tar -xzf /tmp/rea-downloads/ipsw.tar.gz -C /tmp/rea-downloads ipsw; \
    install -m 0755 /tmp/rea-downloads/ipsw /usr/local/bin/ipsw; \
    jadx_cli_release="$(github_get "https://api.github.com/repos/skylot/jadx/releases/tags/v${JADX_CLI_VERSION}")"; \
    jadx_cli_asset="$(printf '%s' "$jadx_cli_release" | python3 -c 'import json,sys; a=next(a for a in json.load(sys.stdin)["assets"] if a["name"] == "jadx-" + sys.argv[1] + ".zip"); print(a["browser_download_url"] + " " + (a["digest"] or "").removeprefix("sha256:"))' "$JADX_CLI_VERSION")"; \
    jadx_cli_url="${jadx_cli_asset% *}"; jadx_cli_digest="${jadx_cli_asset##* }"; \
    curl -fsSL --retry 3 "$jadx_cli_url" -o /tmp/rea-downloads/jadx.zip; \
    printf '%s  %s\n' "$jadx_cli_digest" /tmp/rea-downloads/jadx.zip | sha256sum -c -; \
    mkdir -p /opt/rea/android/jadx; \
    unzip -q /tmp/rea-downloads/jadx.zip -d /opt/rea/android/jadx; \
    ln -s /opt/rea/android/jadx/bin/jadx /usr/local/bin/jadx; \
    rm -rf /tmp/rea-downloads; \
    jadx_release="$(github_get "https://api.github.com/repos/1013503897/jadx-headless-mcp/releases/tags/v${JADX_VERSION}")"; \
    jadx_url="$(printf '%s' "$jadx_release" | python3 -c 'import json,sys; assets=json.load(sys.stdin)["assets"]; print(next(a["browser_download_url"] for a in assets if a["name"].endswith("-all.jar")))')"; \
    jadx_digest="$(printf '%s' "$jadx_release" | python3 -c 'import json,sys; assets=json.load(sys.stdin)["assets"]; print(next(a["digest"] for a in assets if a["name"].endswith("-all.jar")))')"; \
    curl -fsSL --retry 3 "$jadx_url" -o "$REA_JADX_MCP_JAR"; \
    test "${jadx_digest#sha256:}" != "$jadx_digest"; \
    printf '%s  %s\n' "${jadx_digest#sha256:}" "$REA_JADX_MCP_JAR" | sha256sum -c -

USER coder

RUN set -eu; \
    for command in rea node npm java ghidraRun analyzeHeadless binwalk unblob frida frida-ps frida-trace jadx apktool bundletool ipsw tshark prlimit adb sigrok-cli wasm-validate; do \
        command -v "$command"; \
    done; \
    if [ "$(dpkg --print-architecture)" = amd64 ]; then command -v google-chrome-stable; fi; \
    test -r "$REA_JADX_MCP_JAR"; \
    java --list-modules | grep -q '^jdk.compiler@'; \
    frida --version >/dev/null; \
    node -e "require('/usr/local/lib/node_modules/rea-agents/node_modules/frida').getLocalDevice().then(device => { if (device.id !== 'local') process.exit(1); })"; \
    jadx --version >/dev/null; \
    apktool --version >/dev/null; \
    bundletool version >/dev/null; \
    ipsw version >/dev/null

LABEL org.opencontainers.image.title="Coder REA image" \
      org.opencontainers.image.description="Coder Ubuntu base with REA, Ghidra, Android and Apple analysis tools, firmware tools, Chrome, and agent CLIs"
