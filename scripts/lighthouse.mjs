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
  const agentic = process.argv.includes("--agentic");
  if (agentic) categories.push("agentic-browsing");
  await mkdir("docs/lighthouse", { recursive: true });
  const targets = [
    ["mobile", "/", undefined],
    ["desktop", "/", desktopConfig],
  ];
  if (process.argv.includes("--legal")) {
    targets.push(["privacidad-mobile", "/privacidad/", undefined]);
    targets.push(["terminos-mobile", "/terminos/", undefined]);
  }
  for (const [name, path, config] of targets) {
    const result = await lighthouse(
      new URL(path, url).href,
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
    if (result.lhr.runtimeError) {
      throw new Error(result.lhr.runtimeError.message);
    }
    const scores = {};
    for (const id of categories) {
      const category = result.lhr.categories[id];
      if (id === "agentic-browsing") {
        const audits = category.auditRefs.map(
          ({ id }) => result.lhr.audits[id],
        );
        const applicable = audits.filter(
          (audit) => audit.scoreDisplayMode !== "notApplicable",
        );
        scores[id] =
          applicable.filter((audit) => audit.score === 1).length +
          "/" +
          applicable.length;
        continue;
      }
      if (typeof category.score !== "number")
        throw new Error("Lighthouse no pudo medir " + id);
      scores[id] = Math.round(category.score * 100);
    }
    const metrics = Object.fromEntries(
      [
        "largest-contentful-paint",
        "first-contentful-paint",
        "server-response-time",
        "total-blocking-time",
        "cumulative-layout-shift",
        "total-byte-weight",
      ].map((id) => [id, result.lhr.audits[id].numericValue]),
    );
    process.stdout.write(JSON.stringify({ name, scores, metrics }) + "\n");
  }
} finally {
  await browser?.close();
  server.close();
}
