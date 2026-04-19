const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getShopOrders,
    getAvailableOrdersForDelivery
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// routes for customer
router.post("/", authorize("Customer"), placeOrder);
router.get("/my-orders", authorize("Customer"), getMyOrders);

// routes for store owner
router.get("/store/:storeId", authorize("StoreOwner"), getShopOrders);

// routes for delivery
router.get("/delivery/available", authorize("DeliveryPartner"), getAvailableOrdersForDelivery);

// shared routes
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

module.exports = router;