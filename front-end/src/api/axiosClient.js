import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000";
const REFRESH_TOKEN_URL = "http://localhost:5000/auth/refresh-token";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add accessToken to api call
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${REFRESH_TOKEN_URL}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);

    localStorage.removeItem("accessToken");
    toast.warn("Hết phiên đăng nhập, vui lòng đăng nhập lại.");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);

    return null;
  }
};

// Automatically refresh token when accessToken expires
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/login")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest); // Retry the failed request
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
