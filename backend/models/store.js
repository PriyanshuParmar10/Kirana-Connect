const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  storeName: { type: String, required: true, trim: true },
  description: { type: String },
  category: {
    type: String,
    enum: ["Grocery", "Dairy", "Pharmacy", "Bakery", "General"],
    required: true
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },

  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number]
  },
  deliveryRadius: { type: Number, default: 5 },
  deliveryFee: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },

  isOpen: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  imageUrl: { type: String },
  openTime: { type: String },
  closeTime: { type: String },


}, { timestamps: true });

storeSchema.index({ location: "2dsphere" });

const StoreModel = mongoose.model("Stores", storeSchema);
module.exports = { StoreModel };