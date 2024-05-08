'use strict';

const { TABLA_DIA, diaSchema } = require('../models/dia.model');
const { TABLA_INSUMO, insumoSchema } = require('../models/insumo.model');
const { TABLA_INSUMO_LOCAL, insumoLocalSchema } = require('../models/insumoLocal.model');
const { TABLA_LOCAL, localSchema } = require('../models/local.model');
const { TABLA_LOCAL_DIA, localDiaSchema } = require('../models/localDia.model');
const { TABLA_PROVEEDOR, proveedorSchema } = require('../models/proveedor.model');
const { TABLA_PROVEEDOR_INSUMO, proveedorInsumoSchema } = require('../models/proveedorInsumo.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(TABLA_DIA, diaSchema);
    queryInterface.createTable(TABLA_PROVEEDOR, proveedorSchema);
    queryInterface.createTable(TABLA_INSUMO, insumoSchema);
    queryInterface.createTable(TABLA_INSUMO_LOCAL, insumoLocalSchema);
    queryInterface.createTable(TABLA_LOCAL, localSchema);
    queryInterface.createTable(TABLA_LOCAL_DIA, localDiaSchema);

    // queryInterface.createTable(TABLA_PROVEEDOR_INSUMO, proveedorInsumoSchema);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(TABLA_DIA);
    queryInterface.dropTable(TABLA_PROVEEDOR);
    queryInterface.dropTable(TABLA_INSUMO);
    queryInterface.dropTable(TABLA_INSUMO_LOCAL);
    queryInterface.dropTable(TABLA_LOCAL);
    queryInterface.dropTable(TABLA_LOCAL_DIA);
    // queryInterface.dropTable(TABLA_PROVEEDOR_INSUMO);
  }
};
