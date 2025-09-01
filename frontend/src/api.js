import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const http = axios.create({ baseURL: API });
export function setToken(token) {
    if (token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete http.defaults.headers.common['Authorization'];
}