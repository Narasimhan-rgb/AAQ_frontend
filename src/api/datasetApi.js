import apiClient from "./apiClient";

export async function getAllDatasets() {
  const response = await apiClient.get("/dataset/all");
  return response.data;
}

export async function getDatasetById(datasetId) {
  const response = await apiClient.get(`/dataset/${datasetId}`);
  return response.data;
}

export async function previewDataset(datasetId) {
  const response = await apiClient.get(`/dataset/${datasetId}/preview`);
  return response.data;
}

export async function analyzeDataset(datasetId) {
  const response = await apiClient.post(`/dataset/${datasetId}/analyze`);
  return response.data;
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("aaq_token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const response = await fetch(`${API_BASE_URL}/dataset/upload`, {
    method: "POST",
    body: formData,
    // Letting the browser automatically set the Content-Type with the correct boundary
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  const data = await response.json();
  return data;
}

export async function deleteDataset(datasetId) {
  const response = await apiClient.delete(`/dataset/${datasetId}`);
  return response.data;
}