const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const usuarioService = require('../services/usuario.service');

const { createUsuarioSchema, getUsuarioSchema } = require('../schema/usuario.schema');
const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');

const usuarioRouter = express.Router();

//***************** Rutas ******************
usuarioRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

usuarioRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createUsuarioSchema, 'body'),
  createUser
);

usuarioRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findUsuarioById
);

usuarioRouter.get('/email/:email',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findUsuarioByEmail
);

usuarioRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getUsuarioSchema, 'params'),
  deleteUsuario
);
//***************** Rutas ******************

//***************** Funciones ******************
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

async function findUsuarioById(req, res, next){
  try{
    const usuarioId = req.params.id;
    const foundUser = await usuarioService.findUserById(usuarioId);

    res.status(302).json(
      foundUser
    );
  }
  catch(e){
    next(e);
  }
}

async function findUsuarioByEmail(req, res, next){
  try{
    const usuarioEmail = req.params.email;
    const foundUser = await usuarioService.findUserByEmail(usuarioEmail);

    res.status(200).json(
      foundUser
    );
  }
  catch(e){
    next(e);
  }
}

async function deleteUsuario(req, res, next) {
  try{
    const usuarioId = req.params.id;
    const deletedUser = await usuarioService.deleteUser(usuarioId);

    res.status().json({
      deletedUser
    });
  }
  catch(e){
    next(e);
  }
}
//***************** Funciones ******************

module.exports = { usuarioRouter }
