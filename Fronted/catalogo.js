document.addEventListener("DOMContentLoaded", function () {

  console.log("Catalogo conectado a Mongo");

  const contenedor = document.getElementById("listaLibros");
  const buscador = document.getElementById("buscador");
  const catalogMessage = document.getElementById("catalogMessage");

  let libros = [];

  // 🔥 1. CARGAR DESDE MONGO
  async function cargarLibros() {
    try {
      const res = await fetch("http://localhost:3000/libros");
      const data = await res.json();

      libros = data;
      mostrarLibros(libros);

    } catch (error) {
      console.error("Error cargando libros:", error);
      if (catalogMessage) {
        catalogMessage.textContent = "Error al cargar libros del servidor";
      }
    }
  }

  // 🔥 2. VALIDACIÓN FECHAS
  function esFechaValida(valor, maxDays = 30) {
    if (!valor) return false;

    const fecha = new Date(valor);
    const hoy = new Date();

    fecha.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const max = new Date(hoy);
    max.setDate(max.getDate() + maxDays);

    return fecha >= hoy && fecha <= max;
  }

  // 🔥 3. RENDER
  function mostrarLibros(lista) {

    contenedor.innerHTML = "";

    if (!lista.length) {
      if (catalogMessage) catalogMessage.textContent = "No hay libros disponibles";
      return;
    }

    if (catalogMessage) catalogMessage.textContent = "";

    lista.forEach(libro => {

      const div = document.createElement("div");
      div.classList.add("card", "libro");

      const today = new Date();
      const minDate = today.toISOString().split("T")[0];

      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      const maxStr = maxDate.toISOString().split("T")[0];

      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Disponibles: ${libro.disponibles ?? 0}</p>
        <p>Estado: ${libro.disponible ? "Disponible" : "No disponible"}</p>

        ${libro.disponible ? `
          <div class="fecha-card">
            <label>Desde</label>
            <input type="date" class="fecha-desde" min="${minDate}" max="${maxStr}" />

            <label>Hasta</label>
            <input type="date" class="fecha-hasta" min="${minDate}" max="${maxStr}" />

            <small>Seleccioná un rango de hasta 30 días</small>
          </div>

          <button class="boton-prestamo">Solicitar reserva</button>
        ` : `<span>No disponible</span>`}
      `;

      contenedor.appendChild(div);

      // 🔥 CLICK RESERVA
      if (libro.disponible) {

        const boton = div.querySelector(".boton-prestamo");

        boton.addEventListener("click", async () => {

          const usuario = (localStorage.getItem("usuario") || "").toLowerCase().trim();

          if (!usuario) {
            alert("Debes iniciar sesión");
            window.location.href = "login.html";
            return;
          }

          const fechaDesde = div.querySelector(".fecha-desde").value;
          const fechaHasta = div.querySelector(".fecha-hasta").value;

          if (!fechaDesde || !fechaHasta) {
            alert("Seleccioná fechas");
            return;
          }

          if (new Date(fechaDesde) > new Date(fechaHasta)) {
            alert("Fechas inválidas");
            return;
          }

          const dias = Math.floor(
            (new Date(fechaHasta) - new Date(fechaDesde)) /
            (1000 * 60 * 60 * 24)
          ) + 1;

          try {
            const res = await fetch("http://localhost:3000/prestamos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuario,
                libroId: libro._id,
                libro: libro.titulo,
                autor: libro.autor,
                fechaDesde,
                fechaHasta,
                dias,
                estado: "pendiente"
              })
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.error || "No se pudo realizar la solicitud");
              return;
            }

            alert("Solicitud enviada al bibliotecario");
            cargarLibros();

          } catch (err) {
            console.error(err);
            alert("Error de conexión");
          }
        });
      }
    });
  }

  // 🔥 BUSCADOR (DENTRO DEL SCOPE CORRECTO)
  buscador.addEventListener("input", function () {
    const texto = buscador.value.toLowerCase();

    const filtrados = libros.filter(l =>
      l.titulo.toLowerCase().includes(texto) ||
      l.autor.toLowerCase().includes(texto)
    );

    mostrarLibros(filtrados);
  });

  // 🔥 INIT
  cargarLibros();

});
function initCarousel() {

  const left = document.querySelector(".carousel-btn.left");
  const right = document.querySelector(".carousel-btn.right");
  const track = document.querySelector(".carousel-track");

  if (!left || !right || !track) {
    console.log("Carousel no encontrado");
    return;
  }

  function scrollAmount() {
    return Math.max(track.clientWidth * 0.8, 250);
  }

  left.onclick = () => {
    console.log("left click");
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  };

  right.onclick = () => {
    console.log("right click");
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  };

}

initCarousel();
