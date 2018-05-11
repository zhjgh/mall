const db = require('./../lib/mongo')

const UserSchema = new db.Schema({
  userId: String,
  userName: String,
  userPwd: String,
  orderList: [
    {
      orderId: String,
      orderTotal: String,
      orderStatus: Number,
      createDate: Date,
      goodsList: [
        {
          productImage: String,
          salePrice: String,
          productName: String,
          productId: String,
          productNum: String
        }
      ]
    }
  ],
  cartList: [
    {
      productImage: String,
      salePrice: String,
      productName: String,
      productId: String,
      productNum: String,
      checked: String
    }
  ],
  addressList: [
    {
      addressId: String,
      userName: String,
      streetName: String,
      postCode: String,
      tel: String,
      isDefault: Boolean
    }
  ]
})

module.exports = db.model('User', UserSchema)