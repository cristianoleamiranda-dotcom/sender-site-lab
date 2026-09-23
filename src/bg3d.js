/* =========================================================
   Fondo inmersivo 3D — estilo video ScrollCraft (AIS globe)
   Globo wireframe con arcos de señal + campo de partículas
   fly-through ligado al scroll + mouse parallax.
   ========================================================= */
import * as THREE from 'three';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(pointer: coarse), (max-width: 1100px)').matches;

const canvas = document.createElement('canvas');
canvas.id = 'bg3d';
canvas.setAttribute('aria-hidden', 'true');
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(COARSE ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, 6);

const BLUE = new THREE.Color('#1e73be');
const CYAN = new THREE.Color('#0085b2');

/* ---------- campo de partículas (túnel fly-through) ---------- */
const COUNT = 3800;
const pos = new Float32Array(COUNT * 3);
const col = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 30;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 17;
  pos[i * 3 + 2] = -Math.random() * 52;
  const c = Math.random() > 0.5 ? BLUE : CYAN;
  col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
const pMat = new THREE.PointsMaterial({
  size: 0.05, vertexColors: true, transparent: true, opacity: 0.55,
  depthWrite: false, blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

/* ---------- globo wireframe + puntos ---------- */
const globe = new THREE.Group();
globe.position.set(2.6, 0.5, -7);
const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.9, 3)),
  new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.22 })
);
globe.add(wire);

const DOTN = 260;
const dpos = new Float32Array(DOTN * 3);
for (let i = 0; i < DOTN; i++) {
  const v = new THREE.Vector3().randomDirection().multiplyScalar(1.9);
  dpos[i * 3] = v.x; dpos[i * 3 + 1] = v.y; dpos[i * 3 + 2] = v.z;
}
const dGeo = new THREE.BufferGeometry();
dGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
globe.add(new THREE.Points(dGeo, new THREE.PointsMaterial({
  size: 0.035, color: CYAN, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending,
})));
scene.add(globe);

/* ---------- arcos de señal (Santiago → mundo) ---------- */
const latLon = (lat, lon, r) => {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};
const ROUTES = [
  [-33.4, -70.6, -27.1, -109.4],  // Santiago → Rapa Nui
  [-33.4, -70.6, -33.0, -71.6],   // Santiago → Valparaíso
  [-33.4, -70.6, 40.4, -3.7],     // Santiago → internacional
];
const pulses = [];
ROUTES.forEach(([la1, lo1, la2, lo2], idx) => {
  const a = latLon(la1, lo1, 1.9);
  const b = latLon(la2, lo2, 1.9);
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.9 + a.distanceTo(b) * 0.45);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  globe.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5 })));
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x9fd8ef, transparent: true, opacity: 0.95 })
  );
  pulse.userData = { curve, offset: idx / ROUTES.length };
  globe.add(pulse);
  pulses.push(pulse);
});

/* ---------- estado ligado a scroll / mouse / zonas ---------- */
let scrollProg = 0;
let targetOpacity = 0.4;
let mouseX = 0, mouseY = 0;

function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProg = max > 0 ? window.scrollY / max : 0;
}
readScroll();
window.addEventListener('scroll', readScroll, { passive: true });

window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

/* zonas intensas: hero, espectro, contacto */
const zoneObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) targetOpacity = 0.62;
  });
}, { threshold: 0.25 });
['#hero', '#espectro', '#contacto'].forEach((sel) => {
  const el = document.querySelector(sel);
  if (el) zoneObserver.observe(el);
});
const calmObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) targetOpacity = 0.34; });
}, { threshold: 0.3 });
['#trayectoria', '#capacidades', '#nosotros'].forEach((sel) => {
  const el = document.querySelector(sel);
  if (el) calmObserver.observe(el);
});

/* ---------- loop ---------- */
let currentOpacity = 0.4;
const clock = new THREE.Clock();

function frame() {
  const t = clock.getElapsedTime();

  currentOpacity += (targetOpacity - currentOpacity) * 0.05;
  canvas.style.opacity = currentOpacity.toFixed(3);

  /* fly-through: la cámara avanza con el scroll (efecto del video) */
  camera.position.z = 6 - scrollProg * 16;
  camera.position.x += (mouseX * 0.7 - camera.position.x) * 0.04;
  camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, -10);

  particles.rotation.z = t * 0.012 + scrollProg * 0.35;
  globe.rotation.y = t * 0.06 + scrollProg * 1.6;
  globe.position.y = 0.5 + Math.sin(t * 0.4) * 0.12;

  pulses.forEach((p) => {
    const k = (t * 0.22 + p.userData.offset) % 1;
    p.position.copy(p.userData.curve.getPoint(k));
  });

  renderer.render(scene, camera);
  if (!reduce && !COARSE) requestAnimationFrame(frame);
}
frame();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (reduce) renderer.render(scene, camera);
});
