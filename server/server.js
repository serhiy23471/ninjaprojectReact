const express = require('express');
const session = require('express-session');
const pool = require('./db');
const adminCheck = require('./middleware/adminCheck');

const app = express();

// Налаштування сесій
app.use(session({
  secret: 'a8f7d6e5c4b3a2910f8e7d6c5b4a3920', // заміни на свій секрет
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure: true якщо https
}));

app.use(express.json());

// Підключаємо перевірку адміна до всіх запитів
app.use(adminCheck);

// Маршрут додавання коментаря
app.post('/api/comments', async (req, res) => {
  try {
    const { comment, rating, username, steamid, avatar, parent_id = null, is_admin_reply = 0 } = req.body;

    if (!comment || !rating || !username || !steamid) {
      return res.status(400).json({ error: 'Некоректні дані' });
    }

    // Забороняємо створювати адмін-відповіді користувачам без прав
    if (is_admin_reply === 1 && !req.isAdmin) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const sql = `
      INSERT INTO comments 
      (comment, rating, username, steamid, avatar, parent_id, is_admin_reply, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(sql, [comment, rating, username, steamid, avatar, parent_id, is_admin_reply]);

    res.status(201).json({ success: true, commentId: result.insertId });
  } catch (error) {
    console.error('Помилка додавання коментаря:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Крок 1: Додати маршрут для отримання коментарів
app.get('/api/comments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Помилка отримання коментарів:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
