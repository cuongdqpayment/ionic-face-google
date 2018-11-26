var passport = require('passport');
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var google={
  web: {
      client_id: "992081558196-38iag4nhgqd30c5hql4tcmeiouikf35d.apps.googleusercontent.com",
      project_id: "turnkey-chimera-214502",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://www.googleapis.com/oauth2/v3/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_secret: "1-mILThi09Fypn-CsPbLKKgq",
      redirect_uris: [
          "http://localhost:9235/auth/google/callback"
      ],
      javascript_origins: [
          "http://localhost:9235"
      ]
  }
}

passport.use(new GoogleStrategy({
    clientID: "992081558196-rg80k0e438vu2hm7pit5tqj9r3rkqq2e.apps.googleusercontent.com",
    clientSecret: "1BQfq7QStRbg6wfLsFxDQGdy",
    callbackURL: "http://localhost:9235/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('\n 1.GoogleStrategy:\n');
    console.log(accessToken); //luu token
    console.log(profile); 
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