document.addEventListener("DOMContentLoaded", function () {

  const usuario = localStorage.getItem("usuario");
  const rol = localStorage.getItem("rol");

  if (!usuario || rol !== "alumno") {
    alert("Debes iniciar sesión como alumno para ver tus reservas.");
    window.location.href = "login.html";
    return;
  }

  const contenedor = document.getElementById("listaReservas");

  let reservas = [];
  try {
    reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  } catch (error) {
    console.error("Error al cargar reservas:", error);
    localStorage.removeItem("reservas");
  }
  const reservasUsuario = reservas.filter(reserva => reserva.usuario === usuario);

  if (reservasUsuario.length === 0) {
    contenedor.innerHTML = "<p>No tienes reservas aún.</p>";
    return;
  }

  reservasUsuario.forEach((reserva, index) => {

  const div = document.createElement("div");
  div.classList.add("reserva");

  div.innerHTML = `
    <h3>${reserva.libro}</h3>
    <p>Autor: ${reserva.autor}</p>
    <p>Fecha: ${reserva.fecha}</p>
    <p>Estado: ${reserva.estado}</p>
    <button class="cancelar-btn">Cancelar</button>
  `;

  // 🔴 BOTÓN CANCELAR
  const boton = div.querySelector(".cancelar-btn");

  boton.addEventListener("click", function () {

    const indiceGlobal = reservas.findIndex(r =>
      r.usuario === reserva.usuario &&
      r.libro === reserva.libro &&
      r.autor === reserva.autor &&
      r.fecha === reserva.fecha
    );

    if (indiceGlobal > -1) {
      reservas.splice(indiceGlobal, 1);
      localStorage.setItem("reservas", JSON.stringify(reservas));
      location.reload();
    }

  });

  contenedor.appendChild(div);

});

});