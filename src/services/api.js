import axios from "axios";

const API_BASE_URL = "https://go-travel-back.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    "Content-Type": "application/json",
    },
    withCredentials: false,
});

api.interceptors.request.use(
    async (config) => {
    console.log('Entering interceptor configuration')
    const token = await localStorage.getItem("token");
    if (token) {
    config.headers.Authorization = token;
    }console.debug("returning interceptor configuration");
    return config;
},
(error) => {
    console.error("Error in interceptor configuration", error);
    Promise.reject(error);
    }
  );

export default api;
