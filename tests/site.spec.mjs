import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const wcag = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("desktop: teclado, anclas y enlaces de contacto", async ({ page }) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Explorar soluciones" }).click();
  await expect(page).toHaveURL(/#capacidades$/);

  const links = await page
    .locator("a[href]")
    .evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href")),
    );
  for (const href of links.filter((href) => href.startsWith("#"))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
  for (const href of links.filter((href) => href.startsWith("mailto:"))) {
    expect(href).toMatch(/^mailto:contacto@blandskron\.com(?:\?subject=.+)?$/);
  }
  expect(links).toContain("https://github.com/Blandskron/agnara");
  expect(links).toContain("https://github.com/Blandskron/AgenteIADocumental");
  expect(failures).toEqual([]);
});

test("móvil: apertura con teclado, Escape, foco y selección", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.locator(".mobile-menu");
  const trigger = menu.locator("summary");
  const nav = menu.getByRole("navigation");
  await expect(nav).toBeHidden();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(nav).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Capacidades" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await nav.getByRole("link", { name: "Proyectos" }).click();
  await expect(nav).toBeHidden();
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(page.locator("#proyectos")).toBeFocused();
});

test("sin JavaScript: servicios, proyectos y menú nativo", async ({
  browser,
}) => {
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 750 },
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("summary").click();
  await page
    .getByRole("navigation", { name: "Navegación móvil" })
    .getByRole("link", { name: "Proyectos" })
    .click();
  await expect(page.getByRole("heading", { name: "Agnara." })).toBeInViewport();
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /contacto@blandskron\.com/ }),
  ).toBeVisible();
  await page.close();
});

for (const width of [320, 375, 768, 901, 1024, 1440]) {
  test("reflujo y contenido a " + width + " px", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Contacta a BLANDSKRON/ }),
    ).toBeVisible();
  });
}

test("texto al 200 % y movimiento reducido", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 768 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(768);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

for (const width of [375, 1440]) {
  test("axe WCAG A/AA a " + width + " px", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    if (width < 900) await page.locator("summary").click();
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page }).withTags(wcag).analyze();
    expect(result.violations).toEqual([]);
  });
}

test("404 real, regreso al inicio y cabeceras", async ({ page }) => {
  const response = await page.goto("/una/ruta-inexistente");
  expect(response.status()).toBe(404);
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Página no encontrada.",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  expect(
    (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
  ).toEqual([]);
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL("/");
});

test("SEO: coherencia entre canonical, redes, sitemap y datos estructurados", async ({
  page,
  request,
}) => {
  const origin = "https://blandskron.cl/";
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CL");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    origin,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    origin,
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("<loc>" + origin + "</loc>");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Sitemap: " + origin + "sitemap.xml",
  );
  const { "@graph": graph } = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  const organization = graph.find((item) => item["@type"] === "Organization");
  expect(organization.url).toBe(origin);
  expect(
    await (await request.get(new URL(organization.logo).pathname)).ok(),
  ).toBe(true);
  const services = graph.filter((item) => item["@type"] === "Service");
  expect(services).toHaveLength(5);
  for (const service of services) {
    expect(service.provider["@id"]).toBe(organization["@id"]);
    await expect(page.locator(new URL(service.url).hash)).toHaveText(
      service.name,
    );
  }
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(await (await request.get(new URL(image).pathname)).ok()).toBe(true);
  expect((await request.get("/index.html", { maxRedirects: 0 })).status()).toBe(
    301,
  );
});
