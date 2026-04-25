const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getShopOrders,
    getAvailableOrdersForDelivery,
    acceptOrder,
    getActiveDelivery,
    completeDelivery
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
router.put("/:id/accept", authorize("DeliveryPartner"), acceptOrder);
router.get("/delivery/active", authorize("DeliveryPartner"), getActiveDelivery);
router.put("/:id/complete", authorize("DeliveryPartner"), completeDelivery);

// shared routes
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

module.exports = router;