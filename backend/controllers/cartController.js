const { CartModel } = require("../models/cart");
const { ProductModel } = require("../models/product");

const addToCart = async (req, res) => {
    try{
        const { storeId } = req.params;
        const { productId, quantity } = req.body;
        const customerId = req.user.id;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "productId and quantity (min 1) are required"
            });
        }
        
        const product = await ProductModel.findById(productId);

        if(!product || !product.isAvailable){
            return res.status(404).json({ message : "Prdouct not found or currently not available "});
        }

        if (product.storeId.toString() !== storeId) {
            return res.status(400).json({ message: "This product does not belong to the selected store." });
        }

        let cart = await CartModel.findOne({ customerId });

        if(!cart){
            cart = new CartModel({
                customerId,
                storeId,
                items : [],
                totalAmount : 0
            });
        }
        else if(cart.storeId.toString() !== storeId){
            cart.items = [];
            cart.storeId = storeId;
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
        }
        else{
            cart.items.push({
                productId,
                itemName: product.itemName,
                priceSnapshot: product.price,
                quantity
            });
        }

        cart.totalAmount = cart.items.reduce((total, item) =>{
            return total + (item.priceSnapshot * item.quantity);
        },0);

        await cart.save();

        res.status(200).json(cart);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const getCart = async (req, res) => {
    try{
        const cart = await CartModel.findOne({ customerId : req.user.id})
            .populate("items.productId", "itemName price imageUrl isAvailable")
            .populate("storeId", "storeName location");

        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        res.json(cart);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const updateCartItem = async (req, res) => {
    try{
        const { productId } = req.params;
        const { quantity } = req.body;
        const customerId = req.user.id;

        const cart = await CartModel.findOne({ customerId });
        if(!cart) return res.status(404).json({ message : "cart not found" });

        if(quantity <= 0){
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }
        else{
            const item = cart.items.find(item => item.productId.toString() === productId);
            if (!item) return res.status(404).json({ message: "Item not in cart" });
            item.quantity = quantity;
        }

        cart.totalAmount = cart.items.reduce((total, item) => total + (item.priceSnapshot * item.quantity), 0);
        await cart.save();

        res.json(cart);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const removeFromCart = async (req, res) => {
    try{
        const { productId } = req.params;
        const customerId = req.user.id;

        const cart = await CartModel.findOne({customerId});
        if(!cart) return res.status(400).json({ message : "cart not found"});

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        cart.totalAmount = cart.items.reduce((total, item) => total + (item.priceSnapshot * item.quantity), 0);
        await cart.save();

        res.json(cart);
    }catch(error){
        res.status(500).json({ message : error.message});
    }
};

const clearCart = async (req, res) => {
    try{
        await CartModel.findOneAndDelete({ customerId : req.user.id});
        res.json({ message : "cart cleared successfully"});
    }catch(error){
        res.status(500).json({ message : error.message});
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
};