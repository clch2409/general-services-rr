const { Router } = require('express');

const localService = require('./../services/local.service');

const { createLocalSchema, getLocalByIdSchema, updateLocalSchema, addInsumoToLocalSchema, moveInsumoToLocalSchema, addPriceToLocalSchema, addAllPricesToLocalSchema } = require('./../schema/local.schema');
const validatorHandler = require('./../middlewares/validator.handler');
const { authenticationByJwt } = require('../utils/auth/functions/passport.auth');
const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN, ENCARGADO, CLIENTE } = require('../utils/enums/rol.enum');

const localRouter = Router();

//****************** Rutas *************************
localRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

localRouter.get('/activos',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  findAllActivos
);

localRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createLocalSchema, 'body'),
  createLocal
);

localRouter.post('/add/insumos',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addInsumoToLocalSchema, 'body'),
  addInsumosToLocal
);

localRouter.post('/add/prices',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addPriceToLocalSchema, 'body'),
  addPriceToLocal
);

localRouter.post('/add/all/prices',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addAllPricesToLocalSchema, 'body'),
  addPriceAllPricesToLocal
);

localRouter.post('/modify/prices',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addAllPricesToLocalSchema, 'body'),
  modifyPriceOfLocal
);

localRouter.post('/retire/insumos',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addInsumoToLocalSchema, 'body'),
  retireInsumosOffLocal
);

localRouter.post('/move/insumos',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(moveInsumoToLocalSchema, 'body'),
  moveInsumosToAnotherLocal
);

localRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getLocalByIdSchema, 'params'),
  findLocalById
);

localRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getLocalByIdSchema, 'params'),
  validatorHandler(updateLocalSchema, 'body'),
  updateLocal
);

localRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getLocalByIdSchema, 'params'),
  deleteLocal
);


//****************** Rutas *************************


//****************** Funciones *************************
async function findAll (req, res, next) {
  try{
    const locales = await localService.findAll();
    res.status(200).json(locales)
  }
  catch(e){
    next(e)
  }
}

async function findAllActivos (req, res, next){
  try{
    const locales = await localService.findAllActivos();
    res.status(200).json(locales)
  }
  catch(e){
    next(e)
  }
}

async function createLocal (req, res, next) {
  try{
    const { body } = req
    const newLocal = await localService.createLocal(body);
    res.status(200).json(newLocal)
  }
  catch(e){
    next(e)
  }
}

async function addInsumosToLocal (req, res, next) {
  try{
    const { idLocal, idInsumo, cantidad } = req.body;
    const newInsumoAdded = await localService.addInsumoToLocal(idLocal, idInsumo, cantidad);
    res.status(200).json(newInsumoAdded)
  }
  catch(e){
    next(e)
  }
}


async function addPriceToLocal(req, res, next){
  try{
    const { body } = req;
    const addedPrice = await localService.addPriceToLocal(body);

    res.status(200).json({
      addedPrice
    });
  }
  catch(e){
    next(e);
  }
}

async function addPriceAllPricesToLocal(req, res, next) {
  try{
    const { body } = req;
    const addedPrices = await localService.addPriceAllPricesToLocal(body);

    res.status(200).json({
      addedPrices
    });
  }
  catch(e){
    next(e);
  }
}

async function modifyPriceOfLocal(req, res, next) {
  try{
    const { localId, diaId, precio } = req.body;
    const modifiedPrice = await localService.modifyPriceOfLocal(localId, diaId, precio);

    res.status(200).json({
      modifiedPrice
    });
  }
  catch(e){
    next(e);
  }
}

async function retireInsumosOffLocal (req, res, next) {
  try{
    const { idLocal, idInsumo, cantidad } = req.body;
    const insumosRetired = await localService.takeInsumosOffLocal(idLocal, idInsumo, cantidad);
    res.status(200).json(insumosRetired)
  }
  catch(e){
    next(e)
  }
}

async function moveInsumosToAnotherLocal (req, res, next) {
  try{
    const { idOldLocal, idNewLocal, idInsumo, cantidad } = req.body;
    const movedInsumos = await localService.moveInsumosToAnotherLocal(idOldLocal, idNewLocal, idInsumo, cantidad);
    res.status(200).json(movedInsumos)
  }
  catch(e){
    next(e)
  }
}

async function findLocalById (req, res, next) {
  try{
    const { id } = req.params;
    const localFound = await localService.findLocalById(id);

    if(localFound.fechaInactivacion){
      res.status(200).json({
        local: localFound,
        fechaInactivacion: localFound.fechaInactivacion.toDateString()
      });
    }
    else{
      res.status(200).json({
        local: localFound,
      });
    }
  }
  catch(e){
    next(e)
  }
}

async function updateLocal (req, res, next) {
  try{
    const { params, body } = req;
    const updatedLocal = await localService.updateLocal(params.id, body);

    res.status(200).json(updatedLocal)
  }
  catch(e){
    next(e)
  }
}

async function deleteLocal (req, res, next) {
  try{
    const { id } = req.params;
    const deletedLocal = await localService.deleteLocal(id);

    res.status(200).json(deletedLocal)
  }
  catch(e){
    next(e)
  }
}

//****************** Funciones *************************

module.exports = { localRouter }
