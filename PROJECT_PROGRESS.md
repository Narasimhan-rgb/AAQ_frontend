# AAQ Frontend Progress

_Last updated: 2026-08-16_

## Completed integrated frontend work

- Dataset list/detail workflow is integrated with the Java backend.
- Dataset analysis results from the Python service are displayed in the UI.
- Sorting jobs are started asynchronously and can be monitored while AAQ runs.
- A live AAQ execution panel was added.
- The live panel shows progress, processed records and final completion status.
- Partition imbalance, amplitude evolution, throughput and memory are visualised with Recharts.
- Comparison, swap, partition, recursion, fallback and quantum-inspired activity metrics are displayed.
- Completed graph results remain visible after the sorting job finishes.
- Benchmark, Quantum Analysis, recommendation and report navigation are integrated.
- A Paper V0.4 page separates exact/reference artifacts from live JMH reproduction.
- Live JMH mode displays structural validation, one-million-record comparisons and measured figures generated from `paper-jmh.csv`.

## Research-result separation

The UI maintains two different evaluation paths:

### Dataset / product demonstration

```text
Upload dataset
→ Analyze dataset
→ Run AAQ
→ View live AAQ metrics and graphs
→ Open benchmarks/reports
```

### Paper reproduction

```text
Paper V0.4
→ Live JMH Reproduction
→ Analyze paper-jmh.csv
→ Display measured tables and figures
```

This separation is important because application-level file loading and service overhead should not be treated as controlled JMH algorithm timing.

## Data used / source

Published dataset source:

- Kaggle: https://www.kaggle.com/datasets/narasimhandasarathy/quantum-amplititude-sort-testing-data/data

The project also uses deterministic synthetic distributions for controlled benchmark experiments and Open Library / Internet Archive catalogue data where applicable for real-world evaluation.

## Integrated services

```text
Frontend        http://localhost:5173
Java backend    http://localhost:8080
Python service  http://127.0.0.1:8000
```

## Related repositories

- `Narasimhan-rgb/AAQalgorithim`
- `Narasimhan-rgb/python_services-`
- `Narasimhan-rgb/AAQ_frontend`
