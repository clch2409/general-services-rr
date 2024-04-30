const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_INSUMO } = require('./insumo.model');
const { TABLA_LOCAL } = require('./local.model');

const TABLA_INSUMO_LOCAL = 'insumo_local';

const insumoLocalSchema = {
  id: {
    field: 'id_insumo_local',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  idInsumo: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_INSUMO,
      key: 'id_insumo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  idLocal: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_LOCAL,
      key: 'id_local'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
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
  }
}

class InsumoLocal extends Model{

  static associate(models){

  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_INSUMO_LOCAL,
      modelName: 'InsumoLocal',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { InsumoLocal, TABLA_INSUMO_LOCAL, insumoLocalSchema}
