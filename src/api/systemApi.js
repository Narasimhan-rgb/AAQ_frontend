import apiClient from "./apiClient";

export async function validateSystem() {
  const response = await apiClient.get("/system/validate");
  return response.data;
}