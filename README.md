# AAQ Frontend

> React dashboard for the Adaptive Amplitude QuickSort research and benchmarking platform.

## Project purpose

This frontend visualises the AAQ research workflow: dataset uploads, dataset profiling, benchmark results, algorithm comparison, recommendations, and system status.

## Main features

- Research dashboard for AAQ metrics
- Dataset upload and management UI
- Dataset preview and profile views
- Benchmark-result comparison screens
- Recommendation and report pages
- System/service status screens

## Technology stack

| Area | Tools |
|---|---|
| Frontend | React, Vite |
| HTTP client | Axios |
| Routing | React Router |
| Styling | CSS |
| Backend integration | AAQ Java backend + Python analysis service |

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

## Product flow

```text
User dashboard
→ dataset upload
→ backend storage
→ Python dataset analysis
→ AAQ benchmark execution
→ results and recommendation screens
```

## Related repositories

- `AAQalgorithim` — main AAQ backend/research repository
- `python_services-` — dataset-analysis and profiling service

## MS portfolio value

This project shows full-stack presentation of an algorithmic research system. It supports my profile in algorithms, research engineering, and AI/data systems.

## Roadmap

- Rename repository to `aaq-frontend`
- Add screenshots or GIF demo
- Add API environment configuration guide
- Add deployment link after frontend is hosted
- Add sample data walkthrough
