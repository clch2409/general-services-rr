
class StatusEvento{

  static RESERVADO = new StatusEvento('reservado');
  static REALIZADO = new StatusEvento('realizado');
  static EN_PROCESO = new StatusEvento('en proceso');

  constructor(statusName){
    this.name = statusName;
  }

}

module.exports = StatusEvento;
