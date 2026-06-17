import apiClient from "./apiClient";

export async function getRecommendation(datasetId) {
  const response = await apiClient.get(`/reports/dataset/${datasetId}/summary`);
  return response.data;
}

export async function generateRecommendation(datasetId) {
  const response = await apiClient.post(`/recommendations/dataset/${datasetId}`);
  return response.data;
}