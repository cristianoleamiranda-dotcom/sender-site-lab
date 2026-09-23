# Flujo adaptado: Web 3D / Scroll-Driven Premium con Arena.ai + GitHub
### Equivalencia del método ScrollCraft (Nate Herk) ejecutado 100% en Arena AI Agent Mode

---

## 0. ¿Se consigue el mismo resultado? — Sí, con estas equivalencias

| Fase del video (Claude Code) | Equivalente en Arena.ai + GitHub | ¿Mismo resultado? |
|---|---|---|
| Skill/plugin ScrollCraft instalado en `.claude/skills/` | Archivo de instrucciones reutilizable en el repo (`AGENTS.md` / `WORKFLOW.md`) que el agente lee al inicio | ✅ Sí — el "skill" pasa a ser un archivo versionado en GitHub |
| Entrevista interactiva en terminal | `ask_user` con opciones + texto libre en el chat | ✅ Sí — incluso mejor UI (preguntas con opciones clicables) |
| key.ai para generar imágenes/videos (API key en .env) | `generate_image` nativo (sin API key) + `image_search` para fotos reales | ✅ Imágenes sí. ⚠️ Video: se genera imagen → se anima con CSS/GSAP/Three.js en vez de video IA |
| Datos vivos (contador de miembros en tiempo real) | `fetch_page` / `web_search` / `curl` a APIs públicas durante el build | ✅ Sí |
| Build en localhost por el agente | Agente escribe código en el workspace + `start_process` con **LIVE PREVIEW** en tu navegador | ✅ Sí — ventaja: ves el sitio en vivo sin instalar nada |
| Auto-verificación con screenshots + zoom a keyframes | Preview en vivo (tú verificas visualmente) + `curl`/tests en bash + Playwright headless opcional para screenshots | ✅ Parcial-igual: la verificación visual la haces tú en el preview; el agente verifica estructura, links, build y performance |
| Feedback iterativo por chat | Idéntico: chat con feedback por sección | ✅ Sí |
| Deploy | `git push` a GitHub → GitHub Pages / Vercel / Netlify (+ GitHub Actions) | ✅ Sí |

**Ventajas de Arena.ai sobre el flujo del video:**
- No instalas nada: el sandbox ya tiene Node, npm, git.
- Preview en vivo integrado (el sitio se abre en tu navegador mientras se construye).
- Generación de imágenes nativa sin API keys ni costos de key.ai.
- Preguntas de entrevista con UI de opciones (más rápido que escribir en terminal).

**Limitaciones a conocer:**
- `node_modules`, paquetes instalados y procesos **no persisten** entre sesiones → el repo en GitHub es la fuente de verdad (persisten solo los archivos del workspace).
- Las credenciales de git (`.git/config`, tokens) no se guardan → para `push` necesitas proporcionar un **Personal Access Token (PAT)** de GitHub en la sesión (o descargar el repo y subirlo tú).
- No hay video-IA nativo: los "videos" de assets se reemplazan por animaciones en canvas/WebGL/CSS, que de hecho son **más interactivas con el scroll** (justo el objetivo del método).

---

## 1. Arquitectura del flujo adaptado

```
GITHUB (fuente de verdad)                ARENA.AI (ejecución)
┌──────────────────────┐   git clone   ┌──────────────────────────────┐
│ repo: mi-sitio-3d    │──────────────▶│ workspace /home/user         │
│ ├─ AGENTS.md (skill) │               │  ├─ Fase 1: ask_user brief   │
│ ├─ WORKFLOW.md       │               │  ├─ Fase 2: generate_image   │
│ ├─ public/assets/    │               │  ├─ Fase 3: npm create vite  │
│ ├─ src/              │               │  ├─ Fase 4: build + preview  │
│ └─ .github/workflows │               │  ├─ Fase 5: verificación     │
└──────────────────────┘               │  └─ Fase 6: feedback chat    │
         ▲                             └──────────────────────────────┘
         │  git push (PAT)                        │
         └────────────────────────────────────────┘
                          │
                          ▼
              DEPLOY: GitHub Pages / Vercel / Netlify
              (automático con GitHub Actions al hacer push)
```

---

## 2. Las 7 fases, paso a paso en Arena.ai

### Fase 0 — Repo GitHub (5 min)
**Opción A (desde cero):**
```bash
mkdir mi-sitio-3d && cd mi-sitio-3d
git init
# crear AGENTS.md con las reglas del "skill" (ver sección 3)
git add . && git commit -m "chore: init repo con workflow scrollcraft"
git remote add origin https://github.com/TU-USUARIO/mi-sitio-3d.git
```
**Opción B (repo existente / sitio actual a rediseñar):**
```bash
git clone https://github.com/TU-USUARIO/mi-sitio-3d.git
# el agente lee el sitio actual, conserva copy + branding (como en el video)
```
**Para push desde Arena:** se necesita un PAT de GitHub (`repo` scope) pegado en la sesión, o alternativamente descargar el zip del workspace y subirlo manualmente. Nunca dejar el token en archivos del repo.

### Fase 1 — Brief & Entrevista (15–30 min)
En vez de escribir las respuestas en terminal, el agente lanza **`ask_user`** con las 6 preguntas del skill:
1. Scroll journey (qué ve el visitante primero y en qué orden)
2. Qué debe creer el visitante al final (1 oración)
3. Assets reales que tienes (en el repo o adjuntos en el chat)
4. Signature move (lo único que ningún otro sitio hace)
5. Zonas calmadas vs. intensas
6. Vibe: editorial / energético / minimalista / oscuro…

**Output:** `docs/brief.md` commiteado al repo.

### Fase 2 — Assets (30–60 min)
- `generate_image` nativo para cada asset faltante, **con la paleta de marca en el prompt** (ej: "minimalist low-poly geometric human figures, brand colors #0A66C2 and #0B1220, clean background") → se guardan en `public/assets/`.
- `image_search` para fotos/texturas reales de referencia.
- Regla del video: todo asset generado debe coincidir con los guidelines de marca.
- Optimización: `sharp`/`ffmpeg` vía bash para comprimir a WebP y redimensionar.
- Para 3D real: modelos GLB descargables (Poly Pizza, Sketchfab CC) o primitivas de Three.js generadas por código (no requieren assets).

**Output:** `public/assets/` completo y versionado en GitHub.

### Fase 3 — Setup técnico (10 min, en el sandbox)
```bash
npm create vite@latest . -- --template react   # o vanilla
npm i gsap lenis three @react-three/fiber @react-three/drei
```
Stack del método:
- **GSAP + ScrollTrigger** → animaciones ligadas al progreso del scroll
- **Lenis** → smooth scroll premium
- **React Three Fiber + drei** → escenas 3D (globo, partículas, modelos) sincronizadas al scroll
- **Framer Motion** (opcional) → micro-animaciones y reveals

### Fase 4 — Build (30–60 min)
El agente escribe el sitio sección por sección según el brief:
- Cada sección = un `ScrollTrigger` o timeline: `progreso de scroll → estado de animación`.
- Patrón 3D: en R3F, `useFrame` lee el progreso del scroll y mueve cámara/objetos (efecto "volar por el mundo" del video).
- Reglas: animaciones reversibles (scroll arriba/abajo sin romperse), velocidad perceptible (el error que Nate corrigió: "va demasiado rápido"), 2–3 momentos intensos + zonas calmas, `prefers-reduced-motion`.

**Preview en vivo:**
```
start_process → "npm run dev -- --host 0.0.0.0" → preview en tu navegador
```
Ves el sitio **mientras se construye** — equivalente al localhost del video pero sin instalar nada.

### Fase 5 — Verificación (20–40 min)
- **Visual:** tú recorres el preview en vivo (desktop y móvil) y anotas lo que "se sienta bland".
- **Automática por el agente:**
  - `curl` a cada ruta → 200 OK, sin assets 404.
  - Playwright headless (instalable en el sandbox) → screenshots por secciones/keyframes del scroll, como la auto-verificación del video.
  - `npm run build` → sin errores de producción.
  - Lighthouse CI opcional vía GitHub Actions.
- **Checklist:** links/CTAs a URLs reales, captions correctos, responsive, performance, sin bugs de reload.

### Fase 6 — Feedback iterativo (1–3 pasadas)
Mismo formato del video, por chat:
> "1) El hero se siente bland al cargar — añade profundidad estilo magazine cover. 2) La animación del globo va muy rápido — bájale la velocidad. 3) Elimina la sección X. 4) Que el texto entre como typewriter."

El agente corrige → el preview se actualiza en caliente (HMR) → verificas al instante. Cada pasada se commitea: `git commit -m "fix: hero + velocidad globo (feedback ronda 1)"` → historial de versiones comparable en GitHub.

### Fase 7 — Deploy & mantenimiento
- **Push final:** `git push origin main` (con PAT en sesión).
- **Deploy automático (elegir uno):**
  - **GitHub Pages** + Actions: workflow `.github/workflows/deploy.yml` que hace build y publica en cada push → gratis, ideal para landing estática.
  - **Vercel / Netlify:** conectar el repo → deploy automático con preview por PR.
- **CI de verificación (reemplaza parte del "harness" del video):** GitHub Actions con build + Lighthouse CI + link checker en cada push.
- **Mantenimiento:** cada cambio = issue en GitHub → sesión en Arena: brief mini → build → preview → feedback → push.

---

## 3. El "skill" como archivo del repo: `AGENTS.md`

En Claude Code el skill es un plugin; aquí es un **archivo versionado en GitHub** que el agente lee al empezar cada sesión (pégaselo o lo clonas del repo):

```markdown
# SKILL: ScrollCraft-Arena
Construye landing pages premium scroll-driven. Reglas:
1. ANTES de escribir código, entrevista al usuario (ask_user) con estas preguntas:
   scroll journey / creencia final / assets reales / signature move / calmo vs intenso / vibe.
2. Usa solo principios de diseño (espaciado, tipografía, jerarquía), NUNCA un template fijo.
3. El scroll sincroniza animaciones: el usuario controla la "película" con su mouse,
   reversible adelante/atrás. GSAP ScrollTrigger + Lenis; Three.js/R3F para 3D.
4. Genera assets faltantes con generate_image respetando la paleta de marca del brief.
5. Instrucción emocional > especificación técnica en cada sección ("debe sentirse…").
6. Al terminar: verifica con screenshots/curl/build antes de entregar; reporta lo verificado.
7. 2-3 momentos intensos máximo; el resto calmo. Respeta prefers-reduced-motion.
8. Commitea cada ronda de feedback con mensaje descriptivo.
```

**Este archivo hace que CUALQUIER sesión futura (o cualquier agente compatible que lea `AGENTS.md`) reproduzca el mismo método** — el skill deja de depender de una cuenta o plugin y vive en tu repo.

---

## 4. Resumen ejecutivo

| Paso | Acción en Arena.ai | Tiempo |
|---|---|---|
| 0 | Clonar/crear repo GitHub + `AGENTS.md` | 5 min |
| 1 | Entrevista con `ask_user` → `docs/brief.md` | 15–30 min |
| 2 | `generate_image` + optimización → `public/assets/` | 30–60 min |
| 3 | `npm create vite` + GSAP/Lenis/R3F | 10 min |
| 4 | Build + **live preview** en tu navegador | 30–60 min |
| 5 | Verificación (screenshots/curl/build + tu revisión) | 20–40 min |
| 6 | 1–3 rondas de feedback por chat + commits | 1–2 h |
| 7 | `git push` → GitHub Pages/Vercel con Actions | 15 min |
| **Total** | **Sitio scroll-driven/3D premium desplegado** | **~medio día** |

---

## 5. Diferencias finales vs. el video (para decidir con claridad)

| Aspecto | Video (Claude Code + key.ai) | Arena.ai + GitHub |
|---|---|---|
| Setup inicial | Instalar Claude Code, plugin, API keys | Nada — sandbox listo |
| Video-IA de assets | Sí (key.ai: imagen→video→stitch) | No nativo → se sustituye por animación 3D/CSS ligada al scroll (más interactiva) |
| Verificación con screenshots | Automática por el "harness" | Playwright en sandbox + preview en vivo (tú verificas en tiempo real) |
| Reutilización del método | Plugin en tu máquina | `AGENTS.md` en GitHub — compartido con todo el equipo |
| Versionado | Local | GitHub: cada ronda de feedback es un commit comparable |
| Costo | API de key.ai + suscripción | Generación de imágenes incluida; deploy gratis en Pages/Vercel |
