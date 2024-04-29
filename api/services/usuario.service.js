const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class UsuarioService{

  async findAll(){
    return await models.Usuario.findAll({
      include: ['rol']
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

  async updateUser(userID, changes){
    const updatedUser = await models.Usuario.update(changes, {
      where: {
        id: userID
      }
    });

    if (!foundUser){
      throw boom.notFound('El usuario buscado no existe');
    }

    return updatedUser;
  }

  async deleteUser(userId){
    const deletedUser = await this.updateUser(userId, {
      status: false,
    });

    return {
      message: 'El usuario ha sido eliminado',
      deletedUser
     }
  }
}

module.exports = new UsuarioService();
