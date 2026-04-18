const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware"); 

router.use(protect);
router.use(authorize("Customer"));

// basic cart routes
router.get("/", getCart);
router.delete("/clear", clearCart);

// action cart routes
router.post("/store/:storeId/add", addToCart);
router.put("/item/:productId", updateCartItem);
router.delete("/item/:productId", removeFromCart);

module.exports = router;