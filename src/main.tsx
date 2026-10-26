import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from './lib/store';
import './styles.css';
import '@fontsource-variable/nunito';
import { runSelfTest } from './selftest';

(window as any).__calmSelfTest = runSelfTest;

// Web version only (GitHub Pages): register the offline service worker.
// The PC app (file://) and the Android app (Capacitor) don't need it.
if ('serviceWorker' in navigator && location.protocol === 'https:' && !(window as any).Capacitor?.isNativePlatform?.() && !location.hash.includes('shoot')) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
);
