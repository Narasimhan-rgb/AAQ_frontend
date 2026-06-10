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

  const response = await apiClient.post("/dataset/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteDataset(datasetId) {
  const response = await apiClient.delete(`/dataset/${datasetId}`);
  return response.data;
}