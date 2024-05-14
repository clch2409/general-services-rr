const { Router } = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const servicioService = require('./../services/servicio.service');

const { createServicioSchema, getServicioByIdSchema, updateServicioSchema } = require('./../schema/servicio.schema');

const servicioRouter = Router();


servicioRouter.get('',
  async (req, res, next) => {
    try{
      const servicios = await servicioService.findAll();

      res.status(200).json({
        servicios
      })
    }
    catch(e){
      next(e)
    }
  }
);

servicioRouter.post('',
  validatorHandler(createServicioSchema, 'body'),
  async (req, res, next) => {
    try{

      const { body } = req;
      const newServicio = await servicioService.createServicio(body);

      res.status(201).json({
        newServicio
      })
    }
    catch(e){
      next(e)
    }
  }
);

servicioRouter.get('/:id',
  validatorHandler(getServicioByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const foundServicio = await servicioService.findServicioById(id);

      res.status(200).json({
        foundServicio
      })
    }
    catch(e){
      next(e)
    }
  }
);

servicioRouter.patch('/:id',
  validatorHandler(getServicioByIdSchema, 'params'),
  validatorHandler(updateServicioSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req;
      const updatedServicio = await servicioService.updateServicio(params.id, body);

      res.status(200).json({
        updatedServicio
      })
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { servicioRouter }
