import { useEffect, useMemo, useState } from "react";
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

  const selectedCandidate = useMemo(() => {
    return (
      amplitudeResult?.candidates?.find((candidate) => candidate.selected) ||
      interferenceResult?.candidates?.find((candidate) => candidate.selected) ||
      qasmResult?.candidates?.find((candidate) => candidate.selected) ||
      qiskitResult?.candidates?.find((candidate) => candidate.selected) ||
      null
    );
  }, [amplitudeResult, interferenceResult, qasmResult, qiskitResult]);

  async function loadDataset() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getDatasetById(id);
      setDataset(response);
      setSelectedColumn(response?.selectedSortColumn || "");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to load dataset."));
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

      const result = await generateQasm({
        ...buildBasePayload(),
        candidateCount: Math.min(Number(candidateCount), 8),
      });

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

      const result = await generateQiskitCircuit({
        ...buildBasePayload(),
        candidateCount: Math.min(Number(candidateCount), 8),
      });

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
    return <div className="page-message">Loading quantum simulation lab...</div>;
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
    <section className="page quantum-lab-page">
      <div className="quantum-hero">
        <div>
          <p className="eyebrow">AAQ Quantum-Inspired Simulation Console</p>
          <h2>Quantum Analyzer</h2>
          <p>
            Visualize amplitude-weighted pivot selection, partition imbalance,
            interference reinforcement, and quantum circuit generation for the
            proposed Adaptive Amplitude QuickSort algorithm.
          </p>
        </div>

        <div className="quantum-hero-actions">
          <Link className="link-button" to={`/datasets/${id}`}>
            Back to Dataset
          </Link>
          <button onClick={loadDataset}>Refresh</button>
        </div>
      </div>

      {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

      <SimulationFlow
        amplitudeDone={Boolean(amplitudeResult)}
        interferenceDone={Boolean(interferenceResult)}
        qasmDone={Boolean(qasmResult)}
        qiskitDone={Boolean(qiskitResult)}
      />

      <div className="quantum-layout">
        <aside className="quantum-control-panel">
          <h3>Simulation Input</h3>

          <div className="mini-dataset-card">
            <span>Dataset</span>
            <strong>{dataset?.datasetName || "N/A"}</strong>
            <small>{dataset?.detectedPattern || "UNKNOWN"}</small>
          </div>

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

          <div className="quantum-button-stack">
            <button onClick={runAmplitude} disabled={Boolean(runningType)}>
              {runningType === "amplitude" ? "Running..." : "Run Amplitude"}
            </button>

            <button onClick={runInterference} disabled={Boolean(runningType)}>
              {runningType === "interference"
                ? "Running..."
                : "Run Interference"}
            </button>

            <button onClick={runQasm} disabled={Boolean(runningType)}>
              {runningType === "qasm" ? "Generating..." : "Generate OpenQASM"}
            </button>

            <button onClick={runQiskit} disabled={Boolean(runningType)}>
              {runningType === "qiskit" ? "Generating..." : "Generate Qiskit"}
            </button>

            <button
              className="primary-wide"
              onClick={runAllQuantumAnalysis}
              disabled={Boolean(runningType)}
            >
              Run Full Quantum Simulation
            </button>
          </div>
        </aside>

        <main className="quantum-simulation-board">
          <section className="quantum-state-grid">
            <QuantumMetricCard
              title="Selected Pivot"
              value={formatNumber(
                firstDefined(
                  amplitudeResult?.selectedPivotValue,
                  interferenceResult?.selectedPivotValue,
                  qasmResult?.selectedPivotValue,
                  qiskitResult?.selectedPivotValue
                )
              )}
              subtitle="Amplitude-selected pivot value"
            />

            <QuantumMetricCard
              title="Best Imbalance"
              value={formatNumber(
                firstDefined(
                  amplitudeResult?.bestPartitionImbalance,
                  interferenceResult?.bestPartitionImbalance,
                  qasmResult?.bestPartitionImbalance,
                  qiskitResult?.bestPartitionImbalance
                )
              )}
              subtitle="Lower value means better partition"
            />

            <QuantumMetricCard
              title="Amplitude Convergence"
              value={formatNumber(
                firstDefined(
                  amplitudeResult?.amplitudeConvergenceScore,
                  interferenceResult?.amplitudeConvergenceScore
                )
              )}
              subtitle="Probability stability score"
            />

            <QuantumMetricCard
              title="Interference Gain"
              value={formatNumber(interferenceResult?.interferenceGain)}
              subtitle="Effect of reinforcement/suppression"
            />
          </section>

          <section className="quantum-visual-card">
            <div className="visual-card-header">
              <div>
                <h3>Amplitude Probability Field</h3>
                <p>
                  Candidate pivots are assigned selection probabilities based on
                  amplitude weights.
                </p>
              </div>

              {selectedCandidate && (
                <div className="selected-pivot-pill">
                  Pivot {formatNumber(selectedCandidate.candidateValue)}
                </div>
              )}
            </div>

            <ProbabilityBars candidates={amplitudeResult?.candidates || []} />
          </section>

          <section className="quantum-two-column">
            <div className="quantum-visual-card">
              <h3>Partition Imbalance Curve</h3>
              <p>
                AAQ prefers candidates that reduce partition imbalance toward a
                balanced split.
              </p>
              <ImbalanceCurve candidates={amplitudeResult?.candidates || []} />
            </div>

            <div className="quantum-visual-card">
              <h3>Amplitude Weight Distribution</h3>
              <p>
                Higher amplitude regions receive stronger probability during
                pivot selection.
              </p>
              <WeightBars candidates={amplitudeResult?.candidates || []} />
            </div>
          </section>

          <section className="quantum-visual-card">
            <h3>Quantum-Inspired Interference Update</h3>
            <p>
              Constructive reinforcement increases good pivot zones. Destructive
              suppression weakens poor zones.
            </p>

            <InterferenceBars
              candidates={interferenceResult?.candidates || []}
            />
          </section>
        </main>
      </div>

      {amplitudeResult && (
        <div className="section-card highlight-card">
          <h3>Amplitude Simulation Result</h3>

          <div className="details-grid">
            <Detail label="Rows" value={amplitudeResult.rowCount} />
            <Detail label="Sample Used" value={amplitudeResult.sampleSizeUsed} />
            <Detail
              label="Selected Column"
              value={amplitudeResult.selectedColumn}
            />
            <Detail
              label="Candidate Count"
              value={amplitudeResult.candidateCount}
            />
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
        <div className="section-card quantum-circuit-stage">
          <div className="visual-card-header">
            <div>
              <p className="eyebrow">OpenQASM Quantum Circuit Model</p>
              <h3>Amplitude-to-QASM Circuit Simulation</h3>
              <p>
                This circuit converts AAQ pivot candidate probabilities into
                quantum-style rotation gates. Higher probability pivots receive
                stronger rotation angles.
              </p>
            </div>

            <div className="selected-pivot-pill">
              Pivot {formatNumber(qasmResult.selectedPivotValue)}
            </div>
          </div>

          <div className="circuit-summary-grid">
            <QuantumMetricCard
              title="Qubits"
              value={qasmResult.qubitCount}
              subtitle="Each qubit represents one pivot candidate"
            />

            <QuantumMetricCard
              title="Classical Bits"
              value={qasmResult.classicalBitCount}
              subtitle="Measurement output register"
            />

            <QuantumMetricCard
              title="Selected Pivot"
              value={formatNumber(qasmResult.selectedPivotValue)}
              subtitle="Best amplitude-weighted pivot"
            />

            <QuantumMetricCard
              title="Best Imbalance"
              value={formatNumber(qasmResult.bestPartitionImbalance)}
              subtitle="Lowest partition imbalance candidate"
            />
          </div>

          <div className="quantum-visual-card circuit-panel">
            <h3>Quantum Circuit Rail View</h3>
            <p>
              H gates create superposition-inspired candidate space. RY gates
              encode amplitude probability. CX gates show neighbor correlation.
            </p>

            <QuantumCircuitVisualizer result={qasmResult} />
          </div>

          <div className="quantum-two-column">
            <div className="quantum-visual-card">
              <h3>Candidate Rotation Field</h3>
              <p>
                Rotation angle represents the probability strength assigned to
                each pivot candidate.
              </p>

              <RotationBars candidates={qasmResult.candidates || []} />
            </div>

            <div className="quantum-visual-card">
              <h3>QASM Candidate State Map</h3>
              <p>
                The selected pivot is highlighted as the strongest measurement
                target.
              </p>

              <CandidateStateMap candidates={qasmResult.candidates || []} />
            </div>
          </div>

          <details className="raw-code-toggle">
            <summary>View Raw OpenQASM Code</summary>
            <pre className="code-block">{qasmResult.openQasm}</pre>
          </details>

          <CandidateTable candidates={qasmResult.candidates} mode="qasm" />
        </div>
      )}

      {qiskitResult && (
        <div className="section-card quantum-circuit-stage">
          <div className="visual-card-header">
            <div>
              <p className="eyebrow">Qiskit Circuit Model</p>
              <h3>Qiskit-Based AAQ Pivot Simulation</h3>
              <p>
                This view represents AAQ pivot candidates as a quantum-style
                circuit using qubits, rotation gates, neighbor correlation, and
                measurement.
              </p>
            </div>

            <div className="selected-pivot-pill">
              Pivot {formatNumber(qiskitResult.selectedPivotValue)}
            </div>
          </div>

          <div className="circuit-summary-grid">
            <QuantumMetricCard
              title="Qubits"
              value={qiskitResult.qubitCount}
              subtitle="Candidate pivot states"
            />

            <QuantumMetricCard
              title="Classical Bits"
              value={qiskitResult.classicalBitCount}
              subtitle="Measurement bits"
            />

            <QuantumMetricCard
              title="Circuit Depth"
              value={qiskitResult.circuitDepth}
              subtitle="Gate execution layers"
            />

            <QuantumMetricCard
              title="Best Imbalance"
              value={formatNumber(qiskitResult.bestPartitionImbalance)}
              subtitle="Best pivot balance score"
            />
          </div>

          <div className="quantum-visual-card circuit-panel">
            <h3>Qiskit Circuit Rail View</h3>
            <p>
              The circuit visualizes AAQ candidate sampling as superposition,
              amplitude rotation, entanglement-inspired neighbor correlation,
              and final measurement.
            </p>

            <QuantumCircuitVisualizer result={qiskitResult} />
          </div>

          <div className="quantum-two-column">
            <div className="quantum-visual-card">
              <h3>Qiskit Rotation Strength</h3>
              <p>Stronger rotation means stronger pivot selection probability.</p>

              <RotationBars candidates={qiskitResult.candidates || []} />
            </div>

            <div className="quantum-visual-card">
              <h3>Measured Pivot State Map</h3>
              <p>
                The selected candidate represents the pivot chosen by the
                quantum-inspired probability model.
              </p>

              <CandidateStateMap candidates={qiskitResult.candidates || []} />
            </div>
          </div>

          <details className="raw-code-toggle">
            <summary>View Qiskit Text Circuit</summary>
            <pre className="code-block">{qiskitResult.qiskitCircuitText}</pre>
          </details>

          <details className="raw-code-toggle">
            <summary>View Raw OpenQASM Code</summary>
            <pre className="code-block">{qiskitResult.openQasm}</pre>
          </details>

          <CandidateTable candidates={qiskitResult.candidates} mode="qiskit" />
        </div>
      )}
    </section>
  );
}

function SimulationFlow({
  amplitudeDone,
  interferenceDone,
  qasmDone,
  qiskitDone,
}) {
  const steps = [
    { label: "Dataset Profile", done: true },
    { label: "Amplitude Sampling", done: amplitudeDone },
    { label: "Pivot Selection", done: amplitudeDone },
    { label: "Interference Update", done: interferenceDone },
    { label: "OpenQASM", done: qasmDone },
    { label: "Qiskit Circuit", done: qiskitDone },
  ];

  return (
    <div className="quantum-flow">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={`quantum-flow-step ${step.done ? "done" : ""}`}
        >
          <div className="flow-node">{index + 1}</div>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function QuantumMetricCard({ title, value, subtitle }) {
  return (
    <div className="quantum-metric-card">
      <span>{title}</span>
      <strong>{value ?? "N/A"}</strong>
      <p>{subtitle}</p>
    </div>
  );
}

function ProbabilityBars({ candidates = [] }) {
  if (!candidates.length) {
    return <EmptySimulation message="Run Amplitude to view probability field." />;
  }

  const maxProbability = Math.max(
    ...candidates.map((candidate) => Number(candidate.selectionProbability) || 0),
    0.001
  );

  return (
    <div className="quantum-bars">
      {candidates.map((candidate) => {
        const value = Number(candidate.selectionProbability) || 0;
        const height = Math.max(8, (value / maxProbability) * 160);

        return (
          <div className="quantum-bar-item" key={candidate.candidateIndex}>
            <div className="bar-shell">
              <div
                className={`quantum-bar ${candidate.selected ? "selected" : ""}`}
                style={{ height: `${height}px` }}
              />
            </div>
            <small>{formatNumber(candidate.candidateValue)}</small>
            <span>{formatNumber(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

function WeightBars({ candidates = [] }) {
  if (!candidates.length) {
    return <EmptySimulation message="Run Amplitude to view amplitude weights." />;
  }

  const maxWeight = Math.max(
    ...candidates.map((candidate) => Number(candidate.amplitudeWeight) || 0),
    0.001
  );

  return (
    <div className="horizontal-simulation-bars">
      {candidates.map((candidate) => {
        const value = Number(candidate.amplitudeWeight) || 0;
        const width = Math.max(4, (value / maxWeight) * 100);

        return (
          <div
            className={`horizontal-bar-row ${
              candidate.selected ? "selected" : ""
            }`}
            key={candidate.candidateIndex}
          >
            <span>{formatNumber(candidate.candidateValue)}</span>
            <div>
              <i style={{ width: `${width}%` }} />
            </div>
            <strong>{formatNumber(value)}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ImbalanceCurve({ candidates = [] }) {
  if (!candidates.length) {
    return <EmptySimulation message="Run Amplitude to view imbalance curve." />;
  }

  const width = 700;
  const height = 220;
  const padding = 35;

  const points = candidates.map((candidate, index) => {
    const x =
      padding +
      (index / Math.max(candidates.length - 1, 1)) * (width - padding * 2);

    const imbalance = Number(candidate.partitionImbalance) || 0;
    const y = height - padding - imbalance * (height - padding * 2);

    return {
      x,
      y,
      selected: candidate.selected,
    };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg className="quantum-svg" viewBox={`0 0 ${width} ${height}`}>
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
      />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} />

      <polyline points={polyline} fill="none" />

      {points.map((point, index) => (
        <g key={`point-${index}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r={point.selected ? 8 : 5}
            className={point.selected ? "selected-point" : ""}
          />
          {point.selected && (
            <text x={point.x + 8} y={point.y - 8}>
              Selected
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function InterferenceBars({ candidates = [] }) {
  if (!candidates.length) {
    return (
      <EmptySimulation message="Run Interference to view reinforcement and suppression." />
    );
  }

  const maxWeight = Math.max(
    ...candidates.map((candidate) =>
      Math.max(
        Number(candidate.beforeAmplitudeWeight) || 0,
        Number(candidate.afterAmplitudeWeight) || 0
      )
    ),
    0.001
  );

  return (
    <div className="interference-grid">
      {candidates.map((candidate) => {
        const before = Number(candidate.beforeAmplitudeWeight) || 0;
        const after = Number(candidate.afterAmplitudeWeight) || 0;

        return (
          <div
            className={`interference-card ${
              candidate.selected ? "selected" : ""
            }`}
            key={candidate.candidateIndex}
          >
            <div className="interference-title">
              <strong>{formatNumber(candidate.candidateValue)}</strong>
              <span>{candidate.interferenceType || "NORMAL"}</span>
            </div>

            <div className="interference-line">
              <span>Before</span>
              <div>
                <i style={{ width: `${(before / maxWeight) * 100}%` }} />
              </div>
              <small>{formatNumber(before)}</small>
            </div>

            <div className="interference-line after">
              <span>After</span>
              <div>
                <i style={{ width: `${(after / maxWeight) * 100}%` }} />
              </div>
              <small>{formatNumber(after)}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuantumCircuitVisualizer({ result }) {
  const candidates = result?.candidates || [];
  const qubitCount = Number(result?.qubitCount) || candidates.length || 0;

  if (!qubitCount) {
    return (
      <EmptySimulation message="Generate OpenQASM or Qiskit to view circuit rails." />
    );
  }

  const rails = Array.from({ length: qubitCount }).map((_, index) => {
    const candidate = candidates[index] || {};

    return {
      index,
      candidate,
    };
  });

  return (
    <div className="circuit-rail-box">
      {rails.map(({ index, candidate }) => (
        <div
          className={`circuit-rail ${candidate.selected ? "selected" : ""}`}
          key={`rail-${index}`}
        >
          <div className="qubit-name">q[{index}]</div>

          <div className="circuit-wire">
            <span className="quantum-gate gate-h">H</span>
            <span className="wire-segment" />

            <span className="quantum-gate gate-ry">
              RY
              <small>{formatNumber(candidate.rotationAngle)}</small>
            </span>

            <span className="wire-segment" />

            {index < qubitCount - 1 ? (
              <span className="quantum-gate gate-cx">CX</span>
            ) : (
              <span className="quantum-gate gate-id">I</span>
            )}

            <span className="wire-segment" />

            <span className="quantum-gate gate-measure">M</span>
          </div>

          <div className="pivot-state-label">
            <span>pivot</span>
            <strong>{formatNumber(candidate.candidateValue)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

function RotationBars({ candidates = [] }) {
  if (!candidates.length) {
    return <EmptySimulation message="No rotation values available." />;
  }

  const maxRotation = Math.max(
    ...candidates.map((candidate) => Number(candidate.rotationAngle) || 0),
    0.001
  );

  return (
    <div className="rotation-bar-list">
      {candidates.map((candidate) => {
        const rotation = Number(candidate.rotationAngle) || 0;
        const width = Math.max(5, (rotation / maxRotation) * 100);

        return (
          <div
            className={`rotation-row ${candidate.selected ? "selected" : ""}`}
            key={`rotation-${candidate.candidateIndex}`}
          >
            <span>q{candidate.candidateIndex}</span>

            <div className="rotation-track">
              <i style={{ width: `${width}%` }} />
            </div>

            <strong>{formatNumber(rotation)}</strong>
          </div>
        );
      })}
    </div>
  );
}

function CandidateStateMap({ candidates = [] }) {
  if (!candidates.length) {
    return <EmptySimulation message="No candidate states available." />;
  }

  const maxProbability = Math.max(
    ...candidates.map((candidate) => Number(candidate.selectionProbability) || 0),
    0.001
  );

  return (
    <div className="candidate-state-map">
      {candidates.map((candidate) => {
        const probability = Number(candidate.selectionProbability) || 0;
        const size = Math.max(42, 42 + (probability / maxProbability) * 42);

        return (
          <div
            className={`candidate-state-node ${
              candidate.selected ? "selected" : ""
            }`}
            key={`state-${candidate.candidateIndex}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <strong>{formatNumber(candidate.candidateValue)}</strong>
            <span>{formatNumber(probability)}</span>
          </div>
        );
      })}
    </div>
  );
}

function EmptySimulation({ message }) {
  return <div className="empty-simulation">{message}</div>;
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
          {candidates.map((candidate, index) => (
            <tr
              key={`${mode}-${candidate.candidateIndex ?? index}`}
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

              {mode === "interference" && <td>{candidate.interferenceType}</td>}

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

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined);
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