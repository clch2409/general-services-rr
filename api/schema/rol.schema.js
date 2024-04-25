const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(5).max(9).allow(['cliente', 'admin', 'encargado']);

const createRolSchema = joi.object({
  name: name.required(),
});

const getRolSchema = joi.object({
  id: id.required()
});

const updateRolSchema = joi.object({
  id,
  name
});

module.exports = { createRolSchema, getRolSchema, updateRolSchema }

