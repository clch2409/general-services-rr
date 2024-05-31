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

function getDayOfTheWeek(date){
  const fecha = new Date(date);

  return fecha.getDay();
}

// function getHoursToString(horario){
//   const horarioDate = new Date(horario);
//   const horarioHoras = horarioDate.getHours();
//   const horarioMinutos = horarioDate.getMinutes();

//   let horarioString = '';

//   if (horarioHoras < 10 && horarioMinutos < 10){
//     horarioString += `0${horarioHoras}:0${horarioMinutos}`;
//   }
//   else if (horarioHoras < 10){
//     horarioString += `0${horarioHoras}:${horarioMinutos}`
//   }
//   else if(horarioMinutos < 10){
//     horarioString += `${horarioHoras}:0${horarioMinutos}`
//   }
//   else {
//     horarioString += `${horarioHoras}:${horarioMinutos}`
//   }

//   return horarioString;
// }

module.exports = {
  addHoursToEventEndTime,
  getTodaysDate,
  getYesterdayDate,
  getDayOfTheWeek,
  // getHoursToString,
}
