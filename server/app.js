const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

//配置bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//cookie, session处理
app.use(cookieParser('sessiontest'))
app.use(session({
  secret: 'sessiontest', //与cookieParser中的一致
  resave: true,
  saveUninitialized: true
}))

//路由配置
app.use('/good', require('./router/good'))
app.use('/user', require('./router/user'))

const server = app.listen(3000, () => {
  console.log('app listening at http:localhost:3000')
})