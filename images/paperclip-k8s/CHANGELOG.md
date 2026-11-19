# Changelog

## [0.2.1](https://github.com/IvanJosipovic/images/compare/paperclip-k8s-v0.2.0...paperclip-k8s-v0.2.1) (2026-11-19)


### Bug Fixes

* **deps:** update ghcr.io/paperclipai/paperclip docker tag to v2026.1117.0 ([#199](https://github.com/IvanJosipovic/images/issues/199)) ([b8aa0e3](https://github.com/IvanJosipovic/images/commit/b8aa0e36ebbc5da103590c93a22ab70f8c7d607a))

## [0.2.0](https://github.com/IvanJosipovic/images/compare/paperclip-k8s-v0.1.0...paperclip-k8s-v0.2.0) (2026-11-08)


### Features

* add Paperclip Kubernetes workspace fix image ([#115](https://github.com/IvanJosipovic/images/issues/115)) ([858b8f5](https://github.com/IvanJosipovic/images/commit/858b8f500ab8559f985c1d771e0e424d29939317))

## 0.1.0

### Features

- Add an official Paperclip-based server image with the upstream realized `remoteCwd` lease fix.
- Seed `/workspace` on fresh/resumed Kubernetes leases for native file sync before workspace realization.
