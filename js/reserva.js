export function inicializarReserva() {
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
