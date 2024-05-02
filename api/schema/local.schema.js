const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const id = joi.number().integer();
const nombre = joi.string().min(5).max(50);
const descripcion = joi.string().min(5);
const direccion = joi.string().min(5);
const aforoMaximo = joi.number().positive().min(50).max(500);
const fechaInactivacion = joi.date();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const idLocal = id;
const idInsumo = id;
const cantidad = joi.number().positive().min(1).max(100);
const precio = joi.number().precision(2).min(1).max(1000);

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
})

module.exports = { createLocalSchema, getLocalByIdSchema, updateLocalSchema, addInsumoToLocalSchema }
