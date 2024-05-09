const { Router } = require('express');

const cargoService = require('./../services/cargo.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createCargoSchema, getCargoSchema, updateCargoSchema } = require('./../schema/cargo.schema');

const cargoRouter = Router();

cargoRouter.get('',
  async (req, res, next) =>{
    try{
      const cargos = await cargoService.findAll();

      res.status(200).json({
        cargos
      });
    }
    catch(e){
      next(e)
    }
  }
);

cargoRouter.post('',
  validatorHandler(createCargoSchema, 'body'),
  async (req, res, next) =>{
    try{
      const { body } = req;
      const newCargo = await cargoService.createCargo(body);

      res.status(200).json({
        newCargo
      });
    }
    catch(e){
      next(e)
    }
  }
);

cargoRouter.get('/:id',
  validatorHandler(getCargoSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const cargoFound = await cargoService.findCargoById(id)

      res.status(302).json({
        cargoFound
      });
    }
    catch(e){
      next(e)
    }
  }
);

cargoRouter.patch('/:id',
  validatorHandler(getCargoSchema, 'params'),
  validatorHandler(updateCargoSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req;
      const updatedCargo = await cargoService.updateCargo(params.id, body);

      res.status(200).json({
        updatedCargo
      });
    }
    catch(e){
      next(e)
    }
  }
);


module.exports = { cargoRouter }
