/* Reading progress and a quiet section index for the project pages. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* progress line */
  const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  const fill = bar.firstChild;
  let tick = false;
  const paint = () => { tick = false; const m = document.documentElement.scrollHeight - innerHeight; fill.style.transform = `scaleX(${m > 0 ? Math.min(1, scrollY / m) : 0})`; };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true }); paint();

  /* section index */
  const secs = [...document.querySelectorAll('main section[data-title]')];
  if (secs.length > 2) {
    const toc = document.createElement('nav'); toc.className = 'toc'; toc.setAttribute('aria-label', 'On this page');
    const links = secs.map(s => {
      const a = document.createElement('a'); a.href = '#' + s.id; a.innerHTML = `<span>${s.dataset.title}</span><i></i>`;
      a.addEventListener('click', e => { e.preventDefault(); s.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); history.replaceState(null, '', '#' + s.id); });
      toc.appendChild(a); return a;
    });
    document.body.appendChild(toc);
    const hero = document.querySelector('.p-hero'), next = document.querySelector('a.next');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const i = secs.indexOf(e.target); links.forEach((a, j) => a.classList.toggle('on', i === j));
      toc.classList.toggle('inv', e.target.classList.contains('cine'));
    }), { rootMargin: '-48% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
    const vis = () => {
      const y = scrollY, top = hero ? hero.offsetHeight * .7 : 200, end = next ? next.offsetTop - innerHeight * .6 : Infinity;
      toc.classList.toggle('show', y > top && y < end);
    };
    addEventListener('scroll', vis, { passive: true }); vis();
  }
})();

/* The 3D models load only when a model scene is close (the script is ~125 KB gzipped). */
(() => {
  const first = document.querySelector('.m3d');
  if (!first) return;
  const go = () => { if (go.done) return; go.done = true; const s = document.createElement('script'); s.src = 'assets/model3d.js?v=27'; s.async = true; s.onerror = () => document.querySelectorAll('.m3d').forEach(e => { e.classList.add('nogl'); e.querySelector('.m3d-word').textContent = 'Model'; }); document.body.appendChild(s); };
  if (!('IntersectionObserver' in window)) return go();
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '250% 0px 250% 0px' });
  document.querySelectorAll('.m3d').forEach(e => io.observe(e));
})();
