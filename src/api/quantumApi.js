import axios from "axios";

const pythonApiClient = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function simulateAmplitude(payload) {
  const response = await pythonApiClient.post(
    "/quantum/amplitude-simulate",
    payload
  );

  return response.data;
}

export async function simulateInterference(payload) {
  const response = await pythonApiClient.post(
    "/quantum/interference-simulate",
    payload
  );

  return response.data;
}

export async function generateQasm(payload) {
  const response = await pythonApiClient.post("/quantum/generate-qasm", payload);

  return response.data;
}

export async function generateQiskitCircuit(payload) {
  const response = await pythonApiClient.post(
    "/quantum/qiskit-circuit",
    payload
  );

  return response.data;
}