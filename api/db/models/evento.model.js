const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_ENCARGADO } = require('./encargadoSalon.model');
const { TABLA_CLIENTE } = require('./cliente.model');
const { TABLA_LOCAL } = require('./local.model');
const { TABLA_TIPO_EVENTO } = require('./tipoEvento.model');
const { RESERVADO, REALIZADO, EN_PROCESO, CANCELADO } = require('../../utils/enums/statusEvento.enum');

const TABLA_EVENTO = 'eventos';

const eventoSchema = {
  id: {
    field: 'id_evento',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  colorEvento: {
    field: 'color_evento',
    allowNull: false,
    type: DataTypes.STRING,
  },
  fechaEvento: {
    field: 'fecha_evento',
    allowNull: false,
    type: DataTypes.DATE,
  },
  horaInicio: {
    field: 'hora_inicio',
    allowNull: false,
    type: DataTypes.TIME,
  },
  horaFin: {
    field: 'hora_fin',
    allowNull: false,
    type: DataTypes.TIME,
  },
  encargadoId: {
    field: 'id_encargado',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_ENCARGADO,
      key: 'id_encargado'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  clienteId: {
    field: 'id_cliente',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_CLIENTE,
      key: 'id_cliente'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  localId: {
    field: 'id_local',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_LOCAL,
      key: 'id_local'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  tipoEventoId: {
    field: 'id_tipo_evento',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_TIPO_EVENTO,
      key: 'id_tipo_evento'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: RESERVADO.name,
    validate: {
      isIn: [[RESERVADO.name, REALIZADO.name, EN_PROCESO.name, CANCELADO.name]]
    }
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

class Evento extends Model{

  static associate(models){
    this.belongsTo(models.EncargadoSalon, {
      as: 'encargado'
    });
    this.belongsTo(models.Cliente, {
      as: 'cliente'
    });
    this.belongsTo(models.Local, {
      as: 'local'
    });
    this.belongsTo(models.TipoEvento, {
      as: 'tipoEvento'
    });
    this.belongsToMany(models.Servicio, {
      as: 'servicios',
      through: models.ServicioEvento,
      foreignKey: 'eventoId',
      otherKey: 'servicioId',
    });
    this.belongsToMany(models.Colaborador, {
      as: 'colaboradores',
      through: models.ColaboradorEvento,
      foreignKey: 'eventoId',
      otherKey: 'colaboradorId',
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_EVENTO,
      modelName: 'Evento',
      hooks: {
        afterUpdate: async (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
    }
  }
}

module.exports = { Evento, TABLA_EVENTO, eventoSchema }
