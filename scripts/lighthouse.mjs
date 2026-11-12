import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import lighthouse, { desktopConfig } from "lighthouse";
import { startPreview } from "./preview.mjs";

const { server, url } = await startPreview(0);
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    args: ["--remote-debugging-port=9222"],
  });
  const categories = ["performance", "accessibility", "best-practices", "seo"];
  await mkdir("docs/lighthouse", { recursive: true });
  for (const [name, config] of [
    ["mobile", undefined],
    ["desktop", desktopConfig],
  ]) {
    const result = await lighthouse(
      url,
      {
        port: 9222,
        output: ["html", "json"],
        logLevel: "error",
        onlyCategories: categories,
      },
      config,
    );
    const [html, json] = result.report;
    await writeFile("docs/lighthouse/" + name + ".report.html", html);
    await writeFile("docs/lighthouse/" + name + ".report.json", json);
    const scores = Object.fromEntries(
      categories.map((id) => [id, result.lhr.categories[id].score * 100]),
    );
    const metrics = Object.fromEntries(
      [
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
      ].map((id) => [id, result.lhr.audits[id].numericValue]),
    );
    process.stdout.write(JSON.stringify({ name, scores, metrics }) + "\n");
  }
} finally {
  await browser?.close();
  server.close();
}
