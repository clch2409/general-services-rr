
class Status{

  static ACTIVO = new Status('activo');
  static INACTIVO = new Status('inactivo');

  constructor(statusName){
    this.name = statusName;
  }

}

module.exports = Status;
