// services/apiClient.js

import axios from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT } from "./apiConfig";

let unauthorizedHandler = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const unwrapApiResponse = (response) => {
  const body = response?.data;

  if (body && Object.prototype.hasOwnProperty.call(body, "data")) {
    return body.data;
  }

  return body;
};

export const getApiErrorMessage = (error) => {
  if (!error?.response) {
    return "Server not reachable. Please try again.";
  }

  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.message) {
    return String(data.message);
  }

  if (data?.error) {
    return String(data.error);
  }

  return "Something went wrong. Please try again.";
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && typeof unauthorizedHandler === "function") {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
