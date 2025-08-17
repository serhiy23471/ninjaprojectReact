const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'web.mevcore.com',
  user: 'oxjscfkn_ninjaproject',
  password: 'qdhefajlzvsqm123',
  database: 'oxjscfkn_ninjaproject',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
