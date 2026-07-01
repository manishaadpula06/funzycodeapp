// services/miniGameService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const miniGameService = {
  async saveScore(payload) {
    const response = await apiClient.post("/mini-games/scores", payload);
    return unwrapApiResponse(response);
  },

  async myScores() {
    const response = await apiClient.get("/mini-games/my-scores");
    return unwrapApiResponse(response);
  },

  async leaderboard(gameName) {
    const response = await apiClient.get(`/mini-games/leaderboard/${encodeURIComponent(gameName)}`);
    return unwrapApiResponse(response);
  },
};

export default miniGameService;
