import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteDataset,
  getAllDatasets,
  uploadDataset,
} from "../api/datasetApi";

function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadDatasets() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAllDatasets();

      if (Array.isArray(response)) {
        setDatasets(response);
        return;
      }

      if (response?.success) {
        setDatasets(response.results || []);
        return;
      }

      setDatasets([]);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load datasets."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select a CSV or XLSX file.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await uploadDataset(selectedFile);

      setSuccessMessage("Dataset uploaded successfully.");
      setSelectedFile(null);

      const fileInput = document.getElementById("dataset-file");
      if (fileInput) {
        fileInput.value = "";
      }

      await loadDatasets();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Dataset upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(datasetId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dataset?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteDataset(datasetId);

      setSuccessMessage("Dataset deleted successfully.");
      await loadDatasets();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete dataset."
      );
    }
  }

  useEffect(() => {
    loadDatasets();
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Dataset Management</h2>
          <p>Upload CSV/XLSX datasets and manage stored dataset records.</p>
        </div>

        <button onClick={loadDatasets}>Refresh</button>
      </div>

      <div className="section-card">
        <h3>Upload Dataset</h3>

        <form className="upload-form" onSubmit={handleUpload}>
          <input
            id="dataset-file"
            type="file"
            accept=".csv,.xlsx"
            onChange={(event) => setSelectedFile(event.target.files[0])}
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Dataset"}
          </button>
        </form>

        <p className="muted-text">
          Supported files: CSV and XLSX. Backend stores file metadata and
          selected sort column.
        </p>
      </div>

      {successMessage && (
        <div className="alert success-alert">{successMessage}</div>
      )}

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <div className="section-card">
        <h3>All Datasets</h3>

        {loading ? (
          <div className="page-message">Loading datasets...</div>
        ) : datasets.length === 0 ? (
          <p className="muted-text">No datasets uploaded yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dataset Name</th>
                  <th>Original File</th>
                  <th>Type</th>
                  <th>Rows</th>
                  <th>Columns</th>
                  <th>Selected Column</th>
                  <th>Final Score</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td>{dataset.id}</td>
                    <td>{dataset.datasetName ?? "N/A"}</td>
                    <td>{dataset.originalFileName ?? "N/A"}</td>
                    <td>{dataset.fileType ?? "N/A"}</td>
                    <td>{dataset.recordCount ?? 0}</td>
                    <td>{dataset.columnCount ?? 0}</td>
                    <td>{dataset.selectedSortColumn ?? "N/A"}</td>
                    <td>{formatScore(dataset.finalScore)}</td>
                    <td>
                      <div className="action-group">
                        <Link
                          className="link-button"
                          to={`/datasets/${dataset.id}`}
                        >
                          View
                        </Link>

                        <button
                          className="danger-button"
                          onClick={() => handleDelete(dataset.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function formatScore(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return Number(value).toFixed(4);
}

export default DatasetsPage;