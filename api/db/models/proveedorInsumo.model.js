// const { Model, DataTypes, Sequelize } = require('sequelize');
// const { TABLA_INSUMO } = require('./insumo.model');
// const { TABLA_PROVEEDOR } = require('./proveedor.model');
// const { ACTIVO, INACTIVO } = require('../../utils/enums/status.enum');

// const TABLA_PROVEEDOR_INSUMO = 'proveedor_insumo';

// const proveedorInsumoSchema = {
//   id: {
//     field: 'id_proveedor_insumo',
//     allowNull: false,
//     primaryKey: true,
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//   },
//   idProveedor: {
//     field: 'id_proveedor',
//     allowNull: false,
//     type: DataTypes.INTEGER,
//     references: {
//       model: TABLA_PROVEEDOR,
//       key: 'id_proveedor'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'RESTRICT',
//   },
//   idInsumo: {
//     field: 'id_insumo',
//     allowNull: false,
//     type: DataTypes.INTEGER,
//     references: {
//       model: TABLA_INSUMO,
//       key: 'id_insumo'
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'RESTRICT',
//   },
//   precio: {
//     allowNull: false,
//     type: DataTypes.FLOAT(6,2).UNSIGNED,
//   },
//   createdAt: {
//     field: 'created_at',
//     allowNull: false,
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//   },
//   updatedAt: {
//     field: 'updated_at',
//     allowNull: false,
//     type: DataTypes.DATE,
//     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//   },
//   status: {
//     allowNUll: false,
//     type: DataTypes.STRING,
//     defualtValue: ACTIVO.name,
//     validate: {
//       isIn: [[ACTIVO.name, INACTIVO.name]]
//     }
//   }
// }

// class ProveedorInsumo extends Model{

//   static associate(models){
//   }

//   static config(sequelize){
//     return {
//       sequelize,
//       tableName: TABLA_PROVEEDOR_INSUMO,
//       modelName: 'ProveedorInsumo',
//       hooks:{
//         beforeUpdate: (instance) =>{
//           instance.updatedAt = Sequelize.literal('CURRENT_TIMESTAMP');
//         }
//       }
//     }
//   }
// }

// module.exports = { ProveedorInsumo, TABLA_PROVEEDOR_INSUMO, proveedorInsumoSchema}
