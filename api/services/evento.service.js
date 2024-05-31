const boom = require('@hapi/boom');

const servicioService = require('./../services/servicio.service');
const tipoBuffetService = require('./../services/tipoBuffet.service');
const localService = require('./../services/local.service');

const { getTodaysDate, getYesterdayDate, addHoursToEventEndTime, getDayOfTheWeek } = require('./../utils/functions/date.functions');
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
  // * Agregar colaboradores a evento
  // * Agregar servicios al evento
  * Enviar mensaje a colaborador
  * Enviar mensaje a encargado
  // * Colocar automáticamente un encargado
  // * Realizar cotizaciones
  // * Contabilizar precio total del evento
  // * Hacer schema de cotizacion
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

  async findEventoById(eventoId){
    const eventoFound = await models.Evento.findByPk(eventoId);

    if (!eventoFound){
      throw boom.notFound('El evento buscado no existe');
    }

    return eventoFound;
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

  async addColaboradoresToEvento(body){
    const { colaboradores, eventoId } = body;

    const evento = await models.Evento.findByPk(eventoId);
    const colaboradoresAssignedToOtherEvents = ''

    colaboradores.forEach(async (colabId) => {
      const colabAssigned = await this.checkIfColaboradorIsAlreadyAssigned(colabId, evento.fechaEvento);
      if (colabAssigned){
        colaboradoresAssignedToOtherEvents += `-${colabAssigned.nombre} ${colabAssigned.apPaterno}\n`;
      }
    });

    if(colaboradoresAssignedToOtherEvents.length){
      throw boom.illegal('Los siguientes colaboradores ya se encuentran asignados a otros eventos: \n' + colaboradoresAssignedToOtherEvents + '\nRegistre a otros colaboradores.');
    }

    const colaboradoresToAssing = await this.checkIfColaboradorIsAssignedToEvent(eventoId, colaboradores);

    if (!colaboradoresToAssing.length){
      throw boom.notAcceptable('Ya estos colaboradores han sido agregados, ingrese nuevos colaboradores');
    }

    colaboradoresToAssing.forEach(async (colaborador) => {
      const colaboradorEvento = {
        colaboradorId: colaborador,
        eventoId: eventoId,
      }
      await models.ColaboradorEvento.create(colaboradorEvento);
    });

    return colaboradoresToAssing;
  }

  async checkIfColaboradorIsAssignedToEvent(eventoId, colaboradoresToAssing){
    const colaboradoresEvent = await models.ColaboradorEvento.findAll({
      where: {
        eventoId: eventoId
      }
    });

    const colabToAssing = [];

    colaboradoresToAssing.forEach(id => {
      const isColabAssigned = colaboradoresEvent.some(colab => colab.colaboradorId === id);
      if (!isColabAssigned){
        colabToAssing.push(id);
      }
    });

    return colabToAssing;
  }

  async checkIfColaboradorIsAlreadyAssigned(colaboradorId, fechaEvento){
    let colabsAssigned = undefined;
    const eventos = await models.Evento.findAll({
      where: {
        fechaEvento: fechaEvento
      }
    });

    eventos.forEach(evento => {
      const colabIsInEvento = evento.colaboradores.find(colab => colab.id === colaboradorId);
      if (colabIsInEvento){
        colabsAssigned = colabIsInEvento;
      }
    });

    return colabsAssigned;
  }

  async addServiciosToEvento(body){
    const { servicios, eventoId } = body;

    servicios.forEach(async (servicio) => {
      const servicioEvento = {
        servicioId: servicio,
        eventoId: eventoId
      }
      await models.ServicioEvento.create(servicioEvento);
    })

    const evento = await this.findEventoById(eventoId);

    return evento;
  }

  async makeCotizacion(body){
    const { servicios, localId, diaId, cantidadPersonas, tipoBuffetId } = body;

    let precioTotal = 0;
    const precioReservaLocal = 200;

    const listadoServicios = [];
    let totalServicios = 0;

    servicios.forEach(async (servicio) => {
      listadoServicios.push(await servicioService.findServicioById(servicio));
    })

    const localDia = await models.LocalDia.findOne({
      where: {
        idLocal: localId,
        idDia: diaId
      }
    });
    const precioLocal = localDia.precioLocal;

    listadoServicios.forEach(servicio => {
      totalServicios += servicio.precio;
    })

    const tipoBuffet = await tipoBuffetService.findTipoBuffetById(tipoBuffetId);
    const precioTipoBuffet = cantidadPersonas * tipoBuffet.precioPorPlato;

    precioTotal = totalServicios + precioReservaLocal + precioLocal + precioTipoBuffet;

    return {
      tipoBuffet,
      precioTipoBuffet,
      listadoServicios,
      totalServicios,
      precioReservaLocal,
      precioLocal,
      precioTotal
    }
  }

  async getPrecioEvento(eventoId){
    const evento = await this.findEventoById(eventoId);
    const diaSemanaEvento = getDayOfTheWeek(evento.fechaEvento) + 1;
    const priceFound = await localService.findPricePerDay(evento.local.id, diaSemanaEvento);

    const COSTO_RESERVA_LOCAL = 200;
    let precioTotalEvento = 0;

    const precioLocal = priceFound.precioLocal;
    const precioTotalBuffet = evento.tipoBuffet.precioPorPlato * evento.cantidadPersonas;
    let precioServicios = 0;

    evento.servicios.forEach(servicio => precioServicios += servicio.precio);

    precioTotalEvento = COSTO_RESERVA_LOCAL + precioLocal +  precioTotalBuffet + precioServicios;

    return {
      COSTO_RESERVA_LOCAL,
      precioLocal,
      precioTotalBuffet,
      precioServicios,
      precioTotalEvento
    }
  }
}

module.exports = new EventoService();
