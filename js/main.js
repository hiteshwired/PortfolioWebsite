/* ============================================================
   main.js — navigation behavior + data-driven project cards
   Touches only nav/scroll/content DOM. Never the canvas.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     Project data (each has a non-empty title + description)
     ---------------------------------------------------------- */
  var projects = [
    {
      title: "32-bit RISC-V Microcontroller (OTTER MCU)",
      description:
        "Designed and implemented a 32-bit RISC-V (RV32I) microcontroller in SystemVerilog, building the datapath, control unit, and memory interface from the instruction set up. Brought it up on a Basys 3 FPGA in Vivado and used timing analysis and the on-board peripherals to verify it ran real programs."
    },
    {
      title: "FSK IR Communication System",
      description:
        "Built an infrared link that encodes data with frequency-shift keying, handling modulation on the transmit side and demodulation and decoding on the receive side. Tuned the analog front end and verified the signal chain with an oscilloscope and logic analyzer."
    },
    {
      title: "IEEE Technical Report — Low-Voltage Sensing & Indication Circuit",
      description:
        "Authored an IEEE-format technical report on a low-voltage sensing and indication circuit, covering the design rationale, LTspice simulation, and measured results. Focused on making the analysis clear and reproducible for a technical reader."
    },
    {
      title: "FPGA Parking Lot Control System",
      description:
        "Implemented a parking-lot controller as a finite state machine on an FPGA, tracking occupancy and driving entry/exit gate logic and indicators. Wrote the RTL in SystemVerilog and validated the state transitions in simulation before deploying to hardware."
    },
    {
      title: "Interactive OO Simulation with A* & Dijkstra Pathfinding",
      description:
        "Wrote an object-oriented simulation in Java where agents navigate a grid using A* and Dijkstra pathfinding. Structured the code around clean class responsibilities and UML, then compared how the two algorithms behaved as the map changed."
    },
    {
      title: "Firebase-Based Online Chat & Game Platform",
      description:
        "Built an online chat and game platform backed by Firebase for real-time data and auth. Handled the client logic, live message sync, and game state so multiple users could interact together in the browser."
    }
  ];

  /* ----------------------------------------------------------
     Render project cards into the grid
     ---------------------------------------------------------- */
  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    if (!grid) return;

    var frag = document.createDocumentFragment();
    projects.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "project-card card";

      var h3 = document.createElement("h3");
      h3.className = "project-card__title";
      h3.textContent = p.title;

      var desc = document.createElement("p");
      desc.className = "project-card__desc";
      desc.textContent = p.description;

      card.appendChild(h3);
      card.appendChild(desc);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  /* ----------------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------------- */
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

    // Close the menu after selecting a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) {
        closeMenu();
      }
    });
  }

  /* ----------------------------------------------------------
     Scroll-spy: highlight the nav link for the section in view
     ---------------------------------------------------------- */
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
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    });

    document.querySelectorAll("main section[id]").forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ----------------------------------------------------------
     Footer year
     ---------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
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
