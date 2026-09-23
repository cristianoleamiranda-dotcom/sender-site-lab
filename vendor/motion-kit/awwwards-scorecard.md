# Scorecard Awwwards — sender-site
Criterios oficiales (jurado ≥18 miembros, se descartan los 3 votos más alejados):
**Design 40% · Usability 30% · Creativity 20% · Content 10%.**
Honorable Mention ≥ 6.5 · SOTD recientes: 7.45–8.65.

## Autoevaluación ponderada (2026-09-23, post v13.1)
| Criterio | Peso | Nota | Evidencia / deuda |
|---|---|---|---|
| Design | 40% | 8.0 | Sistema de marca coherente (DESIGN.md), capa editorial, zonas negro-cine; deuda: consistencia del menú overlay en landscape móvil |
| Usability | 30% | 7.5 | Lenis, nav, bilingüe, a11y base, videos preload metadata; deuda: **jank en Android gama media** (pins 100vh + 3 videos), sin focus-trap en menú, Lighthouse aún no corrido |
| Creativity | 20% | 8.2 | Firma doble: desarme scrubbed de apertura + productos keynote; lenguaje GoPro transversal |
| Content | 10% | 8.5 | Copy real sender.cl sin repeticiones, datos como exhibits, ES/EN |
| **Ponderado** | | **≈ 7.9** | Zona HM holgada; para SOTD hay que subir Usability a 8.5+ |

## Palancas para SOTD (en orden de impacto/precio)
1. Performance móvil: un solo video scrub activo a la vez (IntersectionObserver pausa el resto), `content-visibility`, sprites de poster.
2. Focus-trap + navegación por teclado del menú overlay.
3. SplitText oficial + will-change audit (menos layout thrash).
4. Página 404 de marca + OG por sección.
5. Un "momento memorable" extra: morph del logo en preloader (MorphSVG gratis).
