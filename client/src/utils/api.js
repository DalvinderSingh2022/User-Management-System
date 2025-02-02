import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers["x-auth-token"] = token
    }
    return config;
});

// Auth endpoints
export const authLogin = (email, password) => api.post("/auth/login", { email, password });
export const authRegister = (name, email, password) => api.post("/auth/register", { name, email, password });

// User endpoints
export const getUserProfile = () => api.get("/user/profile");
export const updateUserProfile = (profileData) => api.put("/user/profile", profileData);