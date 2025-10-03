// Service Worker personnalisé pour LunaCare
// À placer dans /public/sw-custom.js

const CACHE_VERSION = 'lunacare-v1';
const CACHE_ASSETS = 'assets-v1';
const CACHE_IMAGES = 'images-v1';
const CACHE_API = 'api-v1';

// Assets essentiels à mettre en cache immédiatement
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Installation : pré-cache des assets essentiels
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_ASSETS).then((cache) => {
      console.log('[SW] Pré-cache des assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_ASSETS && 
                   name !== CACHE_IMAGES && 
                   name !== CACHE_API;
          })
          .map((name) => {
            console.log('[SW] Suppression cache obsolète:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache intelligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API Supabase : Network First avec fallback cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirstStrategy(request, CACHE_API));
    return;
  }

  // Images : Cache First
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, CACHE_IMAGES));
    return;
  }

  // Assets (JS, CSS) : Cache First avec mise à jour en arrière-plan
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(staleWhileRevalidate(request, CACHE_ASSETS));
    return;
  }

  // HTML : Network First
  if (request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request, CACHE_ASSETS));
    return;
  }

  // Par défaut : Network First
  event.respondWith(fetch(request));
});

// Stratégie Cache First
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Erreur fetch:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background Sync : synchronisation des données en attente
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  try {
    // Récupérer les données en attente depuis IndexedDB
    // Cette partie sera gérée par votre application
    console.log('[SW] Synchronisation des données en attente...');
    
    // Notifier l'application que la sync est terminée
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        success: true,
      });
    });
  } catch (error) {
    console.error('[SW] Erreur sync:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification reçue');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LunaCare';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icons/android-launchericon-192-192.png',
    badge: '/icons/72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
      },
      {
        action: 'close',
        title: 'Fermer',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification cliquée:', event.action);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Si l'app est déjà ouverte, la focus
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Sinon, ouvrir une nouvelle fenêtre
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Periodic Background Sync (si supporté)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic Background Sync:', event.tag);
  
  if (event.tag === 'update-data') {
    event.waitUntil(updateDataPeriodically());
  }
});

async function updateDataPeriodically() {
  try {
    console.log('[SW] Mise à jour périodique des données...');
    // Logique de mise à jour périodique
  } catch (error) {
    console.error('[SW] Erreur mise à jour périodique:', error);
  }
}

// Message depuis l'application
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_ASSETS).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
});