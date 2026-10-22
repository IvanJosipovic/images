# .NET SDK image

This directory contains the .NET 11 SDK base image.
The image is published to `ghcr.io/ivanjosipovic/images/dotnet`.

## Build locally

With Docker installed, run from the repository root:

```powershell
Push-Location .\images\dotnet
docker build --tag images/dotnet:local .
Pop-Location
```

The pipeline uses the same context and build command from this directory:

```powershell
Set-Location .\images\dotnet
docker build .
```

## Use the image

```sh
docker run --rm ghcr.io/ivanjosipovic/images/dotnet:latest --info
```

The container uses the .NET SDK image's default `dotnet` entrypoint and starts
in `/workspace`. Mount a project directory there when building or running
projects inside the container.

## Published tags

Each Release Please release publishes an immutable full-version tag. Major,
major/minor, and `latest` aliases advance only when the release version is
newer than the version currently behind each alias. For example, a `1.9.5`
hotfix can advance `1.9` and `1` but does not replace `latest` when `latest`
already points to `2.1.0`. Promotions are serialized per image.

The upstream base image is pinned to a manifest digest for reproducible builds.
To take Microsoft servicing updates, refresh the digest for the `11.0` tag in
`Dockerfile` and rebuild this image.
