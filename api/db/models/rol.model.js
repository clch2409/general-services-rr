const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_ROL = 'roles';

const rolSchema = {
  id: {
    field: 'id_rol',
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
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}

class Rol extends Model{

  static associate(models){
    this.hasMany(models.Usuario, {
      as: 'usuarios',
      foreignKey: 'rolId'
    })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_ROL,
      modelName: 'Rol',
    }
  }
}

module.exports = { Rol, TABLA_ROL, rolSchema }
