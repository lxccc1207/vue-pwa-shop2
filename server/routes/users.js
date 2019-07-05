var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('../util/util');
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// var md5=require('md5');  
var $conf = require('../conf/conf');
// 使用连接池
var pool = mysql.createPool($conf.mysql);
router.use(express.static('public'));
router.get('/', function (req, res, next) {
  if(pool) {
      res.json({
        status:'0000',
        msg:'succees'
      });
    } else {
      res.json({
        status:'-1',
        msg:'error!'
      });
    }
});
// 注册接口
router.post('/register', (req, res, next) => {
  var userName = req.body.params.userName; // 获取前台传过来的userName值
  var userId = req.body.params.userId; // 获取前台传过来的userId值
  var userPwd = req.body.params.userPwd; // 获取前台传过来的userPwd值
  if(pool) {
    console.log("连接池连接成功")
    console.log("前台传来的数据："+userName+' '+userId+' '+userPwd)
    let sql = `insert into user(id,userId,userName,userPwd) values(0,?,?,?)`;
    var addSqlParams = [userId,userName,userPwd];
    pool.query(sql, addSqlParams,(err, result) => {
      console.log("插入结果："+result)
      if(err) {
        res.json({
          status:'0',
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
  }else {
      res.json({
        status:'-1',
        msg:'error!'
      });
    }
});
// 该账号是否存在
router.get('/userExist', (req, res, next) => {
  var userName = req.param('userName'); // 获取前台传过来的userId值
  if(pool) {
    let sql = `select id from user where userName=${userName}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'0',
          msg:err.message
        });
      } else if(result.length) {
        res.json({
          status:'1',
          msg:'',
          result:''
        });
      } else {
        res.json({
          status:'2',
          msg:''
        });
      }
    });
  }else {
      res.json({
        status:'-1',
        msg:'error!'
      });
    }
});
// 登录接口
router.get('/login', (req, res, next) => {
  var userName = req.param('userName'); // 获取前台传过来的userName值
  //var userPw = trim(md5(req.param('userPwd'))); // 获取前台传过来的密码
  var userPwc = req.param('userPw'); // 获取前台传过来的密码
  if(pool) {
    console.log("成功拿到前台数据"+userName+userPwc)
    let sql = `select * from user where userName = ?`
    pool.query(sql,[userName],(err, result) => {
      console.log("查询结果：" + JSON.stringify(result))//一定要转化成字符串，否则查到只显示[Object][Object]
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      } else {
        if(result.length === 0) {
          res.json({
          status:'404',// 用户不存在
          msg:'user not exist'
        });
        } else {
          let checkPw = result[0].userPwd;
          let myName = result[0].userName;
          let myId = result[0].userId;
          console.log("result[0]" + result[0])
          console.log("checkPw"+checkPw)
          console.log("myName" +myName)
          console.log("myId" +myId)
          if(userPwc != checkPw) {
            res.json({
              status:'-2',//密码错误
              msg:'password error'
            });
          } else {
            res.cookie('userId', myId, {
              path:'/',
              maxAge:1000*60*60 // 设置cookie时间
            });
            res.cookie('userName', myName, {
              path:'/',
              maxAge:1000*60*60 // 设置cookie时间
            });
            // req.session.user = result; // 设置session
            res.json({
              status:'1',
              msg:'登录成功!',
              result:result
            });
          }
        }
      }
    });
    } else {
      res.json({
        status:'-1',
        msg:'error!'
      });
    }
});
//登出接口
router.get('/logout', function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"1",
    msg:'',
    result:''
  })
});

//检查是否登录
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
      res.json({
        status:'1',
        msg:'',
        result:req.cookies.userName || ''
      });
  }else{
    res.json({
      status:'0',
      msg:'未登录',
      result:''
    });
  }
});

// 购物车数据
router.get("/getCartData", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let sql = `select * from cartlist where userId=${userId} order by cartId desc`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      }else {
        res.json({
          status:'1',
          msg:'获取数据成功',
          result:result
        });
      }
    });

  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

//删除购物车商品
router.get("/delProduct", (req, res, next) => {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
    let sql = `delete from cartlist where productId=${proId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      }else {
        res.json({
          status:'1',
          msg:'删除成功'
        });
      }
    });
  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

// 修改商品数量
router.get("/editProductNum", (req, res, next) => {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    let proId = req.param('productId'); // 获取前台传过来的要删除的productId值
    let proNum = req.param('productNum'); // 获取前台传过来的要删除的productNum值
    let checked = req.param('checked'); // 获取前台传过来的要删除的checked值
    let sql = `update cartlist set productNum=${proNum},checked=${checked} where productId=${proId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      } else {
        res.json({
          status:'1',
          msg:'更新成功',
          result:result
        });
      }
    });
  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

//全选购物车商品
router.get("/editSelectAll", (req, res, next) => {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    let checked = req.param('checked'); // 获取前台传过来的checked值
    let sql = `update cartlist set checked=${checked} where userId=${userId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      } else {
        res.json({
          status:'1',
          msg:'更新成功',
          result:result
        });
      }
    });
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

//获取用户地址信息
router.get("/addressList", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let sql = `select * from addresslist where userId=${userId} order by addressId desc`;
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
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
})

//设置默认地址
router.get("/setDefauleAdr", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let defaultFlag = '1';
    let allFlag = '0';
    let addressId = req.param('addressId'); // 获取前台传过来addressId值
    let sql1 = `update addresslist set isDefault=${allFlag} where userId=${userId}`;
    let sql = `update addresslist set isDefault=${defaultFlag} where userId=${userId} and addressId=${addressId}`;
    pool.query(sql1, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message,
          data:'未设默认地址出错'
        });
      } else {
      pool.query(sql, (err, result) => {
        if(err) {
          res.json({
            status:'-1',
            msg:err.message,
            data: '设默认地址出错,前台addressId没传过来'
          });
        } else {
        res.json({
          status:'1',
          msg:'',
          result:''
        });
        }
      });
    }
    });
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

// 删除地址
router.get("/delAdr", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let addressId = req.param('addressId'); // 获取前台传过来的要删除的addressId值
    let sql = `delete from addresslist where userId=${userId} and addressId=${addressId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      } else {
        res.json({
          status:'1',
          msg:'删除成功',
          result:''
        });
      }
    });
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

//增加新地址
router.get("/insertAdr", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let userName = req.param('userName'); // 获取前台传值
    let streetName = req.param('streetName'); // 获取前台传值
    let tel = req.param('tel'); // 获取前台值
    let postCode = req.param('postCode'); // 获取前台传值
    let defaultFlag = '0';
    let sql = `insert into addresslist(userId,userName,streetName,postCode,tel,isDefault) values('${userId}','${userName}','${streetName}','${postCode}','${tel}','${defaultFlag}')`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      } else {
        res.json({
          status:'1',
          msg:'添加成功',
          result:''
        });
      }
    });
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

// 生成订单
router.get("/payOrder", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    var itemPrice = req.param('itemPrice'); // 获取前台传值
    var totalPrice = req.param('totalPrice'); // 获取前台传值
    var discount = req.param('discount'); // 获取前台传值
    var shipPrice = req.param('shipPrice'); // 获取前台传值
    var freightRisk = req.param('freightRisk'); // 获取前台传值
    var buylist = req.param('buylist'); // 数组里套对象,是个字符串
    var defaultVal = '1';
    let adrsql = 'select * from addresslist where userId=? and isDefault=?'
    var goodsList = [];
    var addrContent = '';
    if(buylist==undefined||buylist.length==0){
    var checked = '1'
    var sql = 'select * from cartlist where userId=? and checked=?'
      pool.query(sql, [userId, checked], (err, result) => {
        if (err) {
          res.json({
            status: '-1',
            msg: err.message
          });
        } else {
          goodsList = result;//查carlist出来的结果
          console.log("查carlist出来的结果" + JSON.stringify(goodsList))//成功
          //查地址
          pool.query(adrsql, [userId, defaultVal], (err, result) => {
            if (err) {
              res.json({
                status: '-1',
                msg: err.message
              });
            } else {
              addrContent = result;//查addresslist出来的结果
              console.log("查addresslist出来的结果：" + JSON.stringify(addrContent))//设为默认地址的时候成功

              //生成订单号
              var platform = '622';
              var r1 = Math.floor(Math.random() * 10);
              var r2 = Math.floor(Math.random() * 10);
              var sysDate = new Date().Format('yyyyMMddhhmmss');
              var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
              var orderIdVal = platform + r1 + sysDate + r2;
              var ifPay = 1;
              let { userName, streetName, postCode, tel } = addrContent[0];
              var ire = goodsList.map((item) => {
                let { userId, productId, productName, productPrice, productNum, productImg, totalPrice } = item;
                return { orderIdVal, userId, productId, productName, productPrice, productNum, productImg, userName, streetName, postCode, tel, totalPrice, itemPrice, discount, shipPrice, freightRisk, createDate, ifPay };
              });
              var values = [];
              ire.forEach((n, i) => {
                var _arr = [];
                for (var m in n) {
                  _arr.push(n[m]);
                }
                values.push(_arr);
              });
              // res.json({
              //   data:values
              // });
              let inSql = "insert into orderlist(orderId,userId,productId,productName,productPrice,productNum,productImg,postName,streetName,postCode,tel,totalPrice,itemPrice,discount,shipPrice,freightRisk,createDate,ifPay) values?";
              let delSql = `delete from cartlist where checked=${checked}`;
              pool.query(inSql, [values], (err, result) => {
                if (err) {
                  res.json({
                    status: '-1',
                    msg: err.message
                  });
                } else {
                  pool.query(delSql, (err, result) => {
                    if (err) {
                      res.json({
                        status: '-1',
                        msg: err.message
                      });
                    } else {
                      res.json({
                        status: '1',
                        msg: 'suc',
                        result: orderIdVal
                      });
                    }
                  });
                }
              });
            }
          })
        }
      });
     }else{      
          //查地址
          pool.query(adrsql, [userId, defaultVal], (err, result) => {
            if (err) {
              res.json({
                status: '-1',
                msg: err.message
              });
            } else {
              console.log("执行了buylist")
              addrContent = result;//查addresslist出来的结果
              console.log("查addresslist出来的结果：" + JSON.stringify(addrContent))//设为默认地址的时候成功

              //生成订单号
              var platform = '622';
              var r1 = Math.floor(Math.random() * 10);
              var r2 = Math.floor(Math.random() * 10);
              var sysDate = new Date().Format('yyyyMMddhhmmss');
              var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
              var orderIdVal = platform + r1 + sysDate + r2;
              var ifPay = 1;              
              var changebuylist =JSON.parse(buylist[0]) //得到的是字符串要转化成json对象     
              let { userName, streetName, postCode, tel } = addrContent[0];
              var ire ={ 
                  orderIdVal, 
                  userId,
                  productId: changebuylist.productId, 
                  productName: changebuylist.productName, 
                  productPrice: changebuylist.productPrice, 
                  productNum: changebuylist.productNum, 
                  productImg: changebuylist.productImg, 
                  userName, streetName, postCode, tel, totalPrice, itemPrice, discount, shipPrice, freightRisk, createDate, ifPay
                 }
              var values = [];
              var _arr = [];
              Object.keys(ire).forEach((key) => {            
                _arr.push(ire[key])            
              });
              values.push(_arr);
              console.log("values")
             console.log(values)
              let inSql = "insert into orderlist(orderId,userId,productId,productName,productPrice,productNum,productImg,postName,streetName,postCode,tel,totalPrice,itemPrice,discount,shipPrice,freightRisk,createDate,ifPay) values?";
              //let delSql = `delete from cartlist where checked=${checked}`;
                        pool.query(inSql, [values], (err, result) => {
                          if (err) {
                            res.json({
                              status: '-1',
                              msg: err.message
                            });
                          }else{
                            res.json({
                              status:'1',
                              msg: 'suc',
                              result: orderIdVal
                            })
                          } 
                        });

             }
           })
    }
      
  } else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

// 获取订单信息
router.get("/getOrderData", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let sql = `select * from orderlist where userId=${userId} order by createDate desc`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      }else {
        res.json({
          status:'1',
          msg:'获取数据成功',
          result:result
        });
      }
    });

  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

// 删除订单
router.get("/delOrder", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    var orderId = req.param('orderId'); // 获取前台传值
    let sql = `delete from orderlist where orderId=${orderId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      }else {
        res.json({
          status:'1',
          msg:'',
          result:''
        });
      }
    });

  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});

//更新订单
router.get("/updateOrder", (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    let orderId = req.param('orderId'); // 获取前台传值
    let ifPay = 1;
    let sql = `update orderlist set ifPay=${ifPay} where orderId=${orderId} and userId=${userId}`;
    pool.query(sql, (err, result) => {
      if(err) {
        res.json({
          status:'-1',
          msg:err.message
        });
      }else {
        res.json({
          status:'1',
          msg:'',
          result:''
        });
      }
    });

  }else {
    res.json({
      status:'0',
      msg:'未登录'
    });
  }
});
module.exports = router;
