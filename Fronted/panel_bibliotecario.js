document.addEventListener("DOMContentLoaded", () => {

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
      window.location.href = "index.html";
    });
  }

  // 👉 cargar libros al entrar
  mostrarLibros();
});


// 🔢 PAGINACIÓN
let paginaActual = 1;
const filasPorPagina = 10;


// 📚 DATOS
let libros = [
  {
    titulo: "El Principito",
    autor: "Saint-Exupéry",
    editorial: "Emecé",
    anio: 1943,
    edicion: 1,
    categoria: "Literatura",
    total: 10,
    disponible: 6,
    prestados: 2,
    reservados: 2,
    ingreso: "2024-03-10",
    proveedor: "Editorial Sur"
  },
  {
    titulo: "Matemática 3",
    autor: "Pérez",
    editorial: "Santillana",
    anio: 2020,
    edicion: 2,
    categoria: "Educativo",
    total: 8,
    disponible: 5,
    prestados: 2,
    reservados: 1,
    ingreso: "2023-08-15",
    proveedor: "Distribuidora ABC"
  }
];


// 📚 LIBROS
function mostrarLibros() {
  const contenedor = document.getElementById("contenidoPanel");

  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  const librosPagina = libros.slice(inicio, fin);

  let filas = "";

  librosPagina.forEach((libro, index) => {
    const indexReal = inicio + index;

    filas += `
      <tr data-index="${indexReal}">
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
        <td>${libro.ingreso}</td>
        <td>${libro.proveedor}</td>
        <td>
          <button onclick="editarFila(this)">✏️</button>
          <button onclick="eliminarFila(this)">🗑️</button>
        </td>
      </tr>
    `;
  });

  const totalPaginas = Math.ceil(libros.length / filasPorPagina);

  contenedor.innerHTML = `
    <div class="tarjeta">
      <h2>Catálogo de Libros</h2>

      <div class="barra-acciones">
        <button class="btn-agregar" onclick="formAgregarLibro()">+ Agregar libro</button>
      </div>

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
              <th>Ingreso</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            ${filas}
          </tbody>
        </table>
      </div>

      <div class="paginacion">
        <button onclick="cambiarPagina(-1)">⬅</button>
        <span>Página ${paginaActual} de ${totalPaginas}</span>
        <button onclick="cambiarPagina(1)">➡</button>
      </div>
    </div>
  `;
}
// Funciones de tabla libros
function editarFila(boton) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  for (let i = 0; i < celdas.length - 1; i++) {
    const texto = celdas[i].innerText;
    celdas[i].innerHTML = `<input type="text" value="${texto}">`;
  }

  boton.innerText = "💾";
  boton.onclick = function () {
    guardarFila(this);
  };
}

function guardarFila(boton) {
  const fila = boton.closest("tr");
  const index = fila.dataset.index;

  const inputs = fila.querySelectorAll("input");
  const nuevosDatos = [];

  inputs.forEach((input) => {
    const td = input.parentElement;
    td.innerText = input.value;
    nuevosDatos.push(input.value);
  });

  libros[index] = {
    titulo: nuevosDatos[0],
    autor: nuevosDatos[1],
    editorial: nuevosDatos[2],
    anio: nuevosDatos[3],
    edicion: nuevosDatos[4],
    categoria: nuevosDatos[5],
    total: nuevosDatos[6],
    disponible: nuevosDatos[7],
    prestados: nuevosDatos[8],
    reservados: nuevosDatos[9],
    ingreso: nuevosDatos[10],
    proveedor: nuevosDatos[11],
  };

  boton.innerText = "✏️";
  boton.onclick = function () {
    editarFila(this);
  };
}

