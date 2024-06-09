const { Workbook } = require('exceljs');
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

class ExportsExcel{

  async exportClients(){
    const clientes = await clienteService.findAll();
    const data = [];
    clientes.forEach(cliente => {
      cliente.dataValues.email = cliente.usuario.email;
      data.push(cliente.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Clientes');
    let columns = [
      { header: 'Nombres', key: 'nombres', width: 20 },
      { header: 'Apellido Paterno', key: 'apPaterno', width: 20 },
      { header: 'Apellido Materno', key: 'apMaterno', width: 20 },
      { header: 'DNI', key: 'dni', width: 20 },
      { header: 'Teléfono', key: 'telefono', width: 20 },
      { header: 'Dirección', key: 'direccion', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportColaboradores(){
    const colaboradores = await colaboradorService.findAll();
    const data = [];
    colaboradores.forEach(colaborador => {
      colaborador.dataValues.cargo = colaborador.cargo.nombre
      data.push(colaborador.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Colaboradores');
    let columns = [
      { header: 'Nombres', key: 'nombres', width: 20 },
      { header: 'Apellido Paterno', key: 'apPaterno', width: 20 },
      { header: 'Apellido Materno', key: 'apMaterno', width: 20 },
      { header: 'DNI', key: 'dni', width: 20 },
      { header: 'Telefono', key: 'telefono', width: 20 },
      { header: 'F. Contrato', key: 'fechaContratacion', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Cargo', key: 'cargo', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportEncargado(){
    const encargados = await encargadoSalonService.findAll();
    const data = [];
    encargados.forEach(encargado => {
      encargado.dataValues.email = encargado.usuario.email
      data.push(encargado.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Encargados');
    let columns = [
      { header: 'Nombres', key: 'nombres', width: 20 },
      { header: 'Apellido Paterno', key: 'apPaterno', width: 20 },
      { header: 'Apellido Materno', key: 'apMaterno', width: 20 },
      { header: 'DNI', key: 'dni', width: 20 },
      { header: 'Telefono', key: 'telefono', width: 20 },
      { header: 'F. Contrato', key: 'fechaContratacion', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportInsumos(){
    const insumos = await insumoService.findAll();
    const data = [];
    insumos.forEach(insumo => {
      insumo.dataValues.proveedor = insumo.proveedor.nombre
      data.push(insumo.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Insumos');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Proveedor', key: 'proveedor', width: 20 },
      { header: 'Precio', key: 'precio', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportLocal(){
    const locales = await localService.findAll();
    const data = [];
    locales.forEach(local => {
      local.dataValues.fechaInactivacion
      data.push(local.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Locales');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Aforo Minimo', key: 'aforoMinimo', width: 20 },
      { header: 'Aforo Maximo', key: 'aforoMaximo', width: 20 },
      { header: 'Dirección', key: 'direccion', width: 20 },
      { header: 'Fecha Inactivacion', key: 'fechaInactivacion', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportLocal(){
    const locales = await localService.findAll();
    const data = [];
    locales.forEach(local => {
      local.dataValues.fechaInactivacion
      data.push(local.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Locales');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Aforo Minimo', key: 'aforoMinimo', width: 20 },
      { header: 'Aforo Maximo', key: 'aforoMaximo', width: 20 },
      { header: 'Dirección', key: 'direccion', width: 20 },
      { header: 'Fecha Inactivacion', key: 'fechaInactivacion', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportProveedor(){
    const proveedores = await proveedorService.findAll();
    const data = [];
    proveedores.forEach(proveedor => {
      data.push(proveedor.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Proveedores');
    let columns = [
      { header: 'Nombres', key: 'nombre', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Telefono', key: 'telefono', width: 20 },
      { header: 'Direccion', key: 'direccion', width: 20 },
      { header: 'Fecha Contrato', key: 'fechaContrato', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportRoles(){
    const roles = await rolService.findAll();
    const data = [];
    roles.forEach(rol => {
      data.push(rol.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Roles');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportServicios(){
    const servicios = await servicioService.findAll();
    const data = [];
    servicios.forEach(servicio => {
      servicio.dataValues.proveedor = servicio.proveedor.nombre
      data.push(servicio.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Servicios');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Proveedor', key: 'proveedor', width: 20 },
      { header: 'Precio', key: 'precio', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportTiposBuffet(){
    const tiposBuffet = await tipoBuffetService.findAll();
    const data = [];
    tiposBuffet.forEach(buffet => {
      data.push(buffet.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Tipos Buffet');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Precio por Plato', key: 'precioPorPlato', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportTiposEvento(){
    const tiposEvento = await tipoEventoService.findAll();
    const data = [];
    tiposEvento.forEach(tipoEvento => {
      data.push(tipoEvento.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Tipos de Eventos');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportUsuarios(){
    const usuarios = await usuarioService.findAll();
    const data = [];
    usuarios.forEach(usuario => {
      usuario.dataValues.rol = usuario.rol.nombre
      data.push(usuario.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Usuarios');
    let columns = [
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Rol', key: 'rol', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }

  async exportCargos(){
    const cargos = await cargoService.findAll();
    const data = [];
    cargos.forEach(cargo => {
      data.push(cargo.dataValues);
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Listado de Cargos');
    let columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
    ];

    worksheet.columns = columns;
    worksheet.addRows(data);
    return workbook;
  }
}

module.exports = new ExportsExcel()
