const express = require('express');
const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const authService = require('../services/auth.service');
const { loginSchema, changePasswordSchema } = require('../schema/usuario.schema');

const authRouter = express.Router();

//***************** Rutas ******************
authRouter.post('/login',
  validatorHandler(loginSchema, 'body'),
  passport.authenticate('local', {session: false}),
  loginUser
);

authRouter.post('/recovery',
  // passport.authenticate('jwt', {session: false}),
  sendRecoveryEmail
);

authRouter.post('/change/password',
  validatorHandler(changePasswordSchema, 'body'),
  changePassword
);
//***************** Rutas ******************

//***************** Funciones ******************
async function loginUser(req, res, next){
  try{
    const { user } = req;
    const token = await authService.singToken(user);

    res.status(200).json({
      user,
      token
    })
  }
  catch(e){
    next(e)
  }
}

async function sendRecoveryEmail(req, res, next){
  try{
    const { body } = req;
    const rta = await authService.getMailInfo(body.email);

    res.status(200).json({
      rta
    })
  }
  catch(e){
    next(e)
  }
}

async function changePassword(req, res, next){
  try{
    console.log({
      body: req.body
    })
    const {token, newPassword} = req.body;
    const rta = await authService.changePassword(token, newPassword);

    res.status(200).json({
      rta
    })
  }
  catch(e){
    next(e)
  }
}
//***************** Funciones ******************

module.exports = { authRouter };
