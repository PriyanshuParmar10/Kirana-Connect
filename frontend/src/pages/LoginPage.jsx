import { useState, useContext } from "react";
import api from "../api/axios"
import { AuthContext } from "../context/AuthContext";

export default function LoginPage(){
    const[phoneNum, setPhoneNum] = useState('');
    const[password, setPassword] = useState('');
    const { login }  = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post('/auth/login', {phoneNum, password});
            login.res(res.data.token, res.data.user);
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
                    value={phoneNum}
                    onChange={e => {setPhoneNum(e.target.value)}}
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
        </div>
    );
};