/* Coloured ASCII rendering shared by the whole site: a canvas renderer (window.ASCII),
   characters resolving into photos on project pages, and scrambling headings. No dependencies. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAMP = " .`':;,^\"!il~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@";
  const N = RAMP.length;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const hash = (x, y, t) => (((x * 73856093) ^ (y * 19349663) ^ (t * 83492791)) >>> 0) % 997 / 997;

  function Renderer(canvas, bg, maxDpr = 2) {
    const ctx = canvas.getContext('2d', { alpha: !bg });
    const sc = document.createElement('canvas');
    const sx = sc.getContext('2d', { willReadFrequently: true });
    let W = 0, H = 0;
    function fit() {
      const dpr = Math.min(devicePixelRatio || 1, maxDpr);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      return { W, H, dpr };
    }
    /* o: cols, zoom, fx, fy (cover-fit around a focal point) or view(W,H,sw,sh) -> {s,cx,cy};
          cut, boost, noise, t, mouse {x,y,r} (canvas px) */
    function draw(src, o) {
      const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
      if (!sw || !sh) return false;
      fit();
      const cols = Math.max(6, Math.round(o.cols));
      const cw = W / cols, ch = cw * 1.85;
      const rows = Math.ceil(H / ch);
      if (sc.width !== cols || sc.height !== rows) { sc.width = cols; sc.height = rows; }
      let s, cx, cy;
      if (o.view) ({ s, cx, cy } = o.view(W, H, sw, sh));
      else {
        s = Math.min(sw / W, sh / H) / (o.zoom || 1);
        cx = clamp((o.fx ?? .5) * sw, W * s / 2, sw - W * s / 2);
        cy = clamp((o.fy ?? .5) * sh, H * s / 2, sh - H * s / 2);
      }
      sx.setTransform(1, 0, 0, 1, 0, 0); sx.fillStyle = '#000'; sx.fillRect(0, 0, cols, rows);
      const kx = 1 / (s * cw), ky = 1 / (s * ch);
      sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = 'high';
      sx.setTransform(kx, 0, 0, ky, -(cx - W * s / 2) * kx, -(cy - H * s / 2) * ky);
      sx.drawImage(src, 0, 0);
      const d = sx.getImageData(0, 0, cols, rows).data;
      if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H);
      ctx.font = `700 ${ch * .94}px ui-monospace, "SFMono-Regular", Menlo, Consolas, "Courier New", monospace`;
      ctx.textBaseline = 'top';
      const cut = .045 + (o.cut || 0), boost = o.boost || 1.4, noise = o.noise || 0, tq = ((o.t || 0) / 110) | 0;
      const m = o.mouse, r2 = m ? m.r * m.r : 0;
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          let l = (r * .299 + g * .587 + b * .114) / 255, bo = boost, k = -1;
          if (l < cut) continue;
          if (noise) l = clamp(l + (hash(x, y, tq) - .5) * noise);
          if (m) {
            const dx = x * cw + cw / 2 - m.x, dy = y * ch + ch / 2 - m.y, dd = dx * dx + dy * dy;
            if (dd < r2) { const f = 1 - dd / r2; bo += f * .9; if (hash(x, y, tq + 7) < f * .55) k = (hash(y, x, tq) * N) | 0; }
          }
          if (k < 0) k = Math.min(N - 1, (l * N) | 0);
          const f = o.vivid ? 255 * Math.pow(l, .5) / Math.max(24, r, g, b) * bo / 1.4 : bo;
          ctx.fillStyle = `rgb(${Math.min(255, r * f) | 0},${Math.min(255, g * f) | 0},${Math.min(255, b * f) | 0})`;
          ctx.fillText(RAMP[k], x * cw, y * ch);
        }
      }
      return true;
    }
    return { draw, fit };
  }
  window.ASCII = { Renderer, RAMP, clamp, smooth, RM };
  if (RM) return;

  const deep = () => getComputedStyle(document.body).getPropertyValue('--bg-deep').trim() || '#120d0a';
  const small = matchMedia('(max-width: 700px)').matches;

  /* a canvas laid over an image that resolves from coarse characters into the photo */
  function resolve(host, img, from, to, dur, done) {
    const cv = document.createElement('canvas'); cv.className = 'ascii-veil'; cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    const R = Renderer(cv, deep(), 1.5), t0 = performance.now();
    const step = now => {
      const k = clamp((now - t0) / dur), e = k * k * (3 - 2 * k);
      R.draw(img, { cols: from + e * (to - from), zoom: 1.06 - e * .06 });
      cv.style.opacity = 1 - smooth(.6, 1, k);
      if (k < 1) requestAnimationFrame(step); else { cv.remove(); done && done(); }
    };
    requestAnimationFrame(step);
  }
  const whenLoaded = (img, f) => (img.complete && img.naturalWidth ? f() : img.addEventListener('load', f, { once: true }));

  /* project heroes */
  document.querySelectorAll('.p-hero').forEach(sec => {
    const img = sec.querySelector('img');
    if (img) whenLoaded(img, () => resolve(sec, img, small ? 26 : 44, small ? 176 : 344, 1700));
  });

  /* every photo tile resolves out of characters when it is built (by the cursors) or first seen */
  const resolveTile = t => {
    if (t._res) return; t._res = 1;
    if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
    const img = t.querySelector('img'); if (img) whenLoaded(img, () => resolve(t, img, small ? 10 : 14, small ? 90 : 150, 1100));
  };
  window.ASCII.resolveTile = resolveTile;
  /* the lightbox photo arrives the same way */
  window.ASCII.resolveFixed = img => {
    const r = img.getBoundingClientRect(); if (r.width < 20) return;
    const cv = document.createElement('canvas'); cv.className = 'ascii-fixed'; cv.setAttribute('aria-hidden', 'true');
    Object.assign(cv.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(cv);
    const R = Renderer(cv, null, 1.5), t0 = performance.now();
    const step = now => { const k = clamp((now - t0) / 650), e = k * k * (3 - 2 * k);
      R.draw(img, { cols: (small ? 16 : 24) + e * (small ? 110 : 220), vivid: true, boost: 1.5 }); cv.style.opacity = 1 - smooth(.45, 1, k);
      if (k < 1) requestAnimationFrame(step); else cv.remove(); };
    requestAnimationFrame(step);
  };
  addEventListener('DOMContentLoaded', () => {
    if (window.CURSORS) return;          // the builder cursors trigger these instead
    const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { tio.unobserve(e.target); resolveTile(e.target); } }), { threshold: .2 });
    document.querySelectorAll('main .tile, .portrait').forEach(t => tio.observe(t));
    const hio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { hio.unobserve(e.target); scramble(e.target); } }), { threshold: .6 });
    document.querySelectorAll('main h2:not(.split), main h3, main .eyebrow, main .num, footer .big').forEach(h => hio.observe(h));
  });

  /* headings and labels scramble through the character ramp before settling */
  const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>0123456789';
  function scramble(el, dur = 900) {
    if (el.dataset.busy) return; el.dataset.busy = 1;
    const nodes = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) if (w.currentNode.nodeValue.trim()) nodes.push([w.currentNode, w.currentNode.nodeValue]);
    if (!el.hasAttribute('aria-label') && !el.closest('a,button')) el.setAttribute('aria-label', el.textContent.trim());
    const total = nodes.reduce((a, n) => a + n[1].length, 0), t0 = performance.now();
    const step = now => {
      const k = clamp((now - t0) / dur); let pos = 0;
      nodes.forEach(([n, txt]) => {
        n.nodeValue = [...txt].map((c, i) => {
          const at = (pos + i) / total; return c === ' ' || at < k * 1.15 - .15 ? c : SC[(Math.random() * SC.length) | 0];
        }).join('');
        pos += txt.length;
      });
      if (k < 1) requestAnimationFrame(step); else { nodes.forEach(([n, txt]) => n.nodeValue = txt); delete el.dataset.busy; }
    };
    requestAnimationFrame(step);
  }
  window.ASCII.scramble = scramble;
  document.querySelectorAll('.nav a, .mmenu a').forEach(a => a.addEventListener('mouseenter', () => scramble(a, 500)));
  document.querySelectorAll('.card').forEach(c => c.addEventListener('mouseenter', () => scramble(c.querySelector('h3'), 500)));
})();
