const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const sessionMiddleware = require('./middleware/session');
const adminCheck = require('./middleware/adminCheck');

const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();
const PORT = 5000;

const STEAM_API_KEY = '704ED29BAE088CD245C606C2DA25074A';

app.use(cors({
  origin: 'http://localhost:5173', // Заміни на продакшен: 'https://ninjaproject.com.ua'
  credentials: true
}));

app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(adminCheck);

// Тестовий маршрут
app.get('/auth/steam/test', (req, res) => {
  res.send('Маршрут /auth/steam/test працює');
});

// Passport серіалізація / десеріалізація
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Налаштування SteamStrategy
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/auth/steam/return',
  realm: 'http://localhost:5000/',
  apiKey: STEAM_API_KEY
}, (identifier, profile, done) => {
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

// Авторизація через Steam
app.get('/auth/steam', passport.authenticate('steam'));

// Колбек після логіну
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    req.session.steamid = req.user.id;
    req.session.username = req.user.displayName;
    req.session.avatar = req.user.photos[0]?.value || null;
    res.redirect('http://localhost:5173'); // Заміни на свій сайт
  }
);

// ВИПРАВЛЕНИЙ LOGOUT - Тепер POST замість GET
app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // очищення cookie сесії
      res.json({ success: true }); // повертаємо JSON без редіректу
    });
  });
});

// Інформація про користувача
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      steamid: req.session.steamid || null,
      username: req.session.username || null,
      avatar: req.session.avatar || null,
      isAdmin: req.isAdmin
    });
  } else {
    res.json({
      steamid: null,
      username: null,
      avatar: null,
      isAdmin: false
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
