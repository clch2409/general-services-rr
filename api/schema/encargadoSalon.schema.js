const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const { createUsuarioSchema, getUsuarioByEmailSchema } = require('./usuario.schema');
const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');


const id = joi.number().integer().positive();
const nombres = joi.string().min(3).max(50).regex(patterns.NAME_PATTERN.pattern);
const apPaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const apMaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const dni = joi.string().min(8).max(9).regex(patterns.DNI_PATTERN.pattern);
const telefono = joi.string().min(9).max(9).regex(patterns.PHONE_PATTERN.pattern);
const fechaContratacion = joi.date();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);
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
  status: status,
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

const checkEncargadoEventoSchema = joi.object({
  fechaEvento: joi.date().required(),
  encargadoId: id.required(),
})

const updateEncargadoSchema  = joi.object({
  nombres,
  apPaterno,
  apMaterno,
  dni,
  telefono,
  fechaContratacion,

});

module.exports = { createEncargadoSchema, getEncargadoByIdSchema, getEncargadoByDniSchema, updateEncargadoSchema, getEncargadoByEmailSchema, checkEncargadoEventoSchema }
