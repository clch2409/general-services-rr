const { models } = require('../libs/sequelize');

class ClienteService{

  async findAll(){
    return await models.Cliente.findAll({
      include: ['usuario']
    });
  }

  async createCliente(body){
    const newCliente = await models.Cliente.create(body, {
      include: ['usuario']
    });

    delete newCliente.usuario.dataValues.contrasena

    return newCliente;
  }

  async findClienteById(clienteId){
    const foundCliente = await models.Cliente.findOne({
      where: {
        id: clienteId
      },
      include: ['usuario']
    });

    return foundCliente;
  }

}

module.exports = new ClienteService();
