import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function checkOutPage(){
    const[address, setAddress] = useState("");
    const navigate = useNavigate();

    const handleCheckOut = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post("/orders", {deliveryAddress : address});
            alert("Order placed Successfully");

            navigate(`/tracking/${res.data._id}`);
        }catch(error){
            alert("Checkout failed: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return(
        <div style={{ padding : "20px"}}>
            <h2>CheckOut</h2>
            <form onSubmit={handleCheckOut} 
                style={{display : "flex", flexDirection : "column", maxWidth : "400px", gap : "15px"}}
            >
                <textarea
                    placeholder="Enter full delivery Address.."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows="4"
                    style={{padding : "10px", width : "100%"}}
                />
                <button
                    type="submit"
                    style={{padding : "12px", cursor : "pointer", backgroundColor: "green", color: "white", fontWeight: "bold"}}
                >
                    confirm and place Order
                </button>
            </form>
        </div>
    );
}