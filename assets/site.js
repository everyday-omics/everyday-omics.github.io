/* Everyday Omics — nav, scroll reveals, and the parallax that separates the
   two chevrons of the mark. One rAF loop; everything degrades to a static
   page if JS is off or the visitor prefers reduced motion. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── year ───────────────────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── mobile menu ────────────────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── reveal on enter, with a small stagger between siblings ─────────── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  reveals.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (n) {
      return n.classList && n.classList.contains('reveal');
    });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms');
  });

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }


  /* ── email ──────────────────────────────────────────────────────────────
     The address is split, base64'd in the markup and only assembled here, so
     the served HTML contains no scrapable "user@host" string. Real text is
     restored for copy/paste; the mailto: is attached on first interaction. */
  var mails = Array.prototype.slice.call(document.querySelectorAll('.mail'));

  function address(el) {
    return atob(el.dataset.u) + String.fromCharCode(64) + atob(el.dataset.d);
  }

  mails.forEach(function (el) {
    var label = el.querySelector('.mail__t');
    if (label) {
      label.textContent = address(el);
      label.classList.add('is-decoded');
    }
    var armed = false;
    function arm() {
      if (armed) return;
      armed = true;
      el.href = 'mailto:' + address(el) + (el.dataset.s ? '?subject=' + encodeURIComponent(el.dataset.s) : '');
    }
    ['mouseenter', 'mousedown', 'touchstart', 'focus'].forEach(function (ev) {
      el.addEventListener(ev, arm, { passive: true });
    });
  });

  /* ── parallax ───────────────────────────────────────────────────────── */
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-par]')).map(function (el) {
    return { el: el, scope: el.closest('.par-scope') || el.parentElement, speed: parseFloat(el.dataset.speed) || 0.05 };
  });

  var hero = document.querySelector('.hero');
  var chevLight = document.querySelector('[data-par-chev="light"]');
  var chevDark = document.querySelector('[data-par-chev="dark"]');
  var heroArt = document.querySelector('.hero__art');

  var mouseX = 0, mouseY = 0, ticking = false;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function frame() {
    ticking = false;
    var vh = window.innerHeight;

    for (var i = 0; i < layers.length; i++) {
      var l = layers[i];
      var r = l.scope.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      var shift = (r.top - vh / 2) * -l.speed;
      l.el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    }

    if (hero && chevLight && chevDark) {
      var hr = hero.getBoundingClientRect();
      /* 0 at rest, 1 once the hero has scrolled fully away */
      var p = clamp(-hr.top / Math.max(hr.height, 1), 0, 1);
      var ease = p * p;
      /* the mark comes apart along the axis its two chevrons point */
      chevDark.style.transform = 'translate(' + (-165 * ease).toFixed(1) + 'px,' + (55 * ease).toFixed(1) + 'px)';
      chevLight.style.transform = 'translate(' + (150 * ease).toFixed(1) + 'px,' + (-45 * ease).toFixed(1) + 'px)';
      if (heroArt) {
        heroArt.style.transform = 'translate3d(' + mouseX.toFixed(1) + 'px,' + mouseY.toFixed(1) + 'px,0)';
      }
    }
  }

  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(frame);
  }

  function onStick() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 30);
  }

  onStick();

  if (!reduced) {
    window.addEventListener('scroll', function () { onStick(); request(); }, { passive: true });
    window.addEventListener('resize', request, { passive: true });

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && heroArt) {
      window.addEventListener('mousemove', function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * -22;
        mouseY = (e.clientY / window.innerHeight - 0.5) * -16;
        request();
      }, { passive: true });
    }

    request();
  } else {
    window.addEventListener('scroll', onStick, { passive: true });
  }
})();
