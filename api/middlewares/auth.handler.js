const boom = require('@hapi/boom');

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
