# Informe de Lighthouse

Medición del 11 de noviembre de 2026 sobre dist servido en 127.0.0.1 con las cabeceras de producción. Lighthouse 13.6.0, Chrome 157 sin interfaz, Windows, Node.js 24. Se usó el perfil móvil predeterminado (Moto G Power simulado, 150 ms de RTT, 1.638 Kbps, CPU ×4) y el perfil de escritorio de Lighthouse. Las puntuaciones son de laboratorio; el hosting, la conexión y el dispositivo reales pueden cambiar los resultados.

| Perfil     | Rendimiento | Accesibilidad | Buenas prácticas | SEO |    LCP |   TBT |    CLS |
| ---------- | ----------: | ------------: | ---------------: | --: | -----: | ----: | -----: |
| Móvil      |          98 |           100 |              100 | 100 | 0,99 s | 98 ms | 0,0183 |
| Escritorio |         100 |           100 |              100 | 100 | 0,28 s |  0 ms | 0,0049 |

Los cuatro puntajes superan la meta de 95 en ambos perfiles. LCP y CLS de laboratorio quedaron bajo los umbrales solicitados. Lighthouse registra TBT; esa métrica no equivale a INP. Los objetivos LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75 quedan pendientes de medir con tráfico real, según la [metodología de Web Vitals](https://web.dev/articles/vitals).

La compilación usa fuentes variables WOFF2 del subconjunto latino, servidas desde el mismo origen y con font-display swap. El módulo de navegación pesa aproximadamente 0,64 kB comprimido, y la hoja principal 6,59 kB comprimida según Vite. Los logotipos mantienen dimensiones explícitas, y el del pie se carga de forma diferida. El hosting aplica la compresión y la caché de producción.

Reproducir con npm run build y npm run audit:lighthouse. Los informes HTML y JSON se generan en docs/lighthouse/. Las pruebas de laboratorio no reemplazan la comprobación de cabeceras y compresión en el dominio real.
