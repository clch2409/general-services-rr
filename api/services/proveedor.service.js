const { INACTIVO } = require('../utils/enums/status.enum');
const { models } = require('./../libs/sequelize');

const boom = require('@hapi/boom');

const insumoService = require('./insumo.service');

class ProveedorService{

  async findAll(){
    return await models.Proveedor.findAll();
  }

  async createProveedor(body){
    return await models.Proveedor.create(body);
  }

  async findProveedorById(proveedorId){
    const foundProveedor = await models.Proveedor.findByPk(proveedorId);

    if (!foundProveedor){
      throw boom.notFound('El proveedor buscado no existe');
    }

    return foundProveedor;
  }

  async updateProveedor(proveedorId, changes){
    const foundProveedor = await this.findProveedorById(proveedorId);

    const updatedProveedor = foundProveedor.update(changes);

    return updatedProveedor;
  }

  async deleteProveedor(proveedorId){
    const foundProveedor = await this.findProveedorById(proveedorId);

    const deletedProveedor = await foundProveedor.update({
      status: INACTIVO.name
    });

    deletedProveedor.insumos.forEach(insumo => {
      insumo.update({
        status: INACTIVO.name
      });
    });

    return deletedProveedor;
  }

  async addInsumoToProvedor(body){
    return await models.ProveedorInsumo.create(body);
  }
}

module.exports = new ProveedorService();
