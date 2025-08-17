const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '116.202.51.84',
  user: 'u5761_31mQ9pbe85',
  password: '+8+WW!EWFOCGlhj=O8adbgSf',
  database: 's5761_NinjaProject',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
