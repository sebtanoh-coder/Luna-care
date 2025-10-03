import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      // On utilise le manifest.json à la racine
      manifest: false,
      // Désactiver l'injection automatique car on utilise sw-custom.js
      injectRegister: false,
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw-custom.js',
      workbox: {
        // Configuration Workbox pour le build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
    }),
  ],
  build: {
    // Optimisations pour PWA
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});