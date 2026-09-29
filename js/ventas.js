const productos=cargarProductos();
const carrito=[];
const listaProductos=document.getElementById("listaProductos");
const buscadorProductos=document.getElementById("buscadorProductos");
const carritoHTML=document.getElementById("carrito");
const totalHTML=document.getElementById("total");
const botonFinalizar=document.getElementById("finalizarVenta");
const pagoClienteHTML=document.getElementById("pagoCliente");
const cambioHTML=document.getElementById("cambio");
const ticketHTML=document.getElementById("ticket");
const imprimirTicketHTML=document.getElementById("imprimirTicket");

function mostrarProductosDisponibles(textoBusqueda = "") {

    listaProductos.innerHTML = "";

    const texto = textoBusqueda.toLowerCase();

    let productosEncontrados = 0;

    productos.forEach(function(producto) {

        if (
            producto.stock > 0 &&
            (
                producto.nombre
                    .toLowerCase()
                    .includes(texto)
                ||
                producto.categoria
                    .toLowerCase()
                    .includes(texto)
            )
        ) {

            productosEncontrados++;

            listaProductos.innerHTML += `
                <div class="tarjeta-producto">

                    <div class="informacion-producto">

                        <h3>${producto.nombre}</h3>

                        <p class="categoria-producto">
                            ${producto.categoria}
                        </p>

                    </div>

                    <div class="datos-producto">

                        <strong class="precio-producto">
                            $${producto.precio.toFixed(2)}
                        </strong>

                        <span class="stock-producto">
                            Stock: ${producto.stock}
                        </span>

                    </div>

                    <button
                        class="boton-agregar"
                        onclick="agregarAlCarrito(${producto.id})"
                    >
                        Agregar
                    </button>

                </div>
            `;
        }
    });

    if (productosEncontrados === 0) {

        listaProductos.innerHTML = `
            <p class="sin-productos">
                No se encontraron productos disponibles.
            </p>
        `;
    }
}

function agregarAlCarrito(id) {
    const producto=productos.find(function(producto){
        return producto.id === id;
    });

    const productoEnCarrito=carrito.find(
        function(item) {
            return item.id === id;
        }
    );

    if (productoEnCarrito) {
        if (
            productoEnCarrito.cantidad < producto.stock
        ) {
            productoEnCarrito.cantidad++;
        } else {
            alert(
                "No hay suficiente stock disponible"
            );
            return;
        }
    } else {
        if (producto.stock > 0){
            const nuevoProductoCarrito={
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad:1
            };
            carrito.push(nuevoProductoCarrito);
        } else {
            alert(
                "Este producto no tiene stock disponible"
            );
            return;
        }
    }

    console.log(carrito);
    mostrarCarrito();
}

function mostrarCarrito() {

    carritoHTML.innerHTML="";


    if (carrito.length === 0) {

        carritoHTML.innerHTML=`
            <p class="carrito-vacio">
                El carrito está vacío.
            </p>
        `;

        totalHTML.textContent="$0.00";

        return;
    }


    let total=0;


    carrito.forEach(function(item) {

        const subtotal=
            item.precio * item.cantidad;

        total=
            total + subtotal;


        carritoHTML.innerHTML += `

            <div class="producto-carrito">


                <div class="encabezado-producto-carrito">

                    <h3>
                        ${item.nombre}
                    </h3>

                    <span class="precio-carrito">
                        $${item.precio.toFixed(2)}
                    </span>

                </div>


                <div class="controles-carrito">


                    <button
                        class="boton-cantidad"
                        onclick="disminuirCantidad(${item.id})"
                    >
                        −
                    </button>


                    <span class="cantidad-producto">
                        ${item.cantidad}
                    </span>


                    <button
                        class="boton-cantidad"
                        onclick="aumentarCantidad(${item.id})"
                    >
                        +
                    </button>


                </div>


                <div class="pie-producto-carrito">

                    <span>
                        Subtotal:
                    </span>

                    <strong>
                        $${subtotal.toFixed(2)}
                    </strong>

                </div>


                <button
                    class="boton-quitar"
                    onclick="quitarDelCarrito(${item.id})"
                >
                    Quitar
                </button>


            </div>

        `;

    });


    totalHTML.textContent=
        "$" + total.toFixed(2);

}

