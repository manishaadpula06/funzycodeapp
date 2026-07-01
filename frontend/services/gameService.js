// services/gameService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const gameService = {
  async getProgress() {
    const response = await apiClient.get("/game/progress");
    return unwrapApiResponse(response);
  },

  async updateProgress(payload) {
    const response = await apiClient.put("/game/progress", payload);
    return unwrapApiResponse(response);
  },

  async resetGame() {
    const response = await apiClient.post("/game/reset");
    return unwrapApiResponse(response);
  },
};

export default gameService;
