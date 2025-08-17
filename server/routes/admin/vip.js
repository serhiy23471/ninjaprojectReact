const express = require('express');
const router = express.Router();
const dbVip = require('../../config/dbMethods'); // твоя логіка роботи з VIP

// Видати VIP користувачу
router.post('/vip', async (req, res) => {
  const { sid, name = '', accountId = null, group = '', expires = null } = req.body;
  if (!sid) return res.status(400).json({ error: 'SID is required' });

  // expires можна передавати у вигляді UNIX timestamp або null
  try {
    await dbVip.giveVip(sid, name, accountId, group, expires);
    res.json({ message: 'Користувачу видано VIP' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Відмінити VIP у користувача
router.post('/remove-vip', async (req, res) => {
  const { sid } = req.body;
  if (!sid) return res.status(400).json({ error: 'SID is required' });

  try {
    await dbVip.removeVip(sid);
    res.json({ message: 'VIP статус користувача знято' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
