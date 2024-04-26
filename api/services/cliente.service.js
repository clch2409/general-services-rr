const { models } = require('../libs/sequelize');

class clienteService{

  async findAll(){
    return await models.Cliente.findAll({
      include: ['usuario']
    });
  }

  async createCliente(body){
    const newCliente = await models.Cliente.create(body);

    return newCliente;
  }

}
