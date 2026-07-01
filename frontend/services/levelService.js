// services/levelService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const levelService = {
  async getLevels() {
    const response = await apiClient.get("/levels");
    return unwrapApiResponse(response);
  },

  async getLevel(levelNumber) {
    const response = await apiClient.get(`/levels/${levelNumber}`);
    return unwrapApiResponse(response);
  },

  async startLevel(levelNumber) {
    const response = await apiClient.post(`/levels/${levelNumber}/start`);
    return unwrapApiResponse(response);
  },

  async saveCode(levelNumber, payload) {
    const response = await apiClient.post(`/levels/${levelNumber}/save-code`, payload);
    return unwrapApiResponse(response);
  },

  async complete(levelNumber, payload) {
    const response = await apiClient.post(`/levels/${levelNumber}/complete`, payload);
    return unwrapApiResponse(response);
  },

  async buyHint(levelNumber) {
    const response = await apiClient.post(`/levels/${levelNumber}/buy-hint`);
    return unwrapApiResponse(response);
  },

  async autoFix(levelNumber) {
    const response = await apiClient.post(`/levels/${levelNumber}/auto-fix`);
    return unwrapApiResponse(response);
  },

  async extraTime(levelNumber) {
    const response = await apiClient.post(`/levels/${levelNumber}/extra-time`);
    return unwrapApiResponse(response);
  },
};

export default levelService;
