document.addEventListener("DOMContentLoaded", () => {

  console.log("Panel alumno cargado");

  // ================= USUARIO =================
  const raw = localStorage.getItem("usuario");
  const usuario = raw ? JSON.parse(raw) : null;

  if (!usuario || usuario.rol !== "alumno") {
    window.location.href = "login.html";
    return;
  }

  // ================= ELEMENTOS =================
  const listaLibros = document.getElementById("listaLibros");
  const misPrestamos = document.getElementById("misPrestamos");
  const listaReservas = document.getElementById("listaReservas"); // ✔ FIX

  // ================= RESERVAS =================
  async function cargarReservasAprobadas() {
    try {
      const res = await fetch(`http://localhost:3000/mis-reservas/${usuario._id || usuario.id}`);
      const data = await res.json();

      if (!listaReservas) return;

      listaReservas.innerHTML = "";

      data.forEach(reserva => {
        const div = document.createElement("div");
        div.classList.add("card", "reserva");

        div.innerHTML = `
          <h3>${reserva.libro}</h3>
          <p>Estado: ${reserva.estado}</p>
        `;

        listaReservas.appendChild(div);
      });

    } catch (error) {
      console.error("Error reservas:", error);
    }
  }

  // ================= PRESTAMOS =================
  async function cargarMisPrestamos() {
    try {
      const res = await fetch(`http://localhost:3000/prestamos?usuario=${encodeURIComponent(usuario.dni)}`);
      const data = await res.json();

      if (!misPrestamos) return;

      misPrestamos.innerHTML = "";

      data.forEach(p => {
        const li = document.createElement("li");

        const desde = p.fechaDesde ? new Date(p.fechaDesde).toLocaleDateString() : "";
        const hasta = p.fechaHasta ? new Date(p.fechaHasta).toLocaleDateString() : "";

        li.textContent = `${p.libro} — ${p.estado} — ${desde} → ${hasta}`;

        misPrestamos.appendChild(li);
      });

    } catch (err) {
      console.error("Error préstamos:", err);
    }
  }

  // ================= LOGOUT =================
  function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "login.html";
  }

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", cerrarSesion);
  }

  // ================= INIT =================
  cargarReservasAprobadas();
  cargarMisPrestamos();

});
