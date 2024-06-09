const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

class CargoService {

  async findAll(){
    return await models.Cargo.findAll({
      include: ['colaboradores']
    });
  }

  async findAllFormated(){
    const cargoFormatted = []

    const cargos = await this.findAll();

    cargos.forEach(cargo => {
      cargoFormatted.push(
        [
          cargo.nombre,
        ]
      );
    });

    return cargoFormatted;
  }

  async createCargo(body){
    return await models.Cargo.create(body);
  }

  async findCargoById(cargoId){
    const foundCargo = await models.Cargo.findByPk(cargoId, {
      include: ['colaboradores']
    });

    if(!foundCargo){
      throw boom.notFound('El cargo buscado no existe');
    }

    return foundCargo;
  }

  async updateCargo (cargoId, changes){
    const foundCargo = await this.findCargoById(cargoId);

    const updatedCargo = await foundCargo.update(changes);

    return updatedCargo;
  }
}

module.exports = new CargoService();
