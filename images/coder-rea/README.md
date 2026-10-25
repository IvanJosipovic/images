# Coder REA image

This image extends the digest-pinned `codercom/enterprise-base:ubuntu` image
with the REA CLI, Node.js 24, npm, OpenCode, Codex CLI, GitHub Copilot CLI,
Ghidra, JADX, Apktool, bundletool, ipsw, Frida, Google Chrome on amd64,
Binwalk, Unblob, and common analysis dependencies.
Versions are pinned in the Dockerfile and updated by Renovate. Package
installation is performed as root; the final image runs as the existing
`coder` user.

The image is published to `ghcr.io/ivanjosipovic/images/coder-rea`.

## Included analysis support

- Native analysis: Ghidra 12.1.4 and OpenJDK 21, matching the Ghidra release
  line currently verified by REA.
- Android analysis: JADX CLI and headless engine, Apktool, bundletool, ADB,
  and Frida CLI. The `REA_JADX_MCP_JAR` environment variable points to the
  installed REA bridge JAR.
- Apple static analysis: `ipsw` for iOS firmware, Mach-O, and dyld-cache
  workflows. Dynamic iOS analysis still needs a separately configured Mac and
  compatible device/tooling.
- Firmware analysis: Binwalk 3, Unblob, `prlimit`, and common archive/filesystem
  utilities. Unblob may report missing format-specific extractors for less
  common formats.
- Native diagnostics: GNU binutils, GDB, and pwntools for workflows that use
  caller-selected debugger/diagnostic tools.
- Browser observation: Google Chrome on amd64 and the libraries needed for
  headless use. Google's Linux Chrome package is not available for arm64.
- Packet and signal analysis: TShark and sigrok-cli. ADB and WABT are also
  included for Android-device and WASM workflows.

Commercial tools, including Hopper, IDA, and JEB, are not bundled. Install or
configure them separately only when you have the appropriate license. REA's
MCP setup is also an explicit runtime action; configure the agent you use with
`rea setup` rather than baking per-user configuration or credentials into this
image.

## Build locally

With Docker installed, run from the repository root:

```powershell
Push-Location .\images\coder-rea
docker build --tag images/coder-rea:local .
Pop-Location
```

The build resolves release assets through the GitHub API. Unauthenticated API
requests are rate limited, so pass a token as a build secret when you have one:

```powershell
$env:GITHUB_TOKEN = gh auth token
Push-Location .\images\coder-rea
docker build --secret id=github_token,env=GITHUB_TOKEN --tag images/coder-rea:local .
Pop-Location
```

The pipeline uses the same context and build command from this directory, with
`GITHUB_TOKEN` supplied as the `github_token` build secret:

```powershell
Set-Location .\images\coder-rea
docker build --secret id=github_token,env=GITHUB_TOKEN .
```

## Use the image

```sh
docker run --rm --entrypoint bash ghcr.io/ivanjosipovic/images/coder-rea:latest -lc 'whoami && rea --version && node --version && npm --version && java --version && frida --version && jadx --version && apktool --version && bundletool version && ipsw version && binwalk --version && unblob --version && tshark --version && if [ "$(dpkg --print-architecture)" = amd64 ]; then google-chrome-stable --version; fi'
```

Run `rea setup` inside the workspace to register REA with your selected agent
and install its workflow instructions. Review the setup plan; it changes the
agent configuration in the container user's home. Agent authentication is
performed at runtime and credentials must not be baked into the image.

Ghidra and optional providers may require provider-specific configuration; see
REA's [installation guide](https://github.com/morluto/rea/blob/main/docs/installation.md)
and the relevant provider guide. This image provides a broad Linux tool
baseline, not every optional host integration or every format-specific
extractor.

## Published tags

Each Release Please release publishes an immutable full-version tag. Major,
major/minor, and `latest` aliases advance only when the release version is
newer than the version currently behind each alias. Promotions are serialized
per image.

The Coder base image is pinned to a manifest digest for reproducible builds.
Renovate tracks that digest and the annotated tool versions in the Dockerfile.
