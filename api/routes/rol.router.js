const express = require('express');

const rolService = require('../services/rol.service');
const validatorHandler = require('../middlewares/validator.handler');

const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('../utils/enums/rol.enum');
const { createRolSchema, getRolSchema } = require('./../schema/rol.schema');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');

const rolRouter = express.Router();

//***************** Rutas ******************
rolRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

rolRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(createRolSchema, 'body'),
  createRol
);

rolRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(getRolSchema, 'params'),
  validatorHandler(createRolSchema, 'body'),
  updateRol
);
//***************** Rutas ******************

//***************** Funciones ******************
async function findAll(req, res, next){
  try{
    const roles = await rolService.findAll()
    res.status(200).json({
      roles
    })
  }
  catch(e){
    next(e)
  }
}

async function createRol(req, res, next){
  try{
    const { body } = req
    const newRol = await rolService.createRol(body);

    res.status(201).json(
      newRol
    )
  }
  catch(e){
    next(e);
  }
}

async function updateRol (req, res, next){
  try{
    const { params, body } = req;
    const updatedRol = await rolService.updateRol(params.id, body);

    res.status(200).json({
      updatedRol
    });
  }
  catch(e){
    next(e);
  }
}
//***************** Funciones ******************

module.exports = { rolRouter };
