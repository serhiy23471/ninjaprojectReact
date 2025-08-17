// server/controllers/adminController.js
const db = require('../config/db'); // переконайся, що db повертає pool з mysql2

// Отримати заявки (залишив приклад)
exports.getApplications = (req, res) => {
  db.query('SELECT * FROM applications', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Пошук користувача через query string ?query=...
exports.searchUser = (req, res) => {
  const q = req.query.query;
  if (!q) return res.status(400).json({ error: 'Missing query param' });

  const like = `%${q}%`;
  console.log('🔎 searchUser:', q);

  const sql = `
  SELECT 
    ps.steamid,
    ps.name AS username,
    CASE WHEN b.steam_id IS NOT NULL THEN 1 ELSE 0 END AS banned,
    CASE WHEN c.steam_id IS NOT NULL THEN 1 ELSE 0 END AS muted,
    CASE WHEN v.name IS NOT NULL THEN 1 ELSE 0 END AS vip
  FROM player_stats ps
  LEFT JOIN iks_bans b ON b.steam_id = ps.steamid
  LEFT JOIN iks_comms c ON c.steam_id = ps.steamid
  LEFT JOIN vip_users v ON v.name = ps.name
  WHERE ps.steamid LIKE ? OR ps.name LIKE ?
  LIMIT 50
`;


  db.query(sql, [like, like], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Бан
exports.banUser = (req, res) => {
  const { steamid } = req.body;
  if (!steamid) return res.status(400).json({ error: 'steamid required' });

  const sql = `
    INSERT INTO iks_bans (steamid, banned_at) VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE banned_at = NOW()
  `;

  db.query(sql, [steamid], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Користувач забанений', steamid });
  });
};

// Мут
exports.muteUser = (req, res) => {
  const { steamid } = req.body;
  if (!steamid) return res.status(400).json({ error: 'steamid required' });

  const sql = `
    INSERT INTO iks_comms (steamid, muted_at) VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE muted_at = NOW()
  `;

  db.query(sql, [steamid], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Користувач зам’ючений', steamid });
  });
};

// Кік (тут умовно — без RCON)
exports.kickUser = (req, res) => {
  const { steamid } = req.body;
  if (!steamid) return res.status(400).json({ error: 'steamid required' });

  // ТУТ: можеш викликати RCON або іншу інтеграцію
  console.log('🦵 kickUser called for', steamid);
  res.json({ message: `Користувача ${steamid} буде кікнуто (fake)` });
};

// Видати VIP
exports.giveVip = (req, res) => {
  const { steamid } = req.body;
  if (!steamid) return res.status(400).json({ error: 'steamid required' });

  const sql = `
    INSERT INTO vip_users (steamid, granted_at) VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE granted_at = NOW()
  `;

  db.query(sql, [steamid], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'VIP видано', steamid });
  });
};
