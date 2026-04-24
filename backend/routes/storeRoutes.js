const express = require("express");
const router = express.Router();

const { createStore, getNearbyStores, getStoreById, toggleStoreOpen, getMyStore } = require("../controllers/storeController");
const { protect, authorize } = require("../middleware/authMiddleware");

// route for Customers
router.get("/nearby", getNearbyStores);

// route for storeOwners
router.get("/my-store", protect, authorize("StoreOwner"), getMyStore);
router.get("/:id", getStoreById); //this is route for customer but due to dynamic varibale

router.post("/", protect, authorize("StoreOwner"), createStore);
router.put("/:id/toggle" , protect, authorize("StoreOwner"), toggleStoreOpen);

module.exports = router;