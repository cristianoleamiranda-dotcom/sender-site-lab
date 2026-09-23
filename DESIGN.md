# DESIGN.md — Sender (BIS SpA)
Sistema de diseño portable, estilo OpenDesign. Cualquier agente que renderice
para esta marca debe respetar estos tokens sin re-preguntar.

## Color
| Token | Valor | Uso |
|---|---|---|
| `--white` | #ffffff | Fondos editoriales, texto sobre oscuro |
| `--blue` | #1e73be | Primario: CTAs, marquee, enlaces, contacto |
| `--gray` | #494949 | Texto principal, sección espectro, footer |
| `--cyan` | #0085b2 | Acento: labels, aguja, ondas, hovers |
| Derivados permitidos | rgba de gray/blue/cyan; #f4f8fb; #8fd0e8; #cfe9f7 | Bordes, velos, tintes |
| Prohibidos | ámbar, navy v1, verde WhatsApp como color de marca | — |

## Tipografía
- Display editorial: **Fraunces** (serif, 500) — h2, pull quotes, índice catálogo, menú.
- UI/display técnica: **Space Grotesk** (500-700) — logo, botones, stats, HUDs.
- Cuerpo: **Inter** (400-600).
- Mono técnico: **IBM Plex Mono** — labels, specs, folios, HUD REC, capítulos.
- Escala hero: clamp(46px, 9vw, 128px); h2: clamp(34px, 5.4vw, 64px).

## Forma y espacio
- Radios: 18-26px tarjetas/stages; 999px pills/botones.
- Reglas editoriales: 1px rgba(gray,.14); folios `NN / 07` en cada sec-head.
- Grid: container min(1200px, 92%); secciones padding clamp(90px,13vh,160px).
- Figuras numeradas `FIG. NN —` bajo toda imagen (mono 11px uppercase).

## Movimiento (motion system)
- Smooth scroll Lenis lerp .09; scrub GSAP .3-.4; eases power3/power4.out.
- Máximo 2-3 momentos intensos por vista; el resto calmo.
- Patrones firma: split-words con máscara, scramble-decode en labels,
  tilt 3D ±9° con puntero, parallax interno de imágenes ±10%,
  product film pineado con scrub y capítulos, shot-cycler de 4 tomas,
  globo 3D + partículas fly-through ligado al scroll.
- `prefers-reduced-motion`: todo estático, sin loops ni scrub.

## Voz (ES/EN)
- ES: técnica y sobria, segunda persona formal implícita ("su proyecto").
- EN: internacional B2B, directa ("Let's talk about your project.").
- Prohibido: hype vacío, emojis en copy, superlativos sin respaldo.
- Regla editorial: **ninguna afirmación sin su exhibit** (proyecto real detrás).

## Assets
- Fotos reales de marca primero; renders IA solo con paleta y fondo graphite #0d1420.
- Videos: MP4 H.264 24fps 6s ≤8MB loop perfecto, fondo negro o graphite,
  slots en `public/assets/videos/` (tx-hero, cap-*, prop-rapanui).
- Logo: wordmark SENDER + línea azul-cian; sobre oscuro, blanco.
