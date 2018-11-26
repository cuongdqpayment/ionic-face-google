var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: "1805639889548286",
  clientSecret: "f541047cd1b735588f69288f753c325b",
  callbackURL: "http://localhost:9235/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  
    console.log('\n 1.FacebookStrategy:\n');
    //console.log(accessToken); //luu token
    //console.log(profile); 
    //chuyen tra ve ket qua luu vao csdl
    var user={
      token: accessToken,
      provider_id: profile.id,
      provider: profile.provider,
      displayName: profile.displayName,
      profileUrl: profile.profileUrl,
      photo: profile.photos,
      name: profile.name,
      gender: profile.gender,
      access_time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
  // placeholder for translating profile into your own custom user object.
  // for now we will just use the profile object returned by GitHub
  return done(null, user); 
  //tra ket qua ve cho passport.serializeUser(var,function)
}
));

module.exports = passport;