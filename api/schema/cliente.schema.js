const joi = require('joi');

const { createUsuarioSchema, getUsuarioByEmailSchema } = require('./usuario.schema');

const regexDniRule = RegExp(/^\d{8,9}$/);
const regexNumberRule = RegExp(/^\d{9}$/);

const id = joi.number().integer().positive();
const nombres = joi.string().min(3).max(50);
const apPaterno = joi.string().min(3).max(25);
const apMaterno = joi.string().min(3).max(25);
const dni = joi.string().min(8).max(9).pattern(regexDniRule);
const telefono = joi.string().min(9).max(9).pattern(regexNumberRule);
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
