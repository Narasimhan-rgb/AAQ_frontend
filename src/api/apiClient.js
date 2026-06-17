import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000, // 10 minutes for large datasets
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;