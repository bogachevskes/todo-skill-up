const db = require('./dist/server/config/_db');

module.exports = {
    "type": 'mysql',
    "host": db.host,
    "port": 3306,
    "username": db.user,
    "password": db.password,
    "database": db.database,
    "logging": db.logging,
    "synchronize": db.sync,
    "entities": [
        "dist/server/entity/**/*.js",
    ],
}