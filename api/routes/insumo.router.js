const { Router } = require('express');

const insumoService = require('./../services/insumo.service');

const { createInsumoSchema, getInsumoByIdSchema, updatedInsumoSchema } = require('./../schema/insumo.schema');
const validatorHandler = require('./../middlewares/validator.handler');

const insumoRouter = Router();

insumoRouter.get('',
  async (req, res, next) => {
    try{
      const insumos = await insumoService.findAll();

      res.status(200).json({
        insumos
      })
    }
    catch(e){
      next(e)
    }
  }
);

insumoRouter.post('',
  validatorHandler(createInsumoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req

      const newInsumo = await insumoService.createInsumo(body);

      res.status(200).json({
        newInsumo
      })
    }
    catch(e){
      next(e)
    }
  }
);

insumoRouter.get('/:id',
  validatorHandler(getInsumoByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;

      const foundInsumo = await insumoService.findInsumoById(id);

      res.status(200).json({
        foundInsumo
      })
    }
    catch(e){
      next(e)
    }
  }
);

insumoRouter.patch('/:id',
  validatorHandler(getInsumoByIdSchema, 'params'),
  validatorHandler(updatedInsumoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req;

      const updatedInsumo = await insumoService.updateInsumo(params.id, body);
      res.json({
        updatedInsumo
      })
    }
    catch(e){
      next(e);
    }
  }
);


module.exports = { insumoRouter }
