export let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

export function agregarAlCarrito(producto) {
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function calcularTotal() {
    return carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

export function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
}

