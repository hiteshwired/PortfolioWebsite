(function () {
  "use strict";

  var projects = [
    {
      kicker: "Systems Programming · C",
      title: "C Systems Projects",
      description:
        "A collection of low-level C programs built with the POSIX API. The work includes 24-bit BMP processing with contrast, rotation, and Sobel edge detection; parallel work using fork and mmap shared memory protected by an atomic spinlock; and shared-memory IPC between separate processes.",
      tags: ["C", "fork / mmap", "POSIX IPC", "Sobel / BMP"],
      link: { href: "https://github.com/hiteshwired/c-systems-projects", label: "View code" }
    },
    {
      kicker: "Digital Architecture · SystemVerilog",
      title: "Pipelined RISC-V Processor (OTTER, RV32I)",
      description:
        "A 32-bit RV32I microcontroller in SystemVerilog for the Basys 3, evolved from a single-cycle design into a five-stage pipeline. I implemented hazard detection, data forwarding, load-use stalls, and branch flushing, then wrote targeted RISC-V assembly and self-checking testbenches to validate each path. Debugging control and data hazards one waveform at a time was the challenge that made the project especially rewarding.",
      tags: ["5-stage pipeline", "Datapath + control", "Hazard detection", "Forwarding + stalls", "Memory-mapped I/O", "Waveform debug"],
      link: { href: "https://github.com/hiteshwired/cpe333-otter-riscv-pipeline", label: "View code" }
    },
    {
      kicker: "Analog Design · Signal Processing",
      title: "FSK IR Communication System",
      description:
        "An IR link that transmits ASCII data with frequency-shift keying. I simulated the analog front end in LTspice, then tuned and bench-tested the circuit until transmission was reliable.",
      tags: ["TIA + filtering", "Frequency discrimination", "Bench validation"],
      link: { href: "https://github.com/hiteshwired/fsk-ir-receiver", label: "View code" }
    },
    {
      kicker: "Analog Design · Technical Writing",
      title: "IEEE Low-Voltage Sensing Circuit",
      description:
        "An undervoltage detection circuit characterized through a repeatable voltage sweep. It trips at 8.02 V with approximately -6.3 mV of error, and I documented the design and results in an IEEE-format report.",
      tags: ["Tolerance analysis", "Voltage sweep", "IEEE report"],
      link: { href: "assets/reports/ieee-low-voltage-sensing-circuit.pdf", label: "Read the report" }
    },
    {
      kicker: "Digital Logic · FPGA",
      title: "FPGA Parking Lot Controller",
      description:
        "A finite-state machine on an FPGA that tracks parking occupancy and controls entry and exit from sensor inputs. I verified the state transitions in simulation, then validated the design on hardware with the board’s LEDs and switches.",
      tags: ["FSM design", "RTL simulation", "On-board debug"],
      link: { href: "https://github.com/hiteshwired/fpga-parking-lot-controller", label: "View code" }
    },
    {
      kicker: "Software · Algorithms",
      title: "Pathfinding Simulation",
      description:
        "An object-oriented Java simulation in which agents navigate a world with A* and Dijkstra’s algorithm. I designed the entity hierarchy to stay understandable as the behaviors grew more complex, then compared how the two algorithms performed.",
      tags: ["A* / Dijkstra", "OO design", "yEd / UML"],
      link: { href: "https://github.com/hiteshwired/AStar_and_Dijkstra", label: "View code" }
    },
    {
      kicker: "Web · Real-time",
      title: "Firebase Chat & Game Platform",
      description:
        "A web application with Google sign-in, live chat, and a Hangman game backed by a Firebase leaderboard. I built the client-side logic and real-time synchronization so people could play and talk together.",
      tags: ["Firebase", "Google OAuth", "Live sync"]
    }
  ];

  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    if (!grid) return;

    var frag = document.createDocumentFragment();
    projects.forEach(function (p) {
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

      if (p.link && p.link.href) {
        var link = document.createElement("a");
        link.className = "project-card__link";
        link.href = p.link.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.innerHTML = (p.link.label || "Read more") + ' <span aria-hidden="true">&#8599;</span>';
        card.appendChild(link);
      }

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
