const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { TABLA_ROL } = require('./rol.model');

const TABLA_USUARIO = 'usuarios';

const usuarioSchema = {
  idUsuario: {
    field: 'id_usuario',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  contrasena: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  idRol: {
    field: 'id_rol',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_ROL,
      key: 'idRol'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
    defaultValue: 1,
  },
  status: {
    allowNUll: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [['activo', 'inactivo']]
    }
  }
}

class Usuario extends Model{

  static associate(models){
    this.hasOne(models.Cliente, {as: 'cliente', foreignKey: 'idUsuario'});
    this.hasOne(models.EncargadoSalon, { as: 'jefaSalon', foreignKey: 'idUsuario' });
    this.belongsTo(models.Rol, { as: 'rol' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_USUARIO,
      modelName: 'Usuario',
      timestamps: false,
      hooks: {
        beforeCreate: async(instance) => {
          const hash = bcrypt.hash(instance.password, 10);
          instance.password = hash;
        }
      },
      defaultScope: {
        attributes: {
          exclude: ['password', 'recoveryToken']
        }
      },
      scopes: {
        withPassword: {
          attributes: ['idUsuario', 'email', 'contrasena'],
        },
        withRecoveryToken: {
          attributes: ['idUsuario', 'email', 'recoveryToken'],
        },
      },
    }
  }
}

module.exports = { Usuario, TABLA_USUARIO, usuarioSchema }