function eliminarFila(boton) {
  const fila = boton.closest("tr");
  const index = fila.dataset.index;

  const confirmar = confirm("¿Eliminar este libro?");
  if (confirmar) {
    libros.splice(index, 1);
    mostrarLibros();
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

      <input id="titulo" placeholder="Título">
      <input id="autor" placeholder="Autor">
      <input id="editorial" placeholder="Editorial">
      <input id="anio" placeholder="Año de publicación">
      <input id="edicion" placeholder="N° Edición">
      <input id="categoria" placeholder="Categoría">
      <input id="total" placeholder="Cantidad total">
      <input id="proveedor" placeholder="Proveedor">
      <input id="fecha" disabled>

      <button onclick="crearLibro()">Guardar libro</button>
    </div>
  `;
  const fechaInput = document.getElementById("fecha");
  const fechaActual = new Date().toISOString().split("T")[0];
  fechaInput.value = fechaActual;
   activarValidacion();
}

function crearLibro() {
  const titulo = document.getElementById("titulo");
  const autor = document.getElementById("autor");
  const editorial = document.getElementById("editorial");
  const anio = document.getElementById("anio");
  const edicion = document.getElementById("edicion");
  const categoria = document.getElementById("categoria");
  const total = document.getElementById("total");
  const proveedor = document.getElementById("proveedor");

  let valido = true;

  // reset estilos
  document.querySelectorAll("input").forEach(input => {
    input.style.border = "1px solid #ccc";
  });

  // regex
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const soloNumeros = /^[0-9]+$/;

  // validar vacíos
  const campos = [titulo, autor, editorial, anio, edicion, categoria, total, proveedor];

  campos.forEach(campo => {
    if (!campo || campo.value.trim() === "") {
      campo.style.border = "2px solid red";
      valido = false;
    }
  });

  // validar titulo (solo que no esté vacío)
 if (titulo.value.trim().length < 2) {
  titulo.style.border = "2px solid red";
  valido = false;
 }

// validar resto con solo letras
[autor, editorial, categoria, proveedor].forEach(campo => {
  if (!soloLetras.test(campo.value)) {
    campo.style.border = "2px solid red";
    valido = false;
  }
 });

  // validar números
  [anio, edicion, total].forEach(campo => {
    if (!soloNumeros.test(campo.value)) {
      campo.style.border = "2px solid red";
      valido = false;
    }
  });

  if (!valido) {
    alert("⚠️ Revisá los campos en rojo");
    return;
  }

  // 📅 fecha automática (UNA sola vez)
  const fechaActual = new Date().toISOString().split("T")[0];

  const nuevoLibro = {
    titulo: titulo.value,
    autor: autor.value,
    editorial: editorial.value,
    anio: anio.value,
    edicion: edicion.value,
    categoria: categoria.value,
    total: total.value,
    disponible: total.value,
    prestados: 0,
    reservados: 0,
    ingreso: fechaActual,
    proveedor: proveedor.value
  };

  libros.push(nuevoLibro);

  alert("✔ Libro agregado correctamente");
  mostrarLibros();
}

function activarValidacion() {
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const soloNumeros = /^[0-9]+$/;

  const camposLetras = ["titulo", "autor", "editorial", "categoria", "proveedor"];
  const camposNumeros = ["anio", "edicion", "total"];

  camposLetras.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (!soloLetras.test(input.value)) {
        input.style.border = "2px solid red";
      } else {
        input.style.border = "1px solid #ccc";
      }
    });
  });

  camposNumeros.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      if (!soloNumeros.test(input.value)) {
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

function mostrarCrearUsuario() {
  document.getElementById("contenidoPanel").innerHTML = `
     <div class="tarjeta tarjeta-formulario">
      <h2>Crear usuario</h2>

      <input id="nombre" placeholder="Nombre">
      <input id="apellido" placeholder="Apellido">
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

function crearUsuario() {

  let valido = true;

  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const turno = document.getElementById("turno");
  const curso = document.getElementById("curso");
  const division = document.getElementById("division");
  const email = document.getElementById("email");
  const emailValue = email.value.trim().toLowerCase();

  const campos = [nombre, apellido, turno, curso, division, email];

  // 🔄 Reset bordes
  campos.forEach(c => c.style.border = "1px solid #ccc");

  // ❌ Vacíos
  campos.forEach(c => {
    if (c.value.trim() === "") {
      c.style.border = "2px solid red";
      valido = false;
    }
  });

  // 🔤 Solo letras
  [nombre, apellido, turno].forEach(c => {
    if (c.value.trim() !== "" && !soloLetras.test(c.value)) {
      c.style.border = "2px solid red";
      valido = false;
    }
  });

  // 📧 Email
  const emailValido = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/; 

  if (emailValue !== "" && !emailValido.test(emailValue)) {
    email.style.border = "2px solid red";
    valido = false;
  }

  // 🛑 cortar
  console.log("Valido:", valido);
  if (!valido) {
    return;
  }

  // ✅ CREAR USUARIO
  const nuevoUsuario = {
  nombre: nombre.value.trim().toLowerCase(),
  apellido: apellido.value.trim().toLowerCase(),
  curso: curso.value.trim(),
  division: division.value.trim(),
  turno: turno.value.trim().toLowerCase(),
  email: emailValue
};

// 🔍 BUSCAR SIMILARES
const iguales = buscarUsuariosIguales(nuevoUsuario);

// 🚫 SI EXISTEN
if (iguales.length > 0) {
  document.getElementById("btnCrear").style.display = "none";
  document.getElementById("mensajeSistema").innerHTML = `
    ⚠️ Ya existe un usuario con este nombre y email.<br>
    ¿Querés recuperar la contraseña?
    <br><br>
    <button onclick="cancelarRegistro()">Cancelar</button>
    <button onclick="recuperarCuenta()">Recuperar cuenta</button>
  `;
  return;
}

// ✅ GUARDAR
usuarios.push(nuevoUsuario);

console.log(usuarios);

alert("✔ Usuario creado correctamente. Revisá tu email 📩");

// 🧹 limpiar
campos.forEach(c => c.value = "");
document.getElementById("mensajeSistema").innerHTML = "";
}

function cancelarRegistro() {
  const campos = document.querySelectorAll("#contenidoPanel input");
  campos.forEach(c => c.value = "");

  document.getElementById("btnCrear").style.display = "";
  document.getElementById("mensajeSistema").innerHTML = "";
}


function recuperarCuenta() {
  alert("📩 Enviando recuperación de cuenta (simulado)");
}

function buscarUsuariosIguales(nuevo) {
  return usuarios.filter(u =>
    u.nombre.toLowerCase() === nuevo.nombre.toLowerCase() &&
    u.apellido.toLowerCase() === nuevo.apellido.toLowerCase() &&
    u.email === nuevo.email
  );
}


function activarValidacionEnVivo() {

  const campos = document.querySelectorAll("#contenidoPanel input");

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  campos.forEach(campo => {

    campo.addEventListener("input", () => {

      let valido = true;

      // vacío
      if (campo.value.trim() === "") {
        campo.style.border = "1px solid #ccc";
        return;
      }

      // solo letras
      if (["nombre", "apellido", "turno"].includes(campo.id)) {
        if (campo.value.trim() !== "" && !soloLetras.test(campo.value)) {
          valido = false;
        }
      }

      // email
     if (campo.id === "email") {
       const valor = campo.value.trim();

       if (valor === "") {
    campo.style.border = "1px solid #ccc";
    return;
        }

       if (!emailValido.test(valor)) {
    valido = false;
       }
    }

      // 🎯 CLAVE: esto ahora sí reacciona BIEN
      campo.style.border = valido ? "2px solid green" : "2px solid red";
    });

  });
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

  // 👉 DATOS DE PRUEBA (para que veas filas)
  agregarPrestamo({
    alumno: "Gómez Juan",
    curso: "5°",
    turno: "Mañana",
    libro: "El Principito"
  });

  agregarPrestamo({
    alumno: "Pérez Ana",
    curso: "4°",
    turno: "Tarde",
    libro: "Matemática 3"
  });

  agregarDevolucion({
    alumno: "López Carlos",
    curso: "6°",
    turno: "Mañana",
    libro: "Historia",
    fecha: "10/06/2026",
    fechaDevolucion: "20/06/2026"
  });
}

function agregarPrestamo(data) {
  const tabla = document.getElementById("tablaPrestamos");

  const fila = document.createElement("tr");

 fila.innerHTML = `
  <td>${data.alumno}</td>
  <td>${data.curso}</td>
  <td>${data.turno}</td>
  <td>${data.libro}</td>
  <td>${new Date().toLocaleDateString()}</td>
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
  const celdas = fila.querySelectorAll("td");

  const comentarioInput = fila.querySelector(".input-comentario");
  const comentario = comentarioInput ? comentarioInput.value : "Sin comentario";

  const nuevaFila = document.createElement("tr");

  nuevaFila.innerHTML = `
    <td>${celdas[0].innerText}</td>
    <td>${celdas[1].innerText}</td>
    <td>${celdas[2].innerText}</td>
    <td>${celdas[3].innerText}</td>
    <td>${celdas[4].innerText}</td>
    <td>${celdas[5].innerText}</td>
    <td>${comentario}</td>
  `;

  document.getElementById("tablaHistorial").appendChild(nuevaFila);

  fila.remove();
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
  const datos = fila.children;

  agregarDevolucion({
    alumno: datos[0].innerText,
    curso: datos[1].innerText,
    turno: datos[2].innerText,
    libro: datos[3].innerText,
    fecha: datos[4].innerText,
    fechaDevolucion: calcularFechaDevolucion()
  });

  fila.remove();
}

function calcularFechaDevolucion() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 7); // 7 días de préstamo
  return fecha.toLocaleDateString();
}
