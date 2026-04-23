import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SignupPage() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            let formattedPhone = phoneNumber.trim();
            if (!formattedPhone.startsWith("+91")) {
                formattedPhone = `+91 ${formattedPhone}`; 
            }
            await api.post('/auth/register', { 
                name, 
                phoneNumber: formattedPhone, 
                password, 
                role : "Customer" 
            });
            
            alert("Account created! Please log in.");
            navigate('/login');
        } catch(error) {
            alert("Signup failed: " + (error.response?.data?.message || "Server Error"));
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: "column", gap: '12px', maxWidth: "300px" }}>
                <input 
                    type="text" placeholder="Full Name" required style={{ padding: "8px" }}
                    value={name} onChange={e => setName(e.target.value)}
                />
                
                <input 
                    type="tel" placeholder="Phone Number" required style={{ padding: "8px" }}
                    value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                />

                <input 
                    type="password" placeholder="Password" required style={{ padding: "8px" }}
                    value={password} onChange={e => setPassword(e.target.value)}
                />

                <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: 'black', color: 'white' }}>
                    Sign Up
                </button>
            </form>
            
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Login here</span>
            </p>
        </div>
    );
}