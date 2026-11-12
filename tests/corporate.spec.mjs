import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import settings from "../config/site.json" with { type: "json" };

const origin = "https://blandskron.cl";
const wcag = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const legal = [
  ["/privacidad/", "Política de privacidad"],
  ["/terminos/", "Términos de uso"],
];

for (const [path, title] of legal) {
  test(
    title + ": navegación, HTML sin JS y metadatos",
    async ({ browser, request }) => {
      const page = await browser.newPage({
        javaScriptEnabled: false,
        viewport: { width: 320, height: 700 },
      });
      await page.goto("/");
      await page
        .getByRole("navigation", { name: "Información legal" })
        .getByRole("link", { name: title })
        .click();
      await expect(page).toHaveURL(path);
      await expect(page).toHaveTitle(title + " | BLANDSKRON");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        origin + path,
      );
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-security-policy"]).toContain(
        "default-src 'none'",
      );
      const sitemap = await (await request.get("/sitemap.xml")).text();
      const canonicalEntry = "<loc>" + origin + path + "</loc>";
      if (settings.legalApproved) {
        expect(sitemap).toContain(canonicalEntry);
        await expect(
          page.locator('meta[name="robots"][content*="noindex"]'),
        ).toHaveCount(0);
      } else {
        expect(sitemap).not.toContain(canonicalEntry);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          "content",
          "noindex, follow",
        );
        await expect(
          page.getByText("Borrador.", { exact: true }),
        ).toBeVisible();
      }
      await expect(
        page
          .getByRole("banner")
          .getByRole("link", { name: "Inicio", exact: true }),
      ).toHaveAttribute("href", "/");
      await page.close();
    },
  );

  for (const width of [320, 1440]) {
    test(title + ": axe y foco a " + width + " px", async ({ page }) => {
      await page.setViewportSize({ width, height: 820 });
      await page.goto(path);
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("link", { name: "Saltar al contenido" }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("main")).toBeFocused();
      expect(
        (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations,
      ).toEqual([]);
      if (width === 320) {
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
        });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
    });
  }
}

test("Configuración de WhatsApp: enlace directo, aviso y cero conexiones anticipadas", async ({
  page,
  context,
}) => {
  const external = [];
  const errors = [];
  page.on("request", (req) => {
    if (new URL(req.url()).hostname !== "127.0.0.1") external.push(req.url());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.setViewportSize({ width: 1440, height: 850 });
  await page.goto("/");
  const links = page.locator('a[href^="https://wa.me/"]');
  const enabled =
    Boolean(settings.whatsapp) && process.env.BLANDSKRON_WHATSAPP !== "off";
  if (enabled) {
    await expect(links).toHaveCount(3);
    const href = new URL(await links.first().getAttribute("href"));
    expect(href.origin).toBe("https://wa.me");
    expect(href.pathname).toBe("/" + settings.whatsapp.slice(1));
    expect(href.searchParams.get("text")).toBe(
      "Hola, me gustaría conocer los servicios tecnológicos de BLANDSKRON y conversar sobre un proyecto.",
    );
    const float = page.locator(".whatsapp-float");
    await expect(float).toBeInViewport();
    const button = await float.boundingBox();
    const mainContent = await page.locator(".hero-main").boundingBox();
    expect(button.x).toBeGreaterThan(mainContent.x + mainContent.width);
    await float.focus();
    await expect(float).toBeFocused();
    await expect(float).toHaveAccessibleName(/sitio externo/);
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    const footerTop = (await page.locator(".site-footer").boundingBox()).y;
    const finalButton = await float.boundingBox();
    expect(finalButton.y + finalButton.height).toBeLessThanOrEqual(
      footerTop + 1,
    );
    await page.setViewportSize({ width: 320, height: 720 });
    await expect(float).toBeHidden();
    await expect(page.locator(".whatsapp-contact")).toBeVisible();
  } else {
    await expect(links).toHaveCount(0);
    await expect(page.locator(".whatsapp-rail, .whatsapp-contact")).toHaveCount(
      0,
    );
  }
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  expect(await context.cookies()).toEqual([]);
  await page.goto("/privacidad/");
  const whatsappSection = page.getByRole("heading", {
    name: "Consultas por WhatsApp Business",
  });
  await expect(whatsappSection).toHaveCount(enabled ? 1 : 0);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("HTTP: alias permanentes, errores reales y archivos privados fuera de la salida", async ({
  request,
}) => {
  for (const path of [
    "/privacidad",
    "/terminos",
    "/privacidad/index.html",
    "/terminos/index.html",
  ]) {
    const response = await request.get(path + "?ref=qa", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toMatch(
      /^\/(privacidad|terminos)\/\?ref=qa$/,
    );
  }
  for (const path of [
    "/privacidad/no-existe",
    "/assets/no-existe.js",
    "/.git/HEAD",
    "/.env",
    "/package.json",
    "/config/site.json",
    "/_headers",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("Página no encontrada.");
  }
  const method = await request.post("/");
  expect(method.status()).toBe(405);
  expect(method.headers().allow).toBe("GET, HEAD");
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).not.toMatch(
    /unsafe-inline|unsafe-eval/,
  );
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(home.headers()["strict-transport-security"]).toBeUndefined();
});