function aumentarCantidad(id) {
    const productoEnCarrito=carrito.find(
        function(item) {
            return item.id === id;
        }
    );

    const producto=productos.find(
        function(producto) {
            return producto.id === id;
        }
    );

    if (productoEnCarrito.cantidad < producto.stock) {
        productoEnCarrito.cantidad++;
        mostrarCarrito();
    } else {
        alert("No hay suficiente stock disponible.");
    }
}

function disminuirCantidad(id) {
    const productoEnCarrito=carrito.find(
        function(item) {
            return item.id === id;
        }
    );

    productoEnCarrito.cantidad--;
    if (productoEnCarrito.cantidad === 0) {
        quitarDelCarrito(id);
        return;
    }

    mostrarCarrito();

}

function quitarDelCarrito(id) {
    const indice=carrito.findIndex(
        function(item) {
            return item.id === id;
        }
    );
    carrito.splice(indice,1);
    mostrarCarrito();
}


function guardarVenta(
    folio,
    fecha,
    hora,
    total,
    pago,
    cambio,
) {
    
    let historial = 
        localStorage.getItem("historialVentas");

    if (historial) {

        historial = JSON.parse(historial);
    
    } else {

        historial = [];

    }

    const productosVendidos = carrito.map(function(item) {
            
            return {
                    
                id: item.id,

                nombre: item.nombre,

                precio: item.precio,

                cantidad: item.cantidad,

            };

        });

    const venta = {

        folio: folio,

        fecha: fecha,

        hora: hora,

        productos: productosVendidos,

        total: total,

        pago: pago,

        cambio: cambio

    };

    historial.push(venta);

    localStorage.setItem(
        "historialVentas",
        JSON.stringify(historial)
    );
}


