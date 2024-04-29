const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ClienteService{

  //El "include" permite obtener los datos del cliente con el usuario
  async findAll(){
    return await models.Cliente.findAll({
      include: ['usuario']
    });
  }

  //Permite crear el cliente con el usuario en el mismo cuerpo de la solicitud
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

    if (!foundCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    return foundCliente;
  }

  async findClienteByDni(dni){
    const foundCliente = await models.Cliente.findOne({
      where: {
        dni: dni
      },
      include: ['usuario']
    });

    if (!foundCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    return foundCliente;
  }

  async findClienteByEmail(email){
    const foundCliente = await models.Cliente.findOne({
      where: {
        '$usuario.email$': email
      },
      include: ['usuario']
    });

    if (!foundCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    return foundCliente;
  }

  async updateCliente(clienteId, changes){
    const updatedCliente = await models.Cliente.update(clienteId, changes);

    if(!updatedCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    return updatedCliente;
  }

  // async deleteCliente(clienteId){

  // }

}

module.exports = new ClienteService();
