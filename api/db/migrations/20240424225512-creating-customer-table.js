'use strict';

const { TABLA_CLIENTE, clienteSchema } = require('../models/cliente.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(TABLA_CLIENTE, clienteSchema);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(TABLA_CLIENTE);
  }
};
