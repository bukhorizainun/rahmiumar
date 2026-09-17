/* Hero background: a quiet network of connected nodes, drifting slowly and
   responding to the cursor. Reads as a data / research visualisation rather
   than a decorative pattern; degrades to a static frame under
   prefers-reduced-motion. */
(function () {
  var canvas = document.getElementById('heroNetwork');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wrap = canvas.parentElement;
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var nodes = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var COUNT = 46;
  var LINK_DIST = 150;
  var POINTER_DIST = 190;

  function resize() {
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    nodes = [];
    for (var i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.2
      });
    }
  }

  function step() {
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = W + 10; else if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; else if (n.y > H + 10) n.y = -10;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          var t = 1 - dist / LINK_DIST;
          ctx.strokeStyle = 'rgba(244,239,230,' + (t * 0.16).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (pointer.active) {
        var pdx = nodes[i].x - pointer.x, pdy = nodes[i].y - pointer.y;
        var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < POINTER_DIST) {
          var pt = 1 - pdist / POINTER_DIST;
          ctx.strokeStyle = 'rgba(223,161,92,' + (pt * 0.5).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244,239,230,.55)';
      ctx.fill();
    });

    if (pointer.active) {
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = '#DFA15C';
      ctx.fill();
    }
  }

  var running = false;
  function frame() {
    if (document.hidden) { running = false; return; }
    step();
    draw();
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  function startLoop() {
    if (running || reduceMotion) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function onMove(e) {
    var rect = wrap.getBoundingClientRect();
    var p = e.touches ? e.touches[0] : e;
    pointer.x = p.clientX - rect.left;
    pointer.y = p.clientY - rect.top;
    pointer.active = true;
    if (reduceMotion) draw();
  }
  function onLeave() {
    pointer.active = false;
    if (reduceMotion) draw();
  }

  window.addEventListener('resize', function () {
    resize();
    seed();
    draw();
  });

  wrap.addEventListener('mousemove', onMove);
  wrap.addEventListener('touchmove', onMove, { passive: true });
  wrap.addEventListener('mouseleave', onLeave);

  resize();
  seed();
  if (reduceMotion) {
    draw();
  } else {
    startLoop();
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) startLoop();
  });
})();
