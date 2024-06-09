const passport = require('passport');
const { Router } = require('express');

const colaboradorService = require('./../services/colaborador.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createColaboradorSchema, getColaboradorByIdSchema, updateColaboradorSchema, getColaboradorByDniSchema } = require('./../schema/colaborador.schema');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');

const colaboradorRouter = Router();

//* ***************** Rutas *****************
colaboradorRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

colaboradorRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createColaboradorSchema, 'body'),
  createColaborador
);

colaboradorRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getColaboradorByIdSchema, 'params'),
  findColaboradorById
);

colaboradorRouter.get('/dni/:dni',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getColaboradorByDniSchema, 'params'),
  findColaboradorByDni
);

colaboradorRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getColaboradorByIdSchema, 'params'),
  validatorHandler(updateColaboradorSchema, 'body'),
  updateColaborador
);

colaboradorRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getColaboradorByIdSchema, 'params'),
  deleteColaborador
);
//* ***************** Rutas *****************

//* ***************** Funciones *****************

async function findAll(req, res, next) {
  try {
    const colaboradores = await colaboradorService.findAll();

    res.status(200).json(colaboradores);
  } catch (e) {
    next(e)
  }
}

async function createColaborador(req, res, next) {
  try {
    const { body } = req;
    const newColaborador = await colaboradorService.createColaborador(body);

    res.status(201).json(newColaborador);
  } catch (e) {
    next(e)
  }
}

async function findColaboradorById(req, res, next) {
  try{
    const { id } = req.params;
    const foundColaborador = await colaboradorService.findColaboradorById(id);

    res.status(201).json({
      colaborador: foundColaborador,
      fechaContratacion: foundColaborador.fechaContratacion.toDateString(),
    })
  }
  catch(e){
    next(e)
  }
}

async function findColaboradorByDni(req, res, next) {
  try{
    const { dni } = req.params;
    const foundColaborador = await colaboradorService.findColaboradorByDni(dni);

    res.status(200).json(foundColaborador);
  }
  catch(e){
    next(e)
  }
}

async function updateColaborador(req, res, next) {
  try{
    const { params, body } = req;
    const updatedColaborador = await colaboradorService.updateColaborador(params.id, body);

    res.status(200).json(updatedColaborador);
  }
  catch(e){
    next(e)
  }
}

async function deleteColaborador(req, res, next) {
  try{
    const { id } = req.params;
    const deletedColaborador = await colaboradorService.deleteColaborador(id);

    res.status(200).json(deletedColaborador);
  }
  catch(e){
    next(e)
  }
}

//* ***************** Funciones *****************

module.exports = { colaboradorRouter }
