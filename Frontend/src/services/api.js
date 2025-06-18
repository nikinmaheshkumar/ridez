import axios from "axios";
import { useNavigate } from "react-router-dom";

const nav = useNavigate();
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refresh_token,
        });
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        nav("/");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
