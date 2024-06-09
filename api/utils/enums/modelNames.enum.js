class ModelNames{

  static CARGO = new ModelNames('Cargos');
  static CLIENTE = new ModelNames('Clientes');
  static PROVEEDOR = new ModelNames('Proveedores');
  static SERVICIO = new ModelNames('Servicios');
  static COLABORADOR = new ModelNames('Colaboradores');
  static ENCARGADO_SALON = new ModelNames('Encargados');
  static DIA = new ModelNames('Dias');
  static EVENTO = new ModelNames('Eventos');
  static INSUMO = new ModelNames('Insumos');
  static LOCAL = new ModelNames('Locales');
  static ROL = new ModelNames('Roles');
  static TIPO_BUFFET = new ModelNames('Tipos_Buffet');
  static TIPO_EVENTO = new ModelNames('Tipos:Evento');
  static USUARIO = new ModelNames('Usuarios');

  constructor(name){
    this.name = name;
  }

}

module.exports = ModelNames;
