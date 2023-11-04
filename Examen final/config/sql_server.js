
require('dotenv').config();const config = {

    server: process.env.SERVER,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // server: "localhost",
    // user: "sa",
    // password: "1234",
    // database: "Examen",
    options: {
        trustServerCertificate: true
    }
}

module.exports.config = config;