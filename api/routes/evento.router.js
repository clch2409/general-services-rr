const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const eventoService = require('./../services/evento.service');

const { createEventoSchema, getEventoByIdSchema, updateEventoSchema } = require('./../schema/evento.schema');

const eventoRouter = Router();

eventoRouter.get('',
  async (req, res, next) => {
    try{
      const eventos = await eventoService.findAll();

      res.status(200).json({
        eventos
      });
    }
    catch(e){
      next(e);
    }
  }
);

eventoRouter.post('',
  validatorHandler(createEventoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const newEvento = await eventoService.createEvento(body);

      res.status(201).json({
        newEvento
      });
    }
    catch(e){
      next(e);
    }
  }
);

module.exports = { eventoRouter }
