
class StatusEvento{

  static RESERVADO = new StatusEvento('reservado');
  static REALIZADO = new StatusEvento('realizado');
  static EN_PROCESO = new StatusEvento('en proceso');
  static CANCELADO = new StatusEvento('cancelado');

  constructor(statusName){
    this.name = statusName;
  }

}

module.exports = StatusEvento;
