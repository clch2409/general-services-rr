const boom = require('@hapi/boom');

const insumoService = require('./../services/insumo.service');

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
    const localFound = await models.Local.findByPk(localId, {
      include: ['insumos']
    });

    if (!localFound){
      throw boom.notFound('El local buscado no existe');
    }

    return localFound;
  }

  async checkLocalExistence(localId){
    const localFound = await models.Local.findByPk(localId);

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

  async checkInsumoAndLocalExistence(localId, insumoId){
    const insumoExists = await insumoService.checkInsumoExistence(insumoId);
    const localExits = await this.checkLocalExistence(localId);

    return insumoExists && localExits;
  }

  async findInsumosByLocal(localId, insumoId){
    const insumosFound = await models.InsumoLocal.findOne({
      idLocal: localId,
      idInsumo: insumoId
    })

    return insumosFound;
  }

  async addInsumoToLocal(body){
    const { idLocal, idInsumo, cantidad } = body;

    const localAndInsumoExist = await this.checkInsumoAndLocalExistence(idLocal, idInsumo);


    if (!localAndInsumoExist){
      throw boom.notFound('El local o el insumo no se encuentran registrados en el sistema, regístrelos para poder continuar.')
    }

    const insumosFound = await this.findInsumosByLocal(idLocal, idInsumo)

    if (!insumosFound){
      insumoAdded = await models.InsumoLocal.create({
        idLocal,
        idInsumo,
        cantidad
      })
      return insumoAdded;
    }

    return await insumosFound.update({
      cantidad: insumosFound.cantidad + cantidad,
    });
  }

  async takeInsumosOffLocal(body){
    const { idLocal, idInsumo, cantidad } = body;

    const localAndInsumoExist = await this.checkInsumoAndLocalExistence(idLocal, idInsumo);

    if (!localAndInsumoExist){
      throw boom.notFound('Ingrese correctamente el local y el insumo a retirar');
    }

    const insumosFound = await this.findInsumosByLocal(idLocal, idInsumo);

    if (insumosFound.cantidad === 0){
      throw boom.badRequest('No puede retirar dicho producto');
    }
  }
}

module.exports = new LocalService();
