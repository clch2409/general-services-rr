const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_TIPO_BUFFET = 'tipo_buffet';

const tipoBuffetSchema = {
  id: {
    field: 'id_tipo_buffet',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  precioPorPlato: {
    field: 'precio_por_plato',
    allowNull: false,
    type: DataTypes.INTEGER,
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

class TipoBuffet extends Model{

  static associate(models){
    this.hasMany(models.Evento, {
      as: 'eventos',
      foreignKey: 'tipoBuffetId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_TIPO_BUFFET,
      modelName: 'TipoBuffet',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { TipoBuffet, TABLA_TIPO_BUFFET, tipoBuffetSchema}
