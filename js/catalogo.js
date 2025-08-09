export function renderCatalogo(productos, catalogoContainer, agregarCallback) {
    catalogoContainer.innerHTML = "";
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Disponible: ${producto.cantidad}</p>
            <button class="agregar" data-id="${producto.id}">Agregar al carrito</button>`;
        catalogoContainer.appendChild(card);
    });

    catalogoContainer.addEventListener("click", e => {
        if (e.target.classList.contains("agregar")) {
            const id = parseInt(e.target.dataset.id);
            agregarCallback(id);
        }
    });
}
