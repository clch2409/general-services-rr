const express = require('express');

const rolService = require('../services/rol.service');

const rolRouter = express.Router();

rolRouter.get('',
  findAll
);

async function findAll(req, res, next){
  try{
    const roles = await rolService.findAll()
    res.status(201).json({
      roles
    })
  }
  catch(e){
    next(e)
  }
}


module.exports = { rolRouter };
