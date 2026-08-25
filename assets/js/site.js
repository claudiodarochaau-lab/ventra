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

  // Promo carousel — an infinite loop via cloned edge slides, so autoplay
  // and the arrows always continue in the same visual direction instead of
  // snapping backward when wrapping from the last slide to the first (or
  // vice versa). The clones are inert (aria-hidden, untabbable); the real
  // slides are what dots/URLs/AT ever land on. A debounced scroll listener
  // is the single source of truth for "which slide are we resting on" -
  // it works the same whether the rest was reached by autoplay, an arrow,
  // a dot, or a manual swipe, and silently re-homes onto the matching real
  // slide whenever we land on a clone.
  var track = document.getElementById('carousel-track');
  if (track) {
    var realSlides = Array.prototype.slice.call(track.children);
    var n = realSlides.length;
    var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel__dot'));
    var prevBtn = document.querySelector('.carousel__arrow--prev');
    var nextBtn = document.querySelector('.carousel__arrow--next');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var autoplay, settleTimer;

    function makeInert(el) {
      el.setAttribute('aria-hidden', 'true');
      if (el.hasAttribute('href')) el.setAttribute('tabindex', '-1');
      el.querySelectorAll('a, button').forEach(function (child) { child.setAttribute('tabindex', '-1'); });
      // Strip ids so a clone (e.g. the hero's h1#hero-h) never duplicates
      // one already in the live DOM - aria-labelledby et al stay resolvable.
      el.removeAttribute('id');
      el.querySelectorAll('[id]').forEach(function (child) { child.removeAttribute('id'); });
    }

    var firstClone = realSlides[0].cloneNode(true);
    var lastClone = realSlides[n - 1].cloneNode(true);
    makeInert(firstClone);
    makeInert(lastClone);
    track.insertBefore(lastClone, realSlides[0]);
    track.appendChild(firstClone);

    // slides[0] = lastClone, slides[1..n] = the real slides, slides[n+1] = firstClone
    var slides = Array.prototype.slice.call(track.children);
    var pos = 1;

    function setActiveDot(realIdx) {
      dots.forEach(function (d, di) { d.setAttribute('aria-selected', String(di === realIdx)); });
    }
    function scrollToPos(p, animate) {
      if (animate && !reduceMotion) {
        track.scrollTo({ left: slides[p].offsetLeft, behavior: 'smooth' });
        return;
      }
      // The CSS scroll-behavior:smooth on the track can override behavior:'auto'
      // here, so the clone-to-real snap-back would visibly animate backward
      // instead of jumping instantly. Toggle the CSS property off for the jump.
      var prevBehavior = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = slides[p].offsetLeft;
      track.style.scrollBehavior = prevBehavior;
    }
    function next() { scrollToPos(pos + 1, true); }
    function prev() { scrollToPos(pos - 1, true); }
    function goToReal(realIdx) { pos = realIdx + 1; scrollToPos(pos, true); }

    function handleSettled() {
      // Find whichever slide is now nearest the track's centre - covers
      // programmatic scrolls and manual swipes/drags alike.
      var trackRect = track.getBoundingClientRect();
      var center = trackRect.left + trackRect.width / 2;
      var closest = pos, closestDist = Infinity;
      slides.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var dist = Math.abs((r.left + r.width / 2) - center);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      pos = closest;
      if (pos === 0) { pos = n; scrollToPos(pos, false); }
      else if (pos === n + 1) { pos = 1; scrollToPos(pos, false); }
      setActiveDot(pos - 1);
    }
    track.addEventListener('scroll', function () {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(handleSettled, 120);
    }, { passive: true });

    function startAutoplay() {
      if (reduceMotion) return;
      autoplay = setInterval(next, 6000);
    }
    function resetAutoplay() {
      clearInterval(autoplay);
      startAutoplay();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToReal(i); resetAutoplay(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

    scrollToPos(1, false);
    setActiveDot(0);
    startAutoplay();
    track.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('focusin', function () { clearInterval(autoplay); });
    track.addEventListener('focusout', startAutoplay);
  }

  // Floating CTA panel — home page only (element absent elsewhere).
  var floatingCta = document.getElementById('floating-cta');
  if (floatingCta) {
    window.addEventListener('scroll', function () {
      floatingCta.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
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
