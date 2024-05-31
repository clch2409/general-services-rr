
class StatuColaboradorEvento{

  static ASIGNADO = new StatuColaboradorEvento('asignado');
  static TERMINADO = new StatuColaboradorEvento('terminado');

  constructor(statusName){
    this.name = statusName;
  }

}

module.exports = StatuColaboradorEvento;
