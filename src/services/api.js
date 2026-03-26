import axios from 'axios'

const apiBusPassages = axios.create({
    baseURL: 'http://localhost:3001/auth',
    timeout: 50000,
});

// Interceptor para adicionar token
apiBusPassages.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@BusTicket:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
apiBusPassages.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('@BusTicket:user');
            localStorage.removeItem('@BusTicket:token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiBusPassages