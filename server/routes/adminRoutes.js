const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Ендпоінти
router.get("/applications", adminController.getApplications);
router.get("/search-user/:query", adminController.searchUser);
router.post("/ban", adminController.banUser);
router.post("/mute", adminController.muteUser);
router.post("/kick", adminController.kickUser);
router.post("/vip", adminController.giveVip);

module.exports = router;
