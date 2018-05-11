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
          maxAge: 1000*60*60 // 1小时
        })
        req.session.user = doc
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

router.post('/logout', (req, res) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    message: '',
    result: ''
  })
})

module.exports = router