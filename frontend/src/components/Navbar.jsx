import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    return (
        <nav style={{ display:'flex', gap:'15px', padding:'10px 20px', 
                      backgroundColor:'#1a1a2e', color:'white', alignItems:'center' }}>
            <span style={{fontWeight:'bold', fontSize:'18px', cursor:'pointer'}}
                  onClick={() => navigate('/')}>KiranaConnect</span>
            <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
                {isLoggedIn && <>
                    <button onClick={() => navigate('/cart')}>Cart</button>
                    <button onClick={() => navigate('/my-orders')}>My Orders</button>
                    <button onClick={logout}>Logout</button>
                </>}
            </div>
        </nav>
    );
}