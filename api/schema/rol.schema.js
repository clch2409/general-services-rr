const joi = require('joi');

const regexNameRule = RegExp(/^[A-Za-z\s]+$/)

const id = joi.number().integer().positive();
const nombre = joi.string().min(5).regex(regexNameRule);

const createRolSchema = joi.object({
  nombre: nombre.required(),
});

const getRolSchema = joi.object({
  id: id.required()
});

const updateRolSchema = joi.object({
  id,
  nombre
});

module.exports = { createRolSchema, getRolSchema, updateRolSchema }

