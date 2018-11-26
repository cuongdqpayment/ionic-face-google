var passport = require('passport');
var session = require('express-session');

app.use(session({
    secret: 's3cr3t',
    resave: true,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

var auth = require('./routes/auth');

app.use('/auth', auth);