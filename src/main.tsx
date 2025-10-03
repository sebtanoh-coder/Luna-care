import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Enregistrer le SW personnalisé
    navigator.serviceWorker
      .register('/sw-custom.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker enregistré:', registration.scope);

        // Vérifier les mises à jour toutes les heures
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.error('❌ Erreur Service Worker:', error);
      });
  });
}

// Écouter les messages du Service Worker
listenToServiceWorker((data) => {
  if (data.type === 'SYNC_COMPLETE') {
    console.log('Synchronisation terminée');
    // Vous pouvez émettre un événement personnalisé ici
    window.dispatchEvent(new CustomEvent('sync-complete', { detail: data }));
  }
});

// Gérer le statut en ligne/hors ligne
setupOnlineStatus(
  () => {
    console.log('Application en ligne');
    document.body.classList.remove('offline');
    // Vous pouvez afficher un toast ou une notification
  },
  () => {
    console.log('Application hors ligne');
    document.body.classList.add('offline');
    // Vous pouvez afficher un toast ou une notification
  }
);

// Log si l'app est installée
if (isPWAInstalled()) {
  console.log('🎉 Application installée en mode PWA');
}

// Mesurer les performances au chargement
window.addEventListener('load', () => {
  setTimeout(() => {
    const perf = measurePerformance();
    console.log('Performance:', {
      'Temps de chargement': `${perf.loadTime}ms`,
      'DOM Ready': `${perf.domReady}ms`,
      'First Paint': perf.firstPaint ? `${perf.firstPaint}ms` : 'N/A',
    });
  }, 0);
});

// Rendu de l'application React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);