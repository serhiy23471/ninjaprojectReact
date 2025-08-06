const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Отримати всі заявки
router.get("/applications", adminController.getApplications);

// Пошук користувача
router.get("/user/:query", adminController.searchUser);

// Бан
router.post("/ban", adminController.banUser);

// Мут
router.post("/mute", adminController.muteUser);

// Кік
router.post("/kick", adminController.kickUser);

// Вип
router.post("/vip", adminController.giveVip);

module.exports = router;
router.get('/users', async (req, res) => {
  const { query } = req.query;

  try {
    const sql = query
      ? 'SELECT * FROM users WHERE steamid LIKE ? OR nickname LIKE ?'
      : 'SELECT * FROM users';
    const params = query ? [`%${query}%`, `%${query}%`] : [];

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Помилка при пошуку користувачів:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});
