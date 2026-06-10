import apiClient from "./apiClient";

export async function getDatasetReportSummary(datasetId) {
  const response = await apiClient.get(`/reports/dataset/${datasetId}/summary`);
  return response.data;
}

export async function generateReportByJob(jobId) {
  const response = await apiClient.post(`/reports/job/${jobId}/generate`);
  return response.data;
}