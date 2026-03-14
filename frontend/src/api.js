import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("MY API URL IS:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // so you don’t have to repeat this
});

// Utility to normalize error messages
const extractErrorMessage = (error) => {
  const response = error.response?.data;

  if (response?.message) {
    if (Array.isArray(response.message) && response.message.length > 0) {
      return response.message[0].message;
    } else if (typeof response.message === "string") {
      return response.message;
    }
  }

  return "Something went wrong";
};

// Generic wrapper
const request = async (method, url, data = null, config = {}) => {
  try {
    const res = await api.request({
      method,
      url,
      data,
      ...config,
    });
    return [res.data, null]; // success: [data, null]
  } catch (error) {
    const message = extractErrorMessage(error);
    return [null, message]; // failure: [null, errorMessage]
  }
};

// Export shorthand functions
export const apiGet = (url, config) => request("get", url, null, config);
export const apiPost = (url, data, config) => request("post", url, data, config);
export const apiPatch = (url, data, config) => request("patch", url, data, config);
export const apiDelete = (url, data={}, config) => request("delete", url, data, config);

