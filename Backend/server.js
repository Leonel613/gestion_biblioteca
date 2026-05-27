const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Prestamo = require("./models/Prestamo");
const Libro = require("./models/Libro");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/biblioteca")
  .then(() => console.log("MongoDB conectado 🟢"))
  .catch(err => console.log("Error Mongo:", err));

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.post("/usuarios", async (req, res) => {
  try {
    const Usuario = require("./models/Usuario");

    // 🧠 normalización
    const nombre = req.body.nombre.trim().toLowerCase();
    const apellido = req.body.apellido.trim().toLowerCase();
    const email = req.body.email.trim().toLowerCase();

    // 🔍 buscar duplicado real
    const existente = await Usuario.findOne({
    nombre: nombre.trim().toLowerCase(),
    apellido: apellido.trim().toLowerCase(),
    email: email.trim().toLowerCase()
   });

    if (existente) {
      return res.status(400).json({
        error: "Usuario ya existe"
      });
    }

    // 💾 guardar normalizado
    const nuevo = new Usuario({
      ...req.body,
      nombre,
      apellido,
      email
    });

    await nuevo.save();

    res.json({ mensaje: "Usuario guardado" });

  } 

  catch (error) {
    console.log(error.stack);
  if (error.code === 11000) {
    return res.status(400).json({
      error: "Usuario ya existe"
    });
  }

  res.status(500).json({
    error: "Error al crear usuario"
  });
 }
});

app.post("/prestamos", async (req, res) => {
  try {
    const nuevo = new Prestamo(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (error) {
    console.log(error.stack);
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
    const dias = req.body.dias || 7; // default 7 días

    const hoy = new Date();

    const fechaPrestamo = hoy;

    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(hoy.getDate() + dias);

    const actualizado = await Prestamo.findByIdAndUpdate(
      req.params.id,
      {
        estado: "activo",
        fechaPrestamo,
        fechaDevolucion
      },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: "Error al actualizar préstamo" });
  }
});

app.put("/prestamos/:id/devolver", async (req, res) => {
  try {
    const hoy = new Date();

    const actualizado = await Prestamo.findByIdAndUpdate(
      req.params.id,
      {
        estado: "devuelto",
        fechaDevolucionReal: hoy
      },
      { new: true }
    );

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
    res.json(libros);
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


app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});


