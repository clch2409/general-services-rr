const { Model, DataTypes, Sequelize } = require('sequelize');
const { INACTIVO, ACTIVO } = require('../../utils/enums/status.enum');
const { TABLA_PROVEEDOR } = require('./proveedor.model');

const TABLA_INSUMO = 'insumos';

const insumoSchema = {
  id: {
    field: 'id_insumo',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  proveedorId: {
    field: 'id_proveedor',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_PROVEEDOR,
      key: 'id_proveedor'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  precio: {
    allowNull: false,
    type: DataTypes.FLOAT(6,2).UNSIGNED,
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
  },
}

class Insumo extends Model{

  static associate(models){
    this.belongsTo(models.Proveedor, {
      as: 'proveedor'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_INSUMO,
      modelName: 'Insumo',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
    }
  }
}

module.exports = { Insumo, TABLA_INSUMO, insumoSchema}
