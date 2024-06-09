const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class ServicioService{

  async findAll(){
    return await models.Servicio.findAll({
      include: ['proveedor']
    });
  }

  async findAllFormated(){
    const serviciosFormatted = []

    const servicios = await this.findAll();

    servicios.forEach(servicio => {
      serviciosFormatted.push(
        [
          servicio.nombre,
          `S/. ${servicio.precio}`,
          servicio.proveedor.nombre,
          servicio.status,
        ]
      );
    });

    return serviciosFormatted;
  }

  async createServicio(body){
    return await models.Servicio.create(body);
  }

  async findServicioById(servicioId){
    const servicioFound = await models.Servicio.findByPk(servicioId);

    if (!servicioFound){
      throw boom.notFound('El servicio no se encuentra registrado');
    }

    return servicioFound;
  }

  async updateServicio(servicioId, changes){
    const servicioFound = await this.findServicioById(servicioId);

    const servicioUpdated = await servicioFound.update(changes);

    return servicioUpdated;
  }


}

module.exports = new ServicioService();
