const express = require('express');
const router = express.Router();
const dbMute = require('../../config/dbMethods');
const pool = require('../../config/db'); // пул для запитів до БД

// Функція для отримання adminId по SteamID адміна
async function getAdminIdBySteamId(steamid) {
  const sql = 'SELECT id FROM iks_admins WHERE steamid = ? LIMIT 1';
  const [rows] = await pool.query(sql, [steamid]);
  if (rows.length > 0) return rows[0].id;
  return null;
}

// Зам'ютити користувача
router.post('/mute', async (req, res) => {
  const { steamid, adminSteamId, muteType = 2, duration = 0, reason = '' } = req.body;

  if (!steamid) {
    return res.status(400).json({ error: 'SteamID користувача є обовʼязковим' });
  }

  let adminId = 200; // дефолтне значення

  if (adminSteamId) {
    try {
      const foundAdminId = await getAdminIdBySteamId(adminSteamId);
      if (foundAdminId) adminId = foundAdminId;
    } catch (err) {
      console.error('Помилка пошуку adminId:', err);
      // лишаємо adminId = 200
    }
  }

  try {
    await dbMute.muteUser(steamid, adminId, muteType, duration, reason);
    res.json({ message: "Користувача зам'ютено" });
  } catch (err) {
    console.error('Mute error:', err);
    res.status(500).json({ error: err.message || 'Помилка сервера' });
  }
});

// Розм'ютити користувача
router.post('/unmute', async (req, res) => {
  const { steamid, adminSteamId, unbanReason = '' } = req.body;

  if (!steamid) {
    return res.status(400).json({ error: 'SteamID користувача є обовʼязковим' });
  }

  let adminId = 200; // дефолтне значення

  if (adminSteamId) {
    try {
      const foundAdminId = await getAdminIdBySteamId(adminSteamId);
      if (foundAdminId) adminId = foundAdminId;
    } catch (err) {
      console.error('Помилка пошуку adminId:', err);
      // лишаємо adminId = 200
    }
  }

  try {
    await dbMute.unmuteUser(steamid, adminId, unbanReason);
    res.json({ message: "Користувача розм'ютено" });
  } catch (err) {
    console.error('Unmute error:', err);
    res.status(500).json({ error: err.message || 'Помилка сервера' });
  }
});

module.exports = router;
