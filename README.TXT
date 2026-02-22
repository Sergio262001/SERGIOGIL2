# Barbería LA - Sistema de Reservas (Vanilla JS)

Proyecto web simple para gestionar reservas de una barbería desde el navegador, usando HTML, CSS y JavaScript. Permite crear, listar, editar y eliminar reservas, con persistencia en LocalStorage.

## Funcionalidades
- Crear reservas con: nombre, servicio, fecha y hora.
- Listar reservas realizadas.
- Editar una reserva existente.
- Eliminar reservas.
- Validaciones:
  - Campos obligatorios.
  - Nombre solo con letras y espacios.
  - No permite reservar el mismo día y hora (evita duplicados).
- Fechas disponibles limitadas a los próximos 15 días.
- Horarios generados automáticamente cada 30 minutos.

## Tecnologías
- HTML5
- CSS3
- JavaScript
- LocalStorage

## Estructura del proyecto
- `index.html`
- `css/styles.css`
- `js/app.js`
- `img/` (logo y fondo)

## Cómo usarlo
1. Abrir `index.html` en el navegador.
2. Completar el formulario y presionar "Reservar".
3. Las reservas quedan guardadas en LocalStorage (persisten al recargar).
4. Para editar, presionar "Editar", modificar datos y luego "Actualizar reserva".
5. Para cancelar la edición, presionar "Cancelar edición".