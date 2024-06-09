const { Router } = require('express');
const passport = require('passport');


const valitadorHandler = require('./../middlewares/validator.handler');
const tipoBuffetService = require('../services/tipoBuffet.service');

const { createTipoBuffetSchema, getTipoBuffetByIdSchema, updateTipoBuffetSchema } = require('../schema/tipoBuffet.schema');
const { CLIENTE, ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');
const { validateRoles } = require('./../middlewares/auth.handler');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');

const tipoBuffetRouter = Router();

//* ***************** Rutas *****************
tipoBuffetRouter.get('',
  authenticationByJwt(),
  validateRoles(CLIENTE.name, ADMIN.name, ENCARGADO.name),
  findAll
);

tipoBuffetRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(createTipoBuffetSchema, 'body'),
  createTipoBuffet
);

tipoBuffetRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(getTipoBuffetByIdSchema, 'params'),
  findTipoBuffetById
);

tipoBuffetRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(getTipoBuffetByIdSchema, 'params'),
  valitadorHandler(updateTipoBuffetSchema, 'body'),
  updateTipoBuffet
);
//* ***************** Rutas *****************

//* ***************** Funciones *****************
async function findAll(req, res, next) {
  try{
    const tiposBuffet = await tipoBuffetService.findAll();

    res.status(200).json(tiposBuffet)
  }
  catch(e){
    next(e);
  }
}

async function createTipoBuffet(req, res, next){
  try{
    const { body } = req
    const newTipoBuffet = await tipoBuffetService.createTipoBuffet(body);

    res.status(200).json(newTipoBuffet)
  }
  catch(e){
    next(e);
  }
}

async function findTipoBuffetById(req, res, next){
  try{
    const { id } = req.params
    const foundBuffet = await tipoBuffetService.findTipoBuffetById(id);

    res.status(200).json(foundBuffet)
  }
  catch(e){
    next(e);
  }
}

async function updateTipoBuffet(req, res, next) {
  try{
    const { params, body } = req
    const updatedBuffet = await tipoBuffetService.updateTipoBuffet(params.id,body);

    res.status(200).json(updatedBuffet)
  }
  catch(e){
    next(e);
  }
}
//* ***************** Funciones *****************

module.exports = { tipoBuffetRouter }
