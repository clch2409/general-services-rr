'use strict';

const { TABLA_CLIENTE, clienteSchema } = require('../model/cliente.model');
const { TABLA_ENCARGADO, encargadoSchema } = require('../model/encargadoSalon.model');
const { TABLA_ROL, rolSchema } = require('../model/rol.model');
const { TABLA_USUARIO, usuarioSchema } = require('../model/usuario.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(TABLA_ROL, rolSchema);
    queryInterface.createTable(TABLA_USUARIO, usuarioSchema);
    queryInterface.createTable(TABLA_CLIENTE, clienteSchema);
    queryInterface.createTable(TABLA_ENCARGADO, encargadoSchema);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(TABLA_ROL);
    queryInterface.dropTable(TABLA_USUARIO);
    queryInterface.dropTable(TABLA_CLIENTE);
    queryInterface.dropTable(TABLA_ENCARGADO);
  }
};
