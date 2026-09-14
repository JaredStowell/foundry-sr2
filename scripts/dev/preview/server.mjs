import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";

const root = resolve(fileURLToPath(new URL("../../../", import.meta.url)));
const vendors = {
  "/vendor/jquery/": "node_modules/jquery/dist/",
  "/vendor/handlebars/": "node_modules/handlebars/dist/",
  "/vendor/fontawesome/": "node_modules/@fortawesome/fontawesome-free/",
};
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (path === "/") path = "/scripts/dev/preview/index.html";
    if (path === "/favicon.ico") {
      res.writeHead(204).end();
      return;
    }
    path = path.replace(/^\/systems\/shadowrun2e\//, "/");
    const vendor = Object.keys(vendors).find((prefix) => path.startsWith(prefix));
    if (vendor) path = `/${vendors[vendor]}${path.slice(vendor.length)}`;
    else if (
      !/^\/(scripts|templates|styles|data|icons|lang)\//.test(path) &&
      path !== "/template.json"
    )
      throw new Error("Not served");
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) throw new Error("Not served");
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
});
server.listen(Number(process.env.SR2_PREVIEW_PORT || 4175), "127.0.0.1", () => {
  console.log(`SR2 styled preview: http://127.0.0.1:${server.address().port}`);
});
