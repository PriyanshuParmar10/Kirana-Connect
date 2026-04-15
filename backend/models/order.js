const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Stores",
    required: true
  },
  deliveryPartnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Products" },
    itemName: String,      
    price: Number,    
    quantity: Number
  }],

  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },

 
  deliveryAddress: { type: String, required: true },
  deliveryLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },

  status: {
    type: String,
    enum: [
      "Pending",  
      "Confirmed",  
      "Preparing",    
      "Ready_For_Pickup",
      "Out_For_Delivery",
      "Delivered",
      "Cancelled" 
    ],
    default: "Pending"
  },
  cancellationReason: { type: String },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "Pending"
  }
}, { timestamps: true });

const OrderModel = mongoose.model("Orders", orderSchema);
module.exports = { OrderModel };