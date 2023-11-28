const db = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const conn = db.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    connectionLimit:5
})

module.exports = conn;