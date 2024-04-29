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
  next(err);
}


module.exports = { logErrors, errorHandler, isBoomHandler }
