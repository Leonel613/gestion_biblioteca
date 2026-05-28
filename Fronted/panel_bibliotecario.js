document.addEventListener("DOMContentLoaded", () => {

  //  PROTECCIÓN ÚNICA Y SEGURA
  const raw = localStorage.getItem("usuario");

  let usuario = null;

  try {
    usuario = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log("LocalStorage corrupto, limpiando...");
    localStorage.removeItem("usuario");
  }

  if (!usuario || usuario.rol !== "bibliotecario") {
    window.location.href = "login.html";
    return;
  }

  // cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "login.html";
  }
  
  // MENU PERFIL
  const perfil = document.getElementById("perfil");
  const menu = document.getElementById("menuPerfil");
  

  if (perfil && menu) {
    perfil.addEventListener("click", () => {
      menu.classList.toggle("activo");
    });

    document.addEventListener("click", (e) => {
      if (!perfil.contains(e.target)) {
        menu.classList.remove("activo");
      }
    });
  }

  // LOGOUT
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
    cerrarSesion();
   });
  }

  // 👉 cargar libros al entrar
    cargarLibros();
});


// 🔢 PAGINACIÓN
let paginaActual = 1;
const filasPorPagina = 10;


// 📚 DATOS
let libros = [];
let librosOriginales = [];
let librosFiltrados = [];

function validarCampo(valor, tipo) {
  if (!tipo) return true;

  const v = valor.trim();

  switch (tipo) {
   case "textoLibre":
    return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s().,:;\-+ª]+$/.test(v);

    case "letras":
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v);

    case "numeros":
      return /^\d+$/.test(v);

    case "numerosOpcional":
      //  permite números o guiones
      return /^[0-9-]+$/.test(v);

    case "proveedor":
      return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s().,:;\-]+$/.test(v);

    default:
      return true;
  }
}

//  ESQUEMA (ORDEN DE COLUMNAS)
const esquemaLibro = {
  titulo: "textoLibre",
  autor: "textoLibre",
  editorial: "textoLibre",
  anio: "numeros",
  edicion: "numerosOpcional",
  categoria: "letras",
  total: "numeros",
  disponible: "numeros",
  prestados: "numeros",
  reservados: "numeros",
  proveedor: "proveedor"
};

async function cargarLibros() {
  try {
    const res = await fetch("http://localhost:3000/libros");

    if (!res.ok) {
      throw new Error("Error en la API");
    }

    const data = await res.json();

    // 🔥 sistema correcto
    librosOriginales = data;
    librosFiltrados = [...data];

    mostrarLibros(); // 👈 esta ya hace TODO

  } catch (error) {
    console.error(error);
    alert("Error al cargar libros");
  }
}


