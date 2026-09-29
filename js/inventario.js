const productos = cargarProductos();
console.log("Productos cargados:", productos);
const formularioProducto = document.getElementById("formularioProducto");
const tablaProductos = document.getElementById("tablaProductos");
const buscador = document.getElementById("buscador");

function mostrarProductos(textoBusqueda = "") {

    tablaProductos.innerHTML = "";

    const texto = textoBusqueda.toLowerCase();
    
    productos.forEach(function(producto) {

        const nombre = producto.nombre.toLowerCase();
        const categoria = producto.categoria.toLowerCase();

        if (
            nombre.includes(texto) ||
            categoria.includes(texto)
        ) {
        
            let alertaStock = "Stock disponible";
            let claseEstado = "stock-disponible";

            if (producto.stock <= producto.stockMinimo) {
                alertaStock = "Stock bajo";
                claseEstado = "stock-bajo";
            }   
                
            tablaProductos.innerHTML +=`

                <tr>

                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.stockMinimo}</td>

                    <td class="${claseEstado}">
                        ${alertaStock}
                    </td>

                    <td>
                        <button class="boton-stock" onclick="agregarStock(${producto.id})">
                            + Stock
                        </button>
                        <button class="boton-editar" onclick="editarProducto(${producto.id})">
                            Editar
                        </button>
                        <button class="boton-eliminar" onclick="eliminarProducto(${producto.id})">
                            Eliminar
                        </button>
                    </td>

                </tr>

            `;
        }

    });
}




formularioProducto.addEventListener("submit", function(event) {
        event.preventDefault();
    
        const nombre=document.getElementById("nombre").value;
        const categoria=document.getElementById("categoria").value;
        const precio=Number(document.getElementById("precio").value);
        const stock=Number(document.getElementById("stock").value);
        const stockMinimo=Number(document.getElementById("stockMinimo").value);

        const nuevoId=obtenerNuevoId();

        const producto={
            id: nuevoId,
            nombre: nombre,
            categoria: categoria,
            precio: precio,
            stock: stock,
            stockMinimo: stockMinimo
        };

        productos.push(producto);
        guardarProductos(productos);
        mostrarProductos();
        formularioProducto.reset();
    }
);

function agregarStock(id) {
    const producto=productos.find(function(producto){
        return producto.id === id;
    });

    const cantidad=Number(
        prompt("¿Cuántas unidades deseas agregar?")
    );

    if (cantidad > 0) {
        producto.stock=producto.stock+cantidad;
        guardarProductos(productos);
        mostrarProductos();
        alert("Stock actualizado correctamente.")
    } else {
        alert("Ingresa cantidad mayor a 0.");
    }
}

function eliminarProducto(id) {
    const producto=productos.find(function(producto){
        return producto.id === id;
    });

    const confirmar=confirm(
        "Confirmar para eliminar el producto: " + producto.nombre
    );

    if (confirmar) {
        const indice=productos.findIndex(
            function(producto) {
                return producto.id === id;
            }
        );

    productos.splice(indice, 1);
    guardarProductos(productos);
    mostrarProductos();
    alert("Producto eliminado correctamente.");
    } 
}

function editarProducto(id){

    const producto = productos.find(function(producto){
        return producto.id === id;
    });

    const nuevoNombre = prompt(
        "Nombre del producto:",
        producto.nombre
    );

    if (nuevoNombre === null) {
        return;
    }

    if (nuevoNombre.trim() === "") {
        alert("El nombre no puede estar vacío.");
        return;
    }


    const nuevaCategoria = prompt(
        "Categoría:",
        producto.categoria
    );

    if (nuevaCategoria === null) {
        return;
    }

    if (nuevaCategoria.trim() === "") {
        alert("La categoría no puede estar vacía.");
        return;
    }


    const precioTexto = prompt(
        "Precio:",
        producto.precio
    );

    if (precioTexto === null) {
        return;
    }

    const nuevoPrecio = Number(precioTexto);

    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        alert("El precio debe ser un número válido mayor o igual a 0.");
        return;
    }


    const stockTexto = prompt(
        "Stock:",
        producto.stock
    );

    if (stockTexto === null) {
        return;
    }

    const nuevoStock = Number(stockTexto);

    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert("El stock debe ser un número válido mayor o igual a 0.");
        return;
    }


    const stockMinimoTexto = prompt(
        "Stock mínimo:",
        producto.stockMinimo
    );

    if (stockMinimoTexto === null) {
        return;
    }

    const nuevoStockMinimo = Number(stockMinimoTexto);

    if (isNaN(nuevoStockMinimo) || nuevoStockMinimo < 0) {
        alert("El stock mínimo debe ser un número válido mayor o igual a 0.");
        return;
    }


    producto.nombre = nuevoNombre.trim();
    producto.categoria = nuevaCategoria.trim();
    producto.precio = nuevoPrecio;
    producto.stock = nuevoStock;
    producto.stockMinimo = nuevoStockMinimo;

    guardarProductos(productos);
    mostrarProductos();

    alert("Producto actualizado correctamente.");
}


mostrarProductos();

window.addEventListener("storage", function(evento) {

    if (evento.key === "productos") {

        productos.length = 0;

        const productosActualizados = cargarProductos();

        productosActualizados.forEach(function(producto) {
            productos.push(producto);
        });

        mostrarProductos();
    }

});
