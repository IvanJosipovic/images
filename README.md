# General Docker Base Images

This repository builds and publishes versioned Docker base images to GitHub
Container Registry (GHCR). Each image is maintained and released independently.

## Images

| Image | Description | Package |
| --- | --- | --- |
| `coder-dotnet` | Coder Ubuntu image with the latest .NET SDK and developer tools | `ghcr.io/ivanjosipovic/images/coder-dotnet` |
| `coder-rea` | Coder Ubuntu image with REA and open-source reverse-engineering tools | `ghcr.io/ivanjosipovic/images/coder-rea` |

Image sources live under `images/<image-name>/`. See
[images/coder-dotnet/README.md](images/coder-dotnet/README.md) and
[images/coder-rea/README.md](images/coder-rea/README.md) for build and usage details.

## Releases

Releases are managed with Release Please in manifest mode. Use
[Conventional Commits](https://www.conventionalcommits.org/) and scope changes
to the image they affect:

```text
feat(coder-dotnet): add a useful SDK tool
fix(coder-dotnet): correct the default configuration
feat(coder-rea): add a useful analysis tool
```

Use `feat` for a minor release, `fix` for a patch release, and a breaking-change
footer (`BREAKING CHANGE: ...`) for a major release. A release PR updates the
image changelog and manifest. When the release PR is merged, Release Please
creates a component tag such as `coder-dotnet-v1.2.3`. The generic publish workflow
triggers on `*-v*` tags, resolves the image and version from the tag, then runs
`docker build .` with `images/<image-name>` as its working directory.

The Coder .NET package is published as `ghcr.io/ivanjosipovic/images/coder-dotnet` with
immutable full-version tags (`1.2.3`) and floating major/minor aliases (`1`,
`1.2`). Each floating alias, including `latest`, advances only when the
published SemVer is greater than the version currently behind that alias. For
example, a `1.9.5` hotfix can advance `1.9` and `1` but will not replace
`latest` if it already points to `2.1.0`. Promotions are serialized per image
to prevent concurrent releases from moving aliases backwards.

The first release requires a Conventional Commit affecting `coder-dotnet`; the
initial manifest version is `0.1.0`.

Renovate tracks pinned base-image digests and annotated tool versions in image
Dockerfiles. It uses conventional `fix(deps)` commits for changes under
`images/` so Release Please updates the affected image's patch release; updates
outside `images/` use `chore(deps)`. Install or enable the Renovate app for this
repository to receive update PRs.

## Adding an image

Create `images/<image-name>/` with its Dockerfile and README. Add the directory
as a package in `release-please-config.json`, using the folder name as its
Release Please component. For example, `images/coder-dotnet` is configured
with `"component": "coder-dotnet"` and the manifest version is stored under
the `images/coder-dotnet` key in `.release-please-manifest.json`. This produces
tags such as `coder-dotnet-v1.2.3`, which the generic publisher maps back to
`images/coder-dotnet`.

Pull-request validation discovers changed image directories automatically.
Keep names lowercase and make each component match its image folder name. Add a
`scripts/` directory only when the Dockerfile needs external scripts or files.
The `validate-images` status check summarizes the discovery and matrix build
results; add `validate-images` as the required check in the repository's branch
ruleset. The workflow runs on every pull request so the required check is
reported even when no image files changed.
