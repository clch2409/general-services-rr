'use strict';

const { DataTypes } = require('sequelize');
const { TABLA_ENCARGADO } = require('../models/encargadoSalon.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // queryInterface.addColumn(TABLA_ENCARGADO, 'status', {
    //   allowNull: false,
    //   type: DataTypes.STRING,
    //   validate: {
    //     isIn: ['activo', 'inactivo']
    //   }
    // });
  },

  async down (queryInterface, Sequelize) {
    // queryInterface.addColumn(TABLA_ENCARGADO, 'status')
  }
};
