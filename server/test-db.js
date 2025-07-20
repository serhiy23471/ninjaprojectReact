const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'web.mevcore.com',
      user: 'oxjscfkn_ninjaproject',
      password: 'qdhefajlzvsqm123',
      database: 'oxjscfkn_ninjaproject',
      port: 3306, // вкажи, якщо відрізняється
    });
    console.log('Підключення успішне!');
    await connection.end();
  } catch (error) {
    console.error('Помилка підключення:', error.message);
  }
}

testConnection();
