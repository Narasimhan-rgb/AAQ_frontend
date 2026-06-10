import apiClient from "./apiClient";

export async function getAllBenchmarks() {
  const response = await apiClient.get("/benchmarks");
  return response.data;
}

export async function getBenchmarksByDataset(datasetId) {
  const response = await apiClient.get(`/benchmarks/dataset/${datasetId}`);
  return response.data;
}

export async function getBenchmarksByJob(jobId) {
  const response = await apiClient.get(`/benchmarks/job/${jobId}`);
  return response.data;
}

export async function compareBenchmarksByDataset(datasetId) {
  const response = await apiClient.get(`/benchmarks/compare/dataset/${datasetId}`);
  return response.data;
}

export async function getBestBenchmarkByDataset(datasetId) {
  const response = await apiClient.get(`/benchmarks/best/dataset/${datasetId}`);
  return response.data;
}