import axios from 'axios';

const defaultInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Replace with your API base URL
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Attach token to every request if available
defaultInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
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