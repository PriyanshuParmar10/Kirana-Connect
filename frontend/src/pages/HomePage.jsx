import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HomePage(){
    const[stores, setStores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const {latitude, longitude } = position.coords;
            try{
                const res = await api.get(`/stores/nearby?lat=${latitude}&lng=${longitude}&radius=5`);
                setStores(res.data);
            }catch(error){
                console.error("Error fetching stores", error);
            }
        },() => alert("Please allow location access to find nearby Kirana stores!"))
    },[]);

    return(
        <div style={{padding : "20px"}}>
            <h2>Nearby Kirana Stores</h2>
            <button 
                onClick={() => navigate('/my-orders')}
                style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                📦 My Orders
            </button>
            <div style={{display : 'flex', gap : '15px', flexWrap : 'wrap'}}>
                {stores.map(store => (
                    <div 
                        key={store._id} 
                        onClick={() => navigate(`/shop/${store._id}`)}
                        style={{ border: '2px solid black', padding: '15px', cursor: 'pointer', borderRadius: '8px' }}
                    >
                        <h3>{store.storeName}</h3>
                    </div>
                ))}
                
            </div>
        </div>
    );
}