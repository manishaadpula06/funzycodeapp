// services/authService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const authService = {
  async register(payload) {
    const response = await apiClient.post("/auth/register", payload);
    return unwrapApiResponse(response);
  },

  async login(payload) {
    const response = await apiClient.post("/auth/login", payload);
    return unwrapApiResponse(response);
  },

  async me() {
    const response = await apiClient.get("/auth/me");
    return unwrapApiResponse(response);
  },

  async forgotPassword(email) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return unwrapApiResponse(response);
  },

  async resetPassword(payload) {
    const response = await apiClient.post("/auth/reset-password", payload);
    return unwrapApiResponse(response);
  },
};

export default authService;
