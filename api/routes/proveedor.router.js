const { Router } = require('express');

const proveedorRouter = Router();

const proveedorService = require('./../services/proveedor.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createProveedorSchema, getProveedorByIdSchema, udpateProveedorSchema, addInsumoToProveedorSchema } = require('./../schema/proveedor.schema');

proveedorRouter.get('',
  async (req, res, next) => {
    try{
      const proveedores = await proveedorService.findAll();

      res.status(200).json({
        proveedores
      });
    }
    catch(e){
      next(e);
    }
  }
);

proveedorRouter.post('',
  validatorHandler(createProveedorSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const proveedorCreated = await proveedorService.createProveedor(body);

      res.status(201).json({
        proveedorCreated
      });
    }
    catch(e){
      next(e);
    }
  }
);

proveedorRouter.get('/:id',
  validatorHandler(getProveedorByIdSchema, 'params'),
  async (req, res, next) => {
    try{

      const { id } = req.params
      const foundProveedor = await proveedorService.findProveedorById(id);

      res.status(302).json({
        foundProveedor
      })
    }
    catch(e){
      next(e)
    }
  }
);

proveedorRouter.patch('/:id',
  validatorHandler(getProveedorByIdSchema, 'params'),
  validatorHandler(udpateProveedorSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body, params } = req;
      const updatedProveedor = await proveedorService.updateProveedor(params.id, body);

      res.status(200).json({
        updatedProveedor
      });
    }
    catch(e){
      next(e)
    }
  }
);

proveedorRouter.delete('/:id',
  validatorHandler(getProveedorByIdSchema, 'params'),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const deletedProveedor = await proveedorService.deleteProveedor(id);

      res.status(200).json({
        deletedProveedor
      });
    }
    catch(e){
      next(e);
    }
  }
);

proveedorRouter.post('/add/insumo',
  validatorHandler(addInsumoToProveedorSchema, 'body'),
  async (req, res, next) => {
    try{
      const { body } = req;
      const addedInsumo = proveedorService.addInsumoToProvedor(body);

      res.status(201).json({
        addedInsumo
      });
    }
    catch(e){
      next(e);
    }
  }
);


module.exports = { proveedorRouter }
