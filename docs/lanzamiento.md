# Lista de lanzamiento

El sitio publicado no se modificó. La compilación local está en **dist/** y se puede regenerar con npm ci y npm run build.

- [x] Compilar el sitio y validar HTML, TypeScript, lint, formato y navegación.
- [x] Comprobar el menú por teclado, el reflujo, la reducción de movimiento y el 404.
- [x] Revisar canonical, sitemap, robots, enlaces, metadatos sociales y Schema.org.
- [x] Ejecutar Lighthouse móvil y escritorio sobre la compilación local.
- [ ] **Responsable del hosting:** aprobar el cambio y hacer un respaldo. Desplegar primero en un entorno con acceso restringido.
- [ ] **Hosting y DNS:** asociar blandskron.cl y www.blandskron.cl, comprobar sus certificados y redirigir HTTP, www y el alias de Pages al dominio canónico. En la consulta previa al lanzamiento, el servidor existente devolvió 200 para HTTP y para HTTPS con www. Conservar ruta y parámetros en las redirecciones. Si se migra DNS, preservar MX, SPF, DKIM, DMARC y otros registros que ya estén en uso.
- [ ] **Hosting:** confirmar 200 en la portada canónica, redirección 301 o 308 en las variantes, 404 real para rutas inexistentes, cabeceras de seguridad, compresión Brotli o gzip, revalidación de HTML y caché inmutable para assets versionados. Activar HSTS tras verificar TLS y HTTPS; habilitar subdominios únicamente si todos soportan HTTPS.
- [ ] **Contenido:** confirmar recepción en contacto@blandskron.com con una prueba del equipo que gestiona el buzón. Revisar la tarjeta social con la URL pública. Confirmar perfiles corporativos antes de añadir enlaces o sameAs.
- [ ] **Search Console:** verificar la propiedad de dominio mediante TXT DNS, enviar sitemap.xml, inspeccionar la portada y vigilar indexación, consultas, clics, impresiones y CTR.
- [ ] **Bing Webmaster Tools:** verificar la propiedad, enviar el mismo sitemap y revisar la URL con el inspector. Confirmar que no haya bloqueos involuntarios en el CDN.
- [ ] **Rendimiento en campo:** revisar CrUX, PageSpeed Insights y Core Web Vitals en Search Console cuando exista muestra suficiente. Volver a medir Lighthouse sobre el dominio real después del cambio de hosting.
- [ ] **Accesibilidad:** completar un recorrido con lector de pantalla y ampliar a Safari/iOS y Firefox en staging antes de certificar conformidad.

## Analítica opcional

El lanzamiento funciona sin scripts de medición ni cookies no esenciales. Si se aprueba analítica, seleccionar proveedor e identificador reales, revisar los requisitos aplicables al tratamiento de datos en Chile y adaptar CSP y aviso de privacidad antes de activar. El selector [data-contact-link] identifica los enlaces de correo para un futuro evento contact_click. Un clic indica intención de contacto; no confirma el envío ni la recepción de un mensaje. Registrar solo el tipo de acción y la ubicación del enlace, sin contenido del correo. Medir LCP, INP y CLS de campo por separado del informe de laboratorio.

## Verificaciones de esta revisión antes de cPanel

- [ ] Aprobar textos legales y expediente de tratamientos; comprobar la fecha efectiva de la reforma en BCN y Diario Oficial. Cambiar legalApproved a true, recompilar y confirmar 200, canonical, sitemap y ausencia de noindex en las rutas aprobadas.
- [ ] Confirmar que la cuenta empresarial de WhatsApp recibe y atiende consultas. Revisar accesos, respaldo y retención del chat. Si no se habilita el canal, compilar con whatsapp en null.
- [ ] En cPanel, confirmar Document Root, respaldar contenido y .htaccess, y probar en staging con acceso restringido. Copiar solo HTML y assets, incluidas las carpetas privacidad/ y terminos/. Mantener los archivos privados fuera de la raíz y conservar .well-known si lo necesita la renovación de TLS.
- [ ] Fusionar reglas LiteSpeed; comprobar 301 o 308 de HTTP/www, /index.html y alias legales conservando consulta; confirmar que el destino HTTPS no crea bucles. Verificar CSP sin bloqueos de recursos, ausencia de contenido mixto, gzip/Brotli y caché adecuada. Activar HSTS solo después de las pruebas, sin incluir subdominios ni preload por defecto.
- [ ] Consultar una ruta y un asset inexistentes: esperar 404 real con el documento corporativo. Para mantenimiento, configurar 503 y Retry-After si el proveedor lo admite. No simular 403/405 o 5xx mediante redirecciones 200.
- [ ] En un perfil limpio, comprobar cookies, almacenamiento y solicitudes al cargar portada, documentos y footer. Realizar una comprobación en el dispositivo de WhatsApp sin enviar datos de terceros. Confirmar logs, proveedores, ubicación y plazos con sus administradores.
