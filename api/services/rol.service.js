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

}

module.exports = new RolService()
