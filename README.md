# Hitesh Nandakumar

Computer Engineering student at Cal Poly SLO, into embedded systems and digital design. This repo is my personal site: a place to point people to my projects, my background, and how to reach me.

**Live site → [hiteshwired.github.io/PortfolioWebsite](https://hiteshwired.github.io/PortfolioWebsite/)**

I like working at the line between hardware and software: RISC-V processors, FPGAs, analog circuits, and the code that ties it all together. This site is a small example of that. It is hand-written HTML, CSS, and JavaScript with an animated circuit background, no frameworks and no build step.

## What is in here

- A single-page site: a hero, my work, how I like to work, an about section, my take on using AI, some of my writing on tech ethics, and contact info.
- Six project write-ups, each with the tools I actually used.
- An animated circuit-board background rendered on a canvas.
- Everything static, so it runs anywhere and hosts for free.

## How I built it

I built this with an agentic AI workflow, and I am pretty open about that because knowing how to work with these tools is part of the job now.

My main environment is [Kiro](https://kiro.dev), an agentic IDE. I drove it spec-first: I described what I wanted, we worked through requirements and a design together, and then it generated the implementation while I reviewed, corrected course, and made the calls on structure and copy. Along the way I leaned on Claude, DeepSeek, and Gemini for second opinions, comparing approaches and sanity-checking things I was not sure about.

The way I see it, the AI moves fast on the parts I already understand. My job is to point it in the right direction, catch the things it gets subtly wrong, and own the result. That is the same habit I bring to embedded work, where a confident-sounding answer is exactly the kind you double-check. The prompts, the decisions, and the final review here are mine.

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

