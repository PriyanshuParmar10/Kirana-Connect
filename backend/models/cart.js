const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true 
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Stores",
    required: true
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true
    },
    itemName: { type: String },   
    priceSnapshot: { type: Number }, 
    quantity: { type: Number, default: 1, min: 1 }
  }],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

const CartModel = mongoose.model("Carts", cartSchema);
module.exports = { CartModel };