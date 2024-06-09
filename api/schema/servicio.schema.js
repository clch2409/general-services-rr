const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const id = joi.number().integer().positive();
const nombre = joi.string().min(3).max(50).regex(patterns.NAME_PATTERN.pattern);
const precio = joi.number().precision(6,2).positive();
const proveedorId = id;

const createServicioSchema = joi.object({
  nombre: nombre.required(),
  precio: precio.required(),
  proveedorId: proveedorId.required(),
});

const getServicioByIdSchema = joi.object({
  id: id.required(),
});

const updateServicioSchema = joi.object({
  nombre,
  precio,
  proveedorId
});

module.exports = { createServicioSchema, getServicioByIdSchema, updateServicioSchema }
