const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

class InsumoService {

  async findAll(){
    return await models.Insumo.findAll({
      include: ['proveedor']
    });
  }

  async findAllFormated(){
    const insumosFormated = []

    const insumos = await this.findAll();

    insumos.forEach(insumo => {
      insumosFormated.push(
        [
          insumo.nombre,
          `S/. ${insumo.precio}`,
          insumo.proveedor.nombre,
          insumo.status,
        ]
      );
    });

    return insumosFormated;
  }

  async createInsumo(body){
    return await models.Insumo.create(body);
  }

  async findInsumoById(insumoId){
    const foundInsumo = await models.Insumo.findByPk(insumoId, {
      include: ['proveedor']
    });

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

    return updatedInsumo;
  }

  async deleteInsumo (insumoId){
    const foundInsumo = await this.findInsumoById(insumoId);

    if (foundInsumo.status === INACTIVO.name){
      throw boom.notAcceptable('El insumo ya se encuentra inactivo!');
    }

    const deletedInsumo = await foundInsumo.update({
      status: INACTIVO.name
    });

    return deletedInsumo;
  }
}

module.exports = new InsumoService();
