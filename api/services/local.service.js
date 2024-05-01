const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { INACTIVO, ACTIVO } = require('../utils/enums/status.enum');

class LocalService{

  async findAll(){
    return await models.Local.findAll();
  }

  async findAllActivos(){
    return await models.Local.findAll({
      where: {
        status: ACTIVO.name
      }
    });
  }

  async createLocal(body){
    return await models.Local.create(body);
  }

  async findLocalById(localId){
    const localFound = await models.Local.findByPk(localId);

    if (!localFound){
      throw boom.notFound('El local buscado no existe');
    }

    return localFound;
  }

  async updateLocal(localId, changes){
    const localFound = await this.findLocalById(localId);

    const updatedLocal = await localFound.update(changes);

    return updatedLocal;
  }

  async deleteLocal (localId){
    const localFound = await this.findLocalById(localId);

    const deletedLocal = await localFound.update({
      status: INACTIVO.name
    });

    return deletedLocal;
  }

}

module.exports = new LocalService();
