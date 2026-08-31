# Hitesh Nandakumar — Portfolio

A single-page static portfolio site built with plain HTML, CSS, and vanilla
JavaScript. No build step, no bundler, no backend. It runs directly in the
browser and serves as-is on GitHub Pages.

## Structure

```
PortfolioWebsite/
├── index.html                 # Single page: all seven sections + sticky nav
├── css/styles.css             # Theme, layout, sections, nav, responsiveness
├── js/main.js                 # Nav toggle, smooth scroll, scroll-spy, project cards
├── js/circuit-background.js   # Canvas circuit animation
├── assets/                    # User-supplied resume.pdf (and optional favicon)
├── .nojekyll                  # Disables Jekyll processing on GitHub Pages
└── README.md
```

## Sections

Home, About, Projects, Skills, Experience, AI, and Contact — all on one page,
navigated through a sticky top nav with smooth scrolling and a scroll-spy
active state.

## Running locally

Just open `index.html` in a browser. Because all asset references are relative,
you can also serve the folder with any static server, for example:

```
python -m http.server
```

Then visit `http://localhost:8000`.

## Adding your resume

Drop your resume at `assets/resume.pdf`. The "Download Resume" buttons link to
that relative path. See `assets/README.md` for details.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Choose your default branch and the **`/ (root)`** folder, then save.
5. GitHub serves the site at `https://<username>.github.io/<repo>/`.

All internal references use relative paths (no leading slash), so the site works
correctly under a project subpath. The `.nojekyll` file keeps GitHub Pages from
running Jekyll over the static assets.

## Accessibility & performance notes

- Semantic landmarks, a skip-to-content link, keyboard-operable nav, and visible
  focus styles.
- The decorative canvas is `aria-hidden`, ignores pointer events, respects
  `prefers-reduced-motion`, and pauses when the tab is hidden.
- The site degrades gracefully with JavaScript disabled: content, nav anchors,
  and all contact/resume links work natively.
