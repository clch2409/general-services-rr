const express = require('express');
const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const authService = require('../services/auth.service');
const { loginSchema } = require('../schema/usuario.schema');

const authRouter = express.Router();

authRouter.post('/login',
  validatorHandler(loginSchema, 'body'),
  passport.authenticate('local', {session: false}),
  async (req, res, next) =>{
    try{
      const { user } = req;
      const token = await authService.singToken(user);

      res.status(202).json({
        user,
        token
      })
    }
    catch(e){
      next(e)
    }
  }
);

authRouter.post('/recovery',
  passport.authenticate('jwt', {session: false}),
  async (req, res, next) =>{
    try{
      const payload = req.user;
      const rta = await authService.getMailInfo(payload.sub);

      res.status(202).json({
        rta
      })
    }
    catch(e){
      next(e)
    }
  }
);

authRouter.post('/change/password',
  async (req, res, next) =>{
    try{
      const {token, contrasena} = req.body;
      const rta = await authService.changePassword(token, contrasena);

      res.status(202).json({
        rta
      })
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { authRouter };
