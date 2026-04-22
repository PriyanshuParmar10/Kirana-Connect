import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };
        fetchMyOrders();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Order History</h2>
                <button onClick={() => navigate('/')} style={{ padding: '8px', cursor: 'pointer' }}>
                    🏠 Back Home
                </button>
            </div>

            {orders.length === 0 ? (
                <p>You haven't placed any orders yet!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                            <h4>Order from: {order.storeId?.storeName || "Unknown Store"}</h4>
                            <p>Status: <strong>{order.status}</strong></p>
                            <p>Total: ₹{order.totalAmount}</p>
                            <p style={{ fontSize: '12px', color: 'gray' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                       
                            <button 
                                onClick={() => navigate(`/tracking/${order._id}`)}
                                style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}
                            >
                                Track Order 📍
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}