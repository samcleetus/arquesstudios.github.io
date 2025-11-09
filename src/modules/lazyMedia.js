const PLACEHOLDER_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function initLazyMedia() {
  const lazyImages = document.querySelectorAll('img[data-lazy]');
  if (!lazyImages.length) return;

  const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

  if (supportsNativeLazy) {
    lazyImages.forEach((img) => {
      img.loading = 'lazy';
      img.decoding = 'async';
      const actualSrc = img.dataset.src;
      if (actualSrc) {
        img.src = actualSrc;
        img.removeAttribute('data-src');
      }
    });
    return;
  }

  const lazyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const actualSrc = img.dataset.src;
        if (actualSrc) {
          img.src = actualSrc;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      });
    },
    {
      rootMargin: '200px 0px',
      threshold: 0.01,
    }
  );

  lazyImages.forEach((img) => {
    if (!img.dataset.src) return;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (!img.getAttribute('src')) {
      img.src = PLACEHOLDER_PIXEL;
    }
    lazyObserver.observe(img);
  });
}
