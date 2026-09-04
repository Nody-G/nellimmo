/* Nell'Immo Cockpit — Service Worker (offline-first app shell)
 *
 * Stratégie :
 *  - Navigations (HTML cockpit) : network-first avec repli cache (fonctionne hors-ligne
 *    une fois la page visitée).
 *  - Assets statiques (JS/CSS/Images) : cache-first avec mise à jour en arrière-plan.
 *  - Manifest / icônes : cache-first.
 *
 * Le cockpit étant une app Next.js rendue par serveur, on ne peut pas pré-cacher
 * toutes les pages à l'installation. On met en cache au fil de l'eau (runtime caching).
 */

const VERSION = 'nellimo-cockpit-v1';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

// Assets à pré-cacher dès l'installation (app shell minimal).
const PRECACHE_URLS = [
    '/manifest.json',
    '/favicon.png',
    '/logo.png',
    '/cockpit',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // Nettoyer les anciens caches de versions précédentes.
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key.startsWith('nellimo-cockpit-') && key !== STATIC_CACHE && key !== PAGE_CACHE)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Décider si une requête est une navigation (chargement d'une page HTML).
function isNavigationRequest(request) {
    return request.mode === 'navigate';
}

// Décider si une requête concerne l'API (jamais mise en cache).
function isApiRequest(url) {
    return url.pathname.startsWith('/api/');
}

// Décider si une requête est un asset statique (JS/CSS/Images/Fonts).
function isStaticAsset(url) {
    return (
        url.pathname.startsWith('/_next/static/') ||
        /\.(js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot)$/i.test(url.pathname)
    );
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ne pas intercepter les requêtes cross-origin ni les API.
    if (url.origin !== self.location.origin || isApiRequest(url)) {
        return;
    }

    // Navigations : network-first avec repli cache (offline).
    if (isNavigationRequest(request)) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Mettre en cache la copie réseau pour la prochaine fois (hors-ligne).
                    const copy = response.clone();
                    caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() =>
                    caches
                        .match(request)
                        .then((cached) => cached || caches.match('/cockpit'))
                )
        );
        return;
    }

    // Assets statiques : cache-first avec mise à jour en arrière-plan.
    if (isStaticAsset(url)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const networkFetch = fetch(request)
                    .then((response) => {
                        if (response && response.ok) {
                            const copy = response.clone();
                            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
                        }
                        return response;
                    })
                    .catch(() => cached);
                return cached || networkFetch;
            })
        );
        return;
    }

    // Autres requêtes same-origin : network-first avec repli cache.
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
