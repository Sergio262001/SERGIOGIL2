// formulario
const formReserva = document.getElementById("formReserva");

// inputs
const inputNombre = document.getElementById("nombre");
const selectServicio = document.getElementById("servicio");
const inputFecha = document.getElementById("fecha");
const selectHora = document.getElementById("hora");

// mensaje y lista
const mensaje = document.getElementById("mensaje");
const listaReservas = document.getElementById("listaReservas");

// datos
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// --------------------
// SERVICIOS
// --------------------
function cargarServicios() {
  servicios.forEach((servicio) => {
    const option = document.createElement("option");
    option.value = servicio.id;
    option.textContent = `${servicio.nombre} - $${servicio.precio}`;
    selectServicio.appendChild(option);
  });
}

// --------------------
// HORARIOS (cada 30 min)
// --------------------
function cargarHorarios() {
  for (let h = 9; h <= 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
      const option = document.createElement("option");
      option.value = hora;
      option.textContent = hora;
      selectHora.appendChild(option);
    }
  }
}

// --------------------
// FECHAS (15 días)
// --------------------
function limitarFechas() {
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 15);

  inputFecha.min = hoy.toISOString().split("T")[0];
  inputFecha.max = limite.toISOString().split("T")[0];
}

// --------------------
// MOSTRAR RESERVAS
// --------------------
function mostrarReservas() {
  listaReservas.innerHTML = "";

  reservas.forEach((reserva) => {
    const li = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent =
      `${reserva.nombre} - ${reserva.servicio} - ${reserva.fecha} ${reserva.hora} ($${reserva.precio})`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = () => eliminarReserva(reserva.id);

    li.appendChild(texto);
    li.appendChild(btnEliminar);
    listaReservas.appendChild(li);
  });
}

// --------------------
// ELIMINAR
// --------------------
function eliminarReserva(id) {
  reservas = reservas.filter(r => r.id !== id);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarReservas();
}

// --------------------
// EVENTO
// --------------------
formReserva.onsubmit = function (e) {
  e.preventDefault();

  if (
    inputNombre.value === "" ||
    selectServicio.value === "" ||
    inputFecha.value === "" ||
    selectHora.value === ""
  ) {
    mensaje.textContent = "Completa todos los campos";
    return;
  }

  const servicioElegido = servicios.find(
    s => s.id == selectServicio.value
  );

  const reserva = {
    id: Date.now(),
    nombre: inputNombre.value,
    servicio: servicioElegido.nombre,
    precio: servicioElegido.precio,
    fecha: inputFecha.value,
    hora: selectHora.value
  };

  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  mensaje.textContent = "Reserva creada";
  formReserva.reset();
  mostrarReservas();
};

// --------------------
// INICIO
// --------------------
cargarServicios();
cargarHorarios();
limitarFechas();
mostrarReservas();
