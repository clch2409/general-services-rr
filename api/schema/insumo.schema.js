const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const id = joi.number().integer();
const nombre = joi.string().min(5).max(50);
const precio = joi.number().precision(2).min(1).max(1000).positive();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const createInsumoSchema = joi.object({
  nombre: nombre.required(),
  precio: precio.required(),
  status
});

const getInsumoByIdSchema = joi.object({
  id: id.required()
});

const updatedInsumoSchema = joi.object({
  nombre,
  precio,
  status,
});

module.exports = { createInsumoSchema, getInsumoByIdSchema, updatedInsumoSchema }
