const webpush = require('web-push');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $conf = require('../conf/conf');
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// 使用连接池
var pool = mysql.createPool($conf.mysql);
router.use(express.static('public'));

/* ===================== */
/* 使用web-push进行消息推送 */
/* ===================== */

// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys.publicKey)
// console.log(vapidKeys.privateKey)
// webpush.setGCMAPIKey('<Your GCM API Key Here>');
const vapidKeys = {
  publicKey: 'BF5oVjPzY-ixJmcOYC-o0064yL3fIQW3wrXcRm6Omr44PZYWo4fwmnr0TFe9W8nDw55qQgigd0o5czRYYsP5U0w',
  privateKey: '-XfnTVZ7idqe10tVjPhm2edI5DengOYIpuN2Taw0oBQ'
}
webpush.setVapidDetails(
  'mailto:xiaochang_li@foxmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//提交订阅信息，保存
router.post('/subscription', function (req, res) {
  console.log('前台payloadbody',req.body)
  // var endpoint = req.body.endpoint
  // saveRegistrationDetails(endpoint, key, authSecret)// 保存用户注册详情，这样可以在稍后阶段向他们发送消息
  const pushSubscription = {
    endpoint: req.body.endpoint,
    keys: {
      auth: req.body.authSecret,
      p256dh: req.body.key
    }
  };

  var data = {
    msg: '欢迎来到好购商城!'
    // url: 'http://localhost:3001/',
    // icon: '../public/images/logo.png'
  }
  // const options = {
  //   proxy: 'http://localhost:3001' // 使用FCM（Chrome）需要配置代理
  // };

  webpush.sendNotification(pushSubscription, JSON.stringify(data)).then(result => {
    console.log('推送成功返回的结果', result)
  }).catch(err => {
    // 判断状态码，440和410表示失效
    // if (err.statusCode === 410 || err.statusCode === 404) {
    //   return util.remove(pushSubscription);
    // }
    // else {
      console.log("推送失败");
      console.log(err);
    // }
  })
});

// 查询商品列表
router.get('/list', function(req, res, next) {
  var sortNum = req.param('sort'); // 获取前台传过来的sort值
  var page = parseInt(req.param('page')); // 获取前台传过来的page(第几页)值
  var pageSize = parseInt(req.param('pageSize')); // 获取前台传过来的pageSize(每页多少条)值
  var priceLevel = req.param('priceLevel'); // 获取前台传过来的priceLevel(价格区间)值
  var pageNum = (page-1)*pageSize;
  var priceGt = ''; //定义价格区间
  var priceLte = ''; //定义价格区间
  if(pageNum>=0){ //用于后台接口测试
    pageNum = pageNum;
  }else{
    pageNum = 0;
  }
  if(pageSize){ //用于后台接口测试
    pageSize = pageSize;
  }else{
    pageSize = 5;
  }
  switch (priceLevel) {
    case '0':
      priceGt = 0;
      priceLte = 500;
      break;
    case '1':
      priceGt = 500;
      priceLte = 1000;
      break;
    case '2':
      priceGt = 1000;
      priceLte = 2000;
      break;
    case '3':
      priceGt = 2000;
      priceLte = 5000;
      break;
    case '4':
      priceGt = 5000;
      priceLte = 10000;
      break;
    case 'all':
      priceGt = 0;
      priceLte = 999999;
      break;
    default:
      priceGt = '';
      priceLte = '';
      break;
  }
  if(pool) {
    var sort = '';
    if (sortNum === '1') {
      sort = 'asc';
    }else if(sortNum === '0') {
      sort = 'desc';
    }else{
      sort = 'desc';
    }
  if(priceLevel == 'all' && sortNum=='') {
    var sql = `select * from goods order by id asc limit ${pageNum},${pageSize}`;
  } else{
    var sql = `select * from goods where productPrice>${priceGt} and productPrice<=${priceLte} order by productPrice ${sort} limit ${pageNum},${pageSize}`;
  }
    pool.query(sql,(err, result) => {
      if (err) {
        // res.send(err.message);
        res.json({
          status:'-1',
          msg:err.message,
          pageNum:pageNum
        });
      } else {
        // res.send( JSON.stringify(result));
        res.json({
          status:'1',
          msg:'',
          sort:sort,
          pageNum:pageNum,
          data:{
            count:result.length,
            list:result
          }
        });
      }
    });
    console.log('succee');
  }else{
    console.log('err');
  }
});

// 搜索框接口
router.get('/searchData', (req, res, next) => {
  var secContent = req.param('secContent');
  var page = parseInt(req.param('page')); // 获取前台传过来的page(第几页)值
  var pageSize = parseInt(req.param('pageSize')); // 获取前台传过来的pageSize(每页多少条)值
  var pageNum = (page-1)*pageSize;
  var sql = `select * from goods where productName LIKE '%${secContent}%' or productDetails LIKE '%${secContent}%'`;
  pool.query(sql, (err, result) => {
    if(err) {
      res.json({
        status:'-1',
        msg:err.message
      });
    } else {
      res.json({
        status:'1',
        msg:'',
        result:result
      });
    }
  });

});
// 加入购物车
router.get('/addCart', function (req, res) {
  var productId = parseInt(req.param('productId')); // 获取前台传过来的productId值
  var productNum = parseInt(req.param('productNum')); // 获取前台传过来的productId值
  // var username = '123456@qq.com';
  if(pool) {
    var sql = `select * from goods where productId=${productId}`;
    pool.query(sql,(err, result) => {
        if (err) {
          res.json({
            status:'-1', // 数据库连接错误
            msg:err.message,
            result:''
          });
        } else {
          let userId = req.cookies.userId;
          let proId = result[0].productId; 
          let proName = result[0].productName;
          let proPrice = result[0].productPrice;
          let checked = '1';
          // let proNum = 1;
          let proImg = result[0].productImg;
          let totalMoney = proPrice*productNum;
          let mSql =`select * from cartlist where productId=${productId}`;
          pool.query(mSql, (err,result) => {
            if (err) {
              res.json({
                status:'-1',
                msg:err.message,
                result:''
              });
            } else{
              if(result.length === 0) {
                let sql = `insert into cartlist(userId,productId,productName,productPrice,checked,productNum,productImg,totalPrice) values('${userId}','${proId}','${proName}','${proPrice}','${checked}','${productNum}','${proImg}','${totalMoney}')`;
                pool.query(sql,(err,result) => {
                  if (err) {
                    res.json({
                    status:'0',
                    msg:err.message,
                    result:''
                  });
                  }else{
                    res.json({
                      status:'1',
                      msg:'添加购物车成功!',
                      result:result
                    });
                  }
                });
              } else{
                let proNum = result[0].productNum + productNum;
                let proPrice = result[0].productPrice;
                let cId = result[0].cartId;
                let totalMoney = proNum*proPrice;
                let sql = `update cartlist set productNum=${proNum},totalPrice=${totalMoney} where cartId=${cId}`;
                pool.query(sql, (err,result) => {
                  if(err) {
                    res.json({
                      status:'0',
                      msg:err.message,
                      result:''
                    });
                  } else{
                    res.json({
                      status:'1',
                      msg:'添加购物车成功!',
                      result:''
                    });
                  }
                });
              }
            }
          });
        }
    });
  }
});

//立即购买
router.post('/buynow',(req,res)=>{
  var productId = req.body.params.productId; // 获取前台传过来的productId值
  if(pool){
    var sql = `select * from goods where productId=${productId}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1', // 数据库连接错误
          msg: err.message,
          result: ''
        });
      } else {
        result = {
          productName: result[0].productName,
          productPrice: result[0].productPrice,
          productNum: result[0].productNum,
          productImg: result[0].productImg,
          userId:req.cookies.userId
        }
        res.json(result)
      }
    })
  }
  
})

//查看商品详情
router.get('/getDetails', (req,res,next) => {
  let productId = parseInt(req.param('productId')); // 获取前台传过来的productId值
  let sql = `select * from goods where productId=${productId}`;
  pool.query(sql, (err, result1) => {
    if(err) {
      res.json({
        status:'0',
        msg:err.message
      });
    } else {
      const sql2 = `select * from goodsimages where productId = ${productId}` // 搜出详情页小图
      pool.query(sql2, (err, result2) => {
        if (err) {
          res.json({
            status: '0',
            msg: err.message
          });
        } else {
          res.json({
            status: '1',
            msg: '',
            result: {
              goodsList:result1,
              goodsimages:result2
            }
          });
        }
      });
      // res.json({
      //   status:'1',
      //   msg:'',
      //   result1:result1
      // });
    }
  });
})

// 留言
router.post('/leaveMsg' ,(req,res) => {
  console.log("前台传过来的留言参数:")
  console.log(req.body)
  res.json({
    msg:'感谢您的留言！'
  })
})
module.exports = router;