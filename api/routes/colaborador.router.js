const { Router } = require('express');

const colaboradorService = require('./../services/colaborador.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createColaboradorSchema, getColaboradorByIdSchema, updateColaboradorSchema, getColaboradorByDniSchema } = require('./../schema/colaborador.schema');

const colaboradorRouter = Router();

colaboradorRouter.get('',
  async (req, res, next) => {
    try {
      const colaboradores = await colaboradorService.findAll();

      res.status(200).json({
        colaboradores
      });
    } catch (e) {
      next(e)
    }
  }
);

colaboradorRouter.post('',
  validatorHandler(createColaboradorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { body } = req;
      const newColaborador = await colaboradorService.createColaborador(body);

      res.status(201).json({
        newColaborador
      });
    } catch (e) {
      next(e)
    }
  }
);

colaboradorRouter.get('/:id',
  validatorHandler(getColaboradorByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const foundColaborador = await colaboradorService.findColaboradorById(id);

      res.status(302).json({
        foundColaborador
      });
    }
    catch(e){
      next(e)
    }
  }
);

colaboradorRouter.get('/dni/:dni',
  validatorHandler(getColaboradorByDniSchema, 'params'),
  async (req, res, next) => {
    try{
      const { dni } = req.params;
      const foundColaborador = await colaboradorService.findColaboradorByDni(dni);

      res.status(302).json({
        foundColaborador
      });
    }
    catch(e){
      next(e)
    }
  }
);

colaboradorRouter.patch('/:id',
  validatorHandler(getColaboradorByIdSchema, 'params'),
  validatorHandler(updateColaboradorSchema, 'body'),
  async (req, res, next) => {
    try{
      const { params, body } = req;
      const updatedColaborador = await colaboradorService.updateColaborador(params.id, body);

      res.status(200).json({
        updatedColaborador
      });
    }
    catch(e){
      next(e)
    }
  }
);

colaboradorRouter.delete('/:id',
  validatorHandler(getColaboradorByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const deletedColaborador = await colaboradorService.deleteColaborador(id);

      res.status(200).json({
        deletedColaborador
      });
    }
    catch(e){
      next(e)
    }
  }
);

module.exports = { colaboradorRouter }
