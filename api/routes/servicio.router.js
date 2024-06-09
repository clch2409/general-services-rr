const passport = require('passport');
const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const servicioService = require('./../services/servicio.service');

const { createServicioSchema, getServicioByIdSchema, updateServicioSchema } = require('./../schema/servicio.schema');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO, CLIENTE } = require('./../utils/enums/rol.enum');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');

const servicioRouter = Router();

//* ***************** Rutas *****************
servicioRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  findAll
);

servicioRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createServicioSchema, 'body'),
  createServicio
);

servicioRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getServicioByIdSchema, 'params'),
  findServicioById
);

servicioRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getServicioByIdSchema, 'params'),
  validatorHandler(updateServicioSchema, 'body'),
  updateServicio
);
//* ***************** Rutas *****************


//* ***************** Funciones *****************
async function findAll(req, res, next) {
  try{
    const servicios = await servicioService.findAll();

    res.status(200).json(servicios)
  }
  catch(e){
    next(e)
  }
}

async function createServicio(req, res, next) {
  try{

    const { body } = req;
    const newServicio = await servicioService.createServicio(body);

    res.status(201).json(newServicio)
  }
  catch(e){
    next(e)
  }
}

async function findServicioById(req, res, next){
  try{
    const { id } = req.params;
    const foundServicio = await servicioService.findServicioById(id);

    res.status(200).json(foundServicio)
  }
  catch(e){
    next(e)
  }
}

async function updateServicio(req, res, next)  {
  try{
    const { params, body } = req;
    const updatedServicio = await servicioService.updateServicio(params.id, body);

    res.status(200).json(updatedServicio)
  }
  catch(e){
    next(e)
  }
}
//* ***************** Funciones *****************

module.exports = { servicioRouter }
