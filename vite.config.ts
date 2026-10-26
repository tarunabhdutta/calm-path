import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the same build loads from file:// (Electron) and from the Capacitor WebView.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
  server: { host: '127.0.0.1' },
  test: { environment: 'node' },
} as any);
