const CACHE_NAME = "horneados-herrera-v9";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./inventario.html",
    "./ventas.html",
    "./historial.html",
    "./css/estilos.css",
    "./js/almacenamiento.js",
    "./js/inventario.js?v=6",
    "./js/ventas.js",
    "./js/historial.js",
    "./img/logo.png",
    "./img/logo-192.png",
    "./img/logo-512.png",
    "./manifest.json"
];

self.addEventListener("install", function(evento) {

    self.skipWaiting();

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(ARCHIVOS);
            })
    );

});

self.addEventListener("activate", function(evento) {

    evento.waitUntil(
        self.clients.claim()
    );

});

self.addEventListener("fetch", function(evento) {

    if (evento.request.mode === "navigate") {

        evento.respondWith(
            fetch(evento.request)
                .catch(function() {
                    return caches.match(evento.request);
                })
        );

        return;
    }

    evento.respondWith(
        caches.match(evento.request)
            .then(function(respuesta) {
                return respuesta || fetch(evento.request);
            })
    );

});