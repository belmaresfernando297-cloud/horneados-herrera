const CACHE_NAME = "horneados-herrera-v3";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./inventario.html",
    "./ventas.html",
    "./historial.html",
    "./css/estilos.css",
    "./js/almacenamiento.js",
    "./js/inventario.js",
    "./js/ventas.js",
    "./js/historial.js",
    "./img/logo.png",
    "./img/logo-192.png",
    "./img/logo-512.png",
    "./manifest.json"
];

self.addEventListener("install", function(evento) {

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(ARCHIVOS);
            })
    );

});

self.addEventListener("fetch", function(evento) {

    evento.respondWith(
        caches.match(evento.request)
            .then(function(respuesta) {
                return respuesta || fetch(evento.request);
            })
    );

});