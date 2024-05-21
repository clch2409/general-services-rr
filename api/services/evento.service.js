const boom = require('@hapi/boom');

const { getTodaysDate, getYesterdayDate, addHoursToEventEndTime } = require('./../utils/functions/date.functions');
const { RESERVADO, EN_PROCESO, CANCELADO } = require('./../utils/enums/statusEvento.enum');
const { models } = require('./../libs/sequelize');
const { TERMINADO } = require('../utils/enums/statusColaboradorEvento.enum');

class EventoService {

  async findAll(){
    return models.Evento.findAll()
  }
  /*
  // Verificar si ya el local se encuentra reservado hoy
  // Verificar si la cantidad de personas sobrepasan el máximo de aforo
  // Verificar si la encargada ya tiene un evento en el día
  // No permitir al cliente reservar un evento si ya tiene un evento reservado
  // Verificar si la fecha de reserva no es anterior a la fecha de hoy
  // Hacer que los eventos del día de hoy estén en proceso
  // Hacer que los eventos ya se encuentren realizados
  // Hacer que el evento pase a cancelado
  * Agregar colaboradores a evento
  * Agregar servicios al evento
  * Enviar mensaje a colaborador
  * Realizar cotizaciones
  * Contabilizar precio total del evento
  */
  async createEvento(body){
    const { localId, fechaEvento, cantidadPersonas, encargadoId, clienteId, horaInicio } = body;

    if (!body.horaFin){
      body.horaFin = addHoursToEventEndTime(horaInicio, 8);
    }

    const checkIfLocalIsReserved = await this.checkIfLocalHasEventToday(localId, fechaEvento);
    const checkIfLocalHasCapacity = await this.checkIfLocalHasPeopleCapacity(localId, cantidadPersonas);
    const checkEncargadoAvability = await this.checkIfEncargadoIsAvalible(encargadoId, fechaEvento);
    const checkIfClienteHasReservedEvent = await this.checkIfClientHasReservedEvent(clienteId);
    const checkFechaEventoIsAfterToday = this.checkIfFechaEventoIsAfterToday(fechaEvento);

    if (checkIfLocalIsReserved){
      throw boom.notAcceptable('Este local ya se encuentra reservado para la fecha deseada');
    }
    else if (checkEncargadoAvability){
      throw boom.notAcceptable('Este encargado de salón ya cuenta con un evento el día de hoy');
    }
    else if (checkIfClienteHasReservedEvent.length >= 1){
      throw boom.notAcceptable('Usted ya ha tiene eventos reservados. Espere a culminar para reservar el siguiente');
    }
    else if (!checkIfLocalHasCapacity){
      throw boom.notAcceptable('La cantidad de personas supera el aforo máximo del local');
    }
    else if (!checkFechaEventoIsAfterToday){
      throw boom.notAcceptable('No puedes reservar un evento para hoy ni una fecha antes');
    }

    return models.Evento.create(body);
  }

  async checkIfLocalHasEventToday(localId, fechaEvento){
    const eventoFound = await models.Evento.findOne({
      where: {
        localId: localId,
        fechaEvento: fechaEvento,
      }
    });

    return eventoFound;
  }

  async checkIfLocalHasPeopleCapacity(localId, cantidadPersonas){
    const { aforoMaximo } = await models.Local.findOne({
      where: {
        id: localId,
      }
    });

    return aforoMaximo > cantidadPersonas;
  }

  async checkIfEncargadoIsAvalible(encargadoId, fechaEvento){
    const eventoFound = await models.Evento.findOne({
      where: {
        encargadoId,
        fechaEvento
      }
    });

    return eventoFound;
  }

  async checkIfClientHasReservedEvent(clienteId){
    const eventoFound = await models.Evento.findAll({
      where: {
        clienteId,
        status: RESERVADO.name,
      }
    });

    return eventoFound;
  }

  checkIfFechaEventoIsAfterToday(fechaEvento){
    const fechaHoy = new Date();
    const fechaHoyDia = fechaHoy.getDay();
    const fechaHoyMiliSecs = fechaHoy.getTime();

    const fechaEventoDate = new Date(fechaEvento);
    const fechaEventoDia = fechaEventoDate.getDay();
    const fechaEventoMiliSecs = fechaEventoDate.getTime();

    if (fechaHoyDia === fechaEventoDia){
      return false
    }

    return fechaEventoMiliSecs > fechaHoyMiliSecs;
  }


  async changeEventoStatusToInProcess(){
    const fechaHoy = getTodaysDate();
    const eventosHoy = await models.Evento.findAll({
      where: {
        fechaEvento: fechaHoy,
      }
    });

    eventosHoy.forEach(async (evento) => {
      await evento.update({
        status: EN_PROCESO.name
      });
    });

    return eventosHoy;
  }

  async changeEventoStatusToFinished(){
    const fechaAyer = getYesterdayDate();
    const eventosAyer = await models.Evento.findAll({
      where: {
        fechaEvento: fechaAyer
      }
    });

    eventosAyer.forEach(async (evento) => {
      if (evento.status === EN_PROCESO.name){
        await evento.update({
          status: TERMINADO.name
        })
      }
    })

    return eventosAyer;
  }

  async cancelEvento(eventoId){
    const evento = await models.Evento.findOne({
      where: {
        id: eventoId
      }
    });

    await evento.update({
      status: CANCELADO.name
    });

    return evento;
  }

}

module.exports = new EventoService();
