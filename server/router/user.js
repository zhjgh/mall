const express = require('express')
const router = express.Router()
const User = require('./../models/user')

// 登录
router.post('/login', (req, res) => {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params, (err, doc) => {
    if(err){
      res.json({
        status: '1',
        message: err.message
      })
    }else{
      if(doc){
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 // 1小时
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          message: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

// 退出
router.post('/logout', (req, res) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    message: '',
    result: ''
  })
})

// 检查是否登录
router.get('/checkLogin', (req, res) => {
  if(req.cookies.userId){
    res.json({
      status: '0',
      message: '',
      result: req.cookies.userName
    })
  }else{
    res.json({
      status: '1',
      message: '未登录',
      result: ''
    })
  }
})

// 获取购物车数量
router.get('/getCartCount', (req, res) => {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId
    User.findOne({'userId': userId}, (err, doc) => {
      if(err){
        res.json({
          status: '0',
          message: err.message
        })
      }else{
        let cartList = doc.cartList
        let cartCount = 0
        cartList.map((item) => {
          cartCount += parseFloat(item.productNum)
        })
        res.json({
          status: '0',
          message: '',
          result: cartCount
        })
      }
    })
  }else{
    res.json({
      status: '1',
      message: '未登录',
      result: 0
    })
  }
})

// 查询当前用户购物车数据
router.get('/cartList', (req, res) => {
  let userId = req.cookies.userId
  User.findOne({
    userId: userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          message: '',
          result: doc.cartList
        })
      }
    }
  })

})

// 购物车删除
router.post('/cartDel', (req, res) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if(err){
      res.json({
        status: '1',
        message: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        message: '删除成功',
        result: ''
      })
    }
  })

})

// 修改购物车商品数量
router.post('/cartEdit', (req, res) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  User.update({
    'userId': userId,
    'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        message: '更新成功',
        result: ''
      })
    }
  })
})

// 编辑全选
router.post("/editCheckAll", function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({
    userId: userId
  }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1,
              message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  });
});


module.exports = router