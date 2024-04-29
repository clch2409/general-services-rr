const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const clienteService = require('./../services/cliente.service');
const authenticationByJwt = require('./../utils/auth/functions/passport.auth');

const { createClienteSchema, getClienteByIdSchema, updateClienteSchema, getClienteByDniSchema, getClienteByEmailSchema } = require('./../schema/cliente.schema');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol');

const clienteRouter = express.Router();

//***************** Rutas ******************
clienteRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

clienteRouter.post('',
  validatorHandler(createClienteSchema, 'body'),
  createCliente
);

clienteRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getClienteByIdSchema, 'params'),
  findClienteById
);

clienteRouter.get('/dni/:dni',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getClienteByDniSchema, 'params'),
  findClienteByDni
);

clienteRouter.get('/email/:email',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getClienteByEmailSchema, 'params'),
  findClienteByEmail
);

clienteRouter.patch('/:id',
  validatorHandler(getClienteByIdSchema, 'params'),
  validatorHandler(updateClienteSchema, 'body'),
  updateCliente
);
//***************** Rutas ******************

//***************** Funciones ******************
async function findAll(req, res, next){
  try{
    const clientes = await clienteService.findAll();

    res.status(202).json({
      clientes
    })
  }
  catch(e){
    next(e)
  }
}

async function createCliente(req, res, next){
  try{
    const newCliente = await clienteService.createCliente(req.body);
    res.status(201).json({
      newCliente
    });
  }
  catch(e){
    next(e);
  }
}

async function findClienteById(req, res, next){
  try{
    const foundCliente = await clienteService.findClienteById(req.params.id);
    res.status(201).json({
      foundCliente
    })
  }
  catch(e){
    next(e);
  }
}

async function findClienteByDni(req, res, next){
  try{
    const foundCliente = await clienteService.findClienteByDni(req.params.dni);
    res.status(201).json({
      foundCliente
    })
  }
  catch(e){
    next(e);
  }
}

async function findClienteByEmail(req, res, next) {
  try{
    const foundCliente = await clienteService.findClienteByEmail(req.params.email);
    res.status(201).json({
      foundCliente
    })
  }
  catch(e){
    next(e);
  }
}

async function updateCliente(req, res, next) {
  try{
    const { params, body } = req
    const updatedCliente = await clienteService.updateCliente(params.id, body);

    console.log(updatedCliente)

    res.status(200).json({
      updatedCliente
    });
  }
  catch(e){
    next(e)
  }
}
//***************** Funciones ******************

module.exports = { clienteRouter };
