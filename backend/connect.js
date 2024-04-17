const { Pool } = require("pg")
const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "chatia",
    password: "root",
    port: 5432,
})

module.exports = pool