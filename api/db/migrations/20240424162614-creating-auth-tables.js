'use strict';

const { TABLA_CLIENTE, clienteSchema } = require('../models/cliente.model');
const { TABLA_ENCARGADO, encargadoSchema } = require('../models/encargadoSalon.model');
const { TABLA_ROL, rolSchema } = require('../models/rol.model');
const { TABLA_USUARIO, usuarioSchema } = require('../models/usuario.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(TABLA_ROL, rolSchema);
    queryInterface.createTable(TABLA_USUARIO, usuarioSchema);
    queryInterface.createTable(TABLA_ENCARGADO, encargadoSchema);
    queryInterface.createTable(TABLA_CLIENTE, clienteSchema);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(TABLA_ROL);
    queryInterface.dropTable(TABLA_USUARIO);
    queryInterface.dropTable(TABLA_ENCARGADO);
    queryInterface.dropTable(TABLA_CLIENTE);
  }
};
