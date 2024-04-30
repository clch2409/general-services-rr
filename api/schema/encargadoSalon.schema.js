const joi = require('joi');

const { createUsuarioSchema, getUsuarioByEmailSchema } = require('./usuario.schema');

const regexDniRule = RegExp(/^\d{8,9}$/);
const regexNumberRule = RegExp(/^9\d{8}$/);

const id = joi.number().integer();
const nombres = joi.string().min(3).max(50);
const apPaterno = joi.string().min(3).max(25);
const apMaterno = joi.string().min(3).max(25);
const dni = joi.string().min(8).max(9).pattern(regexDniRule);
const telefono = joi.string().min(9).max(9).pattern(regexNumberRule);
const fechaContratacion = joi.date();
const status = joi.string().valid('activo', 'inactivo');
// const usuario = createUsuarioSchema;

const email = joi.string().email();

const createEncargadoSchema = joi.object({
  nombres: nombres.required(),
  apPaterno: apPaterno.required(),
  apMaterno: apMaterno.required(),
  dni: dni.required(),
  telefono: telefono.required(),
  fechaContratacion: fechaContratacion.required(),
  usuario: createUsuarioSchema.required(),
  status: status.required(),
});

const getEncargadoByIdSchema = joi.object({
  id: id.required(),
});

const getEncargadoByDniSchema = joi.object({
  dni: dni.required(),
});

const getEncargadoByEmailSchema = joi.object({
  email: email.required()
});

const updateEncargadoSchema  = joi.object({
  nombres,
  apPaterno,
  apMaterno,
  dni,
  telefono,
  fechaContratacion,
});

module.exports = { createEncargadoSchema, getEncargadoByIdSchema, getEncargadoByDniSchema, updateEncargadoSchema, getEncargadoByEmailSchema }
