import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"
import { AuthContext } from "../context/AuthContext";

export default function LoginPage(){
    const[phoneNumber, setPhoneNumber] = useState('');
    const[password, setPassword] = useState('');
    const { login }  = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            let formattedPhone = phoneNumber.trim();
            if (!formattedPhone.startsWith("+91")) {
                formattedPhone = `+91 ${formattedPhone}`; 
            }

            const res = await api.post('/auth/login', {phoneNumber : formattedPhone,password : password});
            login(res.data.token, res.data.user);
        }catch(error){
            alert("login failed: "+ (error.response ?.data?.message || "server Error"));
        }
    };


    return(
        <div style={{ padding : '20px', fontFamily : 'sans-serif'}}>
            <h2>Customer Login</h2>
            <form onSubmit={handleLogin}
            style={{display: 'flex', flexDirection : "column", gap : '12px', maxWidth : "300px"}}
            >
                <input type="tel" 
                    placeholder="Phone Number (e.g. 9998887776)"
                    value={phoneNumber}
                    onChange={e => {setPhoneNumber(e.target.value)}}
                    required
                    style={{padding : "8px"}}
                />

                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={e => {setPassword(e.target.value)}}
                    required
                    style={{padding : "8px"}}
                />

                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Sign up</span>
            </p>
        </div>
    );
};