# AAQ Frontend

> React/Vite dashboard for the Adaptive Amplitude QuickSort research, live-execution, benchmarking, and Paper V0.4 reproducibility platform.

## Project purpose

This frontend presents the complete AAQ research workflow: dataset management, profiling results, live AAQ execution, benchmark comparison, quantum-inspired metrics, recommendations, reports, and measured paper-result reproduction.

## Current integrated project status

The integrated frontend now includes:

- dataset upload and management views
- dataset metadata and preview pages
- Python profiling result display
- Quantum Analysis navigation and AAQ metric presentation
- asynchronous sorting-job execution
- live AAQ progress monitoring
- live partition-imbalance graph
- amplitude-state/convergence graph
- throughput graph
- memory graph
- comparison, swap, partition and recursion metrics
- completed-run metrics retained on screen for inspection
- benchmark-result pages
- recommendation/report navigation
- Paper V0.4 reference mode
- Live JMH Reproduction mode
- measured one-million-record comparison table
- paper figure display generated from the JMH analysis pipeline

## Paper benchmark / reproducibility

The research-result screen is based on the controlled JMH matrix:

```text
6 algorithms
15 distributions
5 input sizes
30 independent seeds
= 13,500 measured benchmark rows
```

The frontend deliberately separates two workflows:

```text
Normal Dataset workflow
→ upload / analyze / run AAQ / inspect live graphs

Paper V0.4 workflow
→ analyze paper-jmh.csv / reproduce measured paper tables and figures
```

This prevents normal application elapsed time from being confused with controlled JMH benchmark results.

## Data used / source

The project uses controlled synthetic workloads together with public/open-source data for realistic testing.

**Published dataset source:**

- Kaggle — [Quantum Amplititude Sort Testing Data](https://www.kaggle.com/datasets/narasimhandasarathy/quantum-amplititude-sort-testing-data/data)

Synthetic workloads cover random, skewed/Gaussian, Zipf-like, nearly sorted, reverse sorted, repeated-value, bounded-integer, streaming, high-entropy and other structured sorting patterns. Open Library / Internet Archive catalogue records are also used as real-world source material where applicable.

## Technology stack

| Area | Tools |
|---|---|
| Frontend | React, Vite |
| HTTP client | Axios |
| Routing | React Router |
| Charts | Recharts |
| Styling | CSS |
| Backend integration | Java AAQ backend + Python analysis service |

## Local setup

```cmd
git clone https://github.com/Narasimhan-rgb/AAQ_frontend.git
cd AAQ_frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

For the complete integrated workflow, also run:

```text
Java backend  : http://localhost:8080
Python service: http://127.0.0.1:8000
Frontend      : http://localhost:5173
```

## Product / research flow

```text
User uploads dataset
        ↓
Dataset profile and pattern analysis
        ↓
Run AAQ sorting job
        ↓
Live progress + partition/amplitude graphs
        ↓
Benchmark and recommendation views
        ↓
Reports

Paper V0.4
        ↓
Reference artifacts OR live JMH reproduction
        ↓
Measured tables and figures from paper-jmh.csv
```

## Related repositories

- `AAQalgorithim` — Java backend, AAQ algorithm and JMH benchmark engine
- `python_services-` — dataset-analysis, profiling and paper-reproduction service

## Progress documentation

See [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md) for the latest frontend and cross-repository integration status.
