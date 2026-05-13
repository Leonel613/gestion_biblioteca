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

  librosPagina.forEach(libro => {
    filas += `
      <tr>
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
        <td class="editar">✏️</td>
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
              <th>✏️</th>
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

      <input placeholder="Título">
      <input placeholder="Autor">
      <input placeholder="Editorial">
      <input placeholder="Año de publicación">
      <input placeholder="N° Edición">
      <input placeholder="Categoría">
      <input type="number" placeholder="Cantidad total">
      <input type="date">
      <input placeholder="Proveedor">

      <button onclick="crearLibro()">Guardar libro</button>
    </div>
  `;
}

function crearLibro() {
  alert("✔ Libro agregado correctamente");
}


// 👤 USUARIO
function mostrarCrearUsuario() {
  document.getElementById("contenidoPanel").innerHTML = `
    <div class="tarjeta">
      <h2>Crear usuario</h2>

      <input placeholder="Nombre y apellido">
      <input placeholder="Curso y división">
      <input placeholder="Turno">
      <input placeholder="Email">

      <button onclick="crearUsuario()">Crear usuario</button>
    </div>
  `;
}

function crearUsuario() {
  alert("✔ Usuario creado correctamente. Revisá tu mail.");
}


// 🔔 NOTIFICACIONES
function mostrarNotificaciones() {
  document.getElementById("contenidoPanel").innerHTML = `
    <div class="tarjeta">
      <h2>Notificaciones</h2>

      <ul>
        <li>Juan Pérez - 3°A - Matemática - EN DEMORA</li>
        <li>Lucía Gómez - 2°B - Historia - EN USO</li>
      </ul>
    </div>
  `;
}
