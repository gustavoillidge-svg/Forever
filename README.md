# WoW Forever — Generador de Macros

Herramienta comunitaria (no oficial) para generar macros de estilo WoW Forever con datos dinámicos de la Forever News API.

## Índice

- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Iconos y marca](#iconos-y-marca)
- [Botón de comentarios (WhatsApp)](#botón-de-comentarios-whatsapp)
- [API utilizada](#api-utilizada)
- [Instalación y uso](#instalación-y-uso)
- [PWA](#pwa)
- [Pruebas](#pruebas)
- [Generar iconos PWA y favicon](#generar-iconos-pwa-y-favicon)
- [Optimizaciones de rendimiento](#optimizaciones-de-rendimiento)
- [Avisos](#avisos)
- [Licencia](#licencia)

## Características

- **Generador de macros**: arrastra hechizos a la secuencia, configura condiciones (`[help]`, `[harm]`, `[@mouseover]`, modificadores, `castsequence`, etc.), genera y copia el macro al portapapeles.
- **Datos dinámicos**: hechizos, raciales y talentos se cargan de la Forever News API (`https://wowforever.news/api/v1/...`) con caché localStorage (24h TTL), `AbortController` para cancelar peticiones obsoletas y fallback a datos embebidos.
- **Simulador de talentos**: 9 clases × 3 árboles, hasta 51 puntos, tooltips por talento.
- **PWA**: instalable, funciona offline (assets estáticos en caché, API con stale-while-revalidate).
- **Persistencia**: selección de clase/raza/nivel, opciones y secuencia se guardan en localStorage.
- **Contador de comentarios persistente**: el botón de WhatsApp guarda su conteo en `localStorage`, por lo que sobrevive a refrescos de página.

## Iconos y marca

Todos los iconos de la aplicación (navegador, pestaña, acceso directo de carpeta y PWA) usan el logo de Forever (`assets/logo.png`):

| Ubicación | Archivo | Propósito |
|-----------|---------|-----------|
| Navegador / pestaña | `assets/logo.png` | `<link rel="icon">` y `<link rel="shortcut icon">` en `index.html` y `Forever.html` |
| Acceso directo Windows / carpeta | `favicon.ico` | Generado en raíz con 6 tamaños (16–256 px) a partir del logo |
| Instalación PWA | `assets/logo.png` | Único icono en `manifest.json` |
| Apple touch icon | `icons/icon-192.png` | `<link rel="apple-touch-icon">` |

Los iconos PWA (`icons/icon-192.png`, `icons/icon-512.png`) se mantienen para compatibilidad, pero el manifiesto ahora apunta al logo de Forever.

## Botón de comentarios (WhatsApp)

Ubicado en `index.html` (esquina inferior derecha), usa `assets/whatsapp.png` como ícono (112×112 px, botón transparente sin fondo ni borde).

**Flujo (truco rickroll ×6):**

1. Al hacer clic, se muestra brevemente la imagen de rickroll (`assets/rickroll.jpg`) durante 1.2 s.
2. El botón se mueve a una posición aleatoria de la pantalla.
3. Desde el primer clic, el botón adquiere la clase `.feedback-glow`: brillo verde WhatsApp (`#25d366`) y escala creciente (animación GPU-composited).
4. Los clics 1 a 5 repiten el ciclo (rickroll + movimiento).
5. En el **6.º clic**, el botón redirige a `https://wa.me/gustavoillidge` (WhatsApp @gustavoillidge).
6. El conteo se guarda en `localStorage` (`wf_feedback_clicks`), por lo que persiste al refrescar la página.

## API utilizada

- **Forever News Data API**: `https://wowforever.news/api/v1/talents?class={clase}`, `/api/v1/spells?class={clase}`, `/api/v1/racials?race={raza}` — no requiere clave de API.
- **ForeverDB API**: requiere clave de API (`https://foreverdb.net/developers`) — no usada por defecto.

Iconos de hechizos: `https://wowforever.news/icons/{icono}.png`

## Instalación y uso

1. Clona o descarga este repositorio.
2. Abre `index.html` en un navegador moderno (o sirve con un servidor local, ej. `python -m http.server` o `npx serve`).
3. Selecciona clase y raza (solo combinaciones válidas para Forever).
4. Arrastra hechizos del pool a la secuencia, ajusta opciones y genera el macro.
5. Copia el macro al portapapeles.
6. (Opcional) Usa el botón de WhatsApp para enviar comentarios.

## PWA

- El manifiesto en `manifest.json` permite instalar la app como PWA.
- El service worker (`service-worker.js`) almacena en caché los assets estáticos y usa stale-while-revalidate para las respuestas de la API.

## Pruebas

Ejecutar las pruebas unitarias del generador de macros:

```bash
node tests/macro.test.js
```

Se esperan 12 pruebas pasando (exit code 0).

## Generar iconos PWA y favicon

Los iconos PWA ya están generados (`icons/icon-192.png`, `icons/icon-512.png`). Para regenerarlos:

```bash
node scripts/generate-icons.js
```

Requiere `canvas` (ya en `package.json`).

El `favicon.ico` (6 tamaños, 16–256 px) se genera a partir de `assets/logo.png`:

```bash
node scripts/generate-favicon.js
```

Requiere `canvas`.

## Optimizaciones de rendimiento

- **Ruta crítica de carga**: `<link rel="preconnect">` a `fonts.googleapis.com` y `wowforever.news`; `<link rel="preload" fetchpriority="high">` del `logo.png`; fuente Google Fonts cargada no bloqueante (`media="print" onload="this.media='all'"`).
- **Scripts diferidos**: todos los `<script>` usan `defer`.
- **Imágenes lazy**: `loading="lazy"` en iconos de facción.
- **CSS sin `@import` bloqueante**: eliminada la importación de fuentes en CSS.
- **Animaciones GPU-composited**: `.feedback-glow` anima solo `transform` (brillo estático en `box-shadow`).
- **`content-visibility: auto`**: en paneles para render diferido fuera del viewport.
- **Debounce de búsqueda**: `filterSpellPool` con 120 ms de debounce para evitar re-renders por cada tecla.
- **AbortController**: las peticiones a la API se cancelan cuando cambian de clase/raza rápidamente, evitando condiciones de race.

## Avisos

- Datos comunitarios no oficiales. Nombres, niveles y disponibilidad pueden variar.
- Sin afiliación con Blizzard Entertainment ni con los servidores Forever.
- Algunos datos están marcados como `[VERIFICAR Forever]` y requieren confirmación en fuentes autorizadas.

## Licencia

Uso comunitario, sin garantías.
