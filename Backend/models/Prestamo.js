const mongoose = require("mongoose");

const prestamoSchema = new mongoose.Schema({
  usuario: {
    nombre: String,
    apellido: String,
    curso: String,
    turno: String
  },
  libro: String,

  fechaSolicitud: {
  type: Date,
  default: Date.now
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





