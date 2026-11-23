/* =========================================================
   מל״ן – poster to PDF
   The "הדפס" button in #press saves the poster as an A4 PDF.
   No libraries: the poster is drawn on a canvas, then the
   image is wrapped in a minimal one-page PDF file.
   ========================================================= */

(function () {
  'use strict';

  var doc = document;
  var button = doc.getElementById('pb');
  var poster = doc.getElementById('pp');
  var titleEl = doc.querySelector('.pw');
  if (!button || !poster || !titleEl) return;

  /* A4 at 150 dpi */
  var W = 1240;
  var H = 1754;
  var DARK = '#141C26';
  var FONT = '"Suez One", "Arial Black", Arial, sans-serif';

  function cssVar(name, fallback) {
    var v = getComputedStyle(poster).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* Split the title into lines that fit, shrinking the font until it does. */
  function fitTitle(ctx, text, maxWidth, maxHeight) {
    var words = text.split(/\s+/);
    for (var size = 380; size >= 60; size -= 10) {
      ctx.font = size + 'px ' + FONT;
      var lines = [];
      var line = '';
      var tooWide = false;
      words.forEach(function (word) {
        var test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width <= maxWidth || !line) {
          line = test;
        } else {
          lines.push(line);
          line = word;
        }
      });
      if (line) lines.push(line);
      lines.forEach(function (l) {
        if (ctx.measureText(l).width > maxWidth) tooWide = true;
      });
      if (!tooWide && lines.length * size * 1.1 <= maxHeight) {
        return { size: size, lines: lines };
      }
    }
    return { size: 60, lines: [text] };
  }

  function drawPoster(text) {
    var canvas = doc.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    /* paper and frame */
    ctx.fillStyle = cssVar('--pg', '#F4ECD8');
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = DARK;
    ctx.lineWidth = 8;
    ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.lineWidth = 3;
    ctx.strokeRect(92, 92, W - 184, H - 184);

    /* top and bottom lines, as on the page */
    ctx.fillStyle = DARK;
    ctx.font = '56px ' + FONT;
    ctx.fillText('דפוס מל״ן, תל אביב', W / 2, 220);
    ctx.fillText('הלל הזקן 6', W / 2, H - 220);

    /* title: dark plate offset down-left, coloured ink on top */
    var fit = fitTitle(ctx, text, W - 320, H - 700);
    ctx.font = fit.size + 'px ' + FONT;
    var lineH = fit.size * 1.1;
    var top = H / 2 - (fit.lines.length - 1) * lineH / 2;
    var dx = -fit.size * 0.04;
    var dy = fit.size * 0.035;
    fit.lines.forEach(function (line, i) {
      var y = top + i * lineH;
      ctx.fillStyle = DARK;
      ctx.fillText(line, W / 2 + dx, y + dy);
      ctx.fillStyle = cssVar('--pi', '#C2271D');
      ctx.fillText(line, W / 2, y);
    });

    return canvas;
  }

  /* ---------- minimal PDF writer (one JPEG filling an A4 page) ---------- */
  function ascii(s) {
    var out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 255;
    return out;
  }

  function jpegBytes(canvas) {
    var b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function buildPdf(jpg) {
    var pw = 595.28;
    var ph = 841.89;
    var content = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q';
    var parts = [];
    var offsets = [];
    var length = 0;

    function push(chunk) {
      var bytes = typeof chunk === 'string' ? ascii(chunk) : chunk;
      parts.push(bytes);
      length += bytes.length;
    }
    function obj(n, body) {
      offsets[n] = length;
      push(n + ' 0 obj\n');
      body();
      push('\nendobj\n');
    }

    push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, function () { push('<< /Type /Catalog /Pages 2 0 R >>'); });
    obj(2, function () { push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'); });
    obj(3, function () {
      push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + ']' +
           ' /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    });
    obj(4, function () {
      push('<< /Type /XObject /Subtype /Image /Width ' + W + ' /Height ' + H +
           ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n');
      push(jpg);
      push('\nendstream');
    });
    obj(5, function () {
      push('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');
    });

    var xref = length;
    var table = 'xref\n0 6\n0000000000 65535 f \n';
    for (var n = 1; n <= 5; n++) {
      table += ('0000000000' + offsets[n]).slice(-10) + ' 00000 n \n';
    }
    push(table + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');

    return new Blob(parts, { type: 'application/pdf' });
  }

  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = doc.createElement('a');
    a.href = url;
    a.download = name;
    doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function savePdf() {
    /* script.js updates the poster title on the same click, so read it after */
    var text = (titleEl.textContent || '').trim() || 'מל״ן';
    var ready = doc.fonts && doc.fonts.load ? doc.fonts.load('100px "Suez One"') : Promise.resolve();
    ready.catch(function () {}).then(function () {
      var blob = buildPdf(jpegBytes(drawPoster(text)));
      download(blob, 'כרוז-מלן.pdf');
    });
  }

  button.addEventListener('click', function () {
    setTimeout(savePdf, 0);
  });
})();
