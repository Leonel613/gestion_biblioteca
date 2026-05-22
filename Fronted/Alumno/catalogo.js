document.addEventListener("DOMContentLoaded", function () {

  console.log("Catalogo cargado");

  const libros = [
    { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", disponible: true },
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: false },
    { titulo: "Don Quijote", autor: "Miguel de Cervantes", disponible: true }
  ];

  const contenedor = document.getElementById("listaLibros");
  const buscador = document.getElementById("buscador");

  function esFechaValida(valor) {
    if (!valor) return false;
    const fechaSeleccionada = new Date(valor);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada >= hoy;
  }

  const catalogMessage = document.getElementById("catalogMessage");

  function mostrarLibros(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
      if (catalogMessage) catalogMessage.textContent = "No se encontraron libros para tu búsqueda.";
      return;
    }

    if (catalogMessage) catalogMessage.textContent = "";

    lista.forEach(libro => {
      const div = document.createElement("div");
      div.classList.add("card", "libro");
      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Estado: ${libro.disponible ? "Disponible" : "No disponible"}</p>
        ${libro.disponible ? `
          <div class="fecha-card">
            <label>Fecha de reserva</label>
            <input type="date" class="fecha-reserva" min="${new Date().toISOString().split('T')[0]}" />
          </div>
          <button class="boton-prestamo">Reservar libro</button>
        ` : `<span class="no-disponible">No disponible</span>`}
      `;

      contenedor.appendChild(div);

      if (libro.disponible) {
        const boton = div.querySelector(".boton-prestamo");

        boton.addEventListener("click", function () {

          const usuario = localStorage.getItem("usuario");

          if (!usuario) {
            alert("Debes iniciar sesión para reservar un libro.");
            window.location.href = "login.html";
            return;
          }

          const fechaInput = div.querySelector(".fecha-reserva");
          const fechaReserva = fechaInput ? fechaInput.value : "";

          if (!fechaReserva) {
            alert("Seleccioná una fecha de reserva para este libro antes de continuar.");
            return;
          }

          if (!esFechaValida(fechaReserva)) {
            alert("La fecha de reserva no puede ser anterior a hoy.");
            return;
          }

          let reservas = [];
          try {
            reservas = JSON.parse(localStorage.getItem("reservas")) || [];
          } catch (error) {
            console.error("Error al cargar reservas:", error);
            localStorage.removeItem("reservas");
          }

          const reservaExistente = reservas.some(r =>
            r.usuario === usuario &&
            r.libro === libro.titulo &&
            r.fecha === fechaReserva
          );

          if (reservaExistente) {
            alert("Ya existe una reserva para este libro en la misma fecha.");
            return;
          }

          const nuevaReserva = {
            usuario: usuario,
            libro: libro.titulo,
            autor: libro.autor,
            fecha: fechaReserva,
            estado: "Pendiente"
          };

          reservas.push(nuevaReserva);

          localStorage.setItem("reservas", JSON.stringify(reservas));

          libro.disponible = false;
          mostrarLibros(libros);

          alert("Reserva guardada para: " + libro.titulo);

        });
      }
    });
  }

  function mostrarLibros(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
      if (catalogMessage) catalogMessage.textContent = "No se encontraron libros para tu búsqueda.";
      return;
    }

    if (catalogMessage) catalogMessage.textContent = "";

    lista.forEach(libro => {
      const div = document.createElement("div");
      div.classList.add("card", "libro");
      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Estado: ${libro.disponible ? "Disponible" : "No disponible"}</p>
        ${libro.disponible ? `
          <div class="fecha-card">
            <label>Fecha de reserva</label>
            <input type="date" class="fecha-reserva" min="${new Date().toISOString().split('T')[0]}" />
          </div>
          <button class="boton-prestamo">Reservar libro</button>
        ` : `<span class="no-disponible">No disponible</span>`}
      `;

      contenedor.appendChild(div);

      if (libro.disponible) {
        const boton = div.querySelector(".boton-prestamo");

        boton.addEventListener("click", function () {

          const usuario = localStorage.getItem("usuario");

          if (!usuario) {
            alert("Debes iniciar sesión para reservar un libro.");
            window.location.href = "login.html";
            return;
          }

          const fechaInput = div.querySelector(".fecha-reserva");
          const fechaReserva = fechaInput ? fechaInput.value : "";

          if (!fechaReserva) {
            alert("Seleccioná una fecha de reserva para este libro antes de continuar.");
            return;
          }

          if (!esFechaValida(fechaReserva)) {
            alert("La fecha de reserva no puede ser anterior a hoy.");
            return;
          }

          let reservas = [];
          try {
            reservas = JSON.parse(localStorage.getItem("reservas")) || [];
          } catch (error) {
            console.error("Error al cargar reservas:", error);
            localStorage.removeItem("reservas");
          }

          const reservaExistente = reservas.some(r =>
            r.usuario === usuario &&
            r.libro === libro.titulo &&
            r.fecha === fechaReserva
          );

          if (reservaExistente) {
            alert("Ya existe una reserva para este libro en la misma fecha.");
            return;
          }

          const nuevaReserva = {
            usuario: usuario,
            libro: libro.titulo,
            autor: libro.autor,
            fecha: fechaReserva,
            estado: "Pendiente"
          };

          reservas.push(nuevaReserva);

          localStorage.setItem("reservas", JSON.stringify(reservas));

          libro.disponible = false;
          mostrarLibros(libros);

          alert("Reserva guardada para: " + libro.titulo);

        });
      }
    });
  }

  mostrarLibros(libros);

  buscador.addEventListener("input", function () {
    const texto = buscador.value.trim().toLowerCase();

    const filtrados = libros.filter(libro =>
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto)
    );

    mostrarLibros(filtrados);
  });

});