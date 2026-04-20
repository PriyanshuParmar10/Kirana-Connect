import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ShopPage(){
    const{ storeId } = useParams();
    const[ products, setProducts] = useState([]);

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

    return(
        <div style={{padding : '20px'}}>
            <h2>Product shelf</h2>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {products.map(product => (
                    <div key={product._id} style={{border : "1px solid gray", padding : "15px", borderRadius : "8px"}}>
                        <h4>{product.itemName}</h4>
                        <p>₹{product.price}</p>
                        <button disabled = {!product.isAvailable}>
                            {product.isAvailable ? "Add to cart" : "Out of stock"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}