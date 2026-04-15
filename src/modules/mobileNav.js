export function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('[data-nav]');
  const content = document.getElementById('site-content');
  if (!toggle || !nav) return undefined;

  const navLinks = Array.from(nav.querySelectorAll('a'));
  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocusedElement = null;

  const open = () => {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
    if (content) {
      content.inert = true;
      content.setAttribute('aria-hidden', 'true');
    }

    const firstFocusable = nav.querySelector(focusableSelector);
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  };

  const close = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    if (content) {
      content.inert = false;
      content.removeAttribute('aria-hidden');
    }

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    } else {
      toggle.focus();
    }
    lastFocusedElement = null;
  };

  const onToggleClick = () => {
    nav.classList.contains('is-open') ? close() : open();
  };

  const onNavLinkClick = () => close();

  const onKeyDown = (e) => {
    if (!nav.classList.contains('is-open')) return;

    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      toggle.focus();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusableElements = Array.from(nav.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled')
    );
    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onResize = () => {
    if (window.innerWidth > 900 && nav.classList.contains('is-open')) {
      close();
    }
  };

  toggle.addEventListener('click', onToggleClick);
  navLinks.forEach((link) => link.addEventListener('click', onNavLinkClick));
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    if (nav.classList.contains('is-open')) close();
    toggle.removeEventListener('click', onToggleClick);
    navLinks.forEach((link) => link.removeEventListener('click', onNavLinkClick));
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onResize);
  };
}
