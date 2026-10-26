# Coder .NET image

This image extends the pinned `codercom/enterprise-base:ubuntu` image and
installs the latest .NET 11 SDK, PowerShell, Node.js LTS, npm, Yarn, Microsoft
Agent Package Manager, OpenCode, Codex CLI, and GitHub Copilot CLI. Tool
versions are pinned in the Dockerfile and updated by Renovate. Package
installation is performed as root;
the final image runs as the existing `coder` user. All installed commands are
on `PATH`.

The image is published to `ghcr.io/ivanjosipovic/images/coder-dotnet`.

## Build locally

With Docker installed, run from the repository root:

```powershell
Push-Location .\images\coder-dotnet
docker build --tag images/coder-dotnet:local .
Pop-Location
```

The pipeline uses the same context and build command from this directory:

```powershell
Set-Location .\images\coder-dotnet
docker build .
```

## Use the image

```sh
docker run --rm --entrypoint bash ghcr.io/ivanjosipovic/images/coder-dotnet:latest -lc 'whoami && dotnet --info && pwsh --version && node --version && npm --version && yarn --version && apm --version && opencode --version && codex --version && copilot --version'
```

The container starts as user `coder`. Mount a project directory at the
workspace configured by the Coder base image when building or running projects
inside the container. Codex and Copilot require their respective accounts to
be authenticated at runtime; do not bake credentials into the image.

## Published tags

Each Release Please release publishes an immutable full-version tag. Major,
major/minor, and `latest` aliases advance only when the release version is
newer than the version currently behind each alias. For example, a `1.9.5`
hotfix can advance `1.9` and `1` but does not replace `latest` when `latest`
already points to `2.1.0`. Promotions are serialized per image.

The Coder base image is pinned to a manifest digest for reproducible builds.
Refresh its digest in `Dockerfile` to take upstream base-image updates. The
tool installers resolve current releases when the image is built.
