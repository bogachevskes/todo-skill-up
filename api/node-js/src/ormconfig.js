const db = require('./config/_db');

module.exports = {
    "type": 'mysql',
    "host": db.host,
    "port": 3306,
    "username": db.user,
    "password": db.password,
    "database": db.database,
    "logging": true,
    "entities": [
        "src/entity/**/*.ts"
    ],
}