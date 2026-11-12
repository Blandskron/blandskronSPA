import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const legalPaths = ["/privacidad/", "/terminos/"];
const origin = "https://blandskron.cl";
const email = "contacto@blandskron.com";
const message =
  "Hola, me gustaría conocer los servicios tecnológicos de BLANDSKRON y conversar sobre un proyecto.";

export function whatsappUrl(number) {
  if (number === null || number === "") return null;
  if (typeof number !== "string" || !/^\+[1-9]\d{7,14}$/.test(number)) {
    throw new Error("Configura WhatsApp como + y 8 a 15 dígitos, o usa null.");
  }
  return (
    "https://wa.me/" + number.slice(1) + "?text=" + encodeURIComponent(message)
  );
}

const logo = (footer = false) => {
  const loading = footer ? ' loading="lazy" decoding="async"' : "";
  return (
    '<a class="logo" href="/"><img src="/brand/blandskron-360.webp" srcset="/brand/blandskron-360.webp 360w, /brand/blandskron-720.webp 720w" sizes="181px" width="360" height="75" alt="BLANDSKRON, inicio"' +
    loading +
    " /></a>"
  );
};

export function renderSiteLayout(html, { url, legalApproved, year }) {
  const link = (className, label, body) =>
    url
      ? '<a class="' +
        className +
        '" href="' +
        url +
        '" rel="noreferrer"' +
        (label ? ' aria-label="' + label + '"' : "") +
        ">" +
        body +
        "</a>"
      : "";
  const subheader =
    '<header class="subpage-header"><div class="container">' +
    logo() +
    '<a href="/">Inicio <span aria-hidden="true">↗</span></a></div></header>';
  const footer =
    '<footer class="site-footer"><div class="container"><div class="footer-inner">' +
    '<div class="footer-brand">' +
    logo(true) +
    "<p>Software, inteligencia artificial y automatización para empresas.</p></div>" +
    '<nav class="footer-nav" aria-label="Navegación de pie de página">' +
    '<a href="/">Inicio</a><a href="/#capacidades">Capacidades</a><a href="/#enfoque">Enfoque</a>' +
    '<a href="/#proyectos">Proyectos</a><a href="/#metodo">Metodología</a><a href="/#contacto">Contacto</a></nav></div>' +
    '<div class="footer-details"><nav class="footer-nav" aria-label="Información legal">' +
    '<a href="/privacidad/">Política de privacidad</a><a href="/terminos/">Términos de uso</a></nav>' +
    '<div class="footer-nav"><a data-contact-link href="mailto:' +
    email +
    '">' +
    email +
    "</a>" +
    link(
      "footer-whatsapp",
      "",
      'WhatsApp <span class="external-note">(sitio externo)</span>',
    ) +
    '</div></div><p class="copyright">© ' +
    year +
    " BLANDSKRON SpA · Chile</p></div></footer>";
  const glyph =
    '<img src="/brand/whatsapp-glyph.svg" alt="" width="24" height="24" />';
  const floating = url
    ? '<div class="whatsapp-rail">' +
      link(
        "whatsapp-float",
        "Contactar por WhatsApp (sitio externo)",
        glyph + '<span aria-hidden="true">WhatsApp · sitio externo</span>',
      ) +
      "</div>"
    : "";
  const contact = link(
    "whatsapp-contact",
    "",
    glyph +
      "<span>Contactar por WhatsApp <small>(sitio externo)</small></span>",
  );
  const whatsappPrivacy = url
    ? "<h2>Consultas por WhatsApp Business</h2><p>Si eliges este canal, saldrás de BLANDSKRON.cl. WhatsApp puede tratar tu número, los datos del perfil y la información asociada a la comunicación según sus propias políticas. BLANDSKRON recibe lo que compartes con su cuenta empresarial, junto con el número y los datos de perfil que el servicio muestra, para responder a tu consulta. Puedes elegir el correo en su lugar. Abrir el enlace no envía un mensaje automáticamente.</p>"
    : "";
  const slots = {
    "site-header": subheader,
    "site-footer": footer,
    "whatsapp-floating": floating,
    "whatsapp-contact": contact,
    "whatsapp-privacy": whatsappPrivacy,
    "legal-robots": legalApproved
      ? ""
      : '<meta name="robots" content="noindex, follow" />',
    "legal-status": legalApproved
      ? ""
      : '<p class="legal-status"><strong>Borrador.</strong> Pendiente de revisión jurídica antes de su publicación definitiva.</p>',
  };
  return html.replace(/<!-- slot:([\w-]+) -->/g, (_, name) => {
    if (!Object.hasOwn(slots, name))
      throw new Error("Slot desconocido: " + name);
    return slots[name];
  });
}

export function corporateLayout({ whatsapp, legalApproved }) {
  const url = whatsappUrl(whatsapp);
  let outputDir;
  let root;
  return {
    name: "blandskron-static-layout",
    configResolved(config) {
      root = config.root;
      outputDir = resolve(root, config.build.outDir);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return renderSiteLayout(html, {
          url,
          legalApproved,
          year: new Intl.DateTimeFormat("es-CL", {
            timeZone: "America/Santiago",
            year: "numeric",
          }).format(new Date()),
        });
      },
    },
    async writeBundle() {
      if (!legalApproved) return;
      const sitemap = await readFile(
        resolve(root, "public/sitemap.xml"),
        "utf8",
      );
      const entries = legalPaths
        .map((path) => "  <url><loc>" + origin + path + "</loc></url>")
        .join("\n");
      await writeFile(
        resolve(outputDir, "sitemap.xml"),
        sitemap.replace("</urlset>", entries + "\n</urlset>"),
      );
    },
  };
}
