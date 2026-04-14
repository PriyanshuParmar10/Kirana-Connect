const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true, 
        trim: true   
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse : true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Customer", "StoreOwner", "DeliveryPartner","admin"],
        required: true
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    profileImage: { type: String },
  isActive: { type: Boolean, default: true },
    favStores: [{
        type: Schema.Types.ObjectId,
        ref: "Stores" 
    }],
    
}, { 
    timestamps: true 
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = { UserModel };