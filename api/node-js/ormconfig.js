const db = require('./src/config/_db');

module.exports = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": db.user,
    "password": db.password,
    "database": db.database,
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ],
}