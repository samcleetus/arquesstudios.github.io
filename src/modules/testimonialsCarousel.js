const TRANSITION_MS = 420;
const AUTO_DELAY = 3500;

function getPerView() {
  const w = window.innerWidth;
  if (w >= 900) return 3;
  if (w >= 620) return 2;
  return 1;
}

export function initTestimonialsCarousel() {
  const viewport = document.querySelector('[data-testimonials]');
  if (!viewport) return;

  const cards = Array.from(viewport.querySelectorAll('[data-testimonial-card]'));
  if (cards.length === 0) return;

  const prevBtn = document.querySelector('[data-testimonials-prev]');
  const nextBtn = document.querySelector('[data-testimonials-next]');
  const dotsWrap = document.querySelector('[data-testimonials-dots]');

  const track = document.createElement('div');
  track.className = 'testimonials-track';
  cards.forEach(c => track.append(c));
  viewport.append(track);

  let current = 0;
  let autoTimer = null;
  let perView = getPerView();

  const dots = [];
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonials-dot';
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      dotsWrap.append(dot);
      dots.push(dot);
    });
  }

  function setCardWidths() {
    perView = getPerView();
    const vw = viewport.clientWidth;
    const gapPx = parseFloat(getComputedStyle(track).columnGap) || 24;
    const cardWidth = (vw - gapPx * (perView - 1)) / perView;
    cards.forEach(c => { c.style.flex = `0 0 ${cardWidth}px`; });
    return { cardWidth, gapPx };
  }

  function clampIndex(idx) {
    return Math.max(0, Math.min(idx, cards.length - getPerView()));
  }

  function updateControls() {
    const max = cards.length - getPerView();
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= max;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  function goTo(idx, animate = true) {
    current = clampIndex(idx);
    const { cardWidth, gapPx } = setCardWidths();
    const offset = current * (cardWidth + gapPx);
    track.style.transition = animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none';
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    updateControls();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const max = cards.length - getPerView();
      goTo(current >= max ? 0 : current + 1);
    }, AUTO_DELAY);
  }

  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; stopAuto(); }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 48) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    startAuto();
  }, { passive: true });

  window.addEventListener('resize', () => { goTo(current, false); });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      goTo(0, false);
      startAuto();
    });
  });
}
