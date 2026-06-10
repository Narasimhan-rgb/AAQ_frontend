import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getDatasetById } from "../api/datasetApi";
import {
  generateQasm,
  generateQiskitCircuit,
  simulateAmplitude,
  simulateInterference,
} from "../api/quantumApi";

function QuantumAnalysisPage() {
  const { id } = useParams();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningType, setRunningType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [sampleSize, setSampleSize] = useState(100000);
  const [candidateCount, setCandidateCount] = useState(10);
  const [learningRate, setLearningRate] = useState(0.1);
  const [reinforcementStrength, setReinforcementStrength] = useState(1.25);
  const [suppressionStrength, setSuppressionStrength] = useState(0.75);

  const [amplitudeResult, setAmplitudeResult] = useState(null);
  const [interferenceResult, setInterferenceResult] = useState(null);
  const [qasmResult, setQasmResult] = useState(null);
  const [qiskitResult, setQiskitResult] = useState(null);

  async function loadDataset() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getDatasetById(id);
      setDataset(response);
      setSelectedColumn(response?.selectedSortColumn || "");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load dataset."
      );
    } finally {
      setLoading(false);
    }
  }

  function buildBasePayload() {
    if (!dataset?.filePath) {
      throw new Error("Dataset file path is missing. Upload dataset again.");
    }

    if (!selectedColumn) {
      throw new Error("Selected column is missing. Analyze dataset first.");
    }

    return {
      filePath: dataset.filePath,
      selectedColumn,
      sampleSize: Number(sampleSize),
      candidateCount: Number(candidateCount),
      learningRate: Number(learningRate),
    };
  }

  async function runAmplitude() {
    try {
      setRunningType("amplitude");
      setErrorMessage("");

      const result = await simulateAmplitude(buildBasePayload());
      setAmplitudeResult(result);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Amplitude simulation failed."));
    } finally {
      setRunningType("");
    }
  }

  async function runInterference() {
    try {
      setRunningType("interference");
      setErrorMessage("");

      const result = await simulateInterference({
        ...buildBasePayload(),
        reinforcementStrength: Number(reinforcementStrength),
        suppressionStrength: Number(suppressionStrength),
      });

      setInterferenceResult(result);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Interference simulation failed.")
      );
    } finally {
      setRunningType("");
    }
  }

  async function runQasm() {
    try {
      setRunningType("qasm");
      setErrorMessage("");

      const qasmPayload = {
        ...buildBasePayload(),
        candidateCount: Math.min(Number(candidateCount), 8),
      };

      const result = await generateQasm(qasmPayload);
      setQasmResult(result);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "OpenQASM generation failed."));
    } finally {
      setRunningType("");
    }
  }

  async function runQiskit() {
    try {
      setRunningType("qiskit");
      setErrorMessage("");

      const qiskitPayload = {
        ...buildBasePayload(),
        candidateCount: Math.min(Number(candidateCount), 8),
      };

      const result = await generateQiskitCircuit(qiskitPayload);
      setQiskitResult(result);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Qiskit circuit generation failed.")
      );
    } finally {
      setRunningType("");
    }
  }

  async function runAllQuantumAnalysis() {
    await runAmplitude();
    await runInterference();
    await runQasm();
    await runQiskit();
  }

  useEffect(() => {
    loadDataset();
  }, [id]);

  if (loading) {
    return <div className="page-message">Loading quantum analysis...</div>;
  }

  if (errorMessage && !dataset) {
    return (
      <div className="page-message error">
        <h2>Quantum Analysis Error</h2>
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
          <h2>Quantum-Inspired Analysis</h2>
          <p>
            Simulate amplitude pivot selection, interference, OpenQASM, and
            Qiskit circuit generation.
          </p>
        </div>

        <div className="action-group">
          <Link className="link-button" to={`/datasets/${id}`}>
            Back to Dataset
          </Link>

          <button onClick={loadDataset}>Refresh</button>
        </div>
      </div>

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <div className="section-card">
        <h3>Dataset Quantum Input</h3>

        <div className="details-grid">
          <Detail label="Dataset ID" value={dataset?.id} />
          <Detail label="Dataset Name" value={dataset?.datasetName} />
          <Detail label="Original File" value={dataset?.originalFileName} />
          <Detail label="File Type" value={dataset?.fileType} />
          <Detail label="Record Count" value={dataset?.recordCount} />
          <Detail label="Column Count" value={dataset?.columnCount} />
          <Detail label="Detected Pattern" value={dataset?.detectedPattern} />
          <Detail label="File Path" value={dataset?.filePath} />
        </div>
      </div>

      <div className="section-card">
        <h3>Simulation Parameters</h3>

        <div className="form-grid">
          <label>
            Selected Column
            <input
              value={selectedColumn}
              onChange={(event) => setSelectedColumn(event.target.value)}
              placeholder="Example: value"
            />
          </label>

          <label>
            Sample Size
            <input
              type="number"
              value={sampleSize}
              onChange={(event) => setSampleSize(event.target.value)}
            />
          </label>

          <label>
            Candidate Count
            <input
              type="number"
              value={candidateCount}
              onChange={(event) => setCandidateCount(event.target.value)}
            />
          </label>

          <label>
            Learning Rate
            <input
              type="number"
              step="0.01"
              value={learningRate}
              onChange={(event) => setLearningRate(event.target.value)}
            />
          </label>

          <label>
            Reinforcement Strength
            <input
              type="number"
              step="0.01"
              value={reinforcementStrength}
              onChange={(event) =>
                setReinforcementStrength(event.target.value)
              }
            />
          </label>

          <label>
            Suppression Strength
            <input
              type="number"
              step="0.01"
              value={suppressionStrength}
              onChange={(event) => setSuppressionStrength(event.target.value)}
            />
          </label>
        </div>

        <div className="action-group quantum-actions">
          <button onClick={runAmplitude} disabled={Boolean(runningType)}>
            {runningType === "amplitude" ? "Running..." : "Run Amplitude"}
          </button>

          <button onClick={runInterference} disabled={Boolean(runningType)}>
            {runningType === "interference" ? "Running..." : "Run Interference"}
          </button>

          <button onClick={runQasm} disabled={Boolean(runningType)}>
            {runningType === "qasm" ? "Generating..." : "Generate OpenQASM"}
          </button>

          <button onClick={runQiskit} disabled={Boolean(runningType)}>
            {runningType === "qiskit" ? "Generating..." : "Generate Qiskit"}
          </button>

          <button onClick={runAllQuantumAnalysis} disabled={Boolean(runningType)}>
            Run All
          </button>
        </div>
      </div>

      {amplitudeResult && (
        <div className="section-card highlight-card">
          <h3>Amplitude Simulation Result</h3>

          <div className="details-grid">
            <Detail label="Rows" value={amplitudeResult.rowCount} />
            <Detail label="Sample Used" value={amplitudeResult.sampleSizeUsed} />
            <Detail label="Selected Column" value={amplitudeResult.selectedColumn} />
            <Detail label="Candidate Count" value={amplitudeResult.candidateCount} />
            <Detail
              label="Selected Pivot Index"
              value={amplitudeResult.selectedPivotIndex}
            />
            <Detail
              label="Selected Pivot Value"
              value={formatNumber(amplitudeResult.selectedPivotValue)}
            />
            <Detail
              label="Best Partition Imbalance"
              value={formatNumber(amplitudeResult.bestPartitionImbalance)}
            />
            <Detail
              label="Average Partition Imbalance"
              value={formatNumber(amplitudeResult.averagePartitionImbalance)}
            />
            <Detail
              label="Amplitude Convergence"
              value={formatNumber(amplitudeResult.amplitudeConvergenceScore)}
            />
          </div>

          <p className="muted-text">{amplitudeResult.explanation}</p>

          <CandidateTable
            candidates={amplitudeResult.candidates}
            mode="amplitude"
          />
        </div>
      )}

      {interferenceResult && (
        <div className="section-card highlight-card">
          <h3>Interference Simulation Result</h3>

          <div className="details-grid">
            <Detail label="Rows" value={interferenceResult.rowCount} />
            <Detail
              label="Sample Used"
              value={interferenceResult.sampleSizeUsed}
            />
            <Detail
              label="Selected Pivot Index"
              value={interferenceResult.selectedPivotIndex}
            />
            <Detail
              label="Selected Pivot Value"
              value={formatNumber(interferenceResult.selectedPivotValue)}
            />
            <Detail
              label="Constructive Reinforcement"
              value={interferenceResult.constructiveReinforcementCount}
            />
            <Detail
              label="Destructive Suppression"
              value={interferenceResult.destructiveSuppressionCount}
            />
            <Detail
              label="Interference Gain"
              value={formatNumber(interferenceResult.interferenceGain)}
            />
            <Detail
              label="Amplitude Convergence"
              value={formatNumber(interferenceResult.amplitudeConvergenceScore)}
            />
          </div>

          <p className="muted-text">{interferenceResult.explanation}</p>

          <CandidateTable
            candidates={interferenceResult.candidates}
            mode="interference"
          />
        </div>
      )}

      {qasmResult && (
        <div className="section-card">
          <h3>OpenQASM Circuit</h3>

          <div className="details-grid">
            <Detail label="Qubits" value={qasmResult.qubitCount} />
            <Detail label="Classical Bits" value={qasmResult.classicalBitCount} />
            <Detail
              label="Selected Pivot"
              value={formatNumber(qasmResult.selectedPivotValue)}
            />
            <Detail
              label="Best Imbalance"
              value={formatNumber(qasmResult.bestPartitionImbalance)}
            />
            <Detail label="Purpose" value={qasmResult.circuitPurpose} />
          </div>

          <p className="muted-text">{qasmResult.explanation}</p>

          <pre className="code-block">{qasmResult.openQasm}</pre>

          <CandidateTable candidates={qasmResult.candidates} mode="qasm" />
        </div>
      )}

      {qiskitResult && (
        <div className="section-card">
          <h3>Qiskit Circuit</h3>

          <div className="details-grid">
            <Detail label="Qubits" value={qiskitResult.qubitCount} />
            <Detail
              label="Classical Bits"
              value={qiskitResult.classicalBitCount}
            />
            <Detail label="Circuit Depth" value={qiskitResult.circuitDepth} />
            <Detail
              label="Selected Pivot"
              value={formatNumber(qiskitResult.selectedPivotValue)}
            />
            <Detail
              label="Best Imbalance"
              value={formatNumber(qiskitResult.bestPartitionImbalance)}
            />
          </div>

          <p className="muted-text">{qiskitResult.explanation}</p>

          <h4>Qiskit Text</h4>
          <pre className="code-block">{qiskitResult.qiskitCircuitText}</pre>

          <h4>OpenQASM</h4>
          <pre className="code-block">{qiskitResult.openQasm}</pre>

          <CandidateTable candidates={qiskitResult.candidates} mode="qiskit" />
        </div>
      )}
    </section>
  );
}

