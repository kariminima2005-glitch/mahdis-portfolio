/* Mahdis Sabzi — portfolio interactions. Plain JS, no dependencies. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = t => { t = Math.max(0, t | 0); return (t / 60 | 0) + ':' + String(t % 60).padStart(2, '0'); };

  /* ---------- nav ---------- */
  const nav = $('.nav'), darkHero = $('.ascii-hero, .hero, .p-hero');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = darkHero ? darkHero.offsetHeight - 80 : 0;
    if (nav) {
      nav.classList.toggle('on-dark', !!darkHero && y < h);
      nav.classList.toggle('solid', !darkHero || y >= h);
      nav.classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('lb-open'));
    }
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- split headline ---------- */
  $$('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/); el.textContent = ''; let i = 0;
    words.forEach((w, wi) => {
      const ws = document.createElement('span'); ws.className = 'w';
      [...w].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.transitionDelay = (i++ * 28) + 'ms'; ws.appendChild(s); });
      el.appendChild(ws); if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.setAttribute('aria-label', words.join(' '));
    requestAnimationFrame(() => setTimeout(() => el.classList.add('in'), 120));
  });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.rv, .rv-img, .skills').forEach((el, i) => { if (RM) el.classList.add('in'); else io.observe(el); });
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => c.style.transitionDelay = (i % 6) * 90 + 'ms'));

  /* ---------- parallax hero ---------- */
  const px = $('.p-hero img');
  if (px && !RM) {
    let tick = false;
    addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { const y = Math.min(scrollY, innerHeight); px.style.transform = `translate3d(0,${y * .18}px,0) scale(${1 + y / innerHeight * .06})`; tick = false; }); }, { passive: true });
  }

  /* ---------- project cards: film preview on hover ---------- */
  $$('.card[data-film]').forEach(card => {
    if (!FINE || RM) return;
    let v;
    card.addEventListener('mouseenter', () => {
      if (!v) { v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.src = card.dataset.film; v.setAttribute('aria-hidden', 'true'); card.insertBefore(v, card.firstChild.nextSibling); }
      v.play().then(() => card.classList.add('playing')).catch(() => {});
    });
    card.addEventListener('mouseleave', () => { card.classList.remove('playing'); v && v.pause(); });
  });

  /* ---------- film player ---------- */
  function Player(root) {
    const data = JSON.parse($('script[type="application/json"]', root).textContent);
    const v = $('video', root), stage = $('.player', root), track = $('.track', root), segsEl = $('.segs', track), knob = $('.knob', track);
    const tip = $('.tip', track), timeEl = $('.time', root), pp = $('.pp', root), big = $('.big-play', root);
    const capT = $('.cap .t', root), capAi = $('.cap .ai', root), strip = $('.strip', root), chapEl = $('.chapters', root);
    const D = data.duration, chapters = data.chapters, scenes = data.scenes;
    const segs = chapters.map(c => { const s = document.createElement('div'); s.className = 'seg'; s.style.flex = (c.end - c.start); s.style.setProperty('--sc', c.color); s.innerHTML = '<i></i>'; segsEl.appendChild(s); return s; });
    if (chapEl) chapters.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c.title; b.style.setProperty('--sc', c.color); b.onclick = () => seek(c.start + .01, true); chapEl.appendChild(b); c.btn = b; });
    const sbtn = scenes.map((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--sc', s.color || ''); b.innerHTML = `<img loading="lazy" src="${s.thumb}" alt=""><span>${s.caption}</span>`; b.onclick = () => { if (strip.moved) return; seek(s.start + .05, true); }; strip.appendChild(b); return b; });
    let cur = -1;
    const sceneAt = t => { for (let i = scenes.length - 1; i >= 0; i--) if (t >= scenes[i].start) return i; return 0; };
    function paint() {
      const t = v.currentTime || 0;
      knob.style.left = (t / D * 100) + '%';
      chapters.forEach((c, i) => { const f = Math.min(1, Math.max(0, (t - c.start) / (c.end - c.start))); segs[i].firstChild.style.transform = `scaleX(${f})`; c.btn && c.btn.classList.toggle('on', t >= c.start && t < c.end); });
      timeEl.textContent = fmt(t) + ' / ' + fmt(D);
      const i = sceneAt(t);
      if (i !== cur) {
        cur = i; const s = scenes[i];
        capT.textContent = s.caption; capAi.hidden = !s.ai;
        sbtn.forEach((b, j) => b.classList.toggle('on', j === i));
        const b = sbtn[i]; if (b && !strip.dragging) strip.scrollTo({ left: b.offsetLeft - strip.clientWidth / 2 + b.clientWidth / 2, behavior: RM ? 'auto' : 'smooth' });
      }
    }
    function seek(t, play) { v.currentTime = Math.max(0, Math.min(D - .05, t)); paint(); if (play) v.play().catch(() => {}); }
    const toggle = () => v.paused ? v.play().catch(() => {}) : v.pause();
    v.addEventListener('timeupdate', paint); v.addEventListener('seeked', paint);
    v.addEventListener('play', () => { stage.classList.add('is-playing'); pp.innerHTML = ICON.pause; pp.setAttribute('aria-label', 'Pause'); loop(); });
    v.addEventListener('pause', () => { stage.classList.remove('is-playing'); pp.innerHTML = ICON.play; pp.setAttribute('aria-label', 'Play'); });
    let raf; function loop() { cancelAnimationFrame(raf); if (!v.paused) { paint(); raf = requestAnimationFrame(loop); } }
    pp.onclick = toggle; big.onclick = () => { v.muted = true; v.play().catch(() => {}); }; v.onclick = toggle;
    const pos = e => { const r = track.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
    let dragging = false, wasPlaying = false;
    track.addEventListener('pointerdown', e => { dragging = true; wasPlaying = !v.paused; v.pause(); track.setPointerCapture(e.pointerId); seek(pos(e) * D); });
    track.addEventListener('pointermove', e => {
      const f = pos(e); if (dragging) seek(f * D);
      if (tip) { const s = scenes[sceneAt(f * D)]; tip.style.left = Math.max(80, Math.min(track.clientWidth - 80, f * track.clientWidth)) + 'px'; tip.querySelector('img').src = s.thumb; tip.querySelector('span').textContent = s.caption; }
    });
    track.addEventListener('pointerup', () => { dragging = false; if (wasPlaying) v.play().catch(() => {}); });
    root.addEventListener('keydown', e => {
      if (e.target.closest('button') && e.key === ' ') return;
      const k = e.key;
      if (k === ' ' || k === 'k') { e.preventDefault(); toggle(); }
      else if (k === 'ArrowRight') { e.preventDefault(); seek(scenes[Math.min(scenes.length - 1, cur + 1)].start + .05); }
      else if (k === 'ArrowLeft') { e.preventDefault(); seek(scenes[Math.max(0, cur - 1)].start + .05); }
    });
    dragScroll(strip);
    // autoplay (muted) while on screen
    if (root.dataset.autoplay !== undefined && !RM) {
      new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .5) { if (!root.userPaused) v.play().catch(() => {}); } else v.pause(); }), { threshold: [0, .5, .75] }).observe(stage);
      pp.addEventListener('click', () => root.userPaused = v.paused);
    }
    paint();
  }
  const ICON = {
    play: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
    pause: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>'
  };
  $$('[data-player]').forEach(Player);

  /* ---------- drag-scroll rails ---------- */
  function dragScroll(el) {
    if (!el) return;
    let sx, sl, down = false;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; el.moved = false; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { el.moved = true; el.dragging = true; el.classList.add('dragging'); } el.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; el.classList.remove('dragging'); setTimeout(() => { el.moved = false; el.dragging = false; }, 30); });
  }
  $$('.rail').forEach(r => {
    dragScroll(r);
    const ctl = r.parentElement.querySelector('.rail-ctl');
    if (ctl) { const step = d => r.scrollBy({ left: d * r.clientWidth * .8, behavior: 'smooth' }); ctl.children[0].onclick = () => step(-1); ctl.children[1].onclick = () => step(1); }
  });

  /* ---------- lightbox ---------- */
  const lb = $('#lb');
  if (lb) {
    const img = $('img', lb), stage = $('.lb-stage', lb), cap = $('.lb-cap', lb), count = $('.lb-count', lb);
    let group = [], idx = 0, z = 1, tx = 0, ty = 0;
    const apply = () => img.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
    const reset = () => { z = 1; tx = ty = 0; stage.classList.remove('zoomed'); apply(); };
    function show(i) {
      idx = (i + group.length) % group.length; const t = group[idx]; reset();
      img.style.opacity = 0; const n = new Image(); n.onload = () => { img.src = n.src; img.alt = t.dataset.cap || ''; img.style.opacity = 1; }; n.src = t.dataset.full;
      cap.innerHTML = (t.dataset.cap || '') + (t.dataset.src ? `<small>${t.dataset.src}</small>` : '');
      count.textContent = (idx + 1) + ' / ' + group.length;
      const p = group[(idx + 1) % group.length]; if (p) new Image().src = p.dataset.full;
    }
    let opener;
    function open(t) { opener = t; group = $$(`[data-lb="${t.dataset.lb}"]`); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lb-open'); document.body.style.overflow = 'hidden'; show(group.indexOf(t)); $('.lb-close', lb).focus(); }
    function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lb-open'); document.body.style.overflow = ''; opener && opener.focus({ preventScroll: true }); }
    document.addEventListener('click', e => { const t = e.target.closest('[data-lb]'); if (t && !(t.closest('.rail') || {}).moved) { e.preventDefault(); open(t); } });
    $('.lb-close', lb).onclick = close; $('.lb-prev', lb).onclick = () => show(idx - 1); $('.lb-next', lb).onclick = () => show(idx + 1);
    document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
    // zoom / pan / swipe
    let sx, sy, ox, oy, moved, pid;
    stage.addEventListener('pointerdown', e => { pid = e.pointerId; stage.setPointerCapture(pid); sx = e.clientX; sy = e.clientY; ox = tx; oy = ty; moved = false; stage.classList.add('panning'); });
    stage.addEventListener('pointermove', e => { if (pid !== e.pointerId || sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.hypot(dx, dy) > 6) moved = true; if (z > 1) { tx = ox + dx; ty = oy + dy; apply(); } });
    stage.addEventListener('pointerup', e => {
      stage.classList.remove('panning'); const dx = e.clientX - sx; sx = null;
      if (!moved) { if (z > 1) reset(); else { const r = img.getBoundingClientRect(); z = 2.4; tx = (r.left + r.width / 2 - e.clientX) * (z - 1); ty = (r.top + r.height / 2 - e.clientY) * (z - 1); stage.classList.add('zoomed'); apply(); } }
      else if (z === 1 && Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('wheel', e => { e.preventDefault(); const nz = Math.max(1, Math.min(5, z * (e.deltaY < 0 ? 1.15 : 1 / 1.15))); if (nz === 1) return reset(); z = nz; stage.classList.add('zoomed'); apply(); }, { passive: false });
  }

  /* ---------- page transitions ---------- */
  const veil = $('.veil');
  if (veil && !RM) {
    veil.classList.add('cover'); requestAnimationFrame(() => requestAnimationFrame(() => { veil.classList.add('lift'); veil.classList.remove('cover'); }));
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href); if (u.origin !== location.origin || u.hash && u.pathname === location.pathname || /\.(pdf|mp4)$/i.test(u.pathname)) return;
      e.preventDefault(); veil.style.setProperty('--veil', a.dataset.veil || 'var(--c1)'); veil.classList.remove('lift'); veil.classList.add('cover'); setTimeout(() => location.href = a.href, 520);
    });
    addEventListener('pageshow', e => { if (e.persisted) { veil.classList.remove('cover'); veil.classList.add('lift'); } });
  }
})();
