import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  compareBenchmarksByDataset,
  getAllBenchmarks,
  getBenchmarksByDataset,
  getBestBenchmarkByDataset,
} from "../api/benchmarkApi";

function BenchmarkResultsPage() {
  const { id } = useParams();

  const [datasetId, setDatasetId] = useState(id || "");
  const [benchmarks, setBenchmarks] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [bestResult, setBestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAllBenchmarks() {
    try {
      setLoading(true);
      setErrorMessage("");
      setComparison(null);
      setBestResult(null);

      const response = await getAllBenchmarks();
      setBenchmarks(extractResults(response));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to load benchmarks."));
    } finally {
      setLoading(false);
    }
  }

  async function loadDatasetBenchmarks(targetDatasetId = datasetId) {
    if (!targetDatasetId) {
      setErrorMessage("Enter dataset ID to load dataset benchmarks.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getBenchmarksByDataset(targetDatasetId);
      setBenchmarks(extractResults(response));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to load dataset benchmarks.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadComparison(targetDatasetId = datasetId) {
    if (!targetDatasetId) {
      setErrorMessage("Enter dataset ID to compare algorithms.");
      return;
    }

    try {
      setComparisonLoading(true);
      setErrorMessage("");

      const comparisonResponse = await compareBenchmarksByDataset(targetDatasetId);
      const bestResponse = await getBestBenchmarkByDataset(targetDatasetId);

      setComparison(extractSingleResult(comparisonResponse));
      setBestResult(extractSingleResult(bestResponse));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to compare benchmark results.")
      );
    } finally {
      setComparisonLoading(false);
    }
  }

  async function loadDatasetFullView(targetDatasetId = datasetId) {
    await loadDatasetBenchmarks(targetDatasetId);
    await loadComparison(targetDatasetId);
  }

  useEffect(() => {
    if (id) {
      setDatasetId(id);
      loadDatasetFullView(id);
    } else {
      loadAllBenchmarks();
    }
  }, [id]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Benchmark Results</h2>
          <p>
            View execution performance, compare algorithms, and identify the
            best result for each dataset.
          </p>
        </div>

        <div className="action-group">
          <Link className="link-button" to="/datasets">
            Datasets
          </Link>

          <button onClick={loadAllBenchmarks}>Load All</button>
        </div>
      </div>

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <div className="section-card">
        <h3>Dataset Benchmark Filter</h3>

        <div className="form-grid">
          <label>
            Dataset ID
            <input
              value={datasetId}
              onChange={(event) => setDatasetId(event.target.value)}
              placeholder="Example: 1"
            />
          </label>
        </div>

        <div className="action-group benchmark-actions">
          <button onClick={() => loadDatasetBenchmarks()}>
            Load Dataset Benchmarks
          </button>

          <button onClick={() => loadComparison()} disabled={comparisonLoading}>
            {comparisonLoading ? "Comparing..." : "Compare Algorithms"}
          </button>

          <button
            onClick={() => loadDatasetFullView()}
            disabled={loading || comparisonLoading}
          >
            Load Full Dataset Benchmark View
          </button>
        </div>
      </div>

      {bestResult && (
        <div className="section-card highlight-card">
          <h3>Best Benchmark Result</h3>

          <div className="details-grid">
            <Detail label="Algorithm" value={bestResult.algorithm} />
            <Detail label="Dataset" value={bestResult.datasetName} />
            <Detail
              label="Execution Time"
              value={`${bestResult.executionTimeMs ?? "N/A"} ms`}
            />
            <Detail
              label="Benchmark Time"
              value={`${formatNumber(bestResult.benchmarkExecutionTimeMs)} ms`}
            />
            <Detail
              label="Throughput"
              value={formatNumber(
                bestResult.throughputRecordsPerSecond ||
                  bestResult.benchmarkThroughput
              )}
            />
            <Detail
              label="Memory Usage"
              value={`${formatNumber(bestResult.benchmarkMemoryUsageMb)} MB`}
            />
            <Detail
              label="CPU Usage"
              value={formatNumber(bestResult.benchmarkCpuUsage)}
            />
            <Detail
              label="Improvement"
              value={`${formatNumber(bestResult.improvementPercentage)}%`}
            />
          </div>
        </div>
      )}

      {comparison && (
        <div className="section-card">
          <h3>Algorithm Comparison Summary</h3>

          <div className="details-grid">
            <Detail label="Dataset ID" value={comparison.datasetId} />
            <Detail label="Dataset Name" value={comparison.datasetName} />
            <Detail label="Best Algorithm" value={comparison.bestAlgorithm} />
            <Detail
              label="Best Execution Time"
              value={`${comparison.bestExecutionTimeMs ?? "N/A"} ms`}
            />
            <Detail label="AAQ Algorithm" value={comparison.aaqAlgorithm} />
            <Detail
              label="AAQ Execution Time"
              value={`${comparison.aaqExecutionTimeMs ?? "N/A"} ms`}
            />
            <Detail
              label="AAQ Throughput"
              value={formatNumber(comparison.aaqThroughputRecordsPerSecond)}
            />
            <Detail
              label="Algorithms Compared"
              value={comparison.totalAlgorithmsCompared}
            />
            <Detail label="Generated At" value={comparison.generatedAt} />
          </div>

          <ComparisonTable comparisons={comparison.comparisons || []} />
        </div>
      )}

      <div className="section-card">
        <h3>Benchmark Result List</h3>

        {loading ? (
          <div className="page-message">Loading benchmark results...</div>
        ) : benchmarks.length === 0 ? (
          <p className="muted-text">
            No benchmark results found. Run a sorting job first, then come back
            to this page.
          </p>
        ) : (
          <BenchmarkTable benchmarks={benchmarks} />
        )}
      </div>
    </section>
  );
}

function BenchmarkTable({ benchmarks }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dataset</th>
            <th>Algorithm</th>
            <th>Input Size</th>
            <th>Execution Time</th>
            <th>Comparisons</th>
            <th>Swaps</th>
            <th>Throughput</th>
            <th>Memory</th>
            <th>CPU</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {benchmarks.map((benchmark) => (
            <tr key={benchmark.id}>
              <td>{benchmark.id}</td>
              <td>{benchmark.datasetName ?? "N/A"}</td>
              <td>{benchmark.algorithm ?? "N/A"}</td>
              <td>{benchmark.inputSize ?? "N/A"}</td>
              <td>{benchmark.executionTimeMs ?? "N/A"} ms</td>
              <td>{benchmark.comparisonCount ?? "N/A"}</td>
              <td>{benchmark.swapCount ?? "N/A"}</td>
              <td>
                {formatNumber(
                  benchmark.throughputRecordsPerSecond ||
                    benchmark.benchmarkThroughput
                )}
              </td>
              <td>{formatNumber(benchmark.benchmarkMemoryUsageMb)} MB</td>
              <td>{formatNumber(benchmark.benchmarkCpuUsage)}</td>
              <td>{benchmark.status ?? "N/A"}</td>
              <td>{benchmark.createdAt ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonTable({ comparisons }) {
  if (!comparisons.length) {
    return <p className="muted-text">No comparison rows available.</p>;
  }

  return (
    <div className="table-wrapper comparison-table">
      <table>
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Execution Time</th>
            <th>Input Size</th>
            <th>Comparisons</th>
            <th>Swaps</th>
            <th>Throughput</th>
            <th>Improvement vs AAQ</th>
            <th>AAQ Faster?</th>
          </tr>
        </thead>

        <tbody>
          {comparisons.map((item) => (
            <tr
              key={`${item.algorithm}-${item.createdAt}`}
              className={item.aaqFasterThanThisAlgorithm ? "selected-row" : ""}
            >
              <td>{item.algorithm ?? "N/A"}</td>
              <td>{item.executionTimeMs ?? "N/A"} ms</td>
              <td>{item.inputSize ?? "N/A"}</td>
              <td>{item.comparisonCount ?? "N/A"}</td>
              <td>{item.swapCount ?? "N/A"}</td>
              <td>{formatNumber(item.throughputRecordsPerSecond)}</td>
              <td>{formatNumber(item.improvementPercentageVsAaq)}%</td>
              <td>{item.aaqFasterThanThisAlgorithm ? "YES" : "NO"}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

function extractResults(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
}

function extractSingleResult(response) {
  return response?.results || response || null;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return Number(value).toFixed(4);
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail ||
    error?.message ||
    fallback
  );
}

export default BenchmarkResultsPage;