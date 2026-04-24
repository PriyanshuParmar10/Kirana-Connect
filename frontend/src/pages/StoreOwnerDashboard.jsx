import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StoreOwnerDashboard() {
    const[store, setStore] = useState(null);
    const[stats, setStats] = useState({todayOrders : 0, pendingOrders : 0});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try{
                const res = await api.get("/stores/my-store");
                setStore(res.data.store);
                setStats(res.data.stats);
            }catch(error){
                if (error.response?.status === 404) {
                    console.log("No store found! Redirecting to setup...");
                    navigate('/store/setup');
                } else {
                    console.error("Failed to load dashboard data", error);
                }
            }
        }

        fetchDashboardData();
    }, [navigate]);

    const handleToggleOpen = async () => {
        try{
            const res = await api.put(`/stores/${store._id}/toggle`);
            setStore(prevStore => ({
                ...prevStore,
                isOpen: !prevStore.isOpen
            }));
        }catch(error){
            alert("Failed to update store status");
        }
    }

    if (!store) return <h2 style={{ padding: '20px' }}>Loading Command Center...</h2>;

    return(
        <div style={{ padding : "20px", fontFamily : "sans-serif"}}>
            <h1>{store.storeName} DashBoard</h1>

            <div style={{ display : "flex", alignItems : "center", gap : "15px", marginBottom : "20px"}}>
                <span style={{ fontSize : "18px", fontWeight : "bold"}}>Status:</span>
                <button
                    onClick={handleToggleOpen}
                    style={{
                        padding : "10px 20px", cursor : "pointer", fontWeight : "bold", color : "white", border : "none",
                        backgroundColor : store.isOpen ? "green" : "red" 
                    }}
                >
                    {store.isOpen ? '🟢 OPEN (Click to Close)' : '🔴 CLOSED (Click to Open)'}
                </button>
            </div>

            <div style={{display: "flex", gap : "20px", marginButtom : "30px"}}>
                <div style={{padding : "20px", border : "2px solid balck", borderRadius : "8px"}}>
                    <h3>Today's Orders</h3>
                    <h1 style={{ margin : 0, color : "blue"}}>
                        {stats.todayOrders}
                    </h1>
                </div>
            </div>

            <div style={{display : "flex", gap : "15px"}}>
                <button onClick={() => navigate("/store/orders")} style={{ padding : "10px", backgroundColor : "black", color : "white", cursor : "pointer"}}>
                    📋 View Live Orders
                </button>

                <button onClick={() => navigate("/store/products")} style={{ padding : "10px", backgroundColor : "gray",  color  :"white", cursor : "pointer"}}>
                    📦 Manage Products
                </button>
            </div>
        </div>
    );
}