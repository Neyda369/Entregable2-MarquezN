// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos clave del DOM
    const catalogo = document.getElementById("product-list");
    const carritoLista = document.getElementById("carrito-lista");
    const btnFinalizar = document.getElementById("finalizar-compra");
    const totalCarrito = document.getElementById("total-carrito");

    // Cargamos el carrito desde localStorage o lo iniciamos vacío
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Cargamos los productos desde el archivo JSON
    fetch("productos.json")
        .then(res => res.json())
        .then(productos => {
            // Renderizamos cada producto como una tarjeta
            productos.forEach(producto => {
                const card = document.createElement("div");
                card.classList.add("producto-card");

                card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Disponible: ${producto.cantidad}</p>
            <button class="agregar" data-id="${producto.id}">Agregar al carrito</button>        `;

                catalogo.appendChild(card);
            });

            // Filtro por categoría
            const filtro = document.getElementById("filtro-categoria");

            filtro.addEventListener("change", () => {
                const categoria = filtro.value;
                catalogo.innerHTML = "";

                const filtrados = categoria === "todos"
                    ? productos
                    : productos.filter(p => p.categoria === categoria);

                filtrados.forEach(producto => renderProducto(producto));
            });

            // Función para renderizar un producto individual
            function renderProducto(producto) {
                const card = document.createElement("div");
                card.classList.add("producto-card");

                card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Disponible: ${producto.cantidad}</p>
            <button class="agregar" data-id="${producto.id}">Agregar al carrito</button>`;

                catalogo.appendChild(card);
            }

            // Evento para agregar productos al carrito
            catalogo.addEventListener("click", e => {
                if (e.target.classList.contains("agregar")) {
                    const id = parseInt(e.target.dataset.id);
                    const producto = productos.find(p => p.id === id);

                    if (producto && producto.cantidad > 0) {
                        const existente = carrito.find(p => p.id === id);
                        if (existente) {
                            existente.cantidad++;
                        } else {
                            carrito.push({
                                id: producto.id,
                                nombre: producto.nombre,
                                precio: producto.precio,
                                cantidad: 1
                            });
                        }

                        producto.cantidad--;
                        e.target.previousElementSibling.textContent = `Disponible: ${producto.cantidad}`;
                        actualizarCarrito();

                        // Confirmación visual con SweetAlert
                        Swal.fire({
                            icon: "success",
                            title: "Producto agregado",
                            text: `${producto.nombre} se añadió al carrito`,
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Sin stock",
                            text: "Este producto ya no está disponible"
                        });
                    }
                }
            });

            // Inicializamos el carrito en pantalla
            actualizarCarrito();
        });

    // Evento para finalizar la compra
    btnFinalizar.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Carrito vacío",
                text: "Agrega productos antes de comprar"
            });
            return;
        }

        // Generamos resumen de compra
        const resumen = carrito.map(p =>
            `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`
        ).join("\n");

        const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

        // Confirmación de compra
        Swal.fire({
            title: "¿Confirmar compra?",
            text: `Resumen:\n${resumen}\n\nTotal: $${total.toFixed(2)}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, comprar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.removeItem("carrito");
                actualizarCarrito();

                Swal.fire({
                    icon: "success",
                    title: "¡Compra realizada!",
                    text: "Gracias por tu compra en Etéreo Spa"
                });
            }
        });
    });

    // Función para actualizar el carrito en pantalla
    function actualizarCarrito() {
        carritoLista.innerHTML = "";
        let total = 0;

        carrito.forEach(prod => {
            const item = document.createElement("li");
            item.innerHTML = `
        ${prod.nombre} x${prod.cantidad} - $${prod.precio * prod.cantidad}
        <button class="eliminar" data-id="${prod.id}">❌</button> `;
            carritoLista.appendChild(item);
            total += prod.precio * prod.cantidad;
        });

        totalCarrito.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // Evento para eliminar productos del carrito
    carritoLista.addEventListener("click", e => {
        if (e.target.classList.contains("eliminar")) {
            const id = parseInt(e.target.dataset.id);
            const index = carrito.findIndex(p => p.id === id);
            if (index !== -1) {
                carrito.splice(index, 1);
                actualizarCarrito();
            }
        }
    });
});

// Mostrar/ocultar el formulario de administración
document.addEventListener('DOMContentLoaded', () => {
    const adminBtn = document.getElementById('modo-admin-btn');
    const formulario = document.getElementById('formulario');

    if (adminBtn && formulario) {
        adminBtn.addEventListener('click', () => {
            formulario.classList.toggle('oculto');
        });
    }
});

