const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const id = joi.number().integer().positive();
const nombres = joi.string().min(3).max(50).regex(patterns.NAME_PATTERN.pattern);
const apPaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const apMaterno = joi.string().min(3).max(25).regex(patterns.NAME_PATTERN.pattern);
const email = joi.string().email();
const telefono = joi.string().regex(patterns.PHONE_PATTERN.pattern);
const dni = joi.string().regex(patterns.DNI_PATTERN.pattern);
const fechaContratacion = joi.date();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const cargoId = id;

const createColaboradorSchema = joi.object({
  nombres: nombres.required(),
  apPaterno: apPaterno.required(),
  apMaterno: apMaterno.required(),
  email: email.required(),
  telefono: telefono.required(),
  dni: dni.required(),
  fechaContratacion: fechaContratacion.required(),
  cargoId: cargoId.required(),
  status,
});

const getColaboradorByIdSchema = joi.object({
  id: id.required(),
});

const getColaboradorByDniSchema = joi.object({
  dni: dni.required(),
});

const updateColaboradorSchema = joi.object({
  nombres,
  apPaterno,
  apMaterno,
  email,
  telefono,
  dni,
  fechaContratacion,
  cargoId,
  status,
});

module.exports = { createColaboradorSchema, getColaboradorByIdSchema, updateColaboradorSchema, getColaboradorByDniSchema }
