const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class EventoService {

  async findAll(){
    return models.Evento.findAll()
  }

  async createEvento(body){
    return models.Evento.create(body);
  }

}

module.exports = new EventoService();
