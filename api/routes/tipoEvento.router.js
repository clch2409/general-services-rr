const passport = require('passport')
const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const tipoEventoService = require('./../services/tipoEvento.service');

const { createTipoEventoSchema, getTipoEventoSchema, updateTipoEventoSchema } = require('./../schema/tipoEvento.schema');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO, CLIENTE } = require('./../utils/enums/rol.enum');

const tipoEventoRouter = Router();

//* ***************** Rutas *****************
tipoEventoRouter.get('',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  findAll
);

tipoEventoRouter.post('',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createTipoEventoSchema, 'body'),
  createTipoEvento
);

tipoEventoRouter.get('/:id',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getTipoEventoSchema, 'params'),
  findTipoEventoById
);

tipoEventoRouter.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getTipoEventoSchema, 'params'),
  validatorHandler(updateTipoEventoSchema, 'body'),
  updateTipoEvento
);
//* ***************** Rutas *****************


//* ***************** Funciones *****************
async function findAll(req, res, next) {
  try{
    const tiposEventos = await tipoEventoService.findAll();

    res.status(200).json(tiposEventos)
  }
  catch(e){
    next(e)
  }
}

async function createTipoEvento(req, res, next) {
  try{
    const { body } = req
    const newTipoEvento = await tipoEventoService.createTipoEvento(body);

    res.status(200).json(newTipoEvento)
  }
  catch(e){
    next(e)
  }
}

async function findTipoEventoById(req, res, next) {
  try{
    const { id } = req.params;
    const foundTipoEvento = await tipoEventoService.findTipoEventoById(id);

    res.status(200).json(foundTipoEvento)
  }
  catch(e){
    next(e)
  }
}

async function updateTipoEvento(req, res, next) {
  try{
    const { params, body } = req
    const updatedTipoEvento = await tipoEventoService.updateTipoEvento(params.id, body);

    res.status(200).json(updatedTipoEvento)
  }
  catch(e){
    next(e)
  }
}
//* ***************** Funciones *****************

module.exports = { tipoEventoRouter }
