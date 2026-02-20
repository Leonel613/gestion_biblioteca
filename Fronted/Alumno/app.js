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
  window.location.href = "panel_bibliotecario.html";
} 
else if (email === "alumno@cudi.com" && password === "1234") {
  window.location.href = "panel_alumno.html";
} 
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

  function renderizar() {
    listaLibros.innerHTML = "";
    misPrestamos.innerHTML = "";

    // Mostrar disponibles
    librosDisponibles.forEach(libro => {
      const li = document.createElement("li");
      li.textContent = libro;

      const btn = document.createElement("button");
      btn.textContent = "Reservar";

      btn.addEventListener("click", () => {
        librosPrestados.push(libro);
        librosDisponibles = librosDisponibles.filter(l => l !== libro);
        renderizar();
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
        renderizar();
      });

      li.appendChild(btn);
      misPrestamos.appendChild(li);
    });
  }

  renderizar();

  busquedaLibro.addEventListener("input", () => {
    const filtro = busquedaLibro.value.toLowerCase();

    listaLibros.innerHTML = "";

    librosDisponibles
      .filter(libro => libro.toLowerCase().includes(filtro))
      .forEach(libro => {
        const li = document.createElement("li");
        li.textContent = libro;

        const btn = document.createElement("button");
        btn.textContent = "Reservar";

        btn.addEventListener("click", () => {
          librosPrestados.push(libro);
          librosDisponibles = librosDisponibles.filter(l => l !== libro);
          renderizar();
        });

        li.appendChild(btn);
        listaLibros.appendChild(li);
      });
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
      window.location.href = "login.html";
    });

    panel.appendChild(btn);
  }
}

console.log("JS funcionando en panel alumno");
