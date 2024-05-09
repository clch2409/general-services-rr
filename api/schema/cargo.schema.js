const joi = require('joi');

const regexNameRule = RegExp(/^[A-Za-z\s]+$/)

const id = joi.number().positive().integer();
const nombre = joi.string().min(5).max(50).regex(regexNameRule);

const createCargoSchema = joi.object({
  nombre: nombre.required(),
});

const getCargoSchema = joi.object({
  id: id.required(),
});

const updateCargoSchema = joi.object({
  nombre: nombre,
});

module.exports = { createCargoSchema, getCargoSchema, updateCargoSchema }
