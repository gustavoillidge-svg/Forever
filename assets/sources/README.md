# Fuentes de assets (WoW Forever / referencia)

## Iconos descargados
- Origen de imagen: `https://wow.zamimg.com/images/wow/icons/small/<icon>.jpg` (CDN usado por la app).
- Selección “coincidente con WoW Forever (proyecto)”: IDs de icono extraídos de `js/data.js`, `js/macros.js`, `js/talents.js` y `Forever.html` (clases, razas, raciales, hechizos y UI referenciados por la herramienta).
- Catálogo generado:
  - `assets/icons/catalog/icon-ids.txt` — lista de IDs únicos.
  - `assets/icons/catalog/icons.json` — estado por icono (id, local, source, status, bytes/error).
  - `assets/icons/catalog/icons.csv` — versión tabular.

## Fuentes solicitadas (referencia, no scrapeadas por bloqueo 403 en este entorno)
- https://www.wowhead.com/es/icons
- https://www.wowhead.com/forever
- https://www.wowhead.com/forever/spells
- https://www.wowhead.com/forever/guide/new-race-class-combinations
- https://www.wowhead.com/forever/changes
- https://www.wowhead.com/forever/talent-calc

Nota: al descargar desde estas páginas se recibió `403` en fetch directo. Los iconos útiles para la herramienta se obtuvieron desde el CDN de iconos ya referenciado por el código/datos del proyecto y se catalogaron localmente. Si necesitas ampliar a *todos* los iconos de esas páginas, hay que usar un método de extracción autorizado (export/sitemap/API/datos provistos) o ejecutar la descarga desde un entorno con acceso a Wowhead.
# README iconos
- Descargados localmente en `assets/icons/small/<id>.jpg` (229 IDs referenciados por la herramienta: clases/razas/raciales/hechizos/UI de `js/*` y `Forever.html`).
- Fuente de imagen: CDN `wow.zamimg.com/images/wow/icons/small/<id>.jpg` (coincide con el patrón usado por la app).
- 13 IDs sin nombre exacto en el CDN se resolvieron con variantes/fallbacks y quedaron como `status=retried` en el catálogo; revisa `assets/icons/catalog/icons.json` si quieres ajustar alguno al icono “canónico”.

## Fuentes Wowhead solicitadas (documentadas)
`assets/sources/source-fetch.json` registra el intento de acceso con User-Agent a:
- https://www.wowhead.com/es/icons
- https://www.wowhead.com/forever
- https://www.wowhead.com/forever/spells
- https://www.wowhead.com/forever/guide/new-race-class-combinations
- https://www.wowhead.com/forever/changes
- https://www.wowhead.com/forever/talent-calc

Resultado en este entorno: 403 (sin scraping/contenido de página guardado). Para descargar *todos* los iconos del índice Wowhead o extraer assets específicos de esas guías/cambios/talentos, usa un método autorizado (export/sitemap/API/dataset de Wowhead) o ejecútalo desde un entorno con acceso permitido.
