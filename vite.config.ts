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
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        // Pré-cache de tous les assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        // Stratégies de cache avancées
        runtimeCaching: [
          // Images - Cache First
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API Supabase - Network First
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
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Assets statiques - Stale While Revalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
              },
            },
          },
          // CDN - Stale While Revalidate
          {
            urlPattern: /^https:\/\/cdn\..*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
              },
            },
          },
        ],
        // Navigation fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
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