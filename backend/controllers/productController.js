const { ProductModel } = require("../models/product");
const { StoreModel } = require("../models/store");

const addProduct = async (req, res) => {
    try{
        const { storeId } = req.params;
        const { itemName, price, mrp, unit, stock, category } = req.body;

        if(!itemName || !price || !mrp || !unit || stock === undefined || !category) {
            return res.status(400).json({
                message: "itemName, price, mrp, unit, stock, and category are required to add a product."
            });
        }

        const store = await StoreModel.findById(storeId);
        if(!store) return res.status(404).json({message : "Store not found! "});

        console.log("Database Store Owner ID:", store.ownerId.toString());
        console.log("Thunder Client Token ID:", req.user.id);
        
        if (store.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized: You do not own this store." });
        }

        const product = await ProductModel.create({
            storeId,
            itemName,
            price,
            mrp,
            unit,
            stock,
            category
        });

        res.status(201).json(product);
    }catch(error){
        res.status(500).json({ message : error.message });
    }
};

const getProductsByStore = async (req,res) => {
    try{
        const { storeId } = req.params;
        const { category, search } = req.query;

        let query = { storeId, isAvailable : true};

        if(category) query.category = category;

        if(search){
            query.itemName = { $regex : search, $options : "i"};
        }

        const products = await ProductModel.find(query);

        res.json(products);
    }catch(error){
        res.status(500).json({message : error.message});
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const store = await StoreModel.findById(product.storeId);
        if (store.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized: You do not own this store." });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { returnDocument: "after", runValidators: true } 
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleProductAvailability = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const store = await StoreModel.findById(product.storeId);
        if (store.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized: You do not own this store." });
        }

        const currentStatus = product.isAvailable === undefined ? true : product.isAvailable;
        const newStatus = !currentStatus;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { $set: { isAvailable: newStatus } },
            { returnDocument: "after" }
        );

        res.json({ 
            message: `Product is now ${newStatus ? 'Available' : 'Unavailable'}`, 
            product: updatedProduct 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req,res) => {
    try{
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const store = await StoreModel.findById(product.storeId);
        if (store.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized: You do not own this store." });
        }

        await ProductModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

module.exports = {addProduct, 
    getProductsByStore, 
    updateProduct, 
    toggleProductAvailability, 
    deleteProduct};
