import { initNavIndicator } from './modules/navIndicator.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initLazyMedia } from './modules/lazyMedia.js';
import { initGamesCarousel } from './modules/gamesCarousel.js';
import { initTestimonialsCarousel } from './modules/testimonialsCarousel.js';
import { initParallax } from './modules/parallax.js';
import { initMobileNav } from './modules/mobileNav.js';

function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('visible', window.scrollY > 400),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const bootstrap = () => {
  initNavIndicator();
  initScrollReveal();
  initGamesCarousel();
  initTestimonialsCarousel();
  initLazyMedia();
  initParallax();
  initMobileNav();
  initScrollTop();
};

document.addEventListener('DOMContentLoaded', bootstrap);
