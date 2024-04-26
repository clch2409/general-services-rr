const { Strategy } = require('passport-local');

const authService = require('../../../services/auth.service');

const localStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'contrasena'
  },
  async (email, password, done) => {
    try{
      const foundUser = await authService.checkUserCredentiasl(email, password);

      done(null, foundUser);
    }
    catch(e){
      done(e, false);
    }
  }
);

module.exports = localStrategy;
