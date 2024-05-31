const { Model, DataTypes, Sequelize } = require('sequelize');
const { TABLA_COLABORADOR } = require('./colaborador.model');
const { TABLA_EVENTO } = require('./evento.model');
// const { TERMINADO, ASIGNADO } = require('./../../utils/enums/statusColaboradorEvento.enum');

const TABLA_COLABORADOR_EVENTO = 'colaborador_evento';

const colaboradorEventoSchema = {
  id: {
    field: 'id_colaborador_evento',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  colaboradorId: {
    field: 'id_colaborador',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_COLABORADOR,
      key: 'id_colaborador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  eventoId: {
    field: 'id_evento',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TABLA_EVENTO,
      key: 'id_evento'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
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
  // status: {
  //   allowNUll: false,
  //   type: DataTypes.STRING,
  //   defaultValue: ASIGNADO.name,
  //   validate: {
  //     isIn: [[ASIGNADO.name, TERMINADO.name]]
  //   }
  // }
}

class ColaboradorEvento extends Model{

  static associate(models){
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TABLA_COLABORADOR_EVENTO,
      modelName: 'ColaboradorEvento',
      hooks:{
        beforeUpdate: (instance) =>{
          instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
        }
      }
    }
  }
}

module.exports = { ColaboradorEvento, TABLA_COLABORADOR_EVENTO, colaboradorEventoSchema}
