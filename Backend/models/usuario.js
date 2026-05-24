const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  curso: String,
  division: String,
  turno: String
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
