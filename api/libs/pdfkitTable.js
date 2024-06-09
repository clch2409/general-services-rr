const PDFDocument = require('pdfkit-table');
const modelNames = require('./../utils/enums/modelNames.enum');
const clienteService = require('../services/cliente.service');
const colaboradorService = require('../services/colaborador.service');
const encargadoSalonService = require('../services/encargadoSalon.service');
const insumoService = require('../services/insumo.service');
const localService = require('../services/local.service');
const proveedorService = require('../services/proveedor.service');
const rolService = require('../services/rol.service');
const servicioService = require('../services/servicio.service');
const tipoBuffetService = require('../services/tipoBuffet.service');
const tipoEventoService = require('../services/tipoEvento.service');
const usuarioService = require('../services/usuario.service');
const cargoService = require('../services/cargo.service');

class PdfExports{
  table = {
    title: '',
    subtitle: '',
    divider: {
      header: { disabled: false, width: 2, opacity: 1 },
      horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
    },
    headers: [],
    rows: [],
  }

  async createPdfAndExport(dataCallback, endCallback, modelName){
    const doc = new PDFDocument.default({margin: 40, size: 'A4'});

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    await this.chooseModel(modelName, doc)


  }

  async chooseModel(modelName, doc){
    switch(modelName){
      case modelNames.CLIENTE.name:
        await this.formatClienteTable(doc);
        break;
      case modelNames.COLABORADOR.name:
        await this.formatColaboradorTable(doc);
        break;
      case modelNames.ENCARGADO_SALON.name:
        await this.formatEncargadoTable(doc);
        break;
      case modelNames.INSUMO.name:
        await this.formatInsumosTable(doc);
        break;
      case modelNames.LOCAL.name:
        await this.formatLocalTable(doc);
        break;
      case modelNames.PROVEEDOR.name:
        await this.formatProveedorTable(doc);
        break;
      case modelNames.ROL.name:
        await this.formatRolTable(doc);
        break;
      case modelNames.SERVICIO.name:
        await this.formatServicioTable(doc);
        break;
      case modelNames.TIPO_BUFFET.name:
        await this.formatTipoBuffetTable(doc);
        break;
      case modelNames.TIPO_EVENTO.name:
        await this.formatTipoEventoTable(doc);
        break;
      case modelNames.USUARIO.name:
        await this.formatUsuarioTable(doc);
        break;
      case modelNames.CARGO.name:
        await this.formatCargoTable(doc);
        break;
      default:
        this.table = clienteService.getFormatedTable();
        break;
    }
  }

  finishTable(table, doc){
    doc.table(table, {
      prepareHeader: () => {
        doc.font("Helvetica-Bold").fontSize(10);
      },
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(8);
      },
    });

