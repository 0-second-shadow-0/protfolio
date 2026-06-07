# protfolio

Personal portfolio website for **SECOND SHADOW** — a systems engineer and game developer.

## Architecture

Built as a single-page static site with vanilla HTML, CSS, and JavaScript. No frameworks or build tooling — lightweight and dependency-free.

### Structure

```
index.html      — Semantic HTML5 layout with sections for About, Projects, Demos, Contact
style.css       — Dark theme with CSS animations (blob parallax, click flare, 3D ripple)
script.js       — Interactive features: cursor blob, Desmos 3D embed, Game of Life
```

### Interactive Features

- **Floating blob** — Parallax gradient that follows the cursor
- **Dreamy flare** — Purple radial burst on click
- **3D water ripple** — Embedded Desmos 3D graph with animated wave equation
- **Game of Life** — 100×100 Conway's Game of Life with Start/Stop, Randomize, and Clear controls; click to toggle cells
- **Click ripple** — 3D-perspective concentric ring spawned at cursor position

### Embedded Content

- **Desmos 3D Calculator** — renders `z = sin(2√(x² + y²) - 3t) · e^(-0.08x² - 0.08y²)` with an animated time slider
- **YouTube channel link** — external reference to game dev / artwork content

### Styling Philosophy

- Dark theme (`#0f0f0f` background) with accent purple (`#6c63ff`)
- Glassmorphism elements (blur, semi-transparency, subtle borders)
- CSS-only background ripple layer with perspective transform for 3D depth
- Responsive layout via max-width and flexible units

## Deployment

No build step required. Serve the directory with any static file server:

```sh
npx serve .
# or
python3 -m http.server 8000
```

The site is statically deployable to Vercel, Netlify, GitHub Pages, or any static host.

## License

MIT
