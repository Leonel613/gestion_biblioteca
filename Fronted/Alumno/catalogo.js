document.addEventListener("DOMContentLoaded", function () {

  console.log("Catalogo cargado");

  const libros = [
    { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", disponible: true },
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: false },
    { titulo: "Don Quijote", autor: "Miguel de Cervantes", disponible: true }
  ];

  const contenedor = document.getElementById("listaLibros");
  const buscador = document.getElementById("buscador");

  function mostrarLibros(lista) {
    contenedor.innerHTML = "";

    lista.forEach(libro => {
      const div = document.createElement("div");
      div.classList.add("libro");

      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p>Autor: ${libro.autor}</p>
        <p>Estado: ${libro.disponible ? "Disponible" : "No disponible"}</p>
        ${libro.disponible ? `<button class="boton-prestamo">Reservar libro</button>` : ""}
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

    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const nuevaReserva = {
      libro: libro.titulo,
      autor: libro.autor,
      fecha: new Date().toLocaleDateString(),
      estado: "Pendiente"
    };

    reservas.push(nuevaReserva);

    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("Reserva guardada para: " + libro.titulo);

  });
}

  mostrarLibros(libros);

  buscador.addEventListener("input", function () {
    const texto = buscador.value.toLowerCase();

    const filtrados = libros.filter(libro =>
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto)
    );

    mostrarLibros(filtrados);
  });

});