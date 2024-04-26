const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator.handler');
const { loginSchema } = require('../schema/usuario.schema');

const authRouter = express.Router();

authRouter.post('/login',
  validatorHandler(loginSchema, 'body'),
  passport.authenticate('local', {session: false}),
  async (req, res, next) =>{
    try{
      res.status(200).json({
        message: 'Ha ingresado con éxito'
      })
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { authRouter };
