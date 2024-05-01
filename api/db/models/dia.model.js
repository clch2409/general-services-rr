const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_DIA = 'dias';

const diaSchema = {
  id: {
    field: 'id_dia',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}

class Dia extends Model{

  static associate(models){
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_DIA,
      modelName: 'Dia',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { Dia, TABLA_DIA, diaSchema}
