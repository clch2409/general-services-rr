const express = require('express');
const { usuarioRouter } = require('./usuario.router');
const { rolRouter } = require('./rol.router');

const root = '/api/v1';

function routerApi(app){
  const router = express.Router();

  app.use(`${root}`, router);
  router.use('/users', usuarioRouter);
  router.use('/roles', rolRouter);
}

module.exports = { routerApi }
