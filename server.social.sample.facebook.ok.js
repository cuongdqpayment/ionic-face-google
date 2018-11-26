var express = require('express');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "Đây là chuỗi bảo mật của cuongdq"}));
app.use(passport.initialize());
app.use(passport.session());


// we will call this to start the Facebook Login process
//neu bam nut login facebook thi goi den ham nay 
//facebook la ten cua FacebookStrategy da duoc dinh nghia
//truong hop dung local thi se khai bao local
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will call this URL
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', 
            //truong hop login thanh cong nhung tu choi truy cap ung dung
        {   //successRedirect : '/',
            //failureFlash : true,
            failureRedirect: '/'
         }),
  function(req, res) {
    console.log('\n 3./auth/facebook/callback thanh cong:\n');
    res.redirect('/success');
  });

passport.use(new FacebookStrategy({
    clientID: "1805639889548286",
    clientSecret: "f541047cd1b735588f69288f753c325b",
    callbackURL: "http://localhost:9235/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
    console.log('\n 1.FacebookStrategy:\n');

      console.log(accessToken);
      console.log(profile);
      
    // placeholder for translating profile into your own custom user object.
    // for now we will just use the profile object returned by GitHub
    return done(null, profile); //tra ket qua ve cho passport.serializeUser(var,function)
    }
    ));

passport.serializeUser(function(user, done) {
    // placeholder for custom user serialization
    //lenh 
    // null is for errors
    console.log('\n 2.serializeUser :\n');
    console.log(user);
    
    done(null, user);
    });
    
passport.deserializeUser(function(user, done) {
        // placeholder for custom user deserialization.
        // maybe you are getoing to get the user from mongo by id?
        // null is for errors
    console.log('\n 4.deserializeUser:\n');
    console.log(user);
    done(null, user);
    });

  //trang chu xem thong tin
app.get('/', function (req, res) {
  var html = "<ul>\
    <li><a href='/auth/facebook'>Facebook</a></li>\
    <li><a href='/logout'>logout</a></li>\
  </ul>";

  // dump the user for debugging
  //neu da duoc xac thuc thi session se gui thong tin profile cho minh qua user
  if (req.isAuthenticated()) {
    html += "<p>authenticated as user:</p>"
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
  }

  res.send(html);
});

//neu bam vao day xem nhu minh da logout ra khoi ung dung
app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
    //ham nay neu duoc xac thuc thi cho di tiep
  if (req.isAuthenticated()) { return next(); }
  //neu khong duoc xac thuc thi tra ve lai duong dan trang chu
  res.redirect('/')
}

//cac duong dan yeu cau phai duoc bao ve
app.get('/protected', ensureAuthenticated, function(req, res) {
    //neu ham xac thuc da duoc xac thuc
    //thi moi tra ket qua ve cho no duoi day
    //truong hop chua xac thuc thi khong tra ket qua ve
    res.send("acess granted");
});


var bodyParser = require('body-parser')
var methodOverride = require('method-override')


app.use(bodyParser.urlencoded())
app.use(methodOverride(function (req, res) {
    console.log(req);
    console.log(res);
        
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

/////////////////////////////


var server = app.listen(9235, function () {
  console.log('Example app listening at http://%s:%s',
  server.address().address, server.address().port);
});


function logErrors (err, req, res, next) {
    //console.error('\n logErrors:\n')
    //console.error(err)
    next(err)
}

function clientErrorHandler (err, req, res, next) {
    //console.error('\n clientErrorHandler:\n')
    //console.error(err)
    
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}


function errorHandler (err, req, res, next) {
    //console.error('\n errorHandler:\n')
    //console.error(err)
    res.end(JSON.stringify(err))
  }

