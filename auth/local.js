var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    //By default, LocalStrategy expects to find credentials in parameters named username and password. If your site prefers to name these fields differently, options are available to change the defaults.
    console.log('\n 1.LocalStrategy:\n');
    //kiem tra user da duoc dang ky trong database
    //neu co thi tra ve toan bo profile cho no

    //chuyen tra ve ket qua luu vao csdl
    var user={
      username: username,
      password: password,
      provider: 'local', //xac thuc bang csdl
      /* token: accessToken,
      provider_id: profile.id,
      displayName: profile.displayName,
      profileUrl: profile.profileUrl,
      photo: profile.photos,
      name: profile.name,
      gender: profile.gender, */
      access_time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
   return done(null, user); 
  //tra ket qua ve cho passport.serializeUser(var,function)
  }
));

module.exports = passport;