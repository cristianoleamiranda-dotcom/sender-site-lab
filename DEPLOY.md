# Deploy — Sender scroll-driven site

El proyecto ya queda configurado para despliegue automático. Tres rutas:

## A. GitHub Pages (recomendada, gratis)
1. Crea el repo `sender-site` (o el nombre que quieras) en github.com → **no** lo inicialices con README.
2. Pega en el chat de Arena tu **Personal Access Token** (scope: `repo`) y tu usuario. El agente ejecuta:
   ```bash
   git remote add origin https://github.com/USUARIO/REPO.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. El workflow `.github/workflows/deploy.yml` construye y publica en cada push.
   URL final: `https://USUARIO.github.io/REPO/` (el `base: './'` de vite.config.js ya lo soporta).

## B. Vercel / Netlify ( previews por PR )
1. Pushea el repo a GitHub (pasos 1-2 de arriba).
2. En vercel.com / netlify.com → *Import project* → selecciona el repo.
3. Build command: `npm run build` · Output directory: `dist` · Node 20.
4. Cada push a `main` = deploy automático; cada PR = URL de preview.

## C. Hosting propio / zip
- `sender-site.zip` (en la raíz del workspace) contiene el build estático completo
  (`index.html` + assets con rutas relativas): súbelo a cualquier hosting
  (cPanel, S3, Cloudflare Pages manual, un Nginx…) y funciona tal cual.

## Verificación post-deploy (checklist del método)
- [ ] Hero, espectro y propagación animan al scroll en móvil y desktop.
- [ ] WhatsApp `wa.me/56983864148` y mails abren correctamente.
- [ ] Imágenes cargan (rutas relativas `./assets/…`).
- [ ] `prefers-reduced-motion` degradado sin errores de consola.
