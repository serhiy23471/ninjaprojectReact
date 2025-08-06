const express = require('express');
const router = express.Router();
const path = require('path');

// (опційно) конфіг
let config = { title: 'WeaponPaints' };
try {
  config = require('./config.json');
} catch (e) {
  console.warn('config.json не знайдено, використовується стандартний заголовок.');
}

router.get('/', (req, res) => {
  res.render('index', {
    title: config.title || 'WeaponPaints',
    pathPrefix: '/skins/public', // щоб CSS/JS підключались правильно
    steamid: req.session?.steamid || null,
    avatar: req.session?.avatar || null,
    username: req.session?.username || null,
    isAdmin: req.isAdmin || false,
    lang: {
      modal: {
        title: "Заголовок модального вікна"
      }
    }
  });
});

module.exports = router;
