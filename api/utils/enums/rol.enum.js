class Rol{

  static CLIENTE = new Rol('cliente');
  static ENCARGADO = new Rol('encargado');
  static ADMIN = new Rol('admin');

  constructor(nombreRol){
    this.name = nombreRol;
  }

  toString(){
    return `Su rol es: ${this.name}`;
  }

}

module.exports = Rol;
