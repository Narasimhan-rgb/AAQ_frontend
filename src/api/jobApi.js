import apiClient from "./apiClient";

export async function startSortingJob(payload) {
  const response = await apiClient.post("/jobs/start", payload);
  return response.data;
}

export async function getAllJobs() {
  const response = await apiClient.get("/jobs");
  return response.data;
}

export async function getJobById(jobId) {
  const response = await apiClient.get(`/jobs/${jobId}`);
  return response.data;
}

export async function executeSortingJob(payload) {
  const response = await apiClient.post("/sorting/run", payload);
  return response.data;
}
