const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { TABLA_ROL } = require('./rol.model');

const TABLA_USUARIO = 'usuarios';

const usuarioSchema = {
  id: {
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
  //El nombre del campo en el schema debe ser igual que el foreingkey del hasMany
  rolId: {
    field: 'id_rol',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_ROL,
      key: 'id_rol'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
    defaultValue: 1,
  },
  status: {
    allowNUll: false,
    type: DataTypes.STRING,
    defualtValue: 'activo',
    validate: {
      isIn: ['activo', 'inactivo']
    }
  }
}

class Usuario extends Model{

  static associate(models){
    this.hasOne(models.Cliente, {as: 'cliente', foreignKey: 'usuarioId'});
    this.hasOne(models.EncargadoSalon, { as: 'jefaSalon', foreignKey: 'usuarioId' });
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
          const hash = await bcrypt.hash(instance.contrasena, 10);
          instance.contrasena = hash;
        }
      },
      defaultScope: {
        attributes: {
          exclude: ['contrasena', 'recoveryToken']
        }
      },
      scopes: {
        withPassword: {
          attributes: ['id', 'email', 'contrasena'],
          include: ['rol']
        },
        withRecoveryToken: {
          attributes: ['id', 'email', 'recoveryToken'],
        },
      },
    }
  }
}

module.exports = { Usuario, TABLA_USUARIO, usuarioSchema }
