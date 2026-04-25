import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DeliverySetupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleType: 'Bike',
        vehicleNumber: '',
        drivingLicense: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.post('/delivery/profile', formData);
            alert("Driver Profile created! Welcome to the KiranaConnect Fleet.");
            navigate('/delivery/dashboard');
        } catch (error) {
            console.error(error.response?.data);
            alert("Failed to setup profile: " + (error.response?.data?.message || "Check backend routes"));
        }
    };

    return(
        <div style={{ padding : "20px", fontFamily : "sans-serif", maxWidth : "400px", margin : "0 auto"}}>
            <h2>Driver onBoarding</h2>
            <p style={{ color: 'gray' }}>Register your vehicle to start picking up orders.</p>

            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select name="vehicleType" onChange={handleChange} style={{ padding: '8px' }}>
                    <option value="Bike">Motorbike</option>
                    <option value="Scooter">Scooter / Activa</option>
                    <option value="Bicycle">Bicycle</option>
                </select>

                <input type="text" name="vehicleNumber" placeholder="Vehicle Plate (e.g. MH12AB1234)" required onChange={handleChange} style={{ padding: '8px' }} />
                <input type="text" name="drivingLicense" placeholder="Driving License Number" required onChange={handleChange} style={{ padding: '8px' }} />

                <button type="submit" style={{ backgroundColor: 'orange', color: 'black', padding: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
                    Start Delivering
                </button>
            </form>
        </div>
    );
}