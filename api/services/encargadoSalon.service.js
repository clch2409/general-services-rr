const boom = require('@hapi/boom');

const usuarioService = require('./../services/usuario.service');

const { models } = require('../libs/sequelize');
const { INACTIVO, ACTIVO } = require('../utils/enums/status.enum');

class EncargadoService{

  async findAll(){
    return await models.EncargadoSalon.findAll();
  }

  async findAllFormated(){
    const encargadoSalonFormated = []

    const encargadosSalon = await this.findAll();

    encargadosSalon.forEach(colaborador => {
      encargadoSalonFormated.push(
        [
          colaborador.nombres,
          colaborador.apPaterno,
          colaborador.apMaterno,
          colaborador.dni,
          colaborador.telefono,
          new Date(colaborador.fechaContratacion).toLocaleDateString('es-ES'),
          colaborador.usuario.email,
          colaborador.status
        ]
      );
    });

    return encargadoSalonFormated;
  }

  async findAllActiveEncargados(){
    return await models.EncargadoSalon.findAll({
      where: {
        status: ACTIVO.name,
        '$usuario.status$': ACTIVO.name
      }
    })
  }

  async createEncargado(body){
    await this.checkDniAndHiringDate(body);

    const newEncargado = await models.EncargadoSalon.create(body, {
      include: ['usuario']
    });

    delete newEncargado.usuario.dataValues.contrasena

    return newEncargado;
  }

  async findEncargadoById(encargadoId){
    const foundEncargado = await models.EncargadoSalon.findByPk(encargadoId, {
      include: ['eventos']
    });

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async findEncargadoByDni(dni){
    const foundEncargado = await models.EncargadoSalon.findOne({
      where: {
        dni: dni
      },
    });

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async findEncargadoByEmail(email){
    const foundEncargado = await models.EncargadoSalon.findOne({
      where: {
        '$usuario.email$': email
      },
      // include: ['usuario']
    });

    if (!foundEncargado){
      throw boom.notFound('El encargado buscado no existe');
    }

    return foundEncargado;
  }

  async updateEncargado(encargadoId, changes){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    const updatedEncargado = await foundEncargado.update(changes);

    return updatedEncargado;
  }

  async deleteEncargado(encargadoId){
    const foundEncargado = await this.findEncargadoById(encargadoId);

    if (foundEncargado.status === INACTIVO.name){
      throw boom.notAcceptable('El encargado ya se encuentra inactivo')
    }

    const deletedUsuario = await usuarioService.deleteUser(foundEncargado.usuario.id);

    const deletedEncargado = await foundEncargado.update({
      status: INACTIVO.name
    });


    return deletedEncargado;
  }

  async checkDniAndHiringDate(body){
    const encargadoFound = await this.checkExistenceByDni(body.dni);
    const checkFechaContrato = this.validateHiringDate(body.fechaContratacion);

    if (encargadoFound){
      throw boom.notAcceptable('El dni ya se encuentra registrado en el sistema');
    }
    else if (!checkFechaContrato){
      throw boom.notAcceptable('La fecha de contratación no puede ser después a la fecha de hoy');
    }
  }

  async checkExistenceByDni(encargadoDni){
    return await models.EncargadoSalon.findOne({
      where: {
        dni: encargadoDni,
      }
    });
  }

  async validateHiringDate(fechaContrato){
    const fechaHoy = new Date();
    const fechaContratacionColaborador = new Date(fechaContrato)

    return fechaHoy > fechaContratacionColaborador;
  }

  async checkEncargadoAvalible (fechaEvento, encargadoId){
    const foundEvento = await models.Evento.findOne({
      where: {
        encargadoId,
        fechaEvento
      }
    });

    if (foundEvento){
      throw boom.notAcceptable('El encargado ya se encuentra en un evento!');
    }

    return foundEvento;
  }

}

module.exports = new EncargadoService();
