document.addEventListener("DOMContentLoaded", function () {

  console.log("Catalogo cargado");

  const libros = [
    { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", disponible: true },
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: false },
    { titulo: "Don Quijote", autor: "Miguel de Cervantes", disponible: true }
  ];

  const contenedor = document.getElementById("listaLibros");
  const buscador = document.getElementById("buscador");

  // Valida que la fecha exista, no sea anterior a hoy y no exceda maxDays (por defecto 30)
  function esFechaValida(valor, maxDays = 30) {
    if (!valor) return false;
    const fechaSeleccionada = new Date(valor);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaMax = new Date(hoy);
    fechaMax.setDate(fechaMax.getDate() + maxDays);
    fechaMax.setHours(0, 0, 0, 0);

    return fechaSeleccionada >= hoy && fechaSeleccionada <= fechaMax;
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
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      const maxDate = (function(){ const d=new Date(); d.setDate(d.getDate()+30); return d.toISOString().split('T')[0];})();

      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Estado: ${libro.disponible ? "Disponible" : "No disponible"}</p>
        ${libro.disponible ? `
          <div class="fecha-card">
            <label>Desde</label>
            <input type="date" class="fecha-desde" min="${minDate}" max="${maxDate}" />
            <label>Hasta</label>
            <input type="date" class="fecha-hasta" min="${minDate}" max="${maxDate}" />
            <small class="form-note">Seleccioná un rango dentro de los próximos 30 días.</small>
          </div>
          <button class="boton-prestamo">Reservar libro</button>
        ` : `<span class="no-disponible">No disponible</span>`}
      `;

      contenedor.appendChild(div);

      if (libro.disponible) {
        const boton = div.querySelector(".boton-prestamo");

        boton.addEventListener("click", function () {

          const usuario = (localStorage.getItem("usuario") || "").toLowerCase().trim();

          if (!usuario) {
            alert("Debes iniciar sesión para reservar un libro.");
            window.location.href = "login.html";
            return;
          }

          const desdeInput = div.querySelector(".fecha-desde");
          const hastaInput = div.querySelector(".fecha-hasta");
          const fechaDesde = desdeInput ? desdeInput.value : "";
          const fechaHasta = hastaInput ? hastaInput.value : "";

          if (!fechaDesde || !fechaHasta) {
            alert("Seleccioná fecha desde y hasta para la reserva.");
            return;
          }

          const fechaD = new Date(fechaDesde);
          const fechaH = new Date(fechaHasta);
          fechaD.setHours(0,0,0,0); fechaH.setHours(0,0,0,0);

          if (fechaD > fechaH) {
            alert("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
            return;
          }

          // validar rango usando esFechaValida (comprueba fecha individualmente dentro de 30 días)
          if (!esFechaValida(fechaDesde, 30) || !esFechaValida(fechaHasta, 30)) {
            alert("Las fechas deben estar entre hoy y los próximos 30 días.");
            return;
          }

          // calcular días (inclusivo)
          const diffMs = fechaH - fechaD;
          const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

          let reservas = [];
          try {
            reservas = JSON.parse(localStorage.getItem("reservas")) || [];
          } catch (error) {
            console.error("Error al cargar reservas:", error);
            localStorage.removeItem("reservas");
          }

          const reservaExistente = reservas.some(r =>
            (r.usuario || "").toLowerCase().trim() === usuario &&
            r.libro === libro.titulo &&
            r.fechaDesde === fechaDesde &&
            r.fechaHasta === fechaHasta
          );

          if (reservaExistente) {
            alert("Ya existe una reserva para este libro en ese rango de fechas.");
            return;
          }

          const nuevaReserva = {
            usuario: usuario,
            libro: libro.titulo,
            autor: libro.autor,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            dias: dias,
            estado: "Pendiente"
          };

          reservas.push(nuevaReserva);

          localStorage.setItem("reservas", JSON.stringify(reservas));

          libro.disponible = false;
          mostrarLibros(libros);

          alert("Reserva guardada para: " + libro.titulo + " (" + dias + " días)");

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

  // ---------- Carousel navigation (flechas) ----------
  const carouselLeft = document.querySelector('.carousel-btn.left');
  const carouselRight = document.querySelector('.carousel-btn.right');
  const track = document.querySelector('.carousel-track');
  const wrapper = document.querySelector('.carousel-wrapper');

  function scrollAmount() {
    if (!wrapper) return 300;
    return Math.max(Math.floor(wrapper.clientWidth * 0.8), 240);
  }

  if (carouselLeft && carouselRight && track && wrapper) {
    carouselLeft.addEventListener('click', function() {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    carouselRight.addEventListener('click', function() {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    // allow vertical wheel to scroll horizontally over the track
    track.addEventListener('wheel', function(e) {
      if (Math.abs(e.deltaY) > 0) {
        track.scrollBy({ left: e.deltaY, behavior: 'auto' });
        e.preventDefault();
      }
    }, { passive: false });
  }

});