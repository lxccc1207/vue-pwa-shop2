var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $conf = require('../conf/conf');
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据
var formidable = require('formidable');
// 使用连接池
var pool = mysql.createPool($conf.mysql);
router.use(express.static('public'));


// 管理员查询商品
router.get('/getList', (req,res) => {
  if (pool) {
    const sql = `select * from goods`
    pool.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: '-1',
          msg: err.message,
        });
      } else {
        res.json({
          status: '1',
          data: {
            list: result
          }
        });
      }
    })
  } else {
    res.json({
      status: '-1',
      msg: 'error!'
    });
  }

})

// 上传图片
router.post("/upLoad", function (req, res, next) {
  var form = new formidable.IncomingForm();
  //设置文件上传存放地址
  form.uploadDir = "./public/images";
  // 设置表单域的编码
  form.encoding = 'utf-8';
  // 设置该属性为true可以使得上传的文件保持原来的文件的扩展名
  form.keepExtensions = true;
  //执行里面的回调函数的时候，表单已经全部接收完毕了。
  form.parse(req, function (err, fields, files) {
    console.log("files:", files)  //这里能获取到图片的信息
    console.log("fields", fields) //这里能获取到传的参数的信息
    var productName = fields.productName
    var productPrice = fields.productPrice
    var limitNum = fields.limitNum
    var desc = fields.desc
    var productImg = files.file.path
    // res.json({
    //   code: 1,
    //   message: 'upload success'
    // })
    // console.log(productImg)
    if (pool) {
      const sql = `insert into goods(productName,productPrice,checked,productNum,productImg,limitNum,desc) values('${productName}','${productPrice}',0,0,'${productImg}','${limitNum}','${desc}')`
      pool.query(sql, (err, result) => {
        if (err) {
          res.json({
            status: '-1',
            msg: err.message,
          });
        } else {
          res.json({
            status: '1',
            result: result,
            msg:'添加商品成功'  
          });
        }
      })
    } else {
      res.json({
        status: '-1',
        msg: 'error!'
      });
    }
  })
})
module.exports = router;