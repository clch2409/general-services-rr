const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_INSUMO } = require('./insumo.model');
const { TABLA_LOCAL } = require('./local.model');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

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
    field: 'id_insumo',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_INSUMO,
      key: 'id_insumo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  idLocal: {
    field: 'id_local',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_LOCAL,
      key: 'id_local'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  cantidad: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  precio: {
    allowNull: false,
    type: DataTypes.FLOAT(6,2).UNSIGNED,
  },
  fechaPrecio: {
    field: 'fecha_precio',
    allowNull: false,
    type: DataTypes.DATE,
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
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ACTIVO.name,
    validate: {
      isIn: [[ACTIVO.name, INACTIVO.name]]
    }
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
