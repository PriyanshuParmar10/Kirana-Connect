import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/axios";

export default function ShopPage(){
    const{ storeId } = useParams();
    const[ products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async() => {
            try{
                const res = await api.get(`/products/store/${storeId}`);
                setProducts(res.data);
            }catch(error){
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    },[storeId]);

    const handleAddToCart = async (productId) => {
        try {
            await api.post(`/cart/store/${storeId}/add`, { productId, quantity: 1 });
            alert("Added to cart!");
        } catch(error) {
            alert(error.response?.data?.message || "Failed to add");
        }
    };

    
    return(
        <div style={{padding : '20px'}}>
            <h2>Product shelf</h2>
            <button 
                onClick={() => navigate('/cart')}
                style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', borderRadius: '5px' }}
            >
                🛒 View Cart
            </button>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {products.map(product => (
                    <div key={product._id} style={{border : "1px solid gray", padding : "15px", borderRadius : "8px"}}>
                        <h4>{product.itemName}</h4>
                        <p>₹{product.price}</p>
                        <button disabled = {!product.isAvailable} onClick={() => handleAddToCart(product._id)}>
                            {product.isAvailable ? "Add to cart" : "Out of stock"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}