const { Cliente, clienteSchema } = require("./cliente.model");
const { EncargadoSalon, encargadoSchema } = require("./encargadoSalon.model");
const { Rol, rolSchema } = require("./rol.model");
const { Usuario, usuarioSchema } = require("./usuario.model");


function setupModels(sequelize){
  Rol.init(rolSchema, Rol.config(sequelize));
  Usuario.init(usuarioSchema, Usuario.config(sequelize));
  Cliente.init(clienteSchema, Cliente.config(sequelize));
  EncargadoSalon.init(encargadoSchema, EncargadoSalon.config(sequelize));

  Rol.associate(sequelize.models);
  Usuario.associate(sequelize.models);
  Cliente.associate(sequelize.models);
  EncargadoSalon.associate(sequelize.models);
}

module.exports = setupModels