    doc.end();
  }

  async formatClienteTable(doc){
    const formatedClientes = await clienteService.findAllFormated();

    this.table.title = 'Listado de Clientes';
    this.table.subtitle = 'Listado completo de clientes';
    this.table.headers = [
      'Nombres',
      'Ap. Paterno',
      'Ap. Materno',
      'DNI',
      'Telefono',
      'Direccion',
      'Email',
    ];
    this.table.rows = formatedClientes;

    doc.table(this.table, {
      columnsSize: [60, 70, 70, 50, 50, 100, 120],
      prepareHeader: () => {
        doc.font("Helvetica-Bold").fontSize(10);
      },
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(8);
      },
    });

    doc.end();
  }

  async formatColaboradorTable(doc){
    const formatedColaborador = await colaboradorService.findAllFormated();

    this.table.title = 'Listado de Colaboradores';
    this.table.subtitle = 'Listado completo de colaboradores';
    this.table.headers = [
      'Nombres',
      'Ap. Paterno',
      'Ap. Materno',
      'DNI',
      'Telefono',
      'F. Contrato',
      'Email',
      'Cargo',
      'Status',
    ];
    this.table.rows = formatedColaborador;

    doc.table(this.table, {
      columnsSize: [50, 60, 60, 50, 50, 50, 120, 50, 50],
      prepareHeader: () => {
        doc.font("Helvetica-Bold").fontSize(10);
      },
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(8);
      },
    });

    doc.end();
  }

  async formatEncargadoTable(doc){
    const formatedColaborador = await encargadoSalonService.findAllFormated();

    this.table.title = 'Listado de Encargados';
    this.table.subtitle = 'Listado completo de encargados';
    this.table.headers = [
      'Nombres',
      'Ap. Paterno',
      'Ap. Materno',
      'DNI',
      'Telefono',
      'F. Contrato',
      'Email',
      'Status',
    ];
    this.table.rows = formatedColaborador;

    doc.table(this.table, {
      columnsSize: [50, 60, 60, 50, 50, 50, 120, 50],
      prepareHeader: () => {
        doc.font("Helvetica-Bold").fontSize(10);
      },
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(8);
      },
    });

    doc.end();
  }

  async formatInsumosTable(doc){
    const formatedColaborador = await insumoService.findAllFormated();

    this.table.title = 'Listado de Insumos';
    this.table.subtitle = 'Listado completo de insumos';
    this.table.headers = [
      'Nombre',
      'Precio',
      'Proveedor',
      'Status',
    ];
    this.table.rows = formatedColaborador;

    this.finishTable(this.table, doc);
  }

  async formatLocalTable(doc){
    const formatedLocal = await localService.findAllFormated();

    this.table.title = 'Listado de Locales';
    this.table.subtitle = 'Listado completo de locales';
    this.table.headers = [
      'Nombre',
      'Direccion',
      'Aforo Minimo',
      'Aforo Maximo',
      'Fecha Inactivacion',
      'Status',
    ];
    this.table.rows = formatedLocal;

    this.finishTable(this.table, doc);
  }

  async formatProveedorTable(doc){
    const formatedProveedor = await proveedorService.findAllFormated();

    this.table.title = 'Listado de Proveedores';
    this.table.subtitle = 'Listado completo de proveedores';
    this.table.headers = [
      'Nombre',
      'Email',
      'Teléfono',
      'Direccion',
      'F. Contrato',
      'Status',
    ];
    this.table.rows = formatedProveedor;

    this.finishTable(this.table, doc);
  }

  async formatRolTable(doc){
    const formatedRol = await rolService.findAllFormated();

    this.table.title = 'Listado de Roles';
    this.table.subtitle = 'Listado completo de roles';
    this.table.headers = [
      'Nombre',
      'Creado En',
    ];
    this.table.rows = formatedRol;

    this.finishTable(this.table, doc);
  }

  async formatServicioTable(doc){
    const formatedServicios = await servicioService.findAllFormated();

    this.table.title = 'Listado de Servicios';
    this.table.subtitle = 'Listado completo de servicios';
    this.table.headers = [
      'Nombre',
      'Precio',
      'Proveedor',
    ];
    this.table.rows = formatedServicios;

    this.finishTable(this.table, doc);
  }

  async formatTipoBuffetTable(doc){
    const formatedTipoBuffet = await tipoBuffetService.findAllFormated();

    this.table.title = 'Listado de Tipos de Buffet';
    this.table.subtitle = 'Listado completo de Tipos de Buffet';
    this.table.headers = [
      'Nombre',
      'Precio por Plato',
    ];
    this.table.rows = formatedTipoBuffet;

    this.finishTable(this.table, doc);
  }

  async formatTipoEventoTable(doc){
    const formatedTipoEvento = await tipoEventoService.findAllFormated();

    this.table.title = 'Listado de Tipos de Evento';
    this.table.subtitle = 'Listado completo de Tipos de evento';
    this.table.headers = [
      'Nombre',
    ];
    this.table.rows = formatedTipoEvento;

    this.finishTable(this.table, doc);
  }

  async formatUsuarioTable(doc){
    const formatedUsuario = await usuarioService.findAllFormated();

    this.table.title = 'Listado de Usuarios';
    this.table.subtitle = 'Listado completo de usuarios';
    this.table.headers = [
      'Email',
      'Rol',
    ];
    this.table.rows = formatedUsuario;

    this.finishTable(this.table, doc);
  }

  async formatCargoTable(doc){
    const formatedUsuario = await cargoService.findAllFormated();

    this.table.title = 'Listado de Cargos';
    this.table.subtitle = 'Listado completo de cargos';
    this.table.headers = [
      'Nombre',
    ];
    this.table.rows = formatedUsuario;

    this.finishTable(this.table, doc);
  }

}

module.exports = new PdfExports()
