const express = require("express");
const router = express.Router();
const { createProfile, getMyProfile, toggleAvailability } = require("../controllers/deliveryController");
const { protect, authorize } = require("../middleware/authMiddleware");


// Only Delivery Partners can access these
router.put("/toggle-status", protect, authorize("DeliveryPartner"), toggleAvailability);
router.post("/profile", protect, authorize("DeliveryPartner"), createProfile);
router.get("/my-profile", protect, authorize("DeliveryPartner"), getMyProfile);

module.exports = router;