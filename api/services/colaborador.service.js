const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

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
