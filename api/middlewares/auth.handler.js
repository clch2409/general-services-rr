const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const roles = require('./../utils/enums/rol.enum');

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

function validateRolesJwt(token){
  if (!token){
    throw boom.unauthorized('Usted no puede realizar esta accion');
  }

  const payload = jwt.verify(token, config.jwtSecretAuth);

  console.log(payload);

  if (payload.rol == roles.CLIENTE){
    throw boom.unauthorized('Usted no puede realizar esta accion');
  }
}

module.exports = { validateRoles, validateRolesJwt }
