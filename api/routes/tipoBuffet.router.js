const { Router } = require('express');
const passport = require('passport');


const valitadorHandler = require('./../middlewares/validator.handler');
const tipoBuffetService = require('../services/tipoBuffet.service');

const { createTipoBuffetSchema, getTipoBuffetByIdSchema, updateTipoBuffetSchema } = require('../schema/tipoBuffet.schema');
const { CLIENTE, ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');
const { validateRoles } = require('./../middlewares/auth.handler');

const tipoBuffetRouter = Router();

tipoBuffetRouter.get('',
  passport.authenticate('jwt', { session: false }),
  validateRoles(CLIENTE.name, ADMIN.name, ENCARGADO.name),
  async (req, res, next) => {
    try{
      const tiposBuffet = await tipoBuffetService.findAll();

      res.status(200).json({
        tiposBuffet
      })
    }
    catch(e){
      next(e);
    }
  }
);

tipoBuffetRouter.post('',
  passport.authenticate('jwt', { session: false }),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(createTipoBuffetSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req
      const newTipoBuffet = await tipoBuffetService.createTipoBuffet(body);

      res.status(200).json({
        newTipoBuffet
      })
    }
    catch(e){
      next(e);
    }
  }
);

tipoBuffetRouter.get('/:id',
  passport.authenticate('jwt', { session: false }),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(getTipoBuffetByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params
      const foundBuffet = await tipoBuffetService.findTipoBuffetById(id);

      res.status(200).json({
        foundBuffet
      })
    }
    catch(e){
      next(e);
    }
  }
);

tipoBuffetRouter.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validateRoles(ADMIN.name, ENCARGADO.name),
  valitadorHandler(getTipoBuffetByIdSchema, 'params'),
  valitadorHandler(updateTipoBuffetSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req
      const updatedBuffet = await tipoBuffetService.updateTipoBuffet(params.id,body);

      res.status(200).json({
        updatedBuffet
      })
    }
    catch(e){
      next(e);
    }
  }
);

module.exports = { tipoBuffetRouter }
