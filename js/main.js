import { renderCatalogo } from "./catalogo.js";
import { carrito, agregarAlCarrito, eliminarDelCarrito, calcularTotal, vaciarCarrito } from "./carrito.js";
import { guardarHistorial } from "./data/historial.js";
import { activarFiltro } from "./filtro.js";
import { mostrarServicios } from './servicios.js';

document.addEventListener("DOMContentLoaded", () => {
    mostrarServicios();
    inicializarReserva();

    const catalogo = document.getElementById("product-list");
    const carritoLista = document.getElementById("carrito-lista");
    const totalCarrito = document.getElementById("total-carrito");
    const btnFinalizar = document.getElementById("finalizar-compra");

    const boton = document.querySelector('.btn-ver-productos');
    const destino = document.querySelector('#catalogo');

    if (boton && destino) {
        boton.addEventListener('click', function (e) {
            e.preventDefault();
            const offset = -80;
            const posicion = destino.getBoundingClientRect().top + window.pageYOffset + offset;

            window.scrollTo({
                top: posicion,
                behavior: 'smooth'
            });
        });
    }

    let productosGlobales = [];

    fetch("./js/data/productos.json")
        .then(res => res.json())
        .then(productos => {
            productosGlobales = productos;

            const renderConCarrito = productos => {
                renderCatalogo(productos, catalogo, id => {
                    const producto = productos.find(p => p.id === id);
                    if (producto && producto.cantidad > 0) {
                        agregarAlCarrito(producto);
                        actualizarCarrito();
                    }
                });
            };

            renderConCarrito(productos);
            activarFiltro(productosGlobales, catalogo, renderConCarrito);
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            const mensajeError = document.createElement("p");
            mensajeError.className = "error";
            mensajeError.textContent = "No se pudo cargar el catálogo. Intenta más tarde.";
            catalogo.appendChild(mensajeError);
        });

    btnFinalizar.addEventListener("click", () => {
        const total = calcularTotal();
        if (carrito.length === 0) {
            Swal.fire({
                title: "Carrito vacío",
                text: "Agrega productos antes de finalizar la compra.",
                icon: "info",
                confirmButtonText: "Aceptar"
            });
            return;
        }

        Swal.fire({
            title: "¿Confirmar compra?",
            html: `<strong>Total:</strong> $${total.toFixed(2)}<br>¿Deseas finalizar la compra?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, comprar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) {
                guardarHistorial(carrito, total);
                vaciarCarrito();
                actualizarCarrito();

                Swal.fire({
                    icon: "success",
                    title: "¡Compra realizada!",
                    text: "Gracias por tu compra en Etéreo Spa",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    });

    function actualizarCarrito() {
        carritoLista.innerHTML = "";
        carrito.forEach(p => {
            const li = document.createElement("li");
            li.innerHTML = `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}
                <button class="eliminar" data-id="${p.id}">❌</button>`;
            carritoLista.appendChild(li);
        });
        totalCarrito.textContent = `$${calcularTotal().toFixed(2)}`;
    }

    carritoLista.addEventListener("click", e => {
        if (e.target.classList.contains("eliminar")) {
            const id = parseInt(e.target.dataset.id);
            const producto = carrito.find(p => p.id === id);

            Swal.fire({
                title: "¿Eliminar producto?",
                text: `¿Deseas quitar "${producto.nombre}" del carrito?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed) {
                    eliminarDelCarrito(id);
                    actualizarCarrito();

                    Swal.fire({
                        icon: "success",
                        title: "Producto eliminado",
                        text: `"${producto.nombre}" fue quitado del carrito`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        }
    });

    // Lógica de reserva con validación y localStorage
    function inicializarReserva() {
        const reserva = document.getElementById("reserva-servicio");
        const selectTipo = document.getElementById("tipo");
        const formulario = document.getElementById("form-reserva");

        document.addEventListener("click", e => {
            if (e.target.classList.contains("btn-reservar")) {
                const servicio = e.target.dataset.servicio;
                selectTipo.value = servicio;
                reserva.classList.remove("oculto");
                reserva.scrollIntoView({ behavior: "smooth" });
            }
        });

        formulario.addEventListener("submit", e => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const fecha = document.getElementById("fecha").value;
            const hora = document.getElementById("hora").value;
            const tipo = selectTipo.value;

            if (!nombre || !fecha || !hora || !tipo) {
                Swal.fire({
                    icon: "warning",
                    title: "Campos incompletos",
                    text: "Por favor, completa todos los campos antes de reservar.",
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
            const conflicto = reservas.find(r => r.fecha === fecha && r.hora === hora);

            if (conflicto) {
                Swal.fire({
                    icon: "error",
                    title: "Horario ocupado",
                    text: `Ya existe una reserva para ${conflicto.tipo} a las ${hora}. Elige otro horario.`,
                    confirmButtonText: "Aceptar"
                });
                return;
            }

            const nuevaReserva = { nombre, fecha, hora, tipo };
            reservas.push(nuevaReserva);
            localStorage.setItem("reservas", JSON.stringify(reservas));

            Swal.fire({
                icon: "success",
                title: "¡Reserva confirmada!",
                html: `Gracias, <strong>${nombre}</strong>. Tu reserva para <strong>${tipo}</strong> ha sido agendada el <strong>${fecha}</strong> a las <strong>${hora}</strong>.`,
                confirmButtonText: "Aceptar"
            });

            formulario.reset();
            reserva.classList.add("oculto");
        });
    }
});
