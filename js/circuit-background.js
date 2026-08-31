/* ============================================================
   circuit-background.js — decorative animated circuit canvas
   Touches only the canvas. Never the content DOM.
   Graceful degradation, reduced-motion aware, pauses when hidden.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("circuit-bg");
  if (!canvas) return;

  // Feature-detect 2D canvas support; exit early if unavailable.
  var ctx = null;
  try {
    ctx = canvas.getContext && canvas.getContext("2d");
  } catch (e) {
    ctx = null;
  }
  if (!ctx) return;

  var ACCENT = "#4cc3ff";
  var TRACE = "rgba(47, 128, 255, 0.22)";
  var NODE = "rgba(76, 195, 255, 0.5)";

  var dpr = 1;
  var width = 0;
  var height = 0;
  var nodes = [];
  var traces = [];
  var pulses = [];
  var rafId = null;
  var running = false;

  var GRID = 90; // spacing between grid nodes (CSS px)

  var reduceMotion = false;
  if (window.matchMedia) {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------------------------------------------------------- */
  function sizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* Build a grid of nodes and orthogonal traces between neighbors. */
  function buildCircuit() {
    nodes = [];
    traces = [];
    pulses = [];

    var cols = Math.ceil(width / GRID) + 1;
    var rows = Math.ceil(height / GRID) + 1;

    var grid = [];
    for (var r = 0; r < rows; r++) {
      grid[r] = [];
      for (var c = 0; c < cols; c++) {
        // jitter each node slightly for a hand-routed look
        var node = {
          x: c * GRID + (Math.random() * 20 - 10),
          y: r * GRID + (Math.random() * 20 - 10),
          on: Math.random() < 0.55
        };
        grid[r][c] = node;
        if (node.on) nodes.push(node);
      }
    }

    // Connect some neighbors (right + down) to form traces.
    for (var rr = 0; rr < rows; rr++) {
      for (var cc = 0; cc < cols; cc++) {
        var a = grid[rr][cc];
        if (!a.on) continue;
        if (cc + 1 < cols && grid[rr][cc + 1].on && Math.random() < 0.6) {
          traces.push({ a: a, b: grid[rr][cc + 1] });
        }
        if (rr + 1 < rows && grid[rr + 1][cc].on && Math.random() < 0.6) {
          traces.push({ a: a, b: grid[rr + 1][cc] });
        }
      }
    }

    // Spawn pulses that travel along a subset of traces.
    var pulseCount = Math.min(28, Math.floor(traces.length * 0.12));
    for (var i = 0; i < pulseCount; i++) {
      spawnPulse();
    }
  }

  function spawnPulse() {
    if (!traces.length) return;
    var trace = traces[Math.floor(Math.random() * traces.length)];
    pulses.push({
      trace: trace,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.006
    });
  }

  /* Draw the static circuit board (traces + nodes). */
  function drawBoard() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = TRACE;
    ctx.beginPath();
    for (var i = 0; i < traces.length; i++) {
      var tr = traces[i];
      // orthogonal routing: horizontal then vertical
      ctx.moveTo(tr.a.x, tr.a.y);
      ctx.lineTo(tr.b.x, tr.a.y);
      ctx.lineTo(tr.b.x, tr.b.y);
    }
    ctx.stroke();

    ctx.fillStyle = NODE;
    for (var n = 0; n < nodes.length; n++) {
      ctx.beginPath();
      ctx.arc(nodes[n].x, nodes[n].y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Position a pulse along its (orthogonal) trace path. */
  function pulsePosition(p) {
    var a = p.trace.a;
    var b = p.trace.b;
    // two-segment path: (a -> corner) then (corner -> b)
    var corner = { x: b.x, y: a.y };
    var len1 = Math.abs(corner.x - a.x);
    var len2 = Math.abs(b.y - corner.y);
    var total = len1 + len2;
    if (total === 0) return { x: a.x, y: a.y };

    var dist = p.t * total;
    if (dist <= len1) {
      var f = len1 === 0 ? 0 : dist / len1;
      return { x: a.x + (corner.x - a.x) * f, y: a.y };
    }
    var f2 = len2 === 0 ? 0 : (dist - len1) / len2;
    return { x: corner.x, y: corner.y + (b.y - corner.y) * f2 };
  }

  function drawPulses() {
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = ACCENT;
    ctx.fillStyle = ACCENT;
    for (var i = 0; i < pulses.length; i++) {
      var pos = pulsePosition(pulses[i]);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderFrame() {
    ctx.clearRect(0, 0, width, height);
    drawBoard();
    drawPulses();
  }

  function tick() {
    if (!running) return;
    for (var i = 0; i < pulses.length; i++) {
      pulses[i].t += pulses[i].speed;
      if (pulses[i].t >= 1) {
        // reassign pulse to a new random trace
        pulses[i].t = 0;
        pulses[i].trace = traces[Math.floor(Math.random() * traces.length)] || pulses[i].trace;
        pulses[i].speed = 0.003 + Math.random() * 0.006;
      }
    }
    renderFrame();
    rafId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    rafId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* Debounced resize. */
  var resizeTimer = null;
  function onResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      sizeCanvas();
      buildCircuit();
      renderFrame();
    }, 150);
  }

  /* Pause when tab hidden, resume when visible. */
  function onVisibilityChange() {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  }

  /* ---------------------------------------------------------- */
  function init() {
    sizeCanvas();
    buildCircuit();
    renderFrame(); // always draw one static frame

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!reduceMotion) {
      start();
    }
  }

  init();
})();
