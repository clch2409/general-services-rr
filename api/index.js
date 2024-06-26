const express = require('express');
const cors = require('cors');
const passport = require('passport');

const config = require('./config/config');

const { routerApi } = require('./routes');
const { logErrors, isBoomHandler, errorHandler, isValidationError } = require('./middlewares/error.handler');


const app = express();
const port = config.port;

const whiteList = ['http://localhost:4200'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin){
      callback(null, true);
    }
    else{
      callback(new Error('No permitido'))
    }
  }
}

app.use(cors(corsOptions));
app.use(express.json());
require('./utils/auth');
app.use(passport.initialize({
  session: false
}))

app.get('/welcome',
  (req, res, next) =>{
    // const fechaHoy = new Date();
    // const otraFecha = new Date('2024-12-12 00:00:00');
    // const validacion = fechaHoy > otraFecha;

    // res.json({
    //   fechaHoy,
    //   otraFecha,
    //   validacion
    // });

    res.json('Hello World')
  }
)

routerApi(app);


app.use(isBoomHandler);
app.use(logErrors);
app.use(errorHandler);


app.listen(port, () =>{
  console.log('Escuchando el puerto ' + port)
})

Date.prototype.toJSON = function(){ return this.toLocaleString(); };
