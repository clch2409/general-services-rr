const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

const usuarioService = require('./usuario.service');

class AuthService{

  async checkUserCredentiasl(email, password){

    const foundUser = await usuarioService.findUserByEmail(email);

    if(!foundUser){
      boom.unauthorized('El usuario no existe');
    }

    const passwordMatches = await bcrypt.compare(foundUser.dataValues.contrasena, password);

    if(!passwordMatches){
      boom.unauthorized('La contraseña no coincide');
    }

    delete foundUser.dataValues.contrasena

    return foundUser
  }

}

module.exports = new AuthService()
