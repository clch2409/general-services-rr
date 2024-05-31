const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const id = joi.number().integer().positive();
const nombre = joi.string().min(5).regex(patterns.NAME_PATTERN.pattern);

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

