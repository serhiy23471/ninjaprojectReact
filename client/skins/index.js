console.clear();

const express = require('express');
const bodyParser = require('body-parser');
const { startup } = require('./src/utils/startup');

const path = require('path');
const passport = require('passport');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const Logger = require('./src/utils/logger');
const config = require('./config.json');

const app = express();
const port = config.PORT || 27275;

let returnURL;
let realm;

if (config.HOST === 'localhost' || config.HOST === '127.0.0.1') {
  returnURL = `${config.PROTOCOL}://${config.HOST}:${config.PORT}/api/auth/steam/return`;
  realm = `${config.PROTOCOL}://${config.HOST}:${config.PORT}/`;
} else {
  returnURL = `${config.PROTOCOL}://${config.HOST}/api/auth/steam/return`;
  realm = `${config.PROTOCOL}://${config.HOST}/`;
}

Logger.core.info(`Steam returnURL: ${returnURL}`);
Logger.core.info(`Steam realm: ${realm}`);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new SteamStrategy({
    returnURL: returnURL,
    realm: realm,
    apiKey: config.STEAMAPIKEY,
}, function (identifier, profile, done) {
    console.log('[SteamStrategy] identifier:', identifier);
    console.log('[SteamStrategy] profile:', profile);
    process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
    });
}));

const sessionStore = new MySQLStore(config.DB);

app.use(session({
    store: sessionStore,
    secret: config.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const mainRouter = require('./src/routes/mainRouter.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/web/public')));
app.use('/', mainRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/web/views'));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
});

const server = app.listen(port, config.INTERNAL_HOST, () => {
    startup();
    Logger.core.info(`App listening at ${config.PROTOCOL}://${config.HOST}:${port}`);
});

const io = require('socket.io')(server);
const weaponSocketHandler = require('./src/listeners/weapon.listener');

io.on('connection', socket => weaponSocketHandler(io, socket));

sessionStore.onReady()
  .then(() => Logger.sql.info('MySQLStore ready'));
