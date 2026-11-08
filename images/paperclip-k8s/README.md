# Paperclip Kubernetes image

This image extends the official Paperclip server image and applies the upstream
workspace-realization fix from commit
[`c1a62bca6270903761e1dfc1927f110efe3150a9`](https://github.com/paperclipai/paperclip/commit/c1a62bca6270903761e1dfc1927f110efe3150a9).
The fix persists a remote provider's realized working directory (for example,
`/workspace`) as `remoteCwd` on the lease before Paperclip resolves the
execution target. Without it, the affected release falls back to `/tmp`.

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

The Dockerfile pins the official Paperclip base image by version and manifest
digest. It patches the matching upstream TypeScript source, rebuilds the server
runtime bundle, and fails the build if the fix is absent from the output.

The image repository's Release Please and publish-image workflows publish
versioned tags and advance aliases using the same process as the other images.
The Kubernetes Instance manifest has not been changed to consume this image.

## Run

```sh
docker run --rm ghcr.io/ivanjosipovic/images/paperclip-k8s:latest
```

Do not bake Paperclip instance credentials or configuration into this image;
mount and inject them at runtime as with the official image.
