const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const id = joi.number().integer().positive();
const nombre = joi.string().min(3).max(50).regex(patterns.NAME_PATTERN.pattern);
const precio = joi.number().precision(6,2).positive();

const createServicioSchema = joi.object({
  nombre: nombre.required(),
  precio: precio.required(),
});

const getServicioByIdSchema = joi.object({
  id: id.required(),
});

const updateServicioSchema = joi.object({
  nombre,
  precio
});

module.exports = { createServicioSchema, getServicioByIdSchema, updateServicioSchema }
