var express = require('express');
var router = express.Router();
var passportFacebook = require('../auth/facebook');
var passportGoogle = require('../auth/google');
var passportLocal = require('../auth/local');

/* LOGIN ROUTER */
router.get('/login', (req, res, next) => {
  var html = "<ul>\
              <li><a href='/auth/local'>Local</a></li>\
              <li><a href='/auth/google'>Google</a></li>\
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

/* LOGOUT ROUTER */
//neu bam vao day xem nhu minh da logout ra khoi ung dung
router.get('/logout', function(req, res){
  console.log('logging out');
  req.logout(); //lenh nay xoa session tren server
  res.redirect('/');
});

/* FACEBOOK ROUTER */
router.get('/facebook',
  passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
                                passportFacebook.authenticate('facebook',
                                                //ket qua la goi strary
                                                {failureRedirect: '/login'})
                                ,function(req, res) {
                                  console.log('\n 3./auth/facebook/callback thanh cong:\n');
                                  //sau khi ket qua login thanh cong
                                  res.redirect('/');
                                  });
  
/* GOOGLE ROUTER */
router.get('/google',
  passportGoogle.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

router.get('/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

  /* LOCAL ROUTER */
//phuong thuc nay co the nam o client
//lam sao de post du lieu len post
router.get('/local',(req,res)=>{
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="http://localhost:9235/auth/local" method="post" enctype="application/json">');
    res.write('<input type="text" name="username" value="cuongdq"><br>');
    res.write('<input type="text" name="password" value="123"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

//nhan du lieu post len
//default {username:'',password:''} co 2 truong thong tin nay
router.post('/local',
  passportLocal.authenticate('local',{ successRedirect: '/',
                                       failureRedirect: '/login',
                                       failureFlash: true }));
  
module.exports = router;