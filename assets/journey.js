/* Home: her portrait drawn in coloured characters. Scrolling dives into her right eye; inside the
   pupil a flower opens; the dive carries on into the flower's heart and opens onto the projects. */
(() => {
  const J = document.querySelector('.journey');
  if (!J || !window.ASCII) return;
  const { Renderer, clamp, smooth, RM, RAMP } = window.ASCII;
  const $ = (s, r = J) => r.querySelector(s);
  const stage = $('.j-stage'), faceCv = $('.j-face'), intro = $('.j-intro'), cue = $('.j-cue'), credit = $('.j-credit'), steps = $('.j-steps'); let stepN = -1;

  // always open at her face, never back in the middle of the dive
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);
  if (RM) { J.classList.add('flat'); return; }

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
  const LAND = hex(J.dataset.land || '#5A4135'), DARK = mixc(LAND, [8, 6, 5], .78), NIGHT = [7, 5, 6];

  let W, H, small, A;
  function layout() {
    W = innerWidth || document.documentElement.clientWidth || 1280; H = innerHeight || document.documentElement.clientHeight || 800; small = W < 700;
    A = H * (small ? 4.2 : 4.8);                       // scroll used by the whole dive
    J.style.height = Math.round(A + H) + 'px';
  }
  layout();

  /* ---------- images ---------- */
  const face = new Image(); face.src = J.dataset.face;
  const flower = new Image();   // the flower is drawn by code now (see flowerCell); the photo is no longer loaded
  let FD = null, FW = 0, FH = 0, LV = [];              // flower pixels at 1×, ½, ¼ … so each character averages the petals it covers
  flower.onload = () => {
    let w = FW = flower.naturalWidth, h = FH = flower.naturalHeight, src = flower;
    for (let i = 0; i < 6; i++) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, w, h);
      LV.push({ d: x.getImageData(0, 0, w, h).data, w, h, k: FW / w });
      src = c; w = Math.max(8, w >> 1); h = Math.max(8, h >> 1);
    }
    FD = LV[0].d;
  };
  const FC = JSON.parse(J.dataset.fcentre || '[0.489,0.472]'), FR = +(J.dataset.fradius || .449);   // flower centre and radius (fractions)

  const FRn = Renderer(faceCv, null, 1.5);
  // measured on the portrait (993 × 1280): iris centre and radius, pupil, catchlight, eyelid opening
  const IRIS = [424, 435], IR = 15.6, PUP = 4.4, GLINT = [429.6, 429.4];
  const LID = { xm: 421, hw: 46, up: 422, upC: 442, lo: 449, loC: 445 };
  const IN = [226, 164, 92], RING = [240, 188, 116], MID = [182, 122, 78], OUT = [124, 80, 56], LIMB = [56, 36, 29];
  const lerp3 = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  const DIRS = ['-', '\\', '|', '/'], DENSE = " .:-=+*#%&@", NR = RAMP.length;
  let mouse = null, mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tmx = e.clientX / W - .5; tmy = e.clientY / H - .5;
    const dpr = Math.min(devicePixelRatio || 1, 1.5); mouse = { x: e.clientX * dpr, y: e.clientY * dpr, r: 150 * dpr };
  }, { passive: true });

  /* one flower sample (bilinear, so deep zooms stay smooth) as a character in the portrait's style */
  let fstep = 1;                                       // flower pixels covered by one character, set by the camera
  function petal(fx, fy, t) {
    if (!FD) return false;
    const L = LV[Math.max(0, Math.min(LV.length - 1, Math.round(Math.log2(Math.max(1, fstep)))))];
    const gx = fx / L.k - .5, gy = fy / L.k - .5;
    if (gx < 0 || gy < 0 || gx >= L.w - 1 || gy >= L.h - 1) return false;
    const D = L.d, x0 = gx | 0, y0 = gy | 0, ax = gx - x0, ay = gy - y0, i = (y0 * L.w + x0) * 4, j = i + L.w * 4;
    const mix = o => (D[i + o] * (1 - ax) + D[i + 4 + o] * ax) * (1 - ay) + (D[j + o] * (1 - ax) + D[j + 4 + o] * ax) * ay;
    const r = mix(0), g = mix(1), b = mix(2);
    const l = (r * .299 + g * .587 + b * .114) / 255;
    if (l < .13) return false;                         // the shadows between petals stay empty, so every petal reads
    const m = Math.max(24, r, g, b), f = 255 * Math.pow(l, .4) / m * 1.3, pl = .2 * l * l;   // bright petal rims flare to near-white, the faces stay pink
    const n = ((((fx * 7.3) | 0) * 73 + ((fy * 7.3) | 0) * 37 + ((t / 120) | 0) * 11) % 97) / 97 - .5;
    const k = Math.min(NR - 1, ((Math.pow(Math.max(0, (l - .13) / .62), .9) + n * .03) * NR) | 0);
    return [RAMP[Math.max(1, k)], Math.min(255, r * f * (1 - pl) + 255 * pl), Math.min(255, g * f * (1 - pl) + 238 * pl), Math.min(255, b * f * (1 - pl) + 242 * pl)];
  }

  /* ---------- the flower: six rings of petals round a golden heart, drawn cell by cell ----------
     x, y are in flower radii. Outer rings open first; inner ones lie on top. The heart is a spiral of
     seeds that repeats at every scale, so the dive can go on into it without running out of detail. */
  const TAU = Math.PI * 2, RFP = PUP * 1.75 / 1.22;      // flower radius in portrait pixels: it fills the opened pupil
  const RINGS = [
    { n: 13, R: 1.00, r: .30, c0: [138, 18, 76], c1: [232, 62, 134] },
    { n: 13, R: .84, r: .26, c0: [158, 26, 90], c1: [242, 88, 154] },
    { n: 8, R: .68, r: .22, c0: [180, 38, 104], c1: [249, 116, 172] },
    { n: 8, R: .53, r: .17, c0: [198, 56, 118], c1: [253, 144, 190] },
    { n: 5, R: .39, r: .12, c0: [216, 80, 134], c1: [255, 174, 206] },
    { n: 5, R: .27, r: .085, c0: [232, 108, 152], c1: [255, 202, 222] }
  ];
  const HEART = .118, GLY = 'cxoaXOkhdb#MW&8%B@';
  function flowerCell(x, y, t, bloom, swirl) {
    const ro = Math.hypot(x, y) / (1 + .014 * Math.sin(t / 1150)), th = Math.atan2(y, x);
    const drift = t * .00005 + swirl * 1.3;
    const hr = HEART * (.35 + .65 * bloom);
    if (ro < hr) {                                       // the heart
      const q = ro / hr, L = Math.log(Math.max(1e-5, ro)) * 2.1, spin = drift * 2.2 + t * .00012;
      const s = Math.sin(13 * th + 8 * L + spin) * Math.sin(8 * th - 13 * L - spin * .6);
      const tw = .12 * Math.sin(t / 310 + th * 9 + L * 5);
      const lum = Math.max(0, Math.min(1, .42 + .58 * s + tw));
      const edge = smooth(.72, 1, q);                    // the seeds blush where the first petals begin
      const r = (120 + 135 * lum) * (1 - edge) + 250 * edge, g = (58 + 150 * lum) * (1 - edge) + (120 + 60 * lum) * edge, b = (26 + 70 * lum * lum) * (1 - edge) + (150 + 40 * lum) * edge;
      return [s > .5 ? '@' : s > .22 ? 'o' : s > 0 ? '*' : s > -.35 ? ':' : '.', r, g, b];
    }
    for (let k = RINGS.length - 1; k >= 0; k--) {
      const g = RINGS[k], op = smooth(k * .09, k * .09 + .55, bloom);
      const R = g.R * (.3 + .7 * op), r = g.r * (.45 + .55 * op);
      if (ro > R || ro < r) continue;
      const u = (ro - r) / (R - r), seg = TAU / g.n;
      const phi = (k & 1) * seg * .5 + k * .37 + (1 - op) * 1.15 + .05 * Math.sin(t / 1500 + k * .9) * op + drift * (1 - k * .06);
      const a = (((th - phi) % seg) + seg) % seg / seg - .5;
      const w = (.5 + .47 * op) * Math.pow(Math.sin(Math.PI * Math.pow(u, .6)), .55);   // narrow at the base, full in the middle, pointed at the tip
      const e = Math.abs(a) * 2;
      if (e > w) continue;
      const v = 1 - e / w;                               // 0 on the petal's edge, 1 on its midrib
      let lum = (.34 + .66 * Math.pow(u, .75)) * (.8 + .2 * v);   // shaded where it tucks under the ring above
      let c = lerp3(g.c0, g.c1, u);
      const rim = v < .2 ? 1 - v / .2 : 0, tip = smooth(.8, 1, u);
      const hi = Math.max(rim * .6, tip * .5);
      if (hi > 0) { c = lerp3(c, [255, 226, 238], hi); lum = Math.min(1, lum + .22 * hi); }
      const vein = v > .2 && Math.abs(Math.sin(a * 46)) > .93 ? .82 : 1;   // fine veins along each petal
      lum *= vein;
      const ch = rim > .25 ? (rim > .7 ? '@' : '#') : vein < 1 ? DIRS[Math.round((((th % Math.PI) + Math.PI) % Math.PI) / (Math.PI / 4)) % 4] : GLY[Math.min(17, (lum * 17) | 0)];
      const f = .62 + .62 * lum;
      return [ch, Math.min(255, c[0] * f), Math.min(255, c[1] * f), Math.min(255, c[2] * f)];
    }
    return false;                                        // the shadow between petals
  }

  const PF = PUP * 1.75, FK = FR * 720 * 1.22 / PF;     // the flower sits in the opened pupil: flower px per portrait px
  // pacing: [scroll share, zoom share]; it lingers where the whole flower shows inside her eye
  const KEYS = [[0, 0], [.16, .12], [.34, .4], [.46, .55], [.6, .6], [.8, .8], [1, 1]];
  function ease(a) {
    for (let i = 1; i < KEYS.length; i++) if (a <= KEYS[i][0]) {
      const [a0, z0] = KEYS[i - 1], [a1, z1] = KEYS[i], u = (a - a0) / (a1 - a0);
      return z0 + (z1 - z0) * u * u * (3 - 2 * u);
    }
    return 1;
  }
  const born = performance.now();
  /* stage 1: face → eye → the pupil opens on the flower */
  function drawEye(a, t) {
    const intro = smooth(0, 1700, t - born);
    const cols = (small ? 92 : 196) * (.22 + .78 * intro);
    let sNow = 1, P = PUP, mixI = 0, rot = 0, glint = 1, fl = 0, thin = 0, bloom = 0, swirl = 0, MP = null, MR = 0;
    const iris = (px, py, r, g, b, cx, cy) => {
      if (mixI <= 0) return null;
      const dx = px - IRIS[0], dy = py - IRIS[1], rr = Math.hypot(dx, dy);
      if (rr > IR * 1.12) return null;
      const tx = (px - LID.xm) / LID.hw, tt = tx * tx;
      if (tt >= 1 && P < IR) return null;
      const yu = LID.up + (LID.upC - LID.up) * tt, yl = LID.lo - (LID.lo - LID.loC) * tt;
      const w = P >= IR * .95 ? 1 : mixI * smooth(yu - .3, yu + 1.4, py) * (1 - smooth(yl - 1.4, yl + .3, py));
      if (w < .35) return null;
      if (glint > 0) {                                   // her catchlight, over the flower too
        const gx = (px - GLINT[0]) / 2.1, gy = (py - GLINT[1]) / 1.5, gd = gx * gx + gy * gy;
        if (gd < 1.9) { const v = glint; return [gd < .45 ? '@' : gd < 1 ? '*' : '+', 70 + 185 * v, 60 + 190 * v, 55 + 185 * v]; }
      }
      if (rr < P) {                                      // the pupil holds a flower
        if (fl <= 0) return false;
        if (thin > 0 && (((cx * 73856093) ^ (cy * 19349663)) >>> 0) % 997 / 997 < thin) return false;   // the heart of the flower dissolves into the projects
        let qx = dx, qy = dy, near = 0;
        if (MP) {                                        // the pointer is a drop of water on the petals: they swell and brighten under it
          const ex = px - MP[0], ey = py - MP[1], ed = Math.hypot(ex, ey);
          if (ed < MR) { near = 1 - ed / MR; const g = near * near * .42; qx -= ex * g; qy -= ey * g; }
        }
        const fs = RFP * Math.min(1, P / (PUP * 1.75) * 1.04);   // it never outgrows the pupil it sits in
        const v = flowerCell(qx / fs, qy / fs, t, bloom, swirl);
        if (!v) return false;
        const ro = Math.hypot(qx, qy) / fs, wave = Math.max(0, Math.sin(ro * 11 - t / 520));   // a slow ring of light travels out across the petals
        const lift = (1 + .22 * wave * wave * bloom + .35 * near * near) * (fl < 1 ? fl : 1) * (.7 + .4 * bloom);
        v[1] = Math.min(255, v[1] * lift); v[2] = Math.min(255, v[2] * lift); v[3] = Math.min(255, v[3] * lift);
        return v;
      }
      const th = Math.atan2(dy, dx) + rot, u = (rr - P) / (IR - P);
      if (u > 1) { if (u < 1.09) return [':', 70, 45, 36]; return null; }
      const fib = .5 + .5 * Math.sin(th * 41 + 2.2 * Math.sin(th * 7 + u * 3));
      const fib2 = .5 + .5 * Math.sin(th * 97 + u * 6 + Math.sin(th * 13) * 2);
      const crypt = (u > .3 && u < .78 && Math.sin(th * 11 + 1.3) * Math.sin(u * 9) > .55) ? .45 : 1;
      const shade = 1 - .38 * smooth(0, 1, -dy / IR);
      let col = u < .26 ? lerp3(IN, RING, u / .26) : u < .38 ? lerp3(RING, MID, (u - .26) / .12) : u < .86 ? lerp3(MID, OUT, (u - .38) / .48) : lerp3(OUT, LIMB, (u - .86) / .14);
      const lum = (.4 + .6 * fib * (.62 + .38 * fib2)) * crypt * shade;
      const k = .5 + lum * .95 + (u < .3 ? .25 * (1 - u / .3) : 0);
      col = [col[0] * k, col[1] * k, col[2] * k];
      if (w < 1) col = lerp3([r * 1.4, g * 1.4, b * 1.4], col, w);
      const ch = fib > .74 && crypt === 1 ? DIRS[Math.round((((th % Math.PI) + Math.PI) % Math.PI) / (Math.PI / 4)) % 4] : DENSE[Math.min(10, 1 + ((lum * 10) | 0))];
      return [ch, Math.min(255, col[0]), Math.min(255, col[1]), Math.min(255, col[2])];
    };
    FRn.draw(face, {
      cols, t, noise: .07 * (1 - a) + (1 - intro) * .5, cut: smooth(.88, 1, a) * .75, boost: 1.4, vivid: true, mouse: a < .25 ? mouse : null,
      over: iris,
      view: (w, h, sw, sh) => {
        const s0 = small ? Math.max(sh / (h * 1.05), sw / (w * 1.45)) : sh / (h * 1.32);
        // the whole dive is one camera move: face → eye → the flower in her pupil → the flower's heart
        const sEnd = (FR * 720 * .07 / FK) / (.5 * Math.hypot(w, h));
        const L = Math.log(s0 / sEnd), e = ease(a);
        const zoom = Math.exp(e * L) * (1 + .012 * Math.sin(t / 1900) * (1 - a));
        const k = Math.pow(1 / zoom, 1.25);
        const c0x = sw * (small ? .5 : .3) - mx * 40, c0y = sh * (small ? .5 : .43) - my * 30;
        sNow = s0 / zoom;
        fstep = sNow * (w / cols) * FK;
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        mixI = smooth(28, 110, IR / sNow / dpr);
        P = PUP * (1 + .04 * Math.sin(t / 800) * (1 - a)) * (1 + .75 * smooth(.4, .58, a));
        rot = a * .7 + t * .00003; thin = smooth(.86, .99, a);
        glint = 1 - smooth(.5, .6, a);
        fl = smooth(.3, .42, a);                         // the flower glows up inside the pupil
        bloom = smooth(.33, .6, a); bloom = 1 - Math.pow(1 - bloom, 2.2);   // and opens, quick at first, settling slowly
        swirl = smooth(.7, 1, a);
        const ccx = IRIS[0] + (c0x - IRIS[0]) * k, ccy = IRIS[1] + (c0y - IRIS[1]) * k;
        if (mouse && a > .3) { MP = [ccx + (mouse.x - w / 2) * sNow, ccy + (mouse.y - h / 2) * sNow]; MR = mouse.r * 1.25 * sNow; } else MP = null;
        return { s: sNow, cx: IRIS[0] + (c0x - IRIS[0]) * k, cy: IRIS[1] + (c0y - IRIS[1]) * k };
      }
    });
  }
  /* ---------- loop ---------- */
  let S = scrollY, last = 0, lastDraw = 0, running = true;
  function frame(t) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (innerWidth && innerHeight && (innerWidth !== W || Math.abs(innerHeight - H) > 160)) { lw = innerWidth; lh = innerHeight; layout(); }   // first real size, rotation, or a hidden tab
    const dt = Math.min(64, t - (last || t)); last = t;
    const k = 1 - Math.pow(.86, dt / 16.7);
    S += (scrollY - S) * k; if (Math.abs(scrollY - S) < .5) S = scrollY;
    mx += (tmx - mx) * k * .6; my += (tmy - my) * k * .6;
    const a = clamp((S - J.offsetTop) / A);
    // dark into the pupil, then the flower's heart thins away into the first project's colour
    stage.style.backgroundColor = rgb(a < .945 ? mixc(DARK, NIGHT, smooth(.3, .5, a)) : mixc(NIGHT, LAND, smooth(.945, 1, a)));
    if (t - lastDraw > 30 && face.naturalWidth) { lastDraw = t; drawEye(a, t); }
    faceCv.style.opacity = 1 - smooth(.95, 1, a);
    intro.style.opacity = 1 - smooth(.01, .06, a); intro.style.transform = `translateY(${-a * 260}px)`;
    cue.style.opacity = 1 - smooth(0, .03, a);
    stage.style.setProperty('--vig', (1 - smooth(.93, 1, a)).toFixed(3));
    if (steps) { const n = a < .16 ? 0 : a < .36 ? 1 : a < .9 ? 2 : 3; if (n !== stepN) { stepN = n; [...steps.children].forEach((s, i) => s.classList.toggle('on', i === n)); } steps.style.opacity = 1 - smooth(.95, 1, a); }
    if (credit) credit.style.opacity = smooth(.42, .55, a) * (1 - smooth(.94, 1, a));
  }
  new IntersectionObserver(es => es.forEach(e => {
    const was = running; running = e.isIntersecting;
    if (running && !was) { last = 0; requestAnimationFrame(frame); }
  })).observe(J);
  requestAnimationFrame(frame);

  let rt, lw = innerWidth, lh = innerHeight;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => {
    if (innerWidth === lw && Math.abs(innerHeight - lh) < 160) return;   // phone address bar showing / hiding
    lw = innerWidth; lh = innerHeight; layout(); FRn.fit();
  }, 150); });
})();
