const NAV_THRESHOLD = 0.3;

export function initNavIndicator() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return undefined;

  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const indicator = nav.querySelector('.nav-indicator');

  if (!indicator || navLinks.length === 0) {
    return undefined;
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

  const linkHandlers = navLinks.map((link) => {
    const onMouseEnter = () => moveIndicator(link);
    const onFocus = () => moveIndicator(link);
    const onClick = () => {
      activeLink = link;
    };

    link.addEventListener('mouseenter', onMouseEnter);
    link.addEventListener('focus', onFocus);
    link.addEventListener('click', onClick);
    return { link, onMouseEnter, onFocus, onClick };
  });

  const onMouseLeave = () => moveIndicator(activeLink);
  const onResize = () => moveIndicator(activeLink);
  nav.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', onResize, { passive: true });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let observer;
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
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

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    linkHandlers.forEach(({ link, onMouseEnter, onFocus, onClick }) => {
      link.removeEventListener('mouseenter', onMouseEnter);
      link.removeEventListener('focus', onFocus);
      link.removeEventListener('click', onClick);
    });
    nav.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('resize', onResize);
    observer?.disconnect();
  };
}
