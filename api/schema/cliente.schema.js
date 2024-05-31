const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const { createUsuarioSchema, getUsuarioByEmailSchema } = require('./usuario.schema');

const id = joi.number().integer().positive();
const nombres = joi.string().min(3).max(50).regex(patterns.NAME_PATTERN.pattern);
const apPaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const apMaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const dni = joi.string().min(8).max(9).regex(patterns.DNI_PATTERN.pattern);
const telefono = joi.string().min(9).max(9).regex(patterns.PHONE_PATTERN.pattern);
const direccion = joi.string().min(5).max(50);
const usuario = createUsuarioSchema;

const email = joi.string().email();

const createClienteSchema = joi.object({
  nombres: nombres.required(),
  apPaterno: apPaterno.required(),
  apMaterno: apMaterno.required(),
  dni: dni.required(),
  telefono: telefono.required(),
  direccion: direccion.required(),
  usuario: createUsuarioSchema.required()
});

const getClienteByIdSchema = joi.object({
  id: id.required(),
});

const getClienteByDniSchema = joi.object({
  dni: dni.required(),
});

const getClienteByEmailSchema = joi.object({
  email: email.required()
});

const updateClienteSchema  = joi.object({
  nombres,
  apPaterno,
  apMaterno,
  dni,
  telefono,
  direccion,
});

module.exports = { createClienteSchema, getClienteByIdSchema, updateClienteSchema, getClienteByDniSchema, getClienteByEmailSchema }
