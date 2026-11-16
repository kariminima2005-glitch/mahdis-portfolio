/* Projects showcase: films play on hover (or tap), the film frame tilts toward the pointer, every
   project's image strip drags and shows its progress, and the project pills follow your scroll. */
(() => {
  const S = document.querySelector('.showcase');
  if (!S) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const panels = [...S.querySelectorAll('.sc-panel')], pills = [...S.querySelectorAll('.sc-nav a')];
  S.style.setProperty('--pc0', getComputedStyle(panels[0]).getPropertyValue('--pc'));

  panels.forEach((p, i) => {
    const media = p.querySelector('.sc-media'), btn = p.querySelector('.sc-play'), lab = btn.querySelector('.pl');
    let v = null;
    const load = () => { if (v) return v; v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.src = media.dataset.film; v.setAttribute('aria-hidden', 'true'); media.insertBefore(v, btn); return v; };
    const play = () => load().play().then(() => { media.classList.add('playing'); lab.textContent = 'Pause'; }).catch(() => {});
    const stop = () => { if (v) v.pause(); media.classList.remove('playing'); lab.textContent = 'Play film'; };
    btn.addEventListener('click', e => { e.stopPropagation(); media.classList.contains('playing') ? stop() : play(); });
    media.addEventListener('click', e => { if (e.target === btn || btn.contains(e.target)) return; location.href = p.querySelector('.sc-open').href; });
    if (fine) {
      media.addEventListener('mouseenter', play);
      media.addEventListener('mouseleave', () => { stop(); media.classList.remove('tilting'); media.style.setProperty('--rx', '0deg'); media.style.setProperty('--ry', '0deg'); });
      if (!RM) media.addEventListener('mousemove', e => {
        const r = media.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        media.classList.add('tilting');
        media.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg'); media.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg');
        media.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); media.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
    }
    // stop films that scroll away
    new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) stop(); }), { threshold: .1 }).observe(media);
    // strip progress
    const rail = p.querySelector('.sc-rail'), bar = p.querySelector('.sc-prog i');
    const upd = () => { const m = rail.scrollWidth - rail.clientWidth; bar.style.setProperty('--p', m > 0 ? Math.max(.05, (rail.scrollLeft + rail.clientWidth) / rail.scrollWidth).toFixed(3) : 1); };
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    // horizontal wheel / trackpad swipes move the strip; plain vertical scrolling still scrolls the page
    rail.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; if (e.shiftKey) { rail.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  });

  /* pills: shown while you are among the projects, following the one you are in */
  const navEl = S.querySelector('.sc-nav');
  new IntersectionObserver(es => es.forEach(e => navEl.classList.toggle('show', e.isIntersecting)), { rootMargin: '-30% 0px -30% 0px' }).observe(S);
  /* pills follow the project you are in */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const i = panels.indexOf(e.target); pills.forEach((a, j) => a.classList.toggle('on', i === j));
  }), { rootMargin: '-45% 0px -50% 0px' });
  panels.forEach(p => io.observe(p));
  pills.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); panels[i].scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }));

  /* each panel rises into place as it arrives */
  if (!RM) {
    const rio = new IntersectionObserver(es => es.forEach(e => { e.target.classList.toggle('arrived', e.isIntersecting); }), { threshold: .18 });
    panels.forEach(p => { p.classList.add('rise'); rio.observe(p); });
  }
})();
