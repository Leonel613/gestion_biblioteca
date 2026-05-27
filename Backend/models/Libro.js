const mongoose = require("mongoose");


const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  editorial: String,
  anio: Number,
  edicion: String,
  categoria: String,
  total: Number,
  disponible: Number,
  prestados: Number,
  reservados: Number,
  proveedor: String,
  ingreso: {
    type: Date,
    default: Date.now
  }
});

libroSchema.index(
  { titulo: 1, autor: 1, editorial: 1, edicion: 1 },
  { unique: true }
);

module.exports = mongoose.model("Libro", libroSchema);
