import { startStaticServer } from "./static-server.mjs";

startStaticServer({ root: process.cwd(), port: Number(process.argv[2] || process.env.PORT || 4173) });
