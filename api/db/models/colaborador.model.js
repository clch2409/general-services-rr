const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_CARGO } = require('./cargo.model');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

const TABLA_COLABORADOR = 'colaboradores';

const colaboradorSchema = {
  id: {
    field: 'id_colaborador',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombres: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  apPaterno: {
    field: 'ap_paterno',
    allowNull: false,
    type: DataTypes.STRING,
  },
  apMaterno: {
    field: 'ap_materno',
    allowNull: false,
    type: DataTypes.STRING
  },
  telefono: {
    allownull: false,
    type: DataTypes.CHAR(9),
  },
  dni: {
    allowNull: false,
    type: DataTypes.STRING(9),
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  fechaContratacion: {
    field: 'fecha_contratacion',
    allowNull: false,
    type: DataTypes.DATE,
  },
  cargoId: {
    field: 'id_cargo',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_CARGO,
      key: 'id_cargo'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ACTIVO.name,
    validate: {
      isIn: [[ACTIVO.name, INACTIVO.name]]
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

class Colaborador extends Model{

  static associate(models){
    this.belongsTo(models.Cargo, { as: 'cargo' });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_COLABORADOR,
      modelName: 'Colaborador',
      hooks: {
        afterUpdate: async (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
      defaultScope: {
        include: ['cargo']
      }
    }
  }
}

module.exports = { Colaborador, TABLA_COLABORADOR, colaboradorSchema }
