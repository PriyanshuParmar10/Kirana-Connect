import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function OrderTrackingPage() {
    const{ id } = useParams();
    const[order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderStatus = async() =>{
            try{
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            }catch(error){
                console.error("Error fetching order tracking", error);
            }
        }

        fetchOrderStatus();

        const interval = setInterval(() => {
            console.log("polling order status...");
            fetchOrderStatus();
        },8000);

        return () => clearInterval(interval);
    },[id]);

    if(!order) return <h2 style={{padding : "20px"}}>Locking onto order ...</h2>

    return(
        <div style={{padding : "20px", fontFamily: "sans-serif"}}>
            <h2>Order Radar</h2>
            <p style={{color : "gray"}}>Id : {order._id}</p>

            <div style={{padding: '20px', 
                border: '3px solid black', 
                display: 'inline-block', 
                marginTop: '15px',
                borderRadius: '8px'
            }}>
                <h1 style={{ margin: 0 }}>STATUS: {order.status}</h1>
                </div>

                <p style={{marginTop: '20px', fontSize: '14px', color: 'green' }}>
                    🟢 Auto-refreshing every 8 seconds...
                </p>
        </div>
    );
}