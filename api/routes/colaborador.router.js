const { Router } = require('express');

const colaboradorService = require('./../services/colaborador.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createColaboradorSchema, getColaboradorByIdSchema, updateColaboradorSchema } = require('./../schema/colaborador.schema');

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
)

module.exports = { colaboradorRouter }
