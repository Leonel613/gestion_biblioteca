/*
  Asi comentamos varias lineas en Js....
*/

// creacion de interfaz de inicio 
const btnLogin = document.getElementById("btnLogin");
const modal = document.getElementById("loginModal");
const cerrarModal = document.getElementById("cerrarModal");

btnLogin.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cerrarModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// salto a pagina de preguntas frecuentes
const preguntas = document.querySelectorAll(".faq-question");

preguntas.forEach(pregunta => {
  pregunta.addEventListener("click", () => {
    const respuesta = pregunta.nextElementSibling;

    if (respuesta.style.maxHeight) {
      respuesta.style.maxHeight = null;
    } else {
      respuesta.style.maxHeight = respuesta.scrollHeight + "px";
    }
  });
});
