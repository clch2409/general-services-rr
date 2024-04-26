const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const usuarioService = require('../services/usuario.service');
const { createUsuarioSchema } = require('../schema/usuario.schema');
const { validateRoles } = require('../middlewares/auth.handler');
const passport = require('passport');

const usuarioRouter = express.Router();

usuarioRouter.get('',
  findAll
);

usuarioRouter.post('',
  passport.authenticate('jwt', {session: false}),
  validateRoles('admin'),
  validatorHandler(createUsuarioSchema, 'body'),
  createUser
);

async function findAll(req, res, next) {
  try{
    const users = await usuarioService.findAll();
    res.status(200).json({
      users
    })
  }
  catch(e){
    next(e);
  }
}

async function createUser(req, res, next){
  try{
    const newUser = await usuarioService.createUser(req.body);
    res.status(201).json({
      newUser
    })
  }
  catch(e){
    next(e)
  }
}

module.exports = { usuarioRouter }
