document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("DOMContentLoaded", () => {

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

// --- Lógica del login (solo si existe el formulario) ---
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  console.log("Formulario detectado");

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Submit funcionando");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor ingrese un email válido.");
      return;
    }

    // 🔹 LOGIN BIBLIOTECARIO
    if (email === "admin@cudi.com" && password === "1234") {

      localStorage.setItem("rol", "bibliotecario");
      localStorage.setItem("usuario", email);

      window.location.href = "panel_bibliotecario.html";

    } 
    // 🔹 LOGIN ALUMNO
    else if (email === "alumno@cudi.com" && password === "1234") {

      localStorage.setItem("rol", "alumno");
      localStorage.setItem("usuario", email);

      window.location.href = "panel_alumno.html";

    } 
    // ❌ ERROR
    else {
      alert("Correo o contraseña incorrectos.");
    }

  });
} 

// --- Crear usuario (solo si existe el formulario) ---
const crearUsuarioForm = document.getElementById("crearUsuarioForm");

if (crearUsuarioForm) {
  crearUsuarioForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nuevoNombre").value;
    const email = document.getElementById("nuevoEmail").value;
    const rol = document.getElementById("nuevoRol").value;
    const password = document.getElementById("nuevoPassword").value;

    if (!nombre || !email || !rol || !password) {
      alert("Complete todos los campos.");
      return;
    }

    const mensaje = document.getElementById("mensajeCreacion");
    mensaje.textContent = "Usuario creado correctamente (simulación).";
    mensaje.style.color = "green";

    crearUsuarioForm.reset();
  });
}
// Protección del panel alumno
if (window.location.pathname.includes("panel_alumno.html")) {

  const rol = localStorage.getItem("rol");

  if (rol !== "alumno") {
    window.location.href = "login.html";
  }
}

// --- Panel Alumno ---
const listaLibros = document.getElementById("listaLibros");
const misPrestamos = document.getElementById("misPrestamos");
const busquedaLibro = document.getElementById("busquedaLibro");

if (listaLibros) {

  let librosDisponibles = [
    "Cien años de soledad",
    "Don Quijote de la Mancha",
    "El Principito",
    "1984 - George Orwell",
    "La Odisea"
  ];

  let librosPrestados = [];

  function renderizar(filtro = "") {
    // Limpiar ambos contenedores
    listaLibros.innerHTML = "";
    misPrestamos.innerHTML = "";

    // Mostrar disponibles (con filtro si aplica)
    const librosAMostrar = filtro 
      ? librosDisponibles.filter(libro => libro.toLowerCase().includes(filtro.toLowerCase()))
      : librosDisponibles;

    librosAMostrar.forEach(libro => {
      const li = document.createElement("li");
      li.textContent = libro;

      const btn = document.createElement("button");
      btn.textContent = "Reservar";

      btn.addEventListener("click", () => {
        librosPrestados.push(libro);
        librosDisponibles = librosDisponibles.filter(l => l !== libro);
        renderizar(filtro);
      });

      li.appendChild(btn);
      listaLibros.appendChild(li);
    });

    // Mostrar prestados
    librosPrestados.forEach(libro => {
      const li = document.createElement("li");
      li.textContent = libro;

      const btn = document.createElement("button");
      btn.textContent = "Devolver";

      btn.addEventListener("click", () => {
        librosDisponibles.push(libro);
        librosPrestados = librosPrestados.filter(l => l !== libro);
        renderizar(filtro);
      });

      li.appendChild(btn);
      misPrestamos.appendChild(li);
    });
  }

  renderizar();

  busquedaLibro.addEventListener("input", () => {
    renderizar(busquedaLibro.value);
  });
}
// --- Logout ---
const panel = document.querySelector(".panel-container");

if (panel) {
  let logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) {
    const btn = document.createElement("button");
    btn.id = "logoutBtn";
    btn.textContent = "Cerrar sesión";
    btn.style.marginTop = "20px";

    btn.addEventListener("click", () => {

  localStorage.removeItem("rol");   // 🔥 BORRA LA SESIÓN
  window.location.href = "login.html";

});


    panel.appendChild(btn);
  }
}

console.log("JS funcionando en panel alumno");

// logout y bienvenida en panel alumno
document.addEventListener("DOMContentLoaded", function () {

  const lista = document.getElementById("listaReservasPanel");

  if (!lista) return;

  const usuario = localStorage.getItem("usuario");
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reservasUsuario = reservas.filter(reserva => reserva.usuario === usuario);

  if (reservasUsuario.length === 0) {
    lista.innerHTML = "<li>No tenés reservas</li>";
    return;
  }

  reservasUsuario.forEach(reserva => {
    const li = document.createElement("li");
    li.textContent = `${reserva.libro} - ${reserva.estado}`;
    lista.appendChild(li);
  });

});

document.addEventListener("DOMContentLoaded", function () {

  const bienvenida = document.getElementById("bienvenida");
  const logoutBtn = document.getElementById("logoutBtn");

  if (bienvenida) {
    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      bienvenida.textContent = "Bienvenido, " + usuario;
    } else {
      bienvenida.textContent = "No hay usuario logueado";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      localStorage.removeItem("reservas");
      window.location.href = "login.html";
    });
  }

});

document.addEventListener("DOMContentLoaded", function () {

  const usuario = localStorage.getItem("usuario");

  // 🔒 Bloquear acceso si no está logueado
  if (!usuario && (
    window.location.pathname.includes("panel_alumno.html") ||
    window.location.pathname.includes("mis_reservas.html")
  )) {
    window.location.href = "login.html";
  }

  // 🔁 Evitar volver al login si ya está logueado
  if (usuario && window.location.pathname.includes("login.html")) {
    window.location.href = "panel_alumno.html";
  }

});
