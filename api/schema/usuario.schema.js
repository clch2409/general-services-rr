const joi = require('joi');

const { ACTIVO, INACTIVO } = require('../utils/enums/status.enum');

const patronContrasena = RegExp(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)

const id = joi.number().integer().positive();
const email = joi.string().email();
const contrasena = joi.string().regex(patronContrasena);
const rolId = joi.number().integer().min(1);
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const createUsuarioSchema = joi.object({
  email: email.required(),
  contrasena: contrasena.required(),
  rolId,
  // status: status.required(),
});

const getUsuarioSchema = joi.object({
  id: id.required()
});

const getUsuarioByEmailSchema = joi.object({
  email: email.required(),
});

const updateUsuarioSchema = joi.object({
  // id,
  email,
});

const loginSchema = joi.object({
  email: email.required(),
  contrasena: contrasena.required(),
})

module.exports = { createUsuarioSchema, getUsuarioSchema, updateUsuarioSchema, loginSchema, getUsuarioByEmailSchema }
