const { Strategy, ExtractJwt } = require('passport-jwt');

const config = require('../../../config/config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecretAuth
}

const jwtStrategy = new Strategy(options,
  async (payload, done) => {
    console.log(payload)
    return done(null, payload);
  }
);

module.exports = jwtStrategy;
