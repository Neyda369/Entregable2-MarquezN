// ========== Configuración inicial ==========
const productos = [
    {
        id: 1,
        nombre: "Shampoo Revitalizante",
        precio: 12,
        imagen: "assets/img/shampoo.jpeg"
    },
    {
        id: 2,
        nombre: "Bálsamo Capilar",
        precio: 10,
        imagen: "assets/img/balsamo.jpeg"
    },
    {
        id: 3,
        nombre: "Crema Corporal",
        precio: 14,
        imagen: "assets/img/crema-corporal.webp"
    },
    {
        id: 4,
        nombre: "Exfoliante de Café",
        precio: 9,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_900263-MLA79491663000_102024-O.webp"
    },
    {
        id: 5,
        nombre: "Gel Facial Hidratante",
        precio: 11,
        imagen: "assets/img/gel-facial.jpg"
    },
    {
        id: 6,
        nombre: "Aceite Relajante",
        precio: 13,
        imagen: "assets/img/aceite-naranja-1.jpg"
    }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ========== Funciones de almacenamiento ==========
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function guardarProductos() {
    localStorage.setItem("catalogo", JSON.stringify(productos));
}

function cargarProductos() {
    const guardado = JSON.parse(localStorage.getItem("catalogo"));
    if (guardado && Array.isArray(guardado)) {
        productos.length = 0;
        productos.push(...guardado);
    }
}

// ========== Mostrar catálogo de productos ==========
function mostrarProductos() {
    const contenedor = document.getElementById("product-list");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        const imagen = producto.imagen || ""; // imagen genérica
        card.innerHTML = `
        <img src="${producto.imagen || 'assets/img/aceite-naranja-1.jpg'}" alt="${producto.nombre}"/>
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <button data-id="${producto.id}" class="agregar-btn">Agregar</button>
`;
        contenedor.appendChild(card);
    });

    document.querySelectorAll(".agregar-btn").forEach(boton => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.dataset.id);
            agregarAlCarrito(id);
        });
    });
}

// ========== Lógica del carrito ==========
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    carrito.push(producto);
    guardarCarrito();
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("cart-items");
    const totalDOM = document.getElementById("cart-total");

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
        lista.appendChild(li);
        total += item.precio;
    });

    totalDOM.textContent = `Total: $${total.toFixed(2)}`;
}

document.getElementById("vaciar-carrito").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
});

// ========== Formulario para agregar producto ==========
document.getElementById("agregar-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombreInput = document.getElementById("nombre-producto");
    const precioInput = document.getElementById("precio-producto");
    const imagenInput = document.getElementById("imagen-producto");
    const errorMsg = document.getElementById("form-error");

    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const imagen = imagenInput.value.trim();

    if (nombre === "" || isNaN(precio) || precio <= 0 || imagen === "") {
        errorMsg.textContent = "Completa todos los campos correctamente.";
        return;
    }

    const nuevoProducto = {
        id: productos.length + 1,
        nombre: nombre,
        precio: precio,
        imagen: imagen,
    };

    productos.push(nuevoProducto);
    guardarProductos();
    mostrarProductos();

    nombreInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    errorMsg.textContent = "";
});

// ========== Inicialización al cargar la página ==========
cargarProductos();
mostrarProductos();
actualizarCarrito();
