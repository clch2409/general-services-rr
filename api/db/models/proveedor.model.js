const { Model, DataTypes, Sequelize } = require('sequelize');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

const TABLA_PROVEEDOR = 'proveedores';

const proveedorSchema = {
  id: {
    field: 'id_proveedor',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNUll: true,
    type: DataTypes.STRING,
  },
  telefono: {
    allowNull: false,
    type: DataTypes.CHAR(9),
  },
  fechaContrato: {
    field: 'aforo_maximo',
    allowNull: false,
    type: DataTypes.SMALLINT,
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    field: 'updated_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  status: {
    allowNUll: false,
    type: DataTypes.STRING,
    defaultValue: ACTIVO.name,
    validate: {
      isIn: [[ACTIVO.name, INACTIVO.name]]
    }
  }
}

class Local extends Model{

  static associate(models){
    this.hasMany(models.Insumo, {
      as: 'insumos',
      through: models.InsumoLocal,
      foreignKey: 'idLocal',
      otherKey: 'idInsumo',
    });
    this.hasMany(models.Dia, {
      as: 'precios',
      through: 'localDia',
      foreignKey: 'idLocal',
      otherKey: 'idDia'
    })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_LOCAL,
      modelName: 'Local',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        },
      }
    }
  }
}

module.exports = { Local, TABLA_LOCAL, localSchema }
