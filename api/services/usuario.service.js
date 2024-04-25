const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt')

class UsuarioService{

  async findAll(){
    return await models.Usuario.findAll({
      include: ['rol']
    });
  }

  async createUser(newUser){
    const nuevoUsuario = models.Usuario.create(newUser);

    return nuevoUsuario;
  }

}

module.exports = new UsuarioService();
