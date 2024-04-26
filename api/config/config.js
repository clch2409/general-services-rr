require('dotenv').config();

const config = {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtSecretAuth: process.env.JWT_SECRET_AUTHENTICATE,
  jwtSecretRecovery: process.env.JWT_SECRET_RECOVERY,
  senderEmail: process.env.SENDER_EMAIL,
  senderPassword: process.env.SENDER_PASSWORD,
}


module.exports = config;
