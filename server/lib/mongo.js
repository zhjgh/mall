const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mall')

mongoose.connection.on('connected', () => {
  console.log('MongoDB conected success')
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected')
})

module.exports = mongoose