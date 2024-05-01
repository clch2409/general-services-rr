const { Router } = require('express');

const localService = require('./../services/local.service');

const { createLocalSchema, getLocalByIdSchema, updateLocalSchema, addInsumoToLocalSchema } = require('./../schema/local.schema');
const validatorHandler = require('./../middlewares/validator.handler');

const localRouter = Router();

localRouter.get('',
  async (req, res, next) => {
    try{
      const locales = await localService.findAll();
      res.status(200).json({
        locales
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.get('/activos',
  async (req, res, next) => {
    try{
      const locales = await localService.findAllActivos();
      res.status(200).json({
        locales
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.post('',
  validatorHandler(createLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req
      const newLocal = await localService.createLocal(body);
      res.status(200).json({
        newLocal
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.post('/insumos',
  validatorHandler(addInsumoToLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req
      const newInsumoAdded = await localService.addInsumoToLocal(body, next);
      res.status(200).json({
        newInsumoAdded
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.get('/:id',
  validatorHandler(getLocalByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const localFound = await localService.findLocalById(id);

      res.status(302).json({
        localFound
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.patch('/:id',
  validatorHandler(getLocalByIdSchema, 'params'),
  validatorHandler(updateLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req;
      const updatedLocal = await localService.updateLocal(params.id, body);

      res.status(302).json({
        updatedLocal
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.delete('/:id',
  validatorHandler(getLocalByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const deletedLocal = await localService.deleteLocal(id);

      res.status(302).json({
        deletedLocal
      })
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { localRouter }
