const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [bansResult] = await pool.query(`
      SELECT COUNT(*) AS count FROM iks_bans;
    `);

    const [mutesResult] = await pool.query(`
      SELECT COUNT(*) AS count FROM iks_comms;
    `);

    const [onlineResult] = await pool.query(`
      SELECT player_count 
      FROM server_stats 
      ORDER BY id DESC 
      LIMIT 1
    `);

    res.json({
      bans: bansResult[0].count,
      mutes: mutesResult[0].count,
      online: onlineResult[0]?.player_count || 0,  // виправлено player_coun -> player_count
      maxPlayers: 24
    });
  } catch (err) {
    console.error('Помилка отримання статистики:', err);
    res.status(500).json({ error: 'Не вдалося отримати статистику' });
  }
});

module.exports = router;
