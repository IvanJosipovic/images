# Paperclip base image

This image extends the official
`ghcr.io/paperclipai/agent-runtime-base` image with Codex, Claude Code, GitHub
Copilot, and OpenCode. The base image is pinned to a published upstream commit
tag. Renovate tracks npm and all four CLI package versions in the Dockerfile.

The official base runtime contract is preserved: the image runs as UID/GID
1000, uses `/workspace`, and retains the Tini entrypoint and
`paperclip-agent-shim` command. The CLI packages are installed as root and
made accessible to the unprivileged Paperclip user. No Paperclip credentials
or instance settings are baked in.

The image is published to `ghcr.io/ivanjosipovic/images/paperclip-base`.

## Build locally

With Docker installed, run from the repository root:

```powershell
Push-Location .\images\paperclip-base
docker build --tag images/paperclip-base:local .
Pop-Location
```

The build verifies that each CLI is installed and executable as UID/GID 1000.
