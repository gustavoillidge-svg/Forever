# Wow Forever Tool

Herramienta web para World of Warcraft. Proyecto estático (HTML, CSS, JavaScript) con soporte PWA mediante service worker y manifiesto.

## Estructura

```
wow-forever-tool/
├── index.html          # Punto de entrada principal
├── Forever.html        # Vista principal de la herramienta
├── manifest.json       # Manifiesto de la PWA
├── service-worker.js   # Service worker para cacheo offline
├── .gitignore          # Archivos ignorados por git
├── assets/             # Recursos estáticos (iconos, catálogos)
│   └── icons/
│       └── catalog/
├── css/                # Hojas de estilo
├── icons/              # Iconos del proyecto
└── js/                 # Lógica de JavaScript
```

## Requisitos

Navegador web moderno con soporte para service workers y manifiesto de PWA.

## Uso

Abre `index.html` en el navegador o despliega el proyecto en un servidor web estático (GitHub Pages, Netlify, Vercel, etc.).

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+)
- Service Workers (PWA)
- Web App Manifest

## Funciones (macro)

- `/cast`, `/castsequence reset=target`, `#showtooltip`, modificadores reales `[mod:shift/ctrl/alt]` y condiciones (`@mouseover`, `help/harm`, `nodead`, `exists`, `combat`, `nostance`).
- Copiar portapapeles: **solo macro** (sin advertencias); conserva `#showtooltip` y líneas de comando. Fallback accesible si Clipboard API falla.
- Advertencias separadas en UI + validación de sintaxis básica y límite típico **255 caracteres**.
- `/cancelaura` con input inline (sin `prompt()`), nombre saneado.
- Selección de idioma de salida de hechizos (ES/EN, según cliente) `[VERIFICAR]` nombres localizados.
- Filtro raza↔clase (referencia Classic) con fallback permisivo; combinaciones Forever marcadas `[VERIFICAR Forever]`.
- Reordenar secuencia (drag de slots) y persistencia local (`localStorage`, versión).
- Datos con marcas `[VERIFICAR Forever]` cuando no se confirmaron contra fuentes autorizadas.

## Assets

Recursos en `assets/` y `icons/`. Catálogos: `assets/icons/catalog/` (incluye índice Wowhead/nether, 33,097 nombres). Descarga masiva reanudable (no subir 33k binarios al repo normal sin decisión): `powershell -ExecutionPolicy Bypass -File scripts/download_all_icons.ps1`. Páginas Wowhead/Forever directas pueden devolver 403 según entorno; usar fuentes autorizadas/export.

## Pruebas

```bash
node tests/macro.test.js
node --check js/data.js && node --check js/macros.js && node --check js/talents.js && node --check js/app.js
```

## Licencia

MIT

---
Última actualización: noviembre 2026 (v1.1.0, SW v7)