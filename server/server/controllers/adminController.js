const db = require("../db");

// Отримати заявки
exports.getApplications = (req, res) => {
  db.query("SELECT * FROM applications", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Пошук користувача
exports.searchUser = (req, res) => {
  const query = req.params.query;
  db.query(
    "SELECT * FROM users WHERE steamid LIKE ? OR username LIKE ?",
    [`%${query}%`, `%${query}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Бан
exports.banUser = (req, res) => {
  const { steamid } = req.body;
  db.query("UPDATE users SET banned = 1 WHERE steamid = ?", [steamid], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Користувач забанений" });
  });
};

// Мут
exports.muteUser = (req, res) => {
  const { steamid } = req.body;
  db.query("UPDATE users SET muted = 1 WHERE steamid = ?", [steamid], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Користувач зам’ючений" });
  });
};

// Кік
exports.kickUser = (req, res) => {
  const { steamid } = req.body;
  // Тут можеш підключити RCON або іншу логіку
  res.json({ message: `Користувача ${steamid} буде кікнуто` });
};

// Вип
exports.giveVip = (req, res) => {
  const { steamid } = req.body;
  db.query("UPDATE users SET vip = 1 WHERE steamid = ?", [steamid], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "VIP видано" });
  });
};
