/* ============================================================
   main.js - nav behavior + data-driven project cards
   Touches only nav/scroll/content DOM. Never the canvas.
   ============================================================ */
(function () {
  "use strict";

  var projects = [
    {
      kicker: "Digital Architecture · SystemVerilog",
      title: "32-bit RISC-V Microcontroller (OTTER MCU)",
      description:
        "I built a 32-bit RV32I processor in SystemVerilog, datapath and control logic and all. The hardest part was tracking down branching and memory-mapped I/O bugs one waveform at a time, which is also where I learned the most.",
      tags: ["Datapath + control", "Memory-mapped I/O", "Waveform debug"]
    },
    {
      kicker: "Analog Design · Signal Processing",
      title: "FSK IR Communication System",
      description:
        "I designed an IR link that sends ASCII data using frequency-shift keying. I simulated the analog front end in LTspice first, then tuned it on the bench until transmission actually stayed reliable.",
      tags: ["TIA + filtering", "Frequency discrimination", "Bench validation"]
    },
    {
      kicker: "Analog Design · Technical Writing",
      title: "IEEE Low-Voltage Sensing Circuit",
      description:
        "I designed an undervoltage detection circuit and characterized it with a repeatable voltage sweep. It trips at 8.02 V with about -6.3 mV of error, and I wrote it all up in an IEEE-format report so the results were traceable.",
      tags: ["Tolerance analysis", "Voltage sweep", "IEEE report"]
    },
    {
      kicker: "Digital Logic · FPGA",
      title: "FPGA Parking Lot Controller",
      description:
        "A finite state machine on an FPGA that tracks occupancy and drives the entry and exit logic from sensor inputs. I verified the transitions in simulation, then brought it up on hardware using the LEDs and switches to prove it worked.",
      tags: ["FSM design", "RTL simulation", "On-board debug"]
    },
    {
      kicker: "Software · Algorithms",
      title: "Pathfinding Simulation",
      description:
        "A large object-oriented simulation in Java where agents navigate a world using A* and Dijkstra. I put real thought into the entity hierarchy so it stayed clean as the behaviors got more complex, and compared how the two algorithms held up.",
      tags: ["A* / Dijkstra", "OO design", "yEd / UML"]
    },
    {
      kicker: "Web · Real-time",
      title: "Firebase Chat & Game Platform",
      description:
        "A web app with Google sign-in, live chat, and a Hangman game backed by a Firebase leaderboard. I handled the client logic and the real-time sync so multiple people could actually play and talk together.",
      tags: ["Firebase", "Google OAuth", "Live sync"]
    }
  ];

  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    if (!grid) return;

    var frag = document.createDocumentFragment();
    projects.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "project-card card";

      var kicker = document.createElement("p");
      kicker.className = "project-card__kicker";
      kicker.textContent = p.kicker;

      var h3 = document.createElement("h3");
      h3.className = "project-card__title";
      h3.textContent = p.title;

      var desc = document.createElement("p");
      desc.className = "project-card__desc";
      desc.textContent = p.description;

      var tags = document.createElement("ul");
      tags.className = "project-card__tags";
      p.tags.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        tags.appendChild(li);
      });

      card.appendChild(kicker);
      card.appendChild(h3);
      card.appendChild(desc);
      card.appendChild(tags);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function initMobileNav() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) closeMenu();
    });
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var linkById = {};
    links.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      if (id) linkById[id] = link;
    });

    function setActive(id) {
      links.forEach(function (l) { l.classList.remove("active"); });
      if (linkById[id]) linkById[id].classList.add("active");
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    document.querySelectorAll("main section[id]").forEach(function (section) {
      observer.observe(section);
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    renderProjects();
    initMobileNav();
    initScrollSpy();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

