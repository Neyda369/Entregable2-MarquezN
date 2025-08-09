export function guardarHistorial(carrito, total) {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push({
        fecha: new Date().toLocaleString(),
        productos: carrito,
        total: total.toFixed(2)
    });
    localStorage.setItem("historial", JSON.stringify(historial));
}

export function mostrarHistorial(container) {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    container.innerHTML = "";
    historial.forEach(compra => {
        const item = document.createElement("div");
        item.classList.add("historial-item");
        item.innerHTML = `
            <p><strong>Fecha:</strong> ${compra.fecha
        }</p>
            <p><strong>Total:</strong> $${compra.total
        }</p>
            <ul>${compra.productos.map(p => `<li>${p.nombre
            } x${p.cantidad
            }</li>`).join("")
        }</ul>`;
        container.appendChild(item);
    });
}