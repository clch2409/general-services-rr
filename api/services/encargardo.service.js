const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

class EncargadoService{

  async findAll(){
    return await models.EncargadoSalon.findAll();
  }

  async createEncargado(body){
    const newEncargado = await models.EncargadoSalon.create(body, {
      include: ['usuario']
    });

    delete newEncargado.usuario.dataValues.contrasena

    return newEncargado;
  }

  async findEncargadoById(encargadoId){
    const foundEncargado = await models.EncargadoSalon.findByPk(clienteId);

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async findEncargadoByDni(dni){
    const foundEncargado = await models.EncargadoSalon.findOne({
      where: {
        dni: dni
      },
    });

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async findEncargadoByEmail(email){
    const foundEncargado = await models.EncargadoSalon.findOne({
      where: {
        '$usuario.email$': email
      },
      // include: ['usuario']
    });

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async updateCliente(encargadoId, changes){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    const updatedEncargado = await foundEncargado.update(changes);

    return updatedEncargado;
  }

  async deleteEncargado(encargadoId){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    const deletedEncargado = await foundEncargado.update({
      status: INACTIVO.name
    });

    return deletedEncargado;
  }

}

module.exports = new EncargadoService();
