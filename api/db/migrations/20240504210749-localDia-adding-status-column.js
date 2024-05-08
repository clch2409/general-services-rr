'use strict';

const { DataTypes } = require('sequelize');
const { TABLA_LOCAL_DIA } = require('../models/localDia.model');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(TABLA_LOCAL_DIA, 'status', {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: ACTIVO.name,
      validate: {
        isIn: [[ACTIVO.name, INACTIVO.name]]
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn(TABLA_LOCAL_DIA, 'status');
  }
};
