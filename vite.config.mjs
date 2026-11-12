import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import settings from "./config/site.json" with { type: "json" };
import { corporateLayout } from "./scripts/site-layout.mjs";

const inputs = [
  "index.html",
  "404.html",
  "privacidad/index.html",
  "terminos/index.html",
];

export default defineConfig({
  plugins: [
    corporateLayout({
      ...settings,
      whatsapp:
        process.env.BLANDSKRON_WHATSAPP === "off" ? null : settings.whatsapp,
    }),
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: inputs.map((file) =>
        fileURLToPath(new URL(file, import.meta.url)),
      ),
    },
  },
});
