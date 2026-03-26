/* FILE: sw.js
   VERSIONE: 1.0.0 (Ricorda di aumentare questo numero ogni volta che modifichi l'HTML o il CSS)
*/

const CACHE_NAME = 'global-finds-app-v1';

// I file di base che servono per far avviare l'app anche offline
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/browserconfig.xml'
];

// 1. INSTALLAZIONE: Il browser scarica i file base
self.addEventListener('install', event => {
    console.log('[SW] Installazione nuova versione in corso...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Forza l'attivazione immediata
});

// 2. ATTIVAZIONE: Elimina le versioni vecchie salvate sul telefono dell'utente
self.addEventListener('activate', event => {
    console.log('[SW] Attivazione e pulizia cache vecchie...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Vecchia cache eliminata:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. RECUPERO DATI (FETCH): Strategia Network-First
self.addEventListener('fetch', event => {
    // REGOLA D'ORO: Non salvare mai il video nella cache, altrimenti blocchi la memoria del telefono!
    if (event.request.url.includes('videoapp.mp4')) {
        return; 
    }

    event.respondWith(
        // Prova prima a scaricare i file freschi da internet
        fetch(event.request, { cache: 'no-store' }) 
            .then(networkResponse => {
                // Se c'è connessione, salva una copia aggiornata e mostrala all'utente
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Se l'utente è offline (es. in aereo), mostra la copia di emergenza salvata prima
                return caches.match(event.request);
            })
    );
});