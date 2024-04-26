const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const config = require('./../config/config')
const { models } = require('../libs/sequelize');

const usuarioService = require('./usuario.service');

class AuthService{

  async checkUserCredentiasl(email, password){

    const foundUser = await usuarioService.findUserByEmail(email);

    if(!foundUser){
      throw boom.unauthorized('El usuario no existe');
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.dataValues.contrasena);

    if(!passwordMatches){
      throw boom.unauthorized('La contraseña no coincide');
    }

    delete foundUser.dataValues.contrasena

    return foundUser
  }

  singToken(user){

    const jwtConfig = {
      expiresIn: '20min'
    }

    const payload = {
      sub: user.id,
      rol: user.rol.nombre,
    }

    const token = jwt.sign(payload, config.jwtSecretAuth, jwtConfig);

    return token;

  }

}

module.exports = new AuthService()
