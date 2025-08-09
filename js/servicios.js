export function mostrarServicios() {
    const servicios = [
        {
            nombre: "Reiki",
            imagen: "./Entregable2-MarquezN/assets/reiki.jpg",
            descripcion: "Equilibrio energético para cuerpo y mente."
        },
        {
            nombre: "Masaje facial",
            imagen: "./Entregable2-MarquezN/assets/terapia-facial.jpg",
            descripcion: "Relajación profunda y revitalización del rostro."
        },
        {
            nombre: "Masaje corporal",
            imagen: "./Entregable2-MarquezN/assets/masaje-3.jpg",
            descripcion: "Descontracturante y relajante para todo el cuerpo."
        },
        {
            nombre: "Biomagnetismo",
            imagen: "./Entregable2-MarquezN/assets/biomagnetismo.jpg",
            descripcion: "Armonización física y emocional con biomagnetismo."
        }
    ];

    const contenedor = document.querySelector(".lista-servicios");
    const selectTipo = document.getElementById("tipo");

    // Limpiar contenido previo
    contenedor.innerHTML = "";
    selectTipo.innerHTML = "";

    servicios.forEach(servicio => {
        const div = document.createElement("div");
        div.className = "servicio";
        div.innerHTML = `
            <img src="${servicio.imagen}" alt="${servicio.nombre}" />
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <button class="btn-reservar" data-servicio="${servicio.nombre}">Reservar</button>
        `;
        contenedor.appendChild(div);

        const option = document.createElement("option");
        option.value = servicio.nombre;
        option.textContent = servicio.nombre;
        selectTipo.appendChild(option);
    });
}