// 📚 LIBROS
function mostrarLibros() {
  const contenedor = document.getElementById("contenidoPanel");

  const totalPaginas = Math.ceil(librosFiltrados.length / filasPorPagina) || 1;

   if (paginaActual > totalPaginas) {
  paginaActual = totalPaginas;
  }

  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  const librosPagina = librosFiltrados.slice(inicio, fin);

  let filas = "";

  librosPagina.forEach((libro, index) => {
    const indexReal = inicio + index;

    filas += `
       <tr data-id="${libro._id}">
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.editorial}</td>
        <td>${libro.anio}</td>
        <td>${libro.edicion}</td>
        <td>${libro.categoria}</td>
        <td>${libro.total}</td>
        <td>${libro.disponible}</td>
        <td>${libro.prestados}</td>
        <td>${libro.reservados}</td>
        <td>${formatearFecha(libro.ingreso)}</td>
        <td>${libro.proveedor}</td>
        <td>
          <button onclick="editarFila(this)">✏️</button>
          <button onclick="eliminarFila(this)">🗑️</button>
        </td>
      </tr>
    `;
  });

    contenedor.innerHTML = `
  <div class="tarjeta">
    <h2>Catálogo de Libros</h2>

    <!-- 🔝 BARRA SUPERIOR -->
    <div class="barra-acciones" style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">

      <button class="btn-agregar" onclick="formAgregarLibro()">+ Agregar libro</button>

      <!-- FILTRO -->
      <button id="btnFiltro" class="btn-agregar">Filtrar</button>

      <div id="opcionesFiltro" style="display:none;">
        <button id="ordenAZ" class="btn-secundario">Orden A-Z</button>
        <button id="ordenZA" class="btn-secundario">Orden Z-A</button>
      </div>

      <!-- ✅ CATEGORÍAS (ARREGLADO) -->
      <div class="dropdown">
        <button id="btnCategorias" class="btn-agregar">Categorías</button>
        <div id="listaCategorias" class="dropdown-menu"></div>
      </div>

      <!-- VOLVER -->
      <button id="btnVolver" class="btn-secundario" style="display:none;">
        ⬅ Volver al catálogo
      </button>

    </div>

    <!-- 📊 TABLA -->
    <div class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Editorial</th>
            <th>Año</th>
            <th>Edición</th>
            <th>Categoría</th>
            <th>Total</th>
            <th>Disponible</th>
            <th>Prestados</th>
            <th>Reservados</th>
            <th>Fecha de Ingreso</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          ${filas || `<tr><td colspan="13">No hay libros cargados</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- 📄 PAGINACIÓN -->
    <div class="paginacion">
      <button onclick="cambiarPagina(-1)">⬅</button>
      <span>Página ${paginaActual} de ${totalPaginas}</span>
      <button onclick="cambiarPagina(1)">➡</button>
    </div>

  </div>
`;
// 👇 asegurar que arranque cerrado SIEMPRE
  document.getElementById("listaCategorias").style.display = "none";
  document.getElementById("opcionesFiltro").style.display = "none";
 // 🔽 toggle filtro
const btnFiltro = document.getElementById("btnFiltro");
const opcionesFiltro = document.getElementById("opcionesFiltro");

btnFiltro.addEventListener("click", (e) => {
  e.stopPropagation();

  opcionesFiltro.style.display =
    opcionesFiltro.style.display === "flex" ? "none" : "flex";
});

// 🔽 toggle categorías (DROPDOWN PRO)
const btnCategorias = document.getElementById("btnCategorias");
const listaCategorias = document.getElementById("listaCategorias");

btnCategorias.addEventListener("click", (e) => {
  e.stopPropagation(); // 🔥 evita cierre instantáneo

  listaCategorias.style.display =
    listaCategorias.style.display === "flex" ? "none" : "flex";
});

// 🔽 cerrar TODO si hacés click afuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    listaCategorias.style.display = "none";
  }

  if (!e.target.closest("#btnFiltro") && !e.target.closest("#opcionesFiltro")) {
    opcionesFiltro.style.display = "none";
  }
});
// 🔤 ORDEN A-Z
document.getElementById("ordenAZ").addEventListener("click", () => {
  librosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  paginaActual = 1;
  mostrarLibros();
});
// 🔠 ORDEN Z-A
document.getElementById("ordenZA").addEventListener("click", () => {
  librosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
  paginaActual = 1;
  mostrarLibros();
});
// 🔙 volver al catálogo
document.getElementById("btnVolver").addEventListener("click", () => {
  librosFiltrados = [...librosOriginales];
  paginaActual = 1;
  mostrarLibros();
});
// 👇 generar categorías
renderCategorias();
}

// Funciones de tabla libros
function editarFila(boton) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  const columnas = [
    "titulo",
    "autor",
    "editorial",
    "anio",
    "edicion",
    "categoria",
    "total",
    "disponible",
    "prestados",
    "reservados",
    "proveedor"
  ];

  celdas.forEach((celda, index) => {
    // última columna = botones
    if (index === celdas.length - 1) return;

    // fecha no editable
    if (index === 10) return;

    const texto = celda.innerText;
    const campo = columnas[index];

    celda.innerHTML = `<input type="text" data-campo="${campo}" value="${texto}">`;
  });

  const celdaBotones = boton.parentElement;

  celdaBotones.innerHTML = `
    <button class="guardar">💾</button>
    <button class="cancelar">❌</button>
  `;

  const btnGuardar = celdaBotones.querySelector(".guardar");
  const btnCancelar = celdaBotones.querySelector(".cancelar");

  btnGuardar.disabled = true;

  btnGuardar.addEventListener("click", () => guardarFila(btnGuardar));
  btnCancelar.addEventListener("click", () => cancelarEdicion(btnCancelar));

  activarValidacionEdicion(fila, btnGuardar);
}

function renderCategorias() {
  const contenedor = document.getElementById("listaCategorias");

  contenedor.innerHTML = "";

  const categoriasUnicas = [...new Set(librosOriginales.map(l => l.categoria))];

  categoriasUnicas.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.add("btn-secundario");

    btn.onclick = () => {
      librosFiltrados = librosOriginales.filter(l => l.categoria === cat);
      paginaActual = 1;
      document.getElementById("listaCategorias").style.display = "none";
      mostrarLibros();

      // 👇 mostrar botón volver DESPUÉS del render
      setTimeout(() => {
        document.getElementById("btnVolver").style.display = "inline-block";
      }, 0);
    };

    contenedor.appendChild(btn);
  });

  // botón volver
  document.getElementById("btnVolver").onclick = () => {
    librosFiltrados = [...librosOriginales];
    paginaActual = 1;
    mostrarLibros();
  };
}
//funcion para validar datos editados antes de guardar
 function activarValidacionEdicion(fila, boton) {
  const inputs = fila.querySelectorAll("input");

  function validar() {
    let valido = true;

    inputs.forEach(input => {
      input.style.border = "1px solid #ccc";

      const campo = input.dataset.campo;
      const tipo = esquemaLibro[campo];

      if (!validarCampo(input.value, tipo)) {
        input.style.border = "2px solid red";
        valido = false;
      }
    });

    boton.disabled = !valido;
  }

  inputs.forEach(input => input.addEventListener("input", validar));

  validar();
}

async function guardarFila(boton) {
  const fila = boton.closest("tr");
  const id = fila.dataset.id;

  const inputs = fila.querySelectorAll("input");
  if (inputs.length === 0) return;

  let valido = true;

  // reset bordes
  inputs.forEach(input => {
    input.style.border = "1px solid #ccc";
  });

  // ARMADO DINÁMICO DEL OBJETO (ESTO ES LO IMPORTANTE)
  const libroActualizado = {};

  inputs.forEach(input => {
    const campo = input.dataset.campo;
    const tipo = esquemaLibro[campo];

    if (!validarCampo(input.value, tipo)) {
      input.style.border = "2px solid red";
      valido = false;
    }

    // guardar valor igual (aunque sea válido lo necesitamos)
    libroActualizado[campo] = input.value;
  });

  if (!valido) {
    alert("⚠️ Revisá los campos en rojo");
    return;
  }

  //  conversión de tipos (IMPORTANTE)
  libroActualizado.anio = Number(libroActualizado.anio);
  libroActualizado.edicion = Number(libroActualizado.edicion);
  libroActualizado.total = Number(libroActualizado.total);
  libroActualizado.disponible = Number(libroActualizado.disponible);
  libroActualizado.prestados = Number(libroActualizado.prestados);
  libroActualizado.reservados = Number(libroActualizado.reservados);

  // mantener fecha original
  libroActualizado.ingreso = new Date(
    convertirFechaAISO(fila.children[10].innerText)
  );

  try {
    const res = await fetch(`http://localhost:3000/libros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(libroActualizado)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al actualizar");
      return;
    }

    alert("✔ Cambios guardados");
    cargarLibros();

  } catch (err) {
    console.error(err);
    alert("Error de conexión");
  }
}


