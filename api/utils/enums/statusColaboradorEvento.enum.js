
class StatuColaboradorEvento{

  static TRABAJANDO = new StatuColaboradorEvento('trabajando');
  static CONFIRMADO = new StatuColaboradorEvento('confirmado');
  static TERMINADO = new StatuColaboradorEvento('terminado');
  static SIN_CONFIRMAR = new StatuColaboradorEvento('sin confirmar');

  constructor(statusName){
    this.name = statusName;
  }

}

module.exports = StatuColaboradorEvento;
