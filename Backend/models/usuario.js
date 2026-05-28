const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,

  dni: {
     type: String,
     unique: true, 
     required: true },

  email: { 
    type: String,
    unique: true,
    sparse: true,
    default: undefined
  },

  password: String,

  rol: { 
    type: String, 
    enum: ["alumno", "bibliotecario"], 
    default: "alumno" 
  },

  activo: { 
    type: Boolean, 
    default: true 
  },

  curso: String,
  division: String,
  turno: String
});

module.exports = mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);