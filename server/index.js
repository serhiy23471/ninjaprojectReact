require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const sessionMiddleware = require('./middleware/session');
const adminCheck = require('./middleware/adminCheck');

const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();
const PORT = process.env.PORT || 5000;

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_DOMAIN = process.env.BASE_DOMAIN;

// CORS
app.use(cors({
  origin: BASE_DOMAIN,
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

// SteamStrategy
passport.use(new SteamStrategy({
  returnURL: `${BASE_DOMAIN}:${PORT}/auth/steam/return`,
  realm: `${BASE_DOMAIN}:${PORT}/`,
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
    res.redirect(BASE_DOMAIN); // Редірект на головну
  }
);

// Logout
app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

// Отримання користувача
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

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
