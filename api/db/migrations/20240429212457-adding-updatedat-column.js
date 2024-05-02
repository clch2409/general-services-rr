'use strict';

const { DataTypes } = require('sequelize');
const { TABLA_CLIENTE } = require('../models/cliente.model');
const { TABLA_ENCARGADO } = require('../models/encargadoSalon.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // queryInterface.addColumn(TABLA_CLIENTE, 'updated_at', {
    //   field: 'updated_at',
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    // });

    // queryInterface.addColumn(TABLA_ENCARGADO, 'updated_at', {
    //   field: 'updated_at',
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    // });
  },

  async down (queryInterface, Sequelize) {
    // queryInterface.removeColumn(TABLA_CLIENTE, 'updated_at');
    // queryInterface.removeColumn(TABLA_ENCARGADO, 'updated_at');
  }
};
