const express = require('express')
const router = express.Router()
const Good = require('./../models/good')
const User = require('./../models/user')

// 查询商品列表
router.get('/list', (req, res) => {
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let sort = req.query.sort
  let priceLevel = req.query.priceLevel
  let skip = (page - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}

  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  console.log(`page:${page}, pageSize:${pageSize}, sort:${sort}, priceLevel:${priceLevel}`)

  Good.find(params).skip(skip).limit(pageSize).sort({
    'salePrice': sort
  }).exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        message: err.message
      })
    } else {
      res.json({
        status: '0',
        message: 'success',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart', (req, res) => {
  let userId = req.cookies.userId
  let productId = req.body.productId

  if (userId){
    User.findOne({
      userId: userId
    }, (userErr, userDoc) => {
      if (userErr) {
        res.json({
          status: '1',
          message: userErr.message
        })
      } else {
        if (userDoc) {
          let goodItem = ''
          userDoc.cartList.forEach((item) => {
            if (item.productId == productId) {
              goodItem = item
              item.productNum++
            }
          })
          if (goodItem) {
            userDoc.save((err, doc) => {
              if (err) {
                res.json({
                  status: '1',
                  message: err.message
                })
              } else {
                res.json({
                  status: '0',
                  message: '',
                  result: 'suc'
                })
              }
            })
          } else {
            Good.findOne({
              productId: productId
            }, (goodErr, goodDoc) => {
              if (goodErr) {
                res.json({
                  status: '1',
                  message: goodErr.message
                })
              } else {
                if (goodDoc) {
                  goodDoc.productNum = 1
                  goodDoc.checked = 1
                  userDoc.cartList.push(goodDoc)
                  userDoc.save((err, doc) => {
                    if (err) {
                      res.json({
                        status: '1',
                        message: err.message
                      })
                    } else {
                      res.json({
                        status: '0',
                        message: '',
                        result: 'suc'
                      })
                    }
                  })
                }
              }
            })
          }
        }
      }
    })
  }else{
    res.json({
      status: '1',
      message: '未登录'
    })
  }
})

module.exports = router