FROM ghcr.io/paperclipai/paperclip:2026.1106.0@sha256:d6584f05cf57a4b26c117eb083725f18c1fe69ddafa7d16f9c8cce83f6fa17da

WORKDIR /app

# Carry the realized remote workspace path onto the lease before resolving the
# execution target. The upstream provider reports /workspace, but this release
# otherwise falls back to /tmp.
COPY patch-environment-run-orchestrator.mjs /tmp/patch-environment-run-orchestrator.mjs

RUN node /tmp/patch-environment-run-orchestrator.mjs \
    && pnpm --filter @paperclipai/server build \
    && node /app/server/scripts/bundle-runtime.mjs \
    && node --input-type=module -e '\
      import { readdir, readFile } from "node:fs/promises"; \
      const dir = "/app/server/dist-runtime"; \
      const files = await readdir(dir); \
      const runtime = (await Promise.all(files.filter((file) => file.endsWith(".mjs")).map((file) => readFile(`${dir}/${file}`, "utf8")))).join("\\n"); \
      if (!runtime.includes("shouldPersistRemoteCwd")) throw new Error("remote cwd fix missing from bundled Paperclip runtime"); \
      console.log("Verified realized remote cwd fix in Paperclip runtime"); \
    ' \
    && rm /tmp/patch-environment-run-orchestrator.mjs

LABEL org.opencontainers.image.title="Paperclip Kubernetes workspace fix" \
      org.opencontainers.image.description="Official Paperclip server with the realized remoteCwd lease fix from upstream commit c1a62bca6270903761e1dfc1927f110efe3150a9"
