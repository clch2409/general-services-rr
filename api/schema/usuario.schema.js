const joi = require('joi');
const patronContrasena = RegExp(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}/)


const id = joi.number().integer();
const email = joi.string().email();
const contrasena = joi.string().pattern(patronContrasena);
const rolId = joi.number().integer().min(1).max(3);
// const status = joi.string().allow(['activo', 'inactivo']);

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
