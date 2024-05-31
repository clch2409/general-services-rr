const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');



const id = joi.number().integer().positive();
const nombre = joi.string().min(5).max(50).regex(patterns.NAME_PATTERN.pattern);
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
