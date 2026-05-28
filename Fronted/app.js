window.addEventListener("DOMContentLoaded", () => {
  console.log("INPUT DNI:", document.getElementById("dni"));
  console.log("VALUE DNI:", document.getElementById("dni")?.value);
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("APP.JS CARGADO");
console.log("INPUT DNI:", document.getElementById("dni").value);
console.log("INPUT PASSWORD:", document.getElementById("password").value);

  // Evitar que errores externos/caracteres no manejados detengan la ejecución
  window.addEventListener('error', function (event) {
    console.warn('Capturado error (no crítico):', event.message);
    try { event.preventDefault && event.preventDefault(); } catch(e){}
  });

  window.addEventListener('unhandledrejection', function (event) {
    console.warn('Promesa no manejada (silenciada):', event.reason);
    try { event.preventDefault && event.preventDefault(); } catch(e){}
  });
/*
  Asi comentamos varias lineas en Js....
*/

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

});


// ================= LOGIN =================
console.log("APP.JS CARGADO");

const loginForm = document.getElementById("loginForm");

function limpiarErroresLogin() {
  document.getElementById("dniError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("loginGeneralError").textContent = "";
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    limpiarErroresLogin();

    // 🔥 DEBUG INICIAL
    const dniInput = document.getElementById("dni");
    const passwordInput = document.getElementById("password");

    console.log("INPUT DNI ELEMENT:", dniInput);
    console.log("INPUT PASSWORD ELEMENT:", passwordInput);

    let dni = dniInput ? dniInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    console.log("DNI RAW:", dni);
    console.log("PASSWORD RAW:", password);

    let valid = true;

    // validar primero
    if (!dni) {
      document.getElementById("dniError").textContent = "El DNI es obligatorio.";
      valid = false;
    }

    if (!password) {
      document.getElementById("passwordError").textContent = "La contraseña es obligatoria.";
      valid = false;
    }

    if (!valid) return;

    // limpiar DNI después de validar
    dni = dni.replace(/\D/g, "");
    if (dniInput) dniInput.value = dni;

    console.log("DNI LIMPIO:", dni);

    try {
      console.log("🚀 ENVIANDO LOGIN...");

      const res = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dni, password })
      });

      console.log("STATUS RESPONSE:", res.status);

      const data = await res.json();
      console.log("RESPUESTA BACKEND:", data);

      if (!res.ok) {
        document.getElementById("loginGeneralError").textContent =
          data.error || "Error en login";
        return;
      }

      // guardar sesión
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("rol", data.usuario.rol);

      loginForm.reset();

      // primera vez
      if (data.primeraVez) {
        console.log("PRIMER LOGIN → crear password");
        window.location.href = "crear_password.html";
        return;
      }

      // redirección
      if (data.usuario.rol === "bibliotecario") {
        console.log("REDIRIGIENDO A BIBLIOTECARIO");
        window.location.href = "panel_bibliotecario.html";
      } else {
        console.log("REDIRIGIENDO A ALUMNO");
        window.location.href = "panel_alumno.html";
      }

    } catch (error) {
      console.error("ERROR FETCH LOGIN:", error);
      document.getElementById("loginGeneralError").textContent =
        "Error de conexión";
    }
  });
}
