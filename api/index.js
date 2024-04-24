const express = require('express');
const cors = require('cors');

const config = require('./config/config');

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

app.listen(port, () =>{
  console.log('Escuchando el puerto ' + port)
})
