import { readFile, writeFile } from "node:fs/promises";

const file = process.env.PAPERCLIP_ORCHESTRATOR_SOURCE ?? "/app/server/src/services/environment-run-orchestrator.ts";
const source = (await readFile(file, "utf8")).replace(/\r\n/g, "\n");

const before = `    // Step 3: Persist realization metadata on lease and execution workspace
    if (Object.keys(workspaceRealization).length > 0) {
      const nextLeaseMetadata = {
        ...(lease.metadata ?? {}),
        workspaceRealization,
      };
      const updatedLease = await environmentsSvc.updateLeaseMetadata(lease.id, nextLeaseMetadata);
      if (updatedLease) {
        lease = updatedLease;
      }
      if (persistedExecutionWorkspace) {
        const updatedEw = await executionWorkspacesSvc.update(persistedExecutionWorkspace.id, {
          metadata: {
            ...(persistedExecutionWorkspace.metadata ?? {}),
            workspaceRealizationRequest,
            workspaceRealization,
          },
        });
        if (updatedEw) {
          persistedExecutionWorkspace = updatedEw;
        }
      }
    }`;

const after = `    // Persist the provider's realized cwd so remote execution doesn't fall back to /tmp.
    const realizedRemoteCwd =
      environment.driver !== "local" &&
      typeof realizedWorkspaceCwd === "string" &&
      realizedWorkspaceCwd.trim().length > 0
        ? realizedWorkspaceCwd.trim()
        : null;
    const shouldPersistRemoteCwd =
      realizedRemoteCwd !== null && lease.metadata?.remoteCwd !== realizedRemoteCwd;
    if (Object.keys(workspaceRealization).length > 0 || shouldPersistRemoteCwd) {
      const nextLeaseMetadata = {
        ...(lease.metadata ?? {}),
        ...(Object.keys(workspaceRealization).length > 0 ? { workspaceRealization } : {}),
        ...(realizedRemoteCwd !== null ? { remoteCwd: realizedRemoteCwd } : {}),
      };
      const updatedLease = await environmentsSvc.updateLeaseMetadata(lease.id, nextLeaseMetadata);
      if (updatedLease) {
        lease = updatedLease;
      } else {
        lease = { ...lease, metadata: nextLeaseMetadata } as typeof lease;
      }
      if (persistedExecutionWorkspace && Object.keys(workspaceRealization).length > 0) {
        const updatedEw = await executionWorkspacesSvc.update(persistedExecutionWorkspace.id, {
          metadata: {
            ...(persistedExecutionWorkspace.metadata ?? {}),
            workspaceRealizationRequest,
            workspaceRealization,
          },
        });
        if (updatedEw) {
          persistedExecutionWorkspace = updatedEw;
        }
      }
    }`;

const matches = source.split(before).length - 1;
if (matches !== 1) {
  throw new Error(`Expected one unpatched Paperclip workspace-orchestrator block; found ${matches}`);
}

await writeFile(file, source.replace(before, after), "utf8");
console.log(`Applied upstream remoteCwd fix to ${file}`);
