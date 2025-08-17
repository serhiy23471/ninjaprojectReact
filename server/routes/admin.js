const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/search-user', adminController.searchUser);

// Додай інші маршрути (ban, mute, vip, kick)
router.post('/ban', adminController.banUser);
router.post('/mute', adminController.muteUser);
router.post('/vip', adminController.giveVip);
router.post('/kick', adminController.kickUser);

module.exports = router;
