# Paperclip Kubernetes image

This image extends the official Paperclip server image with GitHub CLI and both
sides of the Kubernetes native file-sync lease fix:

- Fresh leases start with `/workspace`, so managed assets can sync before the
  server realizes a workspace.
- Resumed leases preserve their prior `remoteCwd` (or default to `/workspace`),
  and the server persists the provider's realized cwd for later syncs.

The Codex sandbox runtime is separate and remains the official Paperclip image.
The server image is published to
`ghcr.io/ivanjosipovic/images/paperclip-k8s`.

## Build locally

With Docker and BuildKit installed, run from the repository root:

```powershell
Push-Location .\images\paperclip-k8s
docker build --tag images/paperclip-k8s:local .
Pop-Location
```

The Dockerfile pins the official Paperclip base image by its immutable release
version. It patches the matching upstream TypeScript sources, rebuilds the
Kubernetes provider and server runtime bundle without rebuilding the unrelated
Rust Runner, and fails the build if either fix is absent from the output.

The image repository's Release Please and publish-image workflows publish
versioned tags and advance aliases using the same process as the other images.
The Kubernetes Instance manifest has not been changed to consume this image.

## Run

```sh
docker run --rm ghcr.io/ivanjosipovic/images/paperclip-k8s:latest
```

Do not bake Paperclip instance credentials or configuration into this image;
mount and inject them at runtime as with the official image.
