const passport = require('passport');

function authenticationByJwt(){
  return passport.authenticate('jwt', { session: false });
}

module.exports = { authenticationByJwt };
