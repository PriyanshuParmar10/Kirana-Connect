const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema({

    customerId: { type: schema.Types.ObjectId, ref: "Users", required: true },
    storeId: { type: schema.Types.ObjectId, ref: "Stores", required: true },
    
    deliveryPartnerId: { type: schema.Types.ObjectId, ref: "Users", default: null }, 
    
    items: [{
        itemName: String,
        quantity: Number,
        price: Number
    }],
    
    totalAmount: { type: Number, required: true },
    
    status: {
        type: String,
        enum: ["Pending", "Ready_For_Pickup", "Out_For_Delivery", "Delivered"],
        default: "Pending"
    }
});

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = { OrderModel };