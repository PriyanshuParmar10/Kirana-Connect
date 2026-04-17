const { StoreModel } = require("../models/store");
const { ProductModel } = require("../models/product");

const createStore = async (req, res) => {
    try{
        const { storeName, description, category, address, city, pincode, location, deliveryRadius } = req.body;
        
        if (!storeName || !category || !address || !city || !pincode || !location) {
            return res.status(400).json({
                message: "storeName, category, address, city, pincode, location are required"
            });
        }
        const geoJsonLocation = {
            type : "Point",
            coordinates: [location.lng, location.lat]
        }

        const store = await StoreModel.create({
            ownerId : req.user.id,
            storeName,
            description,
            category,
            address,
            city,
            pincode,
            location : geoJsonLocation,
            deliveryRadius
        });

        res.status(201).json(store);
    }
    catch(error){
        res.status(500).json({ message : error.message });
    }
};

const getNearbyStores = async (req, res) => {
    try{
        const {lat, lng, radius, category } = req.query;
        const radiusInMeters = radius ? parseInt(radius) * 1000 : 5000;

        if(!lat || !lng){
            return res.status(404).json({ message : "Please give lat and lng"});
        }
        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)] 
                    },
                    $maxDistance: radiusInMeters
                }
            },
            isOpen: true
        };

        if (category) query.category = category;

        const stores = await StoreModel.find(query);
        res.json(stores);
    }catch(error){
        res.status(500).json({ message : error.message });
    }
};

const getStoreById = async (req,res) => {
    try{
        const store = await StoreModel.findById(req.params.id);

        if(!store) return res.status(404).json({ message : "Store not Found! "});

        const products = await ProductModel.find({ storeId : store._id });

        res.json({
            store,
            inventory : products
        });
    }catch(error){
        res.status(500).json({ message : error.message });
    }
};

const toggleStoreOpen = async (req, res) => {
    try{
        const store = await StoreModel.findById(req.params.id);

        if(!store) return res.status(404).json({ message : "Store not found!" });
        
        if (!store.ownerId) {
            return res.status(400).json({ 
                message: "Corrupted data: This store has no ownerId attached. Please create a new store." 
            });
        }

        if (store.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to manage this store" });
        }

        store.isOpen = ! store.isOpen;
        await store.save();

        res.json({ message: `Store is now ${store.isOpen ? 'Open' : 'Closed'}`, store });
    }catch(error){
        res.status(500).json({ message : error.message });
    }
};

module.exports = { createStore, getNearbyStores, getStoreById, toggleStoreOpen };