import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import App from './App.jsx';
import './styles/main.css';

function applyPerformanceMode() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const saveData = navigator.connection?.saveData === true;
  const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;

  if (reducedMotion || coarsePointer || saveData || lowCpu) {
    document.documentElement.classList.add('perf-lite');
  }
}

applyPerformanceMode();
createRoot(document.getElementById('root')).render(createElement(App));
