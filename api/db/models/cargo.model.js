const { Model, DataTypes, Sequelize } = require('sequelize');

const TABLA_CARGO = 'cargos';

const cargoSchema = {
  id: {
    field: 'id_cargo',
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
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}

class Cargo extends Model{

  static associate(models){
    this.hasMany(models.Colaborador, {
      as: 'colaboradores',
      foreignKey: 'cargoId'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_CARGO,
      modelName: 'Cargo',
      hooks: {
        beforeUpdate: (instance) => {
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      },
      // defaultScope: {
      //   include: ['colaboradores']
      // }
    }
  }
}

module.exports = { Cargo, TABLA_CARGO, cargoSchema}
