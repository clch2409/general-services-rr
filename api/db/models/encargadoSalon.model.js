const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_USUARIO } = require('./usuario.model');

const TABLA_ENCARGADO = 'encargado_salon';

const encargadoSchema = {
  id: {
    field: 'id_encargado',
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
    type: DataTypes.STRING,
  },
  dni: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fechaContratacion: {
    field: 'fecha_contratacion',
    allowNull: false,
    type: DataTypes.DATE,
  },
  usuarioId: {
    field: 'id_usuario',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: TABLA_USUARIO,
      key: 'id_usuario'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: ['activo', 'inactivo']
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

class EncargadoSalon extends Model{

  static associate(models){
    this.belongsTo(models.Usuario, { as: 'usuario' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_ENCARGADO,
      modelName: 'EncargadoSalon',
      hooks: {
        afterUpdate: async (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
      defaultScope: {
        include:['usuario']
      }
    }
  }
}

module.exports = { EncargadoSalon, TABLA_ENCARGADO, encargadoSchema }
