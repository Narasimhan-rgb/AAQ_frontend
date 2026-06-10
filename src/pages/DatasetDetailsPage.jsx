import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  analyzeDataset,
  getDatasetById,
  previewDataset,
} from "../api/datasetApi";

function DatasetDetailsPage() {
  const { id } = useParams();

  const [dataset, setDataset] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadDatasetDetails() {
    try {
      setLoading(true);
      setErrorMessage("");
      setPreviewError("");

      const datasetResponse = await getDatasetById(id);
      setDataset(datasetResponse);

      try {
        const previewResponse = await previewDataset(id);
        setPreview(previewResponse);
      } catch (previewFailure) {
        setPreview(null);
        setPreviewError(
          previewFailure?.response?.data?.message ||
            previewFailure?.response?.data?.error ||
            previewFailure?.message ||
            "Preview is not available for this dataset."
        );
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load dataset details."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    try {
      setAnalyzing(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await analyzeDataset(id);
      const result = response?.results || response;

      setAnalysisResult(result);
      setSuccessMessage("Dataset analysis completed successfully.");

      await loadDatasetDetails();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Dataset analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    loadDatasetDetails();
  }, [id]);

  if (loading) {
    return <div className="page-message">Loading dataset details...</div>;
  }

  if (errorMessage && !dataset) {
    return (
      <div className="page-message error">
        <h2>Dataset Details Error</h2>
        <p>{errorMessage}</p>
        <Link className="link-button" to="/datasets">
          Back to Datasets
        </Link>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>{dataset?.datasetName ?? "Dataset Details"}</h2>
          <p>View metadata, preview rows, and run Python profiling analysis.</p>
        </div>

        <div className="action-group">
          <Link className="link-button" to="/datasets">
            Back
          </Link>

          <button onClick={loadDatasetDetails}>Refresh</button>

          <button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze Dataset"}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="alert success-alert">{successMessage}</div>
      )}

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <div className="section-card">
        <h3>Dataset Metadata</h3>

        <div className="details-grid">
          <Detail label="Dataset ID" value={dataset?.id} />
          <Detail label="Unique ID" value={dataset?.datasetUniqueId} />
          <Detail label="Dataset Name" value={dataset?.datasetName} />
          <Detail label="Original File" value={dataset?.originalFileName} />
          <Detail label="File Type" value={dataset?.fileType} />
          <Detail label="File Size Bytes" value={dataset?.fileSizeBytes} />
          <Detail label="Record Count" value={dataset?.recordCount} />
          <Detail label="Column Count" value={dataset?.columnCount} />
          <Detail label="Selected Column" value={dataset?.selectedSortColumn} />
          <Detail label="Data Type" value={dataset?.dataType} />
          <Detail label="Detected Pattern" value={dataset?.detectedPattern} />
          <Detail label="Null Percentage" value={formatPercent(dataset?.nullPercentage)} />
          <Detail
            label="Duplicate Percentage"
            value={formatPercent(dataset?.duplicatePercentage)}
          />
          <Detail label="Skewness" value={formatNumber(dataset?.skewnessValue)} />
          <Detail
            label="Sortedness Score"
            value={formatNumber(dataset?.sortednessScore)}
          />
          <Detail label="Quantum Score" value={formatNumber(dataset?.quantumScore)} />
          <Detail label="Final Score" value={formatNumber(dataset?.finalScore)} />
          <Detail label="Created At" value={dataset?.createdAt} />
        </div>
      </div>

      {analysisResult && (
        <div className="section-card highlight-card">
          <h3>Latest Python Analysis Result</h3>

          <div className="details-grid">
            <Detail label="Rows" value={analysisResult.rowCount} />
            <Detail label="Columns" value={analysisResult.columnCount} />
            <Detail label="Selected Column" value={analysisResult.selectedColumn} />
            <Detail label="Data Type" value={analysisResult.dataType} />
            <Detail
              label="Null Percentage"
              value={formatPercent(analysisResult.nullPercentage)}
            />
            <Detail
              label="Duplicate Percentage"
              value={formatPercent(analysisResult.duplicatePercentage)}
            />
            <Detail label="Min Value" value={formatNumber(analysisResult.minValue)} />
            <Detail label="Max Value" value={formatNumber(analysisResult.maxValue)} />
            <Detail label="Mean" value={formatNumber(analysisResult.mean)} />
            <Detail label="Median" value={formatNumber(analysisResult.median)} />
            <Detail
              label="Standard Deviation"
              value={formatNumber(analysisResult.standardDeviation)}
            />
            <Detail label="Skewness" value={formatNumber(analysisResult.skewness)} />
            <Detail
              label="Sortedness Score"
              value={formatNumber(analysisResult.sortednessScore)}
            />
            <Detail label="Detected Pattern" value={analysisResult.detectedPattern} />
          </div>
        </div>
      )}

      <div className="section-card">
        <h3>Dataset Preview</h3>

        {previewError ? (
          <div className="alert error-alert">{previewError}</div>
        ) : !preview || !preview.columns || preview.columns.length === 0 ? (
          <p className="muted-text">No preview data available.</p>
        ) : (
          <>
            <p className="muted-text">
              Showing preview rows from stored {preview.fileType} file.
            </p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {preview.columns.map((column, index) => (
                      <th key={`${column}-${index}`}>{column}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(preview.rows || []).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {preview.columns.map((column, columnIndex) => (
                        <td key={`${rowIndex}-${columnIndex}`}>
                          {row[columnIndex] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
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

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return Number(value).toFixed(4);
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${Number(value).toFixed(2)}%`;
}

export default DatasetDetailsPage;