import { initNavIndicator } from './modules/navIndicator.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initLazyMedia } from './modules/lazyMedia.js';

const bootstrap = () => {
  initNavIndicator();
  initScrollReveal();
  initLazyMedia();
};

document.addEventListener('DOMContentLoaded', bootstrap);
