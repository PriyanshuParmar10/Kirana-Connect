import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function StoreOrdersPage() {
    const [storeId, setStoreId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchStoreId = async () => {
            try {
                const res = await api.get('/stores/my-store');
                setStoreId(res.data.store._id);
            } catch (error) {
                console.error("Failed to load store ID", error);
            }
        };
        fetchStoreId();
    }, []);


    const fetchOrders = useCallback(async () => {
        if (!storeId) return;
        
        try {
            const res = await api.get(`/orders/store/${storeId}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch shop orders", error);
        }
    }, [storeId]);

    useEffect(() => {
        if (!storeId) return;

        fetchOrders(); 
        const interval = setInterval(() => {
            fetchOrders();
        }, 10000);
        
        return () => clearInterval(interval);
    }, [storeId, fetchOrders]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    if (!storeId) return <h2 style={{ padding: '20px' }}>Calibrating Radar...</h2>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Live Order Feed</h2>
            
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['All', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setFilter(tab)}
                        style={{ 
                            padding: '8px', cursor: 'pointer', border: 'none', borderRadius: '4px',
                            backgroundColor: filter === tab ? 'blue' : 'lightgray',
                            color: filter === tab ? 'white' : 'black',
                            fontWeight: filter === tab ? 'bold' : 'normal'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Order Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredOrders.length === 0 ? <p>No orders in this category.</p> : null}
                
                {filteredOrders.map(order => (
                    <div key={order._id} style={{ border: '1px solid gray', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>Order #{order._id.substring(order._id.length - 6)}</h4>
                            <span style={{ color: 'orange', fontWeight: 'bold' }}>{order.status}</span>
                        </div>
                        <p style={{ margin: '10px 0' }}>Total: <strong>₹{order.totalAmount}</strong></p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            {order.status === 'PLACED' && (
                                <button onClick={() => updateStatus(order._id, 'CONFIRMED')} style={{ backgroundColor: 'green', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Accept & Confirm</button>
                            )}
                            {order.status === 'CONFIRMED' && (
                                <button onClick={() => updateStatus(order._id, 'PREPARING')} style={{ backgroundColor: 'blue', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Start Preparing</button>
                            )}
                            {order.status === 'PREPARING' && (
                                <button onClick={() => updateStatus(order._id, 'READY')} style={{ backgroundColor: 'purple', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark as Ready</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}