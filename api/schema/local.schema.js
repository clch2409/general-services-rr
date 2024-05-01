const joi = require('joi');

const id = joi.number().integer();
const nombre = joi.string().min(5).max(50);
const descripcion = joi.string().min(5);
const direccion = joi.string().min(5);
const aforoMaximo = joi.number().sign('positive').min(50).max(500);
const fechaInactivacion = joi.date();
const status = joi.string().valid('activo', 'inactivo');

const createLocalSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  direccion: direccion.required(),
  aforoMaximo: aforoMaximo.required(),
  status
});

const getLocalByIdSchema = joi.object({
  id: id.required()
});

const updateLocalSchema = joi.object({
  nombre,
  descripcion,
  direccion,
  aforoMaximo,
  fechaInactivacion,
  status
});

module.exports = { createLocalSchema, getLocalByIdSchema, updateLocalSchema }
