const servicios = [
  { id: 1, nombre: "Corte clasico", precio: 20000 },
  { id: 2, nombre: "Fade / Degradado", precio: 25000 },
  { id: 3, nombre: "Corte + barba", precio: 35000 },
  { id: 4, nombre: "Barba premium", precio: 18000 }
];

const formReserva = document.getElementById("formReserva");
const inputNombre = document.getElementById("nombre");
const selectServicio = document.getElementById("servicio");
const inputFecha = document.getElementById("fecha");
const selectHora = document.getElementById("hora");
const mensaje = document.getElementById("mensaje");
const listaReservas = document.getElementById("listaReservas");
const btnSubmit = document.getElementById("btnSubmit");
const btnCancelar = document.getElementById("btnCancelar");

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let editandoId = null;

function cargarServicios() {
  selectServicio.innerHTML = `
    <option value="">Selecciona un servicio</option>
    ${servicios.map(s => `
      <option value="${s.id}">${s.nombre} - $${s.precio}</option>
    `).join("")}
  `;
}

function cargarHorarios() {
  selectHora.innerHTML = `<option value="">Selecciona una hora</option>`;

  for (let minutos = 540; minutos <= 1170; minutos += 30) {
    const hora = String(Math.floor(minutos / 60)).padStart(2, "0");
    const minuto = String(minutos % 60).padStart(2, "0");
    const valor = `${hora}:${minuto}`;
    selectHora.insertAdjacentHTML("beforeend", `<option value="${valor}">${valor}</option>`);
  }
}

function limitarFechas() {
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 15);

  inputFecha.min = hoy.toISOString().split("T")[0];
  inputFecha.max = limite.toISOString().split("T")[0];
}

function renderReservas() {
  if (reservas.length === 0) {
    listaReservas.innerHTML = `<li>No hay reservas aún</li>`;
    return;
  }

  listaReservas.innerHTML = reservas.map(r => `
    <li data-id="${r.id}" class="${editandoId === r.id ? "editando" : ""}">
      <div class="reserva-info">
        ${r.nombre} - ${r.servicio} - ${r.fecha} ${r.hora} ($${r.precio})
      </div>
      <div class="reserva-acciones">
        <button class="editar" data-action="edit">Editar</button>
        <button class="eliminar" data-action="delete">Eliminar</button>
      </div>
    </li>
  `).join("");
}

function nombreValido(nombre) {
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}$/.test(nombre.trim());
}

function existeReservaDuplicada(data, ignoreId = null) {
  return reservas.some(r =>
    r.fecha === data.fecha &&
    r.hora === data.hora &&
    r.id !== ignoreId
  );
}

function guardarStorage() {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function resetFormulario() {
  formReserva.reset();
  editandoId = null;
  btnSubmit.textContent = "Reservar";
  btnCancelar.style.display = "none";
  mensaje.textContent = "";
  renderReservas();
}

formReserva.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const servicioId = selectServicio.value;
  const fecha = inputFecha.value;
  const hora = selectHora.value;

  if (!nombre || !servicioId || !fecha || !hora) {
    mensaje.textContent = "Completa todos los campos";
    return;
  }

  if (!nombreValido(nombre)) {
    mensaje.textContent = "Nombre inválido. Solo letras y espacios.";
    return;
  }

  const servicioElegido = servicios.find(s => String(s.id) === String(servicioId));
  if (!servicioElegido) {
    mensaje.textContent = "Servicio inválido.";
    return;
  }

  const data = {
    nombre,
    servicio: servicioElegido.nombre,
    precio: servicioElegido.precio,
    fecha,
    hora
  };

  if (existeReservaDuplicada(data, editandoId)) {
    mensaje.textContent = "Ya hay una reserva en ese horario.";
    return;
  }

  if (editandoId) {
    const i = reservas.findIndex(r => r.id === editandoId);
    if (i !== -1) reservas[i] = { ...reservas[i], ...data };
  } else {
    reservas.push({ ...data, id: Date.now() });
  }

  guardarStorage();
  resetFormulario();
  mensaje.textContent = "Reserva guardada correctamente";
});

listaReservas.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const action = e.target.dataset.action;

  if (action === "delete") {
    reservas = reservas.filter(r => r.id !== id);
    guardarStorage();
    renderReservas();
    mensaje.textContent = "Reserva eliminada";
    return;
  }

  if (action === "edit") {
    const r = reservas.find(x => x.id === id);
    if (!r) return;

    inputNombre.value = r.nombre;
    inputFecha.value = r.fecha;
    selectHora.value = r.hora;

    const servicioObj = servicios.find(s => s.nombre === r.servicio);
    if (servicioObj) selectServicio.value = String(servicioObj.id);

    editandoId = id;
    btnSubmit.textContent = "Actualizar reserva";
    btnCancelar.style.display = "block";
    mensaje.textContent = "Editando reserva...";
    renderReservas();
  }
});

btnCancelar.addEventListener("click", resetFormulario);

cargarServicios();
cargarHorarios();
limitarFechas();
renderReservas();