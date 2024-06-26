const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class TipoBuffetService{

  async findAll(){
    return models.TipoBuffet.findAll();
  }

  async findAllFormated(){
    const tipoBuffetFormatted = []

    const tipoBuffets = await this.findAll();

    tipoBuffets.forEach(buffet => {
      tipoBuffetFormatted.push(
        [
          buffet.nombre,
          `S/. ${buffet.precioPorPlato}`,
        ]
      );
    });

    return tipoBuffetFormatted;
  }

  async createTipoBuffet(body){
    return models.TipoBuffet.create(body);
  }

  async findTipoBuffetById(tipoBuffetId){
    const tipoBuffetFound = await models.TipoBuffet.findByPk(tipoBuffetId);

    if (!tipoBuffetFound){
      throw boom.notFound('El buffet buscado no existe');
    }

    return tipoBuffetFound;
  }

  async updateTipoBuffet(tipoBuffetId, changes){
    const tipoBuffetFound = await this.findTipoBuffetById(tipoBuffetId);

    const tipoBuffetUpdated = await tipoBuffetFound.update(changes);

    return tipoBuffetUpdated;
  }

}

module.exports = new TipoBuffetService();
