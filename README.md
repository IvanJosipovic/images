# General Docker Base Images

This repository builds and publishes versioned Docker base images to GitHub
Container Registry (GHCR). Each image is maintained and released independently.

## Images

| Image | Description | Package |
| --- | --- | --- |
| `dotnet` | .NET 11 SDK base image | `ghcr.io/ivanjosipovic/images/dotnet` |

Image sources live under `images/<image-name>/`. See
[images/dotnet/README.md](images/dotnet/README.md) for build and usage details.

## Releases

Releases are managed with Release Please in manifest mode. Use
[Conventional Commits](https://www.conventionalcommits.org/) and scope changes
to the image they affect:

```text
feat(dotnet): add a useful SDK tool
fix(dotnet): correct the default configuration
```

Use `feat` for a minor release, `fix` for a patch release, and a breaking-change
footer (`BREAKING CHANGE: ...`) for a major release. A release PR updates the
image changelog and manifest. When the release PR is merged, Release Please
creates a component tag such as `dotnet-v1.2.3`. The generic publish workflow
triggers on `*-v*` tags, resolves the image and version from the tag, then runs
`docker build .` with `images/<image-name>` as its working directory.

The .NET package is published as `ghcr.io/ivanjosipovic/images/dotnet` with
immutable full-version tags (`1.2.3`) and floating major/minor aliases (`1`,
`1.2`). Each floating alias, including `latest`, advances only when the
published SemVer is greater than the version currently behind that alias. For
example, a `1.9.5` hotfix can advance `1.9` and `1` but will not replace
`latest` if it already points to `2.1.0`. Promotions are serialized per image
to prevent concurrent releases from moving aliases backwards.

The first release requires a Conventional Commit affecting `dotnet`; the
initial manifest version is `0.1.0`.

## Adding an image

Create `images/<image-name>/` with its Dockerfile and README. Add the directory
as a package in `release-please-config.json`, using the folder name as its
Release Please component. For example, `images/dotnet` is configured with
`"component": "dotnet"` and the manifest version is stored under the
`images/dotnet` key in `.release-please-manifest.json`. This produces tags such
as `dotnet-v1.2.3`, which the generic publisher maps back to `images/dotnet`.

Pull-request validation discovers changed image directories automatically.
Keep names lowercase and make each component match its image folder name. Add a
`scripts/` directory only when the Dockerfile needs external scripts or files.

## Repository settings

Create a repository Actions secret named `RELEASE_PLEASE_TOKEN` with a fine-
grained token that can write repository contents, issues, and pull requests.
Release Please uses it to open release PRs and create tags that start the
publisher; events created with the built-in `GITHUB_TOKEN` do not start
downstream workflows.
Enable **Settings → Actions → General → Workflow permissions → Allow GitHub
Actions to create and approve pull requests** if the workflow is not permitted
to create PRs. GHCR packages are public or private according to their package
visibility settings; ensure the `dotnet` package is associated with this
repository.
