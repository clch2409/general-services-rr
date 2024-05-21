const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const regexNameRule = RegExp(/^[A-Za-z\sñ]+$/)

const id = joi.number().integer().positive();
const nombre = joi.string().min(5).max(50).regex(regexNameRule);
const descripcion = joi.string().min(5).regex(regexNameRule);
const direccion = joi.string().min(5).regex(regexNameRule);
const aforoMaximo = joi.number().positive().min(50).max(500);
const fechaInactivacion = joi.date();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const idLocal = id;
const idInsumo = id;
const cantidad = joi.number().positive().min(1).max(100);

const dias = joi.array().items(id);
const precioLocal = joi.number().positive().min(1).max(10000);
const precios = joi.array().items(precioLocal);

const createLocalSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  direccion: direccion.required(),
  aforoMaximo: aforoMaximo.required(),
  status
});

const getLocalByIdSchema = joi.object({
  id: id.required()
});

const updateLocalSchema = joi.object({
  nombre,
  descripcion,
  direccion,
  aforoMaximo,
  fechaInactivacion,
  status
});

const addInsumoToLocalSchema = joi.object({
  idInsumo: idInsumo.required(),
  idLocal: idLocal.required(),
  cantidad: cantidad.required()
});

const moveInsumoToLocalSchema = joi.object({
  idInsumo: idInsumo.required(),
  idOldLocal: idLocal.required(),
  idNewLocal: idLocal.required(),
  cantidad: cantidad.required()
});

const addPriceToLocalSchema = joi.object({
  idLocal: id.required(),
  idDia: id.required(),
  precioLocal: precioLocal.required()
});

const addAllPricesToLocalSchema = joi.object({
  dias: dias.required(),
  idLocal: id.required(),
  precios: precios.required()
});

module.exports = {
  createLocalSchema,
  getLocalByIdSchema,
  updateLocalSchema,
  addInsumoToLocalSchema,
  moveInsumoToLocalSchema,
  addPriceToLocalSchema ,
  addAllPricesToLocalSchema
}
