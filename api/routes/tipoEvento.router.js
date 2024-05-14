const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const tipoEventoService = require('./../services/tipoEvento.service');

const { createTipoEventoSchema, getTipoEventoSchema, updateTipoEventoSchema } = require('./../schema/tipoEvento.schema');

const tipoEventoRouter = Router();

tipoEventoRouter.get('',
  async (req, res, next) => {
    try{
      const tiposEventos = await tipoEventoService.findAll();

      res.status(200).json({
        tiposEventos
      })
    }
    catch(e){
      next(e)
    }
  }
);

tipoEventoRouter.post('',
  validatorHandler(createTipoEventoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req
      const newTipoEvento = await tipoEventoService.createTipoEvento(body);

      res.status(200).json({
        newTipoEvento
      })
    }
    catch(e){
      next(e)
    }
  }
);

tipoEventoRouter.get('/:id',
  validatorHandler(getTipoEventoSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const foundTipoEvento = await tipoEventoService.findTipoEventoById(id);

      res.status(200).json({
        foundTipoEvento
      })
    }
    catch(e){
      next(e)
    }
  }
);

tipoEventoRouter.patch('/:id',
  validatorHandler(getTipoEventoSchema, 'params'),
  validatorHandler(updateTipoEventoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req
      const updatedTipoEvento = await tipoEventoService.updateTipoEvento(params.id, body);

      res.status(200).json({
        updatedTipoEvento
      })
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { tipoEventoRouter }