function CandidateTable({ candidates = [], mode }) {
  if (!candidates.length) {
    return <p className="muted-text">No candidates available.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Value</th>
            <th>Imbalance</th>
            {mode === "amplitude" && <th>Amplitude Weight</th>}
            {mode === "amplitude" && <th>Probability</th>}
            {mode === "interference" && <th>Before Weight</th>}
            {mode === "interference" && <th>After Weight</th>}
            {mode === "interference" && <th>Before Prob.</th>}
            {mode === "interference" && <th>After Prob.</th>}
            {mode === "interference" && <th>Type</th>}
            {(mode === "qasm" || mode === "qiskit") && <th>Probability</th>}
            {(mode === "qasm" || mode === "qiskit") && <th>Rotation</th>}
            <th>Selected</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <tr
              key={`${mode}-${candidate.candidateIndex}`}
              className={candidate.selected ? "selected-row" : ""}
            >
              <td>{candidate.candidateIndex}</td>
              <td>{formatNumber(candidate.candidateValue)}</td>
              <td>{formatNumber(candidate.partitionImbalance)}</td>

              {mode === "amplitude" && (
                <td>{formatNumber(candidate.amplitudeWeight)}</td>
              )}

              {mode === "amplitude" && (
                <td>{formatNumber(candidate.selectionProbability)}</td>
              )}

              {mode === "interference" && (
                <td>{formatNumber(candidate.beforeAmplitudeWeight)}</td>
              )}

              {mode === "interference" && (
                <td>{formatNumber(candidate.afterAmplitudeWeight)}</td>
              )}

              {mode === "interference" && (
                <td>{formatNumber(candidate.beforeProbability)}</td>
              )}

              {mode === "interference" && (
                <td>{formatNumber(candidate.afterProbability)}</td>
              )}

              {mode === "interference" && (
                <td>{candidate.interferenceType}</td>
              )}

              {(mode === "qasm" || mode === "qiskit") && (
                <td>{formatNumber(candidate.selectionProbability)}</td>
              )}

              {(mode === "qasm" || mode === "qiskit") && (
                <td>{formatNumber(candidate.rotationAngle)}</td>
              )}

              <td>{candidate.selected ? "YES" : "NO"}</td>
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

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return Number(value).toFixed(4);
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default QuantumAnalysisPage;