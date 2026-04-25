const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  partnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ["Bike", "Scooter", "Bicycle"],
    required: true
  },
  vehicleNumber: { type: String, required: true },
  drivingLicense: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const DeliveryModel = mongoose.model("DeliveryProfiles", deliverySchema);
module.exports = { DeliveryModel };