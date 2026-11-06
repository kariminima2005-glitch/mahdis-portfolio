/* Home: an ASCII portrait that you scroll into, through the eye, then a forward 3D flight
   past every photo of every project. Scroll (or swipe) moves the camera forward. */
(() => {
  const J = document.querySelector('.journey');
  if (!J || !window.ASCII) return;
  const { Renderer, clamp, smooth, RM } = window.ASCII;
  const $ = (s, r = J) => r.querySelector(s), $$ = (s, r = J) => [...r.querySelectorAll(s)];
  const stage = $('.j-stage'), world = $('.j-world'), faceCv = $('.j-face'), starCv = $('.j-stars');
  const intro = $('.j-intro'), hud = $('.j-hud'), cue = $('.j-cue');
  const nodes = $$('.j-world > *');
  const items = nodes.filter(n => n.classList.contains('j-item'));
  const plates = nodes.filter(n => n.classList.contains('j-plate') && n.dataset.p);
  const COLORS = JSON.parse(J.dataset.colors);
  const EYE = JSON.parse(J.dataset.eye);
  const loadImg = it => { const im = $('img', it); if (!im.getAttribute('src')) im.src = it.dataset.img; return im; };

  // always open at her face: the browser must not drop you back in the middle of the flight
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);
  if (RM) { J.classList.add('flat'); items.forEach(loadImg); return; }

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
  const PAL = COLORS.map(hex), DARK = mixc(PAL[0], [8, 6, 5], .78);

  let W, H, small, A, RATIO, ZEND, FAR, persp;
  const pStart = [];
  function layout() {
    W = innerWidth; H = innerHeight; small = W < 700;
    persp = small ? 620 : 900; stage.style.perspective = persp + 'px';
    A = H * (small ? 2.2 : 2.6);           // scroll used by the face / eye zoom
    RATIO = small ? 3.4 : 4.2;             // depth units per scrolled pixel
    FAR = small ? 3800 : 5200;
    const SP = small ? 380 : 460, PLATE = small ? 1000 : 1300, GAP = small ? 1300 : 1800;
    let z = small ? 700 : 900, k = 0, p = -1;
    nodes.forEach(n => {
      if (n.classList.contains('j-plate')) {
        if (n.dataset.p) { z += GAP; p = +n.dataset.p; pStart[p] = z; k = 0; }
        n._z = z; n._x = 0; n._y = 0; z += PLATE;
      } else {
        const side = k % 2 ? 1 : -1, f = ((k + 1) * .6180339 + p * .37) % 1;
        n._z = z; n._x = side * W * (small ? .2 + f * .06 : .27 + f * .1); n._y = (f - .5) * H * (small ? .5 : .55);
        z += SP; k++;
      }
      n._vis = null;
    });
    ZEND = z + 600;
    J.style.height = Math.round(A + ZEND / RATIO + H) + 'px';
    const anchor = $('#work'); if (anchor) anchor.style.top = Math.round(A + (pStart[0] - 900) / RATIO) + 'px';
  }
  layout();

  /* ---------- her face, drawn in characters, and the dive into her right eye ---------- */
  const face = new Image(); face.src = J.dataset.face;
  const FR = Renderer(faceCv, rgb(DARK), 1.5);
  // measured on the portrait (993 × 1280): iris centre and radius, pupil, catchlight, eyelid opening
  const IRIS = [424, 435], IR = 15.6, PUP = 4.4, GLINT = [429.6, 429.4];
  const LID = { xm: 421, hw: 46, up: 422, upC: 442, lo: 449, loC: 445 };
  const IN = [226, 164, 92], RING = [240, 188, 116], MID = [182, 122, 78], OUT = [124, 80, 56], LIMB = [56, 36, 29];
  const lerp3 = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  const DIRS = ['-', '\\', '|', '/'], DENSE = " .:-=+*#%&@";
  let mouse = null, mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tmx = e.clientX / W - .5; tmy = e.clientY / H - .5;
    const dpr = Math.min(devicePixelRatio || 1, 1.5); mouse = { x: e.clientX * dpr, y: e.clientY * dpr, r: 150 * dpr };
  }, { passive: true });
  const born = performance.now();
  function drawFace(a, t) {
    const intro = smooth(0, 1700, t - born);            // characters settle into her face when the page opens
    const cols = (small ? 92 : 196) * (.22 + .78 * intro);
    let sNow = 1, P = PUP, mixI = 0, rot = 0, tunnel = 0, glint = 1;
    const iris = (px, py, r, g, b) => {
      if (mixI <= 0) return null;
      const dx = px - IRIS[0], dy = py - IRIS[1], rr = Math.hypot(dx, dy);
      if (rr > IR * 1.12) return null;
      const tx = (px - LID.xm) / LID.hw, tt = tx * tx;
      if (tt >= 1) return null;
      const yu = LID.up + (LID.upC - LID.up) * tt, yl = LID.lo - (LID.lo - LID.loC) * tt;
      const w = mixI * smooth(yu - .3, yu + 1.4, py) * (1 - smooth(yl - 1.4, yl + .3, py));
      if (w < .35) return null;
      const th = Math.atan2(dy, dx) + rot;
      if (glint > 0) {                                  // her catchlight
        const gx = (px - GLINT[0]) / 2.6, gy = (py - GLINT[1]) / 1.9, gd = gx * gx + gy * gy;
        if (gd < 1.9) { const v = glint; return [gd < .5 ? '@' : gd < 1 ? '*' : '+', 60 + 192 * v, 45 + 200 * v, 40 + 198 * v]; }
      }
      if (rr < P) {                                     // the pupil: dark and, deep in, rings pulling you through
        if (tunnel > 0) {
          const ph = (Math.log(rr / P + .015) * 2.6 + t * .0016) % 1, ang = (th * 6 / Math.PI + 12) % 1;
          if ((ph + 1) % 1 < .14 && ang < .55) { const v = 60 + 120 * tunnel * (rr / P); return ['.:o'[Math.min(2, (rr / P * 3) | 0)], v * 1.3, v * .9, v * .7]; }
        }
        return false;
      }
      const u = (rr - P) / (IR - P);
      if (u > 1) { if (u < 1.09) return [':', 70, 45, 36]; return null; }
      const fib = .5 + .5 * Math.sin(th * 41 + 2.2 * Math.sin(th * 7 + u * 3));
      const fib2 = .5 + .5 * Math.sin(th * 97 + u * 6 + Math.sin(th * 13) * 2);
      const crypt = (u > .3 && u < .78 && Math.sin(th * 11 + 1.3) * Math.sin(u * 9) > .55) ? .45 : 1;
      const shade = 1 - .38 * smooth(0, 1, -dy / IR);   // the upper lid shades the top of the iris
      let col = u < .26 ? lerp3(IN, RING, u / .26) : u < .38 ? lerp3(RING, MID, (u - .26) / .12) : u < .86 ? lerp3(MID, OUT, (u - .38) / .48) : lerp3(OUT, LIMB, (u - .86) / .14);
      const lum = (.4 + .6 * fib * (.62 + .38 * fib2)) * crypt * shade;
      const k = .5 + lum * .95 + (u < .3 ? .25 * (1 - u / .3) : 0);
      col = [col[0] * k, col[1] * k, col[2] * k];
      if (w < 1) col = lerp3([r * 1.4, g * 1.4, b * 1.4], col, w);
      const ch = fib > .74 && crypt === 1 ? DIRS[Math.round((((th % Math.PI) + Math.PI) % Math.PI) / (Math.PI / 4)) % 4] : DENSE[Math.min(10, 1 + ((lum * 10) | 0))];
      return [ch, Math.min(255, col[0]), Math.min(255, col[1]), Math.min(255, col[2])];
    };
    FR.draw(face, {
      cols, t, noise: .07 * (1 - a) + (1 - intro) * .5, cut: 0, boost: 1.4, vivid: true, mouse: a < .25 ? mouse : null,
      over: iris,
      view: (w, h, sw, sh) => {
        const s0 = small ? Math.max(sh / (h * 1.05), sw / (w * 1.45)) : sh / (h * 1.32);
        const sEnd = IR / (.62 * Math.hypot(w, h));
        const e = .3 * a * a * (3 - 2 * a) + .7 * a;
        const zoom = Math.exp(e * Math.log(s0 / sEnd)) * (1 + .012 * Math.sin(t / 1900) * (1 - a));
        const k = Math.pow(1 / zoom, 1.25);
        const c0x = sw * (small ? .5 : .3) - mx * 40, c0y = sh * (small ? .5 : .43) - my * 30;
        sNow = s0 / zoom;
        const Rs = IR / sNow / Math.min(devicePixelRatio || 1, 1.5);
        mixI = smooth(28, 110, Rs);
        P = PUP * (1 + .05 * Math.sin(t / 800)) * (1 + 2.35 * smooth(.7, 1, a));
        rot = a * .7 + t * .00003;
        tunnel = smooth(.8, .97, a); glint = 1 - smooth(.7, .82, a);
        return { s: sNow, cx: IRIS[0] + (c0x - IRIS[0]) * k, cy: IRIS[1] + (c0y - IRIS[1]) * k };
      }
    });
  }

  /* ---------- stars ---------- */
  const sctx = starCv.getContext('2d');
  const STARS = Array.from({ length: small ? 140 : 260 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 3000, c: '.:+*·'[(Math.random() * 5) | 0] }));
  let prevCam = 0, vel = 0;
  function drawStars(cam, alpha) {
    vel += (Math.abs(cam - prevCam) - vel) * .2; prevCam = cam;
    const streak = Math.min(1, vel / 260);
    if (starCv.width !== W || starCv.height !== H) { starCv.width = W; starCv.height = H; }
    sctx.clearRect(0, 0, W, H);
    if (alpha <= 0) return;
    sctx.fillStyle = '#FCF5EE'; sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
    STARS.forEach(s => {
      const dz = ((s.z - cam * .55) % 3000 + 3000) % 3000, f = 520 / (520 + dz);
      const x = W / 2 + (s.x * W * 1.1 - mx * 60) * f, y = H / 2 + (s.y * H * 1.1 - my * 40) * f;
      sctx.globalAlpha = alpha * smooth(3000, 1400, dz) * smooth(0, 220, dz) * .8;
      if (streak > .08) {
        const f2 = 520 / (520 + dz + vel * 2.2), x2 = W / 2 + (s.x * W * 1.1 - mx * 60) * f2, y2 = H / 2 + (s.y * H * 1.1 - my * 40) * f2;
        sctx.strokeStyle = '#FCF5EE'; sctx.lineWidth = .6 + f * 2.2; sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x2, y2); sctx.stroke();
      }
      sctx.font = `500 ${8 + f * 22}px ui-monospace, Menlo, Consolas, monospace`;
      sctx.fillText(s.c, x, y);
    });
    sctx.globalAlpha = 1;
  }

  /* ---------- items: ascii first, photo when close ---------- */
  function prep(it) {
    if (it._prep) return; it._prep = 1;
    const im = loadImg(it), cv = $('canvas', it);
    const go = () => { const R = Renderer(cv, null, 1); try { R.draw(im, { cols: small ? 34 : 56, boost: 1.5, vivid: true }); } catch (e) {} it.classList.add('ready'); };
    im.complete && im.naturalWidth ? go() : im.addEventListener('load', go, { once: true });
  }

  /* ---------- HUD ---------- */
  const hNum = $('.j-now .n'), hTitle = $('.j-now .t'), hOpen = $('.j-now a'), hCount = $('.j-count b'), hBar = $('.j-bar i');
  const marks = $$('.j-marks button');
  let curP = -1;
  marks.forEach((b, i) => b.addEventListener('click', () => scrollTo({ top: J.offsetTop + A + (pStart[i] - 650) / RATIO, behavior: 'instant' })));

  /* ---------- loop ---------- */
  let S = scrollY, cam = 0, last = 0, lastFace = 0, running = true;
  const vis = (n, v) => { if (n._vis !== v) { n._vis = v; n.style.visibility = v ? 'visible' : 'hidden'; } };
  function frame(t) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min(64, t - (last || t)); last = t;
    const k = 1 - Math.pow(.86, dt / 16.7);
    S += (scrollY - S) * k; if (Math.abs(scrollY - S) < .5) S = scrollY;
    mx += (tmx - mx) * k * .6; my += (tmy - my) * k * .6;
    const s = S - J.offsetTop, a = clamp(s / A), camT = Math.max(0, s - A) * RATIO;
    cam = camT;
    // face
    const faceOp = 1 - smooth(.93, 1, a);
    faceCv.style.opacity = faceOp;
    if (faceOp > 0 && face.naturalWidth && t - lastFace > 30) { lastFace = t; drawFace(a, t); }
    intro.style.opacity = 1 - smooth(.01, .14, a); intro.style.transform = `translateY(${-a * 160}px)`;
    cue.style.opacity = 1 - smooth(0, .05, a);
    // background colour follows the project you are flying through
    let bg = DARK;
    const wIn = smooth(.84, 1, a);
    if (wIn > 0) {
      let p = 0; for (let i = 0; i < pStart.length; i++) if (cam > pStart[i] - 1400) p = i;
      const nxt = pStart[p + 1], f = nxt ? smooth(nxt - 2600, nxt - 1400, cam) : 0;
      const pc = mixc(PAL[p], PAL[Math.min(p + 1, PAL.length - 1)], f);
      bg = mixc(DARK, pc, wIn);
      if (p !== curP && a >= 1) {
        curP = p; const pl = plates[p];
        hNum.textContent = pl.dataset.num; hTitle.textContent = pl.dataset.title; hOpen.href = pl.dataset.href; hOpen.dataset.veil = COLORS[p];
        marks.forEach((b, i) => b.classList.toggle('on', i === p)); window.ASCII.scramble && window.ASCII.scramble(hTitle, 600);
      }
    }
    stage.style.backgroundColor = rgb(bg);
    hud.classList.toggle('on', a >= 1);
    drawStars(cam, wIn);
    world.style.transform = `rotateY(${mx * 5}deg) rotateX(${-my * 4}deg)`;
    let passed = 0;
    for (const n of nodes) {
      const d = n._z - cam; n._d = d;
      if (d < 260 && n.classList.contains('j-item')) passed++;
      if (d < -140 || d > FAR || wIn <= 0) { vis(n, false); if (d > FAR && d < FAR + 3500) n.classList.contains('j-item') && prep(n); continue; }
      vis(n, true);
      if (n.classList.contains('j-item')) {
        prep(n);
        n.style.setProperty('--photo', smooth(2300, 900, d).toFixed(3));
      }
      const isP = n.classList.contains('j-plate');
      const op = wIn * (isP ? smooth(2400, 1300, d) : smooth(FAR, FAR - 1600, d)) * smooth(-120, n.classList.contains('j-plate') ? 520 : 380, d);
      n.style.opacity = op.toFixed(3);
      n.style.pointerEvents = op > .35 ? 'auto' : 'none';
      n.style.transform = `translate3d(${n._x.toFixed(1)}px,${n._y.toFixed(1)}px,${(-d).toFixed(1)}px)`;
    }
    hCount.textContent = passed; hBar.style.transform = `scaleX(${clamp(cam / (ZEND - 600))})`;
  }
  new IntersectionObserver(es => es.forEach(e => {
    const was = running; running = e.isIntersecting;
    if (running && !was) { last = 0; requestAnimationFrame(frame); }
  })).observe(J);
  requestAnimationFrame(frame);

  let rt, lw = innerWidth, lh = innerHeight;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => {
    if (innerWidth === lw && Math.abs(innerHeight - lh) < 160) return;   // phone address bar showing / hiding
    const f = (scrollY - J.offsetTop) / Math.max(1, J.offsetHeight);
    lw = innerWidth; lh = innerHeight; layout(); FR.fit();
    if (f > 0 && f < 1) { scrollTo(0, J.offsetTop + f * J.offsetHeight); S = scrollY; }
  }, 150); });
  /* for the builder cursors: photos currently flying close to the camera */
  window.JOURNEY = { items: () => items.filter(n => n._vis && n._d > 600 && n._d < 2000 && +n.style.opacity > .6) };
  // keyboard: space / arrows already scroll; Enter on a focused item opens it via the lightbox
  if (location.hash === '#work') requestAnimationFrame(() => { const a = $('#work'); scrollTo(0, J.offsetTop + a.offsetTop); S = scrollY; });
})();
