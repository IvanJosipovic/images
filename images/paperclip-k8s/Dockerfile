FROM ghcr.io/paperclipai/paperclip:2026.1106.0

WORKDIR /app

# Seed the Kubernetes lease sync root before realization, and persist the
# provider's realized workspace path before resolving the execution target.
COPY patch-kubernetes-lease.mjs /tmp/patch-kubernetes-lease.mjs
COPY patch-environment-run-orchestrator.mjs /tmp/patch-environment-run-orchestrator.mjs

RUN node /tmp/patch-kubernetes-lease.mjs \
    && node /tmp/patch-environment-run-orchestrator.mjs \
    && pnpm --dir /app/packages/plugins/sandbox-providers/kubernetes install \
      --ignore-workspace --prod=false --ignore-scripts --no-frozen-lockfile \
    && pnpm --dir /app/packages/plugins/sandbox-providers/kubernetes build \
    && pnpm --filter @paperclipai/server exec tsc \
    && node /app/server/scripts/bundle-runtime.mjs \
    && node --input-type=module -e '\
      import { readdir, readFile } from "node:fs/promises"; \
      const dir = "/app/server/dist-runtime"; \
      const files = await readdir(dir); \
      const runtime = (await Promise.all(files.filter((file) => file.endsWith(".mjs")).map((file) => readFile(`${dir}/${file}`, "utf8")))).join("\\n"); \
      if (!runtime.includes("shouldPersistRemoteCwd")) throw new Error("remote cwd fix missing from bundled Paperclip runtime"); \
      const provider = await readFile("/app/packages/plugins/sandbox-providers/kubernetes/dist/plugin.js", "utf8"); \
      if (!provider.includes("remoteCwd: \"/workspace\"")) throw new Error("initial Kubernetes sync root missing from built provider"); \
      console.log("Verified both remote cwd fixes in Paperclip runtime and Kubernetes provider"); \
    ' \
    && rm /tmp/patch-kubernetes-lease.mjs /tmp/patch-environment-run-orchestrator.mjs

LABEL org.opencontainers.image.title="Paperclip Kubernetes workspace fix" \
      org.opencontainers.image.description="Paperclip server and Kubernetes provider with pre-realization /workspace sync root and realized remoteCwd lease persistence"
