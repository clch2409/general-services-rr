const express = require('express');
const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const usuarioService = require('../services/usuario.service');
const { createUsuarioSchema } = require('../schema/usuario.schema');
const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol');


const usuarioRouter = express.Router();

usuarioRouter.get('',
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
  async (req, res, next) =>{
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
);

usuarioRouter.get('/email/:email',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  async (req, res, next) => {
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
);

usuarioRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  async (req, res, next) => {
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

function authenticationByJwt(){
  return passport.authenticate('jwt', { session: false });
}

module.exports = { usuarioRouter }
