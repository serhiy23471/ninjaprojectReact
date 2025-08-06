const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const pool = require('./db');
const sessionMiddleware = require('./middleware/session');
const adminCheck = require('./middleware/adminCheck');
const reviewRoutes = require('./routes/reviews');
const statsRoute = require('./routes/stats');
const skinsRoutes = require('./weaponpaints/routes');

const app = express();
const PORT = 5000;
const STEAM_API_KEY = '704ED29BAE088CD245C606C2DA25074A';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(adminCheck);

// Passport Steam Configuration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/auth/steam/return',
  realm: 'http://localhost:5000/',
  apiKey: STEAM_API_KEY,
  profile: true // Дозволяє отримати повний профіль
}, (identifier, profile, done) => {
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

// Steam Authentication Routes
app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    // Зберігаємо всі необхідні дані з Steam профілю
    req.session.steamid = req.user.id;
    req.session.personaname = req.user._json.personaname;
    req.session.avatarfull = req.user._json.avatarfull;
    req.session.profileurl = req.user._json.profileurl;
    res.redirect('http://localhost:5173');
  });

app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

// User Data Endpoint
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      steamid: req.user.id,
      personaname: req.user._json.personaname,
      avatarfull: req.user._json.avatarfull,
      profileurl: req.user._json.profileurl,
      isAdmin: req.isAdmin
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// API routes
app.use('/api/stats', statsRoute);
app.use('/api/reviews', reviewRoutes);

// EJS templates and public static files
app.set('views', path.join(__dirname, 'skins/web/views'));
app.set('view engine', 'ejs');
app.use('/skins/public', express.static(path.join(__dirname, 'skins/web/public')));
app.use('/skins', skinsRoutes);

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});