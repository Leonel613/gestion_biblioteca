const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Prestamo = require("./models/Prestamo");
const Libro = require("./models/Libro");
const Usuario = require("./models/Usuario");

const app = express();

app.use(cors());
app.use(express.json());

const usuariosRoutes = require("./routes/usuarios");

app.use("/api/usuarios", usuariosRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/biblioteca")
  .then(() => console.log("MongoDB conectado 🟢"))
  .catch(err => console.log("Error Mongo:", err));

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

function calcularDisponibilidad(libro) {
  const disponibles =
    (libro.total ?? 0) -
    (libro.reservados ?? 0) -
    (libro.prestados ?? 0);

  return {
    ...libro.toObject(),
    disponibles,
    disponible: disponibles > 0
  };
}

app.post("/prestamos", async (req, res) => {
  try {

    // 1. validar id
    if (!req.body.libroId) {
      return res.status(400).json({ error: "Falta libroId" });
    }

    // 2. buscar libro
    const libro = await Libro.findById(req.body.libroId);

    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    // 3. validar conflicto de fechas
    const conflicto = await Prestamo.findOne({
      libroId: req.body.libroId,
      estado: { $in: ["pendiente", "activo"] },
      $or: [
        {
          fechaDesde: { $lte: req.body.fechaHasta },
          fechaHasta: { $gte: req.body.fechaDesde }
        }
      ]
    });

    if (conflicto) {
      return res.status(400).json({
        error: "Ya existe una reserva para ese rango de fechas"
      });
    }

    // 4. validar stock
    const disponibles =
      (libro.total ?? 0) -
      (libro.prestados ?? 0) -
      (libro.reservados ?? 0);

    if (disponibles <= 0) {
      return res.status(400).json({
        error: "No hay disponibilidad para este libro"
      });
    }

    // 5. crear préstamo
    const nuevo = new Prestamo(req.body);
    await nuevo.save();

    // 6. actualizar stock
    await Libro.findByIdAndUpdate(req.body.libroId, {
      $inc: { reservados: 1 }
    });

    res.json(nuevo);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear préstamo" });
  }
});

app.get("/prestamos", async (req, res) => {
  try {
    const filtro = {};

    if (req.query.estado) {
   filtro.estado = req.query.estado;
   }

const data = await Prestamo.find(filtro);
    res.json(data);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Error al obtener préstamos" });
  }
});

app.put("/prestamos/:id", async (req, res) => {
  try {
    const dias = req.body.dias || 7;

    const hoy = new Date();

    const fechaPrestamo = hoy;

    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(hoy.getDate() + dias);

    const prestamo = await Prestamo.findById(req.params.id);

    const actualizado = await Prestamo.findByIdAndUpdate(
      req.params.id,
      {
        estado: "activo",
        fechaPrestamo,
        fechaDevolucion
      },
      { new: true }
    );

    await Libro.findByIdAndUpdate(prestamo.libroId, {
      $inc: {
        prestados: 1,
        reservados: -1
      }
    });

    res.json(actualizado);

  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Error al actualizar préstamo" });
  }
});

app.put("/prestamos/:id/devolver", async (req, res) => {
  try {
    const hoy = new Date();

    const prestamo = await Prestamo.findById(req.params.id);

    const actualizado = await Prestamo.findByIdAndUpdate(
      req.params.id,
      {
        estado: "devuelto",
        fechaDevolucionReal: hoy
      },
      { new: true }
    );

    await Libro.findByIdAndUpdate(prestamo.libroId, {
      $inc: {
        prestados: -1
      }
    });

    res.json(actualizado);

  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Error al registrar devolución" });
  }
});

app.post("/libros", async (req, res) => {
  try {
    const titulo = req.body.titulo.trim().toLowerCase();
    const autor = req.body.autor.trim().toLowerCase();
    const editorial = req.body.editorial.trim().toLowerCase();
    const edicion = Number(req.body.edicion);

    // 🔍 buscar duplicado real
    const existe = await Libro.findOne({
      titulo,
      autor,
      editorial,
      edicion
    });

    if (existe) {
      return res.status(400).json({
        error: "Este libro (misma edición) ya existe"
      });
    }

    const nuevo = new Libro({
      ...req.body,
      titulo,
      autor,
      editorial,
      edicion
    });

    await nuevo.save();

    res.json({ mensaje: "Libro guardado" });

  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Libro duplicado (índice único)"
      });
    }

    res.status(500).json({
      error: "Error al crear libro"
    });
  }
});

app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();

    const respuesta = libros.map(calcularDisponibilidad);

    res.json(respuesta);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener libros" });
  }
});

app.delete("/libros/:id", async (req, res) => {
  await Libro.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Libro eliminado" });
});

app.put("/libros/:id", async (req, res) => {
  try {
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!libroActualizado) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json(libroActualizado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar" });
  }
});

async function crearAdmin() {
  try {
    const admin = await Usuario.findOne({ dni: "admin" });

    if (!admin) {
      await Usuario.create({
        nombre: "admin",
        apellido: "sistema",
        dni: "12345",
        password: "1234",
        rol: "bibliotecario",
        activo: true
      });

      console.log("Admin creado");
    } else {
      console.log("Admin ya existe");
    }

  } catch (error) {
    console.log("Error creando admin:", error);
  }
}

crearAdmin();

app.post("/login", async (req, res) => {
  try {
    let { dni, password } = req.body;

    console.log("🔐 LOGIN RECIBIDO:", req.body);

    // 🔥 VALIDACIÓN ROBUSTA DNI
    if (!dni) {
      return res.status(400).json({ error: "DNI inválido" });
    }

    if (typeof dni !== "string") {
      dni = String(dni);
    }

    dni = dni.trim();

    if (dni.length < 5 || dni.length > 14) {
      return res.status(400).json({ error: "DNI inválido" });
    }

    // 🔍 BUSCAR USUARIO
    const user = await Usuario.findOne({ dni });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // 🆕 PRIMER LOGIN (sin contraseña)
    if (!user.password) {
      return res.json({
        primeraVez: true,
        usuario: {
          id: user._id,
          nombre: user.nombre,
          dni: user.dni,
          rol: user.rol
        }
      });
    }

    // 🔒 CUENTA INACTIVA
    if (!user.activo) {
      return res.status(403).json({ error: "Cuenta no activada" });
    }

    // 🔑 PASSWORD INCORRECTA
    if (user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // ✅ LOGIN OK
    return res.json({
      usuario: {
        id: user._id,
        nombre: user.nombre,
        dni: user.dni,
        rol: user.rol
      },
      primeraVez: false
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});


