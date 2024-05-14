const { ValidationError } = require('sequelize');

function logErrors(err, req, res, next){
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next){
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}

//Verifica si el error enviado es de tipo "Boom", que viene a partir de la librería @hapi/boom
function isBoomHandler(err, req, res, next){
  if (err.isBoom){
    const { output } = err;
    res.status(output.statusCode).json({
      message: output.payload
    });
  }
  else if (err instanceof ValidationError){
    const { message } = err
    const { sqlMessage } = err.original
    res.status(406).json({
      message,
      sqlMessage,
    });
  }
  else{
    next(err);
  }
}

// function isValidationError(err, req, res, next){
//   if (err.original){
//     res.status(400).json({
//       sqlMessage: err.original.sqlMessage,
//       message: err.errors[0].message,
//       stack: err.stack,
//     })
//   }
//   next(err);
// }


module.exports = { logErrors, errorHandler, isBoomHandler }
