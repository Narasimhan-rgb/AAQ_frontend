import { useEffect, useState } from "react";

import { validateSystem } from "../api/systemApi";

function SystemStatusPage() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSystemStatus() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await validateSystem();

      if (!response.success) {
        setErrorMessage("System validation API returned failure response.");
        return;
      }

      setSystemStatus(response.results);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to validate system."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSystemStatus();
  }, []);

  if (loading) {
    return <div className="page-message">Checking system status...</div>;
  }

  if (errorMessage) {
    return (
      <div className="page-message error">
        <h2>System Validation Error</h2>
        <p>{errorMessage}</p>
        <button onClick={loadSystemStatus}>Retry</button>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>System Status</h2>
          <p>Backend, database, and Python service validation.</p>
        </div>

        <button onClick={loadSystemStatus}>Refresh</button>
      </div>

      <div className="status-banner">
        <h3>{systemStatus.overallStatus}</h3>
        <p>{systemStatus.message}</p>
      </div>

      <div className="grid">
        <StatusCard title="Backend" value={systemStatus.backendStatus} />
        <StatusCard title="Database" value={systemStatus.databaseStatus} />
        <StatusCard title="Python Service" value={systemStatus.pythonServiceStatus} />
        <StatusCard title="Python URL" value={systemStatus.pythonServiceBaseUrl} />
      </div>

      <div className="section-card">
        <h3>System Counts</h3>

        <div className="details-grid">
          <Detail label="Total Datasets" value={systemStatus.totalDatasets} />
          <Detail label="Total Sorting Jobs" value={systemStatus.totalSortingJobs} />
          <Detail
            label="Total Benchmark Results"
            value={systemStatus.totalBenchmarkResults}
          />
          <Detail
            label="Total Recommendations"
            value={systemStatus.totalRecommendations}
          />
          <Detail
            label="Total Quantum Metric Records"
            value={systemStatus.totalQuantumMetricRecords}
          />
          <Detail label="Generated At" value={systemStatus.generatedAt} />
        </div>
      </div>

      <div className="section-card">
        <h3>Python Health Response</h3>
        <pre>{JSON.stringify(systemStatus.pythonHealthResponse, null, 2)}</pre>
      </div>
    </section>
  );
}

function StatusCard({ title, value }) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <h3>{value ?? "N/A"}</h3>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

export default SystemStatusPage;