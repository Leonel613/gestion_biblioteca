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

// --- Lógica del login (solo si existe el formulario) ---
const loginForm = document.getElementById("loginForm");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const recoverContainer = document.getElementById("recoverContainer");
const recoverForm = document.getElementById("recoverForm");

function validarEmail(valor) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(valor);
}

function limpiarErroresLogin() {
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("loginGeneralError").textContent = "";
}

function limpiarErroresRecupero() {
  document.getElementById("recoverEmailError").textContent = "";
  document.getElementById("recoverMessage").textContent = "";
}

if (loginForm) {
  console.log("Formulario detectado");

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    limpiarErroresLogin();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    let valid = true;

    if (!email) {
      document.getElementById("emailError").textContent = "El correo es obligatorio.";
      valid = false;
    } else if (!validarEmail(email)) {
      document.getElementById("emailError").textContent = "Ingresá un correo válido.";
      valid = false;
    }

    if (!password) {
      document.getElementById("passwordError").textContent = "La contraseña es obligatoria.";
      valid = false;
    } else if (password.length < 4) {
      document.getElementById("passwordError").textContent = "La contraseña debe tener al menos 4 caracteres.";
      valid = false;
    }

    if (!valid) {
      return;
    }

    if (email === "admin@cudi.com" && password === "1234") {
      localStorage.setItem("rol", "bibliotecario");
      localStorage.setItem("usuario", email);
      alert("Panel bibliotecario en desarrollo por tu compañera. Redirigiendo al inicio.");
      window.location.href = "index.html";
      return;
    }

    if (email === "alumno@cudi.com" && password === "1234") {
      localStorage.setItem("rol", "alumno");
      localStorage.setItem("usuario", email);
      window.location.href = "panel_alumno.html";
      return;
    }

    document.getElementById("loginGeneralError").textContent = "Correo o contraseña incorrectos.";
  });
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function() {
    if (recoverContainer) {
      recoverContainer.classList.remove("hidden");
      loginForm.classList.add("hidden");
      limpiarErroresLogin();
    }
  });
}

if (recoverForm) {
  recoverForm.addEventListener("submit", function(e) {
    e.preventDefault();
    limpiarErroresRecupero();

    const email = document.getElementById("recoverEmail").value.trim();
    if (!email) {
      document.getElementById("recoverEmailError").textContent = "El correo es obligatorio.";
      return;
    }

    if (!validarEmail(email)) {
      document.getElementById("recoverEmailError").textContent = "Ingresá un correo válido.";
      return;
    }

    document.getElementById("recoverMessage").textContent = "Si el correo existe, recibirás instrucciones de recuperación.";
    document.getElementById("recoverMessage").style.color = "#1d8348";
  });
}

const cancelRecover = document.getElementById("cancelRecover");
if (cancelRecover) {
  cancelRecover.addEventListener("click", function() {
    if (recoverContainer) {
      recoverContainer.classList.add("hidden");
      if (loginForm) loginForm.classList.remove("hidden");
      limpiarErroresRecupero();
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

  const lista = document.getElementById("listaReservasPanel");
  const listaCompleta = document.getElementById("listaReservas");

  if (lista || listaCompleta) {
    const usuario = localStorage.getItem("usuario");
    let reservas = [];
    try {
      reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      localStorage.removeItem("reservas");
    }

    const reservasUsuario = reservas.filter(reserva => reserva.usuario === usuario);

    if (lista) {
      if (reservasUsuario.length === 0) {
        lista.innerHTML = "<li>No tenés reservas</li>";
      } else {
        lista.innerHTML = "";
        reservasUsuario.forEach(reserva => {
          const li = document.createElement("li");
          li.textContent = `${reserva.libro} - ${reserva.estado}`;
          lista.appendChild(li);
        });
      }
    }

    function renderizarReservas(reservasMostrar) {
      if (!listaCompleta) return;

      if (reservasMostrar.length === 0) {
        listaCompleta.innerHTML = "<p>No tenés reservas aún.</p>";
        return;
      }

      listaCompleta.innerHTML = "";
      reservasMostrar.forEach(reserva => {
        const div = document.createElement("div");
        div.classList.add("reserva");

        div.innerHTML = `
          <h3>${reserva.libro}</h3>
          <p>Autor: ${reserva.autor}</p>
          <p>Fecha: ${reserva.fecha}</p>
          <p>Estado: ${reserva.estado}</p>
          <button class="cancelar-btn">Cancelar</button>
        `;

        const boton = div.querySelector(".cancelar-btn");
        boton.addEventListener("click", function () {
          const indiceGlobal = reservas.findIndex(r =>
            r.usuario === reserva.usuario &&
            r.libro === reserva.libro &&
            r.autor === reserva.autor &&
            r.fecha === reserva.fecha
          );

          if (indiceGlobal > -1) {
            reservas.splice(indiceGlobal, 1);
            localStorage.setItem("reservas", JSON.stringify(reservas));
            location.reload();
          }
        });

        listaCompleta.appendChild(div);
      });
    }

    const fechaDesde = document.getElementById("fechaDesde");
    const fechaHasta = document.getElementById("fechaHasta");
    const aplicarFiltro = document.getElementById("aplicarFiltro");
    const limpiarFiltro = document.getElementById("limpiarFiltro");
    const mensajeFecha = document.getElementById("mensajeFecha");

    function parsearFecha(valor) {
      if (!valor) return null;
      const fecha = new Date(valor);
      fecha.setHours(0, 0, 0, 0);
      return fecha;
    }

    function aplicarFiltroFechas() {
      mensajeFecha.textContent = "";
      const desde = parsearFecha(fechaDesde?.value);
      const hasta = parsearFecha(fechaHasta?.value);

      if (desde && hasta && desde > hasta) {
        mensajeFecha.textContent = "La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.";
        return;
      }

      let reservasFiltradas = reservasUsuario.slice();

      if (desde) {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
          const fechaReserva = parsearFecha(reserva.fecha);
          return fechaReserva && fechaReserva >= desde;
        });
      }

      if (hasta) {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
          const fechaReserva = parsearFecha(reserva.fecha);
          return fechaReserva && fechaReserva <= hasta;
        });
      }

      renderizarReservas(reservasFiltradas);
    }

    if (aplicarFiltro) {
      aplicarFiltro.addEventListener("click", aplicarFiltroFechas);
    }

    if (limpiarFiltro) {
      limpiarFiltro.addEventListener("click", function () {
        if (fechaDesde) fechaDesde.value = "";
        if (fechaHasta) fechaHasta.value = "";
        mensajeFecha.textContent = "";
        renderizarReservas(reservasUsuario);
      });
    }

    if (listaCompleta) {
      renderizarReservas(reservasUsuario);
    }
  }

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

  const usuario = localStorage.getItem("usuario");

  // 🔒 Bloquear acceso si no está logueado
  if (!usuario && window.location.pathname.includes("panel_alumno.html")) {
    window.location.href = "login.html";
  }

  // 🔁 Evitar volver al login si ya está logueado
  if (usuario && window.location.pathname.includes("login.html")) {
    window.location.href = "panel_alumno.html";
  }

});
