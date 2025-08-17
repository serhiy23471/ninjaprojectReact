const pool = require('./db'); // шлях до твого файлу з пулом

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('✅ Успішне зʼєднання з БД');
  } catch (error) {
    console.error('❌ Помилка зʼєднання з БД:', error.message);
  }
}

testConnection();
