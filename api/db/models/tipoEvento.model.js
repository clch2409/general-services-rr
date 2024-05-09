const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_TIPO_EVENTO = 'tipo_evento';

const tipoEventoSchema = {
  id: {
    field: 'id_tipo_evento',
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

class TipoEvento extends Model{

  static associate(models){
    this.hasMany(models.Evento, {
      as: 'eventos',
      foreignKey: 'tipoEventoId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_TIPO_EVENTO,
      modelName: 'TipoEvento',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { TipoEvento, TABLA_TIPO_EVENTO, tipoEventoSchema}
