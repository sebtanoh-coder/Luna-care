// Utilitaires PWA pour LunaCare
// À placer dans src/utils/pwa.ts

// Vérifier si les notifications sont supportées
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Demander la permission pour les notifications
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Les notifications ne sont pas supportées');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Permission notifications:', permission);
    return permission;
  } catch (error) {
    console.error('Erreur demande permission:', error);
    return 'denied';
  }
}

// Envoyer une notification locale (sans serveur push)
export async function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupported()) {
    console.warn('Les notifications ne sont pas supportées');
    return;
  }

  if (Notification.permission !== 'granted') {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return;
    }
  }

  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification(title, {
    icon: '/icons/android-launchericon-192-192.png',
    badge: '/icons/72.png',
    vibrate: [200, 100, 200],
    ...options,
  });
}

// Background Sync
export async function registerBackgroundSync(tag: string = 'sync-data'): Promise<void> {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    console.warn('Background Sync non supporté');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log('Background Sync enregistré:', tag);
  } catch (error) {
    console.error('Erreur Background Sync:', error);
  }
}

// Periodic Background Sync (Chrome uniquement)
export async function registerPeriodicSync(
  tag: string = 'update-data',
  minInterval: number = 24 * 60 * 60 * 1000 // 24 heures par défaut
): Promise<void> {
  if (!('serviceWorker' in navigator) || !('periodicSync' in ServiceWorkerRegistration.prototype)) {
    console.warn('Periodic Background Sync non supporté');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    });

    if (status.state === 'granted') {
      await (registration as any).periodicSync.register(tag, {
        minInterval,
      });
      console.log('Periodic Background Sync enregistré:', tag);
    } else {
      console.warn('Permission refusée pour Periodic Background Sync');
    }
  } catch (error) {
    console.error('Erreur Periodic Background Sync:', error);
  }
}

// Écouter les messages du Service Worker
export function listenToServiceWorker(callback: (data: any) => void): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message du SW:', event.data);
    callback(event.data);
  });
}

// Forcer la mise à jour du Service Worker
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('Service Worker mis à jour');
  } catch (error) {
    console.error('Erreur mise à jour SW:', error);
  }
}

// Vérifier si l'app est installée
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

// Gérer l'événement beforeinstallprompt
export function setupInstallPrompt(): {
  canInstall: boolean;
  promptInstall: () => Promise<boolean>;
} {
  let deferredPrompt: any = null;
  let canInstall = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    canInstall = true;
    console.log('App peut être installée');
  });

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('Pas de prompt d\'installation disponible');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('Résultat installation:', outcome);
    
    deferredPrompt = null;
    canInstall = false;
    
    return outcome === 'accepted';
  };

  return { canInstall, promptInstall };
}

// Détecter si l'app est en ligne/hors ligne
export function setupOnlineStatus(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  const handleOnline = () => {
    console.log('App en ligne');
    onOnline();
  };

  const handleOffline = () => {
    console.log('App hors ligne');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Retourne une fonction de nettoyage
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Pré-charger des URLs dans le cache
export async function precacheURLs(urls: string[]): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({
      type: 'CACHE_URLS',
      urls,
    });
    console.log('URLs pré-chargées dans le cache');
  } catch (error) {
    console.error('Erreur pré-cache:', error);
  }
}

// Mesurer la performance de chargement
export function measurePerformance(): {
  loadTime: number;
  domReady: number;
  firstPaint: number | null;
} {
  const perfData = window.performance.timing;
  const loadTime = perfData.loadEventEnd - perfData.navigationStart;
  const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;
  
  let firstPaint: number | null = null;
  const paintEntries = performance.getEntriesByType('paint');
  const fpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fpEntry) {
    firstPaint = fpEntry.startTime;
  }

  return { loadTime, domReady, firstPaint };
}