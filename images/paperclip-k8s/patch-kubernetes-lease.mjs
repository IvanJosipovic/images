import { readFile, writeFile } from "node:fs/promises";

const root = process.env.PAPERCLIP_KUBERNETES_PLUGIN_ROOT ?? "/app/packages/plugins/sandbox-providers/kubernetes";

async function replaceOnce(relativePath, before, after) {
  const file = `${root}/${relativePath}`;
  const source = (await readFile(file, "utf8")).replace(/\r\n/g, "\n");
  const matches = source.split(before).length - 1;
  if (matches !== 1) {
    throw new Error(`Expected one matching Kubernetes provider block in ${file}; found ${matches}`);
  }
  await writeFile(file, source.replace(before, after), "utf8");
}

await replaceOnce(
  "src/plugin.ts",
  `      phase: "Pending",\n      backend: config.backend,\n      scopedNetworkPolicyName,`,
  `      phase: "Pending",\n      backend: config.backend,\n      remoteCwd: "/workspace",\n      scopedNetworkPolicyName,`,
);

await replaceOnce(
  "src/plugin.ts",
  `      phase: check.phase,\n      backend: leaseBackend,\n      scopedNetworkPolicyName:`,
  `      phase: check.phase,\n      backend: leaseBackend,\n      remoteCwd:\n        typeof params.leaseMetadata?.remoteCwd === "string" && params.leaseMetadata.remoteCwd.trim()\n          ? params.leaseMetadata.remoteCwd.trim()\n          : "/workspace",\n      scopedNetworkPolicyName:`,
);

await replaceOnce(
  "src/types.ts",
  `  backend: "sandbox-cr" | "job";\n  scopedNetworkPolicyName:`,
  `  backend: "sandbox-cr" | "job";\n  remoteCwd: string;\n  scopedNetworkPolicyName:`,
);

console.log(`Applied native-sync root fix to ${root}`);
