const { Model, DataTypes, Sequelize } = require('sequelize');

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
  }
}

class Insumo extends Model{

  static associate(models){

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
      }
    }
  }
}

module.exports = { Insumo, TABLA_INSUMO, insumoSchema}
