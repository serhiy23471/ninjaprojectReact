const session = require('express-session');

const sessionMiddleware = session({
  secret: 'myVery$ecureAndUniqueSecret123!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: true — тільки для HTTPS
});

module.exports = sessionMiddleware;
