const joi = require('joi');

const id = joi.number().integer();
const nombre = joi.string().min(5);

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

