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
const { Cargo, cargoSchema } = require('./cargo.model');
const { TipoEvento, tipoEventoSchema } = require('./tipoEvento.model');
const { Servicio, servicioSchema} = require('./servicio.model');
const { Colaborador, colaboradorSchema } = require('./colaborador.model');
const { Evento, eventoSchema} = require('./evento.model');
const { ColaboradorEvento, colaboradorEventoSchema} = require('./colaboradorEvento.model');
const { ServicioEvento, servicioEventoSchema } = require('./servicioEvento.model');
const { TipoBuffet, tipoBuffetSchema } = require('./tipoBuffet.model');


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
  Cargo.init(cargoSchema, Cargo.config(sequelize));
  TipoEvento.init(tipoEventoSchema, TipoEvento.config(sequelize));
  Servicio.init(servicioSchema, Servicio.config(sequelize));
  Colaborador.init(colaboradorSchema, Colaborador.config(sequelize));
  Evento.init(eventoSchema, Evento.config(sequelize));
  ColaboradorEvento.init(colaboradorEventoSchema, ColaboradorEvento.config(sequelize));
  ServicioEvento.init(servicioEventoSchema, ServicioEvento.config(sequelize));
  TipoBuffet.init(tipoBuffetSchema, TipoBuffet.config(sequelize));

  Rol.associate(sequelize.models);
  Usuario.associate(sequelize.models);
  Cliente.associate(sequelize.models);
  EncargadoSalon.associate(sequelize.models);
  Local.associate(sequelize.models);
  Insumo.associate(sequelize.models);
  Proveedor.associate(sequelize.models);
  Cargo.associate(sequelize.models);
  TipoEvento.associate(sequelize.models);
  Colaborador.associate(sequelize.models);
  Evento.associate(sequelize.models);
  TipoBuffet.associate(sequelize.models);
}

module.exports = setupModels
