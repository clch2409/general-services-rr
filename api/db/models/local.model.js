const { Model, DataTypes, Sequelize } = require('sequelize');
const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

const TABLA_LOCAL = 'locales';

const localSchema = {
  id: {
    field: 'id_local',
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
  descripcion: {
    allowNUll: true,
    type: DataTypes.TEXT,
  },
  direccion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  aforoMaximo: {
    field: 'aforo_maximo',
    allowNull: false,
    type: DataTypes.SMALLINT,
  },
  fechaInactivacion: {
    field: 'fecha_inactivacion',
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: null
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
  },
  // insumosEnAlmacen: {
  //   type: DataTypes.VIRTUAL,
  //   get(){
  //     if (this.insumos.length){
  //       let CANTIDAD_INSUMOS_TOTALES = 0;
  //       this.insumos.forEach(insumo => CANTIDAD_INSUMOS_TOTALES += insumo.InsumoLocal.cantidad);
  //       return CANTIDAD_INSUMOS_TOTALES;
  //     }
  //     return 0;
  //   }
  // }
}

class Local extends Model{

  static associate(models){
    this.belongsToMany(models.Insumo, {
      as: 'insumos',
      through: models.InsumoLocal,
      foreignKey: 'idLocal',
      otherKey: 'idInsumo',
    });
    this.belongsToMany(models.Dia, {
      as: 'precios',
      through: models.LocalDia,
      foreignKey: 'idLocal',
      otherKey: 'idDia'
    });
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_LOCAL,
      modelName: 'Local',
      defaultScope: {
        include: ['insumos'],
      },
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        },
      }
    }
  }
}

module.exports = { Local, TABLA_LOCAL, localSchema }
