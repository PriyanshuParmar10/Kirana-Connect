const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Stores",
    required: true
  },

  itemName: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number },   

  unit: {
    type: String,
    enum: ["kg", "litre", "piece", "dozen", "pack"],
    default: "piece"
  },

  stock: { type: Number, default: 0 },
  category: { type: String },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true },
  brand: { type: String }
  
}, { timestamps: true });

const ProductModel = mongoose.model("Products", productSchema);
module.exports = { ProductModel };