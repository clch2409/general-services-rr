const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { models } = require('../libs/sequelize');
const { INACTIVO } = require('../utils/enums/status.enum');

class UsuarioService{

  async findAll(){
    return await models.Usuario.findAll({
      // include: ['rol']
    });
  }

  async createUser(newUser){
    const nuevoUsuario = await models.Usuario.create(newUser);

    delete nuevoUsuario.dataValues.contrasena

    return nuevoUsuario;
  }

  async findUserById(id){
    const foundUser = await models.Usuario.findByPk(id);

    if (!foundUser){
      throw boom.notFound('El usuario buscado no existe');
    }

    return foundUser;
  }

  async findUserByIdWithRecovery(id){
    const foundUser = await models.Usuario.scope('withRecoveryToken').findByPk(id);

    if (!foundUser){
      throw boom.notFound('El usuario buscado no existe');
    }

    return foundUser;
  }

  async findUserByEmail(email){
    const foundUser = await models.Usuario.scope('withPassword').findOne({
      where: {
        email: email
      }
    })

    if (!foundUser){
      throw boom.notFound('El usuario buscado no existe');
    }

    return foundUser;
  }

  async updateUser(userId, changes){
    const foundUser = await this.findUserById(userId);

    const updatedUser = await foundUser.update(changes);

    return updatedUser;
  }

  async deleteUser(userId){
    const foundUser = await this.findUserById(userId);

    if (foundUser.status === INACTIVO.name){
      throw boom.notAcceptable('El usuario ya se encuentra inactivo')
    }
    foundUser.update({
      status: INACTIVO.name
    })

    return {
      message: 'El usuario ha sido eliminado',
      foundUser
    }
  }
}

module.exports = new UsuarioService();
