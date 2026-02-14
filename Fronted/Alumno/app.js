/*
  Asi comentamos varias lineas en Js....
*/

// creacion de interfaz de inicio 
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

// --- Lógica del login (solo si existe el formulario) ---
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  console.log("Formulario detectado");
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault(); console.log("Submit funcionando");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Simulación
    if (email === "admin@cudi.com" && password === "1234") {
      alert("Login exitoso - Bienvenido Bibliotecario");
      window.location.href = "index.html";
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  });
}
alert("JS cargado correctamente");