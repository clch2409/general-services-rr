const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class RolService{

  async findAll(){
    return await models.Rol.findAll()
  }

  async findAllFormated(){
    const rolFormatted = []

    const roles = await this.findAll();

    roles.forEach(rol => {
      rolFormatted.push(
        [
          rol.nombre,
          new Date(rol.createdAt).toLocaleDateString('es-ES'),
        ]
      );
    });

    return rolFormatted;
  }

  async createRol(body){
    return await models.Rol.create(body);
  }

  async findRoleById(rolId){
    const foundRol = await models.Rol.findByPk(rolId);

    if (!foundRol){
      throw boom.notFound('El rol no existe');
    }

    return foundRol;
  }

  async updateRol(rolId, changes){
    const foundRol = await this.findRoleById(rolId)

    const updatedRol = foundRol.update(changes)

    return updatedRol;
  }

}

module.exports = new RolService()
