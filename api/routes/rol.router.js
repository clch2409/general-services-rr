const express = require('express');

const rolService = require('../services/rol.service');
const authJwt = require('./../utils/auth/functions/passport.auth');

const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN } = require('../utils/enums/rol');
const { createRolSchema, getRolSchema } = require('./../schema/rol.schema');
const validatorHandler = require('../middlewares/validator.handler');

const rolRouter = express.Router();

//***************** Rutas ******************
rolRouter.get('',
  // authJwt(),
  // validateRoles(ADMIN.name),
  findAll
);

rolRouter.post('',
  // authJwt(),
  // validateRoles(ADMIN.name),
  validatorHandler(createRolSchema, 'body'),
  createRol
);

rolRouter.patch('/:id',
  // authJwt(),
  // validateRoles(ADMIN.name),
  validatorHandler(getRolSchema, 'params'),
  validatorHandler(createRolSchema, 'body'),
  async (req, res, next) => {
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
);
//***************** Rutas ******************

//***************** Funciones ******************
async function findAll(req, res, next){
  try{
    const roles = await rolService.findAll()
    res.status(201).json({
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
//***************** Funciones ******************

module.exports = { rolRouter };
