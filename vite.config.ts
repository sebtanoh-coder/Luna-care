import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      // Ne pas générer de manifest, on utilise le /manifest.json à la racine
      injectManifest: {
        injectionPoint: undefined,
      },
      // Désactiver la génération automatique du manifest
      manifest: false,
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        // Pré-cache des assets essentiels
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          // Cache des assets statiques
          {
            urlPattern: /^\/.*\.(js|css|html|png|svg|ico|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          // Cache des images
          {
            urlPattern: /\.(jpg|jpeg|png|gif|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          // API calls avec NetworkFirst
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 heure
              },
            },
          },
        ],
      },
    }),
  ],
});