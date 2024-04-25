const { models } = require('../libs/sequelize');

class RolService{

  async findAll(){
    return await models.Rol.findAll({
      include: 'usuarios'
    })
  }

}

module.exports = new RolService()
