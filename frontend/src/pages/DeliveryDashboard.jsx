import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DeliveryDashboard() {
    const [driverProfile, setDriverProfile] = useState(null);
    const [availableOrders, setAvailableOrders] = useState([]);
    
    const [activeOrder, setActiveOrder] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
            
                const profileRes = await api.get("/delivery/my-profile");
                setDriverProfile(profileRes.data.profile || profileRes.data);

                const activeRes = await api.get('/orders/delivery/active');
                if (activeRes.data && activeRes.data._id) {
                    setActiveOrder(activeRes.data);
                }
            } catch (error) {
                if (error.response?.status === 404) navigate('/delivery/setup');
            }
        };
        fetchInitialData();
    }, [navigate]);

    const fetchAvailableOrders = useCallback(async () => {
        if (!driverProfile || !driverProfile.isAvailable || activeOrder) return;

        try {
            const res = await api.get('/orders/delivery/available');
            setAvailableOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch radar", error);
        }
    }, [driverProfile, activeOrder]);

    useEffect(() => {
        fetchAvailableOrders(); 
        const interval = setInterval(fetchAvailableOrders, 10000);
        return () => clearInterval(interval);
    }, [fetchAvailableOrders]);

    const acceptOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/accept`);
            alert("Order Accepted! Radar switching to Mission Mode.");

            const activeRes = await api.get('/orders/delivery/active');
            setActiveOrder(activeRes.data); 
        } catch (error) {
            alert("Failed to accept order.");
        }
    };

    const handleCompleteDelivery = async () => {
        try {
            await api.put(`/orders/${activeOrder._id}/complete`);
            alert("Delivery Complete! You got paid. Searching for next order...");
        
            setActiveOrder(null); 
            fetchAvailableOrders();
        } catch (error) {
            alert("Failed to complete delivery.");
        }
    };

    const toggleOnlineStatus = async () => {
        try {
            const res = await api.put('/delivery/toggle-status');
            setDriverProfile(prev => ({ ...prev, isAvailable: res.data.isAvailable }));
        } catch (error) {
            alert("Failed to change status");
        }
    };

    if (!driverProfile) return <h2 style={{ padding: '20px' }}>Calibrating GPS...</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{activeOrder ? "Active Mission 📍" : "Delivery Radar 📡"}</h2>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ backgroundColor: 'black', color: 'orange', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                        {driverProfile.vehicleNumber}
                    </span>
                    
                    {/* THE NEW TOGGLE BUTTON */}
                    <button 
                        onClick={toggleOnlineStatus}
                        style={{ 
                            padding: '8px 15px', 
                            borderRadius: '20px', 
                            fontWeight: 'bold', 
                            border: 'none', 
                            cursor: 'pointer',
                            backgroundColor: driverProfile.isAvailable ? '#fecaca' : '#bbf7d0', // Red if online (to go offline), Green if offline
                            color: driverProfile.isAvailable ? '#991b1b' : '#166534'
                        }}
                    >
                        {driverProfile.isAvailable ? "Go Offline" : "Go Online"}
                    </button>
                </div>
            </div>

            {/* THE OFFLINE SCREEN */}
            {!driverProfile.isAvailable ? (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    <h2 style={{ color: 'gray' }}>💤 You are Offline</h2>
                    <p style={{ color: 'gray' }}>You won't receive new orders. Take a break!</p>
                </div>
            ) : activeOrder ? (
                <div style={{ border: '3px solid green', padding: '20px', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                    <h3 style={{ color: 'green', marginTop: 0 }}>🚚 OUT FOR DELIVERY</h3>
                    <p style={{ color: 'gray', marginBottom: '20px' }}>Order #{activeOrder._id}</p>

                    <div style={{ borderLeft: '4px solid orange', paddingLeft: '15px', marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 5px', fontSize: '12px', fontWeight: 'bold', color: 'gray' }}>1. PICKUP AT STORE</p>
                        <h4 style={{ margin: '0 0 5px' }}>{activeOrder.storeId?.storeName}</h4>
                        <p style={{ margin: 0 }}>{activeOrder.storeId?.address}, {activeOrder.storeId?.city}</p>
                    </div>

                    <div style={{ borderLeft: '4px solid blue', paddingLeft: '15px', marginBottom: '30px' }}>
                        <p style={{ margin: '0 0 5px', fontSize: '12px', fontWeight: 'bold', color: 'gray' }}>2. DROPOFF TO CUSTOMER</p>
                        
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{activeOrder.deliveryAddress}</p>
                    </div>

                    <button 
                        onClick={handleCompleteDelivery}
                        style={{ width: '100%', padding: '15px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
                    >
                        ✅ Mark as Delivered
                    </button>
                </div>
            ) : (
                /* ========================================= */
                /* VIEW B: THE RADAR SCREEN */
                /* ========================================= */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {availableOrders.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed gray', borderRadius: '8px' }}>
                            <h3>No orders available right now.</h3>
                            <p style={{ color: 'gray' }}>Waiting for a store to mark an order as "Ready"...</p>
                        </div>
                    ) : null}

                    {availableOrders.map(order => (
                        <div key={order._id} style={{ border: '2px solid orange', padding: '15px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: 0 }}>₹{order.totalAmount}</h3>
                                <span style={{ color: 'green', fontWeight: 'bold' }}>READY FOR PICKUP</span>
                            </div>
                            
                            {/* PICKUP LOCATION */}
                            <p style={{ margin: '15px 0 2px', fontSize: '12px', color: 'gray', fontWeight: 'bold' }}>📍 PICKUP</p>
                            <p style={{ margin: '0 0 10px' }}>{order.storeId?.storeName} ({order.storeId?.address})</p>
                            
                            {/* DROPOFF LOCATION (NEW!) */}
                            <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'gray', fontWeight: 'bold' }}>🏁 DROPOFF</p>
                            <p style={{ margin: '0 0 15px' }}>{order.deliveryAddress}</p>
                            
                            <button 
                                onClick={() => acceptOrder(order._id)}
                                style={{ width: '100%', padding: '12px', backgroundColor: 'orange', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
                            >
                                Accept Delivery
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}