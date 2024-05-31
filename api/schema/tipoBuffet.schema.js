const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const id = joi.number().integer().positive();
const nombre = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const precioPorPlato = joi.number().precision(6,2).positive().min(30).max(150);

const createTipoBuffetSchema = joi.object({
  nombre: nombre.required(),
  precioPorPlato: precioPorPlato.required(),
});

const getTipoBuffetByIdSchema = joi.object({
  id: id.required(),
});

const updateTipoBuffetSchema = joi.object({
  nombre: nombre.required(),
  precioPorPlato: precioPorPlato.required(),
});

module.exports = { createTipoBuffetSchema, getTipoBuffetByIdSchema, updateTipoBuffetSchema }
