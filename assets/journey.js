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

  /* ---------- face ---------- */
  const face = new Image(); face.src = J.dataset.face;
  const FR = Renderer(faceCv, rgb(DARK), 1.5);
  const ZMAX = 150, LZ = Math.log(ZMAX);
  let mouse = null, mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e => {
    tmx = e.clientX / W - .5; tmy = e.clientY / H - .5;
    const dpr = Math.min(devicePixelRatio || 1, 1.5); mouse = { x: e.clientX * dpr, y: e.clientY * dpr, r: (small ? 70 : 150) * dpr };
  }, { passive: true });
  function drawFace(a, t) {
    const zoom = Math.exp(a * LZ);
    const cols = small ? 84 + a * 30 : 190 + a * 30;
    FR.draw(face, {
      cols, t, noise: .07 * (1 - a), cut: smooth(.86, 1, a) * .2, boost: 1.4, vivid: true, mouse: a < .3 ? mouse : null,
      view: (w, h, sw, sh) => {
        const s0 = small ? Math.max(sh / (h * 1.05), sw / (w * 1.45)) : sh / (h * 1.32);
        const k = Math.pow(1 / zoom, 1.35);
        const c0x = sw * (small ? .5 : .3) - mx * 40, c0y = sh * (small ? .5 : .43) - my * 30;
        return { s: s0 / zoom, cx: EYE[0] * sw + (c0x - EYE[0] * sw) * k, cy: EYE[1] * sh + (c0y - EYE[1] * sh) * k };
      }
    });
  }

  /* ---------- stars ---------- */
  const sctx = starCv.getContext('2d');
  const STARS = Array.from({ length: small ? 140 : 260 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 3000, c: '.:+*·'[(Math.random() * 5) | 0] }));
  function drawStars(cam, alpha) {
    if (starCv.width !== W || starCv.height !== H) { starCv.width = W; starCv.height = H; }
    sctx.clearRect(0, 0, W, H);
    if (alpha <= 0) return;
    sctx.fillStyle = '#FCF5EE'; sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
    STARS.forEach(s => {
      const dz = ((s.z - cam * .55) % 3000 + 3000) % 3000, f = 520 / (520 + dz);
      const x = W / 2 + (s.x * W * 1.1 - mx * 60) * f, y = H / 2 + (s.y * H * 1.1 - my * 40) * f;
      sctx.globalAlpha = alpha * smooth(3000, 1400, dz) * smooth(0, 220, dz) * .8;
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
    const faceOp = 1 - smooth(.9, 1, a);
    faceCv.style.opacity = faceOp;
    if (faceOp > 0 && face.naturalWidth && t - lastFace > 33) { lastFace = t; drawFace(a, t); }
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
        hNum.textContent = pl.dataset.num; hTitle.textContent = pl.dataset.title; hOpen.href = pl.dataset.href;
        marks.forEach((b, i) => b.classList.toggle('on', i === p)); window.ASCII.scramble && window.ASCII.scramble(hTitle, 600);
      }
    }
    stage.style.backgroundColor = rgb(bg);
    hud.classList.toggle('on', a >= 1);
    drawStars(cam, wIn);
    world.style.transform = `rotateY(${mx * 5}deg) rotateX(${-my * 4}deg)`;
    let passed = 0;
    for (const n of nodes) {
      const d = n._z - cam;
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

  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); FR.fit(); }, 120); });
  // keyboard: space / arrows already scroll; Enter on a focused item opens it via the lightbox
  if (location.hash === '#work') requestAnimationFrame(() => { const a = $('#work'); scrollTo(0, J.offsetTop + a.offsetTop); S = scrollY; });
})();
