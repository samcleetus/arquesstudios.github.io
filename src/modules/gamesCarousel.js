const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TRANSITION_MS = 420;
const SWIPE_THRESHOLD = 48;

function createClone(card) {
  const clone = card.cloneNode(true);
  clone.dataset.carouselClone = 'true';
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((element) => {
    element.setAttribute('tabindex', '-1');
  });
  return clone;
}

function getSlideTarget(viewport, slide) {
  return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
}

export function initGamesCarousel() {
  const viewport = document.querySelector('[data-games-carousel]');
  if (!viewport) return;
  if (viewport.dataset.carouselInitialized === 'true') return;
  viewport.dataset.carouselInitialized = 'true';

  const realCards = Array.from(viewport.querySelectorAll('[data-carousel-card]'));
  if (realCards.length === 0) return;

  const prevButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');

  if (realCards.length === 1) {
    realCards[0].classList.add('is-center');
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
    return;
  }

  const track = document.createElement('div');
  track.className = 'games-carousel-track';

  realCards.forEach((card) => track.append(card));
  track.insertBefore(createClone(realCards[realCards.length - 1]), track.firstChild);
  track.append(createClone(realCards[0]));
  viewport.append(track);

  const slides = Array.from(track.querySelectorAll('[data-carousel-card]'));
  const firstRealIndex = 1;
  const lastRealIndex = realCards.length;
  let currentIndex = firstRealIndex;
  let slideTargets = [];
  let isAnimating = false;
  let queuedDelta = 0;
  let resizeRafId = 0;

  const setTransform = (index, animate) => {
    const target = slideTargets[index];
    if (typeof target !== 'number') return;
    track.style.transition = animate && !prefersReducedMotion
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : 'none';
    track.style.transform = `translate3d(${-target}px, 0, 0)`;
  };

  const applyCenterClass = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-center', index === currentIndex);
    });
  };

  const measure = () => {
    slideTargets = slides.map((slide) => getSlideTarget(viewport, slide));
  };

  const scheduleMeasure = () => {
    if (resizeRafId) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = 0;
      measure();
      setTransform(currentIndex, false);
    });
  };

  const jumpToMatchingRealIfNeeded = () => {
    let jumpIndex = currentIndex;

    if (currentIndex === 0) {
      jumpIndex = lastRealIndex;
    } else if (currentIndex === realCards.length + 1) {
      jumpIndex = firstRealIndex;
    }

    if (jumpIndex !== currentIndex) {
      currentIndex = jumpIndex;
      setTransform(currentIndex, false);
      applyCenterClass();
    }
  };

  const goTo = (nextIndex, animate) => {
    currentIndex = nextIndex;
    setTransform(currentIndex, animate);
    applyCenterClass();
    isAnimating = animate && !prefersReducedMotion;
  };

  const moveBy = (delta) => {
    if (isAnimating) {
      queuedDelta = delta;
      return;
    }
    goTo(currentIndex + delta, true);
    if (prefersReducedMotion) {
      jumpToMatchingRealIfNeeded();
    }
  };

  track.addEventListener('transitionend', (event) => {
    if (event.target !== track || event.propertyName !== 'transform') return;
    isAnimating = false;
    jumpToMatchingRealIfNeeded();

    if (queuedDelta !== 0) {
      const nextDelta = queuedDelta;
      queuedDelta = 0;
      moveBy(nextDelta);
    }
  });

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveBy(-1);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;
  viewport.addEventListener(
    'touchstart',
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchend',
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      moveBy(deltaX < 0 ? 1 : -1);
    },
    { passive: true }
  );

  viewport.addEventListener('click', (event) => {
    const card = event.target.closest('[data-carousel-card]');
    if (!card || !viewport.contains(card)) return;
    if (event.target.closest('a, button')) return;
    if (isAnimating) return;

    const cardIndex = slides.indexOf(card);
    if (cardIndex < 0 || cardIndex === currentIndex) return;
    goTo(cardIndex, true);
    if (prefersReducedMotion) {
      jumpToMatchingRealIfNeeded();
    }
  });

  window.addEventListener('resize', scheduleMeasure, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => {
      scheduleMeasure();
    }).observe(viewport);
  }

  if (prevButton) {
    prevButton.disabled = false;
    prevButton.addEventListener('click', () => moveBy(-1));
  }

  if (nextButton) {
    nextButton.disabled = false;
    nextButton.addEventListener('click', () => moveBy(1));
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      measure();
      goTo(firstRealIndex, false);
    });
  });
}
