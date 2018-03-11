var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var home = require('./routes/home');
var user = require('./routes/user');
var secretary = require('./routes/secretary');
var admin = require('./routes/admin');
var api = require('./routes/api');

var app = express();

// 连接数据库
mongoose.connect('mongodb://localhost/TeacherSystem', err=>{
    if(err)
        console.log("数据库连接失败，可能是服务未开启！");
    else
        console.log("数据库连接成功！");
});

// view engine setup
app.set('views', path.join(__dirname, 'views/page'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 日志
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'freetes'
}))
app.use(express.static(path.join(__dirname, 'public')));

// 日志 test
// app.use(function(req, res, next) {
//   console.log(`ip: ${(req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip}`)
//   console.log(req.body)
//   next();
// });


app.use('/', home);
app.use('/users', user);
app.use('/secretary', secretary);
app.use('/admin', admin)
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
