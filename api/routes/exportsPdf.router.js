const { Router } = require('express');
const pdfExports = require('../libs/pdfkitTable');
const modelNames = require('./../utils/enums/modelNames.enum');
const { validateRolesJwt } = require('./../middlewares/auth.handler');

const exportPdfRouter = Router();

exportPdfRouter.get('/clientes/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.CLIENTE.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.CLIENTE.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/colaboradores/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.COLABORADOR.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.COLABORADOR.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/encargados/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.ENCARGADO_SALON.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.ENCARGADO_SALON.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/insumos/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.INSUMO.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.INSUMO.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/locales/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.LOCAL.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.LOCAL.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/proveedores/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.PROVEEDOR.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.PROVEEDOR.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/roles/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.ROL.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.ROL.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/servicios/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.SERVICIO.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.SERVICIO.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/buffets/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.TIPO_BUFFET.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.TIPO_BUFFET.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/tipos/evento/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.TIPO_EVENTO.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.TIPO_EVENTO.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/usuarios/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.USUARIO.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.USUARIO.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

exportPdfRouter.get('/cargos/:token',
  async (req, res, next) => {
    try{
      const { token } = req.params;

      validateRolesJwt(token);

      const stream = res.writeHead(200,{
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=listado_${modelNames.CARGO.name}.pdf`
      })

      pdfExports.createPdfAndExport(
        (data) => stream.write(data),
        () => stream.end(),
        modelNames.CARGO.name
      );
    }
    catch(e){
      next(e);
    }
  }
);

module.exports = { exportPdfRouter }
