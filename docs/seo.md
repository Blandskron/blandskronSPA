# Validación SEO y búsqueda en Chile

## Implementación

La portada usa es-CL, un H1, jerarquía H2/H3, canonical absoluto, meta robots, metadatos sociales y un sitemap con una única URL. El 404 está excluido de la indexación y mantiene su código HTTP en la vista previa. HTML, navegación y servicios funcionan sin renderizado de JavaScript. El logo social, favicon y logo de entidad se sirven en archivos locales.

El JSON-LD declara Organization, WebSite, WebPage y cinco nodos Service con el proveedor y área Chile. La prueba local comprueba que cada Service apunte a un encabezado visible y que el logo resuelva. Se conserva el correo del HTML y del sitio vigente; el dominio publica un registro MX, lo que no prueba la recepción en el buzón. Se omitieron LocalBusiness, dirección, teléfono, horarios y BreadcrumbList. Los repositorios públicos verifican la existencia de los proyectos; el perfil que los aloja no se declaró como sameAs corporativo. El marcado no garantiza resultados enriquecidos.

## Intención de búsqueda

Revisión cualitativa de resultados en español para Chile, el 11 de noviembre de 2026. Es una muestra de oferta visible, no una medición de volumen, dificultad, CTR ni posición.

| Intención                   | Consultas revisadas o derivadas                                                                                                 | Respuesta en la landing                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Contratar un desarrollo     | desarrollo de software a medida en Chile; empresa de desarrollo de software; desarrollo de aplicaciones web y sistemas internos | Title, H1, descripción y tarjeta de software con enlace para consultar. |
| Conectar sistemas           | integraciones API; automatización de procesos empresariales; conectar sistemas internos                                         | Tarjeta de automatización y diagrama de arquitectura.                   |
| Evaluar IA para una empresa | integración de inteligencia artificial; implementación de agentes de IA; búsqueda sobre documentos de empresa                   | Tarjeta de IA y proyecto documental identificado como experimental.     |
| Evaluar criterio técnico    | consultoría tecnológica; ciberseguridad aplicada al software; arquitectura de sistemas empresariales                            | Capacidades, metodología y ejemplos de ingeniería enlazados.            |

La muestra incluyó las páginas de oferta de [DPAT](https://dpat.cl/servicios/software-a-medida/), [CMC](https://www.cmc.cl/) y [FGSII](https://www.fgsii.cl/servicios/integracion-sistemas-ia/). La oferta observada diferencia problemas de desarrollo nuevo, integración con sistemas existentes y uso de IA. La landing responde a esas necesidades en secciones de una sola URL. No se crearon páginas repetidas ni un FAQ que duplicara el contenido.

Para búsqueda asistida por IA se aplican las mismas bases: acceso al HTML, entidad coherente, descripciones concretas y referencias públicas a [Agnara](https://github.com/Blandskron/agnara) y [AgenteIADocumental](https://github.com/Blandskron/AgenteIADocumental). No se requiere llms.txt ni se promete que los asistentes citen el sitio.

Referencias consultadas: [Google Search Central: funciones de IA](https://developers.google.com/search/docs/appearance/ai-features), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Schema.org Service](https://schema.org/Service) y [Bing: sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed).

## Resultados de validación

El [Schema Markup Validator](https://validator.schema.org/) procesó el HTML compilado con cero errores y cero advertencias. Reportó seis elementos de nivel superior: una WebPage (con WebSite y Organization anidados por referencia) y cinco Service. La respuesta original se conserva con los archivos de auditoría. La comprobación de URL de Google queda para después del despliegue, cuando pueda leer esta versión del dominio.

La portada y la página 404 pasaron html-validate. El [validador HTML de W3C](https://validator.w3.org/nu/) no reportó errores; las observaciones de formato sobre el cierre de elementos vacíos corresponden a Prettier. Las pruebas también verificaron que sitemap, canonical, Open Graph y servicios coincidan. Los dos enlaces de proyecto respondieron HTTP 200 el día de la revisión.
