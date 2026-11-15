/* Coloured character rendering for the home-page portrait (window.ASCII). No dependencies. */
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
      const over = o.over;
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          let l = (r * .299 + g * .587 + b * .114) / 255, bo = boost, k = -1;
          if (over) {                     // a drawn layer (her iris) can replace the photo cell by cell
            const v = over(cx + ((x + .5) * cw - W / 2) * s, cy + ((y + .5) * ch - H / 2) * s, r, g, b, x, y);
            if (v === false) continue;
            if (v) { ctx.fillStyle = `rgb(${v[1] | 0},${v[2] | 0},${v[3] | 0})`; ctx.fillText(v[0], x * cw, y * ch); continue; }
          }
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
})();
