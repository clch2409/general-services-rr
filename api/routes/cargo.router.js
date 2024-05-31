const passport = require('passport');
const { Router } = require('express');

const cargoService = require('./../services/cargo.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createCargoSchema, getCargoSchema, updateCargoSchema } = require('./../schema/cargo.schema');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');

const cargoRouter = Router();

//* ***************** Rutas *****************
cargoRouter.get('',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

cargoRouter.post('',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createCargoSchema, 'body'),
  createCargo
);

cargoRouter.get('/:id',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getCargoSchema, 'params'),
  findCargoById
);

cargoRouter.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getCargoSchema, 'params'),
  validatorHandler(updateCargoSchema, 'body'),
  updateCargo
);
//* ***************** Rutas *****************

//* ***************** Funciones *****************
async function findAll(req, res, next){
  try{
    const cargos = await cargoService.findAll();

    res.status(200).json(cargos);
  }
  catch(e){
    next(e)
  }
}

async function createCargo(req, res, next){
  try{
    const { body } = req;
    const newCargo = await cargoService.createCargo(body);

    res.status(200).json(newCargo);
  }
  catch(e){
    next(e)
  }
}

async function findCargoById(req, res, next) {
  try{
    const { id } = req.params;
    const cargoFound = await cargoService.findCargoById(id)

    res.status(302).json(cargoFound);
  }
  catch(e){
    next(e)
  }
}

async function updateCargo(req, res, next) {
  try{
    const { params, body } = req;
    const updatedCargo = await cargoService.updateCargo(params.id, body);

    res.status(200).json(updatedCargo);
  }
  catch(e){
    next(e)
  }
}
//* ***************** Funciones *****************

module.exports = { cargoRouter }
