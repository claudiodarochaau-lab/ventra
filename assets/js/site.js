/* Ventra - shared behaviour. Kept deliberately small: mobile nav and
   back-to-top. The hero sequence is pure CSS; no scroll effects by design. */
(function () {
  document.documentElement.classList.add('js');

  // Analytics (GA4 + HubSpot) - loaded on first interaction so third-party
  // scripts never block first paint. thank-you.html keeps them inline
  // because it's the conversion beacon page.
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-GQNVWTN50D');
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-GQNVWTN50D';
    document.head.appendChild(ga);
    var hs = document.createElement('script');
    hs.id = 'hs-script-loader';
    hs.async = true;
    hs.defer = true;
    hs.src = 'https://js-ap1.hs-scripts.com/442945735.js';
    document.head.appendChild(hs);
  }
  ['pointerdown', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, loadAnalytics, { once: true, passive: true });
  });

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

  // Promo carousel — a plain scroll-snap track; JS syncs the dots/arrows
  // to scroll position and drives autoplay (paused on hover/focus, off
  // entirely under prefers-reduced-motion).
  var track = document.getElementById('carousel-track');
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel__dot'));
    var prevBtn = document.querySelector('.carousel__arrow--prev');
    var nextBtn = document.querySelector('.carousel__arrow--next');
    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoplay;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    }
    function setActiveDot(i) {
      dots.forEach(function (d, di) { d.setAttribute('aria-selected', String(di === i)); });
    }
    function startAutoplay() {
      if (reduceMotion) return;
      autoplay = setInterval(function () { goTo(current + 1); }, 6000);
    }
    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

    if ('IntersectionObserver' in window) {
      var trackIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var i = slides.indexOf(e.target);
            if (i > -1) { current = i; setActiveDot(i); }
          }
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach(function (s) { trackIo.observe(s); });
    }

    startAutoplay();
    track.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('focusin', function () { clearInterval(autoplay); });
    track.addEventListener('focusout', startAutoplay);
  }

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
