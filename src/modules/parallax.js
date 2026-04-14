const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initParallax() {
  if (prefersReducedMotion) return;

  // Parallax is disabled on touch/mobile — it's jarring on small screens
  if (!window.matchMedia('(hover: hover) and (min-width: 900px)').matches) return;

  const elements = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!elements.length) return;

  let ticking = false;

  const update = () => {
    const halfVh = window.innerHeight / 2;

    elements.forEach((el) => {
      const rate = parseFloat(el.dataset.parallax) || 0.2;
      const rect = el.getBoundingClientRect();
      const elCenterY = rect.top + rect.height / 2;
      // Offset is 0 when element is centred in the viewport; grows as it drifts away
      const offset = (halfVh - elCenterY) * rate;
      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Set initial positions before first scroll
  requestAnimationFrame(update);
}
