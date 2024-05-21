const joi = require('joi');

const { RESERVADO, REALIZADO, EN_PROCESO, CANCELADO } = require('./../utils/enums/statusEvento.enum');

const id = joi.number().integer().positive();
const colorEvento = joi.string().hex();
const fechaEvento = joi.date();
const horaInicio = joi.date();
const horaFin = joi.date();
const cantidadPersonas = joi.number().integer().positive();
const status = joi.string().valid(RESERVADO.name, REALIZADO.name, EN_PROCESO.name, CANCELADO.name);

const encargadoId = id;
const clienteId = id;
const localId = id;
const tipoEventoId = id;
const tipoBuffetId = id;

const colaboradorId = id;
const servicioId = id;

const createEventoSchema = joi.object({
  colorEvento: colorEvento.required(),
  fechaEvento: fechaEvento.required(),
  horaInicio: horaInicio.required(),
  horaFin: horaFin,
  cantidadPersonas: cantidadPersonas.required(),
  encargadoId: encargadoId.required(),
  clienteId: clienteId.required(),
  localId: localId.required(),
  tipoEventoId: tipoEventoId.required(),
  tipoBuffetId: tipoBuffetId.required(),
  status: status
});


const getEventoByIdSchema = joi.object({
  id: id.required(),
});

const updateEventoSchema = joi.object({
  colorEvento,
  fechaEvento,
  horaInicio,
  horaFin,
  cantidadPersonas,
  encargadoId,
  clienteId,
  localId,
  tipoEventoId,
  tipoBuffetId,
  status,
});

const addServicioToEventoSchema = joi.object({
  id: id.required(),
  servicioId: servicioId.required()
});

const addColaboradorToEventoSchema = joi.object({
  id: id.required(),
  colaboradorId: colaboradorId.required()
});


module.exports = {
  createEventoSchema,
  getEventoByIdSchema,
  updateEventoSchema,
  addServicioToEventoSchema,
  addColaboradorToEventoSchema,
}