function finalizarVenta() {
    if(carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let total=0;
    carrito.forEach(function(item){
        total += item.precio*item.cantidad;
    });

    const pago=Number(pagoClienteHTML.value);
    if (!pago || pago <=0) {
        alert(
            "Ingresa la cantidad recibida del cliente."
        );
        return;
    }

    if (pago < total) {
        alert(
            "El pago es insuficiente."
        );
        return;
    }

    const cambio=pago-total;

    const confirmar=confirm(
        "¿Deseas finalizar la venta?\n\n" +
        "Total: $" + total.toFixed(2) + "\n" +
        "Pago: $" + pago.toFixed(2) + "\n" +
        "Cambio: $" + cambio.toFixed(2)
    );
    
    if (!confirmar) {
        return;
    }

    const folio = 
        obtenerNuevoFolio()
        .toString()
        .padStart(6, "0");
    
    const fechaActual = new Date();

    const fecha = 
        fechaActual.toLocaleDateString(
            "es-mx",    
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    const hora =
        fechaActual.toLocaleTimeString(
            "es-mx",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


const productosActualizados = cargarProductos();

for (let i = 0; i < carrito.length; i++) {

    const item = carrito[i];

    const producto = productosActualizados.find(
        function(producto) {
            return producto.id === item.id;
        }
    );

    if (!producto) {
        alert(
            "El producto \"" + item.nombre +
            "\" ya no existe en el inventario."
        );
        return;
    }

    if (producto.stock < item.cantidad) {
        alert(
            "No hay suficiente stock de \"" +
            producto.nombre +
            "\".\n\n" +
            "Stock actual: " + producto.stock +
            "\nCantidad solicitada: " + item.cantidad
        );
        return;
    }
}

for (let i = 0; i < carrito.length; i++) {

    const item = carrito[i];

    const producto = productosActualizados.find(
        function(producto) {
            return producto.id === item.id;
        }
    );

    producto.stock = producto.stock - item.cantidad;
}

productos.length = 0;

productosActualizados.forEach(function(producto) {
    productos.push(producto);
});

guardarProductos(productos);

    guardarVenta(
        folio,
        fecha,
        hora,
        total,
        pago,
        cambio
    );

    mostrarTicket(
        total,
        pago,
        cambio,
        folio,
        fecha,
        hora
    );

    carrito.length=0;
    pagoClienteHTML.value="";
    cambioHTML.textContent="0.00";
    mostrarProductosDisponibles();
    mostrarCarrito();

    alert(
        "¡Venta realizada correctamente!\n\n" +
        "Total: $" + total.toFixed(2) + "\n" +
        "Pago: $" + pago.toFixed(2) + "\n" +
        "Cambio: $" + cambio.toFixed(2)
    );

}

botonFinalizar.addEventListener(
    "click",
    finalizarVenta
);

function calcularCambio() {
    let total = 0;

    carrito.forEach(function(item) {
        total += item.precio * item.cantidad;
    });

    const pago =
        Number(pagoClienteHTML.value);

    const cambio =
        pago - total;

    if (cambio >= 0) {

        cambioHTML.textContent =
            cambio.toFixed(2);

    } else {

        cambioHTML.textContent =
            "0.00";
    }
}

pagoClienteHTML.addEventListener(
    "input",
    calcularCambio
);



function obtenerNuevoFolio() {

    let ultimoFolio=
        localStorage.getItem("ultimoFolio");
    if(ultimoFolio===null) {
        ultimoFolio=0;
    } else {
        ultimoFolio=Number(ultimoFolio);
    }
    ultimoFolio++;
    localStorage.setItem(
        "ultimoFolio",
        ultimoFolio
    );
    return ultimoFolio;
}


function mostrarTicket(
    total, 
    pago, 
    cambio,
    folio,
    fecha,
    hora
) {

    let contenidoTicket="";
    contenidoTicket+= `

        <div class="encabezado-ticket">

            <h3>🥐 Horneados Herrera<h3>
            <hr>
            <p>TICKET DE VENTA</p>
            <p>
                <strong>Folio:</strong>
                ${folio}
            </p>

            <p>
                <strong>Fecha:</strong>
                ${fecha}
            </p>

            <p>
                <strong>Hora:</strong>
                ${hora}
            </p>

            <hr>

        </div>


    `;
    carrito.forEach(function(item) {
        const subtotal=item.precio*item.cantidad;
        contenidoTicket+=`
            <div class="producto-ticket">

                <p>
                    <strong>
                        ${item.nombre}
                    </strong>
                </p>

                <p>
                    ${item.cantidad} x
                    $${item.precio.toFixed(2)}

                    <span>
                        $${subtotal.toFixed(2)}
                    </span>
                </p>
            </div>
        `;
    });

    contenidoTicket += `
        <hr>
        <div class="totales-ticket">

            <p>
                <strong>
                    TOTAL: $${total.toFixed(2)}
                </strong>
            </p>

            <p>
                PAGO: $${pago.toFixed(2)}
            </p>

            <p>
                CAMBIO: $${cambio.toFixed(2)}
            </p>

        </div>

        <hr>

        <div class="pie-ticket">

            <p>
                <strong>
                    ¡Gracias por su compra!
                </strong>
            </p>

            <p>
                Horneados Herrera
            </p>

        </div>
        
    `;

    ticketHTML.innerHTML=
        contenidoTicket;
    
}

imprimirTicketHTML.addEventListener(
    "click",
    function() {
        window.print();
    }
);


buscadorProductos.addEventListener(
    "input",
    function() {

        const texto = 
            buscadorProductos.value;
        
        mostrarProductosDisponibles(
            texto
        );

    }
)

mostrarProductosDisponibles();
mostrarCarrito();

window.addEventListener("storage", function(evento) {

    if (evento.key === "productos") {

        productos.length = 0;

        const productosActualizados = cargarProductos();

        productosActualizados.forEach(function(producto) {
            productos.push(producto);
        });

        for (let i = carrito.length - 1; i >= 0; i--) {

            const productoExiste = productos.find(function(producto) {
                return producto.id === carrito[i].id;
            });

            if (!productoExiste) {
                carrito.splice(i, 1);
            }
        }

        mostrarProductosDisponibles();
        mostrarCarrito();
    }

});