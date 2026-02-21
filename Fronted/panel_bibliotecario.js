const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".section");

// abrir/cerrar menú
hamburger.addEventListener("click", (e) => {
  e.stopPropagation(); // evita conflicto con click global
  sidebar.classList.toggle("hidden");
});

// cambiar secciones
menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // activar botón
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // mostrar sección
    const target = item.getAttribute("data-section");

    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === target) {
        sec.classList.add("active");
      }
    });

    // cerrar menú al seleccionar (opcional, pero queda pro)
    sidebar.classList.add("hidden");
  });
});

// cerrar si clickeás afuera
document.addEventListener("click", (e) => {
  if (
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sidebar.classList.add("hidden");
  }
});