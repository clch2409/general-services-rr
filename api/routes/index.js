const express = require('express');
const { usuarioRouter } = require('./usuario.router');
const { rolRouter } = require('./rol.router');
const { authRouter } = require('./auth.router');
const { clienteRouter } = require('./cliente.router');
const { encargadoRouter } = require('./encargadoSalon.router');

const root = '/api/v1';

function routerApi(app){
  const router = express.Router();

  app.use(`${root}`, router);
  router.use('/usuarios', usuarioRouter);
  router.use('/roles', rolRouter);
  router.use('/auth', authRouter);
  router.use('/clientes', clienteRouter);
  router.use('/encargados', encargadoRouter);
}

module.exports = { routerApi }
