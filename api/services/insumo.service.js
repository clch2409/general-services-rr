const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

class InsumoService {

  async findAll(){
    return await models.Insumo.findAll();
  }

  async createInsumo(body){
    return await models.Insumo.create(body);
  }

  async findInsumoById(insumoId){
    const foundInsumo = await models.Insumo.findByPk(insumoId)

    if (!foundInsumo){
      throw boom.notFound('El insumo buscado no existe');
    }

    return foundInsumo;
  }

  async checkInsumoExistence(insumoId){
    const foundInsumo = await models.Insumo.findByPk(insumoId);

    return foundInsumo;
  }

  async updateInsumo(insumoId, changes){
    const foundInsumo = await this.findInsumoById(insumoId);

    const updatedInsumo = await foundInsumo.update(changes);

    console.log(updatedInsumo);

    return updatedInsumo;
  }

  async deleteInsumo (insumoId){
    const foundInsumo = await this.findInsumoById(insumoId);

    const deletedInsumo = await foundInsumo.update({
      status: INACTIVO.name
    });

    return deletedInsumo;
  }
}

module.exports = new InsumoService();
