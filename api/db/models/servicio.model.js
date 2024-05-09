const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_SERVICIO = 'servicios';

const servicioSchema = {
  id: {
    field: 'id_servicio',
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
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}

class Servicio extends Model{

  static associate(models){
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_SERVICIO,
      modelName: 'Servicio',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { Servicio, TABLA_SERVICIO, servicioSchema}
