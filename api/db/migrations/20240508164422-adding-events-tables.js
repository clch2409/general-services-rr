'use strict';

const { TABLA_CARGO, cargoSchema } = require('./../models/cargo.model');
const { TABLA_TIPO_EVENTO, tipoEventoSchema } = require('./../models/tipoEvento.model');
const { TABLA_COLABORADOR, colaboradorSchema} = require('./../models/colaborador.model');
const { TABLA_EVENTO, eventoSchema} = require('./../models/evento.model');
const { TABLA_SERVICIO, servicioSchema} = require('./../models/servicio.model');
const { TABLA_COLABORADOR_EVENTO, colaboradorEventoSchema} = require('./../models/colaboradorEvento.model');
const { TABLA_SERVICIO_EVENTO, servicioEventoSchema} = require('./../models/servicioEvento.model');
const { TABLA_TIPO_BUFFET, tipoBuffetSchema} = require('./../models/tipoBuffet.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(TABLA_CARGO, cargoSchema);
    queryInterface.createTable(TABLA_TIPO_EVENTO, tipoEventoSchema);
    queryInterface.createTable(TABLA_COLABORADOR, colaboradorSchema);
    queryInterface.createTable(TABLA_TIPO_BUFFET, tipoBuffetSchema);
    queryInterface.createTable(TABLA_EVENTO, eventoSchema);
    queryInterface.createTable(TABLA_SERVICIO, servicioSchema);
    queryInterface.createTable(TABLA_COLABORADOR_EVENTO, colaboradorEventoSchema);
    queryInterface.createTable(TABLA_SERVICIO_EVENTO, servicioEventoSchema);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(TABLA_CARGO);
    queryInterface.dropTable(TABLA_TIPO_EVENTO);
    queryInterface.dropTable(TABLA_COLABORADOR);
    queryInterface.dropTable(TABLA_TIPO_BUFFET);
    queryInterface.dropTable(TABLA_EVENTO);
    queryInterface.dropTable(TABLA_SERVICIO);
    queryInterface.dropTable(TABLA_COLABORADOR_EVENTO);
    queryInterface.dropTable(TABLA_SERVICIO_EVENTO);
  }
};
