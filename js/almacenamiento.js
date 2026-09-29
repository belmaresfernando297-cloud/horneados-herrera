function guardarProductos(productos) {
    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
}

function cargarProductos() {
    const productosGuardados =
        localStorage.getItem("productos");
    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    } else {
        return[];
    }
}

function obtenerNuevoId() {
    let ultimoId=localStorage.getItem("ultimoId");
    if (ultimoId === null) {
        const productos=cargarProductos();
        if(productos.length === 0) {
            ultimoId=0;
    } else {
        ultimoId=Math.max(
            ...productos.map(function(producto){
                return producto.id;
            })
        );
    }
        
    } else {
        ultimoId=Number(ultimoId);
    }
    ultimoId++;
    localStorage.setItem(
        "ultimoId",
        ultimoId
    );

    return ultimoId;

}