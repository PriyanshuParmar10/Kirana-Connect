import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const getInitialUser = () => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser || savedUser === "undefined" || savedUser === "null") return null;
        try {
            return JSON.parse(savedUser);
        } catch (error) {
            return null;
        }
    };

    const getInitialToken = () => {
        const savedToken = localStorage.getItem('token');
        if (savedToken === "undefined" || savedToken === "null") return null;
        return savedToken;
    };

    const[user, setUser] = useState(getInitialUser());
    const[token, setToken] = useState(getInitialToken());
    const navigate = useNavigate();

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        navigate("/");
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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