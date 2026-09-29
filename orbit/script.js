const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  const nav = $('.site-nav');
  const toggle = $('.menu-toggle');
  const pageLinks = { Product: 'product.html', Platform: 'platform.html', Pricing: 'pricing.html' };
  $$('.site-nav .nav-link').forEach(link => {
    const destination = pageLinks[link.textContent.trim()];
    if (destination) link.href = destination;
  });
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open navigation');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('.nav-link').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        reveal.unobserve(e.target);
      }
    });
  }, {threshold:.12});
  $$('.reveal').forEach(el => reveal.observe(el));

  $$('.counter').forEach(el => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    let started = false;
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      let start = 0, startTime = null;
      const duration = 1100;
      const tick = t => {
        if (!startTime) startTime = t;
        const p = Math.min((t-startTime)/duration,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = Math.floor(start + (target-start)*eased).toLocaleString() + suffix;
        if (p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    });
    io.observe(el);
  });

  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.filter-item').forEach(item => {
        item.style.display = filter === 'all' || item.dataset.category.includes(filter) ? '' : 'none';
      });
    });
  });

  $$('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
});
