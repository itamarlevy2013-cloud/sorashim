/* =========================================================
   מל״ן – משה לוי נחום | page scripts
   ========================================================= */

(function () {
  'use strict';

  var doc = document;
  var hasObserver = 'IntersectionObserver' in window;
  var reducedMotion = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

  function toArray(list) {
    return [].slice.call(list);
  }

  /* Re-trigger the poster's "press" animation. */
  function restartPressAnimation(poster) {
    poster.classList.remove('hit');
    void poster.offsetWidth; // force reflow so the animation restarts
    poster.classList.add('hit');
  }

  /* ---------- Nav: highlight the link of the section in view ---------- */
  function initActiveNav() {
    var links = toArray(doc.querySelectorAll('.nav a.l'));
    var linkById = {};

    links.forEach(function (a) {
      linkById[a.getAttribute('href').slice(1)] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = linkById[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    Object.keys(linkById).forEach(function (id) {
      var section = doc.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Reading progress bar ---------- */
  function initProgressBar() {
    var bar = doc.createElement('div');
    bar.className = 'prog';
    doc.body.appendChild(bar);

    var ticking = false;

    function update() {
      ticking = false;
      var scrollable = doc.documentElement.scrollHeight - innerHeight;
      var progress = scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0;
      bar.style.transform = 'scaleX(' + progress + ')';
    }

    addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  /* ---------- Poster printer: title input + print button ---------- */
  function initPosterPrinter() {
    var input = doc.getElementById('pt');
    var title = doc.querySelector('.pw');
    var poster = doc.getElementById('pp');
    var button = doc.getElementById('pb');

    function print() {
      var text = (input.value || '').trim() || 'מל״ן';
      title.textContent = text;
      title.setAttribute('data-t', text);
      restartPressAnimation(poster);
    }

    if (button && input) {
      button.addEventListener('click', print);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') print();
      });
    }

    /* Colour swatches: each fieldset sets one CSS variable on the poster. */
    toArray(doc.querySelectorAll('.sw')).forEach(function (fieldset) {
      var cssVar = fieldset.getAttribute('data-var');
      var label = fieldset.querySelector('.now span');

      fieldset.addEventListener('change', function (e) {
        var radio = e.target;
        if (!radio || radio.type !== 'radio') return;
        poster.style.setProperty(cssVar, radio.value);
        label.textContent = radio.getAttribute('data-n');
        restartPressAnimation(poster);
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var selector = [
      'section h2',
      'section .wrap>p',
      'section .two>div>p',
      '.reasons>div',
      '.list li',
      '.letters div',
      '.tl li',
      '.photo',
      '.note',
      '.band',
      '.nums .n',
      '.poster'
    ].join(',');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });

    toArray(doc.querySelectorAll(selector)).forEach(function (el) {
      el.classList.add('rv');
      var index = [].indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(index, 5) * 80 + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- Count-up numbers ---------- */
  function initCounters() {
    var numbers = toArray(doc.querySelectorAll('.nums b[data-to]'));

    if (!reducedMotion) {
      numbers.forEach(function (b) { b.textContent = '0'; });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        var el = entry.target;
        var target = +el.getAttribute('data-to');

        if (reducedMotion) {
          el.textContent = target;
          return;
        }

        var start = null;
        requestAnimationFrame(function step(time) {
          if (!start) start = time;
          var p = Math.min(1, (time - start) / 1400);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); // ease-out cubic
          if (p < 1) requestAnimationFrame(step);
        });
      });
    }, { threshold: .6 });

    numbers.forEach(function (b) { observer.observe(b); });
  }

  /* ---------- Timeline: a ball locked to the scroll ----------
     The ball sits at the middle of the screen and moves exactly as fast
     as you scroll, clamped to the length of the timeline, and snaps onto
     an event's dot when it gets close. While it covers a dot, that
     event's description is shown. */
  function initTimelineBall() {
    var list = doc.querySelector('.tl');
    if (!list) return;

    var items = toArray(list.children);
    var ball = doc.createElement('span');
    ball.className = 'tl-ball';
    ball.setAttribute('aria-hidden', 'true');
    list.appendChild(ball);
    list.classList.add('live');

    var BALL_SIZE = 34;
    var OVERLAP = (BALL_SIZE + 19) / 2; // ball radius + dot radius
    var LOCK = 60;    // px: within this distance of a dot, the ball sits exactly on it
    var PULL = 130;   // px: within this distance, the ball is pulled toward the dot

    /* "assist": far from a dot the ball follows the screen 1:1; close to a
       dot it is pulled in and then held exactly on it. The pull is
       continuous, so the ball never jumps. */
    function assist(y, dots) {
      for (var i = 0; i < dots.length; i++) {
        var d = y - dots[i];
        var dist = Math.abs(d);
        if (dist <= LOCK) return dots[i];
        if (dist < PULL) {
          var t = (dist - LOCK) / (PULL - LOCK); // 0 at the lock edge, 1 at the pull edge
          return dots[i] + (d > 0 ? 1 : -1) * t * PULL;
        }
      }
      return y;
    }

    /* vertical centre of each event dot, in px from the top of the list */
    function dotCentres() {
      return items.map(function (li) {
        var dot = getComputedStyle(li, '::before');
        return li.offsetTop + parseFloat(dot.top) + parseFloat(dot.height) / 2;
      });
    }

    function update() {
      var dots = dotCentres();
      var middleOfScreen = innerHeight / 2 - list.getBoundingClientRect().top;
      var y = Math.min(Math.max(0, middleOfScreen), list.offsetHeight);
      y = assist(y, dots);

      ball.style.transform = 'translateY(' + (y - BALL_SIZE / 2) + 'px)';

      var anyOn = false;
      items.forEach(function (li, i) {
        var on = Math.abs(y - dots[i]) < OVERLAP;
        li.classList.toggle('on', on);
        if (on) anyOn = true;
      });
      ball.classList.toggle('on', anyOn);
    }

    /* scroll events fire once per frame, so updating here keeps the ball in step */
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---------- Init ---------- */
  if (hasObserver) initActiveNav();
  initProgressBar();
  initPosterPrinter();
  initTimelineBall();
  if (hasObserver) {
    initReveal();
    initCounters();
  }
})();
