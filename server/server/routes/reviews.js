const express = require('express');
const router = express.Router();
const pool = require('../db');

// Отримати всі коментарі
router.get('/', async (req, res) => {
  try {
    // Вибираємо всі, щоб потім відобразити відповіді теж
    const [rows] = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ DB fetch error:', err);
    res.status(500).json({ error: 'DB fetch error' });
  }
});

// Додати новий коментар (звичайний, не відповідь)
router.post('/', async (req, res) => {
  const { steamid, username, avatar, comment, rating } = req.body;

  if (!comment || !steamid || !username || rating === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO comments (steamid, username, avatar, comment, rating, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [steamid, username, avatar, comment, rating]
    );
    res.json({ success: true, insertId: result.insertId });
  } catch (err) {
    console.error('❌ DB insert error:', err);
    res.status(500).json({ error: 'DB insert error' });
  }
});

// Відповідь на коментар (тільки для адмінів)
router.post('/reply', async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Доступ заборонено' });
  }

  const { steamid, username, avatar, comment, parent_id } = req.body;

  if (!comment || !steamid || !username || !parent_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await pool.query(
      `INSERT INTO comments (steamid, username, avatar, comment, rating, created_at, parent_id, is_admin_reply) 
       VALUES (?, ?, ?, ?, 0, NOW(), ?, 1)`,
      [steamid, username, avatar, comment, parent_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ DB reply insert error:', err);
    res.status(500).json({ error: 'DB reply insert error' });
  }
});

// Видалення коментаря (тільки для адмінів)
router.delete('/:id', async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Доступ заборонено' });
  }
  const commentId = req.params.id;
  try {
    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ DB delete error:', err);
    res.status(500).json({ error: 'DB delete error' });
  }
});

module.exports = router;
