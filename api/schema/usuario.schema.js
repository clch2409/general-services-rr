const joi = require('joi');
const patterns = require('./../utils/enums/patterns.enum');

const { ACTIVO, INACTIVO } = require('../utils/enums/status.enum');


const id = joi.number().integer().positive();
const email = joi.string().email();
const contrasena = joi.string().regex(patterns.PASSWORD_PATTERN.pattern);
const rolId = joi.number().integer().min(1);
const status = joi.string().valid(ACTIVO.name, INACTIVO.name);

const token = joi.string();

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

const changePasswordSchema = joi.object({
  token: token.required(),
  newPassword: contrasena.required()
})

module.exports = { createUsuarioSchema, getUsuarioSchema, updateUsuarioSchema, loginSchema, getUsuarioByEmailSchema, changePasswordSchema }
