const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class ColaboradorService{

  async findAll(){
    return await models.Colaborador.findAll();
  }

  async createColaborador(body){
    return await models.Colaborador.create(body);
  }
}

module.exports = new ColaboradorService();
