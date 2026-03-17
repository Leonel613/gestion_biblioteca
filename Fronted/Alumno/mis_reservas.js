document.addEventListener("DOMContentLoaded", function () {

  const contenedor = document.getElementById("listaReservas");

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  if (reservas.length === 0) {
    contenedor.innerHTML = "<p>No tienes reservas aún.</p>";
    return;
  }

  reservas.forEach(reserva => {

    const div = document.createElement("div");
    div.classList.add("reserva");

    div.innerHTML = `
      <h3>${reserva.libro}</h3>
      <p>Autor: ${reserva.autor}</p>
      <p>Fecha: ${reserva.fecha}</p>
      <p>Estado: ${reserva.estado}</p>
    `;

    contenedor.appendChild(div);

  });

});