// FUNCIONES PARA VALIDACIONES DE CAMPOS 
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function convertirFechaAISO(fechaTexto) {
  const [dia, mes, anio] = fechaTexto.split("/");
  return `${anio}-${mes}-${dia}`;
}

function cancelarEdicion(boton) {
  cargarLibros(); // recarga todo desde DB
}

async function eliminarFila(boton) {
  const fila = boton.closest("tr");
  const id = fila.dataset.id;

  const confirmar = confirm("Este registro se borra permanente de la base de datos, ¿Estas seguro de  Eliminar este libro?");
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/libros/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Error al eliminar");
      return;
    }

    // 🔄 recargar desde DB
    await cargarLibros();

  } catch (error) {
    console.error(error);
    alert("Error de conexión");
  }
}


async function guardarEdicion(id, datos) {
  try {
    await fetch(`http://localhost:3000/libros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    await cargarLibros();

  } catch (error) {
    console.error(error);
    alert("Error al editar");
  }
}

async function eliminarLibro(id) {
  try {
    const res = await fetch(`http://localhost:3000/libros/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Error al eliminar");
      return;
    }

    alert("🗑 Libro eliminado");

    cargarLibros(); // 🔥 vuelve a pedir a la DB

  } catch (error) {
    console.error(error);
    alert("Error de conexión");
  }
}

async function editarLibro(id, datosActualizados) {
  try {
    const res = await fetch(`http://localhost:3000/libros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosActualizados)
    });

    if (!res.ok) {
      alert("Error al editar");
      return;
    }

    alert("✏️ Libro actualizado");

    cargarLibros();

  } catch (error) {
    console.error(error);
  }
}

// 🔄 CAMBIAR PÁGINA
function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(libros.length / filasPorPagina);

  paginaActual += direccion;

  if (paginaActual < 1) paginaActual = 1;
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  mostrarLibros();
}

// ➕ FORMULARIO LIBRO
function formAgregarLibro() {
  const contenedor = document.getElementById("contenidoPanel");

  contenedor.innerHTML = `
    <div class="tarjeta">
      <h2>Agregar Libro</h2>

      <input data-campo="titulo" placeholder="Título">
      <input data-campo="autor" placeholder="Autor">
      <input data-campo="editorial" placeholder="Editorial">
      <input data-campo="anio" placeholder="Año de publicación">
      <input data-campo="edicion" placeholder="N° Edición">
      <input data-campo="categoria" placeholder="Categoría">
      <input data-campo="total" placeholder="Cantidad total">
      <input data-campo="proveedor" placeholder="Proveedor">

      <input id="fecha" disabled>

      <button id="btnGuardar">Guardar libro</button>
    </div>
  `;
  // fecha validandose en database
  const fechaInput = document.getElementById("fecha");
  fechaInput.value = new Date().toISOString().split("T")[0];

  const inputs = contenedor.querySelectorAll("input[data-campo]");
  const btnGuardar = document.getElementById("btnGuardar");

  function validarFormulario() {
    let valido = true;

    inputs.forEach(input => {
      console.log("BOTÓN GUARDAR CREADO");
      const campo = input.dataset.campo;
      const tipo = esquemaLibro[campo];

      const valor = input.value.trim();

      //  SOLO valida si hay algo escrito
      if (valor.length > 0 && !validarCampo(valor, tipo)) {
        input.style.border = "2px solid red";
        valido = false;
      } else {
        input.style.border = "1px solid #ccc";
      }

      //  si está vacío también invalida el submit final
      if (valor.length === 0) {
        valido = false;
      }
    });

    btnGuardar.disabled = !valido;
  }

  inputs.forEach(input => {
    input.addEventListener("input", validarFormulario);
  });


  btnGuardar.addEventListener("click", crearLibro);
}

async function crearLibro() {
  const inputs = document.querySelectorAll("#contenidoPanel input[data-campo]");

  let valido = true;
  const datos = {};

  inputs.forEach(input => {
    const campo = input.dataset.campo;
    const tipo = esquemaLibro[campo];

    if (!input.value.trim()) {
      input.style.border = "2px solid red";
      valido = false;
      return;
    }

    // VALIDACIÓN ESPECIAL edicion (- permitido solo ahí)
    if (campo === "edicion") {
      if (!/^\d+$|^-+$/.test(input.value)) {
        input.style.border = "2px solid red";
        valido = false;
        return;
      }
    } else {
      if (!validarCampo(input.value, tipo)) {
        input.style.border = "2px solid red";
        valido = false;
        return;
      }
    }

    input.style.border = "1px solid #ccc";
    datos[campo] = input.value;
  });

  if (!valido) {
    alert("⚠️ Revisá los campos en rojo");
    return;
  }

  const nuevoLibro = {
    ...datos,
    anio: Number(datos.anio),
    edicion: datos.edicion,
    total: Number(datos.total),
    disponible: Number(datos.total),
    prestados: 0,
    reservados: 0,
    ingreso: new Date().toISOString().split("T")[0]
  };

  try {
    const res = await fetch("http://localhost:3000/libros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoLibro)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al crear libro");
      return;
    }

    alert("✔ Libro agregado correctamente");

    inputs.forEach(i => i.value = "");

    await cargarLibros();

  } catch (err) {
    console.error(err);
    alert("❌ Error de conexión con el servidor");
  }
}

function activarValidacion() {
  const inputs = document.querySelectorAll("#contenidoPanel input");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const campo = input.dataset.campo;
      const tipo = esquemaLibro[campo];

      if (!validarCampo(input.value, tipo)) {
        input.style.border = "2px solid red";
      } else {
        input.style.border = "1px solid #ccc";
      }
    });
  });
}

// 👤 USUARIO
const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const usuarios = [];

// funcion para quitar color rojo en campos vacios
function activarValidacionEnVivo() {
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.style.border = "1px solid #ccc";
    });
  });
}

function mostrarCrearUsuario() {
  document.getElementById("contenidoPanel").innerHTML = `
     <div class="tarjeta tarjeta-formulario">
      <h2>Crear usuario</h2>

      <input id="nombre" placeholder="Nombre">
      <input id="apellido" placeholder="Apellido">
      <input id="dni" placeholder="DNI (sin puntos)">
      <input id="curso" placeholder="Curso">
      <input id="division" placeholder="División">
      <input id="turno" placeholder="Turno">

      <input id="email" placeholder="Email">
      <div id="mensajeSistema"></div>

      <button id="btnCrear" onclick="crearUsuario()">Crear usuario</button>
    </div>
  `;
  activarValidacionEnVivo();
}
async function crearUsuario() {

  let valido = true;

  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const turno = document.getElementById("turno");
  const curso = document.getElementById("curso");
  const division = document.getElementById("division");
  const email = document.getElementById("email");
  const dni = document.getElementById("dni");

  let dniValue = dni.value.trim().replace(/\D/g, "");
  dni.value = dniValue;

  const emailValue = email.value.trim().toLowerCase();

  const campos = [nombre, apellido, dni, turno, curso, division];

  // reset
  campos.forEach(c => c.style.border = "1px solid #ccc");

  // vacíos
  campos.forEach(c => {
    if (c.value.trim() === "") {
      c.style.border = "2px solid red";
      valido = false;
    }
  });

  // letras
  [nombre, apellido, turno].forEach(c => {
    if (c.value.trim() !== "" && !soloLetras.test(c.value)) {
      c.style.border = "2px solid red";
      valido = false;
    }
  });

  // DNI (ÚNICA validación real)
  if (!dniValue) {
    dni.style.border = "2px solid red";
    valido = false;
  } else if (dniValue.length < 3 || dniValue.length > 20) {
    dni.style.border = "2px solid red";
    valido = false;
  }

  // email opcional
  const emailValido = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (emailValue && !emailValido.test(emailValue)) {
    email.style.border = "2px solid red";
    valido = false;
  }

  if (!valido) return;

  const nuevoUsuario = {
    nombre: nombre.value.trim().toLowerCase(),
    apellido: apellido.value.trim().toLowerCase(),
    dni: dniValue,
    curso: curso.value.trim(),
    division: division.value.trim(),
    turno: turno.value.trim().toLowerCase(),
    email: emailValue || null,
    activo: false
  };

  try {
    const response = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("btnCrear").style.display = "none";
      document.getElementById("mensajeSistema").innerHTML = `
        ⚠️ Ya existe un usuario con este DNI.<br>
        <button onclick="cancelarRegistro()">Cancelar</button>
        <button onclick="recuperarCuenta()">Recuperar cuenta</button>
      `;
      return;
    }

    alert("Usuario creado correctamente");
    campos.forEach(c => c.value = "");
    document.getElementById("mensajeSistema").innerHTML = "";

  } catch (error) {
    console.error(error);
    alert("Error servidor");
  }
}
function cancelarRegistro() {
  const campos = document.querySelectorAll("#contenidoPanel input");
  campos.forEach(c => c.value = "");

  document.getElementById("btnCrear").style.display = "block";
  document.getElementById("mensajeSistema").innerHTML = "";
}

function recuperarCuenta() {
  alert("📩 Te enviamos los pasos para recuperar tu cuenta, revisa tu email");
}

// 🔔 NOTIFICACIONES
function mostrarNotificaciones() {
  const contenedor = document.getElementById("contenidoPanel");

  contenedor.innerHTML = `
    <div class="notif-wrapper">

      <div class="notif-box">
        <h3>Préstamos a confirmar</h3>

        <table class="notif-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Turno</th>
              <th>Préstamo</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody id="tablaPrestamos"></tbody>
        </table>
      </div>

      <div class="notif-box">
        <h3>Devoluciones</h3>

        <table class="notif-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Turno</th>
              <th>Préstamo</th>
              <th>Fecha</th>
              <th>Devolución</th>
              <th>Estado</th>
              <th>Comentarios</th>
              <th>Confirma</th>
             
            </tr>
          </thead>
          <tbody id="tablaDevoluciones"></tbody>
        </table>
    </div>
</div> 

    <div class="historial-container">
    <button class="btn-historial" onclick="toggleHistorial()">
    Ver historial
   </button>
</div>

<div id="panelHistorial" class="panel-historial oculto">
  <h3>Historial de movimientos</h3>

  <table class="notif-table">
   <thead>
   <tr>
    <th>Alumno</th>
    <th>Curso</th>
    <th>Turno</th>
    <th>Prestamo</th>
    <th>Fecha</th>
    <th>Devolución</th>
    <th>Comentarios</th>
   </tr>
  </thead>
    <tbody id="tablaHistorial"></tbody>
  </table>

  <button class="btn-pdf" onclick="imprimirPDF()">Imprimir PDF</button>
 </div>
  `;

  //  Conexion de filas de aprobar prestamos con base de datos
 fetch("http://localhost:3000/prestamos?estado=pendiente")
  .then(res => res.json())
  .then(data => {
    data.forEach(p => {
      agregarPrestamo({
        alumno: p.usuario?.nombre
          ? p.usuario.nombre + " " + p.usuario.apellido
          : "Sin usuario",
        curso: p.usuario?.curso || "-",
        turno: p.usuario?.turno || "-",
        libro: p.libro || "Sin libro",
        id: p._id
      });
    });

    agregarDevolucion({
      alumno: "López Carlos",
      curso: "6°",
      turno: "Mañana",
      libro: "Historia",
      fecha: "10/06/2026",
      fechaDevolucion: "20/06/2026"
    });
  }); 
}

function agregarPrestamo(data) {
  const tabla = document.getElementById("tablaPrestamos");

  const fila = document.createElement("tr");

 fila.dataset.id = data.id;
 fila.innerHTML = `
  <td>${data.alumno}</td>
  <td>${data.curso}</td>
  <td>${data.turno}</td>
  <td>${data.libro}</td>
  <td>${data.fechaSolicitud ? new Date(data.fechaSolicitud).toLocaleDateString() : ""}</td>
  <td>
    <button class="notif-btn" onclick="aprobarPrestamo(this)">
      Confirmar
    </button>
  </td>
`;

  tabla.appendChild(fila);
}

function agregarDevolucion(data) {
  const tabla = document.getElementById("tablaDevoluciones");

  const hoy = new Date();
  const devol = new Date(data.fechaDevolucion);

  const estado = devol < hoy ? "Demorado" : "En fecha";

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${data.alumno}</td>
    <td>${data.curso}</td>
    <td>${data.turno}</td>
    <td>${data.libro}</td>
    <td>${data.fecha}</td>
    <td>${data.fechaDevolucion}</td>
    <td>${estado}</td>
    <td>
    <input class="input-comentario" placeholder="Escribir..." />
   </td>
    <td>
    <button class="notif-btn" onclick="moverAHistorial(this)">Confirmar</button></td>
   </td>
  `;

  tabla.appendChild(fila);
}


function toggleHistorial() {
  const panel = document.getElementById("panelHistorial");
  panel.classList.toggle("oculto");
}

function moverAHistorial(boton) {
  const fila = boton.closest("tr");
  const id = fila.dataset.id;

  const comentarioInput = fila.querySelector(".input-comentario");
  const comentario = comentarioInput ? comentarioInput.value : "Sin comentario";

  fetch(`http://localhost:3000/prestamos/${id}/devolver`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(data => {

    console.log("Devolución registrada:", data);

    // mover a historial UI
    const celdas = fila.querySelectorAll("td");

    const nuevaFila = document.createElement("tr");

    nuevaFila.innerHTML = `
      <td>${celdas[0].innerText}</td>
      <td>${celdas[1].innerText}</td>
      <td>${celdas[2].innerText}</td>
      <td>${celdas[3].innerText}</td>
      <td>${celdas[4].innerText}</td>
      <td>${new Date(data.fechaDevolucionReal).toLocaleDateString()}</td>
      <td>${comentario}</td>
    `;

    document.getElementById("tablaHistorial").appendChild(nuevaFila);

    fila.remove();
  })
  .catch(err => console.error(err));
}

function imprimirPDF() {
  const contenido = document.getElementById("panelHistorial").innerHTML;

  const ventana = window.open("", "", "width=800,height=600");

  ventana.document.write(`
    <html>
      <head>
        <title>Historial</title>
      </head>
      <body>
        <h2>Historial de Biblioteca</h2>
        ${contenido}
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.print();
}

function aprobarPrestamo(boton) {
  const fila = boton.closest("tr");
  const id = fila.dataset.id;

  fetch(`http://localhost:3000/prestamos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dias: 7 // después lo hacés dinámico
    })
  })
  .then(res => res.json())
  .then(data => {

    console.log("Préstamo actualizado:", data);

    // mover a devoluciones
    agregarDevolucion({
      alumno: fila.children[0].innerText,
      curso: fila.children[1].innerText,
      turno: fila.children[2].innerText,
      libro: fila.children[3].innerText,
      fecha: data.fechaPrestamo,
      fechaDevolucion: data.fechaDevolucion
    });

    fila.remove();
  })
  .catch(err => console.error(err));
}

function calcularFechaDevolucion() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 7); // 7 días de préstamo
  return fecha.toLocaleDateString();
} 

