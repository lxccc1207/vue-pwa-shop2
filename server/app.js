var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) { // 拦截请求
  if(req.cookies.userId){
    next();
  }else{
      // console.log("url:"+req.url);
      // 匹配到以下路由
    if (req.originalUrl.indexOf('/users/login') > -1 || 
      req.originalUrl.indexOf('/users/logout') > -1 || 
      req.originalUrl.indexOf('/list') > -1 || 
      req.originalUrl.indexOf('/subscription') > -1 || 
      req.originalUrl.indexOf('/getDetails')>-1 || 
      req.originalUrl.indexOf('/leaveMsg') > -1 ||
      req.originalUrl.indexOf('/users/register')>-1 || 
      req.originalUrl.indexOf('/users/userExist')>-1 || 
      req.originalUrl.indexOf('/searchData')>-1 ||
      req.originalUrl.indexOf('/admin/getList') > -1 ||
      req.originalUrl.indexOf('/admin/upLoad') > -1) {
        next();
      } else {
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

// app.use('/api/', index); // 生产环境下必须加上api，否则404；开发环境必须去掉api，否则请求不到
// app.use('/api/users', users);
app.use('/', index); // 开发环境
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.json({
    msg:'后端收到请求，但具体接口接收不到'
  })
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
