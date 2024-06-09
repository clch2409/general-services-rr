const { Router } = require('express');
const boom = require('@hapi/boom');

const validatorHandler = require('./../middlewares/validator.handler');
const eventoService = require('./../services/evento.service');

const colaboradorService = require('../services/colaborador.service');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, CLIENTE, ENCARGADO } = require('./../utils/enums/rol.enum');
const {
  createEventoSchema,
  getEventoByIdSchema,
  updateEventoSchema,
  cotizacionSchema,
  addColaboradoresToEventoSchema,
  addServiciosToEventoSchema
} = require('./../schema/evento.schema');

const eventoRouter = Router();

//***************** Rutas ******************

eventoRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, CLIENTE.name, ENCARGADO.name),
  findAll
);



eventoRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, CLIENTE.name, ENCARGADO.name),
  validatorHandler(getEventoByIdSchema, 'params'),
  findEventoById
);

eventoRouter.get('/price/event/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, CLIENTE.name, ENCARGADO.name),
  validatorHandler(getEventoByIdSchema, 'params'),
  getPriceOfEvento
);


eventoRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, CLIENTE.name, ENCARGADO.name),
  validatorHandler(createEventoSchema, 'body'),
  createEvento
);

eventoRouter.post('/cotizacion',
  authenticationByJwt(),
  validateRoles(ADMIN.name, CLIENTE.name, ENCARGADO.name),
  validatorHandler(cotizacionSchema, 'body'),
  makeCotizacion
);

eventoRouter.post('/add/colaboradores',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addColaboradoresToEventoSchema, 'body'),
  addColaboradorToEvent
)

/**
 * todo: Hacer validacion para no agregar más servicios que se encuentran registrados
 */
eventoRouter.post('/add/servicios',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(addServiciosToEventoSchema, 'body'),
  addServiciosToEvento
)

eventoRouter.post('/remove/servicios',
  async (req, res, next) => {
    try{
      const { eventoId, servicios } = req.body;
      const eventoWithServiciosRemoved = await eventoService.removeServiciosFromEvento(eventoId, servicios);
      res.status(200).json(eventoWithServiciosRemoved)
    }
    catch(e){
      next(e)
    }
  }
)

eventoRouter.post('/process',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  changeEventoStatusToInProcess
);

eventoRouter.post('/finished',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  changeEventoStatusToFinished
);

eventoRouter.post('/cancel/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name, CLIENTE.name),
  validatorHandler(getEventoByIdSchema, 'params'),
  cancelEvento
)
//***************** Rutas ******************

//***************** Funciones ******************
async function findAll(req, res, next) {
  try{
    const eventos = await eventoService.findAll();

    res.status(200).json(eventos);
  }
  catch(e){
    next(e);
  }
}

async function findEventoById (req, res, next) {
  try{
    const { id } = req.params;
    const eventoFound = await eventoService.findEventoById(id);

    res.status(200).json(eventoFound);
  }
  catch(e){
    next(e);
  }
}

async function getPriceOfEvento (req, res, next){
  try{
    const { id } = req.params;
    const priceEvent = await eventoService.getPrecioEvento(id);

    res.status(200).json(priceEvent);
  }
  catch(e){
    next(e);
  }
}

async function createEvento(req, res, next) {
  try{
    const { body } = req;
    const newEvento = await eventoService.createEvento(body);

    res.status(201).json(newEvento);
  }
  catch(e){
    next(e);
  }
}

async function makeCotizacion(req, res, next) {
  try{
    const { body } = req;
    const cotizacion = await eventoService.makeCotizacion(body);

    res.status(201).json(cotizacion);
  }
  catch(e){
    next(e);
  }
}

async function addColaboradorToEvent(req, res, next){
  try{
    const { body } = req;
    const colaboradoresToAdd = await eventoService.addColaboradoresToEvento(body);
    const colaboradoresAdded = await colaboradorService.sendEmailToColaborador(body.eventoId, colaboradoresToAdd);

    res.status(201).json(colaboradoresAdded)
  }
  catch(e){
    next(e)
  }
}

async function addServiciosToEvento(req, res, next){
  try{
    const { servicios, eventoId } = req.body;
    const serviciosAdded = await eventoService.addServiciosToEvento(servicios, eventoId);
    const eventoWithServiciosAdded = await eventoService.findEventoById(eventoId);
    const eventosAlreadyAdded = eventoService.getServiciosAlreadyAdded(eventoWithServiciosAdded, servicios);

    if (servicios.length === eventosAlreadyAdded.length){
      throw boom.notAcceptable('Los servicios ya han sido agregados');
    }

    res.status(201).json({
      serviciosAgregados: eventoWithServiciosAdded.servicios
    })
  }
  catch(e){
    next(e)
  }
}

async function changeEventoStatusToInProcess(req, res, next) {
  try{
    const eventosHoy = await eventoService.changeEventoStatusToInProcess();

    res.status(200).json(eventosHoy);
  }
  catch(e){
    next(e)
  }
}

async function changeEventoStatusToFinished(req, res, next) {
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

async function cancelEvento(req, res, next){
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
//***************** Funciones ******************

module.exports = { eventoRouter }
