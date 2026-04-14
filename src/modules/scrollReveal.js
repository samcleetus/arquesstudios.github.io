const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-animate]');
  if (!revealElements.length) return;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}
