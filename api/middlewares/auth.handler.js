const boom = require('@hapi/boom');

//Se verifica si el rol del usuario que ha hecho la solicitud de consumir el servicio cuenta perteneces a los
//roles enviados como argumentos
function validateRoles(...roles){
  return (req, res, next) =>{
    try{
      const {rol} = req.user;
      if (roles.includes(rol)){
        next()
      }
      else{
        next(boom.unauthorized('No cuenta con los permisos para acceder a esta funcionalidad'));
      }
    }
    catch(e){
      next(e)
    }
  }
}

module.exports = { validateRoles }
