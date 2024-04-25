const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const usuarioService = require('../services/usuario.service');
const { createUsuarioSchema } = require('../schema/usuario.schema');

const usuarioRouter = express.Router();

usuarioRouter.get('',
  async (req, res, next) => {
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
);

usuarioRouter.post('',
  validatorHandler(createUsuarioSchema, 'body'),
  async (req, res, next) => {
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
);

module.exports = { usuarioRouter }
