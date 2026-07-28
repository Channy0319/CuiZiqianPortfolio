import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { startStaticServer } from "./static-server.mjs";

const dist = resolve(process.cwd(), "dist");
if (!existsSync(dist)) {
  throw new Error("Missing dist directory. Run `pnpm build` first.");
}

startStaticServer({
  root: dist,
  port: Number(process.argv[2] || process.env.PORT || 4173),
  cacheAssets: true,
});
