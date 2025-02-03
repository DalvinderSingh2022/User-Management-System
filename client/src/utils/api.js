import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;
});

api.interceptors.response.use(
    response => {
        if (response.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    error => {
        toast.error(error.response?.data?.message || error.message || 'Something went wrong')

        return Promise.reject(error);
    }
);

// Auth endpoints
export const authLogin = (email, password) => api.post("/auth/login", { email, password });
export const authRegister = (name, email, password) => api.post("/auth/register", { name, email, password });

// User endpoints
export const updateUserProfile = (profileData) => api.put("/user/profile", profileData);
export const getUsers = () => api.get("/user");
export const getUser = (userId) => api.get(`user/${userId}`);

//Notification enpoints
export const getSendNotifications = () => api.get("/notification/send");
export const getRecipientNotifications = () => api.get("/notification/recipient");
export const sendNotification = ({ recipients, message, isCritical }) => api.post("/notification", { recipients, message, isCritical });