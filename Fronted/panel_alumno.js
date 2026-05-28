document.addEventListener("DOMContentLoaded", () => {

  console.log("Panel alumno cargado");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || usuario.rol !== "alumno") {
  window.location.href = "login.html";
  }

  // ================= USUARIO =================
  const raw = localStorage.getItem("usuario");
  const usuario = raw ? JSON.parse(raw) : null;

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // ================= ELEMENTOS =================
  const listaLibros = document.getElementById("listaLibros");
  const misPrestamos = document.getElementById("misPrestamos");
  const busquedaLibro = document.getElementById("busquedaLibro");

  // ================= LIBROS (mock por ahora) =================
  let librosDisponibles = [
    "Cien años de soledad",
    "Don Quijote de la Mancha",
    "El Principito",
    "1984 - George Orwell",
    "La Odisea"
  ];

  let librosPrestados = [];

  // ================= RENDER =================
  function renderizar(filtro = "") {

    if (!listaLibros || !misPrestamos) return;

    listaLibros.innerHTML = "";
    misPrestamos.innerHTML = "";

    const filtrados = filtro
      ? librosDisponibles.filter(l =>
          l.toLowerCase().includes(filtro.toLowerCase())
        )
      : librosDisponibles;

    // DISPONIBLES
    filtrados.forEach(libro => {
      const li = document.createElement("li");
      li.textContent = libro;

      const btn = document.createElement("button");
      btn.textContent = "Reservar";

      btn.addEventListener("click", () => {
        librosPrestados.push(libro);
        librosDisponibles = librosDisponibles.filter(l => l !== libro);
        renderizar(filtro);
      });

      li.appendChild(btn);
      listaLibros.appendChild(li);
    });

    // PRESTADOS
    librosPrestados.forEach(libro => {
      const li = document.createElement("li");
      li.textContent = libro;

      const btn = document.createElement("button");
      btn.textContent = "Devolver";

      btn.addEventListener("click", () => {
        librosDisponibles.push(libro);
        librosPrestados = librosPrestados.filter(l => l !== libro);
        renderizar(filtro);
      });

      li.appendChild(btn);
      misPrestamos.appendChild(li);
    });
  }

  renderizar();

  if (busquedaLibro) {
    busquedaLibro.addEventListener("input", (e) => {
      renderizar(e.target.value);
    });
  }

  // ================= LOGOUT =================
  function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "login.html";
  }

  const panel = document.querySelector(".panel-container");

  if (panel && !document.getElementById("logoutBtn")) {
    const btn = document.createElement("button");
    btn.id = "logoutBtn";
    btn.textContent = "Cerrar sesión";
    btn.style.marginTop = "20px";

    btn.addEventListener("click", cerrarSesion);

    panel.appendChild(btn);
  }

  console.log("Panel alumno OK");
});
