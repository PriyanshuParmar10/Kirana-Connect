import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StoreSetuppage() {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        storeName: '',
        description: '',
        category: 'Grocery',
        address: '',
        city: '',
        pincode: '',
        lat: '',
        lng: '',
        deliveryRadius: 5
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try{
            const payload = {
                ...formData,
                location : {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                }
            };

            await api.post('/stores',payload);
            alert("Store successfully created! Welcome to KiranaConnect.");
            navigate('/store/dashboard');
        }catch(error){
            console.error(error.response?.data);
            alert("Failed to create store: " + (error.response?.data?.message || "Check console"));
        }
    };

    return(
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Register Your Store</h2>
            <p style={{ color: 'gray' }}>You need to set up your profile before you can receive order</p>

            <form onSubmit={handleCreateStore} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="storeName" placeholder="store name" required onChange={handleChange} style={{ padding: '8px' }}/>
                <textarea name="description" placeholder="Short Description" onChange={handleChange} style={{ padding: '8px' }} />

                <select name="category" onChange={handleChange} style={{padding: '8px'}}>
                    <option value="Grocery">Grocery</option>
                    <option value="Dairy">Dairy & Bakery</option>
                    <option value="Pharmacy">Pharmacy / Meds</option>
                    <option value="Bakery">Bakery & Sweets</option>
                    <option value="General">General Store</option>
                </select>

                <input type="text" name="address" placeholder="Street Address" required onChange={handleChange} style={{ padding: '8px' }} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" name="city" placeholder="City" required onChange={handleChange} style={{ padding: '8px', flex: 1 }} />
                    <input type="text" name="pincode" placeholder="Pincode" required onChange={handleChange} style={{ padding: '8px', flex: 1 }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" step="any" name="lat" placeholder="Latitude (e.g. 28.7)" required onChange={handleChange} style={{ padding: '8px', flex: 1 }} />
                    <input type="number" step="any" name="lng" placeholder="Longitude (e.g. 77.2)" required onChange={handleChange} style={{ padding: '8px', flex: 1 }} />
                </div>

                <input type="number" name="deliveryRadius" placeholder="Delivery Radius (km)" required onChange={handleChange} style={{ padding: '8px' }} />

                <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
                    Create My Store
                </button>
            </form>
        </div>
    );
}