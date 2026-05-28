document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("listaLibros");

  const res = await fetch("http://localhost:3000/libros");
  const libros = await res.json();

  contenedor.innerHTML = "";

  libros.slice(0, 10).forEach(libro => {

    const div = document.createElement("div");
    div.classList.add("card", "libro");

    div.innerHTML = `
      <h3>${libro.titulo}</h3>
      <p>${libro.autor}</p>
      <p>${libro.disponible ? "Disponible" : "No disponible"}</p>
    `;

    contenedor.appendChild(div);
  });

  // 🔥 CAROUSEL LOGIC (ESTO TE FALTABA)
  const left = document.querySelector(".carousel-btn.left");
  const right = document.querySelector(".carousel-btn.right");
  const track = document.querySelector(".carousel-track");
  const wrapper = document.querySelector(".carousel-wrapper");

  function scrollAmount() {
    return Math.max(wrapper?.clientWidth * 0.8 || 300, 250);
  }

  if (left && right && track) {

    left.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    right.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });

  }

});