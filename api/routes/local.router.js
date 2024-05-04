const { Router } = require('express');

const localService = require('./../services/local.service');

const { createLocalSchema, getLocalByIdSchema, updateLocalSchema, addInsumoToLocalSchema, moveInsumoToLocalSchema } = require('./../schema/local.schema');
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

localRouter.post('/add/insumos',
  validatorHandler(addInsumoToLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { idLocal, idInsumo, cantidad } = req.body;
      const newInsumoAdded = await localService.addInsumoToLocal(idLocal, idInsumo, cantidad);
      res.status(200).json({
        newInsumoAdded
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.post('/retire/insumos',
  validatorHandler(addInsumoToLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { idLocal, idInsumo, cantidad } = req.body;
      const insumosRetired = await localService.takeInsumosOffLocal(idLocal, idInsumo, cantidad);
      res.status(200).json({
        insumosRetired
      })
    }
    catch(e){
      next(e)
    }
  }
);

localRouter.post('/move/insumos',
  validatorHandler(moveInsumoToLocalSchema, 'body'),
  async (req, res, next) => {
    try{
      const { idOldLocal, idNewLocal, idInsumo, cantidad } = req.body;
      const movedInsumos = await localService.moveInsumosToAnotherLocal(idOldLocal, idNewLocal, idInsumo, cantidad);
      res.status(200).json({
        movedInsumos
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
