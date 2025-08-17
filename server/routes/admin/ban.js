const express = require('express');
const router = express.Router();
const dbMethods = require('../../config/dbMethods');

router.post('/ban', async (req, res) => {
  const { steamid, adminId, duration, reason } = req.body;
  if (!steamid || !adminId) return res.status(400).json({ error: 'SteamID і adminId потрібні' });

  try {
    await dbMethods.banUser(steamid, adminId, duration || 0, reason || '', 0);
    res.json({ message: 'Користувача забанено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/unban', async (req, res) => {
  const { steamid, adminId, unbanReason } = req.body;
  if (!steamid || !adminId) return res.status(400).json({ error: 'SteamID і adminId потрібні' });

  try {
    await dbMethods.unbanUser(steamid, adminId, unbanReason || '');
    res.json({ message: 'Користувача розбанено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
