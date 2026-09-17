/* Abstract mathematical motif: draws the function curve in on load and
   makes the plotted data-points glow when the cursor passes near them. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.motif-curve').forEach(function (path) {
    if (reduceMotion || typeof path.getTotalLength !== 'function') return;
    try {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { path.style.strokeDashoffset = '0'; });
      });
    } catch (e) {}
  });

  document.querySelectorAll('.hero-visual').forEach(function (wrap) {
    var dots = wrap.querySelectorAll('.motif-dot');
    if (!dots.length) return;
    wrap.addEventListener('pointermove', function (e) {
      dots.forEach(function (dot) {
        var r = dot.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        dot.classList.toggle('is-near', dist < 70);
      });
    });
    wrap.addEventListener('pointerleave', function () {
      dots.forEach(function (d) { d.classList.remove('is-near'); });
    });
  });
})();
