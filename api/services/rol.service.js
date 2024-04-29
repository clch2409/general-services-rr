const { models } = require('../libs/sequelize');

class RolService{

  async findAll(){
    return await models.Rol.findAll({
      include: 'usuarios'
    })
  }

  async createRol(body){
    return await models.Rol.create(body);
  }

  async updateRol(rolId, body){
    const updatedRol = await models.Rol.update(body, {
      where: {
        id: rolId
      }
    })

    return updatedRol;
  }

}

module.exports = new RolService()
