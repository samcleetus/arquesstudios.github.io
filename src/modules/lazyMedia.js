const PLACEHOLDER_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const ROOT_MARGIN = '280px 0px';

function hydrateImage(img) {
  const actualSrc = img.dataset.src;
  if (!actualSrc) return;
  img.src = actualSrc;
  img.removeAttribute('data-src');
}

export function initLazyMedia() {
  const lazyImages = Array.from(document.querySelectorAll('img[data-lazy]'));
  if (!lazyImages.length) {
    return;
  }

  lazyImages.forEach((img) => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  if (typeof IntersectionObserver === 'undefined') {
    lazyImages.forEach((img) => {
      hydrateImage(img);
    });
    return;
  }

  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      hydrateImage(img);
      observer.unobserve(img);
    });
  }, {
    rootMargin: ROOT_MARGIN,
    threshold: 0.01,
  });

  const preloadCutoff = window.innerHeight * 1.1;

  lazyImages.forEach((img) => {
    if (!img.dataset.src) return;

    const isNearViewport = img.getBoundingClientRect().top <= preloadCutoff;
    if (isNearViewport) {
      hydrateImage(img);
      return;
    }

    if (!img.getAttribute('src')) {
      img.src = PLACEHOLDER_PIXEL;
    }
    lazyObserver.observe(img);
  });
}
