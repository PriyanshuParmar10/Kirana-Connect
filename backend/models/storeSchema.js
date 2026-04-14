const mongoose = require("mongoose");
const schema = mongoose.Schema;

const storeSchema = new schema({
    ownerId: { type: schema.Types.ObjectId, ref: "Users", required: true },
    
    storeName: { type: String, required: true },
    isOpen: { type: Boolean, default: false },
    
    inventory: [{
        itemName: String,
        price: Number,
        inStock: { type: Boolean, default: true }
    }]
});

const StoreModel = mongoose.model("Stores", storeSchema);

module.exports = { StoreModel };