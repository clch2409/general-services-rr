const boom = require('@hapi/boom');

const usuarioService = require('./../services/usuario.service');

const { models } = require('../libs/sequelize');
const { INACTIVO, ACTIVO } = require('../utils/enums/status.enum');

class EncargadoService{

  async findAll(){
    return await models.EncargadoSalon.findAll();
  }

  async findAllActiveEncargados(){
    return await models.EncargadoSalon.findAll({
      where: {
        status: ACTIVO.name,
        '$usuario.status$': ACTIVO.name
      }
    })
  }

  async createEncargado(body){
    const newEncargado = await models.EncargadoSalon.create(body, {
      include: ['usuario']
    });

    delete newEncargado.usuario.dataValues.contrasena

    return newEncargado;
  }

  async findEncargadoById(encargadoId){
    const foundEncargado = await models.EncargadoSalon.findByPk(encargadoId);

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

  async updateEncargado(encargadoId, changes){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    const updatedEncargado = await foundEncargado.update(changes);

    return updatedEncargado;
  }

  async deleteEncargado(encargadoId){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    if (foundEncargado.status === INACTIVO.name){
      throw boom.notAcceptable('El encargado ya se encuentra inactivo')
    }

    const deletedUsuario = await usuarioService.deleteUser(foundEncargado.usuario.id);

    const deletedEncargado = await foundEncargado.update({
      status: INACTIVO.name
    });


    return deletedEncargado;
  }

}

module.exports = new EncargadoService();
