const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

module.exports = {
    "type": 'mysql',
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "logging": process.env.DB_LOGGING,
    "synchronize": false,
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "namingStrategy": new SnakeNamingStrategy(),
}