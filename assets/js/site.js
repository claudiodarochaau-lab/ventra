/* Ventra - shared behaviour. Kept deliberately small: mobile nav and
   back-to-top. The hero sequence is pure CSS; no scroll effects by design. */
(function () {
  document.documentElement.classList.add('js');

  // Draw-on-scroll for [data-draw] SVGs (service-loop diagram).
  var drawables = document.querySelectorAll('[data-draw]');
  if (drawables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.35 });
      drawables.forEach(function (el) { io.observe(el); });
    } else {
      drawables.forEach(function (el) { el.classList.add('in-view'); });
    }
  }

  // Back to top - injected so every page gets it without extra markup.
  var top = document.createElement('button');
  top.className = 'back-to-top';
  top.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(top);
  window.addEventListener('scroll', function () {
    top.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-mobile');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
