const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const regexNameRule = RegExp(/^[A-Za-z\sñ]+$/)

const id = joi.number().integer().positive();
const nombre = joi.string().min(5).max(50).regex(regexNameRule);
const precio = joi.number().precision(6,2);
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const proveedorId = id;

const createInsumoSchema = joi.object({
  nombre: nombre.required(),
  precio: precio.required(),
  proveedorId: proveedorId.required(),
  status,
});

const getInsumoByIdSchema = joi.object({
  id: id.required()
});

const updatedInsumoSchema = joi.object({
  nombre,
  precio,
  proveedorId,
  status,
});

module.exports = { createInsumoSchema, getInsumoByIdSchema, updatedInsumoSchema }
