const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const path = require('path');

const app = express();
const PORT = 5000;

const STEAM_API_KEY = '704ED29BAE088CD245C606C2DA25074A';

// Дозвіл довіряти проксі (nginx)
app.set('trust proxy', 1);

// Налаштування сесії
const sessionMiddleware = session({
  secret: 'A9d#kL!3@82xJfSh^7vPq#sD8Lm*T%zW',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // Лише через HTTPS
    httpOnly: true,
    sameSite: 'none',   // Для роботи кук при cross-site запитах
    maxAge: 24 * 60 * 60 * 1000, // 1 день
  }
});

app.use(cors({
  origin: 'https://ninjaproject.com.ua',
  credentials: true
}));

app.use(bodyParser.json());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// Серіалізація / десеріалізація користувача в сесію
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// SteamStrategy
passport.use(new SteamStrategy({
  returnURL: 'https://ninjaproject.com.ua/auth/steam/return',
  realm: 'https://ninjaproject.com.ua/',
  apiKey: STEAM_API_KEY
}, (identifier, profile, done) => {
  console.log('Steam profile:', profile);
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

// Маршрут авторизації
app.get('/auth/steam', passport.authenticate('steam'));

// Колбек після логіну
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    req.session.steamid = req.user.id;
    req.session.username = req.user.displayName;
    req.session.avatar = req.user.photos[0]?.value || null;
    res.redirect('https://ninjaproject.com.ua');
  }
);

// Логаут
app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid', {
        path: '/',
        domain: 'ninjaproject.com.ua',
        secure: true,
        httpOnly: true,
        sameSite: 'none'
      });
      res.json({ success: true });
    });
  });
});

// Дані користувача
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      steamid: req.session.steamid || null,
      username: req.session.username || null,
      avatar: req.session.avatar || null,
      isAdmin: req.isAdmin || false,
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

// Статика скінів
app.use('/skins', express.static(path.join(__dirname, 'weaponpaints/public')));
const weaponRoutes = require('./weaponpaints/routes');
app.use('/skins', weaponRoutes);

app.listen(PORT, () => {
  console.log(`Server running on https://ninjaproject.com.ua:${PORT}`);
});
