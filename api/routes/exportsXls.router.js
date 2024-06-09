const { Router } = require('express');
const excelExport = require('../libs/exceljs');
const modelNames = require('./../utils/enums/modelNames.enum');
const { validateRolesJwt } = require('./../middlewares/auth.handler');

const exportExcelRouter = Router();

exportExcelRouter.get('/clientes/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportClients();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.CLIENTE.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/colaboradores/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportColaboradores();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.COLABORADOR.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/encargados/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportEncargado();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.ENCARGADO_SALON.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/insumos/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportInsumos();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.INSUMO.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/locales/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportLocal();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.LOCAL.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/proveedores/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportProveedor();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.PROVEEDOR.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/roles/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportRoles();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.ROL.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/servicios/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportServicios();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.SERVICIO.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/buffets/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportTiposBuffet();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.TIPO_BUFFET.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/tipos/evento/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportTiposEvento();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.TIPO_EVENTO.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/usuarios/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportUsuarios();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.USUARIO.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

exportExcelRouter.get('/cargos/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const workbook = await excelExport.exportCargos();

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=listado_${modelNames.CARGO.name}.xlsx`
      })

      return workbook.xlsx.write(res).then(() => res.status(200).end());
    }
    catch(e){
      next(e);
    }
  }
);

module.exports = { exportExcelRouter }
