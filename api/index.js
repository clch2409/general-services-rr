const express = require('express');
const cors = require('cors');

const config = require('./config/config');
const { routerApi } = require('./routes');
const { logErrors, isBoomHandler, errorHandler } = require('./middlewares/error.handler');


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

app.get('/welcome',
  (req, res, next) =>{
    res.json('Hello World')
  }
)

routerApi(app);

app.use(logErrors);
app.use(errorHandler);
app.use(isBoomHandler);

app.listen(port, () =>{
  console.log('Escuchando el puerto ' + port)
})
