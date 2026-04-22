import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CartPage() {
    const[cart, setCart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    },[]);

    const fetchCart = async () => {
        try{
            const res = await api.get("/cart");
            setCart(res.data);
        }catch(error){
            console.error("Error Fetching cart "+ error);
        }
    };

    const updateQty = async (productId, currentQty, change) => {
        const newQty = currentQty + change;
        if(newQty < 1) return removeItems(productId);

        try{
            await api.put(`/cart/item/${productId}`, {quantity : newQty});
            fetchCart();
        }catch(error){
            alert("failed to update");
        }
    };

    const removeItems = async (productId) => {
        try{
            await api.delete(`/cart/item/${productId}`);
            fetchCart();
        }catch(error){
            alert("Failed to remove");
        }
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return <h2 style={{ padding: '20px' }}>Your cart is empty!</h2>;
    }

    return(
        <div style={{padding : "20px"}}>
            <h2>Your cart</h2>
            <div style={{display : "flex", flexDirection : "column", gap : "15px",}}>
                {cart.items.map(item => (
                    <div key={item.productId._id} style={{border: "1px solid gray", padding: "15px", borderRadius: "8px"}}> 
                        <h4>{item.productId.itemName}</h4>
                        <p>₹{item.priceSnapshot} x {item.quantity}</p>

                        <button onClick={() => updateQty(item.productId._id, item.quantity, -1)}>-</button>
                        <span style={{margin : "0 15px", fontWeight : "bold"}}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId._id, item.quantity, +1)}>+</button>

                        <button onClick={() => removeItems(item.productId._id)}
                            style={{marginLeft: "20px", color: "red", cursor: "pointer"}}
                            >
                                Remove
                            </button>
                    </div>
                ))}
            </div>
            <h3 style={{marginTop : "20px"}}>Total: ₹{cart.totalAmount}</h3>
            <button onClick={()=> navigate("/checkout")}
                style={{padding : "10px 20px", fontSize : "16px", cursor : "pointer"}}
                >
                    proceed to checkout
                </button>
        </div>
    );
}