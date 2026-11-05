/* Coloured ASCII rendering of video / images, scroll-driven dive on the home hero,
   and an ASCII-to-photo resolve on project heroes. No dependencies. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAMP = " .`':;,^\"!il~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@";
  const N = RAMP.length;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  function Renderer(canvas, bg) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const sc = document.createElement('canvas');
    const sx = sc.getContext('2d', { willReadFrequently: true });
    let W = 0, H = 0, dpr = 1;
    function fit() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    }
    // draw(source, {cols, zoom, fx, fy, cut, boost})
    function draw(src, o) {
      const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
      if (!sw || !sh) return false;
      fit();
      const cols = Math.max(8, Math.round(o.cols));
      const cw = W / cols, ch = cw * 1.85;
      const rows = Math.ceil(H / ch);
      if (sc.width !== cols || sc.height !== rows) { sc.width = cols; sc.height = rows; }
      // cover-fit the source into the canvas, then zoom around the focal point
      const ca = W / H, ia = sw / sh;
      let rw = ia > ca ? sh * ca : sw, rh = ia > ca ? sh : sw / ca;
      rw /= o.zoom || 1; rh /= o.zoom || 1;
      const fx = o.fx ?? .5, fy = o.fy ?? .5;
      const x0 = clamp(fx * sw - rw / 2, 0, sw - rw), y0 = clamp(fy * sh - rh / 2, 0, sh - rh);
      sx.drawImage(src, x0, y0, rw, rh * (rows * ch / H), 0, 0, cols, rows);
      const d = sx.getImageData(0, 0, cols, rows).data;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.font = `600 ${ch * .92}px ui-monospace, "SFMono-Regular", Menlo, Consolas, "Courier New", monospace`;
      ctx.textBaseline = 'top';
      const cut = o.cut || 0, boost = o.boost || 1.4;
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const l = (r * .299 + g * .587 + b * .114) / 255;
          if (l < .045 + cut) continue;
          const k = Math.min(N - 1, (l * N) | 0);
          ctx.fillStyle = `rgb(${Math.min(255, r * boost) | 0},${Math.min(255, g * boost) | 0},${Math.min(255, b * boost) | 0})`;
          ctx.fillText(RAMP[k], x * cw, y * ch);
        }
      }
      return true;
    }
    return { draw, fit };
  }

  /* ---------- home: scroll dive ---------- */
  const hero = document.querySelector('.ascii-hero');
  if (hero) {
    const cv = hero.querySelector('canvas'), vid = hero.querySelector('video'), copy = hero.querySelector('.hero-copy'), cue = hero.querySelector('.scroll-cue');
    const R = Renderer(cv, getComputedStyle(hero).getPropertyValue('--ascii-bg').trim() || '#120d0a');
    const small = matchMedia('(max-width: 700px)').matches;
    const base = small ? 64 : 132;
    const poster = new Image(); poster.src = vid.getAttribute('poster');
    const source = () => (vid.readyState >= 2 && vid.videoWidth ? vid : poster);
    let p = 0, last = 0, running = true;
    const prog = () => { const r = hero.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
    function frame(t) {
      if (running) requestAnimationFrame(frame);
      if (t - last < 33) return; last = t;
      p = RM ? 0 : prog();
      const dive = smooth(.04, .86, p);
      const ok = R.draw(source(), { cols: base * (1 + dive * 1.6), zoom: 1 + dive * 4.2, fx: .5, fy: .52, cut: smooth(.62, .96, p) * .55 });
      if (!ok) return;
      cv.style.opacity = 1 - smooth(.9, 1, p);
      if (copy) { copy.style.opacity = 1 - smooth(.02, .22, p); copy.style.transform = `translateY(${-p * 120}px) scale(${1 + p * .25})`; }
      if (cue) cue.style.opacity = 1 - smooth(0, .08, p);
    }
    new IntersectionObserver(es => es.forEach(e => {
      running = e.isIntersecting;
      if (running) { requestAnimationFrame(frame); vid.play().catch(() => {}); } else vid.pause();
    })).observe(hero);
    if (RM) { const once = () => R.draw(source(), { cols: base }); vid.addEventListener('loadeddata', once); poster.onload = once; }
    addEventListener('resize', () => R.fit());
  }

  /* ---------- project heroes: characters resolve into the photo ---------- */
  document.querySelectorAll('.p-hero').forEach(sec => {
    const img = sec.querySelector('img');
    if (!img || RM) return;
    const cv = document.createElement('canvas'); cv.className = 'ascii-veil'; cv.setAttribute('aria-hidden', 'true');
    sec.insertBefore(cv, img.nextSibling);
    const R = Renderer(cv, getComputedStyle(document.body).getPropertyValue('--bg-deep').trim() || '#120d0a');
    const small = matchMedia('(max-width: 700px)').matches;
    const go = () => {
      const t0 = performance.now(), dur = 1700;
      const step = now => {
        const k = clamp((now - t0) / dur);
        const e = k * k * (3 - 2 * k);
        R.draw(img, { cols: (small ? 26 : 44) + e * (small ? 150 : 300), zoom: 1.08 - e * .08 });
        cv.style.opacity = 1 - smooth(.62, 1, k);
        if (k < 1) requestAnimationFrame(step); else cv.remove();
      };
      requestAnimationFrame(step);
    };
    if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
  });
})();
