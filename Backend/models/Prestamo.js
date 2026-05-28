const mongoose = require("mongoose");

const prestamoSchema = new mongoose.Schema({
  usuario: {
    nombre: String,
    apellido: String,
    curso: String,
    turno: String,
    dni: String,
    rol: String
  },
  libroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Libro",
    required: true
  },
  libro: String,
  autor: String,

  fechaSolicitud: {
    type: Date,
    default: Date.now
  },

  fechaDesde: {
    type: Date,
    required: true
  },

  fechaHasta: {
    type: Date,
    required: true
  },

  fechaRetiro: {
    type: Date,
    default: null
  },

  fechaPrestamo: {
    type: Date,
    default: Date.now
  },

  fechaDevolucion: {
    type: Date,
    required: true
  },

  fechaDevolucionReal: {
    type: Date,
    default: null
  },

  estado: {
    type: String,
    default: "pendiente" // pendiente | activo | devuelto
  },

  comentario: {
    type: String,
    default: ""
  }

});

module.exports = mongoose.model("Prestamo", prestamoSchema);





