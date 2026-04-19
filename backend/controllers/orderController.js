const { OrderModel } = require("../models/order");
const { CartModel } = require("../models/cart");
const { StoreModel } = require("../models/store");

const placeOrder = async (req, res) => {
    try{
        const {deliveryAddress } = req.body;
        const customerId = req.user.id;

        if(!deliveryAddress){
            return res.status(400).json({ message : "Delivery address is required."});
        }
        
        const cart = await CartModel.findOne({ customerId});
        if(!cart || cart.items.length === 0){
            return res.status(400).json({ message: "Your cart is empty." });
        }

        const order = await OrderModel.create({
            customerId,
            storeId : cart.storeId,
            items : cart.items,
            totalAmount : cart.totalAmount,
            deliveryAddress,
            status : "PLACED"
        });

        await CartModel.findOneAndDelete({ customerId});

        res.status(201).json(order);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const getMyOrders = async (req, res) => {
    try{
        const orders = await OrderModel.find({ customerId : req.user.id})
            .populate("storeId", "storeName location")
            .sort({ createdAt : -1});

        res.json(orders); 
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const getOrderById = async (req, res) => {
    try{
        const order = await OrderModel.findById(req.params.id)
            .populate("storeId", "storeName")
            .populate("customerId", "name email phone");

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (req.user.role === "Customer" && order.customerId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: You cannot view this order." });
        }

        if (req.user.role === "StoreOwner") {
            const store = await StoreModel.findById(order.storeId);
            if (!store) return res.status(404).json({ message: "Store not found" });

            if (store.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized: Order belongs to a different store." });
            }
        }

        res.json(order);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const updateOrderStatus = async (req, res) => {
    try{
        const { status } = req.body;
        const order = await OrderModel.findById(req.params.id);

        if(!order) return res.status(404).json({ message: "Order not found" });

        const role = req.user.role;
        const currentStatus = order.status;

        if (role === "Customer") {
            if (order.customerId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
            if (status !== "CANCELLED") return res.status(400).json({ message: "Customers can only cancel orders." });
            if (currentStatus !== "PLACED") return res.status(400).json({ message: "Order has already been processed and cannot be cancelled." });
        }
        else if (role === "StoreOwner") {
            const store = await StoreModel.findById(order.storeId);
            if (store.ownerId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

            const validTransitions = {
                "PLACED": ["CONFIRMED", "CANCELLED"],
                "CONFIRMED": ["PREPARING"],
                "PREPARING": ["READY"]
            };

            if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
                return res.status(400).json({ message: `Invalid transition from ${currentStatus} to ${status}` });
            }
        }
        else if (role === "DeliveryPartner") {

            const validTransitions = {
                "READY": ["PICKED_UP"],
                "PICKED_UP": ["DELIVERED"]
            };

            if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
                return res.status(400).json({ message: `Invalid transition from ${currentStatus} to ${status}` });
            }
            
            if (status === "PICKED_UP") {
                order.deliveryPartnerId = req.user.id;
            }
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            req.params.id,
            { $set: { status, deliveryPartnerId: order.deliveryPartnerId } },
            { returnDocument: "after" }
        );

        res.json({ message: `Order status successfully updated to ${status}`, order: updatedOrder });
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const getShopOrders = async (req, res) => {
    try{
        const { storeId } = req.params;
        const { status } = req.query;

        const store = await StoreModel.findById(storeId);
        if(!store) return res.status(404).json({ message : "store not found"});

        if(store.ownerId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const query = { storeId };
        if (status) query.status = status;

        const orders = await OrderModel.find(query).sort({ createdAt: -1 });
        res.json(orders);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const getAvailableOrdersForDelivery = async (req, res) => {
    try{
        const orders = await OrderModel.find({ status: "READY" })
            .populate("storeId", "storeName location address")
            .sort({ updatedAt: 1 });

        res.json(orders);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getShopOrders,
    getAvailableOrdersForDelivery
};