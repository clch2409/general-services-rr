const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt')

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

    return foundUser;
  }

  async findUserByEmail(email){
    const foundUser = await models.Usuario.scope('withPassword').findOne({
      where: {
        email: email
      }
    })

    return foundUser;
  }
}

module.exports = new UsuarioService();
