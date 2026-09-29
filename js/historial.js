const buscadorHistorial = 
    document.getElementById("buscadorHistorial");

const fechaDesde = 
    document.getElementById("fechaDesde");

const fechaHasta = 
    document.getElementById("fechaHasta");

const limpiarFiltros = 
    document.getElementById("limpiarFiltros");

let paginaActual = 1;

const ventasPorPagina = 20;

function calcularTotalPaginas(totalVentas) {

    return Math.ceil(totalVentas / ventasPorPagina);

}

function mostrarPaginacion(totalVentas) {

    const contenedor =
        document.getElementById("paginacionHistorial");

    const totalPaginas =
        calcularTotalPaginas(totalVentas);

    contenedor.innerHTML = "";

    if (totalPaginas <= 1) {
        return;
    }

    const botonAnterior = document.createElement("button");

    botonAnterior.textContent = "Anterior";

    botonAnterior.disabled = paginaActual === 1;

    botonAnterior.onclick = function() {

        paginaActual--;

        actualizarHistorial();

    };

    contenedor.appendChild(botonAnterior);

    const paginasVisibles = [];

    if (totalPaginas <= 7) {

        for (let i = 1; i <= totalPaginas; i++) {
            paginasVisibles.push(i);
        }

    } else {

        paginasVisibles.push(1);

        if (paginaActual > 4) {
            paginasVisibles.push("...");
        }

        let inicio = Math.max(2, paginaActual - 1);
        let fin = Math.min(totalPaginas - 1, paginaActual + 1);

        for (let i = inicio; i <= fin; i++) {
            paginasVisibles.push(i);
        }

        if (paginaActual < totalPaginas - 3) {
            paginasVisibles.push("...");
        }

        paginasVisibles.push(totalPaginas);
    }

    paginasVisibles.forEach(function(pagina) {

        if (pagina === "...") {

            const separador = document.createElement("span");

            separador.textContent = "...";

            contenedor.appendChild(separador);

            return;
        }

        const botonPagina = document.createElement("button");

        botonPagina.textContent = pagina;

        botonPagina.disabled = pagina === paginaActual;

        botonPagina.onclick = function() {

            paginaActual = pagina;

            actualizarHistorial();

        };

        contenedor.appendChild(botonPagina);

    });


    const botonSiguiente = document.createElement("button");

    botonSiguiente.textContent = "Siguiente";

    botonSiguiente.disabled = paginaActual === totalPaginas;

    botonSiguiente.onclick = function() {

        paginaActual++;

        actualizarHistorial();

    };

    contenedor.appendChild(botonSiguiente);

}

function obtenerVentasDePagina(historial) {

    const inicio = (paginaActual - 1) * ventasPorPagina;

    const fin = inicio + ventasPorPagina;

    return historial.slice(inicio, fin);

}


function cargarHistorial() {

    const ventasGuardadas =
        localStorage.getItem("historialVentas");

    if (ventasGuardadas) {

        return JSON.parse(ventasGuardadas);

    } else {

        return [];

    }

}


function obtenerVentasFiltradas(
    textoBusqueda = "",
    fechaInicio = "",
    fechaFin = ""
) {

    const historial =
        cargarHistorial();

    const texto =
        textoBusqueda.toLowerCase();


    return historial.filter(function(venta) {

        const folio =
            String(venta.folio).toLowerCase();


        const productoEncontrado =
            venta.productos.some(function(producto) {

                return producto.nombre
                    .toLowerCase()
                    .includes(texto);

            });


        const fechaVenta =
            convertirFecha(venta.fecha);


        const coincideFecha =
            (fechaInicio === "" ||
            fechaVenta >= fechaInicio)
            &&
            (fechaFin === "" ||
            fechaVenta <= fechaFin);


        return (
            (
                folio.includes(texto) ||
                productoEncontrado
            )
            &&
            coincideFecha
        );

    });
}

