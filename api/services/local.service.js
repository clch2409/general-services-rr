const boom = require('@hapi/boom');

const insumoService = require('./../services/insumo.service');

const { models } = require('./../libs/sequelize');
const { INACTIVO, ACTIVO } = require('../utils/enums/status.enum');
const { Sequelize } = require('sequelize');

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
      status: INACTIVO.name,
      fechaInactivacion: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    return deletedLocal;
  }

  async addPriceToLocal(body){
    const { idDia, idLocal } = body;

    const localHasPrice = await this.getPricePerDay(idDia, idLocal);
    if (localHasPrice){
      throw boom.notAcceptable('Este local ya cuenta con un precio');
    }

    return models.LocalDia.create(body);
  }

  async addPriceAllPricesToLocal(body){
    const { dias, idLocal, precios } = body;

    for(let i = 0; i < dias.length; i++){
      const dia = dias[i];
      const localHasPrice = await this.getPricePerDay(dia, idLocal);
      if (localHasPrice){
        throw boom.notAcceptable('Uno de los locales ya cuenta con precio, por favor modifíquelo');
      }
    }

    dias.forEach(async (diaId, index) => {
      const localDia = {
        idLocal: idLocal,
        idDia: diaId,
        precioLocal: precios[index],
      }

      await models.LocalDia.create(localDia);
    })

    const preciosByLocal = await this.findLocalById(idLocal);

    return preciosByLocal;
  }

  async modifyPriceOfLocal(localId, diaId, price){
    const localDia = await models.LocalDia.findOne({
      where: {
        idLocal: localId,
        idDia: diaId
      }
    });

    await localDia.update({
      precio: price
    });

    return localDia;
  }

  async getPricePerDay(diaId, localId){
    return await models.LocalDia.findOne({
      where: {
        idLocal: localId,
        idDia: diaId
      }
    })
  }

  async findPricePerDay(localId, dayId){
    const foundPrice = await models.LocalDia.findOne({
      where: {
        idLocal: localId,
        idDia: dayId
      }
    });

    if (!foundPrice){
      throw boom.notFound('El precio buscado no existe');
    }

    return foundPrice;
  }

  //Se agrega el insumo por local y su cantidad, verifica si el insumo ya está en el local y le agrega la cantidad ingresada
  async addInsumoToLocal(idLocal, idInsumo, cantidad){

    const localAndInsumoExist = await this.checkInsumoAndLocalExistence(idLocal, idInsumo);

    if (!localAndInsumoExist.bothExist){
      throw boom.notFound('El local o el insumo no se encuentran registrados en el sistema, regístrelos para poder continuar.');
    }
    else if (localAndInsumoExist.localExits.status === INACTIVO.name){
      throw boom.notFound('No puede agregar insumos a un local que está inactivo');
    }
    else if (localAndInsumoExist.insumoExists.status === INACTIVO.name){
      throw boom.notFound('No puede agregar un insumo que se encuentra inactivo');
    }

    const insumosFound = await this.findInsumosByLocal(idLocal, idInsumo);

    if (!insumosFound){
      const insumoFound = localAndInsumoExist.insumoExists;
      const newInsumoLocal = {
        idLocal,
        idInsumo,
        cantidad,
        precio: insumoFound.precio,
        fechaPrecio: insumoFound.createdAt,
      }
      const insumoAdded = await models.InsumoLocal.create(newInsumoLocal);
      return insumoAdded;
    }

    return await insumosFound.update({
      cantidad: insumosFound.cantidad + cantidad,
    });
  }

  //Retiro de insumos de los locales
  async takeInsumosOffLocal(localId, insumoId, cantidad){

    const localAndInsumoExist = await this.checkInsumoAndLocalExistence(localId, insumoId);

    if (!localAndInsumoExist.bothExist){
      throw boom.notFound('El local o el insumo no se encuentran registrados en el sistema, regístrelos para poder continuar.');
    }

    const insumosFound = await this.findInsumosByLocal(localId, insumoId);

    if (!insumosFound){
      throw boom.notFound('El insumo solicitado no se encuentra ingresado en este local.');
    }
    else if (insumosFound.cantidad === 0){
      throw boom.badRequest('Ya no hay insumos en el local');
    }
    else if (cantidad > insumosFound.cantidad){
      throw boom.badRequest('No puede retirar más insumos de los que se encuentran registrados');
    }


    return await insumosFound.update({
      cantidad: insumosFound.cantidad - cantidad
    });
  }

  async moveInsumosToAnotherLocal(oldLocalId, newLocalId, insumoId, cantidad){

    if (oldLocalId === newLocalId){
      throw boom.badRequest('El id de los locales es el mismo, por favor, ingrese unos diferentes. Sino, use otras rutas');
    }

    const retiredInsumosFromLocal = await this.takeInsumosOffLocal(oldLocalId, insumoId, cantidad);

    const addedInsumoToLocal = await this.addInsumoToLocal(newLocalId, insumoId, cantidad);

    return {
      retiredInsumosFromLocal,
      addedInsumoToLocal
    }
  }


  async checkInsumoAndLocalExistence(localId, insumoId){
    const insumoExists = await insumoService.checkInsumoExistence(insumoId);
    const localExits = await this.checkLocalExistence(localId);

    return {
      bothExist: insumoExists && localExits,
      insumoExists,
      localExits
    };
  }

  async findInsumosByLocal(localId, insumoId){
    const insumosFound = await models.InsumoLocal.findOne({
      where: {
        idLocal: localId,
        idInsumo: insumoId
      }
    })

    return insumosFound;
  }
}

module.exports = new LocalService();
