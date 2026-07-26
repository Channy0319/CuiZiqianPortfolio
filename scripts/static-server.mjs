import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export function startStaticServer({ root, port }) {
  const absoluteRoot = resolve(root);
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const relativePath = normalize(pathname).replace(/^([/\\])+/, "");
    let filePath = join(absoluteRoot, relativePath || "index.html");

    if (!filePath.startsWith(absoluteRoot)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    if (!existsSync(filePath)) {
      const publicFile = join(absoluteRoot, "public", relativePath);
      filePath = existsSync(publicFile) ? publicFile : join(absoluteRoot, "index.html");
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": MIME_TYPES[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Craft Table V3 serving from ${absoluteRoot}`);
    console.log(`Local: http://127.0.0.1:${port}`);
  });

  return server;
}
