const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const regexNameRule = RegExp(/^[A-Za-z\s]+$/);
const regexDniRule = RegExp(/^\d{8,9}$/);
const regexNumberRule = RegExp(/^\d{9}$/);

const id = joi.number().integer().positive();
const nombres = joi.string().min(3).max(50).regex(regexNameRule);
const apPaterno = joi.string().min(3).max(25).regex(regexNameRule);
const apMaterno = joi.string().min(3).max(25).regex(regexNameRule);
const email = joi.string().email();
const telefono = joi.string().regex(regexNumberRule);
const dni = joi.string().regex(regexDniRule);
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

module.exports = { createColaboradorSchema, getColaboradorByIdSchema, updateColaboradorSchema }
