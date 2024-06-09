const joi = require('joi');

const { RESERVADO, REALIZADO, EN_PROCESO, CANCELADO } = require('./../utils/enums/statusEvento.enum');

const id = joi.number().integer().positive();
const colorEvento = joi.string().hex();
const fechaEvento = joi.date();
const horaInicio = joi.date();
const horaFin = joi.date();
const cantidadPersonas = joi.number().integer().positive();
const status = joi.string().valid(RESERVADO.name, REALIZADO.name, EN_PROCESO.name, CANCELADO.name);

const listadoServiciosIds = joi.array().items(joi.number().integer().positive());
const lisatdoColabroadoresIds = joi.array().items(joi.number().integer().positive());

const createEventoSchema = joi.object({
  colorEvento: colorEvento.required(),
  fechaEvento: fechaEvento.required(),
  horaInicio: horaInicio.required(),
  horaFin: horaFin,
  cantidadPersonas: cantidadPersonas.required(),
  encargadoId: id.required(),
  clienteId: id.required(),
  localId: id.required(),
  tipoEventoId: id.required(),
  tipoBuffetId: id.required(),
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
  encargadoId: id,
  clienteId: id,
  localId: id,
  tipoEventoId: id,
  tipoBuffetId: id,
  status,
});

const addServiciosToEventoSchema = joi.object({
  eventoId: id.required(),
  servicios: listadoServiciosIds.required()
});

const addColaboradoresToEventoSchema = joi.object({
  eventoId: id.required(),
  colaboradores: lisatdoColabroadoresIds.required()
});

const cotizacionSchema = joi.object({
  servicios: listadoServiciosIds.required(),
  localId: id.required(),
  diaId: id.required(),
  cantidadPersonas: cantidadPersonas.required(),
  tipoBuffetId: id.required()
});


module.exports = {
  createEventoSchema,
  getEventoByIdSchema,
  updateEventoSchema,
  addServiciosToEventoSchema,
  addColaboradoresToEventoSchema,
  cotizacionSchema
}
