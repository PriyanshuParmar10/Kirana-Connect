import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const getInitialToken = () => {
        const savedToken = localStorage.getItem('token');
        if (savedToken === "undefined" || savedToken === "null") return null;
        return savedToken;
    };

    const[user, setUser] = useState(null);
    const[token, setToken] = useState(getInitialToken());
    const navigate = useNavigate();

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        navigate("/");
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    return(
        <AuthContext.Provider value={{user, token, login, logout, isLoggedIn: !! token}}>
            {children}
        </AuthContext.Provider>
    );
};