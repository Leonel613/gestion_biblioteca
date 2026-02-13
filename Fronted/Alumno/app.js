/*
  Asi comentamos varias lineas en Js....
*/
// ================= LOGIN =================
const btnLogin = document.getElementById("btnLogin");
const modal = document.getElementById("loginModal");
const cerrarModal = document.getElementById("cerrarModal");

if (btnLogin && modal && cerrarModal) {
  btnLogin.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cerrarModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}


// ================= SCROLL SUAVE =================
const scrollLinks = document.querySelectorAll('.scroll-link');

scrollLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ================= FAQ ACORDEÓN =================
const preguntas = document.querySelectorAll(".faq-question");

if (preguntas.length > 0) {
  preguntas.forEach(pregunta => {
    pregunta.addEventListener("click", () => {

      const respuestaActual = pregunta.nextElementSibling;

      // cerrar todas
      document.querySelectorAll(".faq-answer").forEach(respuesta => {
        if (respuesta !== respuestaActual) {
          respuesta.style.maxHeight = null;
        }
      });

      document.querySelectorAll(".faq-question").forEach(btn => {
        if (btn !== pregunta) {
          btn.classList.remove("active");
        }
      });

      // toggle actual
      if (respuestaActual.style.maxHeight) {
        respuestaActual.style.maxHeight = null;
        pregunta.classList.remove("active");
      } else {
        respuestaActual.style.maxHeight = respuestaActual.scrollHeight + "px";
        pregunta.classList.add("active");
      }

    });
  });
}

