# AAQ Frontend

## Enterprise Quantum-Inspired Adaptive Sorting Optimization Platform

## Proposed Algorithm

Adaptive Amplitude QuickSort - AAQ

---

## 1. Frontend Overview

This is the React frontend for the **Enterprise Quantum-Inspired Adaptive Sorting Optimization Platform**.

The frontend provides the user interface for:

```text
Dashboard visualization
Dataset upload and management
Dataset details and preview
Python dataset analysis
Quantum-inspired AAQ analysis
Benchmark result comparison
Recommendation and report generation
System status monitoring
```

The main purpose of this frontend is to visually demonstrate the proposed **Adaptive Amplitude QuickSort** algorithm and its comparison with traditional sorting baselines.

---

## 2. Technology Stack

```text
React
Vite
Axios
React Router
CSS
```

---

## 3. Main Frontend Pages

The frontend contains the following main pages:

```text
Dashboard
Dataset Management
Dataset Details
Quantum Analyzer
Benchmark Results
Recommendation and Reports
System Status
```

---

## 4. Routes

Main frontend routes:

```text
/dashboard
/datasets
/datasets/:id
/datasets/:id/quantum
/datasets/:id/benchmarks
/datasets/:id/reports
/benchmarks
/reports
/system
```

---

## 5. Page Explanation

## 5.1 Dashboard Page

The dashboard shows the overall project summary.

It displays:

```text
Total datasets
Total sorting jobs
Completed jobs
Pending jobs
Benchmark results
Recommendations
Quantum metrics
Python simulation status
Best AAQ execution time
Average throughput
```

This page proves that the backend, database, benchmark module, dashboard module, and Python service status are connected.

---

## 5.2 Dataset Management Page

The dataset management page allows the user to:

```text
Upload dataset
Select sorting column
View uploaded datasets
Open dataset details
Analyze dataset
Open quantum analyzer
Run benchmark
Generate report
Delete dataset
```

This page is used to begin the complete AAQ workflow.

---

## 5.3 Dataset Details Page

The dataset details page shows:

```text
Dataset name
File type
File size
Row count
Column count
Selected sort column
Detected pattern
Null percentage
Duplicate percentage
Skewness
Sortedness score
Dataset preview records
```

This page confirms that the uploaded dataset metadata and preview records are displayed correctly.

---

## 5.4 Quantum Analyzer Page

The Quantum Analyzer page is the most important frontend screen.

It shows the quantum-inspired behavior of AAQ, including:

```text
Amplitude probability distribution
Selected pivot candidate
Partition imbalance
Amplitude weights
Interference simulation
OpenQASM output
Qiskit circuit output
```

This page visually explains how AAQ performs adaptive pivot selection using quantum-inspired ideas.

---

## 5.5 Benchmark Results Page

The benchmark page compares AAQ with baseline algorithms:

```text
Adaptive Amplitude QuickSort
Java Built-in Sort
QuickSort
MergeSort
HeapSort
Parallel Sort
```

Metrics displayed:

```text
Execution time
Throughput
Memory usage
Partition imbalance
Improvement percentage
Success status
```

This page is used to validate the proposed AAQ algorithm against traditional sorting baselines.

---

## 5.6 Recommendation and Reports Page

This page shows:

```text
Detected dataset pattern
Recommended algorithm
Confidence score
Reason for recommendation
Report generation option
Report summary
```

The recommendation is based on dataset profile, benchmark result, and AAQ metrics.

---

## 5.7 System Status Page

The system status page checks:

```text
Backend running
Database connected
Python service connected
System ready
```

This page is used before demo to confirm that all services are working.

---

## 6. API Connection

The frontend communicates with the Java Spring Boot backend using Axios.

Backend base URL:

```text
http://localhost:8080/api
```

Python service is not called directly by the frontend in the main workflow.

The Java backend communicates with Python service internally.

Python service base URL:

```text
http://localhost:8000
```

---

## 7. How to Run Frontend

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 8. Required Services Before Running Frontend

Before opening the frontend, start the backend and Python service.

## Backend

```bash
cd "D:\AJVRPS TECH\researchpaper\papers\processing papers\Quantum-Inspired Sorting Algorithmsog\paper3"
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

## Python Service

```bash
cd "D:\AJVRPS TECH\researchpaper\papers\processing papers\Quantum-Inspired Sorting Algorithmsog\python-service"
uvicorn main:app --reload --port 8000
```

Python URL:

```text
http://localhost:8000
```

## Frontend

```bash
cd "D:\AJVRPS TECH\researchpaper\papers\processing papers\Quantum-Inspired Sorting Algorithmsog\aaq-frontend"
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 9. Recommended Demo Flow

```text
1. Start backend
2. Start Python service
3. Start frontend
4. Open dashboard
5. Open dataset management
6. Upload or select dataset
7. Open dataset details
8. Preview dataset
9. Analyze dataset
10. Open Quantum Analyzer
11. Run amplitude simulation
12. Run interference simulation
13. Generate OpenQASM
14. Generate Qiskit circuit
15. Open benchmark results
16. Compare AAQ with baselines
17. Open recommendation and reports
18. Generate report
19. Open system status
```

---

## 10. Important Demo Notes

## Login

The backend has authentication and users table support.

However, the current frontend demo does not enforce strict login/register flow.

So some fields may show:

```text
createdBy = N/A
uploadedBy = N/A
```

This is documented as a known limitation.

---

## N/A Values

If the UI shows:

```text
N/A
```

it means the value is null, optional, or not available for that record.

This is not a frontend error.

---

## Java Built-in Sort Faster Than AAQ

Java Built-in Sort may be faster in some benchmark results because it is highly optimized inside the JVM.

AAQ is the proposed research algorithm and is mainly designed for difficult datasets such as:

```text
Skewed datasets
Repeated-value datasets
Adversarial datasets
Poor-pivot datasets
Structured real-world datasets
```

---

## Quantum-Inspired Meaning

This frontend shows quantum-inspired simulation and visualization.

It does not mean the project runs on real quantum hardware.

The quantum-inspired concepts shown are:

```text
Amplitude probability
Pivot candidate weighting
Constructive reinforcement
Destructive suppression
Neighbor correlation
OpenQASM representation
Qiskit circuit explanation
```

---

## 11. Final Frontend Deliverables

```text
Dashboard page
Dataset management page
Dataset details page
Dataset preview
Dataset analysis result display
Quantum Analyzer page
Amplitude simulation visualization
Interference simulation visualization
OpenQASM display
Qiskit circuit display
Benchmark results page
Recommendation and reports page
System status page
```

---

## 12. Project Conclusion

This frontend successfully provides a complete interface for the **Enterprise Quantum-Inspired Adaptive Sorting Optimization Platform**.

It helps demonstrate the proposed **Adaptive Amplitude QuickSort** algorithm through dataset upload, profiling, quantum-inspired analysis, benchmark comparison, recommendation, reports, and dashboard visualization.