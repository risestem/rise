# RISE STEM website

Use Node.js 20+ and the existing checkout. Install with `npm ci` and start with
`npm run dev`. Open `/home`, `/kits`, or `/turtle`; clean URLs and `.html` routes
both work locally. `npm run build` builds all HTML pages and copies the data,
Markdown profiles, and header needed by runtime requests. `npm run preview`
serves the production output.

## Browser regression checks

Run `npx playwright install chromium` once, then `npm run test:browser`.
The script starts and stops its own local Vite server. It checks navigation,
mobile menus, contact modals, offline Markdown rendering, image fallbacks,
and turtle animation progress in desktop, phone and landscape viewports,
including real touch input and reduced motion.

To test an already running production preview, set
`SMOKE_BASE_URL=http://127.0.0.1:4173`. To use a system browser, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`.

## Images

The site uses size-bounded WebP copies in `public/optimized` and retains source
photos in `public`. With Pillow installed, run `python3 scripts/optimize_images.py`
to convert newly referenced JPEG/PNG photos and update their references. The
script preserves orientation and transparency, caps dimensions at 1600 px,
and leaves already optimized references unchanged.

Vite serves files under `public` at the site root: use `/optimized/photo.webp`,
not `/public/optimized/photo.webp`. Browser libraries are pinned locally under
`public/vendor`; see its README and licenses for update instructions.

## Deployment

GitHub Pages builds and tests the site with `.github/workflows/deploy-pages.yml`
on pushes to `main`. Configure the repository's Pages source as **GitHub Actions**.
The workflow publishes `dist` only after the production browser checks pass.
The custom domain is retained in `CNAME`. Unused legacy frame directories and
original photos with optimized replacements stay in the source checkout and
are omitted from the deployment artifact.
