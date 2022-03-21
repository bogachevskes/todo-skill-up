const db = require('./dist/server/config/_db');
const SnakeNamingStrategy = require('typeorm-naming-strategies')
  .SnakeNamingStrategy;

module.exports = {
    "type": 'mysql',
    "host": db.host,
    "port": db.port,
    "username": db.user,
    "password": db.password,
    "database": db.database,
    "logging": db.logging,
    "synchronize": db.sync,
    "entities": [
        "dist/server/app/Entity/**/*.js",
    ],
    "namingStrategy": new SnakeNamingStrategy(),
}