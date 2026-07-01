// services/rewardService.js

import apiClient, { unwrapApiResponse } from "./apiClient";

export const rewardService = {
  async claimWhatsAppReward() {
    const response = await apiClient.post("/rewards/whatsapp");
    return unwrapApiResponse(response);
  },
};

export default rewardService;
