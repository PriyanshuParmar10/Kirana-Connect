const express = require("express");
const router = express.Router();

const { 
    addProduct, 
    getProductsByStore, 
    updateProduct, 
    toggleProductAvailability, 
    deleteProduct 
} = require("../controllers/productController");

const {protect, authorize} = require("../middleware/authMiddleware");

// routes for customer
router.get("/store/:storeId", getProductsByStore);

// routes for storeOwners
router.post("/store/:storeId", protect, authorize("StoreOwner"), addProduct);
router.put("/:id", protect, authorize("StoreOwner"), updateProduct);
router.put("/:id/toggle", protect, authorize("StoreOwner"), toggleProductAvailability);
router.delete("/:id", protect, authorize("StoreOwner"), deleteProduct);

module.exports = router;