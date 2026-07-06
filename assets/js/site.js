/* Ventra - shared behaviour. Kept deliberately small: mobile nav and
   back-to-top. The hero sequence is pure CSS; no scroll effects by design. */
(function () {
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
