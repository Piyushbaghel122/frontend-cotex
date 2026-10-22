import axios from "axios";

// In production, default to Hostinger backend if VITE_SERVER_URL is not set
const defaultServerUrl = import.meta.env.PROD 
    ? "https://yellow-tapir-786196.hostingersite.com" 
    : "http://localhost:8000";

const rawUrl = import.meta.env.VITE_SERVER_URL || defaultServerUrl;
const baseURL = rawUrl.replace(/\/+$/, "");

const api = axios.create({
    baseURL,
    withCredentials: true
});

export default api;