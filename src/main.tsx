import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from './lib/store';
import './styles.css';
import './motion.css';
import './games.css';
import '@fontsource-variable/nunito';
import { runSelfTest } from './selftest';

(window as any).__calmSelfTest = runSelfTest;

// Web version only (GitHub Pages): register the offline service worker.
// The PC app (file://) and the Android app (Capacitor) don't need it.
if ('serviceWorker' in navigator && location.protocol === 'https:' && !(window as any).Capacitor?.isNativePlatform?.() && !location.hash.includes('shoot')) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}

// A soft ripple on every tappable control: buttons feel alive under the finger.
document.addEventListener('pointerdown', (e) => {
  const el = (e.target as HTMLElement).closest('.btn, .tile, .chip, .quest, .counter, .land-card, .icon-pick button, .cups button, .tabs button') as HTMLElement | null;
  if (!el || (el as HTMLButtonElement).disabled) return;
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const dot = document.createElement('span');
  dot.className = 'ripple-dot';
  dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.appendChild(dot);
  window.setTimeout(() => dot.remove(), 650);
  if (navigator.vibrate) try { navigator.vibrate(6); } catch { /* not allowed */ }
}, { passive: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
