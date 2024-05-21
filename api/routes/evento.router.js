const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const eventoService = require('./../services/evento.service');

const { createEventoSchema, getEventoByIdSchema, updateEventoSchema, cotizacionSchema } = require('./../schema/evento.schema');

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

eventoRouter.get('/:id',
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const eventoFound = await eventoService.findEventoById(id);

      res.status(200).json({
        eventoFound
      });
    }
    catch(e){
      next(e);
    }
  }
);

eventoRouter.get('/price/event/:id',
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const priceEvent = await eventoService.getPrecioEvento(id);

      res.status(200).json({
        priceEvent
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

eventoRouter.post('/cotizacion',
  validatorHandler(cotizacionSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const cotizacion = await eventoService.makeCotizacion(body);

      res.status(201).json({
        cotizacion
      });
    }
    catch(e){
      next(e);
    }
  }
);

eventoRouter.post('/add/colaborador',
  async (req, res, next) => {
    try{
      const { body } = req;
      const colaboradoresAdded = await eventoService.addColaboradoresToEvento(body);

      res.status(201).json({
        colaboradoresAdded
      })
    }
    catch(e){
      next(e)
    }
  }
)

eventoRouter.post('/add/servicio',
  async (req, res, next) => {
    try{
      const { body } = req;
      const serviciosAdded = await eventoService.addServiciosToEvento(body);

      res.status(201).json({
        serviciosAdded
      })
    }
    catch(e){
      next(e)
    }
  }
)

eventoRouter.post('/today',
  async (req, res, next) => {
    try{
      const eventosHoy = await eventoService.changeEventoStatusToInProcess();

      res.status(200).json({
        eventosHoy
      });
    }
    catch(e){
      next(e)
    }
  }
);

eventoRouter.post('/yesterday',
  async (req, res, next) => {
    try{
      const eventosAyer = await eventoService.changeEventoStatusToFinished();

      res.status(200).json({
        eventosAyer
      });
    }
    catch(e){
      next(e)
    }
  }
);

eventoRouter.post('/cancel/:id',
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const eventoCanceled = await eventoService.cancelEvento(id);

      res.status(200).json({
        eventoCanceled
      })
    }
    catch(e){
      next(e);
    }
  }
)

module.exports = { eventoRouter }
