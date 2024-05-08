const { Cliente, clienteSchema } = require('./cliente.model');
const { EncargadoSalon, encargadoSchema } = require('./encargadoSalon.model');
const { Rol, rolSchema } = require('./rol.model');
const { Usuario, usuarioSchema } = require('./usuario.model');
const { Dia, diaSchema } = require('./dia.model');
const { Insumo, insumoSchema } = require('./insumo.model');
const { InsumoLocal, insumoLocalSchema } = require('./insumoLocal.model');
const { Local, localSchema } = require('./local.model');
const { LocalDia, localDiaSchema } = require('./localDia.model');
const { Proveedor, proveedorSchema } = require('./proveedor.model');
// const { ProveedorInsumo, proveedorInsumoSchema } = require('./proveedorInsumo.model');


function setupModels(sequelize){
  Rol.init(rolSchema, Rol.config(sequelize));
  Usuario.init(usuarioSchema, Usuario.config(sequelize));
  Cliente.init(clienteSchema, Cliente.config(sequelize));
  EncargadoSalon.init(encargadoSchema, EncargadoSalon.config(sequelize));
  Dia.init(diaSchema, Dia.config(sequelize));
  Insumo.init(insumoSchema, Insumo.config(sequelize));
  InsumoLocal.init(insumoLocalSchema, InsumoLocal.config(sequelize));
  Local.init(localSchema, Local.config(sequelize));
  LocalDia.init(localDiaSchema, LocalDia.config(sequelize));
  Proveedor.init(proveedorSchema, Proveedor.config(sequelize));
  // ProveedorInsumo.init(proveedorInsumoSchema, ProveedorInsumo.config(sequelize));

  Rol.associate(sequelize.models);
  Usuario.associate(sequelize.models);
  Cliente.associate(sequelize.models);
  EncargadoSalon.associate(sequelize.models);
  Local.associate(sequelize.models);
  Proveedor.associate(sequelize.models);
}

module.exports = setupModels
