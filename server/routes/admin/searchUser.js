const express = require('express');
const router = express.Router();
const pool = require('../../config/db'); // твій пул з'єднань

router.get('/search-user', async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Використовуємо LIKE для пошуку по ніку або точний збіг по steamid
    const sql = `
      SELECT name, steamid 
      FROM player_stats
      WHERE steamid = ? OR name LIKE ?
      LIMIT 50
    `;

    const likeQuery = `%${query}%`;
    const [rows] = await pool.query(sql, [query, likeQuery]);

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
