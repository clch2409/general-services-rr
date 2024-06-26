const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');
const { ACTIVO } = require('../utils/enums/status.enum');

class ClienteService{

  //El "include" permite obtener los datos del cliente con el usuario
  async findAll(){
    return await models.Cliente.findAll({
      // include: ['usuario']
    });
  }

  async findAllFormated(){
    const clientesFormated = []

    const clientes = await this.findAll();

    clientes.forEach(cliente => {
      clientesFormated.push(
        [
          cliente.nombres,
          cliente.apPaterno,
          cliente.apMaterno,
          cliente.dni,
          cliente.telefono,
          cliente.direccion,
          cliente.usuario.email
        ]
      );
    });

    return clientesFormated;
  }

  async findAllActivos(){
    return await models.Cliente.findAll({
      where: {
        '$usuario.status$': ACTIVO.name
      }
    })
  }

  //Permite crear el cliente con el usuario en el mismo cuerpo de la solicitud
  async createCliente(body){
    const clienteFound = await this.checkClienteExistenceByDni(body.dni);

    if (clienteFound){
      throw boom.notAcceptable('El dni ingresado ya se encuentra registrado');
    }

    const newCliente = await models.Cliente.create(body, {
      include: ['usuario']
    });

    delete newCliente.usuario.dataValues.contrasena

    return newCliente;
  }

  async findClienteById(clienteId){
    const foundCliente = await models.Cliente.findByPk(clienteId, {
      // include: ['usuario']
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
      // include: ['usuario']
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
      // include: ['usuario']
    });

    if (!foundCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    return foundCliente;
  }

  async updateCliente(clienteId, changes){
    const foundCliente = await models.Cliente.findByPk(clienteId);

    if(!foundCliente){
      throw boom.notFound('El cliente buscado, no existe');
    }

    const updatedCliente = await foundCliente.update(changes);

    return updatedCliente;
  }

  // async deleteCliente(clienteId){

  // }

  async checkClienteExistenceByDni(clienteDni){
    return await models.Cliente.findOne({
      where: {
        dni: clienteDni
      }
    })
  }

}

module.exports = new ClienteService();
