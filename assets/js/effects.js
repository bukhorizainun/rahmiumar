/* Premium interaction accents: 3D tilt on hover, a cursor-following spotlight
   in the hero, and a word-by-word reveal for the hero heading. All skipped
   under prefers-reduced-motion or on touch-only devices where relevant. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 3D tilt */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var resetTimer;
      card.addEventListener('mousemove', function (e) {
        clearTimeout(resetTimer);
        card.style.transition = 'transform .08s linear';
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 7).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* Hero spotlight follows the cursor */
  var spotlightHost = document.querySelector('.hero-home');
  var spotlight = document.querySelector('.spotlight');
  if (spotlightHost && spotlight) {
    spotlightHost.addEventListener('mousemove', function (e) {
      var r = spotlightHost.getBoundingClientRect();
      spotlight.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      spotlight.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    });
  }

  /* Word-by-word hero heading reveal (words are pre-wrapped in <span class="w">) */
  if (!reduceMotion) {
    document.querySelectorAll('.split-reveal .w').forEach(function (span, i) {
      span.style.transitionDelay = (i * 0.045) + 's';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll('.split-reveal .w').forEach(function (span) {
          span.style.opacity = '1';
          span.style.transform = 'none';
        });
      });
    });
  }
})();
