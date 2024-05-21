function addHoursToEventEndTime(horaInicio, horas){
  const horaInicioDate = new Date(horaInicio);

  horaInicioDate.setHours(horaInicioDate.getHours() + horas);

  const horaFin = horaInicioDate;

  return horaFin;
}

function getTodaysDate(){
  const fechaHoy = new Date();
  fechaHoy.setHours(0);
  fechaHoy.setMinutes(0);
  fechaHoy.setSeconds(0);

  return fechaHoy;
}

function getYesterdayDate(){
  const fechaHoy = this.getTodaysDate();
  const hoursInMilisecs = 24 * 3600000;
  const fechaAyer = new Date(fechaHoy.getTime() - hoursInMilisecs);

  return fechaAyer;
}

module.exports = {
  addHoursToEventEndTime,
  getTodaysDate,
  getYesterdayDate,
}
