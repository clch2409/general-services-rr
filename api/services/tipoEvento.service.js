const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class TipoEventoService{

  async findAll(){
    return models.TipoEvento.findAll();
  }

  async findAllFormated(){
    const tipoEventoFormatted = []

    const tipoEventos = await this.findAll();

    tipoEventos.forEach(evento => {
      tipoEventoFormatted.push(
        [
          evento.nombre,
        ]
      );
    });

    return tipoEventoFormatted;
  }

  async createTipoEvento(body){
    return models.TipoEvento.create(body);
  }

  async findTipoEventoById(tipoEventoId){
    const tipoEventoFound = await models.TipoEvento.findByPk(tipoEventoId);

    if (!tipoEventoFound){
      throw boom.notFound('El tipo de evento no existe');
    }

    return tipoEventoFound;
  }

  async updateTipoEvento(tipoEventoId, changes){
    const tipoEventoFound = await this.findTipoEventoById(tipoEventoId);

    const tipoEventoUpdated = await tipoEventoFound.update(changes);

    return tipoEventoUpdated;
  }

}

module.exports = new TipoEventoService();
