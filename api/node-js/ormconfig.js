const db = require('./dist/config/_db');

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
        "dist/entity/**/*.js"
    ],
}