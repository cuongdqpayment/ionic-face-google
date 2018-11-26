const express           =     require('express')
    , passport          =     require('passport')
    , util              =     require('util')
    , FacebookStrategy  =     require('passport-facebook').Strategy
    , session           =     require('express-session')
    , cookieParser      =     require('cookie-parser')
    , bodyParser        =     require('body-parser')
    , config            =     require('./socials/cfg/facebook.cfg')
    , app               =     express();

  
// Passport session setup.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done)=>{
  done(null, obj);
});
// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(()=>{
      //Check whether the User exists or not using profile.id
      //Further DB code.
      return done(null, profile);
    });
  }
));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
//Router code
app.get('/', (req, res)=>{
  res.render('index', { user: req.user });
});
app.get('/account', ensureAuthenticated,(req, res)=>{
  res.render('account', { user: req.user });
});
//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
       successRedirect : '/', 
       failureRedirect: '/login' 
  }),
  (req, res) => {
    res.redirect('/');
  });
app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
app.listen(9235);