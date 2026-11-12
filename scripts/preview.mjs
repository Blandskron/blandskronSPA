import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

export async function startPreview(port = 4173) {
  const config = await readFile(resolve(root, "_headers"), "utf8");
  const generalHeaders = Object.fromEntries(
    config
      .split(/\r?\n\r?\n/)[0]
      .split(/\r?\n/)
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const colon = line.indexOf(":");
        return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
      }),
  );
  const notFound = await readFile(resolve(root, "404.html"));
  const server = createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url ?? "/", "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (pathname === "/index.html") {
      res.writeHead(301, { Location: "/" }).end();
      return;
    }
    const file = resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    let status = 404;
    let content = notFound;
    let type = mime[".html"];
    if (file.startsWith(root + sep) && mime[extname(file)]) {
      try {
        content = await readFile(file);
        status = pathname === "/404.html" ? 404 : 200;
        type = mime[extname(file)];
      } catch {
        // Missing files use the same 404 template as the production host.
      }
    }
    res.writeHead(status, {
      ...generalHeaders,
      "Content-Type": type,
      ...(status === 200 && pathname.startsWith("/assets/")
        ? { "Cache-Control": "public, max-age=31536000, immutable" }
        : {}),
    });
    res.end(req.method === "HEAD" ? undefined : content);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return { server, url: "http://127.0.0.1:" + server.address().port };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { url } = await startPreview(Number(process.env.PORT || 4173));
  process.stdout.write("Vista previa: " + url + "\n");
}
