// services/giftService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const giftService = {
  async getGift(levelNumber) {
    const response = await apiClient.get(`/gifts/${levelNumber}`);
    return unwrapApiResponse(response);
  },

  async openGift(levelNumber, giftId) {
    const response = await apiClient.post(`/gifts/${levelNumber}/open`, { giftId });
    return unwrapApiResponse(response);
  },
};

export default giftService;
