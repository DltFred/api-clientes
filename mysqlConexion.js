const mysql = require('mysql')
const { promisify } = require('util')
require('dotenv').config()

const PARAMS = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

const db = mysql.createPool(PARAMS)

db.connect(error => {
  if (error) throw error
  console.log('Database is connected')
})
db.query = promisify(db.query)
module.exports = db
