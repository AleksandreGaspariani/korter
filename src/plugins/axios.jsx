import axios from 'axios';
import { useAuthUser } from '../redux/useAuthUser';

const defaultInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Replace with your API base URL
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Attach token to every request if available in localStorage
defaultInstance.interceptors.request.use(
    config => {
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const token = auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

defaultInstance.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default defaultInstance;