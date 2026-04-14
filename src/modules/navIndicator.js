const NAV_THRESHOLD = 0.3;

export function initNavIndicator() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  if (nav.dataset.navIndicatorInitialized === 'true') return;
  nav.dataset.navIndicatorInitialized = 'true';

  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const indicator = nav.querySelector('.nav-indicator');

  if (!indicator || navLinks.length === 0) {
    return;
  }

  let activeLink = navLinks[0];
  let frameId = 0;

  const moveIndicator = (link) => {
    if (!link) return;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      indicator.style.width = `${linkRect.width}px`;
      indicator.style.transform = `translate3d(${linkRect.left - navRect.left}px, 0, 0)`;
      indicator.style.opacity = '1';
      frameId = 0;
    });
  };

  moveIndicator(activeLink);

  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('focus', () => moveIndicator(link));
    link.addEventListener('click', () => {
      activeLink = link;
    });
  });

  nav.addEventListener('mouseleave', () => moveIndicator(activeLink));
  window.addEventListener('resize', () => moveIndicator(activeLink), { passive: true });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const match = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
        if (!match) return;

        navLinks.forEach((link) => link.classList.remove('active'));
        match.classList.add('active');
        activeLink = match;
        moveIndicator(match);
      });
    },
    {
      threshold: NAV_THRESHOLD,
    }
  );

  sections.forEach((section) => observer.observe(section));
}
