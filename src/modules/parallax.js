const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initParallax() {
  if (prefersReducedMotion) return undefined;

  // Parallax is disabled on touch/mobile — it's jarring on small screens
  if (!window.matchMedia('(hover: hover) and (min-width: 900px)').matches) return undefined;

  const items = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    rate: parseFloat(el.dataset.parallax) || 0.2,
    top: 0,
    height: 0,
    isVisible: true,
  }));
  if (!items.length) return undefined;

  let ticking = false;
  let viewportHeight = window.innerHeight;
  let frameId = 0;

  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    frameId = requestAnimationFrame(() => {
      const viewportCenter = window.scrollY + viewportHeight / 2;

      items.forEach((item) => {
        if (!item.isVisible) return;
        const elementCenter = item.top + item.height / 2;
        const offset = (viewportCenter - elementCenter) * item.rate;
        item.el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });

      ticking = false;
      frameId = 0;
    });
  };

  const measure = () => {
    viewportHeight = window.innerHeight;
    items.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      item.top = rect.top + window.scrollY;
      item.height = rect.height;
    });
    scheduleUpdate();
  };

  let visibilityObserver;
  if (typeof IntersectionObserver !== 'undefined') {
    visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const matched = items.find((item) => item.el === entry.target);
        if (!matched) return;
        matched.isVisible = entry.isIntersecting;
      });
      scheduleUpdate();
    }, {
      rootMargin: '40% 0px',
      threshold: 0,
    });

    items.forEach((item) => {
      visibilityObserver.observe(item.el);
    });
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure, { passive: true });

  measure();

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', measure);
    window.removeEventListener('load', measure);
    visibilityObserver?.disconnect();
    items.forEach((item) => {
      item.el.style.transform = '';
    });
  };
}