function mostrarResumen(
    textoBusqueda = "",
    fechaInicio = "",
    fechaFin = ""
) {

    const historial =
        obtenerVentasFiltradas(
            textoBusqueda,
            fechaInicio,
            fechaFin
        );

    const totalVentasHTML =
        document.getElementById("totalVentas");

    const totalIngresosHTML =
        document.getElementById("totalIngresos");

    const totalProductosHTML =
        document.getElementById("totalProductos");


    let totalIngresos = 0;

    let totalProductos = 0;


    historial.forEach(function(venta) {

        totalIngresos =
            totalIngresos + venta.total;


        venta.productos.forEach(function(producto) {

            totalProductos =
                totalProductos + producto.cantidad;

        });

    });


    totalVentasHTML.textContent =
        historial.length;

    totalIngresosHTML.textContent =
        "$" + totalIngresos.toFixed(2);

    totalProductosHTML.textContent =
        totalProductos;

}


function convertirFecha(fecha) {
    
    const partes = fecha.split("/");

    const dia = partes[0];
    const mes = partes[1];
    const año = partes[2];
    
    return año + "-" + mes + "-" + dia;
}

function actualizarHistorial() {

    const texto = buscadorHistorial.value;

    const desde = fechaDesde.value;

    const hasta = fechaHasta.value;

    mostrarHistorial(texto, desde, hasta);

}

function mostrarHistorial(
    textoBusqueda = "",
    fechaInicio = "",
    fechaFin = ""
) {

    const historial =
        obtenerVentasFiltradas(
            textoBusqueda,
            fechaInicio,
            fechaFin
        );

    const ventasPagina =  
        obtenerVentasDePagina(historial);

    mostrarPaginacion(historial.length);

    const historialHTML =
        document.getElementById("historialVentas");


    historialHTML.innerHTML = "";


    if (historial.length === 0) {

        historialHTML.innerHTML = `
            <p>No hay ventas registradas.</p>
        `;

        return;
    }


    let tablaHTML = `
        <div class="tabla-historial">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Pago</th>
                        <th>Cambio</th>
                    </tr>
                </thead>

                <tbody>
    `;

    ventasPagina.forEach(function(venta) {

        let productosHTML = "";

        venta.productos.forEach(function(producto) {

            productosHTML += `
                <div>
                    ${producto.nombre} -
                    ${producto.cantidad} x
                    $${producto.precio.toFixed(2)}
                </div>
            `;

        });

        tablaHTML += `
            <tr>

                <td>
                    #${venta.folio}
                </td>

                <td>
                    ${venta.fecha}
                </td>

                <td>
                    ${venta.hora}
                </td>

                <td>
                    ${productosHTML}
                </td>

                <td>
                    $${venta.total.toFixed(2)}
                </td>

                <td>
                    $${venta.pago.toFixed(2)}
                </td>

                <td>
                    $${venta.cambio.toFixed(2)}
                </td>

            </tr>
        `;

    });

    tablaHTML += `
                </tbody>
            </table>
        </div>
    `;

    historialHTML.innerHTML = tablaHTML;

}

buscadorHistorial.addEventListener("input", function() {

    paginaActual = 1;

    const texto =
        buscadorHistorial.value;
    
    const desde = 
        fechaDesde.value;
    
    const hasta =
        fechaHasta.value;
    
    mostrarHistorial(
        texto,
        desde,
        hasta
    );

    mostrarResumen(
        texto,
        desde,
        hasta
    );

});


fechaDesde.addEventListener("change", function() {

    paginaActual = 1;

    const texto = 
        buscadorHistorial.value;

    const desde = 
        fechaDesde.value;

    const hasta = 
        fechaHasta.value;

    mostrarHistorial(
        texto,
        desde,
        hasta
    );

    mostrarResumen(
        texto,
        desde,
        hasta
    );

});


fechaHasta.addEventListener("change", function() {

    paginaActual = 1;

    const texto = 
        buscadorHistorial.value;

    const desde = 
        fechaDesde.value;

    const hasta = 
        fechaHasta.value;

    mostrarHistorial(
        texto,
        desde,
        hasta
    );

    mostrarResumen(
        texto,
        desde,
        hasta
    );

});


limpiarFiltros.addEventListener("click", function() {

    paginaActual = 1;

    buscadorHistorial.value = "";

    fechaDesde.value = "";

    fechaHasta.value = "";

    mostrarHistorial();

    mostrarResumen();

});




mostrarResumen();
mostrarHistorial();