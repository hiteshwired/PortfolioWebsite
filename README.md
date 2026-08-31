# Hitesh Nandakumar

Computer Engineering student at Cal Poly SLO, into embedded systems and digital design. This repo is my personal site: a place to point people to my projects, my background, and how to reach me.

**Live site → [hiteshwired.github.io/PortfolioWebsite](https://hiteshwired.github.io/PortfolioWebsite/)**

I like working at the line between hardware and software: RISC-V processors, FPGAs, analog circuits, and the code that ties it all together. This site is a small example of that. It is hand-written HTML, CSS, and JavaScript with an animated circuit background, no frameworks and no build step.

## What is in here

- A single-page site with a hero, my work, how I like to work, an about section, my take on using AI, and contact info.
- Six data-driven project write-ups, each with the tools I actually used.
- An animated circuit-board background rendered on a canvas.
- Everything static, so it runs anywhere and hosts for free.

## Built with

- Plain HTML and CSS, with a small amount of vanilla JavaScript for the nav, project cards, and the background animation.
- No frameworks, no bundler, no backend. If you can open a file in a browser, you can run it.

## Running it yourself

Clone the repo and open `index.html` in a browser. That is genuinely all it takes.

If you would rather serve it (handy for testing), any static server works:

```bash
python -m http.server
```

Then open `http://localhost:8000`.

## Layout

```
index.html                 # The whole page
css/styles.css             # Theme and layout
js/main.js                 # Nav, scroll-spy, project cards
js/circuit-background.js   # The animated background
assets/                    # Resume, headshot, and photos
```

## A note on accessibility

I tried to keep this usable for everyone: semantic HTML, a skip-to-content link, keyboard-friendly navigation, and visible focus styles. The background animation respects `prefers-reduced-motion` and pauses when the tab is not in view, and the whole site still works with JavaScript turned off.

## Say hello

- Email: hiteshnandakumar@gmail.com
- LinkedIn: [linkedin.com/in/hnan06](https://www.linkedin.com/in/hnan06)
- GitHub: [github.com/hiteshwired](https://github.com/hiteshwired)

Thanks for stopping by.
