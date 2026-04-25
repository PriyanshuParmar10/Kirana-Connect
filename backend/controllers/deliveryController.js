const { DeliveryModel } = require("../models/delivery");

const createProfile = async (req, res) => {
    try {
        const { vehicleType, vehicleNumber, drivingLicense } = req.body;

        const validPartnerId = req.user._id || req.user.id || req.user.userId;

        if (!validPartnerId) {
            return res.status(400).json({ message: "Could not extract User ID from token!" });
        }

        const existing = await DeliveryModel.findOne({ partnerId: validPartnerId });
        if (existing) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const profile = await DeliveryModel.create({
            partnerId: validPartnerId, 
            vehicleType,
            vehicleNumber,
            drivingLicense
        });

        res.status(201).json({ profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const validPartnerId = req.user._id || req.user.id || req.user.userId;

        const profile = await DeliveryModel.findOne({ partnerId: validPartnerId });
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        
        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const validPartnerId = req.user.id;
        const profile = await DeliveryModel.findOne({ partnerId: validPartnerId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.isAvailable = !profile.isAvailable;
        await profile.save();

        res.status(200).json({ 
            isAvailable: profile.isAvailable, 
            message: `You are now ${profile.isAvailable ? 'Online' : 'Offline'}` 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createProfile, getMyProfile, toggleAvailability };