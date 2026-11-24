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

  /* ---------- Poster printer: download the poster as a PDF ----------
     Uses html2pdf.js, which draws the element the way the browser shows it,
     so the Hebrew / RTL text and the fonts come out right. The library is
     only downloaded the first time someone clicks the button. */
  var HTML2PDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  var html2pdfLoading = null;
  var PDF_TITLE_SCALE = 1.35; // the title in the PDF is 35% bigger than on screen

  function loadHtml2pdf() {
    if (window.html2pdf) return Promise.resolve(window.html2pdf);
    if (!html2pdfLoading) {
      html2pdfLoading = new Promise(function (resolve, reject) {
        var script = doc.createElement('script');
        script.src = HTML2PDF_URL;
        script.onload = function () { resolve(window.html2pdf); };
        script.onerror = function () {
          html2pdfLoading = null; // allow another try
          reject(new Error('html2pdf failed to load'));
        };
        doc.head.appendChild(script);
      });
    }
    return html2pdfLoading;
  }

  /* Runs on html2canvas's private copy of the page, just before the picture
     is taken. Nothing here touches the real page. */
  function fixPosterForCapture(clonedDoc) {
    /* html2pdf puts its own copy of the poster in .html2pdf__container */
    var root = clonedDoc.querySelector('.html2pdf__container') || clonedDoc;
    var poster = root.querySelector('.poster');
    var title = root.querySelector('.pw');
    if (!poster || !title) return;

    /* don't capture the "press" animation mid-way (it plays on the real page) */
    poster.classList.remove('hit');

    /* fill the PDF page edge to edge; dark border even in dark mode; no shadow */
    poster.style.maxWidth = 'none';
    poster.style.width = '100%';
    poster.style.margin = '0';
    poster.style.borderColor = '#141C26';
    poster.style.boxShadow = 'none';

    /* html2canvas mixes up right-to-left words (spaces vanish, punctuation jumps).
       A tiny letter-spacing makes it place every letter where the browser put it. */
    poster.style.letterSpacing = '0.01px';

    /* hide the page's paper-grain overlay and progress bar (they'd tint the picture),
       and the title's ::before "shadow" copy, which html2canvas can't draw.
       Also turn off the poster's colour fades: in this copy of the page they
       start over, so html2canvas would catch the colours at the start of the
       fade (almost white paper, black ink) instead of the colours on screen. */
    var style = clonedDoc.createElement('style');
    style.textContent =
      'body::before,body::after,.prog{display:none !important}' +
      '.pw::before{content:none !important}' +
      '.poster,.poster *{transition:none !important;animation:none !important}';
    clonedDoc.head.appendChild(style);

    /* the typed title is bigger in the PDF than on screen... */
    var view = clonedDoc.defaultView;
    var size = parseFloat(view.getComputedStyle(title).fontSize) * PDF_TITLE_SCALE;
    title.style.fontSize = size + 'px';

    /* ...but a long title must still fit on the poster: shrink it until it does
       (too much text makes the 3:4 poster grow taller, or spill out of it) */
    function tooBig() {
      return poster.offsetHeight > poster.offsetWidth * 4 / 3 + 1 ||
        poster.scrollHeight > poster.clientHeight + 1;
    }
    while (size > 20 && tooBig()) {
      size *= 0.94;
      title.style.fontSize = size + 'px';
    }

    /* ...and draw that shadow copy as a hard text-shadow instead: same offset
       (-0.04em, 0.035em) and colour, so it looks the same */
    title.style.textShadow = (-0.04 * size) + 'px ' + (0.035 * size) + 'px 0 #141C26';
  }

  /* the "הדפס" button prints the poster on the page (initPosterPrinter)
     and also downloads it as a PDF (here) */
  function initPosterPdf() {
    var button = doc.getElementById('pb');
    var poster = doc.getElementById('pp');
    var input = doc.getElementById('pt');
    var title = doc.querySelector('.pw');
    if (!button || !poster) return;

    var label = button.textContent;

    function setBusy(text) {
      button.disabled = !!text;
      button.textContent = text || label;
    }

    button.addEventListener('click', function () {
      /* make sure the poster shows what is typed right now */
      var text = (input.value || '').trim() || 'מל״ן';
      title.textContent = text;
      title.setAttribute('data-t', text);

      setBusy('מכין PDF…');

      /* PDF page = the poster's size on screen, so it looks exactly the same */
      var PX_TO_MM = 25.4 / 96;
      var box = poster.getBoundingClientRect();
      var pageSize = [box.width * PX_TO_MM, box.height * PX_TO_MM];

      loadHtml2pdf().then(function (html2pdf) {
        return html2pdf().set({
          margin: 0,
          filename: 'כרוז-' + text.replace(/[\\/:*?"<>|]/g, '') + '.pdf',
          image: { type: 'png' }, // PNG keeps the colours exact (JPEG shifts them slightly)
          html2canvas: {
            scale: 3, // sharper output
            scrollX: 0, // without these the PDF comes out blank
            scrollY: 0, // when the page is scrolled down
            onclone: fixPosterForCapture
          },
          jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        }).from(poster).toPdf().get('pdf').then(function (pdf) {
          /* With display scaling (125%, 175%...) the poster's size on screen is
             not a whole number of pixels, so the picture can come out a hair
             taller than the page and html2pdf puts that sliver on a 2nd page.
             The poster is always one page, so drop anything after page 1. */
          while (pdf.getNumberOfPages() > 1) pdf.deletePage(pdf.getNumberOfPages());
        }).save();
      }).then(function () {
        setBusy(null);
      }, function () {
        setBusy('שגיאה, נסו שוב');
        setTimeout(function () { setBusy(null); }, 2500);
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
  initPosterPdf();
  initTimelineBall();
  if (hasObserver) {
    initReveal();
    initCounters();
  }
})();
