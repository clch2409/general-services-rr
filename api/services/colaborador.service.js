const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

const config = require('./../config/config');

const { models } = require('./../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');
// const { getHoursToString } = require('./../utils/functions/date.functions');

class ColaboradorService{

  async findAll(){
    return await models.Colaborador.findAll();
  }

  async createColaborador(body){
    await this.checkDniAndHiringDate(body);

    return await models.Colaborador.create(body);
  }

  async findColaboradorById(colaboradorId){
    const colaboradorFound = await models.Colaborador.findByPk(colaboradorId);

    if (!colaboradorFound){
      throw boom.notFound('El colaborador no existe');
    }

    return colaboradorFound;
  }

  async findColaboradorByDni(colabroadorDni){
    const colaboradorFound = await models.Colaborador.findAll({
      where: {
        dni: colabroadorDni
      }
    });

    if (!colaboradorFound){
      throw boom.notFound('El colaborador no existe');
    }

    return colaboradorFound;
  }

  async updateColaborador(colaboradorId, changes){
    const colaboradorFound = await this.findColaboradorById(colaboradorId);

    const updatedColaborador = colaboradorFound.update(changes);

    return updatedColaborador;
  }

  async deleteColaborador(colaboradorId){
    const colaboradorFound = await this.findColaboradorById(colaboradorId);

    const colaboradorUpdated = await colaboradorFound.update({
      status: INACTIVO.name
    });

    return colaboradorUpdated
  }

  async checkDniAndHiringDate(body){
    const colaboradorFound = await this.checkColaboradorExistenceByDni(body.dni);
    const checkFechaContrato = this.checkFechaContratoIsValid(body.fechaContratacion);

    if (colaboradorFound){
      throw boom.notAcceptable('El dni del colaborador ya se encuentra registrado.');
    }
    else if (!checkFechaContrato){
      throw boom.notAcceptable('La fecha de contratación no puede ser después a la fecha de hoy');
    }
  }

  async sendEmailToColaborador(eventoId, colaboradoresId){
    const colaboradores = []

    colaboradoresId.forEach(async (id) => colaboradores.push(await models.Colaborador.findByPk(id)));

    const evento = await models.Evento.findByPk(eventoId);
    const opcionesFecha = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    const opcionesHoras = {
      hour: '2-digit',
      minute: '2-digit'
    }

    const fechaEvento = new Date(evento.fechaEvento).toLocaleDateString('es-PE', opcionesFecha);
    const horaInicioDate = new Date(evento.horaInicio).toLocaleTimeString('es-PE', opcionesHoras);
    const horaFinDate = new Date(evento.horaFin).toLocaleTimeString('es-PE', opcionesHoras);

    const local = evento.local.nombre;
    const nombreEncargado = `${evento.encargado.nombres} ${evento.encargado.apPaterno}`

    let message = 'Ha sido asignado a un evento. Aquí se le listará los datos del evento: \n\n';
    message += `-Fecha: ${fechaEvento} \n`;
    message += `-Jefa de Salón: ${nombreEncargado} \n`;
    message += `-Local: ${local} \n`;
    message += `-Tipo de Evento: ${evento.tipoEvento.nombre} \n`;
    message += `-Hora de Inicio del Evento: ${horaInicioDate}\n`;
    message += `-Hora de Finalización del Evento: ${horaFinDate}\n\n`;
    message += `Atte: La Gerencia`;

    const mail = {
      from: config.senderEmail,
      subject: 'Asignación a Evento',
      text: message
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword
      }
    });

    colaboradores.forEach(async (colaborador) => {
      mail.to = colaborador.email;
      await transporter.sendMail(mail);
    });

    return colaboradores;
  }

  async checkColaboradorExistenceByDni(colaboradorDni){
    return await models.Colaborador.findOne({
      where: {
        dni: colaboradorDni
      }
    });
  }

  checkFechaContratoIsValid(fechaContrato){
    const fechaHoy = new Date();
    const fechaContratacionColaborador = new Date(fechaContrato);

    return fechaHoy > fechaContratacionColaborador
  }

}

module.exports = new ColaboradorService();
