import axios from "axios";

// Update this to your API origin (must match your server CORS origin)
let API_BASE_URL;
if (!process.env.REACT_APP_SERVER_URL) {
    API_BASE_URL = 'http://localhost:4000';
} else {
    //API_BASE_URL = process.env.REACT_APP_SERVER_URL;  
    API_BASE_URL = '/api';   
}
//const API_BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // send/receive cookies
});

// Optional: auto-refresh access token on 401 for data requests (not for /auth/login)
api.interceptors.response.use(
    (r) => r,
    async (err) => {
        const original = err.config || {};
        const status = err?.response?.status;

        // Avoid infinite loops and skip login/logout calls
        const isAuthCall =
            original.url?.includes("/auth/login") ||
            original.url?.includes("/auth/logout") ||
            original.url?.includes("/auth/refresh");

        if (status === 401 && !original._retry && !isAuthCall) {
            original._retry = true;
            try {
                await api.post("/auth/refresh");
                return api(original);
            } catch {
                // fall through; caller will see 401 and can treat user as logged out
            }
        }
        return Promise.reject(err);
    }
);
