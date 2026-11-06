/* Builder cursors: one cursor for each of her design tools. They fly to every part of the page
   as it scrolls into view, drag a selection frame around it (with its size), and build it in.
   On the home page they inspect the photos flying past; at the end they gather at the contact. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) return;
  const small = () => innerWidth < 700;
  const TOOLS = [['Revit', '#8FD3C7'], ['AutoCAD', '#F28B82'], ['Photoshop', '#9AD1F5'], ['Lumion', '#F2C14E'],
                 ['Enscape', '#C6E48B'], ['3ds Max', '#D7B8F3'], ['V-Ray', '#F9C9A8'], ['AI Viz', '#A5B4FC']];
  const COUNT = small() ? 5 : TOOLS.length;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ARROW = c => `<svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true"><path d="M2 1.5v16.2l4.3-4.1 3 6.6 2.6-1.1-3-6.5h6z" fill="${c}" stroke="#16100d" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

  const layer = document.createElement('div'); layer.className = 'crs'; layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  const home = !!document.querySelector('.journey');

  /* status bar, like a shared design file: who is working, how much is built, and a tour button */
  const bar = document.createElement('div'); bar.className = 'cr-bar' + (home ? ' top' : '');
  bar.innerHTML = `<span class="dots">${TOOLS.slice(0, COUNT).map(t => `<i style="background:${t[1]}" title="${t[0]}"></i>`).join('')}</span>
    <span class="txt"><b class="tn">${COUNT}</b> tools · <b class="bn">0</b>/<b class="tt">0</b> built</span><button type="button" class="tour" aria-pressed="false">Tour</button>`;
  document.body.appendChild(bar);
  const bn = bar.querySelector('.bn'), tt = bar.querySelector('.tt'), tourBtn = bar.querySelector('.tour');

  const agents = TOOLS.slice(0, COUNT).map(([name, col], i) => {
    const el = document.createElement('div'); el.className = 'cr'; el.style.setProperty('--c', col);
    el.innerHTML = ARROW(col) + `<span class="tag">${name}</span>`;
    layer.appendChild(el);
    const a = { el, tag: el.querySelector('.tag'), name, col, x: innerWidth * (.2 + .6 * Math.random()), y: innerHeight * (.25 + .5 * Math.random()), tx: 0, ty: 0, vx: 0, vy: 0, svx: 0, svy: 0, path: null, task: null, wander: 0, seed: Math.random() * 100, follow: i < 2 };
    a.tx = a.x; a.ty = a.y; return a;
  });

  /* ---------- the work queue ---------- */
  const queue = []; const pending = new Set(); let total = 0, built = 0;
  const count = () => { bn.textContent = Math.min(built, total); tt.textContent = total; bar.classList.toggle('done', built >= total && total > 0); };
  function finish(el) {
    if (el._built) return; el._built = 1; built++; count();
    el.classList.add('in');
    el.querySelectorAll('.rv, .rv-img').forEach(c => c.classList.add('in'));
    const A = window.ASCII;
    if (A) {
      const tiles = el.matches('.tile, .portrait') ? [el] : [...el.querySelectorAll('.tile, .portrait')];
      tiles.forEach(t => A.resolveTile && A.resolveTile(t));
      if (A.scramble) {
        const hs = el.matches('h2, h3, .eyebrow, .num') ? [el] : [...el.querySelectorAll('h2, h3, .eyebrow, .num')];
        hs.forEach(h => A.scramble(h, 700));
      }
    }
  }
  function enqueue(el) { if (el._built || pending.has(el)) return; pending.add(el); el._q = performance.now(); queue.push(el); }
  function build(el) {
    const host = el.parentElement && el.parentElement.closest('.rv, .rv-img');
    if (host && !host._built) return enqueue(host);
    enqueue(el);
  }
  window.CURSORS = { build };

  const tracked = [...document.querySelectorAll('main .rv, main .rv-img, main .skills, main h2, main h3, footer .big, footer .row')]
    .filter(el => !el.closest('.journey') && !(el.parentElement && el.parentElement.closest('.rv, .rv-img')));
  const jItems = home ? [...document.querySelectorAll('.j-item')] : [];
  total = tracked.length + jItems.length; count();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); enqueue(e.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: .12 });
  tracked.forEach(el => { if (!el.matches('.rv, .rv-img, .skills')) io.observe(el); });

  /* ---------- tasks ---------- */
  function frame(col) {
    const f = document.createElement('div'); f.className = 'cr-frame'; f.style.setProperty('--c', col);
    f.innerHTML = '<i></i><i></i><i></i><i></i><b></b>'; layer.appendChild(f); return f;
  }
  const visRect = el => {
    const r = el.getBoundingClientRect(), t = Math.max(r.top, 8), b = Math.min(r.bottom, innerHeight - 8);
    return { l: r.left, t, w: r.width, h: Math.max(0, b - t), fw: r.width, fh: r.height, off: r.bottom < 0 || r.top > innerHeight };
  };
  function assign(a, now) {
    if (home && window.JOURNEY && Math.random() < .6 && agents.filter(g => g.task && g.task.kind === 'inspect').length < (small() ? 2 : 5)) {        // photos flying past on the home page
      const busy = new Set(agents.map(g => g.task && g.task.el));
      const c = window.JOURNEY.items().filter(n => !busy.has(n));
      if (c.length) { a.task = { el: c[(Math.random() * c.length) | 0], kind: 'inspect', t0: now, phase: 0 }; return; }
    }
    while (queue.length) {
      const el = queue.shift();
      if (el._built) { pending.delete(el); continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) { finish(el); pending.delete(el); continue; }
      a.task = { el, kind: 'build', t0: now, phase: 0 }; return;
    }
  }
  function tick(a, now) {
    const T = a.task, el = T.el, r = visRect(el);
    const done = () => { if (T.f) { T.f.classList.add('out'); const f = T.f; setTimeout(() => f.remove(), 450); } a.task = null; a.wander = 0; };
    if (T.kind === 'build' && (r.off || now - T.t0 > 4200)) { finish(el); pending.delete(el); return done(); }
    if (T.kind === 'inspect' && (!el._vis || el._d < 200)) { if (!el._built) { el._built = 1; built++; count(); } return done(); }
    if (T.phase === 0) {              // fly to the top-left corner
      a.tx = r.l; a.ty = r.t;
      if ((!a.path && Math.hypot(a.x - a.tx, a.y - a.ty) < 6) || now - T.t0 > 1500) { T.phase = 1; T.t1 = now + 90; T.f = frame(a.col); press(a); }
    } else if (T.phase === 1) {       // drag the selection to the bottom-right
      const k = clamp((now - T.t1) / (T.kind === 'inspect' ? 560 : 520), 0, 1), e = minJerk(k);
      const w = r.w * e, h = r.h * e;
      a.tx = a.x = r.l + w; a.ty = a.y = r.t + h; a.direct = true;
      Object.assign(T.f.style, { transform: `translate(${r.l}px,${r.t}px)`, width: w + 'px', height: h + 'px' });
      if (k >= 1) {
        T.phase = 2; T.t2 = now;
        const im = el.querySelector('img');
        T.f.querySelector('b').textContent = T.kind === 'inspect' && im ? `${im.getAttribute('width')} × ${im.getAttribute('height')}` : `${Math.round(r.fw)} × ${Math.round(r.fh)}`;
        T.f.classList.add('sized'); press(a);
        if (T.kind === 'build') { finish(el); pending.delete(el); }
        else if (!el._built) { el._built = 1; built++; count(); }
      }
    } else {                          // hold, keeping the frame on the element while it moves
      Object.assign(T.f.style, { transform: `translate(${r.l}px,${r.t}px)`, width: r.w + 'px', height: r.h + 'px' });
      a.tx = r.l + r.w + 6; a.ty = r.t + r.h + 4;
      if (now - T.t2 > (T.kind === 'inspect' ? 900 : 520)) done();
    }
  }

  /* ---------- idle: hover round her face, follow the visitor, wander, gather at the end ---------- */
  let px = innerWidth / 2, py = innerHeight / 2, pt = -1e9, gather = null;
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; pt = performance.now(); } }, { passive: true });
  const foot = document.querySelector('footer');
  if (foot) new IntersectionObserver(es => es.forEach(e => { gather = e.isIntersecting ? (foot.querySelector('.row a[href^="mailto"]') || foot) : null;  }), { threshold: .3 }).observe(foot);
  const jr = document.querySelector('.journey');
  function idle(a, i, now) {
    const dive = jr ? clamp((scrollY - jr.offsetTop) / (innerHeight * (small() ? 2.2 : 2.6)), 0, 1) : 1;
    if (gather && !queue.length) {    // gather around her email, like a team signing off
      const r = gather.getBoundingClientRect(), ang = i / agents.length * Math.PI * 2 + now / 2400;
      a.tx = r.left + r.width / 2 + Math.cos(ang) * (r.width / 2 + 30); a.ty = r.top + r.height / 2 + Math.sin(ang) * 32; return;
    }
    if (jr && dive < 1 && scrollY < jr.offsetTop + jr.offsetHeight) {   // around her face, pulled into the eye as you scroll
      const cx = innerWidth * (small() ? .5 : .67), cy = innerHeight * (small() ? .36 : .42), ang = a.seed + now / (2200 + i * 260);
      const rad = (small() ? 130 : 240) * Math.pow(1 - dive, 1.4) + 4;
      a.tx = cx + Math.cos(ang) * rad * (1 + .2 * Math.sin(now / 900 + i)); a.ty = cy + Math.sin(ang) * rad * .85; return;
    }
    if (a.follow && now - pt < 3000) { a.tx = px + 28 + i * 24; a.ty = py + 24 + i * 16; return; }
    if (now > a.wander) {             // short, unhurried moves near where it already is, with pauses in between
      a.wander = now + 1400 + Math.random() * 3200;
      const r = Math.min(innerWidth, innerHeight) * (.12 + Math.random() * .22), ang = Math.random() * Math.PI * 2;
      a.tx = clamp(a.x + Math.cos(ang) * r, innerWidth * .06, innerWidth * .92); a.ty = clamp(a.y + Math.sin(ang) * r, innerHeight * .16, innerHeight * .86);
    }
  }

  /* ---------- tour: the page plays itself ---------- */
  let touring = false;
  const setTour = on => { touring = on; tourBtn.textContent = on ? 'Stop' : 'Tour'; tourBtn.setAttribute('aria-pressed', on); bar.classList.toggle('touring', on); };
  tourBtn.addEventListener('click', () => setTour(!touring));
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, e => { if (touring && !(e.target && e.target.closest && e.target.closest('.cr-bar'))) setTour(false); }, { passive: true }));

  /* ---------- movement: curved strokes timed like a hand (longer moves take longer, but not
     proportionally), a small overshoot and settle on arrival, a faint tremor at rest ---------- */
  const minJerk = t => t * t * t * (10 - 15 * t + 6 * t * t);
  function move(a, now, dt) {
    const px = a.x, py = a.y, h = dt / 1000;
    if (a.direct) { a.direct = false; a.path = null; a.vx = a.vy = 0; }
    else {
      const far = Math.hypot(a.tx - a.x, a.ty - a.y);
      const jump = a.path ? Math.hypot(a.tx - a.path.ex, a.ty - a.path.ey) : 0;
      if ((!a.path && far > 22) || jump > 80) {
        const bend = (Math.random() - .5) * .5 * far, nx = -(a.ty - a.y) / (far || 1), ny = (a.tx - a.x) / (far || 1);
        a.path = { sx: a.x, sy: a.y, bx: nx * bend, by: ny * bend, ex: a.tx, ey: a.ty, t0: now,
          dur: (160 + 150 * Math.log2(1 + far / 26)) * (a.task ? .85 : 1.3) * (.85 + Math.random() * .3) };
      }
      if (a.path) {
        const P = a.path; P.ex = a.tx; P.ey = a.ty;   // keep aiming at a target that moves (the page scrolls)
        const t = Math.min(1, (now - P.t0) / P.dur), e = minJerk(t), f = 1 - e;
        const cx = (P.sx + P.ex) / 2 + P.bx * (1 - t * .6), cy = (P.sy + P.ey) / 2 + P.by * (1 - t * .6);
        a.x = f * f * P.sx + 2 * f * e * cx + e * e * P.ex; a.y = f * f * P.sy + 2 * f * e * cy + e * e * P.ey;
        if (t >= 1) {                                // arrive with a little momentum, the spring settles it
          const d = Math.hypot(P.ex - P.sx, P.ey - P.sy) || 1, sp = Math.min(260, d * .9);
          a.vx = (P.ex - P.sx) / d * sp; a.vy = (P.ey - P.sy) / d * sp; a.path = null;
        }
      } else {
        const k = 160, c = 2 * Math.sqrt(k) * .6;
        a.vx += ((a.tx - a.x) * k - a.vx * c) * h; a.vy += ((a.ty - a.y) * k - a.vy * c) * h;
        a.x += a.vx * h; a.y += a.vy * h;
        const tr = a.task ? .12 : .35;               // a resting hand is never perfectly still
        a.x += (Math.sin(now / 410 + a.seed) + .5 * Math.sin(now / 173 + a.seed * 3)) * tr;
        a.y += (Math.cos(now / 470 + a.seed * 2) + .5 * Math.sin(now / 211 + a.seed)) * tr;
      }
    }
    const vx = (a.x - px) / Math.max(1, dt) * 16, vy = (a.y - py) / Math.max(1, dt) * 16;
    a.svx += (vx - a.svx) * .18; a.svy += (vy - a.svy) * .18;
    a.el.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px) rotate(${clamp(a.svx * 1.3, -14, 14).toFixed(1)}deg)`;
    a.tag.style.transform = `translate(${clamp(-a.svx * 1.6, -12, 12).toFixed(1)}px,${clamp(-a.svy * 1.6, -9, 9).toFixed(1)}px)`;
  }
  function press(a) {                                 // a click: the cursor dips and a ring spreads in its colour
    a.el.classList.remove('press'); void a.el.offsetWidth; a.el.classList.add('press');
    const r = document.createElement('i'); r.className = 'cr-ring'; r.style.setProperty('--c', a.col);
    r.style.transform = `translate(${a.x}px,${a.y}px)`; layer.appendChild(r); setTimeout(() => r.remove(), 600);
  }

  /* ---------- loop ---------- */
  let last = 0, carry = 0, sweep = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(50, now - (last || now)); last = now;
    if (touring) {
      carry += (home ? (small() ? .42 : .55) : .2) * dt;
      const step = Math.floor(carry); carry -= step; if (step) scrollBy(0, step);
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) setTour(false);
    }
    if (now - sweep > 500) {          // anything you scrolled straight past gets built, so it is there when you scroll back
      sweep = now;
      document.querySelectorAll('main .rv:not(.in), main .rv-img:not(.in), main .skills:not(.in)').forEach(el => { if (el.getBoundingClientRect().bottom < 0) { const h = el.parentElement && el.parentElement.closest('.rv, .rv-img'); finish(h && !h._built ? h : el); pending.delete(el); } });
      tracked.forEach(el => { if (!el._built && el.getBoundingClientRect().bottom < 0) { finish(el); pending.delete(el); } });
      if (home) jItems.forEach(n => { if (!n._built && n._d !== undefined && n._d < 200) { n._built = 1; built++; count(); } });
    }
    const lbOpen = document.body.classList.contains('lb-open');
    layer.classList.toggle('hide', lbOpen);
    // anything that waited too long builds itself, so no content is ever held back
    for (let i = 0; i < queue.length; i++) { const el = queue[i]; if (now - el._q > 1600) { queue.splice(i, 1); finish(el); pending.delete(el); i--; } }
    agents.forEach((a, i) => {
      if (!a.task && !lbOpen) assign(a, now);
      if (a.task) tick(a, now); else idle(a, i, now);
      move(a, now, dt);
    });
  }
  requestAnimationFrame(loop);
})();
