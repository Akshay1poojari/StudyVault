// Service Worker for LearnAnywhere PWA
const CACHE_NAME = 'learn-anywhere-v1';
const OFFLINE_URL = '/offline.html';

// Resources to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png',
  '/src/index.css',
  '/src/App.css'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('learn-anywhere-') && cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // When fetch fails (offline), serve the offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For image requests, you could return a placeholder
            if (event.request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
            
            // Otherwise, just fail
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for storing failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Handle sync for progress data
async function syncProgress() {
  const db = await openDatabase();
  const tx = db.transaction('outbox', 'readonly');
  const store = tx.objectStore('outbox');
  
  const items = await store.getAll();
  
  for (const item of items) {
    try {
      // Here you would typically send data to your server
      console.log('Syncing data:', item);
      // If successful, remove from outbox
      const deleteTx = db.transaction('outbox', 'readwrite');
      const deleteStore = deleteTx.objectStore('outbox');
      await deleteStore.delete(item.id);
    } catch (err) {
      console.error('Sync failed for item', item.id, err);
      // Leave in outbox to try again later
    }
  }
}

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LearningApp', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('lessons')) {
        db.createObjectStore('lessons', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'lessonId' });
      }
      
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
