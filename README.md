# Hitesh Nandakumar

I&rsquo;m a Computer Engineering student at Cal Poly SLO who enjoys building at the intersection of hardware and software. This is my personal portfolio: a place to explore my projects, learn a little about how I work, and get in touch.

**Live site → [hiteshwired.github.io/PortfolioWebsite](https://hiteshwired.github.io/PortfolioWebsite/)**

My work spans RISC-V processors, FPGAs, analog circuits, embedded systems, and the software that ties them together. The site itself follows the same hands-on approach: it is built with plain HTML, CSS, and JavaScript, with no framework or build step.

## What&rsquo;s here

- A single-page portfolio with my work, capabilities, background, perspective on AI, ethics writing, and contact information.
- Seven project write-ups with the tools and methods I used.
- An animated circuit-board background rendered on a canvas.
- A fully static site that runs locally and deploys directly to GitHub Pages.

## How I built it

I built this site with an agentic AI workflow. I used [Kiro](https://kiro.dev) as my main environment, working spec-first: I defined the requirements and design, reviewed the generated implementation, corrected course, and made the final calls on structure and copy. I also used Claude, DeepSeek, and Gemini for second opinions when comparing approaches or checking ideas.

AI helps me move faster on work I understand; it does not replace understanding or ownership. My responsibility is to set the direction, catch subtle mistakes, and verify the final result. That matters even more in embedded work, where a confident answer still needs to be checked against testing and hardware-level reasoning.

## Built with

- Plain HTML and CSS, plus a small amount of vanilla JavaScript for navigation, project cards, and the animated background.
- No frameworks, bundler, or backend. If you can open a file in a browser, you can run it.

## Run it locally

Clone the repository and open `index.html` in a browser. That&rsquo;s all it takes.

To serve it locally instead, use any static server. For example:

```bash
python -m http.server
```

Then open `http://localhost:8000`.

## Layout

```
index.html                 # Page structure and copy
css/styles.css             # Theme and responsive layout
js/main.js                 # Navigation, scroll spy, and project cards
js/circuit-background.js   # Animated background
assets/                    # Resume, photos, reports, and essays
```

## Accessibility

The site uses semantic HTML, a skip-to-content link, keyboard-friendly navigation, and visible focus styles. The animated background respects `prefers-reduced-motion` and pauses when the tab is not visible. Core navigation and links continue to work without JavaScript.

## Connect

- Email: hiteshnandakumar@gmail.com
- LinkedIn: [linkedin.com/in/hnan06](https://www.linkedin.com/in/hnan06)
- GitHub: [github.com/hiteshwired](https://github.com/hiteshwired)

Thanks for stopping by.
