import { useEffect, useState } from "react";

import { getDashboardSummary } from "../api/dashboardApi";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getDashboardSummary();

      if (!response.success) {
        setErrorMessage("Dashboard API returned failure response.");
        return;
      }

      setDashboard(response.results);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="page-message">Loading dashboard...</div>;
  }

  if (errorMessage) {
    return (
      <div className="page-message error">
        <h2>Dashboard Error</h2>
        <p>{errorMessage}</p>
        <button onClick={loadDashboard}>Retry</button>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard Summary</h2>
          <p>Live summary from Java backend and Python quantum service.</p>
        </div>

        <button onClick={loadDashboard}>Refresh</button>
      </div>

      <div className="grid">
        <MetricCard title="Total Datasets" value={dashboard.totalDatasets} />
        <MetricCard title="Sorting Jobs" value={dashboard.totalSortingJobs} />
        <MetricCard title="Completed Jobs" value={dashboard.completedJobs} />
        <MetricCard title="Pending Jobs" value={dashboard.pendingJobs} />
        <MetricCard title="Running Jobs" value={dashboard.runningJobs} />
        <MetricCard title="Failed Jobs" value={dashboard.failedJobs} />
        <MetricCard title="Benchmark Results" value={dashboard.totalBenchmarkResults} />
        <MetricCard title="Recommendations" value={dashboard.totalRecommendations} />
        <MetricCard title="Quantum Metrics" value={dashboard.totalQuantumMetricRecords} />
        <MetricCard title="Best AAQ Time" value={`${dashboard.bestAaqExecutionTimeMs ?? 0} ms`} />
        <MetricCard
          title="Average Throughput"
          value={formatNumber(dashboard.averageThroughputRecordsPerSecond)}
        />
        <MetricCard
          title="Simulation Status"
          value={dashboard.latestQuantumSimulationStatus}
        />
      </div>

      <div className="section-card">
        <h3>Latest Recommendation</h3>

        <div className="details-grid">
          <Detail label="Recommended Algorithm" value={dashboard.latestRecommendedAlgorithm} />
          <Detail label="Confidence Score" value={dashboard.latestRecommendationConfidence} />
          <Detail label="Reason" value={dashboard.latestRecommendationReason} />
        </div>
      </div>

      <div className="section-card highlight-card">
        <h3>Python Quantum Simulation</h3>

        <div className="details-grid">
          <Detail label="Status" value={dashboard.latestQuantumSimulationStatus} />
          <Detail label="Dataset ID" value={dashboard.latestQuantumDatasetId} />
          <Detail label="Dataset Name" value={dashboard.latestQuantumDatasetName} />
          <Detail label="Selected Pivot" value={dashboard.latestSimulatedPivotValue} />
          <Detail
            label="Best Partition Imbalance"
            value={dashboard.latestSimulatedBestPartitionImbalance}
          />
          <Detail
            label="Interference Gain"
            value={dashboard.latestSimulatedInterferenceGain}
          />
          <Detail
            label="Amplitude Convergence Score"
            value={dashboard.latestSimulatedAmplitudeConvergenceScore}
          />
          <Detail label="OpenQASM Qubit Count" value={dashboard.latestOpenQasmQubitCount} />
        </div>
      </div>

      <div className="section-card">
        <h3>Latest AAQ Runtime Metrics</h3>

        <div className="details-grid">
          <Detail label="Latest Quantum Job ID" value={dashboard.latestQuantumJobId} />
          <Detail label="Latest Quantum Dataset ID" value={dashboard.latestQuantumDatasetId} />
          <Detail label="Pivot Selection Count" value={dashboard.latestPivotSelectionCount} />
          <Detail label="Partition Count" value={dashboard.latestPartitionCount} />
          <Detail label="Heap Fallback Count" value={dashboard.latestHeapFallbackCount} />
          <Detail
            label="Insertion Sort Usage Count"
            value={dashboard.latestInsertionSortUsageCount}
          />
          <Detail
            label="Average Partition Imbalance"
            value={dashboard.latestAveragePartitionImbalance}
          />
          <Detail
            label="Max Partition Imbalance"
            value={dashboard.latestMaxPartitionImbalance}
          />
        </div>
      </div>

      <div className="section-card">
        <h3>Generated At</h3>
        <p className="muted-text">{dashboard.generatedAt}</p>
      </div>
    </section>
  );
}

function MetricCard({ title, value }) {
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

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return Number(value).toLocaleString();
}

export default DashboardPage;