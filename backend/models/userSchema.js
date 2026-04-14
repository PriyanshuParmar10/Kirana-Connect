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
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Customer", "StoreOwner", "DeliveryPartner"],
        required: true
    },
    
    favStores: [{
        type: Schema.Types.ObjectId,
        ref: "Stores" 
    }],
    
    cart: [{
        storeId: { 
            type: Schema.Types.ObjectId, 
            ref: "Stores" 
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }]
}, { 
    timestamps: true 
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };