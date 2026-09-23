# Guía de videos 3D — Sender (producidos por el cliente)

El sitio detecta automáticamente los videos en `public/assets/videos/` y los
**sincroniza al scroll** (scrub frame a frame) con adaptación 3D al diseño.

## Convención de archivos
| Slot | Archivo | Dónde aparece |
|---|---|---|
| Héroe transmisor flotante 360° | `public/assets/videos/tx-hero.mp4` | Hero (scrub con scroll + tilt 3D con puntero) |
| (futuro) Ficha AM | `public/assets/videos/cap-am.mp4` | Ficha 01 capacidades |
| (futuro) Ficha FM | `public/assets/videos/cap-fm.mp4` | Ficha 02 |
| (futuro) Ficha antenas | `public/assets/videos/cap-ant.mp4` | Ficha 03 |
| (futuro) Ficha RF | `public/assets/videos/cap-rf.mp4` | Ficha 04 |

## Specs técnicas de exportación
- MP4 H.264 · 24 fps · **6 s (144 frames)** · 1080×1350 (4:5) o 1080×1080
- **Loop perfecto:** el frame final = frame inicial (órbita cierra en 360°)
- Peso objetivo ≤ 8 MB (CRF 20-23); fondo **oscuro continuo** graphite #0d1420
- Objeto centrado con ≥15% de margen por lado (para que el scrub no recorte)
- Sin texto, sin logos, sin manos/personas

## Cómo generarlo (image-to-video)
1. Sube el frame base `public/assets/tx-hero-frame.jpg` como **primera imagen**
   (Runway Gen-3/4 Act-One, Kling 2.1/2.5, Veo 3, Hailuo 02, Pika 2).
2. Modo: **image-to-video** · camera control: *orbit / turntable* si existe.
3. Pega el prompt EN de abajo · duration 6 s · motion strength media (4-5/10).
4. Activa *loop* o pide en el prompt "ends at the starting angle".
5. Exporta MP4 y entrégalo en el chat o súbelo a la carpeta `videos/`.

---

## PROMPT HÉROE (transmisor flotante 360°) — copiar/pegar

> Seamless 360-degree turntable orbit: a professional solid-state AM broadcast
> transmitter rack (tall black chassis, brushed aluminum panels, two round analog
> VU meters, amber and green LED indicators) floats and slowly bobs in mid-air
> above a soft elliptical shadow, centered on a seamless dark graphite-blue
> studio background. The camera orbits exactly 360 degrees around the product at
> constant speed and ends at the starting angle for a perfect loop. Cinematic
> product film, soft top key light, blue (#1E73BE) and cyan (#0085B2) rim lights,
> subtle volumetric haze, photorealistic metal and glass materials.
> No text, no logos, no people, no camera shake. 6 seconds, 24 fps.

**Negative prompt:** text, watermark, logo, hands, people, extra objects,
background changes, lens distortion, camera shake, flicker.

**Versión ES (herramientas que aceptan español):**
> Órbita turntable de 360 grados sin cortes: un rack transmisor AM de estado
> sólido (chasis negro, paneles de aluminio cepillado, dos vúmetros analógicos,
> LEDs ámbar y verdes) flota y balancea suave en el aire sobre una sombra
> elíptica, centrado en un fondo de estudio graphite azul oscuro continuo. La
> cámara orbita exactamente 360° a velocidad constante y termina en el ángulo
> inicial para un loop perfecto. Luz clave suave cenital, luces de recorte azul
> (#1E73BE) y cian (#0085B2), niebla volumétrica sutil, materiales fotorrealistas.
> Sin texto, sin logos, sin personas. 6 segundos, 24 fps.

---

## PROMPTS EXTRAS (pack catálogo, misma receta)

**FM rack (frame: `cap-broadcast.jpg` o render nuevo):**
> Slow 240-degree orbit around a row of FM broadcast transmitter racks in a dark
> concrete plant room, LEDs glowing green and red, camera dollies gently forward
> while orbiting, dust particles in a cyan light beam, seamless dark background,
> perfect loop, 6 s, 24 fps. No text, no people.

**Mástil HF niebla (frame: `hero.jpg`):**
> Cinematic 3D orbit around a guyed HF mast with red beacon lights at dusk,
> low fog rolling over the coastal plain, camera rises 10 meters while orbiting
> 180 degrees, moody blue-hour grade, seamless loop feel, 6 s, 24 fps. No text.

**Estación NAVTEX acantilado (frame: `cap-critical.jpg`):**
> Drone-style 3D orbit around a white NAVTEX radio station on a rocky cliff in
> heavy sea fog, red-white mast with guy wires, waves breaking below, camera
> circles 200 degrees at constant altitude, cold maritime grade, 6 s, 24 fps.
> No text, no people.

**Torre de enlaces (frame: `cap-antennas.jpg`):**
> Low-angle 360 turntable around a galvanized lattice telecom tower loaded with
> panel antennas and microwave dishes, overcast graphite sky, camera orbits at
> constant speed ending at start angle, subtle parallax on hills, 6 s, 24 fps.
> No text, no people.

---

## Checklist de entrega
- [ ] Loop perfecto (frame 144 ≈ frame 1)
- [ ] Fondo oscuro continuo (se funde con el hero)
- [ ] ≤ 8 MB · 24 fps · 6 s
- [ ] Sin texto/logos quemados
- [ ] Nombre de archivo según la tabla de slots

---

## Plantilla Seedance 2.5 / Veo v3 (videos finales de los 5 slots)
Estructura de prompt que usan los tutorials 2026 (camera-first, un solo movimiento por toma):
`[SUBJECT] + [CAMERA MOVE único] + [LIGHTING paleta] + [MATERIALS] + [DURACIÓN/fps] + [LOOP] + [NEGATIVOS]`
Ejemplo slot cap-am:
> Blue Sender AM transmitter rack on pure black, slow dolly-in 40 mm, soft top key with
> blue #1E73BE and cyan #0085B2 rim lights, brushed aluminum and copper coil materials,
> 6 s 24 fps, perfect loop, no text no people no camera shake.
Regla: un movimiento de cámara por toma (dolly OR orbit OR macro glide), nunca dos.
