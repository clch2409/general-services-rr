const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_LOCAL } = require('./local.model');
const { TABLA_DIA } = require('./dia.model');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

const TABLA_LOCAL_DIA = 'local_dia';

const localDiaSchema = {
  id: {
    field: 'id_local_dia',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  idDia: {
    field: 'id_dia',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_DIA,
      key: 'id_dia'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  precioLocal: {
    field: 'precio_local',
    allowNull: false,
    type: DataTypes.FLOAT(6,2),
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

class LocalDia extends Model{

  static associate(models){

  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_LOCAL_DIA,
      modelName: 'LocalDia',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { LocalDia, TABLA_LOCAL_DIA, localDiaSchema}
