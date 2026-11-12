# BLANDSKRON.cl

Sitio corporativo estático de BLANDSKRON SpA. El HTML inicial contiene toda la landing y la página de error. El menú móvil usa un control nativo y TypeScript mejora el cierre y la gestión del foco. Vite compila el CSS, las fuentes locales y el módulo de navegación. No hay backend, formularios, rastreadores ni dependencias de JavaScript en producción.

## Ejecutar en local

Requiere Node.js 22.13 o posterior; validado con Node.js 24.

```sh
npm ci
npm run dev
```

Para probar el resultado estático con la CSP y el 404 habilitados:

```sh
npm run build
npm run preview
```

La vista previa escucha en http://127.0.0.1:4173. Para ejecutar la suite y las auditorías:

```sh
npx playwright install chromium
npm run format:check
npm run lint
npm run validate:html
npm test
npm run audit:lighthouse
npm audit
```

En Windows también se puede indicar la ruta de Chrome instalado mediante la variable CHROME_PATH. En Linux CI, usar npx playwright install --with-deps chromium.

## Estructura

- **index.html y 404.html:** páginas semánticas, metadatos y datos estructurados. Las anclas de servicios son secciones de la portada.
- **src/styles/**: tokens, tipografías y estilos por sección. Los colores, familias, espaciado general y radios se definen en tokens.css.
- **src/navigation.ts:** mejora progresiva del menú móvil. Sin JS, el menú nativo y los enlaces siguen disponibles.
- **public/brand/**: marca original del manual v1.0, extraída sin redibujar. WebP sin pérdidas para el logo, PNG para el símbolo de 48 px y las imágenes de buscadores y redes. El logo horizontal usa srcset. Los diagramas de la landing están hechos con HTML y CSS.
- **public/**: reglas de Cloudflare Pages, robots y sitemap. **deploy/litespeed/**: configuración alternativa para el servidor actual.
- **tests/** y **scripts/**: pruebas y herramientas de QA. GitHub Actions ejecuta los controles en cada push y pull request.

## Despliegue

**Cloudflare Pages:** seleccionar «None» como preset, Node 24, npm run build como comando de compilación y dist como directorio de salida. Pages aplica _headers y _redirects y usa 404.html para rutas inexistentes. Habilitar TLS, HTTPS, redirección de alias y compresión en el panel. Mantener los entornos previos al lanzamiento con acceso restringido.

**LiteSpeed o Apache 2.4 (cPanel):** en Dominios, confirmar la raíz de blandskron.cl (suele ser public_html si es el dominio principal). Respaldar esa carpeta y el archivo oculto .htaccess. Subir y extraer en esa raíz un ZIP con index.html, 404.html, robots.txt, sitemap.xml y las carpetas assets/, brand/ y licenses/. Estos archivos salen de dist; deben quedar directamente en la raíz del dominio, sin una carpeta dist intermedia. Omitir _headers y _redirects, que son propios de Cloudflare Pages, y retirar el ZIP de la raíz pública después de extraerlo. Adaptar deploy/litespeed/.htaccess al virtual host y probarlo en staging: requiere permisos para ErrorDocument, DirectoryIndex, Rewrite y Header, y supone que el servidor termina TLS. Si hay proxy inverso, aplicar el redireccionamiento HTTP en el proxy. La plantilla fuerza el dominio de producción; ajustar el dominio y proteger el acceso al probar en staging. Activar Brotli o gzip desde el hosting.

**Otros servidores estáticos:** servir dist en la raíz, aplicar las cabeceras de public/_headers, redirigir HTTP, www y /index.html, y responder con el contenido de 404.html y estado HTTP 404 para rutas inexistentes. Conservar la caché larga solo en /assets con nombres versionados.

Antes de publicar, seguir la [lista de lanzamiento](docs/lanzamiento.md). Para revertir, restaurar el despliegue previo en Pages o el respaldo del document root y las reglas en LiteSpeed.

- [Rendimiento y Lighthouse](docs/rendimiento.md)
- [Accesibilidad](docs/accesibilidad.md)
- [SEO, Schema.org e intención de búsqueda](docs/seo.md)
