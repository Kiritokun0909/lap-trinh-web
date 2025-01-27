import axios from "axios";
const API_BASE_URL = "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosClient;
