const db = require('./../lib/mongo')

const GoodSchema = new db.Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String,
  productUrl: String,
  productNum: Number,
  checked: Number
})

module.exports = db.model('Good', GoodSchema)
