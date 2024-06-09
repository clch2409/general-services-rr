const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const encargadoService = require('./../services/encargadoSalon.service');

const { createEncargadoSchema,
  getEncargadoByIdSchema,
  getEncargadoByDniSchema,
  getEncargadoByEmailSchema,
  updateEncargadoSchema,
  checkEncargadoEventoSchema
} = require('../schema/encargadoSalon.schema');
const { validateRoles } = require('../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('../utils/enums/rol.enum');
const { authenticationByJwt } = require('../utils/auth/functions/passport.auth');

const encargadoRouter = express.Router();

//***************** Rutas ******************
encargadoRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  findAll
);

encargadoRouter.post('/check',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(checkEncargadoEventoSchema, 'body'),
  checkEncargadoAvalible
);

encargadoRouter.get('/activos',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  findAllActivos
);

encargadoRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(createEncargadoSchema, 'body'),
  createEncargado
);

encargadoRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(getEncargadoByIdSchema, 'params'),
  findEncargadoById
);

encargadoRouter.get('/dni/:dni',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(getEncargadoByDniSchema, 'params'),
  findEncargadoByDni
);

encargadoRouter.get('/email/:email',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(getEncargadoByEmailSchema, 'params'),
  findEncargadoByEmail
);

encargadoRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  validatorHandler(getEncargadoByIdSchema, 'params'),
  validatorHandler(updateEncargadoSchema, 'body'),
  updateEncargado
);

encargadoRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name),
  deleteEncargado
);
//***************** Rutas ******************

//***************** Funciones ******************
async function findAll(req, res, next){
  try{
    const encargados = await encargadoService.findAll();

    res.status(202).json(encargados)
  }
  catch(e){
    next(e)
  }
}

async function checkEncargadoAvalible(req, res, next){
  try{
    const { fechaEvento, encargadoId } = req.body;
    const eventos = await encargadoService.checkEncargadoAvalible(fechaEvento, encargadoId)

    if (!eventos){
      res.status(200).json({
        message: 'El encargado se encuentra disponible'
      });
    }
  }
  catch(e){
    next(e);
  }
}

async function findAllActivos(req, res, next) {
  try{
    const encargadoActivos = await encargadoService.findAllActiveEncargados();

    res.status(200).json(encargadoActivos)
  }
  catch(e){
    next(e);
  }
}

async function createEncargado(req, res, next){
  try{
    const { body } = req;
    const newEncargado = await encargadoService.createEncargado(body);
    res.status(201).json(newEncargado);
  }
  catch(e){
    next(e);
  }
}

async function findEncargadoById(req, res, next){
  try{
    const { id } = req.params
    const foundEncargado = await encargadoService.findEncargadoById(id);
    res.status(201).json({
      encargado: foundEncargado,
      fechaContratacion: foundEncargado.fechaContratacion.toDateString(),
    })
  }
  catch(e){
    next(e);
  }
}

async function findEncargadoByDni(req, res, next){
  try{
    const { dni } = req.params;
    const foundCliente = await encargadoService.findEncargadoByDni(dni);
    res.status(201).json(foundCliente)
  }
  catch(e){
    next(e);
  }
}

async function findEncargadoByEmail(req, res, next) {
  try{
    const { email } = req.params;
    const foundCliente = await encargadoService.findEncargadoByEmail(email);
    res.status(201).json(foundCliente)
  }
  catch(e){
    next(e);
  }
}

async function updateEncargado(req, res, next) {
  try{
    const { params, body } = req
    const updatedCliente = await encargadoService.updateEncargado(params.id, body);

    console.log(updatedCliente)

    res.status(200).json(updatedCliente);
  }
  catch(e){
    next(e)
  }
}

async function deleteEncargado (req, res, next) {
  try{
    const { id } = req.params;
    const deleteEncargado = await encargadoService.deleteEncargado(id);

    res.status(200).json(deleteEncargado);
  }
  catch(e){
    next(e)
  }
}
//***************** Funciones ******************

module.exports = { encargadoRouter };
