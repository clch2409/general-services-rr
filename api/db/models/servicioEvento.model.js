const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_SERVICIO } = require('./servicio.model');
const { TABLA_EVENTO } = require('./evento.model');

const TABLA_SERVICIO_EVENTO = 'servicio_evento';

const servicioEventoSchema = {
  id: {
    field: 'id_servicio_evento',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  idServicio: {
    field: 'id_servicio',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_SERVICIO,
      key: 'id_servicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  idEvento: {
    field: 'id_evento',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_EVENTO,
      key: 'id_evento'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
}

class ServicioEvento extends Model{

  static associate(models){
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_SERVICIO_EVENTO,
      modelName: 'ServicioEvento',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { ServicioEvento, TABLA_SERVICIO_EVENTO, servicioEventoSchema}
