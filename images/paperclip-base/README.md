# Paperclip base image

This image provides a ready-to-run Paperclip Kubernetes sandbox runtime with
the agent CLIs from the Coder .NET image: Codex, Claude Code, GitHub Copilot,
and OpenCode. The image inherits the pinned `coder-dotnet` release so its CLI
toolchain is updated and published through that image's existing Renovate
annotations and release process. Renovate also tracks the inherited image tag
in this Dockerfile.

The image is published to `ghcr.io/ivanjosipovic/images/paperclip-base` and
runs as the inherited unprivileged `coder` user (UID 1000). Paperclip mounts
its task workspace at `/workspace` and overrides the image command for each
sandbox lease; no Paperclip credentials or instance settings are baked in.

## Build locally

With Docker installed, run from the repository root:

```powershell
Push-Location .\images\paperclip-base
docker build --tag images/paperclip-base:local .
Pop-Location
```

The build verifies that each CLI is installed and executable. The inherited
`coder-dotnet` version is a Renovate-managed Docker dependency; its CLI package
versions are independently tracked by Renovate in `images/coder-dotnet/Dockerfile`.
