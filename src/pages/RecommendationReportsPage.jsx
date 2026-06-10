import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  generateRecommendation,
  getRecommendation,
} from "../api/recommendationApi";

import { generateReportByJob } from "../api/reportApi";

function RecommendationReportsPage() {
  const { id } = useParams();

  const [datasetId, setDatasetId] = useState(id || "");
  const [jobId, setJobId] = useState("");

  const [reportSummary, setReportSummary] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);

  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [generatingRecommendation, setGeneratingRecommendation] =
    useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleGetRecommendation(targetDatasetId = datasetId) {
    if (!targetDatasetId) {
      setErrorMessage("Enter dataset ID.");
      return;
    }

    try {
      setLoadingRecommendation(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await getRecommendation(targetDatasetId);
      const summary = extractSingleResult(response);

      setReportSummary(summary);
      setRecommendation(summary?.latestRecommendation || null);

      if (summary?.latestRecommendation) {
        setSuccessMessage("Recommendation loaded successfully.");
      } else {
        setErrorMessage(
          "No recommendation found for this dataset. Run sorting/benchmark first."
        );
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to load recommendation.")
      );
    } finally {
      setLoadingRecommendation(false);
    }
  }

  async function handleGenerateRecommendation() {
    if (!datasetId) {
      setErrorMessage("Enter dataset ID.");
      return;
    }

    try {
      setGeneratingRecommendation(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await generateRecommendation(datasetId);
      const summary = extractSingleResult(response);

      setReportSummary(summary);
      setRecommendation(summary?.latestRecommendation || null);

      if (summary?.latestRecommendation) {
        setSuccessMessage("Recommendation loaded successfully.");
      } else {
        setErrorMessage(
          "No recommendation found yet. Run sorting/benchmark first."
        );
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to generate recommendation.")
      );
    } finally {
      setGeneratingRecommendation(false);
    }
  }

  async function handleGenerateReport() {
    if (!jobId) {
      setErrorMessage("Enter sorting job ID.");
      return;
    }

    try {
      setGeneratingReport(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await generateReportByJob(jobId);
      const result = extractSingleResult(response);

      setGeneratedReport(result);
      setSuccessMessage("Report generated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to generate report."));
    } finally {
      setGeneratingReport(false);
    }
  }

  useEffect(() => {
    if (id) {
      setDatasetId(id);
      handleGetRecommendation(id);
    }
  }, [id]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Recommendation + Reports</h2>
          <p>
            Load algorithm recommendation and generate AAQ benchmark report.
          </p>
        </div>

        <div className="action-group">
          <Link className="link-button" to="/datasets">
            Datasets
          </Link>

          <Link className="link-button" to="/benchmarks">
            Benchmarks
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="alert success-alert">{successMessage}</div>
      )}

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <div className="section-card">
        <h3>Algorithm Recommendation</h3>

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

        <div className="action-group module-actions">
          <button
            onClick={() => handleGetRecommendation()}
            disabled={loadingRecommendation}
          >
            {loadingRecommendation ? "Loading..." : "Get Recommendation"}
          </button>

          <button
            onClick={handleGenerateRecommendation}
            disabled={generatingRecommendation}
          >
            {generatingRecommendation
              ? "Loading..."
              : "Load Recommendation Summary"}
          </button>
        </div>

        <p className="muted-text">
          Use the real dataset database ID from the dataset table. Do not use
          benchmark result ID or job ID here.
        </p>
      </div>

      {recommendation && (
        <div className="section-card highlight-card">
          <h3>Recommendation Result</h3>

          <div className="details-grid">
            <Detail label="Recommendation ID" value={recommendation.id} />
            <Detail label="Dataset ID" value={recommendation.datasetId} />
            <Detail label="Dataset Name" value={recommendation.datasetName} />
            <Detail
              label="Dataset Unique ID"
              value={recommendation.datasetUniqueId}
            />
            <Detail
              label="Detected Pattern"
              value={recommendation.datasetPattern}
            />
            <Detail label="Record Count" value={recommendation.recordCount} />
            <Detail
              label="Duplicate Percentage"
              value={formatPercent(recommendation.duplicatePercentage)}
            />
            <Detail
              label="Skewness"
              value={formatNumber(recommendation.skewnessValue)}
            />
            <Detail
              label="Sortedness Score"
              value={formatNumber(recommendation.sortednessScore)}
            />
            <Detail
              label="Recommended Algorithm"
              value={recommendation.recommendedAlgorithm}
            />
            <Detail
              label="Confidence Score"
              value={formatNumber(recommendation.confidenceScore)}
            />
            <Detail label="Created At" value={recommendation.createdAt} />
          </div>

          <div className="explanation-panel">
            <h4>Reason</h4>
            <p>
              {recommendation.recommendationReason ||
                "No detailed recommendation reason returned."}
            </p>
          </div>

          <div className="explanation-panel">
            <h4>Research Positioning</h4>
            <p>
              Adaptive Amplitude QuickSort is the proposed quantum-inspired
              algorithm. Traditional algorithms are validation baselines used to
              compare execution time, throughput, memory usage, and partition
              behavior.
            </p>
          </div>
        </div>
      )}

      {reportSummary && (
        <div className="section-card">
          <h3>Dataset Report Summary</h3>

          <div className="details-grid">
            <Detail label="Dataset ID" value={reportSummary.datasetId} />
            <Detail
              label="Dataset Unique ID"
              value={reportSummary.datasetUniqueId}
            />
            <Detail label="Dataset Name" value={reportSummary.datasetName} />
            <Detail
              label="Original File"
              value={reportSummary.originalFileName}
            />
            <Detail label="File Type" value={reportSummary.fileType} />
            <Detail
              label="File Size Bytes"
              value={reportSummary.fileSizeBytes}
            />
            <Detail label="Record Count" value={reportSummary.recordCount} />
            <Detail label="Column Count" value={reportSummary.columnCount} />
            <Detail
              label="Selected Column"
              value={reportSummary.selectedSortColumn}
            />
            <Detail label="Data Type" value={reportSummary.dataType} />
            <Detail
              label="Detected Pattern"
              value={reportSummary.detectedPattern}
            />
            <Detail
              label="Null Percentage"
              value={formatPercent(reportSummary.nullPercentage)}
            />
            <Detail
              label="Duplicate Percentage"
              value={formatPercent(reportSummary.duplicatePercentage)}
            />
            <Detail
              label="Skewness"
              value={formatNumber(reportSummary.skewnessValue)}
            />
            <Detail
              label="Sortedness Score"
              value={formatNumber(reportSummary.sortednessScore)}
            />
            <Detail
              label="Quantum Score"
              value={formatNumber(reportSummary.quantumScore)}
            />
            <Detail
              label="Final Score"
              value={formatNumber(reportSummary.finalScore)}
            />
            <Detail label="Report Status" value={reportSummary.reportStatus} />
            <Detail label="Generated At" value={reportSummary.generatedAt} />
          </div>

          <div className="explanation-panel">
            <h4>Report Message</h4>
            <p>
              {reportSummary.reportMessage ||
                "No report message returned from backend."}
            </p>
          </div>
        </div>
      )}

      {reportSummary?.bestBenchmarkResult && (
        <div className="section-card">
          <h3>Best Benchmark Result</h3>

          <div className="details-grid">
            <Detail
              label="Algorithm"
              value={reportSummary.bestBenchmarkResult.algorithm}
            />
            <Detail
              label="Execution Time"
              value={`${reportSummary.bestBenchmarkResult.executionTimeMs ?? "N/A"} ms`}
            />
            <Detail
              label="Input Size"
              value={reportSummary.bestBenchmarkResult.inputSize}
            />
            <Detail
              label="Throughput"
              value={formatNumber(
                reportSummary.bestBenchmarkResult.throughputRecordsPerSecond ||
                  reportSummary.bestBenchmarkResult.benchmarkThroughput
              )}
            />
            <Detail
              label="Memory"
              value={`${formatNumber(
                reportSummary.bestBenchmarkResult.benchmarkMemoryUsageMb
              )} MB`}
            />
            <Detail
              label="CPU"
              value={formatNumber(
                reportSummary.bestBenchmarkResult.benchmarkCpuUsage
              )}
            />
            <Detail
              label="Improvement"
              value={formatPercent(
                reportSummary.bestBenchmarkResult.improvementPercentage
              )}
            />
          </div>
        </div>
      )}

      {reportSummary?.benchmarkComparison && (
        <div className="section-card">
          <h3>Benchmark Comparison</h3>

          <div className="details-grid">
            <Detail
              label="Best Algorithm"
              value={reportSummary.benchmarkComparison.bestAlgorithm}
            />
            <Detail
              label="Best Execution Time"
              value={`${reportSummary.benchmarkComparison.bestExecutionTimeMs ?? "N/A"} ms`}
            />
            <Detail
              label="AAQ Algorithm"
              value={reportSummary.benchmarkComparison.aaqAlgorithm}
            />
            <Detail
              label="AAQ Execution Time"
              value={`${reportSummary.benchmarkComparison.aaqExecutionTimeMs ?? "N/A"} ms`}
            />
            <Detail
              label="AAQ Throughput"
              value={formatNumber(
                reportSummary.benchmarkComparison.aaqThroughputRecordsPerSecond
              )}
            />
            <Detail
              label="Algorithms Compared"
              value={reportSummary.benchmarkComparison.totalAlgorithmsCompared}
            />
          </div>
        </div>
      )}

      <div className="section-card">
        <h3>Report Generation</h3>

        <div className="form-grid">
          <label>
            Sorting Job ID
            <input
              value={jobId}
              onChange={(event) => setJobId(event.target.value)}
              placeholder="Example: 1"
            />
          </label>
        </div>

        <div className="action-group module-actions">
          <button onClick={handleGenerateReport} disabled={generatingReport}>
            {generatingReport ? "Generating..." : "Generate Report"}
          </button>
        </div>

        <p className="muted-text">
          Your backend currently supports report generation using sorting job
          ID. View and download endpoints are not available yet.
        </p>
      </div>

      {generatedReport && (
        <div className="section-card highlight-card">
          <h3>Generated Report</h3>

          <div className="details-grid">
            <Detail label="Report ID" value={generatedReport.id} />
            <Detail label="Job ID" value={generatedReport.jobId} />
            <Detail label="Dataset ID" value={generatedReport.datasetId} />
            <Detail label="Report Name" value={generatedReport.reportName} />
            <Detail label="Report Type" value={generatedReport.reportType} />
            <Detail
              label="Report File Path"
              value={generatedReport.reportFilePath}
            />
            <Detail label="Created By" value={generatedReport.createdBy} />
            <Detail label="Created At" value={generatedReport.createdAt} />
          </div>
        </div>
      )}
    </section>
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

function extractSingleResult(response) {
  if (response?.results) {
    return response.results;
  }

  return response || null;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return Number(value).toFixed(4);
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${Number(value).toFixed(2)}%`;
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

export default RecommendationReportsPage;