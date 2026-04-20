import axios from "axios";
import Cookie from "js-cookie";

export const BaseUrlApi =
  process.env.REACT_APP_BASE_API || `http://localhost:5000/api`;

// Add axios interceptor to include token in requests
axios.interceptors.request.use((config) => {
  const token = Cookie.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  "Something went wrong. Please try again.";

export const UrlImage = `http://localhost:5000/public/storage/`;
