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

module.exports = { authRouter };
