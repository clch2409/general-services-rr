const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const { createClienteSchema, getClienteSchema, updateClienteSchema } = require('./../schema/cliente.schema');
const clienteService = require('./../services/cliente.service');

const clienteRouter = express.Router();

clienteRouter.get('',
  async (req, res, next) => {
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
);

clienteRouter.post('',
  validatorHandler(createClienteSchema, 'body'),
  async (req, res, next) => {
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
);

clienteRouter.get('/:id',
  async (req, res, next) => {
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
);

module.exports = { clienteRouter };
