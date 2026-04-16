const express = require("express");
const router = express.Router();

const { createStore, getNearbyStores, getStoreById, toggleStoreOpen } = require("../controllers/storeController");
const { protect, authorize } = require("../middleware/authMiddleware");

// route for Customers
router.get("/nearby", getNearbyStores);
router.get("/:id", getStoreById);

// route for storeOwners
router.post("/", protect, authorize("StoreOwner"), createStore);
router.put("/:id/toggle" , protect, authorize("StoreOwner"), toggleStoreOpen);

module.exports = router;