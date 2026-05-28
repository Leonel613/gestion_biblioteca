const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

//CREAR CUENTA
router.post("/", async (req, res) => {
    console.log("📩 BODY COMPLETO:", req.body);
  try {
    const nuevo = new Usuario({
  nombre: req.body.nombre,
  apellido: req.body.apellido,
  dni: req.body.dni,
  email: req.body.email || null,
  curso: req.body.curso,
  division: req.body.division,
  turno: req.body.turno,
  rol: "alumno",
  activo: false
  });
    await nuevo.save();

    res.json({ mensaje: "Usuario creado" });
  } catch (err) {
    res.status(400).json({ error: "Error creando usuario" });
  }
});

//ACTIVAR CUENTA
router.post("/login", async (req, res) => {
  let { dni, password } = req.body;

  // VALIDACIÓN BÁSICA
  if (!dni || typeof dni !== "string") {
    return res.status(400).json({ error: "DNI inválido" });
  }

  if (dni.length < 5 || dni.length > 14) {
    return res.status(400).json({ error: "DNI inválido" });
  }

  const user = await Usuario.findOne({ dni });

  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  // PRIMERA VEZ
  if (!user.password) {
    return res.json({
      primeraVez: true,
      usuario: user
    });
  }


  // PASSWORD
  if (user.password !== password) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // ACTIVO
  if (!user.activo) {
    return res.status(403).json({ error: "Cuenta no activada" });
  }

  // LOGIN OK
  return res.json({
    usuario: {
      id: user._id,
      nombre: user.nombre,
      dni: user.dni,
      rol: user.rol
    },
    primeraVez: false
  });
});

// siempre al final
module.exports = router;
