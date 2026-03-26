
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextValue';
import apiBusPassages from '../services/api';

// Provider do contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedUser = localStorage.getItem('@BusTicket:user');
                const storedToken = localStorage.getItem('@BusTicket:token');

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    apiBusPassages.defaults.headers.Authorization = `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.error('Error loading stored data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStoredData();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiBusPassages.post('/login', { email, password });
            const { admin, token } = response.data;

            localStorage.setItem('@BusTicket:user', JSON.stringify(admin));
            localStorage.setItem('@BusTicket:token', token);
            apiBusPassages.defaults.headers.Authorization = `Bearer ${token}`;
            setUser(admin);

            return { success: true, user: admin };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao fazer login'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('@BusTicket:user');
        localStorage.removeItem('@BusTicket:token');
        delete apiBusPassages.defaults.headers.Authorization;
        setUser(null);
    };

    const hasRole = (roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    const value = {
        user,
        login,
        logout,
        loading,
        hasRole,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};