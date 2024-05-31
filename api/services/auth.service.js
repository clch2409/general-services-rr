const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const config = require('./../config/config');
const usuarioService = require('./usuario.service');

const { ACTIVO, INACTIVO } = require('./../utils/enums/status.enum');

class AuthService{

  async checkUserCredentiasl(email, password){

    const foundUser = await usuarioService.findUserByEmail(email);

    if(!foundUser){
      throw boom.unauthorized('El usuario no existe');
    }
    else if (foundUser.status === INACTIVO){
      throw boom.unauthorized('El usuario se encuentra inactivo');
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

  async changePassword(recoveryToken, newPassword){
    console.log({newPassword})
    const payload = jwt.verify(recoveryToken, config.jwtSecretRecovery);
    const foundUser = await usuarioService.findUserByIdWithRecovery(payload.sub);

    if (!foundUser || foundUser.recoveryToken !== recoveryToken){
      throw boom.unauthorized();
    }

    const passwordHashed = await bcrypt.hash(newPassword, 10);

    const changedPasswordUser = await usuarioService.updateUser(foundUser.id, {
      recoveryToken: null,
      contrasena: passwordHashed,
    });

    return changedPasswordUser;
  }

  async getMailInfo(userId){
    const foundUser = await usuarioService.findUserByEmail(userId);

    if(!foundUser){
      boom.unauthorized('Usuario no encontrado');
    }

    const jwtOptions = {
      expiresIn: '15min'
    }

    const newPayload = {
      sub: foundUser.id
    }

    const recoveryToken = jwt.sign(newPayload, config.jwtSecretRecovery, jwtOptions);

    await usuarioService.updateUser(foundUser.id, {
      recoveryToken
    });

    const mensaje = 'Ingrese al siguiente link para la recuperación de sus credenciales. '

    const mail = {
      from: config.senderEmail,
      to: foundUser.email,
      subject: 'Recuperación de Contraseña',
      html: mensaje + `<a href="http://localhost:4200/mi-cuenta/${recoveryToken}">Haga click aquí</a>`
    }

    const rta = await this.sendEmail(mail);

    rta.user = foundUser;

    return rta;
  }

  async sendEmail(mail){
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword
      }
    })

    await transporter.sendMail(mail);

    return {
      message: 'La página de recuperación ha sido enviada a su correo 📨'
    }
  }

}

module.exports = new AuthService()
