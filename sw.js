/* VERSIONE: 1.0.2
   (Ogni volta che modifichi il sito, cambia questo numero per forzare l'aggiornamento sui telefoni)
*/

const CACHE_NAME = 'global-finds-v1.0.2';

// File essenziali da salvare subito
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

// 1. INSTALLAZIONE: Salvataggio file base
self.addEventListener('install', event => {
    console.log('[SW] Installazione in corso...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); 
});

// 2. ATTIVAZIONE: Pulizia vecchie versioni
self.addEventListener('activate', event => {
    console.log('[SW] Attivazione e pulizia cache...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. GESTIONE RICHIESTE (FETCH)
self.addEventListener('fetch', event => {
    // Escludi video e file pesanti per non intasare la memoria
    if (event.request.url.match(/\.(mp4|webm|ogg|wav|mp3)$/i)) {
        return; 
    }

    // Solo richieste GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Se internet funziona, aggiorna la cache e restituisci il file
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Se internet NON funziona, prova a pescare dalla cache
                return caches.match(event.request).then(response => {
                    return response || new Response("Sei offline e questa pagina non è salvata.", {
                        status: 503,
                        statusText: "Service Unavailable"
                    });
                });
            })
    );
});