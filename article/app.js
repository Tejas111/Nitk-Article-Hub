var createError = require('http-errors');
 var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var grid = require('./routes/gridfs');
var uploadRouter = require('./routes/uploadRouter');
var app = express();
var searchRouter = require('./routes/search');
//var student=require('./models/users');
var passport= require('passport');
var authenticate = require('./authenticate');
var users = require('./routes/users');
var userdetail = require('./routes/userdetail');
var sendfile = require('./routes/sendfiles');
// view engine setup
var mongoose = require('mongoose');
 var config=require('./config');

const url = config.mongourl;
const connect = mongoose.connect(url,{ useNewUrlParser: true });

//onst url = config.mongourl;
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
//app.use(bodyParser.urlencoded({extended}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
//app.get('/users', indexRouter);
app.use('/users',users)
//app.use('/search',searchRouter);

//app.use('')



function auth(req,res,next){
  //console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');                          
    err.status = 401;
    next(err);
  }
  else {
        next();
  }
}
app.use(auth);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/userdetail',userdetail);
//app.get('/',indexRouter);
app.use('/upload',grid);
app.use('/files',sendfile);
app.use('/fileupload',uploadRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
