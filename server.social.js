const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('cert/midle_key.pem', 'utf8');
const certificate = fs.readFileSync('cert/my-certificate_2.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();

//tao database luu tru mang xa hoi
const db = require('./database-service');

// Express and Passport Session
const passport = require('passport');
const session = require('express-session');
//const MemcachedStore = require('connect-memjs')(session);

const sessionConfig = {
    resave: false,
    saveUninitialized: false,
    secret: "cuongdq123",
    //xem kiem tra lai luu catch bo nho cua session nay
    //luu dich vu cloud token??? neu bat len thi facebook khong truy cap duoc
    /* store: new MemcachedStore({
        //may chu luu tru cache // do google tra ve >1 token
        servers: ['http://localhost:9235']
      }), */
    signed: true
    };


app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

//nhung xac thuc mang xa hoi vao
var auth = require('./routes/auth');
app.use('/auth', auth);
/////////////////////////////////

//dieu khien tra req.user ve cho client nhu nao???
passport.serializeUser(function(user, done) {
    console.log('\n 2.serializeUser :\n');
    console.log(user);
    if (user.provider=='local'
        ){
        //can xac thuc trong database
        if (user.username){
            db.getRst("select * from local_user\
                     where username ='"+user.username+"'")
                     .then(row=>{
                         console.log(row)
                         user.token='12345509994244'; //token cua user ma hoa
                         done(null,user);
                    })
                     .catch(err=>{
                         console.log(err)
                         done(err);
                        }
                        );
        }else{
            done({err:'Khong co user nhe'});
        }
        
    }
    else{

    //luu user vao csdl nhe
    //----- LUU LOG FILE BEFORE-----
    var insert_user = {
        name: 'SOCIAL_USERS',
        cols: [{
            name: 'PROVIDER_ID',
            value: user.provider_id
        },
        {
            name: 'PROVIDER',
            value: user.provider
        },
        {
            name: 'DISPLAY_NAME',
            value: user.displayName
        }
        ,
        {
            name: 'LAST_ACCESS_TIME',
            value: user.access_time
        }
        ,
        {
            name: 'TOKEN_ID',
            value: user.token
        }
        ],
        wheres: [
            {
            name: 'PROVIDER_ID',
            value: user.provider_id
            },
            {
                name: 'PROVIDER',
                value: user.provider
            }
        ]
    };

    db.insert(insert_user)
      .then(data => {
          //console.log(data)
        }
      )
      .catch(err=>{
          db.runSql("update SOCIAL_USERS set COUNT_ACCESS=COUNT_ACCESS+1,\
                     LAST_ACCESS_TIME ='"+user.access_time+"'\
                     where PROVIDER_ID='"+user.provider_id+"'\
                     and  PROVIDER='"+user.provider + "'")
          .then(data=>{
              //console.log(data)
          })
      });

      //kiem tra database va duoc cap quyen
      if (true){
          done(null, user);
      }else{
        done({err:'User bi block khong cho phep truy cap'});
      }


    }
    //-----------------------
    
    });
    
passport.deserializeUser(function(user, done) {
        // placeholder for custom user deserialization.
        // maybe you are getoing to get the user from mongo by id?
        // null is for errors
        
        //khi goi isAuthenticated() 
        //no se goi lai ham nay
        //ta doc csdl ktra quyen
        //kiem tra trang thai.... thay doi de tra ve cho user
        //gan vai tro la 99 = admin
        user.role=99;
        
        console.log('\n 4.deserializeUser:\n');
        console.log(user);

        done(null, user);
    });

//muon xem duoc list phai login vao co quyen admin
app.get('/list',ensureAdminAuthenticated, (req, res) => {  
    db.getRsts("select * from social_users")
    .then(rows=>{
        res.header('Content-type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(rows))
    })  
});

//Tao local user phai co quyen admin
app.get('/add-local-user',ensureAdminAuthenticated, (req, res) => { 
    createLocalUser({});

    db.getRsts("select * from local_users")
    .then(rows=>{
        res.header('Content-type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(rows))
    })  
});


app.get('/', (req, res) => {
    res.header('Content-type', 'text/html');
    var html = "<h1>Hello, Secure World!</h1>\
                <ul>\
                <li><a href='/add-local-user'>CreateUser</a></li>\
                <li><a href='/auth/login'>Login</a></li>\
                <li><a href='/auth/logout'>logout</a></li>\
                <li><a href='/list'>list user</a></li>\
                </ul>";

                // dump the user for debugging
                //neu da duoc xac thuc thi session se gui thong tin profile cho minh qua user
                if (req.isAuthenticated()) {
                    html += "<p>authenticated as user:</p>"
                    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
                }

    res.end(html);
});


//xu ly cac loi khac nhau
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)



// your express configuration here
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const portHttp = process.env.PORT || 9235;
const portHttps = process.env.PORT || 8443;
// For http
httpServer.listen(portHttp,()=>{
    console.log("Server https with port: " + portHttp);
});
// For https
httpsServer.listen(portHttps,()=>{
    console.log("Server https with port: " + portHttps);
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

//ham bao dam login xac thuc tung chuc nang
function ensureAuthenticated(req, res, next) {
    //ham nay neu duoc xac thuc thi cho di tiep
  if (req.isAuthenticated()) { return next(); }
  //neu khong duoc xac thuc thi tra ve lai duong dan trang chu
  res.redirect('/')
}

function ensureAdminAuthenticated(req, res, next) {
    //ham nay neu duoc xac thuc thi cho di tiep
    //ham kiem tra xac thuc se goi deserializeUser
  if (req.isAuthenticated()
        &&req.user
        &&req.user.role==99
        ) { return next(); }
  //neu khong duoc xac thuc thi tra ve lai duong dan trang chu
  res.redirect('/')
}

//gia su truyen tu form vao thi truyen bien nay
function createLocalUser(jsonUserSql){
    var insert_user = {
        name: 'LOCAL_USERS',
        cols: [{
            name: 'USERNAME',
            value: 'CUONGDQ'
        },
        {
            name: 'PASSWORD',
            value: 'admin'
        },
        {
            name: 'DISPLAY_NAME',
            value: 'Đoàn Quốc Cường'
        }
        ]
    };

    db.insert(insert_user)
      .then(data => {
          //console.log(data)
        }
      );
}