export function activarFiltro(productos, catalogo, callback) {
    const filtroCategoria = document.getElementById("filtro-categoria");

    filtroCategoria.addEventListener("change", e => {
        const categoria = e.target.value;
        const productosFiltrados = categoria === "todos"
            ? productos
            : productos.filter(p => p.categoria === categoria);

        callback(productosFiltrados);
    });
}

