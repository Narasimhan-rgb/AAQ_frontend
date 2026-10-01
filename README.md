# AAQ Frontend

> **AAQ component repository.** The canonical project entry point is [AAQalgorithim](https://github.com/Narasimhan-rgb/AAQalgorithim), which groups this React frontend with the Java backend and Python analysis service.

React/Vite dashboard for the Adaptive Amplitude QuickSort research, live-execution, benchmarking, and reproducibility workflow.

## What this component contains

- dataset upload and management views
- dataset metadata and preview pages
- profiling result display
- AAQ execution and live progress monitoring
- partition-imbalance, amplitude/convergence, throughput, and memory charts
- benchmark comparison pages
- recommendation and report views
- research-result / reproduction views

## Technology

- React
- Vite
- Axios
- React Router
- Recharts
- CSS

## Local setup

For the complete project, prefer:

```bash
git clone --recurse-submodules https://github.com/Narasimhan-rgb/AAQalgorithim.git
cd AAQalgorithim/frontend
npm install
npm run dev
```

Or clone this component directly:

```bash
git clone https://github.com/Narasimhan-rgb/AAQ_frontend.git
cd AAQ_frontend
npm install
npm run dev
```

Default development services:

```text
Java backend   http://localhost:8080
Python service http://127.0.0.1:8000
Frontend       http://localhost:5173
```

## Environment

The frontend reads deployment-specific values from Vite environment variables such as `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`. Keep local `.env` files out of Git.

## Scope note

AAQ is a **classical quantum-inspired sorting research project**. Dashboard visualisations do not imply execution on quantum hardware or a universal quantum speedup.
