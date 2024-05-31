const { Router } = require('express');

const insumoService = require('./../services/insumo.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createInsumoSchema, getInsumoByIdSchema, updatedInsumoSchema } = require('./../schema/insumo.schema');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');

const insumoRouter = Router();

//****************** Rutas *************************
insumoRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

insumoRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createInsumoSchema, 'body'),
  createInsumo
);

insumoRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getInsumoByIdSchema, 'params'),
  findInsumoById
);

insumoRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getInsumoByIdSchema, 'params'),
  validatorHandler(updatedInsumoSchema, 'body'),
  updateInsumo
);

insumoRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getInsumoByIdSchema, 'params'),
  deleteInsumo
);
//****************** Rutas *************************


//****************** Funciones *************************
async function findAll (req, res, next){
  try{
    const insumos = await insumoService.findAll();

    res.status(200).json(insumos)
  }
  catch(e){
    next(e)
  }
}

async function createInsumo(req, res, next) {
  try{
    const { body } = req

    const newInsumo = await insumoService.createInsumo(body);

    res.status(200).json(newInsumo)
  }
  catch(e){
    next(e)
  }
}

async function findInsumoById(req, res, next){
  try{
    const { id } = req.params;

    const foundInsumo = await insumoService.findInsumoById(id);

    res.status(200).json(foundInsumo)
  }
  catch(e){
    next(e)
  }
}

async function updateInsumo(req, res, next) {
  try{
    const { params, body } = req;

    const updatedInsumo = await insumoService.updateInsumo(params.id, body);
    res.json(updatedInsumo)
  }
  catch(e){
    next(e);
  }
}

async function deleteInsumo(req, res, next){
  try{
    const { id } = req.params;

    const deletedInsumo = await insumoService.deleteInsumo(id);

    res.status(200).json(deletedInsumo)
  }
  catch(e){
    next(e)
  }
}
//****************** Funciones *************************

module.exports = { insumoRouter }
