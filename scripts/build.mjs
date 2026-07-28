import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, "index.html"), resolve(dist, "index.html"));
await cp(resolve(root, "src"), resolve(dist, "src"), { recursive: true });
await cp(resolve(root, "public"), dist, { recursive: true });

const basePath = `/${(process.env.BASE_PATH || "").replace(/^\/+|\/+$/g, "")}`.replace(/^\/$/, "");

async function prefixDeploymentPaths(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await prefixDeploymentPaths(entryPath);
      continue;
    }
    if (!/\.(?:css|html|js)$/.test(entry.name)) continue;

    const source = await readFile(entryPath, "utf8");
    const deployed = source.replace(
      /([="'`(])\/(assets|media|projects|src)\//g,
      `$1${basePath}/$2/`,
    );
    if (deployed !== source) await writeFile(entryPath, deployed);
  }
}

if (basePath) await prefixDeploymentPaths(dist);

console.log(`Craft Table V3 production build complete: ${dist}${basePath ? ` (base: ${basePath})` : ""}`);
