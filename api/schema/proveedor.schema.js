const joi = require('joi');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

const regexNameRule = RegExp(/^[A-Za-z\sñ]+$/)
const regexNumberRule = RegExp(/^\d{9}$/);

const id = joi.number().integer().positive();
const nombre = joi.string().min(3).max(70).regex(regexNameRule);
const email = joi.string().email();
const telefono = joi.string().min(9).max(9).regex(regexNumberRule);
const direccion = joi.string().min(5).max(50).regex(regexNameRule);
const fechaContrato = joi.date();
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const idProveedor = id;
const idInsumo = id;
const precio = joi.number().precision(2).min(1).max(1000).positive();

const createProveedorSchema = joi.object({
  nombre: nombre.required(),
  email,
  telefono: telefono.required(),
  direccion,
  fechaContrato: fechaContrato.required(),
  status,
});

const getProveedorByIdSchema = joi.object({
  id: id.required(),
});

const getProveedorByDireccionSchema = joi.object({
  direccion: direccion.required(),
});

const getProveedorByEmailSchema = joi.object({
  email: email.required()
});

const udpateProveedorSchema  = joi.object({
  nombre,
  email,
  telefono,
  direccion,
  status,
});

const addInsumoToProveedorSchema = joi.object({
  idProveedor: idProveedor.required(),
  idInsumo: idInsumo.required(),
  precio: precio.required(),
})

module.exports = { createProveedorSchema, getProveedorByIdSchema, getProveedorByDireccionSchema, getProveedorByEmailSchema, udpateProveedorSchema, addInsumoToProveedorSchema }
