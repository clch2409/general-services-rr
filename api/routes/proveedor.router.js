const { Router } = require('express');

const proveedorRouter = Router();

const proveedorService = require('./../services/proveedor.service');
const validatorHandler = require('./../middlewares/validator.handler');

const { createProveedorSchema, getProveedorByIdSchema, udpateProveedorSchema, addInsumoToProveedorSchema } = require('./../schema/proveedor.schema');
const { authenticationByJwt } = require('./../utils/auth/functions/passport.auth');
const { validateRoles } = require('./../middlewares/auth.handler');
const { ADMIN, ENCARGADO } = require('./../utils/enums/rol.enum');

proveedorRouter.get('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  findAll
);

proveedorRouter.post('',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(createProveedorSchema, 'body'),
  createProveedor
);

proveedorRouter.get('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getProveedorByIdSchema, 'params'),
  findProveedorById
);

proveedorRouter.patch('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getProveedorByIdSchema, 'params'),
  validatorHandler(udpateProveedorSchema, 'body'),
  updatedProveedor
);

proveedorRouter.delete('/:id',
  authenticationByJwt(),
  validateRoles(ADMIN.name, ENCARGADO.name),
  validatorHandler(getProveedorByIdSchema, 'params'),
  deleteProveedor
);

// proveedorRouter.post('/add/insumo',
//   authenticationByJwt(),
//   validateRoles(ADMIN.name, ENCARGADO.name),
//   validatorHandler(addInsumoToProveedorSchema, 'body'),
//   addInsumoToProveedor
// );


async function findAll (req, res, next) {
  try{
    const proveedores = await proveedorService.findAll();

    res.status(200).json(proveedores);
  }
  catch(e){
    next(e);
  }
}

async function createProveedor(req, res, next) {
  try{
    const { body } = req;
    const proveedorCreated = await proveedorService.createProveedor(body);

    res.status(201).json(proveedorCreated);
  }
  catch(e){
    next(e);
  }
}

async function findProveedorById(req, res, next) {
  try{

    const { id } = req.params
    const foundProveedor = await proveedorService.findProveedorById(id);

    res.status(200).json({
      proveedor: foundProveedor,
      fechaContrato: foundProveedor.fechaContrato.toDateString()
    });

  }
  catch(e){
    next(e)
  }
}

async function updatedProveedor (req, res, next) {
  try{
    const { body, params } = req;
    const updatedProveedor = await proveedorService.updateProveedor(params.id, body);

    res.status(200).json(updatedProveedor);
  }
  catch(e){
    next(e)
  }
}

async function deleteProveedor(req, res, next){
  try{
    const { id } = req.params;
    const deletedProveedor = await proveedorService.deleteProveedor(id);

    res.status(200).json(deletedProveedor);
  }
  catch(e){
    next(e);
  }
}

// async function addInsumoToProveedor(req, res, next) {
//   try{
//     const { body } = req;
//     const addedInsumo = proveedorService.addInsumoToProvedor(body);

//     res.status(201).json({
//       addedInsumo
//     });
//   }
//   catch(e){
//     next(e);
//   }
// }

module.exports = { proveedorRouter }
