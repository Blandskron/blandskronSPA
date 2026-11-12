# Validación de accesibilidad

Se usó [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) como referencia. Las pruebas se ejecutaron sobre dist en Chromium con Playwright y axe-core 4.14.0. Se revisó la portada a 375 px con el menú expandido, a 1440 px y la página 404. Resultado automatizado final: cero infracciones en las reglas A/AA ejecutadas.

- Revisión visual de portada y capacidades en escritorio y de la portada y el menú abierto a 320 px.
- Reflujo automatizado a 320, 375, 768, 901, 1024 y 1440 px. Prueba de texto escalado al 200 % a 768 px y de reducción de movimiento.
- Recorrido por teclado: enlace para saltar al contenido, apertura de menú, primer enlace, Escape con retorno al control, selección de una sección con foco en el destino. Los controles principales tienen estado de foco y el menú tiene un área de 44 px.
- Menú y enlaces comprobados con JavaScript desactivado. El contenido se muestra desde el HTML inicial y no depende de animaciones.
- Contrastes de etiquetas secundarias corregidos tras la primera ejecución de axe. Se eliminaron elementos decorativos del árbol de accesibilidad y el diagrama significativo conserva su explicación textual.

Las pruebas automáticas y la inspección visual no certifican por sí solas conformidad integral. Queda pendiente el recorrido con lector de pantalla y la prueba en dispositivos y navegadores adicionales indicada en la lista de lanzamiento.
