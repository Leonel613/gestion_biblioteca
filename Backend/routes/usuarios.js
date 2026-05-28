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
  email: req.body.email || undefined,
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
      usuario: {
        id: user._id,
        nombre: user.nombre,
        dni: user.dni,
        rol: user.rol
      }
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

router.post("/activar", async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || typeof dni !== "string" || dni.length < 5 || dni.length > 14) {
      return res.status(400).json({ error: "DNI inválido" });
    }

    if (!password || typeof password !== "string" || password.trim().length < 4) {
      return res.status(400).json({ error: "Contraseña inválida" });
    }

    const user = await Usuario.findOne({ dni: dni.trim() });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.password) {
      return res.status(400).json({ error: "Cuenta ya tiene contraseña" });
    }

    user.password = password.trim();
    user.activo = true;
    await user.save();

    return res.json({ mensaje: "Cuenta activada correctamente" });
  } catch (err) {
    console.error("Error activando cuenta:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
});

// siempre al final
module.exports = router;
