# arquesstudios.github.io

The official Arques Studios marketing site, rebuilt with a fortress-inspired aesthetic, modern tooling, and performance-first enhancements.

## Stack Highlights
- **Frontend tooling**: Vite + React + PostCSS (Autoprefixer) for fast dev cycles and tree-shaken production builds.
- **Styling**: Custom vanilla CSS using design tokens, layered gradients, and castle-themed motifs.
- **Interactions**: React-rendered markup with lightweight enhancement modules (nav indicator, scroll reveals, lazy media) and `prefers-reduced-motion` support.
- **Assets**: Source images live in `images/` and are synced into `public/` before each dev/build run to keep Git history clean while preserving absolute URLs.
- **Deployment**: GitHub Actions workflow builds the site and deploys `dist/` to GitHub Pages on every push to `main`.

## Local Development

```bash
npm install
npm run dev
```

## Production Build & Preview

```bash
npm run build
npm run preview
```

The `predev`/`prebuild` scripts ensure static assets are mirrored into `public/` before Vite starts, so the served `/images/...` paths match production.
