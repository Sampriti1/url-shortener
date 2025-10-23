import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8001',
    withCredentials: true, 
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

  
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await axiosInstance.get('/user/me');
                setUser(response.data.user);
            } catch (error) {
                console.log("User is not authenticated");
                setUser(null);
            } finally {
               
                setIsLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await axiosInstance.post('/user/login', { email, password });
        setUser(response.data.user);
        navigate('/'); 
    };

    const logout = async () => {
        
        setUser(null);
        navigate('/login'); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};