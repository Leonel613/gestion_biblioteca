if (email === "admin@cudi.com") {
  window.location.href = "panel_bibliotecario.html";
} else {
  window.location.href = "panel_alumno.html";
}
// FECHA FORMATO: Martes 28, Abril 21:09
document.addEventListener("DOMContentLoaded", () => {

  function actualizarFecha() {
    const ahora = new Date();

    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const dia = dias[ahora.getDay()];
    const numero = ahora.getDate();
    const mes = meses[ahora.getMonth()];

    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");

    const formato = `${dia} ${numero}, ${mes} ${horas}:${minutos}`;

    const span = document.getElementById("fechaHora");
    if (span) {
      span.textContent = formato;
    }
  }

  setInterval(actualizarFecha, 1000);
  actualizarFecha();

});