const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_USUARIO } = require('./usuario.model');

const TABLA_CLIENTE = 'clientes';

const clienteSchema = {
  id: {
    field: 'id_cliente',
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
    type: DataTypes.CHAR(8),
  },
  direccion: {
    allowNull: false,
    type: DataTypes.STRING,
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

class Cliente extends Model{

  static associate(models){
    this.belongsTo(models.Usuario, { as: 'usuario' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_CLIENTE,
      modelName: 'Cliente',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
      defaultScope: {
        include: ['usuario']
      },
    }
  }
}

module.exports = { Cliente, TABLA_CLIENTE, clienteSchema }
