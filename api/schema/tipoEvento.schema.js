const joi = require('joi');

const regexNameRule = RegExp(/^[A-Za-z\sñ]+$/)

const id = joi.number().integer().positive();
const nombre = joi.string().min(3).max(50).regex(regexNameRule);

const createTipoEventoSchema = joi.object({
  nombre: nombre.required(),
});

const getTipoEventoSchema = joi.object({
  id: id.required(),
});

const updateTipoEventoSchema = joi.object({
  nombre
});

module.exports = { createTipoEventoSchema, getTipoEventoSchema, updateTipoEventoSchema }